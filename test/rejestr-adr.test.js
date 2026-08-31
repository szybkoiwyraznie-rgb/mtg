/**
 * Integralność dokumentacji: rejestr ADR (spójność numerów, tytułów,
 * statusów i tabeli w README) — konwencja z mtg-game.
 */
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const katalog = 'docs/decisions';
const pliki = fs.readdirSync(katalog).filter((f) => /^\d{4}-.*\.md$/.test(f)).sort();
const readme = fs.readFileSync(path.join(katalog, 'README.md'), 'utf8');

const STATUSY = ['Proponowana', 'Zaakceptowana', 'Odrzucona', 'Zastąpiona', 'Częściowo zastąpiona', 'Wycofana'];

test('numeracja ADR jest ciągła od 0001', () => {
  const numery = pliki.map((f) => Number(f.slice(0, 4)));
  const oczekiwane = Array.from({ length: numery.length }, (_, i) => i + 1);
  assert.deepEqual(numery, oczekiwane, 'ADR-y mają luki lub duplikaty numerów');
});

test('każdy ADR ma status z listy dozwolonych i datę', () => {
  const problemy = [];
  for (const f of pliki) {
    const tresc = fs.readFileSync(path.join(katalog, f), 'utf8');
    const m = tresc.match(/\*\*Status:\*\*\s*([^\n—]+)/);
    if (!m) { problemy.push(`${f}: brak pola Status`); continue; }
    if (!STATUSY.includes(m[1].trim())) problemy.push(`${f}: status "${m[1].trim()}" poza listą`);
    if (!/\*\*Data:\*\*\s*\d{4}-\d{2}-\d{2}/.test(tresc)) problemy.push(`${f}: brak daty YYYY-MM-DD`);
  }
  assert.deepEqual(problemy, []);
});

test('tabela w README rejestruje każdy ADR z poprawnym linkiem', () => {
  const problemy = [];
  for (const f of pliki) {
    if (!readme.includes(`(${f})`)) problemy.push(`${f}: brak wpisu w tabeli README`);
  }
  // linki z README nie mogą wisieć w próżni
  for (const m of readme.matchAll(/\[(\d{4})\]\((\S+\.md)\)/g)) {
    if (!fs.existsSync(path.join(katalog, m[2]))) problemy.push(`README: link do nieistniejącego ${m[2]}`);
  }
  assert.deepEqual(problemy, [], `Problemy rejestru ADR:\n${problemy.join('\n')}`);
});

test('pliki konstytutywne istnieją (AGENTS.md wskazuje je w lekturze)', () => {
  for (const f of ['AGENTS.md', 'docs/LESSONS.md', 'docs/setup/ENVIRONMENT.md', 'README.md']) {
    assert.ok(fs.existsSync(f), `brak pliku ${f}`);
  }
});

test('gidy procesowe istnieją (AGENTS.md §2 odsyła do nich)', () => {
  for (const f of [
    'docs/guides/SZKIELET_KARTY.md', 'docs/guides/SZKIELET_HASLA.md',
    'docs/guides/PETLA_JAKOSCI.md', 'docs/guides/PROCES_MAP.md',
  ]) {
    assert.ok(fs.existsSync(f), `brak pliku ${f}`);
  }
});
