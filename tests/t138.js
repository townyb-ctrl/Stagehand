// analog snake into a digital stage box: mics land on the box's inputs through the snake's tails; a wedge on a snake return
const { chromium } = require(require('./app.js').pw); const FILE = require('./app.js').url, SP = '';
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1300, height: 760 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(FILE); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
const r = await p.evaluate(() => { document.querySelectorAll('.toast').forEach(t => t.remove()); view = 'plot'; railOpen = false; inspOpen = false; applyPanels(false);
  const sb = plan.items.find(i => i.type === 'stagebox'), before = { sbIns: (boxUse().get(sb.id) || {}).ins || 0 };
  const W = plan.stage.w, sn = addItem('snake12', W * .2, 2); sn.label = 'Snake A';
  const mics = [1, 2, 3, 4, 5].map(k => { const m = addItem('vox_mic', W * .1 + k * 1.2, 4); m.label = `Choir ${k}`; addCable('xlr', m.id, sn.id, {}); return m; });
  const wd = addItem('wedge', W * .15, 6); addCable('xlr', sn.id, wd.id, {});
  autoCable(); portMemo = null; renderAll();
  const run = plan.cables.find(c => c.type === 'multi' && touches(c, sn.id)), ins = inputList(), outs = outputList();
  const rows = ins.filter(x => mics.some(m => m.id === x.itemId)).map(x => `${x.name}: ${x.port} via ${x.snake}`);
  const wrow = outs.find(o => o.itemId === wd.id);
  return { multicoreTo: run && itemName(other(run, sn.id)), rows, wedge: wrow && `${wrow.port} via ${wrow.snake}`, sbInsBefore: before.sbIns, sbInsAfter: boxUse().get(sb.id).ins, snakeUse: boxUse().get(sn.id), fan: document.querySelectorAll('#plot .multifan .fantail').length,
    patchCol: [...document.querySelectorAll('#plot')].length && (() => { view = 'paper'; paperTab = 'inputs'; renderAll(); const t = [...document.querySelectorAll('#sec-inputs tbody tr')].map(r => r.lastElementChild.textContent).filter(x => /\(/.test(x)); view = 'plot'; renderAll(); return t.slice(0, 2); })() };
});
console.log(JSON.stringify(r, null, 1));
await p.evaluate(() => { const sn = plan.items.find(i => cat(i).snake), sb = plan.items.find(i => i.type === 'stagebox'); zoom = 34; renderPlot(); const q = scrPt(plotCTM(), (sn.x + sb.x) / 2, (sn.y + sb.y) / 2), rr = scroller.getBoundingClientRect(); scroller.scrollLeft += q.x - (rr.left + rr.width / 2); scroller.scrollTop += q.y - (rr.top + rr.height / 2); });
await p.waitForTimeout(300); await p.screenshot({ path: SP + 'snake2.png' });
// unplug the multicore: a warning, and the channels go nowhere
console.log('no multicore', await p.evaluate(() => { const sn = plan.items.find(i => cat(i).snake); plan.cables = plan.cables.filter(c => !(c.type === 'multi' && touches(c, sn.id))); return [warnings().some(w => /multicore isn't run/.test(w.msg)), inputList().find(x => x.name.startsWith('Choir'))?.port]; }));
console.log('errors', errs); await b.close(); })();
