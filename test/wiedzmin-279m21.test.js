import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mapa = JSON.parse(fs.readFileSync('maps/wiedzmin/map.json', 'utf8'));
const snapshot = JSON.parse(fs.readFileSync('scryfall/279m21-village-rites.json', 'utf8'));
const karta = fs.readFileSync('content/cards/279m21-village-rites.md', 'utf8');
const wpis = fs.readFileSync('collection/entries/279m21-village-rites.md', 'utf8');
const haslo = fs.readFileSync('content/lore/velen.md', 'utf8');
const poprzedniaKarta = fs.readFileSync('content/cards/555dsk-bedhead-beastie.md', 'utf8');
const plan = fs.readFileSync('content/planes/wiedzmin.md', 'utf8');
const changelog = fs.readFileSync('content/co-nowego.md', 'utf8');

const pin = mapa.pinezki.find((p) => p.karta === '279m21-village-rites');
const velen = mapa.kotwice.find((k) => k.nazwa === 'Velen');

const fabula = 'W chacie sołtysa w Downwarren starsza szeptucha z Velen kładzie na dębowym pniu otwartą księgę rodową, której dwie strony znaczą dług i zapłatę. Obok niej gospodarz z Czarnoboru trzyma glinianą misę z wodą z Krzywuchowych Moczarów, gotową przyjąć ofiarę. Młody parobek klęczy na klepisku, a przy jego kolanach stoi biała koza z czerwoną wstążką, którą wieś karmiła przez całe lato. W półmroku za nimi milcząco stoją sąsiedzi w lnianych kapturach, a płomień świec odbija się w ich oczach, gdy szeptucha odwraca pierwszą kartę.';

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

test('279M21: Fabuła właściciela pozostaje zachowana verbatim', () => {
  const body = wpis.match(/^---\n[\s\S]*?\n---\n\n([\s\S]*?)\n?$/)?.[1];
  assert.equal(body, fabula);
  assert.match(wpis, /^imgId: 279M21$/m);
  assert.match(wpis, /^nazwa: Village Rites$/m);
  assert.match(wpis, /^wydanie: M21$/m);
  assert.match(wpis, /^plan: Wiedźmin$/m);
});

test('279M21: imgId właściciela pozostaje niezależny od numeru M21 #126', () => {
  assert.match(karta, /^imgId: 279M21$/m);
  assert.equal(snapshot.name, 'Village Rites');
  assert.equal(snapshot.set, 'm21');
  assert.equal(snapshot.collector_number, '126');
  assert.equal(snapshot.mana_cost, '{B}');
  assert.equal(snapshot.type_line, 'Instant');
  assert.equal(snapshot.rarity, 'common');
  assert.equal(snapshot.artist, 'Bud Cook');
  assert.match(snapshot.oracle_text, /sacrifice a creature/i);
  assert.match(snapshot.oracle_text, /Draw two cards/i);
  assert.equal(snapshot.flavor_text, '"You were so eager to take and consume. Yet when asked to give, you refuse?"');
  assert.match(snapshot.notka_numery, /imgId właściciela = 279M21/i);
  assert.match(snapshot.notka_numery, /collector_number Scryfall = 126/i);
});

test('279M21: Karta Katalogowa zachowuje ryt, kozę i dokładnie jedną ofiarę', () => {
  assert.deepEqual(
    [...karta.matchAll(/^## (.+)$/gm)].map((m) => m[1]),
    sekcje,
  );
  assert.ok(karta.indexOf('## Kronika Lore') < karta.indexOf('## Mechanika jako Opowieść'));
  assert.match(karta, /\*\*„Wiejskie obrzędy”\*\*/);
  assert.match(karta, /Downwarren[\s\S]*?\*\*Sztygarami\*\*/);
  assert.match(karta, /\*\*Czarnoboru\*\*/);
  assert.match(karta, /Blackbough\/Konarów/);
  assert.match(karta, /biała \*\*koza\*\* z czerwoną wstążką/);
  assert.match(karta, /Parobek klęczy obok, lecz tekst Fabuły nie czyni z niego ofiary\s+śmiertelnej/i);
  assert.match(karta, /trzeba poświęcić \*\*dokładnie jedno\*\*\s+stworzenie/i);
  assert.match(karta, /nie wolno dorzucić kolejnych ofiar/i);
  assert.match(karta, /Dobranie dwóch kart przechodzi w dwie strony księgi rodowej/i);
});

test('279M21: Sztygary dostają regionalną pinezkę Velen bez fałszywej precyzji', () => {
  assert.ok(pin, 'brak pinezki Village Rites');
  assert.ok(velen, 'brak kotwicy Velen');
  assert.equal(velen.typ, 'region');
  assert.deepEqual(velen.px_t1, [2095, 2024]);
  assert.equal(pin.pewnosc, 'region');
  assert.equal(pin.x, 0.4113);
  assert.equal(pin.y, 0.2807);
  assert.equal(pin.x, velen.x);
  assert.equal(pin.y, velen.y);
  assert.match(pin.uzasadnienie, /Downwarren\/Sztygarach/i);
  assert.match(pin.uzasadnienie, /Krzywuchowych Moczarów/i);
  assert.match(pin.uzasadnienie, /nie udaje dokładnego progu izby/i);
  assert.match(karta, /Pinezka ma pewność `region`/);
  assert.match(karta, /Nie jest to próba wskazania dokładnego pieńka, misy ani gospodarstwa/i);
  assert.match(plan, /Village Rites[\s\S]*?pewność `region`/);
});

test('279M21: Velen przekracza próg dwóch kart i ma jedno hasło geograficzne', () => {
  assert.match(haslo, /^typ: haslo$/m);
  assert.match(haslo, /^slug: velen$/m);
  assert.match(haslo, /^klasa: geografia$/m);
  assert.doesNotMatch(haslo, /^pinezka:/m);
  assert.match(haslo, /#\/mapa\/wiedzmin\?x=0\.4113&y=0\.2807/);
  assert.match(karta, /\[\[velen\|/);
  assert.match(poprzedniaKarta, /\[\[velen\|/);
  assert.match(plan, /\[\[velen\|\*\*Velen\*\*\]\]/);
  assert.match(changelog, /Nowa karta: Village Rites \(Wiedźmin\)/);
});
