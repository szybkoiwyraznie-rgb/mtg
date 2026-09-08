# ADR 0042: Głos Kronikarza — narracja wpisu karty 100% w świecie do sekcji „Mechanika jako Opowieść”

- **Status:** Zaakceptowana
- **Data:** 2026-09-08
- **Decydenci:** właściciel projektu (decyzja 2026-09-08, czat: „Zasada była
  taka, że aż do części Mechanika jako opowieść całość treści jest 100%
  osadzona w Lore … to sformułowania w 100% w Lore z punktu widzenia
  niezależnego kronikarza z tego świata?” — recenzenckie odrzucenie
  narracji Expunge pełnej języka meta); agent Arena (sesja PR-25)
- **Powiązania:** ADR 0030 (LORE-first; jej §5 „skrajnie zwięźle”
  wycofany — patrz §3), ADR 0016 (szkielet sekcji — nagłówki bez
  zmian), ADR 0026 (Fabuła jako kotwica transpozycji — pozostaje
  wiążąca, ale jej TERMIN nie wchodzi w narrację), ADR 0040 (druk
  źródłowy)

## Kontekst

ADR 0030 ustalił, że Karta Katalogowa „mówi głosem niezależnego
kronikarza świata”, lecz jej §5 zostawiał lukę: komentarze meta dozwolone
„gdy są niezbędne do osadzenia lore i podane skrajnie zwięźle”. Praktyka
(Pr-24/PR-25) wykazała, że luka zostaje wykorzystana: narracja Expunge
(40USG) i — skanem 2026-09-08 potwierdzone — reszta katalogu (wszystkie
karty) łączyła świat z warsztatem: „scena tej karty”, „w epoce karty”,
„Karta nie ma flavor textu (Scryfall: brak pola flavor_text)”, „Fabuła
kolekcji wybiera”, „most jest krótki”, „reguła zapisuje”, „Kodeks czyta”.
Właściciel rozstrzygnął bezlitośnie: narracja ma być czytana jak wpis
w kronikę tego świata — niezależny kronikarz nie wie, że istnieje
karta, Fabuła-dokument, Kodeks-produkt ani Scryfall.

## Decyzja

1. **Cała narracja wpisu karty — od pierwszej sekcji do sekcji
   „Mechanika jako Opowieść” włącznie (Kronika Lore, Postacie i Byty,
   Nazwa Karty, Flavor Text, Transpozycja, Na Mapie) — jest pisana
   głosem niezależnego kronikarza tego świata.** Tekst musi się dać
   wyczytać jako fragment kroniki świata bez żadnej znajomości
   procesu tworzenia wpisu.
2. **Zabronione w ciele sekcji narracyjnych** (nagłówki sekcji są
   wyznaczone szkieletem ADR 0016/0030 i pozostają bez zmian — reguła
   dotyczy prozy, nie tytułów): terminy warstwy meta — „karta/karty/
   …” (w sensie karty MtG), „Fabuła” (jako dokument dostawy), „Kodeks”
   (jako produkt), „Scryfall”, „oracle”, „print”, „flavor” (jako
   termin), „snapshot”, „dostawa”, „reguła/reguły karty”, „epoka
   karty”, „most” (idiom mostu karta→świat), „brak pola …”,
   nazwy pól snapshotu (flavor_text itd.), „kanon” (w sensie kanonu
   projektu; kanon religii świata = „prawo tej wiary”), „kolekcja”
   (jako produkt projektu), „wydanie” (w sensie wydania zestawu —
   „wydanie dekretu” w świecie dozwolone).
3. **Wycofany jest §5 ADR 0030** (meta „skrajnie zwięźle” w treści
   głównej). Warstwa meta ma cztery dozwolone adresy, i tylko tam:
   - **frontmatter** (metryka wpisu),
   - **infoboks** (auto ze snapshotu — ADR 0030 §2),
   - **„Mechanika jako Opowieść”** (reguły, koszt, typ, cykling —
     ADR 0030 §3),
   - **„Źródła”** (cytowanie: Fabuła właściciela, Scryfall, wiki,
     mapa — ADR 0010/0026).
   „Podsumowanie Lore” stoi za „Mechaniką” — traktowane jest jako
   warstwa komentarza (meta dozwolone w minimalnym stopniu).
