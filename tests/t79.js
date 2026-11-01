// every cable can be picked with the mouse, even in bunched runs (click again cycles); instruments keep their colour in Calm
const { chromium } = require(require('./app.js').pw);
const file = process.argv[2] || 'index.html';
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').root + file); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
await p.evaluate(() => { try { localStorage.setItem('stageplot.foldHint', '1'); } catch {} fit('stage'); sel = null; renderAll(); document.querySelectorAll('.toast').forEach(t => t.remove()); });
const targets = await p.evaluate(() => { const out = []; const m = svg.getScreenCTM(), sr = $('scroller').getBoundingClientRect();
  for (const h of svg.querySelectorAll('.cabhit')) { const q = h.getAttribute('points').split(' ').map(t => t.split(',').map(Number));
    // walk along the run and take the first spot where this cable is what the pointer lands on (visible, not under gear)
    let hit = null;
    for (let i = 1; i < q.length && !hit; i++) for (let k = 1; k < 10 && !hit; k++) { const x = q[i - 1][0] + (q[i][0] - q[i - 1][0]) * k / 10, y = q[i - 1][1] + (q[i][1] - q[i - 1][1]) * k / 10, sx = x * m.a + m.e, sy = y * m.d + m.f;
      if (sx < sr.left + 40 || sx > sr.right - 40 || sy < sr.top + 60 || sy > sr.bottom - 90) continue;
      const e = document.elementFromPoint(sx, sy); if (e?.closest?.('[data-cid]')) hit = { id: h.dataset.cid, sx, sy }; }
    if (hit) out.push(hit); }
  const seen = new Set(); return out.filter(t => !seen.has(t.id) && seen.add(t.id)); });
const all = await p.evaluate(() => new Set([...svg.querySelectorAll('.cabhit')].map(h => h.dataset.cid)).size);
let ok = 0, tries = 0; const missed = [];
for (const t of targets) {
  await p.evaluate(() => { sel = null; renderPlot(); });
  let got = false;
  const seq = []; for (let k = 0; k < 6 && !got; k++) { await p.mouse.click(t.sx, t.sy); tries++; got = await p.evaluate(id => sel?.kind === 'cable' && sel.id === id, t.id); seq.push(await p.evaluate(() => sel ? sel.kind + ':' + (sel.kind === 'cable' ? (c => `${itemName(itemById(c.from))}>${itemName(itemById(c.to))}`)(plan.cables.find(x => x.id === sel.id)) : sel.id) : '-')); }
  t.seq = seq.join(' | ') + ' want ' + (await p.evaluate(id => (c => `${itemName(itemById(c.from))}>${itemName(itemById(c.to))} ${c.type}`)(plan.cables.find(x => x.id === id)), t.id));
  if (got) ok++; else missed.push(t.seq + ' ' + await p.evaluate(t => { const e = document.elementFromPoint(t.sx, t.sy); return (e?.tagName || '') + '.' + String(e?.className?.baseVal ?? e?.className ?? '').slice(0, 30) + ' near=' + (typeof cablesAt === 'function' ? cablesAt(toFt({ clientX: t.sx, clientY: t.sy })).join('/') : '?') + ' sel=' + (sel?.kind || '-') + ':' + (sel?.id || ''); }, t));
}
const cyc = await p.evaluate(() => typeof cablesAt === 'function');
console.log(file, 'cables', all, 'visible', targets.length, 'pickable', ok, 'clicks', tries);
if (cyc) console.log('inst colour', await p.evaluate(() => { const i = document.querySelector('#plot .item.is-inst'); return !!i && getComputedStyle(i).filter === 'none'; }));
console.log(missed.join('\n')); console.log('errors', errs); await b.close(); })();
