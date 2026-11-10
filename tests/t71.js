// clock pinned to a weekday before the example service, so Home shows Next up rather than the Today card
// title block on the overview, Planning Center loading placeholders, Next up count-up
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; await p.clock.setFixedTime(new Date('2026-10-28T10:00:00')); p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(300);
await p.evaluate(() => { view = 'home'; homeTab = 'prefs'; renderAll(); });
await p.fill('#hd-contact', 'Sam Lee'); await p.dispatchEvent('#hd-contact', 'change'); await p.waitForTimeout(100);
console.log('contact saved', await p.evaluate(() => db.defaults.contact));
await p.evaluate(() => { view = 'paper'; paperTab = 'overview'; renderAll(); });
console.log('title block', await p.evaluate(() => [...document.querySelectorAll('#sec-overview .tb-cell span')].map(e => e.textContent).join(',') + ' ' + document.querySelector('.titleblock').textContent.includes('Sam Lee')));
await p.evaluate(() => { window.claude = { use() {} }; pco.mcp = {}; pco.types = [{ id: '1', name: 'Sunday' }]; pco.busy = 'Loading roster…'; view = 'plot'; railTab = 'team'; renderAll(); });
console.log('skeleton rows', await p.evaluate(() => document.querySelectorAll('#railPane .skel-row').length));
await p.evaluate(() => { pco.busy = ''; pco.types = []; renderAll(); });
console.log('skeleton gone', await p.evaluate(() => !document.querySelector('.skel')));
await p.evaluate(() => { view = 'home'; homeTab = 'library'; renderAll(); }); await p.waitForTimeout(80);
const mid = await p.evaluate(() => [...document.querySelectorAll('.herostats [data-count]')].map(e => [e.textContent, e.dataset.count]));
await p.waitForTimeout(900);
const end = await p.evaluate(() => [...document.querySelectorAll('.herostats [data-count]')].map(e => [e.textContent, e.dataset.count]));
console.log('counting', mid.some(([a, b]) => a !== String(b)), 'settled', end.every(([a, b]) => Math.abs(Number(a) - Number(b)) < .051));
await p.evaluate(() => renderHome()); console.log('no recount on redraw', await p.evaluate(() => document.querySelector('.herostats [data-count]').textContent === document.querySelector('.herostats [data-count]').dataset.count));
console.log('errors', errs); await b.close(); })();
