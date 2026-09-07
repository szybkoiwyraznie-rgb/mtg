# Plan sesji — 2026-09-07: audyt PR #21 i Pętla Jakości

## Zlecenie i punkt odniesienia

Właściciel: „Kontynuuj zgodnie z AGENTS rozpoczynając od audytu
poprzedniego PR”. Poprzednia tura tej sesji obejmowała lekturę startową
(AGENTS, wszystkie ADR-y 0001–0035, LESSONS, ENVIRONMENT, opis PR #21
oraz najnowszy handoff) i uruchomienie podglądu, bez zmian w repo.

- Gałąź sesji: `arena/01a07d33-mtg` (jedyna gałąź pracy).
- Audytowany PR: [#21](https://github.com/szybkoiwyraznie-rgb/mtg/pull/21).
- Porównanie: `bbe6d34` (przed) → `6bf2fba` (po scaleniu); 61 plików.
- Stan odniesienia: 114/114 testów, build 14 stron (7 kart, 7 planów),
  7 map, pełna historia gita; podgląd na porcie 8000.
- Vision sprawdzone przez otwarcie rastra Tarkiru. Narzędzia pomocnicze
  i rastry QA wyłącznie poza repo; bez nowych zależności projektu.

## Kolejność

### 0. PR na starcie

- [ ] Roadmapa → zielone `npm test` + `npm run build` → commit i push.
- [ ] Otworzenie PR przed audytem właściwym i zmianami merytorycznymi.

### A. Audyt PR #21 (przed naprawami i Pętlą)

- [ ] Integralność: testy, build, map-audit, wiki-stats; porównanie
  z końcowym stanem handoffu, nie z jego historycznymi nagłówkami.
- [ ] Pełna lista zmienionych plików i recenzja zmian względem bazy:
  kod/render/build/testy, treść/dostawy/snapshoty, mapy, dokumentacja.
- [ ] Treść: Fabuła jako kotwica, LORE-first, Oracle, źródła,
  imgId ≠ collector_number, taxonomia, brak nieuprawnionych haseł.
- [ ] Mapy: proweniencja i epoki, pinezki i złoty układ Tarkiru,
  spójność generator → scena → SVG, hydrologia, wiązania i styl.
- [ ] Ogląd map zmienionych przez PR: całość + wycinki; kontrola
  przełącznika T1/T4 również behawioralna (nie sam markup testu smoke).
- [ ] Raport `docs/audits/AUDYT_2026-09-07-PR21.md`: wyniki per plik/
  grupa, dowody usterek, priorytety i kolejka. Osobny zielony commit.

### B. Naprawy z audytu

- [ ] Usterki naprawiane u przyczyny, każda spójna grupa z regresyjnym
  testem, kontrolą diffu oraz osobnym zielonym commitem i pushem.
- [ ] Zmiany map tylko w źródłach/generatorach, następnie render i ogląd.
- [ ] Rozstrzygnięcia wykraczające poza istniejące ADR-y → decyzja
  właściciela przed implementacją; żadnych cichych zmian kontraktu.

### C. Pętla Jakości (ADR 0006/0015)

- [ ] Jawny ranking słabości stron; pogłębienie 1–3 stron LORE
  z kwerendą i cytowaniami, bez meta-informacji o wydrukach.
- [ ] Link-mining: wspólne encje tylko przy progu ≥2 kart; brak
  kwalifikujących się encji odnotowany, bez tworzenia haseł na zapas.
- [ ] Pass mapowy: kompletność, dokładność i czytelność map własnych;
  naprawy map z audytu mogą stanowić jego wynik. T2 bez ingerencji
  w adoptowany line-art; T1 Tarkiru pozostaje źródłowym rastrem.

### D. Zamknięcie

- [ ] Aktualne co-nowego (czas Europe/Warsaw), historia/roadmapa,
  handoff i ewentualne trwałe lekcje — bez powielania statusu.
- [ ] Pełne testy + świeży build + map-audit; aktualny podgląd.
- [ ] Czyste drzewo i wszystkie commity wypchnięte; opis PR aktualizowany
  kumulatywnie po każdym kroku merytorycznym. PR pozostaje do scalenia
  przez właściciela (Squash and merge).

## Poza zakresem

Nowe materializacje (brak dostawy), edycje archiwum `collection/entries/`,
nowe mapy na zapas, generowanie ilustracji, zmiany `.github/workflows/`,
nowe zależności, publikacja/scalanie i force push.
