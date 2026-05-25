// <ts-preview-pane> — eingebetteter Lovelace-Dashboard-View neben dem
// Editor, mit Live-Theme-Preview via Same-Origin-CSS-Override.
//
// Weil wir innerhalb desselben Origins (HA-Frontend) sind, können wir
// direkt auf `iframe.contentDocument.documentElement.style` zugreifen
// und CSS-Variablen setzen — wie auf unserem eigenen :root. Kein
// postMessage-Kanal nötig.
//
// Bei jedem `load`-Event des iframes (initiale Ladung, manueller
// Reload, User-Navigation innerhalb des Dashboards) werden die aktuell
// gesetzten Overrides neu appliziert. Damit überleben Preview-Edits
// auch eine Dashboard-Navigation innerhalb des iframes.

import { LitElement, html, css } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

@customElement("ts-preview-pane")
export class TsPreviewPane extends LitElement {
  @property({ type: String }) src = "/lovelace/0";
  @property({ attribute: false }) overrides: Map<string, string> = new Map();

  @query("iframe") private _iframe?: HTMLIFrameElement;
  @state() private _loaded = false;
  @state() private _loadError: string | null = null;

  /** Set der Var-Namen, die wir aktuell auf das iframe-:root gesetzt haben. */
  private _appliedToFrame = new Set<string>();

  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 600px;
      background: var(--card-background-color);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.08));
      overflow: hidden;
      position: sticky;
      top: 12px;
      max-height: calc(100vh - 24px);
    }
    .toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.03));
    }
    .toolbar .label {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
    }
    .toolbar input[type="text"] {
      flex: 1;
      min-width: 0;
      padding: 4px 8px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: 0.85rem;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .toolbar button {
      background: none;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      padding: 4px 10px;
      cursor: pointer;
      color: inherit;
      font: inherit;
      font-size: 0.85rem;
    }
    .toolbar button:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .badge {
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.75rem;
      background: var(--primary-color);
      color: #fff;
    }
    iframe {
      flex: 1;
      width: 100%;
      border: none;
      background: var(--primary-background-color);
    }
    .error {
      padding: 16px;
      color: var(--error-color);
      font-size: 0.9rem;
    }
  `;

  override render() {
    return html`
      <div class="toolbar">
        <span class="label">Preview:</span>
        <input
          type="text"
          .value=${this.src}
          @change=${this._onSrcChange}
          spellcheck="false"
          autocomplete="off"
        />
        <button @click=${this._reload} title="iframe neu laden">↻</button>
        ${this._appliedToFrame.size > 0
          ? html`<span class="badge"
              >${this._appliedToFrame.size} override${this._appliedToFrame
                .size === 1
                ? ""
                : "s"}</span
            >`
          : ""}
      </div>
      ${this._loadError
        ? html`<div class="error">${this._loadError}</div>`
        : ""}
      <iframe src=${this.src} @load=${this._onLoad}></iframe>
    `;
  }

  private _onLoad() {
    this._loaded = true;
    this._loadError = null;
    // Re-applizieren — jedes load-Event setzt das iframe-:root zurück
    this._appliedToFrame.clear();
    this._applyOverrides();
  }

  private _onSrcChange(e: Event) {
    const newSrc = (e.target as HTMLInputElement).value.trim();
    if (newSrc && newSrc !== this.src) {
      this.src = newSrc;
      this._loaded = false;
    }
  }

  private _reload() {
    if (this._iframe) {
      this._loaded = false;
      // Force reload — assign src to itself
      this._iframe.src = this._iframe.src;
    }
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("overrides") && this._loaded) {
      this._applyOverrides();
    }
  }

  private _applyOverrides() {
    if (!this._iframe?.contentDocument) return;
    const root = this._iframe.contentDocument.documentElement;
    // Entferne Overrides, die nicht mehr im Map sind
    for (const v of this._appliedToFrame) {
      if (!this.overrides.has(v)) {
        try {
          root.style.removeProperty(v);
        } catch {
          // ignore — cross-origin or detached doc
        }
        this._appliedToFrame.delete(v);
      }
    }
    // Setze aktuelle Overrides
    try {
      for (const [varName, value] of this.overrides) {
        root.style.setProperty(varName, value);
        this._appliedToFrame.add(varName);
      }
    } catch (err) {
      this._loadError =
        "iframe-CSS-Override fehlgeschlagen (möglicherweise Cross-Origin): " +
        (err instanceof Error ? err.message : String(err));
    }
    // Re-render damit das Override-Badge die aktuelle Zahl zeigt
    this.requestUpdate();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ts-preview-pane": TsPreviewPane;
  }
}
