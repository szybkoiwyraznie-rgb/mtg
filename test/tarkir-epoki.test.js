/**
 * Regresje kanonu T4 Tarkiru (A1, audyt PR-21).
 * Źródła/uzasadnienia: maps/tarkir/zrodlo-research.md. To konkretne
 * rozstrzygnięcia epok, nie automatyczny „walidator całego kanonu”.
 */
import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mapa = JSON.parse(fs.readFileSync('maps/tarkir/map.json', 'utf8'));
const scena = JSON.parse(fs.readFileSync('maps/tarkir/scena.json', 'utf8'));
const t4 = mapa.warianty.find((w) => w.id === 't4');
const t1 = mapa.warianty.find((w) => w.id === 't1');
const etykiety = scena.etykiety.map((e) => e.tekst);

test('Tarkir: T4 = oryginalne teraz KTK, nie FRF ani lokacje linii Atarki', () => {
  assert.match(t4.epoka, /KTK/);
  assert.doesNotMatch(t4.epoka, /FRF/);
  for (const nazwa of ['Ayagor', "(Dragon's Bowl)", 'Melting Wilds', 'Aerie of the Unfettered', 'Dusyut Forest', '(Icefall)']) {
    assert.ok(!etykiety.includes(nazwa), `nazwa spoza KTK na T4: ${nazwa}`);
  }
  assert.ok(!scena.biomy.some((b) => b.id === 'dusyut'), 'podziemny Dusyut nie jest powierzchniowym lasem KTK');
  for (const nazwa of ['Karakyk Valley', 'Staircase of Bones', 'Sage-Eye Stronghold', 'Wingthrone']) {
    assert.ok(etykiety.includes(nazwa), `utracona lokacja KTK: ${nazwa}`);
  }
});

test('Tarkir: First Tree przy Arashin, nie na Anafenza’s Kin-Tree z T1', () => {
  const miasto = scena.poi.find((p) => p.id === 'arashin');
  const podpis = scena.etykiety.find((e) => e.tekst === '(First Tree)');
  assert.deepEqual(podpis.opcje.przyDo, [miasto.x, miasto.y]);
  assert.ok(!scena.poi.some((p) => p.id === 'first-tree'), 'brak pozornego, oddzielnego miasta/POI');
  const drzewo = mapa.kotwice.find((k) => k.nazwa === 'First Tree');
  const arashin = mapa.kotwice.find((k) => k.nazwa === 'Arashin');
  assert.deepEqual([drzewo.x, drzewo.y], [arashin.x, arashin.y]);
  assert.equal(drzewo.poi, 'arashin');
  assert.equal(drzewo.px_t1, undefined, 'nie udajemy osobnego pomiaru First Tree na T1');
});

test('Tarkir: kotwice przypisane do POI T4 zgadzają się z geometrią po kalibracji', () => {
  const { sx, sy, ox, oy } = t4.kalibracja;
  for (const kotwica of mapa.kotwice.filter((k) => k.poi)) {
    const poi = scena.poi.find((p) => p.id === kotwica.poi);
    assert.ok(poi, `brak POI T4 dla ${kotwica.nazwa}: ${kotwica.poi}`);
    // JSON zaokrągla x/y do 4 miejsc, generator punkty do 0,1 jednostki.
    assert.ok(Math.abs(poi.x - (ox + sx * kotwica.x) * scena.szerokosc) < 0.2, `x: ${kotwica.nazwa}`);
    assert.ok(Math.abs(poi.y - (oy + sy * kotwica.y) * scena.wysokosc) < 0.2, `y: ${kotwica.nazwa}`);
  }
});

test('Tarkir: korekta kanonu nie zmienia T1, złotego układu ani pinezki karty', () => {
  assert.equal(t1.domyslny, true);
  assert.equal(t1.podklad, 'podklad-t1.jpg');
  assert.equal(t1.etykiety, false);
  assert.deepEqual(t1.kalibracja, { sx: 1, sy: 1, ox: 0, oy: 0 });
  assert.deepEqual(t4.kalibracja, { sx: 0.908609, sy: 0.992421, ox: 0.045695, oy: 0 });
  const pin = mapa.pinezki.find((p) => p.karta === '509ktk-highland-game');
  assert.deepEqual([pin.x, pin.y, pin.pewnosc], [0.4496, 0.1846, 'region']);
});
