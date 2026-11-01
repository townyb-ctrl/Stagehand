const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(600);
console.log('welcome', await p.isVisible('#welcomeDlg')); await p.screenshot({ path: 'w-welcome.png' });
await p.click('#welcomeDraw'); await p.waitForTimeout(200);
await p.click('[data-preset="thrust"]'); await p.waitForTimeout(100);
await p.fill('#dp-w', '12'); await p.press('#dp-w', 'Tab'); await p.waitForTimeout(100);
// drag the upstage-right corner in a bit
const pt = await p.$('[data-pt="0"]'); const bb = await pt.boundingBox();
await p.mouse.move(bb.x + bb.width/2, bb.y + bb.height/2); await p.mouse.down(); await p.mouse.move(bb.x + 60, bb.y + 10, { steps: 4 }); await p.mouse.up();
await p.screenshot({ path: 'w-designer.png' });
await p.click('#dsgSave'); await p.waitForTimeout(600);
console.log('poly pts', await p.evaluate(() => plan.stage.poly && plan.stage.poly.length), 'items', await p.evaluate(() => plan.items.length));
await p.screenshot({ path: 'w-plot.png' });
// draw freehand via Room tab
await p.click('#tStage'); await p.click('#editStage'); await p.click('[data-preset="draw"]');
const sv = await (await p.$('#dsgSvg')).boundingBox();
const clicks = [[.2,.15],[.7,.15],[.75,.55],[.45,.7],[.2,.55]];
for (const [x,y] of clicks) await p.mouse.click(sv.x + sv.width*x, sv.y + sv.height*y);
await p.mouse.click(sv.x + sv.width*.2, sv.y + sv.height*.15); await p.waitForTimeout(100);
await p.screenshot({ path: 'w-draw.png' });
await p.click('#dsgSave'); await p.waitForTimeout(400);
console.log('custom corners', await p.evaluate(() => plan.stage.poly.length));
// cables menu
await p.click('#cabBtn'); await p.click('[data-cabtype="power"]'); await p.waitForTimeout(200);
await p.screenshot({ path: 'w-cables.png' });
await p.keyboard.press('Escape'); await p.mouse.click(700, 880); await p.keyboard.press('h'); await p.waitForTimeout(200);
console.log('cables polylines visible', await p.evaluate(() => document.querySelectorAll('#plot .cab').length));
await p.reload(); await p.waitForTimeout(500);
console.log('welcome after reload', await p.isVisible('#welcomeDlg'), 'cabs after reload', await p.evaluate(() => document.querySelectorAll('#plot .cab').length));
console.log('errors', errs); await b.close(); })();
