/**
 * Test dymny UI: artefakt (jeden plik HTML = jeden <script>) wykonuje się
 * w mini-shimie DOM (konwencja mtg-game — zero jsdom, ADR 0002) i renderuje
 * realne strony dla tras: główna, listy, karta, hasło, plan, 404.
 *
 * Shim implementuje dokładnie tyle DOM, ile używa silnik: getElementById,
 * innerHTML, querySelector(All) zwracające null/pustkę, hashchange, scrollTo.
 */
import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zbuduj } from '../tools/build.mjs';
import { stworzShim } from './pomocnicze.mjs';

function wykonajArtefakt(sciezkaHtml) {
  const html = fs.readFileSync(sciezkaHtml, 'utf8');
  const js = html.match(/<script>\n([\s\S]*?)\n<\/script>/)[1];
  const shim = stworzShim();
  // Higiena globali między artefaktami: strony map (ADR 0027 v2) ustawiają
  // CODEX_MAPA/CODEX_DATA na globalThis — w przeglądarce każda strona ma
  // własny zasięg, w shimie trzeba wyczyścić ręcznie.
  delete globalThis.CODEX_MAPA;
  delete globalThis.CODEX_DATA;
  // Kod artefaktu żyje w jednym zasięgu funkcji — jak w <script> przeglądarki
  const uruchom = new Function(js);
  uruchom();
  return shim;
}

test('UI: pusta baza renderuje stronę główną ze stanami pustymi', async () => {
  const cel = await zbuduj({ root: 'test/fixtures-pusta', out: 'dist/test-ui-empty.html' });
  const shim = wykonajArtefakt(cel);

  assert.ok(shim.app.innerHTML.includes('MTG Lore Codex'), 'brak logotypu');
  assert.ok(shim.app.innerHTML.includes('Baza jest pusta'), 'brak stanu pustego');
  assert.ok(shim.app.innerHTML.includes('Dunland Crebain'), 'brak zapowiedzi 1LTR');
  assert.ok(shim.tytul.includes('MTG Lore Codex'), 'tytuł dokumentu niesety');

  // nawigacja: lista kart (pusta) i trasa nieznana (404)
  shim.idz('#/karty');
  assert.ok(shim.app.innerHTML.includes('Karty Katalogowe (0)'), 'brak listy kart');
  shim.idz('#/bzdura');
  assert.ok(shim.app.innerHTML.includes('Nie znaleziono'), 'brak 404');
  shim.idz('#/szukaj?q=nic');
  assert.ok(shim.app.innerHTML.includes('Brak trafień'), 'brak stanu braku trafień');

  fs.rmSync(cel, { force: true });
  shim.przywroc();
});

test('UI: baza fixture renderuje kartę, hasło i plan z wikilinkami', async () => {
  const cel = await zbuduj({ root: 'test/fixtures', out: 'dist/test-ui-fixture.html' });
  const shim = wykonajArtefakt(cel);

  shim.idz('#/');
  assert.ok(shim.app.innerHTML.includes('Testowy Zwiadowca'), 'home: brak ostatniej materializacji');
  assert.ok(shim.app.innerHTML.includes('Testlandia'), 'home: brak kafla planu');

  shim.idz('#/karta/1tst-testowy-zwiadowca');
  const karta = shim.app.innerHTML;
  assert.ok(karta.includes('Testowy Zwiadowca'), 'karta: brak tytułu');
  assert.ok(karta.includes('1TST'), 'karta: brak imgId');
  assert.ok(karta.includes('Testowy Artysta'), 'karta: brak danych Scryfall');
  assert.ok(!karta.includes('Druk w Kolekcji'), 'karta: sekcja „Druk w Kolekcji" zniesiona (ADR 0014)');
  // ADR 0017: sloty FOT/KON wplecione w treść (nie przyciski torów)
  assert.ok(karta.includes('data-fot') && karta.includes('data-kon'), 'karta: brak slotów FOT/KON (ADR 0017)');
  assert.ok(!karta.includes('tor-przycisk'), 'karta: przyciski torów zniesione (ADR 0017)');
  assert.ok(karta.indexOf('data-fot') < karta.indexOf('<h2'), 'karta: FOT ma być nad pierwszą sekcją (ADR 0017)');
  assert.ok(karta.indexOf('data-kon') > karta.indexOf('<h2'), 'karta: KON ma być pod pierwszą sekcją (ADR 0017)');
  assert.ok(!karta.includes('Narracja Kolekcji'), 'karta: sekcja narracji zniesiona (ADR 0011)');
  assert.ok(karta.includes('href="#/haslo/testowy-ptak"'), 'karta: brak wikilinku do hasła');
  assert.ok(karta.includes('Linkujące strony'), 'karta: brak sekcji backlinków');

  shim.idz('#/haslo/testowy-ptak');
  const haslo = shim.app.innerHTML;
  assert.ok(haslo.includes('Testowy Ptak'), 'hasło: brak tytułu');
  assert.ok(haslo.includes('W kolekcji'), 'hasło: brak sekcji W kolekcji');
  assert.ok(haslo.includes('Testowy Zwiadowca'), 'hasło: brak backlinku do karty');

  shim.idz('#/plan/testlandia');
  assert.ok(shim.app.innerHTML.includes('Karty w tym planie (1)'), 'plan: brak listy kart');
  assert.ok(shim.app.innerHTML.includes('Hasła lore tego planu (1)'), 'plan: brak listy haseł');

  shim.idz('#/tag/fauna');
  assert.ok(shim.app.innerHTML.includes('Tag: fauna (2)'), 'tag: brak 2 stron');

  fs.rmSync(cel, { force: true });
  shim.przywroc();
});

