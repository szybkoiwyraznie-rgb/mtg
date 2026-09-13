import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const wpis = fs.readFileSync('collection/entries/69m11-tome-scour.md', 'utf8');
const karta = fs.readFileSync('content/cards/69m11-tome-scour.md', 'utf8');
const snapshot = JSON.parse(fs.readFileSync('scryfall/69m11-tome-scour.json', 'utf8'));
const mapa = JSON.parse(fs.readFileSync('maps/warhammer-fantasy/map.json', 'utf8'));
const plan = fs.readFileSync('content/planes/warhammer-fantasy.md', 'utf8');
const fabula = 'W mrocznym zagraconym laboratorium Wielkiego Magistra Nauk Tajemnych, na ciężkim dębowym stole, leży otwarty wolumin o pożółkłych stronach. Mosiężna rękawica z ostrymi metalowymi rysikami na palcach agresywnie zdrapuje iluminowane litery z pergaminu, a pięć arkuszy właśnie rozpada się na strzępy i czarny pył wirując w powietrzu jak stado spłoszonych ptaków. Tusz rozmazuje się pod wpływem magicznej energii, zamieniając się w gęste czarne krople lewitujące nad blatem. Kolegium Światła wierzy, że niektóre księgi trzeba czytać uważnie, a inne rozłożyć na atomy, zanim ktoś inny zdąży je otworzyć — ta należy do drugiej kategorii.';

const sekcje = ['Kronika Lore', 'Postacie i Byty', 'Nazwa Karty', 'Flavor Text', 'Transpozycja', 'Na Mapie', 'Mechanika jako Opowieść', 'Źródła', 'Podsumowanie Lore'];

test('69M11: Fabuła właściciela pozostaje zachowana verbatim', () => {
  assert.equal(wpis.match(/^---\n[\s\S]*?\n---\n\n([\s\S]*?)\n?$/)?.[1], fabula);
  assert.match(wpis, /^imgId: 69M11$/m);
  assert.match(wpis, /^nazwa: Tome Scour$/m);
  assert.match(wpis, /^wydanie: M11$/m);
});

test('69M11: imgId właściciela jest niezależny od M11 #76', () => {
  assert.equal(snapshot.name, 'Tome Scour');
  assert.equal(snapshot.set, 'm11');
  assert.equal(snapshot.collector_number, '76');
  assert.equal(snapshot.mana_cost, '{U}');
  assert.equal(snapshot.type_line, 'Sorcery');
  assert.equal(snapshot.oracle_text, 'Target player mills five cards.');
  assert.deepEqual(snapshot.keywords, ['Mill']);
  assert.match(snapshot.notka_numery, /imgId właściciela = 69M11/);
});

test('69M11: Karta jest LORE-first i zachowuje pięć niszczonych arkuszy', () => {
  assert.deepEqual([...karta.matchAll(/^## (.+)$/gm)].map((m) => m[1]), sekcje);
  assert.match(karta, /mosiężna rękawica Wielkiego Magistra Nauk Tajemnych/);
  assert.match(karta, /pięć ostrych rysików/);
  assert.match(karta, /pięć arkuszy rozpadnie się w strzępy oraz pył/);
  assert.match(karta, /czarne krople/);
  assert.match(karta, /Kolegium Światła/);
  assert.match(karta, /Wytrzebienie woluminu/);
});

test('69M11: mechanika zachowuje jedną niebieską manę i mill five', () => {
  const mech = karta.slice(karta.indexOf('## Mechanika jako Opowieść'), karta.indexOf('## Źródła'));
  assert.match(mech, /Za `\{U\}`/);
  assert.match(mech, /zmielić \*\*pięć kart\*\*/);
  assert.match(mech, /Pięć arkuszy/);
});

test('69M11: laboratorium ma miejską kotwicę Altdorfu, bez fałszywej sali', () => {
  const anchor = mapa.kotwice.find((k) => k.nazwa === 'Altdorf');
  const pin = mapa.pinezki.find((p) => p.karta === '69m11-tome-scour');
  assert.ok(anchor);
  assert.ok(pin);
  assert.deepEqual(anchor.px_t1, [2580, 5140]);
  assert.equal(pin.x, anchor.x);
  assert.equal(pin.y, anchor.y);
  assert.equal(pin.pewnosc, 'dokladna');
  assert.match(pin.uzasadnienie, /miasta, nie konkretnej sali/);
  assert.match(plan, /Tome Scour[\s\S]*?Altdorf/);
  assert.ok(!fs.existsSync('content/lore/kolegium-swiatla.md'));
});
