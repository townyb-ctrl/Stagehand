// print buttons: when the dialog is blocked, a note offers the sheets as a file that has its own Print button
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
await p.evaluate(() => { view = 'paper'; paperTab = 'overview'; renderAll(); document.querySelectorAll('.toast').forEach(t => t.remove()); });
// 1. blocked: print() returns without opening anything
await p.evaluate(() => { window.print = () => {}; });
await p.click('#printBtn'); await p.waitForTimeout(800);
const t1 = await p.evaluate(() => document.querySelector('.toast')?.textContent || '');
console.log('blocked note', /blocked/i.test(t1), 'has download', /Download/.test(t1));
const [dl] = await Promise.all([p.waitForEvent('download'), p.evaluate(() => [...document.querySelectorAll('.toast button')].find(x => /Download/.test(x.textContent)).click())]);
const f = await dl.path(); const html = require('fs').readFileSync(f, 'utf8');
console.log('file', dl.suggestedFilename(), 'print button', html.includes('class="fileprint" onclick="print()"'), 'has inputs', html.includes('sec-inputs'));
// rider: the file is just the rider and prints it alone
await p.evaluate(() => { document.querySelectorAll('.toast').forEach(t => t.remove()); paperTab = 'rider'; renderPaper(); });
await p.click('#printMore'); await p.click('#printRider'); await p.waitForTimeout(800);
const [dl2] = await Promise.all([p.waitForEvent('download'), p.evaluate(() => [...document.querySelectorAll('.toast button')].find(x => /Download/.test(x.textContent)).click())]);
const h2 = require('fs').readFileSync(await dl2.path(), 'utf8');
console.log('rider file', dl2.suggestedFilename(), h2.includes('class="print-rider"'), h2.includes('sec-rider'));
// 2. working: the dialog opens (beforeprint fires): no note
await p.evaluate(() => { document.querySelectorAll('.toast').forEach(t => t.remove()); paperTab = 'overview'; renderPaper(); window.print = () => { dispatchEvent(new Event('beforeprint')); dispatchEvent(new Event('afterprint')); }; });
await p.click('#printBtn'); await p.waitForTimeout(800);
console.log('no note when printing works', !/blocked/i.test(await p.evaluate(() => document.querySelector('.toast')?.textContent || '')));
// the downloaded file prints: open it and check its button calls print
const out = __dirname + '/dl-sheets.html'; await dl.saveAs(out); const p2 = await ctx.newPage(); await p2.goto('file://' + out); await p2.waitForTimeout(400);
console.log('file opens', await p2.evaluate(() => !!document.querySelector('.fileprint') && (!document.querySelector('.viewbar') || getComputedStyle(document.querySelector('.viewbar')).display === 'none')));
await p2.emulateMedia({ media: 'print' }); console.log('button hidden on paper', await p2.evaluate(() => getComputedStyle(document.querySelector('.fileprint')).display === 'none'));
console.log('errors', errs); await b.close(); })();
