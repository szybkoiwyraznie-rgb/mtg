# Handoff sesji PR-40 — audyt PR-39, Pętla Jakości (Temur, Ardenvale), pass mapowy Eldraine, naprawa UI „W kolekcji"

- **Data:** 2026-09-29
- **Gałąź:** `arena/01a0ed7e-mtg`
- **PR:** #40 — <https://github.com/szybkoiwyraznie-rgb/mtg/pull/40>
- **Status:** wszystkie bramki zielone; PR czeka na decyzję właściciela.

## Zakres

1. **Audyt PR-39** (`docs/audits/AUDYT_2026-09-29-PR39.md`) — bez P0/P1.
   - Z1 naprawione: `604zen-vampires-bite` linkuje teraz [[velen|Velen]]
     (regresja w `test/wiedzmin-604zen.test.js` zaktualizowana o wikilink).
   - Z2 naprawione: `9war-toll-of-the-invasion` linkuje [[nicol-bolas|Nicola Bolas]]
     (asercja w `test/ravnica-9war.test.js`).
   - Z3 rozstrzygnięte: Temur i Ardenvale → hasła (poniżej); Shifting Wastes
     i Abzan na progu o niskim ciężarze, ainok na pełnym progu — wszystko
     opisane w `docs/backlog.md` (sekcja „Link-mining Tarkiru i Eldraine").
2. **Hasło `temur`** (`content/lore/temur.md`, klasa spolecznosc, plan Tarkir,
   tagi: klany-tarkiru, szamanizm, lowy) — próg 509KTK + 68KTK. Źródła:
   mtg.wiki Temur Frontier, Planeswalker's Guide to Tarkir (KTK i TDM).
   Wikilinki: 509ktk, 68ktk, plan tarkir, hasło qal-sisma. Deep-link:
   `#/mapa/tarkir?x=0.1914&y=0.2377` (Temur Frontier; ADR 0043 — bez pinezki).
3. **Hasło `ardenvale`** (`content/lore/ardenvale.md`, klasa geografia, plan
   Eldraine, tagi: geografia, doktryna, magia) — próg 138MID + 209ELD.
   Źródła: mtg.wiki Ardenvale, Wilds of Eldraine Ep. 1 (Pure of Heart).
   Wikilinki: 138mid, 209eld, plan eldraine. Deep-linki: Castle Ardenvale
   i grań Choking Drum.
4. **Pass mapowy Eldraine (krok 4, T4, L18):**
   - Nowe kanoniczne POI (mtg.wiki/Ardenvale i /Kenrith, *The Wildered
     Quest*): grań **Choking Drum** (pasmo + kotwica `pasmo-górskie`),
     **Giant's Jaw Hill** i **The Crown Crag** (szczyty na końcach grani),
     **Kenrith Town** i **Kenrith Coombe** (osady kantonu Kenrith).
   - **Wesling** przeniesiona z NE na trakt ku Vantress (kanon: „pół dnia
     jazdy na zachód od zamku"); trakt-vantress poprowadzony przez dolinę
     Wealdrum i przełęcz u Giant's Jaw Hill.
   - Tafla **Glass Tarn** cofnięta o ~25 px ku dolince, żeby grań mieściła
     się między jeziorem a Beckborough bez „gór stojących w wodzie".
   - **Naprawa dryfu generator↔map.json:** regeneracja z
     `tools/mapforge/eldraine-scena-t4.mjs` zgubiłaby pinezkę 138MID
     (istniała tylko w map.json). Pinezka wpisana do generatora — od teraz
     regeneracja jest pełna i powtarzalna.
   - Map.json: 41 kotwic (było 36); notka źródłowa opisuje pass
     2026-09-29 obok wpisu PR-35.
   - **Region Temur na Tarkirze:** zweryfikowany bez zmian — wszystkie
     kanoniczne kotwice (Temur Frontier, Qal Sisma, Karakyk Valley,
     Eternal Ice, Staircase of Bones, Dragon's Throat, Whisperwood,
     Rainveil Forest, Glintglaze Lake, Tomb of the Spirit Dragon) obecne
     z etykietami; deep-link hasła temur trafia w kotwicę.
5. **Przegląd rastra (L10) — metodologia:** agent sesji nie miał możliwości
   oglądania obrazów, więc raster 2000×1400 sprawdzono sondami
   programatycznymi (geometria grani vs elipsy jezior/POI/drogi + próbkowanie
   pikseli @resvg: podstawa grani 0/37 punktów w jeziorach, wnętrze tafla
     czyste od glifów, glify wszystkich nowych POI renderują się, 0 kolizji
   etykieta×obce POI, map-audit 0). Sondy żyły poza repo (reguła ENVIRONMENT
   §1a) i zniknęły z sesją; przy najbliższej sesji z wizją warto obejrzeć
   crop domeny Ardenvale (600–1300 × 350–950) okiem.
6. **Naprawa UI (render-lore.js):** 22 hasła z ręcznie dopisaną sekcją
   „W kolekcji" renderowały ją podwójnie (ręczna + automatyczna lista
   backlinków). Renderer pomija teraz sekcję automatyczną, gdy hasło ma
   własną; treść ręcznych sekcji zachowana 1:1. Regresja w
   `test/ui-smoke.test.js` iteruje po wszystkich hasłach realnej bazy
   i pilnuje ≤1 nagłówka „W kolekcji" (plus sprawdza obie konwencje:
   ręczną ghirapur i automatyczną novigrad).
