// audit fixes: phone details panel, socket tags that don't pile up, a performer's channels and mix, title block, setup guide, church card in Preferences
const { chromium, devices } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const errs = []; const url = require('./app.js').url;
const mk = async o => { const c = await b.newContext(o); const p = await c.newPage(); p.on('pageerror', e => errs.push(e.message)); await p.goto(url); await p.waitForTimeout(500); return p; };
let p = await mk({ viewport: { width: 1440, height: 900 } }); await p.click('#welcomeExample'); await p.waitForTimeout(300); await p.evaluate(() => document.querySelector('.toast')?.remove());
const pick = t => p.evaluate(t => { const it = plan.items.find(i => i.type === t); sel = { kind: 'item', id: it.id }; renderAll(); }, t);
await pick('stagebox'); await p.waitForTimeout(200);
const tags = await p.evaluate(() => { const g = [...document.querySelectorAll('#plot .socktag')], bx = g.map(x => x.querySelector('rect').getBoundingClientRect()); let hit = 0; for (let i = 0; i < bx.length; i++) for (let k = i + 1; k < bx.length; k++) if (bx[i].left < bx[k].right && bx[i].right > bx[k].left && bx[i].top < bx[k].bottom && bx[i].bottom > bx[k].top) hit++; return { n: g.length, hit, txt: g.map(x => x.textContent).join(' | '), ptags: document.querySelectorAll('#plot .ptag').length }; });
console.log('tags', JSON.stringify(tags), tags.n > 3 && !tags.hit && /In 1–9/.test(tags.txt) && !tags.ptags ? 'OK' : 'FAIL');
await pick('person'); await p.waitForTimeout(200);
const per = await p.evaluate(() => ({ label: document.querySelector('label[for=iPerson]').textContent, tiles: document.querySelectorAll('#inspector .patchpanel .ptile').length, heads: [...document.querySelectorAll('#inspector .patchpanel h3')].map(h => h.textContent.trim()).join(',') }));
console.log('person', JSON.stringify(per), per.label === 'Who stands here' && per.tiles >= 2 && /Channels/.test(per.heads) && /Monitor mix/.test(per.heads) ? 'OK' : 'FAIL');
await p.click('#inspector .patchpanel .ptile'); await p.waitForTimeout(200); console.log('tile picks the source', await p.evaluate(() => cat(itemById(sel.id)).shape !== 'person') ? 'OK' : 'FAIL');
await p.click('#vPaper'); await p.waitForTimeout(400);
const tb = await p.evaluate(() => [...document.querySelectorAll('.tb-cell b')].filter(x => x.scrollWidth > x.clientWidth + 1).length);
const crop = await p.evaluate(() => { const vb = document.querySelector('#sec-overview .snap').getAttribute('viewBox').split(' ').map(Number), m = plan.items.find(i => i.type === 'main_spk'); return m.y + halfExt(m)[1] < vb[1] + vb[3]; });
console.log('title block cut-offs', tb, tb === 0 ? 'OK' : 'FAIL', '· mains in the picture', crop ? 'OK' : 'FAIL');
await p.click('#vHome'); await p.click('[data-home="prefs"]'); console.log('church in prefs', await p.isVisible('#hd-org') && await p.isVisible('#hd-contact') ? 'OK' : 'FAIL');
await p.click('[data-home="venues"]'); console.log('new weeks in venues', await p.isVisible('#hd-day') && !(await p.$('#hd-org')) ? 'OK' : 'FAIL');
await p.click('[data-home="gear"]'); console.log('gear page', await p.isVisible('#gf-open') && !(await p.$('#hd-teamgear')) ? 'OK' : 'FAIL');
// a fresh stage with starter gear: only Stage is ticked
p = await mk({ viewport: { width: 1440, height: 900 } }); await p.click('#welcomeDraw'); await p.click('#dsgSave'); await p.waitForTimeout(400);
const g = await p.evaluate(() => [...document.querySelectorAll('#inspector .gstep, #inspector [data-step], #inspector .step')].map(x => x.classList.contains('done')));
const ticks = await p.evaluate(() => document.querySelectorAll('#inspector .done').length);
console.log('guide ticks after starter gear', ticks, ticks === 1 ? 'OK' : 'FAIL', '· foh pointer in Simple', await p.evaluate(() => !$('ffoh').hidden) ? 'OK' : 'FAIL');
// phone
p = await mk({ ...devices['iPhone 13'] }); await p.tap('#welcomeExample'); await p.waitForTimeout(500); await p.evaluate(() => document.querySelector('.toast')?.remove());
const r = await p.evaluate(() => { const it = plan.items.find(i => i.type === 'stagebox'); const q = document.querySelector(`[data-id="${it.id}"]`).getBoundingClientRect(); return [q.x + q.width / 2, q.y + q.height / 2]; });
await p.touchscreen.tap(r[0], r[1]); await p.waitForTimeout(400);
const ph = await p.evaluate(() => { const i = $('inspector'), s = getComputedStyle(i), q = $('fquick').getBoundingClientRect(); return { vis: s.display !== 'none' && s.visibility === 'visible' && i.getBoundingClientRect().height > 100, tiles: i.querySelectorAll('.ptile').length, strip: q.height > 40 && q.width > 300, small: [...document.querySelectorAll('.top button, #ftools button, .tabs [role=tab], #fquick button')].filter(e => e.offsetParent).filter(e => { const r = e.getBoundingClientRect(); return r.width < 42 || r.height < 42; }).length, over: document.documentElement.scrollWidth > innerWidth }; });
console.log('phone', JSON.stringify(ph), ph.vis && ph.tiles > 10 && ph.strip && !ph.small && !ph.over ? 'OK' : 'FAIL');
await p.tap('[data-insp-show]'); await p.waitForTimeout(900); console.log('details scrolls into view', await p.evaluate(() => $('inspector').getBoundingClientRect().top < innerHeight / 2) ? 'OK' : 'FAIL');
console.log('errors', JSON.stringify(errs)); await b.close(); })();
