const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(600);
await p.click('#welcomeExample'); await p.waitForTimeout(300);
await p.evaluate(() => { plan.team = []; plan.items = []; plan.cables = []; plan.settings.autoPatch = false; sel = null; save(); renderAll(); document.querySelector('.toast')?.remove(); });
// 1. stage size from the stage panel
await p.fill('#isw', '11.5'); await p.press('#isw', 'Tab'); await p.fill('#isd', '7.2'); await p.press('#isd', 'Tab'); await p.waitForTimeout(100);
// 2. person + gear via library click-to-place
const toScreen = (x, y) => p.evaluate(([x, y]) => { const m = svg.getScreenCTM(); return { x: fromM(x) * m.a + m.e, y: fromM(y) * m.d + m.f }; }, [x, y]);
await p.keyboard.press('a'); await p.waitForTimeout(100);
await p.fill('#gearSearch', 'stage'); await p.waitForTimeout(100);
await p.click('.gear[data-add="stagebox"]'); let q = await toScreen(5, 6); await p.mouse.click(q.x, q.y); await p.waitForTimeout(100);
await p.fill('#gearSearch', 'vocal mic'); await p.click('.gear[data-add="vox_mic"] >> nth=0'); q = await toScreen(3, 2); await p.mouse.click(q.x, q.y);
await p.fill('#gearSearch', 'distro'); const distro = await p.evaluate(() => Object.keys(CAT).find(k => isPowerSource({ type: k }) && !isExt({ type: k }) && /distro/i.test(CAT[k].name)));
await p.click(`.gear[data-add="${distro}"]`); q = await toScreen(10, 1); await p.mouse.click(q.x, q.y);
await p.fill('#gearSearch', 'keys'); await p.click('.gear[data-add="keys"]'); q = await toScreen(8, 3); await p.mouse.click(q.x, q.y); await p.waitForTimeout(100);
const ids = await p.evaluate(() => Object.fromEntries(plan.items.map(i => [i.type, i.id])));
console.log('placed', Object.keys(ids).join(','));
// 3. exact position edit
await p.evaluate(id => { sel = { kind: 'item', id }; setDetail(true); }, ids.keys); await p.waitForTimeout(100);
await p.fill('#iX', '8.25'); await p.press('#iX', 'Tab'); await p.fill('#iRot', '90'); await p.press('#iRot', 'Tab');
// 4. audio cable mic -> stage box by hand (Auto type)
await p.keyboard.press('Escape'); await p.keyboard.press('c'); await p.waitForTimeout(50);
q = await toScreen(3, 2); await p.mouse.click(q.x, q.y); q = await toScreen(5, 6); await p.mouse.click(q.x, q.y); await p.waitForTimeout(100);
// 5. power cable distro -> keys, then overhead
q = await toScreen(10, 1); await p.mouse.click(q.x, q.y); q = await toScreen(8.25, 3); await p.mouse.click(q.x, q.y); await p.waitForTimeout(100);
await p.keyboard.press('Escape');
const cabs = await p.evaluate(() => plan.cables.map(c => `${c.type}:${itemById(c.from).type}->${itemById(c.to).type}`));
console.log('cables', cabs);
await p.evaluate(() => { sel = { kind: 'cable', id: plan.cables.find(c => c.type === 'power').id }; renderAll(); });
const lenFloor = await p.evaluate(() => cableLen(plan.cables.find(c => c.type === 'power')));
await p.click('[data-level="ceiling"]'); await p.waitForTimeout(50);
const lenCeil = await p.evaluate(() => cableLen(plan.cables.find(c => c.type === 'power')));
console.log('power overhead adds', ((lenCeil - lenFloor) * .3048).toFixed(2), 'm; ends', await p.evaluate(() => [...document.querySelectorAll('.endrow .endn')].map(e => e.textContent)));
// 6. layers
await p.click('#cabBtn'); await p.click('[data-layer="gear"]'); await p.click('#cabOnly');
console.log('gear hidden drawn', await p.evaluate(() => document.querySelectorAll('#plot g.item').length), 'cables drawn', await p.evaluate(() => document.querySelectorAll('#plot path.cab').length));
// 7. undo / redo
const n0 = await p.evaluate(() => plan.cables.find(c => c.type === 'power').level);
await p.keyboard.press('Control+z'); const n1 = await p.evaluate(() => plan.cables.find(c => c.type === 'power').level);
await p.keyboard.press('Control+Shift+z'); const n2 = await p.evaluate(() => plan.cables.find(c => c.type === 'power').level);
console.log('undo/redo level', n0, n1, n2);
// 8. reload and compare
const snap = await p.evaluate(() => JSON.stringify({ st: plan.stage, it: plan.items, c: plan.cables }));
await p.reload(); await p.waitForTimeout(500);
const after = await p.evaluate(() => JSON.stringify({ st: plan.stage, it: plan.items, c: plan.cables }));
console.log('preserved after reload', snap === after, 'stage', await p.evaluate(() => [toM(plan.stage.w).toFixed(2), toM(plan.stage.d).toFixed(2)]), 'keys x/rot', await p.evaluate(id => { const k = itemById(id); return [toM(k.x).toFixed(2), k.rot]; }, ids.keys));
console.log('layers remembered', await p.evaluate(() => hiddenLayers()));
await p.evaluate(() => showAllLayers());
// 9. export backup round trip
const bk = await p.evaluate(() => backup(false)); const parsed = JSON.parse(bk);
console.log('backup has plan', !!parsed.plans[Object.keys(parsed.plans)[0]].cables.length);
// 10. paperwork opens
await p.click('#vPaper'); await p.waitForTimeout(200); console.log('paper sheets', await p.evaluate(() => document.querySelectorAll('#paperView .sheet').length));
console.log('errors', errs); await b.close(); })();
