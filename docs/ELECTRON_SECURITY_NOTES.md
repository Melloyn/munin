# Munin Electron Security Notes

Keep Electron boundaries explicit.

- Renderer code must not directly use Node APIs.
- Node, filesystem, system dialogs, shell open, Finder reveal, and drag-out go through `preload.js` and IPC.
- UI-only tasks should not modify `preload.js`, IPC handlers, storage, or persistence.
- Preload APIs must be explicit, minimal, and validated.
- Keep `contextIsolation: true`.
- Keep `nodeIntegration: false`.
- Do not expose arbitrary filesystem paths from renderer to main without validation.
- Do not add dependencies for simple UI fixes.
- Treat packaging/build failures separately from runtime and syntax failures.
- Report DMG / `hdiutil` packaging failures honestly instead of masking them as app logic failures.
