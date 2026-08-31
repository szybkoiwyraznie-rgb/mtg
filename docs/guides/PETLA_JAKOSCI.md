# Gid: Pętla Jakości — procedura krok po kroku

Powiązania: [ADR 0006](../decisions/0006-petla-jakosci-jako-praca-domyslna.md)
(decyzja), `AGENTS.md` §2 (reguła domyślnej pracy).

Pętla Jakości to praca domyślna sesji, gdy właściciel nie przekazał
nowego zlecenia. Cel: baza dąży do głębi i spójności, nie tylko szerokości.
Kolejność kroków jest umowna, ale **krok 1 nigdy nie jest pomijany**.

## Krok 0 — rozpoznanie (zawsze)

```bash
npm test && npm run build
git log --oneline -5
```

Wynik: lista czerwieni (jeśli są — to kolejka nr 1) + pełna lista stron
wg typu. Przy pierwszych sesjach: also audyt poprzedniego PR (AGENTS.md §5).

## Krok 1 — integralność

Czerwone testy naprawia się **u root cause** (nie maskuje). Typowe
czerwieni: martwy wikilink (ktoś zmienił slug), brak sekcji, tag poza
słownikiem, brak snapshotu, pinezka bez karty.

Jeśli wszystko zielone — dopiero wtedy przechodzimy do treści.

## Krok 2 — pogłębianie (naj słabsze strony)

Ranking słabości (pierwsza znaleziona wygrywa):

1. brakująca obowiązkowa sekcja szkieletu (SZKIELET_KARTY/HASLA);
2. sekcja Źródła pusta lub < 2 pozycje (strona nie miała kwerendy);
3. brak pinezki/mapy przy istniejącej mapie planu;
4. sekcja < 3 zdania przy obowiązkowej;
5. zero wikilinków wychodzących (strona-sierota topologiczna).

Przy remisie wygrywa starsza strona (`materializacja`). Wybraną stronę
pogłębia się kwerendą (2–5 zapytań), dopisując treść + cytowania.
**Jedna sesja = od 1 do 3 pogłębionych stron**, zanim przejdzie się do
kroku 3.

## Krok 3 — link-mining (serce pętli)

1. Przejrzyj strony pod kątem encji wspominanych w 2+ miejscach:
   - te same nazwy własne w treści (postacie, miejsca, frakcje, bestie);
   - te same tagi;
   - powtarzające się motywy w treściach kart.
2. Dla każdej encji bez hasła: czy zasługuje? (encja jednorazowa,
   wspomniana mimochodem — nie).
3. Utwórz hasło (SZKIELET_HASLA) i **dopisz wikilinki ze wszystkich stron,
   które ją wspominają** (to jest moment, w którym baza przestaje się
   dublować).
4. Zaktualizuj `content/co-nowego.md`.

Do 2 nowych haseł na przebieg pętli — pogłębienie ważniejsze niż
rozrost.

## Krok 4 — pass mapowy

- Każda karta ma pinezkę? Brakujące → ustal lokalizację z lore (research,
  poziom pewności) i dopisz do `maps/<plan>/map.json`.
- Plan ma ≥1 kartę i nie ma mapy → uruchom proces mapowy
  (`PROCES_MAP.md` MA1–MA3) — to duże zadanie, zaplanuj je jako roadmapę
  w `docs/plans/`, nie „przy okazji".
- Hasła `geografia`/`postac` mają regiony/obwódki, jeśli mapa istnieje.

## Krok 4b — doskonalenie map wektorowych (mapy tworzone z danych tekstowych)

Dotyczy map **rekonstruowanych z tekstu** (warianty T3 — np. Zendikar,
ADR 0012), które nie mają oficjalnego podkładu i powstają z opisów lore.
Kryteria uruchomienia (którekolwiek):

1. Mapa jest „uboga" — brak elementów przyrodniczych/osadniczych
   (góry, lasy, rzeki, miasta, bagna, ruiny), które da się potwierdzić
   w źródłach; to sygnał właściciela lub wynik kroku 2 (pogłębianie).
2. Mapa ma **kolizje wizualne**: elementy/elementy lub napisy nachodzą
   na siebie; markery lądują na wodzie (poza kontynentem); legenda/
   podpis zasłania treść. Wykrywane wizualnie zrzutem (jak wyżej).
3. Właściciel zleca „doskonalenie mapy" wprost (tak jak w tej sesji).

Procedura:

1. **Audyt stanu** (punkt 1 wyżej). Skryptowo zweryfikuj, które markery/
   etykiety leżą **poza kontynentem** (point-in-polygon na `podklad.svg`)
   i które **nachodzą** na siebie (bbox etykiet, etykieta↔marker). Wynik
   zapisz w `docs/audits/AUDYT_...-mapa-<plan>.md` (konwencja PR treściowego).
2. **Ustal pozycje ze źródeł**, nie z kursora: kontynent + sąsiedztwo
   (MA4/PROCES_MAP). Dla pozycji **nieustalonych w kanonie** dopuszczalne
   jest oprzeć się na najlepszej mapie fanowskiej — wtedy źródło i adnotację
   zapisujemy w `map.json` (pole `zrodlo_fanmapa` + flaga `pozycja_zrodlo`
   w `kotwice`/-elementach), a pozycję podpisujemy jako „rekonstrukcja,
   nie kanon" (w podpisie podkładu SVG).
3. **Wzbogać wektor podkładu** (`maps/<plan>/podklad.svg`): symbolika
   (góry, wulkany, lasy, rzeki, miasta, bagna, ruiny/skyclave) w palecie
   pergaminu ADR 0008, + **legenda symboli**; nowe elementy idą do SVG,
   **nie** do `map.json` (tam tylko pinezki/regiony/kotwice).
4. **Popraw kolizje**: przenieś markery na ląd, rozsuń nakładające się
   etykiety, przenieś legendę/podpis poza obszar treści mapy; dodaj
   „halo" pod tekstem (`paint-order: stroke`) dla czytelności nad
   elementami przyrody.
5. **Zweryfikuj wizualnie** (zrzut podkładu — np. rasteryzacja SVG do
   PNG) i **udokumentuj w `map.json`**: `elementy` (nazwa, typ, kontynent,
   URL źródła), `kotwice` (z notką źródła), `zrodlo.notka` (adnotacja
   o rekonstrukcji). `npm build` + `npm test` zielone.

Wynik każdego doskonalenia mapy wpisuje się do `content/co-nowego.md`.

## Krok 5 — co nowego + zamknięcie

1. Wpis w `content/co-nowego.md`: data + lista zmian sesji (co pogłębione,
   jakie hasła, jakie naprawy).
2. Handoff sesji (AGENTS.md §7) — krótko: co zrobiono, co zostaje.
3. Commit + push; opis PR kumulatywnie.

## Czego Pętla NIE robi

- Nie materializuje kart bez dostawy (ADR 0003) — nawet „oczywistych".
- Nie generuje grafik (ADR 0008).
- Nie przepisuje wpisów kolekcji (nienaruszalne archiwum dostaw).
- Nie wprowadza nowych pól frontmatter/tagów/klas „na zapas" — to ADR.

## Metryka (od momentu powstania `tools/wiki-stats.mjs`)

Completeness score strony = wypełnione obowiązkowe sekcje (waga 3) +
cytowania (waga 2) + wikilinki wychodzące (waga 1) + pinezka (waga 2).
Raport w opisie PR; twarde progi dopiero po zebraniu danych
referencyjnych.
