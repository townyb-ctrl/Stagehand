// show mode: tap a person for their card, nothing moves, Esc closes card then mode
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1180, height: 820 }, hasTouch: true }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
await p.evaluate(() => { view = 'plot'; renderAll(); setPresent(true); }); await p.waitForTimeout(500);
console.log('tip', await p.evaluate(() => !!document.querySelector('.pres-tip')));
const pid = await p.evaluate(() => plan.items.find(i => i.type === 'person' && personById(i.personId)?.role === 'Worship Leader')?.id || plan.items.find(i => i.type === 'person').id);
const box = await p.locator(`#plot [data-id="${pid}"]`).first().boundingBox();
const before = await p.evaluate(id => { const i = itemById(id); return [i.x, i.y]; }, pid);
await p.mouse.click(box.x + box.width / 2, box.y + box.height / 2); await p.waitForTimeout(250);
console.log('card', await p.evaluate(() => [document.querySelector('.pres-card h2')?.textContent, document.querySelectorAll('.pc-ch li').length, $('plot').classList.contains('focusing')]));
console.log('not moved', JSON.stringify(before) === JSON.stringify(await p.evaluate(id => { const i = itemById(id); return [i.x, i.y]; }, pid)), 'no sel', await p.evaluate(() => sel === null));
await p.screenshot({ path: 'show.png' })
await p.keyboard.press('Escape'); await p.waitForTimeout(150);
console.log('esc closes card first', await p.evaluate(() => [!document.querySelector('.pres-card'), presenting]));
await p.keyboard.press('Escape'); await p.waitForTimeout(300);
console.log('esc exits', await p.evaluate(() => presenting));
console.log('errors', errs); await b.close(); })();
