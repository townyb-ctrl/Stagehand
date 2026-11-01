const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.addInitScript(() => { try { localStorage.setItem('stageplot.detail', 'adv'); } catch {} });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(800); await p.click('#welcomeExample'); await p.waitForTimeout(300); await p.evaluate(() => document.querySelector('.toast')?.remove());
await p.screenshot({ path: 'sym-plot.png' });
for (let i = 0; i < 3; i++) await p.click('#zIn');
await p.waitForTimeout(200); await p.screenshot({ path: 'sym-zoom.png' });
await p.click('#tGear'); await p.waitForTimeout(200); await p.screenshot({ path: 'sym-gear.png' });
// drag an item still works
const pid = await p.evaluate(() => plan.items.find(i => i.type === 'pedalboard').id); await p.evaluate(id => focusItem(id), pid); await p.waitForTimeout(200); const it = await p.$(`#plot .item[data-id="${pid}"]`); const bb = await it.boundingBox();
await p.mouse.move(bb.x + bb.width/2, bb.y + bb.height/2); await p.mouse.down(); await p.mouse.move(bb.x + 80, bb.y + 30, { steps: 4 }); await p.mouse.up();
console.log('undo enabled', await p.evaluate(() => !document.getElementById('undoBtn').disabled), 'errors', errs); await b.close(); })();
