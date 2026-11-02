// new gear: a single wireless receiver patches its mic through a stage box input; a wired IEM pack takes a stage box output as a mix;
// an extension lead asks to be plugged in by its own 3-pin plug, which never uses one of its sockets
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
await p.evaluate(() => { view = 'plot'; renderAll(); });
console.log('in the library', await p.evaluate(() => [GEAR_GROUPS.find(g => g[0] === 'Mics & DI')[1].includes('rx_single'), GEAR_GROUPS.find(g => g[0] === 'Monitors & PA')[1].includes('iem_wired'), !!RACK_DEV.rx1]));
// receiver
const r = await p.evaluate(() => {
  addGear('vox_wl', plan.stage.w * .5, plan.stage.d * .6); const mics = rxMics(); const before = inputList().filter(x => x.port === 'RF receiver').length;
  addGear('rx_single', plan.stage.w * .3, plan.stage.d * .2); const rx = itemById(sel.id);
  const xlr = plan.cables.find(c => c.type === 'xlr' && touches(c, rx.id)), pw = plan.cables.find(c => c.type === 'power' && touches(c, rx.id));
  const mic = mics[0], row = inputList().find(x => x.itemId === mic?.id);
  return { mics: mics.length, before, xlr: !!xlr && isBox(other(xlr, rx.id)), power: !!pw, row: row?.port, patch: patchOf(mic)?.via?.id === rx.id };
});
console.log('receiver', JSON.stringify(r));
console.log('rf sheet still lists the mic', await p.evaluate(() => { view = 'paper'; paperTab = 'inputs'; renderAll(); return !!document.querySelector('#sec-rf'); }));
// a second wireless mic with only one receiver: a warning
const w = await p.evaluate(() => { view = 'plot'; renderAll(); addGear('vox_wl', 3, 3); addGear('vox_wl', 4, 3); return warnings().filter(x => /receivers for/.test(x.msg)).map(x => x.msg); });
console.log('too few receivers', w);
// wired IEM
const m = await p.evaluate(() => {
  const who = plan.items.find(i => i.type === 'person'); addGear('iem_wired', who.x + 1, who.y); const it = itemById(sel.id); it.personId = who.personId; autoCable(); renderAll();
  const out = outputList().find(o => o.itemId === it.id), mix = monitorMixes().filter(x => x.person === personById(who.personId).name);
  return { out: out?.port, outFlag: out?.flag, xlrFromBox: plan.cables.some(c => c.type === 'xlr' && c.to === it.id && isBox(itemById(c.from))), power: needsPower(it), radio: !!cat(it).wireless, mixes: mix.map(x => x.kind) };
});
console.log('wired IEM', JSON.stringify(m));
// extension lead: auto-plugged where a power point exists, sockets all free; with no mains it asks for one; with auto-patch off it starts a cable to plug in
const e1 = await p.evaluate(() => { document.querySelectorAll('.toast').forEach(t => t.remove()); addGear('pboard4', 6, 2); const it = itemById(sel.id); const f = feedOf(it); return { fed: !!f, into: f && itemName(other(f, it.id)), used: extUsed(it), toast: document.querySelector('.toast')?.textContent }; });
console.log('ext auto', JSON.stringify(e1));
const e2 = await p.evaluate(() => { document.querySelectorAll('.toast').forEach(t => t.remove()); plan.settings.autoPatch = false; addGear('pboard2', 2, 2); const it = itemById(sel.id); return { fed: !!feedOf(it), mode, pendingFrom: pending?.from === it.id, toast: document.querySelector('.toast')?.textContent }; });
console.log('ext manual', JSON.stringify(e2));
// click a power point: the lead's own plug goes in, no socket used
const pt = await p.evaluate(() => plan.items.find(i => isPowerSource(i) && !isExt(i))?.id);
const bx = await p.locator(`#plot [data-id="${pt}"]`).first().boundingBox();
await p.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.waitForTimeout(200);
console.log('plugged by click', await p.evaluate(() => { const it = plan.items.filter(isExt).pop(); const f = feedOf(it); return [!!f, f?.type, extUsed(it), prop(it, 'outlets')]; }));
const e3 = await p.evaluate(() => { setMode('select'); document.querySelectorAll('.toast').forEach(t => t.remove()); for (const x of plan.items.filter(i => isPowerSource(i) && !isExt(i))) plan.items.splice(plan.items.indexOf(x), 1); plan.cables = plan.cables.filter(c => itemById(c.from) && itemById(c.to)); addGear('pboard6', 5, 5); const it = itemById(sel.id); return { fed: !!feedOf(it), mode, toast: document.querySelector('.toast')?.textContent, warn: warnings().some(x => x.id === it.id && /isn't plugged/.test(x.msg)) }; });
console.log('ext no mains', JSON.stringify(e3));
await p.evaluate(() => { sel = { kind: 'item', id: plan.items.filter(isExt).pop().id }; inspOpen = true; applyPanels(false); renderAll(); });
console.log('inspector', await p.evaluate(() => [document.querySelector('#inspector .isec .hint')?.textContent, !!document.querySelector('[data-plugext]')]));
await p.screenshot({ path: 't132.png' });
console.log('errors', errs); await b.close(); })();
