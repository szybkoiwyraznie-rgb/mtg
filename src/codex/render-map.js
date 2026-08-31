/**
 * Silnik map v1 (ADR 0007/0009, ROADMAP K3): podkład mapy jako <img>
 * (data-URI z builda) + wektorowa warstwa regionów (SVG w układzie
 * podkładu) + pinezki i kotwice jako HTML o stałym rozmiarze
 * (kontraskalowanie). Pan: pointer events (mysz + dotyk + szczypnięcie),
 * zoom: kółko / przyciski; deep-link `#/mapa/<plan>?pin=<slug-karty>`.
 *
 * Współrzędne pinezek/regionów/kotwic są znormalizowane 0–1 (MA2) —
 * silnik mnoży je przez wymiary podkładu (viewBox SVG = wymiary).
 */

import { escapeHtml } from './markdown.js';
import { dajDane } from './data.js';
import { nieZnalesc, stanPusty } from './render.js';

export const POZIOMY_PEWNOSCI = {
  dokladna: { etykieta: 'dokładna', kolor: '#2e7d32', opis: 'miejsce jednoznaczne w kanonie' },
  region: { etykieta: 'region', kolor: '#b26a00', opis: 'kraina — pinezka środka regionu' },
  przyblizona: { etykieta: 'przybliżona', kolor: '#b3392e', opis: 'rekonstrukcja — wymaga uzasadnienia' },
};

