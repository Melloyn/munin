# State And Counters

## Immutable Updates

Do not mutate tasks directly:

```js
task.completed = true
tasks[index].completed = true
```

Use immutable updates:

```js
setTasks(prev => prev.map(task =>
  task.id === taskId ? { ...task, completed: true } : task
));
```

Preserve the existing save pipeline. If `setTasks` already persists, use that path.

## Completion

When toggling completion:

- create a new task object;
- update all completion aliases used by current code after verifying names;
- set `completedAt = new Date().toISOString()` when completed;
- clear `completedAt` when returned to active.

`completedAt` must not affect `dueDate`.

## Sidebar Counts

Counts should be derived from current `tasks` state:

- Today: active tasks whose `dueDate` is today locally.
- Upcoming: active tasks whose `dueDate` is greater than today locally.
- All tasks: active tasks.
- Completed: completed tasks.
- Lists/groups: follow current app logic, usually active tasks in each list.

Use local date helpers from `date-rules.md`.

## Today Progress

Progress should be:

- `total`: all tasks due today;
- `completed`: completed tasks due today;
- `percent`: `completed / total`.

It must update immediately after completing or reopening a task.

## Selection And Cache

- Use `selectedTaskId` for the chosen task; derive the task from current `tasks`.
- If the selected task is deleted, clear `selectedTaskId`.
- If the selected task disappears from the current filter, either clear it or select a visible task.
- Use `previewCache` by attachment id; clear cache entries when an attachment is deleted.
