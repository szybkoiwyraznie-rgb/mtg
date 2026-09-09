/**
 * A3 / ADR 0035: rzeczywisty montaż kontrolera i zdarzenia wheel/click/pan,
 * nie tylko obecność markupu. Mini-DOM ma kontrolowane wymiary layoutu;
 * CSS, hit-testing i raster pozostają przedmiotem QA w przeglądarce.
 * Zero jsdom/zależności (ADR 0002).
 */
import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zamontujMape, wariantyMapy, prefiksujIdPodkladu } from '../src/codex/render-map.js';

const mapa = JSON.parse(fs.readFileSync('maps/tarkir/map.json', 'utf8'));
const znacznik = mapa.pinezki[0];

function wezel(atrybuty = {}, dzieci = []) {
  const attr = new Map(Object.entries(atrybuty).map(([k, v]) => [k, String(v)]));
  const klasy = new Set((attr.get('class') ?? '').split(/\s+/).filter(Boolean));
  const nasluch = new Map();
  const dataset = {};
  const klucz = (s) => s.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  for (const [k, v] of attr) if (k.startsWith('data-')) dataset[klucz(k)] = v;
  const pasuje = (el, sel) => {
    if (sel.startsWith('.')) return el.classList.contains(sel.slice(1));
    const m = sel.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);
    return m ? el.hasAttribute(m[1]) && (m[2] === undefined || el.getAttribute(m[1]) === m[2]) : false;
  };
  const wszystkie = () => dzieci.flatMap((d) => [d, ...d.potomkowie()]);
  const el = {
    dataset, style: {}, hidden: false, textContent: 'Etykieta',
    clientWidth: 0, clientHeight: 0, offsetWidth: 70, offsetHeight: 16,
    classList: {
      contains: (k) => klasy.has(k),
      toggle(k, czy) { if (czy ?? !klasy.has(k)) klasy.add(k); else klasy.delete(k); },
    },
    potomkowie: wszystkie,
    querySelectorAll(sel) { return wszystkie().filter((d) => sel.split(',').some((s) => pasuje(d, s.trim()))); },
    querySelector(sel) { return this.querySelectorAll(sel)[0] ?? null; },
    getAttribute: (k) => attr.get(k) ?? null,
    hasAttribute: (k) => attr.has(k),
    setAttribute(k, v) { attr.set(k, String(v)); if (k.startsWith('data-')) dataset[klucz(k)] = String(v); },
    addEventListener(typ, fn) { const lista = nasluch.get(typ) ?? []; lista.push(fn); nasluch.set(typ, lista); },
    emit(typ, pola = {}) {
      const e = { target: el, preventDefault() {}, stopPropagation() {}, ...pola };
      for (const fn of nasluch.get(typ) ?? []) fn(e);
    },
    closest() { return null; },
    getBoundingClientRect() { return { left: 0, top: 0, width: this.clientWidth, height: this.clientHeight }; },
  };
  return el;
}

