import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  getActivePlugins,
  getRegistryStats,
  onActivePluginsChanged,
  setInstalledHacsRepos,
} from "../core/schema-registry";
import type { HomeAssistant, PanelRoute } from "../types";
import "./theme-picker";
import "./editor-view";
import "./module-picker";
import "./module-editor";
import "./compare-view";
import "./controls/_demo";

const TAB_THEMES = "themes";
const TAB_MODULES = "modules";
const TAB_COMPARE = "compare";
type TopTab =
  | typeof TAB_THEMES
  | typeof TAB_MODULES
  | typeof TAB_COMPARE;

@customElement("theme-studio-panel")
export class ThemeStudioPanel extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) route!: PanelRoute;

  // Theme- oder Modul-Auswahl. Wenn gesetzt → entsprechender Editor wird
  // gerendert; sonst der Picker für den aktiven Top-Tab.
  @state() private _selectedTheme: {
    file: string;
    theme_name: string;
  } | null = null;
  @state() private _selectedModule: {
    file: string;
    module_id: string;
  } | null = null;

  // Top-Level-Tab: zwischen Theme- und Modul-Verwaltung (v0.4).
  @state() private _topTab: TopTab = TAB_THEMES;

  // Demo-Mode via URL-Hash `#demo` — zeigt <ts-controls-demo> statt Picker.
  @state() private _demoMode = false;

  private _unsubRegistry?: () => void;

  override connectedCallback() {
    super.connectedCallback();
    console.info("[theme-studio] registry (initial):", getRegistryStats());
    this._demoMode = window.location.hash === "#demo";
    window.addEventListener("hashchange", this._onHashChange);
    // Re-render wenn Plugin-Filter sich ändert (z.B. HACS-Detection
    // fertig) — Module-Tab-Sichtbarkeit hängt von bubble-card aktiv ab.
    this._unsubRegistry = onActivePluginsChanged(() => this.requestUpdate());
    void this._loadHacsRepos();
  }

  private async _loadHacsRepos() {
    try {
      const result = await this.hass.connection.sendMessagePromise<{
        repos: string[];
        found: boolean;
      }>({ type: "theme_studio/list_hacs_repos" });
      if (result.found) {
        setInstalledHacsRepos(result.repos);
        console.info(
          "[theme-studio] HACS-Filter aktiv:",
          result.repos.length,
          "installierte Repos →",
          getRegistryStats(),
        );
      } else {
        console.info(
          "[theme-studio] keine HACS-Storage gefunden — alle Plugins geladen",
        );
      }
    } catch (err) {
      console.warn(
        "[theme-studio] HACS-Detection fehlgeschlagen, alle Plugins geladen:",
        err,
      );
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("hashchange", this._onHashChange);
    this._unsubRegistry?.();
    this._unsubRegistry = undefined;
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
    .top-tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 16px;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }
    .top-tab {
      padding: 10px 18px;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 0.95rem;
      margin-bottom: -1px;
      border-radius: 6px 6px 0 0;
    }
    .top-tab:hover {
      color: var(--primary-text-color);
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.03));
    }
    .top-tab.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
      font-weight: 500;
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
    if (this._selectedTheme) {
      return html`
        <ts-editor-view
          .hass=${this.hass}
          .file=${this._selectedTheme.file}
          .themeName=${this._selectedTheme.theme_name}
          @back-to-picker=${this._backToPicker}
        ></ts-editor-view>
      `;
    }
    if (this._selectedModule) {
      return html`
        <ts-module-editor
          .hass=${this.hass}
          .file=${this._selectedModule.file}
          .moduleId=${this._selectedModule.module_id}
          @back-to-picker=${this._backToPicker}
        ></ts-module-editor>
      `;
    }
    return html`
      ${this._renderTopTabs()} ${this._renderPickerForTab()}
    `;
  }

  private _renderTopTabs() {
    const showModules = getActivePlugins().some(
      (p) => p.manifest.id === "bubble-card",
    );
    return html`
      <div class="top-tabs">
        <button
          class="top-tab ${this._topTab === TAB_THEMES ? "active" : ""}"
          @click=${() => this._setTopTab(TAB_THEMES)}
        >
          Themes
        </button>
        ${showModules
          ? html`
              <button
                class="top-tab ${this._topTab === TAB_MODULES
                  ? "active"
                  : ""}"
                @click=${() => this._setTopTab(TAB_MODULES)}
              >
                Bubble Card Module
              </button>
            `
          : ""}
        <button
          class="top-tab ${this._topTab === TAB_COMPARE ? "active" : ""}"
          @click=${() => this._setTopTab(TAB_COMPARE)}
        >
          Vergleichen
        </button>
      </div>
    `;
  }

  private _renderPickerForTab() {
    if (this._topTab === TAB_MODULES) {
      return html`
        <ts-module-picker
          .hass=${this.hass}
          @module-selected=${this._onModuleSelect}
        ></ts-module-picker>
      `;
    }
    if (this._topTab === TAB_COMPARE) {
      return html`<ts-compare-view .hass=${this.hass}></ts-compare-view>`;
    }
    return html`
      <theme-picker
        .hass=${this.hass}
        @theme-selected=${this._onThemeSelect}
      ></theme-picker>
    `;
  }

  private _setTopTab(tab: TopTab) {
    this._topTab = tab;
  }

  private _onThemeSelect(
    e: CustomEvent<{ file: string; theme_name: string }>,
  ) {
    this._selectedTheme = e.detail;
  }

  private _onModuleSelect(
    e: CustomEvent<{ file: string; module_id: string }>,
  ) {
    this._selectedModule = e.detail;
  }

  private _backToPicker() {
    this._selectedTheme = null;
    this._selectedModule = null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "theme-studio-panel": ThemeStudioPanel;
  }
}
