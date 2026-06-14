// <ts-module-picker> — Listet Bubble-Card-Module aus
// <config>/bubble_card/modules/. Analog zu <theme-picker>, aber jede
// Row zeigt zusätzlich: name, supported card-types, is_global-Badge,
// has-code-Indikator.
//
// Click dispatcht `module-selected` mit { file, module_id } —
// panel-main routet daraufhin auf <ts-module-editor>.

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { t } from "../core/i18n";
import { LocaleController } from "../core/locale-controller";
import type { HomeAssistant } from "../types";

interface ModuleEntry {
  file: string;
  module_id: string;
  name: string;
  version: string;
  description: string;
  supported: string[];
  is_global: boolean;
  has_code: boolean;
}

interface ModuleError {
  file: string;
  error: string;
}

interface ListModulesResult {
  modules: ModuleEntry[];
  errors: ModuleError[];
  root_exists: boolean;
}

@customElement("ts-module-picker")
export class TsModulePicker extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  _locale = new LocaleController(this);

  @state() private _loading = true;
  @state() private _modules: ModuleEntry[] = [];
  @state() private _errors: ModuleError[] = [];
  @state() private _rootExists = true;
  @state() private _loadError: string | null = null;

  static override styles = css`
    :host {
      display: block;
      max-width: 800px;
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
    .name-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .name {
      font-weight: 500;
      font-size: 1.05rem;
    }
    .module-id {
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: 0.85rem;
      color: var(--secondary-text-color);
    }
    .desc {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
      margin-top: 4px;
    }
    .meta {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 6px;
    }
    .tag {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.06);
      font-size: 0.7rem;
      color: var(--secondary-text-color);
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
    }
    .tag.global {
      background: rgba(67, 160, 71, 0.15);
      color: var(--success-color, #43a047);
    }
    .tag.no-code {
      background: rgba(219, 68, 55, 0.12);
      color: var(--error-color, #db4437);
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
    .retry-btn {
      margin-top: 12px;
      padding: 8px 16px;
      border: 1px solid var(--primary-color, #03a9f4);
      border-radius: 6px;
      background: none;
      color: var(--primary-color, #03a9f4);
      font: inherit;
      cursor: pointer;
    }
    .retry-btn:hover {
      background: rgba(3, 169, 244, 0.08);
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
    .errors-list li {
      font-size: 0.85rem;
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
    }
    code {
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      background: rgba(0, 0, 0, 0.06);
      padding: 1px 4px;
      border-radius: 3px;
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
        await this.hass.connection.sendMessagePromise<ListModulesResult>({
          type: "theme_studio/list_modules",
        });
      this._modules = result.modules;
      this._errors = result.errors;
      this._rootExists = result.root_exists;
    } catch (err) {
      this._loadError = err instanceof Error ? err.message : String(err);
    } finally {
      this._loading = false;
    }
  }

  override render() {
    if (this._loading) {
      return html`<div class="empty">${t("module_picker.loading")}</div>`;
    }
    if (this._loadError) {
      return html`<div class="error">
        ${t("common.error_prefix")}: ${this._loadError}
        <div>
          <button class="retry-btn" @click=${() => this._load()}>
            ↻ ${t("common.retry")}
          </button>
        </div>
      </div>`;
    }
    return html`
      <h2>${t("module_picker.heading")}</h2>
      ${!this._rootExists
        ? html`<div class="empty">${t("module_picker.no_root")}</div>`
        : this._modules.length === 0
          ? html`<div class="empty">${t("module_picker.empty")}</div>`
          : html`
              <div class="list">
                ${this._modules.map(
                  (m) => html`
                    <button
                      class="item"
                      @click=${() => this._select(m)}
                      title=${m.file}
                    >
                      <div class="info">
                        <div class="name-row">
                          <span class="name">${m.name}</span>
                          <span class="module-id">${m.module_id}</span>
                        </div>
                        ${m.description
                          ? html`<div class="desc">${m.description}</div>`
                          : ""}
                        <div class="meta">
                          <span class="tag">${m.file}</span>
                          ${m.is_global
                            ? html`<span class="tag global"
                                >${t("module_picker.tag_global")}</span
                              >`
                            : ""}
                          ${!m.has_code
                            ? html`<span class="tag no-code"
                                >${t("module_picker.tag_no_code")}</span
                              >`
                            : ""}
                          ${m.supported.map(
                            (s) => html`<span class="tag">${s}</span>`,
                          )}
                          ${m.version
                            ? html`<span class="tag">v${m.version}</span>`
                            : ""}
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

  private _select(m: ModuleEntry) {
    this.dispatchEvent(
      new CustomEvent("module-selected", {
        detail: { file: m.file, module_id: m.module_id },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ts-module-picker": TsModulePicker;
  }
}
