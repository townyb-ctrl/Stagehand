// venues: migration, add, new week per venue, move a week, save/reset stage, library filter, paperwork, delete; logo in the header
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(400);
console.log('one venue', await p.evaluate(() => [venueList().length, venueList()[0].name, Object.values(db.plans).every(x => x.venueId === venueList()[0].id)]));
// an old library with no venues migrates on load
await p.evaluate(() => { const d = JSON.parse(localStorage.getItem(STORE)); delete d.venues; for (const x of Object.values(d.plans)) delete x.venueId; localStorage.setItem(STORE, JSON.stringify(d)); });
await p.reload(); await p.waitForTimeout(500);
console.log('migrated', await p.evaluate(() => [venueList().length, Object.values(db.plans).every(x => venues()[x.venueId])]));
await p.evaluate(() => goHome('venues')); await p.waitForTimeout(100);
await p.fill('#venueName', 'Next Gen Hall'); await p.click('#venueAdd button[type=submit]'); await p.waitForTimeout(150);
await p.fill('#venueName', 'Summer Camp'); await p.click('#venueAdd button[type=submit]'); await p.waitForTimeout(150);
console.log('venues', await p.evaluate(() => venueList().map(v => v.name).join(', ')));
await p.screenshot({ path: 'v11-venues.png' });
// make Next Gen a small stage, new week there
const ng = await p.evaluate(() => venueList().find(v => v.name === 'Next Gen Hall').id);
await p.evaluate(ng => { venues()[ng].stage.w = fromM(6); venues()[ng].stage.d = fromM(4); venues()[ng].stage.color = '#1d2943'; save(); renderHome(); }, ng);
await p.click(`[data-vnew="${ng}"]`); await p.waitForTimeout(300);
console.log('new week at NG', await p.evaluate(ng => [plan.venueId === ng, Math.round(toM(plan.stage.w)), plan.stage.color, $('wkName').textContent], ng));
console.log('arrows stay in venue', await p.evaluate(() => [$('prevWeek').disabled, venueWeekIds(plan.venueId).length]));
// move the week to the main stage via the week menu
await p.click('#weekBtn'); await p.waitForTimeout(100);
const main = await p.evaluate(() => venueList()[0].id);
await p.selectOption('#planVenue', main); await p.waitForTimeout(200);
console.log('moved', await p.evaluate(main => [plan.venueId === main, Math.round(toM(plan.stage.w))], main));
await p.evaluate(() => closePops());
// change the stage, save to venue, reset
await p.evaluate(() => { view = 'plot'; railTab = 'stage'; sel = null; mutate(() => { plan.stage.w = fromM(14); }); });
console.log('differs', await p.evaluate(() => !!document.querySelector('.venueline.differs')));
await p.click('[data-venue="save"]'); await p.waitForTimeout(100);
console.log('saved', await p.evaluate(() => [Math.round(toM(venueOf(plan).stage.w)), !document.querySelector('.venueline.differs')]));
await p.evaluate(() => { mutate(() => { plan.stage.w = fromM(9); }); }); await p.click('[data-venue="reset"]'); await p.waitForTimeout(100);
console.log('reset', await p.evaluate(() => Math.round(toM(plan.stage.w))));
// library filter
await p.evaluate(() => goHome('library')); await p.waitForTimeout(100);
console.log('chips', await p.evaluate(() => [...document.querySelectorAll('.vchip')].map(c => c.textContent).join(' | ')));
await p.click(`.vchip[data-libvenue="${ng}"]`); await p.waitForTimeout(100);
console.log('filtered rows', await p.evaluate(() => document.querySelectorAll('.librow').length));
await p.screenshot({ path: 'v11-lib.png' });
// paperwork names the venue
await p.evaluate(() => { view = 'paper'; paperTab = 'overview'; renderAll(); });
console.log('paper', await p.evaluate(() => [document.querySelector('.doc-head .eyebrow').textContent, document.querySelector('.titleblock .tb-cell b').textContent]));
// delete: blocked with weeks, allowed when empty
await p.evaluate(() => goHome('venues'));
const sc = await p.evaluate(() => venueList().find(v => v.name === 'Summer Camp').id);
console.log('main delete disabled', await p.evaluate(main => document.querySelector(`[data-vdel="${main}"]`).disabled, main));
await p.click(`[data-vdel="${sc}"]`); await p.click(`[data-vdel="${sc}"]`); await p.waitForTimeout(100);
console.log('deleted empty', await p.evaluate(sc => !venues()[sc], sc));
// backup carries venues
console.log('backup', await p.evaluate(() => Object.keys(JSON.parse(backup(true)).venues).length));
// logo shows in the header
await p.evaluate(() => { db.defaults = db.defaults || {}; db.defaults.logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='; renderAll(); });
console.log('logo', await p.evaluate(() => [!$('brandLogo').hidden, !!document.querySelector('.hellologo')]));
console.log('errors', errs); await b.close(); })();
