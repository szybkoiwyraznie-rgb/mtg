# Plan sesji — 2026-09-06 — audyt PR-19 + kolejka napraw (PR na GitHubie: #20)

> Sesja `arena/01a076ea-mtg`, punkt wyjścia = scalony PR-19 (`2a26531` =
> squash sesji PR-19 na `main`, 2026-09-06 15:30). Stan na starcie:
> integralność zielona (104/104 testów, build, map-audit 0 — zweryfikowane
> w kroku 0). Właściciel: „Jedziesz. AGENTS i robisz dokładnie to co masz
> tam napisane" — brak nowej dostawy materializacji; pracą sesji jest
> audyt poprzedniego scalonego PR (AGENTS.md §5) + kolejka napraw +
> Pętla Jakości (ADR 0006).

## Krok 0 — rozpoznanie (wykonane)

- `npm test`: 104/104 zielone; `npm run build`: zielony (10 stron: 5 kart,
  0 haseł, 5 planów; ZIP 11 plików); `python3 tools/map-audit.py`:
  RAZEM PROBLEMÓW: 0. Zgodne z handoffem PR-18 i audytem PR-18.
- `docs/setup/HANDOFF_*.md` najnowszy = PR-18 (sesja PR-19 nie zostawiła
  handoffu — znalezisko procesowe, patrz niżej).
- Lektura obowiązkowa AGENTS.md §0: komplet (AGENTS.md, ADR-y 0001–0033
  + README rejestru, LESSONS L1–L8, ENVIRONMENT.md, PR-19, handoff PR-18).

## Audyt PR-19 (wynik: `docs/audits/AUDYT_2026-09-06-PR19.md`)

Zakres PR-19 (diff `4bc1234..2a26531`, 14 plików):

1. **Audyt PR-18** (dokument) + **plan** (`docs/audits/AUDYT_2026-09-05-PR18.md`,
   `docs/plans/PLAN_2026-09-05-audyt-pr18-i-kolejka.md`) — poprawne,
   zgodne z AGENTS.md §5.
2. **Naprawy Z1–Z5 z audytu PR-18** (commit `deb7cc51`): termin „Fabuła
   właściciela" zamiast „Fabuła dostawy" w kartach 275FIN/305ARB; usunięcie
   odsyłaczy „ADR …" z treści kart i planów alara/final-fantasy; dodanie
   Źródeł „Fabuła właściciela"; rozszerzenie ui-smoke o pętlę po wszystkich
   kartach (asercje: zakaz „Fabuła dostawy"/„ADR"/„verbatim"); snapshoty
   275FIN/305ARB z `source: cards/named?exact=` (Z4).
3. **Rewamp mapy Alary v2** (commit `b1904dd8`, „po recenzji właściciela"):
   Esper = archipelag wysp na Morzu Esper (Dwindling Sea, Sea of Stars,
   Inkwell), Maelstrom = równoprawny węzeł-shard (nowy pseudo-biom `wir`
   w mapforge), fraktalne linie brzegowe, ~28 kanonicznych POI (40 kotwic
   w `map.json`), pinezka 305ARB `dokladna`.

### Znaleziska (kolejka napraw tej sesji)

1. **A1 [treść]** Strona planu `content/planes/alara.md` (sekcje lead,
   „Setting w pigułce", „Mapa") opisuje mapę sprzed rewampu v2: „Esper
   z morzami wewnętrznymi na wschodzie", Maelstrom jako „plama w punkcie
   złączenia", lista POI tylko z wersji v1. Stan faktyczny (scena v2):
   Esper = archipelag na Morzu Esper, Maelstrom = węzeł równoprawny
   (etykieta „The Maelstrom"), 28 POI + wody Dwindling Sea/Sea of Stars/
   Inkwell. Treść planu musi odpowiadać mapie (ADR 0013: proweniencja
   w danych i tekście strony; mapa = aktualny stan kanoniczny).
2. **A2 [proces]** Brak wpisu w `content/co-nowego.md` o rewampie mapy
   Alary v2 i naprawach Z1–Z5 (ostatni wpis: 2026-09-05 22:15). Zmiany
   scalono 2026-09-06 15:30 — wymagany wpis wg ADR 0029 (backfill
   z gita: commit `2a26531`).
3. **A3 [proces]** Brak wpisu o sesji PR-19 w `docs/PROJECT_HISTORY.md`
   (dziennik kończy się na sesji PR-18) oraz brak handoffu sesji PR-19
   (`docs/setup/HANDOFF_2026-09-06-*.md` nie istnieje) — sesja PR-19 nie
   domknęła dokumentacji wg AGENTS.md §7.
4. **A4 [niski]** `docs/ROADMAP.md` opisuje PR-19 jako „(2026-09-05,
   w toku)" — PR-19 scalony; wpis do aktualizacji (skrót + odesłanie).

## Kroki

- [x] Lektura obowiązkowa (AGENTS.md §0) — komplet.
- [x] Krok 0: integralność (npm test, build, map-audit) + rozpoznanie.
- [ ] PR sesji otwarty (roadmapa w docs/plans/ — ten plik).
- [ ] Audyt PR-19 → `docs/audits/AUDYT_2026-09-06-PR19.md`.
- [ ] A1: aktualizacja `content/planes/alara.md` do stanu mapy v2
      (lead/Setting w pigułce/Mapa: archipelag Esper, Maelstrom-węzeł,
      lista POI wód i osad wg sceny; bez odsyłaczy ADR w treści).
- [ ] A2: wpis `content/co-nowego.md` (2026-09-06 15:30 — rewamp Alary
      v2 + naprawy Z1–Z5).
- [ ] A3: wpis `docs/PROJECT_HISTORY.md` o sesji PR-19; handoff tej sesji
      powstanie na końcu (AGENTS.md §7).
- [ ] A4: aktualizacja `docs/ROADMAP.md` (PR-19 scalony).
- [ ] Pętla Jakości (jeśli po naprawach zostanie zakres): krok 2
      pogłębianie — wg kryteriów PETLA_JAKOSCI; krok 4 pass mapowy.
- [ ] Domknięcie: co-nowego (wpis tej sesji), handoff, opis PR
      kumulatywny, `npm test` + `npm run build` zielone, push.

## Granice (AGENTS.md §6)

- `collection/entries/` nienaruszalne; brak nowych materializacji bez
  dostawy; zero generowanych grafik; treść lore z cytowaniami; bez zmian
  w `.github/` (brak uprawnienia `workflows` u bota).
