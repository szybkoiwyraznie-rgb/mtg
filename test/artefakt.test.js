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
  assert.ok(html.includes('globalThis.CODEX_DATA'), 'brak danych CODEX_DATA');
  assert.ok(html.includes('uruchomRouter'), 'brak kodu silnika');
  assert.ok(!html.includes('<!--BUNDLE-->'), 'znacznik bundla niesubstituowany');
  assert.ok(!html.includes('<!--STYL-->'), 'znacznik stylu niesubstituowany');

  // dane: statystyki zgodne z liczbą stron danego typu; mapy z podkładami
  const m = html.match(/globalThis\.CODEX_DATA = (\{[\s\S]*?\});\n\n\/\/ =====/);
  assert.ok(m, 'CODEX_DATA nierozpoznawalne');
  const dane = JSON.parse(m[1]);
  const naliczone = { karty: 0, hasla: 0, plany: 0 };
  const KLUCZE = { karta: 'karty', haslo: 'hasla', plan: 'plany' };
  for (const s of Object.values(dane.strony)) naliczone[KLUCZE[s.typ]]++;
  assert.deepEqual(dane.statystyki, naliczone, 'statystyki niezgodne ze stronami');
  assert.ok(typeof dane.coNowegoHtml === 'string');
  for (const [slug, mapa] of Object.entries(dane.mapy ?? {})) {
    if (mapa.problem) continue;
    // ADR 0027: podkład jako osobny plik (podkladUrl) — base64 tylko
    // w trybie awaryjnym `inline` (rewizja jednoplikowości ADR 0009).
    assert.ok(
      mapa.podkladData?.startsWith('data:') || /^maps\//.test(mapa.podkladUrl ?? ''),
      `mapa ${slug}: brak podkładu (ani podkladUrl, ani base64 — ADR 0027)`,
    );
    assert.ok(Array.isArray(mapa.pinezki), `mapa ${slug}: brak tablicy pinezek`);
  }

  // składnia wstrzykniętego JS jest poprawna (node --check)
  const js = html.match(/<script>\n([\s\S]*?)\n<\/script>/)[1];
  const { checkSkładni } = await import('./pomocnicze.mjs');
  await checkSkładni(js);

  fs.rmSync(cel, { force: true });
});

test('pakiet dystrybucyjny: artefakt + drzewo map + ZIP (ADR 0027 v2)', async () => {
  // katalog tymczasowy — dist/ zostaje nietknięte
  const { zbudujPakiet } = await import('../tools/build.mjs');
  const wynik = await zbudujPakiet({ katalog: '/tmp/codex-test-pakiet' });
  const index = fs.readFileSync(wynik.index, 'utf8');
  const glowny = fs.readFileSync(wynik.glowny, 'utf8');
  assert.equal(index, glowny, 'index.html ma być kopią artefaktu głównego');
  assert.ok(index.includes('CODEX_DATA'), 'index.html ma być aplikacją');
  assert.ok(index.includes('"stronaMapy": "maps/'), 'rejestr map ze stronami maps/<plan>.html');
  assert.ok(!index.includes('data:image/svg+xml;base64'), 'artefakt bez base64 podkładów');
  assert.ok(fs.existsSync('/tmp/codex-test-pakiet/maps/srodziemie.html'), 'pakiet: strona mapy Śródziemia');
  assert.ok(fs.existsSync('/tmp/codex-test-pakiet/maps/zendikar.html'), 'pakiet: strona mapy Zendikaru');
  assert.ok(fs.existsSync('/tmp/codex-test-pakiet/maps/srodziemie/podklad.svg'), 'pakiet: surowy podkład (mini-mapy)');
  assert.ok(fs.existsSync(wynik.zip), 'pakiet: ZIP z całym drzewem');
  assert.ok(fs.statSync(wynik.zip).size > 4 * 1024 * 1024, 'ZIP ma zawierać drzewo map (nie sam artefakt)');
  fs.rmSync('/tmp/codex-test-pakiet', { recursive: true, force: true });
});