test('UI: mapa planu z realnej bazy — iframe, strona mapy, pinezka, legenda', async () => {
  const cel = await zbuduj({ out: 'dist/test-ui-mapa.html' });

  // ── Artefakt główny: trasa mapy = iframe ze stroną mapy (ADR 0027 v2)
  const shim = wykonajArtefakt(cel);
  shim.idz('#/mapa/srodziemie');
  let rama = shim.app.innerHTML;
  assert.ok(rama.includes('Mapa: Śródziemie'), 'mapa: brak tytułu');
  assert.ok(rama.includes('mapa-iframe') && rama.includes('src="maps/srodziemie.html"'),
    'mapa: brak iframe ze stroną mapy (ADR 0027 v2)');
  shim.idz('#/mapa/srodziemie?pin=1ltr-dunland-crebain');
  assert.ok(shim.app.innerHTML.includes('maps/srodziemie.html?pin=1ltr-dunland-crebain'),
    'mapa: deep-link pinezki nie przechodzi do iframe');
  shim.idz('#/plan/srodziemie');
  assert.ok(shim.app.innerHTML.includes('#/mapa/srodziemie'), 'plan: brak linku do mapy');
  shim.idz('#/mapa/nieznany-plan');
  assert.ok(shim.app.innerHTML.includes('Nie znaleziono'), 'mapa: brak 404 dla nieznanego planu');
  shim.idz('#/mapa/zendikar');
  assert.ok(shim.app.innerHTML.includes('Mapa: Zendikar'), 'mapa Zendikaru: brak tytułu');
  assert.ok(shim.app.innerHTML.includes('src="maps/zendikar.html"'), 'mapa Zendikaru: brak iframe');
  shim.idz('#/plan/zendikar');
  assert.ok(shim.app.innerHTML.includes('#/mapa/zendikar'), 'plan Zendikaru: brak linku do mapy');
  shim.przywroc();

  // ── Strona mapy Śródziemia (samowystarczalny HTML, T2 → <img>)
  const shim2 = wykonajArtefakt('dist/maps/srodziemie.html');
  const mapa = shim2.app.innerHTML;
  assert.ok(!mapa.includes('wariant'), 'mapa: bez danych technicznych podkładu');
  assert.ok(
    mapa.includes('<svg class="mapa-podklad"') || mapa.includes('src="srodziemie/'),
    'mapa: brak podkładu na stronie mapy (ADR 0027 v2)',
  );
  assert.ok(mapa.includes('data-pinezka="1ltr-dunland-crebain"'), 'mapa: brak pinezki karty 1LTR');
  assert.ok(mapa.includes('href="#/karta/1ltr-dunland-crebain"'), 'mapa: pinezka nie linkuje karty');
  assert.ok(mapa.includes('Legenda'), 'mapa: brak legendy pewności');
  assert.ok(mapa.includes('dokładna'), 'mapa: brak poziomu pewności w legendzie');
  assert.ok(mapa.includes('CC-BY-4.0'), 'mapa: brak atrybucji podkładu');
  assert.ok(!mapa.includes('Kotwice'), 'mapa: UI kotwic etykiet ma pozostać usunięte (feedback E)');
  assert.ok(mapa.includes('data-mapa-ruch'), 'mapa: brak warstwy pan/zoom');
  assert.ok(mapa.includes('mapa-nakladka'), 'mapa: brak nakładki ekranowej dla pinezek');
  assert.ok(!mapa.includes('left:40.6%'), 'mapa: pinezki nie mogą być pozycjonowane procentami w skalowanej warstwie');
  assert.ok(mapa.includes('mapa-przycisk'), 'mapa: brak przycisków zoomu');
  // B2: warstwa karty z pinezki działa WEWNĄTRZ strony mapy
  assert.ok(mapa.includes('data-map-warstwa'), 'mapa: brak warstwy karty (B2)');
  assert.ok(mapa.includes('role="dialog"') && mapa.includes('aria-modal="true"'), 'mapa: warstwa bez semantyki dialogu (B2)');
  assert.ok(mapa.includes('data-map-warstwa-zamknij'), 'mapa: brak zamknięcia warstwy ✕/tło (B2)');
  assert.ok(mapa.includes('aria-label="Zamknij i wróć do mapy"'), 'mapa: przycisk zamknięcia bez etykiety (B2)');
  shim2.przywroc();

  // ── Strona mapy Zendikaru (T3/T4 — inline SVG + rekonstrukcja)
  const shim3 = wykonajArtefakt('dist/maps/zendikar.html');
  const mapaZ = shim3.app.innerHTML;
  assert.ok(mapaZ.includes('<svg class="mapa-podklad"'), 'mapa Zendikaru: brak wektorowego podkładu inline');
  assert.ok(mapaZ.includes('data-pinezka="2bfz-coralhelm-guide"'), 'mapa Zendikaru: brak pinezki 2BFZ');
  assert.ok(mapaZ.includes('praca własna'), 'mapa Zendikaru: brak atrybucji rekonstrukcji (T3)');
  assert.ok(mapaZ.includes('wybrzeży Halimar'), 'mapa Zendikaru: brak uzasadnienia pinezki (MA4)');
  shim3.przywroc();

  // B1: badge pinezki ukryty do najechania/fokusu (CSS strony mapy)
  const stylArt = fs.readFileSync('dist/maps/srodziemie.html', 'utf8');
  assert.ok(
    /\.mapa-pinezka-etykieta\s*{[^}]*opacity:\s*0/.test(stylArt),
    'mapa: badge pinezki ma być domyślnie ukryty (B1)',
  );
  assert.ok(
    stylArt.includes('.mapa-pinezka:hover .mapa-pinezka-etykieta')
      && stylArt.includes('.mapa-pinezka:focus-visible .mapa-pinezka-etykieta'),
    'mapa: brak reguł odsłaniających badge (hover + focus-visible, B1)',
  );
  assert.ok(stylArt.includes('.mapa-warstwa[hidden] { display: none; }'), 'mapa: brak reguły ukrycia warstwy (B2)');

  fs.rmSync(cel, { force: true });
});

