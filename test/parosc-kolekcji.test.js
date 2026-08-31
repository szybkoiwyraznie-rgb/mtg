/**
 * Integralność: pętla jawnego przekazywania (ADR 0003).
 * Każdy wpis kolekcji ma DOKŁADNIE jedną Kartę Katalogową i odwrotnie —
 * materializacja bez dostawy jest mechanicznie niemożliwa.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wczytajStrony, wczytajKolekcje } from '../tools/content-loader.mjs';

const strony = wczytajStrony().filter((s) => !s.problem);
const karty = strony.filter((s) => s.typ === 'karta');
const kolekcja = wczytajKolekcje();

test('każda karta ma wpis kolekcji o tym samym slugu', () => {
  const bezWpisu = karty.filter((k) => !kolekcja.has(k.slug)).map((k) => k.slug);
  assert.deepEqual(bezWpisu, [], `Karty bez wpisu kolekcji (ADR 0003):\n${bezWpisu.join('\n')}`);
});

test('każdy wpis kolekcji ma swoją Kartę Katalogową (zamknięta pętla)', () => {
  const bezKarty = [...kolekcja.keys()].filter((slug) => !karty.some((k) => k.slug === slug));
  assert.deepEqual(bezKarty, [], `Wpisy bez strony karty:\n${bezKarty.join('\n')}`);
});

test('wpis kolekcji ma komplet pól dostawy (ADR 0011)', () => {
  const braki = [];
  for (const [slug, w] of kolekcja) {
    // Chudy format dostawy (ADR 0011): cztery pola + data. Prompt/Narracja
    // nie są wymagane — występują tylko w archiwalnych wpisach sprzed ADR 0011.
    for (const pole of ['imgId', 'nazwa', 'wydanie', 'plan', 'dostarczono']) {
      if (!w.fm[pole]) braki.push(`${slug}: brak pola ${pole} we frontmatterze`);
    }
  }
  assert.deepEqual(braki, [], `Niekompletne wpisy:\n${braki.join('\n')}`);
});

test('imgId wpisu zgadza się z imgId karty (spójność kanonu)', () => {
  const rozjazdy = [];
  for (const k of karty) {
    const w = kolekcja.get(k.slug);
    if (w && w.fm.imgId !== k.imgId) rozjazdy.push(`${k.slug}: karta ${k.imgId} vs wpis ${w.fm.imgId}`);
  }
  assert.deepEqual(rozjazdy, []);
});
