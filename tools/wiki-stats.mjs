#!/usr/bin/env node
/**
 * K5 — completeness score stron (Pętla Jakości, ADR 0006).
 *
 * Mierzy „jak kompletna" jest każda strona bazy i raportuje ranking,
 * żeby Pętla Jakości (docs/guides/PETLA_JAKOSCI.md) miała obiektywny punkt
 * wyjścia do kroku 2 (pogłębianie) i widoczny postęp w czasie.
 *
 * Wzór (docs/guides/PETLA_JAKOSCI.md, „Metryka"):
 *   completeness = wypełnione sekcje obowiązkowe (waga 3)
 *                + cytowania w sekcji Źródła (waga 2)
 *                + wikilinki wychodzące (waga 1)
 *                + pinezka na mapie (waga 2)
 * Maksimum w obecnym wzorze: 8 punktów (3+2+1+2).
 *
 * Brak twardych progów — raport jest informacyjny; próg wprowadzi się,
 * gdy zbierzemy dane referencyjne (ADR 0006).
 *
 * Użycie:
 *   node tools/wiki-stats.mjs            # raport do stdout
 *   node tools/wiki-stats.mjs --json     # tylko JSON (do opisów PR / CI)
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  wczytajStrony, wczytajTaxonomie, wczytajMapy,
} from './content-loader.mjs';
import {
  SEKCJE_KARTY, SEKCJE_HASLA_OBWIAZKOWE,
  wytnijSekcje,
} from '../src/codex/registry.js';
import { parseWikilinks } from '../src/codex/links.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const WAGA_SEKCJE = 3;
export const WAGA_ZRODLA = 2;
export const WAGA_WIKILINKI = 1;
export const WAGA_PINEZKA = 2;
export const MAKS = WAGA_SEKCJE + WAGA_ZRODLA + WAGA_WIKILINKI + WAGA_PINEZKA;

/** Strony planów nie mają kontraktu sekcji w SZKIELET_*; do metryki oglądamy
 *  pragmatycznie obecność rozbudowanego „Setting w pigułce". */
const SEKCJE_PLANU = ['Setting w pigułce'];

