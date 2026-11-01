const { chromium } = require(require('./app.js').pw);
(async () => { const b = await chromium.launch(); const p = await b.newPage(); p.on('pageerror', e => console.log('ERR', e.message, e.stack?.split('\n')[1])); await p.goto(require('./app.js').url); await p.waitForTimeout(800); await b.close(); })();
