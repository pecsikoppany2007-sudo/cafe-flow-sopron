// v2 próba: node v2.js desk|iph [lang] -> hibák, túlcsordulás, rejtve maradt elemek, görgő tényleg görget (Lenis), képek
const { chromium, devices } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const URL = process.env.URL || 'http://localhost:8766/?nogate';
const OUT = __dirname + '/out/v2-';
(async () => {
  const dev = process.argv[2] || 'desk', lang = process.argv[3] || 'hu';
  const b = await chromium.launch();
  let o = dev === 'desk' ? { viewport: { width: +(process.env.W || 1440), height: +(process.env.H || 900) } } : { ...devices[dev === 'iph' ? 'iPhone 13' : 'Pixel 7'] };
  delete o.defaultBrowserType;
  const ctx = await b.newContext(o); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
  await p.addInitScript(l => localStorage.setItem('flow-lang', l), lang);
  await p.goto(URL, { waitUntil: 'load' });
  await p.waitForTimeout(3800);
  const shots = process.env.SHOTS !== '0';
  if (shots) await p.screenshot({ path: OUT + `${dev}-${lang}-0hero.jpg`, quality: 60 });
  if (dev === 'desk') {
    await p.mouse.move(700, 450);
    const y0 = await p.evaluate(() => scrollY);
    for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, 300); await p.waitForTimeout(60); }
    await p.waitForTimeout(1500);
    console.log('wheel scroll moved', (await p.evaluate(() => scrollY)) - y0, 'px');
  }
  const pts = await p.evaluate(() => {
    const t = document.querySelector('#korbe'), top = t.getBoundingClientRect().top + scrollY;
    const r = [];
    const at = s => document.querySelector(s).getBoundingClientRect().top + scrollY - 70;
    r.push(['1rolunk', at('#rolunk')]);
    r.push(['2tour-a', top + 2]);
    r.push(['2tour-b', top + (t.offsetHeight - innerHeight) * 0.5]);
    r.push(['2tour-c', top + (t.offsetHeight - innerHeight) * 0.98]);
    r.push(['3kave', at('#kave')]); r.push(['4flav', at('.coffee__flav')]); r.push(['5marq', at('.marq') - 200]);
    r.push(['6etlap', at('#etlap')]); r.push(['7emelet', at('#emelet')]); r.push(['8haz', at('#haz')]); r.push(['9ny', at('#nyitvatartas')]);
    r.push(['zfoot', document.documentElement.scrollHeight]);
    return r;
  });
  for (const [n, y] of pts) {
    await p.evaluate(y => { if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true }); else scrollTo(0, y); }, y);
    await p.waitForTimeout(2600);
    if (shots) await p.screenshot({ path: OUT + `${dev}-${lang}-${n}.jpg`, quality: 60 });
  }
  const r = await p.evaluate(() => ({
    ov: document.documentElement.scrollWidth - innerWidth,
    rv: [...document.querySelectorAll('.rv')].filter(e => getComputedStyle(e).opacity < .5).length,
    lm: [...document.querySelectorAll('.lm .w > span')].filter(e => new DOMMatrix(getComputedStyle(e).transform).m42 > 2).length,
    sign: getComputedStyle(document.querySelector('.sign--on')).opacity,
    heads: [...document.querySelectorAll('.lm, .hero__title, h3')].filter(h => h.scrollWidth > h.clientWidth + 2 || [...h.querySelectorAll('.w')].some(w => w.getBoundingClientRect().right > h.closest('section, footer').getBoundingClientRect().right)).map(h => h.textContent.slice(0, 30)),
    imgs: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src)
  }));
  console.log(dev, lang, JSON.stringify(r), errs.length ? errs.join('\n') : 'no errors');
  await b.close();
})();
