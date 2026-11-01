// visual pass 2: speakers + coverage, gear badges, cable bundles, stage words outside, slim ruler, plug ends + RF marks, glide, aimed lights
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(400); await p.click('#welcomeExample'); await p.waitForTimeout(400);
await p.evaluate(() => document.querySelector('.toast')?.remove());
console.log('speakers', await p.evaluate(() => [document.querySelectorAll('#plot .s-wcone').length, document.querySelectorAll('#plot .s-cov').length]));
console.log('badges', await p.evaluate(() => [...document.querySelectorAll('.gbadge')].map(g => g.textContent)), 'tucked hidden', await p.evaluate(() => { const di = plan.items.find(i => i.type === 'di_mono' && i.personId); return !document.querySelector(`#plot .item[data-id="${di.id}"]`); }));
const bd = await p.$('.gbadge'); const bb = await bd.boundingBox(); await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.waitForTimeout(200);
console.log('badge opens', await p.evaluate(() => [cat(itemById(sel?.id) || {}).shape, document.querySelectorAll('.gbadge').length]));
await p.evaluate(() => { sel = null; renderAll(); });
console.log('stage words outside', await p.evaluate(() => [...document.querySelectorAll('.zone-out')].map(z => { const y = +z.getAttribute('y'), x = +z.getAttribute('x'); return `${z.textContent}:${y < 0 || y > plan.stage.d || x < 0 || x > plan.stage.w}`; }).join(' ')));
console.log('ruler', await p.evaluate(() => [document.querySelectorAll('.ruler line').length, [...document.querySelectorAll('.ruler text')].map(t => t.textContent).join(',')]));
console.log('plugs', await p.evaluate(() => document.querySelectorAll('#plot .plug').length), 'rf', await p.evaluate(() => document.querySelectorAll('#plot .rfmark').length));
// bundles: four runs side by side in the house
await p.evaluate(() => { const foh = plan.items.find(i => i.type === 'foh'), sb = plan.items.find(i => i.type === 'stagebox'); mutate(() => { for (let k = 0; k < 4; k++) addCable('cat6', sb.id, foh.id, { points: [[sb.x, plan.stage.d + 3], [foh.x, plan.stage.d + 3]] }); }); sel = null; renderAll(); });
console.log('bundle', await p.evaluate(() => [document.querySelectorAll('.bundle').length, [...document.querySelectorAll('.btag text')].map(t => t.textContent)]));
await p.evaluate(() => fit('room')); await p.waitForTimeout(300); await p.screenshot({ path: 't60-room.png' });
// glide
await p.evaluate(() => fit('stage')); await p.waitForTimeout(300);
const g = await p.evaluate(() => { const a = plan.items.find(i => i.type === 'gtr_amp'); mutate(() => { a.x += 4; }); const el = document.querySelector(`#plot .item[data-id="${a.id}"]`); return el.getAnimations().length; });
console.log('glide animations', g);
await p.waitForTimeout(400); console.log('settled', await p.evaluate(() => document.querySelector('#plot .item').getAnimations().length));
// light aimed at the stage
console.log('light aim', await p.evaluate(() => { addGear('light_stand', 4, plan.stage.d + 5); return itemById(sel.id).rot; }));
console.log('paper keeps everything', await p.evaluate(() => { const h = plotSnapshot(); return [!/gbadge/.test(h), !/class="bundle"/.test(h)]; }));
await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(200); console.log('phone overflow', await p.evaluate(() => document.documentElement.scrollWidth > innerWidth));
console.log('errors', errs); await b.close(); })();
