import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mapa = JSON.parse(fs.readFileSync('maps/ravnica/map.json', 'utf8'));
const snapshot = JSON.parse(fs.readFileSync('scryfall/9war-toll-of-the-invasion.json', 'utf8'));
const karta = fs.readFileSync('content/cards/9war-toll-of-the-invasion.md', 'utf8');
const wpis = fs.readFileSync('collection/entries/9war-toll-of-the-invasion.md', 'utf8');
const pin = mapa.pinezki.find((p) => p.karta === '9war-toll-of-the-invasion');
const precinct = mapa.kotwice.find((k) => k.nazwa === 'Precinct One');
const fabula = 'Na zniszczonej ulicy Ravnicy podczas inwazji Nicola Bolasa klęczy zwykły cywil, dłonie przyciśnięte do skroni, a nad jego głową unoszą się widmowe projekcje wyrwanych wspomnień. Jedną z tych półprzezroczystych myśli zabiera mglista dłoń wyłaniająca się z cienia — wybiera najcenniejszą. Za jego plecami, dopiero co powołany do istnienia tym aktem, stoi nieruchomy lazotepowy Wieczny w ceremonialnej zbroi, z pustymi oczami świecącymi niebieskim blaskiem. Na niebie majaczy cytadela Bolasa, a cena tej wojny mierzy się nie bitwami, lecz skradzionymi myślami zwykłych mieszkańców.';
const sekcje = ['Kronika Lore', 'Postacie i Byty', 'Nazwa Karty', 'Flavor Text', 'Transpozycja', 'Na Mapie', 'Mechanika jako Opowieść', 'Źródła', 'Podsumowanie Lore'];

test('9WAR: Fabuła właściciela pozostaje verbatim', () => {
  const body = wpis.match(/^---\n[\s\S]*?\n---\n\n## Fabuła \([^\n]+\)\n\n([\s\S]*?)\n?$/)?.[1];
  assert.equal(body, fabula);
  assert.match(wpis, /^imgId: 9WAR$/m);
  assert.match(wpis, /^nazwa: Toll of the Invasion$/m);
  assert.match(wpis, /^wydanie: WAR$/m);
  assert.match(wpis, /^plan: Ravnica$/m);
});

test('9WAR: pełny snapshot rozdziela imgId od WAR #108', () => {
  assert.equal(snapshot.name, 'Toll of the Invasion');
  assert.equal(snapshot.set, 'war');
  assert.equal(snapshot.collector_number, '108');
  assert.equal(snapshot.mana_cost, '{2}{B}');
  assert.equal(snapshot.type_line, 'Sorcery');
  assert.equal(snapshot.rarity, 'common');
  assert.equal(snapshot.artist, 'Joe Slucher');
  assert.match(snapshot.oracle_text, /reveals their hand/);
  assert.match(snapshot.oracle_text, /nonland card/);
  assert.match(snapshot.oracle_text, /Amass Zombies 1/);
  assert.equal(snapshot.flavor_text, undefined);
  assert.match(snapshot.notka_numery, /imgId właściciela = 9WAR/);
  assert.match(snapshot.notka_numery, /collector_number Scryfall = 108/);
  assert.ok(snapshot.image_uris?.normal);
  assert.ok(snapshot.all_parts?.some((part) => part.name === 'Zombie Army'));
});

test('9WAR: Karta Katalogowa jest LORE-first i zachowuje Wiecznego', () => {
  assert.deepEqual([...karta.matchAll(/^## (.+)$/gm)].map((m) => m[1]), sekcje);
  assert.ok(karta.indexOf('## Kronika Lore') < karta.indexOf('## Mechanika jako Opowieść'));
  assert.match(karta, /cywil/);
  assert.match(karta, /lazotepowy/);
  assert.match(karta, /Wieczny/);
  assert.match(karta, /cytadela Bolasa/);
  assert.match(karta, /ujawnienie ręki/);
  assert.match(karta, /Amass Zombies 1/);
  assert.match(karta, /Oficjalna inskrypcja nie pojawia się/);
  assert.match(karta, /To nie portret konkretnego generała/);
});

test('9WAR: regionalna pinezka dziedziczy Precinct One', () => {
  assert.ok(pin, 'brak pinezki Toll of the Invasion');
  assert.ok(precinct, 'brak kotwicy Precinct One');
  assert.equal(pin.pewnosc, 'region');
  assert.equal(pin.x, precinct.x);
  assert.equal(pin.y, precinct.y);
  assert.match(pin.uzasadnienie, /zniszczoną ulicę Ravniki/);
  assert.match(pin.uzasadnienie, /nie udaje adresu cywila/);
  assert.match(karta, /regionalnej kotwicy \*\*Precinct One\*\*/);
});

test('9WAR: cywil, Wieczny i cytadela nie tworzą przedwczesnych haseł', () => {
  assert.doesNotMatch(karta, /\[\[eternal\|/);
  assert.doesNotMatch(fs.readFileSync('content/lore/README.md', 'utf8'), /9war-toll-of-the-invasion/);
});
