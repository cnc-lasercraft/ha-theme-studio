// Plugin-Registry. Lädt alle `plugins/*/manifest.json` + `schema.json` zur
// Build-Zeit (Vite `import.meta.glob` mit `eager: true` → JSON wird ins
// Bundle inlined) und exportiert Lookup-Funktionen.
//
// Neues Plugin = neue Dir unter `frontend/src/plugins/<id>/` mit den
// beiden JSON-Files. Kein Code-Change hier nötig — Vite picked es beim
// nächsten Build auf.

import { inferHint, inferType } from "./heuristic";
import type {
  LoadedPlugin,
  PluginManifest,
  PluginSchema,
  VariableDef,
  VariableMeta,
} from "./types";

const manifestModules = import.meta.glob<{ default: PluginManifest }>(
  "../plugins/*/manifest.json",
  { eager: true },
);

const schemaModules = import.meta.glob<{ default: PluginSchema }>(
  "../plugins/*/schema.json",
  { eager: true },
);

function loadAll(): LoadedPlugin[] {
  const plugins: LoadedPlugin[] = [];
  for (const [path, mod] of Object.entries(manifestModules)) {
    const schemaPath = path.replace(/\/manifest\.json$/, "/schema.json");
    const schemaMod = schemaModules[schemaPath];
    if (!schemaMod) {
      console.warn(
        `[theme-studio] Plugin at ${path} has no schema.json — skipping.`,
      );
      continue;
    }
    plugins.push({ manifest: mod.default, schema: schemaMod.default });
  }
  return plugins;
}

const PLUGINS: readonly LoadedPlugin[] = Object.freeze(loadAll());

// Lookup-Index: variable-name → (plugin-id, def). Erstes Plugin gewinnt
// bei Kollisionen (deterministisch via Insertion-Reihenfolge).
interface IndexEntry {
  pluginId: string;
  def: VariableDef;
}
const VAR_INDEX = new Map<string, IndexEntry>();
for (const p of PLUGINS) {
  for (const v of p.schema.variables) {
    if (!VAR_INDEX.has(v.name)) {
      VAR_INDEX.set(v.name, { pluginId: p.manifest.id, def: v });
    }
  }
}

export function getPlugins(): readonly LoadedPlugin[] {
  return PLUGINS;
}

/**
 * Liefert Metadaten für eine CSS-Variable. Wenn ein Plugin sie deklariert,
 * kommt der Schema-Eintrag inkl. `default`/`description`/`category` zurück
 * (mit `source: "schema"`). Sonst wird der Typ über die Heuristik bestimmt
 * (`source: "heuristic"`).
 */
export function getVariableMeta(name: string, value?: string): VariableMeta {
  const hit = VAR_INDEX.get(name);
  if (hit) {
    return { ...hit.def, source: "schema", plugin: hit.pluginId };
  }
  const type = inferType(name, value);
  return {
    name,
    type,
    description: inferHint(name, type),
    source: "heuristic",
  };
}

/** Diagnose-Helper für DevTools-Console. */
export interface RegistryStats {
  plugins: number;
  pluginIds: string[];
  indexedVariables: number;
  categories: number;
}

export function getRegistryStats(): RegistryStats {
  return {
    plugins: PLUGINS.length,
    pluginIds: PLUGINS.map((p) => p.manifest.id),
    indexedVariables: VAR_INDEX.size,
    categories: PLUGINS.reduce(
      (sum, p) => sum + p.schema.categories.length,
      0,
    ),
  };
}
