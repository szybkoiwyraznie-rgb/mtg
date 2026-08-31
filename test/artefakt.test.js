/**
 * Test artefaktu: build produkuje kompletny jednoplikowy HTML (ADR 0001).
 * Wywołuje zbuduj() wprost (bez podprocesu) na realnej bazie repo.
 */
import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zbuduj } from '../tools/build.mjs';

test('build bazy repozytorium produkuję artefakt z danymi i kodem', async () => {
  const cel = await zbuduj({ out: 'dist/test-artefakt.html' });
  const html = fs.readFileSync(cel, 'utf8');

  // szkielet + wstrzyknięcia
  assert.ok(html.includes('id="app"'), 'brak kontenera aplikacji');
  assert.ok(html.includes('var CODEX_DATA'), 'brak danych CODEX_DATA');
  assert.ok(html.includes('uruchomRouter'), 'brak kodu silnika');
  assert.ok(!html.includes('<!--BUNDLE-->'), 'znacznik bundla niesubstituowany');
  assert.ok(!html.includes('<!--STYL-->'), 'znacznik stylu niesubstituowany');

  // dane: pusta baza ma statystyki zerowe i pustą strukturę
  const m = html.match(/var CODEX_DATA = (\{[\s\S]*?\});\n\n\/\/ =====/);
  assert.ok(m, 'CODEX_DATA nierozpoznawalne');
  const dane = JSON.parse(m[1]);
  assert.deepEqual(dane.statystyki, { karty: 0, hasla: 0, plany: 0 });
  assert.ok(typeof dane.coNowegoHtml === 'string');

  // składnia wstrzykniętego JS jest poprawna (node --check)
  const js = html.match(/<script>\n([\s\S]*?)\n<\/script>/)[1];
  const { checkSkładni } = await import('./pomocnicze.mjs');
  await checkSkładni(js);

  fs.rmSync(cel, { force: true });
});
