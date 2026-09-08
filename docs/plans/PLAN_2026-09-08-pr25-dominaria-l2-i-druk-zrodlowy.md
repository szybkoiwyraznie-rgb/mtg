# PLAN_2026-09-08 — Dominaria bez nakładki L2 + procedura druku źródłowego (recenzja właściciela)

Sesja `arena/01a081d0-mtg`.

## Kontekst

PR-24 (scalony `21a6b09`) przyniósł pierwszą wersję mapy Dominarii (piramida
LOD: L0 + kafle L1 + nakładka L2 „Domeny") i kartę 40USG Expunge. Sesja
agentska zawiesiła się tuż po oddaniu wersji — recenzja właściciela nie
dotarła wtedy i wpłynęła z nową sesją (2026-09-08, czat). Trzy wątki:

1. **(1) Deep-zoom Aerony nic nowego nie wnosi** — „to jest ta sama mapa
   tylko wycięta z tej dużej". Mapa ma się składać z DWÓCH elementów:
   jednej dużej całościowej mapy FHD (L0) + mapa kafelkowa (L1) od pewnego
   poziomu zoomu. Usunąć deep-mapę Aerony.
2. **(2) Naruszenie procedury przy karcie** — oryginalne ilustracje z kart
   NIE SĄ kanoniczną częścią wpisu; kanoniczne są TYLKO ilustracje FOT i KON
   (agent nie ma do nich dostępu). JAKIEKOLWIEK nawiązywanie do ilustracji
   na oryginalnej karcie i wnioskowanie na jej podstawie jest niezgodne
   z procedurą (i to nie pierwszy raz). Wpisać na sztywno do ADR-ów;
   poprawić wszystko, co odnosi się do ilustracji Moellera: umiejscowienie
   pinezki, strona karty Expunge, „może jeszcze gdzieś".
3. **(3) Pytanie o ZIP** — pliki `maps/*.html` w archiwum są bardzo duże;
   czy zawierają już dane z katalogów planów (podkłady)? Czy to dublowanie,
   czy pliki w katalogach są potrzebne?

## Faza 0 — audyt PR-24 (AGENTS.md §5)

Zakres `eca14c0..21a6b09` (silnik LOD, mapa Dominarii, karta 40USG,
ADR 0039, L14, 81+ plików).

- Integralność: `npm test` 157/157, `npm run build` zielony (22 strony),
  drzewo czyste; klon był płytki → `git fetch --unshallow` na starcie
  (ENVIRONMENT §2a) — stopki dat prawdziwe.
- Ogląd rastrowy (L10): cropy M1 i D1 w rejonie Benalia/Sursi — etykieta
  i ikona **Cathedral of Serra widoczne na masterze M1** (gęsta toponimia:
  Sursi, Kish, Foriys, Nelanther…) — pinezka może siedzieć na nazwanym
  obiekcie bezpośrednio w układzie złotym, bez nakładki.
- Znaleziska: **F1 (właściciel, P0)** — druk źródłowy jako źródło sceny
  i uzasadnienia pinezki (karta 40USG + `uzasadnienie` pinezki w map.json);
  **F2 (właściciel, P1)** — nakładka L2 bez nowego detalu (wycinek bazy);
  **F3 (P2)** — 393DKA Źródła: „ilustracja: Austin Hsu, Dark Ascension";
  **F4 (P3)** — pinezka 40USG z odczytu D1 przez bbox L2, a nie z mastera
  (L13: mierz na docelowym pliku) — współrzędne potwierdzone wizją
  (ikona ≈ (1547, 2020) vs stare (1552, 2023));
  **F5 (P3)** — notki kotwic i `uklad_wspolrzednych` spięte z L2/D1
  (Icehaven „residuum kalibracji L2", Kieve „punkt kalibracyjny L2",
  Tolaria/Burning „skraj okna L2", Benalia „nakładka kalibracyjna M1/D1");
  **F6 (P3)** — research v2: „scena pochodzi w całości z odczytu artu";
  **F7 (P4)** — ADR 0039 §8 „L0 inline w stronie mapy" vs implementacja
  (L0 = linkowany `<img>`, nie inline — offline działa; litera ADR kłamie).

Raport: `docs/audits/AUDYT_2026-09-08-PR24.md`.

## Fazy (osobne zielone commity)

1. **ADR 0040** — druk źródłowy karty nie jest kanoniczny: tor obrazowy
   infoboksu tylko; zero nawiązań i wniosków w treści, pinezkach, Źródłach;
   FOT/KON = jedyne kanoniczne ilustracje (wzmocnienie ADR 0016 §2/0030;
   rejestr).
2. **ADR 0041** — pokrycie L2 ma wnosić detal nieobecny w bazie; wycinek
   bazy zabroniony; Dominaria = L0 + L1 (decyzja właściciela); ADR 0039
   dostaje „Uzupełnienie", rejestr.
3. **Treść** — karta 40USG: scena i osadzenie z Fabuły właściciela
   (verbatim, `collection/entries/`) + kanonu (mtg.wiki), nie z printu;
   pinezka: uzasadnienie z Fabuły (dziedziniec katedry, nieoznaczony
   dziedziniec → pewność region) + kanon Cathedral of Serra; 393DKA:
   usunięcie „ilustracja: Austin Hsu"; research v2: errata.
   **Strażnik mechaniczny (L12):** `test/druk-zrodlowy.test.js` — dla
   każdej Karty Katalogowej: brak „ilustracj*" w treści (dozwolone wyłącznie
   w linii z FOT/KON), brak „wignett*", brak nazwiska artysty ze snapshotu.
