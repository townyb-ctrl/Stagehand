// blank stage sheet prints alone, nothing on the stage; nothing fades when printed
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(300);
await p.evaluate(() => { view = 'paper'; renderAll(); document.querySelectorAll('.toast').forEach(t => t.remove()); });
await p.click('#printMore'); await p.waitForTimeout(100);
await p.evaluate(() => { window.print = () => { window.__printed = true; window.dispatchEvent(new Event('beforeprint')); }; });
await p.click('#printBlank'); await p.waitForTimeout(100);
console.log('blank in page', await p.evaluate(() => [!!$('sec-blank'), document.body.classList.contains('print-blank'), $('sec-blank').querySelectorAll('[data-id]').length, document.querySelectorAll('#sheetGrid [data-id]').length]));
await p.waitForTimeout(1600); console.log('cleaned up', await p.evaluate(() => [!$('sec-blank'), !document.body.classList.contains('print-blank')]));
console.log(errs); await b.close(); })();
