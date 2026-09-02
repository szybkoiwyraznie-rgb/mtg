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
 * Uruchomienie: node tools/build.mjs [--out dist/index.html]
 * CLI zawsze buduje pełny pakiet (artefakt + maps/** + ZIP); `--out`
 * wskazuje katalog docelowy (katalog pliku z argumentu).
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { collectModules, assertNoNameCollisions } from './module-graph.mjs';
import {
  wczytajStrony, wczytajTaxonomie, wczytajKolekcje, wczytajScryfall,
  wczytajMapy, wczytajCoNowego, parsujWpisyCoNowego,
} from './content-loader.mjs';
import { renderMarkdown } from '../src/codex/markdown.js';
import { napiszZip } from './zip.mjs';
import {
  zbudujRejestr, resolverLinkow, walidujStrone, policzBacklinki, policzTagi,
} from '../src/codex/registry.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ── Metadane czasu stron (ADR 0029) ─────────────────────────────────
// Daty utworzenia/aktualizacji pochodzą z historii gita pliku źródłowego
// (moment commita = moment publikacji treści; strefa Europe/Warsaw).
// UWAGA dla CI: przy płytkim klonie (fetch-depth: 1) git widzi tylko
// ostatni commit i daty byłyby fałszywe — build ostrzega na stderr.

let ostrzezonoPlytki = false;
function ostrzezPlytkiKlon() {
  if (ostrzezonoPlytki) return;
  ostrzezonoPlytki = true;
  try {
    const shallow = execFileSync('git', ['rev-parse', '--is-shallow-repository'], { cwd: ROOT, encoding: 'utf8' }).trim();
    if (shallow === 'true') {
      console.warn('UWAGA: płytki klon gita — daty „utworzono" stron będą błędne. W workflow ustaw actions/checkout z fetch-depth: 0.');
    }
  } catch { /* poza repozytorium gita — fallback na mtime */ }
}

/** Daty pierwszego i ostatniego commita ścieżki: { utworzono, zaktualizowano }
 *  w formacie „RRRR-MM-DD HH:MM" (Europe/Warsaw). Fallback: mtime pliku. */
function datyGit(sciezka) {
  ostrzezPlytkiKlon();
  try {
    const wyjscie = execFileSync('git',
      ['log', '--format=%ad', '--date=format-local:%Y-%m-%d %H:%M', '--', sciezka],
      { cwd: ROOT, encoding: 'utf8', env: { ...process.env, TZ: 'Europe/Warsaw' } });
    const daty = wyjscie.split('\n').filter(Boolean);
    if (daty.length > 0) return { utworzono: daty[daty.length - 1], zaktualizowano: daty[0] };
  } catch { /* git niedostępny / ścieżka poza repo */ }
  try {
    const st = fs.statSync(path.resolve(ROOT, sciezka));
    const f = (d) => new Date(d).toLocaleString('sv-SE', { timeZone: 'Europe/Warsaw' }).slice(0, 16);
    return { utworzono: f(st.mtime), zaktualizowano: f(st.mtime) };
  } catch { return { utworzono: null, zaktualizowano: null }; }
}
const ENTRY = 'src/codex/main.js';

