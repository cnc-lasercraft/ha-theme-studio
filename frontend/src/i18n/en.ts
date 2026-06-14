// English translations. Mirror structure of `de.ts`.
// Missing keys fall back to `de.ts`, then to the key itself.

export const messages: Record<string, string> = {
  // panel-main
  "panel.tab_themes": "Themes",
  "panel.tab_modules": "Bubble Card Modules",
  "panel.tab_compare": "Compare",
  "panel.hacs_warn":
    "HACS detection failed — plugin filter is inactive, all plugins are shown (even if the corresponding custom repository is not installed).",
  "panel.hacs_warn_dismiss": "Dismiss notice",

  // common
  "common.error_prefix": "Error",

  // theme-picker
  "picker.loading": "Loading themes…",
  "picker.heading": "Which theme do you want to tune?",
  "picker.empty":
    "No themes found. Drop a YAML file into themes/ to get started.",
  "picker.var_count": "{n} variables",
  "picker.yaml_errors_heading": "YAML errors in these files:",
  "picker.badge_hacs": "HACS",
  "picker.badge_hacs_title":
    "HACS-managed — updates overwrite your changes. On save, Studio offers to derive your own theme.",
  "picker.badge_own": "Own",
  "picker.badge_default": "Default",
  "picker.badge_default_title": "Home Assistant's global default theme",
  "picker.compare_upstream_tooltip":
    "Compare with upstream (fork ↔ HACS source) — pull updates into the fork with the ← arrow",
  "picker.delete_tooltip": "Delete this derived theme (backup kept)",
  "picker.delete_confirm":
    "Delete derived theme '{theme}'?\n\nA backup is written to themes/.backups/ — this is reversible.",

  // module-picker
  "module_picker.loading": "Loading modules…",
  "module_picker.heading": "Which Bubble Card module do you want to tweak?",
  "module_picker.no_root":
    "No bubble_card/modules/ directory found. Bubble Card creates it automatically when you save your first module — or create it manually at <config>/bubble_card/modules/.",
  "module_picker.empty":
    "No modules found in bubble_card/modules/.",
  "module_picker.tag_global": "global",
  "module_picker.tag_no_code": "no code",

  // common
  "common.backup": "Backup",

  // compare-view
  "compare.mode_default": "Default",
  "compare.need_two_themes":
    "Theme switcher needs at least 2 themes in themes/ (currently {count}).",
  "compare.theme_a": "Theme A",
  "compare.theme_b": "Theme B",
  "compare.diff_only": "Only differences",
  "compare.no_theme": "(no theme)",
  "compare.loading_theme": "Loading theme contents…",
  "compare.pick_both": "Pick both themes above.",
  "compare.mode_only_in": "Only in {side}",
  "compare.mode_label": "{mode} mode",
  "compare.mode_missing_hint":
    "{theme} has no {mode} mode (copy would create it).",
  "compare.summary":
    "{themeA} has {countA} vars, {themeB} has {countB}. In total",
  "compare.summary_diffs": "{n} differences or one-sided entries.",
  "compare.no_diffs": "No differences between themes in {mode} mode.",
  "compare.mode_selector_label": "Mode:",
  "compare.mode_diff_badge_title": "{n} differences in this mode",
  "compare.no_diffs_here": "No differences in {mode} mode.",
  "compare.diffs_elsewhere": "But differences in:",
  "compare.col_variable": "Variable",
  "compare.col_action": "Action",
  "compare.not_in_theme": "(not in theme)",
  "compare.copy_no_value": "{side} has no value",
  "compare.copy_tooltip": "Copy value from {from} to {to}",
  "compare.copy_confirm":
    "Copy: '{key}' = '{value}' from {from} to {to} ({file})\nMode: {mode}\n\nA backup of {file} will be created automatically.",
  "compare.copy_confirm_new_mode": "— will be created",
  "compare.copy_success": "{key} copied to {theme} ({mode})",
  "compare.copy_failed": "Copy failed",

  // common toolbar / buttons
  "common.back": "← Back",
  "common.save": "Save",
  "common.saving": "Saving…",
  "common.discard": "Discard",
  "common.dirty_badge": "modified",
  "common.notice": "Note",
  "common.ok": "OK",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.retry": "Retry",
  "common.fallback": "Fallback",
  "common.tag_heuristic": "heuristic",
  "common.save_failed": "Save failed",

  // module-editor
  "module_editor.loading": "Loading module…",
  "module_editor.back_confirm":
    "Unsaved changes to the module will be lost. Go back anyway?",
  "module_editor.save_confirm":
    "Save module '{moduleId}' in '{file}'?\n\nA backup will be created automatically at bubble_card/.backups/.",
  "module_editor.reset_confirm":
    "All module changes will be reverted to the original state. Continue?",
  "module_editor.reload_notice":
    "Bubble Card loads modules at card-render time. After saving, reload your dashboards (Cmd+R) for the changes to take effect.",
  "module_editor.metadata_heading": "Metadata",
  "module_editor.field_name": "Name",
  "module_editor.field_description": "Description",
  "module_editor.field_version": "Version",
  "module_editor.field_supported": "Supported",
  "module_editor.supported_help":
    "Comma-separated card types (button, climate, cover, horizontal-buttons-stack, media-player, pop-up, select, separator, sub-buttons).",
  "module_editor.extra_keys":
    "Additional YAML fields (preserved verbatim on save)",
  "module_editor.css_heading": "CSS code",
  "module_editor.vars_heading": "Used variables",
  "module_editor.vars_empty": "No var(--…) found in code.",
  "module_editor.save_success": "Module saved",
  "module_editor.save_success_reload":
    "Reload your dashboard (Cmd+R) for the change to take effect.",

  // editor-view
  "editor.mode_default": "Default",
  "editor.cat_unknown": "Unknown (heuristic)",
  "editor.cat_other": "Other",
  "editor.preview": "Preview",
  "editor.preview_tooltip":
    "Live preview of a dashboard in an iframe next to the editor",
  "editor.discard_all": "Discard all",
  "editor.mode_bar_label": "Mode",
  "editor.tab_in_theme": "In theme",
  "editor.tag_default": "default",
  "editor.tag_adding": "+ will be added",
  "editor.tag_removing": "× will be removed",
  "editor.loading": "Loading theme…",
  "editor.empty_default": "No editable variables in this theme.",
  "editor.empty_mode":
    "No override variables for mode '{mode}' in the theme. Switch to a plugin tab to add some.",
  "editor.empty_plugin": "No variables in this plugin tab.",
  "editor.notice_skipped_prefix":
    "This theme file contains complex values under",
  "editor.notice_skipped_suffix":
    " that the variable editor cannot map (nested structures).",
  "editor.notice_mode_prefix": "Edits here land under",
  "editor.notice_mode_suffix":
    "in the YAML and only apply in HA when this mode is active. Live preview still works regardless of HA mode — switch HA itself if you need the matching render context.",
  "editor.notice_plugin_strong": "Plugin tab",
  "editor.notice_plugin_prefix":
    "all {n} schema variables are shown. Variables with the",
  "editor.notice_plugin_middle":
    "tag are not yet in the theme. As soon as you change a value, the variable is added on save as",
  "editor.notice_plugin_top_level": "a top-level entry",
  "editor.notice_plugin_override": "an override under",
  "editor.notice_plugin_suffix": "in the theme.",
  "editor.save_confirm":
    "Save {what} in '{file}' > '{theme}'?\n\nA backup will be created automatically at themes/.backups/.",
  "editor.save_part_modify_one": "{n} existing change",
  "editor.save_part_modify_many": "{n} existing changes",
  "editor.save_part_add_one": "{n} new variable",
  "editor.save_part_add_many": "{n} new variables",
  "editor.save_part_remove_one": "{n} removal",
  "editor.save_part_remove_many": "{n} removals",
  "editor.reset_confirm":
    "{n} unsaved change(s) will be discarded (across all modes and tabs). Continue?",
  "editor.back_confirm":
    "{n} unsaved change(s) will be lost. Go back anyway?",
  "editor.save_success": "Saved",
  "editor.dirty_count_one": "{n} change",
  "editor.dirty_count_many": "{n} changes",
  "editor.dirty_adding": "{n} new",
  "editor.dirty_removing": "{n} ×",
  "editor.reset_row_tooltip":
    "Reset to original (also discards a removal mark)",
  "editor.remove_row_tooltip":
    "Remove the variable from the theme on next save",
  "editor.remove_row_disabled_tooltip":
    "Not in theme — nothing to remove",

  // editor — fork guard (v1.1)
  "editor.hacs_notice_strong": "HACS-managed theme",
  "editor.hacs_notice_body":
    "This theme belongs to a HACS repo — an update overwrites direct changes. Studio therefore won't write back; on save it derives your own theme (own file, update-safe).",
  "editor.save_as_own": "Save as own theme",
  "editor.fork_btn": "Derive",
  "editor.fork_btn_tooltip":
    "Derive this theme into your own, HACS-update-safe theme at themes/<name>.yaml",
  "editor.forking": "Deriving…",
  "editor.fork_default": "{theme} Theme Studio",
  "editor.fork_prompt":
    "Derive '{theme}' into your own theme (own file, HACS-update-safe).\n\nName of the new theme:",
  "editor.fork_prompt_save":
    "'{theme}' is HACS-managed — a direct save would be overwritten by the next HACS update.\n\nYour changes are derived into your own theme instead. Name of the new theme:",
  "editor.fork_success": "Derived into your own theme: '{theme}'",
  // editor — set default theme (v1.1)
  "editor.set_default": "Set as default",
  "editor.set_default_tooltip":
    "Set this theme as Home Assistant's global default theme (frontend.set_theme)",
  "editor.setting_default": "Setting…",
  "editor.is_default": "Default theme",
  "editor.is_default_tooltip": "This theme is already the global default theme",
  "editor.set_default_failed": "Setting default failed",

  // preview-pane
  "preview.label": "Preview",
  "preview.reload_tooltip": "Reload iframe",
  "preview.overrides_one": "{n} override",
  "preview.overrides_many": "{n} overrides",
  "preview.override_failed":
    "iframe CSS override failed (possibly cross-origin)",

  // background-picker
  "bg.no_image": "(no image — '{value}')",
  "bg.url_placeholder":
    "https://… or /local/wallpaper.jpg (= /homeassistant/www/wallpaper.jpg)",
  "bg.modifier": "Modifier",
  "bg.modifier_placeholder": "e.g. center / cover no-repeat fixed",
  "bg.preset_cover_tooltip":
    "Fullscreen, centered, fixed (Apple/visionOS style)",
  "bg.preset_contain_tooltip": "Fully visible, centered",
  "bg.preset_tile_tooltip": "Repeat image (pattern)",
  "bg.clear": "Clear",
  "bg.clear_tooltip": "Set to 'none' — no background image",
  "bg.browse": "Browse…",
  "bg.browse_tooltip": "Pick an image from www/ (served under /local/)",
  "bg.browse_loading": "Loading images from www/…",
  "bg.browse_empty": "No images found in www/. Drop images into <config>/www/.",
  "bg.browse_count": "{n} images in www/",
  "bg.browse_truncated": "truncated (limit reached)",
  "bg.var_ref_notice":
    "This variable references another one (var(...)) — it holds no image. Set the background image on the target variable (e.g. background-image in light/dark mode). Edit here manually only.",
};
