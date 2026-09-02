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
  PAL, motyw, las, bagno, step, lod, pasmo, pasmoInstancje, wulkan, rzeka,
  doplyw, jezioro, droga, miasto, ruina, hedron, iglica, szczyt, etykieta,
  lukEtykieta, kompas, ramka, skalaLinia, drzewo,
} from './bloki.mjs';
import { prng, gladka, prosta, parsujD, pit } from './geom.mjs';

const BLOKI_BIOMOW = { las, bagno, step, lod };

/** Etykiety obiektów wodnych (konwencja projektu — spójna z map-audit):
 *  mogą stać/zwisać nad wodą, którą nazywają (zatoki, jeziora, wodospady,
 *  rzeki przy ujściu, podniebne ruiny). */
export const STREFY_WODNE_DOMYSLNE = [
  'Bojuka Bay', 'Sunder Bay', 'Chill Depths', 'Makindi Trenches',
  'Halimar', 'Beyeen', 'Agadeem', 'Wyspy Jwar', 'Emeria', 'Zulaport',
  'Hagra Cistern', 'Morze Zendikaru', 'Umung',
  'Blackbloom Lake', 'Lake Jast', 'Roaring Falls',
  'Ior Ruin',                                  // ruiny na brzegu Glasspool — napis może zwisać nad wodą
];

/** Etykiety, które NAZYWAJĄ wodę (morza, zatoki, jeziora, rzeki,
 *  wodospady) — rysowane ciemnym granatem (`PAL.etykietaWoda`) dla
 *  odróżnienia od nazw lądowych (decyzja właściciela 2026-09-02,
 *  ADR 0024). Scena może nadpisać przez `etykietyWodne`. */
export const ETYKIETY_WODNE_KOLOR = [
  'Morze Zendikaru', 'Halimar', 'Bojuka Bay', 'Sunder Bay', 'Chill Depths',
  'Umung', 'Umara', 'Blackbloom Lake', 'Lake Jast', 'Hagra Cistern',
  'Glasspool', 'Roaring Falls', 'Magosi Wodospad',
  'Rzeka Srebrna', 'Zatoka Ciszy',                  // demo
];
const BLOKI_POI = {
  miasto, ruina, hedron, iglica,
  // `wodospad` — strugi spadającej wody + rozbryzg (Roaring Falls);
  // kolor linii wody, spójny z jeziorami/wybrzeżem (ADR 0025).
  wodospad: (x, y, { skala = 1 } = {}) => {
    const s = skala;
    const r = (v) => Math.round(v * 100) / 100;
    return `<g class="mf-wodospad" data-x="${r(x)}" data-y="${r(y)}">` +
      `<path d="M ${r(x - 5 * s)} ${r(y - 8 * s)} L ${r(x - 5 * s)} ${r(y + 2 * s)} ` +
      `M ${r(x)} ${r(y - 9 * s)} L ${r(x)} ${r(y + 3 * s)} ` +
      `M ${r(x + 5 * s)} ${r(y - 8 * s)} L ${r(x + 5 * s)} ${r(y + 2 * s)}" ` +
      `stroke="${PAL.wodaStroke}" stroke-width="${r(1.8 * s)}" stroke-linecap="round" fill="none"/>` +
      `<path d="M ${r(x - 7 * s)} ${r(y + 5 * s)} q 3.5 -3 7 0 q 3.5 3 7 0" ` +
      `stroke="${PAL.wodaStroke}" stroke-width="${r(1.2 * s)}" fill="none"/>` +
      `</g>`;
  },
};

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
 * Rozstaw etykiet v3 — JEDEN WZÓR dla całej mapy (decyzja właściciela
 * 2026-09-02, recenzja preview PR-10; zastępuje wyszukiwanie pozycji
 * w promieniach/kierunkach):
 *
 *   1. Etykieta OBIEKTOWA (fs < 16, bez `duze`/`kat`) kotwiczy się w PUNKCIE
 *      CENTRALNYM obiektu (`przyDo`, a bez niego — własny x/y etykiety)
 *      i zaczyna się ZAWSZE POD nim, w minimalnym odstępie `r` (strefa
 *      ikony POI + margines), wyśrodkowana (text-anchor middle).
 *   2. Konflikt (kolizja bboxów albo napis w wodzie) → ZAWSZE ta sama
 *      reakcja: przerzut z „pod" na „NAD". Dalsze konflikty → drabinka
 *      pionowa (pod niżej / nad wyżej), nigdy w bok.
 *   3. Etykiety OBSZAROWE (fs >= 16, `duze`, obrócone `kat`) to typografia
 *      krain/akwenów — zostają dokładnie tam, gdzie ustawia je scena
 *      (rejestrują tylko bbox, żeby obiektowe je omijały).
 *
 * Zwraca listę `{ tekst, x, y, opcje, przy }`; `przy = [ax, ay, r]` dla
 * etykiet obiektowych — `etykieta()` emituje je jako data-atrybuty, z
 * których nakładka ekranowa Codexu liczy pozycję ZALEŻNĄ OD ZOOMU
 * (stała odległość WIZUALNA od ikony przy każdym przybliżeniu).
 */