export async function zbuduj({ out, root = ROOT } = {}) {
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
      czas: datyGit(path.relative(ROOT, path.resolve(root, s.plik))),
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

  // „Co nowego" (ADR 0029): dziennik parsowany na wpisy z datą i godziną
  // publikacji — widoki limitują listę i grupują archiwum miesiącami.
  const wpisyCoNowego = parsujWpisyCoNowego(coNowego).map((w) => ({
    data: w.data,
    godzina: w.godzina,
    miesiac: w.miesiac,
    tytul: w.tytul,
    html: renderMarkdown(w.cialo, { resolveLink: resolver }).html,
  }));

  const dane = {
    zbudowano: new Date().toISOString().slice(0, 16).replace('T', ' '),
    strony: stronyDane,
    plany: strony.filter((s) => s.typ === 'plan').map((s) => s.slug).sort(),
    tagi: policzTagi(strony.map((s) => ({ ...s, tagi: s.tagi ?? [], linki: wyrenderowane.get(s.slug)?.linki ?? [] }))),
    backlinki: policzBacklinki(strony.map((s) => ({ ...s, linki: wyrenderowane.get(s.slug)?.linki ?? [] }))),
    coNowego: wpisyCoNowego,
    statystyki: {
      karty: strony.filter((s) => s.typ === 'karta').length,
      hasla: strony.filter((s) => s.typ === 'haslo').length,
      plany: strony.filter((s) => s.typ === 'plan').length,
    },
  };

  // mapy: rejestr map + DRZEWO STRON MAP (ADR 0027 v2 — decyzja
  // właściciela 2026-09-02: każdy plan = osobna, samowystarczalna strona
  // `maps/<slug>.html` osadzana w <iframe>; file:// nie blokuje iframe'ów,
  // więc wersja offline z dysku działa w pełni, a artefakt główny nie
  // rośnie z liczbą planów). Obok strony: surowy podkład
  // `maps/<slug>/<plik>` dla mini-map kart (<img> działa wszędzie).
  const katalogOut = path.dirname(path.resolve(out));
  const stronyMap = [];                          // [{ slug, mapa, plik }]
  for (const [slug, mapa] of mapy) {
    if (mapa.problem || !mapa.podklad) continue;
    const plik = path.join(root, 'maps', slug, mapa.podklad);
    if (!fs.existsSync(plik)) continue; // brak pliku wychwyci test mapy (MA2)
    const rel = `maps/${slug}/${mapa.podklad}`;
    const celPodkladu = path.join(katalogOut, rel);
    fs.mkdirSync(path.dirname(celPodkladu), { recursive: true });
    fs.copyFileSync(plik, celPodkladu);
    mapa.podkladUrl = rel;                       // mini-mapy kart (<img>)
    mapa.stronaMapy = `maps/${slug}.html`;       // iframe w artefakcie
    // stopka strony mapy (ADR 0029): czas z historii całego katalogu planu
    mapa.czas = datyGit(path.relative(ROOT, path.join(root, 'maps', slug)));
    stronyMap.push({ slug, mapa, plik });
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

  // Zbezpiecznik wstrzykiwania do <script>: jedyna sekwencja kończąca
  // blok skryptu to '</script' — neutralizujemy ją w danych (SVG map,
  // treści) zapisem '<\/script' (identyczny string po sparsowaniu JS).
  const doSkryptu = (s) => s.replaceAll('</script', '<\\/script');

  const html = shell
    .replace('<!--STYL-->', () => `<style>\n${css}\n</style>`)
    .replace('<!--BUNDLE-->', () => `<script>\n${doSkryptu(daneJs)}\n\n${kod}\n</script>`);

  const cel = path.resolve(out);
  fs.mkdirSync(path.dirname(cel), { recursive: true });
  fs.writeFileSync(cel, html);

  // ── 5. Drzewo stron map (ADR 0027 v2) ────────────────────────────
  // Każda mapa = samowystarczalny HTML: ten sam bundle + dane, plus
  // flaga CODEX_MAPA i surowy markup SVG podkładu (bez base64 — lżej).
  // main.js w trybie CODEX_MAPA renderuje mapę zamiast routera.
  for (const { slug, mapa, plik } of stronyMap) {
    const svgTekst = /\.svg$/i.test(mapa.podklad) ? fs.readFileSync(plik, 'utf8') : '';
    const wstrzyknij = `\n// ===== TRYB STRONY MAPY (ADR 0027 v2) =====\n` +
      `globalThis.CODEX_MAPA = ${JSON.stringify(slug)};\n` +
      // strona mapy żyje w maps/ — URL-e podkładów względem NIEJ
      `globalThis.CODEX_DATA.mapy[${JSON.stringify(slug)}].podkladUrl = ${JSON.stringify(`${slug}/${mapa.podklad}`)};\n` +
      (svgTekst ? `globalThis.CODEX_DATA.mapy[${JSON.stringify(slug)}].podkladMarkup = ${JSON.stringify(svgTekst)};\n` : '');
    const htmlMapy = shell
      .replace('<!--STYL-->', () => `<style>\n${css}\n</style>`)
      .replace('<!--BUNDLE-->', () => `<script>\n${doSkryptu(daneJs + wstrzyknij)}\n\n${kod}\n</script>`);
    const celMapy = path.join(katalogOut, 'maps', `${slug}.html`);
    fs.writeFileSync(celMapy, htmlMapy);
    console.log(`  strona mapy: maps/${slug}.html (${(htmlMapy.length / 1024).toFixed(1)} kB)`);
  }

  console.log(`Zbudowano ${out} (artefakt + drzewo map w maps/**)`);
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
 * Pakiet dystrybucyjny (ADR 0027 v2 — drzewo HTML, decyzja właściciela
 * 2026-09-02): JEDNA architektura dla online i offline.
 *   - `<katalog>/mtg-lore-codex.html` — artefakt główny (kod + treść);
 *   - `<katalog>/index.html`           — jego kopia (wejście serwera/Pages);
 *   - `<katalog>/maps/<plan>.html`     — samowystarczalne strony map
 *     (iframe w artefakcie; file:// nie blokuje iframe'ów → offline OK);
 *   - `<katalog>/maps/<plan>/<plik>`   — surowe podkłady (mini-mapy);
 *   - `<katalog>/mtg-lore-codex.zip`   — CAŁE DRZEWO („Pobierz ZIP
 *     Codexu"): po rozpakowaniu otwierasz index.html z dysku.
 */
export async function zbudujPakiet({ root = ROOT, katalog } = {}) {
  katalog = katalog ?? path.join(root, 'dist');
  const celGlowny = path.join(katalog, 'mtg-lore-codex.html');
  await zbuduj({ root, out: celGlowny });
  fs.copyFileSync(celGlowny, path.join(katalog, 'index.html'));

  const plikiZip = [
    { path: 'index.html', data: fs.readFileSync(celGlowny) },
    { path: 'mtg-lore-codex.html', data: fs.readFileSync(celGlowny) },
  ];
  const katalogMap = path.join(katalog, 'maps');
  if (fs.existsSync(katalogMap)) {
    for (const f of chodz(katalogMap)) {
      const rel = path.relative(katalogMap, f).split(path.sep).join('/');
      plikiZip.push({ path: `maps/${rel}`, data: fs.readFileSync(f) });
    }
  }
  const zip = napiszZip(plikiZip);
  const celZip = path.join(katalog, 'mtg-lore-codex.zip');
  fs.writeFileSync(celZip, zip);
  console.log(`  archiwum (drzewo): ${(zip.length / 1024).toFixed(1)} kB (${plikiZip.length} plików)`);
  return { index: path.join(katalog, 'index.html'), glowny: celGlowny, zip: celZip };
}

const jestMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (jestMain) {
  const out = (() => {
    const i = process.argv.indexOf('--out');
    return i >= 0 ? process.argv[i + 1] : undefined;
  })();
  // CLI buduje ZAWSZE pełny pakiet (artefakt + drzewo map + ZIP) —
  // `--out <plik>` wskazuje tylko katalog docelowy (pages.yml podaje
  // dist/index.html). Wcześniej `--out` pomijał ZIP, przez co link
  // „Pobierz archiwum (ZIP)" na GitHub Pages kończył się 404.
  const praca = zbudujPakiet(out ? { katalog: path.dirname(path.resolve(out)) } : {});
  praca.catch((e) => { console.error(e.message); process.exit(1); });
}
