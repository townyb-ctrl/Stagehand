// batteries on load-in, past weeks locked (edit anyway, drag snaps back, preference), show-mode clock
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
// batteries
console.log('batt', await p.evaluate(() => { view = 'paper'; paperTab = 'loadin'; renderAll(); const g = loadinTasks()[0]; return [g[0], g[2].length, document.querySelector('.battneed')?.textContent]; }));
await p.fill('#battType', '1 × 9V'); await p.dispatchEvent('#battType', 'change'); await p.waitForTimeout(150);
console.log('batt type', await p.evaluate(() => [db.defaults.batt, document.querySelector('.battneed')?.textContent, loadinTasks()[0][2][0].sub]));
// lock: make the week last month
await p.evaluate(() => { plan.date = '2026-01-04'; save(); });
console.log('example (there at load) locks', await p.evaluate(() => weekLocked()));
await p.reload(); await p.waitForTimeout(600); await p.evaluate(() => { view = 'plot'; renderAll(); });
console.log('chip', await p.evaluate(() => [!$('lockBtn').hidden, $('lockBtn').textContent, weekLocked()]));
const n0 = await p.evaluate(() => plan.items.length);
await p.evaluate(() => mutate(() => plan.items.push({ id: uid(), type: 'wedge', x: 3, y: 3 }), 'Added'));
console.log('blocked', await p.evaluate(n => [plan.items.length === n, document.querySelector('.toast')?.textContent.includes('Edit anyway')], n0));
// drag snaps back
const id = await p.evaluate(() => plan.items.find(i => i.type === 'pedalboard').id), x0 = await p.evaluate(id => itemById(id).x, id);
const bx = await p.locator(`#plot [data-id="${id}"]`).first().boundingBox();
await p.mouse.move(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.mouse.down(); await p.mouse.move(bx.x + 80, bx.y + 40, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(200);
console.log('drag back', await p.evaluate(([id, x]) => itemById(id).x === x, [id, x0]));
await p.click('#lockBtn'); await p.waitForTimeout(100);
await p.evaluate(() => mutate(() => plan.items.push({ id: uid(), type: 'wedge', x: 3, y: 3 }), 'Added'));
console.log('unlocked edits', await p.evaluate(n => [plan.items.length === n + 1, $('lockBtn').textContent], n0));
await p.click('#lockBtn'); console.log('relock', await p.evaluate(() => weekLocked()));
await p.evaluate(() => { view = 'plot'; renderAll(); }); await p.click('#nextWeekBtn'); await p.waitForTimeout(200);
console.log('week started from a locked one', await p.evaluate(() => [plan.date, weekLocked()]));
console.log('today not locked', await p.evaluate(() => { plan.date = localISO(); return weekLocked(); }));
// clock
await p.clock.setFixedTime(new Date(2026, 9, 25, 9, 35));
await p.evaluate(() => { plan.date = '2026-10-25'; plan.times = { call: '08:00', check: '09:00', service: '10:00' }; save(); view = 'plot'; renderAll(); setPresent(true); }); await p.waitForTimeout(300);
console.log('clock', await p.evaluate(() => [$('presTime').textContent, $('presNext').textContent]));
await p.evaluate(() => { plan.date = '2026-11-01'; renderAll(); });
console.log('other day', await p.evaluate(() => $('presNext').textContent));
console.log('errors', errs); await b.close(); })();
