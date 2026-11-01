// carpet surface, surface tiles fit the inspector, whose-gear blobs merge and pop
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const errs = []; const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(300);
await p.evaluate(() => { document.querySelector('.toast')?.remove(); sel = null; inspOpen = true; applyPanels(false); renderAll(); });
console.log('tiles', await p.evaluate(() => [...document.querySelectorAll('.textile')].map(t => t.textContent.trim()).join(',')));
console.log('tile fit', await p.evaluate(() => { const g = document.querySelector('.texpick').getBoundingClientRect(), ins = document.querySelector('.insp').getBoundingClientRect(); const ts = [...document.querySelectorAll('.textile')].map(t => t.getBoundingClientRect()); return { inside: g.right <= ins.right + .5, oneRow: new Set(ts.map(r => Math.round(r.top))).size === 1, w: Math.round(ts[0].width), clipped: [...document.querySelectorAll('.textile span')].some(s => s.scrollWidth > s.clientWidth) }; }));
await p.click('[data-decktex="carpet"]'); await p.waitForTimeout(100);
console.log('carpet', await p.evaluate(() => [plan.stage.texture, document.querySelectorAll('.deck-tex.t-carpet').length, document.querySelector('[data-decktex="carpet"]').getAttribute('aria-pressed')]));
await p.screenshot({ path: 't52-carpet.png' });
await p.screenshot({ path: 't52-tiles.png', clip: { x: 1145, y: 700, width: 295, height: 200 } });
// whose gear
await p.click('#cabBtn'); await p.click('[data-over="owners"]'); await p.click('#cabBtn');
await p.waitForTimeout(250); console.log('intro anim', await p.evaluate(() => [document.querySelectorAll('.ov-own').length, document.querySelectorAll('.ov-own .blob').length, document.querySelectorAll('.ov-own .neck').length, !!document.getElementById('ownGoo')]));
await p.screenshot({ path: 't52-intro.png' });
await p.waitForTimeout(1500); await p.evaluate(() => renderPlot());
console.log('settled', await p.evaluate(() => [document.querySelectorAll('.ov-own .bub').length, ownerNecks.size]));
await p.screenshot({ path: 't52-owners.png' });
// move one of Taylor's things far away then back: neck goes, then pops in
const r = await p.evaluate(() => { const amp = plan.items.find(i => i.type === 'gtr_amp'); const was = [amp.x, amp.y]; const n0 = ownerNecks.size; amp.x = plan.stage.w / 2; amp.y = plan.stage.d - 1; renderPlot(); const n1 = ownerNecks.size; amp.x = was[0]; amp.y = was[1]; renderPlot(); return [n0, n1, ownerNecks.size, document.querySelectorAll('.ov-own .neck.pop').length]; });
console.log('necks before/away/back, popping', r);
await p.waitForTimeout(120); await p.screenshot({ path: 't52-pop.png' });
// drag performance with goo on
const ms = await p.evaluate(() => { const t = performance.now(); for (let i = 0; i < 20; i++) renderPlot(); return Math.round((performance.now() - t) / 20); }); console.log('redraw ms', ms);
console.log('paper clean', await p.evaluate(() => !/ownGoo|ov-own/.test(plotSnapshot())));
console.log('errors', errs); await b.close(); })();
