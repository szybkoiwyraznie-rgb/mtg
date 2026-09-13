import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wczytajStrony } from '../tools/content-loader.mjs';
import { parseWikilinks } from '../src/codex/links.js';

const mapa = JSON.parse(fs.readFileSync('maps/dominaria/map.json', 'utf8'));
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

const terisiare = czyta('content/lore/terisiare.md');
const sursi = czyta('content/lore/sursi.md');
const serra = czyta('content/lore/serra.md');
const plan = czyta('content/planes/dominaria.md');
const expunge = czyta('content/cards/40usg-expunge.md');
const embrace = czyta('content/cards/110dvd-serra-s-embrace.md');
const simian = czyta('content/cards/362bro-simian-simulacrum.md');
const disa = czyta('content/cards/531m3c-disa-the-restless.md');

test('Dominaria: Terisiare i Sursi powstają dopiero z progu dwóch kart', () => {
  assert.equal(poSlugu.terisiare.typ, 'haslo');
  assert.equal(poSlugu.terisiare.klasa, 'geografia');
  assert.equal(poSlugu.terisiare.plan, 'dominaria');
  assert.equal(poSlugu.sursi.typ, 'haslo');
  assert.equal(poSlugu.sursi.klasa, 'geografia');
  assert.equal(poSlugu.sursi.plan, 'dominaria');

  assert.deepEqual(kartyLinkujace('terisiare'), [
    '362bro-simian-simulacrum',
    '531m3c-disa-the-restless',
  ]);
  assert.deepEqual(kartyLinkujace('sursi'), [
    '110dvd-serra-s-embrace',
    '40usg-expunge',
  ]);
});

test('Dominaria: wikilinki są w kartach, planie i istniejącym haśle Serra', () => {
  for (const slug of ['362bro-simian-simulacrum', '531m3c-disa-the-restless']) {
    assert.ok(linkuje(slug, 'terisiare'), `${slug}: brak linku do Terisiare`);
  }
  for (const slug of ['40usg-expunge', '110dvd-serra-s-embrace']) {
    assert.ok(linkuje(slug, 'sursi'), `${slug}: brak linku do Sursi`);
  }
  assert.ok(linkuje('dominaria', 'terisiare'), 'plan Dominaria: brak linku do Terisiare');
  assert.ok(linkuje('dominaria', 'sursi'), 'plan Dominaria: brak linku do Sursi');
  assert.ok(linkuje('serra', 'sursi'), 'hasło Serra: brak linku do Sursi');
  assert.ok(linkuje('sursi', 'serra'), 'hasło Sursi: brak linku do Serry');
  assert.ok(linkuje('terisiare', 'dominaria'), 'hasło Terisiare: brak linku do Dominarii');

  assert.match(simian, /\[\[terisiare\|Terisiare\]\]/);
  assert.match(disa, /\[\[terisiare\|Terisiare\]\]/);
  assert.match(expunge, /\[\[sursi\|Równinach Sursi\]\]/);
  assert.match(embrace, /\[\[sursi\|Sursi \/ Katedry Serran\]\]/);
  assert.match(plan, /\[\[terisiare\|Terisiare\]\]/);
  assert.match(plan, /\[\[sursi\|Sursi\]\]/);
  assert.match(serra, /\[\[sursi\|Sursi\]\]/);
});

test('Dominaria: nowe hasła geograficzne nie mają pinezek, tylko deep-linki mapy', () => {
  for (const [slug, text, x, y] of [
    ['terisiare', terisiare, '0.895', '0.3'],
    ['sursi', sursi, '0.1937', '0.3806'],
  ]) {
    assert.doesNotMatch(text, /^pinezka:/m, `${slug}: hasło nie może mieć frontmatterowej pinezki`);
    assert.ok(!mapa.pinezki.some((p) => p.karta === slug), `${slug}: hasło nie może dostać wpisu w pinezkach kart`);
    assert.match(text, new RegExp(`#/mapa/dominaria\\?x=${x.replace('.', '\\.')}&y=${y.replace('.', '\\.')}`));
  }
});

test('Dominaria: mapa utrzymuje regionalną pewność i źródła dla Sursi/Terisiare', () => {
  const terisiareAnchor = kotwica('Terisiare');
  const sursiAnchor = kotwica('Sursi');
  const cathedralAnchor = kotwica('Cathedral of Serra');
  const argothAnchor = kotwica('Argoth');
  const kjeldorAnchor = kotwica('Kjeldor');

  assert.equal(terisiareAnchor?.typ, 'kontynent');
  assert.equal(terisiareAnchor?.x, 0.895);
  assert.equal(terisiareAnchor?.y, 0.3);
  assert.match(terisiareAnchor?.notka ?? '', /362BRO \+ 531M3C/);
  assert.match(terisiareAnchor?.pozycja_zrodlo ?? '', /Planeswalker's Guide to Dominaria 2022/);

  assert.equal(sursiAnchor?.typ, 'region');
  assert.equal(sursiAnchor?.x, cathedralAnchor?.x);
  assert.equal(sursiAnchor?.y, cathedralAnchor?.y);
  assert.deepEqual(sursiAnchor?.px_t1, [1569, 1979]);
  assert.match(sursiAnchor?.notka ?? '', /nie granica całych Równin Sursi/);
  assert.match(cathedralAnchor?.notka ?? '', /40USG i 110DVD/);

  assert.match(argothAnchor?.notka ?? '', /362BRO/);
  assert.match(kjeldorAnchor?.notka ?? '', /531M3C/);

  for (const slug of [
    '40usg-expunge',
    '110dvd-serra-s-embrace',
    '362bro-simian-simulacrum',
    '531m3c-disa-the-restless',
  ]) {
    assert.equal(pinezka(slug)?.pewnosc, 'region', `${slug}: Dominaria zostaje na pewności region`);
  }
});

test('Dominaria: tekst hasła Sursi nie udaje granic ani linii bitwy', () => {
  assert.match(sursi, /nie dokładna granica płaskowyżu ani całych Równin Sursi/);
  assert.match(sursi, /nie do wymyślonego\s+punktu pola bitwy/);
  assert.match(embrace, /nie\s+udaje więc dokładnego pola bitwy/);
  assert.match(expunge, /Katedra Serran/);
});

test('Dominaria: tekst hasła Terisiare rozdziela epoki Argothu, lodu i współczesnego atlasu', () => {
  assert.match(terisiare, /Simian Simulacrum patrzy wstecz na wojenne Argoth/);
  assert.match(terisiare, /Disa chodzi po lodowym\s+kontynencie/);
  assert.match(terisiare, /współczesna mapa T1 pokazuje następstwo wielu kataklizmów/);
  assert.match(terisiare, /Karty mają własne pinezki\s+regionalne/);
});
