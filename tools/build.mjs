/**
 * Build MTG Lore Codex — artefakt główny + drzewo map + ZIP
 * (ADR 0001/0027).
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
  wczytajMapy, wczytajCoNowego, parsujWpisyCoNowego, widokScryfallDlaKarty,
} from './content-loader.mjs';
import { renderMarkdown } from '../src/codex/markdown.js';
import { napiszZip } from './zip.mjs';
import {
  zbudujRejestr, resolverLinkow, walidujStrone, policzBacklinki, policzTagi,
} from '../src/codex/registry.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ── Mini-mapy kart (ADR 0027 v3 — decyzja właściciela 2026-09-08) ────
// Miniatura = screenshot bazy domyślnego wariantu, szer. 800 px, jpg q80
// (Lorwyn: 8,3 MB SVG → ~100 kB). Łańcuch wyłącznie w zależnościach
// npm (dev-only — silnik src/codex pozostaje zero-dependency, ADR 0002),
// BEZ binarików systemowych — runner CI (ubuntu-latest 24.04) nie ma
// ImageMagick, regresja 2026-09-08: fallback do pełnej bazy + czerwony
// test artefaktu:
// 1) SVG → @resvg/resvg-js (natywny, pełna jakość SVG) → PNG;
// 2) PNG/JPG → pngjs / jpeg-js (czysty JS) → RGBA;
// 3) skalowanie bilinearnie do 800 px + kodowanie JPEG q80 (jpeg-js);
// 4) fallback: pełna baza w drzewie (działa, ale ZIP cięższy) + ostrzeżenie.
const SZEROKOSC_MINI = 800;
const JAKOSC_JPG = 80;

/** Bilinearny downscale RGBA (czysty JS; jakość wystarczająca dla miniatury). */
function skalujBilinearnie(src, sw, sh, dw, dh) {
  const dst = Buffer.alloc(dw * dh * 4);
  const rx = sw / dw, ry = sh / dh;
  for (let y = 0; y < dh; y++) {
    const sy = Math.min(sh - 1, Math.floor(y * ry));
    const y1 = Math.min(sh - 1, sy + 1);
    const fy = Math.min(1, y * ry - sy);
    for (let x = 0; x < dw; x++) {
      const sx = Math.min(sw - 1, Math.floor(x * rx));
      const x1 = Math.min(sw - 1, sx + 1);
      const fx = Math.min(1, x * rx - sx);
      for (let c = 0; c < 4; c++) {
        const i00 = (sy * sw + sx) * 4 + c, i10 = (sy * sw + x1) * 4 + c;
        const i01 = (y1 * sw + sx) * 4 + c, i11 = (y1 * sw + x1) * 4 + c;
        dst[(y * dw + x) * 4 + c] =
          Math.round(src[i00] * (1 - fx) * (1 - fy) + src[i10] * fx * (1 - fy) +
                     src[i01] * (1 - fx) * fy + src[i11] * fx * fy);
      }
    }
  }
  return dst;
}

async function wyrenderujMiniature({ zrodlo, cel }) {
  try {
    const rozszerzenie = path.extname(zrodlo).toLowerCase();
    let rgba;
    if (rozszerzenie === '.svg') {
      const { Resvg } = await import('@resvg/resvg-js');
      const png = new Resvg(fs.readFileSync(zrodlo), {
        fitTo: { mode: 'width', value: SZEROKOSC_MINI }, background: '#f7f2e7',
      }).render().asPng();
      const { PNG } = await import('pngjs');
      rgba = PNG.sync.read(png);
    } else if (rozszerzenie === '.jpg' || rozszerzenie === '.jpeg') {
      const { decode } = await import('jpeg-js');
      rgba = decode(fs.readFileSync(zrodlo), { maxMemoryUsageInMB: 512 });
    } else if (rozszerzenie === '.png') {
      const { PNG } = await import('pngjs');
      rgba = PNG.sync.read(fs.readFileSync(zrodlo));
    } else {
      return false;
    }
    let { width, height, data } = rgba;
    if (width > SZEROKOSC_MINI) {
      const nowaWys = Math.max(1, Math.round(height * SZEROKOSC_MINI / width));
      data = skalujBilinearnie(data, width, height, SZEROKOSC_MINI, nowaWys);
      width = SZEROKOSC_MINI;
      height = nowaWys;
    }
    const { encode } = await import('jpeg-js');
    const jpg = encode({ data, width, height }, JAKOSC_JPG).data;
    fs.writeFileSync(cel, Buffer.from(jpg));
    return true;
  } catch {
    return false;
  }
}

/** Czy środowisko buildu ma rasterizator mini-map (ADR 0027 v3).
 *  SVG wymaga resvg (natywny dev-dep); rastry idą przez czysty JS
 *  (pngjs/jpeg-js) — dostępne po `npm ci`. */
