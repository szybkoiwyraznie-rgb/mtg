# Plan PR-33 — audyt poprzedniego scalonego PR-32

- **Data:** 2026-09-12
- **Gałąź:** `arena/01a095bf-mtg`
- **Zakres:** obowiązkowy audyt startowy poprzedniego scalonego PR #32 (`56a5360`) przed dalszą pracą produktową.
- **Status:** wykonane — raport zapisany w `docs/audits/AUDYT_2026-09-12-PR32.md`.

## Cel

Sprawdzić stan projektu po scaleniu PR-32 wobec stanu sprzed PR-32 (`5a49ca3`) i zapisać wynik w `docs/audits/AUDYT_2026-09-12-PR32.md` oraz w opisie bieżącego PR.

## Kroki

1. Potwierdzić stan gałęzi, pełną historię gita i ostatni scalony PR.
2. Uruchomić bramki integralności: `npm test`, `npm run build`, `python3 tools/map-audit.py` oraz kontrolnie `npm run stats`.
3. Przejrzeć diff PR-32 i pliki końcowe według osi:
   - pętla dostawy i parość wpisów z Kartami Katalogowymi;
   - snapshoty Scryfall, separacja `imgId` od numerów wydruku i DFC per twarz;
   - głos Kronikarza, zakaz metadanych printu i brak wnioskowania z oryginalnych ilustracji;
   - poprawki Eldraine, Alary, Mirrodinu, Zendikaru, Innistradu i Wiedźmina;
   - hasło Novigrad względem progu haseł i ADR 0043;
   - dokumentacja zamknięcia PR-32, changelog, roadmapa i handoff.
4. Dla zmian mapowych PR-32 wykonać kontrolę wizualną tam, gdzie ma sens: co najmniej świeże SVG Eldraine/Alary oraz podgląd kotwic Wiedźmina, bez generowania nowych obrazów produkcyjnych.
5. Zapisać audyt z klasyfikacją znalezisk: blokujące / do naprawy / obserwacje / wynik bramek.

## Wynik

- Raport audytu: `docs/audits/AUDYT_2026-09-12-PR32.md`.
- Werdykt: brak nowych błędów P0/P1; trzy znaleziska porządkowe — Z1/P2 nieodtwarzalne liczniki dokumentacji, Z2/P2 trailing whitespace w patchu PR-32, Z3/P3 zbędne źródło Razor Fields w 347NPH.
- Bramki po raporcie: `npm run test:all` 207/207, `npm run build` 62 strony / 859 plików drzewa, `tools/map-audit.py` 0 problemów, `npm run stats` 100%, `git diff --check` czysto.

## Kryterium domknięcia

- [x] Audyt jest zapisany w `docs/audits/AUDYT_2026-09-12-PR32.md`.
- [x] Lokalne bramki po audycie są zielone.
- [x] Commity są wypchnięte na `arena/01a095bf-mtg`.
- [x] Opis PR zawiera aktualny wynik audytu.
