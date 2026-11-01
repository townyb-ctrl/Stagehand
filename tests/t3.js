const { chromium } = require(require('./app.js').pw);
(async () => {
  const b = await chromium.launch();
  for (const scheme of ['light', 'dark']) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: scheme });
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(require('./app.js').url); await p.waitForTimeout(900); if (await p.isVisible('#welcomeDlg')) await p.click('#welcomeExample');
    await p.screenshot({ path: `ui-${scheme}-home.png` });
    if (scheme === 'light') {
      // select drum kit
      const kit = await p.$('#plot .item[data-id] >> nth=12'); const bb = await kit.boundingBox();
      await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.waitForTimeout(200);
      await p.screenshot({ path: 'ui-sel.png' });
      await p.click('[data-mode="cable"]'); await p.keyboard.press('Escape'); await p.waitForTimeout(100);
      await p.click('#tGear'); await p.waitForTimeout(100); await p.screenshot({ path: 'ui-gear.png' });
      await p.click('#tStage'); await p.click('#weekBtn'); await p.waitForTimeout(100); await p.screenshot({ path: 'ui-room-week.png' });
      await p.keyboard.press('Escape');
      await p.click('#vPaper'); await p.waitForTimeout(300); await p.screenshot({ path: 'ui-paper.png' });
      await p.setViewportSize({ width: 400, height: 860 }); await p.click('#vPlot'); await p.waitForTimeout(300);
      await p.screenshot({ path: 'ui-phone.png', fullPage: true });
      console.log('phone sw', await p.evaluate(() => document.documentElement.scrollWidth));
    }
    console.log(scheme, 'errors', errs);
  }
  await b.close();
})();
