# Plan — PR-28: mapa Kaladeshu T4 + materializacja 610M19 Gearsmith Prodigy

- **Data:** 2026-09-09
- **Gałąź:** `arena/01a08651-mtg`
- **Zlecenie właściciela:** dokończyć plan Kaladesh wg podjętych wcześniej
  decyzji (research + rozstrzygnięcie w
  `docs/research/RESEARCH_2026-09-09-kaladesh-gearsmith-prodigy.md`,
  ADR 0045), potem zmaterializować dostarczoną kartę 610M19.
- **Dostawa (verbatim w czacie 2026-09-09):**
  `610M19 · Gearsmith Prodigy · M19 · Kaladesh · Fabuła` — scena
  w Ghirapurze: młoda konstruktorka testuje mechanicznego lisa
  z mosiężnego filigranu na słonecznym tarasie miejskich ogrodów;
  automat na błękitnym rdzeniu eterowym.

## Decyzje wiążące (z poprzedniej sesji, nie do renegocjacji)

1. **Jedna mapa T4 całego Kaladeshu** ( Avishkar — współczesna nazwa
   lore, plan w bazie: `kaladesh`), rysowana sceną mapforge z kanonu
   tekstowego; T1/T2 odrzucone po researchu (brak oficjalnej mapy
   i brak rastra fanowskiego o jakości benchmarku).
2. **Ghirapur = główne ognisko:** mapa otwiera się domyślnie na
   Ghirapurze (`widok_domyslny` w `map.json`, ADR 0045 — silnik
   gotowy od PR-27), oddalenie odsłania cały schematyczny plan;
   gęstość obiektów Ghirapuru dużo większa niż reszty planu.
   To jeden podkład z domyślnym kadrem, NIE osobna podmapa.
3. **Pinezka 610M19: `region`** (okolice Greenwheel / ogrodów
   miejskich / arboretum) — kanon nie daje punktu „numeru tarasu”.

## Kroki

1. **Audyt scalonego PR-27** (AGENTS.md §1/§5) → `docs/audits/`
   + ewentualne naprawy jako pierwsze commity.
2. **Mapa Kaladeshu** (`maps/kaladesh/`):
   - `scena.json` mapforge: schematyczny plan (węzeł rzeczny
     Vinday/Suramal/Vasavati, Peema, Vahd/Mapani, Lathnu/Devra
     Cliffs, morze, wieże zbioru eteru) + **gęsty Ghirapur**
     (dzielnice: Bomat, Eleven Bridges/Dukhara Canal, Aether Spire,
     Aradara Station, Embraal, Freejam, Giants' Walk, Greenwheel,
     Kujar, Ovalchase, Shaila's Claim, Weldfast; rzeki, kanał, port);
   - `map.json` z proweniencją, `rekonstrukcja: true`,
     `widok_domyslny` na Ghirapur;
   - bramki: CLI `[wiązania]` 0, `map-audit.py` 0, `npm test`,
     **QA rastrowe całości + cropów** (L10) przed pokazaniem.
3. **Strona planu** `content/planes/kaladesh.md` (szkielet planu,
   notka Kaladesh/Avishkar, sekcja mapy, źródła z kwerendy).
4. **Materializacja 610M19** (SZKIELET_KARTY.md):
   - `collection/entries/610m19-gearsmith-prodigy.md` (verbatim);
   - `scryfall/610m19-gearsmith-prodigy.json` (fetch_page + metadane;
     imgId 610M19 ≠ collector number — ADR 0036/L8);
   - `content/cards/610m19-gearsmith-prodigy.md` (LORE-first, głos
     Kronikarza ADR 0042, zero druku źródłowego ADR 0040,
     Fabuła = kotwica Transpozycji/Na Mapie);
   - pinezka `region` w `maps/kaladesh/map.json` + sekcja „Na Mapie”.
5. **Link-mining:** Kaladesh ma 1 kartę → próg 2 kart niespełniony;
   tylko aktualizacja kolejki w `docs/backlog.md` (bez nowych haseł).
6. **Domknięcie:** `content/co-nowego.md` (nagłówek z godziną, ADR 0029),
   `docs/PROJECT_HISTORY.md`, `docs/ROADMAP.md` (status),
   `docs/setup/HANDOFF_2026-09-09-pr28.md`, opis PR kumulatywnie (L9).

## Bramki jakości

- `npm test` (all) + `npm run build` zielone po każdym kroku;
- build bez ostrzeżenia o płytkim klonie; stopki dat z pełnej historii;
- każdy zielony krok = osobny commit + natychmiastowy push (L2);
- QA rastrowe mapy obejrzane przed przekazaniem (L10);
- opis PR aktualizowany po każdym commicie merytorycznym (L9).
