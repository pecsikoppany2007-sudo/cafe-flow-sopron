// v4: egér a nyitóképen (WebGL), neonvonal hajlítása, fülek/nyelv neoncső helye
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const b = await chromium.launch(); const errs = [];
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { const g = WebGLRenderingContext.prototype.getParameter; WebGLRenderingContext.prototype.getParameter = function (k) { return k === 0x9246 ? 'ANGLE (Apple, Apple M1, OpenGL 4.1)' : g.call(this, k); }; });
  await p.goto('http://localhost:8766/'); await p.waitForTimeout(5000);
  console.log('hero-3d', await p.evaluate(() => document.documentElement.classList.contains('hero-3d')));
  const px = () => p.evaluate(() => { const c = document.querySelector('.hero__gl'); const g = c.getContext('webgl', { preserveDrawingBuffer: true }); const a = new Uint8Array(4); g.readPixels(c.width * .55 | 0, c.height * .5 | 0, 1, 1, g.RGBA, g.UNSIGNED_BYTE, a); return [...a].join(','); });
  console.log('px center', await px());
  for (let i = 0; i < 20; i++) { await p.mouse.move(200 + i * 50, 300 + i * 10); await p.waitForTimeout(30); }
  await p.waitForTimeout(800);
  console.log('mouse G', await p.evaluate(() => 'ok'));
  // neon hajlítás: egér a hős vonalára
  const r = await p.evaluate(() => { const s = document.querySelector('.neon--hero').getBoundingClientRect(); return [s.left, s.top, s.width, s.height]; });
  const before = await p.evaluate(() => document.querySelector('.neon--hero .n1').getAttribute('d').length);
  for (let i = 0; i < 12; i++) { await p.mouse.move(r[0] + r[2] * (.2 + i * .04), r[1] + r[3] * .55); await p.waitForTimeout(25); }
  const mid = await p.evaluate(() => document.querySelector('.neon--hero .n1').getAttribute('d').slice(0, 60));
  await p.mouse.move(700, 100); await p.waitForTimeout(2500);
  const rest = await p.evaluate(() => { const n = document.querySelector('.neon--hero .n1').getAttribute('d'); return n.slice(0, 60); });
  console.log('bend mid', mid, '\nrest   ', rest);
  // csövek
  console.log('lang tube', await p.evaluate(() => { const t = document.querySelector('.nav__lang .tube'), a = document.querySelector('.nav__lang [aria-pressed="true"]'); return [t.style.getPropertyValue('--x'), t.style.getPropertyValue('--w'), a.offsetLeft, a.offsetWidth]; }));
  await p.click('.nav__lang [data-lang="de"]'); await p.waitForTimeout(900);
  console.log('lang tube de', await p.evaluate(() => { const t = document.querySelector('.nav__lang .tube'), a = document.querySelector('.nav__lang [aria-pressed="true"]'); return [t.getBoundingClientRect().left | 0, a.getBoundingClientRect().left + 7 | 0, t.getBoundingClientRect().width | 0]; }));
  await p.evaluate(() => window.__lenis.scrollTo(document.getElementById('etlap'), { immediate: true })); await p.waitForTimeout(900);
  await p.click('#tabs button:nth-child(4)'); await p.waitForTimeout(900);
  console.log('tab tube', await p.evaluate(() => { const t = document.querySelector('#tabs .tube').getBoundingClientRect(), a = document.querySelector('#tabs [aria-selected="true"]').getBoundingClientRect(); return [t.left | 0, a.left | 0, t.width | 0, a.width | 0, t.top | 0, a.bottom | 0]; }));
  await p.evaluate(() => window.__lenis.scrollTo(document.getElementById('kave'), { immediate: true })); await p.waitForTimeout(900);
  await p.click('.roast [data-roast="1"]'); await p.waitForTimeout(900);
  console.log('roast tube', await p.evaluate(() => { const t = document.querySelector('.roast__mark').getBoundingClientRect(), a = document.querySelector('.roast [aria-checked="true"]').getBoundingClientRect(); return [t.left | 0, a.left | 0, t.width | 0, a.width | 0]; }));
  console.log('nav cur', await p.evaluate(() => [...document.querySelectorAll('#navLinks a.is-cur')].map(a => a.getAttribute('href')).join()));
  // telefon: fülek vízszintes görgetés, cső a helyén
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); m.on('pageerror', e => errs.push(e.message));
  await m.goto('http://localhost:8766/#etlap'); await m.waitForTimeout(3000);
  await m.tap('#tabs button:nth-child(6)'); await m.waitForTimeout(1200);
  console.log('m tab tube', await m.evaluate(() => { const t = document.querySelector('#tabs .tube').getBoundingClientRect(), a = document.querySelector('#tabs [aria-selected="true"]').getBoundingClientRect(); return [t.left | 0, a.left | 0, t.width | 0, a.width | 0, document.documentElement.scrollWidth]; }));
  console.log('errors', errs.join('\n') || 'none');
  await b.close();
})();
