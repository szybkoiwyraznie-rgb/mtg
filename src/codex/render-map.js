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
import { nieZnalesc, stanPusty, stopkaCzasu } from './render.js';

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
    // Etykieta OBIEKTOWA (mapforge, ADR 0022): data-ax/ay/r = kotwica
    // obiektu + promień ikony (jednostki mapy) — nakładka liczy z nich
    // pozycję zależną od zoomu (stała WIZUALNA odległość od ikony).
    const pax = /\sdata-ax="(-?[\d.]+)"/.exec(atryb);
    const pay = /\sdata-ay="(-?[\d.]+)"/.exec(atryb);
    const par = /\sdata-r="(-?[\d.]+)"/.exec(atryb);
    const parg = /\sdata-rg="(-?[\d.]+)"/.exec(atryb);
    // Kolor pisma z SVG (granat wód, zieleń biomów, czerń kontynentów —
    // ADR 0024/0025): nakładka MUSI go przenieść, inaczej CSS klas
    // nadpisuje warstwowe kolory mapy (feedback: „granatu nie widać").
    const fill = /\sfill="(#[0-9a-fA-F]{3,6})"/.exec(atryb)?.[1] ?? '';
    etykiety.push({
      x: parseFloat(mx[1]) / w,
      y: parseFloat(my[1]) / h,
      fs,
      kotwica,
      kursywa: /italic/.test(atryb),
      kontynent: /tytul-kontynentu/.test(atryb),
      tresc: tresc.trim(),
      ax: pax && pay ? parseFloat(pax[1]) / w : null,
      ay: pax && pay ? parseFloat(pay[1]) / h : null,
      r: par ? parseFloat(par[1]) / w : 0,
      rg: parg ? parseFloat(parg[1]) / w : (par ? parseFloat(par[1]) / w : 0),
      fill,
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

// ADR 0027 (v2 — drzewo HTML): każda mapa jest OSOBNĄ, samowystarczalną
// stroną `maps/<plan>.html` (inline SVG + pełny silnik + dane), którą
// główny artefakt osadza w <iframe>. file:// blokuje fetch, ale NIE
// blokuje iframe'ów — wersja offline z dysku działa w pełni, a artefakt
// główny pozostaje lekki niezależnie od liczby planów.

/** Surowy markup podkładu SVG: wstrzyknięty markup (strona mapy) albo
 *  base64 (dane inline). Pusty string = markup niedostępny. */
function surowyMarkupPodkladu(mapa) {
  if (mapa.podkladMarkup && mapa.podkladMarkup.includes('<svg ')) {
    return mapa.podkladMarkup.replace('<svg ', '<svg class="mapa-podklad" ', 1);
  }
  if (mapa.podkladData) return podkladSvgMarkup(mapa.podkladData);
  return '';
}

/** Widok trasy #/mapa/<plan> w artefakcie głównym (ADR 0027 v2):
 *  <iframe> dopasowany proporcjami do mapy = czyste okno mapy; CAŁA
 *  reszta (legenda, lista pinezek, atrybucja, warstwa karty) renderuje
 *  się TUTAJ, w artefakcie bazowym (feedback właściciela). Warstwa
 *  karty otwiera się nad całym Codexem (postMessage z iframe). */
export function renderMapeIframe(slugPlanu, query = {}) {
  const dane = dajDane();
  const mapa = dane.mapy?.[slugPlanu];
  if (!mapa || mapa.problem || !mapa.stronaMapy) {
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
  const pin = query.pin ? `?pin=${encodeURIComponent(query.pin)}` : '';
  return `
  <nav class="okruszki">
    <a href="#/">Codex</a> ›
    <a href="#/plany">Plany</a> ›
    <a href="#/plan/${escapeHtml(String(slugPlanu).split('/')[0])}">${escapeHtml(dane.strony?.[String(slugPlanu).split('/')[0]]?.tytul ?? String(slugPlanu).split('/')[0])}</a> ›
    <span>Mapa</span>
  </nav>
  <article class="mapa-strona">
    <header class="mapa-naglowek">
      <h1>Mapa: ${escapeHtml(mapa.tytul ?? slugPlanu)}</h1>
      <p class="meta">pinezki kart: ${pinezki.length} · regiony: ${(mapa.regiony ?? []).length}</p>
    </header>

    <iframe class="mapa-iframe" src="${escapeHtml(mapa.stronaMapy)}${pin}"
      style="aspect-ratio: ${szer} / ${wys}" scrolling="no"
      title="Mapa: ${escapeHtml(mapa.tytul ?? slugPlanu)}" loading="lazy"></iframe>

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
    ${stopkaCzasu(mapa.czas)}
  </article>`;
}

/** Wiąże zamykanie warstwy karty (✕ / tło / Esc) w artefakcie bazowym.
 *  Otwieranie robi nasłuch postMessage w main.js (codexKarta). */
export function zamontujWarstweMapy(app) {
  const warstwa = app?.querySelector?.('[data-map-warstwa]');
  if (!warstwa) return;
  const zamknij = () => {
    warstwa.hidden = true;
    const tresc = warstwa.querySelector?.('[data-map-warstwa-tresc]');
    if (tresc) tresc.innerHTML = '';
  };
  for (const el of warstwa.querySelectorAll?.('[data-map-warstwa-zamknij]') ?? []) {
    el.addEventListener?.('click', zamknij);
  }
  warstwa.addEventListener?.('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault?.(); zamknij(); }
  });
}

/** Renderuje stronę mapy planu (HTML; interakcje montuje zamontujMape). */
export function renderMape(slugPlanu, query = {}, { osadzona = false } = {}) {
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
  // (T2, np. mapome) typografii nie ruszamy (T2 renderuje się jako <img>).
  let etykietyPodkladu = [];
  let podkladMarkup = '';
  const svgTypograficzny = mapa.podklad && mapa.wariant !== 'T1' && mapa.wariant !== 'T2'
    && /\.svg$/i.test(String(mapa.podklad));
  if (svgTypograficzny) {
    const surowy = surowyMarkupPodkladu(mapa);
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
    // Etykieta obiektowa (ADR 0022): kotwica obiektu → pozycjonowanie
    // zoom-stabilne (zawsze POD ikoną, konflikt → NAD) w `nanies()`.
    const przy = e.ax != null
      ? ` data-ax="${e.ax.toFixed(4)}" data-ay="${e.ay.toFixed(4)}" data-r="${e.r.toFixed(5)}" data-rg="${e.rg.toFixed(5)}"`
      : '';
    const bx = e.ax != null ? e.ax : e.x;
    const by = e.ax != null ? e.ay : e.y;
    const kolorPisma = e.fill ? `;color:${e.fill}` : '';
    return `<span class="mapa-etykieta-podkladu ${tier}${e.kursywa ? ' kursywa' : ''}" data-podklad-etykieta
      data-x="${e.x.toFixed(4)}" data-y="${e.y.toFixed(4)}" data-fs="${e.fs}" data-min-k="${prog.toFixed(2)}"
      data-kotwica="${e.kotwica}"${przy}
      style="left:${(bx * 100).toFixed(2)}%;top:${(by * 100).toFixed(2)}%${kolorPisma}">${e.tresc}</span>`;
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
  ${osadzona ? '' : `<nav class="okruszki">
    <a href="#/">Codex</a> ›
    <a href="#/plany">Plany</a> ›
    <a href="#/plan/${escapeHtml(String(slugPlanu).split('/')[0])}">${escapeHtml(dane.strony?.[String(slugPlanu).split('/')[0]]?.tytul ?? String(slugPlanu).split('/')[0])}</a> ›
    <span>Mapa</span>
  </nav>`}

  <article class="mapa-strona${osadzona ? ' mapa-strona-osadzona' : ''}">
    ${osadzona ? '' : `<header class="mapa-naglowek">
      <h1>Mapa: ${escapeHtml(mapa.tytul ?? slugPlanu)}</h1>
      <p class="meta">pinezki kart: ${pinezki.length} · regiony: ${regiony.length}</p>
    </header>`}
    <div class="mapa-okno" id="mapa-okno" tabindex="0" role="application"
      aria-label="Mapa ${escapeHtml(mapa.tytul ?? slugPlanu)}: przeciągnij, aby przesunąć, kółko myszy, aby przybliżyć"
      data-plan="${escapeHtml(slugPlanu)}" data-pin="${escapeHtml(pinDocelowy)}" data-aspekt="${(szer / wys).toFixed(4)}">
      <div class="mapa-ruch" data-mapa-ruch>
        <div class="mapa-scena" style="aspect-ratio: ${szer} / ${wys}">
          ${podkladMarkup
            || ((mapa.podkladData || mapa.podkladUrl)
              ? `<img class="mapa-podklad" src="${mapa.podkladData ?? mapa.podkladUrl}" alt="Podkład mapy: ${escapeHtml(mapa.tytul ?? slugPlanu)}" draggable="false">`
              : `<div class="mapa-brak-podkladu">Brak osadzonego podkładu (build nie wstrzyknął pliku — sprawdź maps/${escapeHtml(slugPlanu)}/podklad.svg).</div>`)}
          <svg class="mapa-regiony" viewBox="0 0 ${szer} ${wys}" preserveAspectRatio="none" aria-hidden="true">${svgRegiony}</svg>
        </div>
      </div>
      <div class="mapa-nakladka" data-mapa-nakladka>${htmlEtykietyPodkladu}${htmlPinezki}${htmlRegionyEtykiety}</div>
    </div>

    ${osadzona ? '' : `${pinezki.length > 0 ? `
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
    </footer>`}
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

  // Strona mapy w iframe (ADR 0027 v2): warstwa karty i nawigacja
  // treściowa żyją w ARTEFAKCIE-RODZICU — pinezka wysyła `codexKarta`
  // (rodzic otwiera warstwę NAD CAŁYM Codexem), pozostałe linki hash
  // wysyłają `codexHash` (rodzic zmienia trasę).
  if (opcje.doRodzica && globalThis.parent && globalThis.parent !== globalThis) {
    app.addEventListener('click', (e) => {
      const a = e.target?.closest?.('a[href^="#/"]');
      if (!a) return;
      e.preventDefault();
      const wiadomosc = a.hasAttribute('data-pinezka')
        ? { codexKarta: a.getAttribute('data-pinezka') }
        : { codexHash: a.getAttribute('href') };
      try { globalThis.parent.postMessage(wiadomosc, '*'); } catch { /* rodzic niedostępny */ }
    });
  }

  const ruch = okno.querySelector('[data-mapa-ruch]');
  if (!ruch) return;
  const nakladka = okno.querySelector('[data-mapa-nakladka]');

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
  // Cache układu etykiet (ADR 0022). UWAGA: start = -1, nie NaN —
  // Math.abs(k - NaN) > próg jest ZAWSZE false, więc układ kolizyjny
  // nigdy by nie wystartował (bug wykryty recenzją: „Emeria" i „ruiny
  // w niebie" na wspólnej kotwicy kładły się jedna na drugiej).
  const stanUkladu = { k: -1 };
  const K_MIN = 0.4, K_MAX = 14;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  // Wymiary TREŚCI mapy (układ, nie transform — nie zmieniają się z zoomem).
  const aspekt = parseFloat(okno.getAttribute('data-aspekt')) || 3200 / 2400;
  const szerokoscSceny = () => ruch.clientWidth || ruch.offsetWidth || okno.clientWidth || 800;
  const wysokoscSceny = () => szerokoscSceny() / aspekt;

  // Domyślny widok = cała mapa dopasowana do okna (contain, wyśrodkowana),
  // bez ucinania. Okno ma stałą wysokość (clamp), a scena szerokość 100% +
  // aspect-ratio — dla wyższych map scena wychodziła poza okno i była
  // ucinana (feedback właściciela: „ucina w 4/5 od dołu"). `dopasuj()` liczy
  // skalę i przesunięcie tak, aby cała mapa była widoczna, potem można
  // przybliżyć/panować. Reset też wraca do dopasowania (nie do k=1).
  const dopasuj = () => {
    const W = szerokoscSceny();
    const H = okno.clientHeight || (W / aspekt);
    const k = Math.min(1, (H * aspekt) / W);     // contain: nie powiększaj, tylko zmieść
    stan.k = k;
    stan.ox = (W - W * k) / 2;
    stan.oy = (H - (W / aspekt) * k) / 2;
    nanies();
  };

  const nanies = () => {
    ruch.style.transform = `translate(${stan.ox}px, ${stan.oy}px) scale(${stan.k})`;
    // Pinezki i etykiety regionów żyją w nakładce POZA skalowaną warstwą:
    // pozycję liczymy w pikselach ekranu (x·W·k + ox), więc markery mają
    // stały rozmiar i ostry render w każdym przybliżeniu — nie skalują
    // się z podkładem i nie dziedziczą rozciągniętej bitmapy warstwy.
    if (!nakladka) return;
    const w = szerokoscSceny();
    const h = wysokoscSceny();

    // Pass 1 — LOD etykiet podkładu (widoczność zależy tylko od zoomu).
    const podkladowe = [...nakladka.querySelectorAll('[data-podklad-etykieta]')];
    for (const el of podkladowe) {
      const prog = parseFloat(el.dataset.minK || '1');
      el.classList.toggle('poza-zasiegiem', stan.k + 1e-9 < prog);
    }

    // Pass 2 — UKŁAD etykiet OBIEKTOWYCH (ADR 0022): przeliczany tylko przy
    // zmianie zoomu (pan nie zmienia geometrii względnej). Wzór właściciela:
    // napis ZAWSZE POD kotwicą obiektu, w odległości promienia ikony
    // (skaluje się z zoomem → wizualnie stała, „zaraz obok"); konflikt →
    // ZAWSZE przerzut NAD; dalej — drabinka pionowa. Deterministycznie,
    // w kolejności (ay, ax, tekst).
    if (Math.abs(stan.k - stanUkladu.k) > 1e-3) {
      stanUkladu.k = stan.k;
      // PRZESZKODY: widoczne etykiety NIEkotwiczone (tytuły krain/akwenów)
      // — kotwiczone muszą je omijać także w nakładce (w SVG robi to
      // rozstaw; bez tego „Murasa" siadała na „Thunder Gap").
      const przeszkody = [];
      for (const el of podkladowe) {
        if (el.dataset.ax || el.classList.contains('poza-zasiegiem')) continue;
        if (!el._mfW) { el._mfW = el.offsetWidth || 60; el._mfH = el.offsetHeight || 16; }
        const x = parseFloat(el.dataset.x) * w * stan.k;
        const y = parseFloat(el.dataset.y) * h * stan.k;
        const dx = el.dataset.kotwica === 'start' ? 0 : el.dataset.kotwica === 'end' ? -el._mfW : -el._mfW / 2;
        przeszkody.push([x + dx, y - el._mfH * 0.82, x + dx + el._mfW, y + el._mfH * 0.24]);
      }
      const zakotwiczone = podkladowe
        .filter((el) => el.dataset.ax && !el.classList.contains('poza-zasiegiem'))
        .map((el) => {
          if (!el._mfW) { el._mfW = el.offsetWidth || 60; el._mfH = el.offsetHeight || 16; }
          return {
            el,
            ax: parseFloat(el.dataset.ax), ay: parseFloat(el.dataset.ay),
            r: parseFloat(el.dataset.r || '0'),
            rg: parseFloat(el.dataset.rg || el.dataset.r || '0'),
          };
        })
        .sort((a, b) => (a.ay - b.ay) || (a.ax - b.ax)
          || a.el.textContent.localeCompare(b.el.textContent, 'pl'));
      const polozone = [...przeszkody];
      const koliduje = (b, u) => b[0] < u[2] && u[0] < b[2] && b[1] < u[3] && u[1] < b[3];
      const M = 3;                                 // stały margines ekranowy (px)
      for (const z of zakotwiczone) {
        const sx = z.ax * w * stan.k;              // współrzędne „świata" (bez pan)
        const sy = z.ay * h * stan.k;
        const rDol = z.r * w * stan.k;             // prześwit POD ikoną (asymetryczny)
        const rGora = z.rg * w * stan.k;           // prześwit NAD (sylwetka wulkanu/iglicy)
        const bw = z.el._mfW, bh = z.el._mfH;
        let wybor = null;
        for (let s = 0; s < 12; s++) {
          const pietro = Math.floor(s / 2) * (bh + 2);
          const dol = s % 2 === 0;
          const top = dol ? sy + rDol + M + pietro : sy - rGora - M - pietro - bh;
          const bb = [sx - bw / 2, top, sx + bw / 2, top + bh];
          if (polozone.some((u) => koliduje(bb, u))) continue;
          wybor = { dol, pietro, bb };
          break;
        }
        if (!wybor) {                              // ostateczność: reguła bazowa POD
          const bb = [sx - bw / 2, sy + rDol + M, sx + bw / 2, sy + rDol + M + bh];
          wybor = { dol: true, pietro: 0, bb };
        }
        polozone.push(wybor.bb);
        z.el.dataset.mfStrona = wybor.dol ? 'd' : 'g';
        z.el.dataset.mfPietro = String(wybor.pietro);
      }
    }

    // Pass 3 — pozycjonowanie wszystkich markerów nakładki.
    for (const el of nakladka.querySelectorAll('[data-pinezka], [data-region-etykieta], [data-podklad-etykieta]')) {
      if (el.dataset.ax) {
        // Etykieta obiektowa: kotwica obiektu + strona/piętro z Pass 2.
        const px = (parseFloat(el.dataset.ax) * w * stan.k + stan.ox).toFixed(2);
        const pietro = parseFloat(el.dataset.mfPietro || '0');
        const M = 3;
        if (el.dataset.mfStrona === 'g') {
          const rGora = parseFloat(el.dataset.rg || el.dataset.r || '0') * w * stan.k;
          const py = (parseFloat(el.dataset.ay) * h * stan.k + stan.oy - rGora - M - pietro).toFixed(2);
          el.style.transform = `translate(${px}px, ${py}px) translate(-50%, -100%)`;
        } else {
          const rDol = parseFloat(el.dataset.r || '0') * w * stan.k;
          const py = (parseFloat(el.dataset.ay) * h * stan.k + stan.oy + rDol + M + pietro).toFixed(2);
          el.style.transform = `translate(${px}px, ${py}px) translate(-50%, 0)`;
        }
        continue;
      }
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
    }
  };

  const zoomWokol = (px, py, k2) => {
    k2 = clamp(k2, K_MIN, K_MAX);
    stan.ox = px - (px - stan.ox) * (k2 / stan.k);
    stan.oy = py - (py - stan.oy) * (k2 / stan.k);
    stan.k = k2;
    nanies();
  };

  // Domyślnie dopasuj całą mapę (pin deep-link niżej nadpisze, jeśli jest)
  dopasuj();

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

  // Sterowanie bez paska (decyzja właściciela 2026-09-02): zoom = kółko
  // myszy / pinch; ESCAPE = reset widoku (dopasowanie całej mapy).
  const naEscape = (e) => { if (e.key === 'Escape') { e.preventDefault?.(); dopasuj(); } };
  okno.addEventListener('keydown', naEscape);
  globalThis.document?.addEventListener?.('keydown', naEscape);

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
