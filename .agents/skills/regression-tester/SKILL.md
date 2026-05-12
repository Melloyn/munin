---
name: regression-tester
description: Run cross-feature regression review after Munin changes, covering List, 7 days, Calendar, task details, notes/calculator, subtasks, Electron boundaries, and validation checks.
---

# Regression Tester Skill

## Purpose

Use this skill after several Munin changes or before handoff.

## Must Check

- List view still works.
- 7 days view keeps the weekly board above inline details.
- 7 days main area scrolls naturally without day-column vertical traps.
- Calendar Add Task uses selected date and isolated `calendarDraft`.
- Task details work from List, 7 days, and Calendar.
- Notes and inline calculator work without false positives.
- Subtask editing, completing, reopening, and deleting still work.
- Attachments still work if touched.
- Backend/preload/IPC/storage/persistence were not changed unexpectedly.

## Validation

Run or report why skipped:

- renderer syntax check if available;
- `node --check main.js`;
- `node --check preload.js`;
- `npm start` smoke check;
- `npm run build`.

Treat DMG / `hdiutil` packaging failure separately from JS/CSS failures.

## Output

Return:

1. Blockers
2. Important Issues
3. Minor Issues
4. Regression Checklist
5. Validation Results
6. Final Handoff Status
