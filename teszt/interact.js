// élő nyelvváltás = friss betöltés, menüpontok landolása, fülek, pörkölésváltó, újratöltés középen
const { chromium, devices } = require('playwright');
const URL = 'http://localhost:8766/?nogate';
(async () => {
  const b = await chromium.launch(); const out = [];
  const textOf = p => p.evaluate(() => [...document.querySelectorAll('main, footer')].map(e => e.innerText).join('\n').replace(/Ma \d|Heute \d|Today \d/g, ''));
  // 1. élő váltás vs friss
  for (const l of ['de', 'en', 'hu']) {
    const c1 = await b.newContext({ viewport: { width: 1280, height: 800 } }); const p1 = await c1.newPage();
    await p1.addInitScript(() => localStorage.setItem('flow-lang', 'hu'));
    await p1.goto(URL); await p1.waitForTimeout(3000);
    if (l === 'hu') { await p1.click('[data-lang="de"]'); await p1.waitForTimeout(300); }
    await p1.click(`[data-lang="${l}"]`); await p1.waitForTimeout(400);
    const live = await textOf(p1);
    const c2 = await b.newContext({ viewport: { width: 1280, height: 800 } }); const p2 = await c2.newPage();
    await p2.goto(URL + '?lang=' + l); await p2.waitForTimeout(3000);
    const fresh = await textOf(p2);
    out.push(`lang ${l}: live==fresh ${live === fresh}` + (live === fresh ? '' : '\n' + live.split('\n').filter((x, i) => x !== fresh.split('\n')[i]).slice(0, 5).join(' | ')));
    const title = await p1.title(); out.push('  title ' + title + ' | html lang ' + await p1.evaluate(() => document.documentElement.lang));
    await c1.close(); await c2.close();
  }
  // 2. menüpontok (gép + telefon)
  for (const dev of ['desk', 'iph']) {
    const o = dev === 'desk' ? { viewport: { width: 1440, height: 900 } } : { ...devices['iPhone 13'] }; delete o.defaultBrowserType;
    const c = await b.newContext(o); const p = await c.newPage(); await p.goto(URL + '?lang=hu'); await p.waitForTimeout(3200);
    for (const h of ['#etlap', '#kave', '#emelet', '#nyitvatartas']) {
      if (dev === 'iph') { await p.click('#burger'); await p.waitForTimeout(450); }
      await p.click(`#navLinks a[href="${h}"]`); await p.waitForTimeout(1600);
      const r = await p.evaluate(h => { const s = document.querySelector(h); const hd = s.querySelector('h2'); return [Math.round(hd.getBoundingClientRect().top), innerHeight]; }, h);
      out.push(`${dev} nav ${h}: heading top ${r[0]} of ${r[1]}`);
    }
    // fülek
    const tabs = await p.$$('#tabs button');
    for (let i = 0; i < tabs.length; i++) { await tabs[i].click(); await p.waitForTimeout(700); }
    const st = await p.evaluate(() => ({ sel: document.querySelector('#tabs [aria-selected=true]').textContent, items: document.querySelectorAll('#menuPanel li').length, op: getComputedStyle(document.querySelector('#menuPanel li')).opacity, img: document.querySelector('#menuPhoto img').currentSrc.split('/').pop() }));
    out.push(`${dev} last tab ${JSON.stringify(st)}`);
    // pörkölés
    await p.evaluate(() => document.querySelector('#kave').scrollIntoView()); await p.waitForTimeout(600);
    await p.click('[data-roast="1"]'); await p.waitForTimeout(1000);
    const pr = await p.evaluate(() => [...document.querySelectorAll('#classicList .pr')].map(e => e.textContent).join(','));
    out.push(`${dev} light prices ${pr}`);
    await p.click('[data-roast="0"]'); await p.waitForTimeout(1000);
    out.push(`${dev} dark prices ${await p.evaluate(() => [...document.querySelectorAll('#classicList .pr')].map(e => e.textContent).join(','))}`);
    // újratöltés középen
    await p.evaluate(() => scrollTo(0, document.querySelector('#emelet').offsetTop + 200)); await p.waitForTimeout(500);
    await p.reload(); await p.waitForTimeout(3500);
    const inv = await p.evaluate(() => [...document.querySelectorAll('.rv, .rv-img img, .hero__title .w > span')].filter(e => { const r = e.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && getComputedStyle(e).opacity < .5; }).length);
    out.push(`${dev} reload mid-page: invisible in view ${inv}, scrollY ${await p.evaluate(() => scrollY)}`);
    await c.close();
  }
  console.log(out.join('\n')); await b.close();
})();
