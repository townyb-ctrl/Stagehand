// lock the setup: fixed gear stays put, band gear moves
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(() => { try { if (!sessionStorage.getItem('advSet')) { localStorage.setItem('stageplot.detail', 'adv'); sessionStorage.setItem('advSet', '1'); } } catch {} });   // these check Advanced-level tools
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(300);
await p.click('#setupLock'); await p.waitForTimeout(100);
console.log('locked', await p.evaluate(() => [plan.setupLock, plan.items.filter(isFixed).map(i => i.type).join(',')]));
const drag = async type => { const id = await p.evaluate(t => plan.items.find(i => i.type === t).id, type), x0 = await p.evaluate(id => itemById(id).x, id), bx = await p.locator(`#plot [data-id="${id}"]`).first().boundingBox();
  await p.mouse.move(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.mouse.down(); await p.mouse.move(bx.x + bx.width / 2 + 80, bx.y + bx.height / 2, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(150); return p.evaluate(([id, x0]) => itemById(id).x !== x0, [id, x0]); };
console.log('stagebox moved', await drag('stagebox'), '| toast', await p.evaluate(() => document.querySelector('.toast')?.textContent.slice(0, 50)));
console.log('pedalboard moved', await drag('pedalboard'));
console.log('riser moved', await drag('drum_riser'));
await p.evaluate(() => { const r = plan.items.find(i => i.type === 'distro'); sel = { kind: 'item', id: r.id }; group = null; renderAll(); }); const xd = await p.evaluate(() => plan.items.find(i => i.type === 'distro').x);
await p.keyboard.press('ArrowRight'); await p.waitForTimeout(80); console.log('nudge blocked', await p.evaluate(x => plan.items.find(i => i.type === 'distro').x === x, xd));
await p.click('#setupLock'); console.log('unlocked moves', await drag('stagebox'));
console.log('errors', errs); await b.close(); })();
