---
title: "Plan sesji 2026-09-21 — audyt i Pętla Jakości"
date: 2026-09-21
status: active
---

# Plan sesji 2026-09-21 — audyt i Pętla Jakości

## Cel

Kontynuacja prac po scaleniu PR-36: audyt ostatniego scalonego PR, sprawdzenie integralności projektu i wykonanie kolejnych bezpiecznych kroków Pętli Jakości.

## Zakres

1. Audyt PR-36: przegląd zmienionych plików, zgodność z ADR-ami, kompletność źródeł i danych.
2. Integralność: weryfikacja testów, buildu, narzędzi i map-audytu.
3. Pogłębianie lore — wyłącznie po kwerendzie i z cytowaniami.
4. Link-mining: wyszukanie uzasadnionych brakujących powiązań.
5. Pass mapowy T3/T4: wzbogacenie i weryfikacja wybranej mapy, bez zmian T1/T2 i bez modyfikowania pinezek bez uzasadnienia.
6. Aktualizacja dokumentacji sesji: audyt, historia, roadmapa, changelog i handoff.

## Procedura

- Każdy samodzielnie zielony krok kończy się osobnym commitem.
- Po każdym kroku wykonywane są `npm test` i `npm run build`.
- Nie modyfikuję `collection/entries/`.
- Nie generuję grafik ani nie dodaję ciężkich zasobów.
- Praca odbywa się wyłącznie na gałęzi `arena/2026-09-21-audyt-i-petla`; scalanie pozostaje decyzją właściciela.
