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
 * Kolejność warstw stała (decyzja właściciela 2026-09-02, pkt g):
 * ocean → wybrzeża → ląd → jeziora → rzeki → góry → wulkany →
 * lasy/bagna/stepy (NAD górami) → drogi → miasta/ruiny → etykiety na
 * samym szczycie → oprawa; każda z komentarzem dla nawigacji.
 */

import {
  PAL, motyw, las, bagno, step, lod, pasmo, wulkan, rzeka, doplyw, jezioro,
  droga, miasto, ruina, hedron, etykieta, lukEtykieta, kompas, ramka,
  skalaLinia, drzewo,
} from './bloki.mjs';
import { prng, gladka, prosta, parsujD, pit } from './geom.mjs';

const BLOKI_BIOMOW = { las, bagno, step, lod };
const BLOKI_POI = { miasto, ruina, hedron };

/** Ocean: jednolity podkład. (Dawniej „plamy głębi" w kolorze jeziora —
 *  usunięte 2026-09-02, pkt d/f: woda = jeden kolor, plamy wzmacniały
 *  wrażenie „akwenów" w środku oceanu.) */
export function ocean(szer, wys, { seed = 'ocean' } = {}) {
  return `<rect x="0" y="0" width="${szer}" height="${wys}" fill="${PAL.woda}"/>`;
}

/** Poświata wybrzeża — wg motywu (pergamin: woda; atlas: klasyczne
 *  „linie wody" przybrzeżne jak w dawnych atlasach). */
export function poswiataWybrzeza(d) {
  return (PAL.poswiata ?? []).map(({ w, o }) =>
    `<path d="${d}" fill="none" stroke="${PAL.poswiataKolor}" stroke-width="${w}" opacity="${o}"/>`,
  ).join('');
}

/**
 * Rozstaw etykiet bez kolizji (uwaga mapy E1 / feedback właściciela (e)).
 *
 * Deterministyczny, zachłanny algorytm: etykiety przetwarzamy w kolejności
 * „wielka/miasto → drobne", a każdą kładziemy w pierwszym wolnym miejscu
 * z deterministycznej listy kandydatów (wokół `przyDo`, gdy jest — inaczej
 * wokół jej `x,y`). Kandydat jest dobry, gdy (1) mieści się w mapie,
 * (2) nie koliduje z już położonymi etykietami (ten sam model bboxu co
 * map-audit), (3) DOTYKA lądu (9 punktów bboxa) — decyzja właściciela
 * 2026-09-02 pkt b: labelka może stać tuż przy wybrzeżu (część napisu nad
 * wodą) — chyba że etykieta należy do obiektu wodnego (whitelist `woda`)
 * albo jest podtytułem `(...)`/nazwą w wodzie.
 *
 * Zwraca listę `{ tekst, x, y, opcje, przyDo, zakotwicz }`. `przyDo` to
 * punkt kotwiczący rozstaw (etykieta zostaje przy obiekcie); kreski
 * łączące NIE rysujemy (decyzja właściciela 2026-09-01, pkt a) — `zakotwicz`
 * zostaje w API dla ewentualnych użytków, render go ignoruje.
 */
