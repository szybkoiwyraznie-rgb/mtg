/**
 * Strona planu/settingu: opis świata + karty i hasła danego planu + mapa.
 */

import { escapeHtml } from './markdown.js';
import { dajStrone, dajDane, listaKart, listaHasel } from './data.js';
import { stanPusty, chipsyTagow, nieZnalesc } from './render.js';

const ETYKIETY_IP = {
  'plan-mtg': 'Plan Magic: The Gathering',
  zewnetrzne: 'IP zewnętrzne (transpozycja)',
  custom: 'Świat własny',
};

export function renderPlan(slug) {
  const plan = dajStrone(slug);
  if (!plan || plan.typ !== 'plan') return nieZnalesc(`plan „${slug}"`);
  const dane = dajDane();

  const karty = listaKart().filter((k) => k.plan === slug);
  const hasla = listaHasel().filter((h) => h.plan === slug);

  return `
  <nav class="okruszki">
    <a href="#/">Codex</a> ›
    <a href="#/plany">Plany</a> ›
    <span>${escapeHtml(plan.tytul)}</span>
  </nav>

  <article class="plan">
    <header class="plan-naglowek">
      <h1>${escapeHtml(plan.tytul)}</h1>
      <p class="meta">${ETYKIETY_IP[plan.typIP] ?? plan.typIP}${plan.materializacja ? ` · w bazie od ${escapeHtml(plan.materializacja)}` : ''}</p>
    </header>

    ${(() => {
      // ADR 0032: plan-franczyza może mieć wiele podmap — przycisk per podmapa
      const podmapy = Object.entries(dane.mapy ?? {})
        .filter(([k]) => String(k).startsWith(`${slug}/`))
        .map(([k, m]) => ({ klucz: k, tytul: m.tytul ?? k }))
        .sort((a, b) => a.klucz.localeCompare(b.klucz));
      const przycisk = (klucz, etykieta) =>
        `<a class="przycisk" href="#/mapa/${klucz}">🗺️ ${escapeHtml(etykieta)}</a>`;
      if (podmapy.length > 0) {
        const plaska = plan.mapa && plan.mapa !== 'pending' && !String(plan.mapa).includes('/')
          ? przycisk(plan.mapa, 'Otwórz mapę planu') : '';
        return `<p class="mapa-link">${plaska}${podmapy
          .map((p) => przycisk(p.klucz, `Otwórz mapę: ${p.tytul}`)).join('')}</p>`;
      }
      return plan.mapa && plan.mapa !== 'pending'
        ? `<p class="mapa-link">${przycisk(plan.mapa, 'Otwórz mapę planu')}</p>`
        : plan.mapa === 'pending'
          ? `<p class="meta mapa-pending">Mapa planu: w przygotowaniu.</p>`
          : '';
    })()}

    ${plan.html ? `<div class="plan-opis">${plan.html}</div>` : ''}

    <section class="sekcja">
      <h2>Karty w tym planie (${karty.length})</h2>
      ${karty.length === 0
        ? stanPusty('Brak kart.', 'Materializacje odbywają się wyłącznie po jawnej dostawie (ADR 0003).')
        : `<ul class="lista-kart-planu">${karty.map((k) => `
            <li>
              <a href="#/karta/${k.slug}">${escapeHtml(k.tytul)}</a>
              <span class="meta">${escapeHtml(k.imgId)}${k.materializacja ? ` · ${escapeHtml(k.materializacja)}` : ''}</span>
              ${chipsyTagow(k.tagi)}
            </li>`).join('')}</ul>`}
    </section>

    <section class="sekcja">
      <h2>Hasła lore tego planu (${hasla.length})</h2>
      ${hasla.length === 0
        ? stanPusty('Brak haseł.', 'Hasła powstają link-miningiem (Pętla Jakości) lub ze zlecenia.')
        : `<ul class="lista-hasel-planu">${hasla.map((h) => `
            <li><a href="#/haslo/${h.slug}">${escapeHtml(h.tytul)}</a> <span class="meta">${escapeHtml(h.klasa)}</span></li>`).join('')}</ul>`}
    </section>

    ${sekcjaTagowPlanu(karty, hasla)}
  </article>`;
}

function sekcjaTagowPlanu(karty, hasla) {
  const licznik = {};
  for (const s of [...karty, ...hasla]) {
    for (const t of s.tagi ?? []) licznik[t] = (licznik[t] ?? 0) + 1;
  }
  const tagi = Object.keys(licznik).sort();
  if (tagi.length === 0) return '';
  return `<section class="sekcja">
    <h2>Tagi w planie</h2>
    <div class="chipsy">${tagi.map((t) => `<a class="chip" href="#/tag/${encodeURIComponent(t)}">${escapeHtml(t)} <span class="licznik">${licznik[t]}</span></a>`).join('')}</div>
  </section>`;
}