function zamontowana({ start = 't1', pin = false, miejsce = null, domyslnyWidok = null, warianty = mapa.warianty, szerokosc = 1440, wysokosc = 1100 } = {}) {
  const sceny = warianty.map((w) => {
    const k = w.kalibracja;
    const el = wezel({ 'data-scena': '', 'data-epoka': w.id,
      'data-aspekt': w.wymiary.szerokosc / w.wymiary.wysokosc,
      'data-sx': k.sx, 'data-sy': k.sy, 'data-ox': k.ox, 'data-oy': k.oy,
      'data-etykiety': w.etykiety === false ? '0' : '1' });
    el.hidden = w.id !== start;
    return el;
  });
  const pinezka = wezel({ 'data-pinezka': znacznik.karta, 'data-x': znacznik.x, 'data-y': znacznik.y });
  const etykiety = warianty.filter((w) => w.etykiety !== false).map((w) => wezel({
    'data-podklad-etykieta': '', 'data-epoka': w.id, 'data-x': 0.5, 'data-y': 0.4,
    'data-min-k': 1, class: `mapa-etykieta-podkladu${w.id === start ? '' : ' poza-epoka'}`,
  }));
  const guziki = warianty.map((w) => wezel({ 'data-epoka-przelacz': w.id, 'aria-pressed': w.id === start }));
  const nakladka = wezel({ 'data-mapa-nakladka': '' }, [pinezka, ...etykiety]);
  const ruch = wezel({ 'data-mapa-ruch': '' }, sceny);
  const attrsOkna = { class: 'mapa-okno', 'data-pin': pin ? znacznik.karta : '' };
  if (miejsce) {
    attrsOkna['data-x'] = miejsce.x;
    attrsOkna['data-y'] = miejsce.y;
  }
  if (domyslnyWidok) {
    attrsOkna['data-domyslne-x'] = domyslnyWidok.x;
    attrsOkna['data-domyslne-y'] = domyslnyWidok.y;
    attrsOkna['data-domyslne-zoom'] = domyslnyWidok.zoom;
  }
  const okno = wezel(attrsOkna, [ruch, nakladka, ...guziki]);
  ruch.clientWidth = okno.clientWidth = szerokosc; okno.clientHeight = wysokosc;
  const app = wezel({}, [okno]);
  zamontujMape(app);
  return {
    okno, sceny, guziki, etykiety,
    widok() {
      const m = ruch.style.transform.match(/translate\(([-\d.e+]+)px, ([-\d.e+]+)px\) scale\(([-\d.e+]+)\)/);
      assert.ok(m, 'kontroler musi naprawdę nanieść transformację');
      const p = [...pinezka.style.transform.matchAll(/([-\d.]+)px/g)].map((x) => +x[1]);
      const scena = sceny.find((s) => !s.hidden);
      const sx = +scena.dataset.sx; const sy = +scena.dataset.sy;
      const oxKal = +scena.dataset.ox; const oyKal = +scena.dataset.oy;
      const W = okno.clientWidth;
      const H = W / (+scena.dataset.aspekt);
      const k = +m[3]; const ox = +m[1]; const oy = +m[2];
      const gx = ((W / 2 - ox) / (W * k) - oxKal) / sx;
      const gy = ((okno.clientHeight / 2 - oy) / (H * k) - oyKal) / sy;
      return { ox, oy, k, zlota: k * sx, pin: p, gx, gy };
    },
    przelacz(id) { guziki.find((g) => g.dataset.epokaPrzelacz === id).emit('click'); },
    kolko(delta, n = 1) {
      const [x, y] = this.widok().pin;
      for (let i = 0; i < n; i++) okno.emit('wheel', { clientX: x, clientY: y, deltaY: delta });
    },
  };
}

function blisko(a, b, tolerancja = 0.05) {
  assert.ok(Math.abs(a - b) <= tolerancja, `${a} ≠ ${b} (tolerancja ${tolerancja})`);
}
function tenSamWidok(a, b) {
  blisko(a.zlota, b.zlota, 1e-9);
  blisko(a.pin[0], b.pin[0]); blisko(a.pin[1], b.pin[1]);
}

for (const start of ['t1', 't4']) {
  for (const granica of ['min', 'max']) {
    test(`mapa: ${start} → drugi wariant → ${start} zachowuje widok na ${granica} zoomu (A3)`, () => {
      const m = zamontowana({ start });
      const delta = granica === 'max' ? -100 : 100;
      m.kolko(delta, 70);
      const przed = m.widok();
      blisko(przed.zlota, granica === 'max' ? 14 : 0.4, 1e-9);
      m.przelacz(start === 't1' ? 't4' : 't1');
      tenSamWidok(przed, m.widok());
      // Kolejne zdarzenie na granicy też nie może nagle przyciąć nowego k.
      m.kolko(delta);
      tenSamWidok(przed, m.widok());
      m.przelacz(start);
      tenSamWidok(przed, m.widok());
      m.kolko(-delta);
      assert.notEqual(m.widok().zlota, przed.zlota, 'zoom w przeciwną stronę nadal działa');
    });
  }
}

test('mapa: przełączenie po pan/zoom, aktywna scena, aria-pressed i etykiety', () => {
  const m = zamontowana();
  m.kolko(-100, 8);
  m.okno.emit('pointerdown', { pointerId: 1, clientX: 200, clientY: 300 });
  m.okno.emit('pointermove', { pointerId: 1, clientX: 310, clientY: 410 });
  m.okno.emit('pointerup', { pointerId: 1 });
  const przed = m.widok();
  m.przelacz('t4');
  tenSamWidok(przed, m.widok());
  assert.equal(m.sceny.find((s) => !s.hidden).dataset.epoka, 't4');
  assert.equal(m.guziki[1].getAttribute('aria-pressed'), 'true');
  assert.ok(m.etykiety.every((e) => !e.classList.contains('poza-epoka')));
  m.przelacz('t1');
  tenSamWidok(przed, m.widok());
  assert.ok(m.etykiety.every((e) => e.classList.contains('poza-epoka')));
});

test('mapa: deep-link na pinezkę ma tę samą złotą skalę w obu wariantach', () => {
  for (const start of ['t1', 't4']) {
    const m = zamontowana({ start, pin: true });
    blisko(m.widok().zlota, 2.5, 1e-9);
    blisko(m.widok().pin[0], 720); blisko(m.widok().pin[1], 550);
  }
});

