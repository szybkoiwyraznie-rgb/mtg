/**
 * mapforge/bloki.mjs — reużywalne klocki rysunkowe (warsztat T4, ADR 0018).
 *
 * Każdy klocek = funkcja (dane → string SVG). Wszystkie „losowe" detale
 * deterministyczne: rng z hasha `id` (lub seed podany ręcznie), więc
 * regeneracja daje identyczny wynik, a edycja jednego obiektu nie rusza
 * pozostałych. Paleta: pergamin ADR 0008, spójna z maps/zendikar.
 */

import {
  prng, zaokr, chaikin, gladka, prosta, rozrzut, pole, dlugosc,
  punktNa, wstega, pit,
} from './geom.mjs';
import { GLIFY_GORY, GLIFY_GORY_HERO } from './glify-mapaome.mjs';

/** Paleta bazowa = motyw „pergamin" (ADR 0008).
 *  UWAGA: kolor rzeki nie istnieje w palecie — rzeka ma kolor akwenu
 *  (ADR 0020, decyzja właściciela 2026-09-01). */
export const PAL = {
  lad: '#e8dbb8', ladStroke: '#a89468',
  // Woda = JEDEN kolor (morze/jeziora/rzeka — decja właściciela 2026-09-02,
  // pkt d: akweny mają się zlewać, bez osobnego „koloru jeziora").
  woda: '#ccd8d2', wodaStroke: '#7fa0b4',
  tekst: '#4a3a28', ital: '#6b5d52', halo: '#f4ecd8', etykieta: '#6b1f2e',
  etykietaWoda: '#2e4d66',
  drzewo: '#7a8a5a', drzewoCien: '#5c6b44', pienn: '#6b5d52',
  bagno: '#6f8a72', step: '#b5a877',
  skala: '#d8c9a3', skalaCien: '#8a7550', skalaLinia: '#a89468',
  droga: '#8a7550',
  lodFill: '#eef0e6', lodPek: '#c9d4d6', snieg: '#f6f4ec',
  krater: '#7a4a3a', dym: '#9aa3a8', mur: '#c9b98f', kamien: '#cfc4a0',
  poswiataKolor: '#b9cdd8',
  poswiata: [{ w: 12, o: 0.10 }, { w: 7, o: 0.16 }, { w: 3, o: 0.24 }],
  tryb: 'kolor',   // 'kolor' = wypelnienia; 'tusz' = kontur + haczura (line-art)
};

const MOTYWY = {
  pergamin: {},
  /** Monochromatyczny atlas z walorem tonalnym (decyzja właściciela,
   *  doprecyzowanie ADR 0019): odcienie wyłącznie na osi czarny–szary–
   *  biały (achromatycznie, bez sepii/brązu) — ląd jaśniejszy od wody,
   *  korony dwutonowe, fasety cieniowane, linie wody i plamy oceanu
   *  w szarościach. Kolor zarezerwowany dla warstw funkcjonalnych UI
   *  (pinezki kart). Tryb „tusz" (czysta kreska, zero wypełnień)
   *  pozostaje dostępny dla własnych palet — tryb deklaruje motyw. */
  atlas: {
    lad: '#f7f7f7', ladStroke: '#3f3f3f',
    // Woda w delikatnym niebieskim (decyzja właściciela 2026-09-01 — odstępstwo
    // od czystego achromatu z ADR 0019: kolor tylko dla wody i etykiet).
    // Jeden kolor wody dla wszystkich akwenów (pkt d, 2026-09-02); ton
    // przyciemniony dla kontrastu z papierem (recenzja 2026-09-02 pkt 3,
    // ADR 0023 — w zamian za wycofaną obwódkę rzek).
    woda: '#d4e2ee', wodaStroke: '#6f9bc0',
    tekst: '#1c1c1c', ital: '#3f3f3f', halo: '#f7f7f7', etykieta: '#6b1f2e',
    // Etykiety obiektów wodnych: ciemny granat (recenzja 2026-09-02,
    // ADR 0024) — kolor funkcyjny obok bordowych etykiet i błękitu wody.
    etykietaWoda: '#1c3a5e',
    drzewo: '#dedede', drzewoCien: '#c3c3c3', pienn: '#3f3f3f',
    bagno: '#5f5f5f', step: '#9b9b9b',
    skala: '#eaeaea', skalaCien: '#6b6b6b', skalaLinia: '#8f8f8f',
    droga: '#3f3f3f',
    lodFill: '#f4f8fb', lodPek: '#b9cfe0', snieg: '#ffffff',
    krater: '#4a4a4a', dym: '#909090', mur: '#d9d9d9', kamien: '#cfcfcf',
    poswiataKolor: '#9f9f9f',
    poswiata: [{ w: 10, o: 0.35 }, { w: 5.5, o: 0.5 }, { w: 2, o: 0.9 }],
    tryb: 'kolor',
  },
};

