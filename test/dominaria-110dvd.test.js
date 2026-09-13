import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mapa = JSON.parse(fs.readFileSync('maps/dominaria/map.json', 'utf8'));
const snapshot = JSON.parse(fs.readFileSync('scryfall/110dvd-serra-s-embrace.json', 'utf8'));
const karta = fs.readFileSync('content/cards/110dvd-serra-s-embrace.md', 'utf8');
const wpis = fs.readFileSync('collection/entries/110dvd-serra-s-embrace.md', 'utf8');
const haslo = fs.readFileSync('content/lore/serra.md', 'utf8');
const expunge = fs.readFileSync('content/cards/40usg-expunge.md', 'utf8');
const plan = fs.readFileSync('content/planes/dominaria.md', 'utf8');
const changelog = fs.readFileSync('content/co-nowego.md', 'utf8');

const pin = mapa.pinezki.find((p) => p.karta === '110dvd-serra-s-embrace');
const katedra = mapa.kotwice.find((k) => k.nazwa === 'Cathedral of Serra');

const fabula = 'Na polu bitwy Dominarii w złotej godzinie zachodzącego słońca stoi zwykły ludzki piechur w zużytej kolczudze i skórzanym napierśniku, z prostym mieczem w dłoni — zmęczony, zakurzony, nie bohater. Z nieba pełnego ciepłego pomarańczowego światła zstępuje ku niemu eteryczna forma anioła Serry — rozpostarte skrzydła z piór czystego światła wyrastają jakby z jego pleców, ramiona anielskiej obecności oplatają jego ramiona, dłonie nakładają się na dłonie na rękojeści. Żołnierz unosi się kilka centymetrów nad ziemią, ale jeszcze tego nie zauważył — miecz w jego dłoni lśni złotawo, a zbroja wydaje się jaśniejsza niż była. Na Dominarii Serra nie przychodzi po generałów — przychodzi po tych, którzy stoją dalej, choć reszta już nie stoi.';

const sekcje = [
  'Kronika Lore',
  'Postacie i Byty',
  'Nazwa Karty',
  'Flavor Text',
  'Transpozycja',
  'Na Mapie',
  'Mechanika jako Opowieść',
  'Źródła',
  'Podsumowanie Lore',
];

test('110DVD: Fabuła właściciela pozostaje zachowana verbatim', () => {
  const body = wpis.match(/^---\n[\s\S]*?\n---\n\n([\s\S]*?)\n?$/)?.[1];
  assert.equal(body, fabula);
  assert.match(wpis, /^imgId: 110DVD$/m);
  assert.match(wpis, /^nazwa: Serra's Embrace$/m);
  assert.match(wpis, /^wydanie: DVD$/m);
  assert.match(wpis, /^plan: Dominaria$/m);
});

test('110DVD: imgId właściciela pozostaje niezależny od numeru DVD #21', () => {
  assert.match(karta, /^imgId: 110DVD$/m);
  assert.equal(snapshot.name, "Serra's Embrace");
  assert.equal(snapshot.set, 'dvd');
  assert.equal(snapshot.collector_number, '21');
  assert.equal(snapshot.mana_cost, '{2}{W}{W}');
  assert.equal(snapshot.type_line, 'Enchantment — Aura');
  assert.equal(snapshot.rarity, 'uncommon');
  assert.equal(snapshot.artist, 'Zoltan Boros & Gabor Szikszai');
  assert.match(snapshot.oracle_text, /Enchant creature/i);
  assert.match(snapshot.oracle_text, /\+2\/\+2/);
  assert.match(snapshot.oracle_text, /flying and vigilance/i);
  assert.equal(snapshot.flavor_text, "The touch of Serra's angels bears hopes aloft and empowers noble causes.");
  assert.match(snapshot.notka_numery, /imgId właściciela = 110DVD/i);
  assert.match(snapshot.notka_numery, /collector_number Scryfall = 21/i);
});

test('110DVD: Karta Katalogowa zachowuje piechura, objęcie i aurę Serry', () => {
  assert.deepEqual(
    [...karta.matchAll(/^## (.+)$/gm)].map((m) => m[1]),
    sekcje,
  );
  assert.ok(karta.indexOf('## Kronika Lore') < karta.indexOf('## Mechanika jako Opowieść'));
  assert.match(karta, /zwykły \*\*ludzki piechur\*\*/);
  assert.match(karta, /\[\[serra\|\*\*Serry\*\*\]\]/);
  assert.match(karta, /\*\*„Objęcie Serry”\*\*/);
  assert.match(karta, /unosi się o kilka palców nad ziemię/);
  assert.match(karta, /Serra nie\s+wybiera tu zwycięzcy z kronik rodowych/i);
  assert.match(karta, /skrzydła z piór czystego światła/);
  assert.match(karta, /\+2\/\+2[\s\S]*?flying[\s\S]*?vigilance/i);
  assert.match(karta, /Aura trwa na jednym\s+stworzeniu/i);
});

test('110DVD: ogólne pole bitwy dostaje regionalną kotwicę Sursi bez fałszywej precyzji', () => {
  assert.ok(pin, 'brak pinezki Serra\'s Embrace');
  assert.ok(katedra, 'brak kotwicy Cathedral of Serra');
  assert.equal(pin.pewnosc, 'region');
  assert.equal(pin.x, 0.1937);
  assert.equal(pin.y, 0.3806);
  assert.equal(pin.x, katedra.x);
  assert.equal(pin.y, katedra.y);
  assert.deepEqual(katedra.px_t1, [1569, 1979]);
  assert.match(pin.uzasadnienie, /polu bitwy Dominarii/i);
  assert.match(pin.uzasadnienie, /Sursi\/Katedra Serran/i);
  assert.match(pin.uzasadnienie, /nie dokładną linię bitwy/i);
  assert.match(karta, /Pinezka ma pewność `region`/);
  assert.match(karta, /nie\s+udaje więc dokładnego pola bitwy/i);
  assert.match(plan, /Serra's Embrace[\s\S]*?pewność region/);
});

test('110DVD: Serra przekracza próg dwóch kart i ma hasło postaci', () => {
  assert.match(haslo, /^typ: haslo$/m);
  assert.match(haslo, /^slug: serra$/m);
  assert.match(haslo, /^klasa: postac$/m);
  assert.doesNotMatch(haslo, /^pinezka:/m);
  assert.match(haslo, /#\/mapa\/dominaria\?x=0\.1937&y=0\.3806/);
  assert.match(karta, /\[\[serra\|/);
  assert.match(expunge, /\[\[serra\|/);
  assert.match(plan, /\[\[serra\|Serra\]\]/);
  assert.match(changelog, /Nowa karta: Serra's Embrace \(Dominaria\)/);
});
