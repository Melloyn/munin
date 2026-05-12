# State Update Skill

Use for completion bugs, stale counters, progress issues, selected task issues, or cache bugs.

## Rules

- Never mutate `tasks` or task objects directly.
- Use immutable `setTasks` updates.
- Save through the existing pipeline.
- Derive counters and progress from current `tasks`.
- Store only `selectedTaskId`; derive selected task from `tasks`.
- Clear selection if the task is deleted.
- Clear attachment preview cache on attachment delete.

## Completion

When toggling completion, update the current completion fields used in code and set/clear `completedAt`.

## Tests

- Complete/reopen a today task; counts and Today progress update immediately.
- Complete a future task; Upcoming and Completed update.
- Delete selected task; bottom panel resets.
- Delete attachment; preview disappears and does not return from cache.
