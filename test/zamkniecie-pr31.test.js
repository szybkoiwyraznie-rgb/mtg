import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const handoff = fs.readFileSync('docs/setup/HANDOFF_2026-09-10-pr31.md', 'utf8');
const roadmap = fs.readFileSync('docs/ROADMAP.md', 'utf8');
const plan1 = fs.readFileSync('docs/plans/PLAN_2026-09-10-pr31-petla-jakosci.md', 'utf8');
const plan2 = fs.readFileSync('docs/plans/PLAN_2026-09-10-pr31-petla-jakosci-2.md', 'utf8');
const changelog = fs.readFileSync('content/co-nowego.md', 'utf8');

test('PR-31: dokumentacja zamknięcia opisuje finalne 15 materializacji i 57 stron', () => {
  assert.match(handoff, /Stan PR-31 przy scaleniu:[\s\S]{0,80}180\/180[\s\S]{0,80}57 stron/);
  const slugi = [
    '362bro-simian-simulacrum', '171isd-grizzled-outcasts',
    '181avr-spectral-prison', '544avr-thraben-valiant',
    '596ori-ghirapur-gearcrafter', '612blb-crumb-and-get-it',
    '118mid-dire-strain-brawler', '537cmr-kor-cartographer',
    '539clb-silvanus-s-invoker', '83mm2-gorehorn-minotaurs',
    '19-8ed-twiddle', '209eld-burning-yard-trainer',
    '312m13-goblin-battle-jester', '531m3c-disa-the-restless',
    '347nph-pristine-talisman',
  ];
  for (const slug of slugi) assert.ok(handoff.includes(slug), `brak w handoffie: ${slug}`);
  assert.doesNotMatch(plan1, /^\s*- \[ \]/m);
  assert.match(plan2, /Status finalny:\*\* wykonane/);
  assert.ok(roadmap.indexOf('**PR-29 ') < roadmap.indexOf('**PR-30 '));
  assert.ok(roadmap.indexOf('**PR-30 ') < roadmap.indexOf('**PR-31 '));
});

test('ADR 0029: publikacje PR-31 mają rzeczywiste lokalne godziny', () => {
  for (const naglowek of [
    '2026-09-11 00:17 — Druga Pętla Jakości',
    '2026-09-11 10:51 — Nowa karta: Simian Simulacrum',
    '2026-09-11 17:50 — Nowa karta: Grizzled Outcasts',
    '2026-09-11 17:56 — Nowa karta: Goblin Battle Jester',
    '2026-09-11 18:09 — Nowa karta: Disa the Restless',
    '2026-09-11 19:05 — Nowa karta: Pristine Talisman',
  ]) {
    assert.ok(changelog.includes(naglowek), `brak rzeczywistego czasu: ${naglowek}`);
  }
  for (const slug of ['544avr-thraben-valiant', '83mm2-gorehorn-minotaurs', '19-8ed-twiddle']) {
    assert.ok(changelog.includes(slug), `brak finalnej materializacji w changelogu: ${slug}`);
  }
});

test('Wiedźmin: nieużywany raster z korzenia jest usunięty, runtime LOD pozostaje', () => {
  assert.equal(fs.existsSync('wiedzmin.jpg'), false);
  for (const plik of [
    'maps/wiedzmin/master.jpg', 'maps/wiedzmin/l0.jpg',
    'maps/wiedzmin/mini.jpg', 'maps/wiedzmin/kafle/k000.jpg',
  ]) assert.ok(fs.existsSync(plik), `brak runtime LOD: ${plik}`);
});

test('F13: wskazane błędy redakcyjne nie wracają', () => {
  const tresc = [
    'content/cards/209eld-burning-yard-trainer.md',
    'content/cards/347nph-pristine-talisman.md',
    'content/cards/393dka-forge-devil.md',
    'content/cards/544avr-thraben-valiant.md',
    'content/planes/innistrad.md',
  ].map((p) => fs.readFileSync(p, 'utf8')).join('\n');
  assert.doesNotMatch(
    tresc,
    /Płonący Dziedzińce|własnym lekiem|skompletują samych|Święte wady/,
  );
});
