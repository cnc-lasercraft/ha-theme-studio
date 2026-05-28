// <ts-compare-view> — Side-by-side Diff von zwei Themes.
//
// Use-Case: User hat z.B. `visionos` und `Liquid Glass`, beide vom selben
// Stil-Ursprung. Will Werte alignieren. Compare-View zeigt Variablen aus
// beiden Themes nebeneinander, hebt Unterschiede hervor, und stellt
// Copy-Arrows bereit die direkt ins Ziel-YAML schreiben (mit Backup).
//
// v1.0.2: Mode-Selector — neben "default" (Top-Level) lassen sich Modes
// (light/dark/custom) separat vergleichen. Verfügbare Modes = Union der
// Modes aus A und B. Copy schreibt in die aktive Mode (default → Top-Level,
// sonst modes.<mode>.<key>); fehlende modes-Struktur wird automatisch angelegt.

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { t } from "../core/i18n";
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

type CopyStatus =
  | { state: "idle" }
  | { state: "copying" }
  | {
      state: "success";
      yamlKey: string;
      themeName: string;
      modeLabel: string;
      backup: string | null;
    }
  | { state: "error"; msg: string };

const DEFAULT_MODE = "default";

interface SideState {
  selection: ThemeEntry | null;
  full: Record<string, unknown>;
  /** Mode-Name → (yamlKey → string-Value). "default" = Top-Level. */
  scalarsByMode: Record<string, Record<string, string>>;
  modes: string[];
  loading: boolean;
  error: string | null;
}

const EMPTY_SIDE: SideState = {
  selection: null,
  full: {},
  scalarsByMode: { [DEFAULT_MODE]: {} },
  modes: [DEFAULT_MODE],
  loading: false,
  error: null,
};

