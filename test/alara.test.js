import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mapa = JSON.parse(fs.readFileSync('maps/alara/map.json', 'utf8'));
const scena = JSON.parse(fs.readFileSync('maps/alara/scena.json', 'utf8'));
const svg = fs.readFileSync('maps/alara/podklad.svg', 'utf8');

const niepotwierdzonePoi = ['Carmot Mines', 'Ruins of Vithia'];

function kotwica(nazwa) {
  return mapa.kotwice.find((k) => k.nazwa === nazwa);
}

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

test('Alara T3: pętla mapowa materializuje nowe POI i biomy bez fałszywej precyzji', () => {
  const biomy = new Map(scena.biomy.map((b) => [b.id, b]));
  assert.equal(biomy.get('glass-dunes')?.typ, 'pustynia', 'Glass Dunes ma być pustynią, nie trawiastym stepem');
  assert.ok(!biomy.has('step-esper'), 'stary roboczy step Esperu nie wraca');
  assert.equal(biomy.get('cicatrice-scarlands')?.typ, 'gruz', 'Cicatrice jest strefą blizn/gruzu');
  assert.equal(biomy.get('twin-maelstroms')?.typ, 'wir', 'Twin Maelstroms są osobnym znakiem wiru na Esperze');
  assert.ok(scena.rozpadliny?.some((r) => r.id === 'the-rip'), 'The Rip rysowany klockiem rozpadliny');

  for (const [id, label] of [
    ['bloodhall', 'The Bloodhall'],
    ['crystal-labyrinth', 'The Crystal Labyrinth'],
    ['valley-of-the-ancient', 'The Valley of the Ancient'],
  ]) {
    assert.ok(scena.poi.some((p) => p.id === id), `brak POI sceny: ${id}`);
    assert.ok(scena.etykiety.some((e) => e.tekst === label), `brak etykiety sceny: ${label}`);
    assert.ok(svg.includes(`>${label}</text>`), `brak etykiety w SVG: ${label}`);
    const meta = kotwica(label);
    assert.ok(meta, `brak kotwicy map.json: ${label}`);
    assert.match(meta.pozycja_zrodlo, /wybór rekonstrukcji T3/, `${label}: źródło pozycji ma zaznaczać rekonstrukcję`);
  }

  for (const label of ['Sea of Unknowing', 'Twin Maelstroms']) {
    assert.ok(scena.strefyWodne.includes(label), `${label}: ma być dopuszczonym obiektem wodnym`);
    assert.ok(scena.etykietyWodne.includes(label), `${label}: ma mieć kolor etykiety wodnej`);
    assert.equal(kotwica(label)?.typ, 'akwen');
    assert.ok(svg.includes(`>${label}</text>`), `brak etykiety wodnej w SVG: ${label}`);
  }

  assert.equal(kotwica('The Rip')?.typ, 'szczelina');
  assert.match(kotwica('Cicatrice')?.pozycja_zrodlo ?? '', /poligon gruzu = wybór rekonstrukcji T3/);
});
