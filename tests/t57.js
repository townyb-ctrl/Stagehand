// refinements: channel edits undo + history, spares in desk names, FOH pointer, My spot names/YOU tag/times (incl. Planning Center), outline rider legend
const { chromium } = require(require('./app.js').pw); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); await p.addInitScript(() => { try { localStorage.setItem('stageplot.detail', 'adv'); } catch {} }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(400); await p.click('#welcomeExample'); await p.waitForTimeout(500);
// 3 FOH pointer
console.log('foh pointer', await p.evaluate(() => [!$('ffoh').hidden, $('ffoh').dataset.dir, $('ffoh').textContent]));
await p.screenshot({ path: 't57-foh.png' });
await p.click('#ffoh'); await p.waitForTimeout(700); console.log('after click hidden', await p.evaluate(() => $('ffoh').hidden));
// 1 channel edits undo
await p.evaluate(() => { view = 'paper'; paperTab = 'inputs'; chEdit = true; renderAll(); document.querySelector('.toast')?.remove(); });
const k = await p.evaluate(() => inputList()[0].key);
await p.fill(`[data-chnum="${k}"]`, '3'); await p.press(`[data-chnum="${k}"]`, 'Tab'); await p.waitForTimeout(100);
console.log('swap', await p.evaluate(k => [chans_().map[k], document.querySelector('.toast')?.textContent], k));
await p.evaluate(() => document.activeElement.blur()); await p.keyboard.press('Control+z'); console.log('undo', await p.evaluate(k => chans_().map[k], k));
await p.keyboard.press('Control+y'); console.log('redo', await p.evaluate(k => chans_().map[k], k));
await p.check('[data-ch48] >> nth=1'); await p.waitForTimeout(100);
console.log('history labels', await p.evaluate(() => weekHist(plan.id).slice(-2).map(e => e.label)));
await p.evaluate(() => { const l = weekHist(plan.id); restoreVersion(0); }); console.log('restored to start', await p.evaluate(k => [chans_().map[k], Object.keys(chans_().meta).length], k));
// 2 spares in desk names
await p.evaluate(() => { const m = plan.team.find(t => t.role === 'Bass'); mutate(() => { plan.team = plan.team.filter(t => t !== m); plan.items = plan.items.filter(i => i.personId !== m.id); plan.cables = plan.cables.filter(c => itemById(c.from) && itemById(c.to)); }); chEdit = false; view = 'paper'; paperTab = 'inputs'; renderAll(); });
const [dl] = await Promise.all([p.waitForEvent('download'), p.click('[data-exp="names"]')]); console.log('names spare', fs.readFileSync(await dl.path(), 'utf8').split('\r\n').filter(l => /Spare/.test(l)));
// 4 times from Planning Center + My spot
console.log('pco times', await p.evaluate(() => JSON.stringify(pcoTimes([{ starts_at: '2027-01-05T08:00:00Z', time_type: 'service' }, { starts_at: '2027-01-05T06:30:00Z', time_type: 'rehearsal' }, { starts_at: '2027-01-05T06:00:00Z', time_type: 'other' }]))));
await p.evaluate(() => { view = 'plot'; renderAll(); }); await p.click('#weekBtn'); await p.fill('#tm-call', '07:30'); await p.press('#tm-call', 'Tab'); await p.fill('#tm-service', '09:00'); await p.press('#tm-service', 'Tab');
console.log('times', await p.evaluate(() => JSON.stringify(plan.times)));
await p.evaluate(() => { closePops(); view = 'paper'; paperTab = 'spots'; spotSel = plan.team.find(t => t.name.startsWith('Taylor')).id; renderAll(); document.querySelector('.toast')?.remove(); });
console.log('spot', await p.evaluate(() => ({ times: document.querySelector('.spottimes')?.textContent, gear: spotData(plan.team.find(t => t.name.startsWith('Taylor'))).gear, tag: !!document.querySelector('.spot-you rect'), text: spotText(spotData(plan.team[0])).split(String.fromCharCode(10))[2] })));
await p.locator('.spotcard').first().screenshot({ path: 't57-spot.png' });
// 5 rider legend outline
await p.evaluate(() => { paperTab = 'rider'; renderPaper(); });
console.log('legend', await p.evaluate(() => { return document.querySelectorAll('.rlegend .ricon').length; }));
await p.locator('.rlegend').screenshot({ path: 't57-legend.png' });
console.log('errors', errs); await b.close(); })();
