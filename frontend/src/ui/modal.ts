// <ts-modal> — themed Ersatz für die nativen window.confirm()/window.prompt().
//
// Statt blockierender Browser-Dialoge (un-themed, window.prompt ist zudem
// deprecated/in manchen Kontexten blockiert) ein HA-gestyltes Overlay.
//
// Nutzung (imperativ, Promise-basiert — minimaler Call-Site-Umbau):
//   if (!(await confirmDialog({ message }))) return;
//   const name = await promptDialog({ message, defaultValue });
//   if (name === null) return; // abgebrochen
//
// Eine Singleton-Instanz wird lazy an document.body gehängt (oberhalb des
// Panels). Da im Light-DOM, greifen HA-CSS-Variablen automatisch.

import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { query } from "lit/decorators.js";
import { t } from "../core/i18n";

interface ConfirmOpts {
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

interface PromptOpts {
  message: string;
  defaultValue?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

type Pending =
  | { mode: "confirm"; resolve: (v: boolean) => void }
  | { mode: "prompt"; resolve: (v: string | null) => void };

@customElement("ts-modal")
export class TsModal extends LitElement {
  @state() private _open = false;
  @state() private _mode: "confirm" | "prompt" = "confirm";
  @state() private _message = "";
  @state() private _value = "";
  @state() private _confirmLabel = "";
  @state() private _cancelLabel = "";
  @state() private _danger = false;
  private _pending: Pending | null = null;

  @query("input") private _input?: HTMLInputElement;
  @query(".confirm-btn") private _confirmBtn?: HTMLButtonElement;

  static override styles = css`
    .overlay {
      position: fixed;
      inset: 0;
      z-index: 100000;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.45);
    }
    .dialog {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      max-width: min(440px, calc(100vw - 32px));
      width: 100%;
      padding: 20px 22px;
      box-sizing: border-box;
    }
    .message {
      white-space: pre-line;
      line-height: 1.45;
      font-size: 0.95rem;
      margin-bottom: 16px;
    }
    input {
      width: 100%;
      box-sizing: border-box;
      padding: 8px 10px;
      margin-bottom: 16px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--primary-background-color, #fafafa);
      color: var(--primary-text-color, #212121);
      font: inherit;
      font-size: 0.95rem;
    }
    input:focus {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: -1px;
      border-color: transparent;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    button {
      padding: 8px 16px;
      border-radius: 6px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      background: none;
      color: inherit;
      font: inherit;
      font-size: 0.9rem;
      cursor: pointer;
    }
    button:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .confirm-btn {
      border-color: var(--primary-color, #03a9f4);
      color: var(--primary-color, #03a9f4);
      font-weight: 500;
    }
    .confirm-btn.danger {
      border-color: var(--error-color, #db4437);
      color: var(--error-color, #db4437);
    }
    .confirm-btn:hover {
      background: rgba(3, 169, 244, 0.08);
    }
    .confirm-btn.danger:hover {
      background: rgba(219, 68, 55, 0.08);
    }
  `;

  confirm(opts: ConfirmOpts): Promise<boolean> {
    return new Promise((resolve) => {
      this._mode = "confirm";
      this._message = opts.message;
      this._confirmLabel = opts.confirmLabel ?? t("common.ok");
      this._cancelLabel = opts.cancelLabel ?? t("common.cancel");
      this._danger = !!opts.danger;
      this._pending = { mode: "confirm", resolve };
      this._open = true;
      void this.updateComplete.then(() => this._focusDefault());
    });
  }

  prompt(opts: PromptOpts): Promise<string | null> {
    return new Promise((resolve) => {
      this._mode = "prompt";
      this._message = opts.message;
      this._value = opts.defaultValue ?? "";
      this._confirmLabel = opts.confirmLabel ?? t("common.ok");
      this._cancelLabel = opts.cancelLabel ?? t("common.cancel");
      this._danger = false;
      this._pending = { mode: "prompt", resolve };
      this._open = true;
      void this.updateComplete.then(() => this._focusDefault());
    });
  }

  private _focusDefault() {
    if (this._mode === "prompt" && this._input) {
      this._input.focus();
      this._input.select();
    } else {
      this._confirmBtn?.focus();
    }
  }

  private _settle(result: boolean | string | null) {
    this._open = false;
    const p = this._pending;
    this._pending = null;
    if (p) (p.resolve as (v: boolean | string | null) => void)(result);
  }

  private _onConfirm() {
    this._settle(this._mode === "prompt" ? this._value : true);
  }

  private _onCancel() {
    this._settle(this._mode === "prompt" ? null : false);
  }

  private _onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      this._onCancel();
    } else if (e.key === "Enter" && this._mode === "prompt") {
      e.preventDefault();
      this._onConfirm();
    }
  }

  override render() {
    if (!this._open) return html``;
    return html`
      <div
        class="overlay"
        @click=${this._onCancel}
        @keydown=${this._onKeydown}
      >
        <div
          class="dialog"
          role="dialog"
          aria-modal="true"
          @click=${(e: Event) => e.stopPropagation()}
        >
          <div class="message">${this._message}</div>
          ${this._mode === "prompt"
            ? html`<input
                type="text"
                .value=${this._value}
                @input=${(e: Event) =>
                  (this._value = (e.target as HTMLInputElement).value)}
                @keydown=${this._onKeydown}
                spellcheck="false"
                autocomplete="off"
              />`
            : ""}
          <div class="actions">
            <button @click=${this._onCancel}>${this._cancelLabel}</button>
            <button
              class="confirm-btn ${this._danger ? "danger" : ""}"
              @click=${this._onConfirm}
            >
              ${this._confirmLabel}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

let _instance: TsModal | null = null;

function instance(): TsModal {
  if (!_instance) {
    _instance = document.createElement("ts-modal") as TsModal;
    document.body.appendChild(_instance);
  }
  return _instance;
}

/** Themed Ersatz für window.confirm() — Promise<boolean>. */
export function confirmDialog(opts: ConfirmOpts): Promise<boolean> {
  return instance().confirm(opts);
}

/** Themed Ersatz für window.prompt() — Promise<string|null> (null = Abbruch). */
export function promptDialog(opts: PromptOpts): Promise<string | null> {
  return instance().prompt(opts);
}

declare global {
  interface HTMLElementTagNameMap {
    "ts-modal": TsModal;
  }
}
