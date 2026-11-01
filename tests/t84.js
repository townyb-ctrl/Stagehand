// name suggestions, floor marks, stays in storage, plot picture, hover size
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
// floor marks
console.log('floor', await p.evaluate(() => { view = 'paper'; paperTab = 'floor'; renderAll(); const s = $('sec-floor'); return [getComputedStyle(s).display, s.querySelectorAll('tbody tr').length, floorMarks().length > 3, !!document.querySelector('[data-ptab="floor"]')]; }));
console.log('floor sorted', await p.evaluate(() => { const f = floorMarks(); return f.every((m, k) => !k || f[k - 1].back <= m.back); }));
console.log('riser corner', await p.evaluate(() => { const m = floorMarks().find(m => m.riser); return m ? !!m.size : 'none'; }));
// storage
console.log('storage', await p.evaluate(() => { (db.gear ||= { hidden: [], owned: {} }).owned = { wedge: 9, drum_kit: 0 }; save(); paperTab = 'loadin'; renderAll(); return [inStorage().map(x => x.t + x.left).join(), !!document.querySelector('#sec-loadin .storelist li')]; }));
// name suggestions
const r = await p.evaluate(() => { const nm = plan.team.find(t => t.name && t.role); const old = { name: nm.name, role: nm.role };
  return old; });
await p.evaluate(() => { const src = plan; const nid = uid(); db.plans[nid] = { ...JSON.parse(JSON.stringify(src)), id: nid, date: '2099-01-04', team: [] }; switchWeek(nid); view = 'plot'; railTab = 'team'; renderAll(); });
console.log('datalist', await p.evaluate(() => $('pastPeople').options.length > 0));
await p.click('#addPerson'); await p.waitForTimeout(150);
const inp = await p.$('.rail input[data-f="name"]'); await inp.fill(r.name); await inp.dispatchEvent('change'); await p.waitForTimeout(150);
console.log('role filled', await p.evaluate(n => plan.team.find(t => t.name === n)?.role, r.name) === r.role);
// hover card size
console.log('picture fn', await p.evaluate(() => typeof plotPicture === 'function'));
console.log('errors', errs); await b.close(); })();
