/**
 * Karta Haseł — strona encji świata (SZKIELET_HASLA.md, ADR 0005).
 */

import { escapeHtml } from './markdown.js';
import { dajStrone, dajDane, backlinki } from './data.js';
import { chipsyTagow, nieZnalesc } from './render.js';

const ETYKIETY_KLAS = {
  geografia: 'Geografia', fauna: 'Fauna', flora: 'Flora', spolecznosc: 'Społeczność',
  postac: 'Postać', wydarzenie: 'Wydarzenie', magia: 'Magia', artefakt: 'Artefakt',
  koncepcja: 'Koncepcja',
};

export function renderHaslo(slug) {
  const haslo = dajStrone(slug);
  if (!haslo || haslo.typ !== 'haslo') return nieZnalesc(`hasło „${slug}"`);
  const dane = dajDane();
  const plan = dane.strony[haslo.plan];
  const linkujace = backlinki(slug).map((s) => dane.strony[s]).filter(Boolean);
  const kartyKolekcji = linkujace.filter((s) => s.typ === 'karta');

  return `
  <nav class="okruszki">
    <a href="#/">Codex</a> ›
    <a href="#/hasla">Hasła</a> ›
    <span>${escapeHtml(haslo.tytul)}</span>
  </nav>

  <article class="haslo">
    <header class="haslo-naglowek">
      <h1>${escapeHtml(haslo.tytul)}</h1>
      <p class="meta">
        <span class="klasa">${ETYKIETY_KLAS[haslo.klasa] ?? haslo.klasa}</span>
        ${plan ? ` · <a href="#/plan/${plan.slug}">${escapeHtml(plan.tytul)}</a>` : ''}
        ${haslo.materializacja ? ` · od ${escapeHtml(haslo.materializacja)}` : ''}
      </p>
    </header>

    <div class="haslo-uklad">
      <div class="haslo-tresc">
        ${haslo.html ?? ''}
        ${kartyKolekcji.length > 0 ? `<section class="w-kolekcji">
          <h2>W kolekcji</h2>
          <ul>${kartyKolekcji.map((k) => `<li><a href="#/karta/${k.slug}">${escapeHtml(k.tytul)}</a></li>`).join('')}</ul>
        </section>` : ''}
        ${sekcjaLinkujacychHasla(linkujace.filter((s) => s.typ !== 'karta'))}
      </div>
      <aside class="infoboks haslo-infoboks">
        ${chipsyTagow(haslo.tagi)}
      </aside>
    </div>
  </article>`;
}

function sekcjaLinkujacychHasla(linkujace) {
  if (linkujace.length === 0) return '';
  return `<section class="backlinki">
    <h2>Powiązane hasła</h2>
    <ul>${linkujace.map((s) => `<li><a href="#/${s.typ === 'karta' ? 'karta' : s.typ === 'haslo' ? 'haslo' : 'plan'}/${s.slug}">${escapeHtml(s.tytul)}</a> <span class="typ">${s.typ}</span></li>`).join('')}</ul>
  </section>`;
}
