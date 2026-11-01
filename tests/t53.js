// whose gear: people, instruments and other gear never share a blob
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const errs = []; const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(300);
await p.evaluate(() => { document.querySelector('.toast')?.remove(); ownersOnAt = -1e9; setCableView(() => cableView.over.add('owners')); });
const r = await p.evaluate(() => {
  const bad = [];
  for (const k of ownerNecks.keys()) { const [a, c] = k.split('|').map(itemById); const kind = i => cat(i).shape === 'person' ? 'person' : GEAR_GROUPS[0][1].includes(i.type) ? 'inst' : 'gear'; if (kind(a) !== kind(c)) bad.push(`${itemName(a)} ↔ ${itemName(c)}`); }
  return { groups: [...document.querySelectorAll('.ov-own')].map(g => `${personById(g.dataset.owner)?.name.split(' ')[0]}:${g.dataset.kind}:${g.querySelectorAll(':scope > g').length}`), necks: ownerNecks.size, crossKind: bad, people: [...ownerNecks.keys()].some(k => k.split('|').some(id => cat(itemById(id)).shape === 'person')), rings: document.querySelectorAll('.ov-own-ring').length };
});
console.log(JSON.stringify(r));
await p.screenshot({ path: 't53-owners.png', clip: { x: 400, y: 130, width: 640, height: 400 } });
console.log('errors', errs); await b.close(); })();
