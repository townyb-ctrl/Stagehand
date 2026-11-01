// curved seating, house vignette (screen only), paperwork tables: zebra rows, right-aligned lengths, header stays in view
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const errs = [];
for (const theme of ['light', 'dark']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: theme }); p.on('pageerror', e => errs.push(e.message));
  await p.goto(require('./app.js').url); await p.waitForTimeout(400); await p.click('#welcomeExample'); await p.waitForTimeout(400);
  await p.evaluate(t => { setTheme(t); document.querySelector('.toast')?.remove(); fit('room'); }, theme); await p.waitForTimeout(300);
  console.log(theme, await p.evaluate(() => { const r = [...document.querySelectorAll('#plot .seats rect')]; const rot = r.filter(x => /rotate\((?!0 )/.test(x.getAttribute('transform') || '')).length; const foh = plan.items.find(i => i.type === 'foh'), [a, c] = halfExt(foh);
    const under = r.filter(x => { const X = +x.getAttribute('x'), Y = +x.getAttribute('y'); return X > foh.x - a && X < foh.x + a && Y > foh.y - c && Y < foh.y + c; }).length;
    return { seats: r.length, turned: rot, underFoh: under, vignette: !!document.querySelector('#plot .vignette'), paperNoVignette: !/vignette/.test(plotSnapshot()) }; }));
  await p.screenshot({ path: `v2-room-${theme}.png` }); await p.close();
}
const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(400); await p.click('#welcomeExample'); await p.waitForTimeout(300);
await p.evaluate(require('./rich.js')); await p.evaluate(() => { view = 'paper'; paperTab = 'cables'; renderAll(); document.querySelector('.toast')?.remove(); });
await p.waitForTimeout(200);
console.log('zebra', await p.evaluate(() => { const rows = document.querySelectorAll('#sec-cables tbody tr'); return getComputedStyle(rows[1].querySelector('td')).backgroundColor !== getComputedStyle(rows[0].querySelector('td')).backgroundColor; }), 'length right', await p.evaluate(() => [...document.querySelectorAll('#sec-cables tbody td')].find(t => / m$/.test(t.textContent)) && getComputedStyle([...document.querySelectorAll('#sec-cables tbody td')].find(t => / m$/.test(t.textContent))).textAlign));
await p.evaluate(() => { paperTab = 'inputs'; renderPaper(); }); await p.waitForTimeout(200);
await p.evaluate(() => { const pv = $('paperView'), t = document.querySelector('#sec-inputs table'); pv.scrollTo({ top: pv.scrollTop + t.getBoundingClientRect().top - pv.getBoundingClientRect().top + 300, behavior: 'instant' }); });   // well past the table's start await p.waitForTimeout(250);
console.log('header in view', await p.evaluate(() => { const th = document.querySelector('#sec-inputs thead th').getBoundingClientRect(), nav = document.querySelector('.docnav').getBoundingClientRect(); return th.bottom > nav.bottom + 8 && th.top < nav.bottom + 4; }));
await p.screenshot({ path: 'v2-table.png' });
await p.emulateMedia({ media: 'print' }); console.log('print header static', await p.evaluate(() => getComputedStyle(document.querySelector('#sec-inputs thead th')).position));
console.log('errors', errs); await b.close(); })();
