// lights: fault notes on the details, plot, desk, list, quick menu, hover card, patch sheet and checks
const { chromium } = require(require('./app.js').pw); const FILE = process.env.APP || require('./app.js').url;
const axe = require('fs').readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
(async () => { const b = await chromium.launch(); const res = {};
  for (const theme of ['light', 'dark']) { const p = await b.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: theme }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { try { localStorage.setItem('stageplot.deskTips', '1'); localStorage.setItem('stageplot.detail', 'adv'); } catch {} });
  await p.goto(FILE); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
  await p.evaluate(() => { const w = plan.stage.w, d = plan.stage.d; addGear('light_desk', w / 2, d + 14); addGear('truss', w / 2, 3); itemById(sel.id).w = w * .8; for (let k = 0; k < 3; k++) { addGear('par_led', w * (.3 + k * .2), 3); itemById(sel.id).rot = 180; } sel = { kind: 'item', id: deskLights()[1].id }; renderAll(); });
  await p.waitForTimeout(200);
  const quiet = await p.$$eval('[data-fault]', e => e.length); await p.click('[data-faultopen]'); await p.waitForTimeout(100);
  const out = { quietFirst: quiet === 0, picks: await p.$$eval('[data-fault]', e => e.map(x => x.textContent)) };
  await p.click('[data-fault="Flickering"]'); await p.waitForTimeout(100);
  out.set = await p.evaluate(() => [deskLights()[1].fault, document.querySelector('.faultnow b')?.textContent, document.querySelectorAll('#plot .faultbadge, svg .faultbadge').length]);
  out.check = await p.evaluate(() => warnings().filter(x => /Flickering/.test(x.msg)).map(x => x.msg));
  await p.addScriptTag({ content: axe }); out.axeInsp = await p.evaluate(async () => (await axe.run(document.querySelector('.inspector'), { resultTypes: ['violations'] })).violations.map(v => v.id));
  await p.click('[data-faultclear]'); await p.waitForTimeout(100); out.cleared = await p.evaluate(() => [deskLights()[1].fault === undefined, document.querySelectorAll('.faultbadge').length]);
  await p.evaluate(() => undo()); await p.waitForTimeout(100); out.undoBack = await p.evaluate(() => deskLights()[1].fault);
  // typed problem
  await p.evaluate(() => { deskLights()[2].fault = undefined; sel = { kind: 'item', id: deskLights()[2].id }; renderAll(); }); await p.click('[data-faultopen]'); await p.fill('#iFault', 'Yoke knob missing'); await p.evaluate(() => document.getElementById('iFault')?.dispatchEvent(new Event('change', { bubbles: true }))); await p.waitForTimeout(100);
  out.typed = await p.evaluate(() => deskLights()[2].fault);
  // desk: map badge, list, quick menu
  await p.evaluate(() => { openDesk(); deskSel = new Set(); renderDesk(); document.querySelectorAll('.toast').forEach(t => t.remove()); }); await p.waitForTimeout(150);
  out.deskBadges = await p.$$eval('#ldMap .faultbadge', e => e.length);
  const box = await (await p.$$('#ldMap [data-ldfx]'))[0].boundingBox(); await p.mouse.click(box.x + box.width / 2, box.y + box.height / 2, { button: 'right' }); await p.waitForTimeout(100);
  await p.click('[data-ctxfaults]'); await p.waitForTimeout(80); out.ctxList = await p.$$eval('[data-ctxfault]', e => e.length);
  await p.click('[data-ctxfault="Not responding"]'); await p.waitForTimeout(100); out.ctxSet = await p.evaluate(() => deskLights()[0].fault);
  await p.evaluate(() => { desk.view = 'list'; renderDesk(); }); out.listIcons = await p.$$eval('.ld-fault', e => e.length);
  await p.addScriptTag({ content: axe }); out.axeDesk = await p.evaluate(async () => (await axe.run(document.querySelector('#deskDlg'), { resultTypes: ['violations'] })).violations.map(v => v.id));
  await p.evaluate(() => { desk.view = 'map'; renderDesk(); closeDesk(); });
  // patch sheet
  await p.evaluate(() => { view = 'paper'; paperTab = 'lighting'; sel = null; renderAll(); }); await p.waitForTimeout(200);
  out.sheet = await p.evaluate(() => [[...document.querySelectorAll('.lighttbl th')].map(t => t.textContent).slice(-1)[0], [...document.querySelectorAll('.faultcell')].map(t => t.textContent).filter(Boolean)]);
  out.copy = await p.evaluate(() => paperData.lighting.split('\n')[0].split('\t').slice(-1)[0]);
  await p.reload(); await p.waitForFunction(() => typeof plan !== 'undefined' && plan.items?.length > 5); await p.waitForTimeout(300); out.reload = await p.evaluate(() => plan.items.filter(i => i.fault).map(i => i.fault));
  out.errs = errs; res[theme] = out; await p.close(); }
  console.log(JSON.stringify(res, null, 1)); await b.close(); })();
