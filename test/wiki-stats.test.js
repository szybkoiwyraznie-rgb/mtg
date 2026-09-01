import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ocenStrone, raport, MAKS } from '../tools/wiki-stats.mjs';

/** Modelowa Karta Katalogowa — kompletna (10 sekcji, źródła, pinezka). */
const pelnaKarta = {
  typ: 'karta',
  slug: '1tst-testowy-zwiadowca',
  tytul: 'Testowy Zwiadowca',
  plan: 'testlandia',
  pinezka: { mapa: 'testlandia', pewnosc: 'region' },
  body: [
    '## Metryka i Kontekst Świata', 'Tekst.',
    '## Postacie i Byty', 'Tekst.',
    '## Nazwa Karty', 'Tekst.',
    '## Mechanika jako Opowieść', 'Tekst.',
    '## Flavor Text', 'Tekst.',
    '## Transpozycja', 'Tekst.',
    '## Na Mapie', 'Tekst.',
    '## Źródła', '- <https://example.com/a> — źródło A', '- <https://example.com/b> — źródło B',
    '## Podsumowanie Lore', 'Tekst.',
  ].join('\n'),
};

test('wiki-stats: kompletna karta osiąga wysoką punktację', () => {
  const s = ocenStrone(pelnaKarta);
  // sekcje 3/3 + źródła 2/2 + pinezka 2/2; brak tylko wikilinków (1/1)
  assert.equal(s.sekcje, 3);
  assert.equal(s.zrodla, 2);
  assert.equal(s.wikilinki, 0);
  assert.equal(s.pinezka, 2);
  assert.equal(s.suma, 7);
  assert.ok(s.suma <= MAKS);
});

test('wiki-stats: karta z wikilinkiem dostaje +1', () => {
  const kartaWiki = { ...pelnaKarta, body: pelnaKarta.body + '\n\n[[isengard|Isengard]]' };
  const s = ocenStrone(kartaWiki);
  assert.equal(s.wikilinki, 1);
  assert.equal(s.suma, 8);
});

test('wiki-stats: brak źródła i pinezki obniża wynik', () => {
  const ubogaKarta = {
    typ: 'karta',
    slug: '1tst-ubogi',
    tytul: 'Ubogi',
    plan: 'testlandia',
    body: [
      '## Metryka i Kontekst Świata', 'Tekst.',
      '## Postacie i Byty', 'Tekst.',
      '## Nazwa Karty', 'Tekst.',
      '## Mechanika jako Opowieść', 'Tekst.',
      '## Flavor Text', 'Tekst.',
      '## Transpozycja', 'Tekst.',
        '## Na Mapie', 'Tekst.',
      '## Źródła', '',
      '## Podsumowanie Lore', 'Tekst.',
    ].join('\n'),
  };
  const s = ocenStrone(ubogaKarta);
  assert.equal(s.zrodla, 0);
  assert.equal(s.pinezka, 0);
  assert.ok(s.suma < 6);
});

test('wiki-stats: raport sortuje od najsłabszej strony', () => {
  const r = raport([pelnaKarta, { ...pelnaKarta, slug: '1tst-slab', body: pelnaKarta.body.replace('## Źródła\n- <https://example.com/a> — źródło A\n- <https://example.com/b> — źródło B', '## Źródła\n') }]);
  assert.equal(r.strony[0].slug, '1tst-slab');
  assert.ok(r.strony.length === 2);
});

test('wiki-stats: wynik zawsze w granicach 0..MAKS i procent 0..100', () => {
  const s = ocenStrone({ typ: 'plan', slug: 'pusty', tytul: 'Pusty', body: '' });
  assert.ok(s.suma >= 0 && s.suma <= MAKS);
  assert.ok(s.procent >= 0 && s.procent <= 100);
});