4. **Standardowa leksyka zastępcza** (żeby kolejne sesje nie
   improwizowały):
   - karta (MtG) → **scena** / **ryt** / **zaklęcie** / **zapis**;
   - flavor text (cytat) → **inskrypcja** (sama treść cytatów
     pozostaje bez zmian — to głos świata, ADR 0030 §4);
   - „w epoce karty” → **w epoce [nazwa epoki]** / „w chwili inwazji”
     (konkretny czas świata, nie odniesienie do karty);
   - „reguła karty” → **mechanika rytu** (w narracji tylko jako
     właściwość świata; precyzyjne reguły — w „Mechanice”);
   - „Fabuła (właściciela) mówi/dopowiada” → **kronikarz dopowiada** /
     **zapis podaje** (wiążąca treść Fabuły zostaje — ADR 0026 —
     zmienia się tylko jej NACZYNIE: kronika, nie dokument dostawy);
   - „Kodeks czyta/odczytuje” → **kronika odczytuje** / **zapis
     odczytuje**;
   - „kanon / kanon świata / kanon X” → **zapis** / **kronika świata**
     (np. „kanon geograficzny” → „zapis geograficzny”; „nie nowy
     kanon” → „nie nowy fakt świata”);
   - „scena/figura/materializacja kolekcji” → **scena z zapisu** /
     **postać zapisu** / **kronika zawęża scenę** (kolekcja jako
     produkt projektu nie ma imienia w świecie);
   - „Karta jest rodzima dla X, więc most jest krótki: Fabuła
     kolekcji wybiera …” → **Scena jest rodzima dla X; zapis
     osadza ją w …** (idiom mostu zniesiony).
5. **„Na Mapie” jako sekcja praktyczna** — dopuszcza: opis miejsca
   w głosie kronikarza + jeden wiersz praktyczny z deep-linkiem
   (`#/mapa/…?pin=…`) oraz pojęcie pewności miejsca (w formie
   „pewność miejsca/rejonu”, nie „poziom pewności pinezki”). Droga
   do plików warsztatu (np. `maps/…/map.json`) w narracji zabroniona.
6. **Strażnik testowy** `test/glos-kronikarza.test.js` — dla każdej
   karty ze snapshotem: ciało sekcji narracyjnych (nagłówki pomijane)
   nie może zawierać terminów z §2; naruszenie = błąd buildu testów.
   Test ma też regresję negatywną dla 40USG (sytuacja, która
   wywołała ADR).

## Konsekwencje

**Dodatnie:** karta czytana od pierwszej sekcji do „Mechaniki” to
w całości tekst w świecie — meta-warstwa jest wrażliwa tylko tam,
gdzie czytelnik jej szuka (infoboks, Mechanika, Źródła); reguła
jest maszynowo pilnowana (strażnik), więc dryf typu PR-24/PR-25 nie
przechodzi przez `npm test`; leksyka zastępcza eliminuje improwizację
pomiędzy sesjami.

**Ujemne:** zwrot „scena tej karty” bywał krótszy od „scena
osadzona w świecie” — płacona cena za czystość głosu (właściciel:
to cena świadoma); sekcja „Na Mapie” traci prawo do swobodnego
mieszania głosu kronikarza z opisem UI (zostaje jeden wiersz
praktyczny).

**Dla sesji agentskiej:** przed commitowaniem wpisu karty — przeczytać
narrację na głos jako kronikarza świata; każdy termin z §2 w ciele
sekcji narracyjnej = przerwać i przepisać (nie „skrócić”); Źródła
mogą cytować Fabułę i Scryfall wprost — to jest ich rola.
