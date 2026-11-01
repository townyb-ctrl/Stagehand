const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(() => { try { localStorage.setItem('stageplot.detail', 'adv'); } catch {} }); await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(200); await p.evaluate(() => fit('room')); await p.waitForTimeout(150);
console.log('ceiling runs (seed)', await p.evaluate(() => plan.cables.filter(c => c.level === 'ceiling').length));
// power boards: put a power point upstage-left and a board on stage, re-run cabling
await p.evaluate(() => { mutate(() => { addItem('wall_outlet', -1, 2, { label: 'PP SL wall' }); addItem('pboard6', 3, 8, { label: 'Board SL' }); addItem('pboard2', 30, 8, { label: 'Ext SR' }); autoCable(); }); });
console.log('board', await p.evaluate(() => { const e = plan.items.find(i => i.type === 'pboard6'); const f = feedOf(e); return { fed: f && itemName(other(f, e.id)), used: extUsed(e), load: extLoad(e) }; }));
console.log('PP load', await p.evaluate(() => circuitLoads(plan.items.find(i => i.label === 'PP SL wall')).loads));
// overhead truss drawn via tool
await p.click('[data-mode="channel"]'); await p.click('[data-chdraftkind="truss"]');
const sv = await (await p.$('#plot')).boundingBox();
const at = async (fx, fy) => p.evaluate(([fx, fy]) => { const m = document.getElementById('plot').getScreenCTM(); return [fx * m.a + m.e, fy * m.d + m.f]; }, [fx, fy]);
for (const [x, y] of [[2, 22], [30, 22]]) { const [cx, cy] = await at(x, y); await p.mouse.click(cx, cy); }
await p.keyboard.press('Enter'); await p.waitForTimeout(200);
console.log('channels', await p.evaluate(() => plan.channels.map(c => c.kind + ':' + c.pts.length)));
// re-run cabling: speaker feeds should go via truss
await p.evaluate(() => mutate(autoCable));
console.log('via truss', await p.evaluate(() => plan.cables.filter(c => routeInfo(c).via?.kind === 'truss').length));
// extend the truss from its end via + handle
const chId = await p.evaluate(() => plan.channels[0].id);
await p.evaluate(id => { sel = { kind: 'channel', id }; renderPlot(); renderInspector(); }, chId);
const plus = await p.$(`[data-chext="${chId}:1"]`); const pb = await plus.boundingBox();
await p.mouse.click(pb.x + pb.width/2, pb.y + pb.height/2);
const [ex, ey] = await at(30, 30); await p.mouse.click(ex, ey); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
console.log('after extend pts', await p.evaluate(() => plan.channels[0].pts.length));
// start on an existing end with the tool also extends
await p.click('[data-mode="channel"]'); const [sx, sy] = await at(2, 22); await p.mouse.click(sx, sy); const [tx, ty] = await at(2, 30); await p.mouse.click(tx, ty); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
console.log('after 2nd extend pts', await p.evaluate(() => plan.channels[0].pts.length), 'channels', await p.evaluate(() => plan.channels.length));
await p.evaluate(id => { sel = { kind: 'channel', id }; renderPlot(); renderInspector(); }, chId);
await p.screenshot({ path: 'g-plot.png' });
await p.click('#vPaper'); await p.waitForTimeout(300); await p.click('[data-ptab="power"]'); const ps = await p.$('#sec-power'); await ps.screenshot({ path: 'g-power.png' });
console.log('warnings', await p.evaluate(() => warnings().map(w => w.msg)));
console.log('errors', errs); await b.close(); })();
