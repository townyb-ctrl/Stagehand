// Stagehand desktop: one window showing the same single-file app the browser runs, with its weeks saved in this computer's app data.
const { app, BrowserWindow, Menu, shell, ipcMain, net, safeStorage } = require('electron');
const fs = require('node:fs');
const path = require('node:path');

process.env.STAGEPLOT_VERSION = app.getVersion();
const isMac = process.platform === 'darwin';
// the app was called Stageplot before; anyone who installed it then keeps their saved weeks from that folder
const oldData = path.join(app.getPath('appData'), 'Stageplot');
if (fs.existsSync(oldData)) app.setPath('userData', oldData);
let win = null;

if (!app.requestSingleInstanceLock()) app.quit();   // a second launch brings the open window forward instead of a second copy with its own saves
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });

/* Planning Center: the page asks, this process calls the API with the church's own Personal Access Token.
   The secret is saved encrypted by the OS keychain (safeStorage) in the app's data folder and never goes back to the page. */
const PCO_API = 'https://api.planningcenteronline.com';
const keyFile = () => path.join(app.getPath('userData'), 'planning-center-key.bin');
function readKey() {
  try { const b = fs.readFileSync(keyFile()); return JSON.parse(safeStorage.isEncryptionAvailable() ? safeStorage.decryptString(b) : b.toString('utf8')); }
  catch { return null; }
}
function writeKey(k) {
  const s = JSON.stringify(k);
  fs.writeFileSync(keyFile(), safeStorage.isEncryptionAvailable() ? safeStorage.encryptString(s) : Buffer.from(s, 'utf8'), { mode: 0o600 });
}
async function pcoGet(key, url) {
  let res;
  try { res = await net.fetch(PCO_API + url, { headers: { Authorization: 'Basic ' + Buffer.from(`${key.id}:${key.secret}`).toString('base64'), Accept: 'application/json' } }); }
  catch (e) { return { error: { code: 'server_unavailable', message: e.message } }; }
  if (res.ok) return { json: await res.json() };
  const code = res.status === 401 ? 'bad_key' : res.status === 403 ? 'no_access' : res.status === 404 ? 'tool_error'
    : res.status === 429 ? 'rate_limited' : res.status >= 500 ? 'server_unavailable' : 'bad_request';
  return { error: { code, status: res.status, retryable: res.status === 429 || res.status >= 500, retryAfterMs: (Number(res.headers.get('retry-after')) || 0) * 1000 || undefined, message: `HTTP ${res.status}` } };
}
ipcMain.handle('pco:status', () => ({ connected: !!readKey() }));
ipcMain.handle('pco:connect', async (_e, id, secret) => {
  const key = { id: String(id || '').trim(), secret: String(secret || '').trim() };
  if (!key.id || !key.secret) return { error: { code: 'bad_key' } };
  const r = await pcoGet(key, '/services/v2/service_types?per_page=1');   // check it works before saving it
  if (r.error) return r;
  writeKey(key); return { ok: true };
});
ipcMain.handle('pco:disconnect', () => { try { fs.rmSync(keyFile(), { force: true }); } catch {} return { ok: true }; });
// read-only and Services only: anything else the page might ask for is refused here
ipcMain.handle('pco:get', async (_e, url) => {
  if (typeof url !== 'string' || !/^\/services\/v2\/[\w/]*(\?[\w.=&%,\-\[\]]*)?$/.test(url)) return { error: { code: 'bad_request', message: 'not allowed' } };
  const key = readKey(); if (!key) return { error: { code: 'no_key' } };
  return pcoGet(key, url);
});

function createWindow() {
  win = new BrowserWindow({
    width: 1440, height: 900, minWidth: 900, minHeight: 600,
    title: 'Stagehand', backgroundColor: '#0d1013', show: false,
    icon: path.join(__dirname, 'app', 'icons', 'icon-512.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true, nodeIntegration: false, spellcheck: true },
  });
  win.once('ready-to-show', () => win.show());
  win.loadFile(path.join(__dirname, 'app', 'index.html'));
  // links (help pages, Planning Center) open in the browser; the window only ever shows Stagehand
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/i.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('file:')) { e.preventDefault(); if (/^https?:/i.test(url)) shell.openExternal(url); } });
  win.on('closed', () => { win = null; });
}

function buildMenu() {
  // Stagehand's own keys (Ctrl+P print, Ctrl+K search, F show mode, Ctrl+Z undo) go to the page, so the menu only adds what a desktop app is expected to have
  const template = [
    ...(isMac ? [{ role: 'appMenu' }] : []),
    { label: 'File', submenu: [isMac ? { role: 'close' } : { role: 'quit' }] },
    { label: 'Edit', submenu: [{ role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }] },
    { label: 'View', submenu: [{ role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }, { type: 'separator' }, { role: 'togglefullscreen' }, ...(app.isPackaged ? [] : [{ type: 'separator' }, { role: 'reload' }, { role: 'toggleDevTools' }])] },
    { role: 'windowMenu' },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  buildMenu(); createWindow();
  app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) createWindow(); });
});
app.on('window-all-closed', () => { if (!isMac) app.quit(); });
