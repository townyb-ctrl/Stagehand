// clock pinned to a weekday before the example service, so Home shows Next up rather than the Today card
// look switch (calm / full / mono, remembered), pictures sit back in calm, lighter grid, smaller gear tags, Home picture of just the stage, Layers rows on one line, solid menus
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 1000 } }); const errs = []; await p.clock.setFixedTime(new Date('2026-10-28T10:00:00')); p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(400); await p.click('#welcomeExample'); await p.waitForTimeout(500);
await p.evaluate(() => document.querySelector('.toast')?.remove());
const gear = () => p.evaluate(() => getComputedStyle(document.querySelector('#plot .item:not(.is-person):not(.is-floor):not(.picked)')).filter);
console.log('calm', await p.evaluate(() => svg.classList.contains('style-calm')), await gear());
await p.click('#cabBtn'); await p.click('[data-pstyle="mono"]');
console.log('mono', await p.evaluate(() => getComputedStyle(svg).filter));
console.log('views rows one line', await p.evaluate(() => [...document.querySelectorAll('[data-over]')].every(r => { const sw = r.querySelector('.cm-switch'), lb = r.querySelector('.cm-lbl'); return Math.abs(sw.getBoundingClientRect().top - lb.getBoundingClientRect().top) < 20; })), 'menu solid', await p.evaluate(() => getComputedStyle(document.querySelector('.cabmenu')).backgroundColor));
await p.click('[data-pstyle="full"]'); await p.click('#cabBtn');
console.log('full', await gear(), 'remembered', await p.evaluate(() => JSON.parse(localStorage.getItem('stageplot.cables')).style));
await p.reload(); await p.waitForTimeout(400); await p.evaluate(() => { view = 'plot'; renderAll(); }); console.log('after reload', await p.evaluate(() => svg.classList.contains('style-full')));
await p.evaluate(() => setCableView(() => { cableView.style = 'calm'; }));
console.log('grid zoomed out', await p.evaluate(() => [+scale.toFixed(1), document.querySelectorAll('#plot .g-minor').length, document.querySelectorAll('#plot .g-major').length]));
await p.evaluate(() => zoomAt(2, innerWidth / 2, innerHeight / 2)); console.log('grid zoomed in', await p.evaluate(() => document.querySelectorAll('#plot .g-minor').length > 0));
await p.evaluate(() => fit('stage'));
console.log('tags', await p.evaluate(() => { const g = document.querySelector('#plot .itag.gname'), pn = document.querySelector('#plot .itag.pname'); return [parseFloat(getComputedStyle(g.querySelector('text')).fontSize) < parseFloat(getComputedStyle(pn.querySelector('text')).fontSize)]; }));
console.log('paper unaffected', await p.evaluate(() => !/style-(calm|mono)/.test(plotSnapshot())));
await p.evaluate(() => goHome('library')); await p.waitForTimeout(300);
console.log('home picture', await p.evaluate(() => { const v = document.querySelector('.heropic .snap').getAttribute('viewBox').split(' ').map(Number); return [+v[2].toFixed(1), +(plan.stage.w).toFixed(1)]; }));
console.log('errors', errs); await b.close(); })();
