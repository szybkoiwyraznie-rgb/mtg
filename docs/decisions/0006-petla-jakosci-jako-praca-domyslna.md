# ADR 0006: Pętla Jakości jako domyślna praca sesji

- **Status:** Zaakceptowana
- **Data:** 2026-08-31
- **Decydenci:** właściciel projektu (koncepcja „Pętli Jakości"); agent Arena (sesja PR-1)

## Kontekst

Właściciel zakłada wielosesyjny rozwój bazy: po materializacjach kolejne
sesje mają **pogłębiać i rozszerzać** istniejące wpisy oraz **wydobywać**
to, co łączy kilka kart — tworząc Karty Haseł zamiast dublować wiedzę.
Do tego dochodzi druga żądanie: sesja, która dostanie od właściciela
„kontynuuj", ma wiedzieć, co robić, zamiast pytać (mtg-game rozwiązało to
ADR 0021 „domyślna praca sesji — nie pytaj o kolejkę").

## Decyzja

Gdy właściciel nie przekazał nowego zlecenia materializacji, a napisał
„kontynuuj" / nie podał tematu, sesja wykonuje **Pętlę Jakości** — po
kolei, od najtańszego:

1. **Integralność** (zawsze najpierw): `npm test` + `npm run build`.
   Czerwone = naprawa przed jakąkolwiek pracą treściową. To odpowiednik
   zasady mtg-game „audyt poprzedniego PR przed kodowaniem".
2. **Pogłębianie**: wybór najsłabszych stron po jawnych kryteriach
   (brakujące sekcje szkieletu > liczba źródeł < 2 > brak mapy/lokalizacji
   > krótka treść) i rozbudowa o kwerendę internetową z cytowaniami.
   Priorytet ma strona najstarsza przy remisie.
3. **Link-mining**: przejrzenie stron pod kątem encji wspólnych dla 2+
   stron bez własnego hasła → utworzenie Karty Haseł + wikilinki z każdej
   strony wspomniającej + wpis w co-nowego. To jest mechanizm
   anty-dublowania z ADR 0005, uruchamiany proaktywnie.
4. **Pass mapowy**: każda Karta Katalogowa ma pinezkę na mapie planu
   (ADR 0007); plan bez mapy przy ≥1 karcie → uruchomienie procesu
   mapowego.
5. **Co nowego**: dopisanie podsumowania zmian sesji do
   `content/co-nowego.md` (data + lista zmian; to źródło strony „Co
   nowego").

Kolejność można przesunąć, gdy zlecenie właściciela wskazuje inaczej
(nowe karty mają zawsze pierwszeństwo). Pętla nigdy nie omija kroku 1.

**Pomiar jakości** (od PR z narzędziem): `tools/wiki-stats.mjs` liczy
completeness score stron (wypełnione sekcje, źródła, linki, pinezka) do
raportu w PR — bez twardych progów; próg wprowadzi się, gdy zbierze się
dane referencyjne.

## Konsekwencje

**Dodatnie:** „kontynuuj" zawsze oznacza konkretną pracę; baza dąży do
głębi zamiast tylko szerokości; dublowanie wiedzy jest systemowo
wykrywane.

**Ujemne:** sesje jakościowe nie dodają kart (widać to w statystykach —
trzeba to komunikować w opisie PR, żeby właściciel wiedział, czego się
spodziewać).

**Dla sesji:** wynik każdej Pętli Jakości musi być widoczny w repo
(treść, test, ADR lub wpis w co-nowego) — „przejrzałem i było OK" nie
jest rezultatem.
