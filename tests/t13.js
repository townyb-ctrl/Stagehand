const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(() => { try { localStorage.setItem('stageplot.detail', 'adv'); } catch {} }); await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(200);
// a floor trench across the upstage area and re-run cabling
await p.evaluate(() => { mutate(() => { plan.channels.push({ id: 'tr1', name: 'Trench 1', kind: 'trench', pts: [[2, 3], [30, 3], [30, 19]] }); autoCable(); }); });
console.log('via', await p.evaluate(() => plan.cables.filter(c => routeInfo(c).via).length));
await p.screenshot({ path: 'j-shown.png' });
await p.click('#cabBtn'); await p.click('#cabInCh'); await p.mouse.click(700, 880); await p.waitForTimeout(200);
console.log('ports', await p.evaluate(() => document.querySelectorAll('.chport').length), 'label', await p.evaluate(() => [...document.querySelectorAll('.ch-label')].map(t => t.textContent)));
await p.screenshot({ path: 'j-hidden.png' });
const cid = await p.evaluate(() => plan.cables.find(c => routeInfo(c).via).id);
await p.evaluate(id => { sel = { kind: 'cable', id }; renderPlot(); renderInspector(); }, cid);
console.log('inside shown for selected', await p.evaluate(() => document.querySelectorAll('.cab-inside').length));
console.log('errors', errs); await b.close(); })();