test('UI: mapa T3 — etykiety podkładu w nakładce ekranowej (stały rozmiar, LOD)', async () => {
  const cel = await zbuduj({ out: 'dist/test-ui-mapa-etykiety.html' });
  const shim = wykonajArtefakt('dist/maps/zendikar.html');
  const mapa = shim.app.innerHTML;
  const n = (mapa.match(/data-podklad-etykieta/g) ?? []).length;
  assert.ok(n > 60, `etykiety podkładu w nakładce: tylko ${n} (oczekiwano >60)`);
  assert.ok(mapa.includes('data-podklad-orj="1"'), 'oryginały <text> nie są ukryte');
  assert.ok(mapa.includes('tier-kontynent'), 'brak tieru kontynentów (większa czcionka)');
  assert.ok((mapa.match(/tier-kontynent/g) ?? []).length >= 7, 'mniej niż 7 tytułów kontynentów');
  assert.ok(mapa.includes('tier-szczegol'), 'brak tieru drobnych etykiet');
  assert.ok(/data-min-k="1\.[0-9]+"/.test(mapa), 'drobne etykiety bez progu LOD (data-min-k)');
  assert.ok(mapa.includes('data-fs='), 'etykiety bez zapamiętanego rozmiaru źródłowego (data-fs)');
  assert.ok(mapa.includes('data-kotwica="middle"'), 'brak kotwiczenia middle (dziedziczenie text-anchor z grup SVG)');
  assert.ok((mapa.match(/data-kotwica=/g) ?? []).length >= 60, 'mniej niż 60 etykiet z kotwicą');
  const bey = mapa.match(/data-kotwica="(\w+)"[^>]*>Beyeen</);
  assert.ok(bey && bey[1] === 'middle', 'Beyeen ma być kotwiczony middle (był rozjechany)');

  // T2 (adoptowany, mapome) — typografia podkładu zostaje bez zmian
  shim.przywroc();
  const shim2 = wykonajArtefakt('dist/maps/srodziemie.html');
  assert.ok(!shim2.app.innerHTML.includes('data-podklad-etykieta'), 'podkład adoptowany (T2) nie może mieć przeniesionych etykiet');

  fs.rmSync(cel, { force: true });
  shim2.przywroc();
});

