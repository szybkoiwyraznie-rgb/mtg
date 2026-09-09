/**
 * Integralność: snapshoty Oracle (ADR 0004).
 * Każda karta ma kompletny snapshot scryfall/<slug>.json.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wczytajStrony, wczytajScryfall, widokScryfallDlaKarty } from '../tools/content-loader.mjs';

const karty = wczytajStrony().filter((s) => !s.problem && s.typ === 'karta');
const snapshoty = wczytajScryfall();

// Stabilne pola/struktury całej odpowiedzi, nie tylko minimum infoboksu
// (A2/E1 audytu PR-21). Nie wymagamy opcjonalnych: flavor_text, P/T,
// mtgo_id, arena_id, rankingi, all_parts ani nowych pól dodawanych do API.
// Nie porównujemy cen/legalności z siecią: to dane z DNIA pobrania.
const TEKSTOWE_WSPOLNE = ['id', 'oracle_id', 'name', 'lang', 'released_at', 'uri', 'scryfall_uri',
  'layout', 'image_status', 'type_line', 'set_id', 'set', 'set_name', 'set_type', 'set_uri',
  'set_search_uri', 'scryfall_set_uri', 'rulings_uri', 'prints_search_uri', 'collector_number',
  'rarity', 'artist', 'border_color', 'frame', 'source', 'pobrano', 'slug'];
const TEKSTOWE_POJEDYNCZEJ_STRONY = ['mana_cost', 'oracle_text'];
const LOGICZNE = ['highres_image', 'reserved', 'foil', 'nonfoil', 'oversized',
  'promo', 'reprint', 'variation', 'digital', 'full_art', 'textless', 'booster', 'story_spotlight'];
const TABLICE_WSPOLNE = ['multiverse_ids', 'color_identity', 'keywords', 'games', 'finishes', 'artist_ids'];
const FORMATY = ['standard', 'future', 'historic', 'timeless', 'gladiator', 'pioneer',
  'modern', 'legacy', 'pauper', 'vintage', 'penny', 'commander', 'oathbreaker',
  'standardbrawl', 'brawl', 'alchemy', 'paupercommander', 'duel', 'oldschool', 'premodern'];
const CENY = ['usd', 'usd_foil', 'usd_etched', 'eur', 'eur_foil', 'tix'];
const OBRAZY = ['small', 'normal', 'large', 'png', 'art_crop', 'border_crop'];
const jestObiektem = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const jestLayoutTwarzy = (snap) => Array.isArray(snap?.card_faces) && snap.card_faces.length > 0;

function sprawdzObrazy(obrazki, prefix, problemy) {
  if (!jestObiektem(obrazki)) { problemy.push(`${prefix}: wymagany obiekt`); return; }
  for (const format of OBRAZY) {
    if (typeof obrazki?.[format] !== 'string' || !obrazki[format]) {
      problemy.push(`${prefix}.${format}: brak URL-a`);
    }
  }
}

function sprawdzTwarz(face, i, problemy) {
  const prefix = `card_faces[${i}]`;
  if (!jestObiektem(face)) { problemy.push(`${prefix}: wymagana twarz`); return; }
  for (const pole of ['name', 'mana_cost', 'type_line', 'oracle_text', 'artist']) {
    if (typeof face[pole] !== 'string') problemy.push(`${prefix}.${pole}: wymagany tekst`);
  }
  if (!Array.isArray(face.colors)) problemy.push(`${prefix}.colors: wymagana tablica`);
  if (face.power !== undefined && typeof face.power !== 'string') problemy.push(`${prefix}.power: wymagany tekst`);
  if (face.toughness !== undefined && typeof face.toughness !== 'string') problemy.push(`${prefix}.toughness: wymagany tekst`);
  sprawdzObrazy(face.image_uris, `${prefix}.image_uris`, problemy);
}

/** Brama strukturalna: wychwytuje obcięty snapshot. Pełność wszystkich
 * opcjonalnych pól nadal wymaga zapisu CAŁEGO JSON-a podczas pobrania. */
