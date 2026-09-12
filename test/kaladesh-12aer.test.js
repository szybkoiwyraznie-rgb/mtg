import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wczytajStrony } from '../tools/content-loader.mjs';

const mapa = JSON.parse(fs.readFileSync('maps/kaladesh/map.json', 'utf8'));
const snapshot = JSON.parse(fs.readFileSync('scryfall/12aer-merchant-s-dockhand.json', 'utf8'));
const karta = fs.readFileSync('content/cards/12aer-merchant-s-dockhand.md', 'utf8');
const wpis = fs.readFileSync('collection/entries/12aer-merchant-s-dockhand.md', 'utf8');
const ghirapurHaslo = fs.readFileSync('content/lore/ghirapur.md', 'utf8');
const konsulatHaslo = fs.readFileSync('content/lore/konsulat-kaladeshu.md', 'utf8');
const plan = fs.readFileSync('content/planes/kaladesh.md', 'utf8');
const backlog = fs.readFileSync('docs/backlog.md', 'utf8');
const strony = wczytajStrony().filter((s) => !s.problem);
const poSlugu = Object.fromEntries(strony.map((s) => [s.slug, s]));

const pin = mapa.pinezki.find((p) => p.karta === '12aer-merchant-s-dockhand');
const bomat = mapa.kotwice.find((k) => k.nazwa === 'Bomat');

const fabula = 'Na ruchliwym nabrzeżu dzielnicy Bomat na Kaladeshu niewielki konstrukt o mosiężnych ramionach sortuje i katalogizuje skrzynie jednocześnie czterema precyzyjnymi chwytakami. W jego torsie pulsuje błękitny rdzeń aetherowy, a turkusowy wizjer wpatruje się w zawartość otwartego kontenera z uwagą zawodowego katalogisty. Wokół niego krzątają się kupcy w ozdobnych szatach, aetherowe dźwigi unoszą ładunki na wyższe poziomy doków, a w tle iskrzą pozłacane kopuły portowego miasta. Ten skromny automat jest niewidzialnym ogniwem handlowego łańcucha, który napędza każde bogactwo Konsulatu.';

const sekcje = [
  'Kronika Lore',
  'Postacie i Byty',
  'Nazwa Karty',
  'Flavor Text',
  'Transpozycja',
  'Na Mapie',
  'Mechanika jako Opowieść',
  'Źródła',
  'Podsumowanie Lore',
];