export function rozstawEtykiety(etykiety, { szer, wys, maskiLadow = [], woda = new Set(), poi = [] } = {}) {
  const naLadzie = (x, y) => !maskiLadow.length || maskiLadow.some((m) => pit([x, y], m));
  // Etykieta może STAĆ PRZY wybrzeżu — wystarczy, że jej bok dotyka lądu
  // (9 punktów bboxa; decyzja właściciela 2026-09-02 pkt b).
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

  // Strefa ikony POI przy kotwicy — ASYMETRYCZNA (jedn. mapy): ikony
  // rysowane od podstawy w górę (wulkan, iglica) mają mały prześwit POD
  // punktem (etykieta siada tuż pod bryłą) i duży NAD (sylwetka+dym) —
  // recenzja 2026-09-02: „Teeth of Akoum za daleko od wulkanów".
  const PROMIEN_POI = {
    miasto: { dol: 13, gora: 13 }, ruina: { dol: 13, gora: 11 },
    hedron: { dol: 10, gora: 10 }, wulkan: { dol: 4, gora: 29 },
    iglica: { dol: 4, gora: 31 }, wodospad: { dol: 6, gora: 10 },
  };
  const promienPrzy = (ax, ay) => {
    let r = { dol: 4, gora: 4 };                  // goły punkt (zatoka, wyspa, przełęcz)
    for (const p of poi) {
      if (Math.hypot(p.x - ax, p.y - ay) > 24) continue;
      const baza = PROMIEN_POI[p.typ] ?? { dol: 10, gora: 10 };
      const s = p.opcje?.skala ?? 1;
      r = { dol: Math.max(r.dol, baza.dol * s + 2), gora: Math.max(r.gora, baza.gora * s + 2) };
    }
    return r;
  };

  const obszarowa = (e) => {
    const op = e.opcje ?? {};
    if (op.przyDo) return false;                  // kotwica obiektu = zawsze obiektowa
    return op.duze || (op.fs ?? 15) >= 16 || !!op.kat;
  };

  const polozone = [];       // bboxy już ułożonych
  const wynik = [];

  // 1) Obszarowe najpierw (rejestrują teren), pozycja nienaruszona.
  for (const e of etykiety.filter(obszarowa)) {
    const op = e.opcje ?? {};
    polozone.push(bbox(e.tekst, e.x, e.y, op.fs ?? 18));
    wynik.push({ tekst: e.tekst, x: e.x, y: e.y, opcje: op, przy: null });
  }

  // 2) Obiektowe wg (ay, ax, tekst) — stabilnie, niezależnie od kolejności sceny.
  const obiektowe = etykiety.filter((e) => !obszarowa(e)).map((e) => {
    const op = e.opcje ?? {};
    const ax = op.przyDo ? op.przyDo[0] : e.x;
    const ay = op.przyDo ? op.przyDo[1] : e.y;
    return { e, op, ax, ay, r: promienPrzy(ax, ay) };
  }).sort((a, b) => (a.ay - b.ay) || (a.ax - b.ax) || a.e.tekst.localeCompare(b.e.tekst, 'pl'));

  for (const { e, op, ax, ay, r } of obiektowe) {
    const fs = op.fs ?? 15;
    const wodaEty = wWodzie(e.tekst);
    // Drabinka: pod → nad → pod niżej → nad wyżej … (zawsze ta sama).
    const kandydaci = [];
    for (let s = 0; s < 12; s++) {
      const pietro = Math.floor(s / 2) * (fs + 4);
      kandydaci.push(s % 2 === 0
        ? [ax, ay + r.dol + fs * 0.9 + pietro]    // POD (baseline pod ikoną)
        : [ax, ay - r.gora - fs * 0.3 - pietro]); // NAD (nad sylwetką)
    }
    let wybrany = null;
    for (const [cx, cy] of kandydaci) {
      if (cx < 6 || cx > szer - 6 || cy < 6 || cy > wys - 6) continue;
      const bb = bbox(e.tekst, cx, cy, fs);
      if (polozone.some((u) => koliduje(bb, u))) continue;
      if (!wodaEty && !stykaLad(bb)) continue;    // lądowe etykiety nie „pływają"
      wybrany = { x: cx, y: cy, bb };
      break;
    }
    // Ostateczność: pozycja „pod" (reguła bazowa) — nic nie znika.
    if (!wybrany) {
      const [cx, cy] = kandydaci[0];
      wybrany = { x: cx, y: cy, bb: bbox(e.tekst, cx, cy, fs) };
    }
    polozone.push(wybrany.bb);
    wynik.push({
      tekst: e.tekst,
      x: wybrany.x,
      y: wybrany.y,
      opcje: { ...op, kotwica: 'middle' },        // wzór: zawsze wyśrodkowana pod/nad
      przy: [ax, ay, r.dol, r.gora],
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

  // ETYKIETY: pozycje liczone WCZEŚNIE (przed biomami), rysowane na końcu
  // (kolejność warstw pkt g) — dzięki temu rozsiew biomów omija boxy
  // napisów i tytuły krain nie toną w puszczy (ADR 0024).
  const strefyWodne = new Set(scena.strefyWodne ?? STREFY_WODNE_DOMYSLNE);
  const rozstawione = scena.etykiety?.length
    ? rozstawEtykiety(scena.etykiety, { szer, wys, maskiLadow, woda: strefyWodne, poi: scena.poi ?? [] })
    : [];

  // WULKANY: warstwa między górami a biomami (kolejność pkt g). Scena
  // trzyma wulkany w `poi` (typ "wulkan") — tu je zbieramy; obsługujemy
  // też ewentualne `scena.wulkany` (format z nagłówka pliku). Naprawa
  // regresji PR-9: po zmianie kolejności warstw render czytał wyłącznie
  // `scena.wulkany`, więc wulkany z poi (w tym Valakut) znikały z mapy.
  const wulkany = [
    ...(scena.wulkany ?? []),
    ...(scena.poi ?? []).filter((p) => p.typ === 'wulkan')
      .map((p) => ({ x: p.x, y: p.y, opcje: p.opcje })),
  ];
  if (wulkany.length) {
    warstwy.push(`<!-- === WULKANY === -->`,
      ...wulkany.map((w) => wulkan(w.x, w.y, w.opcje ?? {})));
  }

  // Kolejność warstw (decyzja właściciela 2026-09-02, pkt g): morza → lądy →
  // jeziora → rzeki → góry/wulkany → lasy/bagna/stepy NAD górami → drogi →
  // miasta/ruiny → etykiety na samym szczycie.
  if (scena.biomy?.length) {
    // STREFY ZAJĘTE (pkt d recenzji 2026-09-02, ADR 0022): rozsiew biomów
    // omija góry (bbox każdego glifu pasma), wulkany, jeziora i lód —
    // biomy NIE zakrywają rzeźby ani akwenów. Kolejne biomy sceny omijają
    // też poligony wcześniejszych (nakład dwóch biomów należy do pierwszego).
    const wyklucz = { bboxy: [], poligony: [] };
    for (const p of scena.pasma ?? []) {
      for (const i of pasmoInstancje(p.id, p.punkty, { maski: maskiLadow, ...(p.opcje ?? {}) })) {
        wyklucz.bboxy.push([i.x - i.w / 2 - 4, i.y - i.h - 4, i.x + i.w / 2 + 4, i.y + 4]);
      }
    }
    for (const w of wulkany) {
      const s = w.opcje?.skala ?? 1;
      wyklucz.bboxy.push([w.x - 24 * s, w.y - 30 * s, w.x + 24 * s, w.y + 6 * s]);
    }
    // Ikony POI (miasta/ruiny/hedrony) też są strefą zajętą — inaczej
    // toną w rozsiewie drzew/sitowia (recenzja 2026-09-02: Prison of
    // Omnath ledwo widoczny w puszczy Ondu).
    for (const p of scena.poi ?? []) {
      if (p.typ === 'wulkan') continue;             // już wyżej
      const s = p.opcje?.skala ?? 1;
      wyklucz.bboxy.push([p.x - 14 * s, p.y - 14 * s, p.x + 14 * s, p.y + 10 * s]);
    }
    for (const j of scena.jeziora ?? []) {
      if (j.d) wyklucz.poligony.push(parsujD(j.d));
      else if (j.cx != null) wyklucz.bboxy.push([j.cx - j.rx, j.cy - j.ry, j.cx + j.rx, j.cy + j.ry]);
    }
    for (const b of scena.biomy) {
      if (b.typ === 'lod') wyklucz.poligony.push(b.punkty);   // lita czapa: nic w niej nie rośnie
    }
    // UWAGA: boxy etykiet celowo NIE są strefą zajętą — wycinały „polany"
    // pod nazwami kontynentów (recenzja 2026-09-02: „nazwa powinna być NAD
    // lasem, nie wycinać polany"); napisy leżą na wierzchu z halo.
    const grupy = {};
    const wczesniejsze = [];
    for (const b of scena.biomy) {
      const strefa = b.typ === 'lod' ? undefined
        : { bboxy: wyklucz.bboxy, poligony: [...wyklucz.poligony, ...wczesniejsze] };
      grupy[b.typ] = (grupy[b.typ] ?? '') + '\n' +
        (BLOKI_BIOMOW[b.typ] ?? las)(b.id, b.punkty, { maski: maskiLadow, wyklucz: strefa, ...(b.opcje ?? {}) });
      if (b.typ !== 'lod') wczesniejsze.push(b.punkty);
    }
    warstwy.push(`<!-- === BIOMY (strefy zajęte: góry/wulkany/jeziora/lód — ADR 0022) === -->`);
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

  if (rozstawione.length || scena.etykietyLukowe?.length) {
    // Kolory pisma warstwowe (ADR 0024/0025): wody granatem, fragmenty
    // lasów/bagien ciemną zielenią (kotwica w poligonie las/bagno, o ile
    // etykieta nie nazywa POI), kontynenty czernią (w `etykieta()`).
    const wodneKolor = new Set(scena.etykietyWodne ?? ETYKIETY_WODNE_KOLOR);
    const lasyBagna = (scena.biomy ?? [])
      .filter((b) => b.typ === 'las' || b.typ === 'bagno')
      .map((b) => b.punkty);
    const naPoi = ([ax, ay]) => (scena.poi ?? []).some((p) => Math.hypot(p.x - ax, p.y - ay) <= 6);
    warstwy.push(`<!-- === ETYKIETY (wzór: pod obiektem, konflikt => nad; ADR 0022) === -->`,
      `<g font-family="Georgia, 'Times New Roman', serif" fill="${PAL.tekst}" ` +
      `style="paint-order: stroke; stroke: ${PAL.halo}; stroke-width: 3px; stroke-linejoin: round;">`);
    for (const e of rozstawione) {
      let kolor = e.opcje?.kolor ?? (wodneKolor.has(e.tekst) ? PAL.etykietaWoda : null);
      if (!kolor && !e.opcje?.duze) {
        const kotw = e.przy ? [e.przy[0], e.przy[1]] : [e.x, e.y];
        if (!naPoi(kotw) && lasyBagna.some((b) => pit(kotw, b))) kolor = PAL.etykietaBiom;
      }
      warstwy.push(etykieta(e.tekst, e.x, e.y, { ...e.opcje, kolor, przy: e.przy }));
    }
    for (const e of scena.etykietyLukowe ?? []) {
      const kolor = e.opcje?.kolor ?? (wodneKolor.has(e.tekst) ? PAL.etykietaWoda : null);
      warstwy.push(lukEtykieta(e.id, e.punkty, e.tekst, { ...(e.opcje ?? {}), kolor }));
    }
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

/**
 * TWARDA ZASADA WIĄZANIA etykieta ↔ obiekt (decyzja właściciela
 * 2026-09-02, recenzja 2 preview PR-10; ADR 0023):
 *
 *   - NIE MA POI BEZ ETYKIETY: każde POI (miasto/ruina/hedron/wulkan) ma
 *     etykietę zakotwiczoną w nim (`przyDo` ≤ 6 j.), ALBO należy do
 *     NAZWANEJ GRUPY — w promieniu 160 j. istnieje POI tego samego typu
 *     z etykietą (np. stożki „Teeth of Akoum", pola hedronowe Emerii).
 *   - NIE MA ETYKIETY BEZ TWARDEGO PUNKTU: kotwica etykiety obiektowej
 *     (przyDo lub własny punkt) musi trafiać w POI, w jezioro (elipsa/
 *     tafla `d`) albo leżeć NA LĄDZIE wewnątrz nazywanego obszaru
 *     (biomy/regiony/przełęcze); etykiety akwenów (whitelist `strefyWodne`,
 *     podtytuły `(...)`) kotwiczą się w wodzie, którą nazywają.
 *
 * Zwraca listę uwag (pusta = scena zgodna). CLI wypisuje uwagi na stderr;
 * test integracyjny pilnuje, by sceny repo miały 0 uwag.
 */
export function sprawdzWiazania(scena) {
  const uwagi = [];
  const poi = scena.poi ?? [];
  const ety = scena.etykiety ?? [];
  const maski = (scena.lądy ?? [])
    .map((l) => (l.d ? parsujD(l.d) : l.punkty))
    .filter((m) => Array.isArray(m) && m.length > 3);
  const naLadzie = (x, y) => maski.some((m) => pit([x, y], m));
  const strefyWodne = new Set(scena.strefyWodne ?? STREFY_WODNE_DOMYSLNE);
  const wodna = (t) => strefyWodne.has(t) || t.startsWith('(') || t === 'ruiny w niebie';
  const wJeziorze = (x, y) => (scena.jeziora ?? []).some((j) => {
    if (j.d) return pit([x, y], parsujD(j.d));
    if (j.cx == null) return false;
    const dx = (x - j.cx) / (j.rx || 1);
    const dy = (y - j.cy) / (j.ry || 1);
    return dx * dx + dy * dy <= 1.1;
  });
  const kotwice = ety
    .map((e) => e.opcje?.przyDo)
    .filter(Boolean);
  const maEtykiete = (p) => kotwice.some(([ax, ay]) => Math.hypot(ax - p.x, ay - p.y) <= 6);

  // 1) POI bez etykiety (z wyjątkiem członków nazwanej grupy).
  for (const p of poi) {
    if (maEtykiete(p)) continue;
    const wGrupie = poi.some((q) => q !== p && q.typ === p.typ
      && Math.hypot(q.x - p.x, q.y - p.y) <= 160 && maEtykiete(q));
    if (!wGrupie) uwagi.push(`POI bez etykiety: ${p.typ} (${p.x},${p.y})`);
  }

  // 2) Etykieta obiektowa bez twardego punktu odniesienia.
  for (const e of ety) {
    const op = e.opcje ?? {};
    const obiektowa = op.przyDo || (!op.duze && !op.kat && (op.fs ?? 15) < 16);
    if (!obiektowa) continue;
    const [ax, ay] = op.przyDo ?? [e.x, e.y];
    if (wodna(e.tekst)) continue;                     // akweny kotwiczą w wodzie
    const wPoi = poi.some((p) => Math.hypot(p.x - ax, p.y - ay) <= 6);
    if (wPoi || wJeziorze(ax, ay) || naLadzie(ax, ay)) continue;
    uwagi.push(`etykieta bez twardego punktu: "${e.tekst}" kotwica (${ax},${ay}) poza lądem/obiektem`);
  }

  // 3) Etykieta siedząca na CUDZYM POI (chaos wizualny — recenzja
  //    2026-09-02 pkt c: „labelki nie wiadomo do czego"): kotwica bliżej
  //    niż 20 j. od POI, którego etykieta nie nazywa (i nie jest wodą
  //    ani nazwą jeziora zawierającego ten POI).
  for (const e of ety) {
    const op = e.opcje ?? {};
    const obiektowa = op.przyDo || (!op.duze && !op.kat && (op.fs ?? 15) < 16);
    if (!obiektowa || wodna(e.tekst)) continue;
    const [ax, ay] = op.przyDo ?? [e.x, e.y];
    if (poi.some((p) => Math.hypot(p.x - ax, p.y - ay) <= 6)) continue;   // własny POI
    if (wJeziorze(ax, ay)) continue;                  // nazwa akwenu (np. Glasspool z ruiną w tafli)
    const obcy = poi.find((p) => Math.hypot(p.x - ax, p.y - ay) <= 20);
    if (obcy) uwagi.push(`etykieta "${e.tekst}" siedzi na cudzym POI ${obcy.typ} (${obcy.x},${obcy.y}) — odsunąć kotwicę`);
  }
  return uwagi;
}
