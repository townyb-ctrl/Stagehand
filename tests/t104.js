// simplify pass: Simple keeps everyday sheets and tools up front, the rest under More / Advanced
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(300);
const tabs = () => p.evaluate(() => [...document.querySelectorAll('[data-ptab]')].map(b => b.dataset.ptab).join(','));
await p.evaluate(() => { view = 'paper'; paperTab = 'overview'; renderAll(); document.querySelectorAll('.toast').forEach(t => t.remove()); });
console.log('simple tabs', await tabs(), '| viewbar', await p.evaluate(() => [...document.querySelectorAll('.viewbar button')].map(b => b.textContent.trim()).join(' / ')));
// (every sheet now shows in the tab row; More sheets was removed)

await p.click('#printMore'); console.log('print menu', await p.evaluate(() => [!!document.querySelector('.printpop #inkBtn'), !!document.querySelector('.printpop #sheetsBtn')]));
await p.click('#inkBtn'); console.log('ink toggles', await p.evaluate(() => inkSave));
await p.evaluate(() => { inkSave = false; localStorage.setItem('stageplot.ink', '0'); view = 'plot'; renderAll(); });
console.log('dock', await p.evaluate(() => [!!$('flipView'), !!$('setupLock')]));
await p.evaluate(() => { plan.setupLock = true; renderAll(); }); console.log('lock shows while on', await p.evaluate(() => !!$('setupLock'))); await p.evaluate(() => { delete plan.setupLock; renderAll(); });
await p.click('#weekBtn'); console.log('plan ahead hidden', await p.evaluate(() => !$('aheadGo'))); await p.keyboard.press('Escape');
await p.evaluate(() => goHome('gear')); console.log('gear', await p.evaluate(() => [document.querySelectorAll('[data-where]').length, !!$('gearWhereOn'), document.querySelector('.cfold')?.open]));
await p.click('#gearWhereOn'); console.log('kept in on', await p.evaluate(() => document.querySelectorAll('[data-where]').length > 0));
await p.evaluate(() => setDetail(true)); await p.evaluate(() => { view = 'paper'; renderAll(); }); console.log('advanced tabs', await tabs());
await p.evaluate(() => { view = 'plot'; renderAll(); }); console.log('adv dock', await p.evaluate(() => [!!$('flipView'), !!$('setupLock')]));
await p.evaluate(() => { setDetail(false); const w = plan.items.filter(i => cat(i).wireless); w[0].rf = 'Ch 3'; w[1].rf = 'Ch 3'; view = 'paper'; paperTab = 'overview'; renderAll(); }); console.log('clash shows rf', await tabs());
console.log(errs); await b.close(); })();
