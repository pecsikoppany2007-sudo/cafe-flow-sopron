// egérmozgás a nyitóképen és a neonvonalon: hosszú feladatok és képkocka-idő (szoftveres GL, csak tájékoztató)
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.addInitScript(() => { const g = WebGLRenderingContext.prototype.getParameter; WebGLRenderingContext.prototype.getParameter = function (k) { return k === 0x9246 ? 'ANGLE (Apple, Apple M1, OpenGL 4.1)' : g.call(this, k); }; });
  await p.goto('http://localhost:8766/?nogate'); await p.waitForTimeout(5000);
  await p.evaluate(() => { window.__ft = []; let l = performance.now(); (function f(t) { window.__ft.push(t - l); l = t; requestAnimationFrame(f); })(l); });
  const r = await p.evaluate(() => { const s = document.querySelector('.neon--hero').getBoundingClientRect(); return [s.left, s.top, s.width, s.height]; });
  for (let i = 0; i < 120; i++) { await p.mouse.move(r[0] + (i % 40) * r[2] / 40, r[1] + r[3] * (.3 + .4 * Math.sin(i / 5))); await p.waitForTimeout(16); }
  const ft = await p.evaluate(() => window.__ft.slice(2));
  ft.sort((a, b) => a - b);
  console.log('frames', ft.length, 'median', ft[ft.length >> 1].toFixed(1), 'p95', ft[Math.floor(ft.length * .95)].toFixed(1), 'max', ft[ft.length - 1].toFixed(1));
  await b.close();
})();
