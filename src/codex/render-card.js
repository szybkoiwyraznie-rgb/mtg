/**
 * Karta Katalogowa — pełny renderer strony karty.
 *
 * Tory obrazów (ADR 0008, kolejność): druk Scryfalla (domyślny, online) →
 * FOT ./img/<imgId>FOT.png (tylko lokalnie) → KON ./img/<imgId>KON.png →
 * twarz syntetyczna (fallback). Zasada dziedziczona z mtg-game: obraz jest
 * domyślny, twarz syntetyczna jest fallbackiem — nigdy nie ma pustej ramki.
 * Tory FOT/KON wykrywane sondą (Image onload/onerror) i cicho ukrywane,
 * gdy plik nie istnieje (na Pages ich nie widać).
 */

import { escapeHtml, manaIkony } from './markdown.js';
import { dajStrone, dajDane, backlinki } from './data.js';
import { stanPusty, chipsyTagow, kropkiKolorow, nieZnalesc, stopkaCzasu } from './render.js';
import { POZIOMY_PEWNOSCI } from './render-map.js';

export function renderKarte(slug) {
  const karta = dajStrone(slug);
  if (!karta || karta.typ !== 'karta') return nieZnalesc(`karta „${slug}"`);
  const dane = dajDane();

  const plan = dane.strony[karta.plan];
  const sc = karta.scryfall ?? null;
  const kol = karta.kolekcja ?? null;
  const linkujace = backlinki(slug).map((s) => dane.strony[s]).filter(Boolean);

  return `
  <nav class="okruszki">
    <a href="#/">Codex</a> ›
    <a href="#/plany">Plany</a> ›
    <a href="#/plan/${karta.plan}">${plan ? escapeHtml(plan.tytul) : escapeHtml(karta.plan)}</a> ›
    <span>${escapeHtml(karta.tytul)}</span>
  </nav>

  <article class="karta-katalogowa">
    <header class="karta-naglowek">
      <h1>${escapeHtml(karta.tytul)}</h1>
      <p class="meta">${escapeHtml(karta.imgId)} · ${escapeHtml(karta.wydanie ?? '')}${karta.materializacja ? ` · materializacja ${escapeHtml(karta.materializacja)}` : ''}</p>
      ${kropkiKolorow(karta.kolory)}
    </header>

    <div class="karta-uklad">
      <aside class="infoboks">
        ${toryObrazow(karta, sc)}
        ${miniMapa(karta, dane)}
        <dl class="dane-karty">
          ${sc ? wiersz('Typ', sc.type_line) : ''}
          ${sc?.mana_cost ? wiersz('Koszt', manaIkony(sc.mana_cost)) : ''}
          ${sc ? wiersz('Wydanie', `${sc.set_name} (${String(sc.set).toUpperCase()})`) : ''}
          ${sc ? wiersz('Rzadkość', sc.rarity) : ''}
          ${sc ? wiersz('Artysta', sc.artist) : ''}
          ${sc?.power ? wiersz('P/T', `${sc.power}/${sc.toughness}`) : ''}
          ${sc?.keywords?.length ? wiersz('Zdolności', sc.keywords.join(', ')) : ''}
          ${kol?.mv !== undefined && kol?.mv !== null && kol.mv !== '' ? wiersz('MV (arkusz)', String(kol.mv)) : ''}
          ${plan ? wiersz('Plan', `<a href="#/plan/${plan.slug}">${escapeHtml(plan.tytul)}</a>`) : ''}
          ${karta.pinezka ? wiersz('Na mapie', `<a href="#/mapa/${karta.plan}?pin=${slug}">pokaż na mapie (${escapeHtml(POZIOMY_PEWNOSCI[karta.pinezka.pewnosc]?.etykieta ?? karta.pinezka.pewnosc)})</a>`) : ''}
        </dl>
        ${sc ? `<p class="meta"><a href="${escapeHtml(sc.scryfall_uri ?? '#')}" target="_blank" rel="noopener">Karta na Scryfall ↗</a></p>` : ''}
        ${chipsyTagow(karta.tagi)}
      </aside>

      <div class="karta-tresc">
        <figure class="karta-fot" data-fot hidden>
          <img data-fot-img data-zrodla="${escapeHtml(kandydaciObrazow(karta.imgId, 'FOT'))}"
            alt="Panorama FOT — wizualizacja właściciela: ${escapeHtml(karta.tytul)}"
            decoding="async">
        </figure>
        ${wstawKon(karta.html ?? '', karta)}
        ${sekcjaLinkujacychKarty(linkujace)}
        ${stopkaCzasu(karta.czas)}
      </div>
    </div>
  </article>`;
}

/**
 * Lista względnych ścieżek sondowania dla pliku FOT/KON (ADR 0008).
 * Kolejność plików właściciela w katalogu img/ bywa różna — od samego
 * numeru materializacji (1FOT.png) po pełny imgId (1LTRFOT.png).
 * Dajemy NAJPIERW krótki wariant (sam leading numer), potem pełny imgId —
 * sonda bierze pierwszą ścieżkę, która się załaduje.
 */
function kandydaciObrazow(imgId, tor) {
  const id = String(imgId ?? '');
  const num = id.match(/^\d+/)?.[0] ?? '';
  const warianty = [];
  if (num) warianty.push(`${num}${tor}.png`);      // 1FOT.png / 2KON.png
  warianty.push(`${id}${tor}.png`);                 // 1LTRFOT.png / 2BFZKON.png
  return warianty.map((w) => `./img/${w}`).join('|');
}

