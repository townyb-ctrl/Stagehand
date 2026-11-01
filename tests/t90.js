// Planning Center roster: ticking or unticking someone keeps the list where it was scrolled, and keeps focus
const { chromium } = require(require('./app.js').pw);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => {
    const roles = ['Drums', 'Keys', 'Vocals', 'Bass', 'Electric Guitar', 'Host', 'Team Leader'];
    const people = Array.from({ length: 38 }, (_, k) => ({ attributes: { name: `Person ${k + 1} Test`, status: k % 3 ? 'confirmed' : 'unconfirmed', team_position_name: roles[k % roles.length] }, relationships: { person: { data: { id: 'p' + k } }, team: { data: { id: 't1' } } } }));
    const data = { services_service_types: { data: [{ id: '1', attributes: { name: 'Weekend' } }] }, services_plans: { data: [{ id: '9', attributes: { dates: '1 November 2026', sort_date: '2026-11-01T09:00:00Z', title: 'Week' } }] },
      services_plan_people: { data: people, included: [{ type: 'Team', id: 't1', attributes: { name: 'Band' } }], has_more: false } };
    window.claude = { use: async n => n === 'mcp' ? { callTool: async (s, t) => ({ payload: data[t] }) } : null };
  });
  await p.goto(require('./app.js').url); await p.waitForTimeout(600); if (await p.isVisible('#welcomeDlg')) await p.click('#welcomeExample');
  await p.click('#pcoStart'); await p.waitForTimeout(300); await p.click('#pcoRoster'); await p.waitForTimeout(300);
  const info = await p.evaluate(() => { const r = document.querySelector('.roster'); return [r.scrollHeight > r.clientHeight, document.querySelectorAll('.roster input').length]; });
  console.log('roster scrolls', info);
  await p.evaluate(() => { document.querySelector('.roster').scrollTop = 600; }); await p.waitForTimeout(100);
  const before = await p.evaluate(() => document.querySelector('.roster').scrollTop);
  const box = await p.evaluate(() => { const r = document.querySelector('.roster').getBoundingClientRect(); const i = [...document.querySelectorAll('.roster input')].find(i => { const b = i.getBoundingClientRect(); return b.top > r.top + 20 && b.bottom < r.bottom - 20; }); return i.id; });
  const n0 = await p.evaluate(() => pco.picked.size);
  await p.click('#' + box.replace(/[^a-zA-Z0-9_-]/g, c => '\\' + c)); await p.waitForTimeout(150);
  console.log('untick keeps scroll', await p.evaluate(([b, n0]) => [Math.abs(document.querySelector('.roster').scrollTop - b) < 2, pco.picked.size !== n0], [before, n0]), 'focus kept', await p.evaluate(id => document.activeElement?.id === id, box));
  await p.keyboard.press('Space'); await p.waitForTimeout(150);
  console.log('space re-ticks in place', await p.evaluate(([b, n0]) => [Math.abs(document.querySelector('.roster').scrollTop - b) < 2, pco.picked.size === n0], [before, n0]));
  console.log('errors', errs); await b.close();
})();
