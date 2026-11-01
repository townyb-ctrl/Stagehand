const { chromium } = require(require('./app.js').pw); const fs = require('fs');
const axe = fs.readFileSync(__dirname + '/axe/node_modules/axe-core/axe.min.js', 'utf8');
(async () => { const b = await chromium.launch(); const out = {};
for (const scheme of ['light', 'dark']) {
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: scheme });
await p.goto(require('./app.js').url); await p.waitForTimeout(600);
const run = async (label) => { await p.addScriptTag({ content: axe }); const r = await p.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'], rules: { 'region': { enabled: false } } })).violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, ex: v.nodes.slice(0, 16).map(x => x.target.join(' ') + ' :: ' + (x.failureSummary || '').split('\n')[1]) }))); out[scheme + ':' + label] = r; };
await run('welcome');
await p.click('#welcomeExample'); await p.waitForTimeout(400); await p.evaluate(() => document.querySelector('.toast')?.remove());
await run('home');
await p.evaluate(() => { sel = { kind: 'item', id: plan.items.find(i => i.type === 'stagebox').id }; renderAll(); }); await run('item');
await p.mouse.move(2, 2); await p.evaluate(() => { sel = null; railTab = 'gear'; renderAll(); $('hoverCard').hidden = true; }); await p.waitForTimeout(300); await run('gear');
await p.click('#vPaper'); await p.waitForTimeout(300); await run('paper');
await p.close(); }
console.log(JSON.stringify(out, null, 1)); await b.close(); })();
