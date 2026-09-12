import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mapa = JSON.parse(fs.readFileSync('maps/ravnica/map.json', 'utf8'));
const snapshot = JSON.parse(fs.readFileSync('scryfall/516rna-tenth-district-veteran.json', 'utf8'));
const karta = fs.readFileSync('content/cards/516rna-tenth-district-veteran.md', 'utf8');
const wpis = fs.readFileSync('collection/entries/516rna-tenth-district-veteran.md', 'utf8');
const withstand = fs.readFileSync('content/cards/137gpt-withstand.md', 'utf8');
const boros = fs.readFileSync('content/lore/boros-legion.md', 'utf8');
const dziesiatka = fs.readFileSync('content/lore/dziesiaty-dystrykt.md', 'utf8');
const targ = fs.readFileSync('content/lore/tin-street-market.md', 'utf8');
const plan = fs.readFileSync('content/planes/ravnica.md', 'utf8');
const changelog = fs.readFileSync('content/co-nowego.md', 'utf8');

const pin = mapa.pinezki.find((p) => p.karta === '516rna-tenth-district-veteran');
const rynek = mapa.kotwice.find((k) => k.nazwa === 'Tin Street Market');

const fabula = 'W sercu Dziesiątego Dystryktu dojrzała wojowniczka Legionu Boros staje na zrujnowanej barykadzie, blokując drogę intruzom na kluczowy plac targowy. Odłamki kamieni i zgniecione jesienne liście pokrywają bruk wokół niej, będąc świadectwem zaciętych walk o każdą ulicę i aleję Ravniki. Wyszczerbiony miecz weteranki wyznacza kierunek kolejnego natarcia, a jej opancerzona dłoń mocno chwyta za ramię młodszego rekruta, dźwigając go z powrotem do szyku bojowego. Pamięć o złożonej przysiędze nakazuje jej trwać na stanowisku, broniąc architektonicznego dziedzictwa tego wielkiego miasta przed całkowitym upadkiem.';

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

test('516RNA: Fabuła właściciela pozostaje zachowana verbatim', () => {
  const body = wpis.match(/^---\n[\s\S]*?\n---\n\n([\s\S]*?)\n?$/)?.[1];
  assert.equal(body, fabula);
  assert.match(wpis, /^imgId: 516RNA$/m);
  assert.match(wpis, /^nazwa: Tenth District Veteran$/m);
  assert.match(wpis, /^wydanie: RNA$/m);
  assert.match(wpis, /^plan: Ravnica$/m);
});

test('516RNA: imgId właściciela pozostaje niezależny od numeru RNA #26', () => {
  assert.match(karta, /^imgId: 516RNA$/m);
  assert.equal(snapshot.name, 'Tenth District Veteran');
  assert.equal(snapshot.set, 'rna');
  assert.equal(snapshot.collector_number, '26');
  assert.equal(snapshot.mana_cost, '{2}{W}');
  assert.equal(snapshot.type_line, 'Creature — Human Soldier');
  assert.equal(snapshot.rarity, 'common');
  assert.equal(snapshot.power, '2');
  assert.equal(snapshot.toughness, '3');
  assert.equal(snapshot.artist, 'Volkan Baǵa');
  assert.match(snapshot.oracle_text, /^Vigilance/i);
  assert.match(snapshot.oracle_text, /untap another target creature you control/i);
  assert.equal(snapshot.flavor_text, '"I keep reminding myself we do this because others can\'t, because we love this city. If we don\'t save it, no one will."');
  assert.match(snapshot.notka_numery, /imgId właściciela = 516RNA/i);
  assert.match(snapshot.notka_numery, /collector_number Scryfall = 26/i);
});

