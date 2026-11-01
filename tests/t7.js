const { chromium } = require(require('./app.js').pw); const RICH = require('./rich.js');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(600);
await p.click('#welcomeExample'); await p.waitForTimeout(300); await p.evaluate(RICH); await p.waitForTimeout(200);
await p.screenshot({ path: 'u-home.png' });
// hover card
const kid = await p.evaluate(() => plan.items.find(i => i.type === 'midi_keys').id); const el = await p.$(`#plot .item[data-id="${kid}"]`); const bb = await el.boundingBox();
await p.mouse.move(bb.x + bb.width/2, bb.y + bb.height/2); await p.waitForTimeout(700); await p.screenshot({ path: 'u-hover.png' });
// context menu
await p.mouse.click(bb.x + bb.width/2, bb.y + bb.height/2, { button: 'right' }); await p.waitForTimeout(200); await p.screenshot({ path: 'u-ctx.png' });
await p.keyboard.press('Escape');
// drag with guide
await p.mouse.move(bb.x + bb.width/2, bb.y + bb.height/2); await p.mouse.down(); await p.mouse.move(bb.x + 180, bb.y + 60, { steps: 10 }); await p.screenshot({ path: 'u-drag.png' }); await p.mouse.up();
// palette
await p.keyboard.press('Control+k'); await p.keyboard.type('wedge'); await p.waitForTimeout(150); await p.screenshot({ path: 'u-cmdk.png' });
await p.keyboard.press('Enter'); await p.waitForTimeout(200);
console.log('wedges', await p.evaluate(() => plan.items.filter(i => i.type === 'wedge').length));
await p.keyboard.press('Control+k'); await p.keyboard.type('casey'); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
console.log('selected', await p.evaluate(() => sel && itemById(sel.id) && (personById(itemById(sel.id).personId)||{}).name));
// dbl click
const bb2 = await (await p.$(`#plot .item[data-id="${kid}"]`)).boundingBox(); await p.mouse.dblclick(bb2.x + bb2.width/2, bb2.y + bb2.height/2 + 6); await p.waitForTimeout(400);
console.log('label focused', await p.evaluate(() => document.activeElement && document.activeElement.id));
// empty state
await p.evaluate(() => { newWeek(true); }); await p.evaluate(() => mutate(() => { plan.items = []; plan.cables = []; })); await p.waitForTimeout(300);
await p.screenshot({ path: 'u-empty.png' });
await p.setViewportSize({ width: 400, height: 820 }); await p.waitForTimeout(300);
console.log('phone sw', await p.evaluate(() => document.documentElement.scrollWidth));
await p.screenshot({ path: 'u-phone.png' });
console.log('errors', errs); await b.close(); })();
