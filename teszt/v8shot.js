// v8 saját ellenőrzés: nyitókép, sorlinkek hover, kurzor, nyitóképernyő
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const out = process.argv[2];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8766/?nogate&lang=hu'); await p.waitForTimeout(5000);
  const go = await p.evaluate(() => { const e = document.querySelector('.hero .fl'); const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
  await p.mouse.move(300, 300); await p.waitForTimeout(500);
  await p.screenshot({ path: out + '/h0.png' });
  await p.mouse.move(go[0], go[1], { steps: 10 }); await p.waitForTimeout(1300);
  await p.screenshot({ path: out + '/h1.png' });
  for (const [id, sel] of [['emelet', '.up .fl'], ['ertekelesek', '.rev .fl'], ['nyitvatartas', '.hours .fl']]) {
    await p.evaluate(sel => { const e = document.querySelector(sel); const y = e.getBoundingClientRect().top + scrollY - 420; (window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y)); }, sel);
    await p.waitForTimeout(1800);
    const r = await p.evaluate(sel => { const e = document.querySelector(sel); const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, sel);
    await p.mouse.move(r[0], r[1], { steps: 8 }); await p.waitForTimeout(1300);
    await p.screenshot({ path: out + '/' + id + '.png' });
  }
  // fotó fölött
  await p.evaluate(() => { const e = document.querySelector('.intro__big'); const y = e.getBoundingClientRect().top + scrollY - 100; (window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y)); });
  await p.waitForTimeout(1600); await p.mouse.move(700, 400, { steps: 6 }); await p.waitForTimeout(900);
  await p.screenshot({ path: out + '/photo.png', clip: { x: 500, y: 250, width: 400, height: 300 } });
  // nyitóképernyő
  const g = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await g.goto('http://localhost:8766/?lang=hu'); await g.waitForTimeout(4500);
  const gr = await g.evaluate(() => { const e = document.querySelector('.gate__go'); if (!e) return null; const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2, r.width]; });
  console.log('gate btn', gr);
  if (gr) { await g.mouse.move(gr[0], gr[1], { steps: 8 }); await g.waitForTimeout(1200); }
  await g.screenshot({ path: out + '/gate.png' });
  // telefon
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  m.on('pageerror', e => console.log('ERR m', e.message));
  await m.goto('http://localhost:8766/?nogate&lang=hu'); await m.waitForTimeout(4500);
  await m.screenshot({ path: out + '/m-hero.png' });
  const ov = await m.evaluate(() => document.documentElement.scrollWidth);
  console.log('m scrollWidth', ov);
  await b.close();
})();
