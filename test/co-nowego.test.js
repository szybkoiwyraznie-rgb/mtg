/**
 * „Co nowego" + metadane czasu (ADR 0029):
 *  - parser dziennika (konwencja „## RRRR-MM-DD HH:MM — tytuł", tolerancja
 *    starego formatu bez godziny);
 *  - widoki: limit 5 wpisów + archiwum miesiącami, widok miesiąca;
 *  - strona główna: zwięzła lista 5 najnowszych;
 *  - stopka czasu stron (utworzono / ostatnia aktualizacja).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsujWpisyCoNowego } from '../tools/content-loader.mjs';
import { renderCoNowego, LIMIT_WPISOW } from '../src/codex/render-whatsnew.js';
import { renderGlowna } from '../src/codex/render-home.js';
import { stopkaCzasu, nazwaMiesiaca } from '../src/codex/render.js';

// ── parser ───────────────────────────────────────────────────────────

test('parsujWpisyCoNowego: nowy format z godziną + lead pomijany', () => {
  const md = [
    'Lead pliku (nie wpis).',
    '',
    '## 2026-09-02 18:42 — Tytuł pierwszy',
    '',
    'Treść A.',
    '',
    '## 2026-08-31 20:38 — Tytuł drugi',
    'Treść B.',
  ].join('\n');
  const wpisy = parsujWpisyCoNowego(md);
  assert.equal(wpisy.length, 2);
  assert.deepEqual(
    wpisy.map((w) => [w.data, w.godzina, w.miesiac, w.tytul]),
    [
      ['2026-09-02', '18:42', '2026-09', 'Tytuł pierwszy'],
      ['2026-08-31', '20:38', '2026-08', 'Tytuł drugi'],
    ],
  );
  assert.equal(wpisy[0].cialo, 'Treść A.');
  assert.equal(wpisy[1].cialo, 'Treść B.');
});

test('parsujWpisyCoNowego: stary format bez godziny → godzina null', () => {
  const wpisy = parsujWpisyCoNowego('## 2026-08-31 — Bez godziny\nTreść.');
  assert.equal(wpisy.length, 1);
  assert.equal(wpisy[0].godzina, null);
  assert.equal(wpisy[0].tytul, 'Bez godziny');
});

test('parsujWpisyCoNowego: pusta zawartość → pusta lista', () => {
  assert.deepEqual(parsujWpisyCoNowego(null), []);
  assert.deepEqual(parsujWpisyCoNowego(''), []);
});

// ── widoki (fałszywe CODEX_DATA) ─────────────────────────────────────

function zCodexData(dane, fn) {
  const poprzednie = globalThis.CODEX_DATA;
  globalThis.CODEX_DATA = dane;
  try { return fn(); } finally { globalThis.CODEX_DATA = poprzednie; }
}

function fikcyjneDane() {
  // 7 wpisów w dwóch miesiącach (5 × 2026-09, 2 × 2026-08), najnowsze pierwsze
  const coNowego = [
    { data: '2026-09-05', godzina: '10:00', miesiac: '2026-09', tytul: 'Wpis G', html: '<p>g</p>' },
    { data: '2026-09-04', godzina: '10:00', miesiac: '2026-09', tytul: 'Wpis F', html: '<p>f</p>' },
    { data: '2026-09-03', godzina: '10:00', miesiac: '2026-09', tytul: 'Wpis E', html: '<p>e</p>' },
    { data: '2026-09-02', godzina: '10:00', miesiac: '2026-09', tytul: 'Wpis D', html: '<p>d</p>' },
    { data: '2026-09-01', godzina: '10:00', miesiac: '2026-09', tytul: 'Wpis C', html: '<p>c</p>' },
    { data: '2026-08-31', godzina: '20:38', miesiac: '2026-08', tytul: 'Wpis B', html: '<p>b</p>' },
    { data: '2026-08-30', godzina: '09:00', miesiac: '2026-08', tytul: 'Wpis A', html: '<p>a</p>' },
  ];
  return {
    zbudowano: '2026-09-02 20:00', strony: {}, plany: [], tagi: {}, backlinki: {},
    coNowego, statystyki: { karty: 0, hasla: 0, plany: 0 },
  };
}

test('renderCoNowego: limit 5 wpisów + archiwum miesiącami', () => {
  zCodexData(fikcyjneDane(), () => {
    const html = renderCoNowego(null);
    for (const t of ['Wpis G', 'Wpis F', 'Wpis E', 'Wpis D', 'Wpis C']) {
      assert.ok(html.includes(t), `najnowszy wpis widoczny: ${t}`);
    }
    assert.ok(!html.includes('Wpis B'), 'szósty wpis NIE renderuje się na stronie głównej dziennika');
    assert.ok(html.includes('opublikowano 2026-09-05 · 10:00'), 'wpis z datą i godziną publikacji');
    assert.ok(html.includes('#/co-nowego/2026-09') && html.includes('#/co-nowego/2026-08'), 'linki archiwum miesiącami');
    assert.ok(html.includes('wrzesień 2026') && html.includes('sierpień 2026'), 'polskie nazwy miesięcy');
    assert.ok(html.includes('5 wpisów') && html.includes('2 wpisy'), 'liczniki wpisów w archiwum');
    assert.equal(LIMIT_WPISOW, 5);
  });
});

test('renderCoNowego: widok miesiąca filtruje wpisy; zły param → nie znaleziono', () => {
  zCodexData(fikcyjneDane(), () => {
    const html = renderCoNowego('2026-08');
    assert.ok(html.includes('Wpis B') && html.includes('Wpis A'), 'wpisy miesiąca widoczne');
    assert.ok(!html.includes('Wpis G'), 'wpisy innych miesięcy niewidoczne');
    assert.ok(html.includes('sierpień 2026'), 'nagłówek z nazwą miesiąca');
    assert.ok(renderCoNowego('zle-dane').includes('Nie znaleziono'));
    assert.ok(renderCoNowego('1999-01').includes('Nie znaleziono'));
  });
});

test('strona główna: zwięzła lista 5 najnowszych wpisów (bez treści)', () => {
  zCodexData(fikcyjneDane(), () => {
    const html = renderGlowna();
    assert.ok(html.includes('Wpis G') && html.includes('Wpis C'), 'tytuły 5 najnowszych');
    assert.ok(!html.includes('Wpis B'), 'szósty wpis niewidoczny na SG');
    assert.ok(!html.includes('<p>g</p>'), 'SG bez pełnych treści wpisów');
    assert.ok(html.includes('2026-09-05') && html.includes('10:00'), 'data i godzina publikacji na SG');
    assert.ok(html.includes('Wszystkie wpisy i archiwum'), 'link do dziennika/archiwum');
  });
});

// ── stopka czasu ─────────────────────────────────────────────────────

test('stopkaCzasu: utworzono + aktualizacja; równe daty → samo utworzono; brak → pusto', () => {
  const pelna = stopkaCzasu({ utworzono: '2026-08-31 20:38', zaktualizowano: '2026-09-02 18:42' });
  assert.ok(pelna.includes('Utworzono 2026-08-31 20:38'));
  assert.ok(pelna.includes('ostatnia aktualizacja 2026-09-02 18:42'));
  const rowne = stopkaCzasu({ utworzono: '2026-09-02 18:42', zaktualizowano: '2026-09-02 18:42' });
  assert.ok(rowne.includes('Utworzono') && !rowne.includes('aktualizacja'));
  assert.equal(stopkaCzasu(null), '');
  assert.equal(stopkaCzasu({ utworzono: null, zaktualizowano: null }), '');
});

test('nazwaMiesiaca: klucz RRRR-MM → polska nazwa', () => {
  assert.equal(nazwaMiesiaca('2026-01'), 'styczeń 2026');
  assert.equal(nazwaMiesiaca('2026-12'), 'grudzień 2026');
  assert.equal(nazwaMiesiaca('zle'), 'zle');
});
