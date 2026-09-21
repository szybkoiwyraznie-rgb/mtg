import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mapa = JSON.parse(fs.readFileSync('maps/mirrodin/map.json', 'utf8'));
const snapshot = JSON.parse(fs.readFileSync('scryfall/168-2xm-steel-sabotage.json', 'utf8'));
const karta = fs.readFileSync('content/cards/168-2xm-steel-sabotage.md', 'utf8');
const wpis = fs.readFileSync('collection/entries/168-2xm-steel-sabotage.md', 'utf8');

const pin = mapa.pinezki.find((p) => p.karta === '168-2xm-steel-sabotage');

const fabula = 'W głębi Rdzenia Mirrodina Rhmir, Ręka Wieszcza, staje między stołami Płomiennej Huty, gdzie mirrańscy kowale składali myry z Białego Słońca. Po jego lewej niedokończony strażnik rozpada się w błękitny pył, a stalowe płyty opadają na posadzkę, nim zdążą przyjąć iskrę życia. Po prawej drugi myr, już ożywiony, unosi się w strumieniu jasnej energii i dryfuje z powrotem ku dłoni swego twórcy z Lumengrid. Rhmir rozchyla palce pokryte czarnym olejem i szeptem przypomina braciom, że ich stal jest przestarzała i tylko Wielkie Dzieło oferuje doskonałość.';

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

test('168_2XM: Fabuła właściciela pozostaje zachowana verbatim (ADR 0003)', () => {
  const body = wpis.match(/^---\n[\s\S]*?\n---\n\n([\s\S]*?)\n?$/)?.[1];
  assert.equal(body, fabula);
  assert.match(wpis, /^imgId: 168_2XM$/m);
  assert.match(wpis, /^nazwa: Steel Sabotage$/m);
  assert.match(wpis, /^wydanie: 2XM$/m);
  assert.match(wpis, /^plan: Mirrodin$/m);
});

test('168_2XM: imgId właściciela (168_2XM) pozostaje niezależny od numeru 2XM #70', () => {
  assert.match(karta, /^imgId: 168_2XM$/m);
  assert.equal(snapshot.name, 'Steel Sabotage');
  assert.equal(snapshot.set, '2xm');
  assert.equal(snapshot.collector_number, '70');
  assert.equal(snapshot.mana_cost, '{U}');
});

test('168_2XM: Karta Katalogowa jest LORE-first i zachowuje wszystkie sekcje', () => {
  for (const s of sekcje) {
    assert.match(karta, new RegExp(`## ${s}`), `brak sekcji ${s}`);
  }
  assert.match(karta, /Płomiennej Huty/);
  assert.match(karta, /Rhmir/);
  assert.match(karta, /myry|myr/i);
  assert.match(karta, /Wielkie Dzieło/);
});

test('168_2XM: Płomienna Huta dostaje regionalną pinezkę na Mirrodinie', () => {
  assert.ok(pin, 'brak pinezki w maps/mirrodin/map.json');
  assert.equal(pin.pewnosc, 'region');
  assert.equal(pin.x, 0.2901);
  assert.equal(pin.y, 0.7587);
  assert.match(pin.uzasadnienie, /Płomiennej Huty/);
});
