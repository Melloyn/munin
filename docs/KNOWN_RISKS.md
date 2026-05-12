# Munin Known Risks

- `src/index.html` is large and contains most renderer UI/state logic.
- Avoid broad refactors unless explicitly requested.
- Repeated click on the same task currently toggles details closed.
- Calendar selected-day task list still has its own nested scroll container.
- Inline calculator false positives must stay guarded; normal text, dates, references, and plain numbers should not be modified.
- `npm run build` may fail at macOS DMG / `hdiutil` packaging; report separately from JS/CSS syntax failures.
- The project may not be a git repository yet; if `git status` fails, report it honestly.
- Existing `docs/codex/*` instructions may still be useful for older task-specific context.
