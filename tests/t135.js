// running a cable by hand through a channel made of joined runs: in on one run, out of another; the hint knows it's the same channel
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(() => { try { localStorage.setItem('stageplot.detail', 'adv'); } catch {} });
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
await p.evaluate(() => { document.querySelectorAll('.toast').forEach(t => t.remove()); view = 'plot'; plan.items = []; plan.cables = []; plan.settings.autoPatch = false; railOpen = false; inspOpen = false; applyPanels(false);
  plan.channels = [{ id: 'm', name: 'Floor trench 1', kind: 'trench', pts: [[2, 14], [30, 14]] }, { id: 'b', name: 'Floor trench 2', kind: 'trench', pts: [[12, 14], [12, 3]], joins: { a: { id: 'm', s: 10 } } }];
  addItem('gtr_amp', 10, 3); addItem('stagebox', 28, 17); zoom = 22; needFit = true; renderAll(); });
await p.waitForTimeout(300);
const scr = (x, y) => p.evaluate(([x, y]) => { const q = scrPt(plotCTM(), x, y); return [q.x, q.y]; }, [x, y]);
const clean = () => p.evaluate(() => document.querySelectorAll('.toast').forEach(t => t.remove()));
const ids = await p.evaluate(() => plan.items.map(i => i.id));
await p.evaluate(() => setMode('cable'));
const at = async (x, y) => { await clean(); const [sx, sy] = await scr(x, y); await p.mouse.move(sx, sy, { steps: 4 }); await p.waitForTimeout(60); return [sx, sy]; };
let q = await at(10, 3); await p.mouse.click(...q);   // start at the amp
q = await at(12, 5); await p.mouse.click(...q);        // into the branch
q = await at(24, 14);                                  // over the front run of the same channel
console.log('hint over the other run', await p.evaluate(() => document.querySelector('#plot .cablen')?.textContent));
await p.mouse.click(...q);                             // out here
console.log('hop', await p.evaluate(() => JSON.stringify(pending.points[0])));
q = await at(28, 17); await p.mouse.click(...q);       // into the stage box
const r = await p.evaluate(() => { const c = plan.cables[0], ri = routeInfo(c); return { vias: ri.vias.map(v => v.id).join('+'), pts: ri.pts.map(x => x.map(n => Math.round(n))).map(x => x.join(',')).join(' '), passesJoint: ri.pts.some(x => Math.abs(x[0] - 12) < .01 && Math.abs(x[1] - 14) < .01), len: Math.round(cableLen(c)) }; });
console.log('route', JSON.stringify(r));
// open hop finished straight onto gear: it leaves from the nearest run
await p.evaluate(() => { plan.cables = []; setMode('cable'); renderAll(); });
q = await at(10, 3); await p.mouse.click(...q); q = await at(12, 6); await p.mouse.click(...q); q = await at(28, 17); await p.mouse.click(...q);
console.log('finish on gear', await p.evaluate(() => { const ri = routeInfo(plan.cables[0]); return ri.vias.map(v => v.id).join('+'); }));
console.log('errors', errs); await b.close(); })();
