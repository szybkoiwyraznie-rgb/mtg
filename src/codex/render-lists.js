/**
 * Listy: wszystkie karty / hasła / plany / tagi (+strona tagu).
 * Filtrowanie po stronie klienta (dane są wstrzyknięte w całości — ADR 0001).
 */

import { escapeHtml } from './markdown.js';
import { dajDane, listaKart, listaHasel, listaPlanow } from './data.js';
import { stanPusty, kropkiKolorow } from './render.js';

export function renderListeKart() {
  const karty = listaKart().sort((a, b) => a.tytul.localeCompare(b.tytul, 'pl'));
  return `
  <h1>Karty Katalogowe (${karty.length})</h1>
  <p class="meta">Każda karta materializowana jawnie przez właściciela (ADR 0003).</p>
  ${karty.length === 0
    ? stanPusty('Brak kart w bazie.', 'Pierwsza dostawa: 1LTR Dunland Crebain (PR-2).')
    : `<table class="tabela-kart">
        <thead><tr><th>Karta</th><th>imgId</th><th>Plan</th><th>Kolory</th><th>Materializacja</th></tr></thead>
        <tbody>${karty.map((k) => `
          <tr>
            <td><a href="#/karta/${k.slug}">${escapeHtml(k.tytul)}</a></td>
            <td>${escapeHtml(k.imgId)}</td>
            <td><a href="#/plan/${k.plan}">${escapeHtml(k.plan)}</a></td>
            <td>${kropkiKolorow(k.kolory)}</td>
            <td>${escapeHtml(k.materializacja ?? '')}</td>
          </tr>`).join('')}</tbody>
      </table>`}`;
}

export function renderListeHasel() {
  const hasla = listaHasel().sort((a, b) => a.tytul.localeCompare(b.tytul, 'pl'));
  return `
  <h1>Karty Haseł (${hasla.length})</h1>
  <p class="meta">Encje świata wspólne dla wielu kart — bez dublowania wiedzy (ADR 0005).</p>
  ${hasla.length === 0
    ? stanPusty('Brak haseł.', 'Pierwsze hasła powstaną przy pierwszej materializacji (link-mining).')
    : `<ul class="lista-hasel">${hasla.map((h) => `
        <li>
          <a href="#/haslo/${h.slug}">${escapeHtml(h.tytul)}</a>
          <span class="meta">${escapeHtml(h.klasa)} · ${escapeHtml(h.plan)}</span>
        </li>`).join('')}</ul>`}`;
}

export function renderListePlanow() {
  const plany = listaPlanow().sort((a, b) => a.tytul.localeCompare(b.tytul, 'pl'));
  return `
  <h1>Plany i settingi (${plany.length})</h1>
  ${plany.length === 0
    ? stanPusty('Brak planów.', 'Plan powstaje razem z pierwszą kartą z niego. z niego.')
    : `<ul class="lista-planow">${plany.map((p) => {
        const n = listaKart().filter((k) => k.plan === p.slug).length;
        return `<li><a href="#/plan/${p.slug}">${escapeHtml(p.tytul)}</a> <span class="meta">${n} ${n === 1 ? 'karta' : 'kart'}${p.mapa === 'pending' ? ' · mapa w przygotowaniu' : ''}</span></li>`;
      }).join('')}</ul>`}`;
}

export function renderChmoreTagow() {
  const dane = dajDane();
  const tagi = Object.keys(dane.tagi).sort();
  return `
  <h1>Tagi (${tagi.length})</h1>
  <p class="meta">Słownik: content/taxonomia.json — tag poza słownikiem nie przechodzi testów.</p>
  ${tagi.length === 0
    ? stanPusty('Brak tagów.', 'Pojawią się razem z treścią.')
    : `<div class="chipsy">${tagi.map((t) => `<a class="chip" href="#/tag/${encodeURIComponent(t)}">${escapeHtml(t)} <span class="licznik">${dane.tagi[t].length}</span></a>`).join('')}</div>`}`;
}

export function renderTag(tag) {
  const dane = dajDane();
  const slugi = dane.tagi[tag] ?? [];
  const strony = slugi.map((s) => dane.strony[s]).filter(Boolean);
  return `
  <h1>Tag: ${escapeHtml(tag)} (${strony.length})</h1>
  ${strony.length === 0
    ? stanPusty('Ten tag nie ma jeszcze stron.')
    : `<ul class="lista-hasel">${strony.map((s) => `
        <li>
          <a href="#/${s.typ === 'karta' ? 'karta' : s.typ === 'haslo' ? 'haslo' : 'plan'}/${s.slug}">${escapeHtml(s.tytul)}</a>
          <span class="meta">${s.typ}</span>
        </li>`).join('')}</ul>`}`;
}
