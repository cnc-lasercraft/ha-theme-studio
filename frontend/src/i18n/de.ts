// Deutsche Übersetzungen — Quelle / kanonischer Originaltext der App.
// Keys sind nach Component-Namespace gruppiert (`panel.*`, `picker.*`, etc.).
// Beim Hinzufügen neuer Keys: parallel auch in `en.ts` ergänzen.

export const messages: Record<string, string> = {
  // panel-main
  "panel.tab_themes": "Themes",
  "panel.tab_modules": "Bubble Card Module",
  "panel.tab_compare": "Vergleichen",
  "panel.hacs_warn":
    "HACS-Detection fehlgeschlagen — Plugin-Filter ist inaktiv, alle Plugins werden gezeigt (auch wenn das zugehörige Custom-Repo gar nicht installiert ist).",
  "panel.hacs_warn_dismiss": "Hinweis ausblenden",

  // common
  "common.error_prefix": "Fehler",

  // theme-picker
  "picker.loading": "Lade Themes…",
  "picker.heading": "Welches Theme möchtest du tunen?",
  "picker.empty":
    "Keine Themes gefunden. Lege eine YAML-Datei in themes/ an.",
  "picker.var_count": "{n} Variablen",
  "picker.yaml_errors_heading": "YAML-Fehler in folgenden Dateien:",
  "picker.badge_hacs": "HACS",
  "picker.badge_hacs_title":
    "HACS-verwaltet — Updates überschreiben deine Änderungen. Studio bietet beim Speichern an, ein eigenes Theme abzuleiten.",
  "picker.badge_own": "Eigen",
  "picker.badge_default": "Default",
  "picker.badge_default_title": "Globales Standard-Theme von Home Assistant",
  "picker.compare_upstream_tooltip":
    "Mit Upstream vergleichen (Fork ↔ HACS-Quelle) — Updates per ←-Pfeil in den Fork ziehen",
  "picker.delete_tooltip": "Dieses abgeleitete Theme löschen (Backup bleibt)",
  "picker.delete_confirm":
    "Abgeleitetes Theme '{theme}' löschen?\n\nEine Sicherung wird unter themes/.backups/ angelegt — der Schritt ist reversibel.",

  // module-picker
  "module_picker.loading": "Lade Module…",
  "module_picker.heading": "Welches Bubble-Card-Modul möchtest du anpassen?",
  "module_picker.no_root":
    "Kein bubble_card/modules/-Verzeichnis gefunden. Bubble Card legt das automatisch an, sobald du dein erstes Modul speicherst — oder leg es manuell unter <config>/bubble_card/modules/ an.",
  "module_picker.empty":
    "Keine Module in bubble_card/modules/ gefunden.",
  "module_picker.tag_global": "global",
  "module_picker.tag_no_code": "kein code",

  // common
  "common.backup": "Backup",

  // compare-view
  "compare.mode_default": "Default",
  "compare.need_two_themes":
    "Theme-Switcher braucht mindestens 2 Themes im themes/-Verzeichnis (aktuell {count}).",
  "compare.theme_a": "Theme A",
  "compare.theme_b": "Theme B",
  "compare.diff_only": "Nur Unterschiede",
  "compare.no_theme": "(kein Theme)",
  "compare.loading_theme": "Lade Theme-Inhalt…",
  "compare.pick_both": "Wähle beide Themes oben aus.",
  "compare.mode_only_in": "Nur in {side} vorhanden",
  "compare.mode_label": "{mode}-Mode",
  "compare.mode_missing_hint":
    "{theme} hat keine {mode}-Mode (Copy würde sie anlegen).",
  "compare.summary":
    "{themeA} hat {countA} Vars, {themeB} hat {countB}. Insgesamt",
  "compare.summary_diffs": "{n} Unterschiede oder einseitige Einträge.",
  "compare.no_diffs": "Keine Unterschiede zwischen den Themes in der {mode}-Mode.",
  "compare.mode_selector_label": "Modus:",
  "compare.mode_diff_badge_title": "{n} Unterschiede in diesem Modus",
  "compare.no_diffs_here": "Keine Unterschiede im {mode}-Modus.",
  "compare.diffs_elsewhere": "Aber Unterschiede in:",
  "compare.col_variable": "Variable",
  "compare.col_action": "Aktion",
  "compare.not_in_theme": "(nicht im Theme)",
  "compare.copy_no_value": "{side} hat keinen Wert",
  "compare.copy_tooltip": "Wert von {from} nach {to} kopieren",
  "compare.copy_confirm":
    "Kopieren: '{key}' = '{value}' von {from} nach {to} ({file})\nMode: {mode}\n\nEin Backup von {file} wird automatisch angelegt.",
  "compare.copy_confirm_new_mode": "— wird neu angelegt",
  "compare.copy_success": "{key} kopiert nach {theme} ({mode})",
  "compare.copy_failed": "Kopieren fehlgeschlagen",

  // common toolbar / buttons
  "common.back": "← Zurück",
  "common.save": "Speichern",
  "common.saving": "Speichere…",
  "common.discard": "Verwerfen",
  "common.dirty_badge": "geändert",
  "common.notice": "Hinweis",
  "common.fallback": "Fallback",
  "common.tag_heuristic": "heuristik",
  "common.save_failed": "Speichern fehlgeschlagen",

  // module-editor
  "module_editor.loading": "Lade Modul…",
  "module_editor.back_confirm":
    "Ungespeicherte Änderungen am Modul gehen verloren. Trotzdem zurück?",
  "module_editor.save_confirm":
    "Modul '{moduleId}' in '{file}' speichern?\n\nEin Backup wird automatisch unter bubble_card/.backups/ angelegt.",
  "module_editor.reset_confirm":
    "Alle Änderungen am Modul werden auf den Original-Zustand zurückgesetzt. Fortfahren?",
  "module_editor.reload_notice":
    "Bubble Card lädt Module beim Card-Render. Nach Save musst du deine Dashboards neu laden (Cmd+R), damit die Änderungen wirksam werden.",
  "module_editor.metadata_heading": "Metadaten",
  "module_editor.field_name": "Name",
  "module_editor.field_description": "Description",
  "module_editor.field_version": "Version",
  "module_editor.field_supported": "Supported",
  "module_editor.supported_help":
    "Komma-getrennte Card-Types (button, climate, cover, horizontal-buttons-stack, media-player, pop-up, select, separator, sub-buttons).",
  "module_editor.extra_keys":
    "Weitere Felder im YAML (werden beim Save 1:1 erhalten)",
  "module_editor.css_heading": "CSS-Code",
  "module_editor.vars_heading": "Verwendete Variablen",
  "module_editor.vars_empty": "Keine var(--…) im Code gefunden.",
  "module_editor.save_success": "Modul gespeichert",
  "module_editor.save_success_reload":
    "Lade jetzt das Dashboard neu (Cmd+R), damit die Änderung wirksam wird.",

  // editor-view
  "editor.mode_default": "Default",
  "editor.cat_unknown": "Unbekannt (Heuristik)",
  "editor.cat_other": "Sonstige",
  "editor.preview": "Preview",
  "editor.preview_tooltip":
    "Live-Preview eines Dashboards in einem iframe daneben",
  "editor.discard_all": "Alles verwerfen",
  "editor.mode_bar_label": "Mode",
  "editor.tab_in_theme": "Im Theme",
  "editor.tag_default": "default",
  "editor.tag_adding": "+ wird ergänzt",
  "editor.tag_removing": "× wird entfernt",
  "editor.loading": "Lade Theme…",
  "editor.empty_default": "Keine editierbaren Variablen in diesem Theme.",
  "editor.empty_mode":
    "Keine Override-Variablen für Mode '{mode}' im Theme. Wechsle auf einen Plugin-Tab um welche hinzuzufügen.",
  "editor.empty_plugin": "Keine Variablen in diesem Plugin-Tab.",
  "editor.notice_skipped_prefix":
    "Diese Theme-Datei enthält komplexe Werte unter",
  "editor.notice_skipped_suffix":
    ", die der Variablen-Editor nicht abbildet (verschachtelte Strukturen).",
  "editor.notice_mode_prefix": "Edits hier landen unter",
  "editor.notice_mode_suffix":
    "im YAML und wirken in HA nur wenn dieser Mode aktiv ist. Live-Preview greift dennoch unabhängig vom HA-Mode — schalte HA ggf. selbst um, um den richtigen Render-Kontext zu sehen.",
  "editor.notice_plugin_strong": "Plugin-Tab",
  "editor.notice_plugin_prefix":
    "alle {n} Schema-Variablen werden gezeigt. Variablen mit",
  "editor.notice_plugin_middle":
    "-Tag stehen (noch) nicht im Theme. Sobald du einen Wert änderst, wird die Variable beim Speichern als",
  "editor.notice_plugin_top_level": "Top-Level-Eintrag",
  "editor.notice_plugin_override": "Override unter",
  "editor.notice_plugin_suffix": "ins Theme aufgenommen.",
  "editor.save_confirm":
    "{what} in '{file}' > '{theme}' speichern?\n\nEin Backup wird automatisch unter themes/.backups/ angelegt.",
  "editor.save_part_modify_one": "{n} bestehende Änderung",
  "editor.save_part_modify_many": "{n} bestehende Änderungen",
  "editor.save_part_add_one": "{n} neue Variable",
  "editor.save_part_add_many": "{n} neue Variablen",
  "editor.save_part_remove_one": "{n} Entfernung",
  "editor.save_part_remove_many": "{n} Entfernungen",
  "editor.reset_confirm":
    "{n} ungespeicherte Änderung(en) werden verworfen (über alle Modes und Tabs). Fortfahren?",
  "editor.back_confirm":
    "{n} ungespeicherte Änderung(en) gehen verloren. Trotzdem zurück?",
  "editor.save_success": "Gespeichert",
  "editor.dirty_count_one": "{n} Änderung",
  "editor.dirty_count_many": "{n} Änderungen",
  "editor.dirty_adding": "{n} neu",
  "editor.dirty_removing": "{n} ×",
  "editor.reset_row_tooltip":
    "Auf Original zurücksetzen (verwirft auch eine Entfernen-Markierung)",
  "editor.remove_row_tooltip":
    "Variable beim nächsten Speichern aus dem Theme entfernen",
  "editor.remove_row_disabled_tooltip": "Nicht im Theme — nichts zu entfernen",

  // editor — Fork-Guard (v1.1)
  "editor.hacs_notice_strong": "HACS-verwaltetes Theme",
  "editor.hacs_notice_body":
    "Dieses Theme gehört einem HACS-Repo — ein Update überschreibt direkte Änderungen. Studio schreibt deshalb nicht zurück, sondern leitet beim Speichern ein eigenes Theme ab (eigene Datei, update-sicher).",
  "editor.save_as_own": "Als eigenes Theme speichern",
  "editor.fork_btn": "Ableiten",
  "editor.fork_btn_tooltip":
    "Dieses Theme als eigenes, HACS-update-sicheres Theme in themes/<name>.yaml ableiten",
  "editor.forking": "Leite ab…",
  "editor.fork_default": "{theme} Theme Studio",
  "editor.fork_prompt":
    "'{theme}' als eigenes Theme ableiten (eigene Datei, HACS-update-sicher).\n\nName des neuen Themes:",
  "editor.fork_prompt_save":
    "'{theme}' ist HACS-verwaltet — direktes Speichern würde beim nächsten HACS-Update überschrieben.\n\nDeine Änderungen werden stattdessen in ein eigenes Theme abgeleitet. Name des neuen Themes:",
  "editor.fork_success": "Als eigenes Theme abgeleitet: '{theme}'",
  // editor — Default-Theme setzen (v1.1)
  "editor.set_default": "Als Default setzen",
  "editor.set_default_tooltip":
    "Dieses Theme als globales Standard-Theme von Home Assistant setzen (frontend.set_theme)",
  "editor.setting_default": "Setze…",
  "editor.is_default": "Standard-Theme",
  "editor.is_default_tooltip": "Dieses Theme ist bereits das globale Standard-Theme",
  "editor.set_default_failed": "Default setzen fehlgeschlagen",

  // preview-pane
  "preview.label": "Preview",
  "preview.reload_tooltip": "iframe neu laden",
  "preview.overrides_one": "{n} override",
  "preview.overrides_many": "{n} overrides",
  "preview.override_failed":
    "iframe-CSS-Override fehlgeschlagen (möglicherweise Cross-Origin)",

  // background-picker
  "bg.no_image": "(kein Bild — '{value}')",
  "bg.url_placeholder":
    "https://… oder /local/wallpaper.jpg (= /homeassistant/www/wallpaper.jpg)",
  "bg.modifier": "Modifier",
  "bg.modifier_placeholder": "z.B. center / cover no-repeat fixed",
  "bg.preset_cover_tooltip":
    "Vollbild, zentriert, fixiert (Apple-/visionOS-Style)",
  "bg.preset_contain_tooltip": "Komplett sichtbar, zentriert",
  "bg.preset_tile_tooltip": "Bild wiederholen (Pattern)",
  "bg.clear": "Clear",
  "bg.clear_tooltip": "Auf 'none' setzen — kein Hintergrund-Bild",
  "bg.browse": "Durchsuchen…",
  "bg.browse_tooltip": "Bild aus www/ wählen (wird unter /local/ serviert)",
  "bg.browse_loading": "Lade Bilder aus www/…",
  "bg.browse_empty":
    "Keine Bilder in www/ gefunden. Lege Bilder unter <config>/www/ ab.",
  "bg.browse_count": "{n} Bilder in www/",
  "bg.browse_truncated": "gekürzt (Limit erreicht)",
  "bg.var_ref_notice":
    "Diese Variable verweist auf eine andere (var(...)) — sie hält kein Bild. Setze das Hintergrund-Bild an der Ziel-Variable (z.B. background-image im Light-/Dark-Mode). Hier nur manuell editieren.",
};
