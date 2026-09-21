# PLAN sesji PR-36 (2026-09-20) — audyt PR-35 + Pętla Jakości

- **Gałąź:** `arena/pr36-audyt-i-petla`
- **Start:** zgłoszenie właściciela: przystąpienie do pracy ściśle według AGENTS.md →
  tryb sesji: Pull Request na starcie z roadmapą zadania, audyt poprzedniego scalonego PR (#35),
  następnie Pętla Jakości (ADR 0006/0015, L18).

## Kroki

1. **Start sesji i PR na GitHubie:**
   - Utworzenie planu zadania `docs/plans/PLAN_2026-09-20-pr36-audyt-i-petla.md`,
     commit i push na gałąź `arena/pr36-audyt-i-petla`.
   - Otwarcie PR na GitHubie przed jakimkolwiek kodowaniem/treścią (AGENTS.md §1 reguła 1).
2. **Audyt PR-35 (#35, audyt PR-34 + 6 pętli jakości):**
   - Przegląd wszystkich zmienionych plików w PR-35 pod kątem zgodności z ADR-ami
     (ADR 0002 zero-deps, ADR 0010/0011 hierarchia kanonu, ADR 0030 lore-first,
     ADR 0042 głos Kronikarza, ADR 0043 reguła oznaczeń mapy, ADR 0048 diagram relacyjny),
     weryfikacja źródeł, poprawność linkowania i map.
   - Wynik audytu w `docs/audits/AUDYT_2026-09-20-PR35.md` oraz w opisie PR.
3. **Krok 1: Integralność bazy i narzędzi:**
   - Wdrożenie zero-dependency narzędzia `tools/serve.mjs` i skryptu dev w `package.json`
     dla obsługi serwera deweloperskiego w środowisku bez łamania reguły ADR 0002.
   - Sprawdzenie testów (`npm test`), kompilacji (`npm run build`) i audytu map (`map-audit.py`).
4. **Krok 2: Pogłębianie LORE:**
   - Wybór najsłabszych/najkrótszych haseł lub kart wg rankingu jakości (kwerenda lore,
     rozbudowa sekcji merytorycznych, cytowania w sekcji Źródła).
5. **Krok 3: Link-mining:**
   - Kwerenda encji występujących w prozie ≥2 kart/haseł bez osobnego hasła.
   - Opracowanie nowego hasła wg SZKIELET_HASLA z deep-linkiem do mapy i dowiązanie wikilinków.
6. **Krok 4: Pass mapowy T3/T4:**
   - Wzbogacenie i weryfikacja wyglądu wybranej mapy T3/T4 z kolejki handoffu PR-35
     (Tarkir T4 — 52 kotwice; lub Zendikar T4 — 95 kotwic).
   - Wzbogacenie obiektów kanonicznych z cytowaniem w `zrodlo-research.md`, weryfikacja wizualna,
     brak modyfikacji T1/T2, brak ruszania pinezek (L18).
7. **Krok 5: Dokumentacja i zamknięcie:**
   - Po ostatnim commicie produktu: aktualizacja `content/co-nowego.md` (rzeczywisty czas Europe/Warsaw),
     `docs/PROJECT_HISTORY.md`, `docs/ROADMAP.md`, nowy handoff `docs/setup/HANDOFF_2026-09-20-pr36.md`.
   - Kumulatywna aktualizacja opisu PR.

## Bramki

- `npm test` + `npm run build` zielone po każdym kroku.
- Inkrementalne commity, każdy wypchnięty natychmiast po wykonaniu kroku (AGENTS.md §1 reguła 3).
- Brak force push (AGENTS.md §1 reguła 4).
