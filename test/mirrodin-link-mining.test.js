import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wczytajStrony } from '../tools/content-loader.mjs';
import { parseWikilinks } from '../src/codex/links.js';

const mapa = JSON.parse(fs.readFileSync('maps/mirrodin/map.json', 'utf8'));
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

const ortodoksja = czyta('content/lore/ortodoksja-maszyn.md');
const vulshok = czyta('content/lore/vulshok.md');
const talisman = czyta('content/cards/347nph-pristine-talisman.md');
const decree = czyta('content/cards/476mbs-banishment-decree.md');
const invasion = czyta('content/cards/556nph-ruthless-invasion.md');
const plan = czyta('content/planes/mirrodin.md');
const nowa = czyta('content/lore/nowa-phyrexia.md');
const auriok = czyta('content/lore/auriok.md');
const oxidda = czyta('content/lore/oxidda-chain.md');

test('Mirrodin: Ortodoksja Maszyn i Vulshokowie powstają z progu dwóch kart', () => {
  assert.equal(poSlugu['ortodoksja-maszyn'].typ, 'haslo');
  assert.equal(poSlugu['ortodoksja-maszyn'].klasa, 'spolecznosc');
  assert.equal(poSlugu['ortodoksja-maszyn'].plan, 'mirrodin');
  assert.equal(poSlugu.vulshok.typ, 'haslo');
  assert.equal(poSlugu.vulshok.klasa, 'spolecznosc');
  assert.equal(poSlugu.vulshok.plan, 'mirrodin');

  assert.deepEqual(kartyLinkujace('ortodoksja-maszyn'), [
    '347nph-pristine-talisman',
    '476mbs-banishment-decree',
  ]);
  assert.deepEqual(kartyLinkujace('vulshok'), [
    '347nph-pristine-talisman',
    '556nph-ruthless-invasion',
  ]);
});

test('Mirrodin: wikilinki są w kartach, planie i powiązanych hasłach', () => {
  assert.ok(linkuje('347nph-pristine-talisman', 'ortodoksja-maszyn'), 'Pristine Talisman: brak linku do Ortodoksji');
  assert.ok(linkuje('347nph-pristine-talisman', 'vulshok'), 'Pristine Talisman: brak linku do Vulshoków');
  assert.ok(linkuje('476mbs-banishment-decree', 'ortodoksja-maszyn'), 'Banishment Decree: brak linku do Ortodoksji');
  assert.ok(linkuje('556nph-ruthless-invasion', 'vulshok'), 'Ruthless Invasion: brak linku do Vulshoków');

  for (const cel of ['ortodoksja-maszyn', 'vulshok']) {
    assert.ok(linkuje('mirrodin', cel), `plan Mirrodin: brak linku do ${cel}`);
  }
  assert.ok(linkuje('nowa-phyrexia', 'ortodoksja-maszyn'), 'Nowa Phyrexia: brak linku do Ortodoksji');
  assert.ok(linkuje('auriok', 'ortodoksja-maszyn'), 'Auriok: brak linku do Ortodoksji');
  assert.ok(linkuje('auriok', 'vulshok'), 'Auriok: brak linku do Vulshoków');
  assert.ok(linkuje('oxidda-chain', 'vulshok'), 'Oxidda Chain: brak linku do Vulshoków');
  assert.ok(linkuje('ortodoksja-maszyn', 'nowa-phyrexia'), 'Ortodoksja: brak linku do Nowej Phyrexii');
  assert.ok(linkuje('vulshok', 'oxidda-chain'), 'Vulshok: brak linku do Oxidda Chain');

  assert.match(talisman, /\[\[ortodoksja-maszyn\|Ortodoksji Maszyn\]\]/);
  assert.match(talisman, /\[\[vulshok\|Vulshoków\]\]/);
  assert.match(decree, /\[\[ortodoksja-maszyn\|Ortodoksja Maszyn\]\]/);
  assert.match(invasion, /\[\[vulshok\|Vulshokowie\]\]/);
  assert.match(plan, /\[\[ortodoksja-maszyn\|Ortodoksja Maszyn\]\]/);
  assert.match(plan, /\[\[vulshok\|Vulshok\]\]/);
  assert.match(nowa, /\[\[ortodoksja-maszyn\|Machine Orthodoxy \/ Ortodoksja Maszyn\]\]/);
  assert.match(auriok, /\[\[vulshok\|Vulshoków\]\]/);
  assert.match(oxidda, /\[\[vulshok\|Vulshoków\]\]/);
});

test('Mirrodin: nowe hasła społeczności nie mają pinezek, tylko deep-linki mapy', () => {
  for (const [slug, text, x, y] of [
    ['ortodoksja-maszyn', ortodoksja, '0.523', '0.317'],
    ['vulshok', vulshok, '0.3736', '0.7556'],
  ]) {
    assert.doesNotMatch(text, /^pinezka:/m, `${slug}: hasło nie może mieć frontmatterowej pinezki`);
    assert.ok(!mapa.pinezki.some((p) => p.karta === slug), `${slug}: hasło nie może dostać wpisu w pinezkach kart`);
    assert.match(text, new RegExp(`#/mapa/mirrodin\\?x=${x.replace('.', '\\.')}&y=${y.replace('.', '\\.')}`));
  }
});

test('Mirrodin: mapa opisuje sceny bez tworzenia fałszywych stolic haseł', () => {
  assert.equal(kotwica('Oxidda Chain')?.typ, 'region');
  assert.match(kotwica('Oxidda Chain')?.notka ?? '', /hasło vulshok/);
  assert.match(kotwica('Oxidagg')?.notka ?? '', /hasła vulshok/);
  assert.match(kotwica('Razor Fields')?.notka ?? '', /Ortodoksji Maszyn/);
  assert.match(kotwica('Cave of Light')?.notka ?? '', /Ortodoksji Maszyn/);

  assert.equal(pinezka('476mbs-banishment-decree')?.pewnosc, 'region');
  assert.match(pinezka('476mbs-banishment-decree')?.uzasadnienie ?? '', /ortodoksja-maszyn/);
  assert.equal(pinezka('556nph-ruthless-invasion')?.pewnosc, 'region');
  assert.match(pinezka('556nph-ruthless-invasion')?.uzasadnienie ?? '', /hasło vulshok/);
  assert.equal(pinezka('347nph-pristine-talisman')?.pewnosc, 'przyblizona');
});

test('Mirrodin: hasła rozdzielają epokę powierzchni od późniejszej topologii sfer', () => {
  assert.match(ortodoksja, /nie przenosi wstecz późniejszej topologii/);
  assert.match(ortodoksja, /adres sceny, nie stolica całej frakcji/);
  assert.match(vulshok, /Pinezka Ruthless\s+Invasion stoi bliżej drogi między Oxidagg a Kuldothą/);
  assert.ok(!fs.existsSync('content/lore/elesh-norn.md'), 'Elesh Norn ma w tej pętli jedną kartę, więc nie dostaje osobnego hasła');
  assert.ok(!fs.existsSync('content/lore/razor-fields.md'), 'Razor Fields pozostaje poniżej progu kart jako osobne hasło');
});