test('UI: karta 1LTR z realnej bazy — infoboks, sekcje, mini-mapa', async () => {
  const cel = await zbuduj({ out: 'dist/test-ui-karta.html' });
  const shim = wykonajArtefakt(cel);

  shim.idz('#/karta/1ltr-dunland-crebain');
  const karta = shim.app.innerHTML;
  assert.ok(karta.includes('Dunland Crebain'), 'karta: brak tytułu');
  assert.ok(karta.includes('1LTR'), 'karta: brak imgId');
  assert.ok(karta.includes('Creature — Bird Horror'), 'karta: brak typu ze snapshotu');
  assert.ok(karta.includes('Amass'), 'karta: brak mechaniki Amass ze snapshotu');
  assert.ok(karta.includes('nie ma flavor'), 'karta: brak adnotacji o wydruku bez flavor (print #411)');
  assert.ok(!karta.includes("What's that, Strider?"), 'karta: flavor Sama nie może się pojawiać (print #411 bez flavor)');
  assert.ok(karta.includes('David Rapoza'), 'karta: brak artysty posiadanego printu (#411)');
  assert.ok(karta.includes('#/mapa/srodziemie?pin=1ltr-dunland-crebain'), 'karta: brak deep-linka pinezki');
  assert.ok(karta.includes('mini-mapa'), 'karta: brak miniatury mapy w infoboksie (feedback C)');
  assert.ok(karta.includes('Podsumowanie Lore'), 'karta: brak sekcji podsumowania');
  assert.ok(!karta.includes('Wątki i Powiązania'), 'karta: wątki mają żyć w treści (pogrubienia), nie w osobnej sekcji');
  assert.ok(karta.includes('<strong>crebain</strong>'), 'karta: brak pogrubionych encji lore w treści');
  assert.ok(karta.includes('Jedynym bytem karty'), 'karta: Postacie i Byty mają zaczynać się od tego, co jest na karcie (kanon)');
  assert.ok(!karta.includes('Armia Isengardu'), 'karta: byty z narracji/promptu nie mogą być listowane jako byty karty');
  assert.ok(!karta.includes('leykus'), 'karta: bez niekanonicznych porównań ("leykus")');
  assert.ok(!karta.includes('pierwszy mieszkaniec'), 'karta: bez meta-komentarzy o kolekcji (feedback B)');
  assert.ok(!karta.includes('zyskają własne hasła'), 'karta: bez opisu procesu link-miningu (feedback B)');
  // ADR 0026: Fabuła dostawy WRÓCIŁA jako wiążąca kotwica transpozycji —
  // byty ze sceny (np. Uruk-hai) są legalne, ale wyłącznie jako oznaczone
  // OSADZENIE kolekcji z Fabułą cytowaną w Źródłach. Prompt nadal poza pętlą.
  assert.ok(karta.includes('Osadzenie kolekcji'), 'karta: scena Fabuły oznaczona jako osadzenie (ADR 0026)');
  assert.ok(karta.includes('Fabuła dostawy'), 'karta: Fabuła dostawy cytowana w treści/Źródłach (ADR 0026)');
  assert.ok(!karta.includes('Narracja Koleksji') && !karta.includes('Narracja Kolekcji'), 'karta: sekcja narracji zniesiona (ADR 0011)');
  assert.ok(!karta.includes('perspektywy żabiej'), 'karta: treść promptu nie może się pojawiać (ADR 0011)');
  assert.ok(!karta.includes('ADR'), 'karta: treść nie może odsyłać do mechaniki Codexu (feedback B)');
  assert.ok(!karta.includes('verbatim'), 'karta: treść nie może zawierać etykiet procesowych (feedback B)');
  assert.ok(karta.includes('class="mana"'), 'karta 1LTR: brak ikon many (feedback D)');
  assert.ok(!karta.includes('{2}{B}'), 'karta 1LTR: notacja many ma być ikonami, nie tekstem w klamrach (feedback D)');

  shim.idz('#/karty');
  const lista = shim.app.innerHTML;
  assert.ok(lista.includes('Karty Katalogowe (2)'), 'lista kart: brak 2 kart');
  assert.ok(lista.includes('Śródziemie') && lista.includes('Zendikar'), 'lista kart: brak tytułów planów zamiast slugów (feedback G)');
  assert.ok(!lista.includes('>srodziemie<'), 'lista kart: slug planu nie może być widoczny jako tekst (feedback G)');
  assert.ok(lista.indexOf('Coralhelm Guide') < lista.indexOf('Dunland Crebain'), 'lista kart: brak sortowania alfabetycznego (feedback E)');
  assert.ok(lista.includes('data-filtry-kart'), 'lista kart: brak interfejsu filtrów (feedback E)');
  assert.ok(lista.includes('placeholder="Szukaj karty po nazwie…"'), 'lista kart: brak pola filtrowania nazw (feedback E)');
  assert.ok(lista.includes('data-tag="ekspedycje"') && lista.includes('data-tag="fauna"'), 'lista kart: brak przycisków filtrowania po tagach (feedback E)');
  assert.ok(lista.includes('data-tagi='), 'lista kart: brak tagów w wierszach tabeli (feedback E)');
  assert.ok(!lista.includes('materializowana jawnie'), 'lista kart: bez meta-tekstu ADR 0003 (feedback F)');

  // ADR 0016: format Wpisu Karty — blok danych Oracle w treści, warstwy mechaniki,
  // polskie odczytanie nazwy; sekcje „Ilustracja"/„Druk w Kolekcji" nie istnieją
  shim.idz('#/karta/1ltr-dunland-crebain');
  const karta1 = shim.app.innerHTML;
  assert.ok(karta1.includes('dwa many dowolnego koloru'), 'karta 1LTR: brak bloku danych Oracle (ADR 0016)');
  assert.ok(karta1.includes('Odczyt zasadniczy') && karta1.includes('Całość jako opowieść'), 'karta 1LTR: brak warstw mechaniki (ADR 0016)');
  assert.ok(karta1.includes('Crebainy z Dunlandu'), 'karta 1LTR: brak polskiego odczytania nazwy (ADR 0016)');
  assert.ok(!karta1.includes('<h2>Ilustracja'), 'karta 1LTR: sekcja ilustracyjna zakazana (ADR 0016)');
  assert.ok(!karta1.includes('<h2>Druk w Kolekcji'), 'karta 1LTR: sekcja druku zniesiona (ADR 0014)');

  // druga karta: chudy format dostawy (ADR 0011) — czysty kanon
  shim.idz('#/karta/2bfz-coralhelm-guide');
  const karta2 = shim.app.innerHTML;
  assert.ok(karta2.includes('Coralhelm Guide'), 'karta 2BFZ: brak tytułu');
  assert.ok(karta2.includes('Merfolk Scout Ally'), 'karta 2BFZ: brak typu ze snapshotu');
  assert.ok(karta2.includes('jeden mana dowolnego koloru'), 'karta 2BFZ: brak bloku danych Oracle (ADR 0016)');
  assert.ok(karta2.includes('Przewodniczka z Koralowego Hełmu'), 'karta 2BFZ: brak polskiego odczytania nazwy (ADR 0016)');
  assert.ok(karta2.includes('Odczyt fraza po frazie'), 'karta 2BFZ: brak odczytu flavoru fraza po frazie (ADR 0016)');
  assert.ok(!karta2.includes('<h2>Ilustracja'), 'karta 2BFZ: sekcja ilustracyjna zakazana (ADR 0016)');
  assert.ok(karta2.includes('Viktor Titov'), 'karta 2BFZ: brak artysty posiadanego wydruku');
  assert.ok(karta2.includes('Jori En'), 'karta 2BFZ: brak flavoru ze snapshotu');
  assert.ok(!karta2.includes('Druk w Kolekcji'), 'karta 2BFZ: sekcja „Druk w Kolekcji" zniesiona (ADR 0014)');
  assert.ok(karta2.includes('Na Mapie'), 'karta 2BFZ: brak osadzenia w treści');
  assert.ok(!karta2.includes('Narracja Koleksji') && !karta2.includes('Narracja Kolekcji'), 'karta 2BFZ: bez sekcji narracji (ADR 0011)');
  assert.ok(!karta2.includes('ADR'), 'karta 2BFZ: treść bez mechaniki Codexu (feedback B)');
  assert.ok(karta2.includes('merfolka-przewodniczka'), 'karta 2BFZ: brak formy „merfolka-przewodniczka” (feedback B)');
  assert.ok(!karta2.includes('merfalka') && !karta2.includes('merfalkę'), 'karta 2BFZ: forma „merfalka” niedozwolona (feedback B)');
  assert.ok(karta2.includes('class="mana"'), 'karta 2BFZ: brak ikon many (feedback D)');
  assert.ok(!karta2.includes('{1}{U}') && !karta2.includes('{4}{U}'), 'karta 2BFZ: notacja many ma być ikonami, nie tekstem w klamrach (feedback D)');
  // mapa planu istnieje (ADR 0012): infoboks z mini-mapą i deep-linkiem pinezki
  assert.ok(karta2.includes('#/mapa/zendikar?pin=2bfz-coralhelm-guide'), 'karta 2BFZ: brak deep-linka pinezki');
  assert.ok(karta2.includes('mini-mapa'), 'karta 2BFZ: brak miniatury mapy w infoboksie');
  shim.idz('#/');
  assert.ok(shim.app.innerHTML.includes('Dunland Crebain'), 'home: brak ostatniej materializacji');

  fs.rmSync(cel, { force: true });
  shim.przywroc();
});