/** Przełącza paletę silnika (mutuje PAL; woła render przed rysowaniem). */
export function motyw(nazwa = 'pergamin') {
  if (!(nazwa in MOTYWY)) throw new Error(`nieznany motyw: ${nazwa} (${Object.keys(MOTYWY).join('/')})`);
  if (!MOTYWY.__baza) MOTYWY.__baza = { ...PAL };   // pierwsza aktywacja = wartości pergaminu
  Object.assign(PAL, MOTYWY.__baza, MOTYWY[nazwa]);
  return PAL;
}

const rr = (v) => zaokr(v);

/* ---------- biome: las (kępy koron + pnie) ---------- */

/**
 * „Chmurkowa" korona ręcznie rysowanej kępy — zamknięta ścieżka z wypukłych
 * łuków wokół elipsy (jak kępa liści na mapie mapome). Deterministyczna
 * przez rng: nieregularny obrys (jitter promienia) daje naturalne,
 * niegdysiejszo-geometryczne kępy.
 */
function korona(cx, cy, rx, ry, n, rng) {
  const k = [];
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * i) / n;
    const j = 1 - 0.28 + rng() * 0.30;       // 0.72..1.02 — nieregularny obrys
    k.push([cx + Math.cos(a) * rx * j, cy + Math.sin(a) * ry * j]);
  }
  let d = `M ${rr(k[0][0])} ${rr(k[0][1])} `;
  for (let i = 0; i < n; i++) {
    const a = k[i];
    const b = k[(i + 1) % n];
    const rl = Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.62;
    d += `A ${rr(rl)} ${rr(rl)} 0 0 1 ${rr(b[0])} ${rr(b[1])} `;
  }
  return d + 'Z';
}

/**
 * Pojedyncze drzewo w duchu mapome: kępa liści (chmurka), nie „kula na
 * patyku". Ciemna masa cienia u podstawy, jasna korona z tuszowym konturem,
 * asymetryczny boczny pęd i krótka haczura cieniowania. Dzięki temu gęsty
 * las składa się w falistą, „ręczną" teksturę zamiast równych kółek.
 */
export function drzewo(x, y, s, rng) {
  const jx = (rng() - 0.5) * 2;
  const jy = (rng() - 0.5) * 2;
  const X = x + jx;
  const Y = y + jy;
  const r = s * (4.6 + rng() * 2.0);
  const pena = PAL.tekst;                  // tusz / kontur
  const grub = Math.max(0.6, s * 0.6);
  // ciemna masa u podstawy (pod spodem, po lewej-dole) — zza niej wystaje korona
  const cien = korona(X - r * 0.16, Y + r * 0.26, r * 0.94, r * 0.8, 7, rng);
  // asymetryczny boczny pęd (te same wypełnienie — zlewa się z koroną)
  const bocz = korona(X + r * 0.52, Y + r * 0.1, r * 0.5, r * 0.44, 6, rng);
  // główna korona (jasna), lekko w górę-lewo; jej kontur = obrys kępy
  const glow = korona(X - r * 0.05, Y - r * 0.18, r, r * 0.9, 8, rng);
  // haczura cieniowania w dolnej części korony (krótkie łuki)
  let hach = '';
  for (let i = 0; i < 3; i++) {
    const hx = X - r * 0.3 + i * r * 0.26;
    const hy = Y + r * 0.36;
    hach += `M ${rr(hx)} ${rr(hy)} a ${rr(r * 0.09)} ${rr(r * 0.16)} 0 0 1 ${rr(r * 0.2)} ${rr(-r * 0.08)} `;
  }
  return `<g class="mf-drzewo" data-x="${rr(X)}" data-y="${rr(Y)}">` +
    `<path d="${cien}" fill="${PAL.drzewoCien}" opacity="0.55"/>` +
    `<path d="${glow}" fill="${PAL.drzewo}"/>` +
    `<path d="${bocz}" fill="${PAL.drzewo}"/>` +
    `<path d="${glow}" fill="none" stroke="${pena}" stroke-width="${rr(grub)}" stroke-linejoin="round"/>` +
    `<path d="${hach}" stroke="${PAL.drzewoCien}" stroke-width="${rr(Math.max(0.7, s * 0.9))}" fill="none" opacity="0.85" stroke-linecap="round"/>` +
    `</g>`;
}

