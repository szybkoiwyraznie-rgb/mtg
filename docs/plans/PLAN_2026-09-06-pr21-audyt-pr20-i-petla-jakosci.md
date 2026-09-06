# Plan sesji — 2026-09-06 — audyt PR-20 + Pętla Jakości z wizją (PR na GitHubie: #21)

> Sesja `arena/01a0770f-mtg`, punkt wyjścia = scalony PR-20 (`bbe6d34` =
> squash sesji PR-20 na `main`, 2026-09-06 16:11). Stan na starcie:
> integralność zielona (104/104 testów, build 10 stron, map-audit 0 —
> zweryfikowane w kroku 0). Właściciel: „Kontynuuj zgodnie z AGENTS" — brak
> nowej dostawy materializacji; pracą sesji jest audyt poprzedniego
> scalonego PR (AGENTS.md §5) + Pętla Jakości (ADR 0006/0015).

## Krok 0 — rozpoznanie (wykonane)

- `npm test`: 104/104 zielone; `npm run build`: zielony (10 stron: 5 kart,
  0 haseł, 5 planów; ZIP 11 plików); `python3 tools/map-audit.py`:
  RAZEM PROBLEMÓW: 0; `npm run stats`: 10/10 stron 8/8. Zgodne
  z handoffem PR-20.
- Lektura obowiązkowa AGENTS.md §0: komplet (AGENTS.md, README rejestru
  + ADR 0001–0033 w całości, LESSONS L1–L9, ENVIRONMENT.md, PR-20 (opis
  + diff `2a26531..bbe6d34`, 8 plików), handoff PR-20).
- Klon pogłębiony (`git fetch --unshallow`) — pełna historia dla stopek
  czasu (ADR 0029) i audytu diffów.
- **Nowość środowiskowa tej sesji: agent ma wizję** (ogląd obrazów).
  Handoff PR-20 odnotował, że rewamp mapy Alary v2 nie był oglądany
  przez agenta — ta sesja może to nadrobić (pass mapowy).

## Audyt PR-20 (wynik: `docs/audits/AUDYT_2026-09-06-PR20.md`)

Zakres PR-20 (8 plików, +428/−26): audyt PR-19 (dokument + plan),
naprawy A1–A4 (strona planu Alary do stanu mapy v2; co-nowego;
PROJECT_HISTORY; ROADMAP), lekcja L9, handoff. Sprawdzić:

1. A1 — czy `content/planes/alara.md` faktycznie odpowiada scenie v2
   (lista POI vs `scena.json`, akweny, Maelstrom-węzeł; Źródła z URL).
2. A2/A3/A4 — spójność dat (ADR 0029: godzina publikacji Europe/Warsaw),
   brak dublowania statusu w wielu miejscach (AGENTS.md §7).
3. L9 — wzorzec wpisu (Objaw → Przyczyna → Reguła).
4. Handoff PR-20 — czy stan opisany zgadza się ze stanem repo.

## Kroki

- [x] Lektura obowiązkowa (AGENTS.md §0) — komplet.
- [x] Krok 0: integralność (npm test, build, map-audit, stats).
- [ ] PR sesji otwarty (roadmapa w docs/plans/ — ten plik).
- [ ] Audyt PR-20 → `docs/audits/AUDYT_2026-09-06-PR20.md` (+ ewentualna
      kolejka napraw).
- [ ] Kolejka napraw z audytu (jeśli powstanie) — każda jako osobny,
      zielony commit.
- [ ] Pętla Jakości:
  - krok 2 (pogłębianie): ranking słabości wg PETLA_JAKOSCI — w PR-20
    brak kandydatów (10/10 stron 8/8); zweryfikować ponownie po audycie;
  - krok 3 (link-mining): 5 kart w 5 planach — próg ≥2 kart nieosiągnięty
    (potwierdzić, nie tworzyć haseł na zapas);
  - krok 4 (pass mapowy, ADR 0015): **wizualne QA map T3/T4 z wykorzystaniem
    wizji** — rasteryzacja podkładów poza repo (`/tmp`, resvg — bez
    zależności w repo, ADR 0002), ogląd: Alara v2 (nigdy nie oglądana
    przez agenta), Zendikar, Ravnica, Midgar; wnioski → korekty sceny
    (tylko z uzasadnieniem w kanonie/ADR) lub zapis w audycie/backlogu.
    Map T2 (Śródziemie) nie ruszamy (decyzja właściciela 2026-09-01).
- [ ] `docs/setup/ENVIRONMENT.md`: pomiar tej sesji — narzędzia
      rasteryzacji SVG w sandboxie (ImageMagick bez delegata rsvg; resvg-js
      przez npm poza repo działa) + fakt, że wizja bywa dostępna.
- [ ] Domknięcie: co-nowego (wpis tej sesji, `## RRRR-MM-DD HH:MM — …`),
      handoff, PROJECT_HISTORY, opis PR kumulatywny po każdym commicie (L9),
      `npm test` + `npm run build` zielone, push.

## Granice (AGENTS.md §6)

- `collection/entries/` nienaruszalne; brak nowych materializacji bez
  dostawy; **zero generowanych grafik** (ADR 0008 — ogląd obrazów to nie
  generowanie); treść lore z cytowaniami; bez zmian w `.github/` (brak
  uprawnienia `workflows` u bota); zero zależności w repo (ADR 0002) —
  narzędzia pomocnicze do rasteryzacji wyłącznie poza repo.
