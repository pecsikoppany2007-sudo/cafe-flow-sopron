const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const [name, o] of [['ipad', { viewport: { width: 820, height: 1180 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }], ['ipadL', { viewport: { width: 1180, height: 820 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }], ['w320', { viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true }], ['w1920', { viewport: { width: 1920, height: 1080 } }]]) {
    const ctx = await b.newContext(o); const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://localhost:8766/?nogate&lang=' + (name === 'w320' ? 'de' : 'hu')); await p.waitForTimeout(3800);
    await p.screenshot({ path: __dirname + `/out/${name}-hero.jpg`, quality: 70 });
    for (const s of ['#rolunk', '#emelet', '#haz']) {
      const y = await p.evaluate(s => document.querySelector(s).getBoundingClientRect().top + scrollY, s);
      await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(2200);
      await p.screenshot({ path: __dirname + `/out/${name}-${s.slice(1)}.jpg`, quality: 70 });
    }
    const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    console.log(name, 'overflow', ov, errs.join(' ') || 'ok');
    await ctx.close();
  }
  await b.close();
})();
