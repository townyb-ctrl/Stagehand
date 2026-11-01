const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(() => { try { if (!sessionStorage.getItem('advSet')) { localStorage.setItem('stageplot.detail', 'adv'); sessionStorage.setItem('advSet', '1'); } } catch {} });   // these check Advanced-level tools
await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
await p.evaluate(() => document.querySelector('.toast')?.remove());
const selId = await p.evaluate(() => { const it = plan.items.find(i => i.type === 'stagebox'); sel = { kind: 'item', id: it.id }; renderAll(); return it.id; });
await p.click('#vPaper'); await p.waitForTimeout(200);
console.log('tab', await p.evaluate(() => paperTab), 'visible sheets', await p.evaluate(() => [...document.querySelectorAll('.sheet')].filter(s => s.offsetParent).map(s => s.id).join(',')));
console.log('snapshot', await p.evaluate(() => !!document.querySelector('.snap g.item')), 'no selbox in snap', await p.evaluate(() => !document.querySelector('.snap .selbox')), 'dup ids', await p.evaluate(() => document.querySelectorAll('.snap [id]').length));
console.log('sel kept', await p.evaluate(id => sel?.id === id, selId), 'page h', await p.evaluate(() => $('paperView').scrollHeight));
await p.screenshot({ path: 'n-paper-overview.png' });
for (const t of ['inputs', 'cables', 'power', 'all']) { await p.click(`[data-ptab="${t}"]`); console.log(t, await p.evaluate(() => [...document.querySelectorAll('.sheet')].filter(s => s.offsetParent).map(s => s.id).join(','))); }
await p.click('[data-ptab="inputs"]'); await p.click('[data-copy="inputs"]').catch(e => console.log('copy btn missing'));
// back to plot keeps selection, plot renders
await p.click('#vPlot'); await p.waitForTimeout(200); console.log('plot ok', await p.evaluate(() => document.querySelectorAll('#plot g.item').length > 0 && !!document.querySelector('#plot .selbox')));
// checks pill → paperwork overview
await p.evaluate(() => openPaper('sec-power')); console.log('anchor tab', await p.evaluate(() => paperTab));
await p.setViewportSize({ width: 400, height: 800 }); await p.evaluate(() => openPaper()); await p.waitForTimeout(200); console.log('phone sw', await p.evaluate(() => document.documentElement.scrollWidth));
await p.screenshot({ path: 'n-paper-phone.png' });
console.log('errors', errs); await b.close(); })();
