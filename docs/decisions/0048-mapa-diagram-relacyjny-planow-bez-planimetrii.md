# ADR 0048: Mapa-diagram relacyjny dla planów bez stabilnej planimetrii (Duskmourn)

- **Status:** Zaakceptowana
- **Data:** 2026-09-18
- **Decydenci:** właściciel projektu (zatwierdzenie modelu diagramu
  Duskmourn 2026-09-13, sesja PR-34 — zapis w `maps/duskmourn/map.json`:
  „Model zatwierdzony przez właściciela 2026-09-13”); agent Arena
  (sesja PR-35 — formalizacja w rejestrze po wykryciu luki audytem
  `docs/audits/AUDYT_2026-09-18-PR34.md`, Z2)
- **Doprecyzowuje:** ADR 0007/0012 (drabina wariantów map — T4 jako
  rekonstrukcja z kanonu tekstowego), ADR 0038 (T4 jako ostateczność
  z uzasadnieniem), ADR 0033 (jedna mapa aktualnego stanu planu)
- **Powiązania:** ADR 0043 (na mapie oznaczenia noszą wyłącznie karty),
  ADR 0013 (proweniencja w map.json), ADR 0027 (drzewo stron map)

## Kontekst

Duskmourn (dostawa 373DSK, PR-34) jest pierwszym planem, którego kanon
**jawnie wyklucza planimetrię**: cały plan mieści się wewnątrz Domu,
pokoje stale zmieniają położenie i sąsiedztwa, pięć stref przenika się
bez twardych granic, a jedyną stałą relacją przestrzenną jest oś
piwnica pierwotnego domu → The Below (Planeswalker's Guide to
Duskmourn). Klasyczna mapa T4 (kontynenty, kierunki, odległości)
fabrykowałaby nieistniejącą geografię — dokładnie wbrew hierarchii
kanonu (ADR 0010).

Sesja PR-34 rozwiązała to **diagramem relacyjnym**: arkusz klasyfikuje
temperament przestrzeni (pięć stref + węzeł zmiennych pokoi + jedyna
stała oś), nie przedstawia kierunków, odległości ani tras. Właściciel
zatwierdził model 2026-09-13, ale decyzja żyła tylko w `map.json`
i researchu mapy — rejestr ADR jej nie znał (ten sam wzorzec dryfu co
przy ADR 0013/0021).

## Decyzja

1. **Plan, którego kanon wyklucza stabilną planimetrię, może otrzymać
   mapę-diagram relacyjny** — wariant T4 w drabinie (rekonstrukcja
   własna z kanonu tekstowego), którego geometria jest **kompozycyjna,
   nie kartograficzna**. Diagram klasyfikuje strefy/temperamenty
   i relacje poświadczone kanonem; nie przedstawia kierunków świata,
   odległości, skali ani trwałych tras.
2. **Warunek wejścia:** źródło kanoniczne musi jawnie stwierdzać
   niemożliwość/niestabilność geografii (jak „impossible geography”
   Duskmourn). Diagram nie jest wytrychem dla planów słabo opisanych —
   te dostają zwykłą rekonstrukcję T4 z uzasadnieniem (ADR 0038 §2).
3. **Kontrakt antykartograficzny jest obowiązkowy i jawny** w trzech
   miejscach: (a) `map.json` — `uklad_wspolrzednych` deklaruje, że
   współrzędne są kompozycyjne; `zrodlo.notka` nazywa model i decyzję
   właściciela; (b) nota researchu mapy (`zrodlo-research.md`);
   (c) sama grafika może nieść legendę kontraktu (jak legenda
   Duskmourn: „pola = temperament strefy, nie prowincja”).
4. **Elementy stałe tylko z kanonu:** relacja narysowana jako stała
   (oś piwnica → The Below) wymaga kanonicznego poświadczenia
   stałości. Wszystko inne rysuje się językiem możliwości (przerywane
   linie apertur, przenikające pola) albo wcale.
5. **Pinezki i kotwice działają bez zmian** (ADR 0043: tylko karty;
   protokół pewności ADR 0007): pewność `przyblizona`/`region` odnosi
   się do klasyfikacji sceny w diagramie, a uzasadnienie pinezki mówi
   wprost, że współrzędna nie jest miejscem ani kierunkiem. Oprawa
   kartograficzna sugerująca pomiar (kompas, podziałka skali) jest
   na diagramie zakazana.
6. **Diagram jest pełnoprawną mapą planu** w modelu danych (rejestr
   map, strona mapy, mini-mapa, deep-linki) — różnica jest semantyczna
   i deklaratywna, nie techniczna.

## Konsekwencje

**Dodatnie:** plany o niemożliwej geografii dostają uczciwą reprezentację
zamiast fałszywej kartografii; kontrakt jest jawny dla czytelnika
i przyszłych sesji; rejestr ADR znów opisuje stan repo (koniec dryfu Z2).

**Ujemne:** diagram nie odpowie na pytanie „jak daleko” ani „w którą
stronę” — świadomy koszt zgodny z kanonem; granica „kanon wyklucza
planimetrię” vs „kanon jej nie podaje” wymaga researchu i bywa oceną
(rozstrzyga research mapy + w razie wątpliwości właściciel).

**Dla sesji agentskiej:** zanim narysujesz klasyczną mapę nowego planu,
sprawdź, czy kanon w ogóle dopuszcza planimetrię; jeśli nie — model
diagramu wg tego ADR (kontrakt w trzech miejscach, stałe relacje tylko
z kanonu); nie dorabiaj Duskmournowi kierunków ani tras przy kolejnych
kartach — zagęszczanie stref jest dozwolone, trwałe trasy wymagają
jednoznacznego wyjątku w kanonie.
