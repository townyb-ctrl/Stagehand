// regressions from the stress test: measuring cancelled mid-drag; the rack editor when its rack goes away; print hides sheet buttons
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
await p.evaluate(() => { try { localStorage.setItem('stageplot.foldHint', '1'); } catch {} fit('stage'); renderAll(); document.querySelectorAll('.toast').forEach(t => t.remove()); });
const r = await p.evaluate(() => { const b = $('scroller').getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; });
await p.keyboard.press('m'); await p.mouse.move(r[0], r[1]); await p.mouse.down(); await p.mouse.move(r[0] + 40, r[1] + 10, { steps: 3 });
await p.keyboard.press('Escape'); await p.evaluate(() => { measure = null; }); await p.mouse.move(r[0] + 80, r[1] + 20, { steps: 3 }); await p.mouse.up();
console.log('measure cancel ok', errs.length === 0);
const rack = await p.evaluate(() => { addGear('rack', 5, 5, null); const id = sel.id; openRack(id); return id; });
await p.evaluate(id => { plan.items = plan.items.filter(i => i.id !== id); $('rkName').value = 'X'; $('rkName').dispatchEvent(new Event('change')); $('rkSize').value = '12'; $('rkSize').dispatchEvent(new Event('change')); }, rack);
console.log('rack gone ok', errs.length === 0, 'dialog closed', await p.evaluate(() => $('rackDlg').hidden));
await p.evaluate(() => { addGear('rack', 6, 6, null); openRack(sel.id); const other = blankPlan(addDays(plan.date, 7), plan.venueId); db.plans[other.id] = other; switchWeek(other.id); });
console.log('week switch closes rack', await p.evaluate(() => $('rackDlg').hidden));
await p.evaluate(() => { view = 'paper'; paperTab = 'inputs'; renderAll(); }); await p.emulateMedia({ media: 'print' });
console.log('print hides sheet buttons', await p.evaluate(() => [...document.querySelectorAll('#sec-inputs button')].every(b => getComputedStyle(b).display === 'none')));
console.log('errors', errs); await b.close(); })();
