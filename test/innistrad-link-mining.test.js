import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wczytajStrony } from '../tools/content-loader.mjs';
import { parseWikilinks } from '../src/codex/links.js';

const mapa = JSON.parse(fs.readFileSync('maps/innistrad/map.json', 'utf8'));
const strony = wczytajStrony().filter((s) => !s.problem);
const poSlugu = Object.fromEntries(strony.map((s) => [s.slug, s]));
const czyta = (slug) => fs.readFileSync(slug, 'utf8');
const linkuje = (slug, cel) => parseWikilinks(poSlugu[slug].body).some((l) => l.slug === cel);
const kartyLinkujace = (cel) => strony
  .filter((s) => s.typ === 'karta' && parseWikilinks(s.body).some((l) => l.slug === cel))
  .map((s) => s.slug)
  .sort();

const hasloGavony = czyta('content/lore/gavony.md');
const hasloKessig = czyta('content/lore/kessig.md');
const hasloAvacyn = czyta('content/lore/avacyn.md');
const hasloDevils = czyta('content/lore/devils-breach.md');
const hasloAshmouth = czyta('content/lore/ashmouth.md');
const hasloHelvault = czyta('content/lore/helvault.md');
const plan = czyta('content/planes/innistrad.md');
const spectral = czyta('content/cards/181avr-spectral-prison.md');
const dire = czyta('content/cards/118mid-dire-strain-brawler.md');
const outcasts = czyta('content/cards/171isd-grizzled-outcasts.md');
const valiant = czyta('content/cards/544avr-thraben-valiant.md');
const scholar = czyta('content/cards/309isd-civilized-scholar.md');
const forge = czyta('content/cards/393dka-forge-devil.md');
const crows = czyta('content/cards/42isd-murder-of-crows.md');

test('Innistrad: Gavony i Kessig powstały dopiero po progu dwóch kart', () => {
  assert.equal(poSlugu.gavony.typ, 'haslo');
  assert.equal(poSlugu.gavony.klasa, 'geografia');
  assert.equal(poSlugu.gavony.plan, 'innistrad');
  assert.equal(poSlugu.kessig.typ, 'haslo');
  assert.equal(poSlugu.kessig.klasa, 'geografia');
  assert.equal(poSlugu.kessig.plan, 'innistrad');

  assert.deepEqual(kartyLinkujace('gavony'), [
    '118mid-dire-strain-brawler',
    '181avr-spectral-prison',
    '393dka-forge-devil',
    '544avr-thraben-valiant',
  ]);
  assert.deepEqual(kartyLinkujace('kessig'), [
    '171isd-grizzled-outcasts',
    '181avr-spectral-prison',
    '309isd-civilized-scholar',
    '393dka-forge-devil',
    '544avr-thraben-valiant',
  ]);
});

test('Innistrad: Avacyn i Devil\'s Breach też przekraczają próg kart', () => {
  assert.equal(poSlugu.avacyn.typ, 'haslo');
  assert.equal(poSlugu.avacyn.klasa, 'postac');
  assert.equal(poSlugu.avacyn.plan, 'innistrad');
  assert.equal(poSlugu['devils-breach'].typ, 'haslo');
  assert.equal(poSlugu['devils-breach'].klasa, 'geografia');
  assert.equal(poSlugu['devils-breach'].plan, 'innistrad');

  assert.deepEqual(kartyLinkujace('avacyn'), [
    '171isd-grizzled-outcasts',
    '181avr-spectral-prison',
    '309isd-civilized-scholar',
    '393dka-forge-devil',
    '42isd-murder-of-crows',
    '544avr-thraben-valiant',
  ]);
  assert.deepEqual(kartyLinkujace('devils-breach'), [
    '118mid-dire-strain-brawler',
    '171isd-grizzled-outcasts',
    '393dka-forge-devil',
    '544avr-thraben-valiant',
  ]);
});

