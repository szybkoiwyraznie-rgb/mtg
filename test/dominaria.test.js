/**
 * Dominaria (krok 3): prawdziwy map.json renderuje pełny stos LOD —
 * złota scena T1 z kafelkami L1 + nakładka L2 z bbox kalibracji M1↔D1.
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

test('Dominaria: nakładka L2 Domeny z bbox kalibracji M1↔D1', () => {
  zPrawdziwaMapa(() => {
    const html = renderMape('dominaria', {});
    assert.ok(html.includes('data-l2="domeny"'), 'nakładka L2 w złotej scenie');
    assert.ok(html.includes('data-prog="6"'), 'próg S2');
    assert.ok(html.includes('data-bbox="0.02,0.15,0.355,0.61"'), 'bbox kalibracji');
    assert.ok(html.includes('left:2.000%;top:15.000%;width:33.500%;height:46.000%'), 'pozycja nakładki');
    assert.ok(html.includes('data-src="dominaria/aerona.jpg"'), 'leniwy src pokrycia D1');
    assert.ok(!html.includes('data-epoka-przelacz'), 'nakładka poza przełącznikiem epok');
  });
});

test('Dominaria: ?epoka=domeny dopasowuje widok do regionu', () => {
  zPrawdziwaMapa(() => {
    const html = renderMape('dominaria', { epoka: 'domeny' });
    assert.ok(html.includes('data-region="domeny"'), 'deep-link regionu L2');
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
