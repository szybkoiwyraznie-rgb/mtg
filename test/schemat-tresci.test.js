/**
 * Integralność: schemat treści całego repozytorium (content/).
 * Na pustej bazie przechodzi; pierwsza treść musi być poprawna od commita.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wczytajStrony, wczytajTaxonomie } from '../tools/content-loader.mjs';
import { walidujStrone, zbudujRejestr } from '../src/codex/registry.js';

const strony = wczytajStrony();
const taxonomia = wczytajTaxonomie();

test('wszystkie strony przechodzą walidację schematu', () => {
  const ctx = {
    taxonomia,
    plany: new Set(strony.filter((s) => s.typ === 'plan').map((s) => s.slug)),
  };
  const problemy = strony.flatMap((s) => (s.problem ? [s.problem] : walidujStrone(s, ctx)));
  assert.deepEqual(problemy, [], `Problemy schematu:\n${problemy.join('\n')}`);
});

test('slugi są unikalne w jednej przestrzeni nazw', () => {
  const { duplikaty } = zbudujRejestr(strony.filter((s) => !s.problem));
  assert.deepEqual(duplikaty, []);
});

test('karty istnieją tylko w planach, które mają stronę planu', () => {
  // pokryte przez walidację wyżej, ale wprost — czytelny komunikat awarii
  const plany = new Set(strony.filter((s) => s.typ === 'plan').map((s) => s.slug));
  const sieroty = strony.filter((s) => s.typ === 'karta' && !plany.has(s.plan));
  assert.deepEqual(sieroty.map((s) => s.slug), []);
});

test('co-nowego.md (jeśli istnieje) parsuje się jako markdown', async () => {
  const { wczytajCoNowego } = await import('../tools/content-loader.mjs');
  const md = wczytajCoNowego();
  if (md === null) return; // brak pliku = legalny stan (pusta baza)
  const { renderMarkdown } = await import('../src/codex/markdown.js');
  const { html } = renderMarkdown(md, { resolveLink: () => null });
  assert.ok(typeof html === 'string' && html.length >= 0);
});

test('co-nowego.md: każdy wpis wg konwencji „## RRRR-MM-DD HH:MM — tytuł" (ADR 0029)', async () => {
  const { wczytajCoNowego, parsujWpisyCoNowego } = await import('../tools/content-loader.mjs');
  const md = wczytajCoNowego();
  if (md === null) return;
  const naglowki = md.split(/\r?\n/).filter((l) => l.startsWith('## '));
  for (const l of naglowki) {
    assert.match(l, /^## \d{4}-\d{2}-\d{2} \d{2}:\d{2} — .+$/,
      `nagłówek wpisu bez daty+godziny publikacji: „${l.slice(0, 70)}"`);
  }
  const wpisy = parsujWpisyCoNowego(md);
  assert.equal(wpisy.length, naglowki.length, 'parser ma rozpoznać każdy nagłówek wpisu');
});

