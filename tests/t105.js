// Alt + scroll zooms round the pointer (as Ctrl does); plain scroll still pans
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
const box = await p.locator('#scroller').boundingBox(), cx = box.x + box.width / 2, cy = box.y + box.height / 2;
const sc = () => p.evaluate(() => scale);
const at = () => p.evaluate(([x, y]) => { const m = svg.getScreenCTM().inverse(); return [x * m.a + m.e, y * m.d + m.f]; }, [cx - 150, cy + 80]);
await p.mouse.move(cx - 150, cy + 80); const s0 = await sc(), w0 = await at();
await p.keyboard.down('Alt'); await p.mouse.wheel(0, -300); await p.keyboard.up('Alt'); await p.waitForTimeout(400);
const s1 = await sc(), w1 = await at(); console.log('alt up zooms in', s1 > s0 * 1.3, 'same spot under the pointer', Math.hypot(w1[0] - w0[0], w1[1] - w0[1]) < .3);
const under = await p.evaluate(([x, y]) => { const m = svg.getScreenCTM().inverse(); return [x * m.a + m.e, y * m.d + m.f].map(v => +v.toFixed(1)); }, [cx, cy]);
await p.keyboard.down('Alt'); await p.mouse.wheel(0, 300); await p.keyboard.up('Alt'); await p.waitForTimeout(400);
console.log('alt down zooms out', (await sc()) < s1);
await p.keyboard.down('Control'); await p.mouse.wheel(0, -200); await p.keyboard.up('Control'); await p.waitForTimeout(400); console.log('ctrl still zooms', (await sc()) > s0 * 1.05);
const st = await p.evaluate(() => [scroller.scrollTop, scale]); await p.mouse.wheel(0, 200); await p.waitForTimeout(300);
console.log('plain scroll pans, no zoom', await p.evaluate(s => [scroller.scrollTop !== s[0], scale === s[1]], st));
console.log('errors', errs); await b.close(); })();
