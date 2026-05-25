// <ts-raw-input> — Text-Fallback für Variablen, die durch keine andere
// Control-Form gut bedient werden (shadow, font-family-Listen, unbekannte
// Werte aus der Heuristik).
//
// Switcht automatisch auf <textarea>, wenn der Wert mehrere Zeilen oder
// > 40 Zeichen hat — sonst kompakter Single-Line-Input.
//
// Contract: `value: string`, event `value-changed`.

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("ts-raw-input")
export class TsRawInput extends LitElement {
  @property({ type: String }) value = "";

  static override styles = css`
    :host {
      display: block;
      width: 100%;
    }
    input,
    textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 8px 10px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color, inherit);
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: 0.9rem;
    }
    textarea {
      resize: vertical;
      min-height: 60px;
    }
    input:focus,
    textarea:focus {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: -1px;
      border-color: transparent;
    }
  `;

  override render() {
    const isLong = this.value.length > 40 || this.value.includes("\n");
    return isLong
      ? html`<textarea rows="3" @change=${this._onChange} spellcheck="false">
${this.value}</textarea
        >`
      : html`<input
          type="text"
          .value=${this.value}
          @change=${this._onChange}
          spellcheck="false"
          autocomplete="off"
        />`;
  }

  private _onChange(e: Event) {
    const value = (e.target as HTMLInputElement | HTMLTextAreaElement).value;
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
    "ts-raw-input": TsRawInput;
  }
}
