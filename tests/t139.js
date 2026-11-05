// the physical patch follows the desk: channel N on its stage box's input N (box B's block after box A's), mix N out of output N, mains together, unused IEM rack channels spare; anything that can't line up is marked for a soft patch
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1300, height: 760 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
console.log(JSON.stringify(await p.evaluate(() => {
  const chk = () => { const ins = inputList(), outs = outputList();
    const bad = ins.filter(r => /^Stage box · in (\d+)$/.test(r.port) && Number(r.port.match(/(\d+)$/)[1]) !== r.ch && !r.soft);
    return { inputs: ins.map(r => `${r.ch}→${shortPort(r.port)}${r.snake ? '(' + shortPort(r.snake) + ')' : ''}${r.soft ? '*' : ''}`).join(' '), mismatched: bad.length,
      outputs: outs.map(o => `${o.mix ? 'Mix' + o.mix : o.dest}→${shortPort(o.port)}${o.soft ? '*' : ''}`).join(' ') }; };
  const a = chk();
  // a snake with a choir, into the same box
  const sn = addItem('snake12', 4, 2); for (const k of [1, 2, 3]) addCable('xlr', addItem('vox_mic', 3 + k, 4).id, sn.id, {}); addCable('multi', sn.id, plan.items.find(i => i.type === 'stagebox').id, {});
  const b2 = chk();
  // a second stage box: its block starts at 33
  const sb2 = addItem('stagebox', 25, 2); sb2.label = 'Stage box B'; plan.items.find(i => i.type === 'stagebox').label = 'Stage box A'; addCable('cat6', sb2.id, plan.items.find(i => cat(i).desk).id, {});
  addCable('xlr', addItem('vox_mic', 26, 4).id, sb2.id, {});
  const c = chk();
  return { sample: a, withSnake: b2, twoBoxes: c };
}), null, 1)); console.log('errors', errs); await b.close(); })();
