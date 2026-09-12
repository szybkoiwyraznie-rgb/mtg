import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mapa = JSON.parse(fs.readFileSync('maps/wiedzmin/map.json', 'utf8'));
const snapshot = JSON.parse(fs.readFileSync('scryfall/555dsk-bedhead-beastie.json', 'utf8'));
const karta = fs.readFileSync('content/cards/555dsk-bedhead-beastie.md', 'utf8');
const wpis = fs.readFileSync('collection/entries/555dsk-bedhead-beastie.md', 'utf8');
const plan = fs.readFileSync('content/planes/wiedzmin.md', 'utf8');
const changelog = fs.readFileSync('content/co-nowego.md', 'utf8');

const pin = mapa.pinezki.find((p) => p.karta === '555dsk-bedhead-beastie');
const velen = mapa.kotwice.find((k) => k.nazwa === 'Velen');

const fabula = 'W opuszczonych w wyniku wojny chatach na bagnach Velen wiejskie opowieści o bebokach czających się pod łóżkami okazują się namacalną, groźną prawdą. Kolosalny, pokryty skołtunionym futrem potwór uwił sobie leże w zrujnowanej izbie, niezgrabnie klinując na swoim rogatym łbie szczątki drewnianego posłania i słomianego siennika. Przez sterczące źdźbła słomy i połamane deski złowrogo łypią żółte ślepia bestii, której sama masa budzi paraliżujący strach. Dwaj redańscy milicjanci zatrzymują się w progu chaty i zwierają szyk, doskonale wiedząc, że żaden samotny wieśniak nie zdołałby przepędzić tak potężnego stwora.';

test('555DSK: Fabuła właściciela pozostaje zachowana verbatim', () => {
  const body = wpis.match(/^---\n[\s\S]*?\n---\n\n([\s\S]*?)\n?$/)?.[1];
  assert.equal(body, fabula);
  assert.match(wpis, /^imgId: 555DSK$/m);
  assert.match(wpis, /^wydanie: DSK$/m);
  assert.match(wpis, /^plan: Wiedźmin$/m);
});

test('555DSK: imgId właściciela pozostaje niezależny od numeru DSK #125', () => {
  assert.match(karta, /^imgId: 555DSK$/m);
  assert.equal(snapshot.name, 'Bedhead Beastie');
  assert.equal(snapshot.set, 'dsk');
  assert.equal(snapshot.collector_number, '125');
  assert.equal(snapshot.mana_cost, '{4}{R}{R}');
  assert.equal(snapshot.type_line, 'Creature — Beast');
  assert.equal(snapshot.power, '5');
  assert.equal(snapshot.toughness, '6');
  assert.match(snapshot.oracle_text, /^Menace/m);
  assert.match(snapshot.oracle_text, /Mountaincycling \{2\}/);
  assert.match(snapshot.notka_numery, /Dwa niezależne systemy numeracji/i);
});

test('555DSK: chata ma wyłącznie regionalną pinezkę na Velen', () => {
  assert.ok(pin, 'brak pinezki Bedhead Beastie');
  assert.ok(velen, 'brak kotwicy Velen');
  assert.equal(velen.typ, 'region');
  assert.deepEqual(velen.px_t1, [2095, 2024]);
  assert.equal(pin.pewnosc, 'region');
  assert.equal(pin.x, 0.4113);
  assert.equal(pin.y, 0.2807);
  assert.equal(pin.x, velen.x);
  assert.equal(pin.y, velen.y);
  assert.match(pin.uzasadnienie, /bez nazwy wsi, mokradła lub posterunku/i);
  assert.match(karta, /Pinezka ma pewność `region`/);
  assert.match(karta, /Nie jest to wskazanie Krzywuchowych Moczarów, konkretnej wsi ani nazwanej\s+chaty/i);
});

test('555DSK: lore zachowuje beboka i nie utożsamia go automatycznie z biesem', () => {
  assert.match(karta, /Bebok z veleńskiej chaty/);
  assert.match(karta, /dwaj \*\*redańscy milicjanci\*\*/i);
  assert.match(karta, /\*\*Bies\*\* stanowi ostrożny punkt porównania, nie rozpoznanie/i);
  assert.match(karta, /wyróżnia je także trzecie oko/i);
  assert.match(karta, /Menace[\s\S]*?Dwaj milicjanci/i);
  assert.match(plan, /555dsk-bedhead-beastie/);
  assert.match(plan, /brak rozpoznania\s+wiedźmińskiego/i);
  assert.match(changelog, /Nowa karta: Bedhead Beastie \(Wiedźmin\)/);
});