/** Las: deterministyczny rozsiew drzew w wielokącie. */
export function las(id, poly, { gestosc = 1, skala = 1, minOdst = 8, maski = null, wyklucz = null } = {}) {
  const rng = prng(`las:${id}`);
  const n = Math.round(pole(poly) / 72 * gestosc);
  // drzewa mocno zachodzą na siebie (rozstaw < średnica korony) → gęsta,
  // „ręczna" masa kęp jak mapome, zamiast rozsypanych kropek
  return rozrzut(poly, n, rng, Math.max(3, minOdst) * 0.48, maski, wyklucz)
    .map(([x, y]) => drzewo(x, y, skala, rng)).join('\n');
}

/* ---------- biome: bagno (sitowie + płytkie oczka) ---------- */

/**
 * Bagno w duchu mapome — nie pojedyncze „esy" (wyglądały jak rząd znaczków
 * „JJJ"), lecz kępka SITOWIA: kilka krótkich, lekko rozchylonych pionowych
 * kresek + co jakiś czas płytkie oczko (pozioma falka). Gęsty rozsiew
 * (mały odstęp) składa się w teksturę mokradeł zamiast rytmicznych rzędów.
 */
export function bagno(id, poly, { gestosc = 1, maski = null, wyklucz = null } = {}) {
  const rng = prng(`bagno:${id}`);
  const n = Math.round(pole(poly) / 330 * gestosc);
  return rozrzut(poly, n, rng, 7, maski, wyklucz).map(([x, y]) => {
    let out = `<g class="mf-kepka" data-x="${rr(x)}" data-y="${rr(y)}">`;
    // sitowie: 3–5 krótkich pionowych kresek (rozchylonych, o różnej wys.)
    const m = 3 + Math.floor(rng() * 3);
    for (let i = 0; i < m; i++) {
      const dx = (rng() - 0.5) * 10;
      const hgt = 6 + rng() * 5;
      out += `<path d="M ${rr(x + dx)} ${rr(y)} l ${rr((rng() - 0.5) * 1.6)} ${rr(-hgt)}" ` +
        `stroke="${PAL.bagno}" stroke-width="1" stroke-linecap="round" fill="none"/>`;
    }
    // płytkie oczko: pozioma falka (jak tafla na mapie mapome)
    if (rng() < 0.4) {
      out += `<path d="M ${rr(x - 5)} ${rr(y + 4)} q 3 -3 6 0 q 3 3 6 0" ` +
        `stroke="${PAL.wodaStroke}" stroke-width="1" fill="none" opacity="0.7" stroke-linecap="round"/>`;
    }
    return out + `</g>`;
  }).join('\n');
}

/* ---------- biome: step (krótkie kępy traw) ---------- */

export function step(id, poly, { gestosc = 1, maski = null, wyklucz = null } = {}) {
  const rng = prng(`step:${id}`);
  const n = Math.round(pole(poly) / 700 * gestosc);
  return rozrzut(poly, n, rng, 16, maski, wyklucz).map(([x, y]) =>
    `<path d="M ${rr(x - 5)} ${rr(y)} l 4 -4 M ${rr(x - 1)} ${rr(y + 1)} l 4 -5 M ${rr(x + 3)} ${rr(y - 1)} l 4 -4" ` +
    `stroke="${PAL.step}" stroke-width="1.5" stroke-linecap="round" fill="none"/>`,
  ).join('\n');
}

/* ---------- biom: lodowiec (biała nakładka + spękania) ---------- */

export function lod(id, poly, { pekniecia = 3 } = {}) {
  const rng = prng(`lod:${id}`);
  let out = `<path d="${prosta(poly, true)}" fill="${PAL.lodFill}" stroke="${PAL.wodaStroke}" stroke-width="2"/>`;
  // spękania W OBRĘBIE czapy: końce i środek wewnątrz poligonu
  // (bbox czapy jest szerszy niż lód — spękania poza czapą czyta się
  // jak linie po oceanie)
  for (let i = 0; i < pekniecia; i++) {
    let a = null; let b = null;
    for (let proby = 0; proby < 40 && !(a && b); proby++) {
      const k1 = punktWPoligonie(poly, rng);
      const k2 = punktWPoligonie(poly, rng);
      if (!k1 || !k2) continue;
      const sr = [(k1[0] + k2[0]) / 2, (k1[1] + k2[1]) / 2];
      if (Math.hypot(k2[0] - k1[0], k2[1] - k1[1]) < 60) continue;
      if (!pit(sr, poly)) continue;
      a = k1; b = k2;
    }
    if (!a || !b) continue;
    out += `<path d="${prosta(chaikin([a, [(a[0] + b[0]) / 2 + (rng() - 0.5) * 24, (a[1] + b[1]) / 2 + (rng() - 0.5) * 24], b], 2))}" ` +
      `stroke="${PAL.lodPek}" stroke-width="1.5" fill="none" opacity="0.8"/>`;
  }
  return out;
}

