/**
 * Budżet lektury startowej (konwencja mtg-game): pozycje obowiązkowe
 * z AGENTS.md §0 mają się mieścić w 100 tys. tokenów, żeby nowa sesja
 * realnie przeczytała całość. Próg = ~4 znaki/token (heurystyka).
 */
import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const LIMIT_TOKENOW = 100_000;
const BAJTOW_NA_TOKEN = 4;

const lektura = [
  'AGENTS.md',
  ...fs.readdirSync('docs/decisions')
    .filter((f) => /^\d{4}-.*\.md$/.test(f))
    .sort()
    .map((f) => `docs/decisions/${f}`),
  'docs/LESSONS.md',
  'docs/setup/ENVIRONMENT.md',
];

test(`lektura startowa (${lektura.length} plików) mieści się w budżecie`, () => {
  const rozmiary = lektura.map((f) => {
    assert.ok(fs.existsSync(f), `brak pliku lektury: ${f}`);
    return { f, bajty: fs.statSync(f).size };
  });
  const tokeny = rozmiary.reduce((s, r) => s + r.bajty, 0) / BAJTOW_NA_TOKEN;
  const raport = rozmiary.map((r) => `  ${r.f}: ${(r.bajty / BAJTOW_NA_TOKEN).toFixed(0)} tok`).join('\n');
  assert.ok(
    tokeny <= LIMIT_TOKENOW,
    `Budżet lektury przekroczony: ${tokeny.toFixed(0)} > ${LIMIT_TOKENOW} tokenów.\n${raport}\n` +
    'Przepisanie/rozdzielenie dokumentów staje się obowiązkowym zadaniem sesji.',
  );
});
