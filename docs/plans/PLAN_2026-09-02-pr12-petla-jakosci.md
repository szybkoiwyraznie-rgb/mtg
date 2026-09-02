# PLAN PR-12 (2026-09-02) — Pętla Jakości v2: audyt PR-11 + domknięcie dryfu dokumentacji/map

Sesja bez nowej dostawy materializacji (właściciel: „kontynuujemy
projekt") → praca domyślna = Pętla Jakości v2 (ADR 0006/0015).
Punkt startowy: scalony PR #11.

## Stan wejściowy (zmierzone na starcie)

- `npm test` = 101/101; `npm run build` OK.
- Ostatni scalony PR: **#11** — „Pętla Jakości v2 — audyt PR-10 +
  geografia Zendikaru domknięta kanonem (cała kolejka E-geo + ADR 0028
  fort)".
- Open PR: brak.

## Zakres

1. **Audyt poprzedniego scalonego PR (#11)** — obowiązek AGENTS.md
   §1.2/§5: przegląd plików zmienionych w PR (treść, dane mapy,
   dokumentacja, build/testy) → `docs/audits/AUDYT_2026-09-02-PR11.md`.
   Znaleziska tej sesji mają wynikać z audytu, nie z samego zielonego
   testu.
2. **Krok 1 — integralność:** zachować zielone `npm test` +
   `npm run build` po każdym kroku.
3. **Domknięcie dryfu w żywych dokumentach i danych mapy** — jeśli audyt
   potwierdzi rozjazdy po ADR 0013 / ADR 0027 / końcówce PR-11:
   - rejestr/proweniencja `maps/zendikar/map.json`,
   - żywe dokumenty architektury/procesu (`docs/ARCHITECTURE.md`,
     `docs/guides/PROCES_MAP.md`, `maps/README.md`, `docs/ROADMAP.md`),
   - najnowszy handoff, jeśli nie opisuje finalnego stanu sesji.
4. **Krok 5 — zamknięcie:** `content/co-nowego.md`, handoff sesji,
   kumulatywny opis PR.

## Kryteria ukończenia

- Audyt PR #11 zapisany w `docs/audits/` z jawną listą znalezień lub
  obszarów „bez uwag".
- Żywe dokumenty i rejestr mapy nie przeczą obowiązującym ADR-om ani
  aktualnemu stanowi repo.
- Zmiany inkrementalne, z osobnym zielonym krokiem i push po każdym
  samodzielnym etapie.
