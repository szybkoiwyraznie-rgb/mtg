import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mapa = JSON.parse(fs.readFileSync('maps/srodziemie/map.json', 'utf8'));
const snapshot = JSON.parse(fs.readFileSync('scryfall/13m20-soulmender.json', 'utf8'));
const karta = fs.readFileSync('content/cards/13m20-soulmender.md', 'utf8');
const wpis = fs.readFileSync('collection/entries/13m20-soulmender.md', 'utf8');

const pin = mapa.pinezki.find((p) => p.karta === '13m20-soulmender');

const fabula = 'Na skalistym wzniesieniu śródziemskich wzgórz stoi kapłan-uzdrowiciel w kremowo-złotych szatach, dłonie wyciągnięte ku siedzącemu niżej na kamieniu pacjentowi. Między jego palcami wiruje świetlisty krąg złotobiałej energii — nie wybuch mocy, lecz precyzyjny strumień, dokładnie tyle, ile trzeba, i ani kropli więcej. Na ramieniu pacjenta blednie blizna, otulona delikatnym światłem, a wokół opadają drobne złote iskry niczym pyłek. W krainie łagodnych dolin leczenie jest sztuką cierpliwości, a nie spektaklem — mistrz zielarski zna różnicę lepiej niż każde zaklęcie.';

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

test('13M20: Fabuła właściciela pozostaje zachowana verbatim', () => {
  const body = wpis.match(/^---\n[\s\S]*?\n---\n\n([\s\S]*?)\n?$/)?.[1];
  assert.equal(body, fabula);
  assert.match(wpis, /^imgId: 13M20$/m);
  assert.match(wpis, /^nazwa: Soulmender$/m);
  assert.match(wpis, /^wydanie: M20$/m);
  assert.match(wpis, /^plan: Śródziemie$/m);
});

test('13M20: imgId właściciela pozostaje niezależny od numeru M20 #37', () => {
  assert.match(karta, /^imgId: 13M20$/m);
  assert.equal(snapshot.name, 'Soulmender');
  assert.equal(snapshot.set, 'm20');
  assert.equal(snapshot.collector_number, '37');
  assert.equal(snapshot.mana_cost, '{W}');
  assert.equal(snapshot.type_line, 'Creature — Human Cleric');
  assert.equal(snapshot.power, '1');
  assert.equal(snapshot.toughness, '1');
  assert.equal(snapshot.rarity, 'common');
  assert.equal(snapshot.artist, 'James Ryman');
  assert.match(snapshot.oracle_text, /gain 1 life/i);
  assert.equal(snapshot.flavor_text, '"Healing is more art than magic. Well, there is still quite a bit of magic."');
  assert.match(snapshot.notka_numery, /imgId właściciela = 13M20/i);
  assert.match(snapshot.notka_numery, /collector_number Scryfall = 37/i);
});

test('13M20: Karta Katalogowa zachowuje strukturę LORE-first i motyw uzdrawiania', () => {
  assert.deepEqual(
    [...karta.matchAll(/^## (.+)$/gm)].map((m) => m[1]),
    sekcje,
  );
  assert.match(karta, /kapłan-uzdrowiciel/i);
  assert.match(karta, /złotobiał/i);
  assert.match(karta, /cierpliwości/i);
});

test('13M20: Uzdrowiciel dostaje regionalną pinezkę na mapie Śródziemia', () => {
  assert.ok(pin, 'Brak pinezki dla karty 13m20-soulmender w maps/srodziemie/map.json');
  assert.equal(pin.pewnosc, 'region');
  assert.match(pin.uzasadnienie, /wzgórz/i);
});
