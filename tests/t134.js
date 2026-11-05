// channel network: branch off a channel by starting on it, end on another to join it; cables route through joined channels
// as one run; a branch stays on its channel when that channel is reshaped; joints and crossings draw seamlessly
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(() => { try { localStorage.setItem('stageplot.detail', 'adv'); } catch {} });
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
await p.evaluate(() => { document.querySelectorAll('.toast').forEach(t => t.remove()); view = 'plot'; plan.items = []; plan.cables = []; plan.channels = []; plan.settings.autoPatch = false; railOpen = false; inspOpen = false; applyPanels(false); zoom = 22; needFit = true; renderAll(); });
const scr = (x, y) => p.evaluate(([x, y]) => { const q = scrPt(plotCTM(), x, y); return [q.x, q.y]; }, [x, y]);
const click = async (x, y) => { await p.evaluate(() => document.querySelectorAll('.toast').forEach(t => t.remove())); const [sx, sy] = await scr(x, y); await p.mouse.move(sx, sy, { steps: 3 }); await p.mouse.click(sx, sy); await p.waitForTimeout(80); };
// main trench along the front, drawn by clicks
await p.evaluate(() => setMode('channel'));
await click(2, 12); await click(30, 12); await p.keyboard.press('Enter'); await p.waitForTimeout(150);
console.log('main', await p.evaluate(() => chans().map(c => [c.name, c.pts.length])));
// branch: start on the main trench, go up, Enter
await p.evaluate(() => setMode('channel'));
const [hx, hy] = await scr(12.1, 12.2); await p.mouse.move(hx, hy, { steps: 3 }); await p.waitForTimeout(80);
console.log('join mark on hover', await p.evaluate(() => !!document.querySelector('.ch-joinmark')));
await click(12.1, 12.2); await click(12, 2.5); await p.keyboard.press('Enter'); await p.waitForTimeout(150);
const br = await p.evaluate(() => { const c = chans()[1]; return { start: c.pts[0], joins: c.joins }; });
console.log('branch', JSON.stringify(br));
// a cable from upstage near the branch to downstage right: it runs up the branch, along the main, out near the far end
const r = await p.evaluate(() => { const a = addItem('gtr_amp', 13.5, 1.5), z = addItem('stagebox', 28, 14.5); const c = addCable('xlr', a.id, z.id, {}); const ri = routeInfo(c); renderAll(); return { vias: ri.vias.map(v => v.name), len: Math.round(cableLen(c) * 10) / 10, straight: ri.straight.size }; });
console.log('route', JSON.stringify(r)); console.log('branch named after its channel', await p.evaluate(() => chans().map(c => c.name)));
// a third channel crossing the main trench: still one network
await p.evaluate(() => setMode('channel')); await click(22, 6); await click(22, 15); await p.keyboard.press('Enter'); await p.waitForTimeout(100);
console.log('crossing joins', await p.evaluate(() => chNet('floor').links.length));
console.log('one channel', await p.evaluate(() => { renderAll(); return [new Set(chans().map(c => c.name)).size, chans()[0].name, document.querySelectorAll('#plot .ch-label').length, new Set(chGroups().values()).size]; }));
await p.evaluate(() => { mode = 'select'; sel = { kind: 'channel', id: chans()[2].id }; inspOpen = true; applyPanels(false); renderAll(); });
console.log('picked as a whole', await p.evaluate(() => [document.querySelectorAll('#plot .ch-edge.sel').length, chans().length, $('inspector').querySelector('h2')?.textContent, !!$('chDelRun')]));
await p.evaluate(() => { const i = $('chName'); i.value = 'Front trench'; i.dispatchEvent(new Event('change', { bubbles: true })); });
console.log('rename all', await p.evaluate(() => chans().map(c => c.name).join(',')));
await p.evaluate(() => { inspOpen = false; applyPanels(false); renderAll(); });
// drawing that ends on a channel finishes there and joins (with an elbow so it meets square on)
await p.evaluate(() => setMode('channel')); await click(26, 3); await click(26, 6); await click(12.3, 5.1); await p.waitForTimeout(150);
console.log('ends on a channel', await p.evaluate(() => { const c = chans().at(-1); return [mode, c.pts.length, JSON.stringify(c.pts.at(-1)), c.joins?.b?.id === chans()[1].id]; }));
// reshape the main trench: the branch's joined end follows it
const before = await p.evaluate(() => chans()[1].pts[0].slice());
await p.evaluate(() => { sel = { kind: 'channel', id: chans()[0].id }; mode = 'select'; inspOpen = false; applyPanels(false); renderAll(); });
const m0 = await p.evaluate(() => chans()[0].pts[0]); const [mx, my] = await scr(m0[0], m0[1]); await p.mouse.move(mx, my); await p.mouse.down(); const [nx, ny] = await scr(m0[0], m0[1] - 3); await p.mouse.move(nx, ny, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(150);
const after = await p.evaluate(() => [chans()[1].pts[0], (() => { const n = nearestOn(chans()[0].pts, chans()[1].pts[0][0], chans()[1].pts[0][1]); return n.dist < .05; })()]);
console.log('branch follows', JSON.stringify(before), '->', JSON.stringify(after[0]), 'still on', after[1]);
// slide the joint along the main trench by dragging the branch's end
await p.evaluate(() => { sel = { kind: 'channel', id: chans()[1].id }; renderAll(); });
const st = await p.evaluate(() => chans()[1].pts[0]); const [ax, ay] = await scr(st[0], st[1]); await p.mouse.move(ax, ay); await p.mouse.down(); const [bx, by] = await scr(st[0] + 4, st[1]); await p.mouse.move(bx, by, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(150);
console.log('joint slides', await p.evaluate(() => { const c = chans()[1], n = nearestOn(chans()[0].pts, c.pts[0][0], c.pts[0][1]); return [Math.round(c.pts[0][0]), n.dist < .05, !!c.joins?.a]; }));
// delete the main trench: the branch lets go, nothing breaks; undo brings it back with the cable routed again
await p.evaluate(() => { sel = { kind: 'channel', id: chans()[0].id }; inspOpen = true; applyPanels(false); renderAll(); $('chDelRun').click(); });
console.log('remove one run', await p.evaluate(() => [chans().length, !!chans()[0].joins?.a]));
await p.keyboard.press('Control+z'); await p.waitForTimeout(150);
await p.evaluate(() => { sel = { kind: 'channel', id: chans()[1].id }; deleteSelected(); });
console.log('delete the channel', await p.evaluate(() => chans().length));
await p.keyboard.press('Control+z'); await p.waitForTimeout(150);
console.log('undo', await p.evaluate(() => { const c = plan.cables[0]; return [chans().length, routeInfo(c).vias.map(v => v.name).join(' + '), routeInfo(c).vias.every(v => chans().includes(v))]; }));
// seamless: every channel rim is drawn before any band
console.log('rims before bands', await p.evaluate(() => { const els = [...document.querySelectorAll('#plot .ch-edge, #plot .ch-band')], lastRim = els.map(e => e.classList.contains('ch-edge')).lastIndexOf(true), firstBand = els.findIndex(e => e.classList.contains('ch-band')); return lastRim < firstBand; }));
await p.evaluate(() => { sel = null; renderAll(); }); await p.screenshot({ path: 't134.png' });
console.log('errors', errs); await b.close(); })();
