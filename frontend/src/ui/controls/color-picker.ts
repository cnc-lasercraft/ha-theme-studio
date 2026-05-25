// <ts-color-picker> — Swatch + nativer Color-Picker + Text-Input.
//
// Akzeptiert beliebige CSS-Color-Werte: #rgb, #rrggbb, #rrggbbaa, rgb(...),
// rgba(...), hsl(...), Color-Names, var(--…). Der native Picker bedient nur
// den Hex-Fall; alles andere wird über das Text-Feld editiert.
//
// Der Swatch nutzt `background: <value>` direkt — der Browser löst var(...)
// im Kontext auf, das gibt umsonst eine kleine "Live-Preview".
//
// Contract: property `value: string`, event `value-changed` mit
// `CustomEvent<{value: string}>`.

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("ts-color-picker")
export class TsColorPicker extends LitElement {
  @property({ type: String }) value = "";

  static override styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      width: 100%;
    }
    .swatch {
      position: relative;
      width: 36px;
      height: 36px;
      border-radius: 6px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      overflow: hidden;
      flex-shrink: 0;
      background: conic-gradient(
          rgba(0, 0, 0, 0.1) 25%,
          transparent 25% 50%,
          rgba(0, 0, 0, 0.1) 50% 75%,
          transparent 75%
        )
        0 0 / 10px 10px;
    }
    .fill {
      position: absolute;
      inset: 0;
    }
    .swatch input[type="color"] {
      position: absolute;
      inset: 0;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      border: none;
      padding: 0;
    }
    input[type="text"] {
      flex: 1;
      min-width: 0;
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: 0.9rem;
      padding: 8px 10px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color, inherit);
    }
    input[type="text"]:focus {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: -1px;
      border-color: transparent;
    }
  `;

  override render() {
    return html`
      <div class="swatch">
        <div class="fill" style="background: ${this.value || "transparent"}"></div>
        <input
          type="color"
          .value=${this._asHex(this.value)}
          @input=${this._onColorInput}
          aria-label="Color picker"
        />
      </div>
      <input
        type="text"
        .value=${this.value}
        @change=${this._onTextChange}
        spellcheck="false"
        autocomplete="off"
      />
    `;
  }

  private _asHex(value: string): string {
    const m = /^#([0-9a-f]{6})$/i.exec(value.trim());
    return m ? `#${m[1]}` : "#000000";
  }

  private _onColorInput(e: Event) {
    this._emit((e.target as HTMLInputElement).value);
  }

  private _onTextChange(e: Event) {
    this._emit((e.target as HTMLInputElement).value);
  }

  private _emit(value: string) {
    this.value = value;
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ts-color-picker": TsColorPicker;
  }
}
