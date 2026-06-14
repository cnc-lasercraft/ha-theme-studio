import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { t } from "../core/i18n";
import type { HomeAssistant } from "../types";
import { confirmDialog } from "./modal";

interface ThemeEntry {
  file: string;
  theme_name: string;
  variable_count: number;
  // Backend-Heuristik: Datei liegt in einem Unterordner von themes/ →
  // potenziell HACS-verwaltet (HACS installiert Themes immer in Subdir).
  hacs_managed: boolean;
  // In der Fork-Registry verzeichnet (= per Theme Studio abgeleitet).
  // Nur solche Themes sind löschbar.
  is_fork: boolean;
  // Herkunft eines Forks (für Upstream-Merge) — null bei Nicht-Forks.
  source_file?: string | null;
  source_theme?: string | null;
}

interface DeleteThemeResult {
  file: string;
  backup: string | null;
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
  @state() private _actionError: string | null = null;
  @state() private _deleting: string | null = null;

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
    .row {
      display: flex;
      align-items: stretch;
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
      flex: 1;
      min-width: 0;
      border: none;
      color: inherit;
      font: inherit;
      transition: transform 0.1s ease, box-shadow 0.1s ease;
    }
    .delete-btn {
      flex-shrink: 0;
      width: 48px;
      border: none;
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--card-background-color);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.08));
      color: var(--secondary-text-color);
      font-size: 1.2rem;
      cursor: pointer;
      transition: color 0.1s ease, background 0.1s ease;
    }
    .delete-btn:hover {
      color: var(--error-color, #db4437);
      background: rgba(219, 68, 55, 0.08);
    }
    .delete-btn:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .delete-btn:focus-visible {
      outline: 2px solid var(--error-color, #db4437);
      outline-offset: 2px;
    }
    .compare-btn {
      flex-shrink: 0;
      width: 48px;
      border: none;
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--card-background-color);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.08));
      color: var(--secondary-text-color);
      font-size: 1.2rem;
      cursor: pointer;
      transition: color 0.1s ease, background 0.1s ease;
    }
    .compare-btn:hover {
      color: var(--primary-color);
      background: rgba(3, 169, 244, 0.08);
    }
    .compare-btn:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .action-error {
      margin-bottom: 12px;
      padding: 10px 16px;
      border-radius: 4px;
      background: rgba(219, 68, 55, 0.1);
      border-left: 4px solid var(--error-color, #db4437);
      color: var(--error-color, #db4437);
      font-size: 0.9rem;
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
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .badge {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 10px;
      white-space: nowrap;
    }
    .badge.hacs {
      background: rgba(255, 152, 0, 0.16);
      color: var(--warning-color, #ff9800);
    }
    .badge.own {
      background: rgba(67, 160, 71, 0.14);
      color: var(--success-color, #43a047);
    }
    .badge.default {
      background: var(--primary-color);
      color: #fff;
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
      return html`<div class="empty">${t("picker.loading")}</div>`;
    }
    if (this._loadError) {
      return html`<div class="error">
        ${t("common.error_prefix")}: ${this._loadError}
      </div>`;
    }
    return html`
      <h2>${t("picker.heading")}</h2>
      ${this._actionError
        ? html`<div class="action-error">
            ${t("common.error_prefix")}: ${this._actionError}
          </div>`
        : ""}
      ${this._themes.length === 0
        ? html`<div class="empty">${t("picker.empty")}</div>`
        : html`
            <div class="list">
              ${this._themes.map(
                (theme) => html`
                  <div class="row">
                    <button
                      class="item"
                      @click=${() => this._select(theme)}
                      title=${theme.file}
                    >
                      <div class="info">
                        <div class="name">
                          ${theme.theme_name}
                          ${theme.hacs_managed
                            ? html`<span
                                class="badge hacs"
                                title=${t("picker.badge_hacs_title")}
                                >${t("picker.badge_hacs")}</span
                              >`
                            : html`<span class="badge own"
                                >${t("picker.badge_own")}</span
                              >`}
                          ${this.hass.themes?.default_theme === theme.theme_name
                            ? html`<span
                                class="badge default"
                                title=${t("picker.badge_default_title")}
                                >★ ${t("picker.badge_default")}</span
                              >`
                            : ""}
                        </div>
                        <div class="meta">
                          ${theme.file} ·
                          ${t("picker.var_count", undefined, {
                            n: theme.variable_count,
                          })}
                        </div>
                      </div>
                      <div class="arrow">→</div>
                    </button>
                    ${theme.is_fork && this._upstreamFor(theme)
                      ? html`<button
                          class="compare-btn"
                          title=${t("picker.compare_upstream_tooltip")}
                          @click=${() => this._compareUpstream(theme)}
                        >
                          ⇄
                        </button>`
                      : ""}
                    ${theme.is_fork
                      ? html`<button
                          class="delete-btn"
                          ?disabled=${this._deleting !== null}
                          title=${t("picker.delete_tooltip")}
                          @click=${() => this._deleteFork(theme)}
                        >
                          ${this._deleting === theme.file ? "…" : "🗑"}
                        </button>`
                      : ""}
                  </div>
                `,
              )}
            </div>
          `}
      ${this._errors.length > 0
        ? html`
            <div class="errors-list">
              <h3>${t("picker.yaml_errors_heading")}</h3>
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
        detail: {
          file: theme.file,
          theme_name: theme.theme_name,
          hacs_managed: theme.hacs_managed,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Löscht einen abgeleiteten Fork. Backend akzeptiert nur Registry-Forks und
   * verschiebt die Datei reversibel nach .backups/. Nach Erfolg Liste neu laden.
   */
  private async _deleteFork(theme: ThemeEntry) {
    if (this._deleting !== null) return;
    const ok = await confirmDialog({
      message: t("picker.delete_confirm", undefined, { theme: theme.theme_name }),
      confirmLabel: t("common.delete"),
      danger: true,
    });
    if (!ok) return;

    this._actionError = null;
    this._deleting = theme.file;
    try {
      await this.hass.connection.sendMessagePromise<DeleteThemeResult>({
        type: "theme_studio/delete_theme",
        file: theme.file,
      });
      await this._load();
    } catch (err) {
      this._actionError = err instanceof Error ? err.message : String(err);
    } finally {
      this._deleting = null;
    }
  }

  /**
   * Sucht das Upstream-Theme eines Forks (aus source_file/source_theme) in der
   * aktuellen Liste. null, wenn die Quelle nicht (mehr) existiert — dann kein
   * ⇄-Button (z.B. HACS-Theme deinstalliert).
   */
  private _upstreamFor(theme: ThemeEntry): ThemeEntry | null {
    if (!theme.source_file || !theme.source_theme) return null;
    return (
      this._themes.find(
        (e) =>
          e.file === theme.source_file &&
          e.theme_name === theme.source_theme,
      ) ?? null
    );
  }

  /**
   * Öffnet Fork ↔ Upstream im Vergleichen-Tab (A=Fork, B=Upstream). panel-main
   * hört darauf, wechselt den Tab und reicht die Vorauswahl an die Compare-View.
   */
  private _compareUpstream(theme: ThemeEntry) {
    const upstream = this._upstreamFor(theme);
    if (!upstream) return;
    this.dispatchEvent(
      new CustomEvent("compare-upstream", {
        detail: {
          fork: { file: theme.file, theme_name: theme.theme_name },
          upstream: {
            file: upstream.file,
            theme_name: upstream.theme_name,
          },
        },
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
