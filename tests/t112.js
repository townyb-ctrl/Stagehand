// lighting: named groups, mood starters, beam size
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.addInitScript({ path: __dirname + '/moodshim.js' }); const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.addInitScript(() => { try { localStorage.setItem('stageplot.detail', 'adv'); localStorage.setItem('stageplot.deskTips', '1'); } catch {} });
  await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
  await p.evaluate(() => { const w = plan.stage.w, d = plan.stage.d;
    addGear('light_desk', w / 2, d + 14); addGear('truss', w / 2, .8); addGear('foh_bar', w / 2, d + 7);
    for (const x of [.36, .46, .56, .66]) { addGear('par_led', w * x, .8); itemById(sel.id).rot = 180; }
    for (const x of [.35, .65]) { addGear('wash_led', w * x, d + 7); const i = itemById(sel.id); i.rot = 0; i.throw = fromM(6); }
    addGear('bar_up', 3, .5); sel = null; save(); renderAll(); openDesk(); });
  // groups: pick the two front washes, save as "Front wash"
  await p.evaluate(() => { deskSel = new Set(plan.items.filter(i => i.type === 'wash_led').map(i => i.id)); renderDesk(); });
  await p.click('[data-gnew]'); await p.fill('#ldGName', 'Front wash'); await p.press('#ldGName', 'Enter'); await p.waitForTimeout(150);
  console.log('group', await p.$$eval('.ld-seg.mine', e => e.map(x => x.textContent + ':' + x.getAttribute('aria-pressed'))), await p.evaluate(() => plan.lgroups.map(g => g.name + ' ' + g.ids.length)));
  await p.click('[data-dgrp="all"]'); await p.click('.ld-seg.mine'); await p.waitForTimeout(100);
  console.log('pick group', await p.evaluate(() => deskPicked().map(i => i.type).join(',')), 'delete shows', await p.isVisible('[data-gdel]'));
  // moods
  await p.click('[data-addlook]'); await p.waitForTimeout(100);
  console.log('basics', await p.$$eval('[data-basics]', e => e.map(x => x.textContent)));
  await p.evaluate(() => moodLook('Calm')); await p.waitForTimeout(150);
  console.log('calm', await p.evaluate(() => [curLook().name, deskLights().map(i => `${i.type}:${fxName(fxOf(i), i)}`).join(' ')]));
  console.log('front white', await p.evaluate(() => deskLights().filter(isFrontLight).map(i => i.type).join(',')));
  await p.click('[data-addlook]'); await p.evaluate(() => moodLook('Calm')); await p.waitForTimeout(150);
  console.log('second calm', await p.evaluate(() => plan.looks.map(l => l.name)));
  await p.click('#ldDone');
  // beam size: inspector field and the edge handle
  await p.evaluate(() => { sel = { kind: 'item', id: plan.items.find(i => i.type === 'wash_led').id }; renderAll(); });
  console.log('beam field', await p.isVisible('#iBeam'), await p.inputValue('#iBeam'), 'handle', await p.isVisible('.zoomh'), 'par has none', await p.evaluate(() => !cat(plan.items.find(i => i.type === 'par_led')).zoom));
  const h = await (await p.$('.zoomh')).boundingBox(), r0 = await p.evaluate(() => beamGeom(itemById(sel.id)).r);
  await p.mouse.move(h.x + h.width / 2, h.y + h.height / 2); await p.mouse.down(); await p.mouse.move(h.x + 400, h.y + h.height / 2, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(150);
  console.log('wider', await p.evaluate(r0 => { const i = itemById(sel.id); return [beamOf(i), beamGeom(i).r > r0]; }, r0));
  await p.fill('#iBeam', '5'); await p.press('#iBeam', 'Tab'); await p.waitForTimeout(150);
  console.log('clamped', await p.evaluate(() => beamOf(itemById(sel.id))));
  await p.evaluate(() => { view = 'paper'; paperTab = 'lighting'; sel = null; renderAll(); }); await p.waitForTimeout(200);
  console.log('sheet groups', await p.evaluate(() => [...document.querySelectorAll('.dmxh')].map(h => h.textContent)), await p.$$eval('.lookrow', e => e[0]?.textContent));
  await p.reload(); await p.waitForTimeout(600);
  console.log('after reload', await p.evaluate(() => [plan.lgroups.length, beamOf(plan.items.find(i => i.type === 'wash_led')), plan.looks.length]));
  console.log('errors', errs); await b.close(); })();