test('UI/build: drzewo HTML map (ADR 0027 v2 — iframe, offline z dysku)', async () => {
  const cel = await zbuduj({ out: 'dist/test-ui-split.html' });
  const html = fs.readFileSync(cel, 'utf8');
  // artefakt główny: lekki, bez base64 podkładów; mapy przez stronaMapy
  assert.ok(!html.includes('data:image/svg+xml;base64'), 'artefakt bez base64 podkładów');
  assert.ok(html.includes('"stronaMapy": "maps/srodziemie.html"'), 'rejestr: strona mapy Śródziemia');
  assert.ok(html.includes('"stronaMapy": "maps/zendikar.html"'), 'rejestr: strona mapy Zendikaru');
  assert.ok(html.length < 2.5 * 1024 * 1024, `artefakt (${(html.length / 1048576).toFixed(2)} MB) ma być < 2.5 MB`);
  // drzewo: strony map + surowe podkłady (mini-mapy)
  assert.ok(fs.existsSync('dist/maps/srodziemie.html'), 'dist/maps/srodziemie.html');
  assert.ok(fs.existsSync('dist/maps/zendikar.html'), 'dist/maps/zendikar.html');
  assert.ok(fs.existsSync('dist/maps/zendikar/podklad.svg'), 'dist/maps/zendikar/podklad.svg (mini-mapy)');
  const stronaMapy = fs.readFileSync('dist/maps/zendikar.html', 'utf8');
  assert.ok(stronaMapy.includes('CODEX_MAPA'), 'strona mapy: tryb CODEX_MAPA');
  assert.ok(stronaMapy.includes('podkladMarkup'), 'strona mapy: wstrzyknięty markup SVG');
  assert.ok(!stronaMapy.includes('data:image/svg+xml;base64'), 'strona mapy: SVG surowy, nie base64');
  fs.rmSync(cel, { force: true });
});
