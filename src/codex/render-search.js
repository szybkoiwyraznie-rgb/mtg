/**
 * Wyszukiwarka — substring po tytule, tagach i planie (fuzzy: backlog).
 * Indeks to wstrzyknięte dane bazy; nic nie jest fetchowane (ADR 0001).
 */

import { escapeHtml } from './markdown.js';
import { dajDane } from './data.js';
import { stanPusty } from './render.js';

export function renderSzukanie(fraza) {
  const q = (fraza ?? '').trim().toLowerCase();
  const dane = dajDane();

  const trafienia = q
    ? Object.values(dane.strony)
        .filter((s) => {
          const wPolu = (v) => String(v ?? '').toLowerCase().includes(q);
          return wPolu(s.tytul) || wPolu(s.slug) || (s.tagi ?? []).some(wPolu) || wPolu(s.plan)
            || (s.typ === 'karta' && wPolu(s.imgId)) || (s.typ === 'haslo' && wPolu(s.klasa));
        })
        .sort((a, b) => a.tytul.localeCompare(b.tytul, 'pl'))
    : [];

  return `
  <h1>${q ? `Wyniki dla „${escapeHtml(fraza)}"` : 'Szukaj w Codexie'}</h1>
  ${!q
    ? stanPusty('Wpisz frazę w polu wyszukiwania (nagłówek strony).', 'Szukamy w tytułach, slugach, tagach, planach, imgId i klasach haseł.')
    : trafienia.length === 0
      ? stanPusty('Brak trafień.', 'Spróbuj krótszej frazy albo przejrzyj <a href="#/karty">listę kart</a>.')
      : `<ul class="lista-hasel">${trafienia.map((s) => `
          <li>
            <a href="#/${s.typ === 'karta' ? 'karta' : s.typ === 'haslo' ? 'haslo' : 'plan'}/${s.slug}">${escapeHtml(s.tytul)}</a>
            <span class="meta">${s.typ}${s.plan ? ` · ${escapeHtml(s.plan)}` : ''}</span>
          </li>`).join('')}</ul>`}`;
}
