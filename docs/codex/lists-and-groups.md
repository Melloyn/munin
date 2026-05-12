# Lists And Groups

Munin supports managed task lists/groups.

## Defaults

Default lists:

- Работа
- Личное
- Учёба
- Здоровье
- Без списка

`Без списка` is a system fallback. It should be visible in filters/selects when needed, but must not be deleted.

## Rules

- Users can add lists.
- Users can rename lists.
- Users can delete lists only safely.
- Do not allow empty list names.
- Do not allow duplicate list names.
- Creating or renaming a list should update selects immediately.

## Compatibility

Old tasks may store list data as a name string. Newer tasks may use ids such as `listId`. Support both unless the code has already migrated data.

If a task refers to a missing list, show it under `Без списка`.

## Delete Behavior

If a list has tasks, use safe behavior:

- block deletion with a clear message; or
- transfer tasks to another list; or
- transfer to `Без списка`.

The current preferred behavior is to block deletion until tasks are moved, unless transfer UI is already implemented.
