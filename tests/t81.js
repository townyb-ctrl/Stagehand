// UX pass: no fold hint over the first-run designer; no "Ready" without a team; blank Add person rows don't count; size inputs explain themselves; long item names fit
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(600);
await p.click('#welcomeDraw'); await p.waitForTimeout(900);
console.log('no hint over designer', await p.evaluate(() => !/fold into number badges/.test(document.querySelector('.toast')?.textContent || '')));
await p.click('#dsgSave'); await p.waitForTimeout(700);
console.log('status before team', await p.evaluate(() => $('checksBtn').textContent.trim()));
await p.click('#addPerson'); await p.waitForTimeout(150);
await p.evaluate(() => { document.querySelector('details.paste').open = true; });
await p.fill('#bulk', 'Sam Lee - Worship Leader\nJo Park, Drums'); await p.click('#bulkAdd'); await p.waitForTimeout(200);
console.log('team after paste', await p.evaluate(() => plan.team.map(t => t.name || '(blank)').join(', ')));
await p.click('#addPerson'); await p.waitForTimeout(100); await p.click('#buildBtn'); await p.waitForTimeout(1500);
console.log('blank dropped on build', await p.evaluate(() => plan.team.length), 'status', await p.evaluate(() => $('checksBtn').textContent.trim()));
await p.evaluate(() => { railTab = 'stage'; sel = null; renderAll(); document.querySelectorAll('.toast').forEach(t => t.remove()); });
for (const v of ['0', '-5', '999', 'abc']) { await p.evaluate(v => { const e = $('isw'); e.value = v; e.dispatchEvent(new Event('change', { bubbles: true })); }, v); await p.waitForTimeout(120);
  console.log('width', v, '->', await p.evaluate(() => [Math.round(toM(plan.stage.w) * 10) / 10, $('isw').value, (document.querySelector('.toast:last-child') || document.querySelector('.toast'))?.textContent?.trim() || ''])); await p.evaluate(() => document.querySelectorAll('.toast').forEach(t => t.remove())); }
await p.evaluate(() => { mutate(() => { plan.stage.w = fromM(10); }); const it = plan.items.find(i => cat(i).shape !== 'person' && cat(i).shape !== 'platform'); it.label = 'Sam Lee acoustic DI box'; sel = { kind: 'item', id: it.id }; renderAll(); });
await p.waitForTimeout(100); console.log('long title', await p.evaluate(() => { const e = $('iLabel'); return [e.className, e.rows, e.scrollHeight <= e.clientHeight + 2, e.value]; }));
await p.click('#iLabel'); await p.keyboard.press('Control+a'); await p.keyboard.type('Sam Lee DI');
await p.keyboard.press('Enter'); await p.waitForTimeout(150);
console.log('rename by Enter', await p.evaluate(() => itemById(sel.id).label));
console.log('errors', errs); await b.close(); })();
