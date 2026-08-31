/**
 * Wspólne elementy renderowania: szkielet strony (nagłówek, nawigacja,
 * stopka), chipsy tagów, kropki kolorów, stany puste, 404.
 *
 * Renderery zwracają HTML (string) — montuje je main.js w #app.
 */

import { escapeHtml } from './markdown.js';
import { hrefDlaSlug } from './links.js';
import { statystyki } from './data.js';

export const NAV = [
  { id: 'glowna', etykieta: 'Codex', href: '#/' },
  { id: 'karty', etykieta: 'Karty', href: '#/karty' },
  { id: 'hasla', etykieta: 'Hasła', href: '#/hasla' },
  { id: 'plany', etykieta: 'Plany', href: '#/plany' },
  { id: 'tagi', etykieta: 'Tagi', href: '#/tagi' },
  { id: 'co-nowego', etykieta: 'Co nowego', href: '#/co-nowego' },
];

const KOLORY_UI = {
  W: '#f3ead1', U: '#aad7e8', B: '#a596b8', R: '#e2a58f', G: '#a8c3a0', C: '#cfcfcf',
};

export function rama(aktywna, tytul, tresc) {
  const d = statystyki();
  return `
<header class="naglowek">
  <div class="naglowek-wnetrze">
    <a class="logo" href="#/">MTG Lore Codex</a>
    <nav class="nawigacja">
      ${NAV.map((n) => `<a class="${n.id === aktywna ? 'aktywna' : ''}" href="${n.href}">${n.etykieta}</a>`).join('')}
    </nav>
    <form class="szukaj" action="#/szukaj" onsubmit="const q=this.elements.q.value.trim(); if(q) location.hash='#/szukaj?q='+encodeURIComponent(q); return false;">
      <input type="search" name="q" placeholder="Szukaj w Codexie…" aria-label="Szukaj w Codexie">
    </form>
  </div>
</header>
<main class="tresc">
${tresc}
</main>
<footer class="stopka">
  <p>MTG Lore Codex — prywatna encyklopedia kolekcji · ${d.karty} ${odmiana(d.karty, ['karta', 'karty', 'kart'])},
  ${d.hasla} ${odmiana(d.hasla, ['hasło', 'hasła', 'haseł'])}, ${d.plany} ${odmiana(d.plany, ['plan', 'plany', 'planów'])}</p>
</footer>`;
}

export function tytulStrony(tytul) {
  if (globalThis.document) globalThis.document.title = `${tytul} — MTG Lore Codex`;
}

export function chipsyTagow(tagi) {
  if (!tagi || tagi.length === 0) return '';
  return `<div class="chipsy">${tagi.map((t) => `<a class="chip" href="#/tag/${encodeURIComponent(t)}">${escapeHtml(t)}</a>`).join('')}</div>`;
}

export function kropkiKolorow(kolory) {
  if (!kolory || kolory.length === 0) return '';
  return `<span class="kolory" title="${kolory.join(' ')}">` +
    kolory.map((k) => `<span class="kropka" style="background:${KOLORY_UI[k] ?? '#999'}"></span>`).join('') +
    '</span>';
}

export function linkStrony(strona) {
  if (!strona) return '';
  const ikony = { karta: '🃏', haslo: '📖', plan: '🗺️' };
  return `<a class="link-strony" href="${hrefDlaSlug(strona.slug, strona.typ)}">${ikony[strona.typ] ?? ''} ${escapeHtml(strona.tytul)}</a>`;
}

export function stanPusty(komunikat, podpowiedz = '') {
  return `<div class="stan-pusty">
    <p class="komunikat">${komunikat}</p>
    ${podpowiedz ? `<p class="podpowiedz">${podpowiedz}</p>` : ''}
  </div>`;
}

export function nieZnalesc(czego) {
  return `
  <div class="stan-pusty">
    <p class="komunikat">Nie znaleziono: ${escapeHtml(czego)}</p>
    <p class="podpowiedz"><a href="#/">Wróć na stronę główną</a></p>
  </div>`;
}

export function sekcjaBacklinkow(slug) {
  // wypełniane przez renderery z data.backlinki — tu czysty format
  return (linkujace) => linkujace.length === 0 ? '' : `
  <section class="backlinki">
    <h2>Linkujące strony</h2>
    <ul>${linkujace.map((s) => `<li><a href="#/${s.typ === 'karta' ? 'karta' : s.typ === 'haslo' ? 'haslo' : 'plan'}/${s.slug}">${escapeHtml(s.tytul)}</a> <span class="typ">${s.typ}</span></li>`).join('')}</ul>
  </section>`;
}

function odmiana(n, [jeden, kilka, wiele]) {
  if (n === 1) return jeden;
  const reszta = n % 10; const setki = n % 100;
  if (reszta >= 2 && reszta <= 4 && !(setki >= 12 && setki <= 14)) return kilka;
  return wiele;
}
