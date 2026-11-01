// focus a person, role marks on discs, empty sheets, hover card never leaves the plot, count-up plurals
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
console.log('role marks', await p.evaluate(() => document.querySelectorAll('#plot .pt-role').length));
const f = await p.evaluate(() => { const pr = plan.items.find(i => cat(i).shape === 'person' && personById(i.personId)?.role === 'Bass'); sel = { kind: 'item', id: pr.id }; renderAll();
  const mine = plan.items.filter(i => i.personId === pr.personId).length; return [svg.classList.contains('focusing'), document.querySelectorAll('#plot .infocus').length === mine, document.querySelectorAll('#plot .cab.hl').length > 0]; });
console.log('focus', f.join(','));
console.log('gear pick no focus', await p.evaluate(() => { sel = { kind: 'item', id: plan.items.find(i => i.type === 'gtr_amp').id }; renderAll(); return !svg.classList.contains('focusing'); }));
await p.evaluate(() => { $('hoverCard').hidden = false; view = 'home'; renderAll(); });
console.log('hover card hidden', await p.evaluate(() => $('hoverCard').hidden));
await p.evaluate(() => { mutate(() => { plan.items = []; plan.cables = []; plan.team = []; }); view = 'paper'; paperTab = 'all'; renderAll(); });
console.log('empty sheets', await p.evaluate(() => [...document.querySelectorAll('.sheet-empty strong')].map(e => e.textContent).join(' | ')));
console.log('errors', errs); await b.close(); })();
