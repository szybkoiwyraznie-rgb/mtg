/**
 * Strona główna: statystyki, plany, ostatnie materializacje, co nowego.
 * Puste stany są pełnoprawnym widokiem (PR-1: baza pusta z założenia).
 */

import { escapeHtml } from './markdown.js';
import { dajDane, listaPlanow, listaKart, ostatnieMaterializacje, wpisyCoNowego } from './data.js';
import { stanPusty, kropkiKolorow, chipsyTagow } from './render.js';

export function renderGlowna() {
  const dane = dajDane();
  const plany = listaPlanow();
  const ostatnie = ostatnieMaterializacje(5);
  const najnowszeWpisy = wpisyCoNowego().slice(0, 5); // limit — ADR 0029

  return `
  <section class="hero">
    <h1>MTG Lore Codex</h1>
    <p class="lead">Encyklopedia lore prywatnej kolekcji — karty, hasła i mapy planów.
    Transpozycje na inne światy są tu kanonem, a narracje kolekcji — prawem nadrzędnym.</p>
    ${dane.statystyki.karty === 0 ? stanPusty(
      'Baza jest pusta — to planowane.',
      'Pierwsza materializacja: <strong>1LTR Dunland Crebain</strong> (Śródziemie) — PR-2.',
    ) : ''}
  </section>

  <section class="sekcja">
    <h2>Plany i settingi</h2>
    ${plany.length === 0
      ? stanPusty('Żaden plan nie ma jeszcze materializowanej karty.', 'Plany powstaną razem z pierwszymi kartami.')
      : `<div class="kafle-planow">${plany.map(kafelPlanu).join('')}</div>`}
  </section>

  <section class="sekcja">
    <h2>Ostatnie materializacje</h2>
    ${ostatnie.length === 0
      ? stanPusty('Brak materializacji.', 'Karty materializują się wyłącznie po jawnej dostawie właściciela (ADR 0003).')
      : `<ul class="lista-materializacji">${ostatnie.map((k) => `
          <li>
            <a href="#/karta/${k.slug}">${escapeHtml(k.tytul)}</a>
            ${kropkiKolorow(k.kolory)}
            <span class="meta">${escapeHtml(k.materializacja)} · <a href="#/plan/${k.plan}">${escapeHtml(dajDane().strony[k.plan]?.tytul ?? k.plan)}</a></span>
            ${chipsyTagow(k.tagi)}
          </li>`).join('')}</ul>`}
  </section>

  <section class="sekcja">
    <h2>Co nowego</h2>
    ${najnowszeWpisy.length === 0
      ? stanPusty('Historia zmian jest pusta.', 'Wpisy powstają na koniec każdej sesji (Pętla Jakości, krok 5).')
      : `<ul class="lista-co-nowego-skrot">${najnowszeWpisy.map((w) => `
          <li><a href="#/co-nowego">${escapeHtml(w.tytul)}</a>
            <span class="meta">${escapeHtml(w.data)}${w.godzina ? ` · ${escapeHtml(w.godzina)}` : ''}</span></li>`).join('')}</ul>
        <p class="meta"><a href="#/co-nowego">Wszystkie wpisy i archiwum →</a></p>`}
  </section>`;
}

function kafelPlanu(plan) {
  const liczbaKart = Object.values(dajDane().strony).filter((s) => s.plan === plan.slug && s.typ === 'karta').length;
  const etykietaIP = { 'plan-mtg': 'plan MtG', zewnetrzne: 'IP zewnętrzne', custom: 'świat własny' }[plan.typIP] ?? plan.typIP;
  return `<a class="kafel-planu" href="#/plan/${plan.slug}">
    <span class="nazwa">${escapeHtml(plan.tytul)}</span>
    <span class="meta">${etykietaIP}${plan.mapa === 'pending' ? '' : plan.mapa ? ' · 🗺️' : ''}</span>
    <span class="licznik">${liczbaKart} ${liczbaKart === 1 ? 'karta' : 'kart'}</span>
  </a>`;
}
