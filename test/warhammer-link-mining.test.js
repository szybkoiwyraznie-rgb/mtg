import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wczytajStrony } from '../tools/content-loader.mjs';
import { parseWikilinks } from '../src/codex/links.js';

const mapa = JSON.parse(fs.readFileSync('maps/warhammer-fantasy/map.json', 'utf8'));
const strony = wczytajStrony().filter((s) => !s.problem);
const poSlugu = Object.fromEntries(strony.map((s) => [s.slug, s]));
const czyta = (path) => fs.readFileSync(path, 'utf8');
const linkuje = (slug, cel) => parseWikilinks(poSlugu[slug].body).some((l) => l.slug === cel);
const kartyLinkujace = (cel) => strony
  .filter((s) => s.typ === 'karta' && parseWikilinks(s.body).some((l) => l.slug === cel))
  .map((s) => s.slug)
  .sort();
const kotwica = (nazwa) => mapa.kotwice.find((k) => k.nazwa === nazwa);

const imperium = czyta('content/lore/imperium.md');
const zielonoskorzy = czyta('content/lore/zielonoskorzy.md');
const gory = czyta('content/lore/gory-kranca-swiata.md');
const plan = czyta('content/planes/warhammer-fantasy.md');
const brute = czyta('content/cards/39mm2-brute-force.md');
const minotaurs = czyta('content/cards/83mm2-gorehorn-minotaurs.md');
const jester = czyta('content/cards/312m13-goblin-battle-jester.md');
const stake = czyta('content/cards/543isd-wooden-stake.md');

test('Warhammer: trzy hasła powstają z progu kart po 543ISD', () => {
  assert.equal(poSlugu.imperium.typ, 'haslo');
  assert.equal(poSlugu.imperium.klasa, 'spolecznosc');
  assert.equal(poSlugu.imperium.plan, 'warhammer-fantasy');
  assert.equal(poSlugu.zielonoskorzy.typ, 'haslo');
  assert.equal(poSlugu.zielonoskorzy.klasa, 'spolecznosc');
  assert.equal(poSlugu.zielonoskorzy.plan, 'warhammer-fantasy');
  assert.equal(poSlugu['gory-kranca-swiata'].typ, 'haslo');
  assert.equal(poSlugu['gory-kranca-swiata'].klasa, 'geografia');
  assert.equal(poSlugu['gory-kranca-swiata'].plan, 'warhammer-fantasy');

  assert.deepEqual(kartyLinkujace('imperium'), [
    '39mm2-brute-force',
    '543isd-wooden-stake',
    '83mm2-gorehorn-minotaurs',
  ]);
  assert.deepEqual(kartyLinkujace('zielonoskorzy'), [
    '312m13-goblin-battle-jester',
    '39mm2-brute-force',
  ]);
  assert.deepEqual(kartyLinkujace('gory-kranca-swiata'), [
    '312m13-goblin-battle-jester',
    '39mm2-brute-force',
    '543isd-wooden-stake',
  ]);
});

