import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mapa = JSON.parse(fs.readFileSync('maps/eldraine/map.json', 'utf8'));
const scena = JSON.parse(fs.readFileSync('maps/eldraine/scena.json', 'utf8'));
const karta = fs.readFileSync('content/cards/209eld-burning-yard-trainer.md', 'utf8');
const research = fs.readFileSync(
  'maps/_warsztat/RESEARCH_2026-09-11-eldraine-warianty-mapy.md',
  'utf8',
);

const kotwice = new Map(mapa.kotwice.map((k) => [k.nazwa, k]));

test('Eldraine: zatwierdzone T4 jest jawnie atlasem relacyjnym, nie kanoniczną topologią', () => {
  assert.equal(mapa.wariant, 'T4');
  assert.match(mapa.decyzja_wlasciciela, /wariant T4 zatwierdzony/i);
  assert.match(mapa.zrodlo.notka, /umown/i);
  assert.doesNotMatch(mapa.zrodlo.notka, /realizuje kanonicz|kanoniczn[aą] geometri[ęa] Pięciu/i);
  assert.match(research, /STATUS: ZATWIERDZONY/);
  assert.match(research, /właściciel zatwierdził[\s\S]{0,80}T4/i);
  assert.doesNotMatch(research, /Czekam na decyzję właściciela/i);
});

test('Eldraine: ruchome i zaginione miejsca nie udają stałych, osobnych POI', () => {
  const nazwy = mapa.kotwice.map((k) => k.nazwa);
  assert.equal(nazwy.filter((n) => n === 'The Burning Yard').length, 1);
  for (const zabroniona of [
    'Castle Embereth',
    'Tournament Grounds',
    'Cauldron of Eternity',
    "Syr Carenth's Crossing",
  ]) {
    assert.ok(!nazwy.includes(zabroniona), `nieoczekiwana kotwica: ${zabroniona}`);
  }
  const locthwain = nazwy.find((n) => n.startsWith('Castle Locthwain'));
  assert.match(locthwain, /mobilny/i);
  assert.match(kotwice.get(locthwain).pozycja_zrodlo, /mobilny|przemierza Knieje/i);

  const trakt = scena.drogi.find((d) => d.id === 'trakt-vantress');
  assert.ok(trakt, 'brak szlaku ku Vantress');
  assert.ok(trakt.punkty.at(-1)[0] >= 650, 'szlak Vantress nie może wchodzić w taflę Lochmere');
});

test('209ELD: pinezka i treść zachowują Ardenvale z Fabuły', () => {
  const pin = mapa.pinezki.find((p) => p.karta === '209eld-burning-yard-trainer');
  const ardenvale = kotwice.get('Castle Ardenvale');
  assert.ok(pin && ardenvale);
  assert.equal(pin.pewnosc, 'dokladna');
  assert.ok(Math.abs(pin.x - ardenvale.x) < 0.0001);
  assert.ok(Math.abs(pin.y - ardenvale.y) < 0.0001);
  assert.match(pin.uzasadnienie, /Fabuła właściciela[\s\S]*Ardenvale/i);
  assert.match(karta, /Pinezka stoi na \*\*Castle Ardenvale\*\*/);
  assert.doesNotMatch(karta, /pewność \*\*obiekt\*\*/i);
});
