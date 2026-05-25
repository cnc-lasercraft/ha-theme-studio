// <ts-controls-demo> — Manuelle Test-Seite für die Controls aus Step 5.
//
// Mounten via URL-Hash `#demo` (siehe panel-main.ts). Zeigt jede Control
// mit mehreren Beispielwerten + ein Event-Log, in das jedes
// `value-changed` einläuft. So lässt sich live verifizieren, dass die
// Controls Events korrekt feuern.
//
// Diese Datei darf bleiben, auch wenn Step 7 den echten Editor bringt —
// als Reference und Smoke-Test.

import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import "./color-picker";
import "./length-slider";
import "./raw-input";

interface LogEntry {
  tag: string;
  label: string;
  value: string;
  at: string;
}

@customElement("ts-controls-demo")
export class TsControlsDemo extends LitElement {
  @state() private _log: LogEntry[] = [];

  static override styles = css`
    :host {
      display: block;
      max-width: 720px;
      margin: 0 auto;
      font-family: var(--paper-font-body1_-_font-family, "Roboto", sans-serif);
    }
    h2 {
      font-weight: 400;
      margin: 0 0 16px;
    }
    section {
      background: var(--card-background-color);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.08));
      padding: 20px;
      margin-bottom: 16px;
    }
    section h3 {
      margin: 0 0 16px;
      font-size: 1rem;
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      color: var(--primary-color);
    }
    .row {
      display: grid;
      grid-template-columns: 220px 1fr;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }
    .row:last-child {
      margin-bottom: 0;
    }
    .row label {
      font-size: 0.9rem;
      color: var(--secondary-text-color);
    }
    .log {
      max-height: 240px;
      overflow-y: auto;
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: 0.8rem;
    }
    .log .empty {
      color: var(--secondary-text-color);
      font-style: italic;
    }
    .log-entry {
      display: grid;
      grid-template-columns: 80px 180px 1fr;
      gap: 8px;
      padding: 4px 0;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    }
    .log-entry .at {
      color: var(--secondary-text-color);
    }
    .log-entry .tag {
      color: var(--primary-color);
    }
    .clear-btn {
      margin-top: 8px;
      padding: 4px 10px;
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      cursor: pointer;
      color: inherit;
      font: inherit;
      font-size: 0.85rem;
    }
  `;

  override render() {
    return html`
      <h2>Controls Demo (Step 5 — Smoke-Test)</h2>

      <section>
        <h3>&lt;ts-color-picker&gt;</h3>
        <div class="row">
          <label>Hex:</label>
          <ts-color-picker
            value="#03a9f4"
            @value-changed=${(e: CustomEvent) => this._onChange(e, "Hex")}
          ></ts-color-picker>
        </div>
        <div class="row">
          <label>RGBA mit Alpha:</label>
          <ts-color-picker
            value="rgba(255, 152, 0, 0.5)"
            @value-changed=${(e: CustomEvent) => this._onChange(e, "RGBA")}
          ></ts-color-picker>
        </div>
        <div class="row">
          <label>var-Reference:</label>
          <ts-color-picker
            value="var(--primary-color)"
            @value-changed=${(e: CustomEvent) => this._onChange(e, "Var-Ref")}
          ></ts-color-picker>
        </div>
      </section>

      <section>
        <h3>&lt;ts-length-slider&gt;</h3>
        <div class="row">
          <label>Border-Radius (px nur):</label>
          <ts-length-slider
            value="12px"
            min="0"
            max="40"
            step="1"
            .units=${["px"]}
            @value-changed=${(e: CustomEvent) =>
              this._onChange(e, "Radius (px)")}
          ></ts-length-slider>
        </div>
        <div class="row">
          <label>Spacing (px / rem):</label>
          <ts-length-slider
            value="0.75rem"
            min="0"
            max="5"
            step="0.05"
            .units=${["px", "rem"]}
            @value-changed=${(e: CustomEvent) =>
              this._onChange(e, "Spacing (px/rem)")}
          ></ts-length-slider>
        </div>
      </section>

      <section>
        <h3>&lt;ts-raw-input&gt;</h3>
        <div class="row">
          <label>Box-Shadow:</label>
          <ts-raw-input
            value="0 2px 4px rgba(0, 0, 0, 0.12)"
            @value-changed=${(e: CustomEvent) => this._onChange(e, "Shadow")}
          ></ts-raw-input>
        </div>
        <div class="row">
          <label>Kurzer Wert:</label>
          <ts-raw-input
            value="bold"
            @value-changed=${(e: CustomEvent) => this._onChange(e, "Raw kurz")}
          ></ts-raw-input>
        </div>
      </section>

      <section>
        <h3>Event-Log (value-changed)</h3>
        <div class="log">
          ${this._log.length === 0
            ? html`<div class="empty">
                Noch keine Events — interagiere mit den Controls oben.
              </div>`
            : this._log.map(
                (e) => html`
                  <div class="log-entry">
                    <span class="at">${e.at}</span>
                    <span class="tag">${e.label}</span>
                    <span class="value">${e.value}</span>
                  </div>
                `,
              )}
        </div>
        <button class="clear-btn" @click=${this._clear}>Log leeren</button>
      </section>
    `;
  }

  private _onChange(e: CustomEvent<{ value: string }>, label: string) {
    const tag = (e.target as HTMLElement).tagName.toLowerCase();
    const at = new Date().toLocaleTimeString();
    this._log = [{ tag, label, value: e.detail.value, at }, ...this._log].slice(
      0,
      30,
    );
  }

  private _clear() {
    this._log = [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ts-controls-demo": TsControlsDemo;
  }
}
