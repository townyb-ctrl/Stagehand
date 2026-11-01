// desk: aim lights by dragging their target on the map, Shift for all picked, arrow keys, undo, axe
const { chromium } = require(require('./app.js').pw); const FILE = process.env.APP || require('./app.js').url;
const axe = require('fs').readFileSync(__dirname + '/axe/node_modules/axe-core/axe.min.js', 'utf8');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { try { localStorage.setItem('stageplot.deskTips', '1'); } catch {} });
  await p.goto(FILE); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
  await p.evaluate(() => { const w = plan.stage.w, d = plan.stage.d; addGear('light_desk', w / 2, d + 14); addGear('truss', w / 2, 3); itemById(sel.id).w = w * .8; for (let k = 0; k < 3; k++) { addGear('par_led', w * (.3 + k * .2), 3); itemById(sel.id).rot = 180; } sel = null; save(); openDesk(); deskSel = new Set([deskLights()[0].id]); renderDesk(); document.querySelectorAll('.toast').forEach(t => t.remove()); });
  await p.waitForTimeout(200);
  console.log('one handle', await p.$$eval('[data-ldaim]', e => e.length));
  const geo = () => p.evaluate(() => deskLights().map(i => { const g = beamGeom(i); return [Math.round(g.cx * 10) / 10, Math.round(g.cy * 10) / 10, i.rot]; }));
  const g0 = await geo(), h0 = await p.evaluate(() => history.length);
  const box = await (await p.$('[data-ldaim] .ld-aimc')).boundingBox(); const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  await p.mouse.move(cx, cy); await p.mouse.down(); await p.mouse.move(cx + 60, cy + 40, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(150);
  const g1 = await geo(); console.log('dragged one', g1[0][0] > g0[0][0] && g1[0][1] > g0[0][1], 'others same', JSON.stringify(g1.slice(1)) === JSON.stringify(g0.slice(1)), 'rot', g0[0][2], '→', g1[0][2], 'undo +', await p.evaluate(h => history.length - h, h0), 'plot follows', await p.evaluate(() => { const g = beamGeom(deskLights()[0]); const e = document.querySelector('#plot .lb-pool, svg:not(.ld-map) .lb-pool'); return !!e; }));
  await p.click('#ldUndo'); await p.waitForTimeout(100); console.log('undo back', JSON.stringify(await geo()) === JSON.stringify(g0));
  // Shift-drag moves every picked light's target together
  await p.evaluate(() => { deskSel = new Set(deskLights().map(i => i.id)); renderDesk(); }); await p.waitForTimeout(100);
  console.log('three handles', await p.$$eval('[data-ldaim]', e => e.length));
  const b2 = await (await p.$$('[data-ldaim] .ld-aimc'))[1].boundingBox(); const x2 = b2.x + b2.width / 2, y2 = b2.y + b2.height / 2;
  await p.keyboard.down('Shift'); await p.mouse.move(x2, y2); await p.mouse.down(); await p.mouse.move(x2, y2 + 50, { steps: 5 }); await p.mouse.up(); await p.keyboard.up('Shift'); await p.waitForTimeout(150);
  const g2 = await geo(); console.log('all moved down', g2.every((g, k) => g[1] > g0[k][1] + 1), 'picks kept', await p.evaluate(() => deskPicked().length));
  // arrow keys
  await p.evaluate(() => { deskSel = new Set([deskLights()[2].id]); renderDesk(); }); await p.focus('[data-ldaim]'); const ga = await geo();
  await p.keyboard.press('ArrowLeft'); await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(100); const gb = await geo();
  console.log('arrows move left', gb[2][0] < ga[2][0], 'focus kept', await p.evaluate(() => !!document.activeElement?.closest('[data-ldaim]')), 'dimmer untouched', await p.evaluate(() => fxOf(deskLights()[2]).d));
  await p.addScriptTag({ content: axe }); console.log('axe', await p.evaluate(async () => (await axe.run(document.querySelector('#deskDlg'), { resultTypes: ['violations'] })).violations.map(v => v.id + ' ' + v.nodes.map(n => n.target.join(' ')).join(' | '))));
  await p.screenshot({ path: 'lt40.png', clip: { x: 130, y: 170, width: 730, height: 600 } });
  console.log('errors', errs); await b.close(); })();
