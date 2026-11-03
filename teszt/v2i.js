// v2 interakciók: menüpontok érkezése (Lenis), élő nyelvváltás = friss betöltés, lábléc linkjei, újratöltés középen, csökkentett mozgás
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const U = 'http://localhost:8766/?nogate';
(async () => {
  const b = await chromium.launch();
  const errs = [];
  const page = async (o) => { const p = await b.newPage(o || { viewport: { width: 1440, height: 900 } }); p.on('pageerror', e => errs.push(e.message)); return p; };
  // 1. menüpontok
  let p = await page(); await p.goto(U); await p.waitForTimeout(3500);
  for (const id of ['etlap', 'kave', 'emelet', 'nyitvatartas']) {
    await p.click(`#navLinks a[href="#${id}"]`); await p.waitForTimeout(2600);
    console.log('nav', id, Math.round(await p.evaluate(id => document.getElementById(id).getBoundingClientRect().top, id)));
  }
  // szakaszjelölő
  await p.hover('.idx li:nth-child(2) a'); await p.click('.idx li:nth-child(2) a'); await p.waitForTimeout(2600);
  console.log('idx korbe top', Math.round(await p.evaluate(() => document.getElementById('korbe').getBoundingClientRect().top)), 'active', await p.evaluate(() => [...document.querySelectorAll('.idx a')].findIndex(a => a.classList.contains('is-on'))));
  // lábléc linkek a lap alján
  await p.evaluate(() => window.__lenis.scrollTo(document.documentElement.scrollHeight, { immediate: true })); await p.waitForTimeout(2000);
  console.log('foot links hit', await p.evaluate(() => [...document.querySelectorAll('.foot a')].map(a => { const r = a.getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return e === a || a.contains(e); }).join(',')));
  console.log('curtain', await p.evaluate(() => document.documentElement.classList.contains('is-curtain')));
  // gombok és tartalmi linkek nincsenek-e takarva
  const covered = [];
  for (const sel of ['.hero__btns a', '#rolunk a', '.up__text a', '.hours__contact a', '.roast button', '#tabs button']) {
    const n = await p.evaluate(s => document.querySelectorAll(s).length, sel);
    for (let i = 0; i < n; i++) {
      const ok = await p.evaluate(([s, i]) => { const a = document.querySelectorAll(s)[i]; const y = a.getBoundingClientRect().top + scrollY - innerHeight / 2; window.__lenis.scrollTo(y, { immediate: true }); return true; }, [sel, i]);
      await p.waitForTimeout(400);
      const hit = await p.evaluate(([s, i]) => { const a = document.querySelectorAll(s)[i]; const r = a.getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return e === a || a.contains(e) ? 1 : (e ? e.className || e.tagName : 'none'); }, [sel, i]);
      if (hit !== 1) covered.push(sel + i + ':' + hit);
    }
  }
  console.log('covered', covered.join(' ') || 'none');
  // 2. élő nyelvváltás vs friss
  await p.evaluate(() => window.__lenis.scrollTo(0, { immediate: true }));
  await p.click('.nav__lang [data-lang="de"]'); await p.waitForTimeout(800);
  const grab = () => p.evaluate(() => [...document.querySelectorAll('main, .foot')].map(e => e.innerText).join('|').replace(/Sopron \d+:\d+/g, '').replace(/\s+/g, ' '));
  const live = await grab();
  const q = await page(); await q.addInitScript(() => localStorage.setItem('flow-lang', 'de')); await q.goto(U); await q.waitForTimeout(3500);
  const fresh = await q.evaluate(() => [...document.querySelectorAll('main, .foot')].map(e => e.innerText).join('|').replace(/Sopron \d+:\d+/g, '').replace(/\s+/g, ' '));
  console.log('lang live==fresh', live === fresh, live.length, fresh.length);
  if (live !== fresh) { let i = 0; while (live[i] === fresh[i]) i++; console.log(live.slice(i - 40, i + 60), '\n---\n', fresh.slice(i - 40, i + 60)); }
  // 3. újratöltés középen (telefon)
  const m = await page({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await m.goto(U); await m.waitForTimeout(2500); await m.evaluate(() => scrollTo(0, document.getElementById('emelet').offsetTop + 200)); await m.waitForTimeout(500);
  await m.reload(); await m.waitForTimeout(3500);
  console.log('reload mid hidden', await m.evaluate(() => [...document.querySelectorAll('.rv, .lm')].filter(e => { const r = e.getBoundingClientRect(); return r.bottom < innerHeight && getComputedStyle(e).opacity < .5; }).length));
  // 4. csökkentett mozgás
  const r = await page({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await r.goto(U); await r.waitForTimeout(1500);
  console.log('reduced', await r.evaluate(() => ({ lenis: !!window.__lenis, hidden: [...document.querySelectorAll('.rv, .lm .w > span')].filter(e => getComputedStyle(e).opacity < .5 || new DOMMatrix(getComputedStyle(e).transform).m42 > 2).length, sign: getComputedStyle(document.querySelector('.sign--on')).opacity })));
  console.log('errors', errs.join('\n') || 'none');
  await b.close();
})();
