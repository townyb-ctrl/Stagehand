const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
const manual = await p.evaluate(() => { const c = plan.cables.find(c => c.auto); c.auto = false; c.points = [[c.points[0]?.[0] || 5, 5]]; save(); return c.id; });
await p.evaluate(() => addGear('vox_mic', 15, 14));
console.log('mic patched', await p.evaluate(() => { const id = sel.id; return plan.cables.filter(c => touches(c, id)).map(c => c.type).join(','); }), 'checks', await p.evaluate(() => warnings().length), 'manual kept', await p.evaluate(id => plan.cables.some(c => c.id === id), manual));
await p.evaluate(() => addGear('camera', 25, 22)); console.log('camera powered', await p.evaluate(() => plan.cables.filter(c => touches(c, sel.id)).map(c => c.type).join(',')));
await p.keyboard.press('Control+z'); console.log('undo removes camera + its cable', await p.evaluate(() => !plan.items.some(i => i.type === 'camera')));
await p.evaluate(() => { sel = { kind: 'item', id: plan.items.find(i => i.type === 'gtr_amp').id }; duplicateSelected(); });
console.log('dup patched', await p.evaluate(() => plan.cables.filter(c => touches(c, sel.id)).length));
// switch off
await p.evaluate(() => { plan.settings.autoPatch = false; addGear('vox_mic', 10, 10); });
console.log('off: unpatched', await p.evaluate(() => plan.cables.filter(c => touches(c, sel.id)).length));
console.log('errors', errs); await b.close(); })();
