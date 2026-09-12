# Plan 2026-09-12 — Pętla Jakości Mirrodinu

**Zlecenie właściciela:** kontynuować Pętlę Jakości w kolejnym planie po
Dominarii.

**Wybór planu:** Mirrodin — 4 karty w bazie, istniejące hasła `nowa-phyrexia`,
`mephidross`, `oxidda-chain`, `auriok` i dwa progi odblokowane przez
`347NPH Pristine Talisman`: Ortodoksja Maszyn (`476MBS` + `347NPH`) oraz
Vulshokowie (`556NPH` + `347NPH`).

## Lista działań

1. [x] Sprawdzić stan repo po pętli Dominarii i wybrać kolejny plan z ≥2
   kartami.
2. [x] Przeczytać aktualne karty Mirrodinu, stronę planu, mapę i istniejące
   hasła powiązane.
3. [x] Zweryfikować źródła dla progowych encji: WotC *Machine Orthodoxy*,
   WotC *All Will Be One*, MTG Wiki `Vulshok`, `Oxidda Chain`,
   `Koth of the Hammer`, `New Phyrexia (plane)`.
4. [x] Utworzyć hasła `ortodoksja-maszyn` i `vulshok` zgodnie z progiem
   dwóch kart, bez frontmatterowych pinezek, z deep-linkami mapowymi.
5. [x] Dopisać wikilinki w kartach `347NPH`, `476MBS`, `556NPH`, na planie
   Mirrodinu oraz w hasłach `nowa-phyrexia`, `auriok`, `oxidda-chain`.
6. [x] Zaktualizować `maps/mirrodin/map.json`: notki kotwic i pinezek bez
   tworzenia nowych pinezek dla haseł.
7. [x] Dodać regresję `test/mirrodin-link-mining.test.js` dla progów,
   wikilinków, deep-linków, braku pinezek haseł i rozdzielenia epok.
8. [x] Dopisać dokumentację/changelog: `content/co-nowego.md`,
   `docs/backlog.md`, `docs/PROJECT_HISTORY.md`.
9. [x] Uruchomić walidację: `npm test`, `npm run build`,
   `python3 tools/map-audit.py`, `node tools/wiki-stats.mjs --json`,
   `git diff --check`.
10. [x] Jeśli bramki są zielone, commit i push na `arena/01a095bf-mtg`,
    a następnie aktualizacja PR #33.

## Weryfikacja końcowa

- `npm test` — 250/250 testów, 0 failures.
- `npm run build` — 82 strony (40 kart, 27 haseł, 15 planów), 853 pliki
  drzewa archiwum, artefakt 1480.2 kB.
- `python3 tools/map-audit.py` — RAZEM PROBLEMÓW: 0.
- `node tools/wiki-stats.mjs --json` — średnia 7,3/8, 100%, brak braków.
- `git diff --check` — czysty.

## Wynik zakresu

- Nowe hasła: `content/lore/ortodoksja-maszyn.md`, `content/lore/vulshok.md`.
- Karty objęte link-miningiem: `347nph-pristine-talisman`,
  `476mbs-banishment-decree`, `556nph-ruthless-invasion`.
- Mapa: bez nowego rysunku i bez pinezek haseł; Ortodoksja odsyła do
  regionalnej sceny 476MBS przy Razor Fields / Cave of Light, a Vulshokowie
  do regionu Oxidda Chain.
