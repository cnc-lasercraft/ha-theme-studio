// Plugin-Registry. Lädt alle `plugins/*/manifest.json` + `schema.json` zur
// Build-Zeit (Vite `import.meta.glob` mit `eager: true` → JSON wird ins
// Bundle inlined) und exportiert Lookup-Funktionen.
//
// Neues Plugin = neue Dir unter `frontend/src/plugins/<id>/` mit den
// beiden JSON-Files. Kein Code-Change hier nötig — Vite picked es beim
// nächsten Build auf.

import { getLocale } from "./i18n";
import { inferHint, inferType } from "./heuristic";
import type {
  Category,
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

// ─── HACS-Detection / Plugin-Filter ────────────────────────────────────
// `_installedHacsRepos` = null  → kein Filter bekannt → alle Plugins aktiv
//                          Set  → nur Plugins mit detect.method !== "hacs-repo"
//                                 ODER detect.value im Set sind aktiv.
let _installedHacsRepos: Set<string> | null = null;
const _activeChangeListeners = new Set<() => void>();

export function setInstalledHacsRepos(repos: string[] | null): void {
  _installedHacsRepos = repos === null ? null : new Set(repos);
  for (const cb of _activeChangeListeners) {
    try {
      cb();
    } catch {
      /* swallow — Lit-re-render-Errors duerfen den Filter nicht versenken */
    }
  }
}

/**
 * Abonniert Änderungen am aktiven Plugin-Set (z.B. nach HACS-Detection
 * Fertig). Returns Unsubscribe-Funktion.
 */
export function onActivePluginsChanged(cb: () => void): () => void {
  _activeChangeListeners.add(cb);
  return () => _activeChangeListeners.delete(cb);
}

// Plugins in stabiler Display-Reihenfolge: ha-core zuerst, dann alphabetisch.
const PLUGIN_PRIORITY: readonly string[] = ["ha-core"];

function sortPlugins(plugins: readonly LoadedPlugin[]): LoadedPlugin[] {
  return [...plugins].sort((a, b) => {
    const ai = PLUGIN_PRIORITY.indexOf(a.manifest.id);
    const bi = PLUGIN_PRIORITY.indexOf(b.manifest.id);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.manifest.id.localeCompare(b.manifest.id);
  });
}

/**
 * Filtert PLUGINS nach Detection-State + sortiert für stabile Tab-Reihenfolge.
 * Wird im Editor-View für Tabs / _ensurePluginRows verwendet. VAR_INDEX
 * bleibt davon unberührt — eine Variable kriegt also weiterhin ihren
 * Schema-Type, auch wenn das Plugin gerade nicht "aktiv" ist.
 */
export function getActivePlugins(): LoadedPlugin[] {
  const filtered = PLUGINS.filter((p) => {
    const detect = p.manifest.detect;
    if (detect.method === "always") return true;
    if (detect.method === "hacs-repo" && detect.value) {
      if (_installedHacsRepos === null) return true; // pre-detection: permissive
      return _installedHacsRepos.has(detect.value);
    }
    return true;
  });
  return sortPlugins(filtered);
}

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
    return {
      ...hit.def,
      description: localizedDescription(hit.def),
      source: "schema",
      plugin: hit.pluginId,
    };
  }
  const type = inferType(name, value);
  return {
    name,
    type,
    description: inferHint(name, type),
    source: "heuristic",
  };
}

/**
 * Liefert die description in der aktiven Locale.
 * EN: description_en (wenn vorhanden), sonst DE-Fallback.
 * DE: description.
 */
function localizedDescription(def: VariableDef): string | undefined {
  if (getLocale() === "en" && def.description_en) return def.description_en;
  return def.description;
}

/**
 * Liefert die Category-Label in der aktiven Locale (analog zu Variablen).
 * Exportiert für UI-Code, der direkt mit Plugin-Schemas arbeitet.
 */
export function getCategoryLabel(cat: Category): string {
  if (getLocale() === "en" && cat.label_en) return cat.label_en;
  return cat.label;
}

/** Diagnose-Helper für DevTools-Console. */
export interface RegistryStats {
  plugins: number;
  pluginIds: string[];
  activePluginIds: string[];
  indexedVariables: number;
  categories: number;
  hacsFilterApplied: boolean;
}

export function getRegistryStats(): RegistryStats {
  const active = getActivePlugins();
  return {
    plugins: PLUGINS.length,
    pluginIds: PLUGINS.map((p) => p.manifest.id),
    activePluginIds: active.map((p) => p.manifest.id),
    indexedVariables: VAR_INDEX.size,
    categories: PLUGINS.reduce(
      (sum, p) => sum + p.schema.categories.length,
      0,
    ),
    hacsFilterApplied: _installedHacsRepos !== null,
  };
}
