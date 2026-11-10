// team role marks, concrete surface, names stepping aside
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(300);
await p.evaluate(() => { railTab = 'team'; renderAll(); });
const marks = await p.evaluate(() => [...document.querySelectorAll('.person .rolemark')].map(m => m.title));
console.log('role marks', marks.join(','));
await p.evaluate(() => { sel = null; mutate(() => { plan.stage.texture = 'concrete'; }); renderAll(); });
console.log('concrete', await p.evaluate(() => !!document.querySelector('#plot .deck-tex.t-concrete') && !!document.querySelector('#plot .deck-tex.t-joints')));
console.log('tiles', await p.evaluate(() => { railTab = 'room'; renderAll(); return document.querySelectorAll('.textile').length; }));
// a crowded name: put gear right under a person, their name must not land on it
const r = await p.evaluate(() => { const pr = plan.items.find(i => cat(i).shape === 'person'); const g = plan.items.find(i => cat(i).shape !== 'person' && cat(i).shape !== 'platform' && i.id !== pr.id && Math.max(prop(i, 'w'), prop(i, 'd')) < 1.6);
  let g2; mutate(() => { g.x = pr.x; g.y = pr.y + 1.6; g2 = plan.items.find(i => i !== g && i !== pr && cat(i).shape !== 'person' && cat(i).shape !== 'platform' && Math.max(prop(i, 'w'), prop(i, 'd')) < 1.6); g2.x = pr.x; g2.y = pr.y - 1.6; }); zoom = 40; renderAll();
  const nm = [...document.querySelectorAll('#plot .itag.pname')].find(t => t.textContent === firstName(personById(pr.personId).name)).querySelector('rect').getBoundingClientRect();
  const hits = [g, g2].filter(x => { const b = document.querySelector(`#plot .item[data-id="${x.id}"] .hit, #plot .item[data-id="${x.id}"]`).getBoundingClientRect(); return nm.left < b.right && nm.right > b.left && nm.top < b.bottom && nm.bottom > b.top; }).length;
  return hits; });
console.log('crowded name clear of gear', r === 0);
console.log('errors', errs); await b.close(); })();
