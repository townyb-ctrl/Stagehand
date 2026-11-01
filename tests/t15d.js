const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(require('./app.js').url); await p.waitForTimeout(600); await p.click('#welcomeExample'); await p.waitForTimeout(200);
console.log('A', await p.evaluate(() => inputList().slice(0, 14).map(r => r.name + '→' + r.port).join(' | ')));
await p.evaluate(() => addGear('usb_if', 18, 10));
console.log('B', await p.evaluate(() => plan.items.slice(-1).map(i => [i.type, i.x, i.y])), await p.evaluate(() => inputList().slice(8, 14).map(r => r.name + '→' + r.port).join(' | ')));
await b.close(); })();
