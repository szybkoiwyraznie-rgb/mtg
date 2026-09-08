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
 *
 * WARIANTY PODKŁADU (ADR 0035, Tarkir): `map.json` może nieść tablicę
 * `warianty[]` — kilka podkładów tej samej mapy (np. raster epoki
 * Dragonstorm T1 i rekonstrukcja epoki khanów T4). Współrzędne pinezek
 * i regionów są JEDNE, w układzie ZŁOTYM (= wariant domyślny); każdy
 * inny wariant niesie `kalibracja` {sx, sy, ox, oy} przeliczającą układ
 * złoty na swój (x' = ox + sx·x). Przełącznik w oknie mapy zmienia
 * podkład bez utraty widoku (środek i skala przeliczane przez
 * kalibrację); wariant z `etykiety:false` (czysty raster) nie pokazuje
 * żadnych etykiet Codexu — zostają wyłącznie pinezki kart.
 */

import { escapeHtml } from './markdown.js';
import { dajDane } from './data.js';
import { nieZnalesc, stanPusty, stopkaCzasu } from './render.js';

/** Surowy markup SVG podkładu → inline z klasą `mapa-podklad`.
 *  Tag korzenia może być po nim śladem (spacja, NOWA LINIA — eksport
 *  wektorowy nie jest jednorodny) albo `>`; pusty string = nie-SVG. */
function doMarkupPodkladu(markup) {
  if (typeof markup !== 'string' || !/<svg[\s>]/.test(markup)) return '';
  return markup.replace(/<svg(?=[\s>])/, '<svg class="mapa-podklad"');
}

/** Dekoduje base64 data-URI SVG do surowego znacznika (inline). */
function podkladSvgMarkup(dataUri) {
  const m = /^data:image\/svg\+xml;base64,(.*)$/.exec(dataUri);
  if (!m) return '';
  try {
    const bin = atob(m[1]);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const markup = new TextDecoder('utf-8').decode(bytes);
    return doMarkupPodkladu(markup);
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

/** Dwa inline SVG mapforge nie mogą współdzielić DOM-owych id defs.
 *  Geometria i nazwy kart pozostają nietknięte; zmieniamy tylko lokalne
 *  identyfikatory zasobów SVG i odwołania do nich (np. clipPath). */
export function prefiksujIdPodkladu(svg, prefiks) {
  const idy = new Map([...svg.matchAll(/\sid\s*=\s*(["'])(.*?)\1/g)]
    .map((m) => [m[2], `${prefiks}${m[2]}`]));
  return svg.replace(/(\sid\s*=\s*)(["'])(.*?)\2/g, (_, a, q, id) => `${a}${q}${idy.get(id)}${q}`)
    .replace(/url\((["']?)#([^)'"\s]+)\1\)/g, (caly, q, id) => idy.has(id) ? `url(${q}#${idy.get(id)}${q})` : caly)
    .replace(/(\s(?:xlink:)?href\s*=\s*)(["'])#([^"']+)\2/g,
      (caly, a, q, id) => idy.has(id) ? `${a}${q}#${idy.get(id)}${q}` : caly);
}

const KALIBRACJA_TOZSAMA = { sx: 1, sy: 1, ox: 0, oy: 0 };

/**
 * Warianty podkładu mapy (ADR 0035): `mapa.warianty[]` albo jeden wariant
 * zsyntetyzowany z pól płaskich map.json (mapy jednopodkładowe — bez
 * zmian zachowania). Każdy wariant: { id, tytul, epoka?, podklad, wymiary,
 * etykiety, kalibracja, podkladUrl?, podkladMarkup?, podkladData? }.
 */
export function wariantyMapy(mapa) {
  const lista = Array.isArray(mapa?.warianty) && mapa.warianty.length > 0
    ? mapa.warianty
    : [{
      id: 'podklad', tytul: mapa?.tytul ?? '', podklad: mapa?.podklad, wymiary: mapa?.wymiary,
      wariant: mapa?.wariant, podkladUrl: mapa?.podkladUrl, podkladData: mapa?.podkladData,
      podkladMarkup: mapa?.podkladMarkup, domyslny: true,
    }];
  return lista.map((w, i) => ({
    ...w,
    id: String(w.id ?? `podklad-${i}`),
    etykiety: w.etykiety !== false,
    kalibracja: { ...KALIBRACJA_TOZSAMA, ...(w.kalibracja ?? {}) },
  }));
}

/** Wariant domyślny = układ złoty współrzędnych (flaga `domyslny` albo pierwszy). */
export function wariantDomyslny(warianty) {
  return warianty.find((w) => w.domyslny) ?? warianty[0];
}

/** Układ złoty → układ wariantu (znormalizowane 0–1). */
export function doUkladuWariantu(w, x, y) {
  const k = w.kalibracja ?? KALIBRACJA_TOZSAMA;
  return [k.ox + k.sx * x, k.oy + k.sy * y];
}

/**
 * Siatka kafelków L1 (ADR 0039): master szer×wys cięty na kwadraty
 * `rozmiar` (ostatnia kolumna/wiersz mogą być węższe — partial edge).
 * Numeracja row-major: n = wiersz·kolumny + kolumna (k000.jpg …).
 * Single source of truth: używa tools/kafle.mjs (cięcie), silnik
 * (leniwe ładowanie) i testy.
 */
export function siatkaKafli(szer, wys, rozmiar) {
  const kolumny = Math.ceil(szer / rozmiar);
  const wiersze = Math.ceil(wys / rozmiar);
  const prost = (n) => {
    const c = n % kolumny;
    const r = Math.floor(n / kolumny);
    const x = c * rozmiar;
    const y = r * rozmiar;
    return { c, r, x, y, w: Math.min(rozmiar, szer - x), h: Math.min(rozmiar, wys - y) };
  };
  return { kolumny, wiersze, rozmiar, prost };
}

/**
 * Które kafelki pokryć prostokąt w układzie złotym [0,1].
 * Zwraca indeksy row-major (do URL-i) — czysta funkcja pod testy i silnik.
 */
export function kafleDlaRect(manifest, x0, y0, x1, y1) {
  const { kolumny, wiersze } = manifest;
  const c0 = Math.max(0, Math.floor(x0 * kolumny));
  const c1 = Math.min(kolumny - 1, Math.floor(x1 * kolumny));
  const r0 = Math.max(0, Math.floor(y0 * wiersze));
  const r1 = Math.min(wiersze - 1, Math.floor(y1 * wiersze));
  const out = [];
  for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) out.push(r * kolumny + c);
  return out;
}

/**
 * Prostokąt widzialny w układzie złotym [x0, y0, x1, y1] (clamp do [0,1]).
 * Wejście: wymiary okna, stan {k, ox, oy}, wymiary sceny (px, bez transformu),
 * kalibracja aktywnej sceny (złoty → scena). Czysta funkcja (testy + LOD).
 */
export function prostWidoczny({ oknoW, oknoH, stan, scenaW, scenaH, kal }) {
  const u0 = (0 - stan.ox) / (scenaW * stan.k);
  const v0 = (0 - stan.oy) / (scenaH * stan.k);
  const u1 = (oknoW - stan.ox) / (scenaW * stan.k);
  const v1 = (oknoH - stan.oy) / (scenaH * stan.k);
  const zloty = (u, s, o) => (u - o) / s;
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  return [
    clamp01(zloty(u0, kal.sx, kal.ox)), clamp01(zloty(v0, kal.sy, kal.oy)),
    clamp01(zloty(u1, kal.sx, kal.ox)), clamp01(zloty(v1, kal.sy, kal.oy)),
  ];
}

/** Czy prostokąty [x0,y0,x1,y1] mają część wspólną (brzeg styka się). */
export function prostNaklada(a, b) {
  return a[0] <= b[2] && b[0] <= a[2] && a[1] <= b[3] && b[1] <= a[3];
}

/** Czy punkt (x, y) leży w bbox [x0,y0,x1,y1]. */
export function wBbox(x, y, bbox) {
  return x >= bbox[0] && x <= bbox[2] && y >= bbox[1] && y <= bbox[3];
}

/**
 * Decyzja L2 (ADR 0039 §3): pokazuj pokrycie, gdy skala wizualna
 * w układzie złotym osiągnęła próg I viewport styka się z bbox.
 * Poza pokryciem głęboki zoom pokazuje dalej L1 (nigdy pustki).
 */
export function czyPokazacL2(kWizualna, prog, widoczny, bbox) {
  return kWizualna >= prog && prostNaklada(widoczny, bbox);
}

// ADR 0027 (v2 — drzewo HTML): każda mapa jest OSOBNĄ, samowystarczalną
// stroną `maps/<plan>.html` (inline SVG + pełny silnik + dane), którą
// główny artefakt osadza w <iframe>. file:// blokuje fetch, ale NIE
// blokuje iframe'ów — wersja offline z dysku działa w pełni, a artefakt
// główny pozostaje lekki niezależnie od liczby planów.

/** Surowy markup podkładu SVG: wstrzyknięty markup (strona mapy) albo
 *  base64 (dane inline). Pusty string = markup niedostępny. */
function surowyMarkupPodkladu(mapa) {
  if (mapa.podkladMarkup) {
    const inline = doMarkupPodkladu(mapa.podkladMarkup);
    if (inline) return inline;
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
  const warianty = wariantyMapy(mapa);
  const epoki = warianty.filter((w) => !Array.isArray(w.bbox)); // LOD: nakładki bbox poza przełącznikiem
  // proporcje iframe'a = wariant startowy (ADR 0035: domyślny albo ?epoka=)
  const startowy = epoki.find((w) => w.id === query.epoka) ?? wariantDomyslny(warianty);
  const szer = startowy.wymiary?.szerokosc ?? mapa.wymiary?.szerokosc ?? 3200;
  const wys = startowy.wymiary?.wysokosc ?? mapa.wymiary?.wysokosc ?? 2400;
  const pinezki = mapa.pinezki ?? [];
  const zapytanie = new URLSearchParams();
  if (query.pin) zapytanie.set('pin', query.pin);
  if (query.epoka && warianty.some((w) => w.id === query.epoka)) zapytanie.set('epoka', query.epoka);
  // ADR 0043: odsyłanie strony do mapy zbliżonej w określonym miejscu.
  if (query.x) zapytanie.set('x', query.x);
  if (query.y) zapytanie.set('y', query.y);
  const pin = zapytanie.toString() ? `?${zapytanie}` : '';
  const atrybucja = (z) => `<a href="${escapeHtml(z?.url ?? '#')}" rel="noopener noreferrer" target="_blank">${escapeHtml(z?.tytul ?? 'źródło')}</a>
      — ${escapeHtml(z?.autor ?? '?')}, licencja ${escapeHtml(z?.licencja ?? '?')}${z?.pobrano ? `, pobrano ${escapeHtml(z.pobrano)}` : ''}`;
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
      <p class="meta">pinezki kart: ${pinezki.length}</p>
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
        ${epoki.length > 1 ? `<li><span class="mapa-epoki-legenda">⇄</span><strong>przełącznik epok</strong> (w oknie mapy) — ${epoki.map((w) => `<em>${escapeHtml(w.tytul ?? w.id)}</em>${w.epoka ? ` (${escapeHtml(w.epoka)})` : ''}`).join(' ↔ ')}; pinezki kart są wspólne dla wszystkich podkładów (jeden układ współrzędnych — ADR 0035)</li>` : ''}
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
      ${warianty.length > 1
        ? warianty.map((w) => `<p>Podkład <strong>${escapeHtml(w.tytul ?? w.id)}</strong>${w.epoka ? ` (${escapeHtml(w.epoka)})` : ''}: ${atrybucja(w.zrodlo ?? mapa.zrodlo)}.</p>`).join('\n      ')
        : `<p>Podkład: ${atrybucja(mapa.zrodlo)}.</p>`}
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

  const pinezki = mapa.pinezki ?? [];
  const pinDocelowy = query.pin && pinezki.some((p) => p.karta === query.pin) ? query.pin : '';
  // ADR 0043: deep-link miejsca (?x=&y=, współrzędne normalizowane) —
  // odsyłanie strony do mapy zbliżonej w określonym miejscu, BEZ znacznika.
  const xDocelowy = Number(query.x);
  const yDocelowy = Number(query.y);
  const docelMiejsca = Number.isFinite(xDocelowy) && Number.isFinite(yDocelowy)
    && xDocelowy >= 0 && xDocelowy <= 1 && yDocelowy >= 0 && yDocelowy <= 1
    ? { x: xDocelowy, y: yDocelowy } : null;

  // Warianty podkładu (ADR 0035): układ ZŁOTY współrzędnych = wariant
  // domyślny; start z `?epoka=<id>` albo domyślny.
  // LOD (ADR 0039): wariant z `bbox` to NAKŁADKA L2 (przybliżenie wycinka
  // w ramce złotej — bez własnej sceny, automatyczna, spoza przełącznika
  // epok); `?epoka=<id-nakładki>` dopasowuje widok do jej bbox.
  const warianty = wariantyMapy(mapa);
  const zloty = wariantDomyslny(warianty);
  const nakladkiL2 = warianty.filter((w) => Array.isArray(w.bbox));
  const scenyWarianty = warianty.filter((w) => !Array.isArray(w.bbox));
  const epokaQuery = scenyWarianty.find((w) => w.id === query.epoka);
  const regionQuery = nakladkiL2.find((w) => w.id === query.epoka) ?? null;
  const start = epokaQuery ?? zloty;
  const maLOD = nakladkiL2.length > 0 || scenyWarianty.some((w) => w.kafle);
  const szer = start.wymiary?.szerokosc ?? mapa.wymiary?.szerokosc ?? 3200;
  const wys = start.wymiary?.wysokosc ?? mapa.wymiary?.wysokosc ?? 2400;

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
  // Per wariant: etykieta niesie `data-epoka` swojego podkładu i jest
  // widoczna tylko, gdy ten podkład jest aktywny; wariant z `etykiety:false`
  // (czysty raster — decyzja właściciela, ADR 0035) nie daje żadnych.
  // LOD (ADR 0039): warstwa kafelków L1 w scenie + nakładki L2 (bbox)
  // w scenie ZŁOTEJ (dziedziczą jej pan/zoom; przy przełączeniu epoki
  // chowają się razem ze złotą sceną). Etykiety Codexu ich nie dotyczą
  // (T1 ma własne napisy na rastrze).
  const htmlKafle = (w) => {
    if (!w.kafle) return '';
    const kf = w.kafle;
    const katalog = (w.podkladUrl ? String(w.podkladUrl).replace(/\/[^/]*$/, '')
      : String(slugPlanu).split('/').pop()) + `/${kf.katalog}/k`;
    return `<div class="mapa-kafle" data-kafle data-baza="${escapeHtml(katalog)}" data-format=".jpg"`
      + ` data-kolumny="${kf.kolumny}" data-wiersze="${kf.wiersze}" data-rozmiar="${kf.rozmiar}"`
      + ` data-prog="${Number(kf.prog ?? 2.5)}"`
      + ` data-master-w="${w.wymiary?.szerokosc ?? 0}" data-master-h="${w.wymiary?.wysokosc ?? 0}" hidden></div>`;
  };
  const htmlNakladkiL2 = nakladkiL2.map((w) => {
    const [x0, y0, x1, y1] = w.bbox ?? [];
    if ([x0, y0, x1, y1].some((v) => typeof v !== 'number')) return '';
    const src = w.podkladUrl ?? `${String(slugPlanu).split('/').pop()}/${w.podklad}`;
    return `<div class="mapa-l2" data-l2="${escapeHtml(w.id)}" data-prog="${Number(w.prog ?? 6)}"`
      + ` data-bbox="${[x0, y0, x1, y1].join(',')}"`
      + ` style="left:${(x0 * 100).toFixed(3)}%;top:${(y0 * 100).toFixed(3)}%;`
      + `width:${((x1 - x0) * 100).toFixed(3)}%;height:${((y1 - y0) * 100).toFixed(3)}%" hidden>`
      + `<img data-l2-img data-src="${escapeHtml(src)}" alt="Zbliżenie: ${escapeHtml(w.tytul ?? w.id)}" draggable="false"></div>`;
  }).join('');

  const sceny = scenyWarianty.map((w) => {
    const tier = w.wariant ?? mapa.wariant;
    const svgTypograficzny = w.etykiety && w.podklad && tier !== 'T1' && tier !== 'T2'
      && /\.svg$/i.test(String(w.podklad));
    let etykiety = [];
    let podkladMarkup = '';
    if (svgTypograficzny) {
      const surowy = surowyMarkupPodkladu(w);
      if (surowy) {
        const r = przeniesEtykietyDoNakladki(surowy);
        etykiety = r.etykiety;
        podkladMarkup = r.markup;
      }
    } else if (w.podklad && /\.svg$/i.test(String(w.podklad))) {
      podkladMarkup = surowyMarkupPodkladu(w);
    }
    return { w, etykiety, podkladMarkup };
  });

  const htmlEtykietyPodkladu = sceny.flatMap(({ w, etykiety }) => etykiety.map((e) => {
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
    const pozaEpoka = w.id !== start.id ? ' poza-epoka' : '';
    return `<span class="mapa-etykieta-podkladu ${tier}${e.kursywa ? ' kursywa' : ''}${pozaEpoka}" data-podklad-etykieta
      data-epoka="${escapeHtml(w.id)}"
      data-x="${e.x.toFixed(4)}" data-y="${e.y.toFixed(4)}" data-fs="${e.fs}" data-min-k="${prog.toFixed(2)}"
      data-kotwica="${e.kotwica}"${przy}
      style="left:${(bx * 100).toFixed(2)}%;top:${(by * 100).toFixed(2)}%${kolorPisma}">${e.tresc}</span>`;
  })).join('');

  // Sceny podkładów: każdy wariant ma własną scenę (podkład w swoim
  // układzie); widoczna jest jedna, przełącznik zmienia `hidden` i
  // przelicza widok kalibracją (bez utraty zoomu/pinezek).
  const wieleSvgT4 = sceny.filter(({ w, podkladMarkup }) => podkladMarkup && (w.wariant ?? mapa.wariant) === 'T4').length > 1;
  const htmlSceny = sceny.map(({ w, podkladMarkup }, i) => {
    const W = w.wymiary?.szerokosc ?? szer;
    const H = w.wymiary?.wysokosc ?? wys;
    const k = w.kalibracja;
    const wektor = wieleSvgT4 && podkladMarkup && (w.wariant ?? mapa.wariant) === 'T4'
      ? prefiksujIdPodkladu(podkladMarkup, `podklad-${i}-`) : podkladMarkup;
    const podklad = wektor
      || ((w.podkladData || w.podkladUrl)
        ? `<img class="mapa-podklad" src="${w.podkladData ?? w.podkladUrl}" alt="Podkład mapy: ${escapeHtml(w.tytul ?? mapa.tytul ?? slugPlanu)}" draggable="false"${w.id === start.id ? '' : ' loading="lazy"'}>`
        : `<div class="mapa-brak-podkladu">Brak osadzonego podkładu (build nie wstrzyknął pliku — sprawdź maps/${escapeHtml(slugPlanu)}/${escapeHtml(String(w.podklad ?? 'podklad.svg'))}).</div>`);
    const czyZlota = w.id === zloty.id;
    return `<div class="mapa-scena" data-scena data-epoka="${escapeHtml(w.id)}" data-aspekt="${W / H}"
          data-sx="${k.sx}" data-sy="${k.sy}" data-ox="${k.ox}" data-oy="${k.oy}" data-etykiety="${w.etykiety ? '1' : '0'}"${czyZlota ? ' data-zloty="1"' : ''}
          style="aspect-ratio: ${W} / ${H}"${w.id === start.id ? '' : ' hidden'}>
          ${podklad}
          ${htmlKafle(w)}
          ${czyZlota ? htmlNakladkiL2 : ''}
        </div>`;
  }).join('\n        ');

  // Przełącznik epok/podkładów (ADR 0035) — tylko gdy jest z czego wybierać.
  const htmlEpoki = scenyWarianty.length > 1 ? `
      <div class="mapa-epoki" role="group" aria-label="Podkład mapy (epoka)">
        ${scenyWarianty.map((w) => `<button type="button" data-epoka-przelacz="${escapeHtml(w.id)}"
          aria-pressed="${w.id === start.id ? 'true' : 'false'}"
          title="${escapeHtml(w.podtytul ?? w.epoka ?? w.tytul ?? w.id)}">${escapeHtml(w.tytul ?? w.id)}</button>`).join('')}
      </div>` : '';

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
      <p class="meta">pinezki kart: ${pinezki.length}</p>
    </header>`}
    <div class="mapa-okno" id="mapa-okno" tabindex="0" role="application"
      aria-label="Mapa ${escapeHtml(mapa.tytul ?? slugPlanu)}: przeciągnij, aby przesunąć, kółko myszy, aby przybliżyć"
      data-plan="${escapeHtml(slugPlanu)}" data-pin="${escapeHtml(pinDocelowy)}" data-aspekt="${szer / wys}" data-epoka="${escapeHtml(start.id)}"${docelMiejsca ? ` data-x="${docelMiejsca.x}" data-y="${docelMiejsca.y}"` : ''}${regionQuery ? ` data-region="${escapeHtml(regionQuery.id)}"` : ''}${maLOD ? ' data-kmax="22"' : ''}>
      <div class="mapa-ruch" data-mapa-ruch>
        ${htmlSceny}
      </div>
      <div class="mapa-nakladka" data-mapa-nakladka>${htmlEtykietyPodkladu}${htmlPinezki}</div>${htmlEpoki}
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

  // ── Warianty podkładu (ADR 0035): sceny [data-scena], jedna widoczna.
  // Pinezki i etykiety regionów są w układzie ZŁOTYM (wariant domyślny);
  // aktywna scena niesie kalibrację złoty → własny (sx, sy, ox, oy).
  const sceny = [...ruch.querySelectorAll('[data-scena]')];
  const scenaAktywna = () => sceny.find((s) => !s.hidden) ?? sceny[0] ?? null;
  const kalibracjaSceny = (s) => ({
    sx: parseFloat(s?.dataset.sx) || 1, sy: parseFloat(s?.dataset.sy) || 1,
    ox: parseFloat(s?.dataset.ox) || 0, oy: parseFloat(s?.dataset.oy) || 0,
  });
  let kal = kalibracjaSceny(scenaAktywna());
  const wUkladzie = (el) => {
    const x = parseFloat(el.dataset.x);
    const y = parseFloat(el.dataset.y);
    if (el.hasAttribute('data-podklad-etykieta')) return [x, y]; // już w układzie swojego wariantu
    return [kal.ox + kal.sx * x, kal.oy + kal.sy * y];
  };

  // ── LOD (ADR 0039): kafelki L1 + nakładki L2 żyją w złotej scenie ──
  // Mapy bez LOD nie mają tych węzłów — aktualizujLOD wychodzi natychmiast
  // i zachowanie jest bitowo zgodne z v1.
  const scenaZlota = sceny.find((s) => s.dataset?.zloty === '1') ?? null;
  const warstwaKafli = scenaZlota?.querySelector?.('[data-kafle]') ?? null;
  const manifestKafli = warstwaKafli ? {
    baza: warstwaKafli.dataset?.baza ?? '',
    format: warstwaKafli.dataset?.format ?? '.jpg',
    kolumny: parseInt(warstwaKafli.dataset?.kolumny ?? '0', 10),
    wiersze: parseInt(warstwaKafli.dataset?.wiersze ?? '0', 10),
    rozmiar: parseInt(warstwaKafli.dataset?.rozmiar ?? '0', 10),
    prog: parseFloat(warstwaKafli.dataset?.prog ?? '2.5'),
    masterW: parseFloat(warstwaKafli.dataset?.masterW ?? '0'),
    masterH: parseFloat(warstwaKafli.dataset?.masterH ?? '0'),
  } : null;
  const nakladki = [...(okno.querySelectorAll?.('[data-l2]') ?? [])].map((el) => ({
    el,
    img: el.querySelector?.('[data-l2-img]') ?? null,
    prog: parseFloat(el.dataset?.prog ?? '6'),
    bbox: String(el.dataset?.bbox ?? '').split(',').map(Number),
  })).filter((n) => n.bbox.length === 4 && n.bbox.every(Number.isFinite));
  const kafleCache = new Map(); // indeks row-major → <img> wmontowany w warstwę

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
  // Limity dotyczą WIZUALNEJ skali w układzie złotym (k · sx), nie
  // surowego CSS-owego k aktywnego podkładu. Inaczej T1 przy k=14 po
  // przełączeniu na T4 wpada w clamp i traci skalę (A3, audyt PR-21).
  const K_MIN = 0.4, K_MAX = 14;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  // Wymiary TREŚCI mapy (układ, nie transform — nie zmieniają się z zoomem;
  // zmienia je tylko przełączenie wariantu podkładu o innych proporcjach).
  let aspekt = parseFloat(scenaAktywna()?.dataset.aspekt) || parseFloat(okno.getAttribute('data-aspekt')) || 3200 / 2400;
  const szerokoscSceny = () => ruch.clientWidth || ruch.offsetWidth || okno.clientWidth || 800;
  const wysokoscSceny = () => szerokoscSceny() / aspekt;

  // Leniwe szczeble piramidy (ADR 0039 §2–3): L1 (kafelki mastera) od progu
  // S1 zamiast rozciąganego L0; L2 (pokrycie regionalne) od progu S2, tylko
  // gdy viewport styka się z bbox. Leniwy src (podmiana data-src → src)
  // dopiero przy zbliżaniu do progu — mapa bez zoomu nie ciągnie bajtów.
  const aktualizujLOD = () => {
    if (!warstwaKafli && nakladki.length === 0) return;
    if (scenaZlota?.hidden) return; // LOD obsługuje złotą scenę (inna epoka: pauza)
    const kWiz = stan.k * kal.sx;
    const w = szerokoscSceny();
    const h = wysokoscSceny();
    const widoczny = prostWidoczny({
      oknoW: okno.clientWidth || w, oknoH: okno.clientHeight || h,
      stan, scenaW: w, scenaH: h, kal,
    });
    if (warstwaKafli && manifestKafli) {
      const m = manifestKafli;
      const pokaz = kWiz >= m.prog && m.kolumny > 0 && m.masterW > 0;
      warstwaKafli.hidden = !pokaz;
      if (pokaz) {
        const marg = m.rozmiar / m.masterW; // 1 kafel zapasu przeciw „popom" przy panie
        const margH = m.rozmiar / m.masterH;
        const idx = kafleDlaRect(m, widoczny[0] - marg, widoczny[1] - margH,
          widoczny[2] + marg, widoczny[3] + margH);
        const zestaw = new Set(idx);
        const dok = globalThis.document;
        for (const n of idx) {
          if (kafleCache.has(n)) continue;
          const img = dok?.createElement?.('img');
          if (!img) break; // shim testowy bez document — logika działa, montażu nie ma
          const c = n % m.kolumny;
          const r = Math.floor(n / m.kolumny);
          img.setAttribute?.('src', `${m.baza}${String(n).padStart(3, '0')}${m.format}`);
          img.setAttribute?.('alt', '');
          img.setAttribute?.('draggable', 'false');
          if (img.style) {
            img.style.position = 'absolute';
            img.style.left = `${(c * m.rozmiar / m.masterW) * 100}%`;
            img.style.top = `${(r * m.rozmiar / m.masterH) * 100}%`;
            img.style.width = `${(Math.min(m.rozmiar, m.masterW - c * m.rozmiar) / m.masterW) * 100}%`;
            img.style.height = `${(Math.min(m.rozmiar, m.masterH - r * m.rozmiar) / m.masterH) * 100}%`;
          }
          warstwaKafli.appendChild?.(img);
          kafleCache.set(n, img);
        }
        for (const [n, img] of kafleCache) {
          if (zestaw.has(n)) continue;
          kafleCache.delete(n);
          img.remove?.();
        }
      }
    }
    for (const n of nakladki) {
      const pokaz = czyPokazacL2(kWiz, n.prog, widoczny, n.bbox);
      if (n.img && !n.img.getAttribute?.('src') && kWiz >= n.prog - 1.5) {
        n.img.setAttribute?.('src', n.img.dataset?.src ?? n.img.getAttribute?.('data-src') ?? '');
      }
      const widoczna = !n.el.hidden;
      if (pokaz && !widoczna) {
        n.el.hidden = false;
        // Fade-in: klasa w następnej klatce (bez rAF — synchronicznie).
        (globalThis.requestAnimationFrame ?? ((fn) => fn()))(() => n.el.classList?.toggle?.('widoczna', true));
      } else if (!pokaz && widoczna) {
        n.el.classList?.toggle?.('widoczna', false);
        n.el.hidden = true; // fade-out odpuszczony (natychmiastowe ukrycie)
      }
    }
  };

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
    aktualizujLOD();
    // Pinezki i etykiety regionów żyją w nakładce POZA skalowaną warstwą:
    // pozycję liczymy w pikselach ekranu (x·W·k + ox), więc markery mają
    // stały rozmiar i ostry render w każdym przybliżeniu — nie skalują
    // się z podkładem i nie dziedziczą rozciągniętej bitmapy warstwy.
    if (!nakladka) return;
    const w = szerokoscSceny();
    const h = wysokoscSceny();

    // Pass 1 — LOD etykiet podkładu (widoczność zależy tylko od zoomu);
    // etykiety nieaktywnych wariantów (poza-epoka) nie biorą udziału.
    const podkladowe = [...nakladka.querySelectorAll('[data-podklad-etykieta]')]
      .filter((el) => !el.classList.contains('poza-epoka'));
    // Na telefonie k≈1 wciąż oznacza miniaturę kilkuset pikseli.
    // Samo k włączało wszystkie podpisy jak na desktopie (QA A4).
    // LOD zależy też od szerokości sceny; tytuły (próg 0) pozostają.
    const skalaLod = stan.k * Math.min(1, w / 800);
    for (const el of podkladowe) {
      const prog = parseFloat(el.dataset.minK || '1');
      el.classList.toggle('poza-zasiegiem', skalaLod + 1e-9 < prog);
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
    for (const el of nakladka.querySelectorAll('[data-pinezka], [data-podklad-etykieta]')) {
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
      const [x, y] = wUkladzie(el);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      let px = (x * w * stan.k + stan.ox).toFixed(2);
      const py = (y * h * stan.k + stan.oy).toFixed(2);
      // Tytuł obszaru może przesunąć się od brzegu małego okna, aby nie
      // urywać nazwy. Tylko przy widocznej kotwicy: po pan poza ekran
      // nie „przyklejamy” nazwy nieobecnego regionu. Pinezki bez zmian.
      if (w <= 600 && el.classList.contains('tier-kontynent')
          && +px >= 0 && +px <= w && +py >= 0 && +py <= okno.clientHeight) {
        const polowa = (el.offsetWidth || 0) / 2;
        if (polowa + 4 < w / 2) px = clamp(+px, polowa + 4, w - polowa - 4).toFixed(2);
      }
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
    k2 = clamp(k2 * kal.sx, K_MIN, K_MAX) / kal.sx;
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
      const [px, py] = wUkladzie(el);
      stan.k = 2.5 / kal.sx; // ten sam wizualny zoom deep-linka w każdym wariancie
      // LOD: pinezka w bbox nakładki → od razu zoom z jej progiem (ADR 0039 §6).
      const gx = parseFloat(el.dataset.x);
      const gy = parseFloat(el.dataset.y);
      for (const n of nakladki) {
        if (Number.isFinite(gx) && Number.isFinite(gy) && wBbox(gx, gy, n.bbox)) {
          stan.k = Math.min(Math.max(stan.k, (n.prog * 1.1) / kal.sx), K_MAX);
        }
      }
      stan.ox = (okno.clientWidth || w) / 2 - px * w * stan.k;
      stan.oy = wysOkna / 2 - py * h * stan.k;
    }
  }

  // ADR 0043: deep-link miejsca ?x=&y= (współrzędne normalizowane, układ
  // złoty) — odsyłanie strony (karty/hasła/planu) do mapy zbliżonej w
  // określonym miejscu. Centruje i przybliża JAK ?pin=, ale BEZ zostawiania
  // znacznika na mapie (na mapie oznaczenia noszą wyłącznie karty).
  const docelX = okno.getAttribute?.('data-x');
  const docelY = okno.getAttribute?.('data-y');
  if (docelX !== null && docelY !== null && docelX !== '' && docelY !== '') {
    const gx = parseFloat(docelX);
    const gy = parseFloat(docelY);
    if (Number.isFinite(gx) && Number.isFinite(gy) && gx >= 0 && gx <= 1 && gy >= 0 && gy <= 1) {
      const w = szerokoscSceny();
      const h = wysokoscSceny();
      const wysOkna = okno.clientHeight || h;
      const px = kal.ox + kal.sx * gx;
      const py = kal.oy + kal.sy * gy;
      stan.k = 2.5 / kal.sx; // ten sam wizualny zoom co deep-link ?pin=
      // LOD: miejsce w bbox nakładki → od razu zoom z jej progiem (ADR 0039 §6).
      for (const n of nakladki) {
        if (wBbox(gx, gy, n.bbox)) {
          stan.k = Math.min(Math.max(stan.k, (n.prog * 1.1) / kal.sx), K_MAX);
        }
      }
      stan.ox = (okno.clientWidth || w) / 2 - px * w * stan.k;
      stan.oy = wysOkna / 2 - py * h * stan.k;
    }
  }

  // ?epoka=<nakładka-L2> (ADR 0039): dopasuj widok do jej bbox — deep-link regionu.
  const regionDocelowy = okno.getAttribute?.('data-region') ?? '';
  if (regionDocelowy) {
    const n = nakladki.find((x) => x.el.dataset?.l2 === regionDocelowy);
    if (n) {
      const w = szerokoscSceny();
      const h = wysokoscSceny();
      const winW = okno.clientWidth || w;
      const winH = okno.clientHeight || h;
      const [x0, y0, x1, y1] = n.bbox;
      const kDopasuj = Math.min(winW / ((x1 - x0) * kal.sx * w), winH / ((y1 - y0) * kal.sy * h));
      stan.k = Math.min(Math.max(kDopasuj * 0.95, n.prog / kal.sx), K_MAX);
      stan.ox = winW / 2 - (kal.ox + kal.sx * (x0 + x1) / 2) * w * stan.k;
      stan.oy = winH / 2 - (kal.oy + kal.sy * (y0 + y1) / 2) * h * stan.k;
    }
  }

  // ── Przełącznik wariantów/epok (ADR 0035): zmiana podkładu BEZ utraty
  // widoku — punkt złoty pod środkiem okna i wizualna skala zostają
  // (k przeliczone przez stosunek sx kalibracji), pinezki się nie ruszają.
  const przelaczEpoke = (id) => {
    const cel = sceny.find((s) => s.dataset.epoka === id);
    const stara = scenaAktywna();
    if (!cel || !stara || cel === stara) return;
    const W = szerokoscSceny();
    const H = wysokoscSceny();
    const cx = (okno.clientWidth || W) / 2;
    const cy = (okno.clientHeight || H) / 2;
    const ua = (cx - stan.ox) / (W * stan.k);
    const va = (cy - stan.oy) / (H * stan.k);
    const u = (ua - kal.ox) / kal.sx;                 // punkt złoty pod środkiem
    const v = (va - kal.oy) / kal.sy;
    stara.hidden = true;
    cel.hidden = false;
    const kal2 = kalibracjaSceny(cel);
    // Przełączenie nie jest zoomem: zmienia tylko jednostki. Nie wolno
    // ograniczać k ponownie (także po dopasowaniu bardzo wysokiej mapy).
    const k2 = stan.k * (kal.sx / kal2.sx);
    kal = kal2;
    aspekt = parseFloat(cel.dataset.aspekt) || aspekt;
    okno.setAttribute('data-aspekt', String(aspekt));
    okno.setAttribute('data-epoka', id);
    const H2 = wysokoscSceny();
    stan.k = k2;
    stan.ox = cx - (kal.ox + kal.sx * u) * W * k2;
    stan.oy = cy - (kal.oy + kal.sy * v) * H2 * k2;
    for (const b of okno.querySelectorAll('[data-epoka-przelacz]')) {
      b.setAttribute('aria-pressed', b.getAttribute('data-epoka-przelacz') === id ? 'true' : 'false');
    }
    for (const el of nakladka?.querySelectorAll('[data-podklad-etykieta]') ?? []) {
      el.classList.toggle('poza-epoka', el.getAttribute('data-epoka') !== id);
    }
    stanUkladu.k = -1;                                // wymuś nowy układ etykiet
    nanies();
  };
  for (const b of okno.querySelectorAll('[data-epoka-przelacz]')) {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      przelaczEpoke(b.getAttribute('data-epoka-przelacz'));
    });
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
