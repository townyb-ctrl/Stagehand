const { chromium } = require(require('./app.js').pw); const RICH = require('./rich.js');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); await p.addInitScript(() => { try { localStorage.setItem('stageplot.detail', 'adv'); } catch {} });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300); await p.evaluate(RICH); await p.waitForTimeout(200);
const scr = id => p.evaluate(id => { const it = itemById(id), m = svg.getScreenCTM(); return { x: it.x * m.a + m.e, y: it.y * m.d + m.f }; }, id);
const ftScr = (x, y) => p.evaluate(([x, y]) => { const m = svg.getScreenCTM(); return { x: x * m.a + m.e, y: y * m.d + m.f }; }, [x, y]);
// Select tool via toolbar
await p.evaluate(() => setMode('box'));
const ids = await p.evaluate(() => plan.items.filter(i => ['stagebox', 'distro'].includes(i.type)).map(i => i.id));
for (const id of ids) { const q = await scr(id); await p.mouse.click(q.x, q.y); await p.waitForTimeout(450); }
console.log('tap-picked', await p.evaluate(() => selIds().length), ids.length, await p.evaluate(() => $('fzoom').textContent.trim().slice(0, 60)));
// tap one again drops it
const vis = []; for (const id of ids) { const q = await scr(id); if (await p.evaluate(([x, y, id]) => document.elementFromPoint(x, y)?.closest('[data-id]')?.dataset.id === id, [q.x, q.y, id])) vis.push(id); } const q0 = await scr(vis[0]); await p.mouse.click(q0.x, q0.y); await p.waitForTimeout(450);
console.log('tap again drops', await p.evaluate(() => selIds().length));
// drag a picked item moves all
const bef = await p.evaluate(() => selIds().map(id => itemById(id).x));
const q1 = await scr(ids[1]); await p.mouse.move(q1.x, q1.y); await p.mouse.down(); await p.mouse.move(q1.x + 50, q1.y, { steps: 5 }); await p.mouse.up();
const aft = await p.evaluate(() => selIds().map(id => itemById(id).x));
console.log('moved all', aft.map((x, i) => +(x - bef[i]).toFixed(2)), 'still', await p.evaluate(() => selIds().length)); await p.keyboard.press('Control+z');
// box drag without shift
const a = await ftScr(0, 0), c = await ftScr(plan_w = 16, 6);
await p.mouse.move(a.x - 5, a.y - 5); await p.mouse.down(); await p.mouse.move(c.x, c.y, { steps: 6 }); await p.mouse.up();
console.log('box picked', await p.evaluate(() => selIds().length));
// click floor clears
const fl = await p.evaluate(() => { const m = svg.getScreenCTM(); for (let y = plan.stage.d - 1; y > 1; y -= .7) for (let x = 1; x < plan.stage.w - 1; x += .7) { const sx = x * m.a + m.e, sy = y * m.d + m.f, el = document.elementFromPoint(sx, sy); if (el && svg.contains(el) && !el.closest('[data-id], [data-cid], [data-badge], [data-chid]')) return { x: sx, y: sy }; } return null; });   // an empty bit of stage, wherever the plot sits
await p.mouse.click(fl.x, fl.y); console.log('cleared', await p.evaluate(() => selIds().length));
await p.keyboard.press('Escape'); console.log('mode after esc', await p.evaluate(() => mode));
// Measure: drag
await p.keyboard.press('m');
const m1 = await ftScr(12, 9), m2 = await ftScr(12 + 9.84252, 9);
await p.mouse.move(m1.x, m1.y); await p.mouse.down(); await p.mouse.move(m2.x, m2.y, { steps: 6 }); await p.mouse.up();
console.log('measure', await p.evaluate(() => document.querySelector('.msr-label')?.textContent), await p.evaluate(() => $('fzoom').textContent.trim().slice(0, 40)));
await p.screenshot({ path: 'n-measure.png' });
// click-click measure snapping to gear
const g1 = await scr(vis[1]), g2 = await scr(vis[2]); ids[1] = vis[1]; ids[2] = vis[2];
await p.mouse.click(g1.x, g1.y); await p.mouse.move(g2.x, g2.y, { steps: 3 }); await p.mouse.click(g2.x, g2.y);
console.log('gear-to-gear', await p.evaluate(() => [document.querySelector('.msr-label')?.textContent, measure.live]), await p.evaluate(([a, b]) => mVal(Math.hypot(itemById(a).x - itemById(b).x, itemById(a).y - itemById(b).y)), [ids[1], ids[2]]));
await p.keyboard.press('Escape'); console.log('cleared msr', await p.evaluate(() => measure === null && mode === 'measure'));
await p.keyboard.press('Escape'); console.log('mode', await p.evaluate(() => mode));
// rotate handle
const w = await p.evaluate(() => plan.items.find(i => i.type === 'foh').id); await p.evaluate(id => focusItem(id), w); await p.waitForTimeout(100); const wq = await scr(w);
const kh = await p.evaluate(() => { const r = document.querySelector('.roth').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
await p.mouse.move(kh.x, kh.y); await p.mouse.down(); await p.mouse.move(wq.x + 120, wq.y, { steps: 6 }); 
console.log('rot readout', await p.evaluate(() => [...document.querySelectorAll('.cablen')].map(t => t.textContent).find(t => t.endsWith('°'))));
await p.mouse.up(); console.log('rot', await p.evaluate(id => itemById(id).rot, w));
await p.keyboard.press('Control+z'); console.log('undo rot', await p.evaluate(id => itemById(id).rot || 0, w));
// drag readout
await p.waitForTimeout(500); const sb = await scr(w); await p.mouse.move(sb.x, sb.y); await p.mouse.down(); await p.mouse.move(sb.x + 30, sb.y + 20, { steps: 4 });
console.log('pos readout', await p.evaluate(() => [...document.querySelectorAll('.cablen')].map(t => t.textContent).find(t => t.includes('from SR'))));
await p.mouse.up();
// compare: new week, move/add/remove
await p.evaluate(() => newWeek(false)); await p.waitForTimeout(200);
await p.evaluate(() => mutate(() => { plan.items.find(i => i.type === 'stagebox').x += 4; plan.items = plan.items.filter(i => i.type !== 'iem_rack'); addItem('camera', 5, 22); }));
await p.evaluate(() => { sel = null; renderAll(); });
await p.click('[data-go="compare"]');
console.log('compare', await p.evaluate(() => $('fzoom').textContent.trim()), await p.evaluate(() => [document.querySelectorAll('.cmp-new').length, document.querySelectorAll('.cmp-moved').length, document.querySelectorAll('.cmp-gone').length]));
await p.screenshot({ path: 'n-compare.png' });
await p.keyboard.press('Escape'); console.log('compare off', await p.evaluate(() => compare === null && !document.querySelector('.cmp')));
// phone
await p.setViewportSize({ width: 400, height: 800 }); await p.waitForTimeout(300); console.log('phone sw', await p.evaluate(() => document.documentElement.scrollWidth));
await p.screenshot({ path: 'n-phone.png' });
console.log('errors', errs); await b.close(); })();
