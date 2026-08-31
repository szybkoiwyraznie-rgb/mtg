/**
 * Rejestr stron i walidacje schematów (ADR 0005).
 *
 * Czysty moduł (bez DOM/fs): używają go build (walidacja przed emisją
 * artefaktu), testy integralności i przeglądarka (backlinki, tagi).
 *
 * Zasada: baza jest tak dobra, jak mocno strzeżone są jej niezmienniki.
 * Każda reguła tu zwraca PROBLEM (string), który build/test raportuje.
 */

import { SLUG_RE, hrefDlaSlug } from './links.js';

export const TYPY_STRON = ['karta', 'haslo', 'plan'];

export const KLASY_HASEL = [
  'geografia', 'fauna', 'flora', 'spolecznosc', 'postac',
  'wydarzenie', 'magia', 'artefakt', 'koncepcja',
];

export const KOLORY = ['W', 'U', 'B', 'R', 'G', 'C'];

export const POZIOMY_PEWNOSCI = ['dokladna', 'region', 'przyblizona'];

export const TYPY_IP = ['plan-mtg', 'zewnetrzne', 'custom'];

/** Kanoniczne sekcje h2 — Karta Katalogowa (SZKIELET_KARTY.md; wszystkie obowiązkowe).
 * Wątki i powiązania NIE są osobną sekcją: kluczowe encje są pogrubione
 * w treści, a wikilink dostają dopiero istniejące hasła (próg ≥2 kart). */
export const SEKCJE_KARTY = [
  'Metryka i Kontekst Świata',
  'Postacie i Byty',
  'Nazwa Karty',
  'Mechanika jako Opowieść',
  'Flavor Text',
  'Transpozycja',
  'Narracja Kolekcji',
  'Wizualizacja',
  'Na Mapie',
  'Źródła',
  'Podsumowanie Lore',
];

/** Kanoniczne sekcje h2 — Karta Haseł (wymagane: Definicja, Opis, Źródła). */
export const SEKCJE_HASLA_OBWIAZKOWE = ['Definicja', 'Opis', 'Źródła'];
export const SEKCJE_HASLA_DOZWOLONE = [
  ...SEKCJE_HASLA_OBWIAZKOWE,
  'Pochodzenie MtG', 'Na mapie', 'Powiązane hasła', 'W kolekcji',
];

const DATA_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Wyciąga tytuły sekcji h2 z ciała markdown. */
export function wytnijSekcje(body) {
  return [...String(body).matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim());
}

