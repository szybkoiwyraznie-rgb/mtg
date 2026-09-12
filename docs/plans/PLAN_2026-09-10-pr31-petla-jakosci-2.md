# Plan 2026-09-10 — PR-31: Druga Pętla Jakości (Alara & Innistrad)

**Cel:** Przeprowadzenie drugiego pełnego przebiegu Pętli Jakości (ADR 0006/0015, L18) na aktualnej bazie wiedzy.

**Status finalny:** wykonane; późniejszy zakres tego samego PR objął 15 materializacji i dwa nowe plany.

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
- Kwerenda i weryfikacja mapy Alary (T3/T4 mapforge):
  - **Korekta po audycie PR-31:** źródła potwierdzają carmot i dawną Vithię, ale nie pojedyncze punkty `Carmot Mines` ani `Ruins of Vithia`; oba POI wycofano.
  - Regeneracja `podklad.svg` przez `node tools/mapforge/cli.mjs`.
  - Kontrola braku kolizji, weryfikacja `python3 tools/map-audit.py` = 0.

### Krok 5: Dziennik i zamknięcie
- Wpis w `content/co-nowego.md` z godziną publikacji.
- Aktualizacja `docs/PROJECT_HISTORY.md`, `docs/ROADMAP.md`, `docs/setup/HANDOFF_2026-09-10-pr31.md`.
- Aktualizacja opisu PR #31.

### Krok 6: Rzeczywisty finał otwartego PR

Po drugim przebiegu do PR-31 dodano 15 kompletów
`collection/entries`–Scryfall–Karta Katalogowa–mapa oraz plany Eldraine
i Wiedźmina. Stan przy scaleniu: 180/180 testów, build 57 stron
(33 karty, 9 haseł, 15 planów), drzewo 859 plików, map-audit 0 i
wiki-stats 100%. Pełny wykaz znajduje się w
`docs/setup/HANDOFF_2026-09-10-pr31.md`.
