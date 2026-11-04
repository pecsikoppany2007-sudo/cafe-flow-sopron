/* Cafe Flow – bemutató oldal, v2. GSAP + ScrollTrigger; egérrel Lenis (lassabb, puhább görgetés), érintőn natív görgetés, ott semmi nem követi az ujjat. */
(function () {
  'use strict';
  var html = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger) { html.classList.remove('js'); return; }
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ autoRound: false });

  var canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // valódi grafikus chip kell a WebGL-es nyitóképhez (szoftveres renderelésen akadna)
  var hwGpu = (function () {
    try {
      var c = document.createElement('canvas'), g = c.getContext('webgl');
      if (!g) return false;
      var ext = g.getExtension('WEBGL_debug_renderer_info');
      var r = ext ? String(g.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
      var lose = g.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext();
      return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(r);
    } catch (e) { return false; }
  })();
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var NS = 'http://www.w3.org/2000/svg';

  /* ------------------------------------------------------------------ szövegek */
  var T = {
    de: {
      'gate.go': 'Eintreten',
      'rev.title': 'Das schreiben unsere Gäste', 'rev.score': 'auf Google, über 1000 Bewertungen', 'rev.src': 'Google-Bewertung',
      'rev.q1': 'Gemütlicher, moderner Ort mit angenehmer Hintergrundmusik, tollem Frühstück, gutem Kaffee und freundlichem Personal. Ein super Start in den Tag!',
      'rev.q2': 'Mein Lieblingscafé in Sopron: riesige Auswahl, freundliches und fachlich gut geschultes Personal, gute Lage, gute Stimmung.',
      'rev.q3': 'Freundlicher Service, super Auswahl! Wir sind beim Stadtbummel vorbeigekommen und am nächsten Tag gleich noch einmal, so gut war es!',
      'rev.note': 'Auf Ungarisch geschrieben, hier übersetzt.', 'rev.ask': 'Warst du bei uns? Schreib uns, wie es war.', 'rev.write': 'Bewertung schreiben', 'idx.rev': 'Bewertungen',
      'skip': 'Zum Inhalt',
      'nav.menu': 'Speisekarte', 'nav.coffee': 'Kaffee', 'nav.upstairs': 'Obergeschoss', 'nav.hours': 'Öffnungszeiten', 'nav.open': 'Menü',
      'hero.title': 'Café an der Grabenrunde in Sopron', 'hero.addr': 'Várkerület 53.', 'hero.menu': 'Speisekarte', 'hero.route': 'Route planen',
      'intro.title': 'Seit 2018 an der Grabenrunde',
      'intro.p1': '2018 haben wir hier eröffnet und fünf Jahre lang als Partner von Cafe Frei gearbeitet. Seit wir selbstständig sind, heißen wir Cafe Flow und stellen die Getränkekarte selbst zusammen.',
      'intro.p2': 'Im Erdgeschoss stehen neben der Theke blaue Samtbänke vor den bemalten Wandpaneelen. Die goldfarbene Wendeltreppe führt ins Obergeschoss, dort richten wir auch Feiern aus.',
      'intro.rating': 'auf Google, aus über 1000 Bewertungen',
      'coffee.title': 'Kaffee aus zwei Röstungen',
      'coffee.p1': 'Unseren Kaffee röstet CrackerJack Coffee Roasters. Jeden klassischen Kaffee bekommst du aus dunkler oder heller Röstung, die helle kostet 40 bis 100 Forint mehr.',
      'coffee.roast': 'Röstung', 'coffee.dark': 'Dunkle Röstung', 'coffee.light': 'Helle Röstung',
      'coffee.extras': 'Mandel-, Hafer-, Kokosdrink oder laktosefreie Milch +250 Ft. Extra Shot 350 Ft dunkel, 400 Ft hell. Schlagsahne 350 Ft.',
      'roast.0': 'Dunkle Röstung: brasilianischer Santos und Robusta aus Uganda. Schokoladig, nussig, würzig.',
      'roast.1': 'Helle Röstung: eine einzelne Herkunft, die ab und zu wechselt. Frag an der Theke, welche gerade da ist.',
      'flav.title': 'Kaffee mit Geschmack',
      'flav.p': 'Zwanzig stehen auf der Karte. Viele tragen den Namen eines Ortes: Havanna, Istanbul, Salzburg, Bali, Piemont, Marokko, Paris.',
      'flav.esp': 'Espresso', 'flav.cap': 'Cappuccino', 'flav.lat': 'Latte',
      'menu.title': 'Speisekarte', 'menu.note': 'Preise in Forint, laut unserer Karte vom Januar 2026. Bei Wolt und foodora gelten deren eigene Preise.',
      'up.title': 'Feiern im Obergeschoss',
      'up.p1': 'Die Wendeltreppe führt ins Obergeschoss. Der Raum lässt sich abtrennen, er bietet Platz für 30+10 Personen, und die Tische stellen wir so, wie du es möchtest.',
      'up.p2': 'Wir vermieten ihn für Geburtstage, Schulabschlüsse, Firmenfeiern oder Familientreffen. Schreib uns Datum und Personenzahl, dann schicken wir ein Angebot.',
      'up.btn': 'Angebot per E-Mail anfragen', 'up.subject': 'Feier im Obergeschoss',
      'cap.emelet': 'Das Obergeschoss', 'cap.kulonterem': 'Der separate Raum',
      'house.terrace': 'Terrasse', 'house.terraceP': 'Ab dem Frühling sitzt du auch draußen, auf der Terrasse an der Grabenrunde, unter dem blauen Schild.',
      'house.shop': 'Kaffee und Tee für zu Hause',
      'house.shopP': 'Kaffeebohnen und losen Tee kannst du direkt aus dem Regal kaufen. Auf Wunsch mahlen wir den Kaffee so fein, wie ihn deine Kaffeemaschine braucht.',
      'house.decaf': 'Unser entkoffeinierter Kaffee kommt von der Finca la Caoba in Kolumbien, mit Noten von Nougat, Kakaobohne und Zitrus. An der Theke bekommst du auch entkoffeinierten Kaffee.',
      'house.card': 'Wir haben auch eine kostenlose Stammkundenkarte, frag an der Theke danach.',
      'hours.title': 'Öffnungszeiten', 'hours.mt': 'Montag–Donnerstag', 'hours.fr': 'Freitag', 'hours.sa': 'Samstag', 'hours.su': 'Sonntag',
      'contact.title': 'Kontakt', 'contact.addr': 'Adresse', 'contact.mail': 'E-Mail', 'contact.delivery': 'Lieferung',
      'foot.company': 'Betreiber: Cafe World Kft.', 'foot.photos': 'Fotos: Cafe Flow (cafeflow.hu)', 'foot.demo': 'Demoseite, nicht die offizielle Website von Cafe Flow.',
      'alt.pult': 'Die Theke mit der Wendeltreppe und der Bananenstaude', 'alt.latte': 'Latte Art neben einem Croissant', 'alt.csiga': 'Die Wendeltreppe und die Leopardenfigur', 'alt.emelet': 'Der helle Raum im Obergeschoss', 'alt.kulonterem': 'Der separate Raum mit Tapete und Eichenkommode', 'alt.terasz': 'Die Terrasse an der Grabenrunde unter dem blauen Schild', 'alt.csomagok': 'Kaffee- und Teepackungen von Cafe Flow', 'alt.falfestes': 'Das Erdgeschoss bei den bemalten Wandpaneelen, mit blauer Samtbank',
      'today': 'Heute {h}', 'closedToday': 'Heute geschlossen',
      'now.open': 'Jetzt geöffnet, bis {c}.', 'now.before': 'Jetzt geschlossen, heute öffnen wir um {o}.', 'now.after': 'Jetzt geschlossen, morgen öffnen wir um {o}.',
      'tour.title': 'Rundgang', 'tour.p': 'Ein paar Bilder vom Café, von der Theke bis zur Terrasse.',
      'tour.c1': 'Die Vitrine an der Theke', 'tour.c2': 'Blaue Samtbänke vor den bemalten Wandpaneelen', 'tour.c3': 'Im Obergeschoss', 'tour.c4': 'Terrasse an der Grabenrunde, ab dem Frühling',
      'alt.vitrin': 'Die Glasvitrine an der Theke', 'alt.sarok': 'Sessel an einem runden Tisch im Obergeschoss', 'alt.ajto': 'Der Eingang am Abend, mit dem leuchtenden Cafe-FLOW-Schild',
      'idx.about': 'Über uns', 'idx.shop': 'Für zu Hause', 'edge.open': 'Geöffnet bis {c}', 'edge.closed': 'Geschlossen, öffnet {o}',
      'meta.title': 'Cafe Flow, Café an der Grabenrunde in Sopron',
      'meta.desc': 'Café und Frühstück in Sopron, Várkerület 53. Kaffee aus dunkler und heller Röstung, Frühstück, Kuchen, Raum für Feiern im Obergeschoss. Täglich geöffnet.'
    },
    en: {
      'gate.go': 'Come in',
      'rev.title': 'What our guests say', 'rev.score': 'on Google, over 1,000 reviews', 'rev.src': 'Google review',
      'rev.q1': 'A cosy, modern place with pleasant background music, great breakfasts, good coffee and friendly staff. A great way to start the day!',
      'rev.q2': 'My favourite café in Sopron: a huge selection, kind and well-trained staff, a good spot with a good atmosphere.',
      'rev.q3': 'Friendly service, great selection! We popped in while sightseeing and came back again the next day, it was that good!',
      'rev.note': 'Written in Hungarian, translated here.', 'rev.ask': 'Been to see us? Tell us how it was.', 'rev.write': 'Write a review', 'idx.rev': 'Reviews',
      'skip': 'Skip to content',
      'nav.menu': 'Menu', 'nav.coffee': 'Coffee', 'nav.upstairs': 'Upstairs', 'nav.hours': 'Opening hours', 'nav.open': 'Menu',
      'hero.title': 'Café on Várkerület in Sopron', 'hero.addr': 'Várkerület 53.', 'hero.menu': 'Menu', 'hero.route': 'Directions',
      'intro.title': 'On Várkerület since 2018',
      'intro.p1': 'We opened here in 2018 and spent five years as a Cafe Frei partner. Since going independent we have been called Cafe Flow, and we put the drinks list together ourselves.',
      'intro.p2': 'Downstairs, next to the counter, blue velvet benches line the painted wall panels. The gold spiral staircase leads upstairs, where we also host events.',
      'intro.rating': 'on Google, from over 1,000 reviews',
      'coffee.title': 'Coffee from two roasts',
      'coffee.p1': 'Our coffee is roasted by CrackerJack Coffee Roasters. You can have every classic coffee from a dark or a light roast; the light roast costs 40 to 100 forints more.',
      'coffee.roast': 'Roast', 'coffee.dark': 'Dark roast', 'coffee.light': 'Light roast',
      'coffee.extras': 'Almond, oat or coconut drink, or lactose-free milk +250 Ft. Extra shot 350 Ft dark, 400 Ft light. Whipped cream 350 Ft.',
      'roast.0': 'Dark roast: Brazilian Santos with Ugandan robusta. Chocolatey, nutty, spicy.',
      'roast.1': 'Light roast: a single origin that changes now and then. Ask at the counter which one we have.',
      'flav.title': 'Flavoured coffees',
      'flav.p': 'There are twenty on the list. Many are named after a place: Havana, Istanbul, Salzburg, Bali, Piedmont, Morocco, Paris.',
      'flav.esp': 'espresso', 'flav.cap': 'cappuccino', 'flav.lat': 'latte',
      'menu.title': 'Menu', 'menu.note': 'Prices in forints, from our January 2026 menu. Wolt and foodora charge their own prices.',
      'up.title': 'Events upstairs',
      'up.p1': 'The spiral staircase takes you upstairs. The room can be closed off, it seats 30+10 people, and we set the tables the way you want them.',
      'up.p2': 'You can book it for birthdays, graduations, company events or family get-togethers. Send us the date and the number of guests and we will reply with an offer.',
      'up.btn': 'Ask for an offer by email', 'up.subject': 'Event upstairs',
      'cap.emelet': 'Upstairs', 'cap.kulonterem': 'The private room',
      'house.terrace': 'Terrace', 'house.terraceP': 'From early spring you can sit outside on the terrace facing Várkerület, under the blue sign.',
      'house.shop': 'Coffee and tea to take home',
      'house.shopP': 'You can buy whole beans and loose-leaf tea straight off the shelf. If you like, we grind the coffee to suit your coffee maker.',
      'house.decaf': 'Our decaf comes from Finca la Caoba in Colombia, with notes of nougat, cocoa nib and citrus. You can order decaf at the counter too.',
      'house.card': 'We also have a free loyalty card, just ask at the counter.',
      'hours.title': 'Opening hours', 'hours.mt': 'Monday–Thursday', 'hours.fr': 'Friday', 'hours.sa': 'Saturday', 'hours.su': 'Sunday',
      'contact.title': 'Contact', 'contact.addr': 'Address', 'contact.mail': 'Email', 'contact.delivery': 'Delivery',
      'foot.company': 'Run by Cafe World Kft.', 'foot.photos': 'Photos: Cafe Flow (cafeflow.hu)', 'foot.demo': 'Demo page, not the official Cafe Flow website.',
      'alt.pult': 'The counter with the spiral staircase and the banana plant', 'alt.latte': 'Latte art next to a croissant', 'alt.csiga': 'The spiral staircase and the leopard statue', 'alt.emelet': 'The bright room upstairs', 'alt.kulonterem': 'The private room with wallpaper and an oak sideboard', 'alt.terasz': 'The terrace on Várkerület under the blue sign', 'alt.csomagok': 'Cafe Flow coffee and tea packs', 'alt.falfestes': 'Downstairs by the painted wall panels, with the blue velvet bench',
      'today': 'Today {h}', 'closedToday': 'Closed today',
      'now.open': 'Open now, until {c}.', 'now.before': 'Closed now, we open today at {o}.', 'now.after': 'Closed now, we open tomorrow at {o}.',
      'tour.title': 'Look around', 'tour.p': 'A few pictures of the café, from the counter to the terrace.',
      'tour.c1': 'The display case at the counter', 'tour.c2': 'Blue velvet benches by the painted wall panels', 'tour.c3': 'Upstairs', 'tour.c4': 'The terrace on Várkerület, from early spring',
      'alt.vitrin': 'The glass display case at the counter', 'alt.sarok': 'Armchairs at a round table upstairs', 'alt.ajto': 'The entrance in the evening, with the lit Cafe FLOW sign',
      'idx.about': 'About', 'idx.shop': 'To take home', 'edge.open': 'Open until {c}', 'edge.closed': 'Closed, opens {o}',
      'meta.title': 'Cafe Flow, café on Várkerület in Sopron',
      'meta.desc': 'Café and breakfast in Sopron, Várkerület 53. Coffee from a dark and a light roast, breakfast, cakes, an upstairs room for events. Open every day.'
    },
    hu: {
      'gate.go': 'Belépés',
      'rev.write': 'Írj értékelést', 'idx.rev': 'Értékelések',
      'coffee.roast': 'Pörkölés',
      'roast.0': 'Sötét pörkölés: brazil santos és ugandai robusta keveréke. Csokis, mogyorós, fűszeres.',
      'roast.1': 'Világos pörkölés: egyetlen eredetből, ami időnként változik. Kérdezd meg a pultnál, épp melyik van.',
      'up.subject': 'Rendezvény az emeleten',
      'today': 'Ma {h}', 'closedToday': 'Ma zárva',
      'idx.about': 'Rólunk', 'idx.shop': 'Kávé haza', 'edge.open': 'Nyitva {c}-ig', 'edge.closed': 'Zárva, nyitás {o}',
      'now.open': 'Most nyitva vagyunk, {c}-ig.', 'now.before': 'Most zárva vagyunk, ma {o}-kor nyitunk.', 'now.after': 'Most zárva vagyunk, holnap {o}-kor nyitunk.'
    }
  };

  /* ------------------------------------------------------------------ étlap (2026. januári menülap) */
  // [hu, de, en, ár vagy [ár1, ár2], leírás hu, de, en]
  var CLASSIC = [
    ['Espresso', 'Espresso', 'Espresso', [750, 790]],
    ['Dupla espresso', 'Doppelter Espresso', 'Double espresso', [990, 1090]],
    ['Espresso macchiato', 'Espresso macchiato', 'Espresso macchiato', [790, 850]],
    ['Americano', 'Americano', 'Americano', [850, 890]],
    ['Cortado', 'Cortado', 'Cortado', [950, 990]],
    ['Cappuccino', 'Cappuccino', 'Cappuccino', [1150, 1190]],
    ['Kapuziner', 'Kapuziner', 'Kapuziner', [1150, 1190]],
    ['Flat white', 'Flat White', 'Flat white', [1390, 1450]],
    ['Latte', 'Latte', 'Latte', [1290, 1350]]
  ];
  var FLAV = [
    ['Narancsos espresso', 'Orangen-Espresso', 'Orange espresso', [850, 0, 0]],
    ['Chilis espresso', 'Chili-Espresso', 'Chilli espresso', [850, 0, 0]],
    ['Havanna espresso', 'Havanna-Espresso', 'Havana espresso', [850, 0, 0]],
    ['Szavanna kávé', 'Savannen-Kaffee', 'Savanna coffee', [950, 1290, 1490]],
    ['Dohánykávé', 'Tabakkaffee', 'Tobacco coffee', [950, 1290, 1490]],
    ['Fűszeres török kávé', 'Gewürzter türkischer Kaffee', 'Spiced Turkish coffee', [0, 1150, 0]],
    ['Isztambuli narancskávé', 'Istanbuler Orangenkaffee', 'Istanbul orange coffee', [0, 1150, 0]],
    ['Salzburgi Mozart kávé', 'Salzburger Mozart-Kaffee', 'Salzburg Mozart coffee', [0, 0, 1590]],
    ['Csokis narancsos marcipán kávé', 'Schoko-Orangen-Marzipan-Kaffee', 'Chocolate orange marzipan coffee', [0, 0, 1590]],
    ['Bourbon vanília', 'Bourbon-Vanille', 'Bourbon vanilla', [0, 1290, 1390]],
    ['Bali kókusz-macchiato', 'Bali-Kokos-Macchiato', 'Bali coconut macchiato', [0, 1290, 1390]],
    ['Mandula kávé', 'Mandelkaffee', 'Almond coffee', [0, 1290, 1390]],
    ['Piemonti mogyorókávé', 'Piemonteser Haselnusskaffee', 'Piedmont hazelnut coffee', [0, 1290, 1390]],
    ['Marokkói fűszeres mokka', 'Marokkanischer Gewürzmokka', 'Moroccan spiced mocha', [0, 0, 1590]],
    ['Fehércsokis kókusz latte', 'Weiße-Schoko-Kokos-Latte', 'White chocolate coconut latte', [0, 0, 1490]],
    ['Fahéjas karamellakávé', 'Zimt-Karamell-Kaffee', 'Cinnamon caramel coffee', [0, 0, 1590]],
    ['Pisztáciás matcha kávé', 'Pistazien-Matcha-Kaffee', 'Pistachio matcha coffee', [0, 1490, 1590]],
    ['Párizsi illatos rózsakávé', 'Pariser Rosenkaffee', 'Parisian rose coffee', [0, 1290, 1390]],
    ['Snickers kávé', 'Snickers-Kaffee', 'Snickers coffee', [0, 1390, 1490]],
    ['Mézeskalács kávé', 'Lebkuchenkaffee', 'Gingerbread coffee', [0, 1290, 1390]]
  ];
  var L3 = { hu: '3 dl', de: '3 dl', en: '3 dl' }, L5 = { hu: '5 dl', de: '5 dl', en: '5 dl' };
  var TABS = [
    { id: 'reggeli', l: ['Reggeli', 'Frühstück', 'Breakfast'], img: 'tukortojas', cap: ['Tükörtojás a serpenyőben', 'Spiegeleier in der Pfanne', 'Fried eggs in the pan'],
      g: [{ items: [
        ['Tükörtojás (3 tojásból)', 'Spiegeleier (aus 3 Eiern)', 'Fried eggs (3 eggs)', 1890],
        ['Rántotta (3 tojásból)', 'Rührei (aus 3 Eiern)', 'Scrambled eggs (3 eggs)', 1890],
        ['Ham and eggs (3 tojásból)', 'Ham and Eggs (aus 3 Eiern)', 'Ham and eggs (3 eggs)', 2690],
        ['Sajtos tojásrántotta (3 tojásból)', 'Rührei mit Käse (aus 3 Eiern)', 'Scrambled eggs with cheese (3 eggs)', 2390],
        ['Sonkás tojásrántotta (3 tojásból)', 'Rührei mit Schinken (aus 3 Eiern)', 'Scrambled eggs with ham (3 eggs)', 2390],
        ['Bundáskenyér fokhagymás tejföllel', 'Arme Ritter mit Knoblauch-Sauerrahm', 'Eggy bread with garlic sour cream', 2190],
        ['Francia bundáskenyér fügelekvárral', 'French Toast mit Feigenmarmelade', 'French toast with fig jam', 2290],
        ['Gyümölcsös granola', 'Granola mit Obst', 'Granola with fruit', 1990],
        ['Csokis, banános, kókuszos granola', 'Granola mit Schokolade, Banane und Kokos', 'Chocolate, banana and coconut granola', 1990],
        ['Smoothie bowl', 'Smoothie Bowl', 'Smoothie bowl', 1990]
      ] }] },
    { id: 'menuk', l: ['Menük', 'Menüs', 'Set menus'], img: 'granola', cap: ['Joghurtos granola, kávé, narancslé', 'Joghurt-Granola, Kaffee, Orangensaft', 'Yoghurt granola, coffee, orange juice'],
      g: [{ items: [
        ['Menü 1', 'Menü 1', 'Menu 1', 3390, 'Egy választott tojásétel, klasszikus kávé, narancslé, almalé vagy őszilé', 'Ein Eiergericht nach Wahl, klassischer Kaffee, Orangen-, Apfel- oder Pfirsichsaft', 'An egg dish of your choice, classic coffee, orange, apple or peach juice'],
        ['Menü 2', 'Menü 2', 'Menu 2', 2290, 'Egy választott croissant, klasszikus kávé, narancslé, almalé vagy őszilé', 'Ein Croissant nach Wahl, klassischer Kaffee, Orangen-, Apfel- oder Pfirsichsaft', 'A croissant of your choice, classic coffee, orange, apple or peach juice'],
        ['Menü 3', 'Menü 3', 'Menu 3', 3690, 'Egy választott lepényes étel, klasszikus kávé, narancslé, almalé vagy őszilé', 'Ein Fladenbrot nach Wahl, klassischer Kaffee, Orangen-, Apfel- oder Pfirsichsaft', 'A flatbread of your choice, classic coffee, orange, apple or peach juice'],
        ['Menü 4', 'Menü 4', 'Menu 4', 2890, 'Egy választott joghurtos granola, klasszikus kávé, narancslé, almalé vagy őszilé', 'Ein Joghurt-Granola nach Wahl, klassischer Kaffee, Orangen-, Apfel- oder Pfirsichsaft', 'A yoghurt granola of your choice, classic coffee, orange, apple or peach juice'],
        ['Menü 5', 'Menü 5', 'Menu 5', 4790, 'Lazacos, krémsajtos bagel, szabadon választott kávé, frissen préselt narancslé', 'Bagel mit Lachs und Frischkäse, Kaffee nach Wahl, frisch gepresster Orangensaft', 'Salmon and cream cheese bagel, any coffee, freshly squeezed orange juice'],
        ['Menü 6', 'Menü 6', 'Menu 6', 4790, 'Cézár saláta csirkecsíkokkal, klasszikus kávé, választott 3 dl-es limonádé', 'Caesar Salad mit Hähnchenstreifen, klassischer Kaffee, Limonade (3 dl) nach Wahl', 'Caesar salad with chicken strips, classic coffee, a 3 dl lemonade of your choice']
      ], note: ['Az 1–4. menüben a klasszikus kávé helyett ízesítettet +300 Ft-ért, a gyümölcslé helyett frissen préselt narancslét +300 Ft-ért kérhetsz. Növényi ital +250 Ft.', 'In Menü 1–4 gibt es statt des klassischen Kaffees einen mit Geschmack für +300 Ft und statt des Safts frisch gepressten Orangensaft für +300 Ft. Pflanzendrink +250 Ft.', 'In menus 1–4 you can swap the classic coffee for a flavoured one (+300 Ft) and the juice for freshly squeezed orange juice (+300 Ft). Plant-based milk +250 Ft.'] }] },
    { id: 'lepeny', l: ['Lepények', 'Fladenbrote', 'Flatbreads'], img: 'lepeny', cap: ['Lepény kávéval és narancslével', 'Fladenbrot mit Kaffee und Orangensaft', 'Flatbread with coffee and orange juice'],
      g: [{ items: [
        ['Chilis marharagus', 'Chili-Rindfleischragout', 'Chilli beef ragout', 2490],
        ['Extra (sonka, bacon, lilahagyma, sajt)', 'Extra (Schinken, Speck, rote Zwiebel, Käse)', 'Extra (ham, bacon, red onion, cheese)', 2490],
        ['Görög csirkés', 'Griechisch mit Hähnchen', 'Greek chicken', 2490],
        ['Mézes-mustáros csirkés', 'Hähnchen mit Honig-Senf', 'Honey mustard chicken', 2390],
        ['Parajos-fetás', 'Spinat und Feta', 'Spinach and feta', 2290]
      ] }] },
    { id: 'szendvics', l: ['Saláták, szendvicsek', 'Salate, Sandwiches', 'Salads, sandwiches'], img: 'szendvics', cap: ['Szendvics és desszert', 'Sandwich und Dessert', 'Sandwich and dessert'],
      g: [{ items: [
        ['Cézár saláta', 'Caesar Salad', 'Caesar salad', 2590, 'Római saláta, paradicsom, parmezán, pirított kenyérkocka, cézár salátaöntet', 'Römersalat, Tomate, Parmesan, Croûtons, Caesar-Dressing', 'Romaine, tomato, parmesan, croutons, Caesar dressing'],
        ['Cézár saláta csirkecsíkokkal', 'Caesar Salad mit Hähnchenstreifen', 'Caesar salad with chicken strips', 3690],
        ['Füstölt padlizsánkrém', 'Geräucherte Auberginencreme', 'Smoked aubergine spread', 2890, 'Padlizsán, vaj, vöröshagyma, fokhagyma, kaliforniai paprika, petrezselyem, fűszerek, 4 db pirítós', 'Aubergine, Butter, Zwiebel, Knoblauch, Paprika, Petersilie, Gewürze, 4 Scheiben Toast', 'Aubergine, butter, onion, garlic, bell pepper, parsley, spices, 4 slices of toast'],
        ['Plusz adag pirítós (4 db)', 'Extra Toast (4 Scheiben)', 'Extra toast (4 slices)', 400],
        ['Négysajtos toast', 'Vier-Käse-Toast', 'Four-cheese toastie', 1790],
        ['Sonkás sajtos toast', 'Schinken-Käse-Toast', 'Ham and cheese toastie', 1790],
        ['Lazacos, krémsajtos bagel', 'Bagel mit Lachs und Frischkäse', 'Salmon and cream cheese bagel', 2990],
        ['Avokádó, tükörtojás pirított kenyéren, balzsamecetes salátával', 'Avocado und Spiegelei auf Toast, mit Balsamico-Salat', 'Avocado and fried egg on toast, with balsamic salad', 2690],
        ['Mozzarellás, aszalt paradicsomos bagett', 'Baguette mit Mozzarella und getrockneten Tomaten', 'Mozzarella and sun-dried tomato baguette', 1190],
        ['Sonkás, humuszos, paradicsomos szendvics', 'Sandwich mit Schinken, Hummus und Tomate', 'Ham, hummus and tomato sandwich', 1390],
        ['Sonkás, edamis, zöldalmás háromszög', 'Dreieck-Sandwich mit Schinken, Edamer und grünem Apfel', 'Ham, Edam and green apple triangle', 1390]
      ], note: ['Szendvicseinket frissen készítjük.', 'Die Sandwiches machen wir frisch.', 'We make the sandwiches fresh.'] }] },
    { id: 'suti', l: ['Sütemények', 'Kuchen', 'Cakes'], img: 'suti', cap: ['Torta és cappuccino', 'Torte und Cappuccino', 'Cake and cappuccino'],
      g: [{ text: ['A süteményeket a pultnál, a vitrinben választhatod ki. Van vegán és mentes is. A kínálat naponta változik, októberben például somlói galuska, pisztáciás tiramisu, répatorta, citromkrémes málnás szelet és vegán pisztáciás-vaníliás kocka is volt.', 'Die Kuchen suchst du dir an der Theke in der Vitrine aus. Es gibt auch vegane und freie-von Kuchen. Das Angebot wechselt täglich, im Oktober gab es zum Beispiel Somlói Galuska, Pistazien-Tiramisu, Karottenkuchen, Zitronencreme-Himbeer-Schnitte und vegane Pistazien-Vanille-Würfel.', 'You choose cakes at the counter from the display. There are vegan and free-from ones too. The selection changes daily; in October it included Somlói galuska, pistachio tiramisu, carrot cake, lemon cream and raspberry slice, and vegan pistachio vanilla squares.'] }] },
    { id: 'jeges', l: ['Jeges italok', 'Kalte Getränke', 'Cold drinks'], img: 'matcha', cap: ['Jeges matcha és keksz', 'Eis-Matcha und Kekse', 'Iced matcha and cookies'],
      g: [
        { t: ['Jegeskávék', 'Eiskaffee', 'Iced coffee'], items: [
          ['Klasszikus jegeskávé fagyival', 'Klassischer Eiskaffee mit Eis', 'Classic iced coffee with ice cream', 2390],
          ['Ice latte', 'Ice Latte', 'Iced latte', 1590],
          ['Cold brew', 'Cold Brew', 'Cold brew', 1290],
          ['Narancsos cold brew', 'Orangen-Cold-Brew', 'Orange cold brew', 1590],
          ['Skandi karamellás jegeskávé', 'Skandinavischer Karamell-Eiskaffee', 'Scandi caramel iced coffee', 2290],
          ['Pisztáciás matchás jegeskávé', 'Pistazien-Matcha-Eiskaffee', 'Pistachio matcha iced coffee', 2390],
          ['Hollywood jegeskávé', 'Hollywood-Eiskaffee', 'Hollywood iced coffee', 2190],
          ['Choko joy', 'Choko Joy', 'Choko joy', 2490],
          ['Espresso tonic', 'Espresso Tonic', 'Espresso tonic', 1590]
        ] },
        { t: ['Shake-ek', 'Shakes', 'Shakes'], items: [
          ['Vaníliás, banános, epres vagy mangós shake', 'Vanille-, Bananen-, Erdbeer- oder Mango-Shake', 'Vanilla, banana, strawberry or mango shake', 1690],
          ['Oreo shake', 'Oreo-Shake', 'Oreo shake', 1890]
        ] },
        { t: ['Limonádék, jeges teák', 'Limonaden, Eistee', 'Lemonades, iced tea'], two: true, items: [
          ['Jeges matcha', 'Eis-Matcha', 'Iced matcha', [1490, 0]],
          ['Klasszikus limonádé', 'Klassische Limonade', 'Classic lemonade', [1290, 1890]],
          ['Mangó, málna, eper, cseresznye vagy dinnye limonádé', 'Mango-, Himbeer-, Erdbeer-, Kirsch- oder Melonenlimonade', 'Mango, raspberry, strawberry, cherry or melon lemonade', [1290, 1890]],
          ['Erdei gyümölcsös jegestea', 'Waldfrucht-Eistee', 'Forest fruit iced tea', [1290, 1890]],
          ['Mangós jázminos jeges zöldtea', 'Grüner Eistee mit Mango und Jasmin', 'Mango jasmine iced green tea', [1290, 1890]],
          ['Barackos házi jegestea', 'Hausgemachter Pfirsich-Eistee', 'Homemade peach iced tea', [1290, 1890]],
          ['Bodzaszörp, hozzáadott cukor nélkül', 'Holunderblütensirup, ohne Zuckerzusatz', 'Elderflower cordial, no added sugar', [990, 1290]],
          ['Levendulaszörp', 'Lavendelsirup', 'Lavender cordial', [990, 1290]]
        ] }
      ] },
    { id: 'forro', l: ['Tea, forró csoki', 'Tee, heiße Schokolade', 'Tea, hot chocolate'], img: 'cappuccino', cap: ['Cappuccino', 'Cappuccino', 'Cappuccino'],
      g: [
        { t: ['Forró italok', 'Heißgetränke', 'Hot drinks'], items: [
          ['Chai latte', 'Chai Latte', 'Chai latte', 1390],
          ['Matcha latte', 'Matcha Latte', 'Matcha latte', 1590],
          ['Chilis, mogyorós, alpesi, kókuszos vagy fehér forró csoki', 'Heiße Schokolade mit Chili, Haselnuss, Alpen, Kokos oder weiß', 'Chilli, hazelnut, alpine, coconut or white hot chocolate', 1390],
          ['Habos forró tejkaramella', 'Heiße Milchkaramell mit Sahne', 'Hot milk caramel with cream', 1390],
          ['Habos kakaó', 'Kakao mit Sahne', 'Cocoa with cream', 1190]
        ] },
        { t: ['Teák', 'Tee', 'Tea'], items: [
          ['Vaníliás eper (zöld tea)', 'Vanille-Erdbeere (grüner Tee)', 'Vanilla strawberry (green tea)', 950],
          ['Jázmin (zöld tea)', 'Jasmin (grüner Tee)', 'Jasmine (green tea)', 950],
          ['Royal earl grey (fekete tea)', 'Royal Earl Grey (schwarzer Tee)', 'Royal Earl Grey (black tea)', 950],
          ['Áfonya kaktusz (fekete tea)', 'Cranberry-Kaktus (schwarzer Tee)', 'Cranberry cactus (black tea)', 950],
          ['Erdei gyümölcs (gyümölcstea)', 'Waldfrucht (Früchtetee)', 'Forest fruit (fruit tea)', 950],
          ['Karácsony varázsa (gyümölcstea)', 'Weihnachtszauber (Früchtetee)', 'Christmas magic (fruit tea)', 950],
          ['Gyógynövénykert (gyógynövény)', 'Kräutergarten (Kräutertee)', 'Herb garden (herbal tea)', 950],
          ['Mandarin gyömbérrel (rooibos)', 'Mandarine mit Ingwer (Rooibos)', 'Mandarin with ginger (rooibos)', 950]
        ] }
      ] },
    { id: 'koktel', l: ['Koktélok', 'Cocktails', 'Cocktails'], img: 'italok', cap: ['Italok a pultról', 'Getränke von der Theke', 'Drinks from the bar'],
      g: [
        { t: ['Koktélok, long drinkek 18+', 'Cocktails, Longdrinks 18+', 'Cocktails, long drinks 18+'], items: [
          ['Hugo', 'Hugo', 'Hugo', 1790], ['Gin tonic', 'Gin Tonic', 'Gin and tonic', 1790], ['Uborkás gin tonic', 'Gin Tonic mit Gurke', 'Cucumber gin and tonic', 1990], ['Rosé gin tonic', 'Rosé Gin Tonic', 'Rosé gin and tonic', 1990],
          ['Mojito', 'Mojito', 'Mojito', 1990], ['Epres mojito', 'Erdbeer-Mojito', 'Strawberry mojito', 1990], ['Aperol Spritz', 'Aperol Spritz', 'Aperol Spritz', 2090], ['Eper-barack Spritz', 'Erdbeer-Pfirsich-Spritz', 'Strawberry peach Spritz', 2290],
          ['Sárkánygyümölcsös blue dream', 'Blue Dream mit Drachenfrucht', 'Dragon fruit blue dream', 2090], ['Piña colada', 'Piña Colada', 'Piña colada', 2290], ['Espresso martini', 'Espresso Martini', 'Espresso martini', 1990], ['Cuba libre', 'Cuba Libre', 'Cuba libre', 1990]
        ] },
        { t: ['Alkoholos kávék 18+', 'Kaffee mit Alkohol 18+', 'Coffee with alcohol 18+'], items: [
          ['Csokoládés whisky kávé', 'Schokoladen-Whisky-Kaffee', 'Chocolate whisky coffee', 2290], ['Karamellás rum kávé', 'Karamell-Rum-Kaffee', 'Caramel rum coffee', 2290]
        ] },
        { t: ['Alkoholmentes koktélok', 'Alkoholfreie Cocktails', 'Alcohol-free cocktails'], items: [
          ['Virgin piña colada', 'Virgin Piña Colada', 'Virgin piña colada', 1790], ['Virgin mojito', 'Virgin Mojito', 'Virgin mojito', 1690], ['Virgin epres mojito', 'Virgin Erdbeer-Mojito', 'Virgin strawberry mojito', 1690], ['Virgin eper-barack Spritz', 'Virgin Erdbeer-Pfirsich-Spritz', 'Virgin strawberry peach Spritz', 1690]
        ] }
      ] },
    { id: 'bor', l: ['Bor, sör, üdítő', 'Wein, Bier, Softdrinks', 'Wine, beer, soft drinks'], img: 'pult2', cap: ['A pult és az itallap a falon', 'Die Theke mit der Karte an der Wand', 'The counter with the menu boards'],
      g: [
        { t: ['Bor és sör 18+', 'Wein und Bier 18+', 'Wine and beer 18+'], items: [
          ['Olaszrizling, száraz (1 dl)', 'Welschriesling, trocken (1 dl)', 'Olaszrizling, dry (1 dl)', 590],
          ['Supernova, félédes (1 dl)', 'Supernova, halbsüß (1 dl)', 'Supernova, medium sweet (1 dl)', 690],
          ['Kékfrankos rozé, száraz (1 dl)', 'Blaufränkisch Rosé, trocken (1 dl)', 'Kékfrankos rosé, dry (1 dl)', 590],
          ['Prof. Zweigelt, száraz (1 dl)', 'Prof. Zweigelt, trocken (1 dl)', 'Prof. Zweigelt, dry (1 dl)', 690],
          ['Szóda fröccsökhöz (1 dl)', 'Soda für Gespritzten (1 dl)', 'Soda for spritzers (1 dl)', 100],
          ['Heineken (0,33 l)', 'Heineken (0,33 l)', 'Heineken (0.33 l)', 890],
          ['Gösser Natur Zitrone 0% (0,33 l)', 'Gösser Natur Zitrone 0% (0,33 l)', 'Gösser Natur Zitrone 0% (0.33 l)', 890]
        ], note: ['A borok a Winelife-tól vannak.', 'Die Weine kommen von Winelife.', 'Our wines are from Winelife.'] },
        { t: ['Üdítők', 'Softdrinks', 'Soft drinks'], items: [
          ['Pepsi, Pepsi Max, Canada Dry, tonic (0,5 l)', 'Pepsi, Pepsi Max, Canada Dry, Tonic (0,5 l)', 'Pepsi, Pepsi Max, Canada Dry, tonic (0.5 l)', 890],
          ['Ásványvíz, mentes vagy szénsavas (0,5 l)', 'Mineralwasser, still oder prickelnd (0,5 l)', 'Mineral water, still or sparkling (0.5 l)', 690],
          ['Toma őszibarack, narancs, alma (0,33 l)', 'Toma Pfirsich, Orange, Apfel (0,33 l)', 'Toma peach, orange, apple (0.33 l)', 890],
          ['Frissen préselt narancslé (0,1 l)', 'Frisch gepresster Orangensaft (0,1 l)', 'Freshly squeezed orange juice (0.1 l)', 490]
        ], note: ['A palackos italokra 50 Ft betétdíj jön.', 'Auf Flaschen kommen 50 Ft Pfand.', 'Bottles carry a 50 Ft deposit.'] }
      ] }
  ];
  var IMG = { tukortojas: [800, 1400], granola: [800, 1400], lepeny: [800, 1400], szendvics: [800, 1400], suti: [800, 1400], matcha: [800, 1400], cappuccino: [800, 1400], italok: [800, 1400], pult2: [800, 1400] };

  /* ------------------------------------------------------------------ nyelv */
  var LI = { hu: 0, de: 1, en: 2 };
  var lang = 'hu';
  var huText = {}, huAlt = {};
  $$('[data-i18n]').forEach(function (el) { huText[el.getAttribute('data-i18n')] = el.textContent; });
  $$('[data-i18n-alt]').forEach(function (el) { huAlt[el.getAttribute('data-i18n-alt')] = el.getAttribute('alt'); });
  huText['meta.title'] = document.title;
  huText['meta.desc'] = $('meta[name="description"]').getAttribute('content');
  function nb(s) { return lang === 'hu' ? String(s).replace(/(^|[\s(])(a|az|A|Az) /g, '$1$2\u00a0') : s; }
  function t(k) { var d = T[lang] || {}; var v; if (k in d) v = d[k]; else if (lang === 'hu' && k in T.hu) v = T.hu[k]; else v = huText[k] != null ? huText[k] : huAlt[k] != null ? huAlt[k] : (T.hu[k] || ''); return nb(v); }
  function L(arr) { return nb(arr[LI[lang]] != null ? arr[LI[lang]] : arr[0]); }
  function ft(n) { return n.toLocaleString('hu-HU').replace(/ /g, ' ') + ' Ft'; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  function pickLang() {
    var q = (location.search.match(/[?&]lang=(hu|de|en)/) || [])[1];
    if (q) return q;
    try { var s = localStorage.getItem('flow-lang'); if (s && LI[s] != null) return s; } catch (e) {}
    var langs = navigator.languages || [navigator.language || 'hu'];
    for (var i = 0; i < langs.length; i++) { var c = (langs[i] || '').slice(0, 2).toLowerCase(); if (LI[c] != null) return c; }
    return 'en';
  }

  function applyLang(l, save) {
    lang = l;
    html.lang = l;
    $$('[data-i18n]').forEach(function (el) { var k = el.getAttribute('data-i18n'); var v = t(k); if (v) el.textContent = v; });
    $$('[data-i18n-alt]').forEach(function (el) { el.setAttribute('alt', t(el.getAttribute('data-i18n-alt'))); });
    $$('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    $$('[data-mail-subject]').forEach(function (el) { el.href = 'mailto:cafeflowsopron@gmail.com?subject=' + encodeURIComponent(t(el.getAttribute('data-mail-subject'))); });
    $$('.nav__lang button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === l ? 'true' : 'false'); });
    document.title = t('meta.title');
    $('meta[name="description"]').setAttribute('content', t('meta.desc'));
    splitTitle();
    splitHeads();
    rollButtons();
    buildMarq();
    renderClassic(false);
    renderFlav();
    renderTabs();
    renderPanel(activeTab, false);
    renderHours();
    if (typeof buildIndex === 'function') buildIndex();
    tubes(save ? 'lang' : '');
    if (save) { try { localStorage.setItem('flow-lang', l); } catch (e) {} }
    ScrollTrigger.refresh();
  }

  /* ------------------------------------------------------------------ címsor szavakra bontva */
  var titleEl = $('.hero__title');
  function splitTitle() {
    var words = titleEl.textContent.trim().split(/ +/);
    titleEl.innerHTML = words.map(function (w) { return '<span class="w"><span>' + esc(w) + '</span></span>'; }).join(' ');
    if (!introDone && !html.classList.contains('intro-started') && !html.classList.contains('no-intro')) gsap.set($$('.w > span', titleEl), { y: 0, yPercent: 110 });
  }

  /* ------------------------------------------------------------------ szakaszcímek szavanként, maszk mögül */
  function splitHeads() {
    $$('.lm').forEach(function (h) {
      var words = h.textContent.trim().split(/ +/);
      h.innerHTML = words.map(function (w) { return '<span class="w"><span>' + esc(w) + '</span></span>'; }).join(' ');
      if (!reduced && !h.classList.contains('is-in')) gsap.set($$('.w > span', h), { yPercent: 118 });
      h.classList.add('is-split');
    });
  }

  /* ------------------------------------------------------------------ gombok: betűnként felgördülő felirat (a valódi szöveg a .sr-ben) */
  function rollButtons() {
    $$('.btn').forEach(function (b) {
      var sr = $('.sr', b), tx = (sr ? sr.textContent : b.textContent).trim();
      b.innerHTML = '<span class="sr">' + esc(tx) + '</span><span class="rl" aria-hidden="true">' + Array.from(tx).map(function (c, i) { return '<i style="--i:' + i + '">' + esc(c) + '</i>'; }).join('') + '</span>';
    });
  }

  /* ------------------------------------------------------------------ neoncső a választott elem alatt (nyelv, étlap fül, pörkölés) */
  function placeTube(box, el, tube, pad, ign) {
    if (!box || !el || !tube || !el.offsetWidth) return;
    var first = !tube.style.getPropertyValue('--w');
    if (first) tube.classList.add('no-tr');
    tube.style.setProperty('--x', (el.offsetLeft + pad) + 'px');
    tube.style.setProperty('--y', (el.offsetTop + el.offsetHeight - (pad ? 4 : 1)) + 'px');
    tube.style.setProperty('--w', (el.offsetWidth - 2 * pad) + 'px');
    if (first) { void tube.offsetWidth; tube.classList.remove('no-tr'); }
    if (ign && !reduced) { tube.classList.remove('ign'); void tube.offsetWidth; tube.classList.add('ign'); }
  }
  function tubes(which) {
    var lb = $('.nav__lang'), lt = $('.tube', lb);
    if (!lt) { lt = document.createElement('span'); lt.className = 'tube'; lt.setAttribute('aria-hidden', 'true'); lb.appendChild(lt); }
    placeTube(lb, $('[aria-pressed="true"]', lb), lt, 7, which === 'lang');
    var tb = $('#tabs');
    placeTube(tb, $('[aria-selected="true"]', tb), $('.tube', tb), 0, which === 'tab');
    var rb = $('.roast');
    placeTube(rb, $('[aria-checked="true"]', rb), $('.roast__mark', rb), 0, which === 'roast');
  }
  var tubeT = 0;
  window.addEventListener('resize', function () { clearTimeout(tubeT); tubeT = setTimeout(tubes, 150); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { tubes(); });

  /* ------------------------------------------------------------------ ízesített kávék futószalagja */
  var marq = $('#marq');
  function buildMarq() {
    var h = FLAV.map(function (f, i) { return '<span class="' + (i % 2 ? 's' : 'o') + '">' + esc(L(f)) + '</span><b></b>'; }).join('');
    marq.innerHTML = '<div style="display:flex">' + h + '</div><div style="display:flex">' + h + '</div>';
  }

  /* ------------------------------------------------------------------ klasszikus kávék, pörkölés */
  var roast = 0;
  var classicList = $('#classicList');
  function renderClassic(animate) {
    if (!animate) {
      classicList.innerHTML = CLASSIC.map(function (c) { return '<li><span class="nm">' + esc(L(c)) + '</span><span class="pr"><span>' + ft(c[3][roast]) + '</span></span></li>'; }).join('');
    }
    $('#roastNote').textContent = t('roast.' + roast);
  }
  function setRoast(v) {
    if (v === roast) return;
    var from = roast; roast = v;
    var box = $('.roast'); box.setAttribute('data-v', v);
    $$('.roast button').forEach(function (b) { b.setAttribute('aria-checked', +b.getAttribute('data-roast') === v ? 'true' : 'false'); });
    $('#roastNote').textContent = t('roast.' + v);
    tubes('roast');
    var prs = $$('.pr', classicList);
    prs.forEach(function (pr, i) {
      var c = CLASSIC[i];
      pr.innerHTML = '<span>' + ft(c[3][from]) + '</span><span>' + ft(c[3][v]) + '</span>';
    });
    if (reduced) { prs.forEach(function (pr, i) { pr.innerHTML = '<span>' + ft(CLASSIC[i][3][v]) + '</span>'; }); return; }
    gsap.fromTo(prs.map(function (p) { return p.children; }), { yPercent: 0 }, {
      yPercent: -100, duration: .7, ease: 'expo.out', stagger: .025, overwrite: true,
      onComplete: function () { prs.forEach(function (pr, i) { pr.innerHTML = '<span>' + ft(CLASSIC[i][3][roast]) + '</span>'; }); }
    });
    gsap.fromTo('#roastNote', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .5, ease: 'power2.out', overwrite: true });
  }
  $$('.roast button').forEach(function (b) {
    b.addEventListener('click', function () { setRoast(+b.getAttribute('data-roast')); });
    b.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); var v = roast ? 0 : 1; setRoast(v); $$('.roast button')[v].focus(); }
    });
  });

  function renderFlav() {
    $('#flavList').innerHTML = FLAV.map(function (f) {
      return '<li><span>' + esc(L(f)) + '</span>' + f[3].map(function (p) { return p ? '<span>' + p.toLocaleString('hu-HU').replace(/ /g, ' ') + '</span>' : '<span class="na" aria-hidden="true">–</span>'; }).join('') + '</li>';
    }).join('');
  }

  /* ------------------------------------------------------------------ étlap fülek */
  var activeTab = 0;
  var tabsEl = $('#tabs'), panel = $('#menuPanel'), photo = $('#menuPhoto'), photoImg = $('#menuPhoto img');
  var capEl = document.createElement('figcaption'); photo.appendChild(capEl);
  function renderTabs() {
    tabsEl.innerHTML = TABS.map(function (tb, i) {
      var n = tb.g.reduce(function (a, g) { return a + (g.items ? g.items.length : 0); }, 0);
      return '<button type="button" role="tab" id="tab-' + tb.id + '" aria-controls="menuPanel" aria-selected="' + (i === activeTab) + '" tabindex="' + (i === activeTab ? 0 : -1) + '">' + esc(L(tb.l)) + (n ? '<sup aria-hidden="true">' + (n < 10 ? '0' : '') + n + '</sup>' : '') + '</button>';
    }).join('') + '<span class="tube" aria-hidden="true"></span>';
    $$('button', tabsEl).forEach(function (b, i) {
      b.addEventListener('click', function () { selectTab(i, true); });
      b.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (n) { e.preventDefault(); var j = (activeTab + n + TABS.length) % TABS.length; selectTab(j, true); $$('button', tabsEl)[j].focus(); }
      });
    });
  }
  function groupHtml(g) {
    var h = '<div class="mgroup">';
    if (g.t) h += '<h3>' + esc(L(g.t)) + '</h3>';
    if (g.text) h += '<p>' + esc(L(g.text)) + '</p>';
    if (g.two) h += '<div class="mhead" aria-hidden="true"><span>3 dl · 5 dl</span></div>';
    if (g.items) {
      h += '<ul class="mlist">' + g.items.map(function (it) {
        var nm = L(it), p = it[3], ds = it[4] ? [it[4], it[5], it[6]] : null;
        var price = Array.isArray(p) ? '<span class="pr pr2">' + p.filter(Boolean).map(ft).join(' · ') + '</span>' : '<span class="pr">' + ft(p) + '</span>';
        return '<li><span class="nm">' + esc(nm) + (ds ? '<span class="ds">' + esc(L(ds)) + '</span>' : '') + '</span>' + price + '</li>';
      }).join('') + '</ul>';
    }
    if (g.note) h += '<p class="mnote">' + esc(L(g.note)) + '</p>';
    return h + '</div>';
  }
  function setPhoto(tb, animate) {
    var s = IMG[tb.img];
    var src = 'img/' + tb.img + '-' + s[s.length - 1] + '.webp?v=11';
    var srcset = s.map(function (w) { return 'img/' + tb.img + '-' + w + '.webp?v=11 ' + w + 'w'; }).join(', ');
    var cap = L(tb.cap);
    if (!animate) { photoImg.srcset = srcset; photoImg.sizes = '(max-width: 1023px) 0px, 40vw'; photoImg.src = src; photoImg.alt = cap; capEl.textContent = cap; return; }
    var pre = new Image(); pre.sizes = '40vw'; pre.srcset = srcset; pre.src = src;
    gsap.to([photoImg, capEl], { opacity: 0, duration: .22, ease: 'power1.in', overwrite: true, onComplete: function () {
      var go = function () {
        photoImg.srcset = srcset; photoImg.src = src; photoImg.alt = cap; capEl.textContent = cap;
        gsap.fromTo(photoImg, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: .8, ease: 'expo.out' });
        gsap.to(capEl, { opacity: 1, duration: .5, delay: .2 });
      };
      (pre.decode ? pre.decode() : Promise.resolve()).then(go, go);
    } });
  }
  function renderPanel(i, animate) {
    var tb = TABS[i];
    panel.setAttribute('aria-labelledby', 'tab-' + tb.id);
    panel.innerHTML = tb.g.map(groupHtml).join('');
    if (animate && !reduced) gsap.fromTo($$('.mgroup, .mlist li', panel), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .55, ease: 'expo.out', stagger: .018, overwrite: true });
    setPhoto(tb, animate && !reduced);
  }
  function selectTab(i, animate) {
    if (i === activeTab && animate) return;
    activeTab = i;
    $$('button', tabsEl).forEach(function (b, j) { b.setAttribute('aria-selected', j === i ? 'true' : 'false'); b.tabIndex = j === i ? 0 : -1; });
    renderPanel(i, animate);
    tubes('tab');
    var btn = $$('button', tabsEl)[i];
    if (btn && tabsEl.scrollWidth > tabsEl.clientWidth) tabsEl.scrollTo({ left: btn.offsetLeft - 20, behavior: reduced ? 'auto' : 'smooth' });
    ScrollTrigger.refresh();
  }

  /* ------------------------------------------------------------------ nyitvatartás, Budapest szerinti idő */
  var edgeEl = null;
  if (canHover) { edgeEl = document.createElement('div'); edgeEl.className = 'edge'; edgeEl.setAttribute('aria-hidden', 'true'); document.body.appendChild(edgeEl); }
  var HOURS = { 0: [540, 1200], 1: [480, 1200], 2: [480, 1200], 3: [480, 1200], 4: [480, 1200], 5: [480, 1320], 6: [510, 1320] };
  function hm(m) { return Math.floor(m / 60) + ':' + ('0' + (m % 60)).slice(-2); }
  function budapestNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Budapest', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
      var d = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday];
      return { d: d, m: (+o.hour % 24) * 60 + +o.minute };
    } catch (e) { var n = new Date(); return { d: n.getDay(), m: n.getHours() * 60 + n.getMinutes() }; }
  }
  function renderHours() {
    var n = budapestNow(), h = HOURS[n.d];
    $('#todayLine').textContent = t('today').replace('{h}', hm(h[0]) + '–' + hm(h[1]));
    $$('#htable tr').forEach(function (tr) { tr.classList.toggle('today', tr.getAttribute('data-days').split(',').indexOf(String(n.d)) > -1); });
    var line;
    if (n.m >= h[0] && n.m < h[1]) line = t('now.open').replace('{c}', hm(h[1]));
    else if (n.m < h[0]) line = t('now.before').replace('{o}', hm(h[0]));
    else line = t('now.after').replace('{o}', hm(HOURS[(n.d + 1) % 7][0]));
    $('#nowLine').textContent = line;
    if (edgeEl) {
      var open = n.m >= h[0] && n.m < h[1];
      var nextO = n.m < h[0] ? h[0] : HOURS[(n.d + 1) % 7][0];
      edgeEl.classList.toggle('is-open', open);
      edgeEl.innerHTML = '<span class="edge__dot"></span><span>Sopron ' + hm(n.m) + '</span><span>·</span><span>' + esc(open ? t('edge.open').replace('{c}', hm(h[1])) : t('edge.closed').replace('{o}', hm(nextO))) + '</span>';
    }
  }
  setInterval(renderHours, 60000);

  /* ------------------------------------------------------------------ neon vonal: kitöltött alakzat, képkockánként újraszámolva (Safari nem bírja a hosszú szaggatott vonalat) */
  function Neon(svg, d, opt) {
    opt = opt || {};
    this.svg = svg; this.w = opt.w || 3.2;
    var tmp = document.createElementNS(NS, 'path'); tmp.setAttribute('d', d); tmp.setAttribute('fill', 'none'); tmp.style.visibility = 'hidden';
    svg.appendChild(tmp);
    var len = tmp.getTotalLength(), N = Math.max(60, Math.min(opt.max || 420, Math.round(len / (opt.step || 3))));
    var P = [];
    for (var i = 0; i <= N; i++) { var p = tmp.getPointAtLength(len * i / N); P.push([p.x, p.y]); }
    svg.removeChild(tmp);
    this.P = P; this.T = P.map(function (p, i) {
      var a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      return [dx / l, dy / l];
    });
    var self = this;
    this.paths = ['n3', 'n2', 'n1'].map(function (c) { var p = document.createElementNS(NS, 'path'); p.setAttribute('class', c); svg.appendChild(p); return p; });
    this.mult = [6, 2.4, 1];
    this.t = 0; this.draw(0);
  }
  Neon.prototype.shape = function (r, t) {
    var P = this.Pd || this.P, T = this.T, n = P.length - 1, k = t * n, i0 = Math.floor(k), f = k - i0;
    if (t <= 0) return '';
    var pts = P.slice(0, i0 + 1), tg = T.slice(0, i0 + 1);
    if (i0 < n && f > 0) {
      var a = P[i0], b = P[i0 + 1];
      pts.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
      tg.push(T[i0 + 1]);
    }
    if (pts.length < 2) return '';
    var L = [], R = [];
    for (var i = 0; i < pts.length; i++) {
      var nx = -tg[i][1] * r, ny = tg[i][0] * r;
      L.push((pts[i][0] + nx).toFixed(1) + ' ' + (pts[i][1] + ny).toFixed(1));
      R.push((pts[i][0] - nx).toFixed(1) + ' ' + (pts[i][1] - ny).toFixed(1));
    }
    var rr = r.toFixed(2);
    return 'M' + L.join('L') + 'A' + rr + ' ' + rr + ' 0 0 0 ' + R[R.length - 1] + 'L' + R.reverse().join('L') + 'A' + rr + ' ' + rr + ' 0 0 0 ' + L[0] + 'Z';
  };
  Neon.prototype.draw = function (t) {
    this.t = t;
    for (var i = 0; i < 3; i++) this.paths[i].setAttribute('d', this.shape(this.w * this.mult[i] / 2, t));
  };
  Neon.prototype.play = function (dur, delay) {
    var self = this, o = { t: this.t };
    if (reduced) { this.draw(1); return; }
    self.svg.classList.add('is-drawing');
    return gsap.to(o, { t: 1, duration: dur || 1.6, delay: delay || 0, ease: 'power2.inOut', onUpdate: function () { self.draw(o.t); }, onComplete: function () { self.svg.classList.remove('is-drawing'); self.flicker(); } });
  };
  Neon.prototype.flicker = function () {
    if (reduced) return;
    var halo = [this.paths[0], this.paths[1]];
    gsap.timeline().to(halo, { opacity: .15, duration: .05 }).to(halo, { opacity: '', duration: .06 }).to(halo, { opacity: .25, duration: .04, delay: .12 }).to(halo, { opacity: '', duration: .2, clearProps: 'opacity' });
  };

  function helixPath() {
    // csigalépcső oldalnézetből: egyenletesen süllyedő hurkok
    var d = '', turns = 3.6, steps = 260, top = 40, bottom = 860, cx = 110, R = 78, e = 46;
    for (var i = 0; i <= steps; i++) {
      var a = i / steps * turns * Math.PI * 2 - Math.PI / 2;
      var x = cx + R * Math.cos(a), y = top + (bottom - top) * i / steps + e * Math.sin(a);
      d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
    }
    return d;
  }

  var neons = [];
  $$('[data-neon]').forEach(function (svg) { neons.push(new Neon(svg, svg.getAttribute('data-neon'), { w: svg.classList.contains('neon--hero') ? 2.6 : 2.2 })); });
  var heroNeon = neons[0];
  var helixSvg = $('#helix'), helix = null;
  if (helixSvg && getComputedStyle(helixSvg).display !== 'none') helix = new Neon(helixSvg, helixPath(), { w: 2 });

  /* ------------------------------------------------------------------ nyitány: kialudt homlokzat, felvillanó neon, felkapcsolt belső */
  var introDone = false;
  var picked = pickLang();
  applyLang(picked, false);

  var heroOn = $('.hero__on'), heroSign = $('.hero__sign');
  function finishIntro() {
    introDone = true; html.classList.add('intro-done');
    gsap.set(heroOn, { opacity: 1 }); gsap.set(heroSign, { opacity: 1 });
    gsap.set($$('.w > span', titleEl), { clearProps: 'transform' });
    gsap.set(['.hero__sub', '.hero__btns', '.nav'], { opacity: 1, y: 0 });
    if (heroNeon) heroNeon.draw(1);
  }
  var fromGate = html.classList.contains('gate-on');
  function runIntro() {
    html.classList.add('intro-started');
    var tl = gsap.timeline({ onComplete: function () { introDone = true; html.classList.add('intro-done'); gsap.set(['.hero__sub', '.hero__btns', '.nav'], { clearProps: 'transform,opacity' }); } });
    if (fromGate) {
      // a kapun már kigyulladt a felirat: itt csak a belső világítás kapcsol fel
      tl.set(heroSign, { opacity: 1 })
        .to(heroOn, { keyframes: [{ opacity: .55, duration: .08 }, { opacity: .3, duration: .1 }, { opacity: 1, duration: .9, ease: 'power2.out' }] }, .55)
        .to($$('.w > span', titleEl), { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: .07 }, .45)
        .add(function () { if (heroNeon) heroNeon.play(1.3); }, .9)
        .to(['.hero__sub', '.hero__btns'], { opacity: 1, y: 0, duration: .9, ease: 'expo.out', stagger: .1 }, 1.2)
        .to('.nav', { opacity: 1, duration: .8, ease: 'power2.out' }, 1.3);
      return;
    }
    tl.set(heroSign, { opacity: 0 })
      // a neon gyújtása: rövid villanások, aztán áll
      .to(heroSign, { keyframes: [{ opacity: .85, duration: .05 }, { opacity: .05, duration: .07 }, { opacity: .9, duration: .04 }, { opacity: .2, duration: .1 }, { opacity: 1, duration: .05 }, { opacity: .6, duration: .05, delay: .18 }, { opacity: 1, duration: .06 }] }, .45)
      // bent felkapcsol a világítás
      .to(heroOn, { keyframes: [{ opacity: .55, duration: .08 }, { opacity: .3, duration: .1 }, { opacity: 1, duration: .9, ease: 'power2.out' }] }, 1.35)
      .to($$('.w > span', titleEl), { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: .07 }, 1.05)
      .add(function () { if (heroNeon) heroNeon.play(1.3); }, 1.55)
      .to(['.hero__sub', '.hero__btns'], { opacity: 1, y: 0, duration: .9, ease: 'expo.out', stagger: .1 }, 2.0)
      .to('.nav', { opacity: 1, duration: .8, ease: 'power2.out' }, 2.1);
  }
  var heroImgs = [$('.hero__off'), heroSign, heroOn];
  var waitImgs = Promise.all(heroImgs.map(function (im) { return im.decode ? im.decode().catch(function () {}) : Promise.resolve(); }));
  var waitFonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  if (html.classList.contains('no-intro')) finishIntro();
  else {
    var started = false;
    var go = function () { if (started) return; started = true; if (html.classList.contains('no-intro')) finishIntro(); else runIntro(); };
    var arm = function () {
      Promise.all([waitImgs, waitFonts]).then(go, go);
      setTimeout(function () { if (!started) { html.classList.add('no-intro'); started = true; finishIntro(); } }, fromGate ? 1200 : 2400);
    };
    if (fromGate) window.__gateOpen = arm; else arm();
  }

  /* ------------------------------------------------------------------ neonvonal: az egér elnyomja, rugóként visszaleng */
  var bendables = [];
  Neon.prototype.bendable = function () {
    var self = this, P = this.P, T = this.T, n = P.length;
    var o = { ox: new Float32Array(n), oy: new Float32Array(n), vx: new Float32Array(n), vy: new Float32Array(n), mx: null, my: null, vis: false, run: false, sc: 1 };
    this.bend = o;
    function step() {
      // lágy vonzás: a cső széles ívben, néhány pixelt hajlik az egér felé, ugrás és átbillenés nélkül
      var A = 7 * o.sc, R = 120 * o.sc, R2 = R * R, e = 0, Pd = self.Pd || P.map(function (p) { return [p[0], p[1]]; });
      for (var i = 0; i < n; i++) {
        var tx = 0, ty = 0;
        if (o.mx !== null) {
          var dx = P[i][0] - o.mx, dy = P[i][1] - o.my, d2 = dx * dx + dy * dy;
          if (d2 < R2 * 4) {
            var nx = -T[i][1], ny = T[i][0], sd = dx * nx + dy * ny, f = Math.exp(-d2 / R2);
            var pull = Math.max(-A, Math.min(A, -sd * .22)) * f; tx = nx * pull; ty = ny * pull;
          }
        }
        o.vx[i] = (o.vx[i] + (tx - o.ox[i]) * .05) * .8; o.vy[i] = (o.vy[i] + (ty - o.oy[i]) * .05) * .8;
        o.ox[i] += o.vx[i]; o.oy[i] += o.vy[i];
        e += Math.abs(o.ox[i]) + Math.abs(o.vx[i]) + Math.abs(o.oy[i]) + Math.abs(o.vy[i]);
        Pd[i][0] = P[i][0] + o.ox[i]; Pd[i][1] = P[i][1] + o.oy[i];
      }
      self.Pd = Pd; self.draw(self.t);
      if (e < .01 * n && o.mx === null) { o.run = false; self.Pd = null; o.ox.fill(0); o.oy.fill(0); o.vx.fill(0); o.vy.fill(0); self.draw(self.t); gsap.ticker.remove(step); }
    }
    o.kick = function () { if (!o.run) { o.run = true; gsap.ticker.add(step); } };
    bendables.push(this);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { o.vis = es[0].isIntersecting; }).observe(this.svg);
  };
  if (canHover && !reduced) {
    neons.forEach(function (nn) { nn.bendable(); });
    window.addEventListener('pointermove', function (e) {
      for (var i = 0; i < bendables.length; i++) {
        var nn = bendables[i], o = nn.bend;
        if (!o.vis || nn.t < 1 || nn.svg.classList.contains('is-drawing')) continue;
        var r = nn.svg.getBoundingClientRect(), vb = nn.svg.viewBox.baseVal, sc = vb.width / r.width;
        var near = e.clientX > r.left - 60 && e.clientX < r.right + 60 && e.clientY > r.top - 60 && e.clientY < r.bottom + 60;
        if (near) { o.sc = sc; o.mx = (e.clientX - r.left) * sc + vb.x; o.my = (e.clientY - r.top) * sc + vb.y; o.kick(); }
        else if (o.mx !== null) { o.mx = null; o.kick(); }
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------ nyitókép térben: mélységtérkép szerint mozdul az egérre (asztali gép, valódi GPU) */
  var G = { ok: false, m: [0, 0], mT: [0, 0], run: false, vis: true };
  var heroEl = $('#hero');
  if (canHover && !reduced && hwGpu && !window.__noGl) (function () {
    var VS = 'attribute vec2 a;varying vec2 v;void main(){v=vec2(a.x*.5+.5,.5-a.y*.5);gl_Position=vec4(a,0.,1.);}';
    var FS = [
      'precision highp float;varying vec2 v;',
      'uniform sampler2D uI,uD;uniform vec2 uRes,uM;uniform float uAR,uOver;',
      'const vec2 POS=vec2(.6,.16);',
      'vec2 img(vec2 p){float sa=uRes.x/uRes.y;vec2 s=sa>uAR?vec2(1.,uAR/sa):vec2(sa/uAR,1.);',
      ' vec2 o=(1.-s)*POS;vec2 c=o+.5*s;return c+(o+p*s-c)/uOver;}',
      'void main(){vec2 p=v;',
      ' for(int i=0;i<3;i++){float d=texture2D(uD,img(p)).r;p=v+uM*(d-.45)*vec2(.027,.019);}',
      ' gl_FragColor=vec4(texture2D(uI,img(p)).rgb,1.);}'
    ].join('\n');
    html.classList.add('can-3d');
    var cv = document.createElement('canvas'); cv.className = 'hero__gl'; cv.setAttribute('aria-hidden', 'true');
    $('.hero__stack').appendChild(cv);
    var gl = cv.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' });
    if (!gl) return;
    function sh(tp, src) { var x = gl.createShader(tp); gl.shaderSource(x, src); gl.compileShader(x); return gl.getShaderParameter(x, gl.COMPILE_STATUS) ? x : null; }
    var vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS); if (!vs || !fs) return;
    var pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var al = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(al); gl.vertexAttribPointer(al, 2, gl.FLOAT, false, 0, 0);
    var U = {}; ['uI', 'uD', 'uRes', 'uM', 'uAR', 'uOver'].forEach(function (nm) { U[nm] = gl.getUniformLocation(pr, nm); });
    function tex(unit, src) {
      var tx = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tx);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, src);
    }
    var im = heroOn, dep = new Image(); dep.decoding = 'async'; dep.src = 'img/hero-depth.webp?v=11';
    var lastW = 0, lastH = 0;
    function size() {
      var w = cv.clientWidth, h = cv.clientHeight, dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      lastW = innerWidth; lastH = innerHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      gl.viewport(0, 0, cv.width, cv.height); gl.uniform2f(U.uRes, w, h);
    }
    function draw() { gl.uniform2f(U.uM, G.m[0], G.m[1]); gl.drawArrays(gl.TRIANGLES, 0, 3); }
    function frame() {
      var moving = false;
      for (var i = 0; i < 2; i++) {
        var dm = G.mT[i] - G.m[i];
        if (Math.abs(dm) > .0008) { G.m[i] += dm * .055; moving = true; } else G.m[i] = G.mT[i];
      }
      draw();
      if (!moving || !G.vis) { G.run = false; gsap.ticker.remove(frame); }
    }
    G.kick = function () { if (G.ok && G.vis && !G.run) { G.run = true; gsap.ticker.add(frame); } };
    var load = function () {
      var w = im.decode ? im.decode().catch(function () {}) : null;
      var d = dep.decode ? dep.decode() : new Promise(function (r) { dep.onload = r; });
      // a kép dekódolása a fő szálon kívül (ImageBitmap), hogy a feltöltés ne akassza meg a görgetést
      var bm = function (x) { return window.createImageBitmap ? createImageBitmap(x).catch(function () { return x; }) : Promise.resolve(x); };
      Promise.all([w, d]).then(function () {
        if (!im.naturalWidth || !dep.naturalWidth) return;
        return Promise.all([bm(im), bm(dep)]);
      }).then(function (bms) {
        if (!bms) return;
        tex(0, bms[0]); tex(1, bms[1]);
        gl.uniform1i(U.uI, 0); gl.uniform1i(U.uD, 1);
        gl.uniform1f(U.uAR, im.naturalWidth / im.naturalHeight); gl.uniform1f(U.uOver, 1.05);
        G.ok = true; size(); draw();
        html.classList.add('hero-3d');
      }).catch(function () {});
    };
    // a felvillanó nyitány után vesszük át a képet (addig a három réteg animál)
    var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 1); };
    var waitIntro = function () { if (introDone) setTimeout(function () { idle(load, { timeout: 1500 }); }, 900); else setTimeout(waitIntro, 200); };
    waitIntro();
    cv.addEventListener('webglcontextlost', function (e) { e.preventDefault(); G.ok = false; html.classList.remove('hero-3d'); });
    heroEl.addEventListener('pointermove', function (e) { G.mT[0] = (e.clientX / innerWidth - .5) * 2; G.mT[1] = (e.clientY / innerHeight - .5) * 2; G.kick(); });
    heroEl.addEventListener('pointerleave', function () { G.mT[0] = G.mT[1] = 0; G.kick(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { G.vis = es[0].isIntersecting; if (G.vis) G.kick(); }).observe(heroEl);
    window.addEventListener('resize', function () {
      if (!G.ok) return;
      if (innerWidth !== lastW || Math.abs(innerHeight - lastH) > 160) { size(); draw(); }
    });
  })();

  /* ------------------------------------------------------------------ menüsor */
  var nav = $('#nav'), burger = $('#burger');
  ScrollTrigger.create({ trigger: '#hero', start: 'bottom top+=90', onEnter: function () { nav.classList.add('is-solid'); }, onLeaveBack: function () { nav.classList.remove('is-solid'); } });
  burger.addEventListener('click', function () {
    var open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open); burger.setAttribute('aria-expanded', open);
  });
  $$('#navLinks a').forEach(function (a) {
    var sec = $(a.getAttribute('href'));
    if (sec) ScrollTrigger.create({ trigger: sec, start: 'top 45%', end: 'bottom 45%', onToggle: function (st) { a.classList.toggle('is-cur', st.isActive); } });
  });
  $$('#navLinks a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }); });
  $$('.nav__lang button').forEach(function (b) { b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang'), true); }); });

  /* ------------------------------------------------------------------ puha görgetés egérrel (Lenis a GSAP órájáról hajtva, mindig fut) */
  var lenis = null;
  if (canHover && !reduced && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    window.__lenis = lenis;
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || a.classList.contains('skip')) return;
      var id = a.getAttribute('href'), el = id === '#top' ? 0 : document.getElementById(id.slice(1));
      if (el === null) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: id === '#top' ? 0 : -70, duration: 1.6 });
    });
  }

  /* ------------------------------------------------------------------ kapu: csak a neonfelirat, betűnként gyullad; görgetésre, kattintásra vagy gombra nyílik */
  (function () {
    var gate = $('#gate');
    if (!gate) return;
    if (!html.classList.contains('gate-on')) { gate.parentNode.removeChild(gate); return; }
    html.classList.add('gate-run');
    try { history.scrollRestoration = 'manual'; } catch (e) {}
    window.scrollTo(0, 0);
    if (lenis) lenis.stop();
    var cafe = $$('.gate__cafe .gl__on', gate), flow = $$('.gate__flow .gl__on', gate), all = cafe.concat(flow);
    var wall = $('.gate__wall', gate), sign = $('.gate__sign', gate), rest = [$('.gate__addr', gate), $('.gate__go', gate)];
    var opened = false, hum = 0;
    var gsvg = $('.neon--gate', gate), gneon = gsvg ? new Neon(gsvg, 'M4 40 C 110 40, 200 46, 280 38 C 330 33, 352 12, 334 6 C 314 0, 304 32, 340 42 C 400 56, 500 44, 636 40', { w: 2.2 }) : null;
    if (gneon && canHover && !reduced && gneon.bendable) gneon.bendable();
    function flick(el, at, tl) {
      // egy betű gyújtása: rövid, szabálytalan villanások, aztán áll
      var r = Math.random;
      tl.to(el, { keyframes: [{ opacity: .9, duration: .04 }, { opacity: .05, duration: .05 + r() * .05 }, { opacity: .75, duration: .03 }, { opacity: .15, duration: .06 + r() * .08 }, { opacity: 1, duration: .05 }] }, at);
    }
    gsap.set(all, { opacity: 0 }); gsap.set(wall, { opacity: 0 }); gsap.set(rest, { opacity: 0, y: 14 });
    var tl = gsap.timeline({ delay: .5 });
    cafe.forEach(function (el, i) { flick(el, .1 + i * .11 + Math.random() * .05, tl); });
    tl.to(wall, { opacity: .55, duration: .5, ease: 'power2.out' }, .25);
    flow.forEach(function (el, i) { flick(el, .95 + i * .14 + Math.random() * .05, tl); });
    tl.to(wall, { opacity: 1, duration: .8, ease: 'power2.out' }, 1.2)
      .fromTo(sign, { scale: .985 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 1.0)
      .add(function () { if (gneon) gneon.play(1.5); }, 1.55)
      .to(rest, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .12 }, 2.2)
      .add(humLoop, 2.6);
    // ritkán egy-egy betű megrezzen, mint egy igazi neoncső
    function humLoop() {
      if (opened) return;
      var el = all[Math.floor(Math.random() * all.length)];
      gsap.to(el, { keyframes: [{ opacity: .35, duration: .04 }, { opacity: 1, duration: .05 }, { opacity: .6, duration: .03 }, { opacity: 1, duration: .06 }] });
      hum = setTimeout(humLoop, 3500 + Math.random() * 4000);
    }
    // egérre a felirat finoman ellenmozog
    if (canHover) {
      var qx = gsap.quickTo(sign, 'x', { duration: 1.4, ease: 'power3.out' }), qy = gsap.quickTo(sign, 'y', { duration: 1.4, ease: 'power3.out' });
      var qw = gsap.quickTo(wall, 'x', { duration: 2, ease: 'power3.out' });
      gate.addEventListener('mousemove', function (e) { var mx = e.clientX / innerWidth - .5, my = e.clientY / innerHeight - .5; qx(-mx * 18); qy(-my * 12); qw(mx * 40); });
    }
    function open() {
      if (opened) return; opened = true; clearTimeout(hum);
      try { sessionStorage.setItem('flow-gate', '1'); } catch (e) {}
      tl.kill();
      gsap.set(all, { opacity: 1 }); if (gneon) gneon.draw(1);
      if (window.__gateOpen) window.__gateOpen();
      gsap.timeline({ onComplete: function () {
        html.classList.remove('gate-on'); if (gate.parentNode) gate.parentNode.removeChild(gate);
        if (lenis) lenis.start(); ScrollTrigger.refresh();
      } })
        .to(rest, { opacity: 0, y: -10, duration: .3, ease: 'power2.in' }, 0)
        .to(wall, { opacity: 1.0, scale: 1.25, duration: .5, ease: 'power2.out' }, 0)
        .to(sign, { y: '-=' + Math.round(innerHeight * .28), scale: .92, duration: 1.15, ease: 'expo.inOut' }, .12)
        .to(gate, { yPercent: -100, duration: 1.15, ease: 'expo.inOut' }, .12);
    }
    $('.gate__go', gate).addEventListener('click', open);
    gate.addEventListener('click', open);
    window.addEventListener('wheel', function (e) { if (e.deltaY > 4) open(); }, { passive: true });
    var y0 = null;
    gate.addEventListener('touchstart', function (e) { y0 = e.touches[0].clientY; }, { passive: true });
    gate.addEventListener('touchmove', function (e) { if (y0 !== null && y0 - e.touches[0].clientY > 24) open(); }, { passive: true });
    window.addEventListener('keydown', function (e) { if (!opened && /^(Enter| |ArrowDown|PageDown|Space|Escape)$/.test(e.key)) { if (e.key === ' ' || e.key === 'ArrowDown' || e.key === 'PageDown') e.preventDefault(); open(); } });
  })();

  /* ------------------------------------------------------------------ felfedések (lassabbak, visszafogottak) */
  var footNeon = neons.filter(function (n) { return n.svg.classList.contains('neon--foot'); })[0];
  var signOn = $('.sign--on');
  if (reduced) {
    gsap.set('.rv', { opacity: 1, y: 0 });
    neons.forEach(function (n) { n.draw(1); }); if (helix) helix.draw(1);
    gsap.set(signOn, { opacity: 1 });
  } else {
    ScrollTrigger.batch('.rv', { start: 'top 88%', once: true, onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.1, overwrite: true }); } });
    $$('.lm').forEach(function (h) {
      ScrollTrigger.create({ trigger: h, start: 'top 90%', once: true, onEnter: function () {
        h.classList.add('is-in');
        gsap.to($$('.w > span', h), { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.08, overwrite: true });
      } });
    });
    $$('.rv-img').forEach(function (fig) {
      var cur = document.createElement('div'); cur.className = 'cur'; fig.appendChild(cur);
      var img = $('img', fig);
      gsap.set(img, { scale: 1.12 });
      // a réteget csak a felfedés körül emeljük ki (Mac Chrome villanás ellen)
      ScrollTrigger.create({ trigger: fig, start: 'top bottom+=35%', once: true, onEnter: function () { img.style.willChange = 'transform'; } });
      ScrollTrigger.create({ trigger: fig, start: 'top 86%', once: true, onEnter: function () {
        gsap.to(cur, { scaleY: 0, duration: 1.4, ease: 'expo.inOut', onComplete: function () { cur.style.visibility = 'hidden'; } });
        gsap.to(img, { scale: 1, duration: 2, ease: 'expo.out', clearProps: 'transform', onComplete: function () { img.style.willChange = ''; } });
      } });
    });
    $$('.rq__stars').forEach(function (el, k) {
      var s = $$('i', el); gsap.set(s, { opacity: .18 });
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: function () {
        gsap.to(s, { opacity: 1, duration: .5, ease: 'power2.out', stagger: .09, delay: .25 + (k % 3) * .12 });
      } });
    });
    neons.slice(1).forEach(function (n) {
      if (n === footNeon) return;
      ScrollTrigger.create({ trigger: n.svg, start: 'top 84%', once: true, onEnter: function () { n.play(2.4); } });
    });
    if (helix) {
      if (canHover) {
        ScrollTrigger.create({ trigger: '.up__grid', start: 'top 75%', end: 'bottom 60%', scrub: 0.6,
          onToggle: function (s) { helixSvg.classList.toggle('is-drawing', s.isActive); },
          onUpdate: function (s) { helix.draw(s.progress); } });
      } else {
        ScrollTrigger.create({ trigger: helixSvg, start: 'top 84%', once: true, onEnter: function () { helix.play(2.8); } });
      }
    }
    // lábléc: a fő tartalom alja indítja (a ragadós lábléc mindig „látszik”)
    ScrollTrigger.create({ trigger: 'main', start: 'bottom 78%', once: true, onEnter: function () {
      signOn.style.willChange = 'opacity';
      gsap.timeline({ onComplete: function () { signOn.style.willChange = ''; } })
        .to(signOn, { keyframes: [{ opacity: .8, duration: .05 }, { opacity: .05, duration: .08 }, { opacity: .9, duration: .04 }, { opacity: .15, duration: .12 }, { opacity: 1, duration: .05 }, { opacity: .55, duration: .05, delay: .22 }, { opacity: 1, duration: .08 }] }, .15)
        .add(function () { if (footNeon) footNeon.play(1.8); }, .7);
    } });
    if (canHover) {
      gsap.to('.hero__stack', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__text', { y: -60, opacity: 0, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'center center', end: 'bottom top', scrub: true } });
      
      gsap.fromTo('.up__b', { y: 70 }, { y: -30, ease: 'none', scrollTrigger: { trigger: '.up__b', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo('.hours__wide img', { yPercent: -8, scale: 1.16 }, { yPercent: 8, scale: 1.16, ease: 'none', scrollTrigger: { trigger: '.hours__wide', start: 'top bottom', end: 'bottom top', scrub: true } });
    }
  }

  /* ------------------------------------------------------------------ körbenézés: asztali gépen vízszintes sáv, alatta végigfut a neoncső */
  var tour = $('#korbe'), track = $('#tourTrack'), tourSvg = $('#tourNeon');
  var items = $$('.tour__item', track), tourImgs = items.map(function (it) { return $('img', it); });
  var tourNeon = null, tourDist = 0, tourEntry = { e: 0 }, tourT = 0, tourMode = null;
  function wantH() { return canHover && !reduced && innerWidth >= 1024; }
  function tourPath() {
    // egyenes cső a képaláírások alatt, minden kép közepénél egy hurokkal (mint a nyitókép vonalán)
    var W = track.scrollWidth, y = 0;
    items.forEach(function (it) { y = Math.max(y, it.offsetTop + it.offsetHeight); });
    y += 58;
    var d = 'M0 ' + y;
    items.forEach(function (it) {
      var cx = it.offsetLeft + it.offsetWidth * 0.5;
      d += ' L' + (cx - 70) + ' ' + y + ' C' + (cx - 22) + ' ' + (y - 3) + ', ' + (cx + 14) + ' ' + (y - 30) + ', ' + (cx - 4) + ' ' + (y - 38) +
        ' C' + (cx - 24) + ' ' + (y - 46) + ', ' + (cx - 36) + ' ' + (y - 12) + ', ' + (cx + 2) + ' ' + y;
    });
    d += ' L' + W + ' ' + y;
    tourSvg.setAttribute('width', W); tourSvg.setAttribute('height', y + 40);
    tourSvg.setAttribute('viewBox', '0 0 ' + W + ' ' + (y + 40));
    tourSvg.innerHTML = '';
    tourNeon = new Neon(tourSvg, d, { w: 2, step: 4, max: 1400 });
    tourNeon.draw(tourMode === 'h' ? Math.min(tourT, tourEntry.e) : tourNeon.t);
  }
  function tourSet() {
    var m = wantH() ? 'h' : 'swipe';
    if (m !== tourMode) {
      tourMode = m;
      html.classList.toggle('tour-h', m === 'h');
      // érintőn a cím a sáv fölött áll, asztali gépen a sávval együtt halad
      var intro = $('.tour__intro', tour);
      if (m === 'h') track.insertBefore(intro, track.firstChild); else track.parentNode.insertBefore(intro, track);
      gsap.set(track, { x: 0 }); gsap.set(tourImgs, { clearProps: 'transform' });
    }
    if (m === 'h') {
      tourDist = Math.max(0, track.scrollWidth - innerWidth);
      tour.style.setProperty('--tour-h', (innerHeight + tourDist) + 'px');
    } else tour.style.removeProperty('--tour-h');
  }
  function tourFx(x) {
    var vw = innerWidth;
    tourT = Math.min(1, (-x + vw * 0.78) / track.scrollWidth);
    if (tourNeon) tourNeon.draw(Math.min(tourT, tourEntry.e < 1 ? tourEntry.e * tourT : 1));
    items.forEach(function (it, i) {
      var c = (it.offsetLeft + it.offsetWidth / 2 + x - vw / 2) / vw;
      if (c < -1.3 || c > 1.3) return;
      gsap.set(tourImgs[i], { xPercent: c * -6, scale: 1.16 });
    });
  }
  tourSet();
  ScrollTrigger.addEventListener('refreshInit', function () { tourSet(); });
  ScrollTrigger.addEventListener('refresh', function () { tourPath(); if (tourMode === 'h') tourFx(gsap.getProperty(track, 'x')); });
  if (!reduced) {
    // belépéskor a cső kigyullad, utána a görgetést követi
    ScrollTrigger.create({ trigger: tour, start: 'top 55%', once: true, onEnter: function () {
      tourSvg.classList.add('is-drawing');
      gsap.to(tourEntry, { e: 1, duration: 2.2, ease: 'power2.inOut', onUpdate: function () {
        if (!tourNeon) return;
        if (tourMode === 'h') tourNeon.draw(tourEntry.e * tourT); else tourNeon.draw(tourEntry.e);
      }, onComplete: function () { tourSvg.classList.remove('is-drawing'); if (tourNeon) tourNeon.flicker(); } });
    } });
  } else tourEntry.e = 1;
  ScrollTrigger.create({ trigger: tour, start: 'top top', end: function () { return '+=' + tourDist; },
    onUpdate: function (s) {
      if (tourMode !== 'h') return;
      var x = -tourDist * s.progress;
      gsap.set(track, { x: x });
      tourFx(x);
    } });

  /* ------------------------------------------------------------------ futószalag: lassan megy, görgetésre felgyorsul, felfelé görgetve visszafelé */
  var marqAnim = null;
  if (!reduced && marq.animate) {
    marqAnim = marq.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }], { duration: 120000, iterations: Infinity });
    marqAnim.currentTime = 120000 * 400; // visszafelé is tudjon menni (végtelen animációnál nulláról nem lehet)
    var mo = { r: 1 }, mdir = 1;
    var setRate = function () { marqAnim.playbackRate = mo.r; };
    if (canHover) {
      ScrollTrigger.create({ trigger: '.marq', start: 'top bottom', end: 'bottom top', onUpdate: function (s) {
        var v = s.getVelocity(); mdir = v < 0 ? -1 : 1;
        gsap.to(mo, { r: mdir * (1 + Math.min(Math.abs(v) / 260, 5)), duration: 0.25, overwrite: true, onUpdate: setRate, onComplete: function () {
          gsap.to(mo, { r: mdir, duration: 1.4, ease: 'power2.out', onUpdate: setRate });
        } });
      } });
    }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { en.forEach(function (x) { try { x.isIntersecting ? marqAnim.play() : marqAnim.pause(); } catch (e) {} }); }).observe($('.marq'));
  }

  /* ------------------------------------------------------------------ kurzor: kis pont, linkek fölött vékony kör, fotón nagyobb pont (csak egérrel) */
  if (canHover) {
    var cur = document.createElement('div');
    cur.className = 'cursor'; cur.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cur);
    // kis lámpa: halvány kék fény követi az egeret a sötét részeken, kicsit lomhábban, mint a kurzor
    var lamp = document.createElement('div'); lamp.className = 'lamp'; lamp.setAttribute('aria-hidden', 'true'); document.body.appendChild(lamp);
    var gx = -400, gy = -400;
    var tx = -100, ty = -100, cx = -100, cy = -100, craf = 0, seen = false;
    var k = reduced ? 1 : 0.2;
    var cloop = function () {
      cx += (tx - cx) * k; cy += (ty - cy) * k;
      cur.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
      gx += (tx - gx) * (reduced ? 1 : .085); gy += (ty - gy) * (reduced ? 1 : .085);
      lamp.style.transform = 'translate3d(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px,0)';
      craf = (Math.abs(tx - cx) + Math.abs(ty - cy) + Math.abs(tx - gx) + Math.abs(ty - gy) > 0.15) ? requestAnimationFrame(cloop) : 0;
    };
    var kick = function () { if (!craf) craf = requestAnimationFrame(cloop); };
    document.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!seen) { seen = true; cx = tx; cy = ty; gx = tx; gy = ty; html.classList.add('has-cursor'); cur.classList.add('is-on'); lamp.classList.add('is-on'); }
      kick();
    }, { passive: true });
    document.addEventListener('mouseover', function (e) {
      var el = e.target; if (!el.closest) return;
      var link = !!el.closest('a, button, [role="tab"], [role="radio"], label');
      var photo = !link && !!el.closest('.tour__ph, .ph, .menu__photo, .coffee__photo, .hours__wide');
      var light = !!el.closest('[data-cur="light"]');
      cur.classList.toggle('is-link', link); cur.classList.toggle('is-photo', photo);
      cur.classList.toggle('is-light', light); lamp.classList.toggle('is-light', light);
    });
    document.documentElement.addEventListener('mouseleave', function () { cur.classList.remove('is-on'); lamp.classList.remove('is-on'); });
    document.documentElement.addEventListener('mouseenter', function () { if (seen) { cur.classList.add('is-on'); lamp.classList.add('is-on'); } });
  }

  /* ------------------------------------------------------------------ bal szél: szakaszjelölő; világos szakaszban sötét jelek */
  var idxEl = null, idxLinks = [];
  var IDX = [['rolunk', 'idx.about'], ['korbe', 'tour.title'], ['kave', 'nav.coffee'], ['etlap', 'nav.menu'], ['emelet', 'nav.upstairs'], ['haz', 'idx.shop'], ['ertekelesek', 'idx.rev'], ['nyitvatartas', 'nav.hours']];
  function buildIndex() {
    if (!idxEl) return;
    var on = idxLinks.map(function (a) { return a.classList.contains('is-on'); });
    idxEl.innerHTML = IDX.map(function (x, i) { return '<li><a href="#' + x[0] + '" tabindex="-1"' + (on[i] ? ' class="is-on"' : '') + '></a><span class="idx__l">' + esc(t(x[1])) + '</span></li>'; }).join('');
    idxLinks = $$('a', idxEl);
  }
  if (canHover) {
    idxEl = document.createElement('ul'); idxEl.className = 'idx'; idxEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(idxEl); buildIndex();
    IDX.forEach(function (x, i) {
      ScrollTrigger.create({ trigger: '#' + x[0], start: 'top 50%', end: 'bottom 50%', onToggle: function (s) { if (idxLinks[i]) idxLinks[i].classList.toggle('is-on', s.isActive); } });
    });
    var lights = $$('[data-cur="light"]').map(function (sec) {
      return ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: function () { html.classList.toggle('mid-light', (lights || []).some(function (l) { return l.isActive; })); } });
    });
  }

  /* ------------------------------------------------------------------ függöny-lábléc: csak egérrel, és ha a lábléc kisebb a képernyőnél */
  var foot = $('#foot');
  function curtain() { html.classList.toggle('is-curtain', canHover && foot.offsetHeight < innerHeight - 40); }
  curtain();
  ScrollTrigger.addEventListener('refreshInit', curtain);

  // csak valódi méretváltásnál mérünk újra (a telefon címsora is küld resize-t)
  var lastW = innerWidth, lastH = innerHeight;
  ScrollTrigger.config({ ignoreMobileResize: true });
  window.addEventListener('resize', function () {
    if (innerWidth !== lastW || Math.abs(innerHeight - lastH) > 160) { lastW = innerWidth; lastH = innerHeight; ScrollTrigger.refresh(); }
  });
  ScrollTrigger.refresh();
  window.__flowReady = true;
})();
