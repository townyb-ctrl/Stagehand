// short patch names: A·12 in the sheets and load-in, a box key, full names in copies and exports
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 1000 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(400); await p.click('#welcomeExample'); await p.waitForTimeout(300);
await p.evaluate(require('./rich.js'));
await p.evaluate(() => { view = 'paper'; paperTab = 'inputs'; renderAll(); document.querySelector('.toast')?.remove(); });
console.log('codes', await p.evaluate(() => JSON.stringify([...boxCodes()])));
console.log('patch cells', await p.evaluate(() => [...document.querySelectorAll('#sec-inputs tbody tr td:last-child')].slice(0, 3).map(td => `${td.textContent} [${td.title}]`)));
console.log('key', await p.evaluate(() => document.querySelector('#sec-inputs .boxkey')?.textContent));
console.log('copy keeps full', await p.evaluate(() => paperData.inputs.split('\n')[1].split('\t').pop()));
await p.evaluate(() => { paperTab = 'outputs'; renderPaper(); }); console.log('outputs', await p.evaluate(() => [...document.querySelectorAll('#sec-outputs tbody td:last-child')].slice(0, 2).map(t => t.textContent)));
await p.evaluate(() => { paperTab = 'loadin'; renderPaper(); }); console.log('loadin', await p.evaluate(() => [...document.querySelectorAll('.litem')].map(l => l.textContent).find(t => /·\d/.test(t))));
await p.evaluate(() => { paperTab = 'inputs'; renderPaper(); }); await p.locator('#sec-inputs').screenshot({ path: 't58-inputs.png' });
await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(100); console.log('phone overflow', await p.evaluate(() => document.documentElement.scrollWidth > innerWidth));
console.log('errors', errs); await b.close(); })();
