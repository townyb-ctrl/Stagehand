const { chromium } = require(require('./app.js').pw); const RICH = require('./rich.js');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(200); await p.evaluate(RICH); await p.waitForTimeout(200);
await p.evaluate(() => { mutate(() => { plan.channels.push({ id: 'tr1', name: 'Trench 1', kind: 'trench', pts: [[2, 12], [30, 12]] }); }); setCableView(() => { cableView.all = false; }); });
const at = async (fx, fy) => p.evaluate(([fx, fy]) => { const m = document.getElementById('plot').getScreenCTM(); return [fx * m.a + m.e, fy * m.d + m.f]; }, [fx, fy]);
const ctr = async id => p.evaluate(id => { const it = itemById(id); const m = document.getElementById('plot').getScreenCTM(); return [it.x * m.a + m.e, it.y * m.d + m.f]; }, id);
const ids = await p.evaluate(() => ({ a: plan.items.find(i => i.label === 'Distro SL').id, b: plan.items.find(i => i.label === 'Main R').id }));
await p.click('[data-mode="cable"]'); await p.click('[data-ctype="power"]');
let [x, y] = await ctr(ids.a); await p.mouse.click(x, y);
[x, y] = await at(5.2, 12.1); await p.mouse.move(x, y); await p.waitForTimeout(80); await p.mouse.click(x, y);     // enter the trench
[x, y] = await at(24, 11.9); await p.mouse.move(x, y, { steps: 4 }); await p.waitForTimeout(80);
await p.screenshot({ path: 'k-preview.png' });
await p.mouse.click(x, y);                                                                                          // come out here
[x, y] = await ctr(ids.b); await p.mouse.move(x, y, { steps: 3 }); await p.mouse.click(x, y); await p.waitForTimeout(200);
const r = await p.evaluate(() => { const c = plan.cables[plan.cables.length - 1]; const ri = routeInfo(c); return { points: c.points, via: ri.via && ri.via.name, ranges: ri.ranges, geo: cableGeom(c).map(q => q.map(v => +v.toFixed(2))), len: +toM(cableLen(c)).toFixed(1) }; });
console.log(JSON.stringify(r));
// reshape channel -> cable follows
await p.evaluate(() => mutate(() => { plan.channels[0].pts = [[2, 13], [30, 13]]; }));
console.log('follows', await p.evaluate(() => cableGeom(plan.cables[plan.cables.length - 1]).some(q => Math.abs(q[1] - 13) < 1e-6)));
await p.evaluate(() => setCableView(() => { cableView.all = true; cableView.hideInCh = true; cableView.hidden = new Set(['xlr','cat6']); }));
await p.screenshot({ path: 'k-done.png' });
console.log('errors', errs); await b.close(); })();
