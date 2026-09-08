/**
 * Strażnik: polska odmiana rzeczownika (src/codex/render.js `odmiana`).
 * Regresja boksów planów (render-home.js / render-lists.js): „2 karty”,
 * nie „2 kart” — forma „kart” od 5, włącznie z 21 („dwadzieścia jeden
 * kart” — liczebnik główny, nie „karta”), a „karty” tylko przy 2–4
 * (poza 12–14).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { odmiana } from '../src/codex/render.js';

const K = (n) => odmiana(n, ['karta', 'karty', 'kart']);

test('odmiana: karta/karty/kart wg polskiej reguły (1 / 2-4 / 5-21 / 22-24 / 25-31…)', () => {
  assert.equal(K(0), 'kart', '0 → kart');
  assert.equal(K(1), 'karta', '1 → karta');
  assert.equal(K(2), 'karty', '2 → karty (regresja: boks planu dawał „2 kart”)');
  assert.equal(K(3), 'karty', '3 → karty');
  assert.equal(K(4), 'karty', '4 → karty');
  assert.equal(K(5), 'kart', '5 → kart');
  assert.equal(K(10), 'kart', '10 → kart');
  assert.equal(K(11), 'kart', '11 → kart');
  assert.equal(K(12), 'kart', '12 → kart (nastolatki: 12–14 biorą „kart”)');
  assert.equal(K(13), 'kart', '13 → kart');
  assert.equal(K(14), 'kart', '14 → kart');
  assert.equal(K(15), 'kart', '15 → kart');
  assert.equal(K(20), 'kart', '20 → kart');
  assert.equal(K(21), 'kart', '21 → kart („dwadzieścia jeden kart” — liczebnik, nie „karta”)');
  assert.equal(K(22), 'karty', '22 → karty');
  assert.equal(K(24), 'karty', '24 → karty');
  assert.equal(K(25), 'kart', '25 → kart');
  assert.equal(K(31), 'kart', '31 → kart');
  assert.equal(K(32), 'karty', '32 → karty');
  assert.equal(K(34), 'karty', '34 → karty');
  assert.equal(K(35), 'kart', '35 → kart');
});

test('odmiana: działa dla innych słów (wpis/plan/hasło)', () => {
  assert.equal(odmiana(2, ['wpis', 'wpisy', 'wpisów']), 'wpisy', '2 wpisy');
  assert.equal(odmiana(5, ['wpis', 'wpisy', 'wpisów']), 'wpisów', '5 wpisów');
  assert.equal(odmiana(1, ['plan', 'plany', 'planów']), 'plan', '1 plan');
  assert.equal(odmiana(2, ['plan', 'plany', 'planów']), 'plany', '2 plany');
  assert.equal(odmiana(10, ['plan', 'plany', 'planów']), 'planów', '10 planów');
  assert.equal(odmiana(12, ['hasło', 'hasła', 'haseł']), 'haseł', '12 haseł');
});
