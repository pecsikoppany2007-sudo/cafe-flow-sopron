// node fog.js desk|iph  -> párás kirakat: nyitány, törlés egérrel/ujjal, neon címek, fotó-pára; hibák
const { chromium, devices } = require('playwright');
const URL = process.env.URL || 'http://localhost:8766/?nogate';
const OUT = __dirname + '/out/';
(async () => {
  const dev = process.argv[2] || 'desk';
  const b = await chromium.launch();
  let o = dev === 'desk' ? { viewport: { width: 1440, height: 900 } } : { ...devices['iPhone 13'] };
  delete o.defaultBrowserType;
  const ctx = await b.newContext(o); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
  await p.goto(URL, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(4200);
  await p.screenshot({ path: OUT + `fog-${dev}-1-auto.jpg`, quality: 72 });
  // törlés a táblákon át
  const r = await p.evaluate(() => { const c = document.querySelector('.hero__fog'); const b = c.getBoundingClientRect(); return { w: innerWidth, h: innerHeight, op: getComputedStyle(c).opacity }; });
  if (dev === 'desk') {
    await p.mouse.move(700, 560);
    for (let i = 0; i <= 30; i++) await p.mouse.move(700 + i * 16, 520 + Math.sin(i / 4) * 40, { steps: 2 });
  } else {
    const cdp = await ctx.newCDPSession(p);
    const pts = []; for (let i = 0; i <= 20; i++) pts.push([150 + i * 9, 300 + Math.sin(i / 3) * 20]);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: pts[0][0], y: pts[0][1] }] });
    for (const q of pts) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: q[0], y: q[1] }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  }
  await p.waitForTimeout(300);
  await p.screenshot({ path: OUT + `fog-${dev}-2-wipe.jpg`, quality: 72 });
  await p.waitForTimeout(8000);
  await p.screenshot({ path: OUT + `fog-${dev}-3-back.jpg`, quality: 72 });
  for (const s of ['#rolunk', '#kave', '#emelet', '#nyitvatartas']) {
    const y = await p.evaluate(s => document.querySelector(s).getBoundingClientRect().top + scrollY, s);
    await p.evaluate(y => scrollTo(0, y - 70), y); await p.waitForTimeout(500);
    await p.screenshot({ path: OUT + `fog-${dev}-${s.slice(1)}-a.jpg`, quality: 70 });
    await p.waitForTimeout(2400);
    await p.screenshot({ path: OUT + `fog-${dev}-${s.slice(1)}-b.jpg`, quality: 70 });
  }
  const lit = await p.evaluate(() => [...document.querySelectorAll('.nh')].map(h => h.textContent + ':' + h.classList.contains('is-lit')).join(' | '));
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(dev, JSON.stringify(r), 'overflow', ov, '\n', lit, '\n', errs.length ? errs.join('\n') : 'no errors');
  await b.close();
})();
