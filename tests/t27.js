const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
await p.evaluate(() => { ui.adv = true; renderAll(); });
await p.click('#cabBtn'); await p.click('#cabAnim');
console.log('anim on, quiet: pulses', await p.evaluate(() => document.querySelectorAll('.flowanim').length), 'arrows', await p.evaluate(() => document.querySelectorAll('.flowg .fl').length));
// redraw a few times at different moments, then compare phases
for (let i = 0; i < 3; i++) { await p.waitForTimeout(170 + i * 90); await p.evaluate(() => renderPlot()); }
const phases = await p.evaluate(() => [...document.querySelectorAll('.flowanim')].map(e => e.getAnimations()[0]).filter(Boolean).map(a => (a.currentTime % 1100) | 0));
console.log('phase spread ms', Math.max(...phases) - Math.min(...phases), 'n', phases.length);
// select something: other cables still animate in step
await p.evaluate(() => { sel = { kind: 'item', id: plan.items.find(i => i.type === 'stagebox').id }; renderAll(); }); await p.waitForTimeout(250); await p.evaluate(() => renderPlot());
const ph2 = await p.evaluate(() => [...document.querySelectorAll('.flowanim')].map(e => e.getAnimations()[0]).filter(Boolean).map(a => (a.currentTime % 1100) | 0));
console.log('phase spread after select', Math.max(...ph2) - Math.min(...ph2));
// menu layout: no horizontal overflow inside menu
if (!await p.evaluate(() => !!document.querySelector('.cabmenu'))) await p.click('#cabBtn');
console.log('menu open', await p.evaluate(() => !!document.querySelector('.cabmenu')));
console.log('menu overflow', await p.evaluate(() => { const m = document.querySelector('.cabmenu'); return m ? m.scrollWidth - m.clientWidth : -1; }), 'switch inside', await p.evaluate(() => { const m = document.querySelector('.cabmenu')?.getBoundingClientRect(); return [...document.querySelectorAll('.cm-switch')].every(s => s.getBoundingClientRect().right <= m.right - 4); }));
console.log('channels row hidden w/o channels', await p.evaluate(() => !$('cabInCh')));
await p.click('#cabAudio'); console.log('audio pressed', await p.evaluate(() => $('cabAudio').getAttribute('aria-pressed')));
await p.click('#cabAllBtn'); console.log('all off', await p.evaluate(() => !cableView.all)); await p.click('#cabAllBtn');
await p.click('#cabShowAll'); console.log('all pressed', await p.evaluate(() => $('cabShowAll').getAttribute('aria-pressed')));
await p.click('#cabAnim');
await p.setViewportSize({ width: 400, height: 800 }); await p.waitForTimeout(200);
console.log('phone sw', await p.evaluate(() => document.documentElement.scrollWidth));
console.log('errors', errs); await b.close(); })();
