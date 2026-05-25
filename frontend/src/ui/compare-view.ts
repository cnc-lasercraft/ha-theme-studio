// <ts-compare-view> — Side-by-side Diff von zwei Themes.
//
// Use-Case: User hat z.B. `visionos` und `Liquid Glass`, beide vom selben
// Stil-Ursprung. Will Werte alignieren. Compare-View zeigt Variablen aus
// beiden Themes nebeneinander, hebt Unterschiede hervor, und stellt
// Copy-Arrows bereit die direkt ins Ziel-YAML schreiben (mit Backup).
//
// Scope für v0.4 MVP:
// - Nur Top-Level-Vars (Default-Mode). Modes light/dark werden ignoriert.
// - Read-only Anzeige (keine inline-Controls) — Edit-Workflow geht weiter
//   via Single-Theme-Editor.
// - Copy ist eine atomare Operation: ein Klick = confirm + sofortiger
//   `theme_studio/save_theme` mit overwrittenem Wert + Re-Load.

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { getVariableMeta } from "../core/schema-registry";
import type { HomeAssistant } from "../types";

interface ThemeEntry {
  file: string;
  theme_name: string;
  variable_count: number;
}

interface ListThemesResult {
  themes: ThemeEntry[];
  errors: unknown[];
}

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

type Side = "A" | "B";

interface SideState {
  selection: ThemeEntry | null;
  full: Record<string, unknown>;
  scalars: Record<string, string>;
  loading: boolean;
  error: string | null;
}

const EMPTY_SIDE: SideState = {
  selection: null,
  full: {},
  scalars: {},
  loading: false,
  error: null,
};