export function rozstawEtykiety(etykiety, { szer, wys, maskiLadow = [], woda = new Set() } = {}) {
  const naLadzie = (x, y) => !maskiLadow.length || maskiLadow.some((m) => pit([x, y], m));
  // Etykieta może STAĆ PRZY wybrzeżu: wystarcza, że jej bok dotyka lądu
  // (próbkowanie 9 punktów bboxa) — decyzja właściciela 2026-09-02 pkt b:
  // labelki miast/ruin SIADAJĄ TUŻ PRZY ikonie, nawet gdy część napisu
  // wystaje nad wodę (jak na mapach mapome).
  const stykaLad = (bb) => {
    const [x1, y1, x2, y2] = bb;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    return [[mx, my], [x1, y1], [x2, y1], [x1, y2], [x2, y2],
            [mx, y1], [mx, y2], [x1, my], [x2, my]]
      .some(([px, py]) => naLadzie(px, py));
  };
  const wWodzie = (t) => woda.has(t) || t.startsWith('(') || t === 'ruiny w niebie';

  // Model bboxu zgodny z tools/map-audit.py (0.62·fs·znaki, bazowa linia).
  const bbox = (t, x, y, fs) => [
    x - t.length * fs * 0.31, y - fs * 0.82,
    x + t.length * fs * 0.31, y + fs * 0.24,
  ];
  const koliduje = (b, u) => b[0] < u[2] && u[0] < b[2] && b[1] < u[3] && u[1] < b[3];

  // Kolejność: najpierw duże napisy (tytuły kontynentów) i miasta, potem
  // drobne POI; w obrębie tej samej klasy — wg tekstu (determinizm).
  const waga = (e) => {
    const op = e.opcje ?? {};
    if (op.duze) return 0;
    if (op.fs >= 18) return 1;
    return 2;
  };
  const kolejnosc = [...etykiety].sort((a, b) => {
    const wa = waga(a), wb = waga(b);
    if (wa !== wb) return wa - wb;
    return a.tekst.localeCompare(b.tekst, 'pl');
  });

  // Deterministyczne kierunki kandydatów: najpierw boki, potem rogi,
  // potem coraz dalej (zgodnie z ruchem wskazówek). `offset` rośnie, dzięki
  // czemu ciasne skupiska miast (Akoum, Guul Dráz) rozsuwają się na bok.
  const kierunki = [];
  for (const r of [16, 26, 38, 52, 70, 92, 118]) {
    kierunki.push([r, 0], [-r, 0], [0, -r], [0, r],
      [r, -r], [r, r], [-r, -r], [-r, r],
      [r, -r / 2], [r, r / 2], [-r, -r / 2], [-r, r / 2],
      [r / 2, -r], [r / 2, r], [-r / 2, -r], [-r / 2, r]);
  }

  const polozone = [];       // bboxy już ułożonych
  const wynik = [];
  for (const e of kolejnosc) {
    const op = e.opcje ?? {};
    const fs = op.fs ?? 15;
    const ax = op.przyDo ? op.przyDo[0] : e.x;
    const ay = op.przyDo ? op.przyDo[1] : e.y;
    const wodaEty = wWodzie(e.tekst);
    let wybrany = null;

    // Właściwa (oryginalna) pozycja ma pierwszeństwo, o ile sensowna.
    const kandydaci = [[e.x, e.y], ...kierunki.map(([dx, dy]) => [ax + dx, ay + dy])];
    for (const [cx, cy] of kandydaci) {
      if (cx < 6 || cx > szer - 6 || cy < 6 || cy > wys - 6) continue;
      const bb = bbox(e.tekst, cx, cy, fs);
      if (polozone.some((u) => koliduje(bb, u))) continue;
      if (!wodaEty && !stykaLad(bb)) continue;       // lądowe etykiety nie mogą „pływać"
      wybrany = { x: cx, y: cy, bb };
      break;
    }
    // Ostateczność: oryginalna pozycja (żeby nic nie zniknęło).
    if (!wybrany) {
      const bb = bbox(e.tekst, e.x, e.y, fs);
      wybrany = { x: e.x, y: e.y, bb };
    }
    polozone.push(wybrany.bb);
    wynik.push({
      tekst: e.tekst,
      x: wybrany.x,
      y: wybrany.y,
      opcje: op,
      przyDo: op.przyDo ?? null,
      // kreskę rysujemy, gdy napis odsunięty od obiektu o > 10 px
      zakotwicz: op.przyDo && Math.hypot(wybrany.x - ax, wybrany.y - ay) > 10 ? [ax, ay] : null,
    });
  }
  return wynik;
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

  // Maska lądu (unia wszystkich kontynentów): drogi i rzeki przycinamy do
  // wybrzeża, żeby nigdy nie „płynęły" / nie „biegły" przez ocean. Rzeka
  // dochodząca do morza rozpływa się w nim (klip kończy ją idealnie na linii
  // brzegowej), a droga zawsze pozostaje na lądzie (uwaga mapy E1).
  const ladowPaths = (scena.lądy ?? []).map(laczD);
  const klipDoLadow = `url(#lady-klip)`;
  if (ladowPaths.length) {
    warstwy.splice(1, 0, `<defs><clipPath id="lady-klip">${
      ladowPaths.map((d) => `<path d="${d}"/>`).join('')
    }</clipPath></defs>`);
  }

  // maski lądu: biomy i pasma nie „pływają" po oceanie (otoczka biomu bywa
  // szersza niż kontynent); parse d ręczny — parsujD patrzy tylko na punkty
  const maskiLadow = (scena.lądy ?? [])
    .map((l) => (l.d ? parsujD(l.d) : l.punkty))
    .filter((m) => Array.isArray(m) && m.length > 3);

  if (scena.jeziora?.length) {
    warstwy.push(`<!-- === JEZIORA === -->`,
      ...scena.jeziora.map((j) => jezioro(j, j.opcje ?? {})));
  }

  if (scena.rzeki?.length) {
    // Rzeki mają JEDEN kolor wody (pkt d, 2026-09-02) — ujścia zlewają się
    // z morzem i jeziorami bez gradientu i bez opacity (ADR 0020 + pkt d).
    warstwy.push(`<!-- === RZEKI (kolor wody; ujścia zlewają się z akwenem) === -->`);
    for (const r of scena.rzeki) {
      warstwy.push(rzeka(r.id, r.punkty, { ...(r.opcje ?? {}) }));
      for (const d of r.doplywy ?? []) {
        warstwy.push(doplyw(d.id, d.punkty, { ...(d.opcje ?? {}) }));
      }
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

  // Kolejność warstw (decyzja właściciela 2026-09-02, pkt g): morza → lądy →
  // jeziora → rzeki → góry/wulkany → lasy/bagna/stepy NAD górami → drogi →
  // miasta/ruiny → etykiety na samym szczycie.
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

  if (scena.drogi?.length) {
    // Drogi przycięte do lądu: nigdy nie biegną przez morze — patrz uwaga (c).
    warstwy.push(`<!-- === DROGI I SZLAKI (przycięte do lądu) === -->`,
      `<g${ladowPaths.length ? ` clip-path="${klipDoLadow}"` : ''}>`,
      ...scena.drogi.map((d) => droga(d.id, d.punkty, d.opcje ?? {})),
      `</g>`);
  }

  if (scena.poi?.length) {
    warstwy.push(`<!-- === POI === -->`);
    for (const p of scena.poi) {
      const blok = BLOKI_POI[p.typ];
      if (blok) warstwy.push(blok(p.x, p.y, p.opcje ?? {}));
    }
  }

  if (scena.etykiety?.length || scena.etykietyLukowe?.length) {
    // Woda-dozwolona dla etykiet (obiekty wodne/bay, podtytuły `(...)`).
    // Domyślnie lista konwencji projektu (map-audit) + etykiety zaczynające
    // się od `(`; scena może ją nadpisać przez `strefyWodne`.
    const strefyWodne = new Set(scena.strefyWodne ??
      ['Bojuka Bay', 'Sunder Bay', 'Chill Depths', 'Makindi Trenches',
        'Halimar', 'Beyeen', 'Agadeem', 'Wyspy Jwar', 'Emeria', 'Zulaport',
        'Morze Zendikaru']);
    const rozstawione = rozstawEtykiety(scena.etykiety ?? [], {
      szer, wys, maskiLadow, woda: strefyWodne,
    });
    warstwy.push(`<!-- === ETYKIETY (bez kolizji) === -->`,
      `<g font-family="Georgia, 'Times New Roman', serif" fill="${PAL.tekst}" ` +
      `style="paint-order: stroke; stroke: ${PAL.halo}; stroke-width: 3px; stroke-linejoin: round;">`);
    for (const e of rozstawione) {
      // Decyzja właściciela (2026-09-01, pkt a): etykieta SIADAJE PRZY
      // obiekcie — nie rysujemy już kresek łączących (przyDo służy tylko
      // kotwiczeniu rozstawu w `rozstawEtykiety`, nie dawało linii).
      warstwy.push(etykieta(e.tekst, e.x, e.y, e.opcje));
    }
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
    `<!-- Glify gór adoptowane: k1tesurfen/mapome, CC-BY-4.0 (github.com/k1tesurfen/mapome) — ADR 0020 -->\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${szer} ${wys}" font-family="Georgia, 'Times New Roman', serif">\n` +
    warstwy.join('\n') + '\n</svg>\n';
}

export { drzewo };
