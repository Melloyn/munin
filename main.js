const { app, BrowserWindow, ipcMain, Notification, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { execFile } = require('child_process');
const { promisify } = require('util');
const XLSX = require('xlsx');
const mammoth = require('mammoth');

const dataDir  = app.getPath('userData');
const dataPath = path.join(dataDir, 'tasks.json');
const attDir   = path.join(dataDir, 'attachments');
const dragIconPath = path.join(__dirname, 'src', 'assets', 'icon.png');

if (!fs.existsSync(attDir)) fs.mkdirSync(attDir, { recursive: true });

const PREVIEW_ROWS = 150;
const PREVIEW_COLS = 50;
const TEXT_PREVIEW_BYTES = 500 * 1024;
const TEXT_PREVIEW_LINES = 2000;
const TEXTUTIL_PATH = '/usr/bin/textutil';
const TEXTUTIL_MAX_BUFFER = 2 * 1024 * 1024;
const execFileAsync = promisify(execFile);

const MIME_BY_EXT = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  pdf: 'application/pdf',
  txt: 'text/plain',
  csv: 'text/csv',
  md: 'text/markdown',
  json: 'application/json',
  xml: 'application/xml',
  html: 'text/html',
  htm: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  ts: 'text/typescript',
  log: 'text/plain',
  rtf: 'application/rtf',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  doc: 'application/msword'
};

const TEXT_EXTS = new Set(['txt','md','json','xml','html','htm','css','js','ts','log','rtf']);

function makeAttachmentId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function toSafeStoredName(id, srcPath) {
  const ext = path.extname(srcPath).toLowerCase();
  return `${id}${ext}`;
}

function isInsideAttachments(filePath) {
  const root = path.resolve(attDir);
  const resolved = path.resolve(filePath);
  return resolved === root || resolved.startsWith(root + path.sep);
}

function normalizeAttachmentPath(fileRef) {
  const ref = typeof fileRef === 'string' ? { path: fileRef } : (fileRef || {});
  let candidate = ref.path || ref.filePath || '';
  if (!candidate && ref.storedName) candidate = path.join(attDir, ref.storedName);
  if (!candidate && ref.relativePath) candidate = path.join(attDir, ref.relativePath);
  if (!candidate) return { ok: false, error: 'Путь к вложению не сохранён.' };

  const resolved = path.resolve(candidate);
  if (!isInsideAttachments(resolved)) {
    return { ok: false, error: 'Доступ к этому файлу запрещён.' };
  }
  return { ok: true, path: resolved };
}

function resolveAttachmentFile(fileRef) {
  const normalized = normalizeAttachmentPath(fileRef);
  if (!normalized.ok) return normalized;
  const filePath = normalized.path;
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return { ok: false, error: 'Вложение не является файлом.' };
    return { ok: true, path: filePath };
  } catch (e) {
    if (e.code === 'ENOENT') return { ok: false, error: 'Файл вложения не найден.' };
    if (e.code === 'EACCES' || e.code === 'EPERM') return { ok: false, error: 'Нет доступа к файлу вложения.' };
    return { ok: false, error: e.message || 'Не удалось получить файл вложения.' };
  }
}

function attachmentMeta(srcPath, destPath, id) {
  const stat = fs.statSync(destPath);
  const ext = path.extname(srcPath).toLowerCase().replace('.', '');
  const storedName = path.basename(destPath);
  return {
    id,
    originalName: path.basename(srcPath),
    name: path.basename(srcPath),
    storedName,
    path: destPath,
    mime: MIME_BY_EXT[ext] || 'application/octet-stream',
    type: MIME_BY_EXT[ext] || 'application/octet-stream',
    ext,
    size: stat.size,
    createdAt: new Date().toISOString()
  };
}

function copyAttachment(srcPath) {
  const stat = fs.statSync(srcPath);
  if (!stat.isFile()) throw new Error('Можно прикреплять только файлы.');
  const id = makeAttachmentId();
  const dest = path.join(attDir, toSafeStoredName(id, srcPath));
  fs.copyFileSync(srcPath, dest);
  return attachmentMeta(srcPath, dest, id);
}

