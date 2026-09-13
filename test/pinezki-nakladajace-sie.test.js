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

test('zamknięty klaster aktywuje wyłącznie sama pinezka', () => {
  const css = fs.readFileSync('src/codex/style.css', 'utf8');
  assert.match(css, /\.mapa-klaster-pinezek\s*{[^}]*width:\s*0;\s*height:\s*0;[^}]*pointer-events:\s*none/s);
  assert.match(css, /\.mapa-klaster-pinezek\.otwarty::before[\s\S]*pointer-events:\s*auto/);
  assert.doesNotMatch(css, /\.mapa-klaster-pinezek:hover\s+\.mapa-pinezka/);
});

test('wspólna kotwica spoczywa jako jedna pinezka i ma pełne menu radialne', () => {
  for (const slug of plany) {
    const m = mapa(slug);
    globalThis.CODEX_DATA = { mapy: { [slug]: m }, strony: Object.fromEntries(m.pinezki.map((p) => [p.karta, { tytul: p.karta }])) };
    const html = renderMape(slug, {}, { osadzona: true });
    assert.equal([...html.matchAll(/data-pinezka="/g)].length, m.pinezki.length, `render zgubił pinezki: ${slug}`);
    const grupy = new Map();
    for (const p of m.pinezki) {
      const punkt = `${p.x}:${p.y}`;
      grupy.set(punkt, [...(grupy.get(punkt) ?? []), p]);
    }
    for (const grupa of grupy.values()) {
      if (grupa.length < 2) continue;
      assert.match(html, new RegExp(`data-pinezka-klaster="${grupa.length}"\\s+data-x="${grupa[0].x}" data-y="${grupa[0].y}"`), `brak klastra w punkcie źródłowym: ${slug}`);
      const offsety = grupa.map((p) => html.match(new RegExp(`data-pinezka="${p.karta}"[^>]*--klaster-x:([^;]+);--klaster-y:([^;]+)`))?.slice(1).join(':'));
      assert.equal(new Set(offsety).size, grupa.length, `menu nie rozsuwa wszystkich kart: ${slug}`);
      assert.ok(offsety.every(Boolean), `brak przesunięcia hover: ${slug}`);
    }
  }
  delete globalThis.CODEX_DATA;
});
