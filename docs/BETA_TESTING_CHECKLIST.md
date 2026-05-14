# Munin v3.0.0-beta.1 Testing Checklist

Use this checklist for public beta testing.

## Install

- [ ] Download the correct DMG for your Mac.
- [ ] Install Munin by dragging it to Applications.
- [ ] Launch Munin.
- [ ] If Gatekeeper blocks launch, use right click -> Open -> Open.

## Core Tasks

- [ ] Create a task.
- [ ] Edit task title/date/time/list/priority.
- [ ] Complete a task.
- [ ] Reopen a task.
- [ ] Delete a task.
- [ ] Click the same task twice and confirm details stay open.

## 7-days View

- [ ] Open 7-days.
- [ ] Click a task and confirm details open below the weekly board.
- [ ] Scroll up to the weekly board and down to details.
- [ ] Add a task from 7-days and confirm the view stays in 7-days.

## Calendar

- [ ] Open Calendar.
- [ ] Navigate months.
- [ ] Select a date.
- [ ] Add a task from Calendar.
- [ ] Confirm the selected date is prefilled.
- [ ] Save and confirm the task appears on that date.
- [ ] Click a Calendar task and confirm details open.

## Notes and Calculator

- [ ] Add a long multi-line note.
- [ ] Type `10+11=` and confirm it becomes `10+11=21`.
- [ ] Type `Дата 2026-05-12=` and confirm it stays unchanged.
- [ ] Type `10/0=` and confirm no `Infinity` is inserted.

## Subtasks

- [ ] Add a subtask.
- [ ] Edit a subtask.
- [ ] Try an empty subtask title and confirm it is rejected.
- [ ] Complete/reopen a subtask.
- [ ] Delete a subtask.

## Attachments

- [ ] Add a file with the file picker.
- [ ] Drag a file into a task.
- [ ] Open an attachment.
- [ ] Show an attachment in Finder.
- [ ] Drag an attachment out to Finder/Desktop.
- [ ] Drag an attachment into Mail or another compatible app.
- [ ] Delete an attachment.
- [ ] Try a long filename and confirm the layout remains readable.

## Backup

- [ ] Export a backup with `Экспорт резервной копии`.
- [ ] Confirm the backup contains `munin-backup.json`.
- [ ] Confirm attachment files are copied when attachments exist.
- [ ] Preview the backup with `Проверить backup`.
- [ ] Try previewing an invalid backup if practical.

## Reminders

- [ ] Create a timed task 1-2 minutes ahead.
- [ ] Keep Munin running and confirm one notification attempt.
- [ ] Confirm completed timed tasks do not notify.
- [ ] Restart Munin and confirm data persists.

## Bug Reports

- [ ] Report bugs in GitHub Issues.
- [ ] Include macOS version, Mac chip, Munin version, steps, screenshots, and backup/export context if relevant.
