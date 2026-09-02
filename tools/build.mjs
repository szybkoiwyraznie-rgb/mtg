/**
 * Build MTG Lore Codex — jednoplikowy artefakt (ADR 0001).
 *
 * 1. Ładuje treść (content-loader) i WALIDUJE ją (registry) — build
 *    nie wypuszcza artefaktu z martwymi wikilinkami ani złym schematem.
 * 2. Renderuje markdown stron z resolverem wikilinków.
 * 3. Skleja moduły ESM z src/codex (technika dziedziczona z mtg-game,
 *    ADR 0011 tam): jeden zasięg, kolejność „najgłębsze pierwsze",
 *    detekcja cykli i kolizji nazw (tools/module-graph.mjs).
 * 4. Wstrzykuje styl, dane (CODEX_DATA) i kod do szkieletu index.html.
 *
 * Uruchomienie: node tools/build.mjs [--out dist/mtg-lore-codex.html]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectModules, assertNoNameCollisions } from './module-graph.mjs';
import {
  wczytajStrony, wczytajTaxonomie, wczytajKolekcje, wczytajScryfall,
  wczytajMapy, wczytajCoNowego,
} from './content-loader.mjs';
import { renderMarkdown } from '../src/codex/markdown.js';
import { napiszZip } from './zip.mjs';
import {
  zbudujRejestr, resolverLinkow, walidujStrone, policzBacklinki, policzTagi,
} from '../src/codex/registry.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENTRY = 'src/codex/main.js';

export async function zbuduj({ out, root = ROOT, inline = false } = {}) {
  out = out ?? path.join(root, 'dist/mtg-lore-codex.html');
  const problemy = [];

  // ── 1. Ładowanie treści ──────────────────────────────────────────
  const suroweStrony = wczytajStrony({ root });
  for (const s of suroweStrony) if (s.problem) problemy.push(s.problem);
  const strony = suroweStrony.filter((s) => !s.problem);

  const taxonomia = wczytajTaxonomie({ root });
  const kolekcja = wczytajKolekcje({ root });
  const scryfall = wczytajScryfall({ root });
  const mapy = wczytajMapy({ root });
  const coNowego = wczytajCoNowego({ root });

  const { bySlug, duplikaty } = zbudujRejestr(strony);
  for (const d of duplikaty) problemy.push(`zduplikowany slug: ${d}`);

  const ctx = {
    taxonomia,
    plany: new Set(strony.filter((s) => s.typ === 'plan').map((s) => s.slug)),
  };
  for (const s of strony) problemy.push(...walidujStrone(s, ctx));

  // ── 2. Render markdown + linki wychodzące ────────────────────────
  const resolver = resolverLinkow(bySlug);
  const wyrenderowane = new Map(); // slug → {html, linki}
  for (const s of strony) {
    const { html, problemy: mdProblemy } = renderMarkdown(s.body, { resolveLink: resolver });
    const linki = [...s.body.matchAll(/\[\[([^\]|]+?)(?:\|[^\]]+?)?\]\]/g)]
      .map((m) => m[1].trim());
    wyrenderowane.set(s.slug, { html, linki: [...new Set(linki)] });
    for (const pr of mdProblemy) problemy.push(`${s.slug}: ${pr}`);
  }

  if (problemy.length > 0) {
    console.error('Build przerwany — problemy integralności bazy:');
    for (const p of problemy) console.error(`  - ${p}`);
    throw new Error(`Baza ma ${problemy.length} problem(ów); artefakt nie został zbudowany.`);
  }

  // ── 3. CODEX_DATA ────────────────────────────────────────────────
  const stronyDane = {};
  for (const s of strony) {
    const r = wyrenderowane.get(s.slug);
    const wpisKolekcji = kolekcja.get(s.slug) ?? null;
    const snap = scryfall.get(s.slug) ?? null;

    if (s.typ === 'karta' && !wpisKolekcji) problemy.push(`${s.slug}: brak wpisu kolekcji (ADR 0003)`);
    if (s.typ === 'karta' && !snap) problemy.push(`${s.slug}: brak snapshotu Scryfall (ADR 0004)`);

    stronyDane[s.slug] = {
      typ: s.typ,
      slug: s.slug,
      tytul: s.tytul,
      plan: s.plan ?? null,
      tagi: s.tagi ?? [],
      materializacja: s.materializacja ?? null,
      html: r.html,
      linki: r.linki,
      ...(s.typ === 'karta' ? {
        imgId: s.imgId,
        nazwa: s.nazwa,
        wydanie: s.wydanie ?? null,
        kolory: s.kolory ?? [],
        pinezka: s.pinezka ?? null,
        kolekcja: wpisKolekcji ? {
          imgId: wpisKolekcji.fm.imgId,
          nazwa: wpisKolekcji.fm.nazwa,
          wydanie: wpisKolekcji.fm.wydanie,
          plan: wpisKolekcji.fm.plan,
          kolory: wpisKolekcji.fm.kolory ?? [],
          mv: wpisKolekcji.fm.mv ?? null,
          dostarczono: wpisKolekcji.fm.dostarczono ?? null,
        } : null,
        scryfall: snap ? {
          name: snap.name, mana_cost: snap.mana_cost, cmc: snap.cmc,
          type_line: snap.type_line, oracle_text: snap.oracle_text,
          power: snap.power, toughness: snap.toughness,
          keywords: snap.keywords ?? [], set: snap.set, set_name: snap.set_name,
          rarity: snap.rarity, artist: snap.artist, flavor_text: snap.flavor_text,
          image_uris: snap.image_uris ?? null, scryfall_uri: snap.scryfall_uri,
        } : null,
      } : {}),
      ...(s.typ === 'haslo' ? { klasa: s.klasa } : {}),
      ...(s.typ === 'plan' ? { typIP: s.typIP, mapa: s.mapa ?? null } : {}),
    };
  }

  const coNowegoHtml = coNowego
    ? renderMarkdown(coNowego, { resolveLink: resolver }).html
    : '';

  const dane = {
    zbudowano: new Date().toISOString().slice(0, 16).replace('T', ' '),
    strony: stronyDane,
    plany: strony.filter((s) => s.typ === 'plan').map((s) => s.slug).sort(),
    tagi: policzTagi(strony.map((s) => ({ ...s, tagi: s.tagi ?? [], linki: wyrenderowane.get(s.slug)?.linki ?? [] }))),
    backlinki: policzBacklinki(strony.map((s) => ({ ...s, linki: wyrenderowane.get(s.slug)?.linki ?? [] }))),
    coNowegoHtml,
    statystyki: {
      karty: strony.filter((s) => s.typ === 'karta').length,
      hasla: strony.filter((s) => s.typ === 'haslo').length,
      plany: strony.filter((s) => s.typ === 'plan').length,
    },
  };

  // mapy: rejestr map + PODKŁADY JAKO OSOBNE PLIKI (ADR 0027 — rewizja
  // jednoplikowości ADR 0001/0009 na decyzję właściciela 2026-09-02:
  // przy 30+ planach base64 map rozdąłby artefakt do dziesiątek MB).
  // Podkład kopiowany do <dist>/maps/<slug>/<plik>; artefakt niesie tylko
  // `podkladUrl` (względny — działa na Pages i po rozpakowaniu ZIP-a).
  // Tryb `inline` (testy shimowe / artefakt awaryjny): stary base64.
  const katalogOut = path.dirname(path.resolve(out));
  for (const [slug, mapa] of mapy) {
    if (mapa.problem || !mapa.podklad) continue;
    const plik = path.join(root, 'maps', slug, mapa.podklad);
    if (!fs.existsSync(plik)) continue; // brak pliku wychwyci test mapy (MA2)
    if (inline) {
      const rozsz = path.extname(plik).toLowerCase();
      const mime = rozsz === '.svg' ? 'image/svg+xml' : rozsz === '.png' ? 'image/png'
        : rozsz === '.webp' ? 'image/webp' : 'image/jpeg';
      mapa.podkladData = `data:${mime};base64,${fs.readFileSync(plik).toString('base64')}`;
    } else {
      const rel = `maps/${slug}/${mapa.podklad}`;
      const celPodkladu = path.join(katalogOut, rel);
      fs.mkdirSync(path.dirname(celPodkladu), { recursive: true });
      fs.copyFileSync(plik, celPodkladu);
      mapa.podkladUrl = rel;
    }
  }
  dane.mapy = Object.fromEntries(mapy.entries());

  if (problemy.length > 0) {
    console.error('Build przerwany — problemy integralności bazy:');
    for (const p of problemy) console.error(`  - ${p}`);
    throw new Error(`Baza ma ${problemy.length} problem(ów); artefakt nie został zbudowany.`);
  }

  // ── 4. Sklejanie artefaktu ───────────────────────────────────────
  const moduly = collectModules(ENTRY, { rootDir: ROOT });
  assertNoNameCollisions(moduly, { rootDir: ROOT });

  const kod = moduly
    .map(({ abs, source }) => {
      const rel = path.relative(ROOT, abs).replaceAll('\\', '/');
      return `// ===== ${rel} =====\n${stripModuleSyntax(source).trim()}`;
    })
    .join('\n\n');

  const daneJs = `// ===== CODEX_DATA (wstrzyknięte przez build — ADR 0001) =====\nglobalThis.CODEX_DATA = ${JSON.stringify(dane, null, 2)};`;

  const shell = fs.readFileSync(path.join(ROOT, 'src/codex/index.html'), 'utf8');
  for (const znacznik of ['<!--STYL-->', '<!--BUNDLE-->']) {
    if (!shell.includes(znacznik)) throw new Error(`src/codex/index.html nie zawiera ${znacznik}`);
  }
  const css = fs.readFileSync(path.join(ROOT, 'src/codex/style.css'), 'utf8');

  const html = shell
    .replace('<!--STYL-->', () => `<style>\n${css}\n</style>`)
    .replace('<!--BUNDLE-->', () => `<script>\n${daneJs}\n\n${kod}\n</script>`);

  const cel = path.resolve(out);
  fs.mkdirSync(path.dirname(cel), { recursive: true });
  fs.writeFileSync(cel, html);

  console.log(`Zbudowano ${out}${inline ? ' (inline/offline)' : ' (split: mapy w maps/**)'}`);
  console.log(`  stron w bazie: ${Object.keys(stronyDane).length} (karty: ${dane.statystyki.karty}, hasła: ${dane.statystyki.hasla}, plany: ${dane.statystyki.plany})`);
  console.log(`  modułów: ${moduly.length}`);
  console.log(`  rozmiar: ${(html.length / 1024).toFixed(1)} kB`);
  return cel;
}

/** Rekurencyjny spis plików w katalogu (posortowany, ścieżki absolutne). */
function chodz(katalog) {
  const wyn = [];
  for (const e of fs.readdirSync(katalog, { withFileTypes: true })) {
    const pelna = path.join(katalog, e.name);
    if (e.isDirectory()) wyn.push(...chodz(pelna));
    else wyn.push(pelna);
  }
  return wyn.sort();
}