/** Slot KON (bestiariusz) wpleciony pod pierwszą sekcją treści (ADR 0017). */
function wstawKon(html, karta) {
  const kon = `
        <figure class="karta-kon" data-kon hidden>
          <img data-kon-img data-zrodla="${escapeHtml(kandydaciObrazow(karta.imgId, 'KON'))}"
            alt="Bestiariusz KON — wizualizacja właściciela: ${escapeHtml(karta.tytul)}"
            decoding="async">
        </figure>`;
  const h2 = [...String(html).matchAll(/<h2[ >]/g)];
  if (h2.length < 2) return html + kon; // jedna sekcja (lub brak) → na koniec
  return html.slice(0, h2[1].index) + kon + html.slice(h2[1].index);
}

function wiersz(klucz, wartosc) {
  return `<dt>${escapeHtml(klucz)}</dt><dd>${wartosc}</dd>`;
}

/** Miniatura mapy planu z pinezką tej karty (klik → mapa z wycentrowaną pinezką). */
function miniMapa(karta, dane) {
  if (!karta.pinezka) return '';
  const mapa = dane.mapy?.[karta.plan];
  if (!mapa || mapa.problem || !(mapa.podkladData || mapa.podkladUrl)) return '';
  const pinezka = (mapa.pinezki ?? []).find((p) => p.karta === karta.slug);
  if (!pinezka) return '';
  const kolor = (POZIOMY_PEWNOSCI[pinezka.pewnosc] ?? POZIOMY_PEWNOSCI.przyblizona).kolor;
  return `<a class="mini-mapa" href="#/mapa/${karta.plan}?pin=${karta.slug}"
    title="Pokaż na mapie planu (pewność: ${escapeHtml(POZIOMY_PEWNOSCI[pinezka.pewnosc]?.etykieta ?? pinezka.pewnosc)})">
    <img src="${mapa.podkladData ?? mapa.podkladUrl}" alt="Miniatura mapy planu: ${escapeHtml(mapa.tytul ?? karta.plan)}" loading="lazy">
    <span class="mini-mapa-pinezka" style="left:${pinezka.x * 100}%; top:${pinezka.y * 100}%; background:${kolor}"></span>
    <span class="mini-mapa-podpis">📍 ${escapeHtml(mapa.tytul ?? karta.plan)} — pokaż na mapie</span>
  </a>`;
}

/** Obraz karty w infoboksie (druk Scryfalla) + sloty FOT/KON w treści
 * (ADR 0017: rysują się same, gdy pliki istnieją; cichy fallback). */
function toryObrazow(karta, sc) {
  const scryfallSrc = sc?.image_uris?.normal ?? null;
  return `
  <figure class="obraz-karty" id="obraz-karty">
    <div class="obraz-rama">
      <img id="tor-glowny" ${scryfallSrc ? `src="${escapeHtml(scryfallSrc)}"` : ''}
           alt="Ilustracja karty ${escapeHtml(karta.tytul)}" loading="lazy" decoding="async"
           onerror="this.style.display='none';document.getElementById('twarz-syntetyczna').style.display='flex'">
      <div id="twarz-syntetyczna" class="twarz-syntetyczna" style="display:${scryfallSrc ? 'none' : 'flex'}">
        <span class="nazwa-syntetyczna">${escapeHtml(karta.tytul)}</span>
        ${kropkiKolorow(karta.kolory)}
      </div>
    </div>
  </figure>`;
}

/** Sondowanie torów FOT/KON + podmiana obrazu (montowane przez main.js). */
export function zamontujToryObrazow(kontener) {
  // Sonda slotów FOT/KON (ADR 0008/0017): slot rysuje się w treści karty,
  // gdy plik istnieje w względnym ./img/ obok artefaktu (np.
  // c:\mtg\index.html + c:\mtg\img\1FOT.png). Każdy slot ma listę
  // kandydackich ścieżek (data-zrodla, '|'-rozdzielona) — sonda idzie po
  // kolei i pokazuje slot przy pierwszym, który się załaduje. Gdy żaden
  // nie zadziała (Pages bez katalogu img/), slot znika bez śladu
  // (cichy fallback — na Pages slotów nie widać).
  for (const slot of kontener?.querySelectorAll?.('[data-fot], [data-kon]') ?? []) {
    const img = slot.querySelector('img');
    if (!img) continue;
    const zrodla = (img.getAttribute('data-zrodla') || img.getAttribute('src') || '')
      .split('|').map((s) => s.trim()).filter(Boolean);
    let i = 0;
    const probuj = () => {
      if (i >= zrodla.length) { slot.remove(); return; }
      img.src = zrodla[i++];
    };
    img.onload = () => { slot.hidden = false; };
    img.onerror = () => { probuj(); };
    probuj();
  }
}

function sekcjaLinkujacychKarty(linkujace) {
  if (linkujace.length === 0) return '';
  return `<section class="backlinki">
    <h2>Linkujące strony</h2>
    <ul>${linkujace.map((s) => `<li><a href="#/${s.typ === 'karta' ? 'karta' : s.typ === 'haslo' ? 'haslo' : 'plan'}/${s.slug}">${escapeHtml(s.tytul)}</a> <span class="typ">${s.typ}</span></li>`).join('')}</ul>
  </section>`;
}

export { stanPusty };