test('Innistrad: Ashmouth i Helvault przekraczają próg kart bez nowych pinezek', () => {
  assert.equal(poSlugu.ashmouth.typ, 'haslo');
  assert.equal(poSlugu.ashmouth.klasa, 'geografia');
  assert.equal(poSlugu.ashmouth.plan, 'innistrad');
  assert.equal(poSlugu.helvault.typ, 'haslo');
  assert.equal(poSlugu.helvault.klasa, 'artefakt');
  assert.equal(poSlugu.helvault.plan, 'innistrad');

  assert.deepEqual(kartyLinkujace('ashmouth'), [
    '393dka-forge-devil',
    '544avr-thraben-valiant',
  ]);
  assert.deepEqual(kartyLinkujace('helvault'), [
    '393dka-forge-devil',
    '544avr-thraben-valiant',
  ]);
});

test('Innistrad: hasła regionalne/postaci/artefaktu nie mają własnych pinezek, tylko deep-linki mapy', () => {
  for (const [slug, tresc, x, y] of [
    ['gavony', hasloGavony, '0.59', '0.449'],
    ['kessig', hasloKessig, '0.41', '0.727'],
    ['avacyn', hasloAvacyn, '0.668', '0.317'],
    ['devils-breach', hasloDevils, '0.392', '0.945'],
    ['ashmouth', hasloAshmouth, '0.213', '0.253'],
    ['helvault', hasloHelvault, '0.668', '0.317'],
  ]) {
    assert.doesNotMatch(tresc, /^pinezka:/m, `${slug}: hasło nie może mieć frontmatterowej pinezki`);
    assert.ok(!mapa.pinezki.some((p) => p.karta === slug), `${slug}: hasło nie może dostać wpisu w pinezkach kart`);
    assert.match(tresc, new RegExp(`#/mapa/innistrad\\?x=${x.replace('.', '\\.')}&y=${y.replace('.', '\\.')}`));
  }
  assert.equal(mapa.kotwice.find((k) => k.nazwa === 'Gavony')?.typ, 'region');
  assert.equal(mapa.kotwice.find((k) => k.nazwa === 'Kessig')?.typ, 'region');
  assert.equal(mapa.kotwice.find((k) => k.nazwa === "Devils' Breach")?.typ, 'lokacja');
  assert.equal(mapa.kotwice.find((k) => k.nazwa === 'Ashmouth')?.typ, 'lokacja');
});

test('Innistrad: wikilinki do Gavony/Kessigu są w kartach i planie', () => {
  for (const slug of ['181avr-spectral-prison', '118mid-dire-strain-brawler', '544avr-thraben-valiant', '393dka-forge-devil']) {
    assert.ok(linkuje(slug, 'gavony'), `${slug}: brak linku do Gavony`);
  }
  for (const slug of ['171isd-grizzled-outcasts', '544avr-thraben-valiant', '309isd-civilized-scholar', '393dka-forge-devil', '181avr-spectral-prison']) {
    assert.ok(linkuje(slug, 'kessig'), `${slug}: brak linku do Kessigu`);
  }
  assert.ok(linkuje('innistrad', 'gavony'), 'plan Innistrad: brak linku do Gavony');
  assert.ok(linkuje('innistrad', 'kessig'), 'plan Innistrad: brak linku do Kessigu');

  assert.match(spectral, /\[\[gavony\|\*\*Gavony\*\*\]\]/);
  assert.match(dire, /\[\[gavony\|\*\*Gavony\*\*\]\]/);
  assert.match(outcasts, /\[\[kessig\|\*\*Kessig\*\*\]\]/);
  assert.match(valiant, /\[\[kessig\|\*\*Kessig\*\*\]\]/);
  assert.match(scholar, /\[\[kessig\|\*\*Kessigu\*\*\]\]/);
  assert.match(forge, /\[\[gavony\|Gavony\]\]/);
  assert.match(plan, /\[\[gavony\|\*\*Gavony\*\*\]\]/);
  assert.match(plan, /\[\[kessig\|\*\*Kessig\*\*\]\]/);
});