export async function czyDostepnyRasterizer() {
  try { await import('@resvg/resvg-js'); return true; } catch { /* dalej */ }
  try { await import('jpeg-js'); return true; } catch { return false; }
}

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
    const widokSnap = s.typ === 'karta' && snap ? widokScryfallDlaKarty(snap, s.nazwa) : null;

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
          name: widokSnap?.name ?? snap.name,
          mana_cost: widokSnap?.mana_cost ?? snap.mana_cost,
          cmc: widokSnap?.cmc ?? snap.cmc,
          type_line: widokSnap?.type_line ?? snap.type_line,
          oracle_text: widokSnap?.oracle_text ?? snap.oracle_text,
          power: widokSnap?.power ?? snap.power,
          toughness: widokSnap?.toughness ?? snap.toughness,
          keywords: widokSnap?.keywords ?? snap.keywords ?? [],
          set: widokSnap?.set ?? snap.set,
          set_name: widokSnap?.set_name ?? snap.set_name,
          rarity: widokSnap?.rarity ?? snap.rarity,
          artist: widokSnap?.artist ?? snap.artist,
          flavor_text: widokSnap?.flavor_text ?? snap.flavor_text,
          image_uris: widokSnap?.image_uris ?? snap.image_uris ?? null,
          scryfall_uri: widokSnap?.scryfall_uri ?? snap.scryfall_uri,
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
    const kopiuj = (nazwa) => {
      if (!nazwa) return null;
      const zrodlo = path.join(root, 'maps', slug, String(nazwa));
      if (!fs.existsSync(zrodlo)) return null;
      const rel = `maps/${slug}/${nazwa}`;
      const cel = path.join(katalogOut, rel);
      fs.mkdirSync(path.dirname(cel), { recursive: true });
      fs.copyFileSync(zrodlo, cel);
      return rel;
    };
    // ADR 0027 v3 (właściciel 2026-09-08): w drzewie dist ląduje tylko to,
    // co strona mapy czyta przez <img> (rastry, kafle). Wektorowe bazy są
    // zainlinowane w maps/<slug>.html — ich plik w drzewie to dublowana
    // bajt w ZIP-ie, więc go nie kopiuje.
    const jestWektor = (nazwa) => String(nazwa).toLowerCase().endsWith('.svg');
    const kopiujPodklad = (nazwa) => {
      if (!nazwa) return null;
      if (jestWektor(nazwa)) {
        // Baza jest inline w html — utrzymujemy niezmiennik „wektorowa baza
        // nie leży w drzewie dist” (usuwa też resztki poprzedniego buildu).
        try { fs.rmSync(path.join(katalogOut, 'maps', slug, String(nazwa)), { force: true }); } catch { /* jeszcze nie było */ }
        return null;
      }
      return kopiuj(nazwa);
    };
    kopiujPodklad(mapa.podklad);
    const kopiujKatalog = (nazwa) => {
      if (!nazwa) return;
      const zrodlo = path.join(root, 'maps', slug, String(nazwa));
      if (!fs.existsSync(zrodlo)) { problemy.push(`${slug}: brak katalogu kafelków ${nazwa} (LOD)`); return; }
      const celKat = path.join(katalogOut, `maps/${slug}/${nazwa}`);
      for (const f of chodz(zrodlo)) {
        const cel = path.join(celKat, path.relative(zrodlo, f));
        fs.mkdirSync(path.dirname(cel), { recursive: true });
        fs.copyFileSync(f, cel);
      }
    };
    const warianty = Array.isArray(mapa.warianty) ? mapa.warianty : [];
    // LOD (ADR 0039): nakładka L2 (bbox) NIE jest inlinowana (dostaje tylko
    // URL, §5) — jej <img> ładuje się leniwie z drzewa, więc wektorową
    // płytę ZAWSZE kopiujemy (wyjątek od reguły ADR 0027 v3: bez tego
    // data-src płyty kończyłby się 404 w zbudowanej stronie).
    for (const w of warianty) {
      if (Array.isArray(w.bbox)) kopiuj(w.podklad);
      else kopiujPodklad(w.podklad);
      if (w.kafle) kopiujKatalog(w.kafle.katalog);
    }
    const domyslny = warianty.find((w) => w.domyslny) ?? warianty[0];
    // Mini-mapa (kafel na stronie karty, <img>): jpg-screenshot bazy
    // domyślnego wariantu wygenerowany w buildzie (800 px, q80) —
    // Lorwyn: 8,3 MB SVG → ~100 kB zamiast pełnej bazy w drzewie.
    // Pinezka rysowana po stronie karty (kropka w dokładnych współrzędnych).
    const bazaDomyslna = domyslny?.podklad ?? mapa.podklad;
    const plikBazy = path.join(root, 'maps', slug, bazaDomyslna);
    const celMini = path.join(katalogOut, 'maps', slug, 'mini.jpg');
    if (!fs.existsSync(plikBazy)) {
      problemy.push(`${slug}: brak bazy ${bazaDomyslna} do wygenerowania mini-mapy`);
    } else {
      fs.mkdirSync(path.dirname(celMini), { recursive: true });
      const udalo = await wyrenderujMiniature({ zrodlo: plikBazy, cel: celMini });
      if (udalo) {
        mapa.podkladUrl = `maps/${slug}/mini.jpg`;
      } else {
        console.warn(`UWAGA: brak rasterizatora dla "${slug}" — mini-mapa z pełnej bazy (ZIP cięższy).`);
        kopiuj(bazaDomyslna);
        mapa.podkladUrl = `maps/${slug}/${bazaDomyslna}`;
      }
    }
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
    const warianty = Array.isArray(mapa.warianty) ? mapa.warianty : [];
    // A5 (audyt PR-21): mapa z wariantami używa wyłącznie ich markupu.
    // Płaski fallback jest potrzebny starym mapom, ale duplikował całe
    // SVG Tarkiru w HTML, parsowaniu JS i ZIP-ie.
    const svgTekst = !warianty.length && /\.svg$/i.test(mapa.podklad) ? fs.readFileSync(plik, 'utf8') : '';
    // strona mapy żyje w maps/ (płaska) lub maps/<plan>/ (podmapa,
    // ADR 0032) — URL podkładu liczony względem katalogu strony
    const urlWzgledny = (nazwa) => path.posix.relative(path.posix.dirname(slug), `${slug}/${nazwa}`);
    const rejestr = `globalThis.CODEX_DATA.mapy[${JSON.stringify(slug)}]`;
    // Warianty podkładu (ADR 0035): każdy dostaje własny URL, a SVG —
    // surowy markup (etykiety do nakładki); raster zostaje <img> z URL.
    // LOD (ADR 0039): nakładka L2 (bbox) dostaje TYLKO URL — jej <img>
    // ładuje się leniwie od progu, a inline markup dublowałby payload
    // w stronie (A5 dla nakładek: renderer markupu L2 nie używa).
    const wstrzyknijWarianty = warianty.map((w, i) => {
      const plikW = path.join(root, 'maps', slug, String(w.podklad ?? ''));
      const svgW = !Array.isArray(w.bbox) && /\.svg$/i.test(String(w.podklad ?? '')) && fs.existsSync(plikW) ? fs.readFileSync(plikW, 'utf8') : '';
      return `${rejestr}.warianty[${i}].podkladUrl = ${JSON.stringify(urlWzgledny(w.podklad))};\n` +
        (svgW ? `${rejestr}.warianty[${i}].podkladMarkup = ${JSON.stringify(svgW)};\n` : '');
    }).join('');
    const wstrzyknij = `\n// ===== TRYB STRONY MAPY (ADR 0027 v2) =====\n` +
      `globalThis.CODEX_MAPA = ${JSON.stringify(slug)};\n` +
      `${rejestr}.podkladUrl = ${JSON.stringify(urlWzgledny(mapa.podklad))};\n` +
      (svgTekst ? `${rejestr}.podkladMarkup = ${JSON.stringify(svgTekst)};\n` : '') +
      wstrzyknijWarianty;
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
  // PR-25: pełny build czyści katalog wyjściowy — pliki usunięte z repo
  // (np. maps/dominaria/aerona.jpg, ADR 0041) muszą zniknąć z drzewa i
  // ZIP-a: build nadpisuje, ale nie śledzi usunięć (stale pliki zostawały
  // w archiwum).
  fs.rmSync(katalog, { recursive: true, force: true });
  const celGlowny = path.join(katalog, 'mtg-lore-codex.html');
  await zbuduj({ root, out: celGlowny });
  fs.copyFileSync(celGlowny, path.join(katalog, 'index.html'));

  // ADR 0027 (rejestr): mapy idą przez <iframe> (maps/<slug>.html), więc
  // artefakt otwiera się zawsze jako index.html — w archiwum ZIP wystarczy
  // JEDEN plik kodeksu (wcześniej pakowaliśmy dwie identyczne kopie:
  // index.html + mtg-lore-codex.html, bez różnicy w treści). Plik
  // mtg-lore-codex.html na dysku/Pages zostaje (stabilny URL linku
  // „Pobierz ZIP"), ale do ZIP trafia już tylko index.html.
  const plikiZip = [
    { path: 'index.html', data: fs.readFileSync(celGlowny) },
  ];
  const katalogMap = path.join(katalog, 'maps');
  if (fs.existsSync(katalogMap)) {
    for (const f of chodz(katalogMap)) {
      const rel = path.relative(katalogMap, f).split(path.sep).join('/');
      plikiZip.push({ path: `maps/${rel}`, data: fs.readFileSync(f) });
    }
  }
  // UWAGA: ilustracje FOT/KON właściciela NIE trafiają do ZIP (prywatny
  // zasób ~10 GB, gitignorowany, ADR 0008). Wypakowany index.html sonduje
  // względne ./img/<id>FOT|KON.png obok siebie (np. c:\mtg\img\) — gdy
  // katalog istnieje, sloty się pokazują; gdy nie (Pages), cicho znikają.

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
