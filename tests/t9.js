const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(() => { try { localStorage.setItem('stageplot.detail', 'adv'); } catch {} }); await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(200);
// --- riser resize
const rid = await p.evaluate(() => plan.items.find(i => i.type === 'drum_riser').id);
await p.evaluate(id => { sel = { kind: 'item', id }; renderPlot(); renderInspector(); }, rid);
const h = await p.$('[data-rh="1,1"]'); const hb = await h.boundingBox();
await p.mouse.move(hb.x + hb.width/2, hb.y + hb.height/2); await p.mouse.down(); await p.mouse.move(hb.x + 70, hb.y + 40, { steps: 6 });
await p.screenshot({ path: 'f-resize.png' }); await p.mouse.up();
console.log('riser size m', await p.evaluate(id => [mVal(prop(itemById(id),'w')), mVal(prop(itemById(id),'d'))], rid));
// --- rack builder
await p.keyboard.press('Control+k'); await p.keyboard.type('custom rack'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
console.log('rack open', await p.isVisible('#rackDlg'));
for (const k of ['snake32', 'iem2', 'iem2', 'rx4', 'patchxlr', 'switch']) await p.click(`[data-rkadd="${k}"]`);
await p.fill('#rkCName', 'Click interface'); await p.click('#rkCAdd'); await p.waitForTimeout(200);
// drag the switch down one slot
const sw = await p.$('.rk-unit >> nth=0'); const sb = await sw.boundingBox();
await p.mouse.move(sb.x + 100, sb.y + 10); await p.mouse.down(); await p.mouse.move(sb.x + 100, sb.y + 10 + 40*4, { steps: 6 }); await p.mouse.up();
await p.screenshot({ path: 'f-rack.png' });
console.log('rack stat', await p.evaluate(() => JSON.stringify(rackStat(itemById(rk.id)))));
await p.click('#rkDone'); await p.waitForTimeout(200);
// --- channel
await p.click('[data-mode="channel"]');
const sv = await (await p.$('#plot')).boundingBox();
const pts = [[.12,.62],[.85,.62],[.85,.80]];
for (const [x,y] of pts) await p.mouse.click(sv.x + sv.width*x, sv.y + sv.height*y);
await p.keyboard.press('Enter'); await p.waitForTimeout(300);
console.log('channels', await p.evaluate(() => plan.channels.length), 'using', await p.evaluate(() => plan.cables.filter(c => routeInfo(c).via).length));
await p.screenshot({ path: 'f-channel.png' });
await p.click('#vPaper'); await p.waitForTimeout(300);
await p.evaluate(() => { paperTab = 'all'; renderPaper(); }); const rs = await p.$('#sec-racks'); console.log('racks sheet', !!rs);
if (rs) await rs.screenshot({ path: 'f-paper-rack.png' });
console.log('errors', errs); await b.close(); })();
