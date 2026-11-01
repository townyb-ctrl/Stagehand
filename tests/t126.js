// UI round 2: focus rings, toast bottom-left beside the rail, busy buttons, heading scale, dark borders, icons, touch targets, calm delete
const { chromium } = require(require('./app.js').pw); const FILE = process.env.APP || require('./app.js').url;
const axe = require('fs').readFileSync(__dirname + '/axe/node_modules/axe-core/axe.min.js', 'utf8');
(async () => { const b = await chromium.launch(); const res = {};
  for (const theme of ['light', 'dark']) { const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: theme, acceptDownloads: true }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); const o = {};
  await p.addInitScript(() => { try { localStorage.setItem('stageplot.foldHint', '1'); } catch {} });
  await p.goto(FILE); await p.waitForTimeout(700); await p.click('#welcomeExample'); await p.waitForTimeout(400);
  await p.evaluate(() => { view = 'plot'; sel = { kind: 'item', id: plan.items.find(i => i.type === 'main_spk').id }; renderAll(); });
  await p.click('#iRotate'); await p.waitForTimeout(150);
  o.toast = await p.evaluate(() => { const t = document.querySelector('.toast'), r = t.getBoundingClientRect(), rail = document.querySelector('.rail').getBoundingClientRect(); return [Math.round(r.left), Math.round(rail.right), Math.round(innerHeight - r.bottom), t.textContent.trim().slice(0, 30)]; });
  o.delColour = await p.evaluate(() => [getComputedStyle($('iDel')).color, getComputedStyle($('iDel').querySelector('.ic') || $('iDel')).color]);
  await p.focus('#iRotate'); await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Tab'); o.ring = await p.evaluate(() => { const c = getComputedStyle(document.activeElement); return [document.activeElement.id, c.outlineStyle, c.boxShadow.slice(0, 30)]; });
  await p.screenshot({ path: `u2-${theme}-plot.png` });
  o.heads = await p.evaluate(() => { view = 'home'; homeTab = 'venues'; renderAll(); const a = getComputedStyle(document.querySelector('.hpage h2')).fontSize, c = getComputedStyle(document.querySelector('.hcard h3')).fontSize; $('helpDlg').hidden = false; const d = getComputedStyle(document.querySelector('#helpDlg h2')).fontSize; $('helpDlg').hidden = true; return [a, c, d]; });
  await p.evaluate(() => { view = 'plot'; renderAll(); }); await p.click('#moreBtn'); await p.waitForTimeout(150); o.icons = await p.evaluate(() => document.querySelector('[data-mm="present"]')?.innerHTML.includes('y="4" width="18"')); await p.keyboard.press('Escape');
  await p.evaluate(() => { view = 'paper'; paperTab = 'overview'; renderAll(); });
  const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 10000 }).catch(() => null), p.click('#printMore').then(() => p.click('#picBtn'))]);
  await p.waitForTimeout(100); o.busy = [!!dl, await p.evaluate(() => $('picBtn').classList.contains('busy') || $('picBtn').classList.contains('donebtn'))];
  await p.addScriptTag({ content: axe }); o.axe = await p.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'], rules: { region: { enabled: false } } })).violations.map(v => v.id + ' ' + v.nodes.map(n => n.target.join(' ')).slice(0, 2).join(' | ')));
  await p.evaluate(() => { view = 'plot'; sel = { kind: 'item', id: plan.items.find(i => i.type === 'main_spk').id }; renderAll(); }); o.axePlot = await p.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'], rules: { region: { enabled: false } } })).violations.map(v => v.id + ' ' + v.nodes.map(n => n.target.join(' ')).slice(0, 2).join(' | ')));
  o.errs = errs; res[theme] = o; await ctx.close(); }
  // touch
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }); const p = await ctx.newPage(); await p.goto(FILE); await p.waitForTimeout(700); await p.click('#welcomeExample'); await p.waitForTimeout(300);
  res.touch = await p.evaluate(() => { const s = [...document.querySelectorAll('.iconbtn')].filter(e => e.offsetParent).map(e => Math.round(Math.min(e.offsetWidth, e.offsetHeight))); return [Math.min(...s), document.documentElement.scrollWidth <= innerWidth]; });
  await p.screenshot({ path: 'u2-phone.png' });
  console.log(JSON.stringify(res, null, 1)); await b.close(); })();
