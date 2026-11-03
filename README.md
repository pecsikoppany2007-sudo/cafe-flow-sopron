# Cafe Flow (Sopron) – bemutató oldal

Statikus oldal: `site/` (index.html, css, js, img, fonts). Nincs build.

- Netlify: a `site/` mappa tartalma a gyökér (netlify.toml: publish = "site").
- Helyi futtatás: `cd site && python3 -m http.server 8766`, majd http://localhost:8766/
- Nyelv: `?lang=hu|de|en`, különben a böngésző nyelve.
- Képek: `forras/img.py` (WebP 800/1400/2000), nyitókép: `forras/hero.py` (kialudt, neon, felkapcsolt réteg). A forrásfotók a cafeflow.hu-ról valók.
- Tesztek (`teszt/`, a globális playwrighttal: `NODE_PATH=$(npm root -g) node teszt/shot.js desk hu`):
  shot.js (képernyőképek, hibák, túlcsordulás), interact.js (élő nyelvváltás, menüpontok, fülek, pörkölésváltó, újratöltés),
  frames.js (Chrome-trace képkocka-kiesés; egyedül futtasd), tab.js (tablet, 320 px, 1920 px), reduced.js, final.js (átadási képek).
- Assetek verziója: `?v=2`. Tartalomváltozásnál emelni kell, mert a _headers egy évig cache-el.
