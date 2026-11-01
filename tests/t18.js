const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(200);
// stash an old plan containing removed gear, then reload
await p.evaluate(() => { const d = JSON.parse(localStorage.getItem('stageplot.v1')); const pl = d.plans[d.currentId]; pl.items.push({ id: 'vv', type: 'violin', x: 5, y: 5 }); pl.cables.push({ id: 'cv', type: 'xlr', from: 'vv', to: pl.items[0].id }); localStorage.setItem('stageplot.v1', JSON.stringify(d)); });
await p.reload(); await p.waitForTimeout(600);
console.log('violin gone', await p.evaluate(() => !plan.items.some(i => i.id === 'vv') && !plan.cables.some(c => c.id === 'cv')));
await p.evaluate(() => mutate(() => { plan.items = plan.items.filter(i => !['main_spk', 'sub'].includes(i.type)); addGear('la_main', 3, 22); addGear('la_main', 30, 22); addGear('la_sub', 9, 22); addGear('la_sub', 24, 22); addGear('wedge', 10, 16); addGear('sub', 16.5, 22); autoCable(); }));
console.log('LA cables', await p.evaluate(() => plan.cables.filter(c => ['la_main', 'la_sub'].includes(itemById(c.to)?.type) || ['la_main', 'la_sub'].includes(itemById(c.from)?.type)).map(c => c.type + ':' + (c.level || 'floor'))));
console.log('mics tab', await p.evaluate(() => GEAR_GROUPS.find(g => g[0] === 'Mics & DI')[1].join(',')), 'inst', await p.evaluate(() => GEAR_GROUPS.find(g => g[0] === 'Instruments')[1].join(',')));
await p.evaluate(() => { sel = null; renderAll(); }); await p.screenshot({ path: 'n-la.png', clip: { x: 380, y: 300, width: 700, height: 420 } });
console.log('errors', errs); await b.close(); })();
