const { chromium } = require(require('./app.js').pw); const RICH = require('./rich.js');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300); await p.evaluate(RICH); await p.waitForTimeout(200);
console.log('default simple', await p.evaluate(() => !ui.adv), 'channel tool', await p.evaluate(() => !!document.querySelector('[data-mode="channel"]')));
const sel1 = async t => p.evaluate(t => { const it = plan.items.find(i => i.type === t); sel = { kind: 'item', id: it.id }; group = null; renderAll(); }, t);
await sel1('stagebox');
console.log('simple stagebox: iX visible', await p.evaluate(() => $('iX')?.offsetParent != null), 'iIns visible', await p.evaluate(() => $('iIns')?.offsetParent != null), 'more summary', await p.evaluate(() => document.querySelector('details.more summary')?.textContent.trim()));
await p.screenshot({ path: 'n-simple-item.png' });
await p.click('details.more summary'); console.log('opened', await p.evaluate(() => $('iX')?.offsetParent != null));
await sel1('vox_mic'); console.log('stays open', await p.evaluate(() => document.querySelector('details.more')?.open));
// edit inside fold works
await p.fill('#iX', '3'); await p.press('#iX', 'Enter'); console.log('x set', await p.evaluate(() => mVal(itemById(sel.id).x)));
// riser basic size
await sel1('drum_riser'); console.log('riser size up front', await p.evaluate(() => !!$('iH') && !$('iH').closest('details')));
// cable
await p.evaluate(() => { sel = { kind: 'cable', id: plan.cables.find(c => c.type === 'power').id }; renderAll(); });
console.log('cable slack folded', await p.evaluate(() => !!$('cSlack').closest('details')), 'circuit folded', await p.evaluate(() => !!$('cCirc')?.closest('details')));
// cables menu
await p.click('#cabBtn'); console.log('flow toggle in simple', await p.evaluate(() => !!$('cabFlow')));
await p.click('#cabBtn');
// room
await p.evaluate(() => { sel = null; railTab = 'stage'; renderAll(); });
console.log('room: slack folded', await p.evaluate(() => !!$('slack').closest('details')), 'width in panel', await p.evaluate(() => !!$('isw')), 'autoBtn', await p.evaluate(() => !!$('autoBtn')));
await p.screenshot({ path: 'n-simple-room.png' });
// switch to advanced
await p.evaluate(() => $('lvBtn').click());
console.log('adv: channel tool', await p.evaluate(() => !!document.querySelector('[data-mode="channel"]')), 'no folds', await p.evaluate(() => document.querySelectorAll('details.more').length), 'slack shown', await p.evaluate(() => !!$('slack')));
await p.click('#cabBtn'); console.log('flow toggle adv', await p.evaluate(() => !!$('cabFlow'))); await p.click('#cabBtn');
await sel1('stagebox'); console.log('adv iX inline', await p.evaluate(() => $('iX')?.offsetParent != null && !$('iX').closest('details')));
await p.reload(); await p.waitForTimeout(500); await p.evaluate(() => { view = 'plot'; renderAll(); }); console.log('persist adv', await p.evaluate(() => ui.adv));
await p.click('#moreBtn'); await p.click('#moreMenu [data-detail="simple"]'); await p.click('#moreBtn');
// run cable from here (unconnected item)
await p.evaluate(() => { plan.settings.autoPatch = false; mutate(() => { addGear('camera', 5, 5); }); });
console.log('run-from btn', await p.evaluate(() => !!document.querySelector('[data-ctx-cable]')));
await p.click('[data-ctx-cable]'); console.log('pending', await p.evaluate(() => mode === 'cable' && !!pending));
await p.setViewportSize({ width: 400, height: 800 }); await p.waitForTimeout(300); console.log('phone sw', await p.evaluate(() => document.documentElement.scrollWidth));
await p.screenshot({ path: 'n-simple-phone.png' });
console.log('errors', errs); await b.close(); })();
