// sockets show what's plugged in: extension leads, power points and distros fill one socket per plug; stage boxes and snakes one XLR per input and output
const { chromium } = require(require('./app.js').pw); const SP = '';
(async () => { const b = await chromium.launch(); const errs = [];
for (const th of ['dark', 'light']) { const p = await b.newPage({ viewport: { width: 1300, height: 640 }, colorScheme: th }); p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
console.log(th, await p.evaluate(() => { document.querySelectorAll('.toast').forEach(t => t.remove()); view = 'plot'; plan.items = []; plan.cables = []; railOpen = false; inspOpen = false; applyPanels(false);
  const pp = addItem('wall_outlet', 2, 3), ds = addItem('distro', 5, 3), e4 = addItem('pboard4', 9, 3), e2 = addItem('pboard2', 12, 3), sn = addItem('snake12', 16, 3), sb = addItem('stagebox', 20.5, 3);
  addCable('power', e4.id, pp.id, {});   // the lead's own plug: not one of its sockets
  for (const x of [8, 9]) addCable('power', addItem('gtr_amp', x, 6).id, e4.id, {});   // two plugs in the 4-way
  for (const x of [4, 5, 6]) addCable('power', addItem('wedge', x, 6.5).id, ds.id, {});   // three in the distro
  for (const x of [14, 15, 16, 17, 18]) addCable('xlr', addItem('vox_mic', x, 6).id, sn.id, {});   // five inputs on the snake
  addCable('xlr', sn.id, addItem('wedge', 18, 8).id, {});   // one output
  for (const x of [19, 20, 21, 22]) addCable('xlr', addItem('di_stereo', x, 6).id, sb.id, {});   // eight inputs (stereo DIs) on the 32-in box
  zoom = 70; needFit = true; renderAll(); const q = scrPt(plotCTM(), 11, 3), r = scroller.getBoundingClientRect(); scroller.scrollLeft += q.x - (r.left + r.width / 2); scroller.scrollTop += q.y - (r.top + r.height / 2);
  return [...document.querySelectorAll('#plot .item')].map(g => { const n = g.querySelectorAll('.plugin').length; return n ? itemName(itemById(g.dataset.id)) + ':' + n : ''; }).filter(Boolean).join(' '); }));
await p.waitForTimeout(300); await p.screenshot({ path: SP + `sockets-${th}.png`, clip: { x: 60, y: 150, width: 1240, height: 300 } }); await p.close(); }
console.log('errors', errs); await b.close(); })();
