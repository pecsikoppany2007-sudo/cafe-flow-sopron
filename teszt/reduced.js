const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' }); const p = await c.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8766/?lang=hu'); await p.waitForTimeout(800);
  await p.screenshot({ path: __dirname + '/out/reduced-hero.jpg', quality: 70 });
  const st = await p.evaluate(() => ({ on: getComputedStyle(document.querySelector('.hero__on')).opacity, title: getComputedStyle(document.querySelector('.hero__title .w > span')).transform, nav: getComputedStyle(document.querySelector('.nav')).opacity, sub: getComputedStyle(document.querySelector('.hero__sub')).opacity, neon: document.querySelector('.neon--hero .n1').getAttribute('d').length }));
  console.log(JSON.stringify(st), errs.join(' ') || 'ok');
  await b.close();
})();
