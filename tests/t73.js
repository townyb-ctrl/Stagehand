// feet and inches: every view reads and takes imperial; switching back restores metres; data stays the same
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
const before = await p.evaluate(() => JSON.stringify(plan));
await p.evaluate(() => { goHome('prefs'); }); await p.click('[data-pref="units"][data-v="ft"]'); await p.waitForTimeout(200);
console.log('imperial', await p.evaluate(() => imperial()), 'snap', await p.evaluate(() => ui.snap));
await p.evaluate(() => { view = 'plot'; fit('stage'); sel = null; renderAll(); }); await p.waitForTimeout(300);
const plotTxt = await p.evaluate(() => [...document.querySelectorAll('#plot .ruler text')].map(t => t.textContent).join(' '));
console.log('ruler', plotTxt);
console.log('room', await p.evaluate(() => [$('isw')?.value, document.querySelector('#isw')?.closest('.unit')?.dataset.unit]));
// type 20 ft width → stage 20 ft
await p.fill('#isw', '20'); await p.dispatchEvent('#isw', 'change'); await p.waitForTimeout(200);
console.log('stage w ft', await p.evaluate(() => Math.round(plan.stage.w * 100) / 100));
await p.evaluate(() => { mutate(() => { plan.stage.w = fromM(10); }); });
// item position field
await p.evaluate(() => { const a = plan.items.find(i => i.type === 'gtr_amp'); sel = { kind: 'item', id: a.id }; renderAll(); });
console.log('iX', await p.evaluate(() => [$('iX').value, $('iX').closest('.unit').dataset.unit, Math.round(itemById(sel.id).x * 100) / 100]));
await p.evaluate(() => { $('iX').value = '12.5'; $('iX').dispatchEvent(new Event('change', { bubbles: true })); }); await p.waitForTimeout(100);
console.log('moved to', await p.evaluate(() => itemById(sel.id).x));
await p.evaluate(() => { view = 'paper'; paperTab = 'cables'; renderAll(); });
console.log('pull', await p.evaluate(() => [...document.querySelectorAll('#sec-cables td:nth-child(2)')].slice(0, 4).map(t => t.textContent).join(', ')));
console.log('meta', await p.evaluate(() => document.querySelector('.doc-meta').textContent));
console.log('title block', await p.evaluate(() => { paperTab = 'overview'; renderPaper(); return document.querySelector('.titleblock .tb-cell:nth-child(4) b').textContent; }));
await p.evaluate(() => { goHome('prefs'); }); await p.click('[data-pref="units"][data-v="m"]'); await p.waitForTimeout(100);
console.log('back to metric', await p.evaluate(() => !imperial() && fmtLen(fromM(5)) === '5 m'));
console.log('ftIn', await p.evaluate(() => [ftIn(10.5), ftIn(.5), ftIn(3), ftIn(0)].join(' | ')));
console.log('errors', errs); await b.close(); })();
