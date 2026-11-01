// UI round 5: sticky details header, sheet-tab fades and arrows, Copied on the button, drag a number's label
const { chromium } = require(require('./app.js').pw); const FILE = process.env.APP || require('./app.js').url;
const axe = require('fs').readFileSync(__dirname + '/axe/node_modules/axe-core/axe.min.js', 'utf8');
(async () => { const b = await chromium.launch(); const res = {};
  for (const theme of ['light', 'dark']) { const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: theme, permissions: ['clipboard-read', 'clipboard-write'] }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); const o = {};
  await p.clock.setFixedTime(new Date('2026-10-28T10:00:00'));
  await p.addInitScript(() => { try { localStorage.setItem('stageplot.foldHint', '1'); localStorage.setItem('stageplot.detail', 'adv'); } catch {} });
  await p.goto(FILE); await p.waitForTimeout(700); await p.click('#welcomeExample'); await p.waitForTimeout(400);
  // 1
  await p.evaluate(() => { view = 'plot'; sel = { kind: 'item', id: plan.items.find(i => i.type === 'main_spk').id }; renderAll(); document.querySelector('.inspector').scrollTo(0, 600); }); await p.waitForTimeout(150);
  o.sticky = await p.evaluate(() => { const h = document.querySelector('.insp-head').getBoundingClientRect(), i = document.querySelector('.inspector').getBoundingClientRect(); return Math.round(h.top - i.top); });
  await p.screenshot({ path: `u5-${theme}-sticky.png`, clip: { x: 1140, y: 60, width: 300, height: 300 } });
  // 7 scrub width
  await p.evaluate(() => { document.querySelector('.inspector').scrollTo(0, 0); }); const w0 = await p.evaluate(() => plan.items.find(i => i.type === 'main_spk').w ?? null);
  const lab = await p.$('label[for="iX"]'); const bb = await lab.boundingBox(); const h0 = await p.evaluate(() => history.length);
  const x0 = await p.evaluate(() => Number($('iX').value));
  await p.mouse.move(bb.x + 10, bb.y + bb.height / 2); await p.mouse.down(); await p.mouse.move(bb.x + 50, bb.y + bb.height / 2, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(150);
  o.scrub = await p.evaluate(([x0, h0]) => [x0, Number($('iX').value), history.length - h0], [x0, h0]);
  // 6 copied
  await p.evaluate(() => { view = 'paper'; paperTab = 'team'; renderAll(); }); await p.waitForTimeout(150);
  await p.click('#sec-team [data-copy]'); await p.waitForTimeout(200); o.copied = await p.evaluate(() => [document.querySelector('#sec-team [data-copy]').textContent.trim(), !!document.querySelector('.toast')]);
  await p.waitForTimeout(1700); o.copyBack = await p.evaluate(() => document.querySelector('#sec-team [data-copy]').textContent.trim());
  // 3 tabs at a narrower width
  await p.setViewportSize({ width: 820, height: 900 }); await p.waitForTimeout(200); await p.evaluate(() => { renderAll(); }); await p.waitForTimeout(300); 
  o.fades = await p.evaluate(() => { const d = document.querySelector('.docnav'); return [d.classList.contains('arr-l'), d.classList.contains('arr-r')]; });
  await p.click(o.fades[1] ? '.navarr.r' : '.navarr.l'); await p.waitForTimeout(600); o.fadesAfter = await p.evaluate(() => { const d = document.querySelector('.docnav'); return [d.classList.contains('arr-l'), d.classList.contains('arr-r')]; });
  await p.screenshot({ path: `u5-${theme}-tabs.png`, clip: { x: 0, y: 60, width: 820, height: 120 } });
  await p.addScriptTag({ content: axe }); o.axe = await p.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'], rules: { region: { enabled: false } } })).violations.map(v => v.id + ' ' + v.nodes.map(n => n.target.join(' ')).slice(0, 2).join(' | ')));
  o.errs = errs; res[theme] = o; await ctx.close(); }
  console.log(JSON.stringify(res)); await b.close(); })();
