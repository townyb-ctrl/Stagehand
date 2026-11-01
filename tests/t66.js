// calmer look (tinted people with a ring, grey-leaning quiet cables, softer fans), label halos, house-side crossing gaps, Home stage picture
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(400); await p.click('#welcomeExample'); await p.waitForTimeout(500);
console.log('people', await p.evaluate(() => { const c = document.querySelector('#plot .c-person.hued'); const cs = getComputedStyle(c); return [cs.fill, cs.stroke, !!document.querySelector('#plot .item:has(.c-person.hued) .pt-light') && getComputedStyle(document.querySelector('#plot .item:has(.c-person.hued) .pt-light')).display]; }));
console.log('quiet cable vs picked', await p.evaluate(() => { const q = getComputedStyle(document.querySelector('#plot .cab.quiet.k-xlr')).stroke; const it = plan.items.find(i => i.type === 'stagebox'); sel = { kind: 'item', id: it.id }; renderPlot(); const h = getComputedStyle(document.querySelector('#plot .cab.hl.k-xlr')).stroke; sel = null; renderPlot(); return [q, h, q !== h]; }));
console.log('halo', await p.evaluate(() => getComputedStyle(document.querySelector('#plot .zone-out')).paintOrder), 'house casings', await p.evaluate(() => document.querySelectorAll('#plot .cab-case.house').length > 0 && !!document.getElementById('houseclip')));
await p.evaluate(() => goHome('library')); await p.waitForTimeout(300);
console.log('home', await p.evaluate(() => [!!document.querySelector('.heropic .snap'), document.querySelectorAll('.heroteam .avatar').length, document.querySelectorAll('[id]').length - new Set([...document.querySelectorAll('[id]')].map(e => e.id)).size]));
await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(200); console.log('phone overflow', await p.evaluate(() => document.documentElement.scrollWidth > innerWidth));
console.log('errors', errs); await b.close(); })();
