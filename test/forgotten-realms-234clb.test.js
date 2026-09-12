import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wczytajStrony, widokScryfallDlaKarty } from '../tools/content-loader.mjs';
import { parseWikilinks } from '../src/codex/links.js';

const mapa = JSON.parse(fs.readFileSync('maps/forgotten-realms/map.json', 'utf8'));
const snapshot = JSON.parse(fs.readFileSync('scryfall/234clb-gray-slaad.json', 'utf8'));
const karta = fs.readFileSync('content/cards/234clb-gray-slaad.md', 'utf8');
const wpis = fs.readFileSync('collection/entries/234clb-gray-slaad.md', 'utf8');
const plan = fs.readFileSync('content/planes/forgotten-realms.md', 'utf8');
const wybrzezeHaslo = fs.readFileSync('content/lore/wybrzeze-mieczy.md', 'utf8');
const backlog = fs.readFileSync('docs/backlog.md', 'utf8');
const strony = wczytajStrony().filter((s) => !s.problem);

const pin = mapa.pinezki.find((p) => p.karta === '234clb-gray-slaad');
const wybrzeze = mapa.kotwice.find((k) => k.nazwa === 'Wybrzeże Mieczy');
const widok = widokScryfallDlaKarty(snapshot, 'Gray Slaad');
const fabula = 'A gray slaad stands in a gloomy, foggy wetland on the edge of a cursed forest, among dead trees and remnants of a stone road. It is a massive humanoid-amphibian chaos creature with gray wet skin, gaunt muscular silhouette, broad frog-like jaws full of sharp teeth, blank shining eyes, pulsing chitinous nodules on chest/arms, a dark spot seeping from its chest, and gray mist around its clawed hands. On the Sword Coast, slaadi from the Outer Planes appear where spells cross; this gray slaad does not attack anyone specific, because everything near it begins to sicken.';
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
const kartyLinkujace = (cel) => strony
  .filter((s) => s.typ === 'karta' && parseWikilinks(s.body).some((l) => l.slug === cel))
  .map((s) => s.slug)
  .sort();

test('234CLB: Fabuła właściciela pozostaje zachowana verbatim', () => {
  const body = wpis.match(/^---\n[\s\S]*?\n---\n\n([\s\S]*?)\n?$/)?.[1];
  assert.equal(body, fabula);
  assert.match(wpis, /^imgId: 234CLB$/m);
  assert.match(wpis, /^nazwa: Gray Slaad$/m);
  assert.match(wpis, /^wydanie: CLB$/m);
  assert.match(wpis, /^plan: Forgotten Realms$/m);
});

test('234CLB: imgId właściciela nie jest numerem CLB #129 ani #234', () => {
  assert.match(karta, /^imgId: 234CLB$/m);
  assert.match(karta, /^kolory: \[B\]$/m);
  assert.equal(snapshot.name, 'Gray Slaad // Entropic Decay');
  assert.equal(snapshot.layout, 'adventure');
  assert.equal(snapshot.set, 'clb');
  assert.equal(snapshot.set_name, "Commander Legends: Battle for Baldur's Gate");
  assert.equal(snapshot.collector_number, '129');
  assert.deepEqual(snapshot.multiverse_ids, [563012]);
  assert.equal(snapshot.rarity, 'common');
  assert.deepEqual(snapshot.colors, ['B']);
  assert.deepEqual(snapshot.color_identity, ['B']);
  assert.deepEqual(snapshot.keywords, ['Mill']);
  assert.equal(snapshot.card_faces[0].name, 'Gray Slaad');
  assert.equal(snapshot.card_faces[0].mana_cost, '{2}{B}');
  assert.equal(snapshot.card_faces[0].type_line, 'Creature — Frog Horror');
  assert.equal(snapshot.card_faces[0].power, '4');
  assert.equal(snapshot.card_faces[0].toughness, '1');
  assert.equal(snapshot.card_faces[1].name, 'Entropic Decay');
  assert.equal(snapshot.card_faces[1].mana_cost, '{1}{B}');
  assert.equal(snapshot.card_faces[1].type_line, 'Sorcery — Adventure');
  assert.match(snapshot.card_faces[1].oracle_text, /Mill four cards/);
  assert.equal(widok.name, 'Gray Slaad');
  assert.equal(widok.type_line, 'Creature — Frog Horror');
  assert.deepEqual(widok.keywords, []);
  assert.match(snapshot.related_uris.gatherer, /multiverseid=563012/);
  assert.match(snapshot.notka_numery, /imgId właściciela = 234CLB/i);
  assert.match(snapshot.notka_numery, /collector_number Scryfall\/Gatherer = 129/i);
  assert.match(snapshot.notka_numery, /clb\/234 wskazuje Halsin/i);
});

