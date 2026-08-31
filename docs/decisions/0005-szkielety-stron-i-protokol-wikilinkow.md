# ADR 0005: Szkielety stron (Karta Katalogowa, Karta Haseł) i protokół wikilinków

- **Status:** Częściowo zastąpiona — szkielet Karty Katalogowej zmienia
  ADR 0011 (aktualny kontrakt sekcji żyje w docs/guides/SZKIELET_KARTY.md);
  szkielet Karty Haseł i protokół wikilinków pozostają w mocy
- **Data:** 2026-08-31
- **Decydenci:** właściciel projektu (zatwierdzenie listy sekcji 2026-08-31); agent Arena (sesja PR-1)

## Kontekst

Baza ma dwa typy stron treściowych plus strony rejestrowe. Spójność
struktur jest warunkiem Pętli Jakości (ADR 0006): pogłębianie i
link-mining działają tylko wtedy, gdy sekcje są przewidywalne, a encje
świata łączą się wikilinkami w jeden graf, zamiast dublować wiedzę na
wielu kartach. Pełne kontrakty sekcji (co skąd czerpie, co obowiązkowe)
opisują `docs/guides/SZKIELET_KARTY.md` i `SZKIELET_HASLA.md`; tu
decyzja strukturalna.

## Decyzja

### Typy stron

| Typ | Katalog | Slug | Powstaje |
|---|---|---|---|
| Karta Katalogowa | `content/cards/` | `<imgid>-<nazwa>` (np. `1ltr-dunland-crebain`) | materializacja jawnie przekazanej karty |
| Karta Haseł (hasło lore) | `content/lore/` | nazwa encji (np. `crebain`) | link-mining / zlecenie |
| Plan/Setting | `content/planes/` | nazwa planu (np. `srodziemie`) | pierwszy wpis z danego planu |

Slugi: małe litery ASCII, myślniki; polskie znaki transliterowane
(`srodziemie`, `wiedzmin`). **Jedna przestrzeń nazw dla wszystkich typów**
— kolizja sluga to błąd testu. Karty Katalogowe mają prefiks imgId, więc
nie kolidują z hasłami (karta `1ltr-dunland-crebain` vs hasło `dunland`).

### Szkielet Karty Katalogowej (sekcje treści)

1. Metryka i Kontekst Świata — infobox (dane karty + plan + tagi) oraz
   umiejscowienie sceny w settingu po transpozycji
2. Postacie i Byty — kto/co występuje (główne źródło wikilinków)
3. Nazwa Karty — etymologia i sens nazwy w świecie
4. Mechanika jako Opowieść — koszt, kolor, statyki, keywords jako narracja
5. Flavor Text — oryginał (EN), tłumaczenie, interpretacja
6. Transpozycja — most między kartą MtG a settingiem docelowym
7. Narracja Kolekcji — narracja właściciela **verbatim** (kanon, ADR 0003)
8. Wizualizacja — prompt (verbatim) + opis, co obraz pokazuje
9. Wątki i Powiązania — wikilinki do haseł i kart (bez dublowania wiedzy)
10. Na Mapie — lokalizacja + poziom pewności (dokładna/region/przybliżona)
11. Źródła — cytowania z kwerendy (link + co z nich zaczerpnięto)
12. Podsumowanie Lore — synteza

### Szkielet Karty Haseł

1. Definicja (lead w duchu Wikipedii)
2. Klasyfikacja: geografia / społeczność / magia / fauna / flora / postać /
   wydarzenie / artefakt / koncepcja
3. Opis (wiedza + cytowania; encja **w settingu po transpozycji**)
4. W kolekcji — backlinki liczone automatycznie (nie utrzymuje się ręcznie)
5. Powiązane hasła
6. Na mapie (jeśli geograficzne)
7. Źródła

### Protokół wikilinków

1. Składnia: `[[slug]]` lub `[[slug|etykieta]]`. Link celuje w **slug**,
   nie w tytuł — tytuły mogą się zmieniać, slugi nie.
2. **Każdy wikilink musi się rozwiązywać** — martwy link to czerwony test
   (`test/wikilinki.test.js`), a nie czerwona kropka na stronie.
3. Backlinki liczy build; sekcja „W kolekcji" i „Powiązane" to dane
   wyliczone, nie wpisane ręcznie.
4. **Zasada anty-dublowania:** wiedza wspólna dla 2+ stron ląduje w Karcie
   Haseł, a strony odsyłają wikilinkami. Karta Katalogowa opisuje kartę;
   hasło opisuje element świata.
5. Tagi: płaski słownik w `content/taxonomia.json` (każdy tag z opisem);
   użycie taga poza słownikiem = czerwony test. Nowy tag = świadoma
   jednozdaniowa zmiana w słowniku.

## Konsekwencje

**Dodatnie:** przewidywalna struktura = automatyzowalna Pętla Jakości;
graf wiedzy zamiast kopii; testy łapią martwe linki i sieroty zanim
właściciel je zobaczy.

**Ujemne:** dyscyplina pisania (slugi, tagi, słownik) — to koszt
utrzymania „wikipedii" i jest nieunikniony.