4. **Mapa** — `maps/dominaria/map.json`: usunięcie wariantu „domeny" (L2),
   pinezka 40USG zmierzona wprost na masterze M1 (L13), notki kotwic i
   `uklad_wspolrzednych`/`zrodlo` bez L2/D1; `git rm maps/dominaria/
   aerona.jpg`; `test/dominaria.test.js` — regresja negatywna (brak L2 na
   Dominarii) + kafle jak dotąd; `content/planes/dominaria.md` (usuwa się
   „okno zbliżenia L2"). Silnik map (mechanizm L2 w render-map.js)
   **pozostaje** — ADR 0039 obowiązuje dla przyszłych map z realnym detalem.
5. **ZIP (3)** — analiza i odpowiedź: `.html` niesie dane, bo strona mapy
   musi być samowystarczalna (`file://` blokuje `fetch`; ADR 0027 v2);
   pliki katalogów są dla mini-map (osobne strony); rastry NIE są inlinowane
   (brak dublowania); `midgar.html` = podmapa (ADR 0032); największy koszt =
   Lorwyn (2×8,3 MB SVG inline + pliki dla mini-map). `aerona.jpg` znika
   (−1,6 MB z repo i dist). Reszta = struktura ADR 0027 v2; opcje
   zmniejszające (np. miniatury wektorowych podkładów) → backlog, decyzja
   właściciela.
6. **Domknięcie** — `content/co-nowego.md`, `docs/ROADMAP.md`,
   `docs/PROJECT_HISTORY.md`, handoff, opis PR (L9), podgląd przebudowany.

## Kryteria akceptacji

- Testy + build + `map-audit` zielone na każdym commicie.
- Zero „ilustracj*" i nazwisk artystów w treści kart (strażnik pilnuje);
  pinezka 40USG bez odniesień do printu, współrzędne z odczytu mastera.
- Dominaria: jeden wariant (t1: l0 + kafle 16×11×512, S1 2.5), brak
  `aerona.jpg` w repo i dist; podgląd: L0 → kafle na zoomie, pinezka na
  Cathedral of Serra.
- ADR 0040/0041 w rejestrze; test rejestru ADR zielony.
