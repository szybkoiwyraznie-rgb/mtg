/**
 * Integralność: snapshoty Oracle (ADR 0004).
 * Każda karta ma kompletny snapshot scryfall/<slug>.json.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wczytajStrony, wczytajScryfall } from '../tools/content-loader.mjs';

const karty = wczytajStrony().filter((s) => !s.problem && s.typ === 'karta');
const snapshoty = wczytajScryfall();

const WYMAGANE = ['name', 'mana_cost', 'type_line', 'oracle_text', 'set', 'rarity', 'artist', 'image_uris'];

test('każda karta ma snapshot o własnym slugu', () => {
  const braki = karty.filter((k) => !snapshoty.has(k.slug)).map((k) => k.slug);
  assert.deepEqual(braki, [], `Karty bez snapshotu Scryfall (ADR 0004):\n${braki.join('\n')}`);
});

test('snapshoty mają komplet wymaganych pól + metadane pochodzenia', () => {
  const problemy = [];
  for (const [slug, snap] of snapshoty) {
    if (snap.problem) { problemy.push(`${slug}: ${snap.problem}`); continue; }
    for (const pole of WYMAGANE) {
      if (snap[pole] === undefined || snap[pole] === null) problemy.push(`${slug}: brak pola ${pole}`);
    }
    if (!snap.image_uris?.normal) problemy.push(`${slug}: brak image_uris.normal`);
    for (const pole of ['source', 'pobrano', 'slug']) {
      if (!snap[pole]) problemy.push(`${slug}: brak metadany ${pole}`);
    }
  }
  assert.deepEqual(problemy, [], `Niekompletne snapshoty:\n${problemy.join('\n')}`);
});

test('nazwa w snapshotcie zgadza się z nazwą karty (pomijając druk)', () => {
  const rozjazdy = [];
  for (const k of karty) {
    const snap = snapshoty.get(k.slug);
    if (snap && !snap.problem && snap.slug !== k.slug) {
      rozjazdy.push(`${k.slug}: slug snapshotu ${snap.slug}`);
    }
    if (snap && !snap.problem && String(snap.name).toLowerCase() !== String(k.nazwa).toLowerCase()) {
      rozjazdy.push(`${k.slug}: nazwa karty "${k.nazwa}" vs snapshot "${snap.name}"`);
    }
  }
  assert.deepEqual(rozjazdy, [], `Rozjazdy nazw:\n${rozjazdy.join('\n')}`);
});
