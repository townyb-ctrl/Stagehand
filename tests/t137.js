// plug states on more gear: triangle plug heads on power sockets, DMX splitter outputs, IEM transmitter lights, desk channel strips
const { chromium } = require(require('./app.js').pw); const SP = '';
(async () => { const b = await chromium.launch(); const errs = [];
for (const th of ['dark', 'light']) { const p = await b.newPage({ viewport: { width: 1300, height: 700 }, colorScheme: th }); p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
console.log(th, await p.evaluate(() => { document.querySelectorAll('.toast').forEach(t => t.remove()); view = 'plot'; plan.items = []; plan.cables = []; railOpen = false; inspOpen = false; applyPanels(false);
  const pp = addItem('wall_outlet', 2, 2.5), e4 = addItem('pboard4', 6, 2.5), ds = addItem('distro', 10, 2.5);
  addCable('power', e4.id, pp.id, {}); for (const x of [5, 6]) addCable('power', addItem('gtr_amp', x, 5).id, e4.id, {});
  for (const x of [9, 10]) addCable('power', addItem('wedge', x, 5.5).id, ds.id, {});
  const ld = addItem('light_desk', 14, 2.5), sp = addItem('dmx_split', 18, 2.5); addCable('dmx', ld.id, sp.id, {}); for (const x of [17, 18, 19]) addCable('dmx', sp.id, addItem('par_led', x, 5).id, {});
  const rk = addItem('iem_rack', 22, 2.5); for (const x of [21, 22, 23]) addItem('iem', x, 5);
  const sn = addItem('snake12', 6, 9), foh = addItem('foh', 13, 9.5), mon = addItem('mon_desk', 20, 9.5); addCable('multi', sn.id, foh.id, {});
  for (const x of [3, 4, 5, 6, 7]) addCable('xlr', addItem('vox_mic', x, 12).id, sn.id, {});
  zoom = 46; needFit = true; renderAll(); const q = scrPt(plotCTM(), 12, 6.5), r = scroller.getBoundingClientRect(); scroller.scrollLeft += q.x - (r.left + r.width / 2); scroller.scrollTop += q.y - (r.top + r.height / 2);
  const n = sel => [...document.querySelectorAll('#plot .item')].map(g => { const k = g.querySelectorAll(sel).length; return k ? itemName(itemById(g.dataset.id)) + ':' + k : ''; }).filter(Boolean).join(' ');
  return { plugs: n('.plughead, .plugin'), txon: n('.txon'), stripsOff: n('.stripoff') }; }));
await p.waitForTimeout(300); await p.screenshot({ path: SP + `sockets2-${th}.png`, clip: { x: 60, y: 70, width: 1240, height: 620 } }); await p.close(); }
console.log('errors', errs); await b.close(); })();
