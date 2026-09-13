import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderMape } from '../src/codex/render-map.js';

const plany = fs.readdirSync('maps', { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join('maps', d.name, 'map.json')))
  .map((d) => d.name);

function mapa(slug) { return JSON.parse(fs.readFileSync(`maps/${slug}/map.json`, 'utf8')); }

function kartyPlanu(slug) {
  return fs.readdirSync('content/cards').filter((n) => {
    const tekst = fs.readFileSync(path.join('content/cards', n), 'utf8');
    return new RegExp(`^plan: ${slug}$`, 'm').test(tekst) && /^pinezka:\s*$/m.test(tekst);
  }).map((n) => n.replace(/\.md$/, '')).sort();
}

test('wszystkie plany mają po jednej pinezce na każdą kartę z deklaracją mapy', () => {
  for (const slug of plany) {
    const pinezki = mapa(slug).pinezki.map((p) => p.karta).sort();
    assert.deepEqual(pinezki, kartyPlanu(slug), `niespójne pinezki planu ${slug}`);
  }
});

test('pinezki współdzielące kotwicę dostają różne przesunięcia ekranowe', () => {
  for (const slug of plany) {
    const m = mapa(slug);
    globalThis.CODEX_DATA = { mapy: { [slug]: m }, strony: Object.fromEntries(m.pinezki.map((p) => [p.karta, { tytul: p.karta }])) };
    const html = renderMape(slug, {}, { osadzona: true });
    const znaczniki = [...html.matchAll(/data-pinezka="([^"]+)"[^>]*data-x="([^"]+)" data-y="([^"]+)"\s+data-offset-x="([^"]+)" data-offset-y="([^"]+)"/g)]
      .map((x) => ({ karta: x[1], punkt: `${x[2]}:${x[3]}`, offset: `${x[4]}:${x[5]}` }));
    assert.equal(znaczniki.length, m.pinezki.length, `render zgubił pinezki: ${slug}`);
    const grupy = new Map();
    for (const p of znaczniki) grupy.set(p.punkt, [...(grupy.get(p.punkt) ?? []), p]);
    for (const grupa of grupy.values()) {
      if (grupa.length > 1) assert.equal(new Set(grupa.map((p) => p.offset)).size, grupa.length, `nakładające się pinezki: ${slug}`);
    }
  }
  delete globalThis.CODEX_DATA;
});
