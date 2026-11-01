// lighting: fixtures chain into DMX lines per truss/pipe, get addresses per universe, warnings, inspector, aiming
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.addInitScript(() => { try { localStorage.setItem('stageplot.detail', 'adv'); localStorage.setItem('stageplot.deskTips', '1'); } catch {} });
  await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const w = plan.stage.w, d = plan.stage.d, ids = {};
    addGear('par_led', 3, 3);   // no console yet
    const noDesk = warnings().filter(x => /lighting console/.test(x.msg)).length;
    addGear('light_desk', w / 2, d + 12); addGear('truss', w / 2, 2); addGear('foh_bar', w / 2, d + 6);
    for (const x of [.25, .45, .65]) addGear('par_led', w * x, 2);
    addGear('spot_mh', w * .8, 2);
    for (const x of [.4, .6]) addGear('profile', w * x, d + 6);
    addGear('uplight', 1.5, d - 1); addGear('hazer', w - 2, 1.5);
    const L1 = dmxLines().map(l => `${l.name}:${l.from}:U${l.universe}:${l.items.map(i => i.type).join('>')}`);
    const fixtures = plan.items.filter(isDmx);
    const addr = fixtures.map(i => `${i.type}@${i.dmxA}+${dmxCh(i)}`).join(' ');
    const hungOk = plan.items.filter(i => i.type === 'par_led').map(i => mountOf(i)?.type || 'floor').join(',');
    // splitter: lines start from its outputs
    mutate(() => { plan.cables = plan.cables.filter(c => c.type !== 'dmx'); for (const i of plan.items) delete i.dmxA; addItem('dmx_split', w - 1, d + 3); autoCable(); });
    const L2 = dmxLines().map(l => `${l.name}:${l.from}:U${l.universe}:${l.items.length}`);
    const uniq = new Set(plan.items.filter(isDmx).map(i => i.dmxA)).size === plan.items.filter(isDmx).length;
    // overlap warning
    const pars = plan.items.filter(i => i.type === 'par_led'); mutate(() => { pars[1].dmxA = pars[0].dmxA + 2; });
    const overlap = warnings().filter(x => /overlap/.test(x.msg)).map(x => x.msg);
    mutate(() => assignDmx(true));
    const fixed = warnings().filter(x => /overlap/.test(x.msg)).length;
    const dmxCables = plan.cables.filter(c => c.type === 'dmx'), ceil = dmxCables.filter(c => c.level === 'ceiling').length;
    const lens = dmxCables.map(c => cableLen(c)).every(x => x > 0);
    const power = plan.items.filter(isDmx).every(i => plan.cables.some(c => c.type === 'power' && touches(c, i.id)));
    return { noDesk, L1, addr, hungOk, L2, uniq, overlap, fixed, n: dmxCables.length, ceil, lens, power, totalIssues: dmxIssues().map(x => x.msg) };
  });
  console.log(JSON.stringify(r, null, 1));
  // inspector + aim drag
  const id = await p.evaluate(() => { const it = plan.items.find(i => i.type === 'profile'); sel = { kind: 'item', id: it.id }; renderAll(); return it.id; });
  console.log('insp', await p.isVisible('#iDmxA'), await p.inputValue('#iDmxA'), await p.inputValue('#iDmxCh'), (await p.textContent('.isec h3 span')).trim());
  await p.fill('#iDmxCh', '9'); await p.press('#iDmxCh', 'Tab'); await p.waitForTimeout(200);
  console.log('ch now', await p.evaluate(id => dmxCh(itemById(id)), id));
  const h = await p.$('.aimh'); const bb = await h.boundingBox();
  const before = await p.evaluate(id => { const i = itemById(id); return [i.rot || 0, throwOf(i)]; }, id);
  await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.mouse.down(); await p.mouse.move(bb.x + 120, bb.y - 60, { steps: 5 }); await p.mouse.up(); await p.waitForTimeout(200);
  const after = await p.evaluate(id => { const i = itemById(id); return [i.rot || 0, throwOf(i)]; }, id);
  console.log('aim', before, after, 'undo label', await p.evaluate(() => history[history.length - 1]?.label));
  await p.click('#iReaddr').catch(() => console.log('no readdr on fixture (expected)'));
  await p.evaluate(() => { sel = null; view = 'paper'; paperTab = 'lighting'; renderAll(); }); await p.waitForTimeout(300);
  console.log('sheet tab', await p.isVisible('[data-ptab="lighting"]'), 'rows', await p.$$eval('.lighttbl tbody tr', r => r.length), 'chains', await p.$$eval('.dmxchain', r => r.length));
  console.log('copy', (await p.evaluate(() => paperData.lighting)).split('\n')[0]);
  await p.click('#lightReaddr'); await p.waitForTimeout(200);
  console.log('in line order', await p.evaluate(() => { let prev = 0, ok = true; for (const L of dmxLines()) for (const it of L.items) { if (it.dmxA < prev) ok = false; prev = it.dmxA; } return ok; }));
  console.log('pull has DMX', await p.evaluate(() => pullList().some(r => r.type === 'dmx')));
  console.log('errors', errs); await b.close(); })();
