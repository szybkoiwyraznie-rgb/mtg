/**
 * Integralność: struktura maps/ i pinezki (ADR 0007).
 * Pusta baza = brak map (legalne); każda mapa musi być spójna z bazą.
 */
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wczytajStrony, wczytajMapy } from '../tools/content-loader.mjs';

const strony = wczytajStrony().filter((s) => !s.problem);
const karty = new Set(strony.filter((s) => s.typ === 'karta').map((s) => s.slug));
const plany = new Set(strony.filter((s) => s.typ === 'plan').map((s) => s.slug));
const mapy = wczytajMapy();

const POZIOMY = ['dokladna', 'region', 'przyblizona'];

test('każdy katalog maps/<plan> odpowiada stronie planu', () => {
  // ADR 0032: podmapa `<plan>/<podmapa>` wymaga strony planu `<plan>`
  const sieroty = [...mapy.keys()].filter((p) => !plany.has(p.split('/')[0]));
  assert.deepEqual(sieroty, [], `Mapy bez strony planu: ${sieroty.join(', ')}`);
});

test('map.json ma strukturę wg PROCES_MAP.md (MA2)', () => {
  const problemy = [];
  for (const [plan, mapa] of mapy) {
    if (mapa.problem) { problemy.push(`${plan}: ${mapa.problem}`); continue; }
    if (mapa.plan !== plan) problemy.push(`${plan}: mapa.plan = "${mapa.plan}"`);
    if (!['T1', 'T2', 'T3', 'T4'].includes(mapa.wariant)) problemy.push(`${plan}: wariant "${mapa.wariant}"`);
    if (!mapa.zrodlo?.url || !mapa.zrodlo?.pobrano) problemy.push(`${plan}: brak źródła podkładu (MA1)`);
    if (!mapa.wymiary?.szerokosc || !mapa.wymiary?.wysokosc) problemy.push(`${plan}: brak wymiarów`);
    const podklad = path.join('maps', plan, String(mapa.podklad ?? ''));
    if (mapa.wariant !== 'T3' && !fs.existsSync(podklad)) problemy.push(`${plan}: brak pliku podkładu ${podklad}`);
    if (mapa.rekonstrukcja === undefined) problemy.push(`${plan}: brak flagi rekonstrukcja (T3 wymaga true)`);
    if (mapa.rekonstrukcja === true && !['T3', 'T4'].includes(mapa.wariant)) problemy.push(`${plan}: rekonstrukcja tylko dla T3/T4`);
  }
  assert.deepEqual(problemy, [], `Wadliwe map.json:\n${problemy.join('\n')}`);
});

test('pinezki wskazują istniejące karty, mają współrzędne 0-1 i pewność', () => {
  const problemy = [];
  for (const [plan, mapa] of mapy) {
    if (mapa.problem) continue;
    for (const p of mapa.pinezki ?? []) {
      if (!karty.has(p.karta)) problemy.push(`${plan}: pinezka → nieistniejąca karta ${p.karta}`);
      const x = Number(p.x); const y = Number(p.y);
      if (!(x >= 0 && x <= 1) || !(y >= 0 && y <= 1)) problemy.push(`${plan}: pinezka ${p.karta} poza [0,1]`);
      if (!POZIOMY.includes(p.pewnosc)) problemy.push(`${plan}: pinezka ${p.karta} pewność "${p.pewnosc}"`);
      if (p.pewnosc === 'przyblizona' && !p.uzasadnienie) {
        problemy.push(`${plan}: pinezka ${p.karta} przybliżona bez uzasadnienia (MA4)`);
      }
    }
    for (const r of mapa.regiony ?? []) {
      if (!strony.some((s) => s.slug === r.haslo)) problemy.push(`${plan}: region → nieistniejące hasło ${r.haslo}`);
    }
  }
  assert.deepEqual(problemy, [], `Wadliwe pinezki:\n${problemy.join('\n')}`);
});

test('karty z pinezką w frontmatterze mają ją też w map.json (jedno źródło prawdy)', () => {
  const problemy = [];
  for (const mapa of mapy.values()) {
    if (mapa.problem) continue;
    for (const p of mapa.pinezki ?? []) {
      const karta = strony.find((s) => s.slug === p.karta);
      if (karta && !karta.pinezka) problemy.push(`${p.karta}: pinezka w map.json, ale brak w frontmatterze karty`);
      if (karta && karta.pinezka && karta.pinezka.pewnosc !== p.pewnosc) {
        problemy.push(`${p.karta}: rozjazd pewności frontmatter vs map.json`);
      }
    }
  }
  assert.deepEqual(problemy, []);
});
