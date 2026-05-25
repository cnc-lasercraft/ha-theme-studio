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
import { customElement, property } from "lit/decorators.js";

interface Parsed {
  url: string;
  modifiers: string;
}

const PRESETS: Array<{ label: string; modifiers: string; title: string }> = [
  {
    label: "Cover",
    modifiers: "center / cover no-repeat fixed",
    title: "Vollbild, zentriert, fixiert (Apple-/visionOS-Style)",
  },
  {
    label: "Contain",
    modifiers: "center / contain no-repeat fixed",
    title: "Komplett sichtbar, zentriert",
  },
  {
    label: "Tile",
    modifiers: "top left repeat fixed",
    title: "Bild wiederholen (Pattern)",
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

@customElement("ts-background-picker")
export class TsBackgroundPicker extends LitElement {
  @property({ type: String }) value = "";

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
  `;

  override render() {
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
              (kein Bild — '${this.value || "none"}')
            </div>`}
      </div>
      <div class="field">
        <label for="url">URL</label>
        <input
          id="url"
          type="url"
          .value=${parsed.url}
          @change=${this._onUrlChange}
          placeholder="https://… oder /local/wallpaper.jpg (= /homeassistant/www/wallpaper.jpg)"
          spellcheck="false"
          autocomplete="off"
        />
      </div>
      <div class="field">
        <label for="mods">Modifier</label>
        <input
          id="mods"
          type="text"
          .value=${parsed.modifiers}
          @change=${this._onModsChange}
          placeholder="z.B. center / cover no-repeat fixed"
          spellcheck="false"
          autocomplete="off"
        />
      </div>
      <div class="presets">
        ${PRESETS.map(
          (p) => html`
            <button
              class="preset-btn"
              title=${p.title}
              @click=${() => this._applyPreset(p.modifiers)}
            >
              ${p.label}
            </button>
          `,
        )}
        <button
          class="preset-btn danger"
          title="Auf 'none' setzen — kein Hintergrund-Bild"
          @click=${this._clear}
        >
          Clear
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
