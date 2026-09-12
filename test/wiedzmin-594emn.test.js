import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mapa = JSON.parse(fs.readFileSync('maps/wiedzmin/map.json', 'utf8'));
const snapshot = JSON.parse(fs.readFileSync('scryfall/594emn-ironclad-slayer.json', 'utf8'));
const karta = fs.readFileSync('content/cards/594emn-ironclad-slayer.md', 'utf8');
const wpis = fs.readFileSync('collection/entries/594emn-ironclad-slayer.md', 'utf8');
const velenHaslo = fs.readFileSync('content/lore/velen.md', 'utf8');
const plan = fs.readFileSync('content/planes/wiedzmin.md', 'utf8');
const backlog = fs.readFileSync('docs/backlog.md', 'utf8');
const changelog = fs.readFileSync('content/co-nowego.md', 'utf8');

const pin = mapa.pinezki.find((p) => p.karta === '594emn-ironclad-slayer');
const velen = mapa.kotwice.find((k) => k.nazwa === 'Velen');

const fabula = 'Na spowitych gęstą mgłą, zrytych pobojowiskach Ziemi Niczyjej w Velen wojna ogołociła krainę z wszelkich pozorów rycerskiego honoru. Ciężkozbrojny najemnik w poobijanym pancerzu płytowym brodzi w leśnym błocie, metodycznie przeszukując zgliszcza i porzucone po bitwie wozy taborowe. Pewnym ruchem opancerzonej dłoni weteran wyciąga z mazi doskonale zachowany stalowy miecz, zastępując nim swój wyszczerbiony w boju oręż. W bezwzględnych realiach wojennej zawieruchy na Kontynencie najskuteczniejszą bronią pozostaje zawsze ta, którą w porę uda się podnieść z pobojowiska.';

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

test('594EMN: Fabuła właściciela pozostaje zachowana verbatim', () => {
  const body = wpis.match(/^---\n[\s\S]*?\n---\n\n([\s\S]*?)\n?$/)?.[1];
  assert.equal(body, fabula);
  assert.match(wpis, /^imgId: 594EMN$/m);
  assert.match(wpis, /^nazwa: Ironclad Slayer$/m);
  assert.match(wpis, /^wydanie: EMN$/m);
  assert.match(wpis, /^plan: Wiedźmin$/m);
});

test('594EMN: imgId właściciela pozostaje niezależny od numeru EMN #31', () => {
  assert.match(karta, /^imgId: 594EMN$/m);
  assert.equal(snapshot.name, 'Ironclad Slayer');
  assert.equal(snapshot.set, 'emn');
  assert.equal(snapshot.set_name, 'Eldritch Moon');
  assert.equal(snapshot.collector_number, '31');
  assert.equal(snapshot.mana_cost, '{2}{W}');
  assert.equal(snapshot.type_line, 'Creature — Human Warrior');
  assert.equal(snapshot.rarity, 'common');
  assert.equal(snapshot.power, '3');
  assert.equal(snapshot.toughness, '2');
  assert.deepEqual(snapshot.keywords, []);
  assert.equal(snapshot.artist, 'Ryan Pancoast');
  assert.match(snapshot.oracle_text, /return target Aura or Equipment card/i);
  assert.match(snapshot.oracle_text, /from your graveyard to your hand/i);
  assert.equal(snapshot.flavor_text, 'The best weapon is the one at hand.');
  assert.match(snapshot.notka_numery, /imgId właściciela = 594EMN/i);
  assert.match(snapshot.notka_numery, /collector_number Scryfall = 31/i);
});

test('594EMN: Karta Katalogowa jest lore-first i zachowuje pobojowisko Velen', () => {
  assert.deepEqual(
    [...karta.matchAll(/^## (.+)$/gm)].map((m) => m[1]),
    sekcje,
  );
  assert.ok(karta.indexOf('## Kronika Lore') < karta.indexOf('## Mechanika jako Opowieść'));
  assert.match(karta, /\[\[velen\|Ziemi Niczyjej w Velen\]\]/);
  assert.match(karta, /Ciężkozbrojny najemnik/);
  assert.match(karta, /pancerz płytowy/);
  assert.match(karta, /wozie taborowym|wozy taborowe/);
  assert.match(karta, /stalowy miecz zachowany niemal bez skazy/);
  assert.match(karta, /wyszczerbiony oręż/);
  assert.match(karta, /\*\*„Zakuty w żelazo pogromca”\*\*/);
  assert.match(karta, /Najlepszą bronią jest ta, którą masz pod ręką/);
});

test('594EMN: odzyskanie Equipmentu prowadzi scenę, Aura nie wymusza nowego kanonu', () => {
  const narracja = karta.slice(0, karta.indexOf('## Mechanika jako Opowieść'));
  assert.doesNotMatch(narracja, /Innistrad/i);
  assert.match(karta, /Najbardziej dosłowną warstwą jest \*\*Equipment\*\*/);
  assert.match(karta, /stalowy miecz wyciągnięty\s+z błota/i);
  assert.match(karta, /Grób nie musi\s+być wykopanym dołem/i);
  assert.match(karta, /\*\*Aura\*\* pozostaje drugą dopuszczalną możliwością zapisu/);
  assert.match(karta, /nie wymusza nowego obrzędu/);
  assert.match(karta, /Creature — Human Warrior, 3\/2/);
});

test('594EMN: pobojowisko dostaje regionalną pinezkę Velen bez fałszywego pola', () => {
  assert.ok(pin, 'brak pinezki Ironclad Slayer');
  assert.ok(velen, 'brak kotwicy Velen');
  assert.equal(velen.typ, 'region');
  assert.deepEqual(velen.px_t1, [2095, 2024]);
  assert.equal(pin.pewnosc, 'region');
  assert.equal(pin.x, 0.4113);
  assert.equal(pin.y, 0.2807);
  assert.equal(pin.x, velen.x);
  assert.equal(pin.y, velen.y);
  assert.match(pin.uzasadnienie, /pobojowiska Ziemi Niczyjej w Velen/i);
  assert.match(pin.uzasadnienie, /nie podaje nazwy wsi, traktu ani konkretnego pola/i);
  assert.match(pin.uzasadnienie, /nie udaje dokładnego taboru ani koleiny w błocie/i);
  assert.match(karta, /Pinezka ma pewność `region`/);
  assert.match(karta, /nie\s+rozrysowuje pól bitwy ani miejsc po zgliszczach/i);
  assert.match(plan, /Ironclad Slayer[\s\S]*?pewność `region`/);
});

test('594EMN: Velen zostaje pogłębiony, ale nowe encje czekają na próg', () => {
  assert.match(velenHaslo, /\[\[594emn-ironclad-slayer\|Ironclad Slayer\]\]/);
  assert.match(velenHaslo, /największą bitwą III Wojny\s+Północnej/i);
  assert.match(velenHaslo, /porzucony sprzęt/);
  assert.match(plan, /\[\[594emn-ironclad-slayer\|\*\*Ironclad Slayer\*\*\]\]/);
  assert.match(backlog, /pobojowiska \/ Bitwa na błoniach Velen/);
  assert.match(backlog, /594emn-ironclad-slayer/);
  assert.ok(!mapa.pinezki.some((p) => p.karta === 'bitwa-na-bloniach-velen'));
  assert.ok(!fs.existsSync('content/lore/bitwa-na-bloniach-velen.md'));
  assert.match(changelog, /Nowa karta: Ironclad Slayer \(Wiedźmin\)/);
});
