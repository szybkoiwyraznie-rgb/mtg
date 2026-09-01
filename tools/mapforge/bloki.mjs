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
  punktNa, wstega,
} from './geom.mjs';

export const PAL = {
  lad: '#e8dbb8', ladStroke: '#a89468',
  woda: '#ccd8d2', wodaGleb: '#b9cdd8', wodaStroke: '#7fa0b4',
  rzeka: '#5b8ba6',
  tekst: '#4a3a28', ital: '#6b5d52', halo: '#f4ecd8',
  drzewo: '#7a8a5a', drzewoCien: '#5c6b44', pienn: '#6b5d52',
  bagno: '#6f8a72', step: '#b5a877',
  skala: '#d8c9a3', skalaCien: '#8a7550', skalaLinia: '#a89468',
  droga: '#8a7550',
};

const rr = (v) => zaokr(v);

/* ---------- biome: las (kępy koron + pnie) ---------- */

/** Pojedyncze drzewo (korona z cieniem + pień). */
export function drzewo(x, y, s, rng) {
  const jx = (rng() - 0.5) * 2;
  const jy = (rng() - 0.5) * 2;
  const r = s * (3.6 + rng() * 1.6);
  return `<g class="mf-drzewo">` +
    `<path d="M ${rr(x + jx)} ${rr(y + jy)} l 0 ${rr(s * 2.4)}" stroke="${PAL.pienn}" stroke-width="${rr(s * 0.7)}"/>` +
    `<circle cx="${rr(x + jx - r * 0.42)}" cy="${rr(y + jy + r * 0.22)}" r="${rr(r * 0.72)}" fill="${PAL.drzewoCien}" opacity="0.6"/>` +
    `<circle cx="${rr(x + jx)}" cy="${rr(y + jy - r * 0.18)}" r="${rr(r)}" fill="${PAL.drzewo}"/>` +
    `</g>`;
}

/** Las: deterministyczny rozsiew drzew w wielokącie. */
export function las(id, poly, { gestosc = 1, skala = 1, minOdst = 15 } = {}) {
  const rng = prng(`las:${id}`);
  const n = Math.round(pole(poly) / 240 * gestosc);
  return rozrzut(poly, n, rng, minOdst * skala)
    .map(([x, y]) => drzewo(x, y, skala, rng)).join('\n');
}

/* ---------- biome: bagno (kępki turzyc + płytkie oczka) ---------- */

