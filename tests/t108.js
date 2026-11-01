// lighting 2: power daisy-chain, upward bars, RGBW desk and looks
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); await p.addInitScript(() => { try { localStorage.setItem('stageplot.deskTips', '1'); } catch {} });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
  const pw = await p.evaluate(() => { const w = plan.stage.w, d = plan.stage.d;
    addGear('light_desk', w / 2, d + 12); addGear('truss', w / 2, 2);
    for (const x of [.38, .44, .5, .56, .62]) addGear('par_led', w * x, 2);
    addGear('bar_up', 3, .8); addGear('bar_up', w - 3, .8); addGear('profile', 4, d - 2);
    for (const it of plan.items.filter(i => i.type === 'par_led')) it.rot = 180;
    const pars = plan.items.filter(i => i.type === 'par_led'), head = pars.find(i => !linkFeed(i) && linkKids(i).length);
    const src = other(plan.cables.find(c => c.type === 'power' && touches(c, head.id) && !c.link), head.id);
    const k = plan.cables.find(c => c.type === 'power' && touches(c, head.id) && !c.link).circuit - 1;
    return { links: plan.cables.filter(c => c.link).length, plugged: pars.filter(i => plan.cables.some(c => c.type === 'power' && touches(c, i.id) && !c.link)).length,
      chain: chainOf(head).length, chainW: chainW(head), onCircuit: circuitLoads(src).items[k].filter(i => i.type === 'par_led').length,
      upBars: plan.items.filter(i => i.type === 'bar_up').map(isUp), hungUp: (() => { const t = plan.items.find(i => i.type === 'par_led'); t.up = true; const r = isUp(t); delete t.up; return r; })() }; });
  console.log('power', JSON.stringify(pw));
  // a chain too big for one link is warned about
  console.log('overload', await p.evaluate(() => { const pars = plan.items.filter(i => i.type === 'par_led'); for (const i of pars) i.watts = 900; const m = warnings().filter(x => /power link/.test(x.msg)).map(x => x.lvl); for (const i of pars) delete i.watts; return m; }));
  await p.evaluate(() => { save(); renderAll(); fit(); });
  console.log('up glow', await p.$$eval('.lb-up', e => e.length), 'walls', await p.$$eval('.lb-wall', e => e.length));
  // sheet
  await p.evaluate(() => { sel = null; view = 'paper'; paperTab = 'lighting'; renderAll(); }); await p.waitForTimeout(250);
  console.log('patch power', await p.$$eval('.lighttbl tbody tr', r => r.map(x => x.lastElementChild.textContent).slice(0, 3)));
  console.log('errors', errs); await b.close(); })();