7. **Backlog** (`docs/backlog.md`): zdjęto Temur/Ardenvale/Qal Sisma
   z kolejki; dodano sekcję „Link-mining Tarkiru i Eldraine" z oceną
   ainok (pełny próg — pierwszokolejny kandydat następnego przebiegu,
   budżet 2 haseł tego przebiegu zużyty), Shifting Wastes i Abzan (próg
   o niskim ciężarze) oraz Mardu/Karakyk/Summer Landing/Eternal Ice/
   Dragon's Throat/The Scour (1 karta).

## Bramki końcowe

- `npm test` — 379/379 testów zielonych (+1 regresja „W kolekcji");
- `npm run build` — 135 stron (63 karty, 54 hasła, 18 planów);
- `python3 tools/map-audit.py` — 0 problemów;
- `node tools/wiki-stats.mjs` — 100% (temur i ardenvale pełne 6/6).

## Commity (gałąź `arena/01a0ed7e-mtg`)

1. `e7477b1` — plan sesji (docs/plans/PLAN_2026-09-29-petla-jakosci.md);
2. `b3e69e1` — audyt PR-39 (Z1/Z2/Z3 + bramka bazowa);
3. `9d9d52f` — hasło Temur + wikilinki z kart, planu i qal-sisma;
4. `24cfa1c` — hasło Ardenvale + wikilinki z kart i planu Eldraine;
5. `1b8c45a` — Z1+Z2: wikilinki 604ZEN→velen, 9WAR→nicol-bolas + regresje;
6. `29d0f72` — UI: jedna sekcja „W kolekcji" (render-lore.js) + regresja;
7. `80e9bb9` — pass mapowy Eldraine (Choking Drum, Kenrith, Wesling,
   pinezka 138MID w generatorze);
8. `1d9dbb6` — backlog: rozpoznanie po audycie i passie;
9. zamknięcie — co-nowego, PROJECT_HISTORY, ROADMAP, ten handoff.

## Następna sesja — punkty startowe

- **ainok** — na pełnym progu (68KTK główna scena + 509KTK wzmianka);
  przed hasłem rozstrzygnąć zakres (rasa psia ogółem vs ainokowie Qal Sisma
  vs pobratymcy z pustyń Abzan — karta 68KTK sama rozróżnia te grupy).
- Obejrzeć okiem crop domeny Ardenvale z rastra (patrz pkt 5) — sondy
  czyste, ale oko agenta było niedostępne.
- Kolejki w backlogu bez zmian: Śródziemie (crebain/dunland/isengard/…),
  Zendikar, Ravnica, Warhammer, Forgotten Realms — wszystkie czekają na
  drugie karty.
- PR #40 zostawiony do scalenia właścicielowi (opis PR skumulowany
  przez `gh api` — GraphQL edit nie działa, patrz LESSONS).
