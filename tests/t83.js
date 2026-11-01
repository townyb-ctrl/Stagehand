// load-in ring, print footer, gear size + owned badge, status pulse, first-run card, team sections
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
await p.evaluate(() => goHome('library')); await p.waitForTimeout(200);
console.log('start card on example', await p.evaluate(() => !!document.querySelector('.startcard') && document.querySelectorAll('.startsteps li').length));
// (the first-run card was removed; the welcome dialog and setup guide remain)
await p.evaluate(() => { localStorage.removeItem('stageplot.startHidden'); plan.name = 'Sunday'; save(); renderHome(); });
console.log('gone once a real week has a team', await p.evaluate(() => !document.querySelector('.startcard')));
// load-in ring fills
const ring = await p.evaluate(() => { const g = loadinTasks().flatMap(([, , l]) => l); const st = loadinState(); for (const t of g.slice(0, Math.floor(g.length / 2))) st[t.key] = true; save(); renderHome(); const c = document.querySelector('.ldfill'); return c ? c.getAttribute('stroke-dasharray') : null; });
console.log('ring', ring);
// team sections
await p.evaluate(() => { plan.team.push({ id: uid(), name: 'Sam', role: 'FOH Engineer' }, { id: uid(), name: '', role: '' }); save(); view = 'plot'; railTab = 'team'; renderAll(); });
console.log('sections', await p.evaluate(() => [...document.querySelectorAll('.pgroup')].map(h => h.textContent.trim()).join(' | ')));
// gear card
await p.evaluate(() => { (db.gear ||= { hidden: [], owned: {} }).owned = { drum_kit: 0 }; save(); railTab = 'gear'; renderAll(); });
console.log('gear card', await p.evaluate(() => { const c = document.querySelector('.gear[data-add="drum_kit"]'); return [c.querySelector('.gsize')?.textContent, c.querySelector('.ownb')?.textContent, c.querySelector('.ownb')?.classList.contains('over')]; }));
// status pulse
await p.evaluate(() => { railTab = 'team'; renderAll(); });
const pulsed = await p.evaluate(() => { mutate(() => { plan.items.push({ id: uid(), type: 'vox_mic', x: 30, y: 2 }); }); return $('checksBtn').querySelector('.chip').getAnimations().length > 0; });
console.log('pulse on change', pulsed, 'no pulse when same', await p.evaluate(() => { renderAll(); return $('checksBtn').querySelector('.chip').getAnimations().length === 0; }));
// footer
console.log('footer', await p.evaluate(() => { view = 'paper'; renderAll(); return /@bottom-left[^}]*Sunday · /.test($('pageFoot').textContent) && /counter\(pages\)/.test($('pageFoot').textContent); }));
console.log('errors', errs); await b.close(); })();