test('234CLB: Karta Katalogowa jest lore-first i zachowuje mokradło skażone chaosową chorobą', () => {
  assert.deepEqual(
    [...karta.matchAll(/^## (.+)$/gm)].map((m) => m[1]),
    sekcje,
  );
  assert.ok(karta.indexOf('## Kronika Lore') < karta.indexOf('## Mechanika jako Opowieść'));
  assert.match(karta, /\[\[wybrzeze-mieczy\|Wybrzeżu Mieczy\]\]/);
  assert.match(karta, /mokrad/);
  assert.match(karta, /przeklętym lesie|przeklętego lasu/i);
  assert.match(karta, /resztkach starej kamiennej drogi/i);
  assert.match(karta, /szeroką żabią szczęką pełną ostrych zębów/i);
  assert.match(karta, /chitynowe guzki/i);
  assert.match(karta, /Z ciemnej plamy na piersi sączy się/i);
  assert.match(karta, /Slaadi są dziećmi Limbo/i);
  assert.match(karta, /Nie wybiera jednej ofiary|nie musi nikogo dotknąć/i);
  assert.match(karta, /choroba wszystkiego|wszystko[\s\S]{0,120}chor/i);
});

test('234CLB: mechanika Adventure łączy rozkład z progiem grobu', () => {
  const narracja = karta.slice(0, karta.indexOf('## Mechanika jako Opowieść'));
  assert.doesNotMatch(narracja, /Scryfall|Oracle|collector_number|multiverse|Gatherer|CLB #129|Halsin/i);
  assert.match(karta, /Adventure/);
  assert.match(karta, /Gray Slaad.*\{2\}\{B\}.*Creature — Frog Horror/s);
  assert.match(karta, /4\/1/);
  assert.match(karta, /four or more creature cards in your\s+graveyard/);
  assert.match(karta, /menace/);
  assert.match(karta, /deathtouch/);
  assert.match(karta, /Entropic Decay/);
  assert.match(karta, /\{1\}\{B\}/);
  assert.match(karta, /Mill four cards/);
  assert.match(karta, /entropia/);
  assert.match(karta, /cztery wierzchnie warstwy pamięci spadają do grobu/);
});

test('234CLB: mokradło dostaje tylko regionalną pinezkę Wybrzeża Mieczy', () => {
  assert.ok(pin, 'brak pinezki Gray Slaad');
  assert.ok(wybrzeze, 'brak kotwicy Wybrzeże Mieczy');
  assert.equal(wybrzeze.typ, 'region');
  assert.equal(pin.pewnosc, 'region');
  assert.ok(Math.abs(pin.x - wybrzeze.x) < 0.0001);
  assert.ok(Math.abs(pin.y - wybrzeze.y) < 0.0001);
  assert.match(pin.uzasadnienie, /ponurym, mglistym mokradle/i);
  assert.match(pin.uzasadnienie, /nie nazywa miasta, ruin, konkretnego mokradła ani konkretnego lasu/i);
  assert.match(karta, /Pinezka ma pewność `region`/);
  assert.match(karta, /nie wymienia miasta, ruin, wsi, nazwanego mokradła ani nazwanego lasu/i);
  assert.ok(!mapa.pinezki.some((p) => p.karta === 'wybrzeze-mieczy'), 'hasło Wybrzeże Mieczy nie może mieć pinezki karty');
});

test('234CLB: Wybrzeże Mieczy przekracza próg dwóch kart i wraca jako hasło bez pinezki', () => {
  assert.deepEqual(kartyLinkujace('wybrzeze-mieczy'), [
    '234clb-gray-slaad',
    '3clb-nefarious-imp',
  ]);
  assert.match(wybrzezeHaslo, /^slug: wybrzeze-mieczy$/m);
  assert.match(wybrzezeHaslo, /\[\[3clb-nefarious-imp\|Nefarious Imp\]\]/);
  assert.match(wybrzezeHaslo, /\[\[234clb-gray-slaad\|Gray Slaad\]\]/);
  assert.match(plan, /\[\[234clb-gray-slaad\|Gray Slaad\]\]/);
  assert.match(plan, /\[\[wybrzeze-mieczy\|Wybrzeża Mieczy\]\]/);
  assert.match(backlog, /Wybrzeże Mieczy — ponownie utworzone 2026-09-12 po `234CLB`/);
  assert.match(backlog, /slaadi, chaos phage, Limbo/i);
});
