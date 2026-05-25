// Namens- + Wert-Heuristik gemäss D10 / ARCHITECTURE-Tabelle.
//
// Plugin-Schemas haben Vorrang — diese Funktion wird nur für Variablen
// aufgerufen, die in *keinem* Plugin deklariert sind.
//
// Strategie (Reihenfolge):
//   1. Name-Suffix:    `-family`, `-shadow`, `-radius/-size/-width/...`,
//                      `-color/-bg/-background` — spezifische zuerst.
//   2. Wert-basiert:   wenn Name nichts hergibt, schauen wir auf den
//                      tatsächlichen Wert. `rgba(...)` / `#xxx` → Farbe.
//                      `12px` / `0.5rem` → Länge. Macht `--label-badge-red`
//                      etc. korrekt zu Color-Picker-Steuerungen.
//   3. Sonst:          `raw` (Text-Input-Fallback).

import type { VariableType } from "./types";

const LENGTH_SUFFIXES =
  /-(radius|size|width|height|padding|margin|gap)$/;
const COLOR_SUFFIXES = /-(color|bg|background)$/;
const BACKGROUND_SUFFIXES = /-(image|background-image)$/;

// Wert-Pattern für Color-Erkennung.
const COLOR_VALUE_DIRECT = [
  /^#[0-9a-f]{3,8}$/i, // #rgb, #rrggbb, #rrggbbaa
  /^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\s*\(/i,
  /^(transparent|currentColor|inherit)$/i,
];

// var()-Referenzen auf erkennbar farbige Variablen
const COLOR_VALUE_VARREF =
  /^var\(\s*--[A-Za-z0-9_-]*-(color|bg|background)\b/i;

// Wert-Pattern für Length-Erkennung.
const LENGTH_VALUE_DIRECT = /^-?\d*\.?\d+(px|rem|em|vh|vw|vmin|vmax|%)$/i;
const LENGTH_VALUE_VARREF =
  /^var\(\s*--[A-Za-z0-9_-]*-(radius|size|width|height|padding|margin|gap)\b/i;

function inferTypeFromValue(value: string): VariableType | undefined {
  const v = value.trim();
  if (!v) return undefined;
  if (/url\s*\(/i.test(v) || /gradient\s*\(/i.test(v)) return "background";
  if (COLOR_VALUE_DIRECT.some((re) => re.test(v))) return "color";
  if (COLOR_VALUE_VARREF.test(v)) return "color";
  if (LENGTH_VALUE_DIRECT.test(v)) return "length";
  if (LENGTH_VALUE_VARREF.test(v)) return "length";
  return undefined;
}

export function inferType(name: string, value?: string): VariableType {
  if (/-family$/.test(name)) return "font-family";
  if (/-shadow$/.test(name)) return "shadow";
  if (BACKGROUND_SUFFIXES.test(name)) return "background";
  if (LENGTH_SUFFIXES.test(name)) return "length";
  if (COLOR_SUFFIXES.test(name)) return "color";
  if (value !== undefined) {
    const fromValue = inferTypeFromValue(value);
    if (fromValue) return fromValue;
  }
  return "raw";
}

// Prefix-Map: erkennt die Quelle einer Variable an ihrem Präfix.
// Reihenfolge wichtig — erste Übereinstimmung gewinnt, also spezifischere
// Patterns zuerst (z.B. `--ha-color-` vor `--ha-`).
const PREFIX_HINTS: Array<{ re: RegExp; label: string }> = [
  // Third-party Custom Cards
  { re: /^--bubble-/, label: "Bubble Card" },
  { re: /^--mush-/, label: "Mushroom" },
  { re: /^--card-mod-/, label: "card-mod" },
  { re: /^--mini-graph-/, label: "Mini-Graph-Card" },
  { re: /^--mini-media-player-/, label: "Mini-Media-Player-Card" },
  { re: /^--mcg-/, label: "Material-Color-Generator" },
  { re: /^--lumo-/, label: "Vaadin/Lumo (Custom Card)" },
  { re: /^--wa-/, label: "Web Awesome (Design-Tokens)" },
  // HA Design-Tokens (spezifischer vor generischem --ha-)
  { re: /^--ha-color-/, label: "HA Color-Tokens (Design-System)" },
  { re: /^--ha-dialog-/, label: "HA Dialogs/Modals" },
  { re: /^--ha-slider-/, label: "HA Slider (modern)" },
  { re: /^--ha-/, label: "HA Core (erweitert, nicht im Studio-Schema)" },
  // Material Design (mdc spezifischer als md)
  { re: /^--mdc-/, label: "Material Design Components" },
  { re: /^--md-/, label: "Material Design 3" },
  { re: /^--material-/, label: "Material-Theme" },
  // Legacy
  { re: /^--paper-/, label: "Polymer/Paper (legacy HA)" },
  { re: /^--text-/, label: "HA Text-Farben (legacy)" },
  { re: /^--label-badge-/, label: "HA Label-Badges (legacy)" },
  // HA-Spezifika
  { re: /^--state-/, label: "HA State-Farben (erweitert)" },
  { re: /^--rgb-/, label: "HA RGB-Trippel" },
  { re: /^--energy-/, label: "HA Energy-Panel" },
  { re: /^--input-/, label: "HA Form-Inputs" },
  { re: /^--data-table-/, label: "HA Data-Tables" },
  { re: /^--app-/, label: "HA App-Header/Theme" },
  { re: /^--more-info-/, label: "HA More-Info-Dialog" },
  // Code-Editor / Markdown
  { re: /^--code-editor-/, label: "HA Code-Editor" },
  { re: /^--codemirror-/, label: "CodeMirror-Syntax-Highlight" },
  { re: /^--markdown-/, label: "Markdown-Rendering" },
];

const TYPE_LABELS: Record<VariableType, string> = {
  color: "Farbe",
  length: "Länge / Größe",
  shadow: "Schatten",
  background: "Hintergrund-Bild",
  "font-family": "Schriftart-Stack",
  enum: "Auswahl",
  "var-ref": "var()-Referenz",
  raw: "freier Text-Wert",
};

/**
 * Generiert einen Erläuterungstext für eine Heuristik-Variable.
 * Format: `<Quelle> · vermutlich <Typ-Label> (Heuristik).`
 */
export function inferHint(name: string, type: VariableType): string {
  const prefix = PREFIX_HINTS.find(({ re }) => re.test(name));
  const source = prefix?.label ?? "Quelle unbekannt";
  const kind = TYPE_LABELS[type];
  return `${source} · vermutlich ${kind} (Heuristik).`;
}
