/**
 * „Co nowego" — historia zmian bazy (źródło: content/co-nowego.md,
 * aktualizowany na koniec każdej sesji — Pętla Jakości, krok 5).
 */

import { dajDane } from './data.js';
import { stanPusty } from './render.js';

export function renderCoNowego() {
  const dane = dajDane();
  return `
  <h1>Co nowego</h1>
  <p class="meta">Dziennik zmian bazy — jeden wpis na sesję prac.</p>
  ${dane.coNowegoHtml
    ? `<div class="co-nowego">${dane.coNowegoHtml}</div>`
    : stanPusty('Historia jest pusta.', 'Pierwszy wpis powstanie na zamknięciu PR-1.')}`;
}
