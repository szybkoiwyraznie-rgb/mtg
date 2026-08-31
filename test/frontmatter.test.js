/** Testy parsera frontmattera (ścisły podzbiór YAML — ADR 0002). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFrontmatter, dumpFrontmatter } from '../src/codex/frontmatter.js';

test('parsuje skalary, listy inline i daty jako stringi', () => {
  const { data, body } = parseFrontmatter('---\nnazwa: Dunland Crebain\nwydanie: LTR\nkolory: [B, R]\nmaterializacja: 2026-08-31\n---\n\nTreść.');
  assert.equal(data.nazwa, 'Dunland Crebain');
  assert.equal(data.wydanie, 'LTR');
  assert.deepEqual(data.kolory, ['B', 'R']);
  assert.equal(data.materializacja, '2026-08-31'); // data to string, nie liczba
  assert.equal(body.trim(), 'Treść.');
});

test('parsuje listę blokową i obiekt jednopoziomowy (pinezka)', () => {
  const { data } = parseFrontmatter('---\ntagi:\n  - fauna\n  - szpiedzy\npinezka:\n  mapa: srodziemie\n  pewnosc: region\n  x: 0.31\n---\n');
  assert.deepEqual(data.tagi, ['fauna', 'szpiedzy']);
  assert.deepEqual(data.pinezka, { mapa: 'srodziemie', pewnosc: 'region', x: 0.31 });
});

test('booleany, null i liczby', () => {
  const { data } = parseFrontmatter('---\na: true\nb: false\nc: null\nd: 4\ne: "2026"\n---\n');
  assert.equal(data.a, true);
  assert.equal(data.b, false);
  assert.equal(data.c, null);
  assert.equal(data.d, 4);
  assert.equal(data.e, '2026');
});

test('plik bez frontmatteru zwraca null i pełne body', () => {
  const { data, body } = parseFrontmatter('# Sam markdown\n');
  assert.equal(data, null);
  assert.equal(body, '# Sam markdown\n');
});

test('zduplikowany klucz to błąd', () => {
  assert.throws(() => parseFrontmatter('---\na: 1\na: 2\n---\n'), /zduplikowany/);
});

test('wartość z ":" bez cudzysłowu to błąd (świadoma ścisłość)', () => {
  assert.throws(() => parseFrontmatter('---\na: b: c\n---\n'), /cudzysłów/);
});

test('zagnieżdżenie głębsze niż jeden poziom to błąd', () => {
  assert.throws(() => parseFrontmatter('---\na:\n  b: 1\n  c:\n    d: 2\n---\n'), /poziom/);
});

test('dumpFrontmatter robi poprawny round-trip podstawowych struktur', () => {
  const dane = { nazwa: 'X Y', kolory: ['B'], pinezka: { mapa: 'p', pewnosc: 'region' }, mv: '4' };
  const { data } = parseFrontmatter(dumpFrontmatter(dane));
  assert.deepEqual(data, dane);
});

test('komentarze pełnolinijkowe są ignorowane', () => {
  const { data } = parseFrontmatter('---\n# komentarz\na: 1\n---\n');
  assert.equal(data.a, 1);
  assert.equal(Object.keys(data).length, 1);
});
