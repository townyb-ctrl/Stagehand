// flip view: plot turned round for the band, drags follow the mouse, words upright
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(() => { try { if (!sessionStorage.getItem('advSet')) { localStorage.setItem('stageplot.detail', 'adv'); sessionStorage.setItem('advSet', '1'); } } catch {} });   // these check Advanced-level tools
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
const id = await p.evaluate(() => plan.items.find(i => i.type === 'pedalboard').id);
const where = () => p.evaluate(id => { const r = document.querySelector(`#plot [data-id="${id}"]`).getBoundingClientRect(); return [Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)]; }, id);
const before = await where();
await p.click('#flipView'); await p.waitForTimeout(300);
const after = await where();
console.log('mirrored on screen', before, after, await p.evaluate(() => { const s = $('plot').getBoundingClientRect(); return Math.round(s.x + s.width / 2); }));
const x0 = await p.evaluate(id => itemById(id).x, id);
await p.mouse.move(after[0], after[1]); await p.mouse.down(); await p.mouse.move(after[0] + 100, after[1], { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(150);
const moved = await where();
console.log('drag follows mouse', Math.abs(moved[0] - (after[0] + 100)) < 12, 'plan x went down (towards stage right)', await p.evaluate(([id, x0]) => itemById(id).x < x0, [id, x0]));
console.log('text upright', await p.evaluate(() => { const t = [...document.querySelectorAll('#plot text')].find(t => t.textContent.trim().length > 3); const m = t.getScreenCTM(); return [t.textContent.trim(), m.a > 0, m.d > 0]; }));
console.log('label', await p.evaluate(() => getComputedStyle(document.querySelector('#plotView .canvas'), '::after').content), 'pressed', await p.getAttribute('#flipView', 'aria-pressed'));
await p.click('#flipView'); await p.waitForTimeout(200); console.log('back', await p.evaluate(() => !$('plot').classList.contains('rot180') && viewRot === 0));
console.log('errors', errs); await b.close(); })();
