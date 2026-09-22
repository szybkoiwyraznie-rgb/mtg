import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mapa = JSON.parse(fs.readFileSync('maps/tarkir/map.json', 'utf8'));
const snapshot = JSON.parse(fs.readFileSync('scryfall/64dtk-lightwalker.json', 'utf8'));
const karta = fs.readFileSync('content/cards/64dtk-lightwalker.md', 'utf8');
const wpis = fs.readFileSync('collection/entries/64dtk-lightwalker.md', 'utf8');
const plan = fs.readFileSync('content/planes/tarkir.md', 'utf8');
const pin = mapa.pinezki.find((p) => p.karta === '64dtk-lightwalker');
const wasteland = mapa.kotwice.find((k) => k.nazwa === 'Shifting Wastes');
const fabula = 'Wysoko ponad pustynnymi kanionami Tarkiru wojownicy klanu Dromoki doświadczają najwspanialszego daru swoich smoczych władców. Nasycony słonecznym tchnieniem piechur z pełną prędkością szarżuje po zawieszonych w powietrzu, krystalicznych stopniach ze skondensowanego światła. Każde stąpnięcie po świetlistej ścieżce wyzwala złocisty blask, nasycając pancerz wojownika energią pozwalającą toczyć walkę na równi ze skrzydlatymi drapieżnikami. Jak z dumą powtarza wojownik Urdnan, dzięki łasce Dromoki ludzie zyskują podniebną wolność bez konieczności posiadania własnych skrzydeł.';
const sekcje = ['Kronika Lore', 'Postacie i Byty', 'Nazwa Karty', 'Flavor Text', 'Transpozycja', 'Na Mapie', 'Mechanika jako Opowieść', 'Źródła', 'Podsumowanie Lore'];

test('64DTK: Fabuła właściciela pozostaje zachowana verbatim', () => {
  const body = wpis.match(/^---\n[\s\S]*?\n---\n\n([\s\S]*?)\n?$/)?.[1];
  assert.equal(body, `## Fabuła (dostawa 2026-09-21, ADR 0026)\n\n${fabula}`);
  assert.match(wpis, /^imgId: 64DTK$/m);
  assert.match(wpis, /^nazwa: Lightwalker$/m);
  assert.match(wpis, /^wydanie: DTK$/m);
  assert.match(wpis, /^plan: Tarkir$/m);
});

test('64DTK: snapshot rozdziela imgId 64DTK od DTK #24', () => {
  assert.match(karta, /^imgId: 64DTK$/m);
  assert.equal(snapshot.name, 'Lightwalker');
  assert.equal(snapshot.set, 'dtk');
  assert.equal(snapshot.collector_number, '24');
  assert.equal(snapshot.mana_cost, '{1}{W}');
  assert.equal(snapshot.type_line, 'Creature — Human Warrior');
  assert.equal(snapshot.power, '2');
  assert.equal(snapshot.toughness, '1');
  assert.equal(snapshot.rarity, 'common');
  assert.equal(snapshot.artist, 'Winona Nelson');
  assert.match(snapshot.oracle_text, /flying/);
  assert.match(snapshot.oracle_text, /\+1\/\+1 counter/);
  assert.equal(snapshot.flavor_text, 'The greatest gift Dromoka gives is the ability to fly without wings. —Urdnan, Dromoka warrior');
  assert.match(snapshot.notka_numery, /imgId właściciela = 64DTK/);
  assert.match(snapshot.notka_numery, /collector_number Scryfall = 24/);
});

test('64DTK: Karta Katalogowa zachowuje Dromokę i przemianę piechura w lotnika', () => {
  assert.deepEqual([...karta.matchAll(/^## (.+)$/gm)].map((m) => m[1]), sekcje);
  assert.ok(karta.indexOf('## Kronika Lore') < karta.indexOf('## Mechanika jako Opowieść'));
  assert.match(karta, /Dromoki/);
  assert.match(karta, /krystalicznego światła/);
  assert.match(karta, /Urdnan/);
  assert.match(karta, /zyskuje \*\*flying\*\*/);
  assert.match(karta, /\+1\/\+1/);
  assert.match(karta, /Dragons of Tarkir/);
});

test('64DTK: regionalna pinezka trafia na Shifting Wastes i nie fałszuje kanionu', () => {
  assert.ok(pin, 'brak pinezki Lightwalker');
  assert.ok(wasteland, 'brak kotwicy Shifting Wastes');
  assert.equal(pin.pewnosc, 'region');
  assert.equal(pin.x, wasteland.x);
  assert.equal(pin.y, wasteland.y);
  assert.match(pin.uzasadnienie, /pustynnymi kanionami/);
  assert.match(pin.uzasadnienie, /DTK/);
  assert.match(pin.uzasadnienie, /nie pozwala utożsamić/);
  assert.match(karta, /Shifting Wastes/);
  assert.match(plan, /Shifting Wastes[\s\S]*Abzan Houses/);
});

test('64DTK: pojedynczy wojownik i świetlne stopnie nie tworzą hasła', () => {
  assert.doesNotMatch(karta, /\[\[lightwalker\|/);
  assert.doesNotMatch(fs.readFileSync('content/lore/README.md', 'utf8'), /lightwalker/);
});