test('mapa: widok_domyslny centruje mapę na wskazanym ognisku i zoomie (ADR 0045)', () => {
  const m = zamontowana({ start: 't4', domyslnyWidok: { x: 0.22, y: 0.73, zoom: 3.4 } });
  blisko(m.widok().zlota, 3.4, 1e-9);
  blisko(m.widok().gx, 0.22, 1e-9);
  blisko(m.widok().gy, 0.73, 1e-9);
});

test('mapa: jawny deep-link miejsca ma pierwszeństwo przed widokiem domyślnym (ADR 0045)', () => {
  const m = zamontowana({
    start: 't4',
    miejsce: { x: 0.61, y: 0.18 },
    domyslnyWidok: { x: 0.22, y: 0.73, zoom: 6.1 },
  });
  blisko(m.widok().zlota, 2.5, 1e-9);
  blisko(m.widok().gx, 0.61, 1e-9);
  blisko(m.widok().gy, 0.18, 1e-9);
});

test('mapa: deep-link pinezki ma pierwszeństwo przed widokiem domyślnym (ADR 0045)', () => {
  const m = zamontowana({ start: 't4', pin: true, domyslnyWidok: { x: 0.22, y: 0.73, zoom: 6.1 } });
  blisko(m.widok().zlota, 2.5, 1e-9);
  blisko(m.widok().pin[0], 720); blisko(m.widok().pin[1], 550);
});

test('mapa: stary model bez wariantów nadal działa z tożsamościową kalibracją', () => {
  const warianty = wariantyMapy({ tytul: 'Jedna mapa', podklad: 'podklad.svg', wariant: 'T4',
    wymiary: { szerokosc: 2000, wysokosc: 1400 } });
  const m = zamontowana({ start: 'podklad', warianty });
  m.kolko(-100, 70); blisko(m.widok().k, 14);
  m.kolko(100, 140); blisko(m.widok().k, 0.4);
  m.okno.emit('keydown', { key: 'Escape' });
  blisko(m.widok().k, 1);
});


test('mapa: na małym ekranie podpisy szczegółów czekają na zoom (QA A4)', () => {
  const m = zamontowana({ start: 't4', szerokosc: 356, wysokosc: 272 });
  assert.ok(m.etykiety.every((e) => e.classList.contains('poza-zasiegiem')), 'na miniaturze bez tłoku szczegółowych podpisów');
  m.kolko(-100, 10);
  assert.ok(m.etykiety.every((e) => !e.classList.contains('poza-zasiegiem')), 'po zoomie podpisy wracają');
});


test('mapa: mobilny tytuł nie urywa się na brzegu i nie przykleja się po pan (QA A4)', () => {
  const m = zamontowana({ start: 't4', szerokosc: 356, wysokosc: 272 });
  const tytul = m.etykiety[0];
  tytul.classList.toggle('tier-kontynent', true);
  tytul.setAttribute('data-x', 0.99);
  tytul.setAttribute('data-min-k', 0);
  m.okno.emit('keydown', { key: 'Escape' });
  const x = () => +tytul.style.transform.match(/translate\(([-\d.]+)px/)[1];
  assert.ok(x() + tytul.offsetWidth / 2 <= 352, 'nazwa w całości wewnątrz okna');
  m.okno.emit('pointerdown', { pointerId: 1, clientX: 0, clientY: 0 });
  m.okno.emit('pointermove', { pointerId: 1, clientX: -1000, clientY: 0 });
  m.okno.emit('pointerup', { pointerId: 1 });
  assert.ok(x() < 0, 'obszar poza kadrem nie pozostawia przyklejonej etykiety');
});


test('mapa: dwa SVG T4 mają rozłączne id zasobów, bez zmiany linków kart', () => {
  const svg = `<svg><defs><clipPath id="land"><path id='path' d="M0 0H10V10Z"/></clipPath></defs><g data-id="untouched" clip-path="url(#land)"><use href="#path"/><a href="#/karta/605shm-consign-to-dream">karta</a></g></svg>`;
  const a = prefiksujIdPodkladu(svg, 'a-');
  const b = prefiksujIdPodkladu(svg, 'b-');
  assert.ok(a.includes('id="a-land"') && a.includes('url(#a-land)') && a.includes('href="#a-path"'));
  assert.ok(b.includes('id="b-land"') && b.includes('url(#b-land)'));
  assert.ok(a.includes('data-id="untouched"'));
  assert.ok(a.includes('href="#/karta/605shm-consign-to-dream"'));
});