function backupTimestamp() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}

function uniqueBackupDir(parentDir) {
  const base = `Munin Backup ${backupTimestamp()}`;
  let candidate = path.join(parentDir, base);
  let idx = 2;
  while (fs.existsSync(candidate)) {
    candidate = path.join(parentDir, `${base} ${idx}`);
    idx += 1;
  }
  return candidate;
}

function uniqueBackupFileName(dir, preferredName) {
  const parsed = path.parse(preferredName || `attachment_${makeAttachmentId()}`);
  const base = (parsed.name || 'attachment').replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').slice(0, 120) || 'attachment';
  const ext = parsed.ext || '';
  let name = `${base}${ext}`;
  let candidate = path.join(dir, name);
  let idx = 2;
  while (fs.existsSync(candidate)) {
    name = `${base}_${idx}${ext}`;
    candidate = path.join(dir, name);
    idx += 1;
  }
  return { name, path: candidate };
}

function collectBackupAttachments(tasks) {
  const seen = new Set();
  const result = [];
  const invalid = [];
  for (const task of Array.isArray(tasks) ? tasks : []) {
    const taskId = task && typeof task === 'object' ? task.id : null;
    for (const att of Array.isArray(task?.attachments) ? task.attachments : []) {
      if (!att || typeof att !== 'object' || Array.isArray(att)) {
        invalid.push({ taskId, reason: 'Некорректные метаданные вложения.' });
        continue;
      }
      const key = att.id || att.storedName || att.path || att.filePath;
      if (!key) {
        invalid.push({
          taskId,
          originalName: att.originalName || att.name || null,
          reason: 'Не найден id, storedName или path вложения.'
        });
        continue;
      }
      if (seen.has(key)) continue;
      seen.add(key);
      result.push({ taskId, key: String(key), attachment: att });
    }
  }
  return { valid: result, invalid };
}

function sanitizeAttachmentForBackup(att, backupRelativePath) {
  const safe = {};
  for (const key of ['id','originalName','name','storedName','mime','type','ext','size','createdAt']) {
    if (att && Object.prototype.hasOwnProperty.call(att, key)) safe[key] = att[key];
  }
  if (backupRelativePath) {
    safe.backupRelativePath = backupRelativePath;
    safe.path = backupRelativePath;
  }
  return safe;
}

function sanitizeTasksForBackup(tasks, attachmentPathMap) {
  return (Array.isArray(tasks) ? tasks : []).map(task => {
    if (!task || typeof task !== 'object' || Array.isArray(task)) return task;
    const copy = { ...task };
    copy.attachments = (Array.isArray(task.attachments) ? task.attachments : []).map(att => {
      if (!att || typeof att !== 'object' || Array.isArray(att)) return null;
      const key = att.id || att.storedName || att.path || att.filePath;
      if (!key) return sanitizeAttachmentForBackup(att, null);
      const backupRelativePath = attachmentPathMap.get(String(key)) || null;
      return sanitizeAttachmentForBackup(att, backupRelativePath);
    }).filter(Boolean);
    return copy;
  });
}

function isLikelyBinary(buffer) {
  if (!buffer.length) return false;
  if (buffer.includes(0)) return true;
  const sample = buffer.toString('utf8');
  const replacementCount = (sample.match(/\uFFFD/g) || []).length;
  return replacementCount > Math.max(8, sample.length * 0.02);
}

