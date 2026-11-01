// wedge links (and the facing-away check), mic boom lines, view fade, unified floats, dark mode
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const errs = [];
for (const theme of ['light', 'dark']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: theme }); p.on('pageerror', e => errs.push(e.message));
  await p.goto(require('./app.js').url); await p.waitForTimeout(400); await p.click('#welcomeExample'); await p.waitForTimeout(400);
  await p.evaluate(t => { setTheme(t); document.querySelector('.toast')?.remove();
    const tk = plan.items.find(i => i.type === 'person' && personById(i.personId)?.name.startsWith('Taylor')), al = plan.items.find(i => i.type === 'person' && personById(i.personId)?.name.startsWith('Alex'));
    mutate(() => { const w1 = addItem('wedge', tk.x, tk.y + 3.2, { personId: tk.personId, rot: 0 }); const w2 = addItem('wedge', al.x + 1.5, al.y + 3, { personId: al.personId, rot: 180 }); const m = plan.items.find(i => i.type === 'vox_mic' && i.personId === al.personId); if (m) { m.x = al.x - 2.4; m.y = al.y + .8; } });
    sel = null; renderAll(); document.querySelector('.toast')?.remove(); }, theme);
  await p.waitForTimeout(400); await p.screenshot({ path: `x-${theme}.png` });
  console.log(theme, await p.evaluate(() => ({ links: document.querySelectorAll('.monlink').length, off: document.querySelectorAll('.monlink.off').length, boom: document.querySelectorAll('.boomlink').length, warn: warnings().filter(w => /points away/.test(w.msg)).map(w => w.msg) })));
  await p.evaluate(() => { view = 'paper'; paperTab = 'overview'; renderAll(); }); await p.waitForTimeout(100);
  console.log('view anim', await p.evaluate(() => $('paperView').classList.contains('vin')));
  await p.screenshot({ path: `x-${theme}-paper.png`, clip: { x: 160, y: 80, width: 1120, height: 400 } }); await p.close();
}
console.log('errors', errs); await b.close(); })();
