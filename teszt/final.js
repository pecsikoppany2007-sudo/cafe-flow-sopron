// átadási képernyőképek
const { chromium, devices } = require('playwright');
const OUT = __dirname + '/kepernyokepek/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch();
  async function page(o, lang) { delete o.defaultBrowserType; const c = await b.newContext(o); const p = await c.newPage(); await p.goto('http://localhost:8766/?nogate&lang=' + lang, { waitUntil: 'domcontentloaded' }); return [c, p]; }
  async function at(p, sel, off = 70, wait = 2600) { const y = await p.evaluate(s => document.querySelector(s).getBoundingClientRect().top + scrollY, sel); await p.evaluate(y => scrollTo(0, y), y - off); await p.waitForTimeout(wait); }
  let [c, p] = await page({ viewport: { width: 1440, height: 900 } }, 'hu');
  await p.waitForTimeout(1150); await p.screenshot({ path: OUT + '2-neon-felvillan-gep.jpg', quality: 82 });
  await p.waitForTimeout(3200); await p.screenshot({ path: OUT + '1-nyitokep-gep.jpg', quality: 82 });
  await at(p, '#rolunk', 0); await p.screenshot({ path: OUT + '3-bemutatkozas-gep.jpg', quality: 82 });
  await at(p, '#kave', 40); await p.click('[data-roast="1"]'); await p.waitForTimeout(1400); await p.screenshot({ path: OUT + '4-kave-vilagos-porkoles-gep.jpg', quality: 82 });
  await at(p, '.coffee__flav', 90); await p.screenshot({ path: OUT + '5-izesitett-kavek-gep.jpg', quality: 82 });
  await at(p, '#etlap', 0); await p.click('#tabs button:nth-child(2)'); await p.waitForTimeout(1500); await at(p, '.menu__inner', 0, 1200); await p.screenshot({ path: OUT + '6-etlap-menuk-gep.jpg', quality: 82 });
  await at(p, '#emelet', -40, 3200); await p.screenshot({ path: OUT + '7-emelet-gep.jpg', quality: 82 });
  await at(p, '#haz', 0); await p.screenshot({ path: OUT + '8-terasz-bolt-gep.jpg', quality: 82 });
  await at(p, '#nyitvatartas', 0); await p.screenshot({ path: OUT + '9-nyitvatartas-gep.jpg', quality: 82 });
  await c.close();
  [c, p] = await page({ ...devices['iPhone 13'] }, 'hu');
  await p.waitForTimeout(4400); await p.screenshot({ path: OUT + '10-nyitokep-telefon.jpg', quality: 82 });
  await at(p, '#kave', 60); await p.screenshot({ path: OUT + '11-kave-telefon.jpg', quality: 82 });
  await at(p, '#etlap', 60); await p.screenshot({ path: OUT + '12-etlap-telefon.jpg', quality: 82 });
  await c.close();
  [c, p] = await page({ viewport: { width: 1440, height: 900 } }, 'de');
  await p.waitForTimeout(4400); await p.screenshot({ path: OUT + '13-nemet-nyitokep-gep.jpg', quality: 82 });
  await c.close(); await b.close();
})();
