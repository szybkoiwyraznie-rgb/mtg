import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wczytajStrony } from '../tools/content-loader.mjs';

const mapa = JSON.parse(fs.readFileSync('maps/warhammer-fantasy/map.json', 'utf8'));
const snapshot = JSON.parse(fs.readFileSync('scryfall/543isd-wooden-stake.json', 'utf8'));
const karta = fs.readFileSync('content/cards/543isd-wooden-stake.md', 'utf8');
const wpis = fs.readFileSync('collection/entries/543isd-wooden-stake.md', 'utf8');
const plan = fs.readFileSync('content/planes/warhammer-fantasy.md', 'utf8');
const backlog = fs.readFileSync('docs/backlog.md', 'utf8');
const strony = wczytajStrony().filter((s) => !s.problem);

const pin = mapa.pinezki.find((p) => p.karta === '543isd-wooden-stake');
const sylvania = mapa.kotwice.find((k) => k.nazwa === 'Sylvania');
const fabula = 'Na spowitych mgłą cmentarzach mrocznej Sylvanii bezwzględni łowcy czarownic z Imperium muszą polegać na najprostszych, ale absolutnie sprawdzonych narzędziach. Grubo ociosany, dębowy kołek staje się w ich rękach ostateczną bronią zdolną skutecznie powstrzymać nieumarłych arystokratów z rodu von Carstein. Zapędzony pod ścianę omszałego grobowca wampir kuli się przed zbliżającym się ostrzem, tracąc w ułamku sekundy całą swoją nadnaturalną pewność siebie. Kawałek zwykłego drewna pozwala śmiertelnikom bezpowrotnie przerwać wielowiekowe, bluźniercze istnienie każdego wampira.';
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

test('543ISD: Fabuła właściciela pozostaje zachowana verbatim', () => {
  const body = wpis.match(/^---\n[\s\S]*?\n---\n\n([\s\S]*?)\n?$/)?.[1];
  assert.equal(body, fabula);
  assert.match(wpis, /^imgId: 543ISD$/m);
  assert.match(wpis, /^nazwa: Wooden Stake$/m);
  assert.match(wpis, /^wydanie: ISD$/m);
  assert.match(wpis, /^plan: Warhammer Fantasy$/m);
});

