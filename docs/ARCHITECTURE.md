# Architektura

Powiązania: [ADR 0001](decisions/0001-repo-zrodlem-prawdy-jednoplikowy-artefakt.md)
(źródło prawdy), [ADR 0002](decisions/0002-czysty-javascript-esm-zero-zaleznosci.md)
(technologia), [ADR 0005](decisions/0005-szkielety-stron-i-protokol-wikilinkow.md)
(format treści), [ADR 0008](decisions/0008-tory-obrazow-fot-kon.md)
(obrazy), [ADR 0027](decisions/0027-rozdzielenie-artefaktu-mapy-osobno.md)
(drzewo HTML map).

## Przepływ danych

```text
collection/entries/*.md   ─┐
content/cards/*.md        ─┤
content/lore/*.md         ─┼─►  tools/build.mjs  ──►  dist/mtg-lore-codex.html
content/planes/*.md       ─┤      (parsuje frontmatter,         + dist/index.html
content/co-nowego.md      ─┤       markdown, wikilinki;         + dist/maps/<plan>.html
content/taxonomia.json    ─┤       liczy backlinki, tagi,       + dist/maps/<plan>/<podklad>
scryfall/*.json           ─┤       indeks wyszukiwania,         + dist/mtg-lore-codex.zip
maps/<plan>/*             ─┘       metadane czasu)
```

Repozytorium pozostaje **jedynym źródłem prawdy**: markdown, snapshoty
Scryfalla i pliki map są danymi wejściowymi; `dist/` jest wyłącznie
artefaktem buildu.

## Runtime witryny

- **Artefakt główny** (`mtg-lore-codex.html` / `index.html`) zawiera kod,
  style i pełne `CODEX_DATA` dla stron treściowych.
- **Mapy planów** działają jako osobne, samowystarczalne strony
  `maps/<plan>.html`, osadzane przez `<iframe>` (ADR 0027 v2). Dzięki temu
  wersja `file://` zachowuje pełną funkcjonalność map bez `fetch`.
- Przeglądarka dociąga tylko zasoby obrazowe: druk Scryfalla (online),
  lokalne FOT/KON (`./img/...`) i surowy podkład mini-map / strony mapy
  z tego samego drzewa `dist/maps/**`.

## Moduły silnika (`src/codex/`)

| Moduł | Odpowiedzialność | Środowisko |
|---|---|---|
| `frontmatter.js` | ścisły podzbiór YAML → obiekt | node (build, testy) + przeglądarka |
| `markdown.js` | markdown (podzbiór) → HTML, z wikilinkami | j.w. |
| `links.js` | składnia `[[slug\|etykieta]]` — parsowanie/serializacja | j.w. |
| `registry.js` | slug → strona; walidacje; backlinki; tagi | j.w. |
| `data.js` | dostęp do `CODEX_DATA` (pusta struktura, gdy brak) | przeglądarka |
| `router.js` | routing po hashu `#/…` | przeglądarka |
| `render-*.js` | renderery stron (główna, karta, hasło, plan, listy, tagi, co-nowego, szukaj, mapa) | przeglądarka |
| `main.js` | start: router albo tryb strony mapy (`CODEX_MAPA`) | przeglądarka |

Moduły czyste (bez DOM) są importowane przez build i testy, a następnie
sklejane do artefaktu. Spójność pilnuje `tools/module-graph.mjs`
(kolejność „najgłębsze pierwsze", twardy błąd przy cyklu i kolizji nazw).

## Artefakt i dwa tryby użycia

- **Pages / serwer:** wejście przez `dist/index.html`, który jest kopią
  artefaktu głównego; mapy żyją obok w `dist/maps/**`.
- **Lokalnie z dysku:** właściciel otwiera rozpakowany pakiet ZIP
  (`index.html` + `maps/**`) przez `file://`; iframe'y ładują lokalne
  strony map bez degradacji funkcjonalnej.

Nawigacja pozostaje hashowa (`#/karta/...`, `#/plan/...`, `#/mapa/...`),
a komunikacja mapa ↔ artefakt główny odbywa się przez `postMessage`
(`codexHash`, `codexKarta`).

## Tory obrazów Karty Katalogowej (ADR 0008/0017)

1. druk Scryfalla (`image_uris.normal|large` ze snapshotu) — domyślny,
   wymaga sieci;
2. `./img/<imgId>FOT.png` — panorama, wyłącznie lokalnie;
3. `./img/<imgId>KON.png` — bestiariusz, j.w.;
4. twarz syntetyczna (nazwa + kolory) — fallback, gdy sieć i pliki zawiodą.

FOT/KON są częścią treści karty (ADR 0017), a brak plików kończy się
cichym fallbackiem.

## Testy integralności

| Test | Pilnuje |
|---|---|
| `test/schemat-tresci.test.js` | frontmatter wg typu strony, unikalność slugów, tagi wg taxonomii, formaty |
| `test/wikilinki.test.js` | każdy `[[link]]` się rozwiązuje; brak linków do siebie |
| `test/parosc-kolekcji.test.js` | wpis kolekcji ↔ Karta Katalogowa 1:1 (ADR 0003) |
| `test/pokrycie-scryfall.test.js` | każda karta ma kompletny snapshot Oracle (ADR 0004) |
| `test/mapy.test.js` | struktura `maps/`, pinezki → istniejące karty, plan↔mapa (ADR 0007/0027) |
| `test/rejestr-adr.test.js` | rejestr ADR: numeracja, statusy, tabela README |
| `test/dokumentacja-budzet-lektury.test.js` | budżet lektury startowej < 100 tys. tokenów |
| `test/artefakt.test.js` | build produkuje kompletny pakiet HTML + mapy + ZIP |
| `test/ui-smoke.test.js` | render i interakcje krytyczne: karty, plany, mapy, iframe, warstwa karty |

Runner: `tools/run-tests.mjs` (tier fast/slow/all, manifest
`tools/test-manifest.json`); CI biega `all`.
