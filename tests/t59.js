// visual pass: name tags, rotated selection ring, depth, seats layer, calm house cables, hover, empty state, inspector swatches
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(400); await p.click('#welcomeExample'); await p.waitForTimeout(400);
console.log('tags', await p.evaluate(() => [document.querySelectorAll('#plot .itag').length, document.querySelectorAll('#plot .itag rect').length, getComputedStyle(document.querySelector('#plot .itag .ilabel')).stroke]));
console.log('depth', await p.evaluate(() => [document.querySelectorAll('#plot .deck-lip').length > 0, !!document.querySelector('#plot .deck-sheen'), document.querySelectorAll('#plot .s-riser-lip').length]));
console.log('seats', await p.evaluate(() => document.querySelectorAll('#plot .seats rect').length), 'under FOH', await p.evaluate(() => { const f = plan.items.find(i => i.type === 'foh'), [a, b] = halfExt(f); return [...document.querySelectorAll('#plot .seats rect')].filter(r => { const x = +r.getAttribute('x'), y = +r.getAttribute('y'); return x > f.x - a && x < f.x + a && y > f.y - b && y < f.y + b; }).length; }));
await p.evaluate(() => setCableView(() => cableView.layers.add('seats'))); console.log('seats off', await p.evaluate(() => document.querySelectorAll('#plot .seats rect').length)); await p.evaluate(() => setCableView(() => cableView.layers.delete('seats')));
console.log('house fade', await p.evaluate(() => [!!document.getElementById('houseFade'), document.querySelectorAll('#plot g[mask] .cab').length]));
await p.evaluate(() => { const a = plan.items.find(i => i.type === 'gtr_amp'); a.rot = 30; sel = { kind: 'item', id: a.id }; renderPlot(); });
console.log('selected: fade off', await p.evaluate(() => !document.getElementById('houseFade')), 'ring turns', await p.evaluate(() => document.querySelector('#plot rect.selbox')?.getAttribute('transform')));
console.log('paper unaffected', await p.evaluate(() => { const h = plotSnapshot(); return [!/houseFade/.test(h), /itag/.test(h)]; }));
await p.evaluate(() => { sel = null; inspOpen = true; applyPanels(false); renderAll(); });
console.log('swatches one row', await p.evaluate(() => new Set([...document.querySelectorAll('.insp .swatch')].map(e => Math.round(e.getBoundingClientRect().top))).size === 1));
await p.evaluate(() => { saveSetup('Full band'); clearWeek(true); clearWeek(true); });
await p.waitForTimeout(200); console.log('empty', await p.evaluate(() => [!$('fempty').hidden, !!document.querySelector('.emptyart'), document.querySelectorAll('[data-empty-setup]').length]));
await p.click('[data-empty-setup]'); await p.waitForTimeout(200); console.log('setup applied', await p.evaluate(() => plan.items.length > 0 && $('fempty').hidden));
await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(200); console.log('phone overflow', await p.evaluate(() => document.documentElement.scrollWidth > innerWidth));
console.log('errors', errs); await b.close(); })();
