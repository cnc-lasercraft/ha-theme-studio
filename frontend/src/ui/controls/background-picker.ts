// <ts-background-picker> — Spezial-Control für CSS-`background`-Shorthand.
//
// HA-Themes nutzen für Variablen wie `--background-image` oft Werte wie
// `center / cover no-repeat fixed url('https://.../wallpaper.jpg')`.
// Im Raw-Input wäre das eine lange Wurst — diese Component zerlegt sie
// in URL + Modifier-Teil (alles vor/um die url()-Funktion herum) und
// bietet eine Thumbnail-Preview + Quick-Presets für die häufigsten
// Layouts (cover, contain, tile, none).
//
// Contract: `value: string`, event `value-changed` mit
// `CustomEvent<{value: string}>`. Bei `value === "none"` werden URL und
// Modifier leer dargestellt — Preview zeigt einen Placeholder.

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { t } from "../../core/i18n";
import { LocaleController } from "../../core/locale-controller";
import type { HomeAssistant } from "../../types";

interface Parsed {
  url: string;
  modifiers: string;
}

interface WwwImage {
  url: string;
  name: string;
  dir: string;
  size: number;
}

interface ListWwwImagesResult {
  images: WwwImage[];
  truncated: boolean;
  root_exists: boolean;
}

const PRESETS: Array<{
  label: string;
  modifiers: string;
  titleKey: string;
}> = [
  {
    label: "Cover",
    modifiers: "center / cover no-repeat fixed",
    titleKey: "bg.preset_cover_tooltip",
  },
  {
    label: "Contain",
    modifiers: "center / contain no-repeat fixed",
    titleKey: "bg.preset_contain_tooltip",
  },
  {
    label: "Tile",
    modifiers: "top left repeat fixed",
    titleKey: "bg.preset_tile_tooltip",
  },
];

function parse(value: string): Parsed {
  const v = value.trim();
  if (!v || v === "none") return { url: "", modifiers: "" };
  const m = /url\(\s*['"]?([^'")]+)['"]?\s*\)/.exec(v);
  if (!m) return { url: "", modifiers: v };
  const url = m[1].trim();
  const modifiers = (v.slice(0, m.index) + v.slice(m.index + m[0].length))
    .trim()
    .replace(/\s+/g, " ");
  return { url, modifiers };
}

function compose(modifiers: string, url: string): string {
  const m = modifiers.trim();
  const u = url.trim();
  if (!m && !u) return "none";
  if (!u) return m;
  const urlPart = `url('${u}')`;
  return m ? `${m} ${urlPart}` : urlPart;
}

/**
 * Normalisiert User-Eingaben für die URL:
 * - Filesystem-Pfade `/homeassistant/www/foo.jpg` → `/local/foo.jpg`
 *   (HA serviert /homeassistant/www/ unter dem URL-Prefix /local/).
 * - `/config/www/foo.jpg` → `/local/foo.jpg` (alternativer Pfad bei
 *   manchen HA-Installationen).
 */
function normalizeUrl(url: string): string {
  const u = url.trim();
  if (!u) return "";
  const fsMatch = /^\/(homeassistant|config)\/www\/(.+)$/.exec(u);
  if (fsMatch) return `/local/${fsMatch[2]}`;
  return u;
}

/**
 * Wert ist eine CSS-Referenz auf eine andere Variable (`var(--x)`), z.B.
 * `lovelace-background: var(--background-image)`. Dann ist diese Variable
 * KEIN Bild-Halter — das Bild gehört an die referenzierte Ziel-Variable.
 * Der Picker darf hier keine URL anhängen (das ergäbe `var(...) url(...)` =
 * kaputtes Shorthand), sondern zeigt eine Warnung + Raw-Editor.
 */
