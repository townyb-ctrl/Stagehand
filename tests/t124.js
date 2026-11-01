// looks: notes on the desk, big buttons, plot look menu, lighting sheet and library
const { chromium } = require(require('./app.js').pw); const FILE = process.env.APP || require('./app.js').url;
const axe = require('fs').readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
(async () => { const b = await chromium.launch(); const res = {};
  for (const theme of ['light', 'dark']) { const p = await b.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: theme }); await p.addInitScript({ path: __dirname + '/moodshim.js' }); const errs = []; p.on('pageerror', e => errs.push(e.message)); const out = {};
  await p.addInitScript(() => { try { localStorage.setItem('stageplot.deskTips', '1'); } catch {} });
  await p.goto(FILE); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
  await p.evaluate(() => { const w = plan.stage.w, d = plan.stage.d; addGear('light_desk', w / 2, d + 14); addGear('truss', w / 2, 3); itemById(sel.id).w = w * .8; for (let k = 0; k < 3; k++) { addGear('par_led', w * (.3 + k * .2), 3); itemById(sel.id).rot = 180; } sel = null; save(); openDesk(); moodLook('Calm'); moodLook('Celebration'); renderDesk(); document.querySelectorAll('.toast').forEach(t => t.remove()); });
  const h0 = await p.evaluate(() => history.length);
  await p.fill('#ldLookNote', 'Band kicks in at the chorus'); await p.press('#ldLookNote', 'Tab'); await p.waitForTimeout(100);
  out.saved = await p.evaluate(h => [curLook().name, curLook().note, history.length - h], h0);
  out.dot = await p.$$eval('.ld-look .ld-notedot', e => e.length); out.tip = await p.$eval('.ld-look[aria-pressed="true"]', e => e.title);
  await p.addScriptTag({ content: axe }); out.axeDesk = await p.evaluate(async () => (await axe.run(document.querySelector('#deskDlg'), { resultTypes: ['violations'] })).violations.map(v => v.id));
  await p.screenshot({ path: `lt42-${theme}.png`, clip: { x: 860, y: 110, width: 460, height: 260 } });
  await p.evaluate(() => { desk.big = true; renderDesk(); }); await p.waitForTimeout(100); out.big = await p.$$eval('.ld-bignote', e => e.map(x => x.textContent));
  await p.screenshot({ path: `lt43-${theme}.png` });
  await p.evaluate(() => { desk.big = false; closeDesk(); }); await p.click('#lookPick'); await p.waitForTimeout(100); out.pill = await p.$$eval('.lp-name small', e => e.map(x => x.textContent));
  await p.evaluate(() => { lookPickOpen = false; view = 'paper'; paperTab = 'lighting'; renderAll(); }); await p.waitForTimeout(200); out.sheet = await p.$$eval('.looknote', e => e.map(x => x.textContent));
  await p.evaluate(() => { view = 'plot'; renderAll(); openDesk(); libSave(); }); out.lib = await p.evaluate(() => lookLib().map(e => e.note));
  // clearing
  await p.fill('#ldLookNote', ''); await p.press('#ldLookNote', 'Tab'); await p.waitForTimeout(100); out.cleared = await p.evaluate(() => 'note' in curLook());
  out.errs = errs; res[theme] = out; await p.close(); }
  console.log(JSON.stringify(res)); await b.close(); })();
