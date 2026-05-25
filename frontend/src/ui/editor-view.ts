// <ts-editor-view> — Editor für ein einzelnes Theme.
//
// Lädt das Theme via WS-Command `theme_studio/get_theme`, mappt jede
// Variable auf ihren Plugin-Schema-Eintrag oder Heuristik-Fallback,
// rendert pro Variable den passenden Control aus Step 5 und schaltet
// `value-changed` direkt als `document.documentElement.style.setProperty`
// in den Live-Preview.
//
// Save kommt in Step 8 — diese Komponente hält alles in-memory und
// markiert Änderungen als "dirty". `disconnectedCallback` revertet
// sämtliche CSS-Overrides, damit man das Theme-Studio sauber verlassen
// kann ohne Phantom-Styles auf dem HA-Frontend.

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { getPlugins, getVariableMeta } from "../core/schema-registry";
import type { Category, VariableMeta } from "../core/types";
import type { HomeAssistant } from "../types";

import "./controls/color-picker";
import "./controls/length-slider";
import "./controls/raw-input";

interface GetThemeResult {
  file: string;
  theme_name: string;
  variables: Record<string, unknown>;
}

interface SaveThemeResult {
  file: string;
  theme_name: string;
  backup: string | null;
}

type SaveStatus =
  | { state: "idle" }
  | { state: "saving" }
  | { state: "success"; backup: string | null }
  | { state: "error"; msg: string };

interface EditorRow {
  varName: string; // e.g. "--primary-color" (mit `--`)
  yamlKey: string; // e.g. "primary-color"   (ohne `--`)
  meta: VariableMeta;
  original: string;
  current: string;
}

interface CategoryGroup extends Category {
  rows: EditorRow[];
}

const UNKNOWN_CAT: Category = {
  id: "_unknown",
  label: "Unbekannt (Heuristik)",
  icon: "mdi:help-circle-outline",
};
const OTHER_CAT: Category = {
  id: "_other",
  label: "Sonstige",
  icon: "mdi:dots-horizontal",
};

