// Planning Center: no connector in view offers reload; a failed load offers Try again and recovers
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { window.claude = { use: async n => null }; });
  await p.goto(require('./app.js').url); await p.waitForTimeout(800); if (await p.isVisible('#welcomeDlg')) await p.click('#welcomeExample');
  await p.evaluate(() => { plan.team = []; view = 'plot'; railTab = 'team'; renderAll(); });
  console.log('null view', await p.evaluate(() => [!!$('pcoReload'), /claude\.ai/.test(document.querySelector('.rail').textContent)]));
  const q = await b.newPage({ viewport: { width: 1440, height: 900 } }); q.on('pageerror', e => errs.push(e.message));
  await q.addInitScript(() => { let fail = 2; const data = { services_service_types: { data: [{ id: '1', attributes: { name: 'Weekend' } }] }, services_plans: { data: [] } };
    window.claude = { use: async n => n === 'mcp' ? { callTool: async (s, t) => { if (fail > 0) { fail--; throw { code: 'needs_reauth', message: 'x' }; } return { payload: data[t] }; } } : null }; });
  await q.goto(require('./app.js').url); await q.waitForTimeout(800); if (await q.isVisible('#welcomeDlg')) await q.click('#welcomeExample');
  await q.evaluate(() => { plan.team = []; view = 'plot'; railTab = 'team'; renderAll(); });
  await q.click('#pcoStart'); await q.waitForTimeout(300);
  console.log('reauth msg', await q.evaluate(() => document.querySelector('.rail .err')?.textContent));
  await q.click('#pcoStart'); await q.waitForTimeout(300);
  await q.click('#pcoStart'); await q.waitForTimeout(300);
  console.log('recovers', await q.evaluate(() => [pco.types.length, pco.err]));
  console.log('errors', errs); await b.close(); })();
