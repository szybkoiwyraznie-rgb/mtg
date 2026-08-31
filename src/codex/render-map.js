/**
 * Silnik map v1 (ADR 0007/0009, ROADMAP K3): podkład mapy jako <img>
 * (data-URI z builda) + wektorowa warstwa regionów (SVG w układzie
 * podkładu) + pinezki i etykiety regionów w NAKŁADCE EKRANOWEJ —
 * warstwie poza transformem zoomu, pozycjonowanej w pikselach.
 * Dzięki temu markery mają stały rozmiar i ostre krawędzie w każdym
 * przybliżeniu (skalowana warstwa kompozytowa przeglądarki zamienia
 * się w rozciągniętą bitmapę — patrz LESSONS L5). Pan: pointer events
 * (mysz + dotyk + szczypnięcie), zoom: kółko / przyciski; deep-link
 * `#/mapa/<plan>?pin=<slug-karty>`.
 *
 * Współrzędne pinezek/regionów są znormalizowane 0–1 (MA2) — silnik
 * mnoży je przez wymiary podkładu (viewBox SVG = wymiary).
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
      'Mapa powstaje razem z pierwszą kartą osadzoną w tym planie.',
    );
  }

  const szer = mapa.wymiary?.szerokosc ?? 3200;
  const wys = mapa.wymiary?.wysokosc ?? 2400;
  const pinezki = mapa.pinezki ?? [];
  const regiony = mapa.regiony ?? [];
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
      style="--kolor:${poz.kolor}"
      title="${escapeHtml(karta?.tytul ?? p.karta)} — pewność: ${poz.etykieta}">
      <span class="mapa-pinezka-glow"></span>
      <span class="mapa-pinezka-etykieta">${escapeHtml(karta?.tytul ?? p.karta)}</span>
    </a>`;
  }).join('');

  const htmlRegionyEtykiety = regiony.map((r) => {
    const [x0, y0, x1, y1] = r.bbox ?? [];
    if ([x0, y0, x1, y1].some((v) => typeof v !== 'number')) return '';
    const haslo = dane.strony?.[r.haslo];
    const poz = POZIOMY_PEWNOSCI[r.pewnosc] ?? POZIOMY_PEWNOSCI.przyblizona;
    return `<a href="#/haslo/${escapeHtml(r.haslo)}" class="mapa-etykieta-regionu" data-region-etykieta
      data-x="${(x0 + x1) / 2}" data-y="${y0}" style="--kolor:${poz.kolor}">
      <span>${escapeHtml(haslo?.tytul ?? r.haslo)}</span></a>`;
  }).join('');

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
      <p class="meta">wariant ${escapeHtml(String(mapa.wariant ?? '?'))} (podkład w pełni wektorowy) ·
        pinezki kart: ${pinezki.length} · regiony: ${regiony.length}</p>
    </header>

    <div class="mapa-pasek">
      <button class="przycisk mapa-przycisk" data-mapa-akcja="oddal" aria-label="Oddal">−</button>
      <button class="przycisk mapa-przycisk" data-mapa-akcja="przybliz" aria-label="Przybliż">+</button>
      <button class="przycisk mapa-przycisk" data-mapa-akcja="reset" aria-label="Reset widoku">⟲</button>
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
        </div>
      </div>
      <div class="mapa-nakladka" data-mapa-nakladka>${htmlPinezki}${htmlRegionyEtykiety}</div>
    </div>

    <section class="sekcja mapa-legenda">
      <h2>Legenda</h2>
      <ul class="mapa-legenda-lista">
        ${Object.entries(POZIOMY_PEWNOSCI).map(([klucz, p]) => `
          <li><span class="mapa-pinezka-legenda" style="background:${p.kolor}"></span>
            <strong>${p.etykieta}</strong> — ${p.opis}</li>`).join('')}
        <li><span class="mapa-obwodka-legenda"></span><strong>obwódka regionu</strong> — kraina hasła geograficznego (kolor = pewność)</li>
      </ul>
    </section>

    <section class="sekcja">
      <h2>Pinezki kart (${pinezki.length})</h2>
      ${pinezki.length === 0
        ? stanPusty('Brak pinezek — mapa czeka na pierwszą kartę.',
          'Pinezka pojawi się razem z pierwszą kartą osadzoną w tym planie.')
        : `<ul class="lista-materializacji">${pinezki.map((p) => {
            const karta = dane.strony?.[p.karta];
            const poz = POZIOMY_PEWNOSCI[p.pewnosc] ?? POZIOMY_PEWNOSCI.przyblizona;
            return `<li><a href="#/mapa/${escapeHtml(slugPlanu)}?pin=${escapeHtml(p.karta)}">📍</a>
              <a href="#/karta/${escapeHtml(p.karta)}">${escapeHtml(karta?.tytul ?? p.karta)}</a>
              <span class="typ" style="border-color:${poz.kolor}; color:${poz.kolor}">${poz.etykieta}</span>
              <span class="meta">${escapeHtml(p.uzasadnienie ?? '')}</span></li>`;
          }).join('')}</ul>`}
    </section>

    <footer class="mapa-atrybucja">
      <p>Podkład: <a href="${escapeHtml(mapa.zrodlo?.url ?? '#')}" rel="noopener noreferrer" target="_blank">${escapeHtml(mapa.zrodlo?.tytul ?? 'źródło')}</a>
      — ${escapeHtml(mapa.zrodlo?.autor ?? '?')}, licencja ${escapeHtml(mapa.zrodlo?.licencja ?? '?')}${mapa.zrodlo?.pobrano ? `, pobrano ${escapeHtml(mapa.zrodlo.pobrano)}` : ''}.</p>
      <p class="meta">Współrzędne pinezek są znormalizowane względem podkładu; lokalizacje ustalane z lore, nie z położenia kursora.</p>
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
  const nakladka = okno.querySelector('[data-mapa-nakladka]');
  const pasek = app.querySelector('.mapa-pasek') ?? okno;

  const stan = { k: 1, ox: 0, oy: 0 };
  const K_MIN = 0.4, K_MAX = 14;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  // Wymiary TREŚCI mapy (układ, nie transform — nie zmieniają się z zoomem).
  const aspekt = parseFloat(okno.getAttribute('data-aspekt')) || 3200 / 2400;
  const szerokoscSceny = () => ruch.clientWidth || ruch.offsetWidth || okno.clientWidth || 800;
  const wysokoscSceny = () => szerokoscSceny() / aspekt;

  const nanies = () => {
    ruch.style.transform = `translate(${stan.ox}px, ${stan.oy}px) scale(${stan.k})`;
    // Pinezki i etykiety regionów żyją w nakładce POZA skalowaną warstwą:
    // pozycję liczymy w pikselach ekranu (x·W·k + ox), więc markery mają
    // stały rozmiar i ostry render w każdym przybliżeniu — nie skalują
    // się z podkładem i nie dziedziczą rozciągniętej bitmapy warstwy.
    if (!nakladka) return;
    const w = szerokoscSceny();
    const h = wysokoscSceny();
    for (const el of nakladka.querySelectorAll('[data-pinezka], [data-region-etykieta]')) {
      const x = parseFloat(el.dataset.x);
      const y = parseFloat(el.dataset.y);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      el.style.transform = `translate(${(x * w * stan.k + stan.ox).toFixed(2)}px, ${(y * h * stan.k + stan.oy).toFixed(2)}px)`;
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
      const w = szerokoscSceny();
      const h = wysokoscSceny();
      const wysOkna = okno.clientHeight || h;
      stan.k = 2.5;
      stan.ox = (okno.clientWidth || w) / 2 - parseFloat(el.dataset.x) * w * stan.k;
      stan.oy = wysOkna / 2 - parseFloat(el.dataset.y) * h * stan.k;
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

  nanies();
}