@customElement("ts-editor-view")
export class TsEditorView extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: String }) file = "";
  @property({ type: String }) themeName = "";

  @state() private _loading = true;
  @state() private _error: string | null = null;
  @state() private _rows: EditorRow[] = [];
  @state() private _categories: CategoryGroup[] = [];
  @state() private _skippedKeys: string[] = [];
  @state() private _saveStatus: SaveStatus = { state: "idle" };

  // Set aller CSS-Variablen, die wir auf :root überschrieben haben — für
  // sauberen Cleanup beim Verlassen oder beim "Alles verwerfen".
  private _appliedVars = new Set<string>();

  // Vollständiger Theme-Object vom get_theme-Result, inklusive Dict-Keys
  // wie `modes:`, die der Editor nicht abbildet aber beim Save bewahren
  // muss.
  private _originalFullTheme: Record<string, unknown> = {};

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
    .primary-btn[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .breadcrumb {
      flex: 1;
      min-width: 200px;
      color: var(--secondary-text-color);
      font-size: 0.95rem;
    }
    .breadcrumb .theme-name {
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
    .error,
    .empty {
      padding: 40px;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .error {
      color: var(--error-color);
    }
    .category-card {
      background: var(--card-background-color);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.08));
      padding: 20px;
      margin-bottom: 16px;
    }
    .category-card h3 {
      margin: 0 0 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1rem;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .category-card h3 .count {
      color: var(--secondary-text-color);
      font-weight: 400;
      font-size: 0.85rem;
    }
    .row {
      display: grid;
      grid-template-columns: minmax(220px, 320px) 1fr auto;
      gap: 12px;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }
    .row:last-child {
      border-bottom: none;
    }
    .row.dirty {
      background: linear-gradient(
        to right,
        rgba(255, 166, 0, 0.08) 0%,
        transparent 30%
      );
      margin: 0 -20px;
      padding-left: 20px;
      padding-right: 20px;
    }
    .meta-cell {
      min-width: 0;
    }
    .var-name {
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: 0.9rem;
      color: var(--primary-text-color);
      display: block;
      word-break: break-all;
    }
    .var-name .dirty-dot {
      color: var(--warning-color);
      margin-right: 4px;
    }
    .description {
      font-size: 0.9rem;
      color: var(--primary-text-color);
      opacity: 0.78;
      margin-top: 6px;
      display: block;
      line-height: 1.45;
    }
    .heuristic-tag {
      display: inline-block;
      margin-left: 8px;
      padding: 1px 6px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.08);
      font-size: 0.7rem;
      color: var(--secondary-text-color);
      font-family: var(--paper-font-body1_-_font-family);
      vertical-align: middle;
    }
    .reset-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      font-size: 1.2rem;
      padding: 6px 8px;
      border-radius: 4px;
      line-height: 1;
    }
    .reset-btn:hover:not([disabled]) {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      color: var(--primary-text-color);
    }
    .reset-btn[disabled] {
      opacity: 0.25;
      cursor: not-allowed;
    }
    .notice {
      padding: 12px 16px;
      background: rgba(3, 169, 244, 0.08);
      border-left: 4px solid var(--info-color, var(--primary-color));
      border-radius: 4px;
      margin-bottom: 16px;
      font-size: 0.9rem;
    }
    .notice code {
      font-family: ui-monospace, monospace;
      background: rgba(0, 0, 0, 0.06);
      padding: 1px 4px;
      border-radius: 3px;
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
      color: var(--primary-text-color);
    }
    .status-banner.error {
      background: rgba(219, 68, 55, 0.12);
      border-left: 4px solid var(--error-color, #db4437);
      color: var(--primary-text-color);
    }
    .status-banner code {
      font-family: ui-monospace, monospace;
      background: rgba(0, 0, 0, 0.08);
      padding: 1px 4px;
      border-radius: 3px;
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    this._load();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._revertAll();
  }

  override updated(changed: Map<string, unknown>) {
    // Wenn file/themeName nach dem ersten Mount wechseln (z.B. weil der
    // Panel-Container die Komponente wiederverwendet), neu laden.
    const fileChanged =
      changed.has("file") && changed.get("file") !== undefined;
    const nameChanged =
      changed.has("themeName") && changed.get("themeName") !== undefined;
    if (fileChanged || nameChanged) {
      this._revertAll();
      this._rows = [];
      this._categories = [];
      this._load();
    }
  }

  private async _load() {
    this._loading = true;
    this._error = null;
    this._saveStatus = { state: "idle" };
    try {
      const result =
        await this.hass.connection.sendMessagePromise<GetThemeResult>({
          type: "theme_studio/get_theme",
          file: this.file,
          theme_name: this.themeName,
        });
      this._originalFullTheme = result.variables;
      this._buildRows(result.variables);
    } catch (err) {
      this._error = err instanceof Error ? err.message : String(err);
    } finally {
      this._loading = false;
    }
  }

  // ─── Save-Flow ──────────────────────────────────────────────────────

  private async _save() {
    const dirty = this._dirtyCount();
    if (dirty === 0 || this._saveStatus.state === "saving") return;

    const confirmMsg =
      `${dirty} Änderung${dirty === 1 ? "" : "en"} in '${this.file}' ` +
      `> '${this.themeName}' speichern?\n\n` +
      `Ein Backup wird automatisch unter themes/.backups/ angelegt.`;
    if (!confirm(confirmMsg)) return;

    this._saveStatus = { state: "saving" };

    // Merge: iteriere die Original-Theme-Keys (Key-Form bleibt erhalten),
    // ersetze Scalar-Werte mit dem aktuellen Editor-Stand. Dict-Keys wie
    // `modes:` werden 1:1 übernommen, ohne Editor-Wissen darüber zu
    // benötigen.
    const merged: Record<string, unknown> = {};
    for (const [origKey, origVal] of Object.entries(this._originalFullTheme)) {
      const normalized = origKey.startsWith("--") ? origKey.slice(2) : origKey;
      const row = this._rows.find((r) => r.yamlKey === normalized);
      merged[origKey] = row ? row.current : origVal;
    }

    try {
      const result =
        await this.hass.connection.sendMessagePromise<SaveThemeResult>({
          type: "theme_studio/save_theme",
          file: this.file,
          theme_name: this.themeName,
          variables: merged,
        });

      // Erfolg: originals = currents → Dirty-State weg. _appliedVars
      // bleibt — die Overrides werden erst beim Verlassen gecleant
      // (vermeidet Flackern während frontend.reload_themes lädt).
      this._originalFullTheme = merged;
      this._rows = this._rows.map((r) => ({ ...r, original: r.current }));
      this._categories = this._groupByCategory(this._rows);
      this._saveStatus = { state: "success", backup: result.backup };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this._saveStatus = { state: "error", msg };
    }
  }

  private _buildRows(vars: Record<string, unknown>) {
    const rows: EditorRow[] = [];
    const skipped: string[] = [];
    for (const [key, val] of Object.entries(vars)) {
      if (val === null || val === undefined) continue;
      if (typeof val === "object") {
        // z.B. `modes: { light: {...}, dark: {...} }` — komplexe Strukturen,
        // die der Variablen-Editor in v0.1 nicht abbildet.
        skipped.push(key);
        continue;
      }
      const sval = String(val);
      const varName = key.startsWith("--") ? key : `--${key}`;
      const yamlKey = varName.slice(2);
      const meta = getVariableMeta(varName);
      rows.push({ varName, yamlKey, meta, original: sval, current: sval });
    }
    this._skippedKeys = skipped;
    this._rows = rows;
    this._categories = this._groupByCategory(rows);
  }

  private _groupByCategory(rows: EditorRow[]): CategoryGroup[] {
    // Alle Kategorien aus allen Plugins sammeln, in deren Reihenfolge.
    const known = new Map<string, Category>();
    for (const p of getPlugins()) {
      for (const c of p.schema.categories) {
        if (!known.has(c.id)) known.set(c.id, c);
      }
    }

    const groups = new Map<string, EditorRow[]>();
    for (const row of rows) {
      let catId: string;
      if (row.meta.source === "heuristic") {
        catId = UNKNOWN_CAT.id;
      } else if (row.meta.category && known.has(row.meta.category)) {
        catId = row.meta.category;
      } else {
        catId = OTHER_CAT.id;
      }
      const arr = groups.get(catId) ?? [];
      arr.push(row);
      groups.set(catId, arr);
    }

    const result: CategoryGroup[] = [];
    for (const [id, cat] of known) {
      const r = groups.get(id);
      if (r && r.length > 0) result.push({ ...cat, rows: r });
    }
    const unknownRows = groups.get(UNKNOWN_CAT.id);
    if (unknownRows && unknownRows.length > 0) {
      result.push({ ...UNKNOWN_CAT, rows: unknownRows });
    }
    const otherRows = groups.get(OTHER_CAT.id);
    if (otherRows && otherRows.length > 0) {
      result.push({ ...OTHER_CAT, rows: otherRows });
    }
    return result;
  }

  // ─── CSS-Variable-Anwendung ─────────────────────────────────────────

  private _setCssVar(varName: string, value: string) {
    document.documentElement.style.setProperty(varName, value);
    this._appliedVars.add(varName);
  }

  private _revertCssVar(varName: string) {
    document.documentElement.style.removeProperty(varName);
    this._appliedVars.delete(varName);
  }

  private _revertAll() {
    for (const v of this._appliedVars) {
      document.documentElement.style.removeProperty(v);
    }
    this._appliedVars.clear();
  }

  // ─── Row-Mutationen ─────────────────────────────────────────────────

  private _changeRow(row: EditorRow, value: string) {
    this._setCssVar(row.varName, value);
    this._rows = this._rows.map((r) =>
      r.varName === row.varName ? { ...r, current: value } : r,
    );
    this._categories = this._groupByCategory(this._rows);
  }

  private _resetRow(row: EditorRow) {
    this._revertCssVar(row.varName);
    this._rows = this._rows.map((r) =>
      r.varName === row.varName ? { ...r, current: r.original } : r,
    );
    this._categories = this._groupByCategory(this._rows);
  }

  private _resetAll() {
    const dirtyCount = this._dirtyCount();
    if (dirtyCount === 0) return;
    if (
      !confirm(
        `${dirtyCount} ungespeicherte Änderung(en) werden verworfen. Fortfahren?`,
      )
    ) {
      return;
    }
    this._revertAll();
    this._rows = this._rows.map((r) => ({ ...r, current: r.original }));
    this._categories = this._groupByCategory(this._rows);
  }

  private _dirtyCount(): number {
    return this._rows.reduce(
      (sum, r) => sum + (r.current !== r.original ? 1 : 0),
      0,
    );
  }

  private _onBack() {
    const dirtyCount = this._dirtyCount();
    if (dirtyCount > 0) {
      if (
        !confirm(
          `${dirtyCount} ungespeicherte Änderung(en) gehen verloren. Trotzdem zurück?`,
        )
      ) {
        return;
      }
    }
    this._revertAll();
    this.dispatchEvent(
      new CustomEvent("back-to-picker", { bubbles: true, composed: true }),
    );
  }

  // ─── Rendering ──────────────────────────────────────────────────────

  override render() {
    return html`
      <div class="toolbar">
        <button class="back-btn" @click=${this._onBack}>← Zurück</button>
        <div class="breadcrumb">
          <div class="theme-name">${this.themeName}</div>
          <code>${this.file}</code>
        </div>
        ${this._renderDirtyBadge()}
        <button
          class="danger-btn"
          ?disabled=${this._dirtyCount() === 0 ||
          this._saveStatus.state === "saving"}
          @click=${this._resetAll}
        >
          Alles verwerfen
        </button>
        <button
          class="primary-btn"
          ?disabled=${this._dirtyCount() === 0 ||
          this._saveStatus.state === "saving"}
          @click=${this._save}
        >
          ${this._saveStatus.state === "saving" ? "Speichere…" : "Speichern"}
        </button>
      </div>
      ${this._renderSaveStatus()} ${this._renderBody()}
    `;
  }

  private _renderSaveStatus() {
    const s = this._saveStatus;
    if (s.state === "idle" || s.state === "saving") return "";
    if (s.state === "success") {
      return html`
        <div class="status-banner success">
          ✓ Gespeichert${s.backup
            ? html` &middot; Backup: <code>${s.backup}</code>`
            : ""}
        </div>
      `;
    }
    return html`
      <div class="status-banner error">✗ Speichern fehlgeschlagen: ${s.msg}</div>
    `;
  }

  private _renderDirtyBadge() {
    const n = this._dirtyCount();
    if (n === 0) return "";
    return html`<span class="dirty-badge"
      >${n} Änderung${n === 1 ? "" : "en"}</span
    >`;
  }

  private _renderBody() {
    if (this._loading) {
      return html`<div class="loading">Lade Theme…</div>`;
    }
    if (this._error) {
      return html`<div class="error">Fehler: ${this._error}</div>`;
    }
    if (this._rows.length === 0) {
      return html`<div class="empty">
        Keine editierbaren Variablen in diesem Theme.
      </div>`;
    }
    return html`
      ${this._skippedKeys.length > 0
        ? html`<div class="notice">
            Diese Theme-Datei enthält komplexe Werte unter
            ${this._skippedKeys.map(
              (k, i) =>
                html`${i > 0 ? ", " : ""}<code>${k}</code>`,
            )},
            die der Variablen-Editor in v0.1 nicht abbildet (z.B. light/dark
            modes oder verschachtelte Strukturen).
          </div>`
        : ""}
      ${this._categories.map((c) => this._renderCategory(c))}
    `;
  }

  private _renderCategory(cat: CategoryGroup) {
    return html`
      <div class="category-card">
        <h3>
          <span>${cat.label}</span>
          <span class="count">${cat.rows.length}</span>
        </h3>
        ${cat.rows.map((r) => this._renderRow(r))}
      </div>
    `;
  }

  private _renderRow(row: EditorRow) {
    const isDirty = row.current !== row.original;
    return html`
      <div class="row ${isDirty ? "dirty" : ""}">
        <div class="meta-cell">
          <code class="var-name">
            ${isDirty ? html`<span class="dirty-dot">●</span>` : ""}
            ${row.varName}
            ${row.meta.source === "heuristic"
              ? html`<span class="heuristic-tag"
                  >${row.meta.type}</span
                >`
              : ""}
          </code>
          ${row.meta.description
            ? html`<span class="description">${row.meta.description}</span>`
            : ""}
        </div>
        <div class="control-cell">${this._renderControl(row)}</div>
        <button
          class="reset-btn"
          ?disabled=${!isDirty}
          @click=${() => this._resetRow(row)}
          title="Auf Original zurücksetzen"
        >
          ↺
        </button>
      </div>
    `;
  }

  private _renderControl(row: EditorRow) {
    const onChange = (e: CustomEvent<{ value: string }>) =>
      this._changeRow(row, e.detail.value);
    switch (row.meta.type) {
      case "color":
        return html`
          <ts-color-picker
            .value=${row.current}
            @value-changed=${onChange}
          ></ts-color-picker>
        `;
      case "length":
        return html`
          <ts-length-slider
            .value=${row.current}
            .units=${row.meta.unit ?? ["px"]}
            .min=${row.meta.min ?? 0}
            .max=${row.meta.max ?? 100}
            @value-changed=${onChange}
          ></ts-length-slider>
        `;
      default:
        // shadow, font-family, enum, var-ref, raw → raw-input
        return html`
          <ts-raw-input
            .value=${row.current}
            @value-changed=${onChange}
          ></ts-raw-input>
        `;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ts-editor-view": TsEditorView;
  }
}
