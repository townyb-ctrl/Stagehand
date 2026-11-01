// two-finger pinch zooms the plot (not the page); browser support check
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: false }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
await p.evaluate(() => { fit('stage'); renderAll(); }); await p.waitForTimeout(200);
const s0 = await p.evaluate(() => { window.__pe = []; for (const ev of ['pointerdown','pointermove']) addEventListener(ev, e => __pe.push(ev + ':' + e.pointerType + ':' + e.target.id), true); return scale; });
const cdp = await ctx.newCDPSession(p);
const r = await p.evaluate(() => { const b = $('scroller').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height * .45 }; });
const tp = (dx) => [{ x: r.x - dx, y: r.y, id: 1 }, { x: r.x + dx, y: r.y, id: 2 }];
await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: tp(40) });
for (let dx = 45; dx <= 120; dx += 5) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: tp(dx) });
await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
await p.waitForTimeout(200);
const s1 = await p.evaluate(() => scale);
console.log('pinch out zooms in', s1 > s0 * 2, 'page not zoomed', await p.evaluate(() => (visualViewport?.scale || 1) === 1));
console.log(await p.evaluate(() => [__pe.length, __pe.slice(0,4), document.elementFromPoint(512, 384)?.id]));
console.log('errors', errs); await b.close(); })();
