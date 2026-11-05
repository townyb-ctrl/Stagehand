// patch panels: pick a snake, stage box or desk to see every socket and what's in it; the plot tags each source with its number; a socket points to and picks its source
const { chromium } = require(require('./app.js').pw); const SP = '';
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
await p.evaluate(() => { document.querySelectorAll('.toast').forEach(t => t.remove()); view = 'plot';
  const sb = plan.items.find(i => i.type === 'stagebox'); sb.label = 'Stage box A';
  const sn = addItem('snake12', sb.x + .5, sb.y + 3.2); sn.label = 'Snake A';
  ['Choir 1', 'Choir 2', 'Choir 3'].forEach((n, k) => { const m = addItem('vox_mic', sb.x - 3 + k * 1.4, sb.y + 6); m.label = n; addCable('xlr', m.id, sn.id, {}); });
  const w = addItem('wedge', sb.x + 4, sb.y + 6); addCable('xlr', sn.id, w.id, {});
  addCable('multi', sn.id, sb.id, {});
  sel = { kind: 'item', id: sn.id }; inspOpen = true; applyPanels(false); zoom = 30; renderAll();
  const m = plotCTM(), q = scrPt(m, sn.x, sn.y - 1.5), r = scroller.getBoundingClientRect(); scroller.scrollLeft += q.x - (r.left + r.width / 2); scroller.scrollTop += q.y - (r.top + r.height / 2); });
await p.waitForTimeout(300); await p.screenshot({ path: SP + 'panel-snake.png' });
console.log('snake tags', await p.evaluate(() => [...document.querySelectorAll('#plot .socktag text')].map(t => t.textContent).join(' | ')));
await p.evaluate(() => { sel = { kind: 'item', id: plan.items.find(i => i.type === 'stagebox').id }; renderAll(); }); await p.waitForTimeout(200);
await p.screenshot({ path: SP + 'panel-box.png' });
await p.evaluate(() => { sel = { kind: 'item', id: plan.items.find(i => cat(i).desk).id }; renderAll(); }); await p.waitForTimeout(200);
await p.screenshot({ path: SP + 'panel-desk.png', clip: { x: 1140, y: 60, width: 300, height: 840 } });
// hover a socket: the source lights up; click: it's picked
await p.evaluate(() => { sel = { kind: 'item', id: plan.items.find(i => cat(i).snake).id }; renderAll(); });
const t = p.locator('#inspector .ptile.on').first(); await t.hover(); await p.waitForTimeout(100);
console.log('hover finds', await p.evaluate(() => document.querySelectorAll('#plot .ptfind').length));
await t.click(); await p.waitForTimeout(150); console.log('click picks', await p.evaluate(() => itemName(itemById(sel.id))));
console.log('errors', errs); await b.close(); })();
