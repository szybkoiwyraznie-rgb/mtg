# ADR 0037: Lorwyn–Shadowmoor — T4 ze wspólną geometrią i przełączanymi nazwami

- **Status:** Zaakceptowana
- **Data:** 2026-09-07
- **Decydenci:** właściciel po researchu 605SHM — odrzucenie Varghedina i pozostałych map, wybór T4; jeden wspólny układ i pinezki w obu obliczach
- **Powiązania:** ADR 0018–0025 (mapforge/styl/wiązania), 0033 (epoki), 0035 (warianty), 0036 (tożsamość kolekcji)

## Kontekst

Właściciel nie zaakceptował żadnego znalezionego rastra Lorwynu.
Sama dostępność pary plików i wystarczająca rozdzielczość nie są
kryterium przyjęcia T1. Wzorcem jakości T1 pozostaje mapa Tarkiru.
Wybrane rozwiązanie dla Lorwynu to własna rekonstrukcja T4.

## Decyzja

1. **Jeden plan Lorwyn–Shadowmoor**, slug `lorwyn`, jedna mapa
   o wspólnym układzie przestrzennym. Karta `605SHM` należy do tego
   planu i zachowuje wszystkie identyfikatory kolekcji (ADR 0036).
2. **Dwa warianty T4**: Lorwyn i Shadowmoor. Przełączane są nazwy;
   geometrię buduje jedno źródło sceny, nie dwa niezależne rysunki.
   Te same pinezki kart występują w obu widokach, bez zmiany położenia
   i utraty zoomu. Dla pierwszej karty SHM startowym obliczem będzie
   Shadowmoor; obie kalibracje tożsamościowe w autorskim układzie T4.
3. **T1 ma być piękną, nienaganną mapą zaakceptowaną przez właściciela**
   (benchmark: Tarkir). Parametry techniczne ani fakt znalezienia mapy
   nie wystarczają. Dla Lorwynu T1 został odrzucony; Varghedin i inne
   odrzucone mapy nie są też potajemnie używane jako matryca geometrii T4.
4. **Geografia z kanonu tekstowego**, jawnie odróżniona od relacyjnej
   rekonstrukcji współrzędnych. Wspólny rysunek to konwencja atlasowa,
   nie twierdzenie, że Wielka Zorza zmieniała wyłącznie nazwy.
   Pary nazw muszą mieć uzasadnienie; nie dorabiać brakujących aliasów.
5. Zakres: **klasyczna epoka Oony**. Lorwyn Eclipsed rozpatrzymy dopiero,
   gdy przyjdzie karta wymagająca tego stanu. Nie dodajemy teraz mapy
   ruchomych granic, nowego planu ani lokacji powstałych po upadku Oony.
6. Glen Elendra jest nazwanym miejscem sceny. Pinezka o pewności
   `region` dotyczy ostępów doliny; nie wymyślamy dokładnego miejsca
   przy tronie/pałacu. Ochrona glen przed Zorzą wspiera wspólną kotwicę.

## Realizacja i odbiór

- Generator wspólnej sceny → dwa standardowe JSON-y scen z różnymi
  etykietami → mapforge → SVG. Oba SVG audytowane, nie tylko domyślny.
- `warianty[]` zgodne z ADR 0035: ID `shadowmoor` / `lorwyn`, oba T4,
  jeden domyślny, jeden zestaw pinezek; bez migracji istniejących map.
- Testy: identyczność geometrii, prawidłowe pary nazw, hydrologia,
  wiązania, integralność 605SHM/FOT/KON i przełączenia w przeglądarce.
- Całość i wycinki obu podkładów mają zostać obejrzane przed przekazaniem.
  Ostre SVG nie zastępuje oceny kompozycji, gęstości i czytelności.

Źródła researchu i historyczne, odrzucone warianty:
`docs/research/RESEARCH_2026-09-07-lorwyn-shadowmoor.md`.