/** Dzieli ciało na sekcje h2 → Map(tytuł → treść sekcji). */
function sekcjeZCiala(body) {
  const mapa = new Map();
  let aktualny = null;
  const buf = [];
  for (const linia of String(body).split(/\r?\n/)) {
    const m = linia.match(/^##\s+(.+)$/);
    if (m) {
      if (aktualny) mapa.set(aktualny, buf.join('\n').trim());
      aktualny = m[1].trim();
      buf.length = 0;
    } else if (aktualny) {
      buf.push(linia);
    }
  }
  if (aktualny) mapa.set(aktualny, buf.join('\n').trim());
  return mapa;
}

/** Czy sekcja istnieje i ma niepustą treść (więcej niż nagłówek). */
function sekcjaWypelniona(mapa, tytul) {
  const tresc = mapa.get(tytul);
  return typeof tresc === 'string' && tresc.replace(/>\s*$/gm, '').trim().length > 0;
}

/** Liczba cytowań w sekcji Źródła (wiersze pozycji listy z treścią). */
function policzZrodla(mapa) {
  const zrodla = mapa.get('Źródła');
  if (typeof zrodla !== 'string') return 0;
  const pozycje = zrodla.split(/\r?\n/).filter((l) => /^\s*(?:[-*]|\d+\.)\s+\S/.test(l.trim()));
  return pozycje.length;
}

/** Ile wikilinków [[...]] wychodzi ze strony. */
function policzWikilinki(strona) {
  const zrodlo = `${strona.body ?? ''}`;
  return parseWikilinks(zrodlo).length;
}

/** Score dla jednej strony. */
export function ocenStrone(strona) {
  const mapa = sekcjeZCiala(strona.body ?? '');

  // 1. Sekcje obowiązkowe
  const wymagane = strona.typ === 'karta' ? SEKCJE_KARTY
    : strona.typ === 'haslo' ? SEKCJE_HASLA_OBWIAZKOWE
    : SEKCJE_PLANU;
  const wypelnione = wymagane.filter((s) => sekcjaWypelniona(mapa, s));
  const ratio = wymagane.length ? wypelnione.length / wymagane.length : 0;
  const sekcje = Math.round(ratio * WAGA_SEKCJE * 10) / 10;

  // 2. Cytowania (2 = ≥2 pozycje, 1 = 1 pozycja, 0 = brak)
  const nZrodla = policzZrodla(mapa);
  const zrodla = nZrodla >= 2 ? WAGA_ZRODLA : nZrodla === 1 ? 1 : 0;

  // 3. Wikilinki wychodzące (1 = ≥1, 0 = brak)
  const nWikilinki = policzWikilinki(strona);
  const wikilinki = nWikilinki >= 1 ? WAGA_WIKILINKI : 0;

  // 4. Pinezka (2 = jest, 0 = brak)
  const pinezka = strona.pinezka ? WAGA_PINEZKA : 0;

  const suma = sekcje + zrodla + wikilinki + pinezka;

  let brak = [];
  const brakiWymagane = wymagane.filter((s) => !wypelnione.includes(s));
  if (brakiWymagane.length) brak.push(`sekcje: ${brakiWymagane.join(', ')}`);
  if (nZrodla < 2) brak.push(`źródła: ${nZrodla}`);
  if (nWikilinki < 1) brak.push('wikilinki: 0');
  if (!strona.pinezka) brak.push('pinezka: brak');

  return {
    slug: strona.slug,
    typ: strona.typ,
    tytul: strona.tytul,
    plan: strona.plan ?? null,
    sekcje, zrodla, wikilinki, pinezka,
    suma: Math.round(suma * 10) / 10,
    maks: MAKS,
    procent: Math.round((suma / MAKS) * 100),
    nZrodla, nWikilinki,
    brak,
  };
}

export function raport(strony, mapyPlanow = null) {
  // Plany nie mają pinezki we frontmatter (pinezki noszą karty) — pragmatycznie:
  // plan „ma pinezkę", gdy mapa planu (maps/<plan>/map.json) pinezkuje choć jedną kartę.
  const udekorowane = strony.map((s) => (
    s.typ === 'plan' && mapyPlanow?.get?.(s.slug)?.pinezki?.length
      ? { ...s, pinezka: { mapa: s.slug } }
      : s
  ));
  const r = udekorowane.map(ocenStrone);
  const sr = (arr, f) => arr.length
    ? Math.round((arr.reduce((a, x) => a + x[f], 0) / arr.length) * 10) / 10 : 0;
  return {
    zbudowano: new Date().toISOString().slice(0, 10),
    liczbaStron: r.length,
    srednia: {
      suma: sr(r, 'suma'),
      procent: Math.round(r.length ? r.reduce((a, x) => a + x.procent, 0) / r.length : 0),
      sekcje: sr(r, 'sekcje'),
      zrodla: sr(r, 'zrodla'),
      wikilinki: sr(r, 'wikilinki'),
      pinezka: sr(r, 'pinezka'),
    },
    strony: r.sort((a, b) => a.suma - b.suma || a.slug.localeCompare(b.slug)),
  };
}

function formatuj(r) {
  const linie = [];
  linie.push(`Completeness score (maks ${MAKS}): średnia ${r.srednia.procent}% (${r.srednia.suma}/${MAKS})`);
  linie.push('');
  for (const s of r.strony) {
    linie.push(`  ${String(s.procent).padStart(3)}%  ${s.suma.toFixed(1).padStart(4)}/8  [${s.typ.padEnd(5)}] ${s.slug}${s.tytul ? ` («${s.tytul}»)` : ''}`);
    if (s.brak.length) linie.push(`          — brak: ${s.brak.join('; ')}`);
  }
  linie.push('');
  linie.push('  Rozkład (średnio):');
  linie.push(`    sekcje     ${r.srednia.sekcje}/${WAGA_SEKCJE}`);
  linie.push(`    źródła     ${r.srednia.zrodla}/${WAGA_ZRODLA}`);
  linie.push(`    wikilinki  ${r.srednia.wikilinki}/${WAGA_WIKILINKI}`);
  linie.push(`    pinezka    ${r.srednia.pinezka}/${WAGA_PINEZKA}`);
  return linie.join('\n');
}

const jestMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (jestMain) {
  const strony = wczytajStrony({ root: ROOT });
  const mapa = wczytajMapy({ root: ROOT });
  const tax = wczytajTaxonomie({ root: ROOT });
  const r = raport(strony, mapa);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(r, null, 2));
  } else {
    console.log(formatuj(r));
    console.log('  Plany bez kontraktu sekcji mierzone są pragmatycznie („Setting w pigułce"); pinezka planu = pinezki kart na jego mapie.');
  }
}
