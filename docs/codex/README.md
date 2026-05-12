# Codex Notes For Munin

This folder contains project-specific instructions for future AI/Codex work. Read only the files relevant to the task to save context.

## Map

- `architecture.md`: Electron structure, data locations, main/preload/renderer roles.
- `date-rules.md`: local date rules and forbidden UTC-shifting patterns.
- `state-and-counters.md`: immutable task updates, sidebar counts, Today progress, selection/cache state.
- `attachments-preview.md`: attachment metadata, preview support, system open, fallbacks.
- `ui-layout.md`: required layout and forbidden right-side details panel.
- `lists-and-groups.md`: managed task lists and “Без списка”.
- `test-checklist.md`: commands and manual regression scenarios.
- `prompt-templates.md`: reusable short prompts for future work.
- `skills/`: small task-specific instruction files.

## Before Starting A Change

1. Read `AGENTS.md`.
2. Read the one or two docs matching the task area.
3. Inspect the current implementation in code before editing.
4. Make the smallest targeted change.
5. Run the relevant checklist from `test-checklist.md`.
6. In the final response, state changed files, checks run, results, and remaining limits.
