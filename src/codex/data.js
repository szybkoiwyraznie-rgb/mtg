/**
 * Dostęp do danych bazy (CODEX_DATA wstrzyknięte przez build — ADR 0001).
 *
 * Moduł celowo „głupi": zwraca bezpieczne puste struktury, gdy danych brak
 * (pusta baza PR-1 ma renderować się poprawnie), i NIE waliduje nic
 * (walidacje robią build/testy przez registry.js).
 */

export function dajDane() {
  const d = globalThis.CODEX_DATA;
  return d ?? {
    zbudowano: '',
    strony: {},
    plany: [],
    tagi: {},
    backlinki: {},
    coNowego: [],
    statystyki: { karty: 0, hasla: 0, plany: 0 },
  };
}

export function dajStrone(slug) {
  return dajDane().strony[slug] ?? null;
}

export function listaStron(typ) {
  const dane = dajDane();
  return Object.values(dane.strony).filter((s) => s.typ === typ);
}

export function listaKart() { return listaStron('karta'); }
export function listaHasel() { return listaStron('haslo'); }
export function listaPlanow() { return listaStron('plan'); }

export function ostatnieMaterializacje(n = 5) {
  return listaKart()
    .filter((s) => s.materializacja)
    .sort((a, b) => (a.materializacja < b.materializacja ? 1 : -1))
    .slice(0, n);
}

export function backlinki(slug) {
  return dajDane().backlinki[slug] ?? [];
}

/** Wpisy „Co nowego" (ADR 0029) — najnowsze pierwsze (kolejność dziennika). */
export function wpisyCoNowego() {
  return dajDane().coNowego ?? [];
}

/** Miesiące archiwum „Co nowego": [{ miesiac: 'RRRR-MM', liczba }] malejąco. */
export function miesiaceCoNowego() {
  const licznik = new Map();
  for (const w of wpisyCoNowego()) licznik.set(w.miesiac, (licznik.get(w.miesiac) ?? 0) + 1);
  return [...licznik.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([miesiac, liczba]) => ({ miesiac, liczba }));
}

export function statystyki() {
  return dajDane().statystyki;
}
