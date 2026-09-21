import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mapa = JSON.parse(fs.readFileSync('maps/tarkir/map.json', 'utf8'));
const snapshot = JSON.parse(fs.readFileSync('scryfall/68ktk-ainok-tracker.json', 'utf8'));
const karta = fs.readFileSync('content/cards/68ktk-ainok-tracker.md', 'utf8');
const wpis = fs.readFileSync('collection/entries/68ktk-ainok-tracker.md', 'utf8');

const pin = mapa.pinezki.find((p) => p.karta === '68ktk-ainok-tracker');

const fabula = 'Przez zaśnieżoną górską przełęcz Tarkiru przedziera się ainok z klanu Temur — humanoidalny psi zwiadowca z wydłużonym pyskiem i świecącymi złotymi oczami węszącymi w zamieci. Jego gęste, piaskowo-szare futro pokryte cienką warstwą szronu, w dłoni-łapie długa włócznia tropiąca z kościanym grotem wystawiona do przodu. Na śniegu przed nim świeże odciski łap drapieżnika, a w oddali za zasłoną śniegu czają się sylwetki kolejnych wojowników Temur czekających za skalnym nawisem. Klan, który wierzy w instynkt smoków i wilków, nie wysyła ludzi tam, gdzie pies poczuje trop wcześniej — ten ainok jest parą oczu Surraka w zamarzniętej pustce.';

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

test('68KTK: Fabuła właściciela pozostaje zachowana verbatim (ADR 0003)', () => {
  const body = wpis.match(/^---\n[\s\S]*?\n---\n\n([\s\S]*?)\n?$/)?.[1];
  assert.equal(body, fabula);
  assert.match(wpis, /^imgId: 68KTK$/m);
  assert.match(wpis, /^nazwa: Ainok Tracker$/m);
  assert.match(wpis, /^wydanie: KTK$/m);
  assert.match(wpis, /^plan: Tarkir$/m);
});

test('68KTK: imgId właściciela (68KTK) pozostaje niezależny od numeru KTK #96', () => {
  assert.match(karta, /^imgId: 68KTK$/m);
  assert.equal(snapshot.name, 'Ainok Tracker');
  assert.equal(snapshot.set, 'ktk');
  assert.equal(snapshot.collector_number, '96');
  assert.equal(snapshot.mana_cost, '{5}{R}');
  assert.equal(snapshot.type_line, 'Creature — Dog Scout');
  assert.equal(snapshot.power, '3');
  assert.equal(snapshot.toughness, '3');
  assert.equal(snapshot.rarity, 'common');
  assert.equal(snapshot.artist, 'Evan Shipard');
  assert.match(snapshot.oracle_text, /First strike/);
  assert.match(snapshot.oracle_text, /Morph \{4\}\{R\}/);
  assert.equal(snapshot.flavor_text, 'Some ainok of the mountains are accepted among the Temur as trusted hunt-mates.');
  assert.match(snapshot.notka_numery, /imgId właściciela = 68KTK/i);
  assert.match(snapshot.notka_numery, /collector_number Scryfall = 96/i);
});

test('68KTK: Karta Katalogowa zachowuje strukturę LORE-first i etos zwiadu Temur', () => {
  assert.deepEqual(
    [...karta.matchAll(/^## (.+)$/gm)].map((m) => m[1]),
    sekcje,
  );
  assert.match(karta, /Qal Sisma/i);
  assert.match(karta, /Surrak Dragonclaw/i);
  assert.match(karta, /kościanym grotem/i);
  assert.match(karta, /Morph/i);
  assert.match(karta, /First strike/i);
});

test('68KTK: Ainok zwiadowca dostaje regionalną pinezkę na mapie Tarkiru', () => {
  assert.ok(pin, 'Brak pinezki dla karty 68ktk-ainok-tracker w maps/tarkir/map.json');
  assert.equal(pin.pewnosc, 'region');
  assert.match(pin.uzasadnienie, /Qal Sisma/i);
  assert.match(pin.uzasadnienie, /Temur/i);
});
