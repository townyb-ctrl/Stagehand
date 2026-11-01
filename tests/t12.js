const { chromium } = require(require('./app.js').pw); const RICH = require('./rich.js');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(200); await p.evaluate(RICH); await p.waitForTimeout(200);
await p.evaluate(() => setCableView(() => { cableView.all = false; }));
const at = async (fx, fy) => p.evaluate(([fx, fy]) => { const m = document.getElementById('plot').getScreenCTM(); return [fx * m.a + m.e, fy * m.d + m.f]; }, [fx, fy]);
const ids = await p.evaluate(() => ({ a: plan.items.find(i => i.label === 'Distro SL').id, b: plan.items.find(i => i.label === 'Main R').id }));
const ctr = async id => p.evaluate(id => { const it = itemById(id); const m = document.getElementById('plot').getScreenCTM(); return [it.x * m.a + m.e, it.y * m.d + m.f]; }, id);
await p.click('[data-mode="cable"]'); await p.click('[data-ctype="speakon"]');
let [x, y] = await ctr(ids.a); await p.mouse.click(x, y);
// pivot 1: roughly below the start (slightly off-axis) -> should lock vertical
const s0 = await p.evaluate(id => [itemById(id).x, itemById(id).y], ids.a);
[x, y] = await at(s0[0] + .6, 17); await p.mouse.move(x, y); await p.mouse.click(x, y);
// pivot 2: to the right, slightly off -> lock horizontal
[x, y] = await at(30, 17.4); await p.mouse.click(x, y);
// hover target and screenshot preview
[x, y] = await ctr(ids.b); await p.mouse.move(x, y, { steps: 3 }); await p.waitForTimeout(100);
await p.screenshot({ path: 'i-preview.png' });
// undo last pivot with Backspace, re-add
await p.keyboard.press('Backspace'); console.log('pivots after backspace', await p.evaluate(() => pending.points.length));
[x, y] = await at(30, 17.4); await p.mouse.click(x, y);
[x, y] = await ctr(ids.b); await p.mouse.click(x, y); await p.waitForTimeout(200);
const c = await p.evaluate(() => { const c = plan.cables[plan.cables.length - 1]; return { pts: c.points, geo: cableGeom(c), type: c.type }; });
console.log(JSON.stringify(c));
// every pivot must appear exactly in the geometry
console.log('pivots kept', c.pts.every(q => c.geo.some(g => g[0] === q[0] && g[1] === q[1])));
console.log('axis aligned', c.geo.every((g, i) => !i || g[0] === c.geo[i-1][0] || g[1] === c.geo[i-1][1]));
await p.screenshot({ path: 'i-done.png' });
console.log('errors', errs); await b.close(); })();
