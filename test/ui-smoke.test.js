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
  assert.ok(karta.includes('Druk w Kolekcji'), 'karta: brak sekcji o posiadanym wydruku (ADR 0011)');
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

test('UI: mapa planu z realnej bazy — podkład, pinezka, legenda', async () => {
  const cel = await zbuduj({ out: 'dist/test-ui-mapa.html' });
  const shim = wykonajArtefakt(cel);

  shim.idz('#/mapa/srodziemie');
  const mapa = shim.app.innerHTML;
  assert.ok(mapa.includes('Mapa: Śródziemie'), 'mapa: brak tytułu');
  assert.ok(!mapa.includes('wariant'), 'mapa: nagłówek bez danych technicznych podkładu');
  assert.ok(mapa.includes('data:image/svg+xml;base64,'), 'mapa: brak osadzonego podkładu (ADR 0009)');
  assert.ok(mapa.includes('data-pinezka="1ltr-dunland-crebain"'), 'mapa: brak pinezki karty 1LTR');
  assert.ok(mapa.includes('href="#/karta/1ltr-dunland-crebain"'), 'mapa: pinezka nie linkuje karty');
  assert.ok(mapa.includes('?pin=1ltr-dunland-crebain'), 'mapa: brak deep-linka pinezki');
  assert.ok(mapa.includes('Legenda'), 'mapa: brak legendy pewności');
  assert.ok(mapa.includes('dokładna'), 'mapa: brak poziomu pewności w legendzie');
  assert.ok(mapa.includes('CC-BY-4.0'), 'mapa: brak atrybucji podkładu');
  assert.ok(!mapa.includes('Kotwice'), 'mapa: UI kotwic etykiet ma pozostać usunięte (feedback E)');
  assert.ok(mapa.includes('data-mapa-ruch'), 'mapa: brak warstwy pan/zoom');
  assert.ok(mapa.includes('mapa-nakladka'), 'mapa: brak nakładki ekranowej dla pinezek (stały rozmiar, ostry render)');
  assert.ok(!mapa.includes('left:40.6%'), 'mapa: pinezki nie mogą być pozycjonowane procentami w skalowanej warstwie');
  assert.ok(mapa.includes('mapa-przycisk'), 'mapa: brak przycisków zoomu');

  // plan linkuje do mapy; trasa nieznanej planu → 404
  shim.idz('#/plan/srodziemie');
  assert.ok(shim.app.innerHTML.includes('#/mapa/srodziemie'), 'plan: brak linku do mapy');
  shim.idz('#/mapa/nieznany-plan');
  assert.ok(shim.app.innerHTML.includes('Nie znaleziono'), 'mapa: brak 404 dla nieznanego planu');

  fs.rmSync(cel, { force: true });
  shim.przywroc();
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
  assert.ok(!karta.includes('Uruk-hai'), 'karta: byty z dawnej narracji/promptu nie mogą być na stronie karty (ADR 0011)');
  assert.ok(!karta.includes('Narracja Koleksji') && !karta.includes('Narracja Kolekcji'), 'karta: sekcja narracji zniesiona (ADR 0011)');
  assert.ok(!karta.includes('perspektywy żabiej'), 'karta: treść promptu nie może się pojawiać (ADR 0011)');
  assert.ok(!karta.includes('ADR'), 'karta: treść nie może odsyłać do mechaniki Codexu (feedback B)');
  assert.ok(!karta.includes('verbatim'), 'karta: treść nie może zawierać etykiet procesowych (feedback B)');

  shim.idz('#/karty');
  const lista = shim.app.innerHTML;
  assert.ok(lista.includes('Karty Katalogowe (2)'), 'lista kart: brak 2 kart');
  assert.ok(lista.includes('Śródziemie') && lista.includes('Zendikar'), 'lista kart: brak tytułów planów zamiast slugów (feedback G)');
  assert.ok(!lista.includes('>srodziemie<'), 'lista kart: slug planu nie może być widoczny jako tekst (feedback G)');

  // druga karta: chudy format dostawy (ADR 0011) — czysty kanon
  shim.idz('#/karta/2bfz-coralhelm-guide');
  const karta2 = shim.app.innerHTML;
  assert.ok(karta2.includes('Coralhelm Guide'), 'karta 2BFZ: brak tytułu');
  assert.ok(karta2.includes('Merfolk Scout Ally'), 'karta 2BFZ: brak typu ze snapshotu');
  assert.ok(karta2.includes('Viktor Titov'), 'karta 2BFZ: brak artysty posiadanego wydruku');
  assert.ok(karta2.includes('Jori En'), 'karta 2BFZ: brak flavoru ze snapshotu');
  assert.ok(karta2.includes('Druk w Kolekcji'), 'karta 2BFZ: brak sekcji o wydruku (ADR 0011)');
  assert.ok(karta2.includes('Na Mapie'), 'karta 2BFZ: brak osadzenia w treści');
  assert.ok(!karta2.includes('Narracja Koleksji') && !karta2.includes('Narracja Kolekcji'), 'karta 2BFZ: bez sekcji narracji (ADR 0011)');
  assert.ok(!karta2.includes('ADR'), 'karta 2BFZ: treść bez mechaniki Codexu (feedback B)');
  // bez mapy planu: infoboks nie oferuje wejścia na mapę
  assert.ok(!karta2.includes('#/mapa/zendikar'), 'karta 2BFZ: brak linku do nieistniejącej mapy planu');
  shim.idz('#/');
  assert.ok(shim.app.innerHTML.includes('Dunland Crebain'), 'home: brak ostatniej materializacji');

  fs.rmSync(cel, { force: true });
  shim.przywroc();
});
