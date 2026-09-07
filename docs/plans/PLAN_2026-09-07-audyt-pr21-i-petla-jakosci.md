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

- [x] Roadmapa → zielone `npm test` + `npm run build` → commit i push.
- [x] Otworzenie PR przed audytem właściwym i zmianami merytorycznymi —
  [#22](https://github.com/szybkoiwyraznie-rgb/mtg/pull/22), roadmapa `2188033`.

### A. Audyt PR #21 (przed naprawami i Pętlą)

- [x] Integralność: testy, build, map-audit, wiki-stats; porównanie
  z końcowym stanem handoffu, nie z jego historycznymi nagłówkami.
- [x] Pełna lista zmienionych plików i recenzja zmian względem bazy:
  kod/render/build/testy, treść/dostawy/snapshoty, mapy, dokumentacja.
- [x] Treść: Fabuła jako kotwica, LORE-first, Oracle, źródła,
  imgId ≠ collector_number, taxonomia, brak nieuprawnionych haseł.
- [x] Mapy: proweniencja i epoki, pinezki i złoty układ Tarkiru,
  spójność generator → scena → SVG, hydrologia, wiązania i styl.
- [x] Ogląd map zmienionych przez PR: całość + wycinki; kontrola
  przełącznika T1/T4 również behawioralna (nie sam markup testu smoke).
- [x] Raport `docs/audits/AUDYT_2026-09-07-PR21.md`: wyniki per plik/
  grupa, dowody usterek, priorytety i kolejka. Osobny zielony commit.

### B. Naprawy z audytu

- [x] Usterki naprawiane u przyczyny, każda spójna grupa z regresyjnym
  testem, kontrolą diffu oraz osobnym zielonym commitem i pushem.
- [x] Zmiany map tylko w źródłach/generatorach, następnie render i ogląd.
- [x] Rozstrzygnięcia wykraczające poza istniejące ADR-y → decyzja
  właściciela przed implementacją; żadnych cichych zmian kontraktu.

#### Kolejka z raportu (stan audytu: przed naprawami)

- [x] **A1 (P1):** epoki Tarkiru i tożsamość miejsc — korekta źródeł,
  generatora/sceny/mapy i treści; T1 oraz pinezka karty bez zmian.
  Wynik: 118/118 testów, 23 POI/61 etykiet/14 biomów, determinizm,
  map-audit i wiązania 0; ogląd całości, północy i Arashin.
- [x] **A2 (P2) + E1:** pełne snapshoty Scryfall i test obciętego JSON-a;
  E1 to analogiczny dług trzech starszych snapshotów, nie regresja PR #21.
  Odtworzono 5 pełnych odpowiedzi API (65–67 pól) z notką naprawczą;
  rdzeń Oracle/ID/koszt/typ/P/T/flavor bez zmian. Brama najpierw
  odrzuciła wszystkie 5 starych cache’ów; 2 regresje obciętej struktury.
- [x] **A3 (P2):** limit zoomu w układzie złotym, regresje zachowania
  T1→T4→T1 i T4→T1→T4 na obu granicach.
  7 testów zachowania kontrolera (przed naprawą 5 czerwonych);
  Chromium: Δ pinezki 0 px, bez utraty skali, również po powrocie.
  127/127 testów; część A6 o zakresie smoke poprawiona w L13/gidzie.
- [x] **A4 (P2):** przełącznik na małym ekranie nie zasłania pinezki;
  rzeczywiste kliknięcie w Chromium, nie samo sprawdzenie CSS.
  QA: 10/10 kliknięć + otwarcie/zamknięcie karty (320/390/600/768/1440 px,
  T1 i T4). Ogląd T4 ujawnił dodatkowo tłok podpisów: LOD uwzględnia
  szerokość, mobilne tytuły są mniejsze i nie urywają się na brzegu
  (bez przyklejania nazw regionów wyjeżdżających poza kadr). 130/130.
- [x] **A5 (P2):** usunięcie nieużywanej, drugiej kopii SVG w HTML mapy;
  kontrola danych buildu, starych map, miniatur i `file://`.
  Pomiar po A1–A4: HTML Tarkiru 8 482 236 → 4 516 019 bajtów
  (−3 966 217, około 47%). Regresja odrzuca płaską kopię markupu,
  zachowuje pełny SVG wariantu T4 i miniaturę T1. 130/130 testów;
  Chromium HTTP/`file://`: T1/T4, pinezka, skala i powrót poprawne.
- [x] **A6 (P3):** precyzyjny opis testów w L13/gidzie; status PR #21
  i zakresy roadmapy aktualne w punkcie kontrolnym po puszu A4/A5.
  Dodano historię, „Co nowego” i handoff; Pętla nadal jawnie otwarta.

Dowody: `docs/audits/AUDYT_2026-09-07-PR21.md` (rejestr 61/61 plików).
Bazowe 114 testów, determinizm 5 SVG i 2 generatorów, map-audit 0;
QA resvg i Chromium 149 poza repo. Wady wykryte mimo zielonych bram.

### C. Pętla Jakości (ADR 0006/0015)

- [x] Jawny ranking słabości stron; pogłębienie 1–3 stron LORE
  z kwerendą i cytowaniami, bez meta-informacji o wydrukach.
  Wykonane: Aerith Rescue Mission (motywacje, Hojo/Cetra, ostrożny
  opis przeszłości Clouda i rozróżnienie sceny od sekwencji gry) oraz
  Mirrodin (pamięć Tel-Jilad, Zniknięcie, Kemba i rozłam leonin).
  Flavor Aerith pozostaje jawnie nieobecny; numery, dostawy i pinezki bez zmian.
- [x] Link-mining: **Nowa Phyrexia** (`spolecznosc`, plan Mirrodin),
  wsparcie treścią 305ARB i 488SOM; 5 stron odsyłających (2 karty,
  3 plany). Jedno hasło, dwie odrębne wojny i rozdzielenie od starej
  Phyrexii; brak drugiego hasła na zapas. Test progu kart i backlinków UI.
  132/132, 15 stron (7 kart + 1 hasło + 7 planów). Stats surowe 98%:
  hasło społeczne dostaje 6/8 za brak NIEOBOWIĄZKOWEJ pinezki; pozostałe
  14 stron 8/8. Nie zmieniamy metryki ani nie dokładamy fikcyjnego punktu.
- [x] Pass mapowy: kompletność, dokładność i czytelność map własnych;
  naprawy map z audytu mogą stanowić jego wynik. T2 bez ingerencji
  w adoptowany line-art; T1 Tarkiru pozostaje źródłowym rastrem.

#### Ranking i wybór stron (po A1–A6)

Kontrola 130/130: wszystkie karty mają obowiązkowe sekcje, ≥2 źródła,
mapę/pinezkę i pogrubione encje. Kryteria 1–3 i 5 gidu nie wyłaniają
braków. Przy kryterium 4 oceniamy treść, nie samą interpunkcję:

1. **Aerith Rescue Mission** (2026-09-05): „Postacie i Byty” to dwa
   długie zdania wyliczające sylwetki, bez rozwinięcia relacji, długu
   wobec Aerith i celu badań Shinry. Pogłębić motywacje; Cloud jako
   deklarujący przeszłość SOLDIER, nie bezkrytyczne powtórzenie tej
   deklaracji. Flavor nie istnieje — nie wymyślać go dla długości sekcji.
2. **Mirrodin** (2026-09-06): jedyna strona 7/8, brak wychodzących
   wikilinków. Uzupełnić społeczny sens pamięci/Rebuking i Zniknięcia,
   rozdzielając porządek czasów Memnarcha od społeczeństwa epoki Scars;
   połączyć z istniejącą kartą Carapace Forger, bez kopiowania jej analizy.
3. Pozostałe strony: brak wyższego priorytetu wg kolejki; Tarkir został
   już merytorycznie poprawiony w A1. W tej części **2 pogłębienia**,
   nie rozszerzanie wszystkich stron ani dokładanie wydrukowych metadanych.

Kwerendy: 2 zapytania FFVII (ratunek Shinra, Cloud/SOLDIER), 2 zapytania
Mirrodinu (Rebuking/Vanishing, nonhuman cultures); rozwinięcie właściwych
sekcji źródeł (oryginalne FFVII, nie sklejanie scen z Remake). Oddzielna
kwerenda Nowej Phyrexii do oceny link-miningu. URL-e w treści stron.

### D. Zamknięcie

- [ ] Aktualne co-nowego (czas Europe/Warsaw), historia/roadmapa,
  handoff i ewentualne trwałe lekcje — bez powielania statusu.
- [ ] Pełne testy + świeży build + map-audit; aktualny podgląd.
- [ ] Czyste drzewo i wszystkie commity wypchnięte; opis PR aktualizowany
  kumulatywnie po każdym kroku merytorycznym. PR pozostaje do scalenia
  przez właściciela (Squash and merge).

## Punkt kontrolny po odnowieniu GitHuba

Właściciel wznowił połączenie i polecił wypchnąć zmiany. A4 (`6a3622d`)
i A5 (`1d2d4fd`) są na gałęzi sesji; opis PR aktualizowany kumulatywnie.
Dalsze zadanie to **C: pogłębianie i link-mining**, nie ponowienie audytu
ani odtwarzanie wykonanych napraw. Końcowe zamknięcie D po tej części.
Handoff: `docs/setup/HANDOFF_2026-09-07-pr22.md`.

## Poza zakresem

Nowe materializacje (brak dostawy), edycje archiwum `collection/entries/`,
nowe mapy na zapas, generowanie ilustracji, zmiany `.github/workflows/`,
nowe zależności, publikacja/scalanie i force push.
