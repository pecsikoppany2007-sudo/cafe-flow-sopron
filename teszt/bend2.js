const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.addInitScript(() => { const g = WebGLRenderingContext.prototype.getParameter; WebGLRenderingContext.prototype.getParameter = function (k) { return k === 0x9246 ? 'ANGLE (Apple, Apple M1, OpenGL 4.1)' : g.call(this, k); }; });
  await p.goto('http://localhost:8766/?nogate'); await p.waitForTimeout(5000);
  const nums = () => p.evaluate(() => document.querySelector('.neon--hero .n1').getAttribute('d').match(/-?\d+\.\d/g).map(Number));
  const rest = await nums();
  const r = await p.evaluate(() => { const s = document.querySelector('.neon--hero').getBoundingClientRect(); return [s.left, s.top, s.width, s.height]; });
  for (let i = 0; i < 14; i++) { await p.mouse.move(r[0] + r[2] * (.15 + i * .03), r[1] + r[3] * .62); await p.waitForTimeout(30); }
  await p.waitForTimeout(300);
  const mid = await nums();
  let mx = 0; for (let i = 0; i < Math.min(rest.length, mid.length); i++) mx = Math.max(mx, Math.abs(rest[i] - mid[i]));
  console.log('max bend (svg units)', mx.toFixed(1), 'scale', (640 / r[2]).toFixed(2));
  await p.mouse.move(r[0] + r[2] * .5, r[1] - 200); await p.waitForTimeout(3000);
  const back = await nums(); let mb = 0; for (let i = 0; i < rest.length; i++) mb = Math.max(mb, Math.abs(rest[i] - back[i]));
  console.log('after release', mb.toFixed(2));
  // nyitókép: két egérhelyzet képe eltér-e
  await p.mouse.move(100, 450); await p.waitForTimeout(1500); const a = await p.screenshot({ clip: { x: 700, y: 100, width: 600, height: 500 } });
  await p.mouse.move(1340, 450); await p.waitForTimeout(1500); const c = await p.screenshot({ clip: { x: 700, y: 100, width: 600, height: 500 } });
  require('fs').writeFileSync('/tmp/claude-0/-home-claude/e3f0d62b-c561-5e49-a9aa-09921a6f53ff/scratchpad/sh/ga.png', a);
  require('fs').writeFileSync('/tmp/claude-0/-home-claude/e3f0d62b-c561-5e49-a9aa-09921a6f53ff/scratchpad/sh/gc.png', c);
  await b.close();
})();
