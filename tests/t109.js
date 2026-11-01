// lighting desk window, and light stopping at the walls
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.addInitScript(() => { try { localStorage.setItem('stageplot.detail', 'adv'); localStorage.setItem('stageplot.deskTips', '1'); } catch {} });
  const colour = n => p.evaluate(n => { const c = DESK_PRESETS.find(x => x[0] === n)[1], ts = deskPicked(); if (ts.length) deskSet({ ...c, d: fxOf(ts[0]).d || 100 }); }, n);
  await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
  await p.evaluate(() => { const w = plan.stage.w, d = plan.stage.d;
    addGear('light_desk', w / 2, d + 12); addGear('truss', w / 2, 2);
    for (const x of [.38, .44, .5, .56, .62]) addGear('par_led', w * x, 2);
    addGear('bar_up', 3, .8); addGear('bar_up', w - 3, .8); addGear('profile', 4, d - 2);
    for (const it of plan.items.filter(i => i.type === 'par_led')) it.rot = 180;
    for (const it of plan.items.filter(i => i.type === 'bar_up')) { it.rot = 0; it.throw = fromM(4); }   // aimed past the back wall
    save(); renderAll(); });
  // walls
  console.log('walls', await p.evaluate(() => { const R = roomRect(), bar = plan.items.find(i => i.type === 'bar_up'), [ux, uy] = aimOf(bar, -1);
    return { wallY: R.y0, stopsAt: +(bar.y + uy * Math.min(throwOf(bar), wallDist(bar.x, bar.y, ux, uy))).toFixed(2), clip: !!document.querySelector('.beams g[clip-path]'), wall: !!document.querySelector('.room-wall') }; }));
  // open from the console
  await p.evaluate(() => { sel = { kind: 'item', id: plan.items.find(i => i.type === 'light_desk').id }; renderAll(); });
  console.log('launcher', await p.isVisible('[data-opendesk]'), 'no inline faders', !(await p.$('#inspector [data-fx]')));
  await p.click('#inspector [data-opendesk]'); await p.waitForTimeout(200);
  console.log('open', await p.isVisible('#deskDlg'), 'lights on map', await p.$$eval('[data-ldfx]', e => e.length), 'groups', await p.$$eval('[data-dgrp]', e => e.map(x => x.textContent)), 'off button', await p.$$eval('.ld-offbtn', e => e.length));
  await colour('Blue'); await p.waitForTimeout(150);
  console.log('all blue', await p.evaluate(() => [curLook()?.name, deskLights().map(i => fxName(fxOf(i), i)).join(',')]));
  // click one par on the map, then shift-click a second
  const dots = await p.$$('[data-ldfx]');
  await dots[0].click(); await p.waitForTimeout(100); await (await p.$$('[data-ldfx]'))[1].click({ modifiers: ['Shift'] }); await p.waitForTimeout(100);
  console.log('picked', await p.evaluate(() => deskPicked().map(itemName)), (await p.textContent('.ld-pickinfo b')).trim());
  // the wheel: click its right edge (red) and its centre-left (cyan-ish)
  const wb = await (await p.$('#ldWheel')).boundingBox();
  await p.mouse.click(wb.x + wb.width - 3, wb.y + wb.height / 2); await p.waitForTimeout(150);
  console.log('wheel red', await p.evaluate(() => fxName(fxOf(deskPicked()[0]))), 'others', await p.evaluate(() => fxName(fxOf(deskLights()[2]))));
  // drag-select the truss area on the map
  const mb = await (await p.$('#ldMap')).boundingBox();
  const pt = await p.evaluate(() => { const m = $('ldMap').getScreenCTM(), t = plan.items.find(i => i.type === 'truss'); return [[t.x - 7, t.y - 2], [t.x + 7, t.y + 2]].map(([x, y]) => [m.a * x + m.e, m.d * y + m.f]); });
  await p.mouse.move(pt[0][0], pt[0][1]); await p.mouse.down(); await p.mouse.move(pt[1][0], pt[1][1], { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(150);
  console.log('box picked', await p.evaluate(() => deskPicked().map(i => i.type).join(',')));
  // the dimmer fader: one undo step
  const h0 = await p.evaluate(() => history.length);
  await p.$eval('#ldColour [data-fx="d"]', el => { for (const v of [80, 60, 40]) { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); } el.dispatchEvent(new Event('change', { bubbles: true })); });
  await p.waitForTimeout(150);
  console.log('dim', await p.evaluate(() => deskPicked().map(i => fxOf(i).d).join(',')), 'undo +', await p.evaluate(h => history.length - h, h0), 'plot beam', await p.evaluate(() => document.querySelector('#plot .lb-cone, svg .lb-cone') ? true : false));
  // looks
  await p.click('[data-addlook]'); await p.click('[data-looknew]'); await p.waitForTimeout(150); await p.fill('#ldLookName', 'Preaching'); await p.press('#ldLookName', 'Enter'); await p.waitForTimeout(150);
  await p.click('[data-dgrp="all"]'); await colour('Warm white'); await p.waitForTimeout(150);
  console.log('tabs', await p.$$eval('.ld-look[data-look]', e => e.map(x => x.textContent + (x.getAttribute('aria-pressed') === 'true' ? '*' : ''))));
  await p.click('.ld-look[data-look]'); await p.waitForTimeout(120);
  console.log('fading', await p.evaluate(() => [document.querySelectorAll('.lb-fadeout').length, document.querySelectorAll('.lb-fadein').length, !!document.querySelector('#ldMap .lb-fadeout')]));
  await p.waitForTimeout(800); await p.evaluate(() => { renderPlot(); renderDesk(); });
  console.log('faded', await p.evaluate(() => document.querySelectorAll('.lb-fadeout').length));
  console.log('back to look 1', await p.evaluate(() => [curLook().name, fxName(fxOf(plan.items.find(i => i.type === 'par_led')))]));
  // white-only light: colour off-limits
  await p.evaluate(() => { deskSel = new Set(); renderDesk(); }); await p.evaluate(() => { deskSel = new Set([plan.items.find(i => i.type === 'profile').id]); renderDesk(); });
  console.log('profile', await p.$eval('#ldWheel', e => e.classList.contains('off')), await p.$eval('#ldColour [data-fx="r"]', e => e.disabled), await p.$eval('#ldColour [data-fx="d"]', e => e.disabled));
  // Esc closes; the inspector of a single light opens the desk with it picked
  await p.keyboard.press('Escape'); await p.waitForTimeout(150);
  console.log('closed', await p.isHidden('#deskDlg'));
  await p.evaluate(() => { sel = { kind: 'item', id: plan.items.find(i => i.type === 'bar_up').id }; renderAll(); });
  await p.click('#inspector [data-opendesk]'); await p.waitForTimeout(150);
  console.log('one light', await p.evaluate(() => deskPicked().map(itemName)));
  await p.click('#ldDone'); 
  await p.evaluate(() => { view = 'paper'; paperTab = 'lighting'; sel = null; renderAll(); }); await p.waitForTimeout(200);
  console.log('sheet looks', await p.$$eval('.lookrow', e => e.map(x => x.textContent.slice(0, 50))));
  await p.reload(); await p.waitForTimeout(600);
  console.log('after reload', await p.evaluate(() => [plan.looks.length, curLook().name]));
  console.log('errors', errs); await b.close(); })();
