# Architecture

Munin is an Electron/macOS task planner.

## Main Process

`main.js` owns Electron startup, BrowserWindow security settings, IPC handlers, local filesystem access, attachment storage, file reading, and opening files through Electron APIs such as `shell.openPath`.

Check the current IPC names in `main.js` before adding or changing renderer calls.

## Preload

`preload.js` is the only bridge from renderer to Node/Electron APIs. Keep:

- `nodeIntegration: false`
- `contextIsolation: true`
- Node/Electron access exposed only through `contextBridge`

Do not import Node APIs directly from `src/index.html`.

## Renderer

`src/index.html` contains the React UI and most task state logic: lists, filters, calendar, 7-day view, task cards, details panel, attachments UI, and preview rendering.

## Data

- Tasks: `~/Library/Application Support/munin/tasks.json`
- Attachments: `~/Library/Application Support/munin/attachments`

The save/load pipeline should preserve old data. If changing storage format, load old formats and save the new format after migration. Verify in code before assuming exact field names.

## Change Style

Patch narrowly. Do not split the app into a new framework or move large chunks unless the user explicitly asks.
