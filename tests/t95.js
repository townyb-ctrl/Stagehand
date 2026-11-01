// roster position fix, where gear lives, cable stock, plan ahead, tidy old weeks, times in the Planning Center check
const { chromium } = require(require('./app.js').pw);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => {
    const row = (pid, name, pos, team) => ({ attributes: { name, status: 'C', team_position_name: pos }, relationships: { person: { data: { id: pid } }, team: { data: { id: team } } } });
    window.__saved = []; window.claude = { use: async n => n === 'downloads' ? { save: async r => { window.__saved.push(r); return { status: 'saved' }; } } : n === 'mcp' ? { callTool: async (s, t) => {
      const v = localStorage.getItem('mockv') || '1';
      if (t === 'services_service_types') return { payload: { data: [{ id: '1', attributes: { name: 'Weekend' } }] } };
      if (t === 'services_plans') return { payload: { data: [{ id: '9', attributes: { dates: '8 November 2099', sort_date: '2099-11-08T09:00:00Z' }, relationships: { plan_times: { data: [{ id: 'a' }, { id: 'b' }] } } }],
        included: [{ type: 'PlanTime', id: 'a', attributes: { time_type: 'rehearsal', starts_at: v === '1' ? '2099-11-08T07:30:00' : '2099-11-08T07:45:00' } }, { type: 'PlanTime', id: 'b', attributes: { time_type: 'service', starts_at: v === '1' ? '2099-11-08T09:00:00' : '2099-11-08T09:30:00' } }] } };
      return { payload: { data: [row('p1', 'Ana Drum', 'Drums', 'w'), row('p7', 'Petra Teach', 'Big Group Teaching Jr', 'k')], included: [{ type: 'Team', id: 'w', attributes: { name: 'Worship' } }, { type: 'Team', id: 'k', attributes: { name: 'Sunday School' } }] } }; } } : null };
  });
  await p.addInitScript(() => { try { if (!sessionStorage.getItem('advSet')) { localStorage.setItem('stageplot.detail', 'adv'); sessionStorage.setItem('advSet', '1'); } } catch {} });   // these check Advanced-level tools