function stripRtf(raw) {
  return raw
    .replace(/\\par[d]?/g, '\n')
    .replace(/\\'[0-9a-fA-F]{2}/g, ' ')
    .replace(/[{}]/g, '')
    .replace(/\\[a-zA-Z]+-?\d* ?/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function shapeTextPreview(raw, truncated = false) {
  const lines = raw.split(/\r?\n/);
  const lineLimited = lines.length > TEXT_PREVIEW_LINES;
  const text = lineLimited ? lines.slice(0, TEXT_PREVIEW_LINES).join('\n') : raw;
  return {
    kind: 'text',
    text,
    truncated: truncated || lineLimited,
    message: truncated || lineLimited ? 'Предпросмотр для этого файла ограничен. Откройте файл в системе.' : ''
  };
}

function readTextPreview(filePath, ext) {
  const handle = fs.openSync(filePath, 'r');
  try {
    const buffer = Buffer.alloc(TEXT_PREVIEW_BYTES + 1);
    const bytesRead = fs.readSync(handle, buffer, 0, TEXT_PREVIEW_BYTES + 1, 0);
    const slice = buffer.subarray(0, Math.min(bytesRead, TEXT_PREVIEW_BYTES));
    if (isLikelyBinary(slice)) {
      return {
        kind: 'unsupported',
        message: 'Предпросмотр для этого файла ограничен. Откройте файл в системе.'
      };
    }
    let raw = slice.toString('utf8');
    if (ext === 'rtf') raw = stripRtf(raw);
    if (ext === 'json') {
      try { raw = JSON.stringify(JSON.parse(raw), null, 2); } catch (e) {}
    }
    const byteLimited = bytesRead > TEXT_PREVIEW_BYTES;
    return shapeTextPreview(raw, byteLimited);
  } finally {
    fs.closeSync(handle);
  }
}

async function readDocxPreview(filePath) {
  const result = await mammoth.convertToHtml({ path: filePath });
  return {
    kind: 'html',
    html: result.value || '<p>Документ не содержит текста для предпросмотра.</p>',
    messages: (result.messages || []).map(m => m.message).filter(Boolean).slice(0, 5)
  };
}

async function readDocPreview(filePath) {
  try {
    const { stdout } = await execFileAsync(TEXTUTIL_PATH, ['-convert', 'txt', '-stdout', filePath], {
      encoding: 'utf8',
      maxBuffer: TEXTUTIL_MAX_BUFFER,
      timeout: 15000
    });
    const limited = Buffer.byteLength(stdout || '', 'utf8') > TEXT_PREVIEW_BYTES;
    const text = (stdout || '').slice(0, TEXT_PREVIEW_BYTES).trim();
    if (!text) {
      return {
        kind: 'unsupported',
        message: 'Не удалось сформировать предпросмотр .doc. Откройте файл в системе.'
      };
    }
    return shapeTextPreview(text, limited);
  } catch (e) {
    return {
      kind: 'unsupported',
      message: 'Не удалось сформировать предпросмотр .doc. Откройте файл в системе.'
    };
  }
}

function readSheetPreview(filePath) {
  const workbook = XLSX.readFile(filePath, { dense: false });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return { kind: 'table', sheetName: '', rows: [], truncatedRows: false, truncatedCols: false };
  const allRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: '', blankrows: false });
  const rows = allRows.slice(0, PREVIEW_ROWS).map(row => row.slice(0, PREVIEW_COLS));
  const maxCols = allRows.reduce((m, row) => Math.max(m, row.length), 0);
  return {
    kind: 'table',
    sheetName,
    rows,
    truncatedRows: allRows.length > PREVIEW_ROWS,
    truncatedCols: maxCols > PREVIEW_COLS,
    rowLimit: PREVIEW_ROWS,
    colLimit: PREVIEW_COLS
  };
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1300, height: 840, minWidth: 920, minHeight: 620,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0f0f11',
    webPreferences: {
      nodeIntegration: false, contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'src', 'assets', 'icon.png'),
    show: false
  });
  win.loadFile(path.join(__dirname, 'src', 'index.html'));
  win.once('ready-to-show', () => win.show());
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
}

ipcMain.handle('load-tasks', async () => {
  try {
    if (fs.existsSync(dataPath)) return { ok: true, tasks: JSON.parse(fs.readFileSync(dataPath, 'utf8')) };
    return { ok: true, tasks: null };
  } catch(e) { return { ok: false, tasks: null }; }
});

ipcMain.handle('save-tasks', async (_, tasks) => {
  try { fs.writeFileSync(dataPath, JSON.stringify(tasks, null, 2), 'utf8'); return { ok: true }; }
  catch(e) { return { ok: false }; }
});

