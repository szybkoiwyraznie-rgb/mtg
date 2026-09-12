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
const plan = czyta('content/planes/innistrad.md');
const spectral = czyta('content/cards/181avr-spectral-prison.md');
const dire = czyta('content/cards/118mid-dire-strain-brawler.md');
const outcasts = czyta('content/cards/171isd-grizzled-outcasts.md');
const valiant = czyta('content/cards/544avr-thraben-valiant.md');
const scholar = czyta('content/cards/309isd-civilized-scholar.md');
const forge = czyta('content/cards/393dka-forge-devil.md');

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

test('Innistrad: hasła regionów nie mają własnych pinezek, tylko deep-linki mapy', () => {
  for (const [slug, tresc, x, y] of [
    ['gavony', hasloGavony, '0.59', '0.449'],
    ['kessig', hasloKessig, '0.41', '0.727'],
  ]) {
    assert.doesNotMatch(tresc, /^pinezka:/m, `${slug}: hasło nie może mieć frontmatterowej pinezki`);
    assert.ok(!mapa.pinezki.some((p) => p.karta === slug), `${slug}: hasło nie może dostać wpisu w pinezkach kart`);
    assert.match(tresc, new RegExp(`#/mapa/innistrad\\?x=${x.replace('.', '\\.')}&y=${y.replace('.', '\\.')}`));
  }
  assert.equal(mapa.kotwice.find((k) => k.nazwa === 'Gavony')?.typ, 'region');
  assert.equal(mapa.kotwice.find((k) => k.nazwa === 'Kessig')?.typ, 'region');
});

test('Innistrad: wikilinki do nowych haseł są w kartach i planie', () => {
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

test('Innistrad: źródło Gavony korzysta z działającego URL-a 2011-09-28', () => {
  assert.doesNotMatch(spectral, /planeswalkers-guide-innistrad-gavony-and-humans-2011-09-07/);
  assert.doesNotMatch(dire, /planeswalkers-guide-innistrad-gavony-and-humans-2011-09-07/);
  assert.match(spectral, /planeswalkers-guide-innistrad-gavony-and-humans-2011-09-28/);
  assert.match(dire, /planeswalkers-guide-innistrad-gavony-and-humans-2011-09-28/);
});
