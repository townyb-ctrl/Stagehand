// fold switch + one-time hint, cable hover highlight + label, staggered build, cropped paperwork overview with FOH note
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(400); await p.click('#welcomeExample'); await p.waitForTimeout(700);
console.log('hint', await p.evaluate(() => document.querySelector('.toast')?.textContent));
await p.evaluate(() => document.querySelector('.toast')?.remove());
await p.click('#cabBtn'); await p.click('#foldBtn'); await p.click('#cabBtn');
console.log('fold off', await p.evaluate(() => [document.querySelectorAll('.gbadge').length, JSON.parse(localStorage.getItem('stageplot.cables')).fold]));
await p.reload(); await p.waitForTimeout(400); await p.evaluate(() => { view = 'plot'; renderAll(); });
console.log('kept off; no hint again', await p.evaluate(() => [document.querySelectorAll('.gbadge').length, !document.querySelector('.toast')]));
await p.evaluate(() => setCableView(() => { cableView.fold = true; })); console.log('fold on', await p.evaluate(() => document.querySelectorAll('.gbadge').length));
// hover a cable
const c = await p.evaluate(() => { const c = plan.cables.find(x => x.type === 'xlr'), m = svg.getScreenCTM(), o = cableGeom(c), q = midpoint(o); return { id: c.id, x: q[0] * m.a + m.e, y: q[1] * m.d + m.f }; });
await p.mouse.move(c.x, c.y); await p.waitForTimeout(150);
console.log('hover', await p.evaluate(id => [hoverCid === id, document.querySelector('.cabtag text')?.textContent], c.id));
await p.screenshot({ path: 't65-hover.png', clip: { x: c.x - 220, y: c.y - 120, width: 440, height: 240 } });
await p.mouse.move(5, 500); await p.waitForTimeout(100); console.log('hover cleared', await p.evaluate(() => [hoverCid, !!document.querySelector('.cabtag')]));
// paperwork overview crop
await p.evaluate(() => { view = 'paper'; paperTab = 'overview'; renderAll(); });
console.log('overview', await p.evaluate(() => { const vb = document.querySelector('#sec-overview .snap').getAttribute('viewBox').split(' ').map(Number); return { bottom: +(vb[1] + vb[3]).toFixed(1), stageD: plan.stage.d, note: document.querySelector('.snapnote')?.textContent.trim() }; }));
await p.locator('#sec-overview').screenshot({ path: 't65-overview.png' });
await p.evaluate(() => { view = 'plot'; renderAll(); });
// staggered build
const st = await p.evaluate(() => { clearWeek(false); plan.team = [{ id: uid(), name: 'Ana Drum', role: 'Drums' }, { id: uid(), name: 'Ben Keys', role: 'Keys' }, { id: uid(), name: 'Cara Lead', role: 'Worship Leader' }]; save(); buildNow();
  const anims = [...svg.querySelectorAll('.item[data-id]')].flatMap(el => el.getAnimations()).map(a => a.effect.getTiming().delay); const cab = [...svg.querySelectorAll('.cab')].flatMap(el => el.getAnimations()).map(a => a.effect.getTiming().delay);
  return { items: anims.length, maxItemDelay: Math.max(...anims), distinctDelays: new Set(anims).size, cableDelay: cab.length ? Math.min(...cab) : null }; });
console.log('build', st);
await p.waitForTimeout(1800); console.log('settled', await p.evaluate(() => svg.getAnimations ? svg.getAnimations({ subtree: true }).length : 0));
console.log('errors', errs); await b.close(); })();
