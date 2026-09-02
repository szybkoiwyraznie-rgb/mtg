# ADR 0011: Chudy format dostawy — karta bez narracji i promptu

- **Status:** Częściowo zastąpiona — (1) sekcję „Druk w Kolekcji" znosi
  ADR 0014; (2) format dostawy rozszerza ADR 0026: wraca pole **Fabuła**
  jako wiążąca kotwica transpozycji (spójność z ilustracjami FOT/KON);
  w mocy pozostają: brak promptu w pętli, higiena „osadzenie ≠ kanon
  MtG" i nienaruszalność archiwum dostaw
- **Data:** 2026-08-31
- **Decydenci:** właściciel projektu (decyzja 2026-08-31, czat); agent Arena (sesja PR-2.1)
- **Zastępuje:** warstwę „kotwicy osadzenia" z ADR 0010 (narracja i prompt
  wychodzą z pętli dostawy) oraz sekcje Karty Katalogowej z ADR 0005/0010

## Kontekst

Pętla dostawy (ADR 0003) zakładała, że właściciel przekazuje wraz z kartą
alternatywny prompt wizualizacyjny i narrację fabularną, a ADR 0010 nadawał
im status „kotwicy osadzenia" — nie kanonu. Praktyka PR-2.1 pokazała koszt
strukturalny tego ustrojstwa: bogaty, sugestywny opis niekanonicznej sceny
leży o sekcję od treści kanonicznych i dwukrotnie „przeciekł" do opisu
karty (byty z promptu zostały opisane jak zawartość karty). Proces, który
polega na dyscyplinie wykonawcy, zawodzi przy każdej nowej karcie; proces,
który usuwa zagrożenie u źródła, zawodzić nie musi.

## Decyzja

1. **Format dostawy (chudy):** właściciel przekazuje wyłącznie cztery pola:
   `imgId (numer w arkuszu) · nazwa karty · set · plan`. Wszystko pozostałe
   (kolory, typ, koszt, statystyki, artysta, rama, flavor) pochodzi ze
   snapshotu Scryfalla posiadanego printu (ADR 0004).
2. **Narracja i prompt nie wchodzą do pętli** i nie są renderowane na Karcie
   Katalogowej. Wpis kolekcji (`collection/entries/`) pozostaje nienaruszalnym
   archiwum tego, co faktycznie dostarczono — wpis 1LTR zachowuje dostarczony
   kiedyś prompt i narrację jako zapis historyczny.
3. **Sekcje Karty Katalogowej (10):** dotychczasowe „Narracja Koleksji"
   i „Wizualizacja" (alternatywna koncepcja) znikają; wchodzi „Druk
   w Kolekcji" — opis wyłącznie oficjalnego wydruku posiadanego przez
   właściciela (artysta, rama, styl) na podstawie danych snapshotu. Pełny
   kontrakt sekcji żyje w docs/guides/SZKIELET_KARTY.md.
4. **Hierarchia kanonu (v2, ADR 0010) pozostaje w mocy** w części
   dotyczącej źródeł: karta MtG > lore świata docelowego > agent (synteza
   z cytowaniami). Usypia się wyłącznie rolę narracji jako źródła kontekstu
   sceny.
5. **Mapa:** uzasadnienia pinezek opierają się na lore świata i danych
   karty (nazwa, typ, mechanika), nie na narracji.
6. **Zawór na przyszłość:** jeśli przy konkretnej karcie właściciel zechce
   zostawić notatkę osobistą, wchodzi ona jako opcjonalna, wyraźnie
   odseparowana sekcja i nigdy nie jest źródłem kanonu.

## Konsekwencje

- Strona karty jest w całości kanoniczna: snapshot + lore z cytowaniami.
- Friction dostawy spada do jednej linijki — niższy próg materializacji,
   szybszy wzrost bazy.
- ADR 0005 i ADR 0010 przechodzą w status „Częściowo zastąpiona".
- Znika klasa błędów „byty z promptu opisane jak kanon karty" — testy
  dymne pilnują negatywnie (na stronie karty nie może być sekcji narracji
  ani treści promptu).
