/**
 * Silnik map v1 (ADR 0007/0009, ROADMAP K3): podkład mapy + wektorowa
 * warstwa regionów (SVG w układzie podkładu) + pinezki i etykiety
 * regionów w NAKŁADCE EKRANOWEJ — warstwie poza transformem zoomu,
 * pozycjonowanej w pikselach. Dzięki temu markery mają stały rozmiar
 * i ostre krawędzie w każdym przybliżeniu. Pan: pointer events
 * (mysz + dotyk + szczypnięcie), zoom: kółko / przyciski; deep-link
 * `#/mapa/<plan>?pin=<slug-karty>`.
 *
 * Podkład SVG jest osadzany INLINE (a nie jako <img> z data-URI):
 * <img> z SVG przeglądarka rasteryzuje w rozmiarze layoutu, a CSS-owy
 * transform zoomu skaluje wtedy ROZCIĄGNIĘTĄ BITMAPĘ → pikseloza.
 * Inline <svg> pozostaje wektorem i przerysowuje się w każdym
 * przybliżeniu (rozwiązuje pikselozę bez zwiększania rozmiaru pliku).
 * Dla podkładów PNG/JPG zostaje <img> (raster — nie ma czego
 * przerysowywać wektorowo). Współrzędne pinezek/regionów są
 * znormalizowane 0–1 (MA2) — silnik mnoży je przez wymiary podkładu.
 *
 * ETYKIETY PODKŁADU o stałym rozmiarze ekranowym (feedback właściciela):
 * <text> z atrybutami x/y jest duplikowany do nakładki ekranowej
 * (większa czcionka, halo, NIE skaluje się z zoomem), oryginał w SVG
 * dostaje visibility:hidden. Etykiety bez x/y (textPath, pozycjonowane
 * transformem — np. line-art mapome) zostają w SVG. Drobne napisy mają
 * LOD: data-min-k — widoczne dopiero od danego przybliżenia.
 */

import { escapeHtml } from './markdown.js';
import { dajDane } from './data.js';
import { nieZnalesc, stanPusty } from './render.js';

/** Dekoduje base64 data-URI SVG do surowego znacznika (inline). */
function podkladSvgMarkup(dataUri) {
  const m = /^data:image\/svg\+xml;base64,(.*)$/.exec(dataUri);
  if (!m) return '';
  try {
    const bin = atob(m[1]);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const markup = new TextDecoder('utf-8').decode(bytes);
    return markup.includes('<svg ') ? markup.replace('<svg ', '<svg class="mapa-podklad" ', 1) : '';
  } catch (e) {
    return '';
  }
}

/**
 * Wyciąga z markupu podkładu SVG etykiety <text x="…" y="…">Treść</text>
 * (zwykłe, pozycjonowane atrybutami — nie textPath/transformem).
 * Zwraca { etykiety, markup } — markup z visibility:hidden na źródłach,
 * żeby nie było podwójnych napisów (etykieta żyje w nakładce).
 */
