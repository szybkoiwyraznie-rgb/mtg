import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wczytajStrony } from '../tools/content-loader.mjs';
import { parseWikilinks } from '../src/codex/links.js';

const mapa = JSON.parse(fs.readFileSync('maps/innistrad/map.json', 'utf8'));
const snapshot = JSON.parse(fs.readFileSync('scryfall/256isd-frightful-delusion.json', 'utf8'));
const karta = fs.readFileSync('content/cards/256isd-frightful-delusion.md', 'utf8');
const wpis = fs.readFileSync('collection/entries/256isd-frightful-delusion.md', 'utf8');
const stensiaHaslo = fs.readFileSync('content/lore/stensia.md', 'utf8');
const plan = fs.readFileSync('content/planes/innistrad.md', 'utf8');
const backlog = fs.readFileSync('docs/backlog.md', 'utf8');
const strony = wczytajStrony().filter((s) => !s.problem);

const pin = mapa.pinezki.find((p) => p.karta === '256isd-frightful-delusion');
const stensia = mapa.kotwice.find((k) => k.nazwa === 'Stensia');
const fabula = 'W ciasnej sypialni gotyckiego domu na Innistradzie, oświetlonej tylko bladym światłem księżyca i dogasającą świecą, twarz młodej kobiety pokazana jest w bardzo bliskim kadrze — głowa odchylona lekko do tyłu, szeroko otwarte oczy, blada twarz z cieniami pod oczami i wargi lekko rozchylone w niemym krzyku. Nad jej czołem unosi się bladoniebieska mgła, a w niej formują się niewyraźne zarysy koszmarnych twarzy i pokręconych kształtów — wizje zasiane w jej umyśle przez czyjąś magię. Na ramieniu widać delikatną świetlistą smugę, która wchodzi przez skórę, znikając w głębi czaszki. W Stensii iluzjonistka nie musi zabijać — wystarczy, że wrzuci komuś do snu przerażenie, którego ten nie potrafi odróżnić od rzeczywistości do pierwszego koguta.';
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
const kartyLinkujace = (cel) => strony
  .filter((s) => s.typ === 'karta' && parseWikilinks(s.body).some((l) => l.slug === cel))
  .map((s) => s.slug)
  .sort();

test('256ISD: Fabuła właściciela pozostaje zachowana verbatim', () => {
  const body = wpis.match(/^---\n[\s\S]*?\n---\n\n([\s\S]*?)\n?$/)?.[1];
  assert.equal(body, fabula);
  assert.match(wpis, /^imgId: 256ISD$/m);
  assert.match(wpis, /^nazwa: Frightful Delusion$/m);
  assert.match(wpis, /^wydanie: ISD$/m);
  assert.match(wpis, /^plan: Innistrad$/m);
});

test('256ISD: imgId właściciela nie jest numerem kolekcjonerskim ISD #57', () => {
  assert.match(karta, /^imgId: 256ISD$/m);
  assert.match(karta, /^kolory: \[U\]$/m);
  assert.equal(snapshot.name, 'Frightful Delusion');
  assert.equal(snapshot.set, 'isd');
  assert.equal(snapshot.set_name, 'Innistrad');
  assert.equal(snapshot.collector_number, '57');
  assert.deepEqual(snapshot.multiverse_ids, [220031]);
  assert.equal(snapshot.mana_cost, '{2}{U}');
  assert.equal(snapshot.type_line, 'Instant');
  assert.equal(snapshot.rarity, 'common');
  assert.deepEqual(snapshot.colors, ['U']);
  assert.deepEqual(snapshot.color_identity, ['U']);
  assert.deepEqual(snapshot.keywords, []);
  assert.equal(snapshot.artist, 'Anthony Palumbo');
  assert.equal(snapshot.oracle_text, 'Counter target spell unless its controller pays {1}. That player discards a card.');
  assert.equal(snapshot.flavor_text, 'Whether he actually exists is in question, but the terror she feels is excruciatingly real.');
  assert.match(snapshot.related_uris.gatherer, /multiverseid=220031/);
  assert.match(snapshot.notka_numery, /imgId właściciela = 256ISD/i);
  assert.match(snapshot.notka_numery, /collector_number Scryfall = 57/i);
  assert.match(snapshot.notka_numery, /\/isd\/256 to Swamp/i);
});

