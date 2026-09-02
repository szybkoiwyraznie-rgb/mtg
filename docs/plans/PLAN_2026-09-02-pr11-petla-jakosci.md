# PLAN PR-11 (2026-09-02) — Pętla Jakości v2: audyt PR-10 + pass kontynentowy Zendikaru + LORE

Sesja domyślna (brak zlecenia materializacji — właściciel: „kontynuujemy
projekt"). Praca wg ADR 0006/0015 (Pętla Jakości v2) + kolejka
z `docs/setup/HANDOFF_2026-09-02.md`.

## Zakres

1. **Audyt poprzedniego scalonego PR (#10)** — obowiązek AGENTS.md §1.2/§5:
   przegląd wszystkich zmienionych plików (treść: hierarchia kanonu,
   cytowania, sekcje; kod: kontrakty mapforge/build/testy, ADR 0021–0027
   vs stan repo) → `docs/audits/AUDYT_2026-09-02-PR10.md`; znaleziska =
   kolejka napraw tej sesji.
2. **Krok 1 — integralność:** `npm test` + `npm run build` (stan
   startowy: 91/91, build OK — zgodny z handoffem).
3. **Krok 4 — pass mapowy: kontynenty kompleksowo** (zapowiedź
   właściciela z PR-10): przejście kontynent po kontynencie procedurą
   z PR-10 (inwentaryzacja wiązań → research kanonu nazw → korekty
   danych sceny → walidator 0 uwag → QA rastrowe). W tej sesji kolejka
   E-geo z ROADMAP:
   - **E-geo-5** — Bala Ged / Guul Draz: Pelakka Karst, nazwa
     zachodniej zatoki (po przeniesieniu Bojuka Bay); Helix of Zof —
     zweryfikować stan po PR-10.
   - **E-geo-6** — Ondu: Nomads of Silundi Sea (płn. wybrzeże),
     Tikal Harbor.
   - **E-geo-7** — Tazeem: Sunspring (płn. cypel), Calcite Flats
     (płd. cypel).
   - **E-geo-9** — Hada: pozycja w centrum Tazeem (w2) vs obecna.
   - E-geo-1 (archipelag — duża) i E-geo-2 (rotacja układu — decyzja
     właściciela) poza zakresem tej sesji, chyba że starczy budżetu.
4. **Krok 2 — pogłębianie LORE** (1–3 strony wg rankingu słabości
   z PETLA_JAKOSCI; kandydat: strona planu Śródziemie lub sekcje
   geograficzne Zendikaru wynikłe z researchu POI).
5. **Krok 3 — link-mining:** kontrola progu ≥2 kart dla kandydatów
   (Dunland, Halimar/Coralhelm, merfolkowie) — przy 2 kartach w bazie
   prawdopodobnie nadal bez nowych haseł (zapis wniosku).
6. **Krok 5 — co-nowego** + handoff + kumulatywny opis PR.

## Kryteria ukończenia

- Audyt PR-10 w `docs/audits/` z konkretną listą znalezisk (lub jawnym
  „bez uwag" per obszar).
- Walidator wiązań i `tools/map-audit.py` — 0 uwag po każdej zmianie
  sceny; testy + build zielone po każdym kroku (commit + push per krok).
- Nowe nazwy POI wyłącznie z kanonu z cytowaniami (ADR 0010/0023);
  pozycje fanowskie tylko dla nieustalonych w kanonie, z adnotacją
  w `map.json`.
- Handoff `docs/setup/HANDOFF_2026-09-02-pr11.md` na koniec sesji.
