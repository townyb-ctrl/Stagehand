// look library and big-button mode
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.addInitScript({ path: __dirname + '/moodshim.js' }); const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.addInitScript(() => { try { localStorage.setItem('stageplot.detail', 'adv'); localStorage.setItem('stageplot.deskTips', '1'); } catch {} });
  await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
  await p.evaluate(() => { const w = plan.stage.w, d = plan.stage.d;
    addGear('light_desk', w / 2, d + 14); addGear('truss', w / 2, .8); addGear('foh_bar', w / 2, d + 7);
    for (const x of [.36, .46, .56, .66]) { addGear('par_led', w * x, .8); itemById(sel.id).rot = 180; }
    for (const x of [.35, .65]) { addGear('wash_led', w * x, d + 7); const i = itemById(sel.id); i.rot = 0; i.throw = fromM(6); }
    sel = null; save(); renderAll(); openDesk(); });
  await p.click('[data-addlook]'); await p.evaluate(() => moodLook('Christmas')); await p.waitForTimeout(150);
  await p.click('[data-lookmenu]'); await p.click('[data-libsave]'); await p.waitForTimeout(100);
  console.log('saved', await p.evaluate(() => lookLib().map(e => `${e.name}:${e.lights.length}`)));
  await p.click('[data-addlook]'); await p.waitForTimeout(100);
  console.log('menu', await p.$$eval('[data-libuse]', e => e.map(x => x.textContent)));
  // a new week, stage only, different light positions: three pars on a pipe and one FOH wash
  await p.click('#ldDone');
  await p.evaluate(() => { newWeek(true); const w = plan.stage.w, d = plan.stage.d;
    for (const i of plan.items.filter(isFixture)) i.x = r2(i.x + 1.2);   // moved a little
    plan.looks = []; plan.lookId = null; save(); openDesk(); });
  console.log('new week looks', await p.evaluate(() => (plan.looks || []).length), 'library still', await p.evaluate(() => lookLib().length));
  await p.click('[data-addlook]'); await p.click('[data-libuse]'); await p.waitForTimeout(150);
  console.log('used', await p.evaluate(() => [curLook().name, deskLights().map(i => `${i.type}:${fxName(fxOf(i), i)}`).join(' ')]));
  // phone
  await p.setViewportSize({ width: 390, height: 844 }); await p.evaluate(() => { openDesk(); renderDesk(); document.querySelectorAll('.toast').forEach(t => t.remove()); }); await p.waitForTimeout(200);
  console.log('phone fits', await p.evaluate(() => { const d = document.querySelector('.ldesk'); return d.scrollWidth <= d.clientWidth + 1; }));
  await p.screenshot({ path: 'lt13.png' });
  await p.reload(); await p.waitForTimeout(600); console.log('library after reload', await p.evaluate(() => lookLib().length));
  console.log('errors', errs); await b.close(); })();
