/**
 * Renderer markdown → HTML (świadomy podzbiór, ADR 0002).
 *
 * Obsługiwane: nagłówki #..####, akapity, **pogrubienie**, *kursywa*,
 * `kod`, [link](url), [[wikilink]] i [[wikilink|etykieta]] (przez resolver),
 * listy -/1., cytaty >, tabele pipe, pozioma linia ---, obrazy ![alt](src).
 *
 * Zasady bezpieczeństwa: cała treść jest escapowana NA WEJŚCIU (HTML-escape),
 * dopiero potem dodajemy własne tagi. Wikilink nierozwiązany NIE jest
 * cichy — renderer dostaje resolver, a ten zgłasza problem (build/test
 * na tym kończy się czerwono).
 */

import { WIKILINK_RE } from './links.js';

export function renderMarkdown(md, { resolveLink } = {}) {
  const linie = String(md).replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  let problemsy = [];

  while (i < linie.length) {
    const linia = linie[i];

    if (linia.trim() === '') { i += 1; continue; }

    // pozioma linia
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(linia.trim())) { out.push('<hr>'); i += 1; continue; }

    // nagłówek
    const h = linia.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const poz = h[1].length;
      out.push(`<h${poz}>${inline(h[2])}</h${poz}>`);
      i += 1; continue;
    }

    // cytat blokowy (linia po linii)
    if (/^>\s?/.test(linia)) {
      const buf = [];
      while (i < linie.length && /^>\s?/.test(linie[i])) {
        buf.push(linie[i].replace(/^>\s?/, ''));
        i += 1;
      }
      out.push(`<blockquote><p>${inline(buf.join(' '))}</p></blockquote>`);
      continue;
    }

    // tabela pipe: | a | b | + wiersz separatora |---|---|
    if (linia.trim().startsWith('|') && (linie[i + 1] ?? '').match(/^\s*\|[\s:|-]+\|\s*$/)) {
      const komorki = (w) => w.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const naglowki = komorki(linia);
      i += 2;
      const wiersze = [];
      while (i < linie.length && linie[i].trim().startsWith('|')) {
        wiersze.push(komorki(linie[i]));
        i += 1;
      }
      out.push(
        '<table><thead><tr>' +
        naglowki.map((c) => `<th>${inline(c)}</th>`).join('') +
        '</tr></thead><tbody>' +
        wiersze.map((w) => '<tr>' + w.map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>').join('') +
        '</tbody></table>',
      );
      continue;
    }

    // listy
    if (/^\s*[-*]\s+/.test(linia) || /^\s*\d+\.\s+/.test(linia)) {
      const uporzadkowana = /^\s*\d+\.\s/.test(linia);
      const elementy = [];
      while (i < linie.length && (/^\s*[-*]\s+/.test(linie[i]) || /^\s*\d+\.\s+/.test(linie[i]))) {
        elementy.push(linie[i].replace(/^\s*(?:[-*]|\d+\.)\s+/, ''));
        i += 1;
      }
      const tag = uporzadkowana ? 'ol' : 'ul';
      out.push(`<${tag}>${elementy.map((e) => `<li>${inline(e)}</li>`).join('')}</${tag}>`);
      continue;
    }

    // akapit — linie aż do pustej/bloku
    const buf = [linia];
    i += 1;
    while (
      i < linie.length && linie[i].trim() !== '' &&
      !/^(#{1,4}\s|>\s?|\s*[-*]\s|\s*\d+\.\s|-{3,}$)/.test(linie[i]) &&
      !linie[i].trim().startsWith('|')
    ) {
      buf.push(linie[i]);
      i += 1;
    }
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }

  return { html: out.join('\n'), problemy: problemsy };

  /** Zamiana znaczników liniowych na HTML (wejście już escape'owane). */
  function inline(tekst) {
    let t = escapeHtml(tekst);

    // wikilinki PRZED linkami markdown (żeby [[x]] nie zjadło [ ] z linków)
    t = t.replace(WIKILINK_RE, (cały, slugRaw, etykietaRaw) => {
      const slug = slugRaw.trim();
      const etykieta = etykietaRaw ? etykietaRaw.trim() : slug;
      if (!resolveLink) return escapeHtml(etykieta);
      const cel = resolveLink(slug);
      if (!cel) {
        problemsy.push(`martwy wikilink: [[${slug}]]`);
        return `<span class="martwy-link" data-slug="${slug}">${escapeHtml(etykieta)}</span>`;
      }
      return `<a href="${cel.href}">${escapeHtml(etykieta)}</a>`;
    });

    // obrazy ![alt](src)
    t = t.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (cały, alt, src) =>
      `<img src="${src}" alt="${alt}" loading="lazy" decoding="async">`);

    // linki [tekst](url) — tylko http(s) i # (blokujemy javascript: itp.)
    t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (cały, tekst, url) => {
      if (!/^(https?:\/\/|[#/])/.test(url)) return tekst;
      const zewnetrzny = url.startsWith('http');
      const atrybuty = zewnetrzny ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${url}"${atrybuty}>${tekst}</a>`;
    });

    // kod inline (przed pogrubieniem/kursywą, żeby nie formatowało wnętrza)
    t = t.replace(/`([^`]+)`/g, '<code>$1</code>');

    // pogrubienie i kursywa
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    return t;
  }
}

export function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