function hasVarRef(value: string): boolean {
  return /\bvar\(/.test(value);
}

@customElement("ts-background-picker")
export class TsBackgroundPicker extends LitElement {
  @property({ type: String }) value = "";
  // Optional: nur mit hass kann der www/-Bild-Browser geladen werden.
  @property({ attribute: false }) hass?: HomeAssistant;
  _locale = new LocaleController(this);

  @state() private _browsing = false;
  @state() private _imagesLoaded = false;
  @state() private _loadingImages = false;
  @state() private _images: WwwImage[] = [];
  @state() private _imagesTruncated = false;
  @state() private _imagesError: string | null = null;

  static override styles = css`
    :host {
      display: block;
      width: 100%;
    }
    .preview {
      width: 100%;
      height: 120px;
      border-radius: 6px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      background-color: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      margin-bottom: 8px;
      position: relative;
      overflow: hidden;
    }
    .preview-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      font-size: 0.85rem;
      height: 100%;
    }
    .field {
      display: grid;
      grid-template-columns: 80px 1fr;
      gap: 8px;
      align-items: center;
      margin-bottom: 6px;
    }
    .field label {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
    }
    input[type="text"],
    input[type="url"] {
      width: 100%;
      box-sizing: border-box;
      padding: 6px 10px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: 0.85rem;
    }
    input:focus {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: -1px;
      border-color: transparent;
    }
    .presets {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 8px;
    }
    .preset-btn {
      padding: 4px 10px;
      background: none;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      cursor: pointer;
      color: inherit;
      font: inherit;
      font-size: 0.8rem;
    }
    .preset-btn:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .preset-btn.danger {
      color: var(--error-color, #db4437);
      border-color: var(--error-color, #db4437);
    }
    .url-row {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .url-row input {
      flex: 1;
      min-width: 0;
    }
    .browse-btn {
      flex-shrink: 0;
      white-space: nowrap;
      padding: 6px 10px;
      background: none;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      cursor: pointer;
      color: inherit;
      font: inherit;
      font-size: 0.8rem;
    }
    .browse-btn:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .browser {
      margin: 8px 0;
      padding: 8px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 6px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.03));
    }
    .browser-info {
      color: var(--secondary-text-color);
      font-size: 0.8rem;
      margin-bottom: 8px;
    }
    .browser-error {
      color: var(--error-color, #db4437);
      font-size: 0.85rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
      gap: 8px;
      max-height: 280px;
      overflow-y: auto;
    }
    .thumb {
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      padding: 0;
      background: var(--card-background-color);
      cursor: pointer;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .thumb.selected {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: -1px;
    }
    .thumb img {
      width: 100%;
      height: 64px;
      object-fit: cover;
      display: block;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .thumb .caption {
      font-size: 0.7rem;
      padding: 3px 4px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .var-notice {
      padding: 8px 12px;
      margin-bottom: 8px;
      border-radius: 4px;
      background: rgba(255, 152, 0, 0.1);
      border-left: 4px solid var(--warning-color, #ff9800);
      color: var(--primary-text-color);
      font-size: 0.85rem;
    }
    .raw-ref {
      width: 100%;
      box-sizing: border-box;
      padding: 6px 10px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: 0.85rem;
    }
  `;

  override render() {
    // Referenz-Variable (var(--x)): kein Bild-Halter → Warnung + Raw-Editor,
    // damit der Picker keine kaputte `var(...) url(...)`-Kombi erzeugt.
    if (hasVarRef(this.value)) {
      return this._renderVarRef();
    }
    const parsed = parse(this.value);
    const hasUrl = !!parsed.url;
    const previewStyle = hasUrl
      ? `background-image: url('${parsed.url.replace(/'/g, "\\'")}');`
      : "";
    return html`
      <div class="preview" style=${previewStyle}>
        ${hasUrl
          ? ""
          : html`<div class="preview-empty">
              ${t("bg.no_image", undefined, {
                value: this.value || "none",
              })}
            </div>`}
      </div>
      <div class="field">
        <label for="url">URL</label>
        <div class="url-row">
          <input
            id="url"
            type="url"
            .value=${parsed.url}
            @change=${this._onUrlChange}
            placeholder=${t("bg.url_placeholder")}
            spellcheck="false"
            autocomplete="off"
          />
          ${this.hass
            ? html`<button
                class="browse-btn"
                title=${t("bg.browse_tooltip")}
                @click=${this._toggleBrowse}
              >
                🖼 ${t("bg.browse")}
              </button>`
            : ""}
        </div>
      </div>
      ${this._browsing ? this._renderBrowser(parsed.url) : ""}
      <div class="field">
        <label for="mods">${t("bg.modifier")}</label>
        <input
          id="mods"
          type="text"
          .value=${parsed.modifiers}
          @change=${this._onModsChange}
          placeholder=${t("bg.modifier_placeholder")}
          spellcheck="false"
          autocomplete="off"
        />
      </div>
      <div class="presets">
        ${PRESETS.map(
          (p) => html`
            <button
              class="preset-btn"
              title=${t(p.titleKey)}
              @click=${() => this._applyPreset(p.modifiers)}
            >
              ${p.label}
            </button>
          `,
        )}
        <button
          class="preset-btn danger"
          title=${t("bg.clear_tooltip")}
          @click=${this._clear}
        >
          ${t("bg.clear")}
        </button>
      </div>
    `;
  }

  private _onUrlChange(e: Event) {
    const raw = (e.target as HTMLInputElement).value;
    const url = normalizeUrl(raw);
    const { modifiers } = parse(this.value);
    this._emit(compose(modifiers, url));
  }

  private _onModsChange(e: Event) {
    const modifiers = (e.target as HTMLInputElement).value;
    const { url } = parse(this.value);
    this._emit(compose(modifiers, url));
  }

  private _applyPreset(modifiers: string) {
    const { url } = parse(this.value);
    this._emit(compose(modifiers, url));
  }

  private _clear() {
    this._emit("none");
  }

  private _renderBrowser(currentUrl: string) {
    return html`
      <div class="browser">
        ${this._loadingImages
          ? html`<div class="browser-info">${t("bg.browse_loading")}</div>`
          : this._imagesError
            ? html`<div class="browser-error">
                ${t("common.error_prefix")}: ${this._imagesError}
              </div>`
            : this._images.length === 0
              ? html`<div class="browser-info">${t("bg.browse_empty")}</div>`
              : html`
                  <div class="browser-info">
                    ${t("bg.browse_count", undefined, {
                      n: this._images.length,
                    })}${this._imagesTruncated
                      ? ` · ${t("bg.browse_truncated")}`
                      : ""}
                  </div>
                  <div class="grid">
                    ${this._images.map(
                      (img) => html`
                        <button
                          class="thumb ${img.url === currentUrl
                            ? "selected"
                            : ""}"
                          title=${img.url}
                          @click=${() => this._pickImage(img.url)}
                        >
                          <img src=${img.url} alt=${img.name} loading="lazy" />
                          <span class="caption"
                            >${img.dir ? `${img.dir}/` : ""}${img.name}</span
                          >
                        </button>
                      `,
                    )}
                  </div>
                `}
      </div>
    `;
  }

  private _toggleBrowse() {
    this._browsing = !this._browsing;
    if (this._browsing && !this._imagesLoaded) {
      this._loadImages();
    }
  }

  private async _loadImages() {
    if (!this.hass) return;
    this._loadingImages = true;
    this._imagesError = null;
    try {
      const result =
        await this.hass.connection.sendMessagePromise<ListWwwImagesResult>({
          type: "theme_studio/list_www_images",
        });
      this._images = result.images;
      this._imagesTruncated = result.truncated;
      this._imagesLoaded = true;
    } catch (err) {
      this._imagesError = err instanceof Error ? err.message : String(err);
    } finally {
      this._loadingImages = false;
    }
  }

  private _pickImage(url: string) {
    const { modifiers } = parse(this.value);
    // Bilder aus www/ haben Default-Modifier "cover", wenn noch keiner gesetzt
    // ist — sonst sieht der HG ohne Layout oft kaputt aus.
    const mods = modifiers || PRESETS[0].modifiers;
    this._emit(compose(mods, url));
    this._browsing = false;
  }

  private _renderVarRef() {
    return html`
      <div class="var-notice">⚠ ${t("bg.var_ref_notice")}</div>
      <input
        class="raw-ref"
        type="text"
        .value=${this.value}
        @change=${this._onRawChange}
        spellcheck="false"
        autocomplete="off"
      />
    `;
  }

  private _onRawChange(e: Event) {
    this._emit((e.target as HTMLInputElement).value);
  }

  private _emit(value: string) {
    this.value = value;
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ts-background-picker": TsBackgroundPicker;
  }
}
