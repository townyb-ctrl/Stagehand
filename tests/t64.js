// regression: zoomed out, a just-added MIDI controller / USB interface / DI never vanishes; folded boxes leave a dot under their cables
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(400); await p.click('#welcomeExample'); await p.waitForTimeout(400);
for (const t of ['midi_keys', 'midi_fs', 'usb_if', 'di_mono']) {
  console.log(t, await p.evaluate(t => { const tk = plan.items.find(i => i.type === 'person' && personById(i.personId)?.name.startsWith('Taylor')); addGear(t, tk.x - 2, tk.y + 1.5, null); const id = sel.id; sel = null; renderAll();
    return { scaleZoomedOut: scale < 30, visible: !!document.querySelector(`#plot .item[data-id="${id}"]`) }; }, t));
}
console.log('dots under folded boxes', await p.evaluate(() => [document.querySelectorAll('.gbadge').length, document.querySelectorAll('.tuckdot').length]));
await p.reload(); await p.waitForTimeout(400); await p.evaluate(() => { view = 'plot'; renderAll(); });
console.log('after reload: controllers still drawn', await p.evaluate(() => plan.items.filter(i => ['midi_fs', 'usb_if', 'midi_keys'].includes(i.type)).every(i => !!document.querySelector(`#plot .item[data-id="${i.id}"]`))));
console.log('errors', errs); await b.close(); })();
