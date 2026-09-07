/** ADR 0036 / L8: numeracja właściciela nigdy nie pochodzi ze Scryfalla. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderKarte } from '../src/codex/render-card.js';

for (const [imgId, numerDruku] of [['605SHM', '32'], ['275FIN', '5'], ['2BFZ', '74']]) {
  test(`FOT/KON: ${imgId} pozostaje kluczem niezależnym od numeru wydruku`, () => {
    const poprzednie = globalThis.CODEX_DATA;
    const slug = `${imgId.toLowerCase()}-test`;
    const karta = { typ: 'karta', slug, imgId, tytul: 'Karta testowa', nazwa: 'Karta testowa',
      wydanie: 'TST', plan: 'test', kolory: ['U'], tagi: [],
      html: '<h2>Kronika Lore</h2><p>Scena.</p><h2>Nazwa Karty</h2><p>Nazwa.</p>',
      scryfall: { name: 'Karta testowa', set: 'tst', set_name: 'Test', collector_number: numerDruku,
        type_line: 'Instant', rarity: 'common', artist: 'Autor' } };
    globalThis.CODEX_DATA = { strony: { [slug]: karta }, backlinki: {}, mapy: {} };
    try {
      const numerKolekcji = imgId.match(/^\d+/)[0];
      for (const zewnetrznyNumer of [numerDruku, '9999']) {
        karta.scryfall.collector_number = zewnetrznyNumer;
        const html = renderKarte(slug);
        assert.ok(html.includes(`<p class="meta">${imgId} ·`), 'nagłówek musi pokazywać imgId właściciela');
        for (const tor of ['FOT', 'KON']) {
          assert.ok(html.includes(`./img/${numerKolekcji}${tor}.png|./img/${imgId}${tor}.png`));
          assert.ok(!html.includes(`./img/${zewnetrznyNumer}${tor}.png`), 'numer wydruku nie jest kluczem ilustracji');
        }
        assert.equal(karta.imgId, imgId);
        assert.equal(karta.slug, slug);
      }
    } finally {
      if (poprzednie === undefined) delete globalThis.CODEX_DATA;
      else globalThis.CODEX_DATA = poprzednie;
    }
  });
}