ipcMain.handle('export-backup', async (_, snapshot) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Выберите папку для резервной копии Munin',
    properties: ['openDirectory', 'createDirectory']
  });
  if (canceled || !filePaths.length) return { ok: false, canceled: true };

  try {
    const tasks = Array.isArray(snapshot?.tasks) ? snapshot.tasks : [];
    const lists = Array.isArray(snapshot?.lists) ? snapshot.lists : [];
    const exportDir = uniqueBackupDir(filePaths[0]);
    const exportAttachmentsDir = path.join(exportDir, 'attachments');
    fs.mkdirSync(exportAttachmentsDir, { recursive: true });

    const copiedAttachments = [];
    const missingAttachments = [];
    const collectedAttachments = collectBackupAttachments(tasks);
    const invalidAttachments = [...collectedAttachments.invalid];
    const attachmentPathMap = new Map();
    for (const item of collectedAttachments.valid) {
      const att = item.attachment;
      const resolved = resolveAttachmentFile(att);
      if (!resolved.ok) {
        missingAttachments.push({
          taskId: item.taskId,
          id: att.id || null,
          originalName: att.originalName || att.name || null,
          storedName: att.storedName || null,
          error: resolved.error
        });
        continue;
      }
      const preferredName = att.storedName || path.basename(resolved.path);
      const dest = uniqueBackupFileName(exportAttachmentsDir, preferredName);
      fs.copyFileSync(resolved.path, dest.path);
      const backupRelativePath = path.posix.join('attachments', dest.name);
      attachmentPathMap.set(item.key, backupRelativePath);
      copiedAttachments.push({
        taskId: item.taskId,
        id: att.id || null,
        originalName: att.originalName || att.name || null,
        storedName: att.storedName || path.basename(resolved.path),
        backupRelativePath,
        size: fs.statSync(dest.path).size
      });
    }
    const exportedTasks = sanitizeTasksForBackup(tasks, attachmentPathMap);

    const backup = {
      app: 'Munin',
      backupVersion: 1,
      exportedAt: new Date().toISOString(),
      data: {
        version: 2,
        tasks: exportedTasks,
        lists
      },
      attachments: {
        included: true,
        copied: copiedAttachments,
        missing: missingAttachments,
        invalid: invalidAttachments
      }
    };
    const jsonPath = path.join(exportDir, 'munin-backup.json');
    fs.writeFileSync(jsonPath, JSON.stringify(backup, null, 2), 'utf8');
    return {
      ok: true,
      exportDir,
      jsonPath,
      copiedAttachments: copiedAttachments.length,
      missingAttachments: missingAttachments.length
    };
  } catch (e) {
    return { ok: false, error: e.message || 'Не удалось создать резервную копию.' };
  }
});

ipcMain.handle('attach-file', async (_, taskId) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Выберите файл',
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Все файлы', extensions: ['*'] },
      { name: 'Изображения', extensions: ['png','jpg','jpeg','gif','webp'] },
      { name: 'Документы', extensions: ['pdf','docx','doc','xlsx','xls','csv','txt','md','json','xml','html','css','js','ts','log','rtf'] }
    ]
  });
  if (canceled || !filePaths.length) return { ok: false };
  try {
    return { ok: true, files: filePaths.map(copyAttachment) };
  } catch (e) {
    return { ok: false, error: e.message || 'Не удалось сохранить вложение.' };
  }
});

ipcMain.handle('attach-dropped-files', async (_, filePaths) => {
  if (!Array.isArray(filePaths) || !filePaths.length) return { ok: false, error: 'Файлы не выбраны.' };
  const saved = [];
  try {
    for (const src of filePaths) {
      if (typeof src !== 'string' || !src) continue;
      saved.push(copyAttachment(src));
    }
    return saved.length
      ? { ok: true, files: saved }
      : { ok: false, error: 'Не удалось получить путь к перетащенному файлу.' };
  } catch (e) {
    return { ok: false, error: e.message || 'Не удалось сохранить вложение.' };
  }
});

