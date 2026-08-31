/**
 * Listy: wszystkie karty / hasła / plany / tagi (+strona tagu).
 * Filtrowanie po stronie klienta (dane są wstrzyknięte w całości — ADR 0001).
 */

import { escapeHtml } from './markdown.js';
import { dajDane, listaKart, listaHasel, listaPlanow } from './data.js';
import { stanPusty, kropkiKolorow } from './render.js';

export function renderListeKart() {
  const karty = listaKart().sort((a, b) => a.tytul.localeCompare(b.tytul, 'pl'));
  const tagiWKartach = [...new Set(karty.flatMap((k) => k.tagi ?? []))]
    .sort((a, b) => a.localeCompare(b, 'pl'));
  return `
  <h1>Karty Katalogowe (${karty.length})</h1>
  ${karty.length === 0
    ? stanPusty('Brak kart w bazie.', 'Karty materializują się wyłącznie po jawnej dostawie właściciela.')
    : `<div class="filtry-kart" data-filtry-kart>
        <input type="search" class="filtr-nazwy" placeholder="Szukaj karty po nazwie…" aria-label="Szukaj karty po nazwie">
        <div class="filtry-tagow" role="group" aria-label="Filtruj po tagach">
          ${tagiWKartach.map((t) => `<button type="button" class="tag-filtr" data-tag="${escapeHtml(t)}" aria-pressed="false">${escapeHtml(t)}</button>`).join('')}
        </div>
      </div>
      <p class="licznik-kart" data-licznik-kart hidden></p>
      <table class="tabela-kart" data-tabela-kart>
        <thead><tr><th>Karta</th><th>imgId</th><th>Plan</th><th>Kolory</th><th>Tagi</th><th>Materializacja</th></tr></thead>
        <tbody>${karty.map((k) => `
          <tr data-tytul="${escapeHtml(k.tytul.toLowerCase())}" data-tagi="${escapeHtml((k.tagi ?? []).join(' '))}">
            <td><a href="#/karta/${k.slug}">${escapeHtml(k.tytul)}</a></td>
            <td>${escapeHtml(k.imgId)}</td>
            <td><a href="#/plan/${k.plan}">${escapeHtml(dajDane().strony[k.plan]?.tytul ?? k.plan)}</a></td>
            <td>${kropkiKolorow(k.kolory)}</td>
            <td>${(k.tagi ?? []).length
              ? `<div class="tag-lista">${k.tagi.map((t) => `<a class="typ" href="#/tag/${encodeURIComponent(t)}">${escapeHtml(t)}</a>`).join('')}</div>`
              : '<span class="meta">—</span>'}</td>
            <td>${escapeHtml(k.materializacja ?? '')}</td>
          </tr>`).join('')}</tbody>
      </table>`}`;
}

// Filtry listy kart: nazwa (fragment, bez względu na wielkość liter) + tagi (dowolny z wybranych).
// Montowane po każdym renderze strony listy — stan filtrów nie przenosi się między widokami.
export function zamontujFiltryKart(app) {
  const filtry = app?.querySelector?.('[data-filtry-kart]');
  if (!filtry) return;
  const tabela = app.querySelector('[data-tabela-kart]');
  const wejscie = filtry.querySelector('.filtr-nazwy');
  const licznik = app.querySelector('[data-licznik-kart]');
  const aktywne = new Set();

  const nanies = () => {
    const fraza = (wejscie.value ?? '').trim().toLowerCase();
    const wszystkie = tabela.querySelectorAll('tr[data-tytul]');
    let widoczne = 0;
    for (const wiersz of wszystkie) {
      const pasujeNazwa = !fraza || wiersz.dataset.tytul.includes(fraza);
      const pasujeTag = aktywne.size === 0 || wiersz.dataset.tagi.split(' ').some((t) => aktywne.has(t));
      wiersz.hidden = !(pasujeNazwa && pasujeTag);
      if (!wiersz.hidden) widoczne += 1;
    }
    const filtrowane = Boolean(fraza) || aktywne.size > 0;
    licznik.hidden = !filtrowane;
    licznik.textContent = filtrowane ? `Widoczne karty: ${widoczne} z ${wszystkie.length}` : '';
  };

  wejscie.addEventListener('input', nanies);
  for (const przycisk of filtry.querySelectorAll('.tag-filtr')) {
    przycisk.addEventListener('click', () => {
      const tag = przycisk.dataset.tag;
      if (aktywne.has(tag)) aktywne.delete(tag);
      else aktywne.add(tag);
      przycisk.setAttribute('aria-pressed', String(aktywne.has(tag)));
      nanies();
    });
  }
}

export function renderListeHasel() {
  const hasla = listaHasel().sort((a, b) => a.tytul.localeCompare(b.tytul, 'pl'));
  return `
  <h1>Karty Haseł (${hasla.length})</h1>
  <p class="meta">Encje świata wspólne dla wielu kart — bez dublowania wiedzy (ADR 0005).</p>
  ${hasla.length === 0
    ? stanPusty('Brak haseł.', 'Pierwsze hasła powstaną, gdy druga karta odwoła się do wspólnej encji (link-mining).')
    : `<ul class="lista-hasel">${hasla.map((h) => `
        <li>
          <a href="#/haslo/${h.slug}">${escapeHtml(h.tytul)}</a>
          <span class="meta">${escapeHtml(h.klasa)} · ${escapeHtml(dajDane().strony[h.plan]?.tytul ?? h.plan)}</span>
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
