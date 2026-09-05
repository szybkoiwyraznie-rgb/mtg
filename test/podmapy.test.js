/**
 * ADR 0032: rejestr map czyta podmapy części sagi
 * (maps/<plan>/<podmapa>/map.json → klucz `<plan>/<podmapa>`).
 */
import path from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wczytajMapy } from '../tools/content-loader.mjs';

const ROOT_FIXTURE = path.resolve('test/fixtures-podmapy');

test('wczytajMapy rejestruje podmapę pod kluczem plan/podmapa', () => {
  const mapy = wczytajMapy({ root: ROOT_FIXTURE });
  assert.equal(mapy.has('galia/midgar'), true, 'brak klucza galia/midgar');
  const mapa = mapy.get('galia/midgar');
  assert.equal(mapa.wariant, 'T3');
  assert.equal(mapa.plan, 'galia/midgar');
});

test('płaskie mapy nadal działają obok podmap (repo)', () => {
  const mapy = wczytajMapy();
  for (const klucz of ['ravnica', 'srodziemie', 'zendikar']) {
    assert.equal(mapy.has(klucz), true, `brak płaskiej mapy ${klucz}`);
    assert.equal(String(klucz).includes('/'), false);
  }
});
