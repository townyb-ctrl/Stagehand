// Planning Center change check (declined / added on chosen teams) and photos
const { chromium } = require(require('./app.js').pw);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => {
    const row = (pid, name, pos, team, status = 'C', photo) => ({ attributes: { name, status, team_position_name: pos, photo_thumbnail: photo || `https://avatars.planningcenteronline.com/uploads/initials/XX.png` }, relationships: { person: { data: { id: pid } }, team: { data: { id: team } } } });
    const inc = [{ type: 'Team', id: 'w', attributes: { name: 'Worship Team' } }, { type: 'Team', id: 'k', attributes: { name: 'Kids' } }];
    const v1 = [row('p1', 'Ana Drum', 'Drums', 'w', 'C', 'https://avatars.planningcenteronline.com/uploads/person/1-1/avatar.2.jpg?g=224x224%23'), row('p2', 'Ben Keys', 'Keys', 'w'), row('p3', 'Cara Lead', 'Worship Leader', 'w'), row('p9', 'Kim Kid', 'Gr 4-7', 'k')];
    const v2 = [row('p1', 'Ana Drum', 'Drums', 'w'), row('p2', 'Ben Keys', 'Keys', 'w', 'D'), row('p3', 'Cara Lead', 'Worship Leader', 'w'), row('p4', 'Sam Sing', 'Vocals', 'w'), row('p8', 'Kat Kids', 'Gr 4-7', 'k')];
    window.__v = 1;
    window.claude = { use: async n => n === 'mcp' ? { callTool: async (s, t, input) => {
      if (t === 'services_service_types') return { payload: { data: [{ id: '1', attributes: { name: 'Weekend' } }] } };
      if (t === 'services_plans') return { payload: { data: [{ id: '9', attributes: { dates: '8 November 2099', sort_date: '2099-11-08T09:00:00Z', title: 'Week' } }] } };
      const rows = (Number(localStorage.getItem('mockv') || 1) === 1 ? v1 : v2).filter(r => !(input.filter || []).includes('not_declined') || r.attributes.status !== 'D');
      return { payload: { data: rows, included: inc } }; } } : null };
  });
  await p.goto(require('./app.js').url); await p.waitForTimeout(600); if (await p.isVisible('#welcomeDlg')) await p.click('#welcomeExample');
  await p.click('#pcoStart'); await p.waitForTimeout(300); await p.click('#pcoRoster'); await p.waitForTimeout(300);
  await p.click('.tchip[data-pcoteam="Worship Team"]'); await p.waitForTimeout(100); await p.click('#pcoApply'); await p.waitForTimeout(400);
  console.log('imported', await p.evaluate(() => [plan.team.map(t => t.name.split(' ')[0]).join(), !!plan.pco, plan.team.filter(t => t.photo).length]));
  console.log('photo shown', await p.evaluate(() => document.querySelectorAll('.rail .avatar img.pphoto').length));
  console.log('no card yet', await p.evaluate(() => !document.querySelector('.pcochg')));
  // Planning Center changes: Ben declines, Sam joins Worship Team, Kat joins Kids (not a chosen team)
  await p.evaluate(() => localStorage.setItem('mockv', '2'));
  await p.reload(); await p.waitForTimeout(900); await p.evaluate(() => { view = 'plot'; railTab = 'team'; renderAll(); }); await p.waitForTimeout(300);
  console.log('card', await p.evaluate(() => document.querySelector('.pcochg')?.textContent.replace(/\s+/g, ' ').trim()));
  await p.click('#pcoChgApply'); await p.waitForTimeout(300);
  console.log('updated', await p.evaluate(() => [plan.team.map(t => t.name.split(' ')[0]).join(), plan.items.some(i => i.type === 'person' && personById(i.personId)?.name === 'Sam Sing'), !document.querySelector('.pcochg')]));
  // dismissing is remembered
  await p.evaluate(() => { localStorage.setItem('mockv', '1'); }); await p.evaluate(() => pcoCheck(true)); await p.waitForTimeout(300);
  console.log('new change card', await p.evaluate(() => !!document.querySelector('.pcochg')));
  await p.click('#pcoChgSkip'); await p.evaluate(() => pcoCheck(true)); await p.waitForTimeout(300);
  console.log('not now sticks', await p.evaluate(() => !document.querySelector('.pcochg')));
  // past weeks are never checked
  console.log('past week skipped', await p.evaluate(async () => { plan.date = '2020-01-05'; plan.pco.dismissed = ''; await pcoCheck(true); return !document.querySelector('.pcochg'); }));
  // broken photo falls back to initials
  console.log('bad photo removed', await p.evaluate(async () => { plan.date = '2099-11-08'; plan.team[0].photo = 'https://invalid.example/x.jpg'; renderRail(); await new Promise(r => setTimeout(r, 1500)); return document.querySelectorAll('.rail .avatar img.pphoto').length; }));
  console.log('good photo shown', await p.evaluate(async () => { plan.team[0].photo = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="red"/></svg>'); renderRail(); await new Promise(r => setTimeout(r, 400)); const i = document.querySelector('.rail .avatar img.pphoto'); return !!i && i.complete && i.naturalWidth > 0; }));
  console.log('errors', errs); await b.close();
})();
