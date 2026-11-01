// next plan from Planning Center: new week, team and times in one click
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(() => { const row = (pid, name, pos, team) => ({ attributes: { name, status: 'C', team_position_name: pos }, relationships: { person: { data: { id: pid } }, team: { data: { id: team } } } });
  window.claude = { use: async n => n === 'mcp' ? { callTool: async (s, t, input) => {
    if (t === 'services_service_types') return { payload: { data: [{ id: '1', attributes: { name: 'Weekend' } }] } };
    if (t === 'services_plans') return { payload: { data: [['8', '2099-11-01', '1 November 2099'], ['9', '2099-11-08', '8 November 2099'], ['10', '2099-11-15', '15 November 2099']].map(([id, d, dates]) => ({ id, attributes: { dates, sort_date: d + 'T09:00:00Z' }, relationships: { plan_times: { data: [{ id: 's' + id }] } } })), included: ['8', '9', '10'].map(id => ({ type: 'PlanTime', id: 's' + id, attributes: { time_type: 'service', starts_at: `2099-11-0${id === '8' ? 1 : 8}T0${id === '10' ? 9 : 9}:${id === '9' ? '30' : '00'}:00` } })) } };
    return { payload: { data: input.plan_id === '9' ? [row('p1', 'Ana Drum', 'Drums', 'w'), row('p2', 'Ben Keys', 'Keys', 'w')] : [row('p3', 'Cara Lead', 'Worship Leader', 'w')], included: [{ type: 'Team', id: 'w', attributes: { name: 'Worship' } }] } }; } } : null }; });
await p.goto(require('./app.js').url); await p.waitForTimeout(600); if (await p.isVisible('#welcomeDlg')) await p.click('#welcomeExample');
await p.evaluate(() => { plan.date = '2099-11-01'; save(); view = 'plot'; renderAll(); });
await p.click('#weekBtn'); await p.waitForTimeout(150); console.log('button', await p.evaluate(() => !!$('newPco')));
const n0 = await p.evaluate(() => Object.keys(db.plans).length);
await p.click('#newPco'); await p.waitForTimeout(1200);
console.log('next', await p.evaluate(n0 => [plan.date, plan.team.map(t => t.name).join(), JSON.stringify(plan.times), Object.keys(db.plans).length - n0, plan.items.some(i => i.type === 'stagebox'), !!plan.pco], n0));
await p.evaluate(() => nextFromPco()); await p.waitForTimeout(1200);
console.log('then', await p.evaluate(() => [plan.date, plan.team.map(t => t.name).join()]));
await p.evaluate(() => nextFromPco()); await p.waitForTimeout(1200); console.log('none left', await p.evaluate(() => [plan.date, document.querySelector('.toast')?.textContent]));
console.log(errs); await b.close(); })();
