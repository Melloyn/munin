# Date Safety Skill

Use for bugs involving wrong day, calendar shift, 7-day shift, sorting by date, drag-to-day, or due notifications.

## Symptoms

- Task appears one day early/late.
- May 9 appears as May 10.
- Today/Upcoming count is wrong.
- Notification fires on wrong day.

## Check

- Search for `new Date(` near `dueDate`.
- Search for `toISOString()` used to format task dates.
- Verify local helpers are used for parsing, formatting, comparing, grouping, sorting, and drag/drop.

## Forbidden

- `new Date("YYYY-MM-DD")`
- `new Date(task.dueDate)`
- `toISOString().slice(0, 10)`
- `toISOString().split("T")[0]`

## Tests

- Create `dueDate = "2026-05-09"` and verify it stays May 9 in all views.
- Drag it to May 10 and back.
- Add `dueTime`; verify the date does not shift.
