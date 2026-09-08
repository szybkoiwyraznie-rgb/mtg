/**
 * ADR 0040: oryginalny druk karty nie jest kanoniczny — zero nawiązań
 * i wniosków z printu w treści kart. (L12: reguła recenzyjna trafia do
 * walidatora, z testem na WSZYSTKICH kartach.)
 *   (a) „ilustracj*” zabronione poza liniami o FOT/KON (ilustracje
 *       właściciela — jedyne kanoniczne);
 *   (b) „wignett*” zabronione;
 *   (c) nazwisko artysty ze snapshotu (token ≥4 znaki, granice słów)
 *       zabronione w treści — dane wydruku żyją tylko w infoboksie.
 */
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const katalog = 'content/cards';
const katalogSnap = 'scryfall';
const pliki = fs
  .readdirSync(katalog)
  .filter((f) => f.endsWith('.md'))
  .filter((f) => fs.existsSync(path.join(katalogSnap, f.slice(0, -3) + '.json')));

function bezFrontmatter(md) {
  const m = md.match(/^---\n[\s\S]*?\n---\n?/);
  return m ? md.slice(m[0].length) : md;
}

function ucieczRe(frag) {
  return frag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

test('ADR 0040: Karty Katalogowe bez nawiązań do oryginalnego druku', () => {
  assert.ok(pliki.length >= 11, `oczekiwano ≥11 kart, jest ${pliki.length}`);
  const problemy = [];
  for (const f of pliki) {
    const slug = f.slice(0, -3);
    const md = fs.readFileSync(path.join(katalog, f), 'utf8');
    const tresc = bezFrontmatter(md);

    // (a) + (b) — zakazane słowa, linia po linii (wyjątek: FOT/KON)
    tresc.split('\n').forEach((linia, i) => {
      if (/ilustracj/i.test(linia) && !/\bFOT\b|\bKON\b/.test(linia)) {
        problemy.push(
          `${slug} (linia ${i + 1}): „ilustracj*” poza FOT/KON: ${linia.trim().slice(0, 90)}`,
        );
      }
      if (/wignett/i.test(linia)) {
        problemy.push(`${slug} (linia ${i + 1}): „wignett*”: ${linia.trim().slice(0, 90)}`);
      }
    });

    // (c) — nazwisko artysty ze snapshotu w treści
    const snap = JSON.parse(
      fs.readFileSync(path.join(katalogSnap, slug + '.json'), 'utf8'),
    );
    const artysta = (snap.artist ?? '').trim();
    if (artysta) {
      const kandydaci = [artysta, ...artysta.split(/\s+/).filter((t) => t.length >= 4)];
      for (const nazwa of new Set(kandydaci)) {
        const wzor = new RegExp(`\\b${ucieczRe(nazwa)}\\b`, 'i');
        if (wzor.test(tresc)) {
          problemy.push(`${slug}: nazwisko artysty ze snapshotu w treści: „${nazwa}”`);
        }
      }
    }
  }
  assert.deepEqual(
    problemy,
    [],
    'nawiązania do oryginalnego druku w treści kart (ADR 0040):\n' + problemy.join('\n'),
  );
});
