// desk: ready-made basic looks (Walk-in, Full, Blackout)
const { chromium } = require(require('./app.js').pw); const FILE = process.env.APP || require('./app.js').url;
const axe = require('fs').readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { try { localStorage.setItem('stageplot.deskTips', '1'); } catch {} });
  await p.goto(FILE); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
  await p.evaluate(() => { const w = plan.stage.w, d = plan.stage.d; addGear('light_desk', w / 2, d + 14); addGear('truss', w / 2, 3); itemById(sel.id).w = w * .8; for (let k = 0; k < 4; k++) { addGear('par_led', w * (.25 + k * .15), 3); itemById(sel.id).rot = 180; } addGear('bar_up', w * .3, .5); addGear('profile', w * .4, d + 6); addGear('profile', w * .6, d + 6); sel = null; save(); openDesk(); renderDesk(); document.querySelectorAll('.toast').forEach(t => t.remove()); });
  await p.click('[data-addlook]'); await p.waitForTimeout(100);
  console.log('menu', await p.$$eval('[data-basics]', e => e.map(x => x.textContent.trim())));
  await p.addScriptTag({ content: axe }); console.log('axe menu', await p.evaluate(async () => (await axe.run(document.querySelector('#deskDlg'), { resultTypes: ['violations'] })).violations.map(v => v.id)));
  const h0 = await p.evaluate(() => history.length);
  await p.click('[data-basics="Walk-in|Full|Blackout"]'); await p.waitForTimeout(150);
  console.log('looks', await p.evaluate(() => plan.looks.map(l => l.name)), 'open', await p.evaluate(() => curLook().name), 'undo +', await p.evaluate(h => history.length - h, h0), 'menu closed', await p.isHidden('.ld-addmenu'));
  const lv = n => p.evaluate(n => { const L = plan.looks.find(l => l.name === n); return deskLights().map(i => `${i.type}:${fxName(fxEff(i, L), i)}`); }, n);
  console.log('walk-in', await lv('Walk-in')); console.log('full', [...new Set(await lv('Full'))]); console.log('blackout', [...new Set(await lv('Blackout'))]);
  await p.click('[data-addlook]'); console.log('after: all-three gone', await p.$$eval('[data-basics]', e => e.map(x => x.textContent.trim())));
  await p.click('[data-basics="Full"]'); await p.waitForTimeout(100); console.log('single adds numbered', await p.evaluate(() => [curLook().name, plan.looks.length]));
  await p.click('#ldUndo'); await p.waitForTimeout(100); console.log('undo', await p.evaluate(() => plan.looks.length));
  console.log('errors', errs); await b.close(); })();
