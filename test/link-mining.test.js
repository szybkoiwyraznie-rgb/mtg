/** Link-mining PR-22: jedna encja, dwie karty (nie karta + plan). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wczytajStrony } from '../tools/content-loader.mjs';
import { parseWikilinks } from '../src/codex/links.js';

const strony = wczytajStrony().filter((s) => !s.problem);
const linkuje = (s) => parseWikilinks(s.body).some((l) => l.slug === 'nowa-phyrexia');

test('Nowa Phyrexia: wsparcie co najmniej dwóch kart z różnych planów', () => {
  const karty = strony.filter((s) => s.typ === 'karta' && linkuje(s));
  assert.ok(karty.length >= 2, 'próg dotyczy KART');
  for (const slug of ['305arb-illusory-demon', '488som-carapace-forger']) {
    assert.ok(karty.some((s) => s.slug === slug), `brak odsyłacza z ${slug}`);
  }
  assert.ok(new Set(karty.map((k) => k.plan)).size >= 2, 'encja łączy różne plany');
});

test('Nowa Phyrexia: cywilizacja bez sztucznej pinezki; odsyłacze z trzech planów', () => {
  const haslo = strony.find((s) => s.slug === 'nowa-phyrexia');
  assert.equal(haslo.typ, 'haslo');
  assert.equal(haslo.klasa, 'spolecznosc');
  assert.equal(haslo.plan, 'mirrodin');
  assert.equal(haslo.pinezka, undefined, 'frakcja nie dostaje geograficznej pinezki dla punktów stats');
  for (const slug of ['mirrodin', 'alara', 'tarkir']) {
    assert.ok(strony.some((s) => s.slug === slug && s.typ === 'plan' && linkuje(s)), `brak linku z planu ${slug}`);
  }
});