/** Punkt wewnątrz poligonu (rejection sampling w bboxie). */
function punktWPoligonie(poly, rng) {
  const xs = poly.map((p) => p[0]); const ys = poly.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  for (let i = 0; i < 30; i++) {
    const p = [x0 + rng() * (x1 - x0), y0 + rng() * (y1 - y0)];
    if (pit(p, poly)) return p;
  }
  return null;
}

/* ---------- pasmo górskie (glify adoptowane z mapome, ADR 0020) ---------- */

const POGLIFY = new Map(GLIFY_GORY.map((g) => [g.id, g]));

/**
 * Pojedynczy szczyt — GLIF ADOPTOWANY z mapome (ADR 0020): ręcznie rysowana
 * sylwetka klastra 1–3 szczytów (język rysunku wzorcowego, mapa Śródziemia —
 * benchmark ADR 0015). Jednolita skala po wysokości `h`, środek dolnej
 * krawędzi bboxa glifa w punkcie (x, y); `flip = -1` odbija lustro. `w` to
 * okna szerokościowa dla snowcapu i audytu (faktyczna szerokość wynika z
 * proporcji glifa). Klasa `mf-szczyt` i kotwice data-x/y bez zmian (map-audit).
 */
export function szczyt(x, y, w, h, { snieg = false, flip = 1, glifId = null } = {}) {
  const rng = prng(`szczyt:${rr(x)}:${rr(y)}:${rr(h)}:${glifId ?? 'los'}`);
  const kandydaci = glifId ? [POGLIFY.get(glifId)] : GLIFY_GORY.filter((g) => !GLIFY_GORY_HERO.includes(g.id));
  const glif = glifId ? kandydaci[0] : kandydaci[Math.floor(rng() * kandydaci.length)];
  if (!glif) throw new Error(`nieznany glif góry: ${glifId}`);
  const s = h / glif.h;
  const body = `<g transform="translate(${rr(x)} ${rr(y)}) scale(${rr(s * flip)} ${rr(s)}) ` +
    `translate(${-glif.cx} ${-glif.cy})"><path d="${glif.d}" fill="${PAL.tekst}"/></g>`;
  // śnieg — biały ząb na grzbiecie (nad sylwetką glifa)
  const sn = snieg
    ? `<path d="M ${rr(x - w * 0.18)} ${rr(y - h * 0.78)} L ${rr(x - w * 0.05)} ${rr(y - h * 0.88)} ` +
      `L ${rr(x)} ${rr(y - h)} L ${rr(x + w * 0.09)} ${rr(y - h * 0.85)} ` +
      `L ${rr(x + w * 0.17)} ${rr(y - h * 0.76)} L ${rr(x + w * 0.04)} ${rr(y - h * 0.8)} Z" fill="${PAL.snieg}"/>`
    : '';
  return `<g class="mf-szczyt" data-x="${rr(x)}" data-y="${rr(y)}">${body}${sn}</g>`;
}

/**
 * Instancje glifów pasma — geometria rozsiewu wydzielona z `pasmo()`
 * (ADR 0022, pkt d recenzji 2026-09-02): renderScena liczy z niej STREFY
 * ZAJĘTE przez góry (bbox glifu), które wykluczają rozsiew biomów —
 * lasy/bagna/stepy nie zakrywają szczytów. Zwraca listę
 * `{ x, y, w, h, flip, snieg, glifId }` (x,y = środek dolnej krawędzi).
 */
export function pasmoInstancje(id, punkty, { szer = 46, gestoscSzczytow = null, snieg = false, maski = null } = {}) {
  const naLadzie = (p) => !maski || !maski.length || maski.some((m) => pit(p, m));
  const rng = prng(`pasmo:${id}`);
  const grzbiet = chaikin(punkty, 3, false);
  const dl = dlugosc(grzbiet);
  const NORMALNE = GLIFY_GORY.filter((g) => !GLIFY_GORY_HERO.includes(g.id));

  // Liczba glifów i jednolita skala szerokościowych: krok wzdłuż grzbietu
  // ≈ dl/n; szerokość glifu ≈ 1.8×kroku (nachodzenie baz ~50%) — pasmo jest
  // ciągiem, nie kolekcją osobnych klastrów. Minimum 3 glify (krótkie pasma
  // to zwarty kłąb 3–4 szczytów, nie ściana nachodzących glifów).
  const n = gestoscSzczytow ?? Math.max(3, Math.round(dl / (szer * 0.8)));
  const krok = dl / Math.max(1, n - 1);
  const instancje = [];
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const [x, y] = punktNa(grzbiet, t);
    if (!naLadzie([x, y])) continue;              // pasmo nie pływa
    const waga = Math.sin(Math.PI * t);           // środek pasma: najszersze
    const glif = NORMALNE[Math.floor(rng() * NORMALNE.length)];
    const wGlifu = krok * 1.8 * (0.92 + waga * 0.16 + (rng() - 0.5) * 0.12);
    let hGlifu = wGlifu / (glif.w / glif.h);      // naturalne proporcje glifu
    if (hGlifu > szer * 1.25) {                   // pułap: pasmo nie rozjeżdża
      hGlifu = szer * 1.25;
    }
    const w = hGlifu * (glif.w / glif.h);
    // Podstawa glifu musi stać NA LĄDZIE także na skrzydłach — bez tego
    // skrajne glify pasma „włażą na morze" (recenzja 2026-09-02: zachodni
    // kraniec Skyfang na wodzie).
    if (!naLadzie([x - w * 0.32, y]) || !naLadzie([x + w * 0.32, y])) continue;
    instancje.push({
      x, y, h: hGlifu, w,
      flip: rng() < 0.5 ? -1 : 1,
      snieg: snieg && waga > 0.55 && rng() < 0.4,
      glifId: glif.id,
    });
  }
  return instancje;
}

