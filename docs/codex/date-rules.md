# Date Rules

Task dates use:

- `dueDate`: local calendar date string, `YYYY-MM-DD`
- `dueTime`: separate time string, for example `14:30`

## Forbidden For `dueDate`

Never use:

```js
new Date("YYYY-MM-DD")
new Date(task.dueDate)
date.toISOString().slice(0, 10)
date.toISOString().split("T")[0]
```

These parse/format through UTC and can move tasks to a neighboring day. This already caused a bug where a task for May 9 appeared on May 10.

## Required Helpers

Use or preserve local helpers in `src/index.html`:

- `parseLocalDate(dateString)`: `YYYY-MM-DD` to `new Date(year, monthIndex, day)`
- `formatLocalDate(date)`: local date object to `YYYY-MM-DD`
- `compareDateStringsLocal(a, b)`: compare two local date strings
- `isTodayDateString(dateString)`
- `isFutureDateString(dateString)`

If helper names changed, inspect the code and use the equivalent local-date helper.

## Rules

- Calendar and 7-day view must group tasks by exact local `dueDate`.
- Dragging a task to another day updates only `dueDate`; keep `dueTime`, list, attachments, and subtasks.
- Sorting should compare date first, then time when present.
- Notifications should combine `dueDate + dueTime` as local time.

## Date Checks

- Task with `dueDate = "2026-05-09"` appears on May 9 in list, calendar, 7-day view, and selected-day panel.
- Editing time does not move the task to another date.
- Drag from May 9 to May 10 changes `dueDate` to `2026-05-10`.
