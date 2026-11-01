// gear lifts while dragged and settles on drop; paperwork pages toggle; library trend lines
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
await p.evaluate(() => { fit('stage'); }); await p.waitForTimeout(400);
const id = await p.evaluate(() => plan.items.find(i => i.type === 'gtr_amp').id);
const bx = await p.locator(`#plot .item[data-id="${id}"]`).boundingBox();
await p.mouse.move(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.mouse.down(); await p.mouse.move(bx.x + bx.width / 2 + 30, bx.y + bx.height / 2 + 20, { steps: 5 });
console.log('lifting', await p.evaluate(id => document.querySelector(`#plot .item[data-id="${id}"]`).classList.contains('lifting'), id),
  'scale', await p.evaluate(id => getComputedStyle(document.querySelector(`#plot .item[data-id="${id}"] .liftg`)).transform !== 'none', id));
await p.screenshot({ path: 'v5-lift.png', clip: { x: bx.x - 80, y: bx.y - 80, width: bx.width + 200, height: bx.height + 200 } });
await p.mouse.up(); await p.waitForTimeout(30);
console.log('settle', await p.evaluate(id => document.querySelector(`#plot .item[data-id="${id}"]`).classList.contains('settle'), id));
await p.waitForTimeout(400); await p.evaluate(() => renderPlot());
console.log('settled', await p.evaluate(id => !document.querySelector(`#plot .item[data-id="${id}"]`).classList.contains('settle') && !document.querySelector('#plot .lifting'), id));
await p.evaluate(() => { view = 'paper'; paperTab = 'inputs'; renderAll(); });
console.log('pages on', await p.evaluate(() => $('paperView').classList.contains('pages') && getComputedStyle(document.querySelector('#sec-inputs')).backgroundColor));
await p.evaluate(() => { for (let k = 0; k < 3; k++) { const c = JSON.parse(JSON.stringify(plan)); c.id = 'w' + k; const d = new Date(plan.date + 'T12:00'); d.setDate(d.getDate() - 7 * (k + 1)); c.date = d.toISOString().slice(0, 10); c.team = c.team.slice(0, k + 1); db.plans[c.id] = c; } view = 'home'; homeTab = 'library'; renderAll(); });
console.log('trends', await p.evaluate(() => [document.querySelectorAll('.libtrend svg').length, document.querySelector('.libtrend svg')?.getAttribute('aria-label')]));
console.log('errors', errs); await b.close(); })();
