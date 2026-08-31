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
import { stanPusty, chipsyTagow, kropkiKolorow, nieZnalesc } from './render.js';
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
        ${karta.html ?? ''}
        ${sekcjaLinkujacychKarty(linkujace)}
      </div>
    </div>
  </article>`;
}

function wiersz(klucz, wartosc) {
  return `<dt>${escapeHtml(klucz)}</dt><dd>${wartosc}</dd>`;
}

/** Miniatura mapy planu z pinezką tej karty (klik → mapa z wycentrowaną pinezką). */
function miniMapa(karta, dane) {
  if (!karta.pinezka) return '';
  const mapa = dane.mapy?.[karta.plan];
  if (!mapa || mapa.problem || !mapa.podkladData) return '';
  const pinezka = (mapa.pinezki ?? []).find((p) => p.karta === karta.slug);
  if (!pinezka) return '';
  const kolor = (POZIOMY_PEWNOSCI[pinezka.pewnosc] ?? POZIOMY_PEWNOSCI.przyblizona).kolor;
  return `<a class="mini-mapa" href="#/mapa/${karta.plan}?pin=${karta.slug}"
    title="Pokaż na mapie planu (pewność: ${escapeHtml(POZIOMY_PEWNOSCI[pinezka.pewnosc]?.etykieta ?? pinezka.pewnosc)})">
    <img src="${mapa.podkladData}" alt="Miniatura mapy planu: ${escapeHtml(mapa.tytul ?? karta.plan)}" loading="lazy">
    <span class="mini-mapa-pinezka" style="left:${pinezka.x * 100}%; top:${pinezka.y * 100}%; background:${kolor}"></span>
    <span class="mini-mapa-podpis">📍 ${escapeHtml(mapa.tytul ?? karta.plan)} — pokaż na mapie</span>
  </a>`;
}

/** Tory obrazów z cichym fallbackiem (ADR 0008). */
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
    <div class="tory-przyciski" data-imgid="${escapeHtml(karta.imgId)}" data-slug="${escapeHtml(karta.slug)}">
      <button type="button" class="tor-przycisk" data-tor="scryfall" hidden>Druk</button>
      <button type="button" class="tor-przycisk" data-tor="FOT" hidden>FOT</button>
      <button type="button" class="tor-przycisk" data-tor="KON" hidden>KON</button>
    </div>
  </figure>`;
}

/** Sondowanie torów FOT/KON + podmiana obrazu (montowane przez main.js). */
export function zamontujToryObrazow(kontener) {
  const tory = kontener?.querySelector('.tory-przyciski');
  if (!tory) return;
  const imgId = tory.dataset.imgid;
  const slug = tory.dataset.slug;
  const glowny = kontener.querySelector('#tor-glowny');
  const syntetyczna = kontener.querySelector('#twarz-syntetyczna');

  const ustaw = (src) => {
    if (!src) return;
    syntetyczna.style.display = 'none';
    glowny.style.display = '';
    glowny.src = src;
  };

  const przyciski = {};
  for (const btn of tory.querySelectorAll('.tor-przycisk')) {
    przyciski[btn.dataset.tor] = btn;
    btn.addEventListener('click', () => {
      if (btn.dataset.tor === 'scryfall') {
        ustaw(dajStrone(slug)?.scryfall?.image_uris?.normal ?? null);
      } else {
        ustaw(`./img/${imgId}${btn.dataset.tor}.png`);
      }
      for (const b of Object.values(przyciski)) b.classList.toggle('aktywny', b === btn);
    });
  }

  // tor główny (Scryfall) dostępny, gdy snapshot istnieje
  if (glowny.getAttribute('src')) przyciski.scryfall.hidden = false;

  // sonda FOT/KON: cichy fallback — nieudane ładowanie ukrywa przycisk
  for (const sufiks of ['FOT', 'KON']) {
    const sonda = new Image();
    sonda.onload = () => { przyciski[sufiks].hidden = false; };
    sonda.onerror = () => { przyciski[sufiks].remove(); };
    sonda.src = `./img/${imgId}${sufiks}.png`;
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
