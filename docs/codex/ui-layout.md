# UI Layout

Munin uses a left sidebar plus one main work area.

## Required Layout

Use this structure:

```text
[sidebar] [main content]
          [header / tabs]
          [list OR 7-day OR calendar]
          [add task form when relevant]
          [bottom task details panel]
          [attachment preview cards]
```

Task details and attachment previews belong below the active main view.

## Forbidden Layout

Do not reintroduce:

```text
[sidebar] [tasks] [details right panel]
```

Avoid:

- right details column;
- details sidebar;
- split-view details pane;
- `grid-template-columns: 1fr 500px` for details;
- fixed or absolute positioning for the details panel.

## Behavior

- Clicking a task in List, 7-day, or Calendar sets `selectedTaskId`.
- The selected task is visually highlighted.
- Bottom details show title, date, time, list, priority, status, subtasks, attachments, and previews.
- If no task is selected, show a clear placeholder.
- Long previews scroll inside preview cards or the page; do not create horizontal page scroll.

## Attachments UX

Attachment previews should be in the bottom panel. Show preview cards with name, size/type, open in system, expand/collapse, and delete.
