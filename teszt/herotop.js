// a nyitókép tetejének ellenőrzése (cégtábla, sáv): node herotop.js <outdir> [prefix]
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const out = process.argv[2], pre = process.argv[3] || '';
(async () => {
  const b = await chromium.launch();
  for (const [nm, vp, hw] of [['css', { width: 1470, height: 800 }, 0], ['gl', { width: 1470, height: 800 }, 1], ['gl-w', { width: 1920, height: 960 }, 1], ['css-n', { width: 1280, height: 640 }, 0], ['m', { width: 390, height: 844 }, 0]]) {
    const o = nm === 'm' ? { viewport: vp, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : { viewport: vp, deviceScaleFactor: 2 };
    const p = await b.newPage(o); p.on('pageerror', e => console.log('ERR', e.message));
    if (hw) await p.addInitScript(() => { const g = WebGLRenderingContext.prototype.getParameter; WebGLRenderingContext.prototype.getParameter = function (k) { return k === 0x9246 ? 'ANGLE (Apple, Apple M1, OpenGL 4.1)' : g.call(this, k); }; });
    await p.goto('http://localhost:8766/?nogate'); await p.waitForTimeout(6500);
    if (hw) { await p.mouse.move(vp.width * .7, vp.height * .3); await p.waitForTimeout(800); }
    const info = await p.evaluate(() => ({ h3d: document.documentElement.classList.contains('hero-3d'), media: document.querySelector('.hero__media').getBoundingClientRect().top }));
    console.log(nm, JSON.stringify(info));
    await p.screenshot({ path: `${out}/${pre}${nm}.png`, clip: { x: 0, y: 0, width: vp.width, height: Math.min(vp.height, 420) } });
    await p.close();
  }
  await b.close();
})();
