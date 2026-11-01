// the stage opens centred in the canvas (desktop, laptop, phone; both fit modes)
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const errs = [];
for (const [w, h] of [[1440, 900], [1280, 720], [390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } }); p.on('pageerror', e => errs.push(e.message));
  await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(700);
  const m = () => p.evaluate(() => { const sc = $('scroller').getBoundingClientRect(), d = document.querySelector('#plot .deck').getBoundingClientRect(); return { dx: Math.round((d.left + d.width / 2) - (sc.left + sc.width / 2)), dy: Math.round((d.top + d.height / 2) - (sc.top + sc.height / 2)), deckW: Math.round(d.width), sw: Math.round(sc.width) }; });
  console.log(w, 'open', JSON.stringify(await m()));
  await p.evaluate(() => fit('stage')); await p.waitForTimeout(300); console.log(w, 'fit', JSON.stringify(await m()));
  await p.screenshot({ path: `t54-${w}.png` }); await p.close();
}
console.log('errors', errs); await b.close(); })();
