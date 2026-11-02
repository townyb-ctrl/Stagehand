// analog snakes: a stage box of XLRs on a multicore to the desk; inputs and outputs patch to it and respect its size
const { chromium } = require(require('./app.js').pw); const FILE = require('./app.js').url;
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(FILE); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
await p.evaluate(() => { view = 'plot'; renderAll(); });
console.log('library', await p.evaluate(() => GEAR_GROUPS.find(g => g[0] === 'Desks & tech')[1].filter(t => CAT[t].snake).map(t => CAT[t].name)));
// swap the digital stage box for a 12-in analog snake
const r = await p.evaluate(() => {
  const sb = plan.items.find(i => i.type === 'stagebox'); const x = sb.x, y = sb.y;
  plan.items.splice(plan.items.indexOf(sb), 1); plan.cables = plan.cables.filter(c => c.from !== sb.id && c.to !== sb.id);
  addGear('snake12', x, y); const sn = itemById(sel.id); autoCable(); renderAll();
  const run = plan.cables.find(c => touches(c, sn.id) && cat(other(c, sn.id)).desk);
  const ins = inputList(), outs = outputList();
  return { label: sn.label, box: isBox(sn), power: needsPower(sn), run: run?.type, runName: run && CABLES[run.type].name, ins: ins.length, onSnake: ins.filter(r => r.port.startsWith(sn.label)).length, over: ins.filter(r => r.flag).length, outs: outs.filter(o => o.port.startsWith(sn.label)).length, guess: guessCable(sn, plan.items.find(i => cat(i).desk)) };
});
console.log('snake', JSON.stringify(r));
console.log('warn over', await p.evaluate(() => warnings().filter(w => /in \d+|inputs|more than/.test(w.msg)).map(w => w.msg).slice(0, 3)));
console.log('pull list', await p.evaluate(() => pullList().filter(x => x.type === 'multi').map(x => `${CABLES[x.type].name} ${x.len} x${x.n}`)));
console.log('load-in', await p.evaluate(() => loadinTasks().flatMap(g => g[2]).filter(t => /Multicore/.test(t.sub || '')).map(t => t.text + ' · ' + t.sub)));
await p.evaluate(() => { view = 'paper'; paperTab = 'inputs'; renderAll(); }); await p.waitForTimeout(200);
await p.evaluate(() => { view = 'plot'; const sn = plan.items.find(i => cat(i).snake); sel = { kind: 'item', id: sn.id }; zoom = 40; renderAll(); const m = plotCTM(), q = scrPt(m, sn.x, sn.y), r = scroller.getBoundingClientRect(); scroller.scrollLeft += q.x - (r.left + r.width / 2); scroller.scrollTop += q.y - (r.top + r.height / 2); });
await p.waitForTimeout(300); await p.screenshot({ path: 't133.png' });
console.log('errors', errs); await b.close(); })();
