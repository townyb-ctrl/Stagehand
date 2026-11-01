const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
await p.evaluate(() => { railTab = 'gear'; gearTab = 'Monitors & PA'; renderAll(); document.querySelector('.toast')?.remove(); });
const n0 = await p.evaluate(() => plan.items.length);
await p.click('[data-add="wedge"]');
console.log('picked', await p.evaluate(() => placing), 'not added yet', await p.evaluate(n => plan.items.length === n, n0), 'hint', await p.evaluate(() => $('fzoom').textContent.trim().slice(0, 40)));
const tgt = await p.evaluate(() => { const m = svg.getScreenCTM(); return { x: 14 * m.a + m.e, y: 17 * m.d + m.f }; });
await p.mouse.move(tgt.x, tgt.y, { steps: 3 }); console.log('ghost', await p.evaluate(() => !!document.querySelector('.ghost')));
await p.screenshot({ path: 'n-place.png' });
await p.mouse.click(tgt.x, tgt.y);
console.log('placed at', await p.evaluate(() => { const it = plan.items[plan.items.length - 1]; return [it.type, mVal(it.x), mVal(it.y)]; }), 'done', await p.evaluate(() => placing === null), 'toast', await p.evaluate(() => document.querySelector('.toast')?.textContent || 'none'));
// shift places several
await p.evaluate(() => { gearTab = 'Mics & DI'; renderRail(); }); await p.click('[data-add="vox_mic"]'); await p.keyboard.down('Shift'); await p.mouse.click(tgt.x + 40, tgt.y); await p.mouse.click(tgt.x + 80, tgt.y); await p.keyboard.up('Shift');
console.log('shift placed', await p.evaluate(n => plan.items.length - n, n0), 'still holding', await p.evaluate(() => placing));
await p.keyboard.press('Escape'); console.log('esc', await p.evaluate(() => placing));
// clicking same tile toggles off
await p.click('[data-add="wedge"]'); await p.click('[data-add="wedge"]'); console.log('toggle off', await p.evaluate(() => placing));
// drag still works
await p.dragAndDrop('[data-add="cajon"]', '#plot', { targetPosition: { x: 400, y: 300 } }).catch(e => console.log('dnd skipped'));
console.log('errors', errs); await b.close(); })();