test('256ISD: Karta Katalogowa jest lore-first i centrum stanowi stensiańska sypialnia', () => {
  assert.deepEqual(
    [...karta.matchAll(/^## (.+)$/gm)].map((m) => m[1]),
    sekcje,
  );
  assert.ok(karta.indexOf('## Kronika Lore') < karta.indexOf('## Mechanika jako Opowieść'));
  assert.match(karta, /\[\[stensia\|Stensii\]\]/);
  assert.match(karta, /ciasnej sypialni gotyckiego domu/i);
  assert.match(karta, /Młoda kobieta budzi się z odchyloną głową/i);
  assert.match(karta, /bladoniebieska mgła/i);
  assert.match(karta, /świetlista smuga/i);
  assert.match(karta, /Iluzjonistka/);
  assert.match(karta, /do pierwszego koguta/i);
  assert.match(karta, /przerażające urojenie/i);
  assert.match(karta, /groza,\s+którą ona czuje, jest rozdzierająco rzeczywista/i);
});

test('256ISD: mechanika przenosi przerwany zamiar i utratę myśli', () => {
  const narracja = karta.slice(0, karta.indexOf('## Mechanika jako Opowieść'));
  assert.doesNotMatch(narracja, /ISD #57|Scryfall|Oracle|collector_number|multiverse|Gatherer/i);
  assert.match(karta, /`\{2\}\{U\}` przywołuje Instant/);
  assert.match(karta, /Counter target spell\s+unless its controller pays \{1\}/);
  assert.match(karta, /przerywa wolę|zamiar rozpada/i);
  assert.match(karta, /działa nawet wtedy, gdy koszt zostanie zapłacony/i);
  assert.match(karta, /odrzuca kartę/i);
  assert.match(karta, /uboższa o myśl|traci coś z ręki/i);
});

test('256ISD: dom bez nazwy dostaje tylko regionalną pinezkę Stensii', () => {
  assert.ok(pin, 'brak pinezki Frightful Delusion');
  assert.ok(stensia, 'brak kotwicy Stensia');
  assert.equal(stensia.typ, 'region');
  assert.equal(pin.pewnosc, 'region');
  assert.ok(Math.abs(pin.x - stensia.x) < 0.0001);
  assert.ok(Math.abs(pin.y - stensia.y) < 0.0001);
  assert.match(pin.uzasadnienie, /nie nazywa wsi, doliny, dworu ani przełęczy/i);
  assert.match(pin.uzasadnienie, /nie oznacza dokładnego adresu domu ani pokoju/i);
  assert.match(karta, /Pinezka ma pewność `region`/);
  assert.match(karta, /nie nazywa wsi, doliny, dworu ani konkretnej przełęczy/i);
  assert.ok(!mapa.pinezki.some((p) => p.karta === 'stensia'), 'hasło Stensia nie może mieć pinezki karty');
});

test('256ISD: Stensia i plan Innistrad zostały pogłębione bez nowego hasła koszmaru', () => {
  assert.deepEqual(kartyLinkujace('stensia'), [
    '256isd-frightful-delusion',
    '309isd-civilized-scholar',
    '393dka-forge-devil',
    '42isd-murder-of-crows',
  ]);
  assert.match(stensiaHaslo, /\[\[256isd-frightful-delusion\|Frightful Delusion\]\]/);
  assert.match(stensiaHaslo, /sen w narzędzie ataku/);
  assert.match(plan, /\[\[256isd-frightful-delusion\|Frightful Delusion\]\]/);
  assert.match(plan, /ciasnej sypialni/);
  assert.match(backlog, /Stensia — uzupełnione po `256ISD`/);
  assert.equal(strony.find((s) => s.slug === 'koszmar')?.typ, undefined);
  assert.equal(strony.find((s) => s.slug === 'iluzje')?.typ, undefined);
});