/** Waliduje jedną stronę; zwraca listę problemów (pusta = OK). */
export function walidujStrone(strona, ctx) {
  const p = [];
  const gdzie = `${strona?.slug ?? '(bez sluga)'}`;

  if (!strona || typeof strona !== 'object') return [`strona: brak obiektu (${gdzie})`];
  if (!TYPY_STRON.includes(strona.typ)) p.push(`${gdzie}: nieznany typ "${strona.typ}"`);
  if (!SLUG_RE.test(strona.slug ?? '')) p.push(`${gdzie}: slug "${strona.slug}" nie przechodzi wzorca ${SLUG_RE}`);
  if (typeof strona.tytul !== 'string' || strona.tytul.trim() === '') p.push(`${gdzie}: brak tytułu`);
  if (strona.materializacja !== undefined && !DATA_RE.test(strona.materializacja)) {
    p.push(`${gdzie}: materializacja "${strona.materializacja}" nie jest datą YYYY-MM-DD`);
  }

  // tagi zawsze wg słownika
  for (const tag of strona.tagi ?? []) {
    if (!ctx.taxonomia.has(tag)) p.push(`${gdzie}: tag "${tag}" poza słownikiem (content/taxonomia.json)`);
  }

  if (strona.typ === 'karta') {
    if (!strona.imgId || typeof strona.imgId !== 'string') p.push(`${gdzie}: karta bez imgId`);
    else if (!strona.slug.startsWith(strona.imgId.toLowerCase() + '-')) {
      p.push(`${gdzie}: slug karty musi zaczynać się od imgId (${strona.imgId.toLowerCase()}-)`);
    }
    if (!ctx.plany.has(strona.plan)) p.push(`${gdzie}: plan "${strona.plan}" nie ma strony w content/planes/`);
    const kolory = strona.kolory ?? [];
    if (!Array.isArray(kolory) || kolory.length === 0) p.push(`${gdzie}: karta bez kolorów`);
    else for (const k of kolory) if (!KOLORY.includes(k)) p.push(`${gdzie}: kolor "${k}" poza ${KOLORY.join('/')}`);

    if (strona.pinezka) {
      // Współrzędne NIE żyją tu — jedyny źródło prawdy to maps/<plan>/map.json
      // (PROCES_MAP.md MA2). Frontmatter deklaruje istnienie pinezki i pewność.
      if (strona.pinezka.mapa !== strona.plan) p.push(`${gdzie}: pinezka.mapa "${strona.pinezka.mapa}" ≠ plan "${strona.plan}"`);
      if (!POZIOMY_PEWNOSCI.includes(strona.pinezka.pewnosc)) {
        p.push(`${gdzie}: pinezka.pewnosc "${strona.pinezka.pewnosc}" poza ${POZIOMY_PEWNOSCI.join('/')}`);
      }
    }

    const sekcje = wytnijSekcje(strona.body ?? '');
    for (const s of SEKCJE_KARTY) {
      if (!sekcje.includes(s)) p.push(`${gdzie}: brak obowiązkowej sekcji "## ${s}"`);
    }
    for (const s of sekcje) {
      if (!SEKCJE_KARTY.includes(s)) p.push(`${gdzie}: sekcja "## ${s}" poza szkieletem karty`);
    }
  }

  if (strona.typ === 'haslo') {
    if (!KLASY_HASEL.includes(strona.klasa)) p.push(`${gdzie}: klasa "${strona.klasa}" poza słownikiem (SZKIELET_HASLA.md)`);
    if (!ctx.plany.has(strona.plan)) p.push(`${gdzie}: plan "${strona.plan}" nie ma strony w content/planes/`);
    const sekcje = wytnijSekcje(strona.body ?? '');
    for (const s of SEKCJE_HASLA_OBWIAZKOWE) {
      if (!sekcje.includes(s)) p.push(`${gdzie}: brak obowiązkowej sekcji "## ${s}"`);
    }
    for (const s of sekcje) {
      if (!SEKCJE_HASLA_DOZWOLONE.includes(s)) p.push(`${gdzie}: sekcja "## ${s}" poza listą dozwolonych dla hasła`);
    }
  }

  if (strona.typ === 'plan') {
    if (!TYPY_IP.includes(strona.typIP)) p.push(`${gdzie}: typIP "${strona.typIP}" poza ${TYPY_IP.join('/')}`);
    if (strona.mapa !== undefined && strona.mapa !== null && strona.mapa !== 'pending') {
      if (strona.mapa !== strona.slug) p.push(`${gdzie}: mapa "${strona.mapa}" musi równać się slugowi planu albo "pending"`);
    }
  }

  return p;
}

/** Buduje rejestr slug→strona; wykrywa duplikaty (jedna przestrzeń nazw). */
export function zbudujRejestr(strony) {
  const bySlug = new Map();
  const duplikaty = [];
  for (const s of strony) {
    if (bySlug.has(s.slug)) duplikaty.push(`${s.slug} (${bySlug.get(s.slug).typ} oraz ${s.typ})`);
    else bySlug.set(s.slug, s);
  }
  return { bySlug, duplikaty };
}

/** Resolver wikilinków dla renderera markdown. */
export function resolverLinkow(bySlug) {
  return (slug) => {
    const strona = bySlug.get(slug);
    if (!strona) return null;
    return { href: hrefDlaSlug(strona.slug, strona.typ), tytul: strona.tytul, typ: strona.typ };
  };
}

/** Backlinki: slug → sorted [slugi linkujące]. */
export function policzBacklinki(strony) {
  const backlinki = {};
  for (const s of strony) {
    for (const cel of s.linki ?? []) {
      if (!backlinki[cel]) backlinki[cel] = [];
      if (!backlinki[cel].includes(s.slug)) backlinki[cel].push(s.slug);
    }
  }
  for (const k of Object.keys(backlinki)) backlinki[k].sort();
  return backlinki;
}

/** Indeks tagów: tag → sorted [slugi]. */
export function policzTagi(strony) {
  const tagi = {};
  for (const s of strony) {
    for (const t of s.tagi ?? []) {
      if (!tagi[t]) tagi[t] = [];
      tagi[t].push(s.slug);
    }
  }
  for (const k of Object.keys(tagi)) tagi[k].sort();
  return tagi;
}
