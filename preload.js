const { contextBridge, ipcRenderer, webUtils } = require('electron');
contextBridge.exposeInMainWorld('muninAPI', {
  loadTasks:        ()       => ipcRenderer.invoke('load-tasks'),
  saveTasks:        (tasks)  => ipcRenderer.invoke('save-tasks', tasks),
  notify:           (opts)   => ipcRenderer.invoke('notify', opts),
  attachFile:       (taskId) => ipcRenderer.invoke('attach-file', taskId),
  attachDroppedFiles:(paths) => ipcRenderer.invoke('attach-dropped-files', paths),
  getDroppedFilePath:(file) => {
    try {
      if (webUtils?.getPathForFile) return webUtils.getPathForFile(file);
      return file?.path || '';
    } catch (e) {
      return '';
    }
  },
  readAttachment:   (file)   => ipcRenderer.invoke('read-attachment', file),
  openAttachment:   (file)   => ipcRenderer.invoke('open-attachment', file),
  showAttachmentInFinder:(file) => ipcRenderer.invoke('show-attachment-in-folder', file),
  startDragAttachment:(file) => ipcRenderer.sendSync('start-attachment-drag', file),
  deleteAttachment: (file)   => ipcRenderer.invoke('delete-attachment', file),
});
