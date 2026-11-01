// random interactions everywhere; any page error is a bug
const { chromium } = require(require('./app.js').pw);
const seed = Number(process.argv[2] || 1), N = Number(process.argv[3] || 500);
let x = seed; const rnd = () => (x = (x * 16807) % 2147483647) / 2147483647, pick = a => a[Math.floor(rnd() * a.length)];
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ viewport: pick([[1440, 900], [1024, 768], [400, 860]]).reduce((w, h) => ({ width: w, height: h })), acceptDownloads: true }); const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push(e.message + ' @ ' + (e.stack || '').split('\n')[1])); p.on('dialog', d => d.dismiss()); p.on('filechooser', () => {});
await p.goto(require('./app.js').url); await p.waitForTimeout(500); await p.click('#welcomeExample'); await p.waitForTimeout(300);
await p.evaluate(() => { window.print = () => {}; window.open = () => null; });
const log = [];
for (let i = 0; i < N; i++) {
  const r = rnd();
  try {
    if (r < .55) {   // click a visible control
      const n = await p.evaluate(() => { const els = [...document.querySelectorAll('button:not([disabled]), [role=tab], select, input[type=checkbox], summary, .item, .cab, [data-cid], [data-badge]')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 2 && b.height > 2 && b.bottom > 0 && b.right > 0 && b.top < innerHeight && b.left < innerWidth && !e.closest('[hidden]') && !/libReset|resetAll|loadFile|hd-logo|gf-img/.test(e.id); }); window.__els = els; return els.length; });
      if (!n) continue; const k = Math.floor(rnd() * n);
      const d = await p.evaluate(k => { const e = __els[k]; return `${e.tagName}#${e.id}.${String(e.className?.baseVal ?? e.className).slice(0, 30)} ${(e.textContent || '').trim().slice(0, 24)}`; }, k);
      log.push('click ' + d);
      const isSel = await p.evaluate(k => __els[k].tagName === 'SELECT' ? [...__els[k].options].map(o => o.value) : null, k);
      if (isSel && isSel.length) await p.evaluate(([k, v]) => { const e = __els[k]; e.value = v; e.dispatchEvent(new Event('change', { bubbles: true })); }, [k, pick(isSel)]);
      else await p.evaluate(k => { const e = __els[k]; const b = e.getBoundingClientRect(); const o = { bubbles: true, clientX: b.left + b.width / 2, clientY: b.top + b.height / 2, pointerId: 1, isPrimary: true }; e.dispatchEvent(new PointerEvent('pointerdown', o)); e.dispatchEvent(new PointerEvent('pointerup', o)); if (e.click) e.click(); else e.dispatchEvent(new MouseEvent('click', o)); }, k);
    } else if (r < .7) {   // type into a field
      const n = await p.evaluate(() => { const els = [...document.querySelectorAll('input[type=text], input[type=number], input[type=search], textarea, input[type=date], input[type=time]')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 2 && !e.closest('[hidden]'); }); window.__in = els; return els.length; });
      if (!n) continue; const k = Math.floor(rnd() * n);
      const v = pick(['12', '-3', '0', '999', 'Main hall', '', '2026-12-25', '19:30', '3.5', 'abc', '<b>x</b>', '😀 test']);
      log.push('type ' + v);
      await p.evaluate(([k, v]) => { const e = __in[k]; try { e.value = v; } catch {} e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); }, [k, v]);
    } else if (r < .85) {   // drag on the plot
      const bx = await p.evaluate(() => { const s = document.getElementById('scroller'); if (!s || s.closest('[hidden]')) return null; const b = s.getBoundingClientRect(); return [b.left, b.top, b.width, b.height]; });
      if (!bx) continue; const sx = bx[0] + rnd() * bx[2], sy = bx[1] + rnd() * bx[3];
      log.push('drag'); await p.mouse.move(sx, sy); await p.mouse.down(); await p.mouse.move(sx + (rnd() - .5) * 200, sy + (rnd() - .5) * 200, { steps: 4 }); await p.mouse.up();
    } else {   // keys
      const k = pick(['Escape', 'Delete', 'r', 'z', 'Control+z', 'Control+y', 'g', 'p', 'm', 'c', 'ArrowLeft', 'ArrowUp', '+', '-', 'Control+d', 'Control+c', 'Control+v', '?', 'Tab', 'Enter', 'f', 'e', '[', '\\']);
      log.push('key ' + k); await p.keyboard.press(k);
    }
  } catch (e) { log.push('  (driver: ' + e.message.split('\n')[0] + ')'); }
  if (errs.length) { console.log('ERROR after', i, 'actions:', errs[0]); console.log(log.slice(-8).join('\n')); break; }
}
const ok = await p.evaluate(() => { try { renderAll(); return [Object.keys(db.plans).length, !!plan, plan.items.length]; } catch (e) { return 'render failed: ' + e.message; } });
const integ = await p.evaluate(() => { const bad = []; for (const q of Object.values(db.plans)) { const ids = new Set(q.items.map(i => i.id)); if (!venues()[q.venueId]) bad.push('no venue ' + q.id); for (const c of q.cables) if (!ids.has(c.from) || !ids.has(c.to)) bad.push('dangling cable ' + c.id); for (const i of q.items) { if (!CAT[i.type]) bad.push('unknown type ' + i.type); if (![i.x, i.y].every(Number.isFinite)) bad.push('bad position ' + i.type); } if (!/^\d{4}-\d{2}-\d{2}$/.test(q.date)) bad.push('bad date ' + q.date); if (!(q.stage.w > 0 && q.stage.d > 0)) bad.push('bad stage'); } return bad.slice(0, 5); });
await p.reload(); await p.waitForTimeout(500);
const reload = await p.evaluate(() => [Object.keys(db.plans).length, !!plan]);
console.log('integrity', integ.length ? JSON.stringify(integ) : 'ok', 'reload', JSON.stringify(reload));
console.log('seed', seed, 'done', errs.length ? 'WITH ERRORS' : 'clean', JSON.stringify(ok)); await b.close(); })();