ipcMain.handle('read-attachment', async (_, fileRef) => {
  try {
    const normalized = normalizeAttachmentPath(fileRef);
    if (!normalized.ok) return { ok: false, error: normalized.error };
    const filePath = normalized.path;
    fs.accessSync(filePath, fs.constants.R_OK);
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return { ok: false, error: 'Вложение не является файлом.' };

    const ext  = path.extname(filePath).toLowerCase().replace('.','');
    const mime = MIME_BY_EXT[ext] || 'application/octet-stream';
    if (['png','jpg','jpeg','gif','webp'].includes(ext)) {
      const data = fs.readFileSync(filePath);
      return { ok: true, kind: 'image', data: data.toString('base64'), mime };
    }
    if (ext === 'pdf') {
      const data = fs.readFileSync(filePath);
      return { ok: true, kind: 'pdf', data: data.toString('base64'), mime };
    }
    if (['xlsx','xls','csv'].includes(ext)) {
      return { ok: true, mime, ...readSheetPreview(filePath) };
    }
    if (ext === 'docx') {
      return { ok: true, mime, ...await readDocxPreview(filePath) };
    }
    if (ext === 'doc') {
      return { ok: true, mime, ...await readDocPreview(filePath) };
    }
    if (TEXT_EXTS.has(ext) || mime.startsWith('text/')) {
      return { ok: true, mime, ...readTextPreview(filePath, ext) };
    }
    return {
      ok: true,
      kind: 'unsupported',
      mime,
      message: 'Предпросмотр для этого формата недоступен. Откройте файл в системе.'
    };
  } catch(e) {
    if (e.code === 'ENOENT') return { ok: false, error: 'Файл вложения не найден.' };
    if (e.code === 'EACCES' || e.code === 'EPERM') return { ok: false, error: 'Нет доступа к файлу вложения.' };
    return { ok: false, error: e.message || 'Не удалось открыть предпросмотр.' };
  }
});

ipcMain.handle('open-attachment', async (_, fileRef) => {
  try {
    const resolved = resolveAttachmentFile(fileRef);
    if (!resolved.ok) return resolved;
    const filePath = resolved.path;
    const error = await shell.openPath(filePath);
    return error
      ? { ok: false, error: `Не удалось открыть файл системным приложением: ${error}` }
      : { ok: true };
  } catch(e) {
    if (e.code === 'ENOENT') return { ok: false, error: 'Файл вложения не найден.' };
    if (e.code === 'EACCES' || e.code === 'EPERM') return { ok: false, error: 'Нет доступа к файлу вложения.' };
    return { ok: false, error: e.message || 'Не удалось открыть файл системным приложением.' };
  }
});

ipcMain.handle('show-attachment-in-folder', async (_, fileRef) => {
  const resolved = resolveAttachmentFile(fileRef);
  if (!resolved.ok) return resolved;
  shell.showItemInFolder(resolved.path);
  return { ok: true };
});

ipcMain.on('start-attachment-drag', (event, fileRef) => {
  const resolved = resolveAttachmentFile(fileRef);
  if (!resolved.ok) {
    event.returnValue = resolved;
    return;
  }
  try {
    event.sender.startDrag({
      file: resolved.path,
      icon: fs.existsSync(dragIconPath) ? dragIconPath : resolved.path
    });
    event.returnValue = { ok: true };
  } catch (e) {
    event.returnValue = { ok: false, error: e.message || 'Не удалось начать перетаскивание файла.' };
  }
});

ipcMain.handle('delete-attachment', async (_, fileRef) => {
  try {
    const normalized = normalizeAttachmentPath(fileRef);
    if (!normalized.ok) return { ok: false, error: normalized.error };
    fs.unlinkSync(normalized.path);
    return { ok: true };
  } catch(e) {
    if (e.code === 'ENOENT') return { ok: true, missing: true };
    if (e.code === 'EACCES' || e.code === 'EPERM') return { ok: false, error: 'Нет доступа для удаления файла вложения.' };
    return { ok: false, error: e.message || 'Не удалось удалить вложение.' };
  }
});

ipcMain.handle('notify', async (_, { title, body }) => {
  if (Notification.isSupported()) new Notification({ title, body }).show();
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
