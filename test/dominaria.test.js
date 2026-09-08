/**
 * Dominaria: prawdziwy map.json renderuje stos LOD — złota scena T1
 * z kafelkami L1. Nakładka L2 „Domeny" usunięta decyzją właściciela
 * 2026-09-08 (ADR 0041: wycinek bazy bez nowego detalu) — tu regresja
 * negatywna; mechanizm L2 w silniku testowany w lod.test.js.
 */
import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderMape } from '../src/codex/render-map.js';
import { wczytajMapy } from '../tools/content-loader.mjs';

const mapa = wczytajMapy().get('dominaria');

function zPrawdziwaMapa(fn) {
  assert.ok(mapa && !mapa.problem, 'brak maps/dominaria/map.json');
  const poprzednie = globalThis.CODEX_DATA;
  globalThis.CODEX_DATA = { strony: {}, mapy: { dominaria: mapa } };
  try { return fn(); } finally {
    if (poprzednie === undefined) delete globalThis.CODEX_DATA;
    else globalThis.CODEX_DATA = poprzednie;
  }
}

test('Dominaria: złoty wariant T1 niesie warstwę kafli L1 (16×11×512)', () => {
  zPrawdziwaMapa(() => {
    const html = renderMape('dominaria', {});
    assert.ok(html.includes('data-kafle'), 'warstwa kafli L1');
    assert.ok(html.includes('data-baza="dominaria/kafle/k"'), 'baza URL-i kafelków');
    assert.ok(html.includes('data-kolumny="16"'), 'kolumny siatki');
    assert.ok(html.includes('data-wiersze="11"'), 'wiersze siatki');
    assert.ok(html.includes('data-rozmiar="512"'), 'rozmiar kafelka');
    assert.ok(html.includes('data-prog="2.5"'), 'próg S1');
    assert.ok(html.includes('data-master-w="8100"'), 'szerokość mastera');
    assert.ok(html.includes('data-master-h="5200"'), 'wysokość mastera');
    assert.ok(html.includes('data-kmax="22"'), 'głębszy zoom dla map LOD');
  });
});

test('Dominaria: brak nakładki L2 (ADR 0041) — mapa to L0 + kafle L1', () => {
  zPrawdziwaMapa(() => {
    const html = renderMape('dominaria', {});
    assert.ok(!html.includes('data-l2'), 'brak nakładki L2 (wycinek bazy zabroniony)');
    assert.ok(!html.includes('aerona.jpg'), 'brak pokrycia D1 w scenie');
    assert.equal(mapa.warianty.length, 1, 'jeden wariant (t1)');
    assert.ok(!mapa.warianty[0].bbox, 'brak bbox kalibracji');
    assert.ok(!fs.existsSync('maps/dominaria/aerona.jpg'), 'aerona.jpg usunięte z repo');
  });
});

test('Dominaria: ?epoka=domeny ignorowane (wariant nie istnieje)', () => {
  zPrawdziwaMapa(() => {
    const html = renderMape('dominaria', { epoka: 'domeny' });
    assert.ok(!html.includes('data-region='), 'brak deep-linku regionu L2');
    assert.ok(!html.includes('data-l2'), 'brak nakładki mimo ?epoka=');
  });
});

test('Dominaria: manifest kafli zgodny z map.json i plikami', () => {
  assert.ok(mapa && !mapa.problem, 'brak maps/dominaria/map.json');
  const manifest = JSON.parse(fs.readFileSync('maps/dominaria/manifest.json', 'utf8'));
  const t1 = mapa.warianty.find((w) => w.domyslny);
  assert.equal(manifest.kolumny, t1.kafle.kolumny);
  assert.equal(manifest.wiersze, t1.kafle.wiersze);
  assert.equal(manifest.rozmiar, t1.kafle.rozmiar);
  const pliki = fs.readdirSync('maps/dominaria/kafle').filter((f) => /^k\d{3}\.jpg$/.test(f));
  assert.equal(pliki.length, 176);
});
