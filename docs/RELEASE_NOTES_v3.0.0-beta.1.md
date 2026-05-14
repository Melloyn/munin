# Munin v3.0.0-beta.1

Date: 2026-05-14

Munin v3.0.0-beta.1 is a public beta/test release of the local-first macOS task planner.

## What's New

- Local-first task storage.
- List, 7-days, and Calendar views.
- Calendar Add Task with selected date prefilled.
- Inline task details below List / 7-days / Calendar content.
- Editable subtasks.
- Notes with Apple Notes-style inline calculator.
- Attachment workflow:
  - file picker add;
  - drag-in;
  - open;
  - show in Finder;
  - delete;
  - drag-out with original filename.
- Portable backup export with tasks, lists, notes, subtasks, attachment metadata, and copied attachment files.
- Preview-only backup import with validation summary and warnings.
- Local reminders while Munin is running, with persisted dedupe fields.
- v3.0 icon/logo.

## Installation

Download the correct DMG:

- Apple Silicon: `Munin-3.0.0-beta.1-arm64.dmg`
- Intel: `Munin-3.0.0-beta.1-x64.dmg`

Open the DMG and drag `Munin.app` to Applications.

## Unsigned App Warning

This beta is unsigned and not notarized. macOS Gatekeeper may block the first launch. Use right click -> Open -> Open to launch it.

## Backup Before Testing

Before testing, use `Экспорт резервной копии`. You can use `Проверить backup` to validate a backup.

Restore/replace import is not implemented in this beta. Backup preview is read-only.

## Known Limitations

- Reminders only work while Munin is running.
- No background reminder daemon.
- No recurring reminders or snooze.
- No restore/replace import yet.
- No cloud sync.
- No Telegram/MAX integration.
- No Apple Calendar sync.
- No auto-update.
- Large backup preview reads JSON synchronously in the main process.
- Very large attachment drag-out sessions may leave temp files until cleanup.

## Checks Performed

Before release, run:

- `git diff --check`
- `node --check main.js`
- `node --check preload.js`
- renderer syntax check
- package metadata parse
- manual smoke test
- macOS builds for `arm64` and `x64`

## Report Bugs

Open a GitHub Issue and include macOS version, Mac chip, installation method, steps to reproduce, screenshots if useful, and whether backup/export was involved.
