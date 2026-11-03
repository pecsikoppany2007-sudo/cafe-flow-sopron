const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:8766/?nogate'); await p.waitForTimeout(3500);
  await p.evaluate(() => window.__lenis.scrollTo(document.getElementById('kave'), { immediate: true, offset: -120 })); await p.waitForTimeout(800);
  for (let i = 0; i < 30; i++) { await p.mouse.move(400 + i * 8, 300 + i * 4); await p.waitForTimeout(20); }
  await p.waitForTimeout(1500);
  await p.screenshot({ path: process.argv[2] + '/lamp.png' });
  await b.close();
})();