test('Warhammer: wikilinki są w kartach, planie i nowych hasłach', () => {
  assert.ok(linkuje('39mm2-brute-force', 'imperium'), 'Brute Force: brak linku do Imperium');
  assert.ok(linkuje('39mm2-brute-force', 'zielonoskorzy'), 'Brute Force: brak linku do Zielonoskórych');
  assert.ok(linkuje('39mm2-brute-force', 'gory-kranca-swiata'), 'Brute Force: brak linku do Gór Krańca Świata');
  assert.ok(linkuje('83mm2-gorehorn-minotaurs', 'imperium'), 'Gorehorn Minotaurs: brak linku do Imperium');
  assert.ok(linkuje('312m13-goblin-battle-jester', 'zielonoskorzy'), 'Goblin Battle Jester: brak linku do Zielonoskórych');
  assert.ok(linkuje('312m13-goblin-battle-jester', 'gory-kranca-swiata'), 'Goblin Battle Jester: brak linku do Gór Krańca Świata');
  assert.ok(linkuje('543isd-wooden-stake', 'imperium'), 'Wooden Stake: brak linku do Imperium');
  assert.ok(linkuje('543isd-wooden-stake', 'gory-kranca-swiata'), 'Wooden Stake: brak linku do Gór Krańca Świata');

  for (const cel of ['imperium', 'zielonoskorzy', 'gory-kranca-swiata']) {
    assert.ok(linkuje('warhammer-fantasy', cel), `plan Warhammer Fantasy: brak linku do ${cel}`);
  }
  assert.ok(linkuje('imperium', 'zielonoskorzy'), 'Imperium: brak linku do Zielonoskórych');
  assert.ok(linkuje('imperium', 'gory-kranca-swiata'), 'Imperium: brak linku do Gór Krańca Świata');
  assert.ok(linkuje('zielonoskorzy', 'imperium'), 'Zielonoskórzy: brak linku do Imperium');
  assert.ok(linkuje('zielonoskorzy', 'gory-kranca-swiata'), 'Zielonoskórzy: brak linku do Gór Krańca Świata');
  assert.ok(linkuje('gory-kranca-swiata', 'imperium'), 'Góry: brak linku do Imperium');
  assert.ok(linkuje('gory-kranca-swiata', 'zielonoskorzy'), 'Góry: brak linku do Zielonoskórych');

  assert.match(brute, /\[\[imperium\|Imperium\]\]/);
  assert.match(brute, /\[\[zielonoskorzy\|Zielonoskórych\]\]/);
  assert.match(jester, /\[\[gory-kranca-swiata\|Gór Krańca Świata\]\]/);
  assert.match(jester, /\[\[zielonoskorzy\|Nocnych Goblinów\]\]/);
  assert.match(minotaurs, /\[\[imperium\|Imperium\]\]/);
  assert.match(stake, /\[\[gory-kranca-swiata\|Gór Krańca Świata\]\]/);
  assert.match(plan, /\[\[imperium\|Imperium\]\]/);
  assert.match(plan, /\[\[zielonoskorzy\|Zielonoskórzy\]\]/);
});

test('Warhammer: hasła nie dostają pinezek, tylko deep-linki mapy', () => {
  for (const [slug, text, x, y] of [
    ['imperium', imperium, '0.4054', '0.3878'],
    ['zielonoskorzy', zielonoskorzy, '0.4262', '0.581'],
    ['gory-kranca-swiata', gory, '0.72', '0.58'],
  ]) {
    assert.doesNotMatch(text, /^pinezka:/m, `${slug}: hasło nie może mieć frontmatterowej pinezki`);
    assert.ok(!mapa.pinezki.some((p) => p.karta === slug), `${slug}: hasło nie może dostać wpisu w pinezkach kart`);
    assert.match(text, new RegExp(`#/mapa/warhammer-fantasy\\?x=${x.replace('.', '\\.')}&y=${y.replace('.', '\\.')}`));
  }
  assert.equal(mapa.regiony, undefined, 'ADR 0043: mapa nie może mieć regionów/obwódek haseł');
});

test('Warhammer: mapa dogania link-mining bez nowych pinezek haseł', () => {
  assert.match(kotwica('The Badlands')?.notka ?? '', /hasła zielonoskorzy/);
  assert.match(kotwica('The Great Forest')?.notka ?? '', /hasła imperium/);
  assert.match(kotwica('Worlds Edge Mountains')?.notka ?? '', /hasła gory-kranca-swiata/);
  assert.match(mapa.otwarte_na_kolejne_przejscia.join('\n'), /Pętla jakości Warhammer 2026-09-13/);
  assert.match(kotwica('The Badlands')?.pozycja_zrodlo ?? '', /„THE BADLANDS”/);
  assert.match(kotwica('Worlds Edge Mountains')?.pozycja_zrodlo ?? '', /„WORLDS EDGE MOUNTAINS”/);
});

test('Warhammer: jednoscenowe albo podzakresowe byty zostają poza osobnymi hasłami', () => {
  for (const slug of [
    'sylwania',
    'von-carsteinowie',
    'vampire-counts',
    'lowcy-czarownic-imperium',
    'witch-hunters',
    'waaagh',
    'gork-i-mork',
    'badlands',
  ]) {
    assert.equal(poSlugu[slug], undefined, `przedwczesne hasło: ${slug}`);
    assert.ok(!fs.existsSync(`content/lore/${slug}.md`), `przedwczesny plik hasła: ${slug}`);
  }
  assert.match(zielonoskorzy, /podmechanika wspólnej kultury zielonoskórych/);
  assert.match(imperium, /nie jest jednak jednolitym państwem/);
  assert.match(gory, /[Hh]asło nie ma własnej pinezki/);
});
