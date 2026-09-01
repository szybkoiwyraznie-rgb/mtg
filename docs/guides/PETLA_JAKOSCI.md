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

## Krok 4 — pass mapowy: kompletacja i jakość map (warsztat T4)

Pass mapowy to **czynna praca nad jakością i kompletnością map**
(ADR 0015), nie kontrola obecności. Pod-punkty w kolejności od
najtańszej:

1. **Kompletność operacyjna:** każda karta ma pinezkę? Brakujące →
   ustal lokalizację z lore (kwerenda, poziom pewności, obowiązkowe
   uzasadnienie) i dopisz do `maps/<plan>/map.json`. Plan ma ≥1 kartę
   i nie ma mapy → proces mapowy (PROCES_MAP MA1–MA3) jako **osobne
   zadanie z roadmapą w `docs/plans/`**, nie „przy okazji".
2. **Nowe POI:** kwerenda źródeł (kanon settingu > oficjalne
   przewodniki/artykuły > wiki — zawsze z cytowaniami) o miejsca,
   ruiny, rzeki, pasma górskie, biomu, osady, punkty orientacyjne
   z kart → wzbogacenie `podklad.svg` (elementy graficzne) oraz
   `elementy`/`kotwice` w `map.json` (proweniencja). Zasada: pozycja
   ze źródeł, nigdy z kursora (MA4); źródło fanowskie tylko dla
   pozycji nieustalonych w kanonie — z adnotacją w `map.json`.
3. **Weryfikacja dokładności istniejących wpisów:** przegląd elementów
   względem źródeł (nazwa, pozycja, status kanoniczny); korekty
   z odnotowanym źródłem; skryptowe testy kolizji i „na lądzie"
   (point-in-polygon, bbox etykiet, etykieta↔marker).
4. **Warsztat rysowania wektorowego** (serce jakości): reużywalne
   metody kodowania obiektów — pasma i grzbiety górskie, rzeki
   (dopływy, ujścia, wodospady), biomu (las, bagno, step, lód,
   pustynia), osady/ruiny/hedrony — w jednej, wspólnej palecie
   (pergamin ADR 0008; halo `paint-order: stroke`; legenda symboli).
   Każda nowa metoda trafia do `SKILL_MAPA_PLANU.md` (pamięć
   warsztatu), żeby kolejne mapy rysować szybciej i spójnie.
5. **Wspólny silnik mapowy T4:** mapy tworzone od zera (wszystkie
   plany, aktualne i przyszłe) korzystają ze współdzielonego warsztatu
   — dążenie: jakość mapy Śródziemia (podkład mapome, T2), docelowo
   **wyprzedzająca** (kształty, kolory, czytelność, gęstość POI).
   Benchmark = porównanie z mapą Śródziemia + ocena właściciela.
6. **Regiony haseł** geograficznych (obwódki) — gdy hasła istnieją
   (próg ≥2 kart); dopóki nie istnieją, pod-punkty 2–5 są treścią
   passu mapowego.

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