@customElement("ts-compare-view")
export class TsCompareView extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;

  @state() private _themes: ThemeEntry[] = [];
  @state() private _themesError: string | null = null;
  @state() private _themesLoading = true;

  @state() private _sideA: SideState = this._freshSide();
  @state() private _sideB: SideState = this._freshSide();

  @state() private _diffOnly = true;
  @state() private _copyStatus: CopyStatus = { state: "idle" };
  @state() private _activeMode: string = DEFAULT_MODE;

  private get _busyCopy(): boolean {
    return this._copyStatus.state === "copying";
  }

  private _freshSide(): SideState {
    return {
      ...EMPTY_SIDE,
      scalarsByMode: { [DEFAULT_MODE]: {} },
      modes: [DEFAULT_MODE],
    };
  }

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
    .mode-selector {
      display: flex;
      gap: 4px;
      align-items: center;
      padding: 2px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      border-radius: 6px;
    }
    .mode-selector button {
      background: none;
      border: none;
      padding: 6px 12px;
      cursor: pointer;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 0.85rem;
      border-radius: 4px;
      transition: background 0.15s;
    }
    .mode-selector button:hover {
      background: rgba(0, 0, 0, 0.04);
      color: var(--primary-text-color);
    }
    .mode-selector button.active {
      background: var(--card-background-color);
      color: var(--primary-color);
      font-weight: 500;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
    }
    .mode-selector .badge-only {
      display: inline-block;
      margin-left: 6px;
      padding: 1px 5px;
      font-size: 0.7rem;
      background: rgba(3, 169, 244, 0.18);
      color: var(--primary-color);
      border-radius: 3px;
      letter-spacing: 0;
      text-transform: none;
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
    }
    .status-banner.success {
      background: rgba(67, 160, 71, 0.12);
      border-left: 4px solid var(--success-color, #43a047);
    }
    .status-banner.error {
      background: rgba(229, 57, 53, 0.12);
      border-left: 4px solid var(--error-color, #e53935);
    }
    .status-banner code {
      background: rgba(0, 0, 0, 0.06);
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 0.85rem;
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
      this._writeSide(side, this._freshSide());
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
      const scalarsByMode = this._extractScalarsByMode(result.variables);
      this._writeSide(side, {
        ...next,
        loading: false,
        full: result.variables,
        scalarsByMode,
        modes: Object.keys(scalarsByMode),
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

  /**
   * Liefert pro Mode (inkl. "default") die Scalars als yamlKey → string Map.
   * - "default" = Top-Level-Scalars (alles außer dem `modes`-Key)
   * - "light", "dark", … = Einträge aus theme.modes.<mode>
   *
   * Dicts/Arrays werden in beiden Fällen übersprungen — Compare-View
   * vergleicht nur skalare Werte.
   */
  private _extractScalarsByMode(
    vars: Record<string, unknown>,
  ): Record<string, Record<string, string>> {
    const out: Record<string, Record<string, string>> = {
      [DEFAULT_MODE]: {},
    };
    for (const [k, v] of Object.entries(vars)) {
      if (k === "modes" && v && typeof v === "object" && !Array.isArray(v)) {
        for (const [modeName, modeVars] of Object.entries(
          v as Record<string, unknown>,
        )) {
          if (!modeVars || typeof modeVars !== "object") continue;
          const bag: Record<string, string> = {};
          for (const [mk, mv] of Object.entries(
            modeVars as Record<string, unknown>,
          )) {
            if (mv === null || mv === undefined) continue;
            if (typeof mv === "object") continue;
            bag[mk] = String(mv);
          }
          out[modeName] = bag;
        }
        continue;
      }
      if (v === null || v === undefined) continue;
      if (typeof v === "object") continue;
      out[DEFAULT_MODE][k] = String(v);
    }
    return out;
  }

  /** Union der Modes aus A und B, "default" zuerst, Rest alphabetisch. */
  private _availableModes(): string[] {
    const set = new Set<string>([DEFAULT_MODE]);
    for (const m of this._sideA.modes) set.add(m);
    for (const m of this._sideB.modes) set.add(m);
    const rest = [...set].filter((m) => m !== DEFAULT_MODE).sort();
    return [DEFAULT_MODE, ...rest];
  }

  private _modeLabel(mode: string): string {
    if (mode === DEFAULT_MODE) return t("compare.mode_default");
    return mode.charAt(0).toUpperCase() + mode.slice(1);
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
      return html`<div class="loading">${t("picker.loading")}</div>`;
    }
    if (this._themesError) {
      return html`<div class="error">
        ${t("common.error_prefix")}: ${this._themesError}
      </div>`;
    }
    if (this._themes.length < 2) {
      return html`
        <div class="empty">
          ${t("compare.need_two_themes", undefined, {
            count: this._themes.length,
          })}
        </div>
      `;
    }

    return html`
      <div class="header">
        <div class="selector">
          <label>${t("compare.theme_a")}</label>
          ${this._renderSelector("A", this._sideA.selection)}
        </div>
        <div class="selector">
          <label>${t("compare.theme_b")}</label>
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
          <label for="diff-only">${t("compare.diff_only")}</label>
        </div>
      </div>
      ${this._renderModeSelector()} ${this._renderCopyStatus()}
      ${this._renderBody()}
    `;
  }

  private _renderCopyStatus() {
    const s = this._copyStatus;
    if (s.state === "idle" || s.state === "copying") return "";
    if (s.state === "success") {
      return html`
        <div class="status-banner success">
          ✓
          ${t("compare.copy_success", undefined, {
            key: s.yamlKey,
            theme: s.themeName,
            mode: s.modeLabel,
          })}${s.backup
            ? html` &middot; ${t("common.backup")}:
                <code>${s.backup}</code>`
            : ""}
        </div>
      `;
    }
    return html`
      <div class="status-banner error">
        ✗ ${t("compare.copy_failed")}: ${s.msg}
      </div>
    `;
  }

  private _renderModeSelector() {
    const modes = this._availableModes();
    // Bei nur "default" und keinen Modes in beiden Themes — Selector ausblenden.
    if (modes.length <= 1) return "";
    if (!modes.includes(this._activeMode)) {
      this._activeMode = DEFAULT_MODE;
    }
    return html`
      <div class="mode-selector">
        ${modes.map((m) => {
          const inA = this._sideA.modes.includes(m);
          const inB = this._sideB.modes.includes(m);
          const onlyOne = m !== DEFAULT_MODE && (!inA || !inB);
          const label = this._modeLabel(m);
          return html`
            <button
              class=${m === this._activeMode ? "active" : ""}
              @click=${() => (this._activeMode = m)}
              title=${onlyOne
                ? t("compare.mode_only_in", undefined, {
                    side: inA ? "A" : "B",
                  })
                : ""}
            >
              ${label}${onlyOne
                ? html`<span class="badge-only">${inA ? "A" : "B"}</span>`
                : ""}
            </button>
          `;
        })}
      </div>
    `;
  }

  private _renderSelector(side: Side, selection: ThemeEntry | null) {
    const value = selection
      ? `${selection.file}§§${selection.theme_name}`
      : "";
    return html`
      <select @change=${(e: Event) => this._onSelect(side, e)}>
        <option value="">${t("compare.no_theme")}</option>
        ${this._themes.map(
          (theme) => html`
            <option
              value="${theme.file}§§${theme.theme_name}"
              ?selected=${value === `${theme.file}§§${theme.theme_name}`}
            >
              ${theme.theme_name} (${theme.file})
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
      return html`<div class="loading">${t("compare.loading_theme")}</div>`;
    }
    if (a.error || b.error) {
      return html`<div class="error">
        ${a.error ? `A: ${a.error}` : ""} ${b.error ? `B: ${b.error}` : ""}
      </div>`;
    }
    if (!a.selection || !b.selection) {
      return html`<div class="empty">${t("compare.pick_both")}</div>`;
    }

    const mode = this._activeMode;
    const scalarsA = a.scalarsByMode[mode] ?? {};
    const scalarsB = b.scalarsByMode[mode] ?? {};
    const aHasMode = mode === DEFAULT_MODE || a.modes.includes(mode);
    const bHasMode = mode === DEFAULT_MODE || b.modes.includes(mode);
    const modeLabel = this._modeLabel(mode);

    const keys = Array.from(
      new Set([...Object.keys(scalarsA), ...Object.keys(scalarsB)]),
    ).sort();

    const rows = keys
      .map((k) => ({
        key: k,
        valA: scalarsA[k] ?? null,
        valB: scalarsB[k] ?? null,
      }))
      .filter((r) => {
        if (!this._diffOnly) return true;
        if (r.valA === null || r.valB === null) return true;
        return r.valA !== r.valB;
      });

    const totalDiffs = keys.reduce((sum, k) => {
      const av = scalarsA[k] ?? null;
      const bv = scalarsB[k] ?? null;
      if (av === null || bv === null) return sum + 1;
      return sum + (av !== bv ? 1 : 0);
    }, 0);

    const modeHint =
      mode === DEFAULT_MODE
        ? ""
        : !aHasMode || !bHasMode
          ? html` <em>
              ·
              ${t("compare.mode_missing_hint", undefined, {
                theme: aHasMode ? b.selection.theme_name : a.selection.theme_name,
                mode: modeLabel,
              })}
            </em>`
          : "";

    return html`
      <div class="summary">
        <strong>${t("compare.mode_label", undefined, { mode: modeLabel })}:</strong>
        ${t("compare.summary", undefined, {
          themeA: a.selection.theme_name,
          countA: Object.keys(scalarsA).length,
          themeB: b.selection.theme_name,
          countB: Object.keys(scalarsB).length,
        })}
        <strong
          >${t("compare.summary_diffs", undefined, { n: totalDiffs })}</strong
        >${modeHint}
      </div>
      ${rows.length === 0
        ? html`<div class="empty">
            ${t("compare.no_diffs", undefined, { mode: modeLabel })}
          </div>`
        : html`
            <table>
              <thead>
                <tr>
                  <th class="var-cell">${t("compare.col_variable")}</th>
                  <th class="val-cell">${a.selection.theme_name}</th>
                  <th class="actions">${t("compare.col_action")}</th>
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
              ? t("compare.copy_no_value", undefined, { side: "B" })
              : t("compare.copy_tooltip", undefined, {
                  from: this._sideB.selection?.theme_name ?? "",
                  to: this._sideA.selection?.theme_name ?? "",
                })}
            @click=${() => this._copy("B", "A", key, valB!)}
          >
            ←
          </button>
          <button
            class="copy-btn"
            ?disabled=${!canCopyAtoB || this._busyCopy}
            title=${valA === null
              ? t("compare.copy_no_value", undefined, { side: "A" })
              : t("compare.copy_tooltip", undefined, {
                  from: this._sideA.selection?.theme_name ?? "",
                  to: this._sideB.selection?.theme_name ?? "",
                })}
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
    if (v === null) return html`${t("compare.not_in_theme")}`;
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

    const mode = this._activeMode;
    const modeLabel = this._modeLabel(mode);
    const isDefault = mode === DEFAULT_MODE;
    const targetMissingMode = !isDefault && !target.modes.includes(mode);

    const confirmMsg = t("compare.copy_confirm", undefined, {
      key: yamlKey,
      value,
      from: source.selection.theme_name,
      to: target.selection.theme_name,
      file: target.selection.file,
      mode:
        modeLabel +
        (targetMissingMode ? ` ${t("compare.copy_confirm_new_mode")}` : ""),
    });
    if (!confirm(confirmMsg)) return;

    this._copyStatus = { state: "copying" };

    const merged = this._mergeValue(target.full, mode, yamlKey, value);

    try {
      const result =
        await this.hass.connection.sendMessagePromise<SaveThemeResult>({
          type: "theme_studio/save_theme",
          file: target.selection.file,
          theme_name: target.selection.theme_name,
          variables: merged,
        });
      void this._setSide(to, target.selection);
      this._copyStatus = {
        state: "success",
        yamlKey,
        themeName: target.selection.theme_name,
        modeLabel,
        backup: result.backup,
      };
    } catch (err) {
      this._copyStatus = {
        state: "error",
        msg: err instanceof Error ? err.message : String(err),
      };
    }
  }

  /**
   * Liefert ein neues Theme-Dict mit `yamlKey = value` in der gewählten Mode.
   * - mode = "default" → Top-Level
   * - sonst → modes.<mode>.<yamlKey>, modes/Submode werden bei Bedarf angelegt
   * Original-Key-Form (mit/ohne `--`-Prefix) bleibt erhalten falls schon da.
   */
  private _mergeValue(
    full: Record<string, unknown>,
    mode: string,
    yamlKey: string,
    value: string,
  ): Record<string, unknown> {
    const merged: Record<string, unknown> = { ...full };
    const matchKey = (bag: Record<string, unknown>) => {
      const existing = Object.keys(bag).find((k) => {
        const norm = k.startsWith("--") ? k.slice(2) : k;
        return norm === yamlKey;
      });
      return existing ?? yamlKey;
    };

    if (mode === DEFAULT_MODE) {
      merged[matchKey(merged)] = value;
      return merged;
    }

    const modesRaw = merged["modes"];
    const modes: Record<string, Record<string, unknown>> =
      modesRaw && typeof modesRaw === "object" && !Array.isArray(modesRaw)
        ? { ...(modesRaw as Record<string, Record<string, unknown>>) }
        : {};
    const subRaw = modes[mode];
    const sub: Record<string, unknown> =
      subRaw && typeof subRaw === "object" && !Array.isArray(subRaw)
        ? { ...subRaw }
        : {};
    sub[matchKey(sub)] = value;
    modes[mode] = sub;
    merged["modes"] = modes;
    return merged;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ts-compare-view": TsCompareView;
  }
}
