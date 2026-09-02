/**
 * mapforge — testy silnika (ADR 0018): determinizm, geometria klocków,
 * kompletność renderu. Zero zależności poza node:test.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  prng, hash, chaikin, gladka, prosta, pit, pole, rozrzut, wstega,
  punktNa, dlugosc, parsujD,
} from '../tools/mapforge/geom.mjs';
import {
  las, bagno, pasmo, pasmoInstancje, rzeka, jezioro, droga, etykieta, lukEtykieta,
  miasto, ruina, hedron, szczyt, wulkan, motyw,
} from '../tools/mapforge/bloki.mjs';
import { renderuj, scenaDemo } from '../tools/mapforge/cli.mjs';

const TROJKAT = [[0, 0], [100, 0], [50, 80]];

test('mapforge: prng deterministyczny i wrażliwy na seed', () => {
  const a = prng('wyspa'); const b = prng('wyspa'); const c = prng('wyspa2');
  const sa = [a(), a(), a()];
  const sb = [b(), b(), b()];
  const sc = [c(), c(), c()];
  assert.deepEqual(sa, sb, 'ten sam seed = ta sama sekwencja');
  assert.notDeepEqual(sa, sc, 'inny seed = inna sekwencja');
  assert.ok(hash('wyspa') !== hash('wyspa2'));
});

test('mapforge: rozrzut wewnątrz wielokąta z minimalnym odstępem', () => {
  const kwadrat = [[10, 10], [400, 10], [400, 300], [10, 300]];
  const rng = prng('test');
  const pts = rozrzut(kwadrat, 25, rng, 18);
  assert.equal(pts.length, 25, 'zmieści wszystkie punkty');
  for (const p of pts) assert.ok(pit(p, kwadrat), 'punkt wewnątrz');
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
      assert.ok(d >= 18 - 1e-9, `odstęp ${d.toFixed(2)} >= minOdl`);
    }
  }
});

test('mapforge: pit/pole/dlugosc/punktNa — podstawy', () => {
  assert.ok(pit([50, 40], TROJKAT));
  assert.ok(!pit([50, 90], TROJKAT), 'poza trójkątem');
  assert.equal(pole(TROJKAT), 4000);
  assert.equal(dlugosc([[0, 0], [3, 4]]), 5);
  const p = punktNa([[0, 0], [0, 10], [0, 20]], 0.5);
  assert.deepEqual(p, [0, 10]);
});

test('mapforge: wstega szerokość rośnie liniowo (rzeka)', () => {
  const { lewo, prawo, d } = wstega([[0, 0], [50, 0], [100, 0]], 2, 8);
  assert.ok(d.startsWith('M '));
  const szerNa = (i) => Math.hypot(prawo[i][0] - lewo[i][0], prawo[i][1] - lewo[i][1]);
  // Stożek: najszersza w środku, zwęża się do punktu na OBU końcach.
  const srd = Math.floor(lewo.length / 2);
  assert.ok(szerNa(srd) > szerNa(0) && szerNa(srd) > szerNa(lewo.length - 1), 'środek najszerszy');
  assert.ok(szerNa(0) < 2.5 && szerNa(lewo.length - 1) < 2.5, 'końce zwężone do punktu');
});

test('mapforge: chaikin/gladka produkują path d', () => {
  const pts = [[0, 0], [50, 30], [100, 0], [150, 40]];
  assert.ok(gladka(pts).startsWith('M 0,0 C '));
  assert.ok(prosta(chaikin(pts, 1)).includes(' L '));
  assert.ok(gladka(pts, { closed: true }).endsWith(' Z'));
});

test('mapforge: klocki biomiczne deterministyczne i ograniczone do pola', () => {
  const l1 = las('polnoc', [[0, 0], [300, 0], [300, 200], [0, 200]], {});
  const l2 = las('polnoc', [[0, 0], [300, 0], [300, 200], [0, 200]], {});
  const l3 = las('inne', [[0, 0], [300, 0], [300, 200], [0, 200]], {});
  assert.equal(l1, l2, 'to samo id = ten sam las');
  assert.notEqual(l1, l3, 'inne id = inny układ');
  const n = (l1.match(/mf-drzewo/g) ?? []).length;
  assert.ok(n > 100, `gęsty las (${n} drzew)`);
  assert.ok((bagno('m', [[0, 0], [300, 0], [300, 200], [0, 200]])).includes('mf-kepka'));
});

test('mapforge: pasmo — szczyty i przedgorze', () => {
  const svg = pasmo('gracz', [[0, 100], [300, 100]], { szer: 40 });
  const n = (svg.match(/mf-szczyt/g) ?? []).length;
  assert.ok(n >= 8, `szczyty + przedgorze (${n})`);
  assert.ok(!svg.includes('opacity="0.3"'), 'bez linii grzbietu (przygaszona kreska czyta się jak droga po mapie)');
  const s = szczyt(0, 0, 20, 30, { snieg: true });
  assert.ok(s.includes('#f6f4ec'), 'śnieg na szczycie (pergamin)');
});

test('mapforge: pasmo — glify adoptowane z mapome (ADR 0020)', () => {
  const a = pasmo('glify-test', [[0, 100], [400, 120]], { szer: 40 });
  const b = pasmo('glify-test', [[0, 100], [400, 120]], { szer: 40 });
  assert.ok((a.match(/mf-szczyt/g) ?? []).length >= 8, 'gęste klastery szczytów');
  assert.ok(a.includes('translate(-'), 'glif w ramce lokalnej (transform z biblioteki)');
  assert.equal(a, b, 'deterministycznie');
  // kotwice dla map-auditu
  const kotwice = [...a.matchAll(/data-x="[-\d.]+" data-y="[-\d.]+"/g)];
  assert.ok(kotwice.length >= 8, 'kotwice data-x/y na każdym szczycie');
});

test('mapforge: rzeka/jezioro/droga — atrybuty stylu', () => {
  // ADR 0020 + pkt d (decyzja właściciela 2026-09-02): JEDEN kolor wody —
  // morze, rzeki i jeziora mają identyczny kolor (akweny się zlewają),
  // bez gradientu i bez opacity.
  const r = rzeka('r', [[0, 0], [100, 100]], { s0: 2, s1: 6 });
  assert.ok(r.includes('fill="#ccd8d2"') && r.includes('circle'), 'wstęga w kolorze morza + źródło (pergamin)');
  assert.ok(!r.includes('linearGradient'), 'brak gradientu');
  assert.ok(!r.includes('opacity'), 'brak opacity');
  // Obwódka wstęgi WYCOFANA (recenzja 2026-09-02 pkt 3, ADR 0023):
  // obrysowany „język" ujścia w morzu wyglądał źle — rzeka zlewa się
  // z akwenem samą identycznością koloru.
  assert.ok(!r.includes('stroke='), 'rzeka bez obwódki (ADR 0023)');
  const j = jezioro({ cx: 10, cy: 10, rx: 50, ry: 30 });
  assert.ok(j.includes('ellipse') && j.includes('fill="#ccd8d2"'), 'jezioro = kolor morza (pkt d)');
  const sz = droga('d1', [[0, 0], [50, 50]], { typ: 'szlak' });
  const dr = droga('d2', [[0, 0], [50, 50]], { typ: 'droga' });
  assert.ok(sz.includes('0 9'), 'szlak kropkowany (konwencja mapome)');
  assert.ok(dr.includes('10 7'), 'droga kreskowana');
});

test('mapforge: etykieta pod kątem i po łuku', () => {
  const e = etykieta('Step', 100, 200, { kat: -8, fs: 15, ital: true });
  assert.ok(e.includes('rotate(-8 100 200)'), 'obrót wokół punktu');
  assert.ok(e.includes('font-style="italic"'));
  const lu = lukEtykieta('zatoka', [[0, 100], [100, 130], [200, 100]], 'Zatoka Ciszy');
  assert.ok(lu.includes('textPath') && lu.includes('#mf-luk-zatoka'));
});

test('mapforge: rozstaw etykiet v3 — wzór POD → NAD, kotwica w data-atrybutach (ADR 0022)', async () => {
  const { rozstawEtykiety } = await import('../tools/mapforge/render.mjs');
  const poi = [{ typ: 'miasto', x: 500, y: 500, opcje: { skala: 1 } }];
  // Pojedyncza etykieta obiektowa: ZAWSZE POD kotwicą, wyśrodkowana.
  const solo = rozstawEtykiety(
    [{ tekst: 'Osada', x: 480, y: 470, opcje: { fs: 15, przyDo: [500, 500] } }],
    { szer: 2000, wys: 1400, poi });
  assert.equal(solo.length, 1);
  assert.equal(solo[0].x, 500, 'wyśrodkowana na kotwicy (ręczny x ignorowany)');
  assert.ok(solo[0].y > 500, 'zaczyna się POD obiektem');
  assert.deepEqual(solo[0].przy.slice(0, 2), [500, 500], 'kotwica dla nakładki');
  assert.ok(solo[0].przy[2] >= 11, 'promień ikony miasta w strefie');
  // Konflikt: druga etykieta o tej samej kotwicy → przerzut NAD.
  const dwie = rozstawEtykiety([
    { tekst: 'Osada', x: 500, y: 500, opcje: { fs: 15, przyDo: [500, 500] } },
    { tekst: 'Ruiny', x: 500, y: 500, opcje: { fs: 15, przyDo: [500, 500] } },
  ], { szer: 2000, wys: 1400, poi });
  const [a, b] = dwie;
  assert.ok((a.y > 500) !== (b.y > 500), 'konflikt → jedna POD, druga NAD');
  // Etykieta obszarowa (duze) zostaje na miejscu i nie dostaje kotwicy.
  const kraina = rozstawEtykiety(
    [{ tekst: 'KRAINA', x: 300, y: 300, opcje: { fs: 42, duze: true } }],
    { szer: 2000, wys: 1400, poi });
  assert.equal(kraina[0].x, 300);
  assert.equal(kraina[0].y, 300);
  assert.equal(kraina[0].przy, null);
  // Determinizm niezależnie od kolejności sceny.
  const p1 = rozstawEtykiety([
    { tekst: 'A', x: 100, y: 100, opcje: { fs: 15, przyDo: [100, 100] } },
    { tekst: 'B', x: 120, y: 100, opcje: { fs: 15, przyDo: [120, 100] } },
  ], { szer: 2000, wys: 1400, poi: [] });
  const p2 = rozstawEtykiety([
    { tekst: 'B', x: 120, y: 100, opcje: { fs: 15, przyDo: [120, 100] } },
    { tekst: 'A', x: 100, y: 100, opcje: { fs: 15, przyDo: [100, 100] } },
  ], { szer: 2000, wys: 1400, poi: [] });
  const mapuj = (w) => w.map((e) => `${e.tekst}:${e.x},${e.y}`).sort();
  assert.deepEqual(mapuj(p1), mapuj(p2), 'kolejność sceny bez wpływu na wynik');
  // data-atrybuty kotwicy w SVG (dla nakładki ekranowej Codexu).
  const svg = etykieta('Osada', 500, 519, { fs: 15, przy: [500, 500, 13] });
  assert.ok(svg.includes('data-ax="500"') && svg.includes('data-ay="500"')
    && svg.includes('data-r="13"'), 'kotwica obiektu w data-atrybutach');
});

test('mapforge: POI — miasto/ruina/hedron/wulkan', () => {
  assert.ok(miasto(0, 0).includes('mf-miasto'));
  assert.ok(ruina(0, 0).includes('mf-ruina'));
  const h = hedron(0, 0, { opacity: 0.75 });
  assert.ok(h.includes('opacity="0.75"') && h.includes('mf-hedron'));
  assert.ok(wulkan(0, 0).includes('ellipse'), 'krater wulkanu');
});

test('mapforge: maski lądu — rozsiew biomów i pasma nie pływają po oceanie', () => {
  const lad = parsujD('M 100,100 L 300,100 L 300,240 L 100,240 Z');
  const hull = [[80, 80], [320, 80], [320, 260], [80, 260]];   // otoczka szersza niż ląd
  const rng = prng('maska');
  const pts = rozrzut(hull, 60, rng, 10, [lad]);
  assert.ok(pts.length > 20, 'coś się zmieściło');
  for (const p of pts) assert.ok(pit(p, lad), 'punkt rozsiewu na lądzie');
  const svgLas = las('test-maska', hull, { maski: [lad] });
  const kotwice = [...svgLas.matchAll(/data-x="([\d.]+)" data-y="([\d.]+)"/g)];
  assert.ok(kotwice.length > 20, 'drzewa mają kotwice');
  // tolerancja jak w audycie: jitter kotwicy ±1 px przy krawędzi jest legalny
  const naLadzieTol = (p) => pit(p, lad)
    || [[1.6, 0], [-1.6, 0], [0, 1.6], [0, -1.6]].some((d) => pit([p[0] + d[0], p[1] + d[1]], lad));
  for (const m of kotwice) assert.ok(naLadzieTol([+m[1], +m[2]]), `drzewo (${m[1]},${m[2]}) na lądzie`);
  const svgPasmo = pasmo('test-maska', [[110, 150], [290, 150]], { szer: 40, maski: [lad] });
  assert.ok((svgPasmo.match(/mf-szczyt/g) ?? []).length > 0, 'pasmo się renderuje');
});

test('mapforge: parsujD — komendy M/L/C/Q/A (absolutne i względne)', () => {
  assert.deepEqual(parsujD('M 0,0 L 10,0 L 10,10 Z').slice(0, 3), [[0, 0], [10, 0], [10, 10]]);
  const okrag = parsujD('M 85,100 C 85,91.7 91.7,85 100,85 C 108.3,85 115,91.7 115,100 '
    + 'C 115,108.3 108.3,115 100,115 C 91.7,115 85,108.3 85,100 Z');
  assert.equal(okrag.length, 6, 'M + 4 końce C + Z (punkty NA ścieżce, bez kontrolnych)');
  assert.ok(pit([100, 100], okrag), 'środek okręgu (na Bezierach) w wielokącie');
  assert.ok(!pit([100, 84], okrag), 'punkt na zewnątrz okręgu');
  assert.ok(parsujD('m 5,5 l 5,0 q 3,-3 6,0 a 4,4 0 0 1 8,0').length >= 4, 'małe litery i łuki');
});

test('mapforge: scena E1 Zendikaru renderuje się (atlas, z pliku)', () => {
  const plik = new URL('../maps/zendikar/scena.json', import.meta.url);
  if (!fs.existsSync(plik)) return t.skip('brak scena.json (E1)');
  const scena = JSON.parse(fs.readFileSync(plik, 'utf8'));
  const svg = renderuj(scena);
  assert.ok(svg.includes('styl: atlas'), 'scena.deklaruje atlas');
  assert.ok((svg.match(/<text/g) ?? []).length > 60, 'etykiety z sceny (74)');
  assert.ok((svg.match(/mf-drzewo/g) ?? []).length > 100, 'lasy z klastrów');
  assert.ok(svg.includes('=== PASMA GÓRSKIE ===') && svg.includes('mf-szczyt'), 'pasma');
  assert.equal(renderuj(scena), svg, 'deterministycznie');
});

test('mapforge: motywy — atlas wymienia paletę, oba deterministyczne', () => {
  const p = renderuj(scenaDemo());
  const a1 = renderuj(scenaDemo(), { styl: 'atlas' });
  const a2 = renderuj(scenaDemo(), { styl: 'atlas' });
  assert.ok(p.includes('fill="#e8dbb8"'), 'pergamin: ląd pergaminowy');
  assert.ok(a1.includes('fill="#f7f7f7"'), 'atlas: ląd = jasny szary');
  assert.ok(a1.includes('fill="#c3c3c3"'), 'atlas: walor tonalny (cień koron)');
  assert.ok(!a1.includes('fill="#e8dbb8"') && !a1.includes('fill="#f7f2e2"'), 'bez pergaminu i bez sepii');
  // Achromatyczność z wyjątkiem KOLORU WODY i ETYKIET (decyzja właściciela
  // 2026-09-01: kolor tylko dla wody — morza/rzeki/jeziora — i granatowych
  // napisów; reszta mapy pozostaje czarno-biało-szara wg ADR 0019).
  // (Rzeka i jeziora mają kolor morza — ADR 0020 + pkt d, 2026-09-02 —
  // więc osobnego koloru rzeki/jeziora nie ma.)
  const KOLOR_FUNKCYJNY = new Set([
    'd4e2ee', '6f9bc0',                      // woda (jeden kolor, przyciemniona — ADR 0023) / linie wody
    '6b1f2e', '5a1622', '4d1220',            // bordowe etykiety
    '1c3a5e',                                // granat etykiet wodnych (ADR 0024)
    '1e4d2b',                                // zieleń etykiet biomów (ADR 0025)
    '000000',                                // czerń tytułów kontynentów/wysp (ADR 0025)
  ]);
  const wyp = [...a1.matchAll(/fill="#([0-9a-f]{6})"/g)].map((m) => m[1]);
  assert.ok(wyp.length > 300, 'wypełnień do sprawdzenia');
  for (const h of wyp) {
    if (KOLOR_FUNKCYJNY.has(h)) continue;   // dozwolony kolor funkcjonalny (woda/label)
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b2 = parseInt(h.slice(4, 6), 16);
    assert.ok(r === g && g === b2, `achromatycznie: #${h} (R=${r} G=${g} B=${b2})`);
  }
  assert.ok(!a1.includes('ellipse') || !/plamy/.test(a1), 'atlas: ocean bez plam');
  assert.equal(a1, a2, 'atlas deterministyczny');
  assert.ok(a1.includes('styl: atlas') && p.includes('styl: pergamin'), 'styl w nagłówku');
  assert.throws(() => renderuj(scenaDemo(), { styl: 'brak' }), /nieznany motyw/);
  motyw('pergamin');   // przywróć paletę dla kolejnych testów
});

test('mapforge: renderuj — deterministyczny, warstwowy, kompletny', () => {
  const s1 = renderuj(scenaDemo());
  const s2 = renderuj(scenaDemo());
  assert.equal(s1, s2, 'regeneracja daje identyczny SVG (czysty diff)');
  for (const w of ['OCEAN', 'LĄDY', 'BIOMY', 'JEZIORA', 'RZEKI', 'PASMA GÓRSKIE', 'WULKANY', 'DROGI I SZLAKI', 'POI', 'ETYKIETY', 'WYBRZEŻA (poświata)', 'OPRAWA (kompas, skala, ramka)']) {
    assert.ok(s1.includes(`=== ${w}`), `warstwa ${w}`);
  }
  assert.ok(s1.startsWith('<?xml') && s1.trim().endsWith('</svg>'));
  assert.equal((s1.match(/<svg/g) ?? []).length, 1, 'dokładnie jeden <svg>');
  assert.equal((s1.match(/<\/g>/g) ?? []).length, (s1.match(/<g[ >]/g) ?? []).length, 'domknięte grupy');
});

test('mapforge: strefy zajęte — biomy nie zakrywają gór/jezior (ADR 0022)', async () => {
  const { rozrzut, prng: p2 } = await import('../tools/mapforge/geom.mjs');
  const kwadrat = [[0, 0], [200, 0], [200, 200], [0, 200]];
  const strefa = { bboxy: [[50, 50, 150, 150]], poligony: [] };
  const pkt = rozrzut(kwadrat, 60, p2('t'), 8, null, strefa);
  assert.ok(pkt.length > 10, 'rozsiew nadal działa poza strefą');
  assert.ok(pkt.every(([x, y]) => !(x >= 50 && x <= 150 && y >= 50 && y <= 150)),
    'żaden punkt w strefie zajętej (bbox)');
  const strefaPoly = { bboxy: [], poligony: [[[0, 0], [200, 0], [200, 100], [0, 100]]] };
  const pkt2 = rozrzut(kwadrat, 60, p2('t'), 8, null, strefaPoly);
  assert.ok(pkt2.every(([, y]) => y >= 100), 'żaden punkt w strefie zajętej (poligon)');
  // pasmoInstancje = ta sama geometria co pasmo() (strefy gór dla renderu)
  const inst = pasmoInstancje('glify-test', [[0, 100], [400, 120]], { szer: 40 });
  const svg = pasmo('glify-test', [[0, 100], [400, 120]], { szer: 40 });
  assert.equal(inst.length, (svg.match(/mf-szczyt/g) ?? []).length,
    'instancje 1:1 z rysowanymi szczytami');
  assert.ok(inst.every((i) => i.w > 0 && i.h > 0), 'wymiary stref dodatnie');
});

test('mapforge: twarda zasada wiązania etykieta↔obiekt (ADR 0023)', async () => {
  const { sprawdzWiazania } = await import('../tools/mapforge/render.mjs');
  // Sceny repo są zgodne: 0 uwag (nie ma POI bez etykiety ani etykiet bez punktu).
  const zendikar = JSON.parse(fs.readFileSync('maps/zendikar/scena.json', 'utf8'));
  assert.deepEqual(sprawdzWiazania(zendikar), [], 'scena Zendikaru zgodna z ADR 0023');
  assert.deepEqual(sprawdzWiazania(scenaDemo()), [], 'scena demo zgodna z ADR 0023');
  // Walidator faktycznie wykrywa naruszenia.
  const zla = {
    lądy: [{ id: 'l', punkty: [[0, 0], [500, 0], [500, 500], [0, 500]] }],
    poi: [{ typ: 'miasto', x: 100, y: 100 }],
    etykiety: [{ tekst: 'Na morzu', x: 900, y: 900, opcje: { fs: 14 } }],
  };
  const uwagi = sprawdzWiazania(zla);
  assert.ok(uwagi.some((u) => u.includes('POI bez etykiety')), 'wykrywa POI bez etykiety');
  assert.ok(uwagi.some((u) => u.includes('bez twardego punktu')), 'wykrywa etykietę bez punktu');
  // Nazwana grupa: drugi wulkan przy opisanym nie wymaga własnej etykiety.
  const grupa = {
    lądy: [{ id: 'l', punkty: [[0, 0], [500, 0], [500, 500], [0, 500]] }],
    poi: [
      { typ: 'wulkan', x: 100, y: 100 },
      { typ: 'wulkan', x: 180, y: 140 },
    ],
    etykiety: [{ tekst: 'Zęby Próbne', x: 100, y: 140, opcje: { fs: 14, przyDo: [100, 100] } }],
  };
  assert.deepEqual(sprawdzWiazania(grupa), [], 'grupa nazwana przechodzi');
});