/**
 * Pasmo — JEDNO LOGICZNE PASMO jako pojedyncza, spójna bryła wklejona na
 * mapę (decyzja właściciela 2026-09-02, pkt a: glify „nawsadzane góra na
 * górze, bez ładu i składu" odrzucone). Glify adoptowane (ADR 0020) układają
 * się POLEM W DŁUŻY wzdłuż wygładzonego grzbietu: bazy nachodzą na siebie
 * (~50%), więc sylwetki zlewają się w jeden ciągły grzbiet — język mapome
 * (mapa Śródziemia). Wielkości PODOBNE (szerokości baz ±~10%; wysokości
 * wynikają z naturalnych proporcji glifu, więc szczyty mają różne wysokości
 * jak w prawdziwym pasmie — bez przytłaczania większych mniejszych).
 * Bez rozrzutu pionowego i bez osobnego rzędu pogórza.
 * Mega-klastery (hero) tylko jawnie przez `szczyt(..., { glifId })`.
 * Deterministyczne (rng z hasha id, ADR 0018 pkt 3).
 */
export function pasmo(id, punkty, opcje = {}) {
  // Rysujemy wzdłuż grzbietu (t rośnie) — późniejszy glif nachodzi na
  // poprzedni z jednej strony, jak kolejne partie tego samego grzbietu.
  return pasmoInstancje(id, punkty, opcje).map((s) =>
    szczyt(s.x, s.y, s.w, s.h, { snieg: s.snieg, flip: s.flip, glifId: s.glifId })).join('\n');
}

/* ---------- wulkan (stożek z kraterem i lazem dymu) ---------- */

export function wulkan(x, y, { skala = 1, dym = true } = {}) {
  const w = 20 * skala;
  const h = 26 * skala;
  return `<g class="mf-wulkan" data-x="${rr(x)}" data-y="${rr(y)}">` +
    `<path d="M ${rr(x - w)} ${rr(y)} L ${rr(x - w * 0.22)} ${rr(y - h * 0.82)} L ${rr(x)} ${rr(y - h * 0.7)} L ${rr(x + w * 0.22)} ${rr(y - h * 0.82)} L ${rr(x + w)} ${rr(y)} Z" ` +
    `fill="${PAL.skala}" stroke="${PAL.skalaCien}" stroke-width="1.8" stroke-linejoin="round"/>` +
    (PAL.tryb === 'tusz'
      ? `<path d="M ${rr(x - w * 0.72)} ${rr(y - h * 0.14)} L ${rr(x - w * 0.34)} ${rr(y - h * 0.5)} M ${rr(x - w * 0.52)} ${rr(y - h * 0.08)} L ${rr(x - w * 0.2)} ${rr(y - h * 0.38)}" ` +
        `stroke="${PAL.skalaCien}" stroke-width="1" fill="none" opacity="0.85"/>`
      : `<path d="M ${rr(x - w)} ${rr(y)} L ${rr(x - w * 0.22)} ${rr(y - h * 0.82)} L ${rr(x - w * 0.05)} ${rr(y)} Z" fill="${PAL.skalaCien}" opacity="0.45"/>`) +
    `<ellipse cx="${rr(x - w * 0.02)}" cy="${rr(y - h * 0.74)}" rx="${rr(w * 0.2)}" ry="${rr(skala * 1.8)}" fill="${PAL.krater}"/>` +
    (dym ? `<path d="M ${rr(x)} ${rr(y - h * 0.86)} q ${rr(6 * skala)} ${rr(-9 * skala)} 0 ${rr(-16 * skala)} q ${rr(-6 * skala)} ${rr(-7 * skala)} ${rr(2 * skala)} ${rr(-13 * skala)}" ` +
      `stroke="${PAL.dym}" stroke-width="${rr(2.4 * skala)}" fill="none" opacity="0.65" stroke-linecap="round"/>` : '') +
    `</g>`;
}

