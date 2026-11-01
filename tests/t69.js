// redrawn FOH desk, stage box, distro and IEM rack; church logo on the paperwork, rider and cards; status edge on Library rows
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(400); await p.click('#welcomeExample'); await p.waitForTimeout(400);
await p.evaluate(() => document.querySelector('.toast')?.remove());
console.log('drawings', await p.evaluate(() => ({ desk: document.querySelectorAll('#plot .s-cap').length, screen: document.querySelectorAll('#plot .s-screen').length, xlr: document.querySelectorAll('#plot .s-xlr').length, breakers: document.querySelectorAll('#plot .s-breaker').length })));
await p.evaluate(() => zoomCenter(3)); await p.waitForTimeout(500);
for (const t of ['stagebox', 'distro', 'iem_rack', 'foh']) { const box = await p.evaluate(t => { const it = plan.items.find(i => i.type === t), el = document.querySelector(`#plot .item[data-id="${it.id}"]`); el.scrollIntoView({ block: 'center', inline: 'center' }); const r = el.getBoundingClientRect(); return { x: r.x - 12, y: r.y - 12, width: r.width + 24, height: r.height + 24 }; }, t); await p.waitForTimeout(150); await p.screenshot({ path: `g-${t}.png`, clip: await p.evaluate(t => { const it = plan.items.find(i => i.type === t), r = document.querySelector(`#plot .item[data-id="${it.id}"]`).getBoundingClientRect(); return { x: Math.max(0, r.x - 12), y: Math.max(0, r.y - 12), width: r.width + 24, height: r.height + 24 }; }, t) }); }
await p.evaluate(() => goHome('stage')); await p.waitForTimeout(200);
await p.setInputFiles('#hd-logo', __dirname + '/logo.png'); await p.waitForTimeout(600);
console.log('logo saved', await p.evaluate(() => [!!db.defaults?.logo, (db.defaults?.logo || '').slice(0, 15), !!document.querySelector('.logoprev')]));
await p.evaluate(() => { view = 'paper'; paperTab = 'overview'; renderAll(); }); console.log('on paper', await p.evaluate(() => !!document.querySelector('.doclogo')));
await p.evaluate(() => { paperTab = 'rider'; renderPaper(); }); console.log('on rider', await p.evaluate(() => !!document.querySelector('.rlogo')));
await p.locator('.rhead').screenshot({ path: 'g-rider.png' });
await p.evaluate(() => { paperTab = 'spots'; renderPaper(); }); console.log('on card', await p.evaluate(() => !!document.querySelector('.spotlogo')));
console.log('in backup', await p.evaluate(() => JSON.parse(backup(true)).defaults.logo?.length > 100));
await p.evaluate(() => goHome('stage')); await p.click('#hd-logo-del'); console.log('removed', await p.evaluate(() => !db.defaults.logo));
await p.evaluate(() => { newWeek(true); goHome('library'); }); await p.waitForTimeout(200);
console.log('library edges', await p.evaluate(() => [...document.querySelectorAll('.librow')].map(r => [...r.classList].find(c => c.startsWith('st-')))));
await p.locator('#libBody').screenshot({ path: 'g-lib.png' });
console.log('errors', errs); await b.close(); })();
