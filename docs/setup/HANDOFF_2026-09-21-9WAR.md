# Handoff sesji — 9WAR Toll of the Invasion

- **Data publikacji:** 2026-09-21 18:14 Europe/Warsaw
- **Gałąź:** `arena/01a0c3ee-mtg`
- **PR:** #39
- **Commit produktu:** `8d34555`
- **Status:** dostawa zmaterializowana i wypchnięta.

## Zakres

- wpis właściciela verbatim: `collection/entries/9war-toll-of-the-invasion.md`;
- pełny snapshot Scryfall WAR #108: `scryfall/9war-toll-of-the-invasion.json`;
- Karta Katalogowa LORE-first: `content/cards/9war-toll-of-the-invasion.md`;
- regresja: `test/ravnica-9war.test.js`;
- regionalna pinezka przy kotwicy Precinct One, bez wymyślania konkretnej ulicy,
  domu cywila ani pozycji cytadeli Bolasa;
- brak nowego hasła poniżej progu dwóch kart; brak grafik.

Mechanika zachowuje snapshot: `{2}{B}`, Sorcery, ujawnienie ręki przeciwnika,
wybór i odrzucenie nielądowej karty oraz `Amass Zombies 1`. Snapshot nie zawiera
oficjalnej inskrypcji.

## Bramki produktu

- `node --test test/ravnica-9war.test.js` — 5/5;
- `npm test` — 378/378;
- `npm run build` — OK, 133 strony (63 karty, 52 hasła, 18 planów);
- `python3 tools/map-audit.py` — 0 problemów;
- `node tools/wiki-stats.mjs` — 100%;
- `git diff --check` — OK.

## Źródła

Karta odwołuje się do Scryfall WAR #108 oraz źródeł wojny Bolasa i Wiecznych
wymienionych w sekcji „Źródła” Karty Katalogowej.

## Następny krok

Po aktualizacji dokumentacji końcowej wykonać pełne bramki końcowe i pozostawić
repozytorium czyste oraz wypchnięte. PR #39 pozostaje gotowy do przeglądu i
scalenia przez właściciela.
