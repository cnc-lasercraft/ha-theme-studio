// Core-Typen für Plugin-Schemas + Variable-Metadaten.

export type VariableType =
  | "color"
  | "length"
  | "shadow"
  | "font-family"
  | "enum"
  | "var-ref"
  | "raw";

export interface VariableDef {
  name: string;
  type: VariableType;
  category?: string;
  default?: string;
  description?: string;
  unit?: string[];
  min?: number;
  max?: number;
  options?: string[];
  preview_selector?: string;
}

export interface Category {
  id: string;
  label: string;
  icon?: string;
}

export type DetectMethod = "always" | "hacs-repo" | "card-element";

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  version_supported?: string;
  detect: { method: DetectMethod; value?: string };
  description?: string;
}

export interface PluginSchema {
  id: string;
  categories: Category[];
  variables: VariableDef[];
}

export interface LoadedPlugin {
  manifest: PluginManifest;
  schema: PluginSchema;
}

/**
 * Merge aus `VariableDef` + Provenienz. Plugin-Variablen tragen `source: "schema"`
 * und die `plugin`-ID; Heuristik-Hits tragen `source: "heuristic"`.
 */
export interface VariableMeta extends VariableDef {
  source: "schema" | "heuristic";
  plugin?: string;
}
