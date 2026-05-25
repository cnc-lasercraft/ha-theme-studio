import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../types";

interface ThemeEntry {
  file: string;
  theme_name: string;
  variable_count: number;
}

interface ThemeError {
  file: string;
  error: string;
}

interface ListThemesResult {
  themes: ThemeEntry[];
  errors: ThemeError[];
}

@customElement("theme-picker")
export class ThemePicker extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;

  @state() private _loading = true;
  @state() private _themes: ThemeEntry[] = [];
  @state() private _errors: ThemeError[] = [];
  @state() private _loadError: string | null = null;

  static override styles = css`
    :host {
      display: block;
      max-width: 720px;
      margin: 0 auto;
    }
    h2 {
      font-weight: 400;
      margin: 0 0 24px;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      background: var(--card-background-color);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.08));
      cursor: pointer;
      text-align: left;
      width: 100%;
      border: none;
      color: inherit;
      font: inherit;
      transition: transform 0.1s ease, box-shadow 0.1s ease;
    }
    .item:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
    }
    .item:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .info {
      flex: 1;
      min-width: 0;
    }
    .name {
      font-weight: 500;
      font-size: 1.05rem;
    }
    .meta {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .arrow {
      color: var(--secondary-text-color);
      font-size: 1.5rem;
      flex-shrink: 0;
    }
    .empty,
    .error {
      padding: 24px;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .error {
      color: var(--error-color);
    }
    .errors-list {
      margin-top: 24px;
      padding: 12px 16px;
      background: rgba(255, 152, 0, 0.1);
      border-left: 4px solid var(--warning-color);
      border-radius: 4px;
    }
    .errors-list h3 {
      margin: 0 0 8px;
      font-size: 0.9rem;
      color: var(--warning-color);
    }
    .errors-list ul {
      margin: 0;
      padding-left: 20px;
    }
    .errors-list li {
      font-size: 0.85rem;
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    this._load();
  }

  private async _load() {
    this._loading = true;
    this._loadError = null;
    try {
      const result =
        await this.hass.connection.sendMessagePromise<ListThemesResult>({
          type: "theme_studio/list_themes",
        });
      this._themes = result.themes;
      this._errors = result.errors;
    } catch (err) {
      this._loadError = err instanceof Error ? err.message : String(err);
    } finally {
      this._loading = false;
    }
  }

  override render() {
    if (this._loading) {
      return html`<div class="empty">Lade Themes…</div>`;
    }
    if (this._loadError) {
      return html`<div class="error">Fehler: ${this._loadError}</div>`;
    }
    return html`
      <h2>Welches Theme möchtest du tunen?</h2>
      ${this._themes.length === 0
        ? html`<div class="empty">
            Keine Themes gefunden. Lege eine YAML-Datei in
            <code>themes/</code> an oder erstelle ein neues Theme (folgt in
            Schritt 8).
          </div>`
        : html`
            <div class="list">
              ${this._themes.map(
                (t) => html`
                  <button
                    class="item"
                    @click=${() => this._select(t)}
                    title=${t.file}
                  >
                    <div class="info">
                      <div class="name">${t.theme_name}</div>
                      <div class="meta">
                        ${t.file} · ${t.variable_count} Variablen
                      </div>
                    </div>
                    <div class="arrow">→</div>
                  </button>
                `,
              )}
            </div>
          `}
      ${this._errors.length > 0
        ? html`
            <div class="errors-list">
              <h3>YAML-Fehler in folgenden Dateien:</h3>
              <ul>
                ${this._errors.map(
                  (e) => html`<li>${e.file}: ${e.error}</li>`,
                )}
              </ul>
            </div>
          `
        : ""}
    `;
  }

  private _select(theme: ThemeEntry) {
    this.dispatchEvent(
      new CustomEvent("theme-selected", {
        detail: { file: theme.file, theme_name: theme.theme_name },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "theme-picker": ThemePicker;
  }
}
