// turning the view: quarter turns and the flip, in Simple; clicks and drags land where they look; remembered after a reload
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
await p.evaluate(() => { view = 'plot'; sel = null; renderAll(); document.querySelectorAll('.toast').forEach(t => t.remove()); });
console.log('simple has both', await p.evaluate(() => [!ui.adv, !!$('flipView'), !!$('rotView')]));
const pid = await p.evaluate(() => plan.items.find(i => i.type === 'person')?.id);
for (const turns of [1, 2, 3, 4]) {
  await p.click('#rotView'); await p.waitForTimeout(300);
  const st = await p.evaluate(() => [viewRot, $('plot').getAttribute('class'), $('canvas').dataset.turn]);
  // click the item where it is drawn: it gets picked
  await p.evaluate(() => { sel = null; renderAll(); });
  const bx = await p.locator(`#plot [data-id="${pid}"]`).first().boundingBox();
  await p.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.waitForTimeout(150);
  const picked = await p.evaluate(id => sel?.id === id, pid);
  // drag it 60 px to the right on screen: its drawn box moves right on screen by about that much
  const x0 = await p.evaluate(id => [itemById(id).x, itemById(id).y], pid);
  await p.mouse.move(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.mouse.down(); await p.mouse.move(bx.x + bx.width / 2 + 60, bx.y + bx.height / 2, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(250);
  const bx2 = await p.locator(`#plot [data-id="${pid}"]`).first().boundingBox();
  const moved = Math.round(bx2.x + bx2.width / 2 - (bx.x + bx.width / 2)), still = Math.abs(bx2.y + bx2.height / 2 - (bx.y + bx.height / 2)) < 8;
  const x1 = await p.evaluate(id => [itemById(id).x, itemById(id).y], pid);
  // labels stay upright: a text's on-screen box is wider than tall
  const upright = await p.evaluate(() => { const t = [...document.querySelectorAll('#plot text:not([transform])')].filter(e => e.textContent.length > 4)[0]; if (!t) return 'none'; const r = t.getBoundingClientRect(); return r.width > r.height; });
  console.log('turn', st[0], st[1] || '', st[2] || '-', '| picked', picked, '| drag right moved', moved, 'px, level', still, '| plan moved', JSON.stringify(x0) !== JSON.stringify(x1), '| upright', upright);
  await p.keyboard.press('Control+z'); await p.waitForTimeout(100);
}
await p.click('#flipView'); await p.waitForTimeout(200); console.log('flip', await p.evaluate(() => [viewRot, $('canvas').dataset.turn]));
await p.click('#rotView'); await p.waitForTimeout(200);
await p.reload(); await p.waitForTimeout(500); await p.evaluate(() => { view = 'plot'; renderAll(); });
console.log('remembered', await p.evaluate(() => [viewRot, $('plot').classList.contains('rot270')]));
console.log('picture unturned', await p.evaluate(() => { snapCache.key = ''; const s = plotSnapshotDraw(10); return !/^<svg[^>]*><g transform="rotate\(/.test(s) && viewRot === 270; }), 'screen still turned', await p.evaluate(() => !!document.querySelector('#rotg') && $('plot').classList.contains('rot270')));
await p.screenshot({ path: 't131-270.png' });
await p.setViewportSize({ width: 400, height: 860 }); await p.waitForTimeout(300); console.log('phone buttons', await p.evaluate(() => [getComputedStyle($('flipView')).display !== 'none', getComputedStyle($('rotView')).display !== 'none', document.documentElement.scrollWidth <= innerWidth]));
console.log('errors', errs); await b.close(); })();
