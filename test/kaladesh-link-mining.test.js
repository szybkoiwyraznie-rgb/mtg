import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wczytajStrony } from '../tools/content-loader.mjs';
import { parseWikilinks } from '../src/codex/links.js';

const mapa = JSON.parse(fs.readFileSync('maps/kaladesh/map.json', 'utf8'));
const strony = wczytajStrony().filter((s) => !s.problem);
const poSlugu = Object.fromEntries(strony.map((s) => [s.slug, s]));
const czyta = (path) => fs.readFileSync(path, 'utf8');
const linkuje = (slug, cel) => parseWikilinks(poSlugu[slug].body).some((l) => l.slug === cel);
const kartyLinkujace = (cel) => strony
  .filter((s) => s.typ === 'karta' && parseWikilinks(s.body).some((l) => l.slug === cel))
  .map((s) => s.slug)
  .sort();
const kotwica = (nazwa) => mapa.kotwice.find((k) => k.nazwa === nazwa);
const pinezka = (slug) => mapa.pinezki.find((p) => p.karta === slug);
const closeTo = (value, expected, tolerance = 0.0002) => Math.abs(value - expected) <= tolerance;

const ghirapur = czyta('content/lore/ghirapur.md');
const konsulat = czyta('content/lore/konsulat-kaladeshu.md');
const gearsmith = czyta('content/cards/610m19-gearsmith-prodigy.md');
const gearcrafter = czyta('content/cards/596ori-ghirapur-gearcrafter.md');
const plan = czyta('content/planes/kaladesh.md');
const research = czyta('maps/kaladesh/zrodlo-research.md');

test('Kaladesh: Ghirapur i Konsulat powstają z progu dwóch kart, nie z samego planu', () => {
  assert.equal(poSlugu.ghirapur.typ, 'haslo');
  assert.equal(poSlugu.ghirapur.klasa, 'geografia');
  assert.equal(poSlugu.ghirapur.plan, 'kaladesh');
  assert.equal(poSlugu['konsulat-kaladeshu'].typ, 'haslo');
  assert.equal(poSlugu['konsulat-kaladeshu'].klasa, 'spolecznosc');
  assert.equal(poSlugu['konsulat-kaladeshu'].plan, 'kaladesh');

  assert.deepEqual(kartyLinkujace('ghirapur'), [
    '596ori-ghirapur-gearcrafter',
    '610m19-gearsmith-prodigy',
  ]);
  assert.deepEqual(kartyLinkujace('konsulat-kaladeshu'), [
    '596ori-ghirapur-gearcrafter',
    '610m19-gearsmith-prodigy',
  ]);
});

test('Kaladesh: wikilinki są w obu kartach i na stronie planu', () => {
  for (const slug of ['596ori-ghirapur-gearcrafter', '610m19-gearsmith-prodigy']) {
    assert.ok(linkuje(slug, 'ghirapur'), `${slug}: brak linku do Ghirapuru`);
    assert.ok(linkuje(slug, 'konsulat-kaladeshu'), `${slug}: brak linku do Konsulatu`);
  }
  assert.ok(linkuje('kaladesh', 'ghirapur'), 'plan Kaladesh: brak linku do Ghirapuru');
  assert.ok(linkuje('kaladesh', 'konsulat-kaladeshu'), 'plan Kaladesh: brak linku do Konsulatu');
  assert.ok(linkuje('ghirapur', 'konsulat-kaladeshu'), 'hasło Ghirapur: brak linku do Konsulatu');
  assert.ok(linkuje('konsulat-kaladeshu', 'ghirapur'), 'hasło Konsulat: brak linku do Ghirapuru');

  assert.match(gearsmith, /\[\[ghirapur\|Ghirapurze\]\]/);
  assert.match(gearsmith, /\[\[konsulat-kaladeshu\|mistrzami Konsulatu\]\]/);
  assert.match(gearcrafter, /\[\[ghirapur\|Ghirapur\]\]/);
  assert.match(gearcrafter, /\[\[konsulat-kaladeshu\|Konsulat\]\]/);
  assert.match(plan, /\[\[ghirapur\|Ghirapur, Miasto Indygo\]\]/);
  assert.match(plan, /\[\[konsulat-kaladeshu\|Konsulatu\]\]/);
});

