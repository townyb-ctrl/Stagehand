// Tells the page it runs as the installed desktop app (no browser install prompt, no service worker), and lets it read Planning Center through the app.
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('stageplotDesktop', {
  platform: process.platform, version: process.env.STAGEPLOT_VERSION || '',
  pco: {
    status: () => ipcRenderer.invoke('pco:status'),
    connect: (id, secret) => ipcRenderer.invoke('pco:connect', id, secret),
    disconnect: () => ipcRenderer.invoke('pco:disconnect'),
    get: url => ipcRenderer.invoke('pco:get', url),
  },
});