test('Innistrad: wikilinki do Avacyn i Devil\'s Breach są w kartach i planie', () => {
  for (const slug of ['181avr-spectral-prison', '171isd-grizzled-outcasts', '309isd-civilized-scholar', '393dka-forge-devil', '42isd-murder-of-crows', '544avr-thraben-valiant']) {
    assert.ok(linkuje(slug, 'avacyn'), `${slug}: brak linku do Avacyn`);
  }
  for (const slug of ['544avr-thraben-valiant', '393dka-forge-devil', '171isd-grizzled-outcasts', '118mid-dire-strain-brawler']) {
    assert.ok(linkuje(slug, 'devils-breach'), `${slug}: brak linku do Devil's Breach`);
  }
  assert.ok(linkuje('innistrad', 'avacyn'), 'plan Innistrad: brak linku do Avacyn');
  assert.ok(linkuje('innistrad', 'devils-breach'), 'plan Innistrad: brak linku do Devil\'s Breach');

  assert.match(crows, /\[\[avacyn\|Avacyn\]\]/);
  assert.match(outcasts, /\[\[avacyn\|\*\*Avacyn\*\*\]\]/);
  assert.match(spectral, /\[\[avacyn\|\*\*Avacyn\*\*\]\]/);
  assert.match(valiant, /\[\[devils-breach\|\*\*Devil's\s+Breach\*\*\]\]/);
  assert.match(forge, /\[\[devils-breach\|Devils' Breach\]\]/);
  assert.match(dire, /\[\[devils-breach\|Devils' Breach\]\]/);
  assert.match(plan, /\[\[avacyn\|\*\*Avacyn\*\*\]\]/);
  assert.match(plan, /\[\[devils-breach\|\*\*Devils' Breach\*\*\]\]/);
});

test('Innistrad: wikilinki do Ashmouth i Helvault są w kartach i planie', () => {
  for (const slug of ['544avr-thraben-valiant', '393dka-forge-devil']) {
    assert.ok(linkuje(slug, 'ashmouth'), `${slug}: brak linku do Ashmouth`);
    assert.ok(linkuje(slug, 'helvault'), `${slug}: brak linku do Helvaultu`);
  }
  assert.ok(linkuje('innistrad', 'ashmouth'), 'plan Innistrad: brak linku do Ashmouth');
  assert.ok(linkuje('innistrad', 'helvault'), 'plan Innistrad: brak linku do Helvaultu');
  assert.ok(linkuje('stensia', 'ashmouth'), 'hasło Stensia: brak linku do Ashmouth');
  assert.ok(linkuje('avacyn', 'helvault'), 'hasło Avacyn: brak linku do Helvaultu');
  assert.ok(linkuje('devils-breach', 'ashmouth'), 'hasło Devil\'s Breach: brak linku do Ashmouth');

  assert.match(valiant, /\[\[helvault\|Helvaultu\]\]/);
  assert.match(valiant, /\[\[ashmouth\|\*\*Ashmouth\*\*\]\]/);
  assert.match(forge, /\[\[helvault\|\*\*Helvaulcie\*\*\]\]/);
  assert.match(forge, /\[\[ashmouth\|\*\*Ashmouth\*\*\]\]/);
  assert.match(plan, /\[\[helvault\|\*\*Helvault\*\*\]\]/);
  assert.match(plan, /\[\[ashmouth\|\*\*Ashmouth\*\*\]\]/);
});

test('Innistrad: źródło Gavony korzysta z działającego URL-a 2011-09-28', () => {
  assert.doesNotMatch(spectral, /planeswalkers-guide-innistrad-gavony-and-humans-2011-09-07/);
  assert.doesNotMatch(dire, /planeswalkers-guide-innistrad-gavony-and-humans-2011-09-07/);
  assert.match(spectral, /planeswalkers-guide-innistrad-gavony-and-humans-2011-09-28/);
  assert.match(dire, /planeswalkers-guide-innistrad-gavony-and-humans-2011-09-28/);
});