/** Renderuje stronę mapy planu (HTML; interakcje montuje zamontujMape). */
export function renderMape(slugPlanu, query = {}) {
  const dane = dajDane();
  const mapa = dane.mapy?.[slugPlanu];
  if (!mapa || mapa.problem) {
    const plan = dane.strony?.[slugPlanu];
    if (!plan) return nieZnalesc(`mapa „${escapeHtml(String(slugPlanu ?? ''))}"`);
    return stanPusty(
      `Plan <strong>${escapeHtml(plan.tytul)}</strong> nie ma jeszcze mapy.`,
      'Proces mapowy uruchamia się z pierwszą materializowaną kartą planu (docs/guides/PROCES_MAP.md).',
    );
  }

  const szer = mapa.wymiary?.szerokosc ?? 3200;
  const wys = mapa.wymiary?.wysokosc ?? 2400;
  const pinezki = mapa.pinezki ?? [];
  const regiony = mapa.regiony ?? [];
  const kotwice = mapa.kotwice ?? [];
  const pinDocelowy = query.pin && pinezki.some((p) => p.karta === query.pin) ? query.pin : '';

  const svgRegiony = regiony.map((r) => {
    const [x0, y0, x1, y1] = r.bbox ?? [];
    if ([x0, y0, x1, y1].some((v) => typeof v !== 'number')) return '';
    const p = POZIOMY_PEWNOSCI[r.pewnosc] ?? POZIOMY_PEWNOSCI.przyblizona;
    return `<a href="#/haslo/${escapeHtml(r.haslo)}" class="mapa-region-link" aria-label="Region: ${escapeHtml(r.haslo)}">
      <rect class="mapa-region" x="${x0 * szer}" y="${y0 * wys}" width="${(x1 - x0) * szer}" height="${(y1 - y0) * wys}"
        fill="${p.kolor}22" stroke="${p.kolor}" stroke-width="7" stroke-dasharray="20 14" rx="24"/>
    </a>`;
  }).join('');

  const htmlPinezki = pinezki.map((p) => {
    const karta = dane.strony?.[p.karta];
    const poz = POZIOMY_PEWNOSCI[p.pewnosc] ?? POZIOMY_PEWNOSCI.przyblizona;
    return `<a href="#/karta/${escapeHtml(p.karta)}" class="mapa-pinezka pewnosc-${p.pewnosc}"
      data-pinezka="${escapeHtml(p.karta)}" data-x="${p.x}" data-y="${p.y}"
      style="left:${p.x * 100}%; top:${p.y * 100}%; border-color:${poz.kolor}"
      title="${escapeHtml(karta?.tytul ?? p.karta)} — pewność: ${poz.etykieta}">
      <span class="mapa-pinezka-glow" style="background:${poz.kolor}"></span>
      <span class="mapa-pinezka-etykieta">${escapeHtml(karta?.tytul ?? p.karta)}</span>
    </a>`;
  }).join('');

  const htmlRegionyEtykiety = regiony.map((r) => {
    const [x0, y0, x1, y1] = r.bbox ?? [];
    if ([x0, y0, x1, y1].some((v) => typeof v !== 'number')) return '';
    const haslo = dane.strony?.[r.haslo];
    const poz = POZIOMY_PEWNOSCI[r.pewnosc] ?? POZIOMY_PEWNOSCI.przyblizona;
    return `<a href="#/haslo/${escapeHtml(r.haslo)}" class="mapa-etykieta-regionu" data-region-etykieta
      style="left:${((x0 + x1) / 2) * 100}%; top:${y0 * 100}%; color:${poz.kolor}">
      ${escapeHtml(haslo?.tytul ?? r.haslo)}</a>`;
  }).join('');

  const htmlKotwice = kotwice.map((k) => `
    <span class="mapa-kotwica" data-kotwica title="${escapeHtml(k.nazwa)} — kotwica etykiety podkładu"
      style="left:${k.x * 100}%; top:${k.y * 100}%">⌖<span class="mapa-kotwica-nazwa">${escapeHtml(k.nazwa)}</span></span>`).join('');

  return `
  <nav class="okruszki">
    <a href="#/">Codex</a> ›
    <a href="#/plany">Plany</a> ›
    <a href="#/plan/${escapeHtml(slugPlanu)}">${escapeHtml(mapa.tytul ?? slugPlanu)}</a> ›
    <span>Mapa</span>
  </nav>

  <article class="mapa-strona">
    <header class="mapa-naglowek">
      <h1>Mapa: ${escapeHtml(mapa.tytul ?? slugPlanu)}</h1>
      <p class="meta">wariant ${escapeHtml(String(mapa.wariant ?? '?'))} (podkład w pełni wektorowy — ADR 0009) ·
        pinezki kart: ${pinezki.length} · regiony: ${regiony.length} · kotwice etykiet: ${kotwice.length}</p>
    </header>

    <div class="mapa-pasek">
      <button class="przycisk mapa-przycisk" data-mapa-akcja="oddal" aria-label="Oddal">−</button>
      <button class="przycisk mapa-przycisk" data-mapa-akcja="przybliz" aria-label="Przybliż">+</button>
      <button class="przycisk mapa-przycisk" data-mapa-akcja="reset" aria-label="Reset widoku">⟲</button>
      <label class="mapa-kotwice-przelacznik"><input type="checkbox" data-mapa-kotwice> kotwice etykiet (weryfikacja)</label>
      <span class="mapa-podpowiedz">przeciągnij, aby przesunąć · kółko / przyciski, aby przybliżyć</span>
    </div>

    <div class="mapa-okno" id="mapa-okno" tabindex="0" role="application"
      aria-label="Mapa ${escapeHtml(mapa.tytul ?? slugPlanu)}: przeciągnij, aby przesunąć, kółko myszy, aby przybliżyć"
      data-plan="${escapeHtml(slugPlanu)}" data-pin="${escapeHtml(pinDocelowy)}" data-aspekt="${(szer / wys).toFixed(4)}">
      <div class="mapa-ruch" data-mapa-ruch>
        <div class="mapa-scena" style="aspect-ratio: ${szer} / ${wys}">
          ${mapa.podkladData
            ? `<img class="mapa-podklad" src="${mapa.podkladData}" alt="Podkład mapy: ${escapeHtml(mapa.tytul ?? slugPlanu)}" draggable="false">`
            : `<div class="mapa-brak-podkladu">Brak osadzonego podkładu (build nie wstrzyknął pliku — sprawdź maps/${escapeHtml(slugPlanu)}/podklad.svg).</div>`}
          <svg class="mapa-regiony" viewBox="0 0 ${szer} ${wys}" preserveAspectRatio="none" aria-hidden="true">${svgRegiony}</svg>
          <div class="mapa-warstwa">${htmlPinezki}${htmlRegionyEtykiety}</div>
          <div class="mapa-warstwa mapa-warstwa-kotwice" data-mapa-warstwa-kotwice hidden>${htmlKotwice}</div>
        </div>
      </div>
    </div>

    <section class="sekcja mapa-legenda">
      <h2>Legenda</h2>
      <ul class="mapa-legenda-lista">
        ${Object.entries(POZIOMY_PEWNOSCI).map(([klucz, p]) => `
          <li><span class="mapa-pinezka-legenda" style="background:${p.kolor}"></span>
            <strong>${p.etykieta}</strong> — ${p.opis}</li>`).join('')}
        <li><span class="mapa-obwodka-legenda"></span><strong>obwódka regionu</strong> — kraina hasła geograficznego (kolor = pewność)</li>
        <li>⌖ <strong>kotwica etykiety</strong> — pozycja odczytana z etykiety podkładu (warstwa do weryfikacji, domyślnie ukryta)</li>
      </ul>
    </section>

    <section class="sekcja">
      <h2>Pinezki kart (${pinezki.length})</h2>
      ${pinezki.length === 0
        ? stanPusty('Brak pinezek — mapa czeka na pierwszą kartę.',
          'Pinezka pojawi się razem z materializacją karty planu (proces MA4 — docs/guides/PROCES_MAP.md).')
        : `<ul class="lista-materializacji">${pinezki.map((p) => {
            const karta = dane.strony?.[p.karta];
            const poz = POZIOMY_PEWNOSCI[p.pewnosc] ?? POZIOMY_PEWNOSCI.przyblizona;
            return `<li><a href="#/mapa/${escapeHtml(slugPlanu)}?pin=${escapeHtml(p.karta)}">📍</a>
              <a href="#/karta/${escapeHtml(p.karta)}">${escapeHtml(karta?.tytul ?? p.karta)}</a>
              <span class="typ" style="border-color:${poz.kolor}; color:${poz.kolor}">${poz.etykieta}</span>
              <span class="meta">${escapeHtml(p.uzasadnienie ?? '')}</span></li>`;
          }).join('')}</ul>`}
    </section>

    ${kotwice.length ? `<details class="mapa-kotwice-lista"><summary>Kotwice etykiet podkładu (${kotwice.length}) — dane weryfikacyjne</summary>
      <ul>${kotwice.map((k) => `<li><strong>${escapeHtml(k.nazwa)}</strong>
        <span class="meta">x=${k.x}, y=${k.y}${k.notka ? ` · ${escapeHtml(k.notka)}` : ''}</span></li>`).join('')}</ul>
    </details>` : ''}

    <footer class="mapa-atrybucja">
      <p>Podkład: <a href="${escapeHtml(mapa.zrodlo?.url ?? '#')}" rel="noopener noreferrer" target="_blank">${escapeHtml(mapa.zrodlo?.tytul ?? 'źródło')}</a>
      — ${escapeHtml(mapa.zrodlo?.autor ?? '?')}, licencja ${escapeHtml(mapa.zrodlo?.licencja ?? '?')}${mapa.zrodlo?.pobrano ? `, pobrano ${escapeHtml(mapa.zrodlo.pobrano)}` : ''}.</p>
      <p class="meta">Współrzędne pinezek są znormalizowane 0–1 względem podkładu (PROCES_MAP MA2); lokalizacje ustalane z lore, nie z położenia kursora (MA4).</p>
    </footer>
  </article>`;
}

