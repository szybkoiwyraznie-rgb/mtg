# Plan PR-32: naprawa wszystkich znalezisk audytu PR-31

- **Data:** 2026-09-11
- **Źródło:** `docs/audits/AUDYT_2026-09-11-PR31.md` (F1–F13).
- **Decyzja właściciela:** wariant mapy Eldraine **T4 został zatwierdzony** 2026-09-11. Zachowujemy T4, dokumentujemy zatwierdzenie i naprawiamy błędy kanonu, proweniencji, kompozycji oraz pinezki 209ELD.
- **Cel:** usunąć wszystkie P0–P3 z raportu, dodać brakujące strażniki repo-szerokie i domknąć dokumentację sesji.

## Kolejka

1. [x] **F1 — DFC:** oczyścić 118MID i 171ISD z nazw, flavoru i danych przeciwnych twarzy; oczyścić changelog; dodać repo-szeroki test nazw innych twarzy DFC.
2. [x] **F2 — 347NPH:** usunąć znak wodny z widocznej treści, wycofać nieźródłowe Razor Fields/Białą Kuźnię-Świątynię/bastion Elspeth, skorygować pinezkę oraz rozszerzyć strażnik ADR 0040 o watermark.
3. [x] **F3–F5, F8–F9 — Eldraine:** zachować zatwierdzone T4; zapisać decyzję; osadzić 209ELD zgodnie z Fabułą w Ardenvale; poprawić pewność; usunąć fałszywe relacje Castle Embereth/Burning Yard/Tournament Grounds i Cauldron/Locthwain; jawnie oznaczyć topologię jako umowną; wykonać pass wizualny i ponowny ogląd.
4. [x] **F6 — Alara:** wycofać niepotwierdzone POI Carmot Mines i Ruins of Vithia z mapy, planów i dokumentacji; zregenerować SVG deterministycznie.
5. [x] **F7 — źródła:** naprawić numerację cytowań Confluxu i nieźródłowe powiązanie Civilized Scholar ze Stensią.
6. [ ] **F10–F13 — zamknięcie/redakcja/storage:** poprawić dokumentację PR-31, rzeczywiste godziny changelogu, literówki oraz usunąć nieużywany rootowy `wiedzmin.jpg` (runtime LOD pozostaje bez zmian).
7. [ ] Dodać widoczny wpis naprawczy do `content/co-nowego.md`, zaktualizować historię/roadmapę i przygotować handoff PR-32.
8. [ ] Uruchomić pełne bramki: `npm test`, `npm run build`, `python3 tools/map-audit.py`, `node tools/wiki-stats.mjs`; obejrzeć Eldraine i Alarę przez vision; zaktualizować raport audytu statusem napraw i opis PR.

## Bramy akceptacji

- żadna Karta Katalogowa DFC nie ujawnia nazwy innej twarzy;
- żadna widoczna treść 347NPH nie używa watermarku ani nieźródłowej lokalizacji;
- 209ELD zachowuje Ardenvale z Fabuły, a mapa Eldraine pozostaje zatwierdzonym T4 bez fałszywych twierdzeń kanonicznych;
- Eldraine nie rozdziela Castle Embereth od Burning Yard i nie lokuje zaginionego Kotła przy mobilnym Locthwain;
- Alara nie zawiera dwóch niepotwierdzonych POI;
- dokumentacja i changelog opisują stan końcowy, nie pośredni;
- pełne bramki i CI są zielone, a working tree czysty.
