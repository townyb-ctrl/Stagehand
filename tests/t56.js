// fixed channel numbers across weeks, edit channels, My spot cards
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 1000 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(400); await p.click('#welcomeExample'); await p.waitForTimeout(300);
const list = () => p.evaluate(() => inputList().map(r => `${r.ch}:${r.name}`).join(' '));
console.log('week1', await list());
// next week: bass player away
await p.evaluate(() => { newWeek(false); const m = plan.team.find(t => t.role === 'Bass'); plan.team = plan.team.filter(t => t !== m); plan.items = plan.items.filter(i => i.personId !== m.id); buildFromTeam(); autoCable(); save(); });
console.log('week2', await list(), 'spare', await p.evaluate(() => JSON.stringify(spareChannels(inputList()))));
// new bassist next week gets the old bass channel
await p.evaluate(() => { newWeek(false); plan.team.push({ id: uid(), name: 'Jo New', role: 'Bass' }); buildFromTeam(); autoCable(); save(); });
console.log('week3', await list());
await p.evaluate(() => { view = 'paper'; paperTab = 'inputs'; renderAll(); document.querySelector('.toast')?.remove(); });
await p.click('#chEditBtn'); const k = await p.evaluate(() => inputList()[0].key);
await p.fill(`[data-chnum="${k}"]`, '3'); await p.press(`[data-chnum="${k}"]`, 'Tab');
console.log('after swap', await list());
await p.fill('[data-chmic] >> nth=0', 'Beta kick mic'); await p.press('[data-chmic] >> nth=0', 'Tab');
console.log('meta', await p.evaluate(() => inputSheet().find(r => r.ch === 3).mic));
await p.reload(); await p.waitForTimeout(300); console.log('kept', await p.evaluate(() => inputSheet().slice(0, 3).map(r => `${r.ch}:${r.name}:${r.mic}`).join(' ')));
await p.evaluate(() => { view = 'paper'; paperTab = 'spots'; spotSel = plan.team[0].id; renderAll(); document.querySelector('.toast')?.remove(); });
console.log('spot', await p.evaluate(() => ({ cards: document.querySelectorAll('.spotcard').length, you: !!document.querySelector('.spot-you'), text: spotText(spotData(plan.team[0])).split(String.fromCharCode(10)).slice(3, 5) })));
await p.click('[data-spot="all"]'); console.log('all cards', await p.evaluate(() => document.querySelectorAll('.spotcard').length === plan.team.length));
console.log('errors', errs); await b.close(); })();
