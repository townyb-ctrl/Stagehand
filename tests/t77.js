// venues linked to Planning Center service types: link/unlink on the Venues page, default type, import lands in the venue
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
const ids = await p.evaluate(() => { const ng = newVenue('Next Gen Hall'); ng.stage.w = fromM(6); ng.stage.d = fromM(4); save();
  window.claude = { use() {} }; pco.mcp = {}; pco.types = [{ id: 't1', name: 'Sunday AM' }, { id: 't2', name: 'Next Gen' }, { id: 't3', name: 'Camp' }]; goHome('venues'); return { ng: ng.id, main: venueList()[0].id }; });
await p.selectOption(`[data-svclink="${ids.ng}"]`, 't2'); await p.waitForTimeout(100);
await p.selectOption(`[data-svclink="${ids.main}"]`, 't1'); await p.waitForTimeout(100);
console.log('linked', await p.evaluate(() => venueList().map(v => `${v.name}: ${(v.svc || []).map(t => t.name).join('+')}`).join(' | ')));
await p.screenshot({ path: 'v12-venues.png', clip: { x: 440, y: 160, width: 840, height: 330 } });
// moving a link: t2 to main takes it off Next Gen
await p.selectOption(`[data-svclink="${ids.main}"]`, 't2'); await p.waitForTimeout(100);
console.log('moved link', await p.evaluate(ng => [venueForSvc('t2')?.name, (venues()[ng].svc || []).length], ids.ng));
await p.click(`[data-svcunlink="${ids.main}|t2"]`); await p.waitForTimeout(100);
await p.selectOption(`[data-svclink="${ids.ng}"]`, 't2'); await p.waitForTimeout(100);
// importing a Next Gen plan while on the planned main-stage week starts a new week at Next Gen
const r1 = await p.evaluate(ng => { view = 'plot'; const before = plan.id, n = Object.keys(db.plans).length;
  pco.typeId = 't2'; pco.plans = [{ id: 'p1', title: 'Next Gen night', dates: 'Nov 1', date: '2026-11-01' }]; pco.planId = 'p1';
  pco.roster = [{ key: 'k1', name: 'Pat Doe', role: 'Bass', positions: ['Bass'] }]; pco.picked = new Set(['k1']); railTab = 'team'; renderRail();
  const hint = document.querySelector('.pcovenue')?.textContent; pcoApply();
  return [hint, plan.id !== before, plan.venueId === ng, Object.keys(db.plans).length === n + 1, Math.round(toM(plan.stage.w)), plan.team.map(t => t.name).join(), db.plans[before].team.length > 1]; }, ids.ng);
console.log('new week at venue', JSON.stringify(r1));
// an empty week moves to the linked venue instead
const r2 = await p.evaluate(main => { clearWeek(true); mutate(() => { plan.team = []; }); const id = plan.id, n = Object.keys(db.plans).length;
  pco.typeId = 't1'; pco.plans = [{ id: 'p2', title: 'Sunday', dates: 'Nov 1', date: '2026-11-01' }]; pco.planId = 'p2'; pco.roster = [{ key: 'k2', name: 'Sam Lee', role: 'Keys', positions: ['Keys'] }]; pco.picked = new Set(['k2']); pcoApply();
  return [plan.id === id, plan.venueId === main, Object.keys(db.plans).length === n, Math.round(toM(plan.stage.w))]; }, ids.main);
console.log('empty week moved', JSON.stringify(r2));
// the open week's venue picks its own service type when types load
console.log('default type', await p.evaluate(async () => { pco.types = []; pcoCall = async () => ({ data: [{ id: 't1', attributes: { name: 'Sunday AM' } }, { id: 't2', attributes: { name: 'Next Gen' } }] }); pcoLoadPlansInner = async () => {}; await pcoLoadTypes(); return pco.typeId; }));
console.log('backup keeps links', await p.evaluate(() => JSON.parse(backup(true)).venues[venueList()[1].id].svc.length));
console.log('errors', errs); await b.close(); })();
