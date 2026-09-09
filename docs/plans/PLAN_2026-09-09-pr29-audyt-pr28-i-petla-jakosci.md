# PLAN_2026-09-09 — audyt PR-28 i Pętla Jakości

Sesja `arena/01a0874a-mtg`.

## Kontekst

Właściciel zlecił kontynuację projektu „wg AGENTS”, czyli w obowiązkowej
kolejności:

1. **audyt poprzedniego scalonego PR** (`#28`),
2. **Pętla Jakości** (ADR 0006/0015): integralność → pogłębianie lore →
   link-mining → pass mapowy → co-nowego.

Start sesji wykonany zgodnie z `AGENTS.md` i `ENVIRONMENT.md`: pełna
lektura obowiązkowa (AGENTS, ADR 0001–0046, LESSONS L1–L17, ENVIRONMENT,
PR-28, handoff PR-28), weryfikacja vision (`read_file` na
`maps/dominaria/l0.jpg` — działa) oraz wystawiony preview `dist/` na
porcie 8000.

Notatka środowiskowa: klon startowy był płytki, a pierwsze
`git fetch --unshallow origin` nie domknęło historii (brak obiektu
rodzica `0520ffc`); drugi odświeżenie naprawiło (pełna historia,
26 commitów, klon niepłytki). Build podglądu powstał z pełnej historii
(L11).

## Faza 0 — PR na starcie

Ten plan jest minimalnym wkładem otwierającym PR tej sesji; opis PR
utrzymuje się kumulatywnie po każdym commicie (L9).

## Faza 1 — audyt PR-28 (`98b1f02..0520ffc`, 41 plików, +6358/−120)

- **Integralność po merge:** `npm test` (176/176 — wyjaśnić deltę wobec
  169/169 w handoffie i 170/170 w opisie PR-28), `npm run build`
  (31 stron: 15 kart / 4 hasła / 12 planów — zgadza się z handoffem),
  `python3 tools/map-audit.py`.
- **Treść:** karta `610m19-gearsmith-prodigy` (LORE-first ADR 0030,
  Głos Kronikarza ADR 0042, druk źródłowy ADR 0040, widoczny termin
  „Fabuła” ADR 0026), strona planu `kaladesh.md`, `co-nowego.md`
  (format nagłówka ADR 0029), wpis kolekcji (verbatim), snapshot
  `scryfall/610m19-gearsmith-prodigy.json` (pole z ADR 0004), tagi
  (nowy `konstrukty` — słownik `content/taxonomia.json`).
- **Kasacja hasła `wybrzeze-mieczy` (L17):** brak resztek wikilinków,
  egzekucja progu ≥2 kart przez `test/prog-hasel.test.js`.
- **Mapa:** Kaladesh T4 — pierwsza mapa z `widok_domyslny` (ADR 0045) +
  płyta L2 Ghirapur (ADR 0046: kaflikowanie, las poza domami, mury poza
  obrysem, szew wodny); recenzja wizualna rastra całości + cropów (L10).
- **Kod:** `src/codex/render-map.js`, `tools/build.mjs`,
  `tools/map-audit.py`, `tools/mapforge/` (bloki/geom/render +
  generatory `kaladesh-plan-t4.py`, `kaladesh-ghirapur-l2.py`), testy
  (prog-hasel, lod, map-audit, mapa-warianty, mapforge, artefakt,
  ui-smoke).

Wynik: `docs/audits/AUDYT_2026-09-09-PR28.md` z listą znalezisk,
priorytetami i kolejką napraw dla tej sesji.

## Faza 2 — naprawy z audytu (jeśli znajdą się istotne wady)

Każda naprawa chirurgiczna i domknięta zielonym krokiem
(`npm test` + `npm run build`; przy mapach także `map-audit`) przed
osobnym commitem i pushem.

## Faza 3 — Pętla Jakości po audycie

1. **Rozpoznanie i integralność** — świeży stan po naprawach.
2. **Pogłębianie lore** — 1–3 strony; baza jest obecnie w 100%
  kompletności, więc wybór wg kryteriów wtórnych z
  `docs/guides/PETLA_JAKOSCI.md` (sekcje krótsze niż 3 zdania, chude
  Źródła, brak bold-encji; remis → starsza strona).
3. **Link-mining** — encje wspólnie noszone przez ≥2 karty, próg ≥2 kart
  egzekwowany testem (L17). Kolejka Kaladeshu z handoffu (Ghirapur,
  Konsulat, Greenwheel, eter, Targ Wynalazców) ma po 1 karcie — hasła
  NIE tworzyć z domysłu (L17: świadome zejście poniżej progu wymaga
  decyzji właściciela).
4. **Pass mapowy** — tylko mapy T3/T4 własne (zakres ubogacania,
  PETLA_JAKOSCI krok 4); najświeższa to Kaladesh: weryfikacja POI
  względem źródeł z cytowaniem, korekty z proweniencją, `map-audit` 0,
  ogląd rastra. Nowe POI wyłącznie z kanonu, z etykietą i uzasadnieniem
  (ADR 0023/0043).
5. **Domknięcie** — `content/co-nowego.md`, handoff sesji, aktualizacja
  opisu PR.

## Kryteria akceptacji

- istnieje PR tej sesji przed pracą merytoryczną,
- powstaje audyt PR-28 zapisany w repo,
- każda naprawa / krok Pętli Jakości ma własny zielony commit i push,
- końcowo: `npm test`, `npm run build`, `python3 tools/map-audit.py`
  zielone,
- opis PR odzwierciedla cały zakres wykonanej pracy.
