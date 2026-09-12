# Plan 2026-09-12 — Pętla Jakości Dominarii

**Zlecenie właściciela:** „Pętla Jakości w kolejnym planie”.

**Wybór planu:** Dominaria — 4 karty w bazie, istniejące hasło `serra` i
czytelne progi link-miningu między kartami: oś Terisiare/Argoth/Kjeldor
(`362BRO` + `531M3C`) oraz oś Sursi/Katedra/Serranowa łaska (`40USG` +
`110DVD`).

## Lista działań

1. [x] Sprawdzić stan repo i rozpoznać kolejne plany z ≥2 kartami.
2. [x] Przeczytać aktualne karty Dominarii, stronę planu i istniejące hasło
   `serra`.
3. [x] Zweryfikować źródła dla encji progowych: `Terisiare`, `Argoth`,
   `Kjeldor`, `Disa`, `Lhurgoyf`, `Sursi`, `Cathedral of Serra`,
   `Church of Serra` oraz oficjalny *Planeswalker's Guide to Dominaria*.
4. [x] Utworzyć hasła `terisiare` i `sursi` zgodnie z progiem dwóch kart,
   bez frontmatterowych pinezek, z deep-linkami mapowymi.
5. [x] Dopisać wikilinki we wszystkich kartach progowych, na planie
   Dominarii i w istniejącym haśle `serra`.
6. [x] Zaktualizować `maps/dominaria/map.json`: kotwice Sursi/Terisiare,
   notki źródłowe, regionalna pewność i brak pinezek haseł.
7. [x] Dodać regresję `test/dominaria-link-mining.test.js` dla progu,
   wikilinków, deep-linków i mapowej dyscypliny ADR 0043.
8. [x] Dopisać dokumentację/changelog: `content/co-nowego.md`,
   `docs/backlog.md`, `docs/PROJECT_HISTORY.md`.
9. [x] Uruchomić walidację: `npm test`, `npm run build`,
   `python3 tools/map-audit.py`, `git diff --check`.
10. [x] Jeśli bramki są zielone, commit i push na `arena/01a095bf-mtg`,
    a następnie aktualizacja PR #33.

## Wynik zakresu

- Nowe hasła: `content/lore/terisiare.md`, `content/lore/sursi.md`.
- Karty objęte link-miningiem: `362bro-simian-simulacrum`,
  `531m3c-disa-the-restless`, `40usg-expunge`, `110dvd-serra-s-embrace`.
- Mapa: bez nowego rysunku i bez pinezek haseł; dodana regionalna kotwica
  `Sursi` na adresie Katedry Serran i uźródłowiona kotwica `Terisiare`.

## Weryfikacja końcowa

- `npm test` — 245/245 testów, 0 failures.
- `npm run build` — 80 stron (40 kart, 25 haseł, 15 planów), 853 pliki
  drzewa archiwum, artefakt 1460.0 kB.
- `python3 tools/map-audit.py` — RAZEM PROBLEMÓW: 0.
- `node tools/wiki-stats.mjs --json` — średnia 7,4/8, 100%, brak braków.
- `git diff --check` — czysty.
