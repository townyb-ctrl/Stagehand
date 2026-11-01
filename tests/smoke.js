// must pass before any commit: the page loads with no errors and the main views render
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const errs = []; const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(600);
const ok = [await p.isVisible('#welcomeExample')];
await p.click('#welcomeExample'); await p.waitForTimeout(300);
for (const v of ['plot', 'paper', 'home']) { await p.evaluate(v => { view = v; renderAll(); }, v); await p.waitForTimeout(150); ok.push(await p.evaluate(v => !$(v === 'plot' ? 'plotView' : v === 'paper' ? 'paperView' : 'homeView').hidden, v)); }
console.log(ok.every(Boolean) && !errs.length ? 'SMOKE OK' : 'SMOKE FAIL ' + JSON.stringify({ ok, errs })); await b.close(); })();
