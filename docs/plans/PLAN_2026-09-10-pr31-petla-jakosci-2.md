# Plan 2026-09-10 — PR-31: Druga Pętla Jakości (Alara & Innistrad)

**Cel:** Przeprowadzenie drugiego pełnego przebiegu Pętli Jakości (ADR 0006/0015, L18) na aktualnej bazie wiedzy.

## Zadania szczegółowe

### Krok 0–1: Integralność i weryfikacja bazy
- `npm test`: 180/180 testów.
- `npm run build`: 38 stron.
- `python3 tools/map-audit.py`: 0 błędów.

### Krok 2: Pogłębianie LORE
- Karty Innistradu (`309isd-civilized-scholar.md`, `393dka-forge-devil.md`): pogłębienie tła prowincji Stensia, Geier Reach, Ashmouth oraz dodanie wikilinków.
- Karty Alary (`536arb-ethersworn-shieldmage.md`, `305arb-illusory-demon.md`): dodanie wikilinków do hasła `esper`.
- Plan `innistrad.md` i plan `alara.md`: uzupełnienie wikilinków do nowych haseł.

### Krok 3: Link-mining i nowe hasła (próg ≥ 2 kart)
1. **`content/lore/esper.md`** (klasa `geografia`, plan `alara`) — archipelag wysp ze stopu i szkła, sfinks Crucius, eterium, doktryna Ethersworn i zderzenie w Confluxie (karty `305arb` i `536arb`).
2. **`content/lore/stensia.md`** (klasa `geografia`, plan `innistrad`) — górzysta prowincja wampirzych linii (Markov, Falkenrath), szczyty Geier Reach, rozpadlina Ashmouth i diabły Innistradu (karty `309isd` i `393dka`).

### Krok 4: Pass mapowy (tylko T3/T4 — wzbogacenie wyglądu i nowe POI)
- Kwerenda i wzbogacenie mapy Alary (T3/T4 mapforge):
  - Dodanie kanonicznych POI: `Carmot Mines` (Esper) oraz `Vithia` (ruiny dawnego imperium w Grixis).
  - Regeneracja `podklad.svg` przez `node tools/mapforge/cli.mjs`.
  - Kontrola braku kolizji, weryfikacja `python3 tools/map-audit.py` = 0.

### Krok 5: Dziennik i zamknięcie
- Wpis w `content/co-nowego.md` z godziną publikacji.
- Aktualizacja `docs/PROJECT_HISTORY.md`, `docs/ROADMAP.md`, `docs/setup/HANDOFF_2026-09-10-pr31.md`.
- Aktualizacja opisu PR #31.
