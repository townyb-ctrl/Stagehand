// desk UX: undo/redo, master, peek, find/flash, right-click menu, recent + colour code, reorder, look thumbnails
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.addInitScript({ path: __dirname + '/moodshim.js' }); const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.addInitScript(() => { try { localStorage.setItem('stageplot.detail', 'adv'); localStorage.setItem('stageplot.deskTips', '1'); } catch {} });
  const colour = n => p.evaluate(n => { const c = DESK_PRESETS.find(x => x[0] === n)[1], ts = deskPicked(); if (ts.length) deskSet({ ...c, d: fxOf(ts[0]).d || 100 }); }, n);
  await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
  await p.evaluate(() => { const w = plan.stage.w, d = plan.stage.d;
    addGear('light_desk', w / 2, d + 14); addGear('truss', w / 2, .8); addGear('foh_bar', w / 2, d + 7);
    for (const x of [.36, .46, .56, .66]) { addGear('par_led', w * x, .8); itemById(sel.id).rot = 180; }
    for (const x of [.35, .65]) { addGear('wash_led', w * x, d + 7); const i = itemById(sel.id); i.rot = 0; i.throw = fromM(6); }
    sel = null; save(); renderAll(); openDesk(); });
  const par = () => p.evaluate(() => fxName(fxOf(plan.items.find(i => i.type === 'par_led'))));
  // undo / redo inside the desk
  await colour('Red'); await p.waitForTimeout(100);
  console.log('red', await par(), 'undo enabled', await p.$eval('#ldUndo', e => !e.disabled));
  await p.click('#ldUndo'); await p.waitForTimeout(100); console.log('undone', await par());
  await p.keyboard.press('Control+Shift+Z'); await p.waitForTimeout(100); console.log('redone', await par());
  await p.keyboard.press('Control+z'); await p.waitForTimeout(100); console.log('ctrl z', await par());
  await colour('Blue'); await p.waitForTimeout(100);
  // master
  await p.$eval('[data-master]', el => { for (const v of [70, 40]) { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); } el.dispatchEvent(new Event('change', { bubbles: true })); });
  await p.waitForTimeout(100);
  console.log('master', await p.evaluate(() => [lookMaster(curLook()), fxOf(plan.items.find(i => i.type === 'par_led')).d, fxEff(plan.items.find(i => i.type === 'par_led'), curLook()).d]));
  // second look, then peek at the first with Space
  await p.click('[data-addlook]'); await p.evaluate(() => moodLook('Celebration')); await p.waitForTimeout(150);
  console.log('now', await p.evaluate(() => curLook().name), 'peek', true);
  await p.locator('#ldMap').hover(); await p.keyboard.down(' '); await p.waitForTimeout(120);
  console.log('peeking', await p.evaluate(() => [curLook().name, !!document.querySelector('.ld-peekpill')]), await par());
  await colour('Green'); console.log('no edits while peeking', await par());
  await p.keyboard.up(' '); await p.waitForTimeout(120); console.log('back', await p.evaluate(() => [curLook().name, !!document.querySelector('.ld-peekpill')]));
  // flash and hover
  await p.click('[data-dgrp="all"]'); await p.click('[data-flash]'); await p.waitForTimeout(80);
  console.log('flash', await p.evaluate(() => [document.querySelectorAll('#ldMap .lb.flash').length, document.querySelectorAll('svg .lb.flash').length > document.querySelectorAll('#ldMap .lb.flash').length]));
  await p.waitForTimeout(1800); console.log('flash ends', await p.evaluate(() => document.querySelectorAll('.lb.flash').length));
  await p.hover('[data-ldfx]'); await p.waitForTimeout(80); console.log('hover', await p.evaluate(() => [$('ldMap').classList.contains('hl'), document.querySelectorAll('#ldMap .lb.hl').length]));
  // right-click menu
  await p.click('[data-ldfx]', { button: 'right' }); await p.waitForTimeout(100);
  console.log('ctx', await p.isVisible('.ld-ctx'), await p.$$eval('.ld-ctx > button', e => e.map(x => x.textContent)));
  await p.click('.ld-ctx [data-ctxpre="Amber"]'); await p.waitForTimeout(100);
  console.log('ctx amber', await p.evaluate(() => deskLights().filter(i => fxName(fxOf(i), i).startsWith('Amber')).length), 'closed', !(await p.isVisible('.ld-ctx')));
  await p.click('[data-ldfx]', { button: 'right' }); await p.click('[data-ctxtype]'); await p.waitForTimeout(80);
  console.log('every par', await p.evaluate(() => deskPicked().map(i => i.type).join(',')));
  // recent colours and colour code
  console.log('recent', await p.$$eval('.ld-rsw', e => e.map(x => x.title)));
  await p.fill('#ldHex', '#1f6bff'); await p.press('#ldHex', 'Enter'); await p.waitForTimeout(100);
  console.log('hex', await par(), await p.inputValue('#ldHex'));
  await p.click('.ld-rsw[data-recent="1"]'); await p.waitForTimeout(100); console.log('recent applied', await par());
  // reorder looks: Alt+Left moves the open look, thumbnails show
  console.log('order', await p.evaluate(() => plan.looks.map(l => l.name)));
  await p.keyboard.press('Alt+ArrowLeft'); await p.waitForTimeout(100); console.log('moved', await p.evaluate(() => plan.looks.map(l => l.name)), await p.$eval('.ld-look[aria-pressed="true"] .ld-cueno', e => e.textContent));
  // drag reorder
  await p.locator('.ld-look[data-look]').nth(0).dragTo(p.locator('.ld-look[data-look]').nth(1)); await p.waitForTimeout(150);
  console.log('dragged', await p.evaluate(() => plan.looks.map(l => l.name)));
  await p.keyboard.press('Escape');
  await p.evaluate(() => { view = 'paper'; paperTab = 'lighting'; renderAll(); }); await p.waitForTimeout(150);
  console.log('sheet master', await p.$$eval('.lookrow b', e => e.map(x => x.textContent)));
  console.log('errors', errs); await b.close(); })();
