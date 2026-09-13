import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mapa = JSON.parse(fs.readFileSync('maps/wiedzmin/map.json', 'utf8'));
const snapshot = JSON.parse(fs.readFileSync('scryfall/599mid-candlegrove-witch.json', 'utf8'));
const karta = fs.readFileSync('content/cards/599mid-candlegrove-witch.md', 'utf8');
const wpis = fs.readFileSync('collection/entries/599mid-candlegrove-witch.md', 'utf8');
const village = fs.readFileSync('content/cards/279m21-village-rites.md', 'utf8');
const panie = fs.readFileSync('content/lore/panie-lasu.md', 'utf8');
const velenHaslo = fs.readFileSync('content/lore/velen.md', 'utf8');
const plan = fs.readFileSync('content/planes/wiedzmin.md', 'utf8');
const changelog = fs.readFileSync('content/co-nowego.md', 'utf8');

const pin = mapa.pinezki.find((p) => p.karta === '599mid-candlegrove-witch');
const velen = mapa.kotwice.find((k) => k.nazwa === 'Velen');

const fabula = 'witch/guślarka in the ancient misty forests around Łysa Góra in Velen; linen shirt and deer-antler wreath; levitating silently in deep ritual trance; dozens of thick beeswax candles on birch branches; warm golden flames drive off lurking wraiths and escaped monsters; village coven combines gifts and will; primal herb-and-fire magic lets them rise above all dangers of the night.';

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

test('599MID: Fabuła właściciela pozostaje zachowana verbatim', () => {
  const body = wpis.match(/^---\n[\s\S]*?\n---\n\n([\s\S]*?)\n?$/)?.[1];
  assert.equal(body, fabula);
  assert.match(wpis, /^imgId: 599MID$/m);
  assert.match(wpis, /^nazwa: Candlegrove Witch$/m);
  assert.match(wpis, /^wydanie: MID$/m);
  assert.match(wpis, /^plan: Wiedźmin$/m);
});

test('599MID: imgId właściciela pozostaje niezależny od numeru MID #8', () => {
  assert.match(karta, /^imgId: 599MID$/m);
  assert.equal(snapshot.name, 'Candlegrove Witch');
  assert.equal(snapshot.set, 'mid');
  assert.equal(snapshot.set_name, 'Innistrad: Midnight Hunt');
  assert.equal(snapshot.collector_number, '8');
  assert.equal(snapshot.mana_cost, '{1}{W}');
  assert.equal(snapshot.type_line, 'Creature — Human Warlock');
  assert.equal(snapshot.rarity, 'common');
  assert.equal(snapshot.power, '2');
  assert.equal(snapshot.toughness, '2');
  assert.deepEqual(snapshot.keywords, ['Coven']);
  assert.equal(snapshot.artist, 'Anna Christenson');
  assert.match(snapshot.oracle_text, /Coven — At the beginning of combat/i);
  assert.match(snapshot.oracle_text, /three or more creatures with different powers/i);
  assert.match(snapshot.oracle_text, /gains flying until end of turn/i);
  assert.equal(snapshot.flavor_text, '"Like a thousand candles fighting back the darkness, we are strongest when we stand together."');
  assert.match(snapshot.notka_numery, /imgId właściciela = 599MID/i);
  assert.match(snapshot.notka_numery, /collector_number Scryfall = 8/i);
});

test('599MID: Karta Katalogowa jest lore-first i zachowuje świecowy ryt Łysej Góry', () => {
  assert.deepEqual(
    [...karta.matchAll(/^## (.+)$/gm)].map((m) => m[1]),
    sekcje,
  );
  assert.ok(karta.indexOf('## Kronika Lore') < karta.indexOf('## Mechanika jako Opowieść'));
  assert.match(karta, /prastarych lasach wokół Łysej Góry/);
  assert.match(karta, /\[\[velen\|Velen\]\]/);
  assert.match(karta, /\*\*guślarka w lnianej koszuli\*\*/);
  assert.match(karta, /\*\*wieniec z jeleniego poroża\*\*/);
  assert.match(karta, /dziesiątki grubych świec z pszczelego wosku/);
  assert.match(karta, /brzozowych gałęziach/);
  assert.match(karta, /głodne \*\*upiory\*\*/);
  assert.match(karta, /zbiegłe potwory/);
  assert.match(karta, /\*\*„Wiedźma Świecowego Gaju”\*\*/);
  assert.match(karta, /wznieść się ponad błoto i nocne pazury/i);
});

test('599MID: coven zostaje wiejskim kręgiem, nie nowym twardym kanonem Wiedźmina', () => {
  const narracja = karta.slice(0, karta.indexOf('## Mechanika jako Opowieść'));
  assert.doesNotMatch(narracja, /Innistrad/i);
  assert.match(karta, /cień \[\[panie-lasu\|Pań Lasu\]\]/);
  assert.match(karta, /Scena nie nazywa jednak guślarki jedną z nich/);
  assert.match(karta, /ludzką guślarkę i wspólnotę/);
  assert.match(karta, /Krąg nie zostaje dopisany do\s+urzędowych struktur czarodziejów/i);
  assert.match(karta, /człowiekiem z wiejskiego kręgu/);
  assert.match(karta, /Krąg nie wymaga\s+trzech identycznych głosów/i);
});

test('599MID: Łysa Góra dostaje regionalną pinezkę Velen bez fałszywej polany', () => {
  assert.ok(pin, 'brak pinezki Candlegrove Witch');
  assert.ok(velen, 'brak kotwicy Velen');
  assert.equal(velen.typ, 'region');
  assert.deepEqual(velen.px_t1, [2095, 2024]);
  assert.equal(pin.pewnosc, 'region');
  assert.equal(pin.x, 0.4113);
  assert.equal(pin.y, 0.2807);
  assert.equal(pin.x, velen.x);
  assert.equal(pin.y, velen.y);
  assert.match(pin.uzasadnienie, /Łysej Góry/i);
  assert.match(pin.uzasadnienie, /Ard Cerbin/i);
  assert.match(pin.uzasadnienie, /nie udaje dokładnego gaju/i);
  assert.match(karta, /Pinezka ma pewność `region`/);
  assert.match(karta, /nie rozrysowuje leśnego kręgu, konkretnej polany/i);
  assert.match(plan, /Candlegrove Witch[\s\S]*?pewność `region`/);
});

test('599MID: Panie Lasu przekraczają próg i nie dostają własnej pinezki', () => {
  assert.match(panie, /^typ: haslo$/m);
  assert.match(panie, /^slug: panie-lasu$/m);
  assert.match(panie, /^klasa: spolecznosc$/m);
  assert.doesNotMatch(panie, /^pinezka:/m);
  assert.match(panie, /Wiedźmy z Krzywuchowych Moczarów/);
  assert.match(panie, /miejscowe czarownice jako pośredniczki/);
  assert.match(panie, /#\/mapa\/wiedzmin\?x=0\.4113&y=0\.2807/);
  assert.ok(!mapa.pinezki.some((p) => p.karta === 'panie-lasu'));
  assert.match(karta, /\[\[panie-lasu\|Pań Lasu\]\]/);
  assert.match(village, /\[\[panie-lasu\|Panie Lasu\]\]/);
  assert.match(plan, /\[\[panie-lasu\|Pań Lasu\]\]/);
  assert.match(velenHaslo, /\[\[panie-lasu\|Panie Lasu\]\]/);
  assert.match(changelog, /Nowa karta: Candlegrove Witch \(Wiedźmin\)/);
});
