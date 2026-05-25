// Namens-Heuristik gemäss D10 / ARCHITECTURE-Tabelle.
//
// Plugin-Schemas haben Vorrang — diese Funktion wird nur für Variablen
// aufgerufen, die in *keinem* Plugin deklariert sind.
//
// Reihenfolge der Tests ist wichtig (spezifischere Suffixe zuerst):
//   `--foo-family`  → font-family
//   `--foo-shadow`  → shadow
//   `--foo-radius|size|width|height|padding|margin|gap`  → length
//   `--foo-color|bg|background`  → color
//   sonst           → raw

import type { VariableType } from "./types";

const LENGTH_SUFFIXES =
  /-(radius|size|width|height|padding|margin|gap)$/;
const COLOR_SUFFIXES = /-(color|bg|background)$/;

export function inferType(name: string): VariableType {
  if (/-family$/.test(name)) return "font-family";
  if (/-shadow$/.test(name)) return "shadow";
  if (LENGTH_SUFFIXES.test(name)) return "length";
  if (COLOR_SUFFIXES.test(name)) return "color";
  return "raw";
}

// Prefix-Map: erkennt die Quelle einer Variable an ihrem Präfix.
// Erste Übereinstimmung gewinnt → spezifischere Prefixe zuerst listen.
const PREFIX_HINTS: Array<{ re: RegExp; label: string }> = [
  { re: /^--bubble-/, label: "Bubble Card" },
  { re: /^--mush-/, label: "Mushroom" },
  { re: /^--card-mod-/, label: "card-mod" },
  { re: /^--mini-graph-/, label: "Mini-Graph-Card" },
  { re: /^--paper-/, label: "Polymer/Paper (legacy HA)" },
  { re: /^--mdc-/, label: "Material Design Components" },
  { re: /^--ha-/, label: "HA Core (erweitert, nicht im Studio-Schema)" },
  { re: /^--state-/, label: "HA State-Farben (erweitert)" },
  { re: /^--rgb-/, label: "HA RGB-Trippel" },
  { re: /^--energy-/, label: "HA Energy-Panel" },
];

const TYPE_LABELS: Record<VariableType, string> = {
  color: "Farbe",
  length: "Länge / Größe",
  shadow: "Schatten",
  "font-family": "Schriftart-Stack",
  enum: "Auswahl",
  "var-ref": "var()-Referenz",
  raw: "freier Text-Wert",
};

/**
 * Generiert einen Erläuterungstext für eine Heuristik-Variable.
 * Format: `<Quelle> · vermutlich <Typ-Label> (Heuristik).`
 *
 * Beispiele:
 *   `--bubble-button-text-color`  → "Bubble Card · vermutlich Farbe (Heuristik)."
 *   `--mush-icon-size`            → "Mushroom · vermutlich Länge / Größe (Heuristik)."
 *   `--my-custom-thing`           → "Quelle unbekannt · vermutlich freier Text-Wert (Heuristik)."
 */
export function inferHint(name: string, type: VariableType): string {
  const prefix = PREFIX_HINTS.find(({ re }) => re.test(name));
  const source = prefix?.label ?? "Quelle unbekannt";
  const kind = TYPE_LABELS[type];
  return `${source} · vermutlich ${kind} (Heuristik).`;
}
