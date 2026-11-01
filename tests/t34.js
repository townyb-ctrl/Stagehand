const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(300); await p.evaluate(() => fit('room')); await p.waitForTimeout(150);
console.log('guesses', await p.evaluate(() => { const f = t => plan.items.find(i => i.type === t); const mk = t => ({ type: t, id: 'x' + t }); return [
  guessCable(f('vox_mic'), f('stagebox')), guessCable(f('distro'), f('gtr_amp')), guessCable(f('stagebox'), f('foh')), guessCable(mk('el_guitar'), f('gtr_amp')), guessCable(f('midi_keys'), f('usb_if')), guessCable(mk('camera'), mk('foh')), guessCable(f('wedge'), f('stagebox'))].join(','); }));
// run a cable by hand with Auto: guitar amp → distro gives power
await p.evaluate(() => { mutate(() => { addItem('el_guitar', 14, 26); addItem('gtr_amp', 22, 26); }); });
await p.click('[data-mode="cable"]');
console.log('auto default', await p.evaluate(() => cableType), 'chip', await p.evaluate(() => !!document.querySelector('[data-ctype="auto"][aria-pressed="true"]')));
const pos = id => p.evaluate(id => { const it = itemById(id), m = svg.getScreenCTM(); return { x: it.x * m.a + m.e, y: it.y * m.d + m.f }; }, id);
const g = await p.evaluate(() => plan.items.find(i => i.type === 'el_guitar').id), amp = await p.evaluate(() => plan.items.filter(i => i.type === 'gtr_amp').pop().id);
const a = await pos(g), c = await pos(amp);
await p.mouse.click(a.x, a.y); await p.mouse.move(c.x, c.y, { steps: 4 });
console.log('preview note', await p.evaluate(() => [...document.querySelectorAll('.cablen')].map(t => t.textContent).find(t => t.includes(' to '))));
const nc = await p.evaluate(() => plan.cables.length); await p.mouse.click(c.x, c.y);
console.log('added', await p.evaluate(n => plan.cables.length - n, nc), 'made', await p.evaluate(() => plan.cables[plan.cables.length - 1].type), 'toast', await p.evaluate(() => document.querySelector('.toast')?.textContent));
console.log('errors', errs); await b.close(); })();
