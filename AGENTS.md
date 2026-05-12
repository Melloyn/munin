# Munin Agent Instructions

Munin is an Electron desktop task planner for macOS. The renderer UI is currently mostly implemented in `src/index.html`, so UI changes must be surgical and scoped.

## Core Rules

- Do not broadly refactor `src/index.html` unless the user explicitly asks for it.
- Do not touch `main.js`, `preload.js`, IPC, storage, persistence, or attachment logic for UI-only tasks unless strictly necessary.
- Preserve the current dark theme, visual style, and bottom task-details layout.
- Do not reintroduce a right-side details panel or put task details in the sidebar.
- Do not install dependencies unless explicitly requested.
- Do not run `npm audit fix`.
- Do not commit unless explicitly instructed.
- Report checks honestly, including skipped checks and environment failures.
- Treat macOS DMG / `hdiutil` packaging failures separately from JS/CSS/runtime syntax failures.

## Key Files

- `src/index.html`: renderer UI, React state, List / 7 days / Calendar, task details, notes, subtasks, attachments preview.
- `main.js`: Electron main process, IPC, filesystem, attachment storage, shell integration.
- `preload.js`: secure bridge between renderer and main process.
- `package.json` / `package-lock.json`: dependencies and build config.

## Current UX Baseline

- List, 7 days, and Calendar must keep working together.
- 7-days task details open inline below the weekly board.
- 7-days day columns must not create nested vertical scroll traps.
- Calendar Add Task uses isolated `calendarDraft` state.
- Task details work from List, 7 days, and Calendar.
- Subtasks can be edited inline; empty titles are rejected.
- Notes support Apple Notes-style inline math only for standalone formula lines.

## Date Safety

Task `dueDate` is a local `YYYY-MM-DD` calendar date. Do not use:

- `new Date("YYYY-MM-DD")`
- `new Date(task.dueDate)`
- `toISOString().slice(0, 10)`
- `toISOString().split("T")[0]`

Use existing local date helpers such as `parseLocalDate`, `formatLocalDate`, and local date-string comparisons.

## Validation Before Handoff

Run relevant checks for the task:

```bash
node --check main.js
node --check preload.js
npm start
npm run build
```

For UI changes, also check List, 7 days, Calendar, task details, notes, and subtasks. If `npm run build` fails only at DMG / `hdiutil`, report that separately.

## Local Guidance

- General UX rules: `docs/UX_RULES.md`
- Review checklist: `docs/REVIEW_CHECKLIST.md`
- Manual tests: `docs/MANUAL_TEST_SCENARIOS.md`
- Electron safety: `docs/ELECTRON_SECURITY_NOTES.md`
- Known risks: `docs/KNOWN_RISKS.md`
- Worklog: `docs/WORKLOG.md`

Use local skills where appropriate:

- `.codex/skills/electron-ui-engineer/SKILL.md`
- `.codex/skills/code-reviewer/SKILL.md`
- `.codex/skills/regression-tester/SKILL.md`
- `.codex/skills/ux-product-reviewer/SKILL.md`

Final task output should include:

- Summary
- Changed files
- Validation/check results
- How to test manually
- Risks / notes
