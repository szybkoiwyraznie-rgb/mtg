import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mapa = JSON.parse(fs.readFileSync('maps/innistrad/map.json', 'utf8'));
const snapshot = JSON.parse(fs.readFileSync('scryfall/62avr-grounded.json', 'utf8'));
const karta = fs.readFileSync('content/cards/62avr-grounded.md', 'utf8');
const wpis = fs.readFileSync('collection/entries/62avr-grounded.md', 'utf8');
const plan = fs.readFileSync('content/planes/innistrad.md', 'utf8');
const ulvenwald = fs.readFileSync('content/lore/ulvenwald.md', 'utf8');

const pin = mapa.pinezki.find((p) => p.karta === '62avr-grounded');

const fabula = 'Na mokrej leśnej ściółce Innistradu leży potężna kreatura o rozłożystych skórzastych skrzydłach, gęsto oplecionych grubymi zielonymi pnączami i zdrewniałymi gałęziami wyrastającymi wprost z podłoża. Skrzydła są dociśnięte płasko do warstwy mchu i ciemnego błota, unieruchomione przez liczne sploty roślinności, które zacisnęły się szybciej, niż bestia zdołała się odepchnąć od ziemi. W tle czarne pnie drzew niknące w jasnej mgle, a na pierwszym planie opadłe liście i detale splątanych korzeni trzymających lotnika przy gruncie. Gdy Ulvenwald się budzi, nawet skrzydlaci stają się piechotą — i nie ma powrotu w powietrze, nim sam las nie odda swojej zgody.';

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

test('62AVR: Fabuła właściciela pozostaje zachowana verbatim (ADR 0003)', () => {
  const body = wpis.match(/^---\n[\s\S]*?\n---\n\n([\s\S]*?)\n?$/)?.[1];
  assert.equal(body, fabula);
  assert.match(wpis, /^imgId: 62AVR$/m);
  assert.match(wpis, /^nazwa: Grounded$/m);
  assert.match(wpis, /^wydanie: AVR$/m);
  assert.match(wpis, /^plan: Innistrad$/m);
});

test('62AVR: imgId właściciela (62AVR) pozostaje niezależny od numeru AVR #181', () => {
  assert.match(karta, /^imgId: 62AVR$/m);
  assert.equal(snapshot.name, 'Grounded');
  assert.equal(snapshot.set, 'avr');
  assert.equal(snapshot.collector_number, '181');
  assert.equal(snapshot.mana_cost, '{1}{G}');
  assert.equal(snapshot.type_line, 'Enchantment — Aura');
});

test('62AVR: Karta Katalogowa jest LORE-first i zachowuje wszystkie sekcje', () => {
  for (const s of sekcje) {
    assert.match(karta, new RegExp(`## ${s}`), `brak sekcji ${s}`);
  }
  assert.match(karta, /Ulvenwald/);
  assert.match(karta, /Kessig/);
  assert.match(karta, /Alena/);
  assert.match(karta, /Halana/);
  assert.match(plan, /62avr-grounded/);
  assert.match(ulvenwald, /62avr-grounded/);
});

test('62AVR: Ulvenwald dostaje regionalną pinezkę na Innistradzie', () => {
  assert.ok(pin, 'brak pinezki w maps/innistrad/map.json');
  assert.equal(pin.pewnosc, 'region');
  assert.equal(pin.x, 0.54);
  assert.equal(pin.y, 0.711);
  assert.match(pin.uzasadnienie, /Ulvenwald/);
});
