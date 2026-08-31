/**
 * Protokół wikilinków (ADR 0005).
 *
 * Składnia:  [[slug]]  lub  [[slug|etykieta]]
 * Link celuje w SLUG strony (nie w tytuł). Puste lub ze spacjami w środku
 * bez etykiety — nie istnieją; parser zwraca strukturę, a renderer
 * (markdown.js) z pomocą resolvera zamienia ją na <a>.
 *
 * Ten moduł jest czysty (bez DOM i fs) — używa go build (node), testy
 * i przeglądarka.
 */

export const WIKILINK_RE = /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;

/** Parsuje wszystkie wikilinki z tekstu → [{slug, etykieta, indeks}]. */
export function parseWikilinks(text) {
  return [...text.matchAll(WIKILINK_RE)].map((m) => ({
    slug: m[1].trim(),
    etykieta: m[2] ? m[2].trim() : null,
    indeks: m.index,
  }));
}

/** Czy slug wygląda poprawnie (małe litery ASCII, cyfry, myślniki; PL→translit). */
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Transliteracja polskich znaków + slugifikacja dowolnego tytułu. */
export function slugify(tytul) {
  const map = {
    ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z',
    Ą: 'a', Ć: 'c', Ę: 'e', Ł: 'l', Ń: 'n', Ó: 'o', Ś: 's', Ź: 'z', Ż: 'z',
  };
  return String(tytul)
    .replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (ch) => map[ch] ?? ch)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Href wewnętrzny dla strony (routing po hashu — ADR 0001). */
export function hrefDlaSlug(slug, typ) {
  switch (typ) {
    case 'karta': return `#/karta/${slug}`;
    case 'haslo': return `#/haslo/${slug}`;
    case 'plan': return `#/plan/${slug}`;
    default: return `#/${slug}`;
  }
}
