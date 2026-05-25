// <ts-editor-view> — Editor für ein einzelnes Theme.
//
// Lädt das Theme via WS-Command `theme_studio/get_theme`, mappt jede
// Variable auf ihren Plugin-Schema-Eintrag oder Heuristik-Fallback,
// rendert pro Variable den passenden Control aus Step 5 und schaltet
// `value-changed` direkt als `document.documentElement.style.setProperty`
// in den Live-Preview.
//
// Tabs (v0.2):
//   - "Im Theme"  — zeigt nur Variablen, die im YAML schon gesetzt sind.
//   - "<Plugin>"  — alle Vars aus dessen schema.json, auch wenn nicht
//                   im aktuellen Theme. Default-Wert aus Schema =
//                   "Original". Edit → wird beim Save neu in YAML
//                   geschrieben.
//
// Modes (v0.2.x):
//   HA-Themes können `modes: { light: {…}, dark: {…} }` als Overrides
//   definieren. Der Editor zeigt einen Mode-Selector in der Toolbar.
//   - "Default"  bearbeitet die Top-Level-Vars (Basis-Werte).
//   - "Light"    bearbeitet Overrides die HA nur im Light-Mode anwendet.
//   - "Dark"     analog für Dark-Mode.
//   Im non-default-Mode startet eine nicht-im-Theme-stehende Plugin-Var
//   mit leerem Wert (= kein Override). Sobald der User einen Wert setzt,
//   landet er beim Save als Eintrag in `modes.<mode>.<var>`.
//   Live-Preview greift via :root unabhängig vom aktiven HA-Mode —
//   um den richtigen Kontext zu sehen, muss man HA selbst auf
//   Light/Dark umschalten.
//
// `disconnectedCallback` revertet sämtliche CSS-Overrides, damit man
// das Theme-Studio sauber verlassen kann ohne Phantom-Styles auf dem
// HA-Frontend.

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import {
  getActivePlugins,
  onActivePluginsChanged,
  getVariableMeta,
} from "../core/schema-registry";
import type { Category, VariableMeta } from "../core/types";
import type { HomeAssistant } from "../types";

import "./controls/color-picker";
import "./controls/length-slider";
import "./controls/raw-input";
import "./controls/background-picker";
import "./preview-pane";

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
  inTheme: boolean;
  /**
   * Welcher Mode-Bucket diese Row angehört: `"default"` für Top-Level,
   * oder ein Mode-Name aus `theme.modes` (z.B. `"light"`, `"dark"`).
   * Rows mit demselben varName aber unterschiedlichen modes sind
   * eigenständige Einträge (Top-Level-Wert vs. Override).
   */
  mode: string;
  /**
   * User hat den Trash-Button geklickt — die Variable wird beim
   * nächsten Save aus dem Theme-YAML entfernt. Bis dahin bleibt die
   * Row sichtbar (durchgestrichen) damit der User per Reset undo'en
   * kann.
   */
  markedForRemoval?: boolean;
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

const IN_THEME_TAB = "in-theme";
const DEFAULT_MODE = "default";

const MODE_LABELS: Record<string, string> = {
  default: "Default",
  light: "Light",
  dark: "Dark",
};

function modeLabel(mode: string): string {
  return MODE_LABELS[mode] ?? mode;
}

