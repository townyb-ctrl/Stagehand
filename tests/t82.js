// Home calendar strip: 8 service days with planned / started / free; clicks open or start weeks; follows the venue filter
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
const base = await p.evaluate(() => { const b = plan; const c = JSON.parse(JSON.stringify(b)); c.id = 'w1'; c.date = addDays(nextServiceDay(), 7); db.plans.w1 = c; const e = blankPlan(addDays(nextServiceDay(), 14)); e.items = []; db.plans[e.id] = e; save(); goHome('library'); return nextServiceDay(); });
const cells = await p.evaluate(() => [...document.querySelectorAll('.calday')].map(c => c.className.match(/s-(\w+)/)[1]));
console.log('days', cells.length, cells.join(','));
await p.click('.calday[data-calopen="w1"]'); await p.waitForTimeout(200);
console.log('opened', await p.evaluate(() => [view, plan.id]));
await p.evaluate(() => goHome('library'));
const freeDate = await p.evaluate(() => document.querySelector('.calday.s-free').dataset.calnew);
await p.click('.calday.s-free'); await p.waitForTimeout(200);
console.log('started on free day', await p.evaluate(d => plan.date === d && view === 'plot', freeDate));
await p.evaluate(() => { const v = newVenue('Next Gen Hall'); save(); lib.venue = v.id; goHome('library'); });
console.log('venue filter', await p.evaluate(() => [...document.querySelectorAll('.calday')].every(c => c.classList.contains('s-free'))));
console.log('errors', errs); await b.close(); })();
