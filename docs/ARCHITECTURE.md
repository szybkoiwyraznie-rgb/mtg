# Architektura

Powiązania: [ADR 0001](decisions/0001-repo-zrodlem-prawdy-jednoplikowy-artefakt.md)
(źródło prawdy i artefakt), [ADR 0002](decisions/0002-czysty-javascript-esm-zero-zaleznosci.md)
(technologia), [ADR 0005](decisions/0005-szkielety-stron-i-protokol-wikilinkow.md)
(format treści), [ADR 0008](decisions/0008-tory-obrazow-fot-kon.md) (obrazy).

## Przepływ danych

```
collection/entries/*.md   ─┐
content/cards/*.md        ─┤
content/lore/*.md         ─┼─►  tools/build.mjs  ──►  dist/mtg-lore-codex.html
content/planes/*.md       ─┤      (parsuje frontmatter,     (jeden plik: HTML + CSS +
content/co-nowego.md      ─┤       markdown, wikilinki;      JS + dane JSON)
content/taxonomia.json    ─┤       liczy backlinki, tagi,
scryfall/*.json           ─┤       indeks wyszukiwania)
maps/<plan>/*             ─┘
```

Witryna jest **statyczna**: cała treść wstrzykuje się do artefaktu jako
`CODEX_DATA`; przeglądarka nie fetchuje niczego poza obrazami (druk
Scryfalla, online) i próbami torów FOT/KON (tylko lokalny tryb `file://`).

## Moduły silnika (`src/codex/`)

| Moduł | Odpowiedzialność | Środowisko |
|---|---|---|
| `frontmatter.js` | ścisły podzbiór YAML → obiekt | node (build, testy) + przeglądarka |
| `markdown.js` | markdown (podzbiór) → HTML, z wikilinkami | j.w. |
| `links.js` | składnia `[[slug|etykieta]]` — parsowanie/serializacja | j.w. |
| `registry.js` | slug → strona; walidacje; backlinki; tagi | j.w. |
| `data.js` | dostęp do `CODEX_DATA` (zwraca pustą strukturę, gdy brak) | przeglądarka |
| `router.js` | routing po hashu `#/…` | przeglądarka |
| `render-*.js` | renderery stron (główna, karta, hasło, plan, listy, tagi, co-nowego, szukaj) | przeglądarka |
| `main.js` | start: router + pierwsze renderowanie | przeglądarka |

Moduły czyste (bez DOM) są importowane zarówno przez build (ESM w node),
jak i sklejane do artefaktu — spójność gwarantuje `tools/module-graph.mjs`
(kolejność „najgłębsze pierwsze", twardy błąd przy cyklu i kolizji nazw).

## Jednoplikowy artefakt i dwa tryby

Dziedziczone z mtg-game (ADR 0011 tam): moduły ESM po sklejeniu dzielą
jeden zasięg (`stripModuleSyntax` usuwa import/export), więc artefakt
działa z `file://` (brak żądań cross-origin). Na Pages ten sam artefakt
jest serwowany jako `index.html`. Nawigacja wyłącznie po hashu — działa
identycznie w obu trybach.

## Tory obrazów Karty Katalogowej (ADR 0008)

1. druk Scryfalla (`image_uris.normal|large` ze snapshotu) — domyślny,
   wymaga sieci;
2. `./img/<imgId>FOT.png` — panorama, wyłącznie lokalnie;
3. `./img/<imgId>KON.png` — bestiariusz, j.w.;
4. twarz syntetyczna (nazwa + kolory) — fallback, gdy sieć i pliki zawiodą.

Próba załadowania toru FOT/KON kończy się cichym ukryciem przycisku
(`onerror`) — na Pages tych torów po prostu nie widać.

## Testy integralności (co pilnują)

| Test | Pilnuje |
|---|---|
| `test/schemat-tresci.test.js` | frontmatter wg typu strony, unikalność slugów, tagi wg taxonomii, formaty |
| `test/wikilinki.test.js` | każdy `[[link]]` się rozwiązuje; brak linków do siebie |
| `test/parosc-kolekcji.test.js` | wpis kolekcji ↔ Karta Katalogowa 1:1 (ADR 0003) |
| `test/pokrycie-scryfall.test.js` | każda karta ma kompletny snapshot Oracle (ADR 0004) |
| `test/mapy.test.js` | struktura `maps/`, pinezki → istniejące karty, plan↔mapa (ADR 0007) |
| `test/rejestr-adr.test.js` | rejestr ADR: numeracja, statusy, tabela README |
| `test/dokumentacja-budzet-lektury.test.js` | budżet lektury startowej < 100 tys. tokenów |
| `test/artefakt.test.js` | build produkuje kompletny artefakt |

Runner: `tools/run-tests.mjs` (tier fast/slow/all, manifest
`tools/test-manifest.json`); CI biega `all`.
