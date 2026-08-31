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
  const cel = await zbuduj({ out: 'dist/test-ui-empty.html' });
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
  assert.ok(karta.includes('kanon najwyższego rzędu'), 'karta: brak narracji kolekcji');
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
