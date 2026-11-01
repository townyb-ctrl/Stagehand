// line check: tick and flag channels, kept after reload, own tab only
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(300);
await p.evaluate(() => { view = 'paper'; paperTab = 'linecheck'; renderAll(); document.querySelectorAll('.toast').forEach(t => t.remove()); });
console.log('rows', await p.evaluate(() => [document.querySelectorAll('.lcrow').length, inputSheet().filter(r => !r.spare).length, document.querySelector('[data-ptab="linecheck"]')?.textContent]));
const ticks = await p.$$('.lctick'); await ticks[0].click(); await (await p.$$('.lctick'))[1].click(); await (await p.$$('.lcflag'))[2].click(); await p.waitForTimeout(100);
console.log('state', await p.evaluate(() => [JSON.stringify(lineProgress()), document.querySelector('.lprog b').textContent, document.activeElement?.className]));
await p.reload(); await p.waitForTimeout(500); console.log('kept', await p.evaluate(() => JSON.stringify(lineProgress())));
await p.evaluate(() => { for (const r of inputSheet()) if (!r.spare) lineState()[r.key] = 'ok'; save(); view = 'paper'; paperTab = 'linecheck'; renderAll(); });
console.log('done msg', await p.evaluate(() => !!document.querySelector('.lcdone')), 'not in everything', await p.evaluate(() => { paperTab = 'all'; renderPaper(); return !document.getElementById('sec-linecheck'); }));
console.log('phone overflow', await p.evaluate(() => { paperTab = 'linecheck'; renderPaper(); return document.documentElement.scrollWidth > innerWidth + 1; }));
await p.evaluate(() => { paperTab = 'linecheck'; renderPaper(); }); await p.click('#lineReset'); console.log('reset', await p.evaluate(() => JSON.stringify(lineProgress())));
console.log(errs); await b.close(); })();
