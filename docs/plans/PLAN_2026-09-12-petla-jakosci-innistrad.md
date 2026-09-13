# Plan Pętli Jakości — Innistrad: Gavony i Kessig

**Data:** 2026-09-12
**Zakres:** Pętla Jakości po dostawie 516RNA, bez nowych materializacji kart
**Status:** wykonane

## Krok 0–1 — integralność

- [x] `npm test` zielone po stanie 516RNA.
- [x] `npm run build` zielone: 70 stron (40 kart, 15 haseł, 15 planów), 859 plików drzewa archiwum.
- [x] `git log --oneline -5` potwierdza HEAD po dokumentacji PR-33.

## Krok 2–3 — pogłębianie i link-mining

- [x] Zweryfikować kandydatów Innistradu z treści kart: **Gavony** i **Kessig** mają ≥2 karty.
- [x] Utworzyć hasło `gavony` po progu kart 118MID + 181AVR (+ inne strony wspominające).
- [x] Utworzyć hasło `kessig` po progu kart 171ISD + 544AVR (+ inne strony wspominające).
- [x] Dopisać wikilinki ze wszystkich kart i planu, które mówią o tych prowincjach.
- [x] Nie tworzyć poniżej progu haseł dla Ulvenwaldu, Devil's Breach, Nephalii ani Kościoła Avacyn.

## Krok 4 — mapa

- [x] Mapa Innistradu jest T1, więc pass nie dorysowuje obiektów; hasła dostają tylko deep-linki `?x=&y=` zgodnie z ADR 0043.
- [x] Sprawdzić `python3 tools/map-audit.py` po zmianach.

## Krok 5 — zamknięcie

- [x] Zaktualizować `content/co-nowego.md`, `docs/backlog.md`, historię/roadmapę/handoff PR-33.
- [x] Dodać regresję link-miningu Innistradu.
- [x] Uruchomić pełne bramki, commit, push i zaktualizować PR #33.
