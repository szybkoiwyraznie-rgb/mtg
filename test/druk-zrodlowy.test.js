/**
 * ADR 0040: oryginalny druk karty nie jest kanoniczny — zero nawiązań
 * i wniosków z printu w treści kart. (L12: reguła recenzyjna trafia do
 * walidatora, z testem na WSZYSTKICH kartach.)
 *   (a) „ilustracj*” zabronione poza liniami o FOT/KON (ilustracje
 *       właściciela — jedyne kanoniczne);
 *   (b) „wignett*” zabronione;
 *   (c) nazwisko artysty ze snapshotu (token ≥4 znaki, granice słów)
 *       zabronione w treści — dane wydruku żyją tylko w infoboksie;
 *   (d) watermark / znak wodny zabroniony we wszystkich widocznych
 *       treściach i notkach map.
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

function plikiRekurencyjnie(katalog, nazwa) {
  if (!fs.existsSync(katalog)) return [];
  const wynik = [];
  for (const wpis of fs.readdirSync(katalog, { withFileTypes: true })) {
    const pelna = path.join(katalog, wpis.name);
    if (wpis.isDirectory()) wynik.push(...plikiRekurencyjnie(pelna, nazwa));
    else if (nazwa(wpis.name)) wynik.push(pelna);
  }
  return wynik;
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

test('ADR 0040: watermark nie występuje w widocznej treści ani notkach map', () => {
  const sciezki = [
    ...plikiRekurencyjnie('content/cards', (nazwa) => nazwa.endsWith('.md')),
    ...plikiRekurencyjnie('content/lore', (nazwa) => nazwa.endsWith('.md')),
    ...plikiRekurencyjnie('content/planes', (nazwa) => nazwa.endsWith('.md')),
    ...plikiRekurencyjnie('maps', (nazwa) => nazwa === 'map.json'),
    'content/co-nowego.md',
  ];
  const problemy = [];
  for (const sciezka of sciezki) {
    const tresc = fs.readFileSync(sciezka, 'utf8');
    tresc.split('\n').forEach((linia, i) => {
      if (/\bwatermark\b|znak\S*\s+wodn/iu.test(linia)) {
        problemy.push(`${sciezka}:${i + 1}: ${linia.trim().slice(0, 110)}`);
      }
    });
  }
  assert.deepEqual(
    problemy,
    [],
    'watermark/znak wodny w widocznej treści (ADR 0040):\n' + problemy.join('\n'),
  );
});
