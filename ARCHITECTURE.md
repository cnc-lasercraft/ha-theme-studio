# Architektur

## Leitprinzip

**Plugin-basiert.** Der Core kennt nur abstrakte "Variable Sources". HA-Core, Bubble Card, Mushroom, später Mini-Graph etc. sind austauschbare Plugins, die ein einheitliches JSON-Schema liefern. Neuer Card-Typ → neue Plugin-Datei, kein Code-Change am Core.

## Form-Faktor

**Custom Panel** (Sidebar-Eintrag "Theme Studio"), nicht Custom Card.
- Eigener Screen, eigene Routes (`/theme-studio`, `/theme-studio/preview`)
- Greift via WebSocket-API auf HA zu

## Tech Stack

- **Frontend:** Lit + TypeScript (HA-Standard), Vite als Build-Tool
- **Backend:** Python Custom Integration (für File-I/O und WebSocket-Commands)
- **Distribution:** Lokal entwickelt, HACS-Veröffentlichung später (siehe ROADMAP)

## Verzeichnisstruktur (Ziel)

```
ha-theme-studio/
├── frontend/                      # Lit + TS Panel
│   ├── src/
│   │   ├── core/
│   │   │   ├── schema-registry.ts # Plugin-Loader
│   │   │   ├── theme-engine.ts    # CSS-Vars auf :root anwenden
│   │   │   ├── persistence.ts     # WebSocket-Calls zum Backend
│   │   │   └── inheritance.ts     # var(--fallback)-Auflösung
│   │   │
│   │   ├── plugins/               # ← Modularitäts-Schnittstelle
│   │   │   ├── ha-core/
│   │   │   │   ├── manifest.json
│   │   │   │   └── schema.json
│   │   │   ├── bubble-card/
│   │   │   │   ├── manifest.json
│   │   │   │   ├── schema.json
│   │   │   │   └── modules.ts     # Bubble-Card-Module-Verwaltung (v0.4)
│   │   │   └── mushroom/
│   │   │       ├── manifest.json
│   │   │       └── schema.json
│   │   │
│   │   ├── ui/
│   │   │   ├── panel-main.ts      # Hauptpanel mit Plugin-Tabs
│   │   │   ├── controls/          # Color-Picker, Length-Slider, etc.
│   │   │   ├── preview-pane.ts    # iframe-Live-Preview
│   │   │   └── theme-switcher.ts  # Mehrere Themes parallel
│   │   │
│   │   └── index.ts               # Custom-Panel-Registrierung
│   ├── package.json
│   └── vite.config.ts
│
└── custom_components/
    └── theme_studio/              # Python-Backend
        ├── __init__.py            # Integration-Setup
        ├── manifest.json          # HA-Integration-Manifest
        ├── websocket_api.py       # WS-Commands: list/get/save themes
        ├── services.yaml          # Service-Schema
        └── const.py
```

## Plugin-Schema

Das Herzstück der Modularität. Jedes Plugin liefert eine `schema.json`:

```json
{
  "id": "bubble-card",
  "name": "Bubble Card",
  "version_supported": ">=2.0.0",
  "detect": {
    "method": "hacs-repo",
    "value": "Clooos/Bubble-Card"
  },
  "categories": [
    { "id": "global",    "label": "Global",    "icon": "mdi:palette" },
    { "id": "button",    "label": "Button",    "icon": "mdi:gesture-tap" },
    { "id": "separator", "label": "Separator", "icon": "mdi:dots-horizontal" }
  ],
  "variables": [
    {
      "name": "--bubble-main-background-color",
      "type": "color",
      "category": "global",
      "default": "var(--card-background-color)",
      "description": "Hintergrundfarbe aller Bubble Cards",
      "preview_selector": "bubble-card"
    },
    {
      "name": "--bubble-border-radius",
      "type": "length",
      "unit": ["px", "rem"],
      "min": 0, "max": 50,
      "category": "global",
      "default": "16px"
    }
  ]
}
```

**Neues Plugin = neue schema.json.** Core-Code bleibt unberührt.

## Variable-Typen

| Typ | UI-Control | Beispiele |
|---|---|---|
| `color` | Color-Picker + Alpha + var-ref | `--primary-color` |
| `length` | Slider + Unit-Selector | `--ha-card-border-radius` |
| `shadow` | Multi-Field (x/y/blur/color) | `--ha-card-box-shadow` |
| `font-family` | Dropdown + Custom | `--paper-font-body1_-_font-family` |
| `enum` | Select | für vordefinierte Werte |
| `var-ref` | Variablen-Picker | "Setze auf den Wert von …" |
| `raw` | Text-Input (Fallback) | unklassifizierte Variablen |

