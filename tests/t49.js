// offline: served over http, the service worker caches the app; offline reload still runs with saved weeks
const { chromium } = require(require('./app.js').pw); const { spawn } = require('child_process');
const srv = spawn('python3', ['-m', 'http.server', '8765'], { cwd: require('./app.js').dir, stdio: 'ignore' });
(async () => { await new Promise(r => setTimeout(r, 800)); const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(500);
console.log('manifest', await p.evaluate(async () => (await (await fetch(document.querySelector('link[rel=manifest]').href)).json()).name));
await p.evaluate(() => navigator.serviceWorker.ready); console.log('sw active', await p.evaluate(() => !!navigator.serviceWorker.controller || !!navigator.serviceWorker.ready));
await p.click('#welcomeExample'); await p.waitForTimeout(300); await p.reload(); await p.waitForTimeout(600);
console.log('controlled', await p.evaluate(() => !!navigator.serviceWorker.controller));
await ctx.setOffline(true); await p.reload(); await p.waitForTimeout(800);
console.log('offline loads', await p.evaluate(() => typeof plan === 'object' && plan.team.length), 'view', await p.evaluate(() => view));
await p.evaluate(() => goHome('prefs')); console.log('install card', await p.evaluate(() => /Use it offline/.test($('homeBody').textContent)));
console.log('errors', errs); await b.close(); srv.kill(); })();
