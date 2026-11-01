// desk: beam size handles, mover positions per look, front view picture
const { chromium } = require(require('./app.js').pw); const FILE = process.env.APP || require('./app.js').url;
const axe = require('fs').readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true }); const p = await ctx.newPage(); await p.addInitScript({ path: __dirname + '/moodshim.js' }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { try { localStorage.setItem('stageplot.deskTips', '1'); } catch {} });
  await p.goto(FILE); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
  await p.evaluate(() => { const w = plan.stage.w, d = plan.stage.d; addGear('light_desk', w / 2, d + 14); addGear('truss', w / 2, 3); itemById(sel.id).w = w * .8; addGear('wash_led', w * .3, 3); itemById(sel.id).rot = 180; addGear('wash_led', w * .5, 3); itemById(sel.id).rot = 180; addGear('spot_mh', w * .7, 3); itemById(sel.id).rot = 180; addGear('par_led', w * .85, 3); sel = null; save(); openDesk(); moodLook('Calm'); deskSel = new Set(deskLights().filter(i => i.type === 'wash_led').slice(0, 1).map(i => i.id)); renderDesk(); document.querySelectorAll('.toast').forEach(t => t.remove()); });
  await p.waitForTimeout(200);
  // 4. beam size
  console.log('zoom handle', await p.$$eval('[data-ldzoom]', e => e.length), 'par has none', await p.evaluate(() => { deskSel = new Set([deskLights().find(i => i.type === 'par_led').id]); renderDesk(); return document.querySelectorAll('[data-ldzoom]').length; }));
  await p.evaluate(() => { deskSel = new Set(deskLights().filter(i => i.type === 'wash_led').slice(0, 1).map(i => i.id)); renderDesk(); });
  const w1 = () => p.evaluate(() => deskLights().filter(i => i.type === 'wash_led').map(beamOf));
  const b0 = await w1(), h0 = await p.evaluate(() => history.length);
  let bb = await (await p.$('[data-ldzoom] .ld-zoomk')).boundingBox(); let x = bb.x + bb.width / 2, y = bb.y + bb.height / 2;
  const dir = await p.evaluate(() => { const g = beamGeom(deskPicked()[0]); return [-g.uy, g.ux]; });
  await p.mouse.move(x, y); await p.mouse.down(); await p.mouse.move(x + dir[0] * 40, y + dir[1] * 40, { steps: 5 }); await p.mouse.up(); await p.waitForTimeout(150);
  const b1 = await w1(); console.log('wider', b0, '→', b1, 'other same', b1[1] === b0[1], 'undo +', await p.evaluate(h => history.length - h, h0));
  await p.focus('[data-ldzoom]'); await p.keyboard.press('ArrowLeft'); await p.keyboard.press('ArrowLeft'); console.log('keys narrower', (await w1())[0] === b1[0] - 2, 'focus kept', await p.evaluate(() => !!document.activeElement?.closest('[data-ldzoom]')));
  await p.evaluate(() => { deskSel = new Set(deskLights().filter(i => i.type === 'wash_led').map(i => i.id)); renderDesk(); });
  bb = await (await p.$$('[data-ldzoom] .ld-zoomk'))[0].boundingBox(); x = bb.x + bb.width / 2; y = bb.y + bb.height / 2;
  await p.keyboard.down('Shift'); await p.mouse.move(x, y); await p.mouse.down(); await p.mouse.move(x - dir[0] * 25, y - dir[1] * 25, { steps: 5 }); await p.mouse.up(); await p.keyboard.up('Shift'); await p.waitForTimeout(100);
  const b2 = await w1(); console.log('shift same size', b2, b2[0] === b2[1]);
  // 5. movers per look
  const mv = () => p.evaluate(() => { const m = deskLights().find(i => i.type === 'spot_mh'); return [m.rot, Math.round(throwOf(m) * 10) / 10, beamOf(m)]; });
  const calm = await mv();
  await p.evaluate(() => moodLook('Celebration')); await p.waitForTimeout(100);
  console.log('new look keeps', JSON.stringify(await mv()) === JSON.stringify(calm));
  await p.evaluate(() => { const m = deskLights().find(i => i.type === 'spot_mh'); deskSel = new Set([m.id]); renderDesk(); });
  bb = await (await p.$('[data-ldaim] .ld-aimc')).boundingBox(); x = bb.x + bb.width / 2; y = bb.y + bb.height / 2;
  await p.mouse.move(x, y); await p.mouse.down(); await p.mouse.move(x - 120, y - 30, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(100);
  const cel = await mv(); console.log('aimed in Celebration', calm, '→', cel);
  await p.keyboard.press('1'); await p.waitForTimeout(100); console.log('back to Calm', JSON.stringify(await mv()) === JSON.stringify(calm), await p.evaluate(() => curLook().name));
  await p.keyboard.press('2'); await p.waitForTimeout(100); console.log('Celebration again', JSON.stringify(await mv()) === JSON.stringify(cel));
  const wash = await p.evaluate(() => deskLights().filter(i => i.type === 'wash_led').map(beamOf)); await p.keyboard.press('1'); console.log('non-movers stay', JSON.stringify(await p.evaluate(() => deskLights().filter(i => i.type === 'wash_led').map(beamOf))) === JSON.stringify(wash));
  await p.reload(); await p.waitForTimeout(600); await p.evaluate(() => { openDesk(); switchLook(plan.looks[1].id); }); console.log('after reload Celebration', JSON.stringify(await mv()) === JSON.stringify(cel));
  // 8. front picture
  await p.evaluate(() => { desk.view = 'front'; renderDesk(); }); await p.waitForTimeout(150);
  console.log('button', await p.isVisible('[data-frontpic]'));
  const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 8000 }).catch(() => null), p.click('[data-frontpic]')]);
  if (dl) { const f = await dl.path(); const buf = require('fs').readFileSync(f); console.log('png', dl.suggestedFilename(), buf.length > 20000, buf.readUInt32BE(16), buf.readUInt32BE(20)); require('fs').copyFileSync(f, __dirname + '/front.png'); } else console.log('png none', await p.evaluate(() => document.querySelector('.toast')?.textContent));
  await p.evaluate(() => { desk.view = 'map'; deskSel = new Set(deskLights().map(i => i.id)); renderDesk(); });
  await p.addScriptTag({ content: axe }); console.log('axe', await p.evaluate(async () => (await axe.run(document.querySelector('#deskDlg'), { resultTypes: ['violations'] })).violations.map(v => v.id + ' ' + v.nodes.map(n => n.target.join(' ')).join(' | '))));
  await p.screenshot({ path: 'lt41.png', clip: { x: 130, y: 170, width: 730, height: 600 } });
  console.log('errors', errs); await b.close(); })();
