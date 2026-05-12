---
name: code-reviewer
description: Review recent changes or diffs for bugs, regressions, architecture violations, unsafe changes, UI issues, missing validation, and missing tests. Use after implementation tasks before handoff.
---

# Code Reviewer Skill

## Purpose

Use this skill to review code changes, not to implement features.

Rules:

- Do not edit code during review unless explicitly asked.
- Do not praise code.
- Focus on actionable issues.
- Be strict about regressions and scope creep.
- Prefer concrete file/line references.
- Separate blockers, important issues, and minor issues.

## Review Scope

Check:

- whether the implementation matches the requested task;
- whether changes are limited to the requested scope;
- whether unrelated files or generated/build artifacts were changed;
- whether existing user flows regressed;
- whether app state is isolated correctly;
- whether shared state mutations can leak between views;
- whether backend, preload, IPC, storage, or persistence changed unexpectedly;
- whether UI layout works on narrow and large screens;
- whether scrolling creates nested-scroll traps;
- whether keyboard/focus behavior is acceptable;
- whether errors are visible and validation is consistent.

## Munin-Specific Checks

Always check relevant flows:

- List view.
- 7 days view.
- Calendar view.
- Bottom task details panel.
- Notes and inline calculator.
- Subtasks.
- Attachments when touched.

7 days:

- Weekly board remains above inline details.
- Main area scrolls naturally.
- Selected week remains unchanged.
- Active tab remains 7 days.
- Adding/cancelling a task keeps the user in 7 days.

Calendar:

- Add Task pre-fills selected date.
- Calendar uses isolated `calendarDraft`.
- Calendar draft does not mutate List or 7-days draft state.
- Invalid/rollover dates are rejected.
- Calendar remains active after save/cancel.

Subtasks:

- Empty titles are rejected.
- The edited subtask belongs to the selected parent task.
- Wrong task/subtask pairs fail safely.
- Complete/reopen/delete still work.

Calculator:

- No `eval()`.
- No `new Function()`.
- Normal text, dates, references, and plain numbers are not modified.
- Invalid expressions do not crash or overwrite.

## Build/Test Checks

Report which checks were run:

- renderer syntax check if available;
- `node --check main.js`;
- `node --check preload.js`;
- `npm start` smoke check if practical;
- `npm run build` if practical.

If build fails due to macOS packaging / `hdiutil` / DMG permissions but JS/CSS checks pass, report that separately. If `git status` is unavailable because the directory is not a git repository, report it honestly.

## Output Format

Always return:

1. Blockers
2. Important Issues
3. Minor Issues
4. Suggested Fixes
5. Files To Inspect
6. Checklist Result
7. Handoff Status