test('543ISD: imgId właściciela nie jest numerem kolekcjonerskim ISD #237', () => {
  assert.match(karta, /^imgId: 543ISD$/m);
  assert.match(karta, /^wydanie: ISD$/m);
  assert.match(karta, /^plan: warhammer-fantasy$/m);
  assert.match(karta, /^kolory: \[C\]$/m);
  assert.equal(snapshot.name, 'Wooden Stake');
  assert.equal(snapshot.set, 'isd');
  assert.equal(snapshot.set_name, 'Innistrad');
  assert.equal(snapshot.collector_number, '237');
  assert.deepEqual(snapshot.multiverse_ids, [226880]);
  assert.equal(snapshot.mana_cost, '{2}');
  assert.equal(snapshot.type_line, 'Artifact — Equipment');
  assert.equal(snapshot.rarity, 'common');
  assert.deepEqual(snapshot.colors, []);
  assert.deepEqual(snapshot.color_identity, []);
  assert.deepEqual(snapshot.keywords, ['Equip']);
  assert.equal(snapshot.artist, 'David Palumbo');
  assert.match(snapshot.oracle_text, /Equipped creature gets \+1\/\+0/);
  assert.match(snapshot.oracle_text, /blocks or becomes blocked by a Vampire/);
  assert.match(snapshot.oracle_text, /can't be regenerated/);
  assert.match(snapshot.oracle_text, /Equip \{1\}/);
  assert.match(snapshot.related_uris.gatherer, /multiverseid=226880/);
  assert.match(snapshot.notka_numery, /imgId właściciela = 543ISD/i);
  assert.match(snapshot.notka_numery, /Innistrad #237/i);
  assert.match(snapshot.notka_numery, /\/cards\/isd\/543 zwraca not_found/i);
});

test('543ISD: Karta Katalogowa jest lore-first i centrum stanowi Sylwania', () => {
  assert.deepEqual(
    [...karta.matchAll(/^## (.+)$/gm)].map((m) => m[1]),
    sekcje,
  );
  assert.ok(karta.indexOf('## Kronika Lore') < karta.indexOf('## Mechanika jako Opowieść'));
  assert.match(karta, /\[\[warhammer-fantasy\|Starym Świecie\]\]/);
  assert.match(karta, /Sylwan/i);
  assert.match(karta, /łowc[ay] czarownic/i);
  assert.match(karta, /Imperium/i);
  assert.match(karta, /dębowy kołek/i);
  assert.match(karta, /von Carstein/i);
  assert.match(karta, /omszał(?:ym|ego) grobow/i);
  assert.match(karta, /cmentarz/i);
  assert.match(karta, /kawałek drewna/i);
  assert.match(karta, /nieumarł/i);
});

test('543ISD: mechanika przenosi Equipment, zwarcie z Vampire i brak regeneracji', () => {
  const narracja = karta.slice(0, karta.indexOf('## Mechanika jako Opowieść'));
  assert.doesNotMatch(narracja, /ISD #237|Scryfall|Oracle|collector_number|multiverse|Gatherer/i);
  assert.match(karta, /Koszt `\{2\}` i typ \*\*Artifact — Equipment\*\*/);
  assert.match(karta, /Premia `\+1\/\+0`/);
  assert.match(karta, /blocks or becomes\s+blocked by a Vampire/);
  assert.match(karta, /It can't be regenerated/);
  assert.match(karta, /Vampire ginie przed zadaniem obrażeń bojowych/i);
  assert.match(karta, /`Equip \{1\}`/);
});

test('543ISD: cmentarze Sylwanii dostają tylko regionalną pinezkę karty', () => {
  assert.ok(pin, 'brak pinezki Wooden Stake');
  assert.ok(sylvania, 'brak kotwicy Sylvania');
  assert.equal(sylvania.typ, 'region');
  assert.equal(pin.pewnosc, 'region');
  assert.ok(Math.abs(pin.x - sylvania.x) < 0.0001);
  assert.ok(Math.abs(pin.y - sylvania.y) < 0.0001);
  assert.equal(pin.x, 0.487);
  assert.equal(pin.y, 0.421);
  assert.match(pin.uzasadnienie, /mgliste cmentarze mrocznej Sylwanii/i);
  assert.match(pin.uzasadnienie, /nie podaje miasta, wsi, zamku ani konkretnej nekropolii/i);
  assert.match(karta, /Pinezka stoi regionalnie w \*\*Sylwanii\*\*/);
  assert.match(karta, /nie nazywa miasta, wsi, zamku ani\s+konkretnej nekropolii/i);
  assert.ok(!mapa.pinezki.some((p) => p.karta === 'sylwania'), 'hasło Sylwania nie może mieć pinezki karty');
});

test('543ISD: plan i backlog pogłębione bez przedwczesnych haseł', () => {
  assert.match(plan, /\[\[543isd-wooden-stake\|Wooden Stake\]\]/);
  assert.match(plan, /Sylwania/);
  assert.match(plan, /von Carstein/);
  assert.match(plan, /łowcami czarownic/);
  assert.match(backlog, /Link-mining Warhammer Fantasy/);
  assert.match(backlog, /543isd-wooden-stake/);
  assert.match(backlog, /Sylwania \/ Sylvania/);
  assert.match(backlog, /von Carsteinowie/);
  assert.match(backlog, /łowcy czarownic Imperium/);
  for (const slug of ['sylwania', 'sylvania', 'von-carstein', 'vampire-counts', 'lowcy-czarownic', 'witch-hunters']) {
    assert.equal(strony.find((s) => s.slug === slug)?.typ, undefined, `przedwczesne hasło: ${slug}`);
  }
});