@customElement("ts-compare-view")
export class TsCompareView extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;

  @state() private _themes: ThemeEntry[] = [];
  @state() private _themesError: string | null = null;
  @state() private _themesLoading = true;

  @state() private _sideA: SideState = { ...EMPTY_SIDE };
  @state() private _sideB: SideState = { ...EMPTY_SIDE };

  @state() private _diffOnly = true;
  @state() private _busyCopy = false;
  @state() private _copyStatus: string | null = null;

  static override styles = css`
    :host {
      display: block;
      max-width: 1200px;
      margin: 0 auto;
      font-family: var(--paper-font-body1_-_font-family, "Roboto", sans-serif);
    }
    .header {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 16px;
      align-items: flex-end;
    }
    .selector {
      flex: 1;
      min-width: 240px;
    }
    .selector label {
      display: block;
      font-size: 0.85rem;
      color: var(--secondary-text-color);
      margin-bottom: 4px;
    }
    .selector select {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 0.9rem;
    }
    .filter {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--secondary-text-color);
      font-size: 0.9rem;
    }
    .filter input[type="checkbox"] {
      transform: scale(1.2);
    }
    .empty,
    .error,
    .loading {
      padding: 32px;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .error {
      color: var(--error-color);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--card-background-color);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.08));
      overflow: hidden;
    }
    th,
    td {
      padding: 10px 14px;
      text-align: left;
      vertical-align: top;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
      font-size: 0.88rem;
    }
    th {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.03));
      color: var(--secondary-text-color);
      font-weight: 500;
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .var-cell {
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: 0.85rem;
      width: 30%;
    }
    .val-cell {
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      color: var(--primary-text-color);
      word-break: break-all;
      width: 28%;
    }
    .val-cell.missing {
      color: var(--secondary-text-color);
      font-style: italic;
    }
    .val-cell .swatch {
      display: inline-block;
      width: 14px;
      height: 14px;
      vertical-align: middle;
      margin-right: 6px;
      border-radius: 3px;
      border: 1px solid var(--divider-color);
    }
    .row.diff td {
      background: rgba(255, 166, 0, 0.05);
    }
    .row.only-a,
    .row.only-b {
      background: rgba(3, 169, 244, 0.04);
    }
    .actions {
      display: flex;
      gap: 4px;
      justify-content: center;
      width: 80px;
    }
    .copy-btn {
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      padding: 3px 9px;
      cursor: pointer;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 1rem;
      line-height: 1;
    }
    .copy-btn:hover:not([disabled]) {
      background: rgba(3, 169, 244, 0.12);
      color: var(--primary-color);
      border-color: var(--primary-color);
    }
    .copy-btn[disabled] {
      opacity: 0.25;
      cursor: not-allowed;
    }
    .description {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      margin-top: 4px;
      opacity: 0.85;
    }
    .summary {
      margin-bottom: 12px;
      font-size: 0.9rem;
      color: var(--secondary-text-color);
    }
    .status-banner {
      padding: 10px 14px;
      border-radius: 4px;
      margin-bottom: 12px;
      font-size: 0.9rem;
      background: rgba(67, 160, 71, 0.12);
      border-left: 4px solid var(--success-color, #43a047);
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    void this._loadThemes();
  }

  private async _loadThemes() {
    this._themesLoading = true;
    this._themesError = null;
    try {
      const result =
        await this.hass.connection.sendMessagePromise<ListThemesResult>({
          type: "theme_studio/list_themes",
        });
      this._themes = result.themes;
      // Auto-select first two themes wenn vorhanden — quick start
      if (this._themes.length >= 1 && !this._sideA.selection) {
        await this._setSide("A", this._themes[0]);
      }
      if (this._themes.length >= 2 && !this._sideB.selection) {
        await this._setSide("B", this._themes[1]);
      }
    } catch (err) {
      this._themesError = err instanceof Error ? err.message : String(err);
    } finally {
      this._themesLoading = false;
    }
  }

  private async _setSide(side: Side, entry: ThemeEntry | null) {
    const current = side === "A" ? this._sideA : this._sideB;
    const next: SideState = { ...current, selection: entry };
    this._writeSide(side, next);
    if (!entry) {
      this._writeSide(side, { ...EMPTY_SIDE });
      return;
    }
    this._writeSide(side, { ...next, loading: true, error: null });
    try {
      const result =
        await this.hass.connection.sendMessagePromise<GetThemeResult>({
          type: "theme_studio/get_theme",
          file: entry.file,
          theme_name: entry.theme_name,
        });
      this._writeSide(side, {
        ...next,
        loading: false,
        full: result.variables,
        scalars: this._extractScalars(result.variables),
      });
    } catch (err) {
      this._writeSide(side, {
        ...next,
        loading: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  private _writeSide(side: Side, value: SideState) {
    if (side === "A") this._sideA = value;
    else this._sideB = value;
  }

  /** Top-Level-Scalars als yamlKey → string Map (modes etc. werden übersprungen). */
  private _extractScalars(vars: Record<string, unknown>): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(vars)) {
      if (v === null || v === undefined) continue;
      if (typeof v === "object") continue;
      out[k] = String(v);
    }
    return out;
  }

  private _onSelect(side: Side, e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    if (!value) {
      void this._setSide(side, null);
      return;
    }
    const [file, theme_name] = value.split("§§");
    const entry = this._themes.find(
      (t) => t.file === file && t.theme_name === theme_name,
    );
    if (entry) {
      void this._setSide(side, entry);
    }
  }

  override render() {
    if (this._themesLoading) {
      return html`<div class="loading">Lade Themes…</div>`;
    }
    if (this._themesError) {
      return html`<div class="error">Fehler: ${this._themesError}</div>`;
    }
    if (this._themes.length < 2) {
      return html`
        <div class="empty">
          Theme-Switcher braucht mindestens 2 Themes im
          <code>themes/</code>-Verzeichnis (aktuell ${this._themes.length}).
        </div>
      `;
    }

    return html`
      <div class="header">
        <div class="selector">
          <label>Theme A</label>
          ${this._renderSelector("A", this._sideA.selection)}
        </div>
        <div class="selector">
          <label>Theme B</label>
          ${this._renderSelector("B", this._sideB.selection)}
        </div>
        <div class="filter">
          <input
            id="diff-only"
            type="checkbox"
            .checked=${this._diffOnly}
            @change=${(e: Event) =>
              (this._diffOnly = (e.target as HTMLInputElement).checked)}
          />
          <label for="diff-only">Nur Unterschiede</label>
        </div>
      </div>
      ${this._copyStatus
        ? html`<div class="status-banner">${this._copyStatus}</div>`
        : ""}
      ${this._renderBody()}
    `;
  }

  private _renderSelector(side: Side, selection: ThemeEntry | null) {
    const value = selection
      ? `${selection.file}§§${selection.theme_name}`
      : "";
    return html`
      <select @change=${(e: Event) => this._onSelect(side, e)}>
        <option value="">(kein Theme)</option>
        ${this._themes.map(
          (t) => html`
            <option
              value="${t.file}§§${t.theme_name}"
              ?selected=${value === `${t.file}§§${t.theme_name}`}
            >
              ${t.theme_name} (${t.file})
            </option>
          `,
        )}
      </select>
    `;
  }

  private _renderBody() {
    const a = this._sideA;
    const b = this._sideB;
    if (a.loading || b.loading) {
      return html`<div class="loading">Lade Theme-Inhalt…</div>`;
    }
    if (a.error || b.error) {
      return html`<div class="error">
        ${a.error ? `A: ${a.error}` : ""} ${b.error ? `B: ${b.error}` : ""}
      </div>`;
    }
    if (!a.selection || !b.selection) {
      return html`<div class="empty">Wähle beide Themes oben aus.</div>`;
    }

    const keys = Array.from(
      new Set([...Object.keys(a.scalars), ...Object.keys(b.scalars)]),
    ).sort();

    const rows = keys
      .map((k) => ({
        key: k,
        valA: a.scalars[k] ?? null,
        valB: b.scalars[k] ?? null,
      }))
      .filter((r) => {
        if (!this._diffOnly) return true;
        if (r.valA === null || r.valB === null) return true;
        return r.valA !== r.valB;
      });

    const totalDiffs = keys.reduce((sum, k) => {
      const av = a.scalars[k] ?? null;
      const bv = b.scalars[k] ?? null;
      if (av === null || bv === null) return sum + 1;
      return sum + (av !== bv ? 1 : 0);
    }, 0);

    return html`
      <div class="summary">
        ${a.selection.theme_name} hat ${Object.keys(a.scalars).length}
        Top-Level-Vars, ${b.selection.theme_name}
        hat ${Object.keys(b.scalars).length}. Insgesamt
        <strong>${totalDiffs} Unterschiede</strong> oder einseitige Einträge.
      </div>
      ${rows.length === 0
        ? html`<div class="empty">
            Keine Unterschiede zwischen den Themes auf Top-Level (modes nicht
            betrachtet).
          </div>`
        : html`
            <table>
              <thead>
                <tr>
                  <th class="var-cell">Variable</th>
                  <th class="val-cell">${a.selection.theme_name}</th>
                  <th class="actions">Aktion</th>
                  <th class="val-cell">${b.selection.theme_name}</th>
                </tr>
              </thead>
              <tbody>
                ${rows.map((r) => this._renderRow(r.key, r.valA, r.valB))}
              </tbody>
            </table>
          `}
    `;
  }

  private _renderRow(key: string, valA: string | null, valB: string | null) {
    const varName = key.startsWith("--") ? key : `--${key}`;
    const meta = getVariableMeta(varName, valA ?? valB ?? undefined);
    const onlyA = valA !== null && valB === null;
    const onlyB = valB !== null && valA === null;
    const diff = !onlyA && !onlyB && valA !== valB;
    const rowClass = [
      "row",
      onlyA ? "only-a" : "",
      onlyB ? "only-b" : "",
      diff ? "diff" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const canCopyAtoB = valA !== null && valA !== valB;
    const canCopyBtoA = valB !== null && valB !== valA;
    return html`
      <tr class=${rowClass}>
        <td class="var-cell">
          ${varName}
          ${meta.description
            ? html`<div class="description">${meta.description}</div>`
            : ""}
        </td>
        <td class=${`val-cell ${valA === null ? "missing" : ""}`}>
          ${this._renderValue(valA)}
        </td>
        <td class="actions">
          <button
            class="copy-btn"
            ?disabled=${!canCopyBtoA || this._busyCopy}
            title=${valB === null
              ? "B hat keinen Wert"
              : `Wert von B nach A kopieren (${this._sideB.selection?.theme_name} → ${this._sideA.selection?.theme_name})`}
            @click=${() => this._copy("B", "A", key, valB!)}
          >
            ←
          </button>
          <button
            class="copy-btn"
            ?disabled=${!canCopyAtoB || this._busyCopy}
            title=${valA === null
              ? "A hat keinen Wert"
              : `Wert von A nach B kopieren (${this._sideA.selection?.theme_name} → ${this._sideB.selection?.theme_name})`}
            @click=${() => this._copy("A", "B", key, valA!)}
          >
            →
          </button>
        </td>
        <td class=${`val-cell ${valB === null ? "missing" : ""}`}>
          ${this._renderValue(valB)}
        </td>
      </tr>
    `;
  }

  private _renderValue(v: string | null) {
    if (v === null) return html`(nicht im Theme)`;
    const isColor = /^#[0-9a-f]{3,8}$/i.test(v) || /^(rgba?|hsla?)\(/i.test(v);
    return isColor
      ? html`<span class="swatch" style="background: ${v}"></span>${v}`
      : html`${v}`;
  }

  private async _copy(
    from: Side,
    to: Side,
    yamlKey: string,
    value: string,
  ) {
    const source = from === "A" ? this._sideA : this._sideB;
    const target = to === "A" ? this._sideA : this._sideB;
    if (!source.selection || !target.selection) return;

    const confirmMsg =
      `Kopieren: '${yamlKey}' = '${value}' ` +
      `von ${source.selection.theme_name} ` +
      `nach ${target.selection.theme_name} ` +
      `(${target.selection.file})?\n\n` +
      `Ein Backup von ${target.selection.file} wird automatisch angelegt.`;
    if (!confirm(confirmMsg)) return;

    this._busyCopy = true;
    this._copyStatus = null;

    // Merge: vollständiges Target-Theme nehmen, eine Variable
    // überschreiben. Original-Key-Form (mit/ohne `--`) bewahren wenn
    // schon vorhanden, sonst frisch ohne `--`-Prefix anlegen.
    const merged: Record<string, unknown> = { ...target.full };
    const existingKey = Object.keys(target.full).find((k) => {
      const norm = k.startsWith("--") ? k.slice(2) : k;
      return norm === yamlKey;
    });
    const targetKey = existingKey ?? yamlKey;
    merged[targetKey] = value;

    try {
      const result =
        await this.hass.connection.sendMessagePromise<SaveThemeResult>({
          type: "theme_studio/save_theme",
          file: target.selection.file,
          theme_name: target.selection.theme_name,
          variables: merged,
        });
      // Re-load target side so the view reflects the new state.
      const reloaded = target.selection;
      this._writeSide(to, { ...target, full: merged, scalars: this._extractScalars(merged) });
      void this._setSide(to, reloaded);
      this._copyStatus =
        `✓ ${yamlKey} kopiert nach ${target.selection.theme_name}` +
        (result.backup ? ` · Backup: ${result.backup}` : "");
    } catch (err) {
      this._copyStatus = `✗ Kopieren fehlgeschlagen: ${
        err instanceof Error ? err.message : String(err)
      }`;
    } finally {
      this._busyCopy = false;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ts-compare-view": TsCompareView;
  }
}