/** Usuwa składnię modułów — po sklejeniu wszystko dzieli jeden zasięg (L3). */
function stripModuleSyntax(source) {
  return source
    .replace(/^[ \t]*export\s+\{[^}]*\}\s*from\s*['"][^'"]+['"];?[ \t]*$/gm, '')
    .replace(/^[ \t]*import\s+(?:[\s\S]*?\s+from\s+)?['"][^'"]+['"];?[ \t]*$/gm, '')
    .replace(/^[ \t]*export\s+default\s+/gm, 'const __default__ = ')
    .replace(/^[ \t]*export\s+(async\s+function|function|const|let|var|class)\s/gm, '$1 ')
    .replace(/^[ \t]*export\s*\{[^}]*\};?[ \t]*$/gm, '');
}

/**
 * Pakiet dystrybucyjny (ADR 0027, dwa tory — decyzja właściciela
 * 2026-09-02: wersja OFFLINE z pliku musi działać w 100%):
 *   1. `<katalog>/index.html`         — wersja SPLIT (mapy w maps/**,
 *      dociągane fetch-em): dla serwera lokalnego i GH Pages; szybka
 *      i skalowalna na dziesiątki planów.
 *   2. `<katalog>/mtg-lore-codex.html` — PEŁNY JEDNOPLIK (inline,
 *      wszystko w środku): do otwarcia z dysku (file://) w przeglądarce,
 *      bez żadnej degradacji — mapy wektorowe z pełną nakładką.
 *   3. `<katalog>/mtg-lore-codex.zip` — archiwum z jednoplikiem
 *      (samowystarczalne po rozpakowaniu; STORE, ADR 0002).
 */
