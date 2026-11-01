// desk: calm style, docked beside the plot, exact-value? (no), remembered picks, hidden colour panel, compact, plot hover card for lights, reset look
const { chromium } = require(require('./app.js').pw); const FILE = process.env.APP || require('./app.js').url;
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); await p.addInitScript({ path: __dirname + '/moodshim.js' });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.addInitScript(() => { try { localStorage.setItem('stageplot.deskTips', '1'); } catch {} });
  await p.goto(FILE); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
  await p.evaluate(() => { const w = plan.stage.w, d = plan.stage.d;
    addGear('light_desk', w / 2, d + 14); addGear('truss', w / 2, .8);
    for (const x of [.36, .46, .56, .66]) { addGear('par_led', w * x, .8); itemById(sel.id).rot = 180; }
    sel = null; save(); renderAll(); openDesk(); moodLook('Calm'); });
  // calm style: no glow left in the desk's own styles
  console.log('no glow', await p.evaluate(() => { const bad = []; for (const el of document.querySelectorAll('.ldesk *')) { const cs = getComputedStyle(el); if (/(rgba?\([^)]*\)|#\w+)\s+0px\s+0px\s+[1-9]\d*px/.test(cs.boxShadow) && !el.closest('.ld-tipcard, .ld-moods, .ld-ctx')) bad.push(el.className.baseVal ?? el.className); if (cs.filter.includes('drop-shadow')) bad.push(el.className.baseVal ?? el.className); } return bad.slice(0, 5); }));
  // remembered picks
  await p.evaluate(() => { deskSel = new Set(deskLights().slice(0, 2).map(i => i.id)); renderDesk(); closeDesk(); openDesk(); });
  console.log('remembered', await p.evaluate(() => deskPicked().map(itemName)));
  // reset look
  await p.click('[data-lookmenu]'); await p.click('[data-lookreset]'); await p.waitForTimeout(150);
  console.log('reset', await p.evaluate(() => [curLook().name, deskLights().map(i => fxName(fxOf(i), i)).join(',')]), 'undoable', await p.evaluate(() => history.length > 0));
  // layout menu: hide colour panel, compact, dock
  await p.click('[data-dock]'); await p.waitForTimeout(150);
  console.log('docked', await p.evaluate(() => { const d = document.querySelector('.ldesk').getBoundingClientRect(); return [document.getElementById('deskDlg').classList.contains('docked'), Math.round(d.width), Math.round(d.right), desk.view]; }));
  // the plot is usable: click a par on the plot, the desk picks it
  const par = await p.evaluate(() => { const it = plan.items.filter(i => i.type === 'par_led')[3]; const r = document.querySelector(`#plot [data-id="${it.id}"], svg [data-id="${it.id}"]`).getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2, itemName(it)]; });
  await p.mouse.click(par[0], par[1]); await p.waitForTimeout(200);
  console.log('plot pick', par[2], await p.evaluate(() => deskPicked().map(itemName)));
  await p.keyboard.press('Escape'); await p.waitForTimeout(100);
  await p.evaluate(() => { if (!$('deskDlg').hidden) closeDesk(); });
  console.log('before reload', await p.evaluate(() => [localStorage.getItem('stageplot.deskLayout'), plan.items.filter(isFixture).length, plan.id])); await p.reload(); await p.waitForTimeout(600); console.log('after reload', await p.evaluate(() => [localStorage.getItem('stageplot.deskLayout'), plan.items.filter(isFixture).length, plan.id, view])); await p.evaluate(() => openDesk()); console.log('dock remembered', await p.evaluate(() => document.getElementById('deskDlg').classList.contains('docked')));
  await p.evaluate(() => { desk.dock = false; deskLayoutSave(); closeDesk(); });
  // hover card for a light on the plot
  await p.evaluate(() => { sel = null; view = 'plot'; renderAll(); });
  const pos = await p.evaluate(() => { const it = plan.items.filter(i => i.type === 'par_led')[2]; fit(); const r = document.querySelector(`svg [data-id="${it.id}"]`).getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
  await p.waitForTimeout(300); const at = await p.evaluate(([x, y]) => { const t = document.elementFromPoint(x, y); return (t?.className?.baseVal ?? t?.className) + '/' + (t?.closest('[data-id]') ? 'item' : 'none'); }, pos); console.log('at', at); await p.mouse.move(pos[0] - 40, pos[1] - 40); await p.mouse.move(pos[0], pos[1], { steps: 4 }); await p.waitForTimeout(700);
  console.log('hover', await p.isVisible('#hoverCard'), (await p.textContent('#hoverCard')).replace(/\s+/g, ' ').match(/Colour.*?Hangs on[^D]*/)?.[0]);
  console.log('errors', errs); await b.close(); })();
