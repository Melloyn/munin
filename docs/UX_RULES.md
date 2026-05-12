# Munin UX Rules

Use this file before changing renderer UI behavior.

## 7-Days View

- Task details open inline below the weekly board.
- The weekly board remains above task details in the same main scroll page.
- The main area scrolls naturally up to the board and down to details.
- Selecting a task must keep the active tab as 7 days.
- Selecting a task must not change the selected week.
- Day columns must not use nested vertical scroll traps.
- Horizontal scrolling for the week board is acceptable when needed.

## Calendar

- Add Task must prefill the selected calendar date.
- Calendar creation uses isolated `calendarDraft` state.
- Calendar draft must not mutate List or 7-days draft state.
- Empty, invalid, or rollover dates such as `2026-02-31` must be rejected.
- Calendar remains active after save or cancel.
- If the user changes dueDate before saving, Calendar should switch to that date/month so the task is visible.

## Task Details

- Task details must work from List, 7 days, and Calendar.
- Details belong below the active view in main content, not in the sidebar or a right panel.
- Note editing must preserve user input.
- Subtasks edit inline inside task details.
- Empty subtask titles are rejected and edit mode stays open.

## Inline Note Calculator

- Results appear inline in the note text after `=`.
- Do not show a separate calculator result panel.
- Do not use `eval()`.
- Do not use `new Function()`.
- Calculate only standalone formula lines.
- Do not modify normal text such as `Версия 2=`, `Дата 2026-05-12=`, `номер 10/2026=`, or `Сумма 2500=`.
- Plain numbers such as `2500=` and unary-only negatives such as `-10=` must stay unchanged.
