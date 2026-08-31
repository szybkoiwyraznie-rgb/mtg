/**
 * Integralność: wszystkie wikilinki w bazie muszą się rozwiązywać
 * (ADR 0005 — martwy link to czerwony test, nie czerwona kropka na stronie).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wczytajStrony } from '../tools/content-loader.mjs';
import { zbudujRejestr } from '../src/codex/registry.js';
import { parseWikilinks } from '../src/codex/links.js';

const strony = wczytajStrony().filter((s) => !s.problem);
const { bySlug } = zbudujRejestr(strony);

test('każdy wikilink rozwiązuje się do istniejącej strony', () => {
  const martwe = [];
  for (const s of strony) {
    for (const l of parseWikilinks(s.body ?? '')) {
      if (!bySlug.has(l.slug)) martwe.push(`${s.plik ?? s.slug}: [[${l.slug}]]`);
    }
  }
  assert.deepEqual(martwe, [], `Martwe wikilinki:\n${martwe.join('\n')}`);
});

test('żadna strona nie linkuje do siebie samej', () => {
  const petle = [];
  for (const s of strony) {
    for (const l of parseWikilinks(s.body ?? '')) {
      if (l.slug === s.slug) petle.push(s.slug);
    }
  }
  assert.deepEqual(petle, []);
});
