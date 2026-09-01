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

/** Paleta bazowa = motyw „pergamin" (ADR 0008). */
export const PAL = {
  lad: '#e8dbb8', ladStroke: '#a89468',
  woda: '#ccd8d2', wodaGleb: '#b9cdd8', wodaStroke: '#7fa0b4',
  rzeka: '#5b8ba6',
  tekst: '#4a3a28', ital: '#6b5d52', halo: '#f4ecd8',
  drzewo: '#7a8a5a', drzewoCien: '#5c6b44', pienn: '#6b5d52',
  bagno: '#6f8a72', step: '#b5a877',
  skala: '#d8c9a3', skalaCien: '#8a7550', skalaLinia: '#a89468',
  droga: '#8a7550',
  lodFill: '#eef0e6', lodPek: '#c9d4d6', snieg: '#f6f4ec',
  krater: '#7a4a3a', dym: '#9aa3a8', mur: '#c9b98f', kamien: '#cfc4a0',
  poswiataKolor: '#b9cdd8',
  poswiata: [{ w: 12, o: 0.10 }, { w: 7, o: 0.16 }, { w: 3, o: 0.24 }],
  oceanPlamy: true,
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
    lad: '#f5f5f5', ladStroke: '#3f3f3f',
    woda: '#e9e9e9', wodaGleb: '#dcdcdc', wodaStroke: '#8f8f8f',
    rzeka: '#5a5a5a',
    tekst: '#1c1c1c', ital: '#3f3f3f', halo: '#f5f5f5',
    drzewo: '#dedede', drzewoCien: '#c3c3c3', pienn: '#3f3f3f',
    bagno: '#5f5f5f', step: '#9b9b9b',
    skala: '#eaeaea', skalaCien: '#6b6b6b', skalaLinia: '#8f8f8f',
    droga: '#3f3f3f',
    lodFill: '#fafafa', lodPek: '#bdbdbd', snieg: '#ffffff',
    krater: '#4a4a4a', dym: '#909090', mur: '#d9d9d9', kamien: '#cfcfcf',
    poswiataKolor: '#9f9f9f',
    poswiata: [{ w: 10, o: 0.35 }, { w: 5.5, o: 0.5 }, { w: 2, o: 0.9 }],
    oceanPlamy: true,
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
export function las(id, poly, { gestosc = 1, skala = 1, minOdst = 8, maski = null } = {}) {
  const rng = prng(`las:${id}`);
  const n = Math.round(pole(poly) / 72 * gestosc);
  // drzewa mocno zachodzą na siebie (rozstaw < średnica korony) → gęsta,
  // „ręczna" masa kęp jak mapome, zamiast rozsypanych kropek
  return rozrzut(poly, n, rng, Math.max(3, minOdst) * 0.48, maski)
    .map(([x, y]) => drzewo(x, y, skala, rng)).join('\n');
}

/* ---------- biome: bagno (sitowie + płytkie oczka) ---------- */

/**
 * Bagno w duchu mapome — nie pojedyncze „esy" (wyglądały jak rząd znaczków
 * „JJJ"), lecz kępka SITOWIA: kilka krótkich, lekko rozchylonych pionowych
 * kresek + co jakiś czas płytkie oczko (pozioma falka). Gęsty rozsiew
 * (mały odstęp) składa się w teksturę mokradeł zamiast rytmicznych rzędów.
 */
export function bagno(id, poly, { gestosc = 1, maski = null } = {}) {
  const rng = prng(`bagno:${id}`);
  const n = Math.round(pole(poly) / 480 * gestosc);
  return rozrzut(poly, n, rng, 9, maski).map(([x, y]) => {
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

export function step(id, poly, { gestosc = 1, maski = null } = {}) {
  const rng = prng(`step:${id}`);
  const n = Math.round(pole(poly) / 700 * gestosc);
  return rozrzut(poly, n, rng, 16, maski).map(([x, y]) =>
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

/* ---------- pasmo górskie (grzbiet + szczyty z faseta cienia) ---------- */

/**
 * Pojedynczy szczyt w duchu mapome — ręcznie rysowany, cieniowany „żagiel":
 * asymetryczny wierzchołek (lewa wypukła, prawa wklęsła), ciemniejsza faseta
 * po prawej i GĘSTE kreskowanie na cienistej ścianie (wiele krótkich,
 * równoległych pociągnięć jak na mapie mapome) oraz parę jasnych kresek
 * na oświetlonej (lewej) stronie. `lean` przesuwa wierzchołek (jitter
 * w pasmie), dzięki czemu grzbiety składają się w chwiejną, naturalną linię.
 */
export function szczyt(x, y, w, h, { snieg = false, lean = 0 } = {}) {
  const Pk = [x + lean * w, y - h];                 // wierzchołek (przesunięty)
  const L = [x - w, y];
  const R = [x + w, y];
  // lewa krawędź — wypukła na zewnątrz; prawa — wklęsła („żagiel")
  const c1 = [x - w * 0.9, y - h * 0.6];
  const cR = [x + w * 0.02, y - h * 0.5];
  const cR2 = [x + w * 0.7, y - h * 0.52];
  const kontur = `M ${rr(L[0])} ${rr(L[1])} C ${rr(c1[0])} ${rr(c1[1])}, ` +
    `${rr(Pk[0] - w * 0.1)} ${rr(Pk[1])}, ${rr(Pk[0])} ${rr(Pk[1])} ` +
    `C ${rr(cR[0])} ${rr(cR[1])}, ${rr(cR2[0])} ${rr(cR2[1])}, ${rr(R[0])} ${rr(R[1])} Z`;
  // cień: prawa połowa (od szczytu opadająca do podstawy) — ciemniejsza faseta
  const cienD = `M ${rr(Pk[0])} ${rr(Pk[1])} C ${rr(cR[0])} ${rr(cR[1])}, ` +
    `${rr(cR2[0])} ${rr(cR2[1])}, ${rr(R[0])} ${rr(R[1])} L ${rr(Pk[0] + w * 0.08)} ${rr(y)} Z`;
  // GĘSTE kreskowanie na cienistej ścianie (od grzbietu do podstawy)
  let hach = '';
  const NH = 7;
  for (let i = 0; i < NH; i++) {
    const f = (i + 0.5) / NH;
    const ax = Pk[0] + (R[0] - Pk[0]) * f;
    const ay = Pk[1] + (y - Pk[1]) * f;
    const bx = ax - w * 0.05;
    const by = y;
    hach += `M ${rr(ax)} ${rr(ay)} L ${rr(bx)} ${rr(by)} `;
  }
  // jasne kreski na oświetlonej (lewej) ścianie — podkreślają wypukłość
  let os = '';
  const NL = 3;
  for (let i = 0; i < NL; i++) {
    const f = (i + 0.5) / NL;
    const ax = Pk[0] + (L[0] - Pk[0]) * f;
    const ay = Pk[1] + (y - Pk[1]) * f;
    os += `M ${rr(ax)} ${rr(ay)} L ${rr(ax + w * 0.04)} ${rr(ay + h * 0.12)} `;
  }
  const sn = snieg
    ? `<path d="M ${rr(Pk[0] - w * 0.22)} ${rr(Pk[1] + h * 0.16)} L ${rr(Pk[0])} ${rr(Pk[1])} ` +
      `L ${rr(Pk[0] + w * 0.16)} ${rr(Pk[1] + h * 0.18)} L ${rr(Pk[0] + w * 0.06)} ${rr(Pk[1] + h * 0.28)} ` +
      `L ${rr(Pk[0] - w * 0.06)} ${rr(Pk[1] + h * 0.3)} Z" fill="${PAL.snieg}"/>`
    : '';
  return `<g class="mf-szczyt" data-x="${rr(x)}" data-y="${rr(y)}">` +
    `<path d="${kontur}" fill="${PAL.skala}" stroke="${PAL.tekst}" stroke-width="1.4" stroke-linejoin="round"/>` +
    `<path d="${cienD}" fill="${PAL.skalaCien}" opacity="0.55"/>` +
    `<path d="${hach}" stroke="${PAL.skalaCien}" stroke-width="0.9" fill="none" opacity="0.9" stroke-linecap="round"/>` +
    `<path d="${os}" stroke="${PAL.halo}" stroke-width="0.8" fill="none" opacity="0.8" stroke-linecap="round"/>` +
    sn +
    `</g>`;
}

/**
 * Pasmo: linia grzbietu (wygładzona) + szczyty rozmieszczone wzdłuż niej,
 * na przemian po obu stronach, wyższe w centrum, niższe na krańcach
 * (naturalny profil masywu). `przedgorze` dosypuje drobne wzgórza wokół.
 */
export function pasmo(id, punkty, { szer = 46, gestoscSzczytow = null, snieg = false, przedgorze = true, maski = null, liniaGrzbietu = false } = {}) {
  const naLadzie = (p) => !maski || !maski.length || maski.some((m) => pit(p, m));
  const rng = prng(`pasmo:${id}`);
  const grzbiet = chaikin(punkty, 3, false);
  const n = gestoscSzczytow ?? Math.max(3, Math.round(dlugosc(grzbiet) / 80));
  // linia grzbietu domyślnie WYŁĄCZONA: przygaszona kreska przez pasmo czyta
  // się jak droga (feedback właściciela) — szczyty same składają się w pasmo
  let out = liniaGrzbietu ? `<path d="${gladka(grzbiet)}" stroke="${PAL.skalaCien}" stroke-width="2" fill="none" opacity="0.3"/>` : '';
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const [x, y] = punktNa(grzbiet, t);
    const waga = Math.sin(Math.PI * t); // wyżej w środku pasma
    const h = szer * (0.7 + waga * 0.55 + rng() * 0.25);
    const w = szer * (0.5 + rng() * 0.22);
    const strona = i % 2 === 0 ? 1 : -1;
    const dx = strona * szer * 0.18;   // ciaśniej → szczyty nachodzą na siebie
    // maska lądu: kandydat offsetowy, potem bez offsetu, w ostateczności brak
    const kandydat = [x + dx, y + Math.abs(dx) * 0.12];
    const pozycja = naLadzie(kandydat) ? kandydat : (naLadzie([x, y]) ? [x, y] : null);
    if (pozycja) out += szczyt(pozycja[0], pozycja[1], w, h, {
      snieg: snieg && waga > 0.55,
      lean: (rng() - 0.5) * 0.55,
    });
  }
  if (przedgorze) {
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      const [x, y] = punktNa(grzbiet, t);
      const strona = i % 2 === 0 ? -1 : 1;
      const px = x + strona * szer * (0.5 + rng() * 0.2);
      const py = y + szer * 0.22;
      if (!naLadzie([px, py])) continue;          // przedgórze nie pływa
      out += szczyt(px, py, szer * 0.24, szer * (0.3 + rng() * 0.14), {
        lean: (rng() - 0.5) * 0.7,
      });
    }
  }
  return out;
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

/* ---------- rzeka (wstęga o rosnącej szerokości) ---------- */

export function rzeka(id, punkty, { s0 = 3, s1 = 9, zrodlo = true } = {}) {
  const { d } = wstega(punkty, s0, s1);
  const pocz = punkty[0];
  return (zrodlo ? `<circle cx="${rr(pocz[0])}" cy="${rr(pocz[1])}" r="${rr(s0 * 0.7)}" fill="${PAL.rzeka}"/>` : '') +
    `<path d="${d}" fill="${PAL.rzeka}" opacity="0.9"/>`;
}

/** Dopływ — cieńsza wstęga wpadająca do rzeki głównej. */
export function doplyw(id, punkty, { s0 = 1.5, s1 = 3.5 } = {}) {
  return rzeka(id, punkty, { s0, s1, zrodlo: false });
}

/* ---------- jezioro (tafla + linia brzegowa + fale) ---------- */

export function jezioro({ cx, cy, rx, ry } = {}, { fale = true, obrys = 2 } = {}) {
  let out = `<ellipse cx="${rr(cx)}" cy="${rr(cy)}" rx="${rr(rx)}" ry="${rr(ry)}" fill="${PAL.wodaGleb}" stroke="${PAL.wodaStroke}" stroke-width="${obrys}"/>`;
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

/** Miasto: mur łukiem + bloki zabudowy + punkt. */
export function miasto(x, y, { skala = 1 } = {}) {
  const s = skala;
  return `<g class="mf-miasto" data-x="${rr(x)}" data-y="${rr(y)}">` +
    `<path d="M ${rr(x - 10 * s)} ${rr(y + 3 * s)} a 10 ${7 * s} 0 0 1 ${20 * s} 0" fill="${PAL.mur}" stroke="${PAL.skalaCien}" stroke-width="1.4"/>` +
    `<rect x="${rr(x - 5 * s)}" y="${rr(y - 3 * s)}" width="${rr(4.5 * s)}" height="${rr(4 * s)}" fill="${PAL.tekst}"/>` +
    `<rect x="${rr(x + 0.5 * s)}" y="${rr(y - 1 * s)}" width="${rr(4 * s)}" height="${rr(4.5 * s)}" fill="${PAL.tekst}"/>` +
    `<rect x="${rr(x - 8 * s)}" y="${rr(y - 0.5 * s)}" width="${rr(4 * s)}" height="${rr(3.5 * s)}" fill="${PAL.tekst}"/>` +
    `<circle cx="${rr(x + 7 * s)}" cy="${rr(y - 4 * s)}" r="${rr(1.6 * s)}" fill="${PAL.tekst}"/>` +
    `</g>`;
}

/** Ruina: przerwane mury + przewrócone kolumny. */
export function ruina(x, y, { skala = 1 } = {}) {
  const s = skala;
  return `<g class="mf-ruina" data-x="${rr(x)}" data-y="${rr(y)}">` +
    `<path d="M ${rr(x - 9 * s)} ${rr(y + 2 * s)} a 9 ${8 * s} 0 0 1 ${7 * s} -9" fill="none" stroke="${PAL.skalaCien}" stroke-width="${rr(2.2 * s)}" stroke-linecap="round"/>` +
    `<path d="M ${rr(x + 5 * s)} ${rr(y - 4 * s)} a 6 ${6 * s} 0 0 1 4 ${8 * s}" fill="none" stroke="${PAL.skalaCien}" stroke-width="${rr(2 * s)}" stroke-linecap="round"/>` +
    `<path d="M ${rr(x - 2 * s)} ${rr(y + 5 * s)} l ${rr(6 * s)} ${rr(2 * s)}" stroke="${PAL.skalaCien}" stroke-width="${rr(2 * s)}" stroke-linecap="round"/>` +
    `<circle cx="${rr(x - 4 * s)}" cy="${rr(y + 3 * s)}" r="${rr(1.5 * s)}" fill="${PAL.skalaCien}"/>` +
    `</g>`;
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

/** Etykieta z halo; `kat` obraca wokół punktu (deg, zgodnie z ruchem wskazówek). */
export function etykieta(tekst, x, y, { kat = 0, fs = 15, ital = false, kolor = null, duze = false, kotwica = 'middle' } = {}) {
  const transform = kat ? ` transform="rotate(${zaokr(kat, 1)} ${rr(x)} ${rr(y)})"` : '';
  const kl = duze ? 'tytul-kontynentu' : null;
  return `<text x="${rr(x)}" y="${rr(y)}" font-size="${fs}"${ital ? ' font-style="italic"' : ''}${kolor ? ` fill="${kolor}"` : ''}${kl ? ` class="${kl}"` : ''} text-anchor="${kotwica}"${transform}>${tekst}</text>`;
}

/** Etykieta po łuku ( zatoki, doliny ) — path w defs + textPath. */
export function lukEtykieta(id, punkty, tekst, { fs = 16, ital = true, kolor = null } = {}) {
  const d = gladka(chaikin(punkty, 2));
  return `<path id="mf-luk-${id}" d="${d}" fill="none"/>` +
    `\n<text font-size="${fs}"${ital ? ' font-style="italic"' : ''}${kolor ? ` fill="${kolor}"` : ` fill="${PAL.ital}"`}>` +
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
