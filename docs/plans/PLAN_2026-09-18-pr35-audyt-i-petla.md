# PLAN sesji PR-35 (2026-09-18) — audyt PR-34 + Pętla Jakości

- **Gałąź:** `arena/01a0b4e1-mtg`
- **Start:** brak zlecenia w prompcie startowym („Kontynuujemy projekt”) →
  tryb domyślny: audyt poprzedniego scalonego PR, następnie Pętla Jakości
  (ADR 0006/0015, L18).

## Kroki

1. **Audyt PR-34** (#34, sześć materializacji: 69M11, 572GTC, 99MH2,
   385DKA, 373DSK + mapa Duskmourn T4, 56EOE + mapa The Edge T1):
   przegląd diffu wobec ADR-ów (LORE-first, głos Kronikarza, ADR 0040,
   ADR 0043, drabina wariantów, proweniencja map), wynik w
   `docs/audits/AUDYT_2026-09-18-PR34.md`.
2. **Pętla Jakości:**
   1. integralność — `npm test`, `npm run build`, `map-audit.py`
      (wykonane na starcie: 334/334, 107 stron, do potwierdzenia po
      zmianach);
   2. pogłębianie LORE najsłabszych stron (kryteria: brakujące sekcje,
      <2 źródła, krótka treść);
   3. link-mining (encje wspólne ≥2 kart bez hasła);
   4. pass mapowy — wzbogacenie/weryfikacja wyglądu map T3/T4 (bez zmian
      T1/T2, bez kontroli pinezek — L18);
   5. wpis w `content/co-nowego.md`.
3. Dokumentacja zamknięcia po ostatnim commicie produktu (L19).

## Bramki

`npm test` + `npm run build` zielone po każdym kroku; commit + push po
każdym samodzielnie zielonym kroku; opis PR aktualizowany kumulatywnie (L9).