test('516RNA: Karta Katalogowa zachowuje weterankę, rekruta i mechanikę gotowości', () => {
  assert.deepEqual(
    [...karta.matchAll(/^## (.+)$/gm)].map((m) => m[1]),
    sekcje,
  );
  assert.ok(karta.indexOf('## Kronika Lore') < karta.indexOf('## Mechanika jako Opowieść'));
  assert.match(karta, /\[\[dziesiaty-dystrykt\|\*\*Dziesiątego Dystryktu\*\*\]\]/);
  assert.match(karta, /\[\[boros-legion\|\*\*Legionu Boros\*\*\]\]/);
  assert.match(karta, /\[\[tin-street-market\|\*\*Tin Street Market\*\*\]\]/);
  assert.match(karta, /\*\*dojrzała wojowniczka\*\*/);
  assert.match(karta, /Weteranka Dziesiątego\s+Dystryktu/);
  assert.match(karta, /opancerzone palce zaciskają się na ramieniu młodszego rekruta/);
  assert.match(karta, /\*\*„Weteranka Dziesiątego\s+Dystryktu”\*\*/);
  assert.match(karta, /\+?Vigilance/i);
  assert.match(karta, /untap another target creature/i);
  assert.match(karta, /podnosi innego żołnierza do gotowości/i);
});

test('516RNA: barykada przy placu targowym dostaje regionalną kotwicę Tin Street Market', () => {
  assert.ok(pin, 'brak pinezki Tenth District Veteran');
  assert.ok(rynek, 'brak kotwicy Tin Street Market');
  assert.equal(pin.pewnosc, 'region');
  assert.equal(pin.x, 0.3406);
  assert.equal(pin.y, 0.4318);
  assert.equal(pin.x, rynek.x);
  assert.equal(pin.y, rynek.y);
  assert.match(pin.uzasadnienie, /kluczowy plac targowy/i);
  assert.match(pin.uzasadnienie, /Tin Street Market/i);
  assert.match(pin.uzasadnienie, /nie dokładną barykadę/i);
  assert.match(karta, /Pinezka ma pewność `region`/);
  assert.match(karta, /nie udaje więc pojedynczego stosu gruzu/i);
  assert.match(plan, /Tenth District Veteran[\s\S]*?pewność `region`/);
});

test('516RNA: Ravnicański link-mining przekracza próg dwóch kart', () => {
  for (const [slug, tresc, klasa] of [
    ['boros-legion', boros, 'spolecznosc'],
    ['dziesiaty-dystrykt', dziesiatka, 'geografia'],
    ['tin-street-market', targ, 'geografia'],
  ]) {
    assert.match(tresc, /^typ: haslo$/m, `${slug}: brak frontmatter hasła`);
    assert.match(tresc, new RegExp(`^slug: ${slug}$`, 'm'), `${slug}: zły slug`);
    assert.match(tresc, new RegExp(`^klasa: ${klasa}$`, 'm'), `${slug}: zła klasa`);
    assert.doesNotMatch(tresc, /^pinezka:/m, `${slug}: hasło nie może mieć pinezki`);
  }
  assert.match(boros, /#\/mapa\/ravnica\?x=0\.5464&y=0\.3356/);
  assert.match(dziesiatka, /#\/mapa\/ravnica\?x=0\.485&y=0\.5616/);
  assert.match(targ, /#\/mapa\/ravnica\?x=0\.3406&y=0\.4318/);
  for (const slug of ['boros-legion', 'dziesiaty-dystrykt', 'tin-street-market']) {
    assert.match(karta, new RegExp(`\\[\\[${slug}\\|`), `${slug}: brak linku w 516RNA`);
    assert.match(withstand, new RegExp(`\\[\\[${slug}\\|`), `${slug}: brak linku w 137GPT`);
  }
  assert.match(plan, /\[\[boros-legion\|Legion(?:em|u)? Boros\]\]/);
  assert.match(plan, /\[\[dziesiaty-dystrykt\|\*\*Dziesiąty Dystrykt\*\*\]\]/);
  assert.match(plan, /\[\[tin-street-market\|\*\*Tin Street\s+Market\*\*\]\]|\[\[tin-street-market\|Tin Street Market\]\]/);
  assert.match(changelog, /Nowa karta: Tenth District Veteran \(Ravnica\)/);
});
