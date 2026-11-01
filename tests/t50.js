// clock pinned to a weekday before the example service, so Home shows Next up rather than the Today card
// the ten: hero print/load-in, setup↔service type, change summary, owner snapping, borrow list, inline library edit, G/P keys, notes, load-in checklist
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const errs = []; const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); await p.clock.setFixedTime(new Date('2026-10-28T10:00:00')); p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(300);
await p.evaluate(() => document.querySelector('.toast')?.remove());
// 4: owner snapping
const owner = await p.evaluate(() => { const tk = plan.items.find(i => i.type === 'person' && personById(i.personId)?.name.startsWith('Taylor')); addGear('vox_mic', tk.x + 1, tk.y + .5, null); const it = itemById(sel.id); return [personById(it.personId)?.name, document.querySelector('.toast')?.textContent]; });
console.log('owner', owner);
const far = await p.evaluate(() => { addGear('vox_mic', 30, 1, null); return itemById(sel.id).personId || 'none'; }); console.log('far owner', far);
// 8: notes
await p.evaluate(() => { const it = plan.items.find(i => i.type === 'gtr_amp'); sel = { kind: 'item', id: it.id }; inspOpen = true; applyPanels(false); renderAll(); });
await p.fill('#iNote', 'Bring a spare 9V'); await p.press('#iNote', 'Tab'); await p.waitForTimeout(100);
console.log('note saved', await p.evaluate(() => plan.items.find(i => i.type === 'gtr_amp').note), 'badge', await p.evaluate(() => !!document.querySelector('.notebadge')));
// 7: keys
await p.evaluate(() => { sel = null; renderAll(); document.activeElement.blur(); }); await p.keyboard.press('p'); console.log('P →', await p.evaluate(() => view)); await p.keyboard.press('g'); console.log('G →', await p.evaluate(() => view));
// 5: borrow
await p.evaluate(() => { (db.gear ||= { hidden: [], owned: {} }).owned = { iem: 2 }; save(); view = 'paper'; paperTab = 'overview'; renderAll(); });
console.log('borrow', await p.evaluate(() => [JSON.stringify(shortages()), !!$('sec-borrow'), !!$('sec-notes')]));
// 3: changes vs last week
await p.evaluate(() => { newWeek(false); plan.team.push({ id: uid(), name: 'Riley Chen', role: 'Keys' }); buildFromTeam(); autoCable(); save(); view = 'paper'; paperTab = 'overview'; renderAll(); });
console.log('changes', await p.evaluate(() => [...document.querySelectorAll('.changelist li')].map(l => l.textContent)));
// 10: load-in
await p.evaluate(() => { paperTab = 'loadin'; renderPaper(); });
const before = await p.evaluate(() => loadinProgress()); await p.click('[data-chk] >> nth=0'); await p.click('[data-chk] >> nth=1');
console.log('loadin', before, await p.evaluate(() => loadinProgress()), 'groups', await p.evaluate(() => [...document.querySelectorAll('.lgroup h3')].map(h => h.textContent.trim())));
await p.screenshot({ path: 't50-loadin.png' });
await p.reload(); await p.waitForTimeout(400); console.log('ticks kept', await p.evaluate(() => loadinProgress().done));
// 1: hero buttons
await p.evaluate(() => goHome('library')); console.log('hero buttons', await p.evaluate(() => [!!document.querySelector('[data-libprint]'), document.querySelector('[data-libloadin]')?.textContent.trim()]));
await p.screenshot({ path: 't50-hero.png' });
await p.click('[data-libloadin]'); console.log('hero load-in →', await p.evaluate(() => [view, paperTab]));
// 6: inline edit
await p.evaluate(() => goHome('library')); const wid = await p.evaluate(() => sortedWeekIds()[0]);
await p.click(`[data-libedit="${wid}"]`); await p.fill('#libEdName', 'Youth night'); await p.fill('#libEdDate', '2026-12-31'); await p.click('[data-libform] button[type=submit]');
console.log('edited', await p.evaluate(id => [db.plans[id].name, db.plans[id].date], wid));
// 2: setup ↔ service type
const applied = await p.evaluate(() => {
  pco.types = [{ id: 't1', name: 'Sunday AM' }]; pco.typeId = 't1'; saveSetup('Full band'); const id = Object.keys(setups())[0]; setups()[id].svcType = 't1'; setups()[id].svcName = 'Sunday AM';
  const np = blankPlan(nextFreeDate()); db.plans[np.id] = np; switchWeek(np.id);
  pco.plans = [{ id: 'p1', title: 'Sunday', dates: 'Nov 8', date: plan.date }]; pco.planId = 'p1';
  pco.roster = [{ key: 'k1', name: 'Pat Doe', role: 'Bass', positions: ['Bass'] }]; pco.picked = new Set(['k1']); pcoApply();
  return [plan.items.filter(i => !i.gen).length, plan.team.map(t => t.name)];
});
console.log('setup applied on import', applied);
await p.evaluate(() => goHome('setups')); console.log('svc select', await p.evaluate(() => document.querySelector('[data-setupsvc]')?.value));
console.log('errors', errs); await b.close(); })();
