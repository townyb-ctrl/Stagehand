const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(200);
await p.evaluate(() => mutate(() => { plan.channels.push({ id: 'tr1', name: 'Trench 1', kind: 'trench', pts: [[2, 12], [30, 12]] }); }));
const at = async (fx, fy) => p.evaluate(([fx, fy]) => { const m = document.getElementById('plot').getScreenCTM(); return [fx * m.a + m.e, fy * m.d + m.f]; }, [fx, fy]);
// drop a DI from the gear tab onto the trench (simulate drop via addGear + channelAt as the drop handler does)
await p.evaluate(() => addGear('di_mono', 14, 12.3, channelAt({ x: 14, y: 12.3 })));
console.log('dropped', await p.evaluate(() => { const it = plan.items[plan.items.length - 1]; return [it.type, it.chan && it.chan.id, it.y]; }));
// drag an existing wedge onto the trench
await p.evaluate(() => addGear('wedge', 20, 16));
const wid = await p.evaluate(() => plan.items[plan.items.length - 1].id);
const box = await (await p.$(`#plot .item[data-id="${wid}"]`)).boundingBox();
const [tx, ty] = await at(22, 12.1);
await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await p.mouse.down(); await p.mouse.move(tx, ty, { steps: 8 });
await p.screenshot({ path: 'm-drag.png' }); await p.mouse.up(); await p.waitForTimeout(150);
console.log('wedge', await p.evaluate(id => { const it = itemById(id); return [it.chan && it.chan.id, it.y]; }, wid));
// reshape channel -> gear follows
await p.evaluate(() => mutate(() => { plan.channels[0].pts = [[2, 13], [30, 13]]; }));
console.log('follow y', await p.evaluate(id => itemById(id).y, wid));
console.log('label', await p.evaluate(() => [...document.querySelectorAll('.ch-label')].map(t => t.textContent)));
// hide inside-channels: gear disappears
await p.evaluate(() => { sel = null; setCableView(() => { cableView.hideInCh = true; }); });
console.log('wedge drawn when hidden', await p.evaluate(id => !!document.querySelector(`#plot .item[data-id="${id}"]`), wid));
await p.evaluate(() => setCableView(() => { cableView.hideInCh = false; }));
// instruments tab
await p.click('#tGear'); await p.click('[data-geartab="Instruments"]'); await p.waitForTimeout(100);
console.log('instruments', await p.evaluate(() => document.querySelectorAll('#railPane .gear').length));
await p.screenshot({ path: 'm-inst.png' });
console.log('errors', errs); await b.close(); })();
