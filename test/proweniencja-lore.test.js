import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const conflux = fs.readFileSync('content/lore/conflux.md', 'utf8');
const stensia = fs.readFileSync('content/lore/stensia.md', 'utf8');
const scholar = fs.readFileSync('content/cards/309isd-civilized-scholar.md', 'utf8');

test('Conflux: każdy numer cytowania oznacza jedno źródło', () => {
  const przypisy = new Map();
  for (const match of conflux.matchAll(/\[(\d+)]\((https?:\/\/[^)]+(?:\)[^),\s]*)?)\)/g)) {
    const [, numer, url] = match;
    const poprzedni = przypisy.get(numer);
    assert.ok(!poprzedni || poprzedni === url, `[${numer}] wskazuje różne URL`);
    przypisy.set(numer, url);
  }
  assert.deepEqual(Object.fromEntries(przypisy), {
    1: 'https://mtg.wiki/page/Conflux_(event)',
    2: 'https://mtg.wiki/page/Alara',
    3: 'https://mtg.wiki/page/Nicol_Bolas',
    4: 'https://mtg.wiki/page/Maelstrom',
  });
  assert.match(conflux, /Sam Conflux był naturalnym[\s\S]{0,160}Nicol Bolas\nnie wywołał tego procesu/);
  assert.doesNotMatch(conflux, /Conflux[\s\S]{0,100}zaplanowany i przyspieszony przez/i);
});

test('Stensia: Civilized Scholar bada traktaty w Havengulu, nie podróżuje do prowincji', () => {
  assert.doesNotMatch(stensia, /docierający tu uczeni[\s\S]{0,160}Civilized Scholar/i);
  assert.match(stensia, /Civilized Scholar[\s\S]{0,160}gabinetu w Havengulu/);
  assert.match(scholar, /Poznaje te\nkrainy z pism; opowieść nie prowadzi go osobiście do Stensii/);
  assert.match(scholar, /źródło nie jest dowodem jego podróży do tej prowincji/);
});
