# Plan Pętli Jakości — Innistrad: Ashmouth i Helvault

**Data:** 2026-09-12
**Zakres:** trzeci przebieg Pętli Jakości po domknięciu Avacyn/Devil's Breach
**Status:** wykonane

## Krok 0–1 — integralność

- [x] Poprzedni przebieg zakończony zielono: `npm run test:all`, `npm run build`, `map-audit`, `wiki-stats` i CI PR #33.
- [x] Working tree był czysty przed rozpoczęciem trzeciego link-miningu.

## Krok 2–3 — pogłębianie i link-mining

- [x] Zweryfikować kandydatów Innistradu z treści kart: **Ashmouth** oraz **Helvault** mają ≥2 karty.
- [x] Utworzyć hasło `ashmouth` po progu kart 393DKA + 544AVR.
- [x] Utworzyć hasło `helvault` po progu kart 393DKA + 544AVR.
- [x] Dopisać wikilinki ze wszystkich kart, planu i powiązanych haseł, które mówią o tych encjach.
- [x] Nie tworzyć osobnych haseł dla Griselbranda, Shilgengara, Skirsdag ani Kościoła Avacyn w tym przebiegu — zostają do przyszłych progów/zakresów.

## Krok 4 — mapa

- [x] Mapa Innistradu jest T1, więc nie dorysowano obiektów. Ashmouth prowadzi do istniejącej kotwicy Stensii, Helvault do Thraben/Katedry.
- [x] Brak własnych pinezek haseł zgodnie z ADR 0043.

## Krok 5 — zamknięcie

- [x] Rozszerzyć regresję `test/innistrad-link-mining.test.js`.
- [x] Zaktualizować `content/co-nowego.md`, `docs/backlog.md`, historię/roadmapę/handoff PR-33.
- [x] Uruchomić pełne bramki, commit, push i zaktualizować PR #33.
