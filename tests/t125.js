// UI: home intros fold, sticky tabs, slim paper header, saved status, rename, tooltips, radii, view fade
const { chromium } = require(require('./app.js').pw); const FILE = process.env.APP || require('./app.js').url;
const axe = require('fs').readFileSync(__dirname + '/axe/node_modules/axe-core/axe.min.js', 'utf8');
(async () => { const b = await chromium.launch(); const res = {};
  for (const theme of ['light', 'dark']) { const p = await b.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: theme }); const errs = []; p.on('pageerror', e => errs.push(e.message)); const o = {};
  await p.addInitScript(() => { try { localStorage.setItem('stageplot.foldHint', '1'); } catch {} });
  await p.goto(FILE); await p.waitForTimeout(700); await p.click('#welcomeExample'); await p.waitForTimeout(400);
  // 1
  await p.evaluate(() => { view = 'home'; homeTab = 'venues'; renderAll(); }); await p.waitForTimeout(250); o.more = await p.$$eval('.hmore', e => e.length); await p.screenshot({ path: `ui-${theme}-1.png`, clip: { x: 440, y: 80, width: 840, height: 440 } });
  // 4
  o.saved = await p.evaluate(() => { view = 'plot'; renderAll(); const e = $('savedInd'); return e && getComputedStyle(e).visibility + ' ' + getComputedStyle(e).opacity + ' ' + e.textContent; });
  // 6
  await p.hover('#undoBtn'); await p.waitForTimeout(600); o.tip = await p.evaluate(() => [!document.querySelector('.tip').hidden, document.querySelector('.tip').textContent, $('undoBtn').hasAttribute('title')]);
  await p.screenshot({ path: `ui-${theme}-6.png`, clip: { x: 1100, y: 0, width: 340, height: 140 } });
  await p.mouse.move(700, 500); await p.waitForTimeout(100); o.tipBack = await p.evaluate(() => [document.querySelector('.tip').hidden, $('undoBtn').hasAttribute('title')]);
  // 5
  await p.dblclick('#weekBtn'); await p.waitForTimeout(150); o.renameOpen = await p.isVisible('.wkrename'); await p.fill('.wkrename', 'Easter Sunday'); await p.keyboard.press('Enter'); await p.waitForTimeout(150);
  o.renamed = await p.evaluate(() => [plan.name, $('wkName').textContent, !$('weekPop').hidden]);
  await p.evaluate(() => undo()); o.undo = await p.evaluate(() => plan.name);
  // 2 + 3
  await p.evaluate(() => { view = 'paper'; paperTab = 'inputs'; renderAll(); }); await p.waitForTimeout(300); await p.screenshot({ path: `ui-${theme}-3.png` });
  await p.evaluate(() => $('paperView').scrollTo(0, 900)); await p.waitForTimeout(250); o.sticky = await p.evaluate(() => Math.round(document.querySelector('.docnav').getBoundingClientRect().top)); await p.screenshot({ path: `ui-${theme}-2.png` });
  await p.addScriptTag({ content: axe }); o.axe = await p.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'], rules: { region: { enabled: false } } })).violations.map(v => v.id + ' ' + v.nodes.map(n => n.target.join(' ')).slice(0, 2).join(' | ')));
  await p.evaluate(() => { view = 'home'; homeTab = 'venues'; renderAll(); }); o.axeHome = await p.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'], rules: { region: { enabled: false } } })).violations.map(v => v.id + ' ' + v.nodes.map(n => n.target.join(' ') + ' ' + (n.any[0]?.message||'').slice(0,120)).join(' | ')));
  o.errs = errs; res[theme] = o; await p.close(); }
  console.log(JSON.stringify(res, null, 1)); await b.close(); })();
