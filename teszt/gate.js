// v5 kapu: megjelenik, betűk kigyulladnak, görgetésre nyílik, utána a nyitány fut; telefonon húzásra
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const out = process.argv[2];
(async () => {
  const b = await chromium.launch(); const errs = [];
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8766/'); await p.waitForTimeout(400);
  await p.mouse.move(700, 500);
  for (const t of [600, 1300, 2600]) { await p.waitForTimeout(t === 600 ? 200 : 700 + (t - 1300) / 2); await p.screenshot({ path: `${out}/gate-d-${t}.png` }); }
  await p.waitForTimeout(1200);
  console.log('gate on', await p.evaluate(() => document.documentElement.classList.contains('gate-on')), 'lit', await p.evaluate(() => [...document.querySelectorAll('.gl__on')].map(e => (+getComputedStyle(e).opacity).toFixed(1)).join(',')));
  console.log('scroll locked', await p.evaluate(() => scrollY));
  await p.mouse.wheel(0, 300); await p.waitForTimeout(500); await p.screenshot({ path: `${out}/gate-d-open.png` });
  await p.waitForTimeout(3500);
  console.log('after open', await p.evaluate(() => ({ gate: !!document.getElementById('gate'), on: document.documentElement.classList.contains('gate-on'), intro: document.documentElement.classList.contains('intro-done'), y: scrollY, nav: getComputedStyle(document.querySelector('.nav')).opacity, sess: sessionStorage.getItem('flow-gate') })));
  await p.screenshot({ path: `${out}/gate-d-hero.png` });
  await p.mouse.wheel(0, 900); await p.waitForTimeout(1500); console.log('scrolls after', await p.evaluate(() => scrollY));
  await p.reload(); await p.waitForTimeout(1500); console.log('second load gate', await p.evaluate(() => document.documentElement.classList.contains('gate-on')));
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); m.on('pageerror', e => errs.push(e.message));
  await m.goto('http://localhost:8766/'); await m.waitForTimeout(3200); await m.screenshot({ path: `${out}/gate-m.png` });
  console.log('m overflow', await m.evaluate(() => document.documentElement.scrollWidth), 'sign w', await m.evaluate(() => document.querySelector('.gate__sign').getBoundingClientRect().width | 0));
  await m.tap('.gate__go'); await m.waitForTimeout(3500); await m.screenshot({ path: `${out}/gate-m-hero.png` });
  console.log('m after', await m.evaluate(() => ({ gate: !!document.getElementById('gate'), intro: document.documentElement.classList.contains('intro-done') })));
  console.log('errors', errs.join('\n') || 'none');
  await b.close();
})();
