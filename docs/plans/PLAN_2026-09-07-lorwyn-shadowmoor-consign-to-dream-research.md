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
- [x] Research kanonu, epok i dokładnego druku Scryfalla.
- [x] Lista kandydatów map z URL-ami; obejrzenie dostępnych podkładów
  i uczciwe oznaczenie materiałów niedostępnych/niezweryfikowanych.
- [x] Raport w `docs/research/` z rekomendacją, wariantami i decyzjami
  wymagającymi potwierdzenia właściciela; powrót do właściciela przed wdrożeniem.
- [x] Zielone testy/build, commit/push, kumulatywne rozszerzenie PR
  oraz handoff o oczekującym pakiecie.

## Granice

Bez nowych kart/planów/map w bazie na etapie researchu, bez zmiany
istniejącego archiwum, binariów źródłowych w Git, generowanych ilustracji,
nowych zależności, zmian workflow, scalania ani force pusha.

## Wynik i stan przekazania

Raport: `docs/research/RESEARCH_2026-09-07-lorwyn-shadowmoor.md`.
Rekomendacja: jeden plan Lorwyn–Shadowmoor (`lorwyn`), klasyczne oblicza
epoki Oony, domyślny Shadowmoor dla 605SHM, jedna regionalna pinezka
Glen Elendra. Najlepszy kandydat podkładów: para Varghedina (T1/T1),
T4 rezerwowo. Współczesnego Eclipsed nie mylić z dawnym globalnym cyklem.

Potwierdzono druk **SHM/32**, `{2}{U}`, Instant, flavor Oony.
Nie zmieniono dostawy ani nie opublikowano jeszcze materializacji.

**Oczekuje na decyzję właściciela:** model epoki/oblicz oraz akceptacja
konkretnych rastrów i ich commitowania. Do pełnego QA potrzebne oba
oryginały: lokalnie tylko miniatury 250/120 px, bezpośrednie pobranie
plików z files.mtg.wiki nie powiodło się (TLS). Deklarowane 2341×2341
potwierdza strona pliku, nie lokalny odczyt oryginału. Nie zapisano
fikcyjnych współrzędnych ani kalibracji.

## Decyzja właściciela po raporcie — 2026-09-07

Rekomendacja T1 odrzucona. Obowiązuje ADR 0037: T4 z jednym wspólnym
układem i przełączanymi nazwami Lorwyn/Shadowmoor, pinezki na obu.
Nie czekamy na Varghedina ani inne rastry; Eclipsed odłożone do właściwej
karty. Numer kolekcji **605**, imgId **605SHM** są niezmienne (ADR 0036).
Dalsze wykonanie: `PLAN_2026-09-07-605shm-lorwyn-shadowmoor-t4.md`.
