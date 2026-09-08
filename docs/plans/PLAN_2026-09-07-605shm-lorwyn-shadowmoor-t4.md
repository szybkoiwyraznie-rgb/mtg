# 605SHM — materializacja i Lorwyn–Shadowmoor T4

Sesja `arena/01a07d33-mtg`, otwarty PR #22. Decyzja właściciela po
researchu: **T4, jeden wspólny układ, przełączane nazwy Lorwyn/Shadowmoor,
pinezki kart na obu; Eclipsed odłożone do właściwej karty** (ADR 0037).
Numer kolekcji **605**, imgId **605SHM** nie podlegają zmianie (ADR 0036).

## Źródło dostawy

`docs/plans/PLAN_2026-09-07-lorwyn-shadowmoor-consign-to-dream-research.md`
zawiera Fabułę verbatim. Przy materializacji przenieść ją bez zmiany
słów do `collection/entries/605shm-consign-to-dream.md`.
Zewnętrzne dane druku służą tylko snapshotowi; FOT/KON i slug wynikają
wyłącznie z identyfikatora właściciela.

## Plan

- [x] Utrwalić decyzje: ADR 0036/0037, L8, oznaczenie odrzuconego T1;
  regresja sondowania `605FOT.png`/`605KON.png` niezależnie od Scryfalla.
- [x] Wspólny warsztat: potrzebne klocki i audyt wszystkich SVG wariantów,
  z testami; bez wpływu na zaakceptowane mapy. Dodano jaskinię (Velis Vel),
  osobne id zasobów przy dwóch inline SVG T4 i regresję audytu drugiego SVG;
  138/138 testów, build zielony.
- [ ] Generator jednego układu z kanonu tekstowego (bez odrzuconych map
  jako matrycy), dwa standardowe JSON-y scen różniące się etykietami,
  wspólne biomy/rzeki/pasma/POI; render mapforge, motyw atlas.
- [ ] Proweniencja każdej kotwicy i każdej pary nazw; rozróżnienie
  relacji kanonicznych od umownych współrzędnych rekonstrukcji.
- [ ] Spójny pakiet: archiwum + pełny snapshot + karta LORE-first
  `605shm-consign-to-dream` + plan `lorwyn` (Lorwyn–Shadowmoor) + mapa.
  Jedna regionalna pinezka Glen Elendra, domyślny Shadowmoor dla SHM.
- [ ] Bramy: oba podkłady z geometrią identyczną, wiązania/hydrologia 0,
  map-audit 0, poprawne nazwy epoki Oony, integralność dostawy/imgId/FOT/KON.
- [ ] Ogląd całości i wycinków obu map oraz rzeczywiste przełączenia,
  zoom, pinezka i powrót do karty (HTTP i file://, desktop/mobile).
- [ ] Co nowego, historia/roadmapa, końcowy handoff; pełne testy/build,
  czyste drzewo, push i kumulatywny opis PR po zielonych etapach.

## Zakres geograficzny

Znana część planu, nie wymyślony ocean otaczający glob. Szkielet:
Wanderwine/Wanderbrine i jego źródła, góry, zachodnie lasy i osady kithkin,
Gilt-Leaf/Wilt-Leaf na wschodzie, Lys Alana/Cayr Ulios i Glen Elendra
na południe od nich. Nazwy bez potwierdzonej pary nie dostają wymyślonego
nocnego odpowiednika. Wielka Zorza zmieniała świat; wspólny rysunek jest
wybraną konwencją atlasu, nie twierdzeniem o niezmienności krajobrazu.

## Granice

Bez renumeracji kolekcji, generowania FOT/KON, nowych zależności,
przeróbek odrzuconych rastrów, map Eclipsed, haseł na zapas,
zmian workflow, scalania ani force pusha.
