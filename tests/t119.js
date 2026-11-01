// desk front (audience) view: picks, axe, remembered, phone
const { chromium } = require(require('./app.js').pw); const FILE = process.env.APP || require('./app.js').url;
const axe = require('fs').readFileSync(__dirname + '/axe/node_modules/axe-core/axe.min.js', 'utf8');
(async () => { const b = await chromium.launch(); const res = {};
  for (const theme of ['light', 'dark']) { const p = await b.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: theme }); await p.addInitScript({ path: __dirname + '/moodshim.js' }); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.addInitScript(() => { try { localStorage.setItem('stageplot.deskTips', '1'); } catch {} });
    await p.goto(FILE); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300);
    await p.evaluate(() => { const w = plan.stage.w, d = plan.stage.d; addGear('light_desk', w / 2, d + 14); addGear('truss', w / 2, 3); itemById(sel.id).w = w * .8; for (let k = 0; k < 4; k++) { addGear('par_led', w * (.25 + k * .15), 3); itemById(sel.id).rot = 180; } addGear('bar_up', w * .3, .5); sel = null; save(); openDesk(); moodLook('Calm'); deskSel = new Set(); renderDesk(); document.querySelectorAll('.toast').forEach(t => t.remove()); });
    await p.click('[data-dview="front"]'); await p.waitForTimeout(200);
    const n = await p.$$eval('.lf-fx', e => e.length); await p.click('.lf-fx >> nth=1'); const picked = await p.evaluate(() => deskPicked().map(itemName));
    await p.addScriptTag({ content: axe }); const v = await p.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'], rules: { region: { enabled: false } } })).violations.map(v => v.id + ' ' + v.nodes.map(n => n.target.join(' ')).join(' | ')));
    await p.reload(); await p.waitForTimeout(600); const kept = await p.evaluate(() => { openDesk(); return [desk.view, !!document.querySelector('#ldFront')]; });
    await p.setViewportSize({ width: 390, height: 844 }); await p.evaluate(() => renderDesk()); await p.waitForTimeout(200); const fits = await p.evaluate(() => { const d = document.querySelector('.ldesk'); return d.scrollWidth <= d.clientWidth + 1; });
    res[theme] = { lights: n, picked, axe: v, kept, fits, errs }; await p.close(); }
  console.log(JSON.stringify(res, null, 1)); await b.close(); })();