function sprawdzSnapshot(snap) {
  if (!jestObiektem(snap)) return ['snapshot nie jest obiektem'];
  const problemy = [];
  const maTwarze = jestLayoutTwarzy(snap);
  if (snap.object !== 'card') problemy.push('object musi być card');
  for (const pole of TEKSTOWE_WSPOLNE) {
    if (typeof snap[pole] !== 'string') problemy.push(`${pole}: wymagany tekst`);
  }
  if (!maTwarze) {
    for (const pole of TEKSTOWE_POJEDYNCZEJ_STRONY) {
      if (typeof snap[pole] !== 'string') problemy.push(`${pole}: wymagany tekst`);
    }
  }
  for (const pole of LOGICZNE) {
    if (typeof snap[pole] !== 'boolean') problemy.push(`${pole}: wymagane true/false`);
  }
  for (const pole of TABLICE_WSPOLNE) {
    if (!Array.isArray(snap[pole])) problemy.push(`${pole}: wymagana tablica`);
  }
  if (!maTwarze && !Array.isArray(snap.colors)) problemy.push('colors: wymagana tablica');
  if (!Number.isFinite(snap.cmc)) problemy.push('cmc: wymagana liczba');
  for (const blok of ['legalities', 'prices', 'related_uris']) {
    if (!jestObiektem(snap[blok])) problemy.push(`${blok}: wymagany obiekt`);
  }
  if (maTwarze) {
    if (!Array.isArray(snap.card_faces) || snap.card_faces.length === 0) problemy.push('card_faces: wymagana niepusta tablica');
    else snap.card_faces.forEach((face, i) => sprawdzTwarz(face, i, problemy));
  } else {
    sprawdzObrazy(snap.image_uris, 'image_uris', problemy);
  }
  for (const format of FORMATY) {
    if (!['legal', 'not_legal', 'restricted', 'banned'].includes(snap.legalities?.[format])) {
      problemy.push(`legalities.${format}: brak statusu`);
    }
  }
  for (const cena of CENY) {
    // null = brak notowania, a nie brak pola w odpowiedzi.
    if (!Object.hasOwn(snap.prices ?? {}, cena) || !(snap.prices[cena] === null || typeof snap.prices[cena] === 'string')) {
      problemy.push(`prices.${cena}: wymagany tekst lub null`);
    }
  }
  return problemy;
}

test('każda karta ma snapshot o własnym slugu', () => {
  const braki = karty.filter((k) => !snapshoty.has(k.slug)).map((k) => k.slug);
  assert.deepEqual(braki, [], `Karty bez snapshotu Scryfall (ADR 0004):\n${braki.join('\n')}`);
});

test('snapshoty mają komplet wymaganych pól + metadane pochodzenia', () => {
  const problemy = [];
  for (const [slug, snap] of snapshoty) {
    if (snap.problem) { problemy.push(`${slug}: ${snap.problem}`); continue; }
    for (const problem of sprawdzSnapshot(snap)) problemy.push(`${slug}: ${problem}`);
    for (const pole of ['source', 'pobrano', 'slug']) {
      if (!snap[pole]) problemy.push(`${slug}: brak metadany ${pole}`);
    }
  }
  assert.deepEqual(problemy, [], `Niekompletne snapshoty:\n${problemy.join('\n')}`);
});

test('nazwa karty zgadza się ze snapshotem lub z właściwą twarzą snapshotu', () => {
  const rozjazdy = [];
  for (const k of karty) {
    const snap = snapshoty.get(k.slug);
    if (snap && !snap.problem && snap.slug !== k.slug) {
      rozjazdy.push(`${k.slug}: slug snapshotu ${snap.slug}`);
    }
    const widok = snap && !snap.problem ? widokScryfallDlaKarty(snap, k.nazwa) : null;
    if (snap && !snap.problem && String(widok?.name).toLowerCase() !== String(k.nazwa).toLowerCase()) {
      rozjazdy.push(`${k.slug}: nazwa karty "${k.nazwa}" vs snapshot/widok "${widok?.name ?? snap.name}"`);
    }
  }
  assert.deepEqual(rozjazdy, [], `Rozjazdy nazw:\n${rozjazdy.join('\n')}`);
});

test('snapshot DFC może materializować jedną twarz niezależnie od nazwy całej karty', () => {
  const snap = snapshoty.get('309isd-civilized-scholar');
  const widok = widokScryfallDlaKarty(snap, 'Civilized Scholar');
  assert.equal(snap.name, 'Civilized Scholar // Homicidal Brute');
  assert.equal(widok.name, 'Civilized Scholar');
  assert.equal(widok.type_line, 'Creature — Human Advisor');
  assert.equal(widok.oracle_text.startsWith('{T}: Draw a card'), true);
});

test('snapshot: sam zestaw pól infoboksu nie spełnia kontraktu całego JSON-a (A2)', () => {
  const caly = snapshoty.get('137gpt-withstand');
  assert.deepEqual(sprawdzSnapshot(caly), []);
  const polaInfoboksu = ['name', 'mana_cost', 'type_line', 'oracle_text', 'set', 'rarity',
    'artist', 'image_uris', 'source', 'pobrano', 'slug'];
  const obciety = Object.fromEntries(polaInfoboksu.map((p) => [p, caly[p]]));
  const uwagi = sprawdzSnapshot(obciety);
  for (const pole of ['legalities', 'prices', 'finishes', 'set_search_uri']) {
    assert.ok(uwagi.some((u) => u.startsWith(pole)), `pominięty blok ${pole} musi być błędem`);
  }
});

test('snapshot: puste obiekty nie zastępują legalities/prices, null w cenie i false są poprawne', () => {
  const caly = structuredClone(snapshoty.get('137gpt-withstand'));
  caly.prices.usd = null;
  caly.colors = [];
  caly.multiverse_ids = [];
  caly.promo = false;
  assert.deepEqual(sprawdzSnapshot(caly), [], 'nie odrzucać legalnych null/false/pustych tablic');
  caly.legalities = { modern: 'legal', legacy: 'legal', commander: 'legal' };
  caly.prices = {};
  const uwagi = sprawdzSnapshot(caly);
  assert.ok(uwagi.includes('legalities.standard: brak statusu'));
  assert.ok(uwagi.includes('prices.usd: wymagany tekst lub null'));
});
