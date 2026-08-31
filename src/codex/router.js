/**
 * Router po hashu (ADR 0001): jedyny mechanizm „URL-i", który działa
 * identycznie z file:// i przez HTTPS.
 *
 * Postać trasy: #/<nazwa>[/<param>][?zapytanie]
 * Przykłady: #/  #/karta/1ltr-dunland-crebain  #/haslo/crebain
 *            #/mapa/srodziemie?pin=1ltr-dunland-crebain  #/szukaj?q=crebain
 */

export function parsujHash(hash) {
  const surowy = (hash ?? '').replace(/^#/, '');
  const [sciezka, zapytanie] = surowy.split('?');
  const segmenty = sciezka.split('/').filter((s) => s !== '').map(decodeURIComponent);
  const query = {};
  if (zapytanie) {
    for (const [k, v] of new URLSearchParams(zapytanie).entries()) query[k] = v;
  }

  if (segmenty.length === 0) return { nazwa: 'glowna', param: null, query };
  const [nazwa, param] = segmenty;

  const dozwolone = [
    'glowna', 'karty', 'karta', 'hasla', 'haslo', 'plany', 'plan',
    'mapa', 'tagi', 'tag', 'co-nowego', 'szukaj',
  ];
  if (!dozwolone.includes(nazwa)) return { nazwa: 'nieznana', param, query };

  return { nazwa, param: param ?? null, query };
}

export function aktualnaTrasa() {
  return parsujHash(globalThis.location?.hash ?? '');
}

/** Rejestruje nasłuch zmian hasha + start; zwraca funkcję stopu (testy). */
export function uruchomRouter(obejrz) {
  const zmiana = () => obejrz(aktualnaTrasa());
  globalThis.addEventListener?.('hashchange', zmiana);
  zmiana();
  return () => globalThis.removeEventListener?.('hashchange', zmiana);
}

/** Nawigacja programowa (zachowuje historię przeglądarki). */
export function idz(hash) {
  if (globalThis.location) globalThis.location.hash = hash;
}
