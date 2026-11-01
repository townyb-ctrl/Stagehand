const { chromium } = require(require('./app.js').pw);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.addInitScript(() => {
    const T = (n, id) => ({ type: 'Team', id, attributes: { name: n } });
    const pp = (id, name, st, pos, team, person) => ({ type: 'PlanPerson', id, attributes: { name, status: st, team_position_name: pos, photo_thumbnail: 'https://people.planningcenteronline.com/static/no_photo_thumbnail_man_gray.svg' }, relationships: { person: { data: { type: 'Person', id: person } }, team: { data: { type: 'Team', id: team } } } });
    let connected = false; window.__urls = [];
    window.stageplotDesktop = { platform: 'darwin', version: '1.0.0', pco: {
      status: async () => ({ connected }),
      connect: async (id, secret) => secret === 'good' ? (connected = true, { ok: true }) : { error: { code: 'bad_key' } },
      disconnect: async () => { connected = false; return { ok: true }; },
      get: async url => { window.__urls.push(url);
        if (/service_types\?/.test(url)) return { json: { data: [{ type: 'ServiceType', id: '1', attributes: { name: 'Worship Events' } }, { type: 'ServiceType', id: '2', attributes: { name: 'Weekend Services (AM)' } }], meta: {} } };
        if (/\/plans\?/.test(url)) return { json: { data: [{ type: 'Plan', id: '77', attributes: { dates: '1 November 2026', sort_date: '2026-11-01T07:00:00Z', title: null }, relationships: { plan_times: { data: [{ type: 'PlanTime', id: 't1' }] } } }], included: [{ type: 'PlanTime', id: 't1', attributes: { starts_at: '2026-11-01T15:00:00Z', ends_at: '2026-11-01T16:00:00Z', time_type: 'service', name: null } }], meta: {} } };
        if (/team_members/.test(url) && !/offset=/.test(url)) return { json: { data: [pp('a', 'Dana Keys', 'C', 'Keys', '10', 'p1'), pp('b', 'Eli Drums', 'U', 'Drums', '10', 'p2')], included: [T('Band', '10')], meta: { next: { offset: 2 } } } };
        if (/team_members/.test(url)) return { json: { data: [pp('c', 'Fay Sound', 'C', 'Front of House', '11', 'p3')], included: [T('Production', '11')], meta: {} } };
        return { error: { code: 'tool_error', message: 'HTTP 404' } };
      } } };
  });
  await p.goto(require('./app.js').url); await p.waitForTimeout(600); if (await p.isVisible('#welcomeDlg')) await p.click('#welcomeExample');
  await p.waitForTimeout(300);
  await p.click('#brandHome'); await p.click('[data-home="pco"]'); await p.waitForTimeout(200);
  console.log('status before', (await p.textContent('.pcostatus')).replace(/\s+/g, ' ').trim());
  console.log('form', await p.isVisible('#hp-keyid'), await p.isVisible('#hp-keysecret'), await p.getAttribute('#hp-keysecret', 'type'));
  await p.fill('#hp-keyid', 'abc'); await p.fill('#hp-keysecret', 'bad'); await p.click('#hp-connect'); await p.waitForTimeout(300);
  console.log('bad key', await p.textContent('.err'));
  await p.fill('#hp-keyid', 'abc'); await p.fill('#hp-keysecret', 'good'); await p.click('#hp-connect'); await p.waitForTimeout(600);
  console.log('status after', (await p.textContent('.pcostatus')).replace(/\s+/g, ' ').trim(), '| disconnect btn', await p.isVisible('#hp-disconnect'));
  // import on the week
  await p.evaluate(() => { db.pcoPrefs.replace = true; });
  await p.evaluate(() => { const b = document.querySelector('[data-home="library"]'); b && b.click(); });
  await p.evaluate(() => { view = 'plot'; railTab = 'team'; renderAll(); });
  if (await p.isVisible('#pcoStart')) await p.click('#pcoStart'); await p.waitForTimeout(600);
  console.log('plans', await p.$$eval('#pcoPlan option', o => o.map(x => x.textContent)));
  await p.click('#pcoRoster'); await p.waitForTimeout(600);
  console.log('roster', await p.evaluate(() => pco.roster.map(e => e.name + (e.unconfirmed ? ':unc' : '')).join(', ')));
  await p.click('#pcoApply'); await p.waitForTimeout(400);
  console.log('eli', await p.evaluate(() => JSON.stringify(plan.team.find(x => x.name === 'Eli Drums'))));
  console.log('team', await p.evaluate(() => plan.team.map(x => `${x.name}:${x.role}${x.unconfirmed ? ':unc' : ''}`).join(', ')));
  console.log('urls', JSON.stringify(await p.evaluate(() => window.__urls)));
  await p.click('#brandHome'); await p.click('[data-home="pco"]'); await p.click('#hp-disconnect'); await p.waitForTimeout(300);
  console.log('after disconnect', (await p.textContent('.pcostatus')).replace(/\s+/g, ' ').trim());
  console.log('errors', errs);
  await b.close();
})();
