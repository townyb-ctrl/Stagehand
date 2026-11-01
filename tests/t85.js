// ready-made teams in the rail and on Home
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
await p.evaluate(() => { const nid = uid(); db.plans[nid] = { ...JSON.parse(JSON.stringify(plan)), id: nid, date: '2099-02-01', team: [], items: [], cables: [] }; switchWeek(nid); view = 'plot'; railTab = 'team'; renderAll(); });
console.log('chips', await p.evaluate(() => document.querySelectorAll('.rail [data-teampreset]').length));
await p.click('.rail [data-teampreset="band"]'); await p.waitForTimeout(300);
console.log('band', await p.evaluate(() => [plan.team.length, plan.items.filter(i => i.type === 'drum_kit').length, plan.items.length > 20]));
p.on('dialog', d => d.dismiss());
await p.evaluate(() => { plan.team[0].name = 'Alex'; save(); goHome('setups'); });
await p.waitForTimeout(200);
console.log('home chips', await p.evaluate(() => document.querySelectorAll('#homeView [data-teampreset]').length));
await p.click('#homeView [data-teampreset="trio"]'); await p.waitForTimeout(200);
console.log('dismissed keeps team', await p.evaluate(() => plan.team.length));
console.log('errors', errs); await b.close(); })();