export function bagno(id, poly, { gestosc = 1 } = {}) {
  const rng = prng(`bagno:${id}`);
  const n = Math.round(pole(poly) / 620 * gestosc);
  return rozrzut(poly, n, rng, 18).map(([x, y]) => {
    const k = (rng() - 0.5) * 2;
    return `<g class="mf-kepka">` +
      `<path d="M ${rr(x - 7)} ${rr(y)} q 3 -9 6 0 M ${rr(x - 1)} ${rr(y + k)} q 3 -10 6 0 M ${rr(x + 4)} ${rr(y - k)} q 3 -8 6 0" ` +
      `stroke="${PAL.bagno}" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
      (rng() < 0.3 ? `<ellipse cx="${rr(x + 9)}" cy="${rr(y + 5)}" rx="5" ry="2.6" fill="${PAL.wodaGleb}" opacity="0.55"/>` : '') +
      `</g>`;
  }).join('\n');
}

/* ---------- biome: step (krótkie kępy traw) ---------- */

export function step(id, poly, { gestosc = 1 } = {}) {
  const rng = prng(`step:${id}`);
  const n = Math.round(pole(poly) / 700 * gestosc);
  return rozrzut(poly, n, rng, 16).map(([x, y]) =>
    `<path d="M ${rr(x - 5)} ${rr(y)} l 4 -4 M ${rr(x - 1)} ${rr(y + 1)} l 4 -5 M ${rr(x + 3)} ${rr(y - 1)} l 4 -4" ` +
    `stroke="${PAL.step}" stroke-width="1.5" stroke-linecap="round" fill="none"/>`,
  ).join('\n');
}

/* ---------- biom: lodowiec (biała nakładka + spękania) ---------- */

export function lod(id, poly, { pekniecia = 3 } = {}) {
  const rng = prng(`lod:${id}`);
  const { x0, x1, y0, y1 } = { x0: Math.min(...poly.map((p) => p[0])), x1: Math.max(...poly.map((p) => p[0])), y0: Math.min(...poly.map((p) => p[1])), y1: Math.max(...poly.map((p) => p[1])) };
  let out = `<path d="${prosta(poly, true)}" fill="#eef0e6" stroke="${PAL.wodaStroke}" stroke-width="2"/>`;
  for (let i = 0; i < pekniecia; i++) {
    const a = [x0 + rng() * (x1 - x0), y0 + rng() * (y1 - y0)];
    const b = [x0 + rng() * (x1 - x0), y0 + rng() * (y1 - y0)];
    out += `<path d="${prosta(chaikin([a, [(a[0] + b[0]) / 2 + (rng() - 0.5) * 30, (a[1] + b[1]) / 2 + (rng() - 0.5) * 30], b], 2))}" ` +
      `stroke="#c9d4d6" stroke-width="1.5" fill="none" opacity="0.8"/>`;
  }
  return out;
}

/* ---------- pasmo górskie (grzbiet + szczyty z faseta cienia) ---------- */

/** Pojedynczy szczyt: główna ściana + oświetlona/ocieniowana faseta + opcjonalny śnieg. */
export function szczyt(x, y, w, h, { snieg = false } = {}) {
  return `<g class="mf-szczyt">` +
    `<path d="M ${rr(x - w)} ${rr(y)} L ${rr(x)} ${rr(y - h)} L ${rr(x + w)} ${rr(y)} Z" fill="${PAL.skala}" stroke="${PAL.skalaCien}" stroke-width="1.8" stroke-linejoin="round"/>` +
    `<path d="M ${rr(x - w)} ${rr(y)} L ${rr(x)} ${rr(y - h)} L ${rr(x - w * 0.18)} ${rr(y)} Z" fill="${PAL.skalaCien}" opacity="0.45"/>` +
    (snieg ? `<path d="M ${rr(x - w * 0.3)} ${rr(y - h * 0.68)} L ${rr(x)} ${rr(y - h)} L ${rr(x + w * 0.3)} ${rr(y - h * 0.68)} L ${rr(x + w * 0.12)} ${rr(y - h * 0.6)} L ${rr(x)} ${rr(y - h * 0.72)} L ${rr(x - w * 0.12)} ${rr(y - h * 0.58)} Z" fill="#f6f4ec"/>` : '') +
    `</g>`;
}

/**
 * Pasmo: linia grzbietu (wygładzona) + szczyty rozmieszczone wzdłuż niej,
 * na przemian po obu stronach, wyższe w centrum, niższe na krańcach
 * (naturalny profil masywu). `przedgorze` dosypuje drobne wzgórza wokół.
 */
export function pasmo(id, punkty, { szer = 46, gestoscSzczytow = null, snieg = false, przedgorze = true } = {}) {
  const rng = prng(`pasmo:${id}`);
  const grzbiet = chaikin(punkty, 3, false);
  const n = gestoscSzczytow ?? Math.max(3, Math.round(dlugosc(grzbiet) / 80));
  let out = `<path d="${gladka(grzbiet)}" stroke="${PAL.skalaCien}" stroke-width="2" fill="none" opacity="0.3"/>`;
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const [x, y] = punktNa(grzbiet, t);
    const waga = Math.sin(Math.PI * t); // wyżej w środku pasma
    const h = szer * (0.7 + waga * 0.55 + rng() * 0.25);
    const w = szer * (0.42 + rng() * 0.18);
    const strona = i % 2 === 0 ? 1 : -1;
    const dx = strona * szer * 0.22;
    out += szczyt(x + dx, y + Math.abs(dx) * 0.12, w, h, { snieg: snieg && waga > 0.55 });
  }
  if (przedgorze) {
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      const [x, y] = punktNa(grzbiet, t);
      const strona = i % 2 === 0 ? -1 : 1;
      out += szczyt(x + strona * szer * (0.55 + rng() * 0.2), y + szer * 0.2, szer * 0.22, szer * (0.28 + rng() * 0.12), {});
    }
  }
  return out;
}

/* ---------- wulkan (stożek z kraterem i lazem dymu) ---------- */

export function wulkan(x, y, { skala = 1, dym = true } = {}) {
  const w = 20 * skala;
  const h = 26 * skala;
  return `<g class="mf-wulkan">` +
    `<path d="M ${rr(x - w)} ${rr(y)} L ${rr(x - w * 0.22)} ${rr(y - h * 0.82)} L ${rr(x)} ${rr(y - h * 0.7)} L ${rr(x + w * 0.22)} ${rr(y - h * 0.82)} L ${rr(x + w)} ${rr(y)} Z" ` +
    `fill="${PAL.skala}" stroke="${PAL.skalaCien}" stroke-width="1.8" stroke-linejoin="round"/>` +
    `<path d="M ${rr(x - w)} ${rr(y)} L ${rr(x - w * 0.22)} ${rr(y - h * 0.82)} L ${rr(x - w * 0.05)} ${rr(y)} Z" fill="${PAL.skalaCien}" opacity="0.45"/>` +
    `<ellipse cx="${rr(x - w * 0.02)}" cy="${rr(y - h * 0.74)}" rx="${rr(w * 0.2)}" ry="${rr(skala * 1.8)}" fill="#7a4a3a"/>` +
    (dym ? `<path d="M ${rr(x)} ${rr(y - h * 0.86)} q ${rr(6 * skala)} ${rr(-9 * skala)} 0 ${rr(-16 * skala)} q ${rr(-6 * skala)} ${rr(-7 * skala)} ${rr(2 * skala)} ${rr(-13 * skala)}" ` +
      `stroke="#9aa3a8" stroke-width="${rr(2.4 * skala)}" fill="none" opacity="0.65" stroke-linecap="round"/>` : '') +
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
  return `<g class="mf-miasto">` +
    `<path d="M ${rr(x - 10 * s)} ${rr(y + 3 * s)} a 10 ${7 * s} 0 0 1 ${20 * s} 0" fill="#c9b98f" stroke="${PAL.skalaCien}" stroke-width="1.4"/>` +
    `<rect x="${rr(x - 5 * s)}" y="${rr(y - 3 * s)}" width="${rr(4.5 * s)}" height="${rr(4 * s)}" fill="${PAL.tekst}"/>` +
    `<rect x="${rr(x + 0.5 * s)}" y="${rr(y - 1 * s)}" width="${rr(4 * s)}" height="${rr(4.5 * s)}" fill="${PAL.tekst}"/>` +
    `<rect x="${rr(x - 8 * s)}" y="${rr(y - 0.5 * s)}" width="${rr(4 * s)}" height="${rr(3.5 * s)}" fill="${PAL.tekst}"/>` +
    `<circle cx="${rr(x + 7 * s)}" cy="${rr(y - 4 * s)}" r="${rr(1.6 * s)}" fill="${PAL.tekst}"/>` +
    `</g>`;
}

/** Ruina: przerwane mury + przewrócone kolumny. */
export function ruina(x, y, { skala = 1 } = {}) {
  const s = skala;
  return `<g class="mf-ruina">` +
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
  return `<g class="mf-hedron" opacity="${opacity}">` +
    `<path d="M ${[0, 1, 2, 3, 4, 5].map(pk).join(' L ')} Z" fill="#cfc4a0" stroke="${PAL.skalaCien}" stroke-width="${rr(1.8 * s)}" stroke-linejoin="round"/>` +
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
