// lighting UX: look switcher on the plot, house lights off, list view, map zoom, own presets, first-time tips, picked chips
const { chromium } = require(require('./app.js').pw); const FILE = process.env.APP || require('./app.js').url;
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); await p.addInitScript({ path: __dirname + '/moodshim.js' });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const colour = n => p.evaluate(n => { const c = DESK_PRESETS.find(x => x[0] === n)[1], ts = deskPicked(); if (ts.length) deskSet({ ...c, d: fxOf(ts[0]).d || 100 }); }, n);
  await p.goto(FILE); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
  await p.evaluate(() => { const w = plan.stage.w, d = plan.stage.d;
    addGear('light_desk', w / 2, d + 14); addGear('truss', w / 2, .8); addGear('foh_bar', w / 2, d + 7);
    for (const x of [.36, .46, .56, .66]) { addGear('par_led', w * x, .8); itemById(sel.id).rot = 180; }
    for (const x of [.35, .65]) { addGear('wash_led', w * x, d + 7); const i = itemById(sel.id); i.rot = 0; i.throw = fromM(6); }
    sel = null; save(); renderAll(); });
  // look switcher on the plot
  console.log('pill', await p.isVisible('.lookpill'), (await p.textContent('.lp-txt')).trim());
  await p.evaluate(() => { moodLook('Calm'); moodLook('Celebration'); closeDesk(); });
  await p.click('#lookPick'); await p.waitForTimeout(100);
  console.log('menu', await p.$$eval('[data-lplook]', e => e.map(x => x.textContent.trim())), await p.isVisible('[data-lpdesk]'));
  await p.click('[data-lplook]'); await p.waitForTimeout(120);
  console.log('switched', await p.evaluate(() => curLook().name), 'fade', await p.evaluate(() => document.querySelectorAll('.lb-fadeout').length > 0), 'menu closed', !(await p.isVisible('.lp-menu')));
  // house lights off
  await p.click('#houseOff'); await p.waitForTimeout(100);
  console.log('house off', await p.evaluate(() => [!!document.querySelector('.ov-houseoff'), !!document.querySelector('.ov-glow .lb'), overOn('dark')]), await p.getAttribute('#houseOff', 'aria-pressed'));
  console.log('paper has none', await p.evaluate(() => !/ov-houseoff/.test(plotSnapshot())));
  await p.click('#houseOff'); await p.waitForTimeout(100); console.log('house on', await p.evaluate(() => !document.querySelector('.ov-houseoff')));
  // first-time tips
  await p.click('#lookPick'); await p.click('[data-lpdesk]'); await p.waitForTimeout(150);
  console.log('tips', await p.isVisible('.ld-tipcard'), (await p.textContent('.ld-tipcard b')).trim(), await p.evaluate(() => document.querySelector('.ld-coach')?.id));
  await p.click('[data-tip="next"]'); console.log('tip 2', (await p.textContent('.ld-tipcard b')).trim(), await p.evaluate(() => document.querySelector('.ld-coach')?.id));
  await p.click('[data-tip="next"]'); console.log('tip 3', (await p.textContent('.ld-tipcard b')).trim(), await p.evaluate(() => document.querySelector('.ld-coach')?.matches('[data-addlook]')));
  await p.click('[data-tip="done"]'); console.log('tips gone', !(await p.isVisible('.ld-tipcard')));
  await p.evaluate(() => { closeDesk(); openDesk(); }); console.log('not again', !(await p.isVisible('.ld-tipcard')));
  // picked chips
  await p.evaluate(() => { deskSel = new Set(plan.items.filter(i => i.type === 'par_led').map(i => i.id)); renderDesk(); });
  console.log('chips', await p.$$eval('.ld-chip', e => e.map(x => x.textContent.trim())));
  await p.click('[data-unpick]'); await p.waitForTimeout(80); console.log('unpicked', await p.evaluate(() => deskPicked().length), await p.$$eval('.ld-chip', e => e.length));
  await p.click('[data-dgrp="all"]'); console.log('all line', (await p.textContent('.ld-tip')).trim().slice(0, 30));
  // zoom and pan
  const vb0 = await p.getAttribute('#ldMap', 'viewBox'); const mb = await (await p.$('#ldMap')).boundingBox();
  await p.mouse.move(mb.x + mb.width / 2, mb.y + mb.height / 3); await p.keyboard.down('Control'); await p.mouse.wheel(0, -400); await p.keyboard.up('Control'); await p.waitForTimeout(100);
  const vb1 = await p.getAttribute('#ldMap', 'viewBox');
  console.log('zoomed', vb0 !== vb1, +vb1.split(' ')[2] < +vb0.split(' ')[2], 'fit shown', await p.isVisible('#ldFit'));
  await p.mouse.wheel(0, 120); await p.waitForTimeout(80); const vb2 = await p.getAttribute('#ldMap', 'viewBox');
  console.log('panned', vb2.split(' ')[1] !== vb1.split(' ')[1], vb2.split(' ')[2] === vb1.split(' ')[2]);
  await p.click('#ldFit'); console.log('fit', await p.getAttribute('#ldMap', 'viewBox') === vb0, !(await p.isVisible('#ldFit')));
  // recent colours and Off (the colour buttons are gone)
  await colour('Red'); await p.waitForTimeout(80);
  console.log('no presets', await p.$$eval('#ldColour .pswatch', e => e.length), 'recent', await p.$$eval('.ld-rsw', e => e.length));
  await p.click('.ld-rsw'); await p.waitForTimeout(80); console.log('recent applies', await p.evaluate(() => fxName(fxOf(deskPicked()[0]), deskPicked()[0])));
  await p.click('.ld-offbtn'); await p.waitForTimeout(80); console.log('off', await p.evaluate(() => deskPicked().map(i => fxOf(i).d).join(',')));
  console.log('errors', errs); await b.close(); })();
