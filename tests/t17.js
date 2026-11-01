const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(200);
await p.evaluate(() => mutate(() => { plan.channels.push({ id: 'tr1', name: 'Trench 1', kind: 'trench', pts: [[2, 3], [30, 3], [30, 19]] }, { id: 'ts1', name: 'Truss 1', kind: 'truss', pts: [[-4, 21], [36, 21]] }); autoCable(); addGear('multifx', 24, 9); addGear('el_guitar', 26, 9); addGear('ac_guitar', 10, 12); addGear('la_main', 14, -3); addGear('la_sub', 20, -3); }));
await p.evaluate(() => { sel = null; setCableView(() => { cableView.hideInCh = true; }); });
await p.screenshot({ path: 'n-ghost.png' });
console.log('ghosts', await p.evaluate(() => document.querySelectorAll('.ch-ghost').length), 'bands', await p.evaluate(() => document.querySelectorAll('.ch-band').length));
console.log('errors', errs); await b.close(); })();
