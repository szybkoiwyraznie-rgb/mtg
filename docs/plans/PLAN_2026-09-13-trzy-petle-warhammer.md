# Plan 2026-09-13 — trzy Pętle Jakości Warhammer Fantasy

**Zlecenie właściciela:** „Poproszę 3 pętle jakości.”

**Wybór zakresu:** Warhammer Fantasy po `543ISD Wooden Stake` ma trzy większe
encje ponad progiem dwóch kart albo z wyraźną relacją między kartami: Imperium,
Zielonoskórzy i Góry Krańca Świata. Wszystkie wymagają osobnego rozdzielenia
zakresu od jednoscenowych bytów z Sylwanii.

## Pętla 1 — Imperium

1. [x] Zweryfikować, że karty `39mm2-brute-force`,
   `83mm2-gorehorn-minotaurs` i `543isd-wooden-stake` realnie mówią o
   Imperium albo jego prowincjach.
2. [x] Utworzyć hasło `content/lore/imperium.md` jako społeczność/polityczne
   państwo ludzi, nie jedną pinezkę geograficzną.
3. [x] Dopisać wikilinki w kartach i na stronie planu bez dodawania pinezki
   hasła do mapy.

## Pętla 2 — Zielonoskórzy

1. [x] Zweryfikować, że karty `39mm2-brute-force` i
   `312m13-goblin-battle-jester` przekraczają próg hasła zielonoskórych.
2. [x] Utworzyć hasło `content/lore/zielonoskorzy.md`, obejmujące orków,
   gobliny, Waaagh!, Gorka i Morka jako jeden zakres społecznościowy.
3. [x] Dopisać wikilinki w kartach i na stronie planu; osobne hasła Waaagh!
   i Gork/Mork zostawić w backlogu jako podzakres do przyszłej decyzji.

## Pętla 3 — Góry Krańca Świata

1. [x] Zweryfikować, że karty `312m13-goblin-battle-jester`,
   `39mm2-brute-force` i `543isd-wooden-stake` używają pasma jako realnej
   skali mapowej/geograficznej.
2. [x] Utworzyć hasło `content/lore/gory-kranca-swiata.md` jako geograficzne
   pasmo, z relacją do Karak Osiem Szczytów, Badlands, Sylwanii i Imperium.
3. [x] Dopisać wikilinki w kartach i na stronie planu bez pinezki hasła.

## Wspólne zamknięcie

1. [x] Zaktualizować `maps/warhammer-fantasy/map.json` tylko w metadanych
   kotwic/deep-linków, bez nowych pinezek haseł.
2. [x] Dodać regresję `test/warhammer-link-mining.test.js` dla trzech haseł,
   progów, wikilinków, deep-linków i ADR 0043.
3. [x] Uzupełnić `content/co-nowego.md`, `docs/backlog.md`, `docs/ROADMAP.md`,
   `docs/PROJECT_HISTORY.md`, handoff i opis PR #33.
4. [x] Uruchomić bramki: testy celowane, `npm test`, `npm run build`,
   `python3 tools/map-audit.py`, `node tools/wiki-stats.mjs --json`,
   `git diff --check`.
5. [ ] Commit + push na `arena/01a095bf-mtg`.

## Wynik bramek

- Baseline przed pętlami: `npm test` 292/292; `npm run build` 93 strony
  (47 kart, 31 haseł, 15 planów; artefakt 1637.1 kB; drzewo 148431.7 kB /
  853 pliki).
- Test celowany po zmianach:
  `node --test test/warhammer-link-mining.test.js test/mapy.test.js`
  → 13/13. Szerszy pakiet regresji Warhammer/ADR uruchomiony wcześniej w tej
  samej pętli również był zielony.
- `python3 tools/map-audit.py` → RAZEM PROBLEMÓW: 0.
- `node tools/wiki-stats.mjs --json` → 96 stron, wiki-stats 100% (7,3/8).
- `npm test` → 297/297.
- `npm run build` → 96 stron (47 kart, 34 hasła, 15 planów), artefakt
  1665.6 kB, drzewo 148901.8 kB / 853 pliki.
- `git diff --check` → czysty.
