// szakaszonkénti képek saját ellenőrzéshez: node secs.js <outdir> [prefix]
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const out = process.argv[2], pre = process.argv[3] || '';
(async () => {
  const b = await chromium.launch();
  for (const [nm, o] of [['t', { viewport: { width: 900, height: 1100 } }], ['m', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }]]) {
    const p = await b.newPage(o); p.on('pageerror', e => console.log('ERR', e.message)); if (process.env.PERF_HW) await p.addInitScript(() => { const g = WebGLRenderingContext.prototype.getParameter; WebGLRenderingContext.prototype.getParameter = function (k) { return k === 0x9246 ? 'ANGLE (Apple, Apple M1, OpenGL 4.1)' : g.call(this, k); }; }); await p.goto('http://localhost:8766/?nogate'); await p.waitForTimeout(3500);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 500) { await p.evaluate(y => { (window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y)); }, y); await p.waitForTimeout(120); }
    await p.waitForTimeout(1500);
    for (const id of (process.argv[4] || 'rolunk,kave,etlap,emelet,haz,nyitvatartas').split(',')) {
      const top = await p.evaluate(id => { let e = document.getElementById(id), t = 0; while (e) { t += e.offsetTop; e = e.offsetParent; } return t; }, id);
      const hh = await p.evaluate(id => document.getElementById(id).offsetHeight, id);
      for (let k = 0; k * o.viewport.height < hh && k < 4; k++) {
        await p.evaluate(y => { (window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y)); }, top + k * o.viewport.height);
        await p.waitForTimeout(1600);
        await p.screenshot({ path: `${out}/${pre}${nm}-${id}-${k}.png` });
      }
    }
    await p.close();
  }
  await b.close();
})();
