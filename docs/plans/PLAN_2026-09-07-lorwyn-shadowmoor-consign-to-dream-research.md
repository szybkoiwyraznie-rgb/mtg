# Plan: 605SHM Consign to Dream — research Lorwyn–Shadowmoor

Data: 2026-09-07. Gałąź: `arena/01a07d33-mtg`, kontynuacja otwartego
PR #22 (audyt PR #21 i Pętla Jakości zakończone wcześniej).

## Zlecenie i granica etapu

Właściciel przekazał nową kartę i poprosił najpierw o propozycję obsługi
dwóch wcieleń planu, research możliwych map i rekomendację.
**Ten etap nie materializuje karty/planu i nie rysuje mapy.** Wpis
kolekcji, pełny snapshot w `scryfall/`, strony i `map.json` powstaną po
uzgodnieniu rozwiązania, w jednym spójnym pakiecie. Dzięki temu nie
powstaje osierocony wpis kolekcji ani mapa bez danych.

## Oczekująca dostawa — zapis verbatim na potrzeby kolejnego kroku

`605SHM · Consign to Dream · SHM · Lorwyn`

> W spowitych wieczornym mrokiem ostępach Glen Elendra na planie Lorwyn królowa Oona i jej wróżki władają krainą snów i iluzji. Na gest srebrnego wrzeciona potężny leśny olbrzym zastyga w bezruchu, bezwiednie zapadając w głęboki, hipnotyczny letarg. Jego masywne, kamienne ciało ulega natychmiastowej dematerializacji, rozpadając się w powietrzu na miriady świecących błękitnych motyli i lśniącego pyłu. W krainie wiecznego półmroku nawet najtwardsza rzeczywistość okazuje się jedynie kruchą ułudą, gotową rozwiać się na zawsze pod wpływem czarów władczyni fae.

To zapis zlecenia, nie opublikowana Karta Katalogowa. Przy materializacji
przenieść Fabułę verbatim do archiwum, nie zastępować jej syntezą researchu.

## Pytania do rozstrzygnięcia researchem

- Lorwyn i Shadowmoor: dwa plany, aspekty jednego planu czy epoki?
  Oddzielić klasyczną erę Oony od obecnego stanu Lorwyn Eclipsed.
- Czy Glen Elendra zachowuje tożsamość przy Wielkiej Zorzy i jaką rolę
  pełni jako kotwica tej sceny? Nie zakładać niezmienności całego świata.
- Karta SHM: prawidłowy druk, Oracle i flavor; `imgId` nie jest numerem
  kolekcjonerskim. Czy „zniknięcie na zawsze” jest metaforą, nie regułą?
- Dostępne T2/T1: pochodzenie, autor, epoka, format, rozdzielczość,
  kompletność i zgodność lokalizacji. Mapy fanowskie nie stają się kanonem
  przez umieszczenie ich w galerii wiki.
- Czy znalezione podkłady pozwalają na wspólną siatkę i jak to sprawdzić?
  Jeśli nie, jaki minimalny wariant T4 byłby uczciwą rekonstrukcją?

## Kroki

- [x] Sprawdzenie repo/PR: #22 otwarty, drzewo czyste, pełna historia;
  nie powtarzać zakończonego audytu PR #21.
- [x] Lektura obowiązujących ADR 0026/0033/0035 i procedury map.
- [ ] Research kanonu, epok i dokładnego druku Scryfalla.
- [ ] Lista kandydatów map z URL-ami; obejrzenie dostępnych podkładów
  i uczciwe oznaczenie materiałów niedostępnych/niezweryfikowanych.
- [ ] Raport w `docs/research/` z rekomendacją, wariantami i decyzjami
  wymagającymi potwierdzenia właściciela; powrót do właściciela przed wdrożeniem.
- [ ] Zielone testy/build, commit/push, kumulatywne rozszerzenie PR
  oraz handoff o oczekującym pakiecie.

## Granice

Bez nowych kart/planów/map w bazie na etapie researchu, bez zmiany
istniejącego archiwum, binariów źródłowych w Git, generowanych ilustracji,
nowych zależności, zmian workflow, scalania ani force pusha.
