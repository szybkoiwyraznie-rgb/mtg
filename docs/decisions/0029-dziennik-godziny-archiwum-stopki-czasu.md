# ADR 0029: Dziennik z godziną publikacji, limit + archiwum miesiącami, stopki czasu stron

- **Status:** Zaakceptowana
- **Data:** 2026-09-02
- **Decydenci:** właściciel (recenzja aplikacji 2026-09-02: „strona główna
  i Co nowego strasznie długie", „newsy z godziną publikacji", „karty,
  mapy i hasła ze stopką dat"), agent Arena (realizacja)
- **Powiązane:** ADR 0001 (artefakt + CODEX_DATA), 0002 (zero-dependency)

## Kontekst

Dziennik „Co nowego" renderował się w CAŁOŚCI na stronie głównej i na
stronie dziennika — po ~30 wpisach obie strony stały się nieczytelnie
długie. Wpisy miały tylko datę (bez godziny), a strony kart, haseł i map
nie mówiły czytelnikowi, kiedy powstały ani kiedy były aktualizowane.

## Decyzja

1. **Konwencja nagłówka wpisu:** `## RRRR-MM-DD HH:MM — tytuł` — data
   i godzina PUBLIKACJI (Europe/Warsaw). Historyczne wpisy dostały
   godziny backfillem z gita (commit, który wprowadził nagłówek; przy
   squash-merge'ach = moment publikacji na main/Pages). Test schematu
   wymusza format na każdym przyszłym wpisie.
2. **Limit + archiwum:** strona główna pokazuje zwięzłą listę 5
   najnowszych wpisów (tytuł + data · godzina, bez treści); strona
   `#/co-nowego` pokazuje 5 najnowszych wpisów w pełnej treści oraz
   archiwum podzielone miesiącami; `#/co-nowego/<RRRR-MM>` to widok
   jednego miesiąca. Build parsuje dziennik na wpisy
   (`parsujWpisyCoNowego` w content-loaderze) i wstrzykuje tablicę
   `coNowego` do CODEX_DATA (zamiast jednego bloba HTML).
3. **Stopki czasu stron:** karty, hasła i strony map dostają stopkę
   „Utworzono RRRR-MM-DD HH:MM · ostatnia aktualizacja …". Źródłem jest
   historia gita pliku źródłowego strony (dla map: całego katalogu
   `maps/<plan>/`), liczona w buildzie; fallback = mtime pliku, gdy git
   niedostępny. Równe daty → sama data utworzenia.

## Konsekwencje

**Dodatnie:** strona główna i dziennik stale krótkie niezależnie od
liczby sesji; pełna historia dostępna miesiącami; czytelnik widzi
świeżość każdej strony bez zaglądania do repozytorium. **Ujemne /
wymagania:** daty stron są wiarygodne tylko przy PEŁNEJ historii gita —
`actions/checkout` w workflow **wymaga `fetch-depth: 0`** (płytki klon
daje wszystkim stronom datę ostatniego commita; build ostrzega o tym na
stderr). Zmiana workflow leży po stronie właściciela.
