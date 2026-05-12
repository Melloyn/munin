# Attachments And Preview

Attachments must be stored as real files under:

`~/Library/Application Support/munin/attachments`

## Metadata

Keep stable metadata where supported by current code:

- `id`
- `originalName`
- `storedName`
- `path` or relative stored path
- `mime` / `type`
- `size`
- `createdAt`

Check current field names before changing handlers.

## Supported Preview Types

Preview should handle:

- images
- PDF
- text: TXT, MD, JSON, XML, HTML, CSS, JS, TS, LOG, RTF if practical
- CSV
- Excel: XLSX, XLS
- Word: DOCX, DOC

CSV/Excel should show readable tables with row limits. Text previews should limit large files by size or line count.

## Word

- DOCX: use the existing implementation if present, likely `mammoth`.
- DOC on macOS: prefer `/usr/bin/textutil`, for example convert to text or sanitized HTML.
- Broken/unsupported DOC must not crash the app.

## Open In System

Use Electron main-process IPC and `shell.openPath`. The path must point to the saved attachment file, not a temporary or stale browser path.

Handle:

- file missing;
- no access;
- system app failed to open.

## Fallbacks

If preview is impossible, show:

`Предпросмотр для этого формата недоступен. Откройте файл в системе.`

For limited files:

`Предпросмотр для этого файла ограничен. Откройте файл в системе.`

Always keep the “Open in system” action available.
