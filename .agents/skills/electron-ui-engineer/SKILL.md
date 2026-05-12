---
name: electron-ui-engineer
description: Implement scoped Electron renderer/UI changes for Munin while preserving app architecture, dark theme, Electron boundaries, and existing task flows.
---

# Electron UI Engineer Skill

## Purpose

Use this skill to implement focused Munin renderer/UI changes.

## Rules

- Prefer surgical `src/index.html` changes.
- Do not broadly refactor `src/index.html` unless explicitly requested.
- Do not touch `main.js`, `preload.js`, IPC, storage, or persistence unless explicitly required.
- Preserve the current dark theme and visual style.
- Keep task details below the active view in main content.
- Do not reintroduce a right-side details panel.
- Do not add dependencies unless explicitly requested.
- Preserve List, 7 days, Calendar, task details, notes, subtasks, and attachments unless the task targets them.

## Implementation Checklist

- Identify the smallest relevant render/state/CSS block.
- Reuse existing helpers and state patterns.
- Keep view-specific draft state isolated.
- Use immutable task updates.
- Keep local date handling safe.
- Avoid nested vertical scroll traps in 7-days day columns.
- Keep Calendar `calendarDraft` separate from List / 7-days draft state.

## Validation

Run relevant checks:

- renderer syntax check if available;
- `node --check main.js`;
- `node --check preload.js`;
- `npm start` smoke check if practical;
- `npm run build` if practical.

Report DMG / `hdiutil` failures separately from JS/CSS failures.

## Output

Return:

- Summary
- Changed files
- UX behavior before/after
- Validation/check results
- Manual test steps
- Risks / notes
