// pro: input list columns + CSV/desk export, rider one-pager, smart guides, version history, smooth zoom and hairlines
const { chromium } = require(require('./app.js').pw); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 1000 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(() => { try { if (!sessionStorage.getItem('advSet')) { localStorage.setItem('stageplot.detail', 'adv'); sessionStorage.setItem('advSet', '1'); } } catch {} });   // these check Advanced-level tools
await p.goto(require('./app.js').url); await p.waitForTimeout(400); await p.click('#welcomeExample'); await p.waitForTimeout(300);
await p.evaluate(() => document.querySelector('.toast')?.remove());
// 1 input list
await p.evaluate(() => { view = 'paper'; paperTab = 'inputs'; renderAll(); });
console.log('in cols', await p.evaluate(() => [...document.querySelectorAll('#sec-inputs th')].map(t => t.textContent).join('|')), 'phantom', await p.evaluate(() => document.querySelectorAll('#sec-inputs .p48').length));
let [dl] = await Promise.all([p.waitForEvent('download'), p.click('[data-exp="inputs"]')]); console.log('csv', dl.suggestedFilename(), fs.readFileSync(await dl.path(), 'utf8').split('\r\n')[0]);
[dl] = await Promise.all([p.waitForEvent('download'), p.click('[data-exp="names"]')]); console.log('names', fs.readFileSync(await dl.path(), 'utf8').split('\r\n').slice(0, 2).join(' / '));
// 2 rider
await p.evaluate(() => { printOnly = 'rider'; renderPaper(); }); await p.waitForTimeout(150);
console.log('rider', await p.evaluate(() => ({ rev: document.querySelector('.rblock dd')?.textContent, legend: document.querySelectorAll('.rlegend li').length, ins: document.querySelectorAll('.rtab tbody tr').length, scalebar: !!document.querySelector('.riderplot .scalebar'), cablesHidden: getComputedStyle(document.querySelector('.riderplot path[class^="cab"]') || document.body).display })));
await p.evaluate(() => document.body.classList.add('print-rider')); await p.emulateMedia({ media: 'print' }); await p.pdf({ path: 't55-rider.pdf', format: 'A4', printBackground: true });
console.log('rider pages', (fs.readFileSync('t55-rider.pdf', 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length);
await p.emulateMedia({ media: 'screen' }); await p.evaluate(() => { document.body.classList.remove('print-rider'); printOnly = null; });
console.log('normal print skips rider', await p.evaluate(() => { paperTab = 'all'; renderPaper(); return !document.getElementById('sec-rider'); }));
// 4 history
await p.evaluate(() => { view = 'plot'; renderAll(); const amp = plan.items.find(i => i.type === 'gtr_amp'); mutate(() => { amp.x += 2; }); mutate(() => { amp.x += 1; }); mutate(() => addItem('wedge', 5, 5)); });
console.log('history', await p.evaluate(() => weekHist(plan.id).map(e => `r${e.rev}:${e.label}`).join(' | ')));
await p.evaluate(() => openHist()); await p.fill('#histName', 'Christmas final'); await p.keyboard.press('Enter');
console.log('named', await p.evaluate(() => [weekHist(plan.id).filter(e => e.name).map(e => e.name), document.querySelectorAll('.histlist li').length]));
await p.screenshot({ path: 't55-history.png' });
await p.click('[data-hrestore] >> nth=0'); console.log('restored wedges', await p.evaluate(() => [plan.items.filter(i => i.type === 'wedge').length, weekHist(plan.id).slice(-1)[0].label]));
await p.keyboard.press('Escape'); await p.keyboard.press('Control+z'); console.log('undo restore', await p.evaluate(() => [$('histDlg').hidden, plan.items.filter(i => i.type === 'wedge').length]));
await p.reload(); await p.waitForTimeout(400); console.log('kept after reload', await p.evaluate(() => weekHist(plan.id).length > 3));
// 3 smart guides
const ids = await p.evaluate(() => { document.querySelector('.toast')?.remove(); view = 'plot'; return [6, 12, 20.3].map(x => addItem('wedge', x, 23).id); });
await p.evaluate(() => renderAll());
const scr = (x, y) => p.evaluate(([x, y]) => { const m = svg.getScreenCTM(); return { x: x * m.a + m.e, y: y * m.d + m.f }; }, [x, y]);
const a = await scr(20.3, 23), t = await scr(18.06, 23.1); console.log('at point', await p.evaluate(([x, y]) => [view, document.elementFromPoint(x, y)?.closest('[data-id]')?.dataset.id, document.elementFromPoint(x, y)?.className?.baseVal ?? document.elementFromPoint(x, y)?.className], [a.x, a.y]), ids[2]);
await p.mouse.move(a.x, a.y); await p.mouse.down(); await p.mouse.move(t.x, t.y, { steps: 8 });
console.log('guides', await p.evaluate(() => ({ eq: (drag.dims || []).filter(d => d.eq).length, readouts: (drag.dims || []).filter(d => !d.eq).length, drawn: document.querySelectorAll('.gdim').length })));
await p.mouse.up(); console.log('snapped to equal gap', await p.evaluate(id => itemById(id).x, ids[2]), 'alt skips', await p.evaluate(() => typeof smartSnap));
// 5 smooth zoom + hairlines
const z0 = await p.evaluate(() => scale); await p.click('#zIn'); const mid = await p.evaluate(() => scale); await p.waitForTimeout(350); const z1 = await p.evaluate(() => scale);
console.log('zoom eases', mid < z1 * .999 || mid === z0 ? 'yes' : 'jumped', (z1 / z0).toFixed(2), 'hairline px', await p.evaluate(() => { const l = document.querySelector('.g-major'); return l ? (parseFloat(getComputedStyle(l).strokeWidth) * scale).toFixed(2) : 'none'; }));
console.log('errors', errs); await b.close(); })();
