/**
 * Próg haseł (SZKIELET_HASLA.md): hasło powstaje dopiero, gdy ≥2 karty
 * odwołują się do encji w treści. Regresja: PR-27 utworzył
 * `wybrzeze-mieczy` przy 1 karcie + planie; właściciel 2026-09-09
 * nakazał skasowanie i twardą egzekucję progu testem.
 */
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const KAT_KART = 'content/cards';
const KAT_HAS = 'content/lore';

const karty = fs.readdirSync(KAT_KART)
  .filter((f) => f.endsWith('.md') && f !== 'README.md')
  .map((f) => ({
    slug: f.replace(/\.md$/, ''),
    tresc: fs.readFileSync(path.join(KAT_KART, f), 'utf8'),
  }));

const hasla = fs.readdirSync(KAT_HAS)
  .filter((f) => f.endsWith('.md') && f !== 'README.md')
  .map((f) => f.replace(/\.md$/, ''));

test('każde hasło ma ≥2 karty odwołujące się do niego w treści', () => {
  const ponizej = [];
  for (const h of hasla) {
    // Wikilink [[haslo|...]] lub [[haslo]] w treści karty (licznik od kart,
    // nie od planów ani tagów — decyzja właściciela 2026-08-31).
    const wzor = new RegExp(`\\[\\[${h}(\\||\\])`);
    const wspominaja = karty.filter((k) => wzor.test(k.tresc)).map((k) => k.slug);
    if (wspominaja.length < 2) ponizej.push(`${h} (karty: ${wspominaja.join(', ') || 'brak'})`);
  }
  assert.deepEqual(ponizej, [], `Hasła poniżej progu 2 kart: ${ponizej.join('; ')}`);
});
