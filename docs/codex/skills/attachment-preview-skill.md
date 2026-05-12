# Attachment Preview Skill

Use for bugs involving attachments, file preview, delete, drag/drop files, or open in system.

## Check

- `main.js`: IPC handlers, filesystem paths, read/open/delete logic.
- `preload.js`: exposed safe methods.
- `src/index.html`: preview rendering, preview cache, attachment UI.

## Preview Types

Support image, PDF, text, CSV, XLSX/XLS, DOCX, DOC. For unknown/binary files, show fallback and keep “Open in system”.

## Rules

- Attachments must be copied to the app attachments folder.
- Use saved metadata, not temporary paths.
- Open through main process and `shell.openPath`.
- Limit large previews by bytes, rows, or lines.
- Clear `previewCache` on delete.
- DOC on macOS can use `/usr/bin/textutil`.

## Tests

Attach PDF, DOCX, DOC, XLSX, TXT/MD, image. Preview, open in system, delete, restart, verify persistence.
