import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mapa = JSON.parse(fs.readFileSync('maps/alara/map.json', 'utf8'));
const scena = JSON.parse(fs.readFileSync('maps/alara/scena.json', 'utf8'));
const svg = fs.readFileSync('maps/alara/podklad.svg', 'utf8');

const niepotwierdzonePoi = ['Carmot Mines', 'Ruins of Vithia'];

test('Alara: carmot i Vithia nie są udawanymi pojedynczymi POI', () => {
  const kotwice = mapa.kotwice.map((k) => k.nazwa);
  const etykiety = scena.etykiety.map((e) => e.tekst);
  for (const nazwa of niepotwierdzonePoi) {
    assert.ok(!kotwice.includes(nazwa), `nieoczekiwana kotwica: ${nazwa}`);
    assert.ok(!etykiety.includes(nazwa), `nieoczekiwana etykieta: ${nazwa}`);
    assert.ok(!svg.includes(`>${nazwa}</text>`), `nieoczekiwana etykieta SVG: ${nazwa}`);
  }
  assert.ok(!scena.poi.some((p) => ['carmot-mines', 'vithia'].includes(p.id)));
});
