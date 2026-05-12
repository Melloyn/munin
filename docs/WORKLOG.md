# Munin Worklog

## Current Status

Done:

- 7-days inline task details below weekly board.
- Removed 7-days nested vertical scroll trap.
- Calendar Add Task with isolated `calendarDraft`.
- Inline subtask editing.
- Apple Notes-style inline calculator in task notes.
- Calculator false positives fixed for dates, references, prose, and plain numbers.

Minor risks:

- Same task click toggles details closed.
- Calendar selected-day task list still has nested scroll.
- `git status` may be unavailable if the repo is not initialized.
- `npm run build` may fail at DMG / `hdiutil` packaging.

Next recommended tasks:

- Add and maintain project docs/skills.
- Initialize/check Git if this project should be versioned.
- Optionally fix repeated-click task details behavior.
- Optionally review Calendar selected-day scroll.
- Then choose the next product task.
