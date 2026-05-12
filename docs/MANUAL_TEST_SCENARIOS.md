# Munin Manual Test Scenarios

Run the scenarios relevant to the change. Keep notes on what was not tested.

## 7-Days Inline Details and Scroll

1. Open 7 days.
2. Click a task in a day column.
3. Confirm the weekly board remains above task details.
4. Scroll down to task details.
5. Scroll back up to the weekly board.
6. Confirm active tab remains 7 days.
7. Confirm selected week did not change.
8. Add a task under a future day and confirm it stays in 7 days.
9. Complete/edit a task and confirm the weekly board updates.

## Calendar Add Task

1. Open Calendar.
2. Select a date.
3. Click Add Task.
4. Confirm dueDate is prefilled.
5. Save a task and confirm Calendar remains active.
6. Change dueDate before saving and confirm Calendar switches to the new date/month.
7. Cancel creation and confirm no task is created.
8. Try an invalid date and confirm an error is shown.

## Subtask Editing

1. Open task details.
2. Add or select a task with subtasks.
3. Edit a subtask title.
4. Save and confirm only that subtask changes.
5. Try an empty title and confirm it is rejected.
6. Press Escape or Cancel and confirm the original title remains.
7. Complete/reopen/delete subtasks.
8. Repeat from List, 7 days, and Calendar task details.

## Inline Note Calculator

1. Open task details.
2. In the note field type `10+11=` and confirm it becomes `10+11=21`.
3. On a new line type `2500*3=` and confirm only that line changes.
4. Confirm `Версия 2=`, `Дата 2026-05-12=`, `номер 10/2026=`, and `Сумма 2500=` stay unchanged.
5. Confirm `2500=` stays unchanged.
6. Confirm `10+=`, `abc=`, and `10/0=` do not crash or overwrite text.
7. Place the caret after `=` in `10+11=21` and confirm the result is not duplicated.

## Cross-Feature Regression

1. Open task details from List, 7 days, and Calendar.
2. Edit note and subtask in the same details panel.
3. Create tasks from List, 7 days, and Calendar.
4. Switch between views and confirm selected date/week behavior is preserved.
5. Attach, preview, open, and delete at least one attachment if attachment UI was touched.

## Build / Smoke Validation

1. Run `node --check main.js`.
2. Run `node --check preload.js`.
3. Run renderer syntax check if available.
4. Run `npm start` smoke check if practical.
5. Run `npm run build` if practical.
6. If build fails at DMG / `hdiutil`, report it as packaging/environment unless JS/CSS checks also fail.