/* ---------- rzeka (wstęga o rosnącej szerokości; kolor akwenu — ADR 0020) ---------- */

/**
 * Rzeka jako wstęga stożkowa (źródło wąskie, ujście szerokie). Jeden kolor
 * wody wszędzie (ADR 0020 + pkt d, 2026-09-02): rzeka ma identyczny kolor
 * co morze I jeziora — wpływając do akwenu „rozmywa się" w nim (zlewa się,
 * nie tnie). Brak gradientu, brak opacity i BRAK OBWÓDKI — obwódka wstęgi
 * (pkt c) wycofana decyzją właściciela 2026-09-02: obrysowany „język"
 * ujścia w morzu wyglądał źle; zamiast tego przyciemniono kolor wody
 * (kontrast z papierem) — ADR 0023.
 */
export function rzeka(id, punkty, { s0 = 3, s1 = 9, zrodlo = true } = {}) {
  const { d } = wstega(punkty, s0, s1);
  const kolor = PAL.woda;
  const pocz = punkty[0];
  return (zrodlo ? `<circle cx="${rr(pocz[0])}" cy="${rr(pocz[1])}" r="${rr(s0 * 0.7)}" fill="${kolor}"/>` : '') +
    `<path d="${d}" fill="${kolor}"/>`;
}

/** Dopływ — cieńsza wstęga wpadająca do rzeki głównej. */
export function doplyw(id, punkty, { s0 = 1.5, s1 = 3.5 } = {}) {
  return rzeka(id, punkty, { s0, s1, zrodlo: false });
}

/* ---------- jezioro (tafla + linia brzegowa + fale) ---------- */

/**
 * Jezioro/akwen. Dwa tryby:
 *  - elipsa `{ cx, cy, rx, ry }` (domyślny),
 *  - nieregularna tafla `{ d }` — własna ścieżka zamknięta (morza
 *    śródlądowe, zatoki; Audyt 2026-09-01 — Halimar). Przy `d` współrzędne
 *    `cx/cy/rx/ry` są opcjonalne i służą tylko do fal/dekoru (gdy podane).
 */
export function jezioro({ cx, cy, rx, ry, d } = {}, { fale = true, obrys = 2 } = {}) {
  if (d) {
    let out = `<path d="${d}" fill="${PAL.woda}" stroke="${PAL.wodaStroke}" stroke-width="${obrys}"/>`;
    if (fale && cx != null && ry) {
      out += `<path d="M ${rr(cx - rx * 0.35)} ${rr(cy + ry * 0.15)} q ${rr(rx * 0.15)} ${rr(-ry * 0.2)} ${rr(rx * 0.3)} 0" stroke="${PAL.wodaStroke}" stroke-width="1.4" fill="none" opacity="0.6"/>`;
    }
    return out;
  }
  let out = `<ellipse cx="${rr(cx)}" cy="${rr(cy)}" rx="${rr(rx)}" ry="${rr(ry)}" fill="${PAL.woda}" stroke="${PAL.wodaStroke}" stroke-width="${obrys}"/>`;
  out += `<ellipse cx="${rr(cx)}" cy="${rr(cy)}" rx="${rr(rx * 0.82)}" ry="${rr(ry * 0.82)}" fill="none" stroke="${PAL.wodaStroke}" stroke-width="1" opacity="0.35"/>`;
  if (fale) {
    out += `<path d="M ${rr(cx - rx * 0.4)} ${rr(cy + ry * 0.15)} q ${rr(rx * 0.15)} ${rr(-ry * 0.18)} ${rr(rx * 0.3)} 0" stroke="${PAL.wodaStroke}" stroke-width="1.4" fill="none" opacity="0.6"/>`;
  }
  return out;
}

/* ---------- drogi i szlaki (kropka jak w line-art mapome) ---------- */

export function droga(id, punkty, { typ = 'szlak' } = {}) {
  const d = gladka(chaikin(punkty, 2));
  if (typ === 'szlak') {
    return `<path d="${d}" stroke="${PAL.droga}" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-dasharray="0 9"/>`;
  }
  return `<path d="${d}" stroke="${PAL.droga}" stroke-width="2.6" fill="none" stroke-dasharray="10 7"/>`;
}

/* ---------- POI: osady i ruiny ---------- */

/**
 * Miasto (osada) w duchu mapome — nie „sześciany na łuku", lecz zwarta
 * gromadka małych domków z dwuspadowym dachem, tworząca czytelną osadę
 * na tle mapy. Kilka budynków w nieregularnym szyku.
 * Kolor = `PAL.skalaCien` (SZARY, jak ruiny) — decyzja właściciela
 * 2026-09-02 pkt c: czarne miasto „zlewa się" z czarnymi górami.
 */
