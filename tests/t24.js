const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
// make problems: unpatched camera, item outside, person without role
await p.evaluate(() => mutate(() => { addItem('camera', 6, 12); addItem('wedge', 200, 200); plan.team.push({ id: 'pz', name: 'Zed', role: '' }); }));
await p.click('#checksBtn');
console.log('pop', await p.evaluate(() => !!document.querySelector('.checkspop')), await p.evaluate(() => [...document.querySelectorAll('.checkspop [data-wfix]')].map(b => b.textContent)));
await p.screenshot({ path: 'n-checks.png' });
// show
await p.click('.checkspop [data-wshow]'); console.log('show selects', await p.evaluate(() => sel?.kind), 'pop closed', await p.evaluate(() => !document.querySelector('.checkspop')));
// fix home
await p.click('#checksBtn'); await p.click('.checkspop [data-wfix="home"]');
console.log('home fixed', await p.evaluate(() => !warnings().some(w => w.fix === 'home')));
// fix cable
await p.click('#checksBtn'); await p.click('.checkspop [data-wfix="cable"]');
console.log('cable fixed', await p.evaluate(() => warnings().filter(w => w.fix === 'cable').length));
// role
await p.click('#checksBtn'); await p.click('.checkspop [data-wfix="role"]'); await p.waitForTimeout(200);
console.log('role focus', await p.evaluate(() => document.activeElement?.id));
// right panel checks have buttons too
await p.evaluate(() => { sel = null; renderAll(); });
console.log('panel btns', await p.evaluate(() => document.querySelectorAll('#inspector [data-wfix], #inspector [data-wshow]').length));
// recent
await p.evaluate(() => { railTab = 'gear'; renderAll(); addGear('ipad_stand', 5, 5); addGear('di_mono', 5, 6); });
console.log('recent', await p.evaluate(() => [...document.querySelectorAll('.recentchip')].map(b => b.dataset.add).join(',')));
const n0 = await p.evaluate(() => plan.items.length); await p.click('.recentchip'); { const m = await p.evaluate(() => { const k = svg.getScreenCTM(); return { x: 10 * k.a + k.e, y: 10 * k.d + k.f }; }); await p.mouse.click(m.x, m.y); } console.log('recent adds', await p.evaluate(() => plan.items.length) - n0);
await p.screenshot({ path: 'n-recent.png' });
// setups
await p.evaluate(() => goHome('setups')); await p.fill('#homeSetupName', 'Full band'); await p.click('#homeSetupSave');
console.log('setup saved', await p.evaluate(() => Object.values(db.setups).map(s => s.name + ':' + s.items.length)));
await p.screenshot({ path: 'n-setups.png' });
const full = await p.evaluate(() => plan.items.length);
await p.evaluate(() => newWeek(true)); await p.waitForTimeout(200);
await p.evaluate(() => { plan.team = JSON.parse(JSON.stringify(db.plans[sortedWeekIds()[0]].team)); save(); });
const before = await p.evaluate(() => plan.items.length);
await p.evaluate(() => { view = 'plot'; applySetup(Object.keys(db.setups).find(k => db.setups[k].name === 'Full band')); });
console.log('applied', before, '->', await p.evaluate(() => plan.items.length), 'of', full, 'people linked', await p.evaluate(() => plan.items.filter(i => i.gen && i.personId).length > 0), 'cables', await p.evaluate(() => plan.cables.length));
await p.keyboard.press('Control+z'); console.log('undo apply', await p.evaluate(() => plan.items.length));
console.log('backup has setups', await p.evaluate(() => JSON.parse(backup(true)).setups != null));
console.log('errors', errs); await b.close(); })();
