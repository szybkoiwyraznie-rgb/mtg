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

**Audyt poprzedniego PR (AGENTS.md §5) to nie jest raport „zielone".**
To **dokładna weryfikacja poprawności i logiki** wszystkich zmian w
poprzednim PR — i treści, i kodu:

- **Treść:** zgodność z hierarchią kanonu (ADR 0010/0011), cytowania w
  sekcjach Źródła (każdy fakt ma URL), brak dublowania wiedzy (wikilinki
  zamiast kopii), kompletność sekcji szkieletu, zakaz sekcji
  „Ilustracja"/„Druk w Kolekcji" (ADR 0014/0016), poprawność danych
  (slugi, tagi wg słownika, snapshoty Scryfalla, pinezki z uzasadnieniem).
- **Kod:** czy zmiana robi to, co deklaruje, czy nie łamie kontraktów
  (sekcje/klasy/formaty), czy nie wprowadza regresji (pixelacja, kolizje
  etykiet, cykl importów, determinizm), czy jest spójna z ADR-ami
  (zero zależności ADR 0002; mapforge = klocek, nie ręczny `<path>`).
  Test zielony ≠ poprawność — czytamy diff jako recenzję kodu.

Wnioski i ewentualne znalezienia zapisujemy w `docs/audits/AUDYT_*.md`
i w opisie PR; są one kolejką napraw dla bieżącej sesji.

## Krok 2 — pogłębianie (naj słabsze strony; LORE, nie meta)

Pogłębianie to **uzupełnianie lore** — treści o świecie, które karta
i setting opisują: geografia i osi czasu, byty/rasy/frakcje, etymologia,
mechanika jako opowieść, flavor i jego kontekst, transpozycja, relacje
między encyjami (pogrubienia → przyszłe hasła).

**Anti-lista** — nigdy celem pogłębiania (ADR 0014/0015): biografie
artystów, warianty wydruków i finishe, kolekcjonerstwo, procesy
i mechanika Codexu, meta-tekst. Dane wydruku pokazuje infoboks ze
snapshotu — kropka.

Ranking słabości (pierwsza znaleziona wygrywa):

1. brakująca obowiązkowa sekcja szkieletu (SZKIELET_KARTY/HASLA);
2. sekcja Źródła pusta lub < 2 pozycje (strona nie miała kwerendy);
3. brak pinezki/mapy przy istniejącej mapie planu;
4. sekcja < 3 zdania przy obowiązkowej — **treści lore**, więc
   rozbudowa o wiedzę świata z cytowaniami (nie o wydruk);
5. zero pogrubionych encji (strona nie zasiewa przyszłych haseł).

Przy remisie wygrywa starsza strona (`materializacja`). Wybraną stronę
pogłębia się kwerendą lore (2–5 zapytań), dopisując treść + cytowania.
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

## Krok 4 — pass mapowy: wzbogacenie i weryfikacja wyglądu map T3/T4

> **Zasada procesowa (decyzja właściciela 2026-09-10, L18):**
> Pass mapowy to **NIE jest sprawdzanie pinezek** — pinezki kart są
> z zasady poprawnie dodawane przy materializacji i audytowane automatycznie
> w kroku 1 (`map-audit.py`, testy integralności). Sprawdzanie ich co chwilę
> nie jest celem passu mapowego.
>
> Pass mapowy to **czynne wzbogacenie i weryfikacja wyglądu map T3 i T4**
> (podkładów własnych/wektorowych) oraz ewentualne dodanie nowych POI,
> biomów, rzek i poprawek warsztatowych.
> **Map T1 (rastry) i T2 (gotowe wektory, np. Śródziemie) NIE wzbogacamy.**

Zakres prac w kroku 4:

1. **Nowe POI i obiekty geograficzne (tylko T3/T4):** kwerenda źródeł
   (kanon settingu > oficjalne przewodniki/artykuły > wiki z cytowaniami)
   o nowe kanoniczne miejsca, osady, ruiny, rzeki, pasma górskie, biomy
   i punkty orientacyjne → wzbogacenie `podklad.svg` (wektorowe elementy
   graficzne) oraz rejestracja w `map.json` (`elementy`/`kotwice`).
   Zasada: pozycja ze źródeł, nigdy z kursora (MA4).
2. **Weryfikacja wyglądu i dokładności (tylko T3/T4):** ocena wizualna
   podkładu (czytelność, estetyka, proporcje, kolizje etykiet, właściwe
   skalowanie glifów, ułożenie hydrografii, przebieg rzek i granic).
   Korekty błędów rysunku i typografii.
3. **Rozwój warsztatu rysowania wektorowego (T4):** reużywalne metody
   kodowania obiektów — pasma górskie, rzeki (dopływy, ujścia, wodospady),
   biomy (las, bagno, step, lód, pustynia), symbole osad/ruin — w jednej,
   spójnej palecie (pergamin ADR 0008, halo `paint-order: stroke`,
   legenda symboli). Nowe metody i uogólnienia trafiają do
   `SKILL_MAPA_PLANU.md`.
4. **Zakres wykluczeń:**
   - **T1 (rastry):** zasada „nic nie doklejamy ponad druk”; nie rysujemy
     obiektów na rastrze.
   - **T2 (gotowe wektory adoptowane):** podkład gotowy, benchmark; nie
     modyfikujemy jego geometrii ani stylu.
   - **Hasła nie oznaczają mapy (ADR 0043):** na mapie oznaczenia noszą
     wyłącznie karty; hasła łączą się z mapą jedynie odsyłaczem deep-link
     (`?x=&y=`).

Wynik każdego passu wpisuje się do `content/co-nowego.md` (co dodane,
co zweryfikowane, co poprawione).

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

Pinezka ma sens tylko dla stron, które mogą nosić oznaczenie na mapie.
**ADR 0043: na mapie oznaczenia noszą wyłącznie karty** — więc dla
wszystkich haseł (każdej klasy) komponent pinezki = **N/A** i nie
liczy się do maksimum strony (maks 6 zamiast 8). Hasło łączy się z
mapą wyłącznie odsyłaniem do mapy zbliżonej w określonym miejscu
(deep-link `?x=&y=`), nie znacznikiem — inaczej każdy hasło byłoby
systematycznie „niekompletne”.