**Var-Refs sind wichtig:** Theme-Variablen leben von Vererbung. Der Editor muss das visualisieren *und* editierbar machen.

## Heuristische Type-Detection (für unbekannte Variablen)

Damit Studio auch Themes editieren kann, deren Variablen in **keinem** Plugin-Schema stehen, fällt der Variablen-Loader auf eine Namens-Heuristik zurück:

| Suffix-Pattern | Typ-Annahme |
|---|---|
| `-color`, `-bg`, `-background` | `color` |
| `-radius`, `-size`, `-width`, `-height`, `-padding`, `-margin`, `-gap` | `length` |
| `-shadow` | `shadow` |
| `-family` | `font-family` |
| `var(...)` als Wert | `var-ref` |
| sonst | `raw` |

So bekommt **jede** Variable einen funktionierenden Editor – im schlechtesten Fall ein Text-Input, im besten ein passender grafischer Control. Plugin-Schemas haben immer Vorrang vor der Heuristik.

## Initial-Flow: Theme-Picker als Start-Screen

Studio öffnet nicht in einem leeren Editor. Erster Screen ist ein Theme-Picker, der `themes/`-Verzeichnis scannt:

```
┌─────────────────────────────────────┐
│  Theme Studio                       │
│                                     │
│  Welches Theme möchtest du tunen?   │
│                                     │
│  📁 themes/visionos.yaml      [→]   │
│  📁 themes/graphite.yaml      [→]   │
│  📁 themes/ios-dark.yaml      [→]   │
│                                     │
│  + Neues Theme von Vorlage          │
│  + Leeres Theme erstellen           │
└─────────────────────────────────────┘
```

Konsequenz: Studio funktioniert ab v0.1 für **jedes** HA-Theme, nicht nur visionOS. Damit ist es sofort Community-tauglich, wenn HACS-Release kommt.

## Backend (Custom Integration)

Bietet WebSocket-Commands und einen Service:

**WebSocket-Commands:**
- `theme_studio/list_themes` → Liste aller `themes/*.yaml`
- `theme_studio/get_theme` → Inhalt eines Themes
- `theme_studio/save_theme` → schreibt YAML + triggert `frontend.reload_themes`

**Service:**
- `theme_studio.save_theme` (für Automationen, optional)

**Warum eigene Integration?** HA hat keine offizielle Write-API für Themes. Shell-Commands wären hacky, AppDaemon overhead. Eigene Integration = saubere Lösung, gleichzeitig HACS-tauglich für späteren Release.

## Live-Preview-Strategie

**Stufe 1 – Sofort-Feedback im Editor selbst:**
```ts
document.documentElement.style.setProperty('--xxx', value);
```
Wirkt unmittelbar auf das Theme-Studio-Panel.

**Stufe 2 – Echte Dashboard-Vorschau (v0.3):**
```ts
<iframe src="/lovelace/dashboard-id" />
// Theme-Override per postMessage
```
User sieht *seine* Karten mit der Änderung – ohne Speichern, ohne Reload des Haupt-Frontends.

## Generischer Theme-Support

Studio editiert **jedes** Theme im `themes/`-Verzeichnis, nicht nur ein spezifisches. Der User kann zwischen Themes wechseln, neue anlegen, Diffs gegen Default sehen.

## visionOS-Theme als Test-Target

Das bestehende visionOS-Setup des Users dient als Primär-Testfall:
- `themes/visionos.yaml` → verwaltbar via ha-core-Plugin + ggf. eigenes "visionos"-Plugin für custom Variablen
- 3 Bubble-Card-Module (Default/Title/Separator) → ab v0.4 über `bubble-card/modules.ts` integriert

## Was Studio NICHT kann (Grenzen)

- **card-mod-Theme-Regeln** (z.B. UI-Minimalist-Style mit `card-mod-theme`): Nicht editierbar via Variablen-Editor
- **Custom Cards die CSS hartkodieren** ohne Variablen: Nicht stylbar
- **Direkte Shadow-DOM-Selektoren** (wie das visionOS Title-Modul): Bleiben als manuelle CSS-Module erhalten, nicht WYSIWYG
