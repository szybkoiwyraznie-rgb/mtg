import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mapa = JSON.parse(fs.readFileSync('maps/ravnica/map.json', 'utf8'));
const snapshot = JSON.parse(fs.readFileSync('scryfall/235rtr-trestle-troll.json', 'utf8'));
const karta = fs.readFileSync('content/cards/235rtr-trestle-troll.md', 'utf8');
const wpis = fs.readFileSync('collection/entries/235rtr-trestle-troll.md', 'utf8');
const plan = fs.readFileSync('content/planes/ravnica.md', 'utf8');

const fabula = 'Przy ogromnej starej estakadzie w najniższych poziomach Ravnicy, w zaniedbanej dzielnicy porośniętej mchem i grzybami, pod masywnymi filarami mostu przyczepiony jest do kamiennej ściany potężny troll — muskularny o wilgotnej oliwkowo-zielonej skórze, przywarty do filaru wszystkimi kończynami niczym gigantyczny gad. Z jego pleców i barków wyrastają narośla z mchu i porostów, jakby przez lata zrósł się z konstrukcją, a z głowy zwisają długie czarne mokre pasma. Kluczowy gest: unosi jedno ogromne ramię ponad krawędź estakady i opiera dłoń na pomoście, blokując żywą zaporą przejście górą — nad którym spłoszone ptaki wirują białymi piórami. Na Ravnicy golgaryjskie trolle estakadowe nie próbują zejść z mostu, by cię zatrzymać — zatrzymają cię, nie ruszając się z miejsca, bo ich ręka jest dłuższa, niż myślałeś.';
const pin = mapa.pinezki.find((p) => p.karta === '235rtr-trestle-troll');
const kotwica = mapa.kotwice.find((k) => k.nazwa === 'Deadbridge Chasm');
const sekcje = ['Kronika Lore', 'Postacie i Byty', 'Nazwa Karty', 'Flavor Text', 'Transpozycja', 'Na Mapie', 'Mechanika jako Opowieść', 'Źródła', 'Podsumowanie Lore'];

test('235RTR: Fabuła właściciela pozostaje zachowana verbatim', () => {
  const body = wpis.match(/^---\n[\s\S]*?\n---\n\n([\s\S]*?)\n?$/)?.[1];
  assert.equal(body, `## Fabuła (dostawa 2026-09-21, ADR 0026)\n\n${fabula}`);
  assert.match(wpis, /^imgId: 235RTR$/m);
  assert.match(wpis, /^nazwa: Trestle Troll$/m);
  assert.match(wpis, /^wydanie: RTR$/m);
  assert.match(wpis, /^plan: Ravnica$/m);
});

test('235RTR: snapshot rozdziela imgId 235RTR od RTR #205', () => {
  assert.match(karta, /^imgId: 235RTR$/m);
  assert.equal(snapshot.name, 'Trestle Troll');
  assert.equal(snapshot.set, 'rtr');
  assert.equal(snapshot.collector_number, '205');
  assert.equal(snapshot.mana_cost, '{1}{B}{G}');
  assert.equal(snapshot.type_line, 'Creature — Troll');
  assert.equal(snapshot.rarity, 'common');
  assert.equal(snapshot.power, '1');
  assert.equal(snapshot.toughness, '4');
  assert.equal(snapshot.artist, 'Peter Mohrbacher');
  assert.match(snapshot.oracle_text, /Defender/);
  assert.match(snapshot.oracle_text, /Reach/);
  assert.match(snapshot.oracle_text, /Regenerate/);
  assert.equal(snapshot.flavor_text, 'Unwelcome in Golgari colonies, he found his own dark place from which to represent the Swarm.');
  assert.match(snapshot.notka_numery, /imgId właściciela = 235RTR/);
  assert.match(snapshot.notka_numery, /collector_number Scryfall = 205/);
});

test('235RTR: Karta Katalogowa jest LORE-first i zachowuje gest żywej zapory', () => {
  assert.deepEqual([...karta.matchAll(/^## (.+)$/gm)].map((m) => m[1]), sekcje);
  assert.ok(karta.indexOf('## Kronika Lore') < karta.indexOf('## Mechanika jako Opowieść'));
  assert.match(karta, /\[\[ravnica\|Ravnicy\]\]/);
  assert.match(karta, /g o l g a r y j s k i e g o|golgariańskiego trolla estakadowego/);
  assert.match(karta, /Jedno ogromne ramię/);
  assert.match(karta, /nie udajemy, że mapa Ravnicy zna dokładny adres/);
  assert.match(karta, /Defender/);
  assert.match(karta, /Reach/);
  assert.match(karta, /Regeneracja za czarną i zieloną manę/);
});

test('235RTR: karta dostaje regionalną pinezkę na podziemne Deadbridge Chasm', () => {
  assert.ok(pin, 'brak pinezki Trestle Troll');
  assert.ok(kotwica, 'brak kotwicy Deadbridge Chasm');
  assert.equal(pin.pewnosc, 'region');
  assert.equal(pin.x, 0.4122);
  assert.equal(pin.y, 0.7302);
  assert.equal(pin.x, kotwica.x);
  assert.equal(pin.y, kotwica.y);
  assert.match(pin.uzasadnienie, /najniższych poziomach/);
  assert.match(pin.uzasadnienie, /nie konkretny most ani filar/);
  assert.match(karta, /Pinezka ma pewność \*\*region\*\*/);
  assert.match(karta, /Deadbridge Chasm/);
  assert.match(plan, /Undercity[\s\S]*Korozda &/);
});

test('235RTR: pojedynczy troll nie tworzy przedwczesnego hasła', () => {
  assert.doesNotMatch(fs.readFileSync('content/lore/README.md', 'utf8'), /trestle-troll/);
  assert.doesNotMatch(karta, /\[\[trestle-troll\|/);
});
