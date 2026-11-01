// switch-on order on the load-in sheet, wireless channel sheet with clash warning
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
console.log('order', await p.evaluate(() => powerOrder().map(([t, l]) => `${t}:${l.length}`).join(' | ')));
console.log('order on sheet', await p.evaluate(() => { view = 'paper'; paperTab = 'loadin'; renderAll(); const o = document.querySelectorAll('.pocols > ol > li'), f = document.querySelectorAll('.pocols div ol li'); return [o.length, o[0]?.querySelector('b').textContent, f[0]?.textContent]; }));
console.log('rf tab', await p.evaluate(() => { paperTab = 'rf'; renderAll(); return [!!document.querySelector('[data-ptab="rf"]'), getComputedStyle($('sec-rf')).display, document.querySelectorAll('#sec-rf tbody tr').length]; }));
const ins = await p.$$('#sec-rf input[data-rf]');
await ins[0].fill('Ch 3'); await ins[0].dispatchEvent('change'); await p.waitForTimeout(150);
const ins2 = await p.$$('#sec-rf input[data-rf]'); await ins2[1].fill('ch3'); await ins2[1].dispatchEvent('change'); await p.waitForTimeout(150);
console.log('clash', await p.evaluate(() => [rfClashes().length, document.querySelectorAll('#sec-rf tr.flag').length, warnings().some(w => /own channel/.test(w.msg)), !!document.querySelector('.rfbad')]));
const ins3 = await p.$$('#sec-rf input[data-rf]'); await ins3[1].fill('Ch 4'); await ins3[1].dispatchEvent('change'); await p.waitForTimeout(150);
console.log('fixed', await p.evaluate(() => [rfClashes().length, document.querySelectorAll('#sec-rf tr.flag').length]));
await p.evaluate(() => undo()); console.log('undo', await p.evaluate(() => rfClashes().length));
console.log('kept after reload', await (async () => { await p.reload(); await p.waitForTimeout(500); return p.evaluate(() => plan.items.filter(i => i.rf).map(i => i.rf).join()); })());
console.log('next week inherits', await p.evaluate(() => { newWeek(false); plan.items = plan.items.filter(i => !cat(i).wireless); buildFromTeam(); return plan.items.filter(i => cat(i).wireless).map(rfOf).filter(Boolean).join(); }));
console.log('errors', errs); await b.close(); })();
