// recent gear with names, undo/redo labels, choose sheets to print, plot to scale
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
// recent gear
await p.evaluate(() => { for (const t of ['wedge', 'vox_mic', 'di_mono', 'gtr_amp', 'keys', 'sub', 'iem']) addGear(t, 10, 10); railTab = 'gear'; renderAll(); });
console.log('recent', await p.evaluate(() => [...document.querySelectorAll('.recentchip')].map(b => b.textContent.trim()).join(' | ')));
// undo labels
await p.evaluate(() => { railTab = 'team'; renderAll(); });
console.log('undo title', await p.getAttribute('#undoBtn', 'title'));
const id = await p.evaluate(() => plan.items.find(i => i.type === 'pedalboard').id);
const bx = await p.locator(`#plot [data-id="${id}"]`).first().boundingBox();
await p.mouse.move(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.mouse.down(); await p.mouse.move(bx.x + 90, bx.y + 30, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(150);
console.log('after drag', await p.getAttribute('#undoBtn', 'title'), '|', await p.getAttribute('#undoBtn', 'aria-label'));
await p.click('#undoBtn'); await p.waitForTimeout(100);
console.log('redo title', await p.getAttribute('#redoBtn', 'title'), '| undo now', await p.getAttribute('#undoBtn', 'title'));
await p.click('#redoBtn'); console.log('back', await p.getAttribute('#undoBtn', 'title'));
// print options
await p.evaluate(() => { view = 'paper'; paperTab = 'all'; renderAll(); document.querySelectorAll('.toast').forEach(t => t.remove()); });
await p.click('#printMore'); await p.waitForTimeout(100);
console.log('pop', await p.evaluate(() => [!!document.querySelector('.printpop'), document.querySelectorAll('[data-psheet]').length, document.activeElement?.dataset?.psheet]));
for (const k of ['outputs', 'rf', 'cables', 'power', 'team']) { await p.click(`[data-psheet="${k}"]`); await p.waitForTimeout(40); }
console.log('picked', await p.evaluate(() => [printOpts().skip.join(), $('printGo').textContent.trim()]));
await p.click('input[name="pscale"][value="100"]'); await p.waitForTimeout(100);
console.log('scale note', await p.evaluate(() => document.querySelector('.printpop .hint')?.textContent));
await p.keyboard.press('Escape'); console.log('esc closes', await p.evaluate(() => !document.querySelector('.printpop')));
await p.emulateMedia({ media: 'print' });
console.log('print shows', await p.evaluate(() => [...document.querySelectorAll('.sheetgrid .sheet')].filter(s => getComputedStyle(s).display !== 'none').map(s => s.id).join(',')));
console.log('plot mm', await p.evaluate(() => { const s = document.querySelector('#sec-overview .snap'); return [getComputedStyle(s).width, s.viewBox.baseVal.width.toFixed(2)]; }));
await p.emulateMedia({ media: 'screen' });
await p.reload(); await p.waitForTimeout(500); console.log('remembered', await p.evaluate(() => JSON.stringify(printOpts())));
await p.evaluate(() => { localStorage.removeItem('stageplot.printOpts'); });
console.log('errors', errs); await b.close(); })();
