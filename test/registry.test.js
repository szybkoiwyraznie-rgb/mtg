/** Testy walidatora schematów stron (registry.js — ADR 0005). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  walidujStrone, zbudujRejestr, policzBacklinki, policzTagi,
  SEKCJE_KARTY, wytnijSekcje,
} from '../src/codex/registry.js';

const ctx = {
  taxonomia: new Map([['fauna', 'opis']]),
  plany: new Set(['testlandia']),
};

const kartaOK = {
  typ: 'karta',
  slug: '1tst-testowy-zwiadowca',
  tytul: 'Testowy Zwiadowca',
  imgId: '1TST',
  plan: 'testlandia',
  kolory: ['B'],
  tagi: ['fauna'],
  materializacja: '2026-08-31',
  body: SEKCJE_KARTY.map((s) => `## ${s}\nTreść.`).join('\n\n'),
};

test('pełna karta wg szkieletu przechodzi bez problemów', () => {
  assert.deepEqual(walidujStrone(kartaOK, ctx), []);
});

test('karta bez obowiązkowej sekcji jest czerwona', () => {
  const body = SEKCJE_KARTY.filter((s) => s !== 'Źródła').map((s) => `## ${s}\nX`).join('\n\n');
  const p = walidujStrone({ ...kartaOK, body }, ctx);
  assert.ok(p.some((x) => x.includes('Źródła')));
});

test('sekcja spoza szkieletu karty jest czerwona', () => {
  const p = walidujStrone({ ...kartaOK, body: `${kartaOK.body}\n\n## Wynalazek\nX` }, ctx);
  assert.ok(p.some((x) => x.includes('poza szkieletem')));
});

test('slug karty musi zaczynać się od imgId', () => {
  const p = walidujStrone({ ...kartaOK, slug: 'inny-slug' }, ctx);
  assert.ok(p.some((x) => x.includes('imgId')));
});

test('plan, kolory i tagi są walidowane', () => {
  const p = walidujStrone({ ...kartaOK, plan: 'niema', kolory: ['X'], tagi: ['nieznany'] }, ctx);
  assert.ok(p.some((x) => x.includes('niema')));
  assert.ok(p.some((x) => x.includes('kolor')));
  assert.ok(p.some((x) => x.includes('poza słownikiem')));
});

test('pinezka: mapa musi równać się planowi, pewność wg słownika (x/y żyją w map.json)', () => {
  const p = walidujStrone({ ...kartaOK, pinezka: { mapa: 'testlandia', pewnosc: 'zgadula' } }, ctx);
  assert.ok(p.some((x) => x.includes('pewnosc')));
  const p2 = walidujStrone({ ...kartaOK, pinezka: { mapa: 'innymapa', pewnosc: 'region' } }, ctx);
  assert.ok(p2.some((x) => x.includes('pinezka.mapa')));
  assert.deepEqual(walidujStrone({ ...kartaOK, pinezka: { mapa: 'testlandia', pewnosc: 'region' } }, ctx), []);
});

test('hasło: klasa i obowiązkowe sekcje', () => {
  const hasloOK = {
    typ: 'haslo', slug: 'testowy-ptak', tytul: 'Testowy Ptak', klasa: 'fauna',
    plan: 'testlandia', tagi: ['fauna'],
    body: '## Definicja\nX\n\n## Opis\nY\n\n## Źródła\nZ',
  };
  assert.deepEqual(walidujStrone(hasloOK, ctx), []);
  assert.ok(walidujStrone({ ...hasloOK, klasa: 'statystyka' }, ctx).some((x) => x.includes('klasa')));
  assert.ok(walidujStrone({ ...hasloOK, body: '## Definicja\nX' }, ctx).some((x) => x.includes('Opis')));
});

test('plan: typIP i pole mapa', () => {
  const planOK = { typ: 'plan', slug: 'testlandia', tytul: 'Testlandia', typIP: 'custom' };
  assert.deepEqual(walidujStrone(planOK, ctx), []);
  assert.deepEqual(walidujStrone({ ...planOK, mapa: 'pending' }, ctx), []);
  assert.deepEqual(walidujStrone({ ...planOK, mapa: 'testlandia' }, ctx), []);
  assert.ok(walidujStrone({ ...planOK, typIP: 'kosmos' }, ctx).some((x) => x.includes('typIP')));
  assert.ok(walidujStrone({ ...planOK, mapa: 'cosinnego' }, ctx).some((x) => x.includes('mapa')));
});

test('rejestr: duplikaty slugów w jednej przestrzeni nazw', () => {
  const { duplikaty } = zbudujRejestr([
    { slug: 'a', typ: 'haslo' }, { slug: 'a', typ: 'karta' },
  ]);
  assert.equal(duplikaty.length, 1);
});

test('backlinki i tagi liczone poprawnie', () => {
  const strony = [
    { slug: 'k1', tagi: ['fauna'], linki: ['h1', 'h2'] },
    { slug: 'k2', tagi: ['fauna'], linki: ['h1'] },
    { slug: 'h1', tagi: [], linki: [] },
  ];
  assert.deepEqual(policzBacklinki(strony), { h1: ['k1', 'k2'], h2: ['k1'] });
  assert.deepEqual(policzTagi(strony), { fauna: ['k1', 'k2'] });
});

test('wytnijSekcje czyta h2 z body', () => {
  assert.deepEqual(wytnijSekcje('## A\nx\n\n### B\ny\n\n## C'), ['A', 'C']);
});
