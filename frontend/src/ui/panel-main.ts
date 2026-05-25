import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { getRegistryStats } from "../core/schema-registry";
import type { HomeAssistant, PanelRoute } from "../types";
import "./theme-picker";
import "./editor-view";
import "./controls/_demo";

@customElement("theme-studio-panel")
export class ThemeStudioPanel extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) route!: PanelRoute;

  // v0.1: Picker zeigt eine Theme-Liste; nach Auswahl wird ein Editor-Stub
  // angezeigt. Der echte Editor kommt in Schritt 7.
  @state() private _selected: { file: string; theme_name: string } | null =
    null;

  // Demo-Mode via URL-Hash `#demo` — zeigt <ts-controls-demo> statt Picker.
  // Schnellster Weg, die Controls aus Step 5 isoliert zu testen, ohne
  // eine eigene Route oder Router-Logik bauen zu müssen.
  @state() private _demoMode = false;

  override connectedCallback() {
    super.connectedCallback();
    // Step-4-Diagnose: einmaliger Log auf der Browser-Console.
    // Wird in Step 7 (Editor) durch echte Nutzung der Registry ersetzt.
    console.info("[theme-studio] registry:", getRegistryStats());
    this._demoMode = window.location.hash === "#demo";
    window.addEventListener("hashchange", this._onHashChange);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("hashchange", this._onHashChange);
  }

  private _onHashChange = () => {
    this._demoMode = window.location.hash === "#demo";
  };

  static override styles = css`
    :host {
      display: block;
      height: 100%;
      min-height: 100vh;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      font-family: var(--paper-font-body1_-_font-family, "Roboto", sans-serif);
    }
    header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 24px;
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, #ffffff);
    }
    header h1 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 500;
    }
    main {
      padding: 24px;
    }
    .back-btn {
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 6px 12px;
      cursor: pointer;
      color: inherit;
      font: inherit;
    }
    .back-btn:hover {
      background: var(--secondary-background-color);
    }
  `;

  override render() {
    return html`
      <header>
        <ha-icon icon="mdi:palette"></ha-icon>
        <h1>Theme Studio</h1>
      </header>
      <main>${this._renderBody()}</main>
    `;
  }

  private _renderBody() {
    if (this._demoMode) {
      return html`<ts-controls-demo></ts-controls-demo>`;
    }
    if (!this._selected) {
      return html`
        <theme-picker
          .hass=${this.hass}
          @theme-selected=${this._onSelect}
        ></theme-picker>
      `;
    }
    return html`
      <ts-editor-view
        .hass=${this.hass}
        .file=${this._selected.file}
        .themeName=${this._selected.theme_name}
        @back-to-picker=${this._back}
      ></ts-editor-view>
    `;
  }

  private _onSelect(e: CustomEvent<{ file: string; theme_name: string }>) {
    this._selected = e.detail;
  }

  private _back() {
    this._selected = null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "theme-studio-panel": ThemeStudioPanel;
  }
}
