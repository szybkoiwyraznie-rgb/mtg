/**
 * mapforge/render.mjs — scena → warstwowy SVG (warsztat T4, ADR 0018).
 *
 * Scena to zwykły obiekt/JSON:
 *   {
 *     nazwa, szerokosc, wysokosc,
 *     lądy: [{ id, d | punkty }]           // wybrzeża (d = gotowa ścieżka)
 *     biomy: [{ id, typ: 'las'|'bagno'|'step'|'lod', punkty, opcje }]
 *     pasma: [{ id, punkty, opcje }]
 *     wulkany: [{ x, y, opcje }]
 *     rzeki: [{ id, punkty, s0, s1, doplywy: [{ id, punkty }] }]
 *     jeziora: [{ cx, cy, rx, ry }]
 *     drogi: [{ id, punkty, typ }]
 *     poi: [{ typ: 'miasto'|'ruina'|'hedron', x, y, opcje }]
 *     etykiety: [{ tekst, x, y, kat?, fs?, ital? }]
 *     etykietyLukowe: [{ id, punkty, tekst, fs? }]
 *     kompas: { x, y, r } | false,
 *     skala: { x, y, px, km } | false,
 *     ramka: true | { margines },
 *   }
 * Kolejność warstw stała (ocean → wybrzeża → ląd → biomy → woda → rzeźba
 * → drogi → POI → etykiety → oprawa); każda z komentarzem dla nawigacji.
 */

import {
  PAL, motyw, las, bagno, step, lod, pasmo, wulkan, rzeka, doplyw, jezioro,
  droga, miasto, ruina, hedron, etykieta, lukEtykieta, kompas, ramka,
  skalaLinia, drzewo,
} from './bloki.mjs';
import { prng, gladka, prosta, parsujD } from './geom.mjs';

const BLOKI_BIOMOW = { las, bagno, step, lod };
const BLOKI_POI = { miasto, ruina, hedron };

/** Ocean: podkład + subtelne deterministyczne plamy głębi. */
export function ocean(szer, wys, { seed = 'ocean', plamy = 26 } = {}) {
  const rng = prng(seed);
  let out = `<rect x="0" y="0" width="${szer}" height="${wys}" fill="${PAL.woda}"/>`;
  if (PAL.oceanPlamy === false) return out;   // motyw atlasowy: sterylny papier
  for (let i = 0; i < plamy; i++) {
    const x = rng() * szer;
    const y = rng() * wys;
    out += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(40 + rng() * 130).toFixed(0)}" ry="${(18 + rng() * 60).toFixed(0)}" fill="${PAL.wodaGleb}" opacity="${(0.10 + rng() * 0.12).toFixed(2)}"/>`;
  }
  return out;
}

/** Poświata wybrzeża — wg motywu (pergamin: woda; atlas: klasyczne
 *  „linie wody" przybrzeżne jak w dawnych atlasach). */
export function poswiataWybrzeza(d) {
  return (PAL.poswiata ?? []).map(({ w, o }) =>
    `<path d="${d}" fill="none" stroke="${PAL.poswiataKolor}" stroke-width="${w}" opacity="${o}"/>`,
  ).join('');
}

