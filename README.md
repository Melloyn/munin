# Munin

Local-first macOS task planner inspired by Odin's raven Muninn.

Muninn means memory. Munin is built around that idea: a local place for tasks, notes, files, reminders, and daily control without requiring cloud sync.

## Public Beta

Munin v3.0.0-beta.1 is a public beta/test release. Use it at your own risk and make backups before testing. The app is unsigned and not notarized, so macOS Gatekeeper may warn on first launch.

## v3.0 Features

- Local-first task storage on your Mac.
- List, 7-days, and Calendar views.
- Calendar Add Task with the selected date prefilled.
- Inline task details below the active view.
- Editable subtasks.
- Task notes with Apple Notes-style inline calculator.
- Attachments:
  - file picker add;
  - drag files into tasks;
  - open in system app;
  - show in Finder;
  - delete;
  - drag out to Finder, Mail, or compatible apps with the original filename.
- Portable backup export with tasks, lists, notes, subtasks, attachment metadata, and copied attachment files.
- Preview-only backup import that validates a backup and shows summary/warnings without changing current data.
- Local reminders while Munin is running, using `dueDate` + `dueTime` with persisted dedupe.
- Munin v3.0 icon/logo.

## Install on macOS

Download the correct DMG from the GitHub Release:

- Apple Silicon: [Download arm64 DMG](https://github.com/Melloyn/munin/releases/latest/download/Munin-3.0.0-beta.1-arm64.dmg)
- Intel Mac: [Download x64 DMG](https://github.com/Melloyn/munin/releases/latest/download/Munin-3.0.0-beta.1-x64.dmg)

Open the DMG and drag `Munin.app` to Applications.

Because this beta is unsigned and not notarized, macOS may block the first launch. If that happens:

1. Open Applications.
2. Right click `Munin`.
3. Choose Open.
4. Confirm Open again.

## Data Location

Munin stores app data locally at:

```text
~/Library/Application Support/munin
```

Attachments are copied into local Munin app storage.

## Backups

Use the in-app sidebar actions:

- `Экспорт резервной копии` to create a portable backup.
- `Проверить backup` to preview and validate a backup.

Restore/replace import is not implemented in v3.0.0-beta.1. Backup preview is read-only.

## Known Limitations

- Unsigned and not notarized.
- macOS Gatekeeper may warn on first launch.
- Reminders work only while Munin is running.
- No background reminder daemon.
- No restore/replace import yet.
- Backup preview is read-only.
- No cloud sync.
- No Telegram/MAX integration.
- No Apple Calendar sync.
- No auto-update.
- Large backup preview reads JSON synchronously in the main process.
- Very large attachment drag-out sessions may leave temp files until cleanup.

## Report Bugs

Use GitHub Issues. Include:

- Munin version.
- macOS version.
- Mac chip: Apple Silicon or Intel.
- Steps to reproduce.
- Screenshots if useful.
- Whether backup/export was involved.

## Development

```bash
npm install
npm start
npm run build
```

Build artifacts in `dist/` are not committed. Release DMGs should be attached to GitHub Releases.

## License

License: TBD.
