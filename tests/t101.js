// input list new/changed tags, week summary for the team chat, duplicate names, offline notice
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] }); const p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(300);
await p.evaluate(() => { newWeek(false); plan.times = { call: '07:30', service: '09:00' }; plan.team.push({ id: uid(), name: 'Sam Lee', role: 'Vocalist' }); buildFromTeam(); autoCable(); save(); view = 'paper'; paperTab = 'inputs'; renderAll(); });
console.log('tags', await p.evaluate(() => [[...document.querySelectorAll('#sec-inputs .chtag')].map(t => t.closest('td').textContent.trim()).join(' | '), /Since .*1 new/.test(document.querySelector('#sec-inputs header p').textContent)]));
await p.click('#printMore'); await p.click('#summaryBtn'); await p.waitForTimeout(150);
const sum = await p.evaluate(() => navigator.clipboard.readText());
console.log('summary', sum.split('\n')[0], '|', /Sam Lee · Vocalist/.test(sum), /Different from/.test(sum), /Arrive by/.test(sum));
await p.evaluate(() => { const ws = Object.values(db.plans).sort((a, b) => a.date.localeCompare(b.date)); ws[0].team.find(t => t.name === 'Taylor Kim').name = 'Taylor'; ws[1].team.find(t => t.name === 'Morgan Hale').name = 'morgan  hale'; save(); goHome('library'); });
console.log('dupes', await p.evaluate(() => nameDupes().map(g => g.names.join('+') + '→' + g.target).join(' ; ')));
await p.click('[data-merge="Taylor|Taylor Kim"]'); console.log('merged', await p.evaluate(() => Object.values(db.plans).flatMap(w => w.team).filter(t => /^taylor/i.test(t.name)).every(t => t.name === 'Taylor Kim')));
await p.click('.toast button'); console.log('undo', await p.evaluate(() => Object.values(db.plans).flatMap(w => w.team).some(t => t.name === 'Taylor')));
await p.click('[data-mergeskip]'); console.log('skip', await p.evaluate(() => nameDupes().length));
await c.setOffline(true); await p.waitForTimeout(150); console.log('offline chip', await p.evaluate(() => [!$('offChip').hidden, $('offChip').textContent]));
await c.setOffline(false); await p.waitForTimeout(150); console.log('online again', await p.evaluate(() => $('offChip').hidden));
console.log('errors', errs); await b.close(); })();