export function miasto(x, y, { skala = 1 } = {}) {
  const s = skala;
  const dom = (hx, hy, sw, wh) =>
    `<path d="M ${rr(hx - sw)} ${rr(hy + wh * 0.4)} L ${rr(hx - sw)} ${rr(hy - wh * 0.6)} ` +
    `L ${rr(hx)} ${rr(hy - wh)} L ${rr(hx + sw)} ${rr(hy - wh * 0.6)} L ${rr(hx + sw)} ${rr(hy + wh * 0.4)} Z" fill="${PAL.skalaCien}"/>`;
  const ukl = [
    [-6, 1, 3, 4], [1, -1, 3.2, 4.4], [6, 2, 2.6, 3.6],
    [-2, -6, 3.4, 4.6], [5, -6, 2.4, 3.2], [3, 5, 2.6, 3.6], [-5, 6, 2.8, 3.8],
  ];
  // Ikona wpisana w KOŁO z nieprzezroczystym tłem (recenzja 2026-09-02:
  // osady ginęły w rozsiewie bagien/lasów) — tło = kolor lądu.
  let out = `<g class="mf-miasto" data-x="${rr(x)}" data-y="${rr(y)}">` +
    `<circle cx="${rr(x)}" cy="${rr(y)}" r="${rr(12.5 * s)}" fill="${PAL.lad}" stroke="${PAL.skalaCien}" stroke-width="${rr(1.1 * s)}"/>`;
  for (const [dx, dy, sw, wh] of ukl) out += dom(x + dx * s, y + dy * s, sw * s, wh * s);
  return out + `</g>`;
}

/**
 * Ruina w duchu mapome — kilka ZŁAMANYCH kolumn (krótkie, z ukośnym
 * „urwanym" szczytem), przewrócona belka i kamyki gruzu. Zamiast
 * wcześniejszego „łuku z kropką" (nieczytelne).
 */
export function ruina(x, y, { skala = 1 } = {}) {
  const s = skala;
  const kol = (bx, by, hgt, wdt, zlam) =>
    `<path d="M ${rr(bx)} ${rr(by)} L ${rr(bx)} ${rr(by - hgt)} M ${rr(bx + wdt)} ${rr(by)} L ${rr(bx + wdt)} ${rr(by - hgt)} ` +
    `M ${rr(bx)} ${rr(by - hgt)} L ${rr(bx + wdt)} ${rr(by - hgt + zlam)}" ` +
    `stroke="${PAL.skalaCien}" stroke-width="${rr(1.9 * s)}" fill="none" stroke-linecap="round"/>`;
  // Koło z nieprzezroczystym tłem — jak miasto (ADR 0024).
  let out = `<g class="mf-ruina" data-x="${rr(x)}" data-y="${rr(y)}">` +
    `<circle cx="${rr(x)}" cy="${rr(y + 1.5 * s)}" r="${rr(11 * s)}" fill="${PAL.lad}" stroke="${PAL.skalaCien}" stroke-width="${rr(1 * s)}"/>`;
  out += kol(x - 7 * s, y + 3 * s, 6 * s, 2.6 * s, 3 * s);
  out += kol(x - 1 * s, y + 4 * s, 4 * s, 2.4 * s, -2.4 * s);
  out += kol(x + 5 * s, y + 3 * s, 7 * s, 2.6 * s, 2.4 * s);
  // przewrócona belka (gruz) u dołu + kamyki
  out += `<path d="M ${rr(x - 9 * s)} ${rr(y + 6 * s)} l ${rr(15 * s)} ${rr(-1 * s)}" stroke="${PAL.skalaCien}" stroke-width="${rr(2 * s)}" stroke-linecap="round"/>`;
  out += `<circle cx="${rr(x + 6 * s)}" cy="${rr(y + 6 * s)}" r="${rr(1.3 * s)}" fill="${PAL.skalaCien}"/>`;
  out += `<circle cx="${rr(x - 3 * s)}" cy="${rr(y + 7 * s)}" r="${rr(1 * s)}" fill="${PAL.skalaCien}"/>`;
  return out + `</g>`;
}

/** Hedron: kamienny pierścień z rysunkiem (dryfujący — opacity). */
export function hedron(x, y, { skala = 1, opacity = 1 } = {}) {
  const s = skala;
  const r = 9 * s;
  const pk = (k) => `${rr(x + r * Math.cos((Math.PI / 3) * k))} ${rr(y + r * Math.sin((Math.PI / 3) * k))}`;
  return `<g class="mf-hedron" data-x="${rr(x)}" data-y="${rr(y)}" opacity="${opacity}">` +
    `<path d="M ${[0, 1, 2, 3, 4, 5].map(pk).join(' L ')} Z" fill="${PAL.kamien}" stroke="${PAL.skalaCien}" stroke-width="${rr(1.8 * s)}" stroke-linejoin="round"/>` +
    `<path d="M ${pk(0)} L ${pk(3)} M ${pk(1)} L ${pk(4)}" stroke="${PAL.skalaCien}" stroke-width="1" opacity="0.6"/>` +
    `</g>`;
}

