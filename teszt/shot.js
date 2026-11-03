// node shot.js desk|iph|pix [lang]  -> intro frames + section screenshots + errors + overflow
const { chromium, devices } = require('playwright');
const URL = process.env.URL || 'http://localhost:8766/?nogate';
const OUT = __dirname + '/out/';
(async () => {
  const dev = process.argv[2] || 'desk', lang = process.argv[3] || 'hu';
  const b = await chromium.launch();
  let o = dev === 'desk' ? { viewport: { width: 1440, height: 900 } } : dev === 'iph' ? { ...devices['iPhone 13'] } : { ...devices['Pixel 7'] };
  delete o.defaultBrowserType;
  const ctx = await b.newContext(o); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('requestfailed', r => errs.push('FAIL ' + r.url())); p.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
  await p.addInitScript(l => localStorage.setItem('flow-lang', l), lang);
  const t0 = Date.now();
  await p.goto(URL, { waitUntil: 'domcontentloaded' });
  for (const t of (process.env.TIMES || '300,700,1100,1600,2200,3400').split(',').map(Number)) {
    const w = t - (Date.now() - t0); if (w > 0) await p.waitForTimeout(w);
    await p.screenshot({ path: OUT + `${dev}-${lang}-intro-${t}.jpg`, quality: 70 });
  }
  await p.waitForTimeout(1500);
  const secs = ['#rolunk', '#kave', '.coffee__flav', '#etlap', '#emelet', '#haz', '#nyitvatartas', '.foot'];
  for (const s of secs) {
    const y = await p.evaluate(s => document.querySelector(s).getBoundingClientRect().top + scrollY, s);
    await p.evaluate(y => scrollTo(0, y - 70), y); await p.waitForTimeout(2400);
    await p.screenshot({ path: OUT + `${dev}-${lang}-${s.replace(/[#.]/g, '')}.jpg`, quality: 70 });
  }
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  const hidden = await p.evaluate(() => [...document.querySelectorAll('.rv')].filter(e => getComputedStyle(e).opacity < .5).length);
  console.log(dev, lang, 'overflow', ov, 'hiddenRv', hidden, errs.length ? errs.join('\n') : 'no errors');
  await b.close();
})();
