---
name: ux-product-reviewer
description: Review Munin behavior from a user/product perspective, focusing on flow clarity, context preservation, user effort, and confusing states rather than code style.
---

# UX Product Reviewer Skill

## Purpose

Use this skill to review user behavior and product flow, not implementation style.

## Check

- Is the user flow clear?
- How many clicks or steps are required?
- Does the app preserve user context?
- Can the user scroll back to where they came from?
- Does active view/date/week/task state reset unexpectedly?
- Does the user get stuck in a detail, create, or edit state?
- Does the UI remain coherent with Munin's dark theme?
- Are empty, error, and cancel states understandable?

## Munin Flows

- 7 days: task details below weekly board, selected week preserved.
- Calendar: selected date preserved, Add Task uses selected date.
- Task details: notes, subtasks, attachments, and metadata remain discoverable.
- Calculator: inline result should feel like note editing, not a separate tool.

## Output

Return:

- UX blockers
- Confusing behavior
- Suggested UX fixes
- Acceptance recommendation