/* ---------- etykiety ---------- */

/** Etykieta z halo; `kat` obraca wokół punktu (deg, zgodnie z ruchem
 *  wskazówek). `przy = [ax, ay, r]` (etykiety obiektowe, ADR 0022) emituje
 *  data-atrybuty kotwicy obiektu — nakładka ekranowa Codexu liczy z nich
 *  pozycję zależną od zoomu (stała WIZUALNA odległość od ikony). */
export function etykieta(tekst, x, y, { kat = 0, fs = 15, ital = false, kolor = null, duze = false, kotwica = 'middle', przy = null } = {}) {
  const transform = kat ? ` transform="rotate(${zaokr(kat, 1)} ${rr(x)} ${rr(y)})"` : '';
  const kl = duze ? 'tytul-kontynentu' : null;
  const fill = kolor ?? PAL.etykieta;
  const dataPrzy = przy ? ` data-ax="${rr(przy[0])}" data-ay="${rr(przy[1])}" data-r="${rr(przy[2])}"` : '';
  return `<text x="${rr(x)}" y="${rr(y)}" font-size="${fs}"${ital ? ' font-style="italic"' : ''} fill="${fill}"${kl ? ` class="${kl}"` : ''} text-anchor="${kotwica}"${dataPrzy}${transform}>${tekst}</text>`;
}

/** Etykieta po łuku ( zatoki, doliny ) — path w defs + textPath. */
export function lukEtykieta(id, punkty, tekst, { fs = 16, ital = true, kolor = null } = {}) {
  const d = gladka(chaikin(punkty, 2));
  const fill = kolor ?? PAL.etykieta;
  return `<path id="mf-luk-${id}" d="${d}" fill="none"/>` +
    `\n<text font-size="${fs}"${ital ? ' font-style="italic"' : ''} fill="${fill}">` +
    `<textPath href="#mf-luk-${id}" startOffset="50%" text-anchor="middle">${tekst}</textPath></text>`;
}

/* ---------- oprawa mapy ---------- */

export function kompas(x, y, r) {
  const prom = (k, dl) => {
    const a = (Math.PI / 180) * (k * 45 - 90);
    return `<path d="M ${rr(x + Math.cos(a) * r * 0.18)} ${rr(y + Math.sin(a) * r * 0.18)} L ${rr(x + Math.cos(a) * r * dl)} ${rr(y + Math.sin(a) * r * dl)}" stroke="${PAL.tekst}" stroke-width="${dl > 0.6 ? 2.4 : 1.4}" stroke-linecap="round"/>`;
  };
  let out = `<circle cx="${rr(x)}" cy="${rr(y)}" r="${rr(r)}" fill="none" stroke="${PAL.tekst}" stroke-width="1.2" opacity="0.7"/>`;
  out += `<circle cx="${rr(x)}" cy="${rr(y)}" r="${rr(r * 0.18)}" fill="${PAL.tekst}"/>`;
  for (let k = 0; k < 8; k++) out += prom(k, k % 2 === 0 ? 0.95 : 0.6);
  out += `<text x="${rr(x)}" y="${rr(y - r - 6)}" font-size="15" text-anchor="middle" fill="${PAL.tekst}">N</text>`;
  return out;
}

export function ramka(szer, wys, { margines = 22 } = {}) {
  const m = margines;
  return `<rect x="${m}" y="${m}" width="${szer - 2 * m}" height="${wys - 2 * m}" fill="none" stroke="${PAL.tekst}" stroke-width="2.5"/>` +
    `<rect x="${m + 6}" y="${m + 6}" width="${szer - 2 * m - 12}" height="${wys - 2 * m - 12}" fill="none" stroke="${PAL.tekst}" stroke-width="1" opacity="0.6"/>`;
}

export function skalaLinia(x, y, { px = 150, km = 150, segmenty = 4 } = {}) {
  const seg = px / segmenty;
  let out = '';
  for (let i = 0; i < segmenty; i++) {
    out += `<rect x="${rr(x + i * seg)}" y="${rr(y)}" width="${rr(seg)}" height="6" fill="${i % 2 ? PAL.halo : PAL.tekst}" stroke="${PAL.tekst}" stroke-width="1"/>`;
  }
  out += `<text x="${rr(x + px / 2)}" y="${rr(y + 20)}" font-size="13" text-anchor="middle" fill="${PAL.tekst}">${km} mil</text>`;
  return out;
}
