# Plan sesji 2026-09-29 — audyt PR-39 + Pętla Jakości

> Sesja kontynuacji (prompt właściciela: „Kontynuuj projekt"). Brak nowych
> dostaw kart — praca domyślna: Pętla Jakości (ADR 0006/0015).

## Krok 0 — rozpoznanie (wykonane)

- Lektura startowa pełna (AGENTS.md, 48 ADR-ów, LESSONS L1–L19,
  ENVIRONMENT, PR #39, handoff 9WAR).
- Klon płytki → `git fetch --unshallow` wykonany (stopki dat prawdziwe).
- Integralność: `npm test` 378/378, `npm run build` 133 strony
  (63 karty, 52 hasła, 18 planów), `map-audit` 0, `wiki-stats` 100%.

## Krok 1 — audyt poprzedniego scalonego PR (#39)

Zakres PR #39: 5 materializacji (138MID, 235RTR, 604zen, 64DTK, 9WAR),
4 pogłębienia haseł (ghirapur, kuldotha, lumengrid, qal-sisma), pinezki
w 4 map.json, regresje, dokumentacja. Audyt → `docs/audits/AUDYT_2026-09-29-PR39.md`.

Wstępne ustalenia: struktura kart LORE-first kompletna, pinezki
z uzasadnieniami lore, testy zielone. Do naprawy znalezione w skanie
link-miningu (krok 3): brak wikilinków 604zen → [[velen]] oraz
9war → [[nicol-bolas]] (hasła istnieją, karty wspominają encje w treści).

## Krok 2+3 — pogłębianie lore i link-mining

Skan encji (narracja bez Źródeł, próg ≥2 kart — zasada właściciela)
wskazał dwóch kandydatów z bogatymi wzmiankami w dwóch kartach:

1. **Temur** (spolecznosc, Tarkir) — karty 509ktk-highland-game
   (klan, Temur Frontier, Chianula, Arel) + 68ktk-ainok-tracker
   (klan, Surrak Dragonclaw, ainok jako pełnoprawni członkowie).
   Hasło z kwerendą (Planeswalker's Guide to Khans of Tarkir, mtg.wiki);
   deep-link do kotwicy Temur Frontier na mapie Tarkiru (ADR 0043).
2. **Ardenvale** (geografia, Eldraine) — karty 138mid-join-the-dance
   (pogranicze rolnicze, Highlands of Arden) + 209eld-burning-yard-trainer
   (dwór, Castle Ardenvale, Krąg Lojalności). Hasło z kwerendą
   (mtg.wiki Ardenvale, przewodniki ELD/WOE); deep-link do kotwicy
   Castle Ardenvale na atlasie Eldraine.

Dopisać wikilinki ze wszystkich stron wspominających (karty, plany,
hasła powiązane: qal-sisma, velen, nicol-bolas) + naprawa braków
z audytu. Zaktualizować kolejki link-miningu w `docs/backlog.md`
(Tarkir: ainok/Abzan/Shifting Wastes — policzyć realne wzmianki i
rozstrzygnąć zakres; Eldraine: Knieja — 1 karta pozostaje).

Limit: 2 nowe hasła na przebieg pętli (gid PĘTLI).

## Krok 4 — pass mapowy (T3/T4; ADR 0015, L18)

- **Tarkir T4**: weryfikacja rejonu Temur Frontier — kwerenda
  kanonicznych lokacji klanu; ewentualne nowe POI z proweniencją.
- **Eldraine T4**: weryfikacja domeny Ardenvale — kwerenda lokacji
  (mtg.wiki/Ardenvale); uzupełnienia tylko tam, gdzie kanon daje
  nazwane byty (zasada: pozycja ze źródeł, nigdy z kursora).
- Raster review po każdej zmianie (L10): resvg → PNG → ogląd całości
  i cropów; wnioski do audytu/handoffu.
- Map T1/T2 nie dotykamy (L18 pkt 3).

## Krok 5 — zamknięcie

`content/co-nowego.md` (godzina publikacji Europe/Warsaw, ADR 0029),
PROJECT_HISTORY, ROADMAP, handoff, opis PR kumulatywnie (L9/L19 —
dopiero po ostatnim commicie produktu). Pełne bramki na świeżym stanie.

## Bramki

`npm test` + `npm run build` + `map-audit` + `wiki-stats` + `git diff --check`
po każdym zielonym kroku = osobny commit + push (AGENTS.md §1.3).
