/**
 * ADR 0042: Głos Kronikarza — narracja wpisu karty (od pierwszej
 * sekcji do „Mechanika jako Opowieść” włącznie) jest 100% osadzona
 * w świecie; pisze ją niezależny kronikarz, który nie zna pojęć
 * procesu (karta, Fabuła-dokument, Kodeks-produkt, Scryfall…).
 *   (a) terminy meta zabronione w CIALE sekcji narracyjnych
 *       (fragment przed „## Mechanika”, bez nagłówków — nagłówki
 *       są wyznaczone szkieletem ADR 0016/0030, m.in. „Nazwa Karty”);
 *       sekcja „Na Mapie” — ta sama lista (Pinezka/Pewność
 *       miejsca/deep-link są dozwolone, więc nie są na liście);
 *   (b) regresja 40USG — frazy, które wywołały ADR 0042, muszą
 *       zniknąć z narracji Expunge.
 * Zastępcza leksyka (ADR 0042 §4): scena/ryt/zapis, inskrypcja,
 * kronika, mechanika rytu, fakt świata.
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

/** Terminy meta (ADR 0042 §2). Lepszy fałszywy alarm niż dryf. */
const TERMINY_META = [
  { wzor: /\bkarta\b/i, nazwa: '„karta” (sens MtG)' },
  { wzor: /\bkarty\b/i, nazwa: '„karty”' },
  { wzor: /\bkartę\b/i, nazwa: '„kartę”' },
  { wzor: /\bkarcie\b/i, nazwa: '„karcie”' },
  { wzor: /\bkartach\b/i, nazwa: '„kartach”' },
  { wzor: /\bkartami\b/i, nazwa: '„kartami”' },
  { wzor: /\bkart\b/i, nazwa: '„kart”' },
  { wzor: /\bfabuła\b/i, nazwa: '„Fabuła” (dokument dostawy)' },
  { wzor: /\bfabuły\b/i, nazwa: '„fabuły”' },
  { wzor: /\bfabule\b/i, nazwa: '„fabule”' },
  { wzor: /\bfabułą\b/i, nazwa: '„fabułą”' },
  { wzor: /\bkodeks/i, nazwa: '„Kodeks” (produkt)' },
  { wzor: /scryfall/i, nazwa: '„Scryfall”' },
  { wzor: /\boracle\b/i, nazwa: '„oracle”' },
  { wzor: /\bprint/i, nazwa: '„print”' },
  { wzor: /flavor/i, nazwa: '„flavor” (termin)' },
  { wzor: /snapshot/i, nazwa: '„snapshot”' },
  { wzor: /\bkolekcj/i, nazwa: '„kolekcja” (produkt projektu)' },
  { wzor: /\bdostaw/i, nazwa: '„dostawa”' },
  { wzor: /\bkanon/i, nazwa: '„kanon” (kanon projektu)' },
  { wzor: /epok[ai]\s+karty/i, nazwa: '„epoka(‑) karty”' },
  { wzor: /brak\s+pola/i, nazwa: '„brak pola …”' },
  { wzor: /most jest krótki|krótki most/i, nazwa: 'idiom mostu' },
  { wzor: /\bmtg\b/i, nazwa: '„MtG”' },
  { wzor: /\bmagic\b/i, nazwa: '„magic”' },
  { wzor: /\bwydruk/i, nazwa: '„wydruk”' },
  {
    wzor: /reguła karty|reguły karty|zapisuje reguła|reguła zapisuje|reguła dopisuje|reguła domyka/i,
    nazwa: 'frazy „reguła karty”',
  },
];

/** Ciało sekcji narracyjnych: po frontmatterze, do „## Mechanika”. */
function narracja(md) {
  const m = md.match(/^---\n[\s\S]*?\n---\n?/);
  let tresc = m ? md.slice(m[0].length) : md;
  const i = tresc.search(/^##\s+Mechanika/m);
  if (i >= 0) tresc = tresc.slice(0, i);
  return tresc;
}

test('ADR 0042: narracja kart 100% w świecie (Głos Kronikarza)', () => {
  assert.ok(pliki.length >= 11, `oczekiwano ≥11 kart, jest ${pliki.length}`);
  const problemy = [];
  for (const f of pliki) {
    const slug = f.slice(0, -3);
    const md = fs.readFileSync(path.join(katalog, f), 'utf8');
    const ciało = narracja(md);
    ciało.split('\n').forEach((linia, i) => {
      if (/^#{1,6}\s/.test(linia)) return; // nagłówki = szkielet (ADR 0016/0030)
      for (const { wzor, nazwa } of TERMINY_META) {
        if (wzor.test(linia)) {
          problemy.push(
            `${slug} (linia ${i + 1} narracji): ${nazwa}: ${linia.trim().slice(0, 90)}`,
          );
        }
      }
    });
  }
  assert.deepEqual(
    problemy,
    [],
    'terminy meta w narracji kart (ADR 0042 — Głos Kronikarza):\n' + problemy.join('\n'),
  );
});

test('ADR 0042: regresja 40USG — frazy z narracji Expunge przed ADR', () => {
  const plik = path.join(katalog, '40usg-expunge.md');
  assert.ok(fs.existsSync(plik), 'brak 40usg-expunge.md w katalogu');
  const ciało = narracja(fs.readFileSync(plik, 'utf8'));
  const frazy = [
    /brak pola flavor/i,
    /w\s+epok[ei] karty/i,
    /zapisuje reguła/i,
    /odczytem Kodex/i,
    /most jest krótki/i,
  ];
  for (const wzor of frazy) {
    assert.ok(!wzor.test(ciało), `40USG: nadal w narracji wzorzec ${wzor}`);
  }
});
