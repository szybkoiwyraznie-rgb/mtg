# Plan Pętli Jakości — Innistrad: Avacyn i Devil's Breach

**Data:** 2026-09-12
**Zakres:** drugi przebieg Pętli Jakości po domknięciu Gavony/Kessigu
**Status:** wykonane

## Krok 0–1 — integralność

- [x] Poprzedni przebieg zakończony zielono: `npm run test:all`, `npm run build`, `map-audit`, `wiki-stats` i CI PR #33.
- [x] Working tree był czysty przed rozpoczęciem drugiego link-miningu.

## Krok 2–3 — pogłębianie i link-mining

- [x] Zweryfikować kandydatów Innistradu z treści kart: **Avacyn** oraz **Devil's Breach** mają ≥2 karty.
- [x] Utworzyć hasło `avacyn` po progu kart 171ISD/181AVR/309ISD/393DKA/42ISD/544AVR.
- [x] Utworzyć hasło `devils-breach` po progu kart 118MID/171ISD/393DKA/544AVR.
- [x] Dopisać wikilinki ze wszystkich kart, planu i powiązanych haseł, które mówią o tych encjach.
- [x] Nie tworzyć osobnych haseł dla Ashmouth, Helvaultu, Kościoła Avacyn ani Griselbranda w tym przebiegu — zostają do przyszłych progów/zakresów.

## Krok 4 — mapa

- [x] Mapa Innistradu jest T1, więc nie dorysowano obiektów. Hasło Avacyn prowadzi deep-linkiem do Thraben/Helvaultu, a Devil's Breach do istniejącej kotwicy rozpadliny.
- [x] Brak własnych pinezek haseł zgodnie z ADR 0043.

## Krok 5 — zamknięcie

- [x] Rozszerzyć regresję `test/innistrad-link-mining.test.js`.
- [x] Zaktualizować `content/co-nowego.md`, `docs/backlog.md`, historię/roadmapę/handoff PR-33.
- [x] Uruchomić pełne bramki, commit, push i zaktualizować PR #33.
