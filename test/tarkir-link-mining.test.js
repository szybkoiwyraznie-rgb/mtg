import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wczytajStrony } from '../tools/content-loader.mjs';
import { parseWikilinks } from '../src/codex/links.js';

const mapa = JSON.parse(fs.readFileSync('maps/tarkir/map.json', 'utf8'));
const strony = wczytajStrony().filter((s) => !s.problem);
const poSlugu = Object.fromEntries(strony.map((s) => [s.slug, s]));
const czyta = (path) => fs.readFileSync(path, 'utf8');
const linkuje = (slug, cel) => parseWikilinks(poSlugu[slug].body).some((l) => l.slug === cel);
const kartyLinkujace = (cel) => strony
  .filter((s) => s.typ === 'karta' && parseWikilinks(s.body).some((l) => l.slug === cel))
  .map((s) => s.slug)
  .sort();

test('Tarkir: Qal Sisma powstaje z progu dwóch kart', () => {
  assert.equal(poSlugu['qal-sisma'].typ, 'haslo');
  assert.equal(poSlugu['qal-sisma'].klasa, 'geografia');
  assert.equal(poSlugu['qal-sisma'].plan, 'tarkir');

  assert.deepEqual(kartyLinkujace('qal-sisma'), [
    '509ktk-highland-game',
    '68ktk-ainok-tracker',
  ]);
});

test('Tarkir: wikilinki do Qal Sisma są w obu kartach i w planie', () => {
  assert.ok(linkuje('509ktk-highland-game', 'qal-sisma'), 'Highland Game: brak linku do Qal Sisma');
  assert.ok(linkuje('68ktk-ainok-tracker', 'qal-sisma'), 'Ainok Tracker: brak linku do Qal Sisma');
  assert.ok(linkuje('tarkir', 'qal-sisma'), 'plan Tarkir: brak linku do Qal Sisma');
  assert.ok(linkuje('qal-sisma', 'tarkir'), 'hasło Qal Sisma: brak linku do Tarkiru');
});

test('Tarkir: hasło Qal Sisma spełnia standard ADR 0043 i ma deep-link do mapy', () => {
  const tresc = czyta('content/lore/qal-sisma.md');
  assert.ok(tresc.includes('#/mapa/tarkir?x=0.5612&y=0.1067'), 'brak deep-linka do mapy Tarkiru');
  assert.ok(!tresc.includes('pinezka:'), 'hasło nie może mieć pinezki (ADR 0043)');
  assert.ok(tresc.includes('## Definicja'), 'brak sekcji Definicja');
  assert.ok(tresc.includes('## Opis'), 'brak sekcji Opis');
  assert.ok(tresc.includes('## Na mapie'), 'brak sekcji Na mapie');
  assert.ok(tresc.includes('## Źródła'), 'brak sekcji Źródła');
});
