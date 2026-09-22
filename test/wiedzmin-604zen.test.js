import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mapa = JSON.parse(fs.readFileSync('maps/wiedzmin/map.json', 'utf8'));
const snapshot = JSON.parse(fs.readFileSync('scryfall/604zen-vampires-bite.json', 'utf8'));
const karta = fs.readFileSync('content/cards/604zen-vampires-bite.md', 'utf8');
const wpis = fs.readFileSync('collection/entries/604zen-vampires-bite.md', 'utf8');
const plan = fs.readFileSync('content/planes/wiedzmin.md', 'utf8');
const pin = mapa.pinezki.find((p) => p.karta === '604zen-vampires-bite');
const velen = mapa.kotwice.find((k) => k.nazwa === 'Velen');
const fabula = 'W spowitych nocną mgłą ruinach opuszczonego pałacu w Toussaint drapieżna bruxa bezszelestnie poluje na nieostrożnych wędrowców. Jej nienaturalnie rozszerzona paszcza odsłania ostre jak igły kły, a wysysana z gardła ofiary esencja natychmiast regeneruje siły wampirzycy pod postacią szkarłatnej poświaty. W bezlitosnym bestiariuszu Kontynentu spotkanie z tą drapieżną bestią kończy się błyskawicznym i bezwzględnym triumfem czystego instynktu łowieckiego.';
const sekcje = ['Kronika Lore', 'Postacie i Byty', 'Nazwa Karty', 'Flavor Text', 'Transpozycja', 'Na Mapie', 'Mechanika jako Opowieść', 'Źródła', 'Podsumowanie Lore'];

test('604ZEN: Fabuła właściciela pozostaje zachowana verbatim', () => {
  const body = wpis.match(/^---\n[\s\S]*?\n---\n\n([\s\S]*?)\n?$/)?.[1];
  assert.equal(body, `## Fabuła (dostawa 2026-09-21, ADR 0026)\n\n${fabula}`);
  assert.match(wpis, /^imgId: 604ZEN$/m);
  assert.match(wpis, /^nazwa: Vampire's Bite$/m);
  assert.match(wpis, /^wydanie: ZEN$/m);
  assert.match(wpis, /^plan: Wiedźmin$/m);
});

test('604ZEN: snapshot rozdziela imgId 604ZEN od ZEN #117', () => {
  assert.match(karta, /^imgId: 604ZEN$/m);
  assert.equal(snapshot.name, "Vampire's Bite");
  assert.equal(snapshot.set, 'zen');
  assert.equal(snapshot.collector_number, '117');
  assert.equal(snapshot.mana_cost, '{B}');
  assert.equal(snapshot.type_line, 'Instant');
  assert.equal(snapshot.rarity, 'common');
  assert.equal(snapshot.artist, 'Christopher Moeller');
  assert.match(snapshot.oracle_text, /Kicker \{2\}\{B\}/);
  assert.match(snapshot.oracle_text, /\+3\/\+0/);
  assert.match(snapshot.oracle_text, /lifelink/);
  assert.equal(snapshot.flavor_text, undefined);
  assert.match(snapshot.notka_numery, /imgId właściciela = 604ZEN/);
  assert.match(snapshot.notka_numery, /collector_number Scryfall = 117/);
});

test('604ZEN: Karta Katalogowa zachowuje bruxę i regenerujące ukąszenie', () => {
  assert.deepEqual([...karta.matchAll(/^## (.+)$/gm)].map((m) => m[1]), sekcje);
  assert.ok(karta.indexOf('## Kronika Lore') < karta.indexOf('## Mechanika jako Opowieść'));
  assert.match(karta, /bruxa/);
  assert.match(karta, /Toussaint/);
  assert.match(karta, /szkarłatna poświata/);
  assert.match(karta, /\+3\/\+0/);
  assert.match(karta, /lifelink/);
  assert.match(karta, /nie podaje nazwy pałacu/);
});

test('604ZEN: regionalna pinezka trafia na Velen bez fałszywego pałacu', () => {
  assert.ok(pin, 'brak pinezki Vampire\'s Bite');
  assert.ok(velen, 'brak kotwicy Velen');
  assert.equal(pin.pewnosc, 'region');
  assert.equal(pin.x, velen.x);
  assert.equal(pin.y, velen.y);
  assert.match(pin.uzasadnienie, /opuszczony pałac w Toussaint/);
  assert.match(pin.uzasadnienie, /nie udaje konkretnego pałacu/);
  assert.match(karta, /Pinezka ma pewność \*\*region\*\*/);
  assert.match(karta, /regionalną kotwicę \*\*Velen\*\*/);
  assert.match(plan, /Kontynent|Velen/i);
});

test('604ZEN: pojedyncza bruxa i ruina nie tworzą przedwczesnego hasła', () => {
  assert.doesNotMatch(karta, /\[\[vampires-bite\|/);
  assert.doesNotMatch(fs.readFileSync('content/lore/README.md', 'utf8'), /vampires-bite/);
});
