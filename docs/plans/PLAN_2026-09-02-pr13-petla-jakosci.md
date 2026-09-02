# PLAN PR-13 (2026-09-02) — Pętla Jakości v2: audyt PR-12 + pogłębianie LORE

Sesja bez nowej dostawy materializacji (właściciel: „kontynuujemy
projekt") → praca domyślna = Pętla Jakości v2 (ADR 0006/0015).
Punkt startowy: scalony PR #12 (merged 2026-09-02 20:14 UTC).

## Stan wejściowy (zmierzone na starcie)

- `npm test` = **102/102**; `npm run build` OK (artefakt 255.1 kB,
  ZIP 11528.6 kB) — zgodne z handoffem PR-12.
- `python3 tools/map-audit.py zendikar` = **0 problemów** (2× info
  o kotwicy w wodzie, zgodnej z whitelistą stref wodnych);
  `srodziemie` = **0 problemów**.
- Ostatni scalony PR: **#12** — „Pętla Jakości v2 — audyt PR-11 +
  domknięcie dryfu dokumentacji/map".
- Open PR: brak (ta sesja otwiera PR-13).

## Zakres

1. **Audyt poprzedniego scalonego PR (#12)** — obowiązek AGENTS.md
   §1.2/§5: przegląd 16 plików zmienionych w PR (treść, dane mapy,
   dokumentacja, testy) → `docs/audits/AUDYT_2026-09-02-PR12.md`.
   Znaleziska mają wynikać z audytu, nie z samego zielonego testu.
2. **Krok 1 — integralność:** zachować zielone `npm test` +
   `npm run build` po każdym kroku.
3. **Krok 2 — pogłębianie LORE (nie meta):** ranking słabości stron
   (`tools/wiki-stats.mjs` + kryteria z `docs/guides/PETLA_JAKOSCI.md`),
   wybór 1–3 najsłabszych stron i rozbudowa o wiedzę świata
   z cytowaniami (kwerenda internetowa z URL-ami w Źródłach).
4. **Krok 3 — link-mining:** weryfikacja liczników z `docs/backlog.md`
   (encje ≥2 kart) — przy 2 kartach na rozłącznych planach oczekiwany
   wynik: bez nowych haseł.
5. **Krok 4 — pass mapowy (tylko mapy T3/T4 = Zendikar):** kompletność
   operacyjna (pinezki obu kart istnieją i są kotwiczone), weryfikacja
   dokładności względem źródeł `elementy`/`kotwice`, ewentualne nowe POI
   z kanonu — jeśli audyt/weryfikacja wykaże luki.
6. **Krok 5 — zamknięcie:** `content/co-nowego.md` (nagłówek
   `## RRRR-MM-DD HH:MM — tytuł`, Europe/Warsaw — ADR 0029),
   `docs/setup/HANDOFF_2026-09-02-pr13.md`, skrót w
   `docs/PROJECT_HISTORY.md`, kumulatywny opis PR.

## Kryteria ukończenia

- Audyt PR #12 zapisany w `docs/audits/` z jawną listą znalezień lub
  obszarów „bez uwag".
- Co najmniej 1 strona pogłębiona lore'm z cytowaniami LUB uzasadniony
  zapis w audycie, dlaczego krok 2 nie miał materiału.
- `npm test` + `npm run build` zielone; map-audit 0; zmiany
  inkrementalne (osobny commit + push na samodzielny zielony krok).
