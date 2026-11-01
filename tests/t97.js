// service day card, library search by person, undo after reload, 4 cards per page, placement warnings, text size, select all like this
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; await p.addInitScript(() => { try { localStorage.setItem('stageplot.detail', 'adv'); } catch {} }); p.on('pageerror', e => errs.push(e.message));
await p.clock.setFixedTime(new Date(2026, 10, 1, 8, 20));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(300);
// today card
await p.evaluate(() => { plan.date = '2026-11-01'; plan.times = { call: '07:30', check: '08:00', service: '09:00' }; save(); goHome('library'); }); await p.waitForTimeout(200);
console.log('today', await p.evaluate(() => [!!document.querySelector('.todaycard'), $('todayClock')?.textContent, $('todayNext')?.textContent, !!document.querySelector('.hero'), document.querySelector('.td-load')?.textContent.trim()]));
await p.click('[data-today="loadin"]'); await p.waitForTimeout(150); console.log('to load-in', await p.evaluate(() => [view, paperTab]));
await p.evaluate(() => goHome('library')); await p.click('[data-today="show"]'); await p.waitForTimeout(300); console.log('show mode', await p.evaluate(() => presenting)); await p.evaluate(() => setPresent(false));
await p.evaluate(() => { plan.date = '2026-11-08'; save(); goHome('library'); }); console.log('not today: no card', await p.evaluate(() => !document.querySelector('.todaycard') && !!document.querySelector('.hero')));
// library by person
await p.evaluate(() => { planAhead(2); goHome('library'); }); await p.fill('#libSearch', 'morgan'); await p.waitForTimeout(150);
console.log('by person', await p.evaluate(() => [document.querySelectorAll('.librow').length, document.querySelector('.libwho')?.textContent, document.querySelector('.librow mark')?.textContent]));
await p.fill('#libSearch', ''); 
// placement warnings
await p.evaluate(() => { view = 'plot'; renderAll(); });
console.log('clean', await p.evaluate(() => placementIssues().length));
await p.evaluate(() => { const k = plan.items.find(i => i.type === 'bass_amp'), d = plan.items.find(i => i.type === 'gtr_amp'); mutate(() => { d.x = k.x + .2; d.y = k.y; const w = plan.items.find(i => i.type === 'ac_guitar'); w.x = -6; }); });
console.log('issues', await p.evaluate(() => placementIssues().map(x => x.msg)));
await p.keyboard.press('Control+z'); await p.waitForTimeout(100);
// undo after reload
await p.evaluate(() => mutate(() => plan.items.push({ id: uid(), type: 'wedge', x: 3, y: 3 }), 'Added wedge')); await p.waitForTimeout(500);
await p.reload(); await p.waitForTimeout(600); console.log('undo after reload', await p.evaluate(() => [history.length > 0, $('undoBtn').title]));
// select all like this
await p.evaluate(() => { const w = plan.items.find(i => i.type === 'iem'); sel = { kind: 'item', id: w.id }; group = null; view = 'plot'; renderAll(); });
await p.click('[data-selall="type"]'); console.log('select all iems', await p.evaluate(() => [selIds().length, plan.items.filter(i => i.type === 'iem').length]));
// 4 to a page
await p.evaluate(() => { view = 'paper'; paperTab = 'spots'; renderAll(); }); await p.click('#printMore'); await p.click('#spots4'); console.log('spots4 saved', await p.evaluate(() => [spots4, localStorage.getItem('stageplot.spots4')]));
// text size
await p.evaluate(() => goHome('prefs')); await p.click('[data-pref="textsize"][data-v="l"]'); await p.waitForTimeout(100);
console.log('text large', await p.evaluate(() => [document.documentElement.dataset.text, textScale(), getComputedStyle(document.querySelector('#homeView')).zoom]));
await p.reload(); await p.waitForTimeout(500); console.log('remembered', await p.evaluate(() => document.documentElement.dataset.text));
await p.evaluate(() => { localStorage.removeItem('stageplot.text'); localStorage.removeItem('stageplot.spots4'); });
console.log('errors', errs); await b.close(); })();