@customElement("ts-editor-view")
export class TsEditorView extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: String }) file = "";
  @property({ type: String }) themeName = "";

  @state() private _loading = true;
  @state() private _error: string | null = null;
  @state() private _rows: EditorRow[] = [];
  @state() private _skippedKeys: string[] = [];
  @state() private _saveStatus: SaveStatus = { state: "idle" };
  @state() private _activeTab: string = IN_THEME_TAB;
  @state() private _activeMode: string = DEFAULT_MODE;
  @state() private _modes: string[] = [DEFAULT_MODE];
  @state() private _showPreview = false;
  @state() private _previewSrc = "/lovelace/0";

  private _appliedVars = new Set<string>();
  private _originalFullTheme: Record<string, unknown> = {};
  private _unsubRegistry?: () => void;

  static override styles = css`
    :host {
      display: block;
      max-width: 1100px;
      margin: 0 auto;
      font-family: var(--paper-font-body1_-_font-family, "Roboto", sans-serif);
      transition: max-width 0.15s ease;
    }
    :host(.with-preview) {
      max-width: none;
    }
    .body-grid {
      display: block;
    }
    .body-grid.with-preview {
      display: grid;
      grid-template-columns: minmax(520px, 1fr) minmax(480px, 1fr);
      gap: 16px;
      align-items: start;
    }
    .editor-col,
    .preview-col {
      min-width: 0;
    }
    .preview-toggle {
      background: none;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 6px;
      padding: 8px 14px;
      cursor: pointer;
      color: inherit;
      font: inherit;
      font-size: 0.9rem;
    }
    .preview-toggle:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .preview-toggle.active {
      background: var(--primary-color);
      color: #fff;
      border-color: var(--primary-color);
    }
    .toolbar {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
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

    .mode-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 12px;
      flex-wrap: wrap;
    }
    .mode-bar .label {
      color: var(--secondary-text-color);
      font-size: 0.9rem;
      margin-right: 4px;
    }
    .mode-btn {
      padding: 5px 12px;
      background: none;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 999px;
      cursor: pointer;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 0.85rem;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .mode-btn:hover {
      color: var(--primary-text-color);
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.03));
    }
    .mode-btn.active {
      color: #fff;
      background: var(--primary-color);
      border-color: var(--primary-color);
    }
    .mode-btn .mode-count {
      font-size: 0.75rem;
      opacity: 0.8;
    }

    .tabs {
      display: flex;
      gap: 4px;
      margin: 0 0 16px;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      flex-wrap: wrap;
    }
    .tab {
      padding: 8px 14px;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 0.9rem;
      margin-bottom: -1px;
      display: flex;
      align-items: center;
      gap: 6px;
      border-radius: 6px 6px 0 0;
    }
    .tab:hover {
      color: var(--primary-text-color);
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.03));
    }
    .tab.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
      font-weight: 500;
    }
    .tab-count {
      padding: 1px 8px;
      border-radius: 10px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      font-size: 0.75rem;
      color: var(--secondary-text-color);
    }
    .tab.active .tab-count {
      background: var(--primary-color);
      color: #fff;
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
      grid-template-columns: minmax(220px, 320px) 1fr auto auto;
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
    .row-tag {
      display: inline-block;
      margin-left: 8px;
      padding: 1px 6px;
      border-radius: 8px;
      font-size: 0.7rem;
      font-family: var(--paper-font-body1_-_font-family);
      vertical-align: middle;
    }
    .row-tag.heuristic {
      background: rgba(0, 0, 0, 0.08);
      color: var(--secondary-text-color);
    }
    .row-tag.default {
      background: rgba(3, 169, 244, 0.12);
      color: var(--info-color, var(--primary-color));
    }
    .row-tag.adding {
      background: rgba(67, 160, 71, 0.15);
      color: var(--success-color, #43a047);
      font-weight: 500;
    }
    .row-tag.removing {
      background: rgba(219, 68, 55, 0.15);
      color: var(--error-color, #db4437);
      font-weight: 500;
    }
    .row.removed {
      background: linear-gradient(
        to right,
        rgba(219, 68, 55, 0.06) 0%,
        transparent 30%
      );
      margin: 0 -20px;
      padding-left: 20px;
      padding-right: 20px;
    }
    .row.removed .var-name,
    .row.removed .description {
      text-decoration: line-through;
      opacity: 0.55;
    }
    .row.removed .control-cell {
      opacity: 0.45;
      pointer-events: none;
    }
    .remove-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      font-size: 1rem;
      padding: 6px 8px;
      border-radius: 4px;
      line-height: 1;
    }
    .remove-btn:hover:not([disabled]) {
      background: rgba(219, 68, 55, 0.1);
      color: var(--error-color);
    }
    .remove-btn[disabled] {
      opacity: 0.2;
      cursor: not-allowed;
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
    // Tabs zeigen ggf. unterschiedliche Plugins nachdem HACS-Detection
    // durchgelaufen ist → re-rendern, wenn das passiert.
    this._unsubRegistry = onActivePluginsChanged(() => this.requestUpdate());
    this._load();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._unsubRegistry?.();
    this._unsubRegistry = undefined;
    this._revertAll();
  }

  override updated(changed: Map<string, unknown>) {
    const fileChanged =
      changed.has("file") && changed.get("file") !== undefined;
    const nameChanged =
      changed.has("themeName") && changed.get("themeName") !== undefined;
    if (fileChanged || nameChanged) {
      this._revertAll();
      this._rows = [];
      this._activeTab = IN_THEME_TAB;
      this._activeMode = DEFAULT_MODE;
      this._modes = [DEFAULT_MODE];
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

  /**
   * Baut Rows aus dem geladenen Theme. Top-Level-Vars werden Rows mit
   * `mode: "default"`. Wenn das Theme einen `modes:`-Block hat, werden
   * dessen verschachtelte Vars ebenfalls als Rows angelegt, mit der
   * jeweiligen Mode-Bezeichnung. Andere Dict-Keys (selten) werden
   * weiterhin in `_skippedKeys` registriert und beim Save 1:1 erhalten.
   */
  private _buildRows(vars: Record<string, unknown>) {
    const rows: EditorRow[] = [];
    const skipped: string[] = [];
    const detectedModes: string[] = [DEFAULT_MODE];

    for (const [key, val] of Object.entries(vars)) {
      if (val === null || val === undefined) continue;

      if (key === "modes" && typeof val === "object") {
        // modes: { light: {...}, dark: {...} }
        for (const [modeName, modeVars] of Object.entries(
          val as Record<string, unknown>,
        )) {
          if (typeof modeVars !== "object" || modeVars === null) continue;
          if (!detectedModes.includes(modeName)) detectedModes.push(modeName);
          for (const [mKey, mVal] of Object.entries(
            modeVars as Record<string, unknown>,
          )) {
            if (mVal === null || mVal === undefined) continue;
            if (typeof mVal === "object") continue;
            const mSval = String(mVal);
            const varName = mKey.startsWith("--") ? mKey : `--${mKey}`;
            const yamlKey = varName.slice(2);
            const meta = getVariableMeta(varName, mSval);
            rows.push({
              varName,
              yamlKey,
              meta,
              original: mSval,
              current: mSval,
              inTheme: true,
              mode: modeName,
            });
          }
        }
        continue;
      }

      if (typeof val === "object") {
        skipped.push(key);
        continue;
      }

      const sval = String(val);
      const varName = key.startsWith("--") ? key : `--${key}`;
      const yamlKey = varName.slice(2);
      const meta = getVariableMeta(varName, sval);
      rows.push({
        varName,
        yamlKey,
        meta,
        original: sval,
        current: sval,
        inTheme: true,
        mode: DEFAULT_MODE,
      });
    }

    this._skippedKeys = skipped;
    this._rows = rows;
    this._modes = detectedModes;
  }

  /**
   * Beim Wechsel auf einen Plugin-Tab: alle Vars dieses Plugins, die für
   * den aktuellen Mode noch nicht in `_rows` sind, anhängen.
   *
   * In `default`-Mode bekommen sie den Schema-Default als Initial-Wert.
   * In nicht-default-Modes bekommen sie leeren String — das signalisiert
   * "kein Override im jeweiligen Mode" und wird beim Save nicht
   * geschrieben.
   */
  private _ensurePluginRows(pluginId: string, mode: string) {
    const plugin = getActivePlugins().find((p) => p.manifest.id === pluginId);
    if (!plugin) return;
    const existing = new Set(
      this._rows.filter((r) => r.mode === mode).map((r) => r.varName),
    );
    const newRows: EditorRow[] = [];
    for (const v of plugin.schema.variables) {
      if (existing.has(v.name)) continue;
      const def = mode === DEFAULT_MODE ? v.default ?? "" : "";
      newRows.push({
        varName: v.name,
        yamlKey: v.name.startsWith("--") ? v.name.slice(2) : v.name,
        meta: { ...v, source: "schema", plugin: plugin.manifest.id },
        original: def,
        current: def,
        inTheme: false,
        mode,
      });
    }
    if (newRows.length > 0) {
      this._rows = [...this._rows, ...newRows];
    }
  }

  // ─── Save-Flow ──────────────────────────────────────────────────────

  private async _save() {
    const dirty = this._dirtyCount();
    if (dirty === 0 || this._saveStatus.state === "saving") return;

    const adding = this._rows.filter(
      (r) =>
        !r.inTheme &&
        !r.markedForRemoval &&
        r.current !== r.original &&
        r.current !== "",
    ).length;
    const modifying = this._rows.filter(
      (r) =>
        r.inTheme && !r.markedForRemoval && r.current !== r.original,
    ).length;
    const removing = this._removingCount();

    const parts: string[] = [];
    if (modifying > 0)
      parts.push(`${modifying} bestehende Änderung${modifying === 1 ? "" : "en"}`);
    if (adding > 0)
      parts.push(`${adding} neue Variable${adding === 1 ? "" : "n"}`);
    if (removing > 0)
      parts.push(`${removing} Entfernung${removing === 1 ? "" : "en"}`);
    const what = parts.join(" + ");

    const confirmMsg =
      `${what} in '${this.file}' > '${this.themeName}' speichern?\n\n` +
      `Ein Backup wird automatisch unter themes/.backups/ angelegt.`;
    if (!confirm(confirmMsg)) return;

    this._saveStatus = { state: "saving" };

    const merged = this._buildSaveMerge();

    try {
      const result =
        await this.hass.connection.sendMessagePromise<SaveThemeResult>({
          type: "theme_studio/save_theme",
          file: this.file,
          theme_name: this.themeName,
          variables: merged,
        });

      this._originalFullTheme = merged;
      // Post-save row state:
      //  - markedForRemoval-Rows komplett raus (sind nicht mehr im YAML).
      //  - inTheme-Rows: original = current (clean state).
      //  - non-inTheme-Rows mit echtem Wert: promote to inTheme.
      this._rows = this._rows
        .filter((r) => !r.markedForRemoval)
        .map((r) => {
          if (r.inTheme) {
            return { ...r, original: r.current };
          }
          if (r.current !== r.original && r.current !== "") {
            return { ...r, original: r.current, inTheme: true };
          }
          return r;
        });
      // Plugin-Tab: gerade entfernte Vars wieder als not-in-theme nachladen,
      // damit sie als "default"-Eintrag sofort wieder erscheinen.
      if (this._activeTab !== IN_THEME_TAB) {
        this._ensurePluginRows(this._activeTab, this._activeMode);
      }
      this._saveStatus = { state: "success", backup: result.backup };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this._saveStatus = { state: "error", msg };
    }
  }

  /**
   * Konstruiert das vollständige Theme-Object aus dem Original-YAML +
   * Editor-Zustand. Bewahrt Key-Form (mit/ohne `--`) und Dict-Strukturen.
   */
  private _buildSaveMerge(): Record<string, unknown> {
    const merged: Record<string, unknown> = {};
    const origModes =
      this._originalFullTheme["modes"] &&
      typeof this._originalFullTheme["modes"] === "object"
        ? (this._originalFullTheme["modes"] as Record<
            string,
            Record<string, unknown>
          >)
        : {};

    // 1. Top-Level (Default-Mode + andere Top-Level-Dict-Keys)
    const consumedDefault = new Set<string>();
    for (const [origKey, origVal] of Object.entries(this._originalFullTheme)) {
      if (origKey === "modes") continue; // separat behandelt
      if (typeof origVal === "object" && origVal !== null) {
        // andere Dict-Strukturen (selten) — 1:1 erhalten
        merged[origKey] = origVal;
        continue;
      }
      const normalized = origKey.startsWith("--") ? origKey.slice(2) : origKey;
      const row = this._rows.find(
        (r) =>
          r.mode === DEFAULT_MODE && r.inTheme && r.yamlKey === normalized,
      );
      if (row) {
        if (row.markedForRemoval) {
          // Variable wird beim Save entfernt — Key aus merged auslassen.
          consumedDefault.add(row.varName);
          continue;
        }
        merged[origKey] = row.current;
        consumedDefault.add(row.varName);
      } else {
        merged[origKey] = origVal;
      }
    }
    // Neue Default-Mode-Vars die der User über Plugin-Tab hinzugefügt hat
    for (const row of this._rows) {
      if (row.mode !== DEFAULT_MODE) continue;
      if (row.inTheme) continue;
      if (row.markedForRemoval) continue;
      if (row.current === row.original) continue;
      if (row.current === "") continue;
      if (consumedDefault.has(row.varName)) continue;
      merged[row.yamlKey] = row.current;
    }

    // 2. Modes-Dict rekonstruieren
    const nonDefaultModes = this._modes.filter((m) => m !== DEFAULT_MODE);
    if (nonDefaultModes.length > 0 || Object.keys(origModes).length > 0) {
      const newModes: Record<string, Record<string, unknown>> = {};
      const allModeNames = new Set([
        ...Object.keys(origModes),
        ...nonDefaultModes,
      ]);
      for (const modeName of allModeNames) {
        const origModeDict = origModes[modeName] || {};
        const newModeDict: Record<string, unknown> = {};
        const consumed = new Set<string>();

        for (const [k, v] of Object.entries(origModeDict)) {
          if (typeof v === "object" && v !== null) {
            // nested dict in mode — erhalten
            newModeDict[k] = v;
            continue;
          }
          const normalized = k.startsWith("--") ? k.slice(2) : k;
          const row = this._rows.find(
            (r) =>
              r.mode === modeName && r.inTheme && r.yamlKey === normalized,
          );
          if (row) {
            if (row.markedForRemoval) {
              consumed.add(row.varName);
              continue;
            }
            newModeDict[k] = row.current;
            consumed.add(row.varName);
          } else {
            newModeDict[k] = v;
          }
        }
        // Neue Vars für diesen Mode
        for (const row of this._rows) {
          if (row.mode !== modeName) continue;
          if (row.inTheme) continue;
          if (row.markedForRemoval) continue;
          if (row.current === row.original) continue;
          if (row.current === "") continue;
          if (consumed.has(row.varName)) continue;
          newModeDict[row.yamlKey] = row.current;
        }

        if (Object.keys(newModeDict).length > 0) {
          newModes[modeName] = newModeDict;
        }
      }
      if (Object.keys(newModes).length > 0) {
        merged["modes"] = newModes;
      }
    }

    return merged;
  }

  // ─── Kategorien-Gruppierung ─────────────────────────────────────────

  private _groupByCategory(rows: EditorRow[]): CategoryGroup[] {
    const known = new Map<string, Category>();
    for (const p of getActivePlugins()) {
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
    // Live-Preview unabhängig vom Mode applizieren — User muss HA selbst
    // auf passenden Mode schalten um den richtigen Kontext zu sehen.
    this._setCssVar(row.varName, value);
    this._rows = this._rows.map((r) =>
      r.varName === row.varName && r.mode === row.mode
        ? { ...r, current: value }
        : r,
    );
  }

  private _resetRow(row: EditorRow) {
    this._revertCssVar(row.varName);
    this._rows = this._rows.map((r) =>
      r.varName === row.varName && r.mode === row.mode
        ? { ...r, current: r.original, markedForRemoval: false }
        : r,
    );
  }

  private _removeRow(row: EditorRow) {
    if (!row.inTheme) return;
    // Live-Preview-Override entfernen (User soll sehen wie's nach Save aussieht)
    this._revertCssVar(row.varName);
    this._rows = this._rows.map((r) =>
      r.varName === row.varName && r.mode === row.mode
        ? { ...r, markedForRemoval: true }
        : r,
    );
  }

  private _resetAll() {
    const dirtyCount = this._dirtyCount();
    if (dirtyCount === 0) return;
    if (
      !confirm(
        `${dirtyCount} ungespeicherte Änderung(en) werden verworfen (über alle Modes und Tabs). Fortfahren?`,
      )
    ) {
      return;
    }
    this._revertAll();
    this._rows = this._rows.map((r) => ({
      ...r,
      current: r.original,
      markedForRemoval: false,
    }));
  }

  private _isRowDirty(r: EditorRow): boolean {
    return r.current !== r.original || r.markedForRemoval === true;
  }

  private _dirtyCount(): number {
    return this._rows.reduce(
      (sum, r) => sum + (this._isRowDirty(r) ? 1 : 0),
      0,
    );
  }

  private _modeDirtyCount(mode: string): number {
    return this._rows.reduce(
      (sum, r) => sum + (r.mode === mode && this._isRowDirty(r) ? 1 : 0),
      0,
    );
  }

  private _removingCount(): number {
    return this._rows.reduce(
      (sum, r) => sum + (r.markedForRemoval ? 1 : 0),
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

  // ─── Tab/Mode-Handling ──────────────────────────────────────────────

  private _onTabSelect(tabId: string) {
    if (tabId === this._activeTab) return;
    if (tabId !== IN_THEME_TAB) {
      this._ensurePluginRows(tabId, this._activeMode);
    }
    this._activeTab = tabId;
  }

  private _onModeSelect(mode: string) {
    if (mode === this._activeMode) return;
    if (this._activeTab !== IN_THEME_TAB) {
      this._ensurePluginRows(this._activeTab, mode);
    }
    this._activeMode = mode;
  }

  private _visibleRows(): EditorRow[] {
    const byMode = this._rows.filter((r) => r.mode === this._activeMode);
    if (this._activeTab === IN_THEME_TAB) {
      return byMode.filter((r) => r.inTheme);
    }
    return byMode.filter((r) => r.meta.plugin === this._activeTab);
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
          class="preview-toggle ${this._showPreview ? "active" : ""}"
          @click=${this._togglePreview}
          title="Live-Preview eines Dashboards in einem iframe daneben"
        >
          👁 Preview
        </button>
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
      ${this._renderModeBar()} ${this._renderTabs()}
      ${this._renderSaveStatus()}
      <div class="body-grid ${this._showPreview ? "with-preview" : ""}">
        <div class="editor-col">${this._renderBody()}</div>
        ${this._showPreview
          ? html`<div class="preview-col">
              <ts-preview-pane
                .src=${this._previewSrc}
                .overrides=${this._currentOverrides()}
                @src-changed=${this._onPreviewSrcChange}
              ></ts-preview-pane>
            </div>`
          : ""}
      </div>
    `;
  }

  private _togglePreview() {
    this._showPreview = !this._showPreview;
    this.classList.toggle("with-preview", this._showPreview);
  }

  private _onPreviewSrcChange(e: CustomEvent<{ src: string }>) {
    this._previewSrc = e.detail.src;
  }

  /**
   * Aktuelle CSS-Overrides als Map — alle Rows wo `current !== original`,
   * unabhängig vom Mode (Live-Preview ist mode-agnostisch).
   */
  private _currentOverrides(): Map<string, string> {
    const m = new Map<string, string>();
    for (const r of this._rows) {
      if (r.current !== r.original) {
        m.set(r.varName, r.current);
      }
    }
    return m;
  }

  private _renderModeBar() {
    if (this._loading || this._error) return "";
    // Wenn nur Default-Mode existiert UND der User nicht aktiv Modes
    // hinzufügen kann (kein Add-Mode-Button in v0.2.x), den Mode-Bar
    // ausblenden — kein Mehrwert.
    if (this._modes.length === 1) return "";
    return html`
      <div class="mode-bar">
        <span class="label">Mode:</span>
        ${this._modes.map((mode) => {
          const n = this._modeDirtyCount(mode);
          return html`
            <button
              class="mode-btn ${this._activeMode === mode ? "active" : ""}"
              @click=${() => this._onModeSelect(mode)}
            >
              ${modeLabel(mode)}
              ${n > 0
                ? html`<span class="mode-count">${n} ●</span>`
                : ""}
            </button>
          `;
        })}
      </div>
    `;
  }

  private _renderTabs() {
    if (this._loading || this._error) return "";
    const inThemeCount = this._rows.filter(
      (r) => r.inTheme && r.mode === this._activeMode,
    ).length;
    const tabs: Array<{ id: string; label: string; count: number }> = [
      { id: IN_THEME_TAB, label: "Im Theme", count: inThemeCount },
    ];
    for (const p of getActivePlugins()) {
      tabs.push({
        id: p.manifest.id,
        label: p.manifest.name,
        count: p.schema.variables.length,
      });
    }
    return html`
      <div class="tabs" role="tablist">
        ${tabs.map(
          (t) => html`
            <button
              class="tab ${this._activeTab === t.id ? "active" : ""}"
              role="tab"
              aria-selected=${this._activeTab === t.id}
              @click=${() => this._onTabSelect(t.id)}
            >
              ${t.label}
              <span class="tab-count">${t.count}</span>
            </button>
          `,
        )}
      </div>
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
      <div class="status-banner error">
        ✗ Speichern fehlgeschlagen: ${s.msg}
      </div>
    `;
  }

  private _renderDirtyBadge() {
    const n = this._dirtyCount();
    if (n === 0) return "";
    const adding = this._rows.filter(
      (r) =>
        !r.inTheme &&
        !r.markedForRemoval &&
        r.current !== r.original &&
        r.current !== "",
    ).length;
    const removing = this._removingCount();
    const parts: string[] = [];
    if (adding > 0) parts.push(`${adding} neu`);
    if (removing > 0) parts.push(`${removing} ×`);
    const suffix = parts.length > 0 ? ` (${parts.join(", ")})` : "";
    return html`<span class="dirty-badge"
      >${n} Änderung${n === 1 ? "" : "en"}${suffix}</span
    >`;
  }

  private _renderBody() {
    if (this._loading) {
      return html`<div class="loading">Lade Theme…</div>`;
    }
    if (this._error) {
      return html`<div class="error">Fehler: ${this._error}</div>`;
    }
    const rows = this._visibleRows();
    if (rows.length === 0) {
      const msg =
        this._activeTab === IN_THEME_TAB
          ? this._activeMode === DEFAULT_MODE
            ? "Keine editierbaren Variablen in diesem Theme."
            : `Keine Override-Variablen für Mode '${modeLabel(this._activeMode)}' im Theme. Wechsle auf einen Plugin-Tab um welche hinzuzufügen.`
          : "Keine Variablen in diesem Plugin-Tab.";
      return html`<div class="empty">${msg}</div>`;
    }
    const categories = this._groupByCategory(rows);
    return html`
      ${this._activeTab === IN_THEME_TAB &&
      this._activeMode === DEFAULT_MODE &&
      this._skippedKeys.length > 0
        ? html`<div class="notice">
            Diese Theme-Datei enthält komplexe Werte unter
            ${this._skippedKeys.map(
              (k, i) => html`${i > 0 ? ", " : ""}<code>${k}</code>`,
            )},
            die der Variablen-Editor nicht abbildet (verschachtelte
            Strukturen).
          </div>`
        : ""}
      ${this._activeMode !== DEFAULT_MODE
        ? html`<div class="notice">
            <strong>${modeLabel(this._activeMode)}-Mode:</strong> Edits hier
            landen unter <code>modes.${this._activeMode}</code> im YAML und
            wirken in HA nur wenn dieser Mode aktiv ist.
            Live-Preview greift dennoch unabhängig vom HA-Mode — schalte HA
            ggf. selbst um, um den richtigen Render-Kontext zu sehen.
          </div>`
        : ""}
      ${this._activeTab !== IN_THEME_TAB
        ? html`<div class="notice">
            <strong>Plugin-Tab:</strong> alle ${rows.length} Schema-Variablen
            werden gezeigt. Variablen mit
            <span class="row-tag default">default</span>-Tag stehen
            (noch) nicht im Theme. Sobald du einen Wert änderst, wird die
            Variable beim Speichern als
            ${this._activeMode === DEFAULT_MODE
              ? "Top-Level-Eintrag"
              : html`Override unter <code>modes.${this._activeMode}</code>`}
            ins Theme aufgenommen.
          </div>`
        : ""}
      ${categories.map((c) => this._renderCategory(c))}
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
    const valueDirty = row.current !== row.original;
    const isMarkedForRemoval = row.markedForRemoval === true;
    const isDirty = valueDirty || isMarkedForRemoval;
    const showDefaultTag = !row.inTheme && !valueDirty && !isMarkedForRemoval;
    const showAddingTag =
      !row.inTheme && valueDirty && row.current !== "" && !isMarkedForRemoval;
    const rowClasses = ["row"];
    if (valueDirty && !isMarkedForRemoval) rowClasses.push("dirty");
    if (isMarkedForRemoval) rowClasses.push("removed");
    return html`
      <div class=${rowClasses.join(" ")}>
        <div class="meta-cell">
          <code class="var-name">
            ${isDirty ? html`<span class="dirty-dot">●</span>` : ""}
            ${row.varName}
            ${row.meta.source === "heuristic"
              ? html`<span class="row-tag heuristic">${row.meta.type}</span>`
              : ""}
            ${showDefaultTag
              ? html`<span class="row-tag default">default</span>`
              : ""}
            ${showAddingTag
              ? html`<span class="row-tag adding">+ wird ergänzt</span>`
              : ""}
            ${isMarkedForRemoval
              ? html`<span class="row-tag removing">× wird entfernt</span>`
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
          title="Auf Original zurücksetzen (verwirft auch eine Entfernen-Markierung)"
        >
          ↺
        </button>
        <button
          class="remove-btn"
          ?disabled=${!row.inTheme || isMarkedForRemoval}
          @click=${() => this._removeRow(row)}
          title=${row.inTheme
            ? "Variable beim nächsten Speichern aus dem Theme entfernen"
            : "Nicht im Theme — nichts zu entfernen"}
        >
          🗑
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
      case "background":
        return html`
          <ts-background-picker
            .value=${row.current}
            @value-changed=${onChange}
          ></ts-background-picker>
        `;
      default:
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
