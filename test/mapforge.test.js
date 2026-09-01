/**
 * mapforge — testy silnika (ADR 0018): determinizm, geometria klocków,
 * kompletność renderu. Zero zależności poza node:test.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  prng, hash, chaikin, gladka, prosta, pit, pole, rozrzut, wstega,
  punktNa, dlugosc,
} from '../tools/mapforge/geom.mjs';
import {
  las, bagno, pasmo, rzeka, jezioro, droga, etykieta, lukEtykieta,
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
  assert.ok(szerNa(0) < szerNa(Math.floor(lewo.length / 2)));
  assert.ok(szerNa(Math.floor(lewo.length / 2)) < szerNa(lewo.length - 1));
  assert.ok(Math.abs(szerNa(lewo.length - 1) - 16) < 1, 'końcowa szerokość ≈ 2×s1');
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
  const s = szczyt(0, 0, 20, 30, { snieg: true });
  assert.ok(s.includes('#f6f4ec'), 'śnieg na szczycie');
});

test('mapforge: rzeka/jezioro/droga — atrybuty stylu', () => {
  const r = rzeka('r', [[0, 0], [100, 100]], { s0: 2, s1: 6 });
  assert.ok(r.includes('fill="#5b8ba6"') && r.includes('circle'), 'wstęga + źródło');
  const j = jezioro({ cx: 10, cy: 10, rx: 50, ry: 30 });
  assert.ok(j.includes('ellipse'));
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

test('mapforge: POI — miasto/ruina/hedron/wulkan', () => {
  assert.ok(miasto(0, 0).includes('mf-miasto'));
  assert.ok(ruina(0, 0).includes('mf-ruina'));
  const h = hedron(0, 0, { opacity: 0.75 });
  assert.ok(h.includes('opacity="0.75"') && h.includes('mf-hedron'));
  assert.ok(wulkan(0, 0).includes('ellipse'), 'krater wulkanu');
});

test('mapforge: motywy — atlas wymienia paletę, oba deterministyczne', () => {
  const p = renderuj(scenaDemo());
  const a1 = renderuj(scenaDemo(), { styl: 'atlas' });
  const a2 = renderuj(scenaDemo(), { styl: 'atlas' });
  assert.ok(p.includes('fill="#e8dbb8"'), 'pergamin: ląd pergaminowy');
  assert.ok(a1.includes('fill="#f7f2e2"'), 'atlas: ląd papierowy');
  assert.ok(!a1.includes('fill="#e8dbb8"') && !a1.includes('fill="#ccd8d2"'), 'atlas bez palety pergaminu');
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
    assert.ok(s1.includes(`=== ${w} ===`), `warstwa ${w}`);
  }
  assert.ok(s1.startsWith('<?xml') && s1.trim().endsWith('</svg>'));
  assert.equal((s1.match(/<svg/g) ?? []).length, 1, 'dokładnie jeden <svg>');
  assert.equal((s1.match(/<\/g>/g) ?? []).length, (s1.match(/<g[ >]/g) ?? []).length, 'domknięte grupy');
});
