import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mapa = JSON.parse(fs.readFileSync('maps/zendikar/map.json', 'utf8'));
const snapshot = JSON.parse(fs.readFileSync('scryfall/132gnt-pilgrim-s-eye.json', 'utf8'));
const karta = fs.readFileSync('content/cards/132gnt-pilgrim-s-eye.md', 'utf8');
const wpis = fs.readFileSync('collection/entries/132gnt-pilgrim-s-eye.md', 'utf8');

const pin = mapa.pinezki.find((p) => p.karta === '132gnt-pilgrim-s-eye');
const seaGate = mapa.kotwice.find((k) => k.nazwa === 'Sea Gate');

test('132GNT: imgId właściciela pozostaje niezależny od numeru GNT #55', () => {
  assert.match(wpis, /^imgId: 132GNT$/m);
  assert.match(karta, /^imgId: 132GNT$/m);
  assert.equal(snapshot.set, 'gnt');
  assert.equal(snapshot.collector_number, '55');
  assert.match(snapshot.notka_numery, /Dwa niezależne systemy numeracji/i);
});

test('132GNT: ruchomy zwiadowca ma tylko przybliżony punkt operacyjny przy Sea Gate', () => {
  assert.ok(pin, 'brak pinezki Pilgrim’s Eye');
  assert.ok(seaGate, 'brak kotwicy Sea Gate');
  assert.equal(pin.pewnosc, 'przyblizona');
  assert.ok(Math.abs(pin.x - seaGate.x) < 0.0001);
  assert.ok(Math.abs(pin.y - seaGate.y) < 0.0001);
  assert.match(pin.uzasadnienie, /nie nazywa kontynentu ani obozu/i);
  assert.match(pin.uzasadnienie, /nie dokładny adres sceny/i);
  assert.match(karta, /nie podaje kontynentu, nazwy\s+obozu/i);
  assert.match(karta, /czerwone kaniony,\s*śnieżne góry, zielona dolina/i);
});
