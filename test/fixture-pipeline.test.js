/**
 * Test end-to-end na fixture'ach: pełny pipeline (wpis kolekcji → strony →
 * walidacja → wikilinki → build artefaktu) na syntetycznej mini-bazie.
 * Fixture'y NIE są materializacją — to dane testowe (ADR 0003 nietknięty).
 */
import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zbuduj } from '../tools/build.mjs';
import {
  wczytajStrony, wczytajKolekcje, wczytajScryfall, wczytajTaxonomie,
} from '../tools/content-loader.mjs';
import { walidujStrone, zbudujRejestr } from '../src/codex/registry.js';
import { parseWikilinks } from '../src/codex/links.js';

const ROOT_FIXTURE = 'test/fixtures';

test('fixture: strony przechodzą walidację, slugi unikalne', () => {
  const strony = wczytajStrony({ root: ROOT_FIXTURE });
  const taxonomia = wczytajTaxonomie({ root: ROOT_FIXTURE });
  const ctx = {
    taxonomia,
    plany: new Set(strony.filter((s) => s.typ === 'plan').map((s) => s.slug)),
  };
  const problemy = strony.flatMap((s) => (s.problem ? [s.problem] : walidujStrone(s, ctx)));
  assert.deepEqual(problemy, []);

  const { bySlug, duplikaty } = zbudujRejestr(strony);
  assert.deepEqual(duplikaty, []);
  assert.equal(bySlug.size, 3);
});

test('fixture: pętla przekazywania domknięta (wpis ↔ karta ↔ snapshot)', () => {
  const karty = wczytajStrony({ root: ROOT_FIXTURE }).filter((s) => s.typ === 'karta');
  const kolekcja = wczytajKolekcje({ root: ROOT_FIXTURE });
  const scryfall = wczytajScryfall({ root: ROOT_FIXTURE });
  assert.equal(karty.length, 1);
  assert.ok(kolekcja.has('1tst-testowy-zwiadowca'));
  assert.ok(scryfall.has('1tst-testowy-zwiadowca'));
  assert.equal(kolekcja.get('1tst-testowy-zwiadowca').prompt.includes('Testowy prompt'), true);
  assert.equal(kolekcja.get('1tst-testowy-zwiadowca').narracja.includes('kanon najwyższego rzędu'), true);
});

test('fixture: wikilinki rozwiązuje się wzajemnie (karta ↔ hasło)', () => {
  const strony = wczytajStrony({ root: ROOT_FIXTURE });
  const { bySlug } = zbudujRejestr(strony);
  const celKarty = parseWikilinks(strony.find((s) => s.typ === 'karta').body).map((l) => l.slug);
  const celHasla = parseWikilinks(strony.find((s) => s.typ === 'haslo').body).map((l) => l.slug);
  assert.deepEqual([...new Set(celKarty)], ['testowy-ptak']);
  assert.deepEqual(celHasla, ['1tst-testowy-zwiadowca']);
  for (const cel of [...celKarty, ...celHasla]) assert.ok(bySlug.has(cel));
});

test('fixture: build artefaktu z niepustą bazą zawiera treść i backlinki', async () => {
  const cel = await zbuduj({ root: ROOT_FIXTURE, out: 'dist/test-fixture-artefakt.html' });
  const html = fs.readFileSync(cel, 'utf8');
  const dane = JSON.parse(html.match(/globalThis\.CODEX_DATA = (\{[\s\S]*?\});\n\n\/\/ =====/)[1]);

  assert.deepEqual(dane.statystyki, { karty: 1, hasla: 1, plany: 1 });
  const karta = dane.strony['1tst-testowy-zwiadowca'];
  assert.ok(karta, 'brak karty w danych');
  assert.equal(karta.imgId, '1TST');
  assert.equal(karta.kolekcja.narracja.includes('kanon najwyższego rzędu'), true);
  assert.equal(karta.scryfall.artist, 'Testowy Artysta');
  assert.ok(karta.html.includes('<a href="#/haslo/testowy-ptak">'), 'brak wikilinku w HTML');

  // backlinki wyliczone w obie strony
  assert.deepEqual(dane.backlinki['testowy-ptak'], ['1tst-testowy-zwiadowca']);
  assert.deepEqual(dane.backlinki['1tst-testowy-zwiadowca'], ['testowy-ptak']);

  // tagi
  assert.deepEqual(dane.tagi.fauna.sort(), ['1tst-testowy-zwiadowca', 'testowy-ptak']);

  // pinezka przeniesiona do danych
  assert.equal(karta.pinezka.pewnosc, 'region');

  fs.rmSync(cel, { force: true });
});
