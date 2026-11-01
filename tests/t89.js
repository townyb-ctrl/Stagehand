// changed since printed, ink saver, long-press menu on touch
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1180, height: 820 }, hasTouch: true }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
// print diff
await p.evaluate(() => { view = 'paper'; paperTab = 'overview'; renderAll(); window.dispatchEvent(new Event('beforeprint')); renderPaper(); });
console.log('no banner right after print', await p.evaluate(() => [!!plan.printed, !document.querySelector('.printdiff')]));
await p.evaluate(() => { mutate(() => { plan.items.push({ id: uid(), type: 'wedge', x: 5, y: 15 }); plan.team.push({ id: uid(), name: 'Sam Lee', role: 'Vocalist' }); const k = plan.items.find(i => i.type === 'drum_kit'); k.x += 4; }); });
console.log('banner', await p.evaluate(() => document.querySelector('.printdiff')?.textContent.replace(/\s+/g, ' ').trim()));
console.log('kept after reload', await (async () => { await p.reload(); await p.waitForTimeout(500); return p.evaluate(() => { view = 'paper'; renderAll(); return !!document.querySelector('.printdiff'); }); })());
await p.click('#printDiffX'); console.log('dismissed', await p.evaluate(() => !document.querySelector('.printdiff')));
// ink saver
console.log('ink off', await p.evaluate(() => [!document.querySelector('.doc-head.ink'), /fill="#ffffff"/i.test(document.querySelector('#sec-overview .snap')?.outerHTML || '')]));
await p.click('#printMore'); await p.click('#inkBtn'); await p.waitForTimeout(100); await p.keyboard.press('Escape');
console.log('ink on', await p.evaluate(() => [!!document.querySelector('.doc-head.ink'), getComputedStyle(document.querySelector('.doc-head')).backgroundColor, getComputedStyle(document.querySelector('#sec-overview .snap')).filter, String(inkSave), plan.stage.color]));
await p.reload(); await p.waitForTimeout(500); console.log('ink remembered', await p.evaluate(() => { view = 'paper'; renderAll(); return !!document.querySelector('.sheetgrid.ink'); }));
await p.evaluate(() => { inkSave = false; localStorage.setItem('stageplot.ink', '0'); });
// long press
await p.evaluate(() => { view = 'plot'; renderAll(); }); await p.waitForTimeout(300);
const id = await p.evaluate(() => plan.items.find(i => i.type === 'gtr_amp').id), x0 = await p.evaluate(id => [itemById(id).x, itemById(id).y], id);
const bx = await p.locator(`#plot [data-id="${id}"]`).first().boundingBox(), cx = bx.x + bx.width / 2, cy = bx.y + bx.height / 2;
const cdp = await p.context().newCDPSession(p);
await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: cx, y: cy }] }); await p.waitForTimeout(750);
console.log('menu open while held', await p.evaluate(() => [!$('ctxMenu').hidden, sel?.id, $('ctxMenu').querySelectorAll('button').length > 2]), id);
await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await p.waitForTimeout(200);
console.log('still open, not moved', await p.evaluate(([id, x0]) => [!$('ctxMenu').hidden, itemById(id).x === x0[0] && itemById(id).y === x0[1]], [id, x0]));
await p.evaluate(() => closeCtx());
// a quick drag still drags
await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: cx, y: cy }] });
for (let k = 1; k <= 6; k++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: cx + k * 12, y: cy }] }); await p.waitForTimeout(30); }
await p.waitForTimeout(700); await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await p.waitForTimeout(200);
console.log('drag no menu', await p.evaluate(([id, x0]) => [$('ctxMenu').hidden, itemById(id).x !== x0[0]], [id, x0]));
console.log('errors', errs); await b.close(); })();