function przeniesEtykietyDoNakladki(markup) {
  const vb = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(markup);
  const etykiety = [];
  if (!vb) return { etykiety, markup };
  const [w, h] = [parseFloat(vb[1]), parseFloat(vb[2])];
  // Spacer po tokenach z transitioning dziedziczenia text-anchor (stos grup <g>):
  // etykieta bez własnego atrybutu kotwiczy się tak, jak w podkładzie SVG
  // (middle z grupy okalającej albo domyślne start) — inaczej nakładka
  // rozjeżdża się z obiektem (feedback właściciela: Beyeen/Malakir/Lulea).
  const czesci = markup.split(/(<\/g>|<g\b[^>]*>|<text\b[^>]*>[^<]*<\/text>)/);
  const stos = ['start'];
  let out = '';
  for (const cz of czesci) {
    if (!cz) continue;
    if (cz.startsWith('</g>')) {
      if (stos.length > 1) stos.pop();
      out += cz;
      continue;
    }
    if (/^<g\b/.test(cz)) {
      const gm = /text-anchor="(start|middle|end)"/.exec(cz);
      stos.push(gm ? gm[1] : stos[stos.length - 1]);
      out += cz;
      continue;
    }
    const tm = /^<text\b([^>]*)>([^<]*)<\/text>$/.exec(cz);
    if (!tm) { out += cz; continue; }
    const atryb = tm[1];
    const tresc = tm[2];
    const mx = /\sx="(-?[\d.]+)"/.exec(atryb);
    const my = /\sy="(-?[\d.]+)"/.exec(atryb);
    if (!mx || !my || !tresc.trim()) { out += cz; continue; } // textPath/transform → zostaje w SVG
    const kotwica = /\stext-anchor="(start|middle|end)"/.exec(atryb)?.[1]
      ?? (/tytul-kontynentu/.test(atryb) ? 'middle' : stos[stos.length - 1]);
    const fs = parseFloat((/font-size="([\d.]+)"/.exec(atryb) || [0, 15])[1]);
    etykiety.push({
      x: parseFloat(mx[1]) / w,
      y: parseFloat(my[1]) / h,
      fs,
      kotwica,
      kursywa: /italic/.test(atryb),
      kontynent: /tytul-kontynentu/.test(atryb),
      tresc: tresc.trim(),
    });
    out += `<text data-podklad-orj="1" style="visibility:hidden"${atryb}>${tresc}</text>`;
  }
  return { etykiety, markup: out };
}

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

  // Etykiety podkładu → nakładka ekranowa (stały rozmiar przy zoomie).
  // Tylko T3+ (podkłady własne: ręczne/mapforge) — podkładów adoptowanych
  // (T2, np. mapome) typografii nie ruszamy.
  let etykietyPodkladu = [];
  let podkladMarkup = '';
  if (mapa.podkladData && mapa.podklad && mapa.wariant !== 'T1' && mapa.wariant !== 'T2' && /\.svg$/i.test(String(mapa.podklad))) {
    const surowy = podkladSvgMarkup(mapa.podkladData);
    if (surowy) {
      const r = przeniesEtykietyDoNakladki(surowy);
      etykietyPodkladu = r.etykiety;
      podkladMarkup = r.markup;
    }
  }
  const htmlEtykietyPodkladu = etykietyPodkladu.map((e) => {
    // LOD: drobne napisy pokazują się od przybliżenia, w którym ich
    // oryginalny rozmiar „urósłby" do czytelnych ~16 px ekranu
    const prog = e.kontynent ? 0 : e.fs >= 17 ? 1 : Math.min(1.6, Math.max(1, 16 / e.fs));
    const tier = e.kontynent ? 'tier-kontynent' : e.fs >= 17 ? 'tier-glowna' : 'tier-szczegol';
    return `<span class="mapa-etykieta-podkladu ${tier}${e.kursywa ? ' kursywa' : ''}" data-podklad-etykieta
      data-x="${e.x.toFixed(4)}" data-y="${e.y.toFixed(4)}" data-fs="${e.fs}" data-min-k="${prog.toFixed(2)}"
      data-kotwica="${e.kotwica}"
      style="left:${(e.x * 100).toFixed(2)}%;top:${(e.y * 100).toFixed(2)}%">${e.tresc}</span>`;
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
      <p class="meta">pinezki kart: ${pinezki.length} · regiony: ${regiony.length}</p>
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
            ? (podkladMarkup
                || `<img class="mapa-podklad" src="${mapa.podkladData}" alt="Podkład mapy: ${escapeHtml(mapa.tytul ?? slugPlanu)}" draggable="false">`)
            : `<div class="mapa-brak-podkladu">Brak osadzonego podkładu (build nie wstrzyknął pliku — sprawdź maps/${escapeHtml(slugPlanu)}/podklad.svg).</div>`}
          <svg class="mapa-regiony" viewBox="0 0 ${szer} ${wys}" preserveAspectRatio="none" aria-hidden="true">${svgRegiony}</svg>
        </div>
      </div>
      <div class="mapa-nakladka" data-mapa-nakladka>${htmlEtykietyPodkladu}${htmlPinezki}${htmlRegionyEtykiety}</div>
    </div>

    ${pinezki.length > 0 ? `
    <div class="mapa-warstwa" data-map-warstwa hidden role="dialog" aria-modal="true"
      aria-label="Karta Katalogowa otwarta z mapy">
      <div class="mapa-warstwa-tlo" data-map-warstwa-zamknij></div>
      <div class="mapa-warstwa-panel">
        <button type="button" class="mapa-warstwa-zamknij" data-map-warstwa-zamknij
          aria-label="Zamknij i wróć do mapy" title="Zamknij i wróć do mapy (Esc)">✕</button>
        <div class="mapa-warstwa-tresc" data-map-warstwa-tresc></div>
      </div>
    </div>` : ''}

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
 *
 * `opcje.renderKarty` (renderer Karty Katalogowej) i `opcje.zamontujKarte`
 * (montaż torów obrazów) włączają WARSTWĘ KARTY (feedback właściciela B2):
 * kliknięcie pinezki otwiera wpis katalogowy na zmaksymalizowanej warstwie
 * NAD mapą (zamknięcie: ✕ / tło / Esc — powrót do mapy w tym samym
 * stanie zoomu/pana, bo mapa nie jest odmontowywana). Bez `renderKarty`
 * pinezka pozostaje zwykłym linkem (nawigacja #/karta/…) — progressive
 * enhancement działające też z wyłączonym JS.
 */
export function zamontujMape(app, opcje = {}) {
  const okno = app?.querySelector?.('.mapa-okno');
  if (!okno) return;

  const ruch = okno.querySelector('[data-mapa-ruch]');
  if (!ruch) return;
  const nakladka = okno.querySelector('[data-mapa-nakladka]');
  const pasek = app.querySelector('.mapa-pasek') ?? okno;

  // ── Warstwa karty (B2): otwarcie z pinezki, zamknięcie z powrotem ──
  const warstwa = app.querySelector('[data-map-warstwa]');
  const trescWarstwy = warstwa?.querySelector?.('[data-map-warstwa-tresc]');
  const renderKarty = opcje.renderKarty;

  const zamknijWarstwe = () => {
    if (!warstwa) return;
    warstwa.hidden = true;
    if (trescWarstwy) trescWarstwy.innerHTML = ''; // zwolnij pamięć
    okno.focus?.();
  };

  if (warstwa && trescWarstwy && typeof renderKarty === 'function') {
    const otworzKarte = (slug) => {
      trescWarstwy.innerHTML = renderKarty(slug);
      warstwa.hidden = false;
      opcje.zamontujKarte?.(warstwa); // tory obrazów (Scryfall/FOT/KON)
      warstwa.querySelector('[data-map-warstwa-zamknij]')?.focus?.();
    };
    for (const el of nakladka.querySelectorAll('[data-pinezka]')) {
      el.addEventListener('click', (e) => {
        // modyfikatory = zamiar użytkownika (nowa karta/okno) — nie standing
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        otworzKarte(el.dataset.pinezka);
      });
    }
    for (const btn of warstwa.querySelectorAll('[data-map-warstwa-zamknij]')) {
      btn.addEventListener('click', zamknijWarstwe);
    }
    // Esc zamyka, dopóki fokus jest w warstwie (keydown bąbelkuje do niej)
    warstwa.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); zamknijWarstwe(); }
    });
  }

  // Etykiety podkładu mają bazę left/top % (działają bez JS w widoku
  // domyślnym); po montażu przechodzą na pozycjonowanie transformem.
  for (const el of nakladka?.querySelectorAll('[data-podklad-etykieta]') ?? []) {
    el.style.left = '0%';
    el.style.top = '0%';
  }

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
    for (const el of nakladka.querySelectorAll('[data-pinezka], [data-region-etykieta], [data-podklad-etykieta]')) {
      const x = parseFloat(el.dataset.x);
      const y = parseFloat(el.dataset.y);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      const px = (x * w * stan.k + stan.ox).toFixed(2);
      const py = (y * h * stan.k + stan.oy).toFixed(2);
      if (!el.hasAttribute('data-podklad-etykieta')) {
        el.style.transform = `translate(${px}px, ${py}px)`;
        continue;
      }
      // Kotwiczenie jak w SVG: poziomo wg text-anchor (middle/start/end),
      // pionowo baseline na punkcie (typografia unosi tekst nad baseline).
      // Uwaga: to MUSI być w jednym transformie — osobny CSS-owy translate
      // zostałby nadpisany przez inline styl (bug: etykiety przesunięte
      // w prawo-dół względem obiektów).
      const dx = el.dataset.kotwica === 'start' ? '0%' : el.dataset.kotwica === 'end' ? '-100%' : '-50%';
      el.style.transform = `translate(${px}px, ${py}px) translate(${dx}, -0.82em)`;
      // LOD (level of detail): drobna etykieta widoczna dopiero od swojego progu
      const prog = parseFloat(el.dataset.minK || '1');
      el.classList.toggle('poza-zasiegiem', stan.k + 1e-9 < prog);
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
