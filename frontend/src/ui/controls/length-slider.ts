// <ts-length-slider> — Range + Number-Input + Unit-Select.
//
// Parst CSS-Length-Werte ("12px", "0.75rem", "20%"). Wenn mehrere `units`
// angegeben sind, kann der User die Einheit umschalten — der Zahlenwert
// bleibt gleich (keine Unit-Konvertierung; das wäre falsch, weil "16px"
// und "16rem" zwei verschiedene Designs sind).
//
// Contract: `value: string`, event `value-changed`.

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("ts-length-slider")
export class TsLengthSlider extends LitElement {
  @property({ type: String }) value = "0px";
  @property({ type: Array }) units: string[] = ["px"];
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;

  static override styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      width: 100%;
    }
    input[type="range"] {
      flex: 1;
      min-width: 0;
      accent-color: var(--primary-color, #03a9f4);
    }
    input[type="number"] {
      width: 70px;
      padding: 6px 8px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color, inherit);
      font: inherit;
      text-align: right;
    }
    select {
      padding: 6px 8px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color, inherit);
      font: inherit;
    }
    .unit {
      color: var(--secondary-text-color, #727272);
      font-size: 0.9rem;
      min-width: 28px;
    }
  `;

  override render() {
    const parsed = this._parse(this.value);
    return html`
      <input
        type="range"
        min=${this.min}
        max=${this.max}
        step=${this.step}
        .value=${String(parsed.num)}
        @input=${this._onSlider}
      />
      <input
        type="number"
        min=${this.min}
        max=${this.max}
        step=${this.step}
        .value=${String(parsed.num)}
        @change=${this._onNumber}
      />
      ${this.units.length > 1
        ? html`
            <select @change=${this._onUnit}>
              ${this.units.map(
                (u) => html`
                  <option value=${u} ?selected=${u === parsed.unit}>
                    ${u}
                  </option>
                `,
              )}
            </select>
          `
        : html`<span class="unit">${parsed.unit}</span>`}
    `;
  }

  private _parse(value: string): { num: number; unit: string } {
    const fallbackUnit = this.units[0] ?? "px";
    const m = /^(-?\d*\.?\d+)\s*([a-z%]*)$/i.exec(value.trim());
    if (!m) return { num: 0, unit: fallbackUnit };
    return {
      num: parseFloat(m[1]),
      unit: m[2] || fallbackUnit,
    };
  }

  private _onSlider(e: Event) {
    const num = Number((e.target as HTMLInputElement).value);
    const { unit } = this._parse(this.value);
    this._emit(`${num}${unit}`);
  }

  private _onNumber(e: Event) {
    const num = Number((e.target as HTMLInputElement).value);
    const { unit } = this._parse(this.value);
    this._emit(`${num}${unit}`);
  }

  private _onUnit(e: Event) {
    const unit = (e.target as HTMLSelectElement).value;
    const { num } = this._parse(this.value);
    this._emit(`${num}${unit}`);
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
    "ts-length-slider": TsLengthSlider;
  }
}
