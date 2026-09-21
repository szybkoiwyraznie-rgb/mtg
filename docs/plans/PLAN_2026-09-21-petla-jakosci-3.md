# Plan sesji — trzy Pętle Jakości (2026-09-21)

## Cel

Na zlecenie właściciela wykonać trzy pełne, kontrolowane przebiegi Pętli
Jakości po dostawie 235RTR: integralność, pogłębienie lore, link-mining oraz
pass mapowy wyłącznie w zakresie uzasadnionym kanonem i stanem map.

## Przebieg każdej pętli

1. wybrać istniejące hasło lub encję na podstawie progu i braków;
2. uzupełnić lore wyłącznie z cytowalnych źródeł;
3. przeliczyć wikilinki i próg dwóch kart;
4. wzbogacić mapę T3/T4 tylko o nazwane, uzasadnione POI/biomy — bez
   przesuwania pinezek kart i bez haseł z własnymi pinezkami;
5. dodać regresję, jeśli zmiana wymaga nowego kontraktu;
6. uruchomić testy i build, a zielony etap zakończyć osobnym commitem.

## Granice

- `collection/entries/` pozostaje verbatim i read-only.
- Nie materializować nowych haseł poniżej progu dwóch kart.
- Nie generować grafik ani nie dodawać źródeł internetowych bez URL-a.
- ADR 0043: mapa oznacza wyłącznie karty; hasła dostają deep-linki.
- Map T1/T2 i pinezek kart nie zmieniamy w passach jakościowych.

## Kryteria końca

- trzy ukończone pętle opisane w dokumentacji,
- testy, build, `map-audit` i `wiki-stats` zielone,
- aktualny handoff po ostatnim commicie produktu,
- PR #39 z kumulatywnym opisem.
