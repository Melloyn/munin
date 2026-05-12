# Prompt Templates

Use these short prompts in future tasks to reduce context.

## Date Bug

```text
Прочитай AGENTS.md и docs/codex/date-rules.md. Исправь баг: задача с dueDate отображается на соседний день. Запрещено использовать new Date('YYYY-MM-DD') и toISOString для dueDate.
```

## Attachment Preview

```text
Прочитай AGENTS.md и docs/codex/attachments-preview.md. Исправь preview вложений. Не ломай shell.openPath, metadata вложений и существующие типы preview. Проверь по docs/codex/test-checklist.md.
```

## Layout

```text
Прочитай AGENTS.md и docs/codex/ui-layout.md. Исправь layout: детали задачи сейчас справа, должны быть снизу. Не трогай даты и вложения без необходимости. Проверь по docs/codex/test-checklist.md.
```

## Counters / State

```text
Прочитай AGENTS.md и docs/codex/state-and-counters.md. Исправь счетчики/прогресс: после изменения задачи UI должен обновляться сразу. Не мутируй tasks напрямую.
```

## New Feature

```text
Прочитай AGENTS.md и docs/codex/README.md. Добавь функцию точечно, без переписывания приложения. Перед изменениями выбери нужные docs/codex/*.md и после проверь регрессию.
```

## Regression Check

```text
Прочитай AGENTS.md и docs/codex/test-checklist.md. Проведи регрессионную проверку Munin после последних изменений и дай отчет: команды, ручные сценарии, найденные риски.
```
