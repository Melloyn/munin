# Munin Review Checklist

Use this checklist for implementation reviews and regression reviews.

## Scope Control

- Does the change match the requested task?
- Were unrelated files or unrelated logic changed?
- Was `src/index.html` refactored broadly without explicit request?
- Were dependencies added without explicit request?

## UI Flow Regressions

- List, 7 days, Calendar, and task details still work.
- Active view remains preserved when required.
- Selected task/date/week state remains preserved when required.
- Dark theme and current visual style are preserved.

## Shared State Isolation

- View-specific drafts do not mutate unrelated view drafts.
- Calendar creation uses `calendarDraft`.
- List / 7-days creation state is not cleared by Calendar open/cancel/save.
- Task updates are immutable and persist through the existing save pipeline.

## 7-Days Behavior

- Weekly board remains visible above inline details.
- Main area scrolls naturally.
- Day columns do not trap vertical scrolling.
- Adding or cancelling a task keeps the user in 7 days.
- Editing/completing a task refreshes the weekly board.

## Calendar Behavior

- Add Task opens inline for the selected date.
- dueDate is prefilled and visibly editable.
- Invalid and rollover dates are rejected.
- Save/cancel keeps Calendar active.
- Changed dueDate updates selected date/month when needed.
- Inline form is not clipped.

## Task Details Behavior

- Details work from List, 7 days, and Calendar.
- Date, time, list, priority, note, subtasks, and attachments still work.
- Details are below the active view, not in sidebar or a right panel.

## Subtasks

- Edit mode pre-fills the current title.
- Empty or whitespace-only title is rejected.
- Cancel/Escape does not save changes.
- Editing one subtask does not affect another.
- Complete/reopen/delete still work.

## Notes / Calculator

- `10+11=` becomes `10+11=21`.
- Normal text like `Версия 2=` stays unchanged.
- Dates and references stay unchanged.
- Invalid formulas do not crash or overwrite.
- No `eval()` or `new Function()`.
- Old calculator panel/button are gone.

## Electron Boundaries

- Renderer does not use Node APIs directly.
- UI-only tasks do not change preload, IPC, storage, or persistence.
- Any new preload API is explicit, minimal, and validated.

## Validation / Build Checks

- Renderer syntax check, if available.
- `node --check main.js`.
- `node --check preload.js`.
- `npm start` smoke check, if practical.
- `npm run build`, if practical.
- Report DMG / `hdiutil` failures separately from JS/CSS failures.

## Final Handoff Status

Use one of:

- Accepted
- Accepted with minor risks
- Needs fixes before handoff
- Blocked
