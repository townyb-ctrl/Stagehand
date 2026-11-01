// UI round 3: folds remembered, compact density default, Everything contents, paperwork rows open the plot, empty sheets
const { chromium } = require(require('./app.js').pw); const FILE = process.env.APP || require('./app.js').url;
const axe = require('fs').readFileSync(__dirname + '/axe/node_modules/axe-core/axe.min.js', 'utf8');
(async () => { const b = await chromium.launch(); const res = {};
  for (const theme of ['light', 'dark']) { const p = await b.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: theme }); const errs = []; p.on('pageerror', e => errs.push(e.message)); const o = {};
  await p.clock.setFixedTime(new Date('2026-10-28T10:00:00'));
  await p.addInitScript(() => { try { localStorage.setItem('stageplot.foldHint', '1'); } catch {} });
  await p.goto(FILE); await p.waitForTimeout(700); await p.click('#welcomeExample'); await p.waitForTimeout(400);
  // 5 density
  o.compact = await p.evaluate(() => [document.documentElement.dataset.density || 'compact', Math.round(document.querySelector('.person').getBoundingClientRect().height)]);
  // 4 folds
  await p.evaluate(() => { sel = { kind: 'item', id: plan.items.find(i => /mic/.test(i.type)).id }; renderAll(); }); await p.click('details.more > summary'); await p.waitForTimeout(100);
  await p.reload(); await p.waitForTimeout(700); o.fold = await p.evaluate(() => { view = 'plot'; sel = { kind: 'item', id: plan.items.find(i => /mic/.test(i.type)).id }; renderAll(); return document.querySelector('details.more')?.open; });
  // 6 contents
  await p.evaluate(() => { view = 'paper'; paperTab = 'all'; sel = null; renderAll(); }); await p.waitForTimeout(250);
  o.toc = await p.$$eval('#allToc button', e => e.map(x => x.textContent)); await p.click('#allToc button >> nth=4'); await p.waitForTimeout(700);
  o.jump = await p.evaluate(() => Math.round(document.getElementById(document.querySelectorAll('#allToc button')[4].dataset.tocgo).getBoundingClientRect().top)); await p.screenshot({ path: `u3-${theme}-toc.png` });
  await p.addScriptTag({ content: axe }); o.axeAll = await p.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'], rules: { region: { enabled: false } } })).violations.map(v => v.id + ' ' + v.nodes.map(n => n.target.join(' ')).slice(0, 2).join(' | ')));
  // 7 click-through
  await p.evaluate(() => { paperTab = 'inputs'; renderAll(); $('paperView').scrollTo(0, 0); }); await p.waitForTimeout(150);
  o.rows = await p.$$eval('#sec-inputs tr[data-showitem]', e => e.length); await p.click('#sec-inputs tr[data-showitem] >> nth=2'); await p.waitForTimeout(250);
  o.went = await p.evaluate(() => [view, sel?.kind, itemName(itemById(sel?.id))]);
  o.errs = errs; res[theme] = o; await p.close(); }
  console.log(JSON.stringify(res, null, 1)); await b.close(); })();
