const { chromium } = require(require('./app.js').pw);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => {
    const data = {
      services_service_types: { data: [{ id: '1', attributes: { name: 'Weekend Services (AM)' } }] },
      services_plans: { data: [{ id: '9', attributes: { dates: '11 October 2026', sort_date: '2026-10-11T09:00:00Z', title: 'Ephesians - Part 4' } }] },
      services_plan_people: { data: [
        { attributes: { name: 'Ana Drum', status: 'confirmed', team_position_name: 'Drums' }, relationships: { person: { data: { id: 'p1' } }, team: { data: { id: 't1' } } } },
        { attributes: { name: 'Ben Keys', status: 'unconfirmed', team_position_name: 'Keys' }, relationships: { person: { data: { id: 'p2' } }, team: { data: { id: 't1' } } } },
        { attributes: { name: 'Ben Keys', status: 'confirmed', team_position_name: 'Vocals' }, relationships: { person: { data: { id: 'p2' } }, team: { data: { id: 't1' } } } },
        { attributes: { name: 'Cara Lead', status: 'confirmed', team_position_name: 'Worship Leader' }, relationships: { person: { data: { id: 'p3' } }, team: { data: { id: 't1' } } } },
        { attributes: { name: 'Dee Door', status: 'confirmed', team_position_name: 'Team Leader' }, relationships: { person: { data: { id: 'p4' } }, team: { data: { id: 't2' } } } },
      ], included: [{ type: 'Team', id: 't1', attributes: { name: 'Band' } }, { type: 'Team', id: 't2', attributes: { name: 'Welcome Team' } }], has_more: false } };
    window.claude = { use: async n => n === 'mcp' ? { callTool: async (s, t) => ({ payload: data[t] }) } : null };
  });
  await p.goto(require('./app.js').url); await p.waitForTimeout(600); if (await p.isVisible('#welcomeDlg')) await p.click('#welcomeExample');
  await p.click('#pcoStart'); await p.waitForTimeout(300); await p.click('#pcoRoster'); await p.waitForTimeout(300);
  console.log(await p.textContent('.roster'));
  await p.screenshot({ path: 'pco.png' });
  await p.click('#pcoApply'); await p.waitForTimeout(300);
  console.log('team', await p.evaluate(() => JSON.stringify(plan.team.map(t => [t.name, t.role, t.sings]))), await p.evaluate(() => plan.date + ' ' + plan.name));
  await p.screenshot({ path: 'after.png' });
  await p.click('#vPaper'); await p.waitForTimeout(300); await p.screenshot({ path: 'paper2.png', fullPage: false });
  console.log('errors', errs); await b.close();
})();
