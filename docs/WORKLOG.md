# Munin Worklog

## Current Status

Munin is being prepared as a stable local v3.0 build for installation on the user's Mac.
The current target is reliable local use, not a public App Store release.

Restore/replace import is intentionally not implemented yet.

## Completed

- 7-days inline task details below weekly board.
- Removed 7-days nested vertical scroll trap.
- Calendar Add Task with selected date prefilled.
- Calendar creation uses isolated `calendarDraft`.
- Calendar selected-day nested scroll improved.
- Calendar UX polished with task-count badges, clearer selected day state, long-title handling, and keyboard task selection.
- Same-task repeated click keeps details open.
- Inline subtask editing.
- Task note textarea usability improved.
- Apple Notes-style inline calculator in task notes.
- Calculator false positives fixed for dates, references, prose, and plain numbers.
- Attachment drag-out audited and confirmed already working.
- Attachment drag-in audited and confirmed already working.
- Attachment card UX polished.
- `AGENTS.md`, project docs, and local skills added.
- Git initialized and checkpoints created for accepted changes.
- Portable backup export added.
- Preview-only backup import added.
- Reminder MVP improved: app-running-only dueDate + dueTime reminders now persist dedupe state with `reminderNotifiedKey` and `reminderNotifiedAt`.

## Known Risks

- Restore is not implemented yet.
- Reminder notification state records an attempt, not guaranteed macOS delivery.
- Reminder window remains narrow at about 60 seconds after due time.
- Reminders work only while Munin is running; there is no background daemon.
- `saveStorage()` does not return explicit ok/fail, so the saved indicator can be inaccurate if disk save fails.
- Very large backup JSON is read synchronously during preview.
- Partial backup folders can remain if export fails after attachments copy.
- Attachment `ext` fallback could use MIME/type when `ext` is missing.
- Calendar selected-day drag from a child button area should be manually smoke-tested if task dragging matters.
- App logo/icon replacement is planned for final polish.
- Apple Developer signing/notarization is not needed for local use, but is needed for polished public distribution.
- `npm run build` may fail at DMG / `hdiutil` packaging; report that separately from JS/CSS failures.

## Current Checkpoint

Recent accepted checkpoint:

- `fa2cbc3` - `Persist reminder notification dedupe state`

Use `git log --oneline --decorate -n 10` for the latest checkpoint list.

## Next Tasks

1. Smoke-test reminders manually with a near-future task.
2. Replace app logo/icon if final local polish requires it.
3. Prepare final local install/build steps for the user's Mac.
4. Optionally design restore/replace import after v3.0 local install is stable.

## Handoff Notes

- Keep UI changes surgical; `src/index.html` is large.
- Do not touch `main.js`, `preload.js`, IPC, storage, or persistence for UI-only tasks unless strictly necessary.
- Preserve the current dark theme and bottom task details layout.
- Before handoff, check List, 7 days, Calendar, task details, notes, subtasks, attachments, and backup flows relevant to the change.
