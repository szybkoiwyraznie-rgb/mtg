# PLAN 2026-09-02 — PR-10: Pętla Jakości v2 (audyt PR-9 + LORE + pass mapowy E5)

Roadmapa jednego zadania (jednorazowa). Sesja bez nowej dostawy kart
i bez nowego zlecenia właściciela („kontynuujemy projekt") → domyślna
praca = Pętla Jakości v2 (ADR 0006/0015, gid PETLA_JAKOSCI.md).

## Stan wejściowy (zmierzone na starcie sesji)

- `npm test` = 87/87; `npm run build` OK (4 strony: 2 karty, 2 plany,
  0 haseł; 14 modułów; artefakt ~5,8 MB); `tools/map-audit.py` = 0 problemów.
- Ostatni scalony PR: **#9** (mapforge: adopcja glifów mapome/Azgaar +
  rzeki w kolorze morza, ADR 0020).
- Completeness score: 4×100% (8/8) — metryka wysycona, pogłębianie
  wybiera się merytorycznie (rzeczywista głębia lore), nie po score.

## Kroki sesji

1. **Integralność** (krok 1 pętli) — wykonane na starcie: zielono. ✅
2. **Audyt PR #9** (AGENTS.md §5) → `docs/audits/AUDYT_2026-09-02-PR9.md`:
   recenzja diffu (treść + kod) pod kątem ADR 0018/0019/0020,
   proweniencji glifów, decyzji o rzekach, determinizmu.
3. **Krok 2 — pogłębianie LORE** (1–3 strony): wybór najsłabszych stron
   merytorycznie (najcieńsze sekcje lore); kwerendy z cytowaniami
   w Źródłach; wyłącznie lore (anti-lista ADR 0014/0015).
4. **Krok 3 — link-mining**: przegląd encji wspólnych dla 2+ stron;
   hasła geograficzne mają próg ≥2 kart (zasada właściciela) — przy
   2 kartach na 2 planach spodziewany wynik: rejestr kandydatów,
   bez tworzenia haseł na siłę.
5. **Krok 4 — pass mapowy** (wyłącznie T3/T4 = Zendikar; Śródziemie/T2
   nieruszane):
   - **E5 klocki warsztatu**: adopcja symboli z Azgaar/Fantasy-Map-Generator
     (MIT; kandydat zapisany w ADR 0020 pkt 4) — w kolejności potrzeb
     mapy Zendikaru; atrybucja MIT w nagłówku pliku + aktualizacja
     `map.json`; albo/oraz
   - **nowe POI Zendikaru**: kwerenda kanonu (Planeswalker's Guide,
     Plane Shift, oficjalne artykuły > wiki z cytowaniami) → wzbogacenie
     `scena.json` + regeneracja `podklad.svg` + `map-audit` + testy.
6. **Krok 5 — zamknięcie**: `content/co-nowego.md`, handoff
   `docs/setup/HANDOFF_2026-09-02.md`, opis PR kumulatywnie.

## Zasady wiążące dla tej sesji

- Commity inkrementalne po każdym zielonym kroku, od razu push.
- Bez zmian w `.github/workflows/` (brak uprawnień bota, ENVIRONMENT §3).
- `collection/entries/` nienaruszalne; zero generowanych grafik (ADR 0008).
- Nowe glify gór wyłącznie przez bibliotekę adoptowaną (ADR 0020);
  kolor rzeki = kolor akwenu (nie przywracać gradientu).