export async function zbudujPakiet({ root = ROOT, katalog } = {}) {
  katalog = katalog ?? path.join(root, 'dist');
  await zbuduj({ root, out: path.join(katalog, 'index.html') });
  const celInline = path.join(katalog, 'mtg-lore-codex.html');
  await zbuduj({ root, out: celInline, inline: true });
  const zip = napiszZip([{ path: 'mtg-lore-codex.html', data: fs.readFileSync(celInline) }]);
  const celZip = path.join(katalog, 'mtg-lore-codex.zip');
  fs.writeFileSync(celZip, zip);
  console.log(`  archiwum offline: ${(zip.length / 1024).toFixed(1)} kB (1 plik, jednoplikowy artefakt)`);
  return { index: path.join(katalog, 'index.html'), offline: celInline, zip: celZip };
}

const jestMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (jestMain) {
  const out = (() => {
    const i = process.argv.indexOf('--out');
    return i >= 0 ? process.argv[i + 1] : undefined;
  })();
  const inline = process.argv.includes('--inline');
  // `--out` = pojedynczy artefakt (tak buduje pages.yml: split pod
  // dist/index.html). Bez `--out` = pełny pakiet dystrybucyjny.
  const praca = out ? zbuduj({ out, inline }) : zbudujPakiet({});
  praca.catch((e) => { console.error(e.message); process.exit(1); });
}
