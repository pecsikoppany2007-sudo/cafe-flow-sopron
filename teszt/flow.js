const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const out = process.argv[2];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8766/?nogate&lang=hu'); await p.waitForTimeout(5000);
  const r = await p.evaluate(() => { const e = document.querySelectorAll('.hero .fl')[1]; const r = e.getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
  const clip = { x: r[0] - 20, y: r[1] - 20, width: r[2] + 40, height: r[3] + 40 };
  await p.screenshot({ path: out + '/f0.png', clip });
  await p.mouse.move(r[0] + 10, r[1] + r[3] / 2);
  for (const [i, t] of [[1, 250], [2, 250], [3, 250], [4, 900]]) { await p.waitForTimeout(t); await p.screenshot({ path: out + '/f' + i + '.png', clip }); }
  await p.evaluate(() => { const e = document.querySelector('.rev .fl'); const y = e.getBoundingClientRect().top + scrollY - 400; window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y); });
  await p.waitForTimeout(3500);
  const q = await p.evaluate(() => { const e = document.querySelector('.rev .fl'); const r = e.getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
  const c2 = { x: q[0] - 20, y: q[1] - 20, width: q[2] + 40, height: q[3] + 40 };
  await p.screenshot({ path: out + '/g0.png', clip: c2 });
  await p.mouse.move(q[0] + 10, q[1] + q[3] / 2); await p.waitForTimeout(450); await p.screenshot({ path: out + '/g1.png', clip: c2 });
  await p.waitForTimeout(1200); await p.screenshot({ path: out + '/g2.png', clip: c2 });
  await b.close();
})();
