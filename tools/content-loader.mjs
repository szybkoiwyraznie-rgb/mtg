/**
 * Loader treści bazy — jedyne miejsce, które czyta katalogi content/,
 * collection/, scryfall/, maps/ i składa surowe obiekty stron.
 *
 * Używany przez tools/build.mjs (produkcja) i testy integralności
 * (te same reguły — brak rozjazdu między buildem a testami).
 *
 * Loader NIE waliduje semantyki (to registry.js) — tylko parsuje i łączy.
 */

import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from '../src/codex/frontmatter.js';

export function wczytajPlikiMarkdown(katalog) {
  const abs = path.resolve(katalog);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs)
    .filter((f) => f.endsWith('.md') && f !== 'README.md') // README = dokumentacja katalogu, nie strona
    .sort()
    .map((f) => {
      const pelna = path.join(abs, f);
      const surowy = fs.readFileSync(pelna, 'utf8');
      const { data, body } = parseFrontmatter(surowy);
      return { plik: f, sciezka: pelna, fm: data, body };
    });
}

/** Strony treściowe: content/cards, content/lore, content/planes. */
export function wczytajStrony() {
  const strony = [];
  const mapowanie = [
    { katalog: 'content/cards', typ: 'karta' },
    { katalog: 'content/lore', typ: 'haslo' },
    { katalog: 'content/planes', typ: 'plan' },
  ];
  for (const { katalog, typ } of mapowanie) {
    for (const plik of wczytajPlikiMarkdown(katalog)) {
      const fm = plik.fm ?? {};
      if (fm.typ !== typ) {
        strony.push({
          problem: `${katalog}/${plik.plik}: frontmatter.typ = "${fm.typ}", a katalog sugeruje "${typ}"`,
        });
        continue;
      }
      // Pola frontmatteru rozlane na obiekt strony — walidator (registry.js)
      // i build czytają je bezpośrednio (s.plan, s.tagi, s.imgId…).
      strony.push({
        ...fm,
        typ: fm.typ,
        slug: fm.slug,
        tytul: fm.tytul ?? fm.nazwa ?? null,
        body: plik.body,
        plik: `${katalog}/${plik.plik}`,
      });
    }
  }
  return strony;
}

/** Słownik tagów: content/taxonomia.json → Map(tag → opis). */
export function wczytajTaxonomie() {
  const p = path.resolve('content/taxonomia.json');
  if (!fs.existsSync(p)) return new Map();
  const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
  return new Map(Object.entries(raw));
}

/** Wpisy kolekcji: collection/entries/*.md → Map(slug → {fm, prompt, narracja}). */
export function wczytajKolekcje() {
  const wpisy = new Map();
  for (const plik of wczytajPlikiMarkdown('collection/entries')) {
    const fm = plik.fm ?? {};
    const slug = plik.plik.replace(/\.md$/, '');
    const { prompt, narracja } = rozdzielWpis(plik.body);
    wpisy.set(slug, { slug, fm, prompt, narracja, plik: plik.plik });
  }
  return wpisy;
}

function rozdzielWpis(body) {
  const sekcje = {};
  let aktualna = null;
  for (const linia of String(body).split(/\r?\n/)) {
    const m = linia.match(/^##\s+(.+)$/);
    if (m) { aktualna = m[1].trim(); sekcje[aktualna] = []; continue; }
    if (aktualna) sekcje[aktualna].push(linia);
  }
  const wez = (nazwa) => (sekcje[nazwa] ? sekcje[nazwa].join('\n').trim() : null);
  return { prompt: wez('Prompt'), narracja: wez('Narracja') };
}

/** Snapshoty Scryfall: scryfall/*.json → Map(slug → obiekt). */
export function wczytajScryfall() {
  const mapa = new Map();
  const katalog = path.resolve('scryfall');
  if (!fs.existsSync(katalog)) return mapa;
  for (const f of fs.readdirSync(katalog).filter((x) => x.endsWith('.json')).sort()) {
    try {
      const obj = JSON.parse(fs.readFileSync(path.join(katalog, f), 'utf8'));
      mapa.set(f.replace(/\.json$/, ''), obj);
    } catch (e) {
      mapa.set(f.replace(/\.json$/, ''), { problem: `nieparsowalny JSON: ${e.message}` });
    }
  }
  return mapa;
}

/** Rejestry map: maps/<plan>/map.json → Map(plan → obiekt). */
export function wczytajMapy() {
  const mapa = new Map();
  const katalog = path.resolve('maps');
  if (!fs.existsSync(katalog)) return mapa;
  for (const plan of fs.readdirSync(katalog).sort()) {
    const plik = path.join(katalog, plan, 'map.json');
    if (!fs.existsSync(plik)) continue;
    try {
      mapa.set(plan, JSON.parse(fs.readFileSync(plik, 'utf8')));
    } catch (e) {
      mapa.set(plan, { problem: `nieparsowalny map.json: ${e.message}` });
    }
  }
  return mapa;
}

/** „Co nowego": content/co-nowego.md (może nie istnieć). */
export function wczytajCoNowego() {
  const p = path.resolve('content/co-nowego.md');
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}
