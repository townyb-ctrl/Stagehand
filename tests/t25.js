const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
console.log('header icons visible', await p.evaluate(() => [...document.querySelectorAll('header .iconbtn')].filter(b => b.offsetParent).length));
await p.click('#moreBtn'); console.log('menu', await p.evaluate(() => $('moreMenu').textContent.replace(/\s+/g, ' ').trim()));
await p.screenshot({ path: 'n-menu.png' });
await p.click('#moreMenu [data-theme-set="dark"]'); console.log('theme', await p.evaluate(() => themePref), 'menu still open', await p.evaluate(() => !$('moreMenu').hidden));
await p.click('#moreMenu [data-detail="adv"]'); console.log('adv', await p.evaluate(() => ui.adv));
await p.click('#moreMenu [data-detail="simple"]').catch(async () => { await p.click('#moreBtn'); await p.click('#moreMenu [data-detail="simple"]'); });
console.log('simple', await p.evaluate(() => !ui.adv));
if ($ => 0) {}
await p.keyboard.press('Escape'); await p.mouse.click(700, 600);
console.log('menu closed', await p.evaluate(() => $('moreMenu').hidden));
await p.click('#moreBtn'); await p.click('[data-mm="help"]'); console.log('help open', await p.evaluate(() => !$('helpDlg').hidden)); await p.keyboard.press('Escape');
await p.evaluate(() => $('dataBtn').click()); console.log('data open', await p.evaluate(() => !$('dataDlg').hidden)); await p.keyboard.press('Escape');
await p.evaluate(() => setTheme('system'));
// right panel
await p.evaluate(() => { sel = null; renderAll(); });
console.log('allset', await p.evaluate(() => !!document.querySelector('.allset')), 'steps list', await p.evaluate(() => !!document.querySelector('#inspector .steps')), 'legend folded', await p.evaluate(() => !!document.querySelector('details[data-fold="legend"]')));
console.log('pco card hidden w/ team', await p.evaluate(() => !document.querySelector('#railPane .card.soft')));
console.log('gear tab counts', await p.evaluate(() => { railTab = 'gear'; renderRail(); return document.querySelectorAll('.geartabs span').length; }));
await p.evaluate(() => { railTab = 'team'; renderAll(); });
await p.screenshot({ path: 'n-simple2.png' });
// with warnings: 3 shown + see all
await p.evaluate(() => { ui.guide = false; mutate(() => { for (let i = 0; i < 5; i++) addItem('camera', 4 + i, 12); }); });
console.log('checks shown', await p.evaluate(() => document.querySelectorAll('#inspector .warnlist li').length));
await p.click('[data-go="checks"]'); console.log('pop from see all', await p.evaluate(() => !!document.querySelector('.checkspop')));
await p.setViewportSize({ width: 400, height: 800 }); await p.waitForTimeout(300); console.log('phone sw', await p.evaluate(() => document.documentElement.scrollWidth));
await p.click('#moreBtn'); await p.screenshot({ path: 'n-menu-phone.png' }); console.log('phone menu sw', await p.evaluate(() => document.documentElement.scrollWidth));
console.log('errors', errs); await b.close(); })();