export function renderuj(scena, { styl } = {}) {
  motyw(styl ?? scena.styl ?? 'pergamin');
  const szer = scena.szerokosc ?? 2000;
  const wys = scena.wysokosc ?? 1400;
  const warstwy = [];

  warstwy.push(`<!-- === OCEAN === -->`, ocean(szer, wys, scena.ocean ?? {}));

  const laczD = (l) => l.d ?? gladka(l.punkty, { closed: true });
  if (scena.lądy?.length) {
    warstwy.push(`<!-- === WYBRZEŻA (poświata) === -->`,
      ...scena.lądy.map((l) => poswiataWybrzeza(laczD(l))));
    warstwy.push(`<!-- === LĄDY === -->`,
      ...scena.lądy.map((l) =>
        `<path d="${laczD(l)}" fill="${PAL.lad}" stroke="${PAL.ladStroke}" stroke-width="3.5"/>`));
  }

  // maski lądu: biomy i pasma nie „pływają" po oceanie (otoczka biomu bywa
  // szersza niż kontynent); parse d ręczny — parsujD patrzy tylko na punkty
  const maskiLadow = (scena.lądy ?? [])
    .map((l) => (l.d ? parsujD(l.d) : l.punkty))
    .filter((m) => Array.isArray(m) && m.length > 3);

  if (scena.biomy?.length) {
    const grupy = {};
    for (const b of scena.biomy) {
      grupy[b.typ] = (grupy[b.typ] ?? []) + '\n' +
        (BLOKI_BIOMOW[b.typ] ?? las)(b.id, b.punkty, { maski: maskiLadow, ...(b.opcje ?? {}) });
    }
    warstwy.push(`<!-- === BIOMY === -->`);
    for (const [typ, tresc] of Object.entries(grupy)) {
      warstwy.push(`<g id="biom-${typ}">${tresc}</g>`);
    }
  }

  if (scena.jeziora?.length) {
    warstwy.push(`<!-- === JEZIORA === -->`,
      ...scena.jeziora.map((j) => jezioro(j, j.opcje ?? {})));
  }

  if (scena.rzeki?.length) {
    warstwy.push(`<!-- === RZEKI === -->`);
    for (const r of scena.rzeki) {
      warstwy.push(rzeka(r.id, r.punkty, r.opcje ?? {}));
      for (const d of r.doplywy ?? []) warstwy.push(doplyw(d.id, d.punkty, d.opcje ?? {}));
    }
  }

  if (scena.pasma?.length) {
    warstwy.push(`<!-- === PASMA GÓRSKIE === -->`,
      ...scena.pasma.map((p) => pasmo(p.id, p.punkty, { maski: maskiLadow, ...(p.opcje ?? {}) })));
  }

  if (scena.wulkany?.length) {
    warstwy.push(`<!-- === WULKANY === -->`,
      ...scena.wulkany.map((w) => wulkan(w.x, w.y, w.opcje ?? {})));
  }

  if (scena.drogi?.length) {
    warstwy.push(`<!-- === DROGI I SZLAKI === -->`,
      ...scena.drogi.map((d) => droga(d.id, d.punkty, d.opcje ?? {})));
  }

  if (scena.poi?.length) {
    warstwy.push(`<!-- === POI === -->`);
    for (const p of scena.poi) {
      const blok = BLOKI_POI[p.typ];
      if (blok) warstwy.push(blok(p.x, p.y, p.opcje ?? {}));
    }
  }

  if (scena.etykiety?.length || scena.etykietyLukowe?.length) {
    warstwy.push(`<!-- === ETYKIETY === -->`,
      `<g font-family="Georgia, 'Times New Roman', serif" fill="${PAL.tekst}" ` +
      `style="paint-order: stroke; stroke: ${PAL.halo}; stroke-width: 3px; stroke-linejoin: round;">`);
    for (const e of scena.etykiety ?? []) warstwy.push(etykieta(e.tekst, e.x, e.y, e.opcje ?? {}));
    for (const e of scena.etykietyLukowe ?? []) warstwy.push(lukEtykieta(e.id, e.punkty, e.tekst, e.opcje ?? {}));
    warstwy.push(`</g>`);
  }

  // oprawa (kompas, skala, ramka) w grupie z transformem — map-audit pomija
  // grupy transformowane (konwencja legendy/kompasu), a skala często leży na wodzie
  const oprawa = [];
  if (scena.kompas) oprawa.push(kompas(scena.kompas.x, scena.kompas.y, scena.kompas.r));
  if (scena.skala) oprawa.push(skalaLinia(scena.skala.x, scena.skala.y, scena.skala));
  if (scena.ramka !== false) oprawa.push(ramka(szer, wys, scena.ramka === true ? {} : scena.ramka));
  if (oprawa.length) warstwy.push(`<!-- === OPRAWA (kompas, skala, ramka) === -->`, `<g transform="translate(0,0)">`, ...oprawa, `</g>`);

  return `<?xml version="1.0" encoding="utf-8"?>\n` +
    `<!-- Wygenerowano tools/mapforge (ADR 0018); scena: ${scena.nazwa ?? '(bez nazwy)'}; styl: ${styl ?? scena.styl ?? 'pergamin'} -->\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${szer} ${wys}" font-family="Georgia, 'Times New Roman', serif">\n` +
    warstwy.join('\n') + '\n</svg>\n';
}

export { drzewo };
