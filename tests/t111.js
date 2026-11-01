// lighting refinements: brightness view, heights and front angle, one-sided faces, swap type, copy/paste colour, mirror, desk keys
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.addInitScript(() => { try { localStorage.setItem('stageplot.detail', 'adv'); localStorage.setItem('stageplot.deskTips', '1'); } catch {} });
  const colour = n => p.evaluate(n => { const c = DESK_PRESETS.find(x => x[0] === n)[1], ts = deskPicked(); if (ts.length) deskSet({ ...c, d: fxOf(ts[0]).d || 100 }); }, n);
  await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => { const w = plan.stage.w, d = plan.stage.d, out = {}, alex = plan.items.find(i => cat(i).shape === 'person' && /Alex/.test(personById(i.personId)?.name || ''));
    addGear('light_desk', w / 2, d + 14); addGear('foh_bar', w / 2, d + 7);
    addGear('profile', alex.x + 6, d + 7); const pr = itemById(sel.id); pr.rot = Math.round(Math.atan2(alex.x - pr.x, -(alex.y - pr.y)) * 180 / Math.PI); pr.throw = r2(Math.hypot(alex.x - pr.x, alex.y - pr.y));
    out.angle = Math.round(frontAngle(pr)); out.angleMsg = warnings().filter(x => /°/.test(x.msg)).map(x => x.msg);
    const bar = plan.items.find(i => i.type === 'foh_bar'); bar.h = fromM(3.2); out.lowAngle = Math.round(frontAngle(pr)); out.lowMsg = warnings().some(x => /too flat/.test(x.msg));
    bar.h = fromM(6);
    out.side = faceState(alex, curLook()); out.sideMsg = warnings().filter(x => /one side/.test(x.msg)).map(x => x.msg);
    // mirror it to the other side of Alex? mirror across the stage centre instead
    sel = { kind: 'item', id: pr.id }; return out; });
  console.log(JSON.stringify(r, null, 1));
  // the inspector: type, angle note, mirror
  await p.evaluate(() => renderAll());
  console.log('insp', await p.isVisible('#iLType'), (await p.textContent('#inspector')).match(/Hits faces at \d+°[^.(]*/)?.[0]);
  const before = await p.evaluate(() => plan.items.filter(i => i.type === 'profile').length);
  await p.click('[data-mirror]'); await p.waitForTimeout(150);
  console.log('mirror', await p.evaluate(b => { const ps = plan.items.filter(i => i.type === 'profile'); const [a, m] = ps; const sp = stagePoly(), cx = (Math.min(...sp.map(q => q[0])) + Math.max(...sp.map(q => q[0]))) / 2;
    return [ps.length - b, +(a.x + m.x - 2 * cx).toFixed(2), (a.rot + m.rot) % 360, m.throw === a.throw, itemName(m), !!plan.cables.find(c => c.type === 'power' && touches(c, m.id))]; }, before));
  // two front lights from both sides: Alex is now lit properly, if the mirror reaches; aim the mirror at Alex too
  console.log('two sides', await p.evaluate(() => { const alex = plan.items.find(i => cat(i).shape === 'person' && /Alex/.test(personById(i.personId)?.name || '')), m = plan.items.filter(i => i.type === 'profile')[1];
    m.x = r2(alex.x - 6); m.rot = Math.round(Math.atan2(alex.x - m.x, -(alex.y - m.y)) * 180 / Math.PI); m.throw = r2(Math.hypot(alex.x - m.x, alex.y - m.y)); return faceState(alex, curLook()); }));
  // swap type keeps place, address and name pattern
  await p.evaluate(() => { sel = { kind: 'item', id: plan.items.filter(i => i.type === 'profile')[1].id }; renderAll(); });
  const pre = await p.evaluate(() => { const i = itemById(sel.id); return [i.x, i.y, i.rot, i.dmxA]; });
  await p.selectOption('#iLType', 'wash_led'); await p.waitForTimeout(150);
  console.log('swap', await p.evaluate(pre => { const i = itemById(sel.id); return [i.type, itemName(i), JSON.stringify([i.x, i.y, i.rot, i.dmxA]) === JSON.stringify(pre), dmxCh(i)]; }, pre));
  // brightness overlay
  await p.evaluate(() => setCableView(() => cableView.over.add('bright')));
  console.log('bright cells', await p.$$eval('.ov-bright rect', e => e.length), 'in Layers', await p.evaluate(() => OVERLAYS.some(o => o[0] === 'bright')));
  await p.evaluate(() => setCableView(() => cableView.over.delete('bright')));
  // side view shows the bar and its lights? (FOH bar is out front, so the truss): add a truss with a par
  console.log('side', await p.evaluate(() => { addGear('truss', plan.stage.w / 2, 2); addGear('par_led', plan.stage.w / 2, 2); return [(sideSvg().match(/sv-mount/g) || []).length, (sideSvg().match(/sv-light/g) || []).length]; }));
  // desk: copy, paste, keys
  await p.evaluate(() => { ensureLook(); plan.looks.push({ id: 'l2', name: 'Two', fx: {} }); save(); openDesk(); deskSel = new Set([plan.items.find(i => i.type === 'par_led').id]); renderDesk(); });
  await colour('Magenta'); await p.click('[data-fxcopy]'); await p.waitForTimeout(100);
  await p.evaluate(() => { deskSel = new Set([plan.items.find(i => i.type === 'wash_led').id]); renderDesk(); });
  await p.click('[data-fxpaste]'); await p.waitForTimeout(100);
  console.log('paste', await p.evaluate(() => fxName(fxOf(plan.items.find(i => i.type === 'wash_led')))));
  await p.locator('#ldMap').click({ position: { x: 5, y: 5 } }).catch(() => {});
  await p.keyboard.press('ArrowDown'); await p.keyboard.press('ArrowDown'); await p.keyboard.press('Shift+ArrowDown'); await p.waitForTimeout(100);
  console.log('dim keys', await p.evaluate(() => fxOf(plan.items.find(i => i.type === 'wash_led')).d));
  await p.keyboard.press('2'); await p.waitForTimeout(100); console.log('key 2', await p.evaluate(() => curLook().name));
  await p.keyboard.press('a'); await p.waitForTimeout(100); console.log('key a', await p.evaluate(() => deskPicked().length === deskLights().length));
  await p.keyboard.press('v'); await p.waitForTimeout(100); console.log('key v all magenta', await p.evaluate(() => deskLights().filter(i => cat(i).rgbw).every(i => fxName(fxOf(i)).startsWith('Magenta'))));
  console.log('keys hint', await p.isVisible('.ld-keys'));
  console.log('errors', errs); await b.close(); })();
