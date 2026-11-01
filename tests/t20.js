const { chromium } = require(require('./app.js').pw); const RICH = require('./rich.js');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300); await p.evaluate(RICH); await p.waitForTimeout(200);
const scr = id => p.evaluate(id => { const it = itemById(id), m = svg.getScreenCTM(); return { x: it.x * m.a + m.e, y: it.y * m.d + m.f }; }, id);
const ids = await p.evaluate(() => plan.items.filter(i => ['vox_mic', 'wedge'].includes(i.type)).slice(0, 3).map(i => i.id));
// shift-click three
for (const [n, id] of ids.entries()) { const q = await scr(id); if (n) await p.keyboard.down('Shift'); await p.mouse.click(q.x, q.y); }
await p.keyboard.up('Shift');
console.log('group', await p.evaluate(() => selIds().length), await p.evaluate(() => $('inspector').querySelector('h2')?.textContent));
// group drag
const before = await p.evaluate(ids => ids.map(id => [itemById(id).x, itemById(id).y]), ids);
const q0 = await scr(ids[1]); await p.mouse.move(q0.x, q0.y); await p.mouse.down(); await p.mouse.move(q0.x + 60, q0.y + 40, { steps: 6 }); await p.mouse.up();
const after = await p.evaluate(ids => ids.map(id => [itemById(id).x, itemById(id).y]), ids);
console.log('moved together', after.map((a, i) => [+(a[0] - before[i][0]).toFixed(2), +(a[1] - before[i][1]).toFixed(2)]), 'still group', await p.evaluate(() => selIds().length));
// align top
await p.click('[data-align="t"]'); console.log('aligned ys', await p.evaluate(() => selIds().map(id => itemById(id)).map(i => +(i.y + prop(i, 'd') / 2 * 0).toFixed(2))));
await p.click('[data-align="dh"]');
// lock + try drag
await p.click('#gLock'); console.log('locked', await p.evaluate(() => selIds().every(id => itemById(id).locked)));
await p.keyboard.press('Escape');
const lid = await p.evaluate(() => plan.items.find(i => i.type === 'stagebox').id);
const q1 = await scr(lid); await p.mouse.click(q1.x, q1.y); console.log('focus', await p.evaluate(() => document.activeElement?.id + ':' + document.activeElement?.tagName)); await p.keyboard.press('l'); console.log('L1', await p.evaluate(id => itemById(id).locked, lid), errs.length);
const lb = await p.evaluate(id => [itemById(id).x, itemById(id).y], lid); await p.waitForTimeout(500);
await p.mouse.move(q1.x, q1.y); await p.mouse.down(); await p.mouse.move(q1.x + 80, q1.y, { steps: 5 }); await p.mouse.up();
console.log('locked stayed', JSON.stringify(lb) === JSON.stringify(await p.evaluate(id => [itemById(id).x, itemById(id).y], lid)), 'badge', await p.evaluate(() => document.querySelectorAll('.lockbadge').length), 'toast', await p.evaluate(() => document.querySelector('.toast')?.textContent));
await p.screenshot({ path: 'n-lock.png' });
console.log('pre', await p.evaluate(() => [document.activeElement?.id, document.activeElement?.tagName, JSON.stringify(sel), selIds().length, $('helpDlg').hidden, $('dataDlg').hidden, view])); await p.keyboard.press('l'); console.log('unlocked', await p.evaluate(id => !itemById(id).locked, lid));
// box select
await p.keyboard.press('Escape');
const a = await scr(ids[0]); 
await p.keyboard.down('Shift'); await p.mouse.move(a.x - 150, a.y - 120); await p.mouse.down(); await p.mouse.move(a.x + 150, a.y + 120, { steps: 8 });
await p.screenshot({ path: 'n-marquee.png' }); await p.mouse.up(); await p.keyboard.up('Shift');
console.log('box selected', await p.evaluate(() => selIds().map(id => itemById(id).type).join(',')));
// copy / paste
const n0 = await p.evaluate(() => plan.items.length), c0 = await p.evaluate(() => plan.cables.length);
await p.keyboard.press('Control+c'); await p.mouse.move(700, 300); await p.keyboard.press('Control+v');
console.log('pasted', await p.evaluate(() => plan.items.length) - n0, 'cables', await p.evaluate(() => plan.cables.length) - c0, 'sel', await p.evaluate(() => selIds().length));
await p.keyboard.press('Control+z'); console.log('undo paste', await p.evaluate(() => plan.items.length) - n0);
// copy to new week
await p.evaluate(() => newWeek(true)); await p.waitForTimeout(200);
const n1 = await p.evaluate(() => plan.items.length); await p.evaluate(() => { hoverPt = null; pasteClip(); });
console.log('pasted into new week', await p.evaluate(() => plan.items.length) - n1);
// select all + delete
await p.keyboard.press('Control+a'); console.log('ctrl+a', await p.evaluate(() => selIds().length));
await p.screenshot({ path: 'n-group.png' });
await p.keyboard.press('Delete'); console.log('after delete non-platform', await p.evaluate(() => plan.items.filter(i => cat(i).shape !== 'platform').length));
// context menu on group
await p.keyboard.press('Control+z'); await p.keyboard.press('Control+a');
const any = await p.evaluate(() => selIds()[2]); const qa = await scr(any); await p.mouse.click(qa.x, qa.y, { button: 'right' });
console.log('ctx', await p.evaluate(() => $('ctxMenu').querySelector('.ctx-h')?.textContent));
console.log('errors', errs); await b.close(); })();