test('12AER: Fabuła właściciela pozostaje zachowana verbatim', () => {
  const body = wpis.match(/^---\n[\s\S]*?\n---\n\n([\s\S]*?)\n?$/)?.[1];
  assert.equal(body, fabula);
  assert.match(wpis, /^imgId: 12AER$/m);
  assert.match(wpis, /^nazwa: Merchant's Dockhand$/m);
  assert.match(wpis, /^wydanie: AER$/m);
  assert.match(wpis, /^plan: Kaladesh$/m);
});

test('12AER: imgId właściciela pozostaje niezależny od numeru AER #163', () => {
  assert.match(karta, /^imgId: 12AER$/m);
  assert.match(karta, /^kolory: \[C\]$/m);
  assert.equal(snapshot.name, "Merchant's Dockhand");
  assert.equal(snapshot.set, 'aer');
  assert.equal(snapshot.set_name, 'Aether Revolt');
  assert.equal(snapshot.collector_number, '163');
  assert.equal(snapshot.mana_cost, '{1}');
  assert.equal(snapshot.type_line, 'Artifact Creature — Construct');
  assert.equal(snapshot.rarity, 'rare');
  assert.equal(snapshot.power, '1');
  assert.equal(snapshot.toughness, '2');
  assert.deepEqual(snapshot.colors, []);
  assert.deepEqual(snapshot.color_identity, ['U']);
  assert.deepEqual(snapshot.keywords, []);
  assert.equal(snapshot.artist, 'Christine Choi');
  assert.match(snapshot.oracle_text, /\{3\}\{U\}, \{T\}, Tap X untapped artifacts you control/);
  assert.match(snapshot.oracle_text, /Look at the top X cards of your library/);
  assert.equal(snapshot.flavor_text, '"If you can build it, we can move it."\n—Bes Tavani, Bomat merchant');
  assert.match(snapshot.notka_numery, /imgId właściciela = 12AER/i);
  assert.match(snapshot.notka_numery, /collector_number Scryfall = 163/i);
});

test('12AER: Karta Katalogowa jest lore-first i zachowuje nabrzeże Bomat', () => {
  assert.deepEqual(
    [...karta.matchAll(/^## (.+)$/gm)].map((m) => m[1]),
    sekcje,
  );
  assert.ok(karta.indexOf('## Kronika Lore') < karta.indexOf('## Mechanika jako Opowieść'));
  assert.match(karta, /\[\[ghirapur\|Ghirapurze\]\]/);
  assert.match(karta, /Bomat/);
  assert.match(karta, /cztery precyzyjne chwytaki/);
  assert.match(karta, /Błękitny rdzeń eterowy/);
  assert.match(karta, /turkusowy wizjer/);
  assert.match(karta, /otwartym kontenerem/);
  assert.match(karta, /\[\[konsulat-kaladeshu\|Konsulat\]\]/);
  assert.match(karta, /\*\*„dokowego pomocnika kupca”\*\*/);
  assert.match(karta, /Jeśli potrafisz to zbudować, my potrafimy to przewieźć/);
});

test('12AER: mechanika katalogowania prowadzi przez artefakty i niebieską aktywację', () => {
  const narracja = karta.slice(0, karta.indexOf('## Mechanika jako Opowieść'));
  assert.doesNotMatch(narracja, /Innistrad|Ravnica|Wiedźmin/i);
  assert.match(karta, /Artifact Creature — Construct, 1\/2/);
  assert.match(karta, /\{3\}\{U\}, \{T\}, Tap X untapped artifacts you control/);
  assert.match(karta, /Aktywacja jest obrazem pracy doków/);
  assert.match(karta, /kolejne nietapnięte artefakty stają się skrzyniami/);
  assert.match(karta, /Spojrzenie na X wierzchnich kart biblioteki to portowa inspekcja manifestu/);
});

test('12AER: nabrzeże dostaje regionalną pinezkę Bomat bez fałszywego pirsu', () => {
  assert.ok(pin, 'brak pinezki Merchant\'s Dockhand');
  assert.ok(bomat, 'brak kotwicy Bomat');
  assert.equal(bomat.typ, 'dzielnica');
  assert.equal(pin.pewnosc, 'region');
  assert.equal(pin.x, 0.6613);
  assert.equal(pin.y, 0.6386);
  assert.equal(pin.x, bomat.x);
  assert.equal(pin.y, bomat.y);
  assert.match(pin.uzasadnienie, /ruchliwe nabrzeże dzielnicy Bomat/i);
  assert.match(pin.uzasadnienie, /nie podają konkretnego pirsu, magazynu ani kontenera/i);
  assert.match(pin.uzasadnienie, /oznacza dzielnicę, nie dokładny pomost/i);
  assert.match(karta, /Pinezka ma pewność `region`/);
  assert.match(karta, /nie podaje nazwy konkretnego pirsu, magazynu, żurawia ani kontenera/i);
  assert.match(plan, /Bomat dla\s+\[\[12aer-merchant-s-dockhand\|Merchant's Dockhand\]\]/);
});

test('12AER: Ghirapur i Konsulat są pogłębione, Bomat czeka na próg', () => {
  assert.match(ghirapurHaslo, /\[\[12aer-merchant-s-dockhand\|Merchant's Dockhand\]\]/);
  assert.match(ghirapurHaslo, /sortowanie, ważenie i kierowanie towarów/);
  assert.match(konsulatHaslo, /\[\[12aer-merchant-s-dockhand\|Merchant's Dockhand\]\]/);
  assert.match(konsulatHaslo, /system plomb, tras, licencji i ewidencji/);
  assert.match(plan, /\[\[12aer-merchant-s-dockhand\|Merchant's Dockhand\]\]/);
  assert.match(backlog, /Bomat \(`12aer-merchant-s-dockhand`/);
  assert.equal(poSlugu.bomat, undefined);
  assert.ok(!fs.existsSync('content/lore/bomat.md'));
  assert.ok(!mapa.pinezki.some((p) => p.karta === 'bomat'));
});
