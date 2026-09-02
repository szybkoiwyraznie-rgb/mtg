/**
 * „Co nowego" — dziennik zmian bazy (źródło: content/co-nowego.md,
 * aktualizowany na koniec każdej sesji — Pętla Jakości, krok 5).
 *
 * ADR 0029: strona pokazuje 5 NAJNOWSZYCH wpisów (pełne treści) +
 * archiwum podzielone miesiącami; #/co-nowego/<RRRR-MM> = widok
 * jednego miesiąca. Każdy wpis ma datę i godzinę publikacji.
 */

import { escapeHtml } from './markdown.js';
import { wpisyCoNowego, miesiaceCoNowego } from './data.js';
import { stanPusty, nieZnalesc, nazwaMiesiaca, odmiana } from './render.js';

export const LIMIT_WPISOW = 5;

/** Jeden wpis dziennika: nagłówek z datą·godziną publikacji + treść. */
export function wpisCoNowego(w) {
  return `
  <article class="wpis-co-nowego">
    <h2>${escapeHtml(w.tytul)}</h2>
    <p class="meta wpis-publikacja">opublikowano ${escapeHtml(w.data)}${w.godzina ? ` · ${escapeHtml(w.godzina)}` : ''}</p>
    <div class="wpis-tresc">${w.html}</div>
  </article>`;
}

export function renderCoNowego(param = null) {
  const wpisy = wpisyCoNowego();
  if (param) return renderMiesiac(param, wpisy);

  const najnowsze = wpisy.slice(0, LIMIT_WPISOW);
  return `
  <h1>Co nowego</h1>
  <p class="meta">Dziennik zmian bazy — jeden wpis na sesję prac. Ostatnie ${LIMIT_WPISOW} wpisów; starsze w archiwum poniżej.</p>
  ${najnowsze.length === 0
    ? stanPusty('Historia jest pusta.', 'Pierwszy wpis powstanie na zamknięciu PR-1.')
    : `<div class="co-nowego">${najnowsze.map(wpisCoNowego).join('')}</div>`}
  ${sekcjaArchiwum(wpisy)}`;
}

/** Widok archiwum jednego miesiąca: #/co-nowego/<RRRR-MM>. */
function renderMiesiac(miesiac, wpisy) {
  if (!/^\d{4}-\d{2}$/.test(miesiac)) return nieZnalesc(`miesiąc archiwum „${escapeHtml(String(miesiac))}"`);
  const zMiesiaca = wpisy.filter((w) => w.miesiac === miesiac);
  if (zMiesiaca.length === 0) return nieZnalesc(`archiwum „Co nowego" za ${escapeHtml(nazwaMiesiaca(miesiac))}`);
  return `
  <nav class="okruszki">
    <a href="#/">Codex</a> ›
    <a href="#/co-nowego">Co nowego</a> ›
    <span>${escapeHtml(nazwaMiesiaca(miesiac))}</span>
  </nav>
  <h1>Co nowego — ${escapeHtml(nazwaMiesiaca(miesiac))}</h1>
  <p class="meta">${zMiesiaca.length} ${odmiana(zMiesiaca.length, ['wpis', 'wpisy', 'wpisów'])} · <a href="#/co-nowego">← najnowsze wpisy</a></p>
  <div class="co-nowego">${zMiesiaca.map(wpisCoNowego).join('')}</div>`;
}

/** Lista miesięcy archiwum (pod najnowszymi wpisami). */
function sekcjaArchiwum(wpisy) {
  const miesiace = miesiaceCoNowego();
  if (miesiace.length === 0) return '';
  return `
  <section class="sekcja archiwum-co-nowego">
    <h2>Archiwum (miesiącami)</h2>
    <ul class="lista-archiwum">
      ${miesiace.map(({ miesiac, liczba }) => `
      <li><a href="#/co-nowego/${miesiac}">${escapeHtml(nazwaMiesiaca(miesiac))}</a>
        <span class="meta">${liczba} ${odmiana(liczba, ['wpis', 'wpisy', 'wpisów'])}</span></li>`).join('')}
    </ul>
  </section>`;
}
