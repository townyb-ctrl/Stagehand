// menus and panels keep their scroll position when an item is picked or ticked
const { chromium } = require(require('./app.js').pw); const FILE = process.env.APP || require('./app.js').url;
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 640 } }); const errs = []; p.on('pageerror', e => errs.push(e.message)); const o = {};
  await p.clock.setFixedTime(new Date('2026-10-28T10:00:00'));
  await p.addInitScript(() => { try { localStorage.setItem('stageplot.foldHint', '1'); localStorage.setItem('stageplot.detail', 'adv'); } catch {} });
  await p.goto(FILE); await p.waitForTimeout(700); await p.click('#welcomeExample'); await p.waitForTimeout(400);
  const keep = async (name, scrollSel, act) => { try { const t0 = await p.evaluate(s => { const el = document.querySelector(s); el.scrollTop = Math.round((el.scrollHeight - el.clientHeight) * .8); return el.scrollTop; }, scrollSel); await act(); await p.waitForTimeout(250); const t1 = await p.evaluate(s => document.querySelector(s)?.scrollTop, scrollSel); o[name] = [t0, t1, t0 > 0 && Math.abs(t0 - t1) < 12]; } catch (e) { o[name] = 'ERR ' + e.message.split('\n')[0]; } };
  // Layers menu: tick a view
  await p.evaluate(() => { view = 'plot'; renderAll(); }); await p.click('#cabBtn'); await p.waitForTimeout(150);
  await keep('layers', '.cabmenu', () => p.evaluate(() => { const b = [...document.querySelectorAll('.cabmenu button, .cabmenu input')].pop(); b.click(); }));
  await p.keyboard.press('Escape');
  // inspector: change a field near the bottom of a long panel
  await p.evaluate(() => { sel = { kind: 'item', id: plan.items.find(i => i.type === 'main_spk').id }; renderAll(); });
  await keep('inspector', '.inspector', () => p.evaluate(() => { const r = $('iRot'); r.value = 45; r.dispatchEvent(new Event('change', { bubbles: true })); }));
  // rail: gear list, pick a category
  await p.evaluate(() => { sel = null; railTab = 'gear'; renderAll(); });
  await keep('rail', '.railbody', () => p.evaluate(() => { const c = document.querySelectorAll('.railbody [data-gcat], .railbody .gcat button, .railbody button'); c[3]?.click(); }));
  // week popover
  await p.click('#weekBtn'); await p.waitForTimeout(150);
  await keep('weekpop', '#weekPop', () => p.evaluate(() => { const i = $('wkName') ; const x = document.querySelector('#weekPop input[type="time"]'); if (x) { x.value = '09:00'; x.dispatchEvent(new Event('change', { bubbles: true })); } }));
  await p.keyboard.press('Escape');
  // paperwork: tick a load-in box far down the page
  await p.evaluate(() => { view = 'paper'; paperTab = 'loadin'; renderAll(); });
  await p.evaluate(() => { $('paperView').style.scrollBehavior = 'auto'; }); await keep('loadin', '#paperView', () => p.evaluate(() => { const c = [...document.querySelectorAll('#sec-loadin input[type="checkbox"]')]; const el = c[c.length - 3]; el.click(); }));
  // print menu tick
  await p.evaluate(() => { paperTab = 'inputs'; renderAll(); $('paperView').scrollTo(0, 0); }); await p.click('#printMore'); await p.waitForTimeout(150);
  await keep('printpop', '.printpop', () => p.evaluate(() => document.querySelector('[data-psheet="team"]').click()));
  // Home pages: change a setting low on the page
  await p.keyboard.press('Escape');
  await p.evaluate(() => { view = 'home'; homeTab = 'gear'; renderAll(); });
  await keep('homegear', '#homeView', () => p.evaluate(() => { const c = [...document.querySelectorAll('#homeView input[type="number"]')]; const el = c[Math.floor(c.length * .7)]; el.value = 2; el.dispatchEvent(new Event('change', { bubbles: true })); }));
  await p.evaluate(() => { homeTab = 'prefs'; renderAll(); });
  await keep('homeprefs', '#homeView', () => p.evaluate(() => { const c = [...document.querySelectorAll('#homeView [data-pref]')]; c[c.length - 1].click(); }));
  await p.evaluate(() => { view = 'paper'; renderAll(); });
  // switching sheet tab still starts at the top
  await p.evaluate(() => { $('paperView').scrollTo(0, 800); }); await p.keyboard.press('Escape'); await p.evaluate(() => document.querySelector('[data-ptab="team"]').click()); await p.waitForTimeout(250);
  o.newTabTop = await p.evaluate(() => $('paperView').scrollTop);
  o.errs = errs; console.log(JSON.stringify(o)); await b.close(); })();
