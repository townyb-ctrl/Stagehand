const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
console.log('quiet cables', await p.evaluate(() => document.querySelectorAll('.cab.quiet').length), 'arrows when quiet', await p.evaluate(() => document.querySelectorAll('.flowg .fl').length));
// lanes: count distinct polylines sharing exact same segment before vs now
console.log('stacked duplicates', await p.evaluate(() => { const seen = new Map(); let dup = 0; for (const pl of document.querySelectorAll('path.cab')) { const pts = pl.getAttribute('data-pts').split(' '); for (let i = 0; i < pts.length - 1; i++) { const k = pts[i] + '>' + pts[i + 1]; if (seen.has(k)) dup++; seen.set(k, 1); } } return dup; }));
// gear above cables: first .item non-platform comes after first .cab in DOM
console.log('gear over cables', await p.evaluate(() => { const all = [...svg.querySelectorAll('path.cab, g.item')]; const fc = all.findIndex(e => e.matches('path.cab')); return all.slice(0, fc).every(e => e.querySelector('.s-deck')); }));
// labels culled
console.log('labels', await p.evaluate(() => document.querySelectorAll('.ilabel').length), 'items', await p.evaluate(() => plan.items.length));
// click a cable hit still selects
const hit = await p.evaluate(() => { const h = [...document.querySelectorAll('.cabhit')].find(h => h.getTotalLength() > 30); const pt = h.getPointAtLength(h.getTotalLength() / 2), m = h.getScreenCTM(); return { x: pt.x * m.a + m.e, y: pt.y * m.d + m.f, id: h.dataset.cid }; });
await p.mouse.click(hit.x, hit.y); console.log('cable select', await p.evaluate(() => sel?.kind));
console.log('arrows on selection', await p.evaluate(() => document.querySelectorAll('.flowg .fl').length > 0));
// toggle quiet off
await p.keyboard.press('Escape'); await p.click('#cabBtn'); await p.click('#cabQuiet');
console.log('quiet off', await p.evaluate(() => document.querySelectorAll('.cab.quiet').length), 'arrows', await p.evaluate(() => document.querySelectorAll('.flowg .fl').length > 0));
await p.click('#cabAudio'); console.log('audio only', await p.evaluate(() => [...cableView.hidden].sort().join(',')));
await p.click('#cabShowAll'); await p.click('#cabQuiet');
// zoom extremes no errors
await p.evaluate(() => { zoomCenter(4); }); await p.evaluate(() => { zoomCenter(1 / 16); });
console.log('errors', errs); await b.close(); })();
