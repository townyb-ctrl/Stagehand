const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
const id = await p.evaluate(() => { const it = plan.items.find(i => i.type === 'stagebox'); sel = { kind: 'item', id: it.id }; renderAll(); return it.id; });
await p.fill('#iLabel', 'Box typed'); // no blur yet
await p.mouse.click(1000, 700); // click empty floor
console.log('label kept', await p.evaluate(id => itemById(id).label, id));
// rebuild keeps lock
const gid = await p.evaluate(() => { const it = plan.items.find(i => i.gen && i.type !== 'person'); it.locked = true; save(); buildNow(); return it.id; });
console.log('lock survives rebuild', await p.evaluate(id => !!itemById(id)?.locked, gid));
console.log('errors', errs); await b.close(); })();
