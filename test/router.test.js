/** Testy routera po hashu (ADR 0001). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsujHash } from '../src/codex/router.js';

test('pusty hash to strona główna', () => {
  assert.deepEqual(parsujHash(''), { nazwa: 'glowna', param: null, query: {} });
  assert.deepEqual(parsujHash('#/'), { nazwa: 'glowna', param: null, query: {} });
});

test('trasy z parametrem i zapytaniem', () => {
  assert.deepEqual(parsujHash('#/karta/1ltr-dunland-crebain'), { nazwa: 'karta', param: '1ltr-dunland-crebain', query: {} });
  assert.deepEqual(parsujHash('#/mapa/srodziemie?pin=1ltr-dunland-crebain'), {
    nazwa: 'mapa', param: 'srodziemie', query: { pin: '1ltr-dunland-crebain' },
  });
  assert.deepEqual(parsujHash('#/szukaj?q=crebain'), { nazwa: 'szukaj', param: null, query: { q: 'crebain' } });
  assert.deepEqual(parsujHash('#/tag/fauna'), { nazwa: 'tag', param: 'fauna', query: {} });
});

test('nieznana trasa jest jawnie oznaczona', () => {
  assert.equal(parsujHash('#/bzdura').nazwa, 'nieznana');
});

test('parametry są dekodowane z URL', () => {
  assert.equal(parsujHash('#/tag/w%c4%85w%c3%b3z').param, 'wąwóz');
});
