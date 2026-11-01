// the ten visuals: whose gear, lighting wash, sightlines, coverage, walkways, side view, textures, trace, before/after, presentation
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const errs = []; const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); await p.addInitScript(() => { try { localStorage.setItem('stageplot.detail', 'adv'); } catch {} }); p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(300);
await p.evaluate(() => document.querySelector('.toast')?.remove());
console.log('types', await p.evaluate(() => [...new Set(plan.items.map(i => i.type))].join(',')));
// extra gear so every view has something to show
await p.evaluate(() => { const W = plan.stage.w, D = plan.stage.d;
  if (!plan.items.some(i => i.type === 'main_spk')) { addGear('main_spk', -1.5, D - 1); addGear('main_spk', W + 1.5, D - 1); }
  addGear('light_stand', 2, D + 3); addGear('light_stand', W - 2, D + 3);
  if (!plan.items.some(i => i.type === 'foh')) addGear('foh', W / 2, D + plan.stage.house - 3);
  sel = null; renderAll(); });
// layers menu: views section
await p.click('#cabBtn'); console.log('views rows', await p.evaluate(() => [...document.querySelectorAll('[data-over]')].map(b => b.dataset.over).join(',')), 'side toggle', !!(await p.$('#sideBtn')));
for (const k of ['owners', 'sight']) await p.click(`[data-over="${k}"]`);
console.log('overlay counts', await p.evaluate(() => ({ owner: document.querySelectorAll('.ov-own').length, wash: document.querySelectorAll('.lb-pool').length, shadow: document.querySelectorAll('.ov-shadow').length, heat: document.querySelectorAll('.ov-heat rect').length, hidden: document.querySelectorAll('.ov-hidden').length })));
await p.click('#cabBtn'); await p.waitForTimeout(150); await p.screenshot({ path: 't51-overlays.png' });
console.log('persisted', await p.evaluate(() => JSON.parse(localStorage.getItem('stageplot.cables')).over));
console.log('paper has no overlays', await p.evaluate(() => !/ov-(wash|heat|own|shadow)/.test(plotSnapshot())));
await p.evaluate(() => setCableView(() => cableView.over.clear()));
// walkway
const ww = await p.evaluate(() => { const W = plan.stage.w, D = plan.stage.d; addGear('walkway', W / 2, D - 2); const w = itemById(sel.id); const before = warnings().filter(x => x.id === w.id).length;
  const a = plan.items.find(i => i.type === 'person'); plan.cables.push({ id: uid(), type: 'power', from: plan.items.find(i => i.type === 'distro')?.id || a.id, to: plan.items.filter(i => i.type === 'wedge').pop()?.id || a.id, points: [[W / 2 - 3, D - 2], [W / 2 + 3, D - 2]] }); renderAll();
  return [CAT.walkway.name, before, warnings().filter(x => x.id === w.id).map(x => x.msg)[0], !!document.querySelector('.s-walk')]; });
console.log('walkway', ww);
// textures
for (const t of ['boards', 'carpet', '']) { await p.evaluate(() => { sel = null; inspOpen = true; applyPanels(false); renderAll(); }); await p.click(`[data-decktex="${t}"]`); await p.waitForTimeout(80);
  console.log('tex', t || 'plain', await p.evaluate(() => [plan.stage.texture || '', document.querySelectorAll('.deck-tex').length])); if (t === 'boards') await p.screenshot({ path: 't51-boards.png' }); }
await p.evaluate(() => { plan.stage.texture = 'carpet'; renderAll(); }); await p.screenshot({ path: 't51-carpet.png' }); await p.evaluate(() => { delete plan.stage.texture; renderAll(); });
// trace
const gtr = await p.evaluate(() => { const g = plan.items.find(i => i.type === 'el_guitar') || plan.items.find(i => i.type === 'vox_mic'); sel = { kind: 'item', id: g.id }; inspOpen = true; applyPanels(false); renderAll(); return g.type; });
await p.click('#iTrace'); await p.waitForTimeout(200);
console.log('trace', gtr, await p.evaluate(() => ({ pulses: document.querySelectorAll('.tracepulse').length, intrace: document.querySelectorAll('.item.intrace').length, tracing: document.getElementById('plot').classList.contains('tracing'), toast: document.querySelector('.toast')?.textContent })));
await p.screenshot({ path: 't51-trace.png' });
await p.keyboard.press('Escape'); console.log('trace ends on Esc', await p.evaluate(() => document.getElementById('plot').classList.contains('tracing')));
// side view
await p.evaluate(() => document.activeElement.blur()); await p.keyboard.press('e'); await p.waitForTimeout(150);
console.log('side', await p.evaluate(() => [!$('fside').hidden, document.querySelectorAll('.sideview .sv-person').length, document.querySelectorAll('.sideview .sv-mic').length, document.querySelectorAll('.sideview .sv-riser').length]));
await p.screenshot({ path: 't51-side.png' }); await p.click('#sideClose'); console.log('side closed', await p.evaluate(() => $('fside').hidden));
// before / after
await p.evaluate(() => { newWeek(false); const it = plan.items.find(i => i.type === 'gtr_amp') || plan.items.find(i => cat(i).shape !== 'person'); it.x += 4; save(); toggleCompare(true); });
await p.waitForTimeout(200);
console.log('before', await p.evaluate(() => ({ view: document.querySelectorAll('.beforeview .item').length, dupIds: (() => { const ids = [...document.querySelectorAll('#plot [id]')].map(e => e.id); return ids.length - new Set(ids).size; })(), slider: !!$('cmpSplit'), oldDataIds: document.querySelectorAll('.beforeview [data-id]').length, vb: svg.getAttribute('viewBox') })));
await p.$eval('#cmpSplit', el => { el.value = 75; el.dispatchEvent(new Event('input', { bubbles: true })); });
console.log('split width', await p.evaluate(() => [cmpSplit, document.getElementById('beforeRect').getAttribute('width')]));
await p.screenshot({ path: 't51-before.png' });
await p.evaluate(() => toggleCompare(false));
// presentation
await p.keyboard.press('f'); await p.waitForTimeout(400);
console.log('present', await p.evaluate(() => ({ on: document.body.classList.contains('presenting'), title: $('fpresent').textContent.trim().slice(0, 60), header: getComputedStyle(document.querySelector('body > header')).display, lab: svg.style.getPropertyValue('--lab') })));
await p.screenshot({ path: 't51-present.png' });
await p.keyboard.press('Escape'); await p.waitForTimeout(200); console.log('present off', await p.evaluate(() => document.body.classList.contains('presenting')));
// phone
await p.setViewportSize({ width: 390, height: 844 }); await p.evaluate(() => { toggleSide(true); }); await p.waitForTimeout(200);
console.log('phone overflow', await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)); await p.screenshot({ path: 't51-phone-side.png' });
await p.evaluate(() => toggleSide(false));
console.log('errors', errs); await b.close(); })();
