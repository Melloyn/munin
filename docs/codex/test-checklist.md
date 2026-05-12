# Test Checklist

Run relevant commands:

```bash
node --check main.js
node --check preload.js
npm start
npm run build
```

Use `npm install` only when dependencies changed or are missing.

## Manual Regression

1. Create a task for today.
2. Create a task for tomorrow.
3. Confirm monthly calendar shows each task on the correct local date.
4. Confirm 7-day view shows correct date labels and task placement.
5. Drag a task between days; verify only `dueDate` changes.
6. Complete and reopen tasks; verify sidebar counts and Today progress update immediately.
7. Create, rename, and safely delete/check a group/list.
8. Attach PDF, DOCX, DOC, XLSX, TXT/MD, and image files.
9. Verify previews render or show clear fallback.
10. Verify “Open in system” for each file type.
11. Delete an attachment; verify metadata and file are removed.
12. Restart app; verify tasks, lists, dates, completion state, and attachments persist.

## Report

In the final response include:

- changed files;
- commands run;
- manual checks completed;
- checks not completed and why;
- remaining limitations.
