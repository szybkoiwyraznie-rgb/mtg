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

test('warianty podkładu (ADR 0035): pliki istnieją, dokładnie jeden domyślny, kalibracja liczbowa, T1 bez etykiet Codexu', () => {
  const problemy = [];
  for (const [plan, mapa] of mapy) {
    if (mapa.problem || !Array.isArray(mapa.warianty)) continue;
    const w = mapa.warianty;
    if (w.length < 2) problemy.push(`${plan}: warianty[] ma sens od dwóch podkładów (jest ${w.length})`);
    if (w.filter((x) => x.domyslny).length !== 1) problemy.push(`${plan}: dokładnie jeden wariant domyślny (układ złoty)`);
    const idy = new Set();
    for (const x of w) {
      if (!x.id || idy.has(x.id)) problemy.push(`${plan}: wariant bez unikalnego id`);
      idy.add(x.id);
      if (!['T1', 'T2', 'T3', 'T4'].includes(x.wariant)) problemy.push(`${plan}/${x.id}: wariant "${x.wariant}"`);
      for (const plik of [x.podklad, x.miniatura].filter(Boolean)) {
        if (!fs.existsSync(path.join('maps', plan, String(plik)))) problemy.push(`${plan}/${x.id}: brak pliku ${plik}`);
      }
      if (!x.wymiary?.szerokosc || !x.wymiary?.wysokosc) problemy.push(`${plan}/${x.id}: brak wymiarów`);
      if (!x.zrodlo?.url || !x.zrodlo?.pobrano) problemy.push(`${plan}/${x.id}: brak źródła podkładu (MA1)`);
      const k = x.kalibracja ?? {};
      for (const klucz of ['sx', 'sy', 'ox', 'oy']) {
        if (typeof k[klucz] !== 'number' || !Number.isFinite(k[klucz])) problemy.push(`${plan}/${x.id}: kalibracja.${klucz} nie jest liczbą`);
      }
      if (Array.isArray(x.bbox)) {
        // LOD (ADR 0039): nakładka regionalna L2 — kalibracja jest odwrotnością bbox
        const [x0, y0, x1, y1] = x.bbox;
        const wB = x1 - x0; const hB = y1 - y0;
        if (![x0, y0, x1, y1].every((v) => typeof v === 'number' && Number.isFinite(v)) || !(x0 >= 0 && y0 >= 0 && x1 <= 1 && y1 <= 1 && wB > 0 && hB > 0)) {
          problemy.push(`${plan}/${x.id}: bbox nie jest prostokątem w [0,1]`);
        } else {
          const eps = 1e-6;
          const spr = [['sx', 1 / wB], ['sy', 1 / hB], ['ox', -x0 / wB], ['oy', -y0 / hB]];
          for (const [klucz, wart] of spr) {
            if (Math.abs((k[klucz] ?? NaN) - wart) > eps) problemy.push(`${plan}/${x.id}: kalibracja.${klucz} nie jest odwrotnością bbox (oczekiwano ${wart})`);
          }
        }
        if (x.domyslny) problemy.push(`${plan}/${x.id}: nakładka bbox nie może być wariantem domyślnym (układ złoty to cała scena)`);
      }
      if (x.domyslny && !(k.sx === 1 && k.sy === 1 && k.ox === 0 && k.oy === 0)) {
        problemy.push(`${plan}/${x.id}: wariant domyślny MUSI mieć kalibrację tożsamościową (to on jest układem złotym)`);
      }
      if (x.wariant === 'T1' && x.etykiety !== false) problemy.push(`${plan}/${x.id}: raster T1 bez etykiet Codexu (etykiety:false — ADR 0035 §4)`);
    }
    // pinezki po kalibracji każdego wariantu nadal w [0,1]
    // (LOD: nakładki bbox pomijamy — pinezki żyją w układzie złotym, nakładki nie są scenami)
    for (const x of w) {
      if (Array.isArray(x.bbox)) continue;
      const k = x.kalibracja ?? {};
      for (const pin of mapa.pinezki ?? []) {
        const px = k.ox + k.sx * pin.x; const py = k.oy + k.sy * pin.y;
        if (!(px >= 0 && px <= 1 && py >= 0 && py <= 1)) problemy.push(`${plan}/${x.id}: pinezka ${pin.karta} po kalibracji poza [0,1] (${px.toFixed(3)},${py.toFixed(3)})`);
      }
    }
  }
  assert.deepEqual(problemy, [], `Wadliwe warianty podkładu:\n${problemy.join('\n')}`);
});

test('Innistrad: kotwice z jawną proweniencją jednostkową (F5, audyt PR-23)', () => {
  // Dwa poziomy: „kanon:” z URL-em przewodnika albo jawne „wyłącznie
  // raster:” do weryfikacji przy karcie z regionu. Szablonowa kopia
  // jednego zdania na wszystkie kotwice nie przechodzi.
  const mapa = mapy.get('innistrad');
  assert.ok(mapa && !mapa.problem, 'brak mapy innistrad');
  assert.ok(mapa.kotwice.length >= 64, `oczekiwano ≥64 kotwic, jest ${mapa.kotwice.length}`);
  const zle = [];
  for (const k of mapa.kotwice ?? []) {
    const z = k.pozycja_zrodlo ?? '';
    const kanon = z.startsWith('kanon:') && z.includes('https://');
    const raster = z.startsWith('wyłącznie raster:');
    if (!kanon && !raster) zle.push(k.nazwa);
  }
  assert.deepEqual(zle, [], `Kotwice bez jawnej proweniencji: ${zle.join(', ')}`);
});

