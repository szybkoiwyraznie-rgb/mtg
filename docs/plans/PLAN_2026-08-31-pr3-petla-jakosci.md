# Plan zadania — PR-3: Pętla Jakości operacyjna + K5 (completeness score)

- **Sesja:** 2026-08-31
- **Gałąź:** `arena/01a0591f-mtg` → `main`
- **Cel:** uruchomić Pętlę Jakości (ADR 0006) po raz pierwszy na realnej
  bazie oraz dokończyć kamień **K5** — narzędzie `tools/wiki-stats.mjs`
  (completeness score), które czyni jakość bazy mierzalną.
- **Zlecenie właściciela:** „Kontynuujemy projekt." — brak nowej dostawy
  kart, więc pracą domyślną jest Pętla Jakości (ADR 0006).

## Stan startowy (audyt — patrz docs/audits/)

- `npm test` = 65/65 zielone; `npm run build` = OK (4 strony: 2 karty,
  2 plany, 0 haseł).
- Baza: **1LTR Dunland Crebain** (Śródziemie) i **2BFZ Coralhelm Guide**
  (Zendikar) — obie Karty Katalogowe kompletne (10 sekcji, cytowania).
  Dwa plany (Śródziemie, Zendikar), dwie mapy z pinezkami (typu region).
- Hasła: **0** — poprawnie. Każdą encję (crebain, dunland, isengard,
  Saruman, Uruk-hai, Biała Ręka / tazeem, halimar, coralhelm, sea gate,
  Jori En, merfolk, Roil, Eldrazi) wspomina wyłącznie **jedna karta**,
  więc próg „≥2 kart" (zasada właściciela 2026-08-31) nie jest osiągnięty;
  karty są z różnych światów, więc encje wspólne nie istnieją.

## Kroki

### 1. Setup sesji (obowiązkowe, AGENTS.md §1)
- `docs/plans/PLAN_...` (ten plik), `docs/audits/AUDYT_2026-08-31-PR3.md`.
- Commit + push + otwarcie PR (roadmapa w PR).

### 2. Integralność (Pętla Jakości, krok 1)
- `npm test` + `npm run build` — potwierdzone zielone (stan startowy).

### 3. K5 — `tools/wiki-stats.mjs` (completeness score)
- Narzędzie czyta bazę przez `content-loader.mjs` i liczy dla każdej
  strony wypełnienie wg wzoru z `docs/guides/PETLA_JAKOSCI.md`:
  obowiązkowe sekcje (waga 3) + cytowania (waga 2) + wikilinki wychodzące
  (waga 1) + pinezka (waga 2).
- Skrypt `npm run stats`; raport tekstowy (kompletność / strona + średnia).
- Brak twardych progów (dopóki nie zbierzemy danych referencyjnych).

### 4. Pogłębianie (Pętla Jakości, krok 2)
- Najsłabsza warstwa treści = strony planów (krótkie, rejestrowe).
  Pogłębić **Śródziemie** i **Zendikar** o geografię/lore z kwerendą
  i cytowaniami (2 strony — limit 1–3 na pętlę). Karty NIE są ruszane
  (kompletne, zwalidowane).

### 5. Link-mining (Pętla Jakości, krok 3)
- Przegląd: brak encji wspólnej dla 2+ kart → **brak nowych haseł**.
  Potwierdzić backlog (już aktualny) i wpisać wynik w co-nowego.

### 6. Pass mapowy (Pętla Jakości, krok 4)
- Obie karty mają pinezki (region) na istniejących mapach; plany mają
  mapy. Brak braków → tylko weryfikacja.

### 7. Co nowego + zamknięcie (Pętla Jakości, krok 5)
- `content/co-nowego.md` — wpis sesji.
- `docs/setup/HANDOFF_2026-08-31-pr3.md` — stan, kolejka, decyzje.
- `docs/PROJECT_HISTORY.md` (dziennik) i `docs/ROADMAP.md` (K5 zamknięte).
- Commit + push; opis PR kumulatywnie.

## Kryteria gotowości
1. `npm test` zielone, `npm run build` zielone, `npm run stats` działa.
2. Dwie strony planów pogłębione z cytowaniami.
3. Wpisy: co-nowego, handoff, PROJECT_HISTORY, ROADMAP zaktualizowane.
4. Wszystko wypchnięte, `git status` czysty.
