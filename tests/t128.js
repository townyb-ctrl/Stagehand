// UI round 4: back chip, person hover, rename inputs, print preview, drag focus, ruler cursor, week swipe, team reorder
const { chromium } = require(require('./app.js').pw); const FILE = process.env.APP || require('./app.js').url;
const axe = require('fs').readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
(async () => { const b = await chromium.launch(); const res = {};
  for (const theme of ['light', 'dark']) { const p = await b.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: theme }); const errs = []; p.on('pageerror', e => errs.push(e.message)); const o = {};
  await p.clock.setFixedTime(new Date('2026-10-28T10:00:00'));
  await p.addInitScript(() => { try { localStorage.setItem('stageplot.foldHint', '1'); } catch {} });
  await p.goto(FILE); await p.waitForTimeout(700); await p.click('#welcomeExample'); await p.waitForTimeout(400);
  // 2 hover a person
  await p.evaluate(() => { view = 'plot'; railTab = 'team'; sel = null; renderAll(); });
  await p.hover('.person[data-pid] >> nth=2'); await p.waitForTimeout(150);
  o.hover = await p.evaluate(() => [hoverPid && personById(hoverPid).name, $('plot').classList.contains('focusing')]);
  await p.screenshot({ path: `u4-${theme}-hover.png` });
  await p.mouse.move(700, 450); await p.waitForTimeout(150); await p.mouse.move(720, 460); await p.waitForTimeout(150);
  // 6 ruler cursor
  o.ruler = await p.evaluate(() => [...document.querySelectorAll('#rulCur text')].map(t => t.textContent));
  o.unhover = await p.evaluate(() => [hoverPid, $('plot').classList.contains('focusing')]);
  await p.screenshot({ path: `u4-${theme}-ruler.png`, clip: { x: 340, y: 230, width: 800, height: 200 } });
  // 5 drag focus
  const box = await (await p.$('#plot .item.is-person')).boundingBox(); await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await p.mouse.down(); await p.mouse.move(box.x + 60, box.y + 40, { steps: 6 });
  o.dragDim = await p.evaluate(() => [document.body.classList.contains('dragging-gear'), getComputedStyle(document.querySelector('.rail')).opacity]); await p.mouse.up(); await p.waitForTimeout(100);
  o.dropped = await p.evaluate(() => document.body.classList.contains('dragging-gear')); await p.evaluate(() => undo());
  // 8 reorder team
  const before = await p.evaluate(() => plan.team.map(t => t.name.split(' ')[0]).join(','));
  await p.dragAndDrop('.person[data-pid] >> nth=0', '.person[data-pid] >> nth=2', { targetPosition: { x: 40, y: 40 } }); await p.waitForTimeout(150);
  o.reorder = [before, await p.evaluate(() => plan.team.map(t => t.name.split(' ')[0]).join(','))];
  // 1 + 3 rename and back chip
  await p.evaluate(() => { view = 'paper'; paperTab = 'inputs'; renderAll(); $('paperView').scrollTo(0, 300); }); await p.waitForTimeout(200);
  await p.click('#sec-inputs [data-inedit] >> nth=1'); await p.fill('.ineditbox', 'Kick Sub'); await p.keyboard.press('Enter'); await p.waitForTimeout(150);
  o.renamed = await p.evaluate(() => { const r = inputSheet().find(x => /Kick Sub/.test(x.name)); return r && [r.name, r.ch]; });
  o.chBefore = await p.evaluate(() => 2);
  await p.click('#sec-inputs tr[data-showitem] >> nth=4'); await p.waitForTimeout(250);
  o.chip = await p.evaluate(() => [view, $('backChip')?.textContent]); await p.screenshot({ path: `u4-${theme}-chip.png`, clip: { x: 340, y: 60, width: 800, height: 120 } });
  await p.click('#backChip'); await p.waitForTimeout(250); o.back = await p.evaluate(() => [view, paperTab, Math.round($('paperView').scrollTop), !!$('backChip')]);
  // 4 print preview
  await p.click('#printMore'); await p.waitForTimeout(150); await p.hover('.printpop [data-ppv="inputs"]'); await p.waitForTimeout(200);
  o.preview = await p.evaluate(() => [$('ppPreview').classList.contains('on'), $('ppPreview').querySelector('h2')?.textContent]);
  await p.screenshot({ path: `u4-${theme}-preview.png`, clip: { x: 650, y: 230, width: 790, height: 520 } });
  await p.addScriptTag({ content: axe }); o.axe = await p.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'], rules: { region: { enabled: false } } })).violations.map(v => v.id + ' ' + v.nodes.map(n => n.target.join(' ')).slice(0, 2).join(' | ')));
  await p.keyboard.press('Escape');
  await p.evaluate(() => { view = 'plot'; railTab = 'team'; renderAll(); }); o.axePlot = await p.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'], rules: { region: { enabled: false } } })).violations.map(v => v.id + ' ' + v.nodes.map(n => n.target.join(' ')).slice(0, 2).join(' | ')));
  o.errs = errs; res[theme] = o; await p.close(); }
  // 7 swipe
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }); const p = await ctx.newPage(); await p.clock.setFixedTime(new Date('2026-10-28T10:00:00'));
  await p.goto(FILE); await p.waitForTimeout(700); await p.click('#welcomeExample'); await p.waitForTimeout(300);
  const d0 = await p.evaluate(() => plan.date); const r = await (await p.$('#weekBtn')).boundingBox();
  await p.evaluate(([x, y]) => { const el = $('weekBtn'), T = (cx) => new Touch({ identifier: 1, target: el, clientX: cx, clientY: y }); el.dispatchEvent(new TouchEvent('touchstart', { touches: [T(x)], changedTouches: [T(x)], bubbles: true })); el.dispatchEvent(new TouchEvent('touchend', { touches: [], changedTouches: [T(x - 120)], bubbles: true, cancelable: true })); }, [r.x + r.width / 2, r.y + r.height / 2]);
  await p.waitForTimeout(300); res.swipe = [d0, await p.evaluate(() => plan.date)];
  console.log(JSON.stringify(res, null, 1)); await b.close(); })();