await p.goto(require('./app.js').url); await p.waitForTimeout(600); if (await p.isVisible('#welcomeDlg')) await p.click('#welcomeExample');
  await p.evaluate(() => { plan.date = '2099-11-08'; save(); });
  // 1. fix a position from the roster
  await p.click('#pcoStart'); await p.waitForTimeout(300); await p.click('#pcoRoster'); await p.waitForTimeout(300);
  const petra = () => p.evaluate(() => { const e = pco.roster.find(e => e.name === 'Petra Teach'); return [e.role, pco.picked.has(e.key)]; });
  console.log('petra guessed', await petra());
  await p.click('[data-pcomapopen="p7"]'); await p.waitForTimeout(100);
  console.log('select open', await p.evaluate(() => [document.activeElement?.dataset?.pcomap, [...document.querySelector('[data-pcomap]').options].slice(0, 2).map(o => o.textContent).join(' | ')]));
  await p.selectOption('[data-pcomap]', '-'); await p.waitForTimeout(150);
  console.log('petra after', await petra(), 'saved', await p.evaluate(() => pcoPrefs().map['Big Group Teaching Jr · Sunday School']));
  await p.click('#pcoApply'); await p.waitForTimeout(400);
  console.log('team', await p.evaluate(() => plan.team.map(t => t.name).join()), 'times', await p.evaluate(() => JSON.stringify(plan.times)));
  // 8. times moved in Planning Center
  await p.evaluate(() => localStorage.setItem('mockv', '2')); await p.evaluate(() => pcoCheck(true)); await p.waitForTimeout(300);
  console.log('times card', await p.evaluate(() => document.querySelector('.pcochg')?.textContent.replace(/\s+/g, ' ').trim()));
  await p.click('#pcoChgApply'); await p.waitForTimeout(200); console.log('times now', await p.evaluate(() => JSON.stringify(plan.times)), 'team kept', await p.evaluate(() => plan.team.length));
  // 2. where gear lives
  await p.evaluate(() => { goHome('gear'); }); await p.waitForTimeout(200);
  await p.fill('#hw-wedge', 'Cupboard B'); await p.dispatchEvent('#hw-wedge', 'change'); await p.fill('#hw-gtr_amp', 'Cupboard B'); await p.dispatchEvent('#hw-gtr_amp', 'change'); await p.fill('#hw-di_mono', 'Trailer'); await p.dispatchEvent('#hw-di_mono', 'change');
  await p.evaluate(() => { db.gear.owned.wedge = 3; mutate(() => { for (const [t, x] of [['wedge', 5], ['wedge', 8], ['gtr_amp', 12], ['di_mono', 14]]) plan.items.push({ id: uid(), type: t, x, y: 14 }); }); });
  console.log('from storage', await p.evaluate(() => fromStorage().map(x => `${x.text}: ${x.sub}`).join(' / ')));
  console.log('loadin group', await p.evaluate(() => { view = 'paper'; paperTab = 'loadin'; renderAll(); return [document.querySelector('.lgroup h3')?.textContent.trim().slice(0, 14), document.querySelector('.storelist')?.textContent.includes('Cupboard B')]; }));
  // 3. cable stock
  await p.evaluate(() => goHome('gear')); await p.waitForTimeout(150);
  const need = await p.evaluate(() => pullList().filter(r => r.type === 'xlr' && !r.label).map(r => `${r.len}:${r.n}`).join(' '));
  console.log('xlr needed', need);
  await p.evaluate(() => { const g = gearPrefs(); g.cables = {}; const rows = pullList().filter(r => r.type === 'xlr' && !r.label); for (const r of rows) g.cables[cableKey('xlr', r.len)] = r.n; const big = rows.sort((a, b) => b.len - a.len)[0]; g.cables[cableKey('xlr', big.len)] = big.n - 1; save(); });
  console.log('short by one', await p.evaluate(() => JSON.stringify(cableShort())), 'warn', await p.evaluate(() => warnings().some(w => /than you own/.test(w.msg))));
  await p.evaluate(() => { const g = gearPrefs(), rows = pullList().filter(r => r.type === 'xlr' && !r.label), sm = rows.sort((a, b) => a.len - b.len)[0], big = rows.sort((a, b) => b.len - a.len)[0]; g.cables[cableKey('xlr', big.len)] = big.n; g.cables[cableKey('xlr', sm.len)] = sm.n - 1; const L = CABLES.xlr.stock.filter(l => l > sm.len && !rows.some(r => r.len === l))[0]; if (L) g.cables[cableKey('xlr', L)] = 1; save(); });
  console.log('longer spare covers', await p.evaluate(() => cableShort().length));
  console.log('pull list own col', await p.evaluate(() => { view = 'paper'; paperTab = 'cables'; renderAll(); return [...document.querySelectorAll('#sec-cables th')].map(t => t.textContent).join(','); }));
  // 4. plan ahead
  await p.evaluate(() => { view = 'plot'; renderAll(); }); await p.click('#weekBtn'); await p.waitForTimeout(200);
  const n0 = await p.evaluate(() => Object.keys(db.plans).length);
  await p.selectOption('#aheadN', '3'); await p.click('#aheadGo'); await p.waitForTimeout(200);
  console.log('ahead', await p.evaluate(n0 => [Object.keys(db.plans).length - n0, Object.values(db.plans).filter(w => w.date > plan.date).map(w => w.date).sort().join(','), Object.values(db.plans).filter(w => w.date > plan.date).every(w => !w.pco && !w.loadin && w.team.length === plan.team.length)], n0));
  await p.click('#weekBtn').catch(() => {}); await p.evaluate(() => { $('weekPop').hidden = false; renderWeekPop(); }); await p.click('#aheadGo'); await p.waitForTimeout(150);
  console.log('again adds only the new one', await p.evaluate(n0 => Object.keys(db.plans).length - n0, n0), await p.evaluate(() => document.querySelector('.toast')?.textContent.slice(0, 80)));
  // 7. tidy old weeks
  await p.evaluate(() => { for (const [k, d] of [['o1', '2020-01-05'], ['o2', '2021-03-07']]) db.plans[k] = { ...JSON.parse(JSON.stringify(plan)), id: k, date: d }; save(); $('weekPop').hidden = true; goHome('data'); });
  await p.waitForTimeout(150); console.log('tidy button', await p.textContent('#tidyGo'));
  await p.evaluate(() => { window.__realSave = dlCap.save; dlCap = { save: async () => { throw { code: 'declined' }; } }; }); await p.click('#tidyGo'); await p.waitForTimeout(300);
  console.log('declined keeps them', await p.evaluate(() => !!db.plans.o1 && !!db.plans.o2), await p.evaluate(() => document.querySelector('.toast')?.textContent.slice(0, 40)));
  await p.evaluate(() => { dlCap = { save: async r => { window.__saved.push(r); return { status: 'saved' }; } }; }); await p.click('#tidyGo'); await p.waitForTimeout(300);
  console.log('backup then removed', await p.evaluate(() => [window.__saved.at(-1)?.filename, /2020-01-05/.test(window.__saved.at(-1)?.data || ''), !db.plans.o1 && !db.plans.o2 && !!db.plans[plan.id]]));
  console.log('errors', errs); await b.close();
})();
