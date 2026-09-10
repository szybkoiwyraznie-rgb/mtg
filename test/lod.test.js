/**
 * Piramida LOD (ADR 0039): matematyka siatki kafelków + spójność
 * manifestu z plikami + integracja narzędzia tnącego (skip bez convert).
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { siatkaKafli, kafleDlaRect, prostWidoczny, prostNaklada, prostZawiera, wBbox,
  czyPokazacL2, renderMape, zamontujMape } from '../src/codex/render-map.js';
import { tnij, czyDostepnyConvert } from '../tools/kafle.mjs';

test('siatka 8100×5200 / 512 → 16×11, brzegowe kafelki węższe', () => {
  const s = siatkaKafli(8100, 5200, 512);
  assert.equal(s.kolumny, 16);
  assert.equal(s.wiersze, 11);
  assert.deepEqual(s.prost(0), { c: 0, r: 0, x: 0, y: 0, w: 512, h: 512 });
  const ostatni = s.prost(16 * 11 - 1);
  assert.equal(ostatni.c, 15);
  assert.equal(ostatni.r, 10);
  assert.equal(ostatni.w, 8100 - 15 * 512); // 420
  assert.equal(ostatni.h, 5200 - 10 * 512); // 80
});

test('kafleDlaRect: całość → 176, wycinek → kilka, clamp poza [0,1]', () => {
  const m = { kolumny: 16, wiersze: 11 };
  assert.equal(kafleDlaRect(m, 0, 0, 1, 1).length, 176);
  const wycinek = kafleDlaRect(m, 0.1, 0.1, 0.2, 0.2);
  assert.ok(wycinek.length >= 1 && wycinek.length <= 9, `wycinek: ${wycinek.length}`);
  // determinizm i row-major: posortowane rosnąco
  assert.deepEqual([...wycinek].sort((a, b) => a - b), wycinek);
  const poza = kafleDlaRect(m, -0.5, -0.5, 1.5, 1.5);
  assert.equal(poza.length, 176);
});

test('manifest Dominarii zgadza się z plikami kafelków na dysku', (t) => {
  const manifestSciezka = 'maps/dominaria/manifest.json';
  if (!fs.existsSync(manifestSciezka)) return t.skip('brak maps/dominaria/manifest.json (najpierw tnij master)');
  const manifest = JSON.parse(fs.readFileSync(manifestSciezka, 'utf8'));
  const kat = 'maps/dominaria/kafle';
  const pliki = fs.readdirSync(kat).filter((f) => /^k\d{3}\.jpg$/.test(f)).sort();
  assert.equal(pliki.length, manifest.kolumny * manifest.wiersze);
  assert.equal(pliki[0], 'k000.jpg');
  assert.equal(pliki[pliki.length - 1], `k${String(manifest.kolumny * manifest.wiersze - 1).padStart(3, '0')}.jpg`);
  for (const f of ['l0.jpg']) {
    assert.ok(fs.existsSync(path.join('maps/dominaria', f)), `brak ${f}`);
  }
  // mini.jpg: warsztat generuje lokalnie (ADR 0027 v3) — mini-mapy kart
  // wytwarza build z bazy domyślnego wariantu, plik nie jest commitowany
});

test('tnij() na mini-obrazku daje siatkę 4×2 + manifest', (t) => {
  if (!czyDostepnyConvert()) return t.skip('brak ImageMagicka w środowisku');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kafle-'));
  try {
    execFileSync('convert', ['-size', '100x60', 'plasma:fractal', path.join(tmp, 'm.jpg')]);
    const manifest = tnij({ master: path.join(tmp, 'm.jpg'), out: path.join(tmp, 'o'), rozmiar: 32, l0: 96, mini: 48 });
    assert.equal(manifest.kolumny, 4);
    assert.equal(manifest.wiersze, 2);
    assert.equal(fs.readdirSync(path.join(tmp, 'o', 'kafle')).length, 8);
    assert.ok(fs.existsSync(path.join(tmp, 'o', 'manifest.json')));
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('prostWidoczny: cała mapa, zoom, pan i kalibracja', () => {
  const kal = { sx: 1, sy: 1, ox: 0, oy: 0 };
  assert.deepEqual(
    prostWidoczny({ oknoW: 1000, oknoH: 700, stan: { k: 1, ox: 0, oy: 29 }, scenaW: 1000, scenaH: 642, kal }),
    [0, 0, 1, 1]);
  const z = prostWidoczny({ oknoW: 1000, oknoH: 700, stan: { k: 4, ox: 0, oy: 0 }, scenaW: 1000, scenaH: 642, kal });
  assert.deepEqual(z.map((v) => +v.toFixed(4)), [0, 0, 0.25, 0.2726]);
  const kal2 = { sx: 2, sy: 2, ox: 0.1, oy: 0 };
  const c = prostWidoczny({ oknoW: 1000, oknoH: 700, stan: { k: 1, ox: 0, oy: 0 }, scenaW: 1000, scenaH: 642, kal: kal2 });
  assert.deepEqual(c.map((v) => +v.toFixed(4)), [0, 0, 0.45, 0.5452]); // okno wyższe niż scena: v1 = 700/642 > 1
});

test('czyPokazacL2: próg i styczność z bbox (brzegi włącznie)', () => {
  const bbox = [0.05, 0.1, 0.3, 0.45];
  assert.equal(czyPokazacL2(6, 6, [0, 0, 1, 1], bbox), true);
  assert.equal(czyPokazacL2(5.99, 6, [0, 0, 1, 1], bbox), false);
  assert.equal(czyPokazacL2(9, 6, [0.5, 0.5, 0.9, 0.9], bbox), false);
  assert.equal(czyPokazacL2(9, 6, [0.3, 0.2, 0.8, 0.8], bbox), true); // brzeg styka się
  assert.ok(prostNaklada([0, 0, 1, 1], bbox));
  assert.ok(!prostNaklada([0.31, 0, 1, 1], bbox));
  assert.ok(wBbox(0.1, 0.2, bbox));
  assert.ok(!wBbox(0.9, 0.9, bbox));
});

test('czyPokazacL2: TWARDA PODMIANA wchodzi dopiero, gdy kadr mieści się w bbox (ADR 0047)', () => {
  const bbox = [0.60625, 0.5804449, 0.70625, 0.6559551];
  // kadr dotyka brzegu bboksu (miasto jeszcze nie wypełnia ramki):
  const kadrDuzy = [0.55, 0.55, 0.68, 0.63];
  // kadr w całości wewnątrz bboksu (miasto wypełnia ramkę):
  const kadrMaly = [0.62, 0.59, 0.69, 0.64];
  // Tryb pokrycia (Dominaria): styczność wystarcza.
  assert.equal(czyPokazacL2(9, 8, kadrDuzy, bbox, false), true);
  // Tryb podmiany (Ghirapur): styczność NIE wystarcza…
  assert.equal(czyPokazacL2(9, 8, kadrDuzy, bbox, true), false);
  // …dopiero zawarcie kadru w bboksie.
  assert.equal(czyPokazacL2(9, 8, kadrMaly, bbox, true), true);
  // Próg to twarda dolna bramka także w podmianie.
  assert.equal(czyPokazacL2(7.9, 8, kadrMaly, bbox, true), false);
  assert.ok(prostZawiera(bbox, kadrMaly));
  assert.ok(!prostZawiera(bbox, kadrDuzy));
});

const MAPA_LOD = {
  plan: 'dominaria', tytul: 'Dominaria', wariant: 'T1',
  wymiary: { szerokosc: 8100, wysokosc: 5200 },
  warianty: [
    { id: 'swiat', domyslny: true, tytul: 'Świat', wariant: 'T1', podklad: 'l0.jpg',
      podkladUrl: 'dominaria/l0.jpg', wymiary: { szerokosc: 8100, wysokosc: 5200 },
      etykiety: false, kalibracja: { sx: 1, sy: 1, ox: 0, oy: 0 },
      kafle: { katalog: 'kafle', rozmiar: 512, kolumny: 16, wiersze: 11, wzorzec: 'k{nnn}.jpg', prog: 2.5 } },
    { id: 'pokrycie', tytul: 'Pokrycie testowe', wariant: 'T1', podklad: 'pokrycie-testowe.jpg',
      podkladUrl: 'dominaria/pokrycie-testowe.jpg', wymiary: { szerokosc: 2767, wysokosc: 2155 },
      etykiety: false, bbox: [0.05, 0.1, 0.3, 0.45], prog: 6 },
  ],
  pinezki: [{ karta: 'x', x: 0.1, y: 0.2, pewnosc: 'region' }],
};

function zeSztucznymiDanymi(fn) {
  const poprzednie = globalThis.CODEX_DATA;
  globalThis.CODEX_DATA = { strony: {}, mapy: { dominaria: MAPA_LOD } };
  try { return fn(); } finally {
    if (poprzednie === undefined) delete globalThis.CODEX_DATA;
    else globalThis.CODEX_DATA = poprzednie;
  }
}

test('LOD markup: warstwa kafli, nakładka L2, brak przełącznika, kmax, region', () => {
  zeSztucznymiDanymi(() => {
    const html = renderMape('dominaria', {});
    assert.ok(html.includes('data-kafle'), 'warstwa kafli L1');
    assert.ok(html.includes('data-baza="dominaria/kafle/k"'), 'baza URL-i z podkladUrl');
    assert.ok(html.includes('data-l2="pokrycie"'), 'nakładka L2 w złotej scenie');
    assert.ok(html.includes('data-src="dominaria/pokrycie-testowe.jpg"'), 'leniwy src pokrycia');
    assert.ok(!html.includes('data-epoka-przelacz'), 'bbox nie trafia do przełącznika epok');
    assert.ok(html.includes('data-kmax="22"'), 'głębszy zoom dla map LOD');
    assert.ok(html.includes('data-mapa-reset'), 'guzik reset widoku w oknie mapy');
    assert.ok(!html.includes('data-region='), 'bez ?epoka= brak dopasowania regionu');
    const htmlRegion = renderMape('dominaria', { epoka: 'pokrycie' });
    assert.ok(htmlRegion.includes('data-region="pokrycie"'), '?epoka=nakładka → deep-link regionu');
  });
});

// ── Mini-DOM z document.createElement (montaż kafli) ──────────────────
function wezel2(atrybuty = {}, dzieci = []) {
  const attr = new Map(Object.entries(atrybuty).map(([k, v]) => [k, String(v)]));
  const klasy = new Set((attr.get('class') ?? '').split(/\s+/).filter(Boolean));
  const nasluch = new Map();
  const dataset = {};
  const klucz = (s) => s.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const syncDataset = () => {
    for (const k of Object.keys(dataset)) delete dataset[k];
    for (const [k, v] of attr) if (k.startsWith('data-')) dataset[klucz(k)] = v;
  };
  syncDataset();
  const pasuje = (el, sel) => {
    if (sel.startsWith('.')) return el.classList.contains(sel.slice(1));
    const m = sel.match(/^\[([^\]=\]]+)(?:="([^"]*)")?\]$/);
    return m ? el.hasAttribute(m[1]) && (m[2] === undefined || el.getAttribute(m[1]) === m[2]) : false;
  };
  const el = {
    dataset, style: {}, hidden: false, parent: null, tag: atrybuty.tag ?? 'div',
    clientWidth: 0, clientHeight: 0, offsetWidth: 70, offsetHeight: 16,
    classList: {
      contains: (k) => klasy.has(k),
      toggle(k, czy) { if (czy ?? !klasy.has(k)) klasy.add(k); else klasy.delete(k); },
    },
    dzieci,
    potomkowie() { return this.dzieci.flatMap((d) => [d, ...d.potomkowie()]); },
    querySelectorAll(sel) { return this.potomkowie().filter((d) => sel.split(',').some((s) => pasuje(d, s.trim()))); },
    querySelector(sel) { return this.querySelectorAll(sel)[0] ?? null; },
    getAttribute: (k) => attr.get(k) ?? null,
    hasAttribute: (k) => attr.has(k),
    setAttribute(k, v) { attr.set(k, String(v)); syncDataset(); },
    appendChild(d) { d.parent = el; dzieci.push(d); return d; },
    remove() { if (el.parent) el.parent.dzieci.splice(el.parent.dzieci.indexOf(el), 1); },
    addEventListener(typ, fn) { const l = nasluch.get(typ) ?? []; l.push(fn); nasluch.set(typ, l); },
    emit(typ, pola = {}) {
      const e = { target: el, preventDefault() {}, stopPropagation() {}, ...pola };
      for (const fn of nasluch.get(typ) ?? []) fn(e);
    },
    closest() { return null; },
    getBoundingClientRect() { return { left: 0, top: 0, width: this.clientWidth, height: this.clientHeight }; },
  };
  for (const d of dzieci) d.parent = el;
  return el;
}

function zamontowanaLOD({ pin = false, region = false } = {}) {
  const kafle = wezel2({ 'data-kafle': '', 'data-baza': 'dominaria/kafle/k', 'data-format': '.jpg',
    'data-kolumny': 16, 'data-wiersze': 11, 'data-rozmiar': 512, 'data-prog': 2.5,
    'data-master-w': 8100, 'data-master-h': 5200 });
  kafle.hidden = true;
  const l2img = wezel2({ 'data-l2-img': '', 'data-src': 'dominaria/pokrycie-testowe.jpg', tag: 'img' });
  const l2 = wezel2({ 'data-l2': 'pokrycie', 'data-prog': 6, 'data-bbox': '0.05,0.1,0.3,0.45' }, [l2img]);
  l2.hidden = true;
  const scena = wezel2({ 'data-scena': '', 'data-epoka': 'swiat', 'data-zloty': '1',
    'data-aspekt': 8100 / 5200, 'data-sx': 1, 'data-sy': 1, 'data-ox': 0, 'data-oy': 0, 'data-etykiety': '0' },
    [kafle, l2]);
  const pinezka = wezel2({ 'data-pinezka': 'x', 'data-x': 0.1, 'data-y': 0.2 });
  const nakladka = wezel2({ 'data-mapa-nakladka': '' }, [pinezka]);
  const ruch = wezel2({ 'data-mapa-ruch': '' }, [scena]);
  const okno = wezel2({ class: 'mapa-okno', 'data-pin': pin ? 'x' : '', 'data-kmax': 22,
    ...(region ? { 'data-region': 'pokrycie' } : {}) }, [ruch, nakladka]);
  ruch.clientWidth = okno.clientWidth = 1000; okno.clientHeight = 700;
  const app = wezel2({}, [okno]);
  const poprzedniDocument = globalThis.document;
  globalThis.document = { createElement: () => wezel2({ tag: 'img' }), addEventListener() {} };
  zamontujMape(app);
  return {
    okno, ruch, kafle, l2, l2img,
    przywroc() {
      if (poprzedniDocument === undefined) delete globalThis.document;
      else globalThis.document = poprzedniDocument;
    },
    widok() {
      const m = ruch.style.transform.match(/translate\(([-.\de+]+)px, ([-.\de+]+)px\) scale\(([-.\de+]+)\)/);
      return { k: +m[3] };
    },
    kolko(x, y, delta, n = 1) {
      for (let i = 0; i < n; i++) okno.emit('wheel', { clientX: x, clientY: y, deltaY: delta });
    },
  };
}

test('LOD montaż: start lekki, zoom montuje kafle, L2 wchodzi od progu i znika', () => {
  const m = zamontowanaLOD();
  try {
  assert.equal(m.kafle.hidden, true);
  assert.equal(m.kafle.dzieci.length, 0);
  assert.equal(m.l2.hidden, true);
  assert.equal(m.l2img.getAttribute('src'), null);
  // zoom na środek bbox (175, ~206) ×8 → k≈3: kafle tak, L2 jeszcze nie
  m.kolko(175, 206, -100, 8);
  assert.ok(m.widok().k > 2.5, `k=${m.widok().k}`);
  assert.equal(m.kafle.hidden, false);
  assert.ok(m.kafle.dzieci.length > 0 && m.kafle.dzieci.length < 176, `kafli: ${m.kafle.dzieci.length}`);
  for (const t of m.kafle.dzieci) {
    assert.match(t.getAttribute('src'), /^dominaria\/kafle\/k\d{3}\.jpg$/);
    assert.ok(t.style.left.endsWith('%') && t.style.width.endsWith('%'));
  }
  assert.equal(m.l2.hidden, true);
  // ×7 dalej → k≥6 w bbox: L2 wchodzi z leniwym src
  m.kolko(175, 206, -100, 7);
  assert.ok(m.widok().k >= 6, `k=${m.widok().k}`);
  assert.equal(m.l2.hidden, false);
  assert.ok(m.l2.classList.contains('widoczna'));
  assert.equal(m.l2img.getAttribute('src'), 'dominaria/pokrycie-testowe.jpg');
  // zoom out ×15 → poniżej progów: L2 znika, kafle gasną
  m.kolko(500, 350, 100, 15);
  assert.ok(m.widok().k < 2.5, `k=${m.widok().k}`);
  assert.equal(m.l2.hidden, true);
  assert.equal(m.kafle.hidden, true);
  } finally { m.przywroc(); }
});

test('LOD montaż: ?pin= w bbox i ?epoka=region startują z progiem L2', () => {
  const mPin = zamontowanaLOD({ pin: true });
  try {
    assert.ok(Math.abs(mPin.widok().k - 6.6) < 1e-9, `k=${mPin.widok().k}`);
    assert.equal(mPin.l2.hidden, false);
  } finally { mPin.przywroc(); }
  const mRegion = zamontowanaLOD({ region: true });
  try {
    assert.ok(mRegion.widok().k >= 6, `k=${mRegion.widok().k}`);
    assert.equal(mRegion.l2.hidden, false);
  } finally { mRegion.przywroc(); }
});

test('LOD Kaladesh: wariant ghirapur L2 — bbox × aspekt × pliki × scena', () => {
  const mapa = JSON.parse(fs.readFileSync('maps/kaladesh/map.json', 'utf8'));
  const l2 = mapa.warianty.find((w) => w.id === 'ghirapur');
  assert.ok(l2, 'wariant ghirapur istnieje');
  assert.deepEqual(l2.bbox, [0.60625, 0.5804449, 0.70625, 0.6559551]);
  assert.equal(l2.prog, 8);
  assert.equal(l2.podmiana, true, 'Ghirapur = twarda podmiana (ADR 0047)');
  assert.equal(l2.podklad, 'ghirapur.svg');
  assert.equal(l2.etykiety, false);
  // aspekt bbox (w układzie złotym planu 2000×1400) = aspekt płyty 1400×740
  const W = mapa.wymiary.szerokosc, H = mapa.wymiary.wysokosc;
  const ab = ((l2.bbox[2] - l2.bbox[0]) * W) / ((l2.bbox[3] - l2.bbox[1]) * H);
  const ap = l2.wymiary.szerokosc / l2.wymiary.wysokosc;
  assert.ok(Math.abs(ab - ap) < 1e-6, `aspekt bbox ${ab} vs płyty ${ap}`);
  // pliki na dysku + scena wskazuje płytę macierzystą
  for (const f of ['ghirapur.svg', 'ghirapur-scena.json']) {
    assert.ok(fs.existsSync(path.join('maps/kaladesh', f)), `brak ${f}`);
  }
  const scena = JSON.parse(fs.readFileSync('maps/kaladesh/ghirapur-scena.json', 'utf8'));
  assert.equal(scena.nakladka, l2.id, 'płyta zna swój wariant (zwolnienie wodne)');
  assert.equal(scena.szerokosc, l2.wymiary.szerokosc);
  assert.equal(scena.wysokosc, l2.wymiary.wysokosc);
  // pinezka Ghirapuru leży w bbox (deep-link ?pin= startuje z progiem L2)
  const pin = mapa.pinezki.find((p) => p.karta.includes('gearsmith-prodigy'));
  assert.ok(pin && wBbox(pin.x, pin.y, l2.bbox), 'pin Ghirapuru w bbox');
  // markup: nakładka w złotej scenie, leniwy src, brak w przełączniku epok
  const poprzednie = globalThis.CODEX_DATA;
  globalThis.CODEX_DATA = { strony: {}, mapy: { kaladesh: mapa } };
  try {
    const html = renderMape('kaladesh', {});
    assert.ok(html.includes('data-l2="ghirapur"'), 'nakładka L2 w scenie');
    assert.ok(html.includes('data-bbox="0.60625,0.5804449,0.70625,0.6559551"'), 'bbox w markapie');
    assert.ok(html.includes('data-prog="8"'), 'próg w markapie');
    assert.ok(html.includes('data-podmiana="1"'), 'twarda podmiana w markapie');
    assert.ok(html.includes('data-src="kaladesh/ghirapur.svg"'), 'leniwy src płyty');
    assert.ok(!html.includes('data-epoka-przelacz'), 'bbox nie trafia do przełącznika epok');
  } finally {
    if (poprzednie === undefined) delete globalThis.CODEX_DATA;
    else globalThis.CODEX_DATA = poprzednie;
  }
});

test('LOD Kaladesh: Ghirapur to OSOBNA mapa o własnej skali (ADR 0047, nie wycinek 1:1)', () => {
  // ADR 0047: plan jest w skali planu, a miasto to inna mapa o własnej,
  // znacznie większej skali — bez wymogu sztywnego szwu (ADR 0046 §5
  // zwolniony). Sprawdzamy, że płyta jest realnie POWIĘKSZONA względem
  // planu (własna skala), a nie rozłożona 1:1 na wycinku planu.
  const mapa = JSON.parse(fs.readFileSync('maps/kaladesh/map.json', 'utf8'));
  const l2 = mapa.warianty.find((w) => w.id === 'ghirapur');
  const W = mapa.wymiary.szerokosc, H = mapa.wymiary.wysokosc;
  // plan w skali planu (jak Zendikar 2000×1400), nie w skali mastera miasta
  assert.equal(W, 2000, 'plan w skali planu (szerokość)');
  assert.equal(H, 1400, 'plan w skali planu (wysokość)');
  // wycinek planu pod płytą (w jednostkach planu)
  const wycinekW = (l2.bbox[2] - l2.bbox[0]) * W;
  const powiekszenie = l2.wymiary.szerokosc / wycinekW;
  assert.ok(powiekszenie >= 5,
    `miasto ma własną skalę: płyta ${l2.wymiary.szerokosc} j. na wycinku ${wycinekW.toFixed(1)} j. planu = ×${powiekszenie.toFixed(1)} (≥5)`);
  // kalibracja płyty = odwrotność bbox (waliduje ADR 0035 / render.prostWidoczny)
  const k = l2.kalibracja;
  assert.ok(Math.abs(k.sx * l2.bbox[0] + k.ox) < 1e-6 && Math.abs(k.sx * l2.bbox[2] + k.ox - 1) < 1e-6,
    'kalibracja sx/ox = odwrotność bbox X');
  assert.ok(Math.abs(k.sy * l2.bbox[1] + k.oy) < 1e-6 && Math.abs(k.sy * l2.bbox[3] + k.oy - 1) < 1e-6,
    'kalibracja sy/oy = odwrotność bbox Y');
});
