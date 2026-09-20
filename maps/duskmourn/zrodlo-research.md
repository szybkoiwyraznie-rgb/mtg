# Research mapy Duskmourn — 2026-09-13

## Konkluzja

Duskmourn nie może otrzymać mapy planimetrycznej. Oficjalny przewodnik
nazywa geografię Domu „niemożliwą”: zewnętrze nie istnieje, pokoje stale
zmieniają położenie i sąsiedztwa, a pięć stref przenika się bez twardych
granic. Mapa Codexu jest więc diagramem klasyfikacyjnym T4.

## Twarde fakty

- cały współczesny plan mieści się wewnątrz Domu;
- każdy pokój łączy się z innym przez drzwi, okno lub inną aperturę;
- nie istnieje rozpoznawalna logika połączeń;
- pięć luźnych stref to Mistmoors, Floodpits, Balemurk, Boilerbilges
  i Hauntwoods;
- The Below jest jedynym stałym punktem;
- prowadzi do niego piwnica pierwotnego domu w głębi Balemurku.

## Kontrakt antykartograficzny

Diagram nie przedstawia kierunków świata, odległości, kondygnacji ani
trwałych szlaków. Położenie stref jest kompozycyjne. Przerywane linie
symbolizują możliwość apertury, nie poświadczone przejście. Wyłącznie oś
piwnica pierwotnego domu → The Below ma znaczenie stałej relacji.

## Decyzja 373DSK

Sypialnia i pusta przestrzeń podmiejska nie wystarczają do jednoznacznego
przypisania strefy. Pinezka trafia do centralnego pola zmiennych pokoi,
na styku stylistycznym Mistmoors i Balemurku, z pewnością `przyblizona`.
Nicość uprowadzenia nie jest utożsamiona z The Below.

## Źródła

- Wizards, *Planeswalker's Guide to Duskmourn*:
  https://magic.wizards.com/en/news/feature/planeswalkers-guide-to-duskmourn
- MTG Wiki, *Duskmourn* — zestawienie stref i nazwanych obszarów:
  https://mtg.wiki/page/Duskmourn

## Addendum 2026-09-20 — pass mapowy PR-35 (Pętla Jakości, krok 4)

Wzbogacenie diagramu (ADR 0048) o kanoniczne pod-lokacje stref z
mtg.wiki: Duskmourn („Locations" + „Safe zones"), z zachowaniem
kontraktu antykartograficznego — pozycje pod-lokacji są kompozycyjne
(wewnątrz pola macierzystej strefy), nie planimetryczne:

- **Valley of Serenity** — pokoje-pastwiska przez Mistmoors i Balemurk;
  wioska i jaskiniowy ołtarz kultu Valgavotha;
- **baza Instytutu Domu** — stałe zaplecze w salach operacyjnych
  Floodpits;
- **razor mazes** i **The Rollercrusher Ride** — Boilerbilges;
- **labirynt żywopłotów** — Hauntwoods;
- **błonia karnawału (utracone)** i **osady strychowe** z muralem —
  strefy bezpieczne Mistmoors (karnawał utracony ok. 4564 AR; era
  Omenpathów kurczy strefy bezpieczne).

`map.json`: kotwice 8 → 15; podkład: 7 nowych etykiet kursywą
(drugorzędna hierarchia wobec nazw stref). Raster obejrzany (L10),
`map-audit.py` 0 problemów. Pinezka 373DSK nietknięta (L18).
