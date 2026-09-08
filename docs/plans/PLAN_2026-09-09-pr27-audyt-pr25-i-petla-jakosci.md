# PLAN_2026-09-09 — audyt PR-25 i Pętla Jakości

Sesja `arena/01a08327-mtg`.

## Kontekst

Właściciel zlecił kontynuację projektu „wg AGENTS”, czyli w obowiązkowej
kolejności:

1. **audyt poprzedniego scalonego PR** (`#25`),
2. **Pętla Jakości** (integralność → pogłębianie lore → link-mining →
   pass mapowy → co-nowego).

Start sesji wykonany zgodnie z `AGENTS.md` i `ENVIRONMENT.md`: pełna
lektura obowiązkowa, `git fetch --unshallow origin` (klon startowy był
płytki), weryfikacja vision (`read_file` na `maps/forgotten-realms/l0.jpg`)
oraz wystawiony preview `dist/` na porcie 8000.

## Faza 0 — PR na starcie

Przed dalszą pracą sesja zakłada własny PR z tej gałęzi i utrzymuje jego
opis kumulatywnie po każdym commicie (L9). Ten plan jest minimalnym
wkładem otwierającym PR.

## Faza 1 — audyt PR-25 (`21a6b09..207463d`)

Zakres audytu:

- integralność po merge: `npm test`, `npm run build`, `python3 tools/map-audit.py`;
- przegląd zmian proceduralnych: ADR 0040, 0041, 0042, 0043; zgodność
  rejestru ADR, gidów i testów ze stanem repo;
- przegląd zmian treściowych: karta `3clb-nefarious-imp`, hasło
  `mephidross`, plan `forgotten-realms`, korekty kart po ADR 0042,
  zmiany `content/co-nowego.md` i dokumentacji;
- przegląd zmian mapowych i buildowych: Dominaria L0/L1 bez L2,
  Forgotten Realms T1+LOD+POI, miniatury, czyszczenie `dist/`, regresje
  w `render-map.js`, `build.mjs`, `content-loader.mjs`, `wiki-stats.mjs`;
- przegląd plików binarnych i wygenerowanych: czy manifesty, kafle,
  miniatury i mastery są spójne z `map.json` i nie dublują danych wbrew ADR 0027.

Wynik: `docs/audits/AUDYT_2026-09-09-PR25.md` z listą znalezisk,
priorytetami i kolejką napraw dla tej sesji.

## Faza 2 — naprawy z audytu (jeśli znajdą się istotne wady)

Każda naprawa ma być chirurgiczna i domknięta zielonym krokiem
(`npm test` + `npm run build`; przy mapach także `python3 tools/map-audit.py`)
przed osobnym commitem i pushem.

## Faza 3 — Pętla Jakości po audycie

1. **Rozpoznanie i integralność** — świeży stan po naprawach.
2. **Pogłębianie lore** — wybór 1–3 najsłabszych stron wg kryteriów
   z `docs/guides/PETLA_JAKOSCI.md` (sekcje, źródła, długość, boldy,
   pinezka gdzie dotyczy).
3. **Link-mining** — sprawdzenie encji wspólnych dla ≥2 kart; nowe hasło
   tylko gdy przekroczony próg i bez mieszania różnych bytów pod jedną nazwą.
4. **Pass mapowy** — kompletność i jakość map zgodnie z ADR 0015/0043;
   dla T1/T2 bez nieuprawnionego „ubogacania” podkładu, dla T3/T4 z naciskiem
   na proweniencję i poprawność kotwic.
5. **Domknięcie** — `content/co-nowego.md`, handoff sesji, aktualizacja
   opisu PR.

## Kryteria akceptacji

- istnieje PR tej sesji przed pracą merytoryczną,
- powstaje audyt PR-25 zapisany w repo,
- każda naprawa / krok Pętli Jakości ma własny zielony commit i push,
- końcowo: `npm test`, `npm run build`, `python3 tools/map-audit.py` zielone,
- opis PR odzwierciedla cały zakres wykonanej pracy.
