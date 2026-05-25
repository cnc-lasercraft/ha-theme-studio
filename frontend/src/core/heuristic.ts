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
