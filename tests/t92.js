// Planning Center: pick which teams to pull from (e.g. AV + Worship Team), remembered per service type
const { chromium } = require(require('./app.js').pw);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => {
    const row = (pid, name, pos, team, status = 'confirmed') => ({ attributes: { name, status, team_position_name: pos }, relationships: { person: { data: { id: pid } }, team: { data: { id: team } } } });
    const data = { services_service_types: { data: [{ id: '1', attributes: { name: 'Weekend' } }] }, services_plans: { data: [{ id: '9', attributes: { dates: '1 November 2026', sort_date: '2026-11-01T09:00:00Z', title: 'Week' } }] },
      services_plan_people: { data: [
        row('p1', 'Ana Drum', 'Drums', 'w'), row('p2', 'Ben Keys', 'Keys', 'w'), row('p3', 'Cara Lead', 'Worship Leader', 'w'),
        row('p4', 'Sam Sound', 'FOH Engineer', 'av'), row('p5', 'Lia Lights', 'Lighting', 'av'),
        row('p6', 'Andre Host', 'Service Host', 'host'), row('p3', 'Cara Lead', 'Big Group Teaching', 'kids'), row('p7', 'Petra Teach', 'Big Group Teaching', 'kids'),
        row('p8', 'Dee Door', 'Team Leader', 'welcome'), row('p2', 'Ben Keys', 'Usher', 'welcome') ],
        included: [{ type: 'Team', id: 'w', attributes: { name: 'Worship Team' } }, { type: 'Team', id: 'av', attributes: { name: 'AV' } }, { type: 'Team', id: 'host', attributes: { name: 'Hosting' } }, { type: 'Team', id: 'kids', attributes: { name: 'Kids' } }, { type: 'Team', id: 'welcome', attributes: { name: 'Welcome' } }], has_more: false } };
    window.claude = { use: async n => n === 'mcp' ? { callTool: async (s, t) => ({ payload: data[t] }) } : null };
  });
  await p.goto(require('./app.js').url); await p.waitForTimeout(600); if (await p.isVisible('#welcomeDlg')) await p.click('#welcomeExample');
  await p.click('#pcoStart'); await p.waitForTimeout(300); await p.click('#pcoRoster'); await p.waitForTimeout(300);
  const state = () => p.evaluate(() => [pco.roster.length, pco.roster.map(e => e.name.split(' ')[0] + (e.role ? ':' + e.role : '')).join(','), [...document.querySelectorAll('.tchip[aria-pressed="true"]')].map(b => b.textContent.trim()).join('|')]);
  console.log('chips', await p.evaluate(() => [...document.querySelectorAll('.tchip')].map(b => b.textContent.trim()).join(' / ')));
  console.log('all', await state());
  await p.click('.tchip[data-pcoteam="Worship Team"]'); await p.waitForTimeout(100);
  await p.click('.tchip[data-pcoteam="AV"]'); await p.waitForTimeout(100);
  console.log('worship+av', await state());
  console.log('ben not usher, cara not kids', await p.evaluate(() => [pco.roster.find(e => e.name === 'Ben Keys').positions.join(), pco.roster.find(e => e.name === 'Cara Lead').positions.join()]));
  console.log('picked', await p.evaluate(() => [pco.picked.size, [...pco.picked].every(k => pco.roster.some(e => e.key === k))]), 'button', await p.textContent('#pcoApply'));
  await p.click('.tchip[data-pcoteam="Kids"]'); await p.click('.tchip[data-pcoteam="Kids"]'); await p.waitForTimeout(100);
  console.log('toggle off', (await state())[2]);
  // remembered after reload, for this service type
  await p.reload(); await p.waitForTimeout(600); await p.evaluate(() => { view = 'plot'; railTab = 'team'; renderAll(); }); await p.click('#pcoStart'); await p.waitForTimeout(300); await p.click('#pcoRoster'); await p.waitForTimeout(300);
  console.log('remembered', await state());
  await p.click('#pcoApply'); await p.waitForTimeout(300);
  console.log('team on stage', await p.evaluate(() => plan.team.map(t => t.name.split(' ')[0] + ':' + t.role).join(',')));
  await p.evaluate(() => { railTab = 'team'; renderAll(); }); await p.click('#pcoStart').catch(() => {}); await p.waitForTimeout(300);
  await p.click('#pcoRoster').catch(() => {}); await p.waitForTimeout(300);
  await p.click('.tchip[data-pcoteam=""]'); await p.waitForTimeout(100); console.log('all again', (await state())[0]);
  await p.click('.tchip[data-pcoteam="Hosting"]'); await p.waitForTimeout(100); await p.screenshot({ path: 'teams.png', clip: { x: 0, y: 60, width: 320, height: 560 } });
  // hide teams with the hover ×
  await p.click('.tchip[data-pcoteam=""]'); await p.waitForTimeout(100);
  const op = async t => p.evaluate(t => getComputedStyle(document.querySelector(`.tchipx[data-pcohide="${t}"]`)).opacity, t);
  console.log('x hidden until hover', await op('Kids')); await p.hover('.tchip[data-pcoteam="Kids"]'); await p.waitForTimeout(250); console.log('x on hover', await op('Kids'));
  await p.click('.tchipx[data-pcohide="Kids"]'); await p.waitForTimeout(100);
  await p.hover('.tchip[data-pcoteam="Welcome"]'); await p.waitForTimeout(200); await p.click('.tchipx[data-pcohide="Welcome"]'); await p.waitForTimeout(100);
  console.log('after hiding', await p.evaluate(() => [[...document.querySelectorAll('.tchip[data-pcoteam]')].map(b => b.dataset.pcoteam).join('|'), pco.roster.length, pco.roster.some(e => e.name === 'Petra Teach' || e.name === 'Dee Door'), $('pcoShowHidden')?.textContent]));
  await p.reload(); await p.waitForTimeout(600); await p.evaluate(() => { view = 'plot'; railTab = 'team'; renderAll(); }); await p.click('#pcoStart'); await p.waitForTimeout(300); await p.click('#pcoRoster'); await p.waitForTimeout(300);
  console.log('hidden remembered', await p.evaluate(() => [pcoPrefs().hiddenTeams.join(), !document.querySelector('.tchip[data-pcoteam="Kids"]'), pco.roster.length]));
  await p.hover('.tchip[data-pcoteam="Worship Team"]'); await p.waitForTimeout(250); await p.screenshot({ path: 'teamsx.png', clip: { x: 20, y: 330, width: 280, height: 90 } });
  await p.click('#pcoShowHidden'); await p.waitForTimeout(100); await p.screenshot({ path: 'teams2.png', clip: { x: 0, y: 60, width: 320, height: 520 } });
  await p.click('[data-pcounhide="Kids"]'); await p.waitForTimeout(100);
  console.log('restored', await p.evaluate(() => [!!document.querySelector('.tchip[data-pcoteam="Kids"]'), pcoPrefs().hiddenTeams.join()]));
  await p.hover('.tchip[data-pcoteam="AV"]'); await p.waitForTimeout(200); await p.click('.tchipx[data-pcohide="AV"]'); await p.waitForTimeout(100); await p.click('.toast button'); await p.waitForTimeout(100);
  console.log('undo', await p.evaluate(() => [!!document.querySelector('.tchip[data-pcoteam="AV"]'), pcoPrefs().hiddenTeams.join()]));
  console.log('errors', errs); await b.close();
})();