test('Kaladesh: hasła nie dostają pinezek frontmatterowych, tylko deep-linki mapy', () => {
  for (const [slug, text, x, y] of [
    ['ghirapur', ghirapur, '0.65625', '0.6182'],
    ['konsulat-kaladeshu', konsulat, '0.6569', '0.6129'],
  ]) {
    assert.doesNotMatch(text, /^pinezka:/m, `${slug}: hasło nie może mieć frontmatterowej pinezki`);
    assert.ok(!mapa.pinezki.some((p) => p.karta === slug), `${slug}: hasło nie może dostać wpisu w pinezkach kart`);
    assert.match(text, new RegExp(`#/mapa/kaladesh\\?x=${x.replace('.', '\\.')}&y=${y.replace('.', '\\.')}`));
  }
});

test('Kaladesh: jednoprzebiegowe dzielnice kart są kotwicami mapy, nie osobnymi hasłami', () => {
  assert.ok(!fs.existsSync('content/lore/greenwheel.md'), 'Greenwheel ma jedną kartę — nie materializujemy osobnego hasła');
  assert.ok(!fs.existsSync('content/lore/embraal.md'), 'Embraal ma jedną kartę — nie materializujemy osobnego hasła');
  assert.equal(poSlugu.greenwheel, undefined);
  assert.equal(poSlugu.embraal, undefined);
  assert.equal(kotwica('Greenwheel')?.typ, 'dzielnica');
  assert.equal(kotwica('Embraal')?.typ, 'dzielnica');
});

test('Kaladesh L2: nowe kotwice Ghirapuru zachowują ślad ADR 0047 i brak fałszywej precyzji', () => {
  for (const nazwa of [
    'Greenwheel',
    'Greenwheel Domes',
    'The Zoo',
    'Embraal',
    'Aetherflux Reservoir',
    'Aether Hub',
    'Eleven Bridges',
    'Dukhara Canal',
    'Aradara Station',
    'Bastion',
    'Akhara',
    'Bomat',
    'Freejam',
    'Kujar',
    'Weldfast',
    'The Cowl',
    'Foundry of the Consuls',
    'Bunarat',
    "Shaila's Claim",
    'Ovalchase',
    'First Bridge',
    'Ninth Bridge',
  ]) {
    const meta = kotwica(nazwa);
    assert.ok(meta, `brak kotwicy map.json: ${nazwa}`);
    assert.match(meta.pozycja_zrodlo, /wybór rekonstrukcji \(ADR 0047\)/, `${nazwa}: ma opisywać projekcję L2, nie adres kanoniczny`);
  }
  assert.match(kotwica('Iglica Eteru')?.pozycja_zrodlo ?? '', /ADR 0047/);
  assert.match(mapa.otwarte_na_kolejne_przejscia.at(-1), /PĘTLA KALADESH 2026-09-12/);
});

test('Kaladesh L2: kotwice dzielnic kart są spójne z pinezkami regionów', () => {
  assert.ok(closeTo(kotwica('Greenwheel Domes').x, pinezka('610m19-gearsmith-prodigy').x));
  assert.ok(closeTo(kotwica('Greenwheel Domes').y, pinezka('610m19-gearsmith-prodigy').y));
  assert.ok(closeTo(kotwica('Embraal').x, pinezka('596ori-ghirapur-gearcrafter').x));
  assert.ok(closeTo(kotwica('Embraal').y, pinezka('596ori-ghirapur-gearcrafter').y));
  assert.equal(pinezka('610m19-gearsmith-prodigy').pewnosc, 'region');
  assert.equal(pinezka('596ori-ghirapur-gearcrafter').pewnosc, 'region');
  assert.match(pinezka('610m19-gearsmith-prodigy').uzasadnienie, /kanon nie nazywa konkretnego tarasu/);
  assert.match(pinezka('596ori-ghirapur-gearcrafter').uzasadnienie, /L2: ~925,480/);
});

test('Kaladesh: karty i nowe hasła używają działającego URL-a Planeswalker\'s Guide', () => {
  for (const text of [gearcrafter, ghirapur, konsulat, plan]) {
    assert.doesNotMatch(text, /magic\.wizards\.com\/en\/news\/feature\/planeswalkers-guide-kaladesh-2016-11-02/);
    assert.match(text, /magic\.wizards\.com\/en\/news\/magic-story\/planeswalkers-guide-kaladesh-2016-11-02/);
  }
});


test('Kaladesh: research mapy dogoniony po ADR 0047 i pętli L2', () => {
  assert.match(research, /Korekta PR-30 \/ ADR 0047/);
  assert.match(research, /Kaladesh ma \*\*dwie osobne mapy\*\*/);
  assert.match(research, /Pętla 2026-09-12/);
  assert.match(research, /nie precyzyjne adresy/);
  assert.match(research, /Greenwheel, Greenwheel Domes, The Zoo, Embraal/);
});
