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
    coNowegoHtml: '',
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

export function statystyki() {
  return dajDane().statystyki;
}
