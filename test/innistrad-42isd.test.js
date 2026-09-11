import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mapa = JSON.parse(fs.readFileSync('maps/innistrad/map.json', 'utf8'));
const snapshot = JSON.parse(fs.readFileSync('scryfall/42isd-murder-of-crows.json', 'utf8'));
const karta = fs.readFileSync('content/cards/42isd-murder-of-crows.md', 'utf8');
const wpis = fs.readFileSync('collection/entries/42isd-murder-of-crows.md', 'utf8');
const plan = fs.readFileSync('content/planes/innistrad.md', 'utf8');

const pin = mapa.pinezki.find((p) => p.karta === '42isd-murder-of-crows');
const stensia = mapa.kotwice.find((k) => k.nazwa === 'Stensia');

test('42ISD: imgId właściciela pozostaje niezależny od numeru ISD #70', () => {
  assert.match(wpis, /^imgId: 42ISD$/m);
  assert.match(karta, /^imgId: 42ISD$/m);
  assert.equal(snapshot.name, 'Murder of Crows');
  assert.equal(snapshot.set, 'isd');
  assert.equal(snapshot.collector_number, '70');
  assert.match(snapshot.notka_numery, /Dwa niezależne systemy numeracji/i);
});

test('42ISD: Fabuła kotwiczy stensiański cmentarz i przejmowanie ostatnich słów', () => {
  assert.match(wpis, /Na starym gotyckim cmentarzu Innistradu tuż po zmierzchu/);
  assert.match(wpis, /puste szaty i srebrna tarcza strażnika/);
  assert.match(wpis, /wspomnienia i słowa zmarłego/);
  assert.match(wpis, /W Stensii ptaki cmentarne nie szukają ciał/);
  assert.match(karta, /srebrna\s+tarcza/i);
  assert.match(karta, /błękitn(?:e|ą)\s+(?:smugi|smugę|ślad|ślady|opary)/i);
  assert.match(karta, /ostatni(?:e|ch)\s+sł(?:owo|owa|ów)/i);
  assert.match(plan, /42isd-murder-of-crows/);
});

test('42ISD: anonimowy cmentarz ma regionalną pinezkę na Stensii', () => {
  assert.ok(pin, 'brak pinezki Murder of Crows');
  assert.ok(stensia, 'brak kotwicy Stensia');
  assert.equal(pin.pewnosc, 'region');
  assert.ok(Math.abs(pin.x - stensia.x) < 0.0001);
  assert.ok(Math.abs(pin.y - stensia.y) < 0.0001);
  assert.match(pin.uzasadnienie, /nie nazywa cmentarza, doliny ani osady/i);
  assert.match(pin.uzasadnienie, /nie dokładnym adresem sceny/i);
  assert.match(karta, /Pinezka ma pewność `region`/);
  assert.match(karta, /nie\s+zamienia pinezki w dokładny punkt Farbogów/i);
});
