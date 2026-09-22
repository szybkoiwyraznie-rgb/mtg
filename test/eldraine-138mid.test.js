import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mapa = JSON.parse(fs.readFileSync('maps/eldraine/map.json', 'utf8'));
const snapshot = JSON.parse(fs.readFileSync('scryfall/138mid-join-the-dance.json', 'utf8'));
const karta = fs.readFileSync('content/cards/138mid-join-the-dance.md', 'utf8');
const wpis = fs.readFileSync('collection/entries/138mid-join-the-dance.md', 'utf8');
const plan = fs.readFileSync('content/planes/eldraine.md', 'utf8');

const fabula = 'W rolniczych osadach na pograniczu królestwa Ardenvale na planie Eldraine wspólnota wiejska stanowi najsilniejszą obronę przed lękiem nocy. Podczas dorocznego święta żniw mieszkańcy rozpalają na rynku wielkie ognisko, jednocząc się w tradycyjnym, radosnym tańcu w kręgu. Dwoje młodych ludzi w wieńcach ze złocistych kłosów i jarzębiny z uśmiechem wyciąga dłonie ku przybyłym, zapraszając wędrowców do wspólnego korowodu. W obliczu czającego się za opłotkami mroku puszczy ludzki uścisk i wzajemna solidarność stają się tarczą potężniejszą niż najgrubszy kamienny mur.';
const pin = mapa.pinezki.find((p) => p.karta === '138mid-join-the-dance');
const arden = mapa.kotwice.find((k) => k.nazwa === 'Highlands of Arden');
const sekcje = ['Kronika Lore', 'Postacie i Byty', 'Nazwa Karty', 'Flavor Text', 'Transpozycja', 'Na Mapie', 'Mechanika jako Opowieść', 'Źródła', 'Podsumowanie Lore'];

test('138MID: Fabuła właściciela pozostaje zachowana verbatim', () => {
  const body = wpis.match(/^---\n[\s\S]*?\n---\n\n([\s\S]*?)\n?$/)?.[1];
  assert.equal(body, `## Fabuła (dostawa 2026-09-21, ADR 0026)\n\n${fabula}`);
  assert.match(wpis, /^imgId: 138MID$/m);
  assert.match(wpis, /^nazwa: Join the Dance$/m);
  assert.match(wpis, /^wydanie: MID$/m);
  assert.match(wpis, /^plan: Eldraine$/m);
});

test('138MID: snapshot rozdziela imgId 138MID od MID #229', () => {
  assert.match(karta, /^imgId: 138MID$/m);
  assert.equal(snapshot.name, 'Join the Dance');
  assert.equal(snapshot.set, 'mid');
  assert.equal(snapshot.collector_number, '229');
  assert.equal(snapshot.mana_cost, '{G}{W}');
  assert.equal(snapshot.type_line, 'Sorcery');
  assert.equal(snapshot.rarity, 'uncommon');
  assert.equal(snapshot.artist, 'Raoul Vitale');
  assert.match(snapshot.oracle_text, /Create two 1\/1 white Human creature tokens/);
  assert.match(snapshot.oracle_text, /Flashback \{3\}\{G\}\{W\}/);
  assert.equal(snapshot.flavor_text, 'We can go into the dark hand-in-hand or alone. I know which I prefer.');
  assert.match(snapshot.notka_numery, /imgId właściciela = 138MID/);
  assert.match(snapshot.notka_numery, /collector_number Scryfall = 229/);
});

test('138MID: Karta Katalogowa jest LORE-first i zachowuje wspólnotę ogniska', () => {
  assert.deepEqual([...karta.matchAll(/^## (.+)$/gm)].map((m) => m[1]), sekcje);
  assert.ok(karta.indexOf('## Kronika Lore') < karta.indexOf('## Mechanika jako Opowieść'));
  assert.match(karta, /\[\[eldraine\|Eldraine\]\]/);
  assert.match(karta, /dorocznych dożynek/);
  assert.match(karta, /Wieńce z kłosów i jarzębiny|wieńce z kłosów i\s+jarzębiny/);
  assert.match(karta, /nie musi udawać,[\s\S]*strach nie istnieje/);
  assert.match(karta, /dwa białe żetony Ludzi 1\/1/);
  assert.match(karta, /Flashback za `?\{3\}\{G\}\{W\}`?/);
});

test('138MID: regionalna pinezka trafia na Highlands of Arden, nie na zamek', () => {
  assert.ok(pin, 'brak pinezki Join the Dance');
  assert.ok(arden, 'brak kotwicy Highlands of Arden');
  assert.equal(pin.pewnosc, 'region');
  assert.equal(pin.x, arden.x);
  assert.equal(pin.y, arden.y);
  assert.match(pin.uzasadnienie, /rolnicza osada/);
  assert.match(pin.uzasadnienie, /nie wskazuje Castle Ardenvale/i);
  assert.match(karta, /Pinezka ma pewność \*\*region\*\*/);
  assert.match(karta, /nie wskazuje Castle Ardenvale/i);
  assert.match(plan, /Highlands of Arden[\s\S]*Castle Ardenvale/);
});

test('138MID: pojedyncze święto i wieś nie tworzą przedwczesnego hasła', () => {
  assert.doesNotMatch(karta, /\[\[join-the-dance\|/);
  assert.doesNotMatch(fs.readFileSync('content/lore/README.md', 'utf8'), /join-the-dance/);
});
