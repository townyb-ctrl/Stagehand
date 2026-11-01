// one colour per person everywhere, setup guide line + pop, checks chip wording and hover preview
const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(require('./app.js').url); await p.waitForTimeout(400); await p.click('#welcomeExample'); await p.waitForTimeout(400);
await p.evaluate(() => { document.querySelector('.toast')?.remove(); const d = plan.items.find(i => i.type === 'distro'); mutate(() => { plan.cables = plan.cables.filter(c => c.type !== 'power' || !(c.from === d.id || c.to === d.id)); }); document.querySelector('.toast')?.remove(); });
console.log('colours', await p.evaluate(() => plan.team.map(t => { const a = [...document.querySelectorAll('.rail .avatar.hued')].find(x => x.textContent === initials(t.name)); const pi = plan.items.find(i => i.personId === t.id && cat(i).shape === 'person'); const disc = document.querySelector(`#plot .item[data-id="${pi.id}"] .c-person`); return `${initials(t.name)} rail:${a ? getComputedStyle(a).getPropertyValue('--hue') : '-'} plot:${disc ? getComputedStyle(disc).stroke : ''} blob:${personHue(t.id)}`; })));
console.log('chip', await p.evaluate(() => $('checksBtn').textContent.trim()));
await p.hover('#checksBtn'); await p.waitForTimeout(250);
console.log('peek visible', await p.evaluate(() => getComputedStyle(document.querySelector('.chkpeek')).opacity));
await p.screenshot({ path: 'y-peek.png', clip: { x: 296, y: 64, width: 560, height: 260 } });
await p.screenshot({ path: 'y-full.png' });
await p.evaluate(() => { guideSeen = new Set(); renderInspector(); }); console.log("guide", await p.evaluate(() => [document.querySelectorAll(".steps li").length, document.querySelectorAll(".steps li.pop").length > 0, getComputedStyle(document.querySelector(".steps li"), "::before").content]));
console.log("errors", errs); await b.close(); })();
