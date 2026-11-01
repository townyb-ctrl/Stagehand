// desk: resizable dock, keyboard help, slim look buttons
const { chromium } = require(require('./app.js').pw); const FILE = process.env.APP || require('./app.js').url;
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); await p.addInitScript({ path: __dirname + '/moodshim.js' });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.addInitScript(() => { try { localStorage.setItem('stageplot.deskTips', '1'); } catch {} });
  await p.goto(FILE); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
  await p.evaluate(() => { const w = plan.stage.w; addGear('light_desk', w / 2, 40); addGear('truss', w / 2, .8); for (const x of [.4, .5, .6]) addGear('par_led', w * x, .8); sel = null; renderAll(); openDesk(); moodLook('Calm'); moodLook('Celebration'); });
  // keyboard help
  await p.locator('#ldMap').hover(); await p.keyboard.press('?'); console.log('? opens', await p.isVisible('.ld-keysmenu')); await p.keyboard.press('?'); console.log('? closes', !(await p.isVisible('.ld-keysmenu')));
  // slim looks
  // dock and resize
  await p.click('[data-dock]'); await p.waitForTimeout(400);
  const h = await (await p.$('.ld-resize')).boundingBox(); const w0 = await p.evaluate(() => Math.round(document.querySelector('.ldesk').getBoundingClientRect().width));
  await p.mouse.move(h.x + 3, h.y + 300); await p.mouse.down(); await p.mouse.move(h.x - 150, h.y + 300, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(150);
  const w1 = await p.evaluate(() => [Math.round(document.querySelector('.ldesk').getBoundingClientRect().width), Math.round(document.querySelector('.work').getBoundingClientRect().width - document.querySelector('.canvas').getBoundingClientRect().right + document.querySelector('.work').getBoundingClientRect().left)]);
  console.log('resized', w0, '->', w1[0], 'plot made room', Math.abs(w1[1] - w1[0]) < 4);
  await p.mouse.move(h.x - 2000, h.y + 300); 
  await p.mouse.move(h.x - 147, h.y + 300); await p.mouse.down(); await p.mouse.move(-500, h.y + 300, { steps: 4 }); await p.mouse.up(); console.log('max', await p.evaluate(() => Math.round(document.querySelector('.ldesk').getBoundingClientRect().width)));
  await p.dblclick('.ld-resize'); await p.waitForTimeout(100); console.log('double-click resets', await p.evaluate(() => Math.round(document.querySelector('.ldesk').getBoundingClientRect().width)));
  await p.mouse.move(h.x + 3, h.y + 300); await p.mouse.down(); await p.mouse.move(h.x - 60, h.y + 300, { steps: 4 }); await p.mouse.up();
  await p.reload(); await p.waitForTimeout(600); await p.evaluate(() => { view = 'plot'; renderAll(); openDesk(); }); await p.waitForTimeout(300);
  console.log('width remembered', await p.evaluate(() => Math.round(document.querySelector('.ldesk').getBoundingClientRect().width)));
  console.log('errors', errs); await b.close(); })();
