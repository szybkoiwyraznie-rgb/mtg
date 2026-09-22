# Plan sesji — kontynuacja Pętli Jakości (2026-09-21)

## Cel

Kontynuować projekt po scaleniu PR-36 zgodnie z `AGENTS.md`, bez nowej
jawnej dostawy karty: najpierw audyt poprzedniego PR, potem bezpieczny przebieg
Pętli Jakości.

## Zakres

1. Audyt zmienionych plików PR-36 pod kątem ADR-ów, kanonu, proweniencji,
   kompletności sekcji i regresji map.
2. Bramki bazowe: `npm test`, `npm run build`, `python3 tools/map-audit.py`
   oraz `node tools/wiki-stats.mjs`.
3. Jedno lub więcej pogłębień lore wyłącznie na podstawie istniejących,
   cytowalnych źródeł; bez tworzenia haseł poniżej progu dwóch kart.
4. Link-mining encji, które osiągnęły próg, oraz pass mapowy wyłącznie dla
   map T3/T4, z zachowaniem ADR 0043 i bez naruszania pinezek kart.
5. Aktualizacja dokumentacji zamknięcia sesji dopiero po ostatnim commicie
   produktu.

## Granice

- `collection/entries/` pozostaje verbatim i read-only.
- Nie generować grafik; nie dodawać danych bez źródła.
- Każdy zielony krok produktu kończyć osobnym commitem i pushem.
- Nie zmieniać gałęzi sesji ani nie wykonywać force push.

## Kryteria akceptacji

- Audyt w `docs/audits/` z wnioskami i naprawami, jeśli będą potrzebne.
- Wszystkie testy, build, audyt map i statystyki zielone.
- Zmiany treści mają cytowania, kompletne wikilinki i poprawne deep-linki.
- Końcowy handoff podaje rzeczywiste wyniki ostatniego przebiegu.
