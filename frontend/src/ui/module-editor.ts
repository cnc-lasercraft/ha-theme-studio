// <ts-module-editor> — Bearbeitet ein einzelnes Bubble-Card-Modul.
//
// Lädt das volle Module-Dict via `theme_studio/get_module`, zeigt
// Metadaten-Felder (name, description, version, supported, is_global)
// + eine grosse Monospace-Textarea für `code` (das CSS). Save schreibt
// das komplette Dict zurück — so bleiben unbekannte Felder (z.B.
// `editor`, `creator`) erhalten.
//
// Hinweis: Bubble Card lädt Module beim Card-Render — nach Save muss
// der User seine Dashboards neu laden (kein Frontend-Reload-Service
// für Module verfügbar).

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { getVariableMeta } from "../core/schema-registry";
import type { VariableMeta } from "../core/types";
import type { HomeAssistant } from "../types";

interface GetModuleResult {
  file: string;
  module_id: string;
  content: Record<string, unknown>;
}

interface ExtractedVar {
  name: string;
  fallback?: string;
  count: number;
}

// Findet alle var(--name) / var(--name, fallback) im CSS. Nested var() in
// Fallbacks wird vom äusseren Match ignoriert, aber separat als eigener
// Hit erfasst — beide Vars werden also gelistet.
function extractVars(css: string): ExtractedVar[] {
  const map = new Map<string, ExtractedVar>();
  const re = /var\(\s*(--[\w-]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css)) !== null) {
    const name = m[1];
    let i = m.index + m[0].length;
    while (i < css.length && /\s/.test(css[i])) i++;
    let fallback: string | undefined;
    if (css[i] === ",") {
      i++;
      while (i < css.length && /\s/.test(css[i])) i++;
      const fbStart = i;
      let depth = 1;
      while (i < css.length && depth > 0) {
        const c = css[i];
        if (c === "(") depth++;
        else if (c === ")") {
          depth--;
          if (depth === 0) break;
        }
        i++;
      }
      const raw = css.slice(fbStart, i).trim();
      if (raw.length > 0) fallback = raw;
    }
    const existing = map.get(name);
    if (existing) {
      existing.count++;
      if (!existing.fallback && fallback) existing.fallback = fallback;
    } else {
      map.set(name, { name, fallback, count: 1 });
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

interface SaveModuleResult {
  file: string;
  module_id: string;
  backup: string | null;
}

type SaveStatus =
  | { state: "idle" }
  | { state: "saving" }
  | { state: "success"; backup: string | null }
  | { state: "error"; msg: string };

@customElement("ts-module-editor")
export class TsModuleEditor extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: String }) file = "";
  @property({ type: String }) moduleId = "";

  @state() private _loading = true;
  @state() private _error: string | null = null;
  @state() private _content: Record<string, unknown> = {};
  @state() private _original: Record<string, unknown> = {};
  @state() private _saveStatus: SaveStatus = { state: "idle" };

  static override styles = css`
    :host {
      display: block;
      max-width: 1100px;
      margin: 0 auto;
      font-family: var(--paper-font-body1_-_font-family, "Roboto", sans-serif);
    }
    .toolbar {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .back-btn,
    .danger-btn,
    .primary-btn {
      background: none;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 6px;
      padding: 8px 14px;
      cursor: pointer;
      color: inherit;
      font: inherit;
      font-size: 0.9rem;
    }
    .back-btn:hover,
    .danger-btn:hover,
    .primary-btn:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .danger-btn {
      color: var(--error-color, #db4437);
      border-color: var(--error-color, #db4437);
    }
    .primary-btn[disabled],
    .danger-btn[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .breadcrumb {
      flex: 1;
      min-width: 200px;
      color: var(--secondary-text-color);
      font-size: 0.95rem;
    }
    .breadcrumb .module-name {
      color: var(--primary-text-color);
      font-weight: 500;
      font-size: 1.1rem;
    }
    .breadcrumb code {
      font-size: 0.85rem;
      color: var(--secondary-text-color);
    }
    .dirty-badge {
      padding: 4px 10px;
      border-radius: 12px;
      background: var(--warning-color, #ffa600);
      color: #000;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .loading,
    .error {
      padding: 40px;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .error {
      color: var(--error-color);
    }
    .card {
      background: var(--card-background-color);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.08));
      padding: 20px;
      margin-bottom: 16px;
    }
    .card h3 {
      margin: 0 0 16px;
      font-size: 1rem;
      font-weight: 500;
    }
    .field {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 12px;
      align-items: center;
      margin-bottom: 12px;
    }
    .field.checkbox-field {
      grid-template-columns: 120px auto;
      align-items: center;
    }
    .field label {
      color: var(--secondary-text-color);
      font-size: 0.9rem;
    }
    .field input[type="text"],
    .field textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 8px 10px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 0.9rem;
    }
    .field input[type="checkbox"] {
      transform: scale(1.2);
      margin: 0;
    }
    .field input:focus,
    .field textarea:focus {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: -1px;
      border-color: transparent;
    }
    .field-help {
      grid-column: 2;
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      margin-top: -6px;
    }
    .code-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 300px;
      gap: 16px;
      align-items: start;
    }
    @media (max-width: 900px) {
      .code-layout {
        grid-template-columns: 1fr;
      }
    }
    .code-editor {
      width: 100%;
      box-sizing: border-box;
      min-height: 500px;
      padding: 12px 14px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 6px;
      background: var(--code-editor-background-color, var(--secondary-background-color));
      color: var(--primary-text-color);
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: 0.85rem;
      line-height: 1.5;
      resize: vertical;
      white-space: pre;
      tab-size: 2;
    }
    .code-editor:focus {
      outline: 2px solid var(--primary-color);
      outline-offset: -1px;
      border-color: transparent;
    }
    .vars-sidebar {
      position: sticky;
      top: 16px;
      max-height: calc(100vh - 32px);
      overflow-y: auto;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 6px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.02));
      padding: 12px;
      font-size: 0.82rem;
    }
    .vars-sidebar h4 {
      margin: 0 0 10px;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--secondary-text-color);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .vars-sidebar h4 .count {
      background: rgba(0, 0, 0, 0.08);
      padding: 1px 7px;
      border-radius: 10px;
      font-size: 0.72rem;
      font-weight: 600;
    }
    .vars-empty {
      color: var(--secondary-text-color);
      font-style: italic;
      padding: 8px 4px;
    }
    .var-item {
      padding: 8px 6px;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    }
    .var-item:last-child {
      border-bottom: none;
    }
    .var-header {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .var-name {
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: 0.82rem;
      color: var(--primary-text-color);
      word-break: break-all;
      flex: 1 1 auto;
      min-width: 0;
    }
    .var-count {
      background: rgba(0, 0, 0, 0.08);
      color: var(--secondary-text-color);
      padding: 0 6px;
      border-radius: 8px;
      font-size: 0.7rem;
      font-weight: 600;
      flex-shrink: 0;
    }
    .var-tags {
      display: flex;
      gap: 4px;
      margin-top: 4px;
      flex-wrap: wrap;
    }
    .var-tag {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.06);
      font-size: 0.68rem;
      color: var(--secondary-text-color);
      font-family: ui-monospace, monospace;
    }
    .var-tag.plugin {
      background: rgba(3, 169, 244, 0.14);
      color: var(--primary-color);
    }
    .var-tag.heuristic {
      background: rgba(255, 166, 0, 0.14);
      color: var(--warning-color, #ffa600);
    }
    .var-tag.type-color {
      background: rgba(67, 160, 71, 0.14);
      color: var(--success-color, #43a047);
    }
    .var-desc {
      color: var(--secondary-text-color);
      font-size: 0.75rem;
      margin-top: 4px;
      line-height: 1.35;
    }
    .var-fallback {
      margin-top: 4px;
      font-size: 0.72rem;
      color: var(--secondary-text-color);
    }
    .var-fallback code {
      font-family: ui-monospace, monospace;
      background: rgba(0, 0, 0, 0.06);
      padding: 1px 4px;
      border-radius: 3px;
      color: var(--primary-text-color);
    }
    .var-swatch {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 2px;
      margin-right: 4px;
      vertical-align: middle;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .extra-keys {
      margin-top: 12px;
      font-size: 0.8rem;
      color: var(--secondary-text-color);
    }
    .extra-keys code {
      background: rgba(0, 0, 0, 0.06);
      padding: 1px 4px;
      border-radius: 3px;
      font-family: ui-monospace, monospace;
    }
    .status-banner {
      padding: 10px 16px;
      border-radius: 4px;
      margin-bottom: 16px;
      font-size: 0.9rem;
    }
    .status-banner.success {
      background: rgba(67, 160, 71, 0.12);
      border-left: 4px solid var(--success-color, #43a047);
    }
    .status-banner.error {
      background: rgba(219, 68, 55, 0.12);
      border-left: 4px solid var(--error-color, #db4437);
    }
    .status-banner code {
      font-family: ui-monospace, monospace;
      background: rgba(0, 0, 0, 0.08);
      padding: 1px 4px;
      border-radius: 3px;
    }
    .notice {
      padding: 10px 14px;
      background: rgba(3, 169, 244, 0.08);
      border-left: 4px solid var(--info-color, var(--primary-color));
      border-radius: 4px;
      margin-bottom: 12px;
      font-size: 0.85rem;
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    this._load();
  }

  override updated(changed: Map<string, unknown>) {
    const fileChanged =
      changed.has("file") && changed.get("file") !== undefined;
    const modChanged =
      changed.has("moduleId") && changed.get("moduleId") !== undefined;
    if (fileChanged || modChanged) {
      this._load();
    }
  }

  private async _load() {
    this._loading = true;
    this._error = null;
    this._saveStatus = { state: "idle" };
    try {
      const result =
        await this.hass.connection.sendMessagePromise<GetModuleResult>({
          type: "theme_studio/get_module",
          file: this.file,
          module_id: this.moduleId,
        });
      this._content = { ...result.content };
      this._original = JSON.parse(JSON.stringify(result.content));
    } catch (err) {
      this._error = err instanceof Error ? err.message : String(err);
    } finally {
      this._loading = false;
    }
  }

  private _isDirty(): boolean {
    return JSON.stringify(this._content) !== JSON.stringify(this._original);
  }

  private _onBack() {
    if (this._isDirty()) {
      if (
        !confirm(
          "Ungespeicherte Änderungen am Modul gehen verloren. Trotzdem zurück?",
        )
      ) {
        return;
      }
    }
    this.dispatchEvent(
      new CustomEvent("back-to-picker", { bubbles: true, composed: true }),
    );
  }

  private _setField(key: string, value: unknown) {
    this._content = { ...this._content, [key]: value };
  }

  private async _save() {
    if (!this._isDirty() || this._saveStatus.state === "saving") return;
    if (
      !confirm(
        `Modul '${this.moduleId}' in '${this.file}' speichern?\n\n` +
          `Ein Backup wird automatisch unter bubble_card/.backups/ angelegt.`,
      )
    ) {
      return;
    }
    this._saveStatus = { state: "saving" };
    try {
      const result =
        await this.hass.connection.sendMessagePromise<SaveModuleResult>({
          type: "theme_studio/save_module",
          file: this.file,
          module_id: this.moduleId,
          content: this._content,
        });
      this._original = JSON.parse(JSON.stringify(this._content));
      this._saveStatus = { state: "success", backup: result.backup };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this._saveStatus = { state: "error", msg };
    }
  }

  private _resetAll() {
    if (!this._isDirty()) return;
    if (
      !confirm(
        "Alle Änderungen am Modul werden auf den Original-Zustand zurückgesetzt. Fortfahren?",
      )
    ) {
      return;
    }
    this._content = JSON.parse(JSON.stringify(this._original));
  }

  override render() {
    if (this._loading) {
      return html`<div class="loading">Lade Modul…</div>`;
    }
    if (this._error) {
      return html`<div class="error">Fehler: ${this._error}</div>`;
    }
    const name = (this._content["name"] as string) || this.moduleId;
    const description = (this._content["description"] as string) || "";
    const version = (this._content["version"] as string) || "";
    const supported = Array.isArray(this._content["supported"])
      ? (this._content["supported"] as string[])
      : [];
    const isGlobal = this._content["is_global"] === true;
    const code = (this._content["code"] as string) || "";

    // Felder die der Editor explizit nicht zeigt — beim Save bleiben sie
    // aber erhalten (wir schreiben das volle _content-Object zurück).
    const knownKeys = new Set([
      "name",
      "description",
      "version",
      "supported",
      "is_global",
      "code",
    ]);
    const extraKeys = Object.keys(this._content).filter(
      (k) => !knownKeys.has(k),
    );

    const dirty = this._isDirty();
    return html`
      <div class="toolbar">
        <button class="back-btn" @click=${this._onBack}>← Zurück</button>
        <div class="breadcrumb">
          <div class="module-name">${name}</div>
          <code>${this.file} · ${this.moduleId}</code>
        </div>
        ${dirty
          ? html`<span class="dirty-badge">geändert</span>`
          : ""}
        <button
          class="danger-btn"
          ?disabled=${!dirty || this._saveStatus.state === "saving"}
          @click=${this._resetAll}
        >
          Verwerfen
        </button>
        <button
          class="primary-btn"
          ?disabled=${!dirty || this._saveStatus.state === "saving"}
          @click=${this._save}
        >
          ${this._saveStatus.state === "saving" ? "Speichere…" : "Speichern"}
        </button>
      </div>

      ${this._renderSaveStatus()}

      <div class="notice">
        <strong>Hinweis:</strong> Bubble Card lädt Module beim
        Card-Render. Nach Save musst du deine Dashboards neu laden
        (Cmd+R), damit die Änderungen wirksam werden.
      </div>

      <div class="card">
        <h3>Metadaten</h3>
        <div class="field">
          <label for="m-name">Name</label>
          <input
            id="m-name"
            type="text"
            .value=${name}
            @input=${(e: Event) =>
              this._setField("name", (e.target as HTMLInputElement).value)}
          />
        </div>
        <div class="field">
          <label for="m-desc">Description</label>
          <input
            id="m-desc"
            type="text"
            .value=${description}
            @input=${(e: Event) =>
              this._setField(
                "description",
                (e.target as HTMLInputElement).value,
              )}
          />
        </div>
        <div class="field">
          <label for="m-version">Version</label>
          <input
            id="m-version"
            type="text"
            .value=${version}
            @input=${(e: Event) =>
              this._setField("version", (e.target as HTMLInputElement).value)}
          />
        </div>
        <div class="field">
          <label for="m-supported">Supported</label>
          <input
            id="m-supported"
            type="text"
            .value=${supported.join(", ")}
            @input=${this._onSupportedInput}
            placeholder="button, climate, pop-up, separator, …"
            spellcheck="false"
          />
        </div>
        <div class="field-help">
          Komma-getrennte Card-Types (button, climate, cover,
          horizontal-buttons-stack, media-player, pop-up, select,
          separator, sub-buttons).
        </div>
        <div class="field checkbox-field">
          <label for="m-global">is_global</label>
          <input
            id="m-global"
            type="checkbox"
            .checked=${isGlobal}
            @change=${(e: Event) =>
              this._setField(
                "is_global",
                (e.target as HTMLInputElement).checked,
              )}
          />
        </div>
        ${extraKeys.length > 0
          ? html`<div class="extra-keys">
              Weitere Felder im YAML (werden beim Save 1:1 erhalten):
              ${extraKeys.map(
                (k, i) => html`${i > 0 ? ", " : ""}<code>${k}</code>`,
              )}
            </div>`
          : ""}
      </div>

      <div class="card">
        <h3>CSS-Code</h3>
        <div class="code-layout">
          <textarea
            class="code-editor"
            spellcheck="false"
            .value=${code}
            @input=${(e: Event) =>
              this._setField("code", (e.target as HTMLTextAreaElement).value)}
          ></textarea>
          ${this._renderVarsSidebar(code)}
        </div>
      </div>
    `;
  }

  private _renderVarsSidebar(code: string) {
    const vars = extractVars(code);
    return html`
      <aside class="vars-sidebar">
        <h4>
          Verwendete Variablen
          <span class="count">${vars.length}</span>
        </h4>
        ${vars.length === 0
          ? html`<div class="vars-empty">
              Keine <code>var(--…)</code> im Code gefunden.
            </div>`
          : vars.map((v) => this._renderVarItem(v))}
      </aside>
    `;
  }

  private _renderVarItem(v: ExtractedVar) {
    const meta: VariableMeta = getVariableMeta(v.name, v.fallback);
    const isSchema = meta.source === "schema";
    const swatch =
      meta.type === "color" && v.fallback
        ? html`<span class="var-swatch" style=${`background:${v.fallback}`}></span>`
        : "";
    return html`
      <div class="var-item">
        <div class="var-header">
          <span class="var-name">${swatch}${v.name}</span>
          ${v.count > 1
            ? html`<span class="var-count">×${v.count}</span>`
            : ""}
        </div>
        <div class="var-tags">
          ${isSchema
            ? html`<span class="var-tag plugin">${meta.plugin}</span>`
            : html`<span class="var-tag heuristic">heuristik</span>`}
          <span
            class=${`var-tag ${meta.type === "color" ? "type-color" : ""}`}
          >${meta.type}</span>
          ${isSchema && meta.category
            ? html`<span class="var-tag">${meta.category}</span>`
            : ""}
        </div>
        ${meta.description
          ? html`<div class="var-desc">${meta.description}</div>`
          : ""}
        ${v.fallback
          ? html`<div class="var-fallback">
              Fallback: <code>${v.fallback}</code>
            </div>`
          : ""}
      </div>
    `;
  }

  private _renderSaveStatus() {
    const s = this._saveStatus;
    if (s.state === "idle" || s.state === "saving") return "";
    if (s.state === "success") {
      return html`
        <div class="status-banner success">
          ✓ Modul gespeichert${s.backup
            ? html` &middot; Backup: <code>${s.backup}</code>`
            : ""}.
          Lade jetzt das Dashboard neu (Cmd+R), damit die Änderung
          wirksam wird.
        </div>
      `;
    }
    return html`
      <div class="status-banner error">
        ✗ Speichern fehlgeschlagen: ${s.msg}
      </div>
    `;
  }

  private _onSupportedInput(e: Event) {
    const raw = (e.target as HTMLInputElement).value;
    const items = raw
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    this._setField("supported", items);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ts-module-editor": TsModuleEditor;
  }
}