/**
 * Montuje interakcje mapy (wywoływane z main.js po renderze, jak
 * zamontujToryObrazow). Bezpiecznie wychodzi, gdy mapy nie ma w DOM
 * (testy na shimie DOM).
 */
export function zamontujMape(app) {
  const okno = app?.querySelector?.('.mapa-okno');
  if (!okno) return;

  const ruch = okno.querySelector('[data-mapa-ruch]');
  if (!ruch) return;
  const pasek = app.querySelector('.mapa-pasek') ?? okno;

  const stan = { k: 1, ox: 0, oy: 0 };
  const K_MIN = 0.4, K_MAX = 14;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  const nanies = () => {
    ruch.style.transform = `translate(${stan.ox}px, ${stan.oy}px) scale(${stan.k})`;
    for (const el of okno.querySelectorAll('[data-pinezka], [data-region-etykieta], [data-kotwica]')) {
      const baza = el.classList.contains('mapa-kotwica') ? 'translate(-50%, -50%)' : 'translate(-50%, -100%)';
      el.style.transform = `${baza} scale(${1 / stan.k})`;
    }
  };

  const zoomWokol = (px, py, k2) => {
    k2 = clamp(k2, K_MIN, K_MAX);
    stan.ox = px - (px - stan.ox) * (k2 / stan.k);
    stan.oy = py - (py - stan.oy) * (k2 / stan.k);
    stan.k = k2;
    nanies();
  };

  // deep-link ?pin= — wyśrodkuj na pinezce z przybliżeniem
  const escape = globalThis.CSS?.escape ?? ((s) => String(s));
  const pinDocelowy = okno.getAttribute('data-pin');
  if (pinDocelowy) {
    const el = okno.querySelector(`[data-pinezka="${escape(pinDocelowy)}"]`);
    if (el) {
      const w = okno.clientWidth || 800;
      const h = okno.clientHeight || 600;
      const aspekt = parseFloat(okno.getAttribute('data-aspekt')) || 3200 / 2400;
      stan.k = 2.5;
      stan.ox = w / 2 - parseFloat(el.dataset.x) * w * stan.k;
      stan.oy = h / 2 - parseFloat(el.dataset.y) * (w / aspekt) * stan.k;
    }
  }

  // przyciski (pasek nad mapą)
  for (const przycisk of pasek.querySelectorAll('.mapa-przycisk')) {
    przycisk.addEventListener('click', () => {
      const akcja = przycisk.getAttribute('data-mapa-akcja');
      const w = okno.clientWidth || 800, h = okno.clientHeight || 600;
      if (akcja === 'reset') { stan.k = 1; stan.ox = 0; stan.oy = 0; nanies(); }
      else if (akcja === 'przybliz') zoomWokol(w / 2, h / 2, stan.k * 1.35);
      else if (akcja === 'oddal') zoomWokol(w / 2, h / 2, stan.k / 1.35);
    });
  }

  // kółko myszy (zoom do kursora)
  okno.addEventListener('wheel', (e) => {
    e.preventDefault();
    const prost = okno.getBoundingClientRect();
    zoomWokol(e.clientX - prost.left, e.clientY - prost.top, stan.k * (e.deltaY < 0 ? 1.15 : 1 / 1.15));
  }, { passive: false });

  // pan + szczypnięcie (pointer events: mysz i dotyk)
  const wskazniki = new Map();
  let ostatniDystans = null;
  okno.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button, input, label')) return;
    okno.setPointerCapture?.(e.pointerId);
    wskazniki.set(e.pointerId, { x: e.clientX, y: e.clientY });
  });
  okno.addEventListener('pointermove', (e) => {
    if (!wskazniki.has(e.pointerId)) return;
    const prev = wskazniki.get(e.pointerId);
    wskazniki.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (wskazniki.size === 1) {
      stan.ox += e.clientX - prev.x;
      stan.oy += e.clientY - prev.y;
      nanies();
    } else if (wskazniki.size === 2) {
      const [a, b] = [...wskazniki.values()];
      const dystans = Math.hypot(a.x - b.x, a.y - b.y);
      const prost = okno.getBoundingClientRect();
      if (ostatniDystans) {
        zoomWokol((a.x + b.x) / 2 - prost.left, (a.y + b.y) / 2 - prost.top, stan.k * (dystans / ostatniDystans));
      }
      ostatniDystans = dystans;
    }
  });
  const koniecWskaznika = (e) => { wskazniki.delete(e.pointerId); if (wskazniki.size < 2) ostatniDystans = null; };
  okno.addEventListener('pointerup', koniecWskaznika);
  okno.addEventListener('pointercancel', koniecWskaznika);

  // warstwa kotwic (weryfikacja) — przełącznik w pasku
  const przelacznik = pasek.querySelector('[data-mapa-kotwice]');
  if (przelacznik) {
    przelacznik.addEventListener('change', () => {
      const warstwa = okno.querySelector('[data-mapa-warstwa-kotwice]');
      if (warstwa) warstwa.hidden = !przelacznik.checked;
    });
  }

  nanies();
}
