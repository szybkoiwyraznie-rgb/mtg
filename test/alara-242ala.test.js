import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mapa = JSON.parse(fs.readFileSync('maps/alara/map.json', 'utf8'));
const snapshot = JSON.parse(fs.readFileSync('scryfall/242ala-knight-of-the-skyward-eye.json', 'utf8'));
const karta = fs.readFileSync('content/cards/242ala-knight-of-the-skyward-eye.md', 'utf8');
const wpis = fs.readFileSync('collection/entries/242ala-knight-of-the-skyward-eye.md', 'utf8');
const alara = fs.readFileSync('content/planes/alara.md', 'utf8');
const illusory = fs.readFileSync('content/cards/305arb-illusory-demon.md', 'utf8');
const shieldmage = fs.readFileSync('content/cards/536arb-ethersworn-shieldmage.md', 'utf8');
const bant = fs.readFileSync('content/lore/bant.md', 'utf8');
const bolas = fs.readFileSync('content/lore/nicol-bolas.md', 'utf8');
const changelog = fs.readFileSync('content/co-nowego.md', 'utf8');

const pin = mapa.pinezki.find((p) => p.karta === '242ala-knight-of-the-skyward-eye');

const fabula = 'W jasnym idyllicznym lesie Bant na Alarze, gdzie przez smukłe drzewa o srebrzystej korze przesącza się złotawe światło poranka, jedzie konno rycerz zakonu Skyward Eye w lśniącej białozłotej zbroi z turkusowym płaszczem. Na napierśniku i tarczy wygrawerowane jest stylizowane, otwarte oko — symbol zakonu, który widzi więcej, niż Bant przyznaje. Wierzchowiec kroczy spokojnie po marmurowej ceremonialnej drodze obrzeżonej kwitnącymi krzewami, a za rycerzem, w głębi lasu, w cieniu drzew ledwo widoczny jest niepokojący zarys — cień czegoś większego niż powinno się tu kryć. Na Bant wszyscy rycerze ślubują strzec harmonii, ale rycerze Skyward Eye wiedzą, że harmonia kosztuje drogo — i że Nicol Bolas ma cierpliwość dłuższą niż którykolwiek klejnot bantyjski.';

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

test('242ALA: Fabuła właściciela pozostaje zachowana verbatim', () => {
  const body = wpis.match(/^---\n[\s\S]*?\n---\n\n([\s\S]*?)\n?$/)?.[1];
  assert.equal(body, fabula);
  assert.match(wpis, /^imgId: 242ALA$/m);
  assert.match(wpis, /^nazwa: Knight of the Skyward Eye$/m);
  assert.match(wpis, /^wydanie: ALA$/m);
  assert.match(wpis, /^plan: alara$/m);
});

test('242ALA: imgId właściciela pozostaje niezależny od numeru ALA #15', () => {
  assert.match(karta, /^imgId: 242ALA$/m);
  assert.equal(snapshot.name, 'Knight of the Skyward Eye');
  assert.equal(snapshot.set, 'ala');
  assert.equal(snapshot.set_name, 'Shards of Alara');
  assert.equal(snapshot.collector_number, '15');
  assert.equal(snapshot.mana_cost, '{1}{W}');
  assert.equal(snapshot.type_line, 'Creature — Human Knight');
  assert.equal(snapshot.rarity, 'common');
  assert.equal(snapshot.power, '2');
  assert.equal(snapshot.toughness, '2');
  assert.equal(snapshot.artist, 'Matt Stewart');
  assert.match(snapshot.oracle_text, /\{3\}\{G\}: This creature gets \+3\/\+3 until end of turn/i);
  assert.equal(snapshot.flavor_text, 'The Order of the Skyward Eye does the bidding of an evil force, unwittingly stirring fear and mistrust across Bant in accordance with his plans.');
  assert.match(snapshot.notka_numery, /imgId właściciela = 242ALA/i);
  assert.match(snapshot.notka_numery, /collector_number Scryfall = 15/i);
});

test('242ALA: Karta Katalogowa zachowuje rycerza, oko, cień i mechanikę wzrostu', () => {
  assert.deepEqual(
    [...karta.matchAll(/^## (.+)$/gm)].map((m) => m[1]),
    sekcje,
  );
  assert.ok(karta.indexOf('## Kronika Lore') < karta.indexOf('## Mechanika jako Opowieść'));
  assert.match(karta, /\[\[bant\|Bantu\]\]/);
  assert.match(karta, /\*\*rycerz zakonu Skyward Eye\*\*/);
  assert.match(karta, /Turkusowy płaszcz/);
  assert.match(karta, /znak otwartego oka/);
  assert.match(karta, /cień między drzewami/);
  assert.match(karta, /\[\[nicol-bolas\|Nicol Bolas\]\]/);
  assert.match(karta, /Najważniejsze słowo to \*\*unwittingly\*\*/);
  assert.match(karta, /\{3\}\{G\}[\s\S]*?\+3\/\+3[\s\S]*?tylko raz w każdej turze/i);
  assert.match(karta, /Zielony przypływ siły/);
});

test('242ALA: leśny Bant dostaje regionalną pinezkę bez fałszywej drogi', () => {
  assert.ok(pin, 'brak pinezki Knight of the Skyward Eye');
  assert.equal(pin.pewnosc, 'region');
  assert.equal(pin.x, 0.56);
  assert.equal(pin.y, 0.19);
  assert.match(pin.uzasadnienie, /jasny, idylliczny las Bantu/i);
  assert.match(pin.uzasadnienie, /Sun-Dappled Court/);
  assert.match(pin.uzasadnienie, /nie jest dokładna/i);
  assert.match(pin.uzasadnienie, /bez wymyślania nazwy drogi/i);
  assert.match(karta, /Pinezka ma pewność \*\*region\*\*/);
  assert.match(karta, /nie udaje więc\s+konkretnego łuku marmuru/i);
  assert.match(alara, /Knight of the Skyward Eye[\s\S]*?regionalną pinezkę[\s\S]*?bez udawania nazwy jednej drogi/);
});

test('242ALA: Alaryjski link-mining domyka Bant i Nicola Bolasa', () => {
  for (const [slug, tresc, klasa] of [
    ['bant', bant, 'geografia'],
    ['nicol-bolas', bolas, 'postac'],
  ]) {
    assert.match(tresc, /^typ: haslo$/m, `${slug}: brak frontmatter hasła`);
    assert.match(tresc, new RegExp(`^slug: ${slug}$`, 'm'), `${slug}: zły slug`);
    assert.match(tresc, new RegExp(`^klasa: ${klasa}$`, 'm'), `${slug}: zła klasa`);
    assert.doesNotMatch(tresc, /^pinezka:/m, `${slug}: hasło nie może mieć pinezki`);
  }
  assert.match(bant, /#\/mapa\/alara\?x=0\.45&y=0\.175/);
  assert.match(bolas, /#\/mapa\/alara\?x=0\.475&y=0\.475/);
  for (const tresc of [karta, illusory, shieldmage]) {
    assert.match(tresc, /\[\[bant\|/i, 'brak wikilinku do Bantu w karcie Alary');
  }
  for (const tresc of [karta, illusory, shieldmage]) {
    assert.match(tresc, /\[\[nicol-bolas\|/i, 'brak wikilinku do Nicola Bolasa w karcie Alary');
  }
  assert.match(alara, /\[\[bant\|Bant\]\]/i);
  assert.match(alara, /\[\[nicol-bolas\|Nicol Bolas\]\]/i);
  assert.match(changelog, /Nowa karta: Knight of the Skyward Eye \(Alara\)/);
});
