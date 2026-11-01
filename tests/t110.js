// face-light check: backlight doesn't count, front light does, deep colour is flagged, blackout looks are skipped, the desk shows faces
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); await p.addInitScript(() => { try { localStorage.setItem('stageplot.deskTips', '1'); } catch {} });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
  const msgs = () => warnings().filter(x => /face|dark|deep colour/.test(x.msg)).map(x => x.msg);
  const r = await p.evaluate(() => {
    const msgs = () => warnings().filter(x => /face|in the dark|deep colour/.test(x.msg)).map(x => x.msg), w = plan.stage.w, d = plan.stage.d, out = {};
    out.none = msgs();
    addGear('light_desk', w / 2, d + 14); addGear('truss', w / 2, .6);
    for (const x of [.3, .45, .6, .75]) { addGear('par_led', w * x, .6); itemById(sel.id).rot = 180; }   // upstage truss lighting downstage: behind most people
    out.back = msgs();
    const alex = plan.items.find(i => cat(i).shape === 'person' && /Alex/.test(personById(i.personId)?.name || ''));
    addGear('foh_bar', w / 2, d + 7); addGear('profile', alex.x, d + 7);
    const pr = itemById(sel.id); pr.rot = 0; pr.throw = r2(d + 7 - alex.y);   // straight at Alex
    out.front = msgs(); out.alex = faceState(alex, curLook());
    const tay = plan.items.find(i => cat(i).shape === 'person' && /Taylor/.test(personById(i.personId)?.name || ''));
    addGear('wash_led', tay.x, d + 7); const wl = itemById(sel.id); wl.rot = 0; wl.throw = r2(d + 7 - tay.y);
    // a look in deep blue on everything
    ensureLook(); curLook().name = 'Worship'; setFx(deskLights(), { r: 0, g: 40, b: 255, w: 0, d: 100 });
    out.deep = msgs().filter(m => /Taylor|Alex/.test(m));
    // a blackout look is skipped; a warm look lights Alex
    plan.looks.push({ id: 'bo', name: 'Blackout', fx: Object.fromEntries(deskLights().map(i => [i.id, { ...FX_DEF, d: 0 }])) });
    plan.looks.push({ id: 'pr', name: 'Preaching', fx: {} });
    out.named = msgs().filter(m => /Taylor|Morgan/.test(m));
    out.anyBlackout = msgs().some(m => /Blackout/.test(m));
    save(); renderAll(); return out; });
  console.log(JSON.stringify(r, null, 1));
  await p.evaluate(() => { plan.lookId = plan.looks[0].id; openDesk(); });
  console.log('desk faces', await p.$$eval('.ld-face', e => e.map(x => x.getAttribute('class'))), (await p.textContent('#ldFaces')).trim());
  await p.click('.ld-look[data-look="pr"]'); await p.waitForTimeout(150);
  console.log('preaching', (await p.textContent('#ldFaces')).trim());
  await p.screenshot({ path: 'lt11.png' });
  console.log('errors', errs); await b.close(); })();
