const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const b = await chromium.launch();
  for (const [w, h, l] of (process.env.SET ? JSON.parse(process.env.SET) : [[1440, 900, 'hu'], [1280, 720, 'de'], [1920, 1080, 'en'], [390, 844, 'de'], [320, 640, 'de']])) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.addInitScript(l => localStorage.setItem('flow-lang', l), l);
    await p.goto('http://localhost:8766/?nogate'); await p.waitForTimeout(1500);
    const r = await p.evaluate(() => [...document.querySelectorAll('.lm, .hero__title, h3, .foot__sign')].map(h => {
      const hr = h.getBoundingClientRect(), pr = h.parentElement.getBoundingClientRect();
      const maxR = Math.max(...[...h.querySelectorAll('.w')].map(w => w.getBoundingClientRect().right), hr.right);
      return [h.textContent.trim().slice(0, 28), Math.round(h.scrollWidth - h.clientWidth), Math.round(maxR - pr.right), Math.round(maxR - innerWidth)];
    }).filter(x => x[1] > 2 || x[2] > 2 || x[3] > 0));
    console.log(w, l, JSON.stringify(r));
    await p.close();
  }
  await b.close();
})();
