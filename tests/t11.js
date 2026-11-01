const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(() => { try { localStorage.setItem('stageplot.detail', 'adv'); } catch {} }); await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(200);
console.log(await p.evaluate(() => { const k = {}; for (const c of plan.cables) { const f = flowOf(c); k[c.type + ':' + f.kind] = (k[c.type + ':' + f.kind] || 0) + 1; } return k; }));
// (flow arrows are checked by drawing below; the text helper was removed as unused)
for (let i = 0; i < 2; i++) await p.click('#zIn');
await p.screenshot({ path: 'h-plot.png' });
const kit = await p.evaluate(() => plan.items.find(i => i.type === 'stagebox').id);
await p.evaluate(id => { sel = { kind: 'item', id }; renderPlot(); renderInspector(); focusItem(id); }, kit);
await p.screenshot({ path: 'h-sel.png' });
const cid = await p.evaluate(() => plan.cables.find(c => flowOf(c).kind === 'out').id);
await p.evaluate(id => { sel = { kind: 'cable', id }; renderPlot(); renderInspector(); }, cid);
await p.screenshot({ path: 'h-cable.png' });
await p.click('#cabBtn'); await p.click('#cabAnim'); await p.waitForTimeout(300);
console.log('anim lines', await p.evaluate(() => document.querySelectorAll('.flowanim').length));
await p.click('#cabFlow'); await p.waitForTimeout(100);
console.log('marks after off', await p.evaluate(() => document.querySelectorAll('.fl').length));
console.log('errors', errs); await b.close(); })();
