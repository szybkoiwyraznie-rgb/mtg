import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mapa = JSON.parse(fs.readFileSync('maps/wiedzmin/map.json', 'utf8'));
const snapshot = JSON.parse(fs.readFileSync('scryfall/540dst-chittering-rats.json', 'utf8'));
const karta = fs.readFileSync('content/cards/540dst-chittering-rats.md', 'utf8');
const wpis = fs.readFileSync('collection/entries/540dst-chittering-rats.md', 'utf8');
const haslo = fs.readFileSync('content/lore/novigrad.md', 'utf8');
const poprzedniaKarta = fs.readFileSync('content/cards/555dsk-bedhead-beastie.md', 'utf8');
const plan = fs.readFileSync('content/planes/wiedzmin.md', 'utf8');
const changelog = fs.readFileSync('content/co-nowego.md', 'utf8');

const pin = mapa.pinezki.find((p) => p.karta === '540dst-chittering-rats');
const novigrad = mapa.kotwice.find((k) => k.nazwa === 'Novigrad');

const fabula = 'W labiryncie novigradzkich kanałów, gdzie słońce nigdy nie dociera, prawdziwymi łowcami są potężne stada zmutowanych szczurów. Kiedy samotny poszukiwacz skarbów próbuje przemycić cenne mapy pod rynsztokami miasta, agresywne gryzonie gwałtownie odcinają mu drogę ucieczki. Osaczony przez drapieżniki, mężczyzna musi przerwać poszukiwania i kurczowo osłaniać swoje zdobycze przed zębami bestii. Atak zmusza go do wstrzymania wszelkich planów, dopóki nie przepędzi piszczącego roju z powrotem do mroku.';

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

test('540DST: Fabuła właściciela pozostaje zachowana verbatim', () => {
  const body = wpis.match(/^---\n[\s\S]*?\n---\n\n([\s\S]*?)\n?$/)?.[1];
  assert.equal(body, fabula);
  assert.match(wpis, /^imgId: 540DST$/m);
  assert.match(wpis, /^nazwa: Chittering Rats$/m);
  assert.match(wpis, /^wydanie: DST$/m);
  assert.match(wpis, /^plan: Wiedźmin$/m);
});

test('540DST: imgId właściciela pozostaje niezależny od numeru DST #39', () => {
  assert.match(karta, /^imgId: 540DST$/m);
  assert.equal(snapshot.name, 'Chittering Rats');
  assert.equal(snapshot.set, 'dst');
  assert.equal(snapshot.collector_number, '39');
  assert.equal(snapshot.mana_cost, '{1}{B}{B}');
  assert.equal(snapshot.type_line, 'Creature — Rat');
  assert.equal(snapshot.power, '2');
  assert.equal(snapshot.toughness, '2');
  assert.equal(snapshot.rarity, 'common');
  assert.equal(snapshot.artist, 'Tom Wänerstrand');
  assert.equal(snapshot.flavor_text, 'Bottom feeders sometimes rise to the top.');
  assert.match(snapshot.oracle_text, /target opponent puts a card from their hand on top of their library/i);
  assert.match(snapshot.notka_numery, /Dwa niezależne systemy numeracji/i);
});

test('540DST: Karta Katalogowa jest LORE-first i zachowuje mechanikę zwłoki', () => {
  assert.ok(karta.indexOf('## Kronika Lore') < karta.indexOf('## Mechanika jako Opowieść'));
  assert.deepEqual(
    [...karta.matchAll(/^## (.+)$/gm)].map((m) => m[1]),
    sekcje,
  );
  assert.match(karta, /\*\*„Piszczące\s+szczury”\*\*/i);
  assert.match(karta, /to przeciwnik wybiera kartę z własnej\s+ręki/i);
  assert.match(karta, /nie zostaje\s+odrzucony, zniszczony ani przejęty/i);
  assert.match(karta, /świeży przyszły dobór/i);
  assert.match(karta, /Zdobycz pozostaje przy właścicielu/i);
});

test('540DST: kanały mają dokładną pinezkę miasta, ale nie zmyślony tunel', () => {
  assert.ok(pin, 'brak pinezki Chittering Rats');
  assert.ok(novigrad, 'brak kotwicy Novigradu');
  assert.equal(novigrad.typ, 'miasto');
  assert.deepEqual(novigrad.px_t1, [2060, 1780]);
  assert.notDeepEqual(novigrad.px_t1, [2000, 1700],
    'stary odczyt trafiał na wybrzeże na północny zachód od miasta');
  assert.match(novigrad.pozycja_zrodlo, /ponowny odczyt wizualny mastera/i);
  assert.equal(pin.pewnosc, 'dokladna');
  assert.equal(pin.x, 0.4045);
  assert.equal(pin.y, 0.2469);
  assert.equal(pin.x, novigrad.x);
  assert.equal(pin.y, novigrad.y);
  assert.ok(Math.abs(pin.x * mapa.wymiary.szerokosc - 2060) < 1);
  assert.ok(Math.abs(pin.y * mapa.wymiary.wysokosc - 1780) < 1);
  assert.match(pin.uzasadnienie, /konkretnego włazu, ulicy ani korytarza/i);
  assert.match(karta, /Pinezka ma pewność `dokladna` w skali globalnej mapy/i);
  assert.match(karta, /Pinezka nie jest\s+planem kanałów ani adresem konkretnego tunelu/i);
});

test('540DST: scena zachowuje pseudoszczury, mapy i anonimowego poszukiwacza', () => {
  assert.match(karta, /\*\*pseudoszczury\*\*/i);
  assert.match(karta, /zmutowane, stadne gryzonie miejskich\s+kanałów i piwnic/i);
  assert.match(karta, /Nie jest Geraltem/i);
  assert.match(karta, /Nie wiadomo, co mapy przedstawiają/i);
  assert.match(karta, /przerywa wyprawę i\s+osłania rulony ramieniem/i);
  assert.doesNotMatch(karta, /poszukiwacz(?:em)?\s+(?:jest|był)\s+Geralt/i);
});

test('540DST: Novigrad przekracza próg dwóch kart i ma jedno hasło geograficzne', () => {
  assert.match(haslo, /^typ: haslo$/m);
  assert.match(haslo, /^slug: novigrad$/m);
  assert.match(haslo, /^klasa: geografia$/m);
  assert.doesNotMatch(haslo, /^pinezka:/m);
  assert.match(haslo, /#\/mapa\/wiedzmin\?x=0\.4045&y=0\.2469/);
  assert.match(karta, /\[\[novigrad\|/);
  assert.match(poprzedniaKarta, /\[\[novigrad\|/);
  assert.match(plan, /\[\[540dst-chittering-rats\|\*\*Chittering Rats\*\*\]\]/);
  assert.match(changelog, /Nowa karta: Chittering Rats \(Wiedźmin\)/);
});
