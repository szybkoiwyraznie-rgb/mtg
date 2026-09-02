# ADR 0028: Klocek `fort` — warownie jako osobny typ POI (domknięcie E5)

- **Status:** Zaakceptowana
- **Data:** 2026-09-02
- **Decydenci:** agent Arena (realizacja kolejki warsztatowej E5 z ROADMAP,
  PR-9/PR-11; właściciel zlecił wyczerpanie kolejki todo 2026-09-02)
- **Powiązane:** ADR 0018 (klocki), 0020 (adopcja glifów z atrybucją),
  0024 (ikony POI w kołach, nowe typy rysowane ręcznie w języku mapy)

## Kontekst

Kolejka E5 przewidywała nowe klocki (cytadela/fort, latarnia, wrak) z
kandydatem „symbole Azgaar (MIT), z atrybucją" i zasadą **adopcji tylko
przy realnym użyciu na mapie**. Na Zendikarze warownie były rysowane
klockiem `miasto`, przez co Fort Keff i „stone havens" Akoum nie różniły
się od zwykłych osad. Kanon potwierdza cztery użycia: **Fort Keff**
(twierdza przy Eye of Ugin — MTG Wiki „Fort Keff") oraz **Grip Haven,
Slab Haven, Ghostwatch** — osady w kamiennych fortach odkopanych przez
Eldrazi, tzw. *stone havens* (The Art of MTG: Zendikar via MTG Salvation
„World of Zendikar IV").

## Decyzja

1. Nowy klocek `fort` w `tools/mapforge/bloki.mjs`: kamienne mury
   z donżonem o dwóch blankach i łukową bramą, **sylwetka w kole
   z nieprzezroczystym tłem** — spójnie z `miasto`/`ruina` (ADR 0024).
2. Klocek jest **rysowany ręcznie w języku mapy** (czarna sylwetka),
   NIE adoptowany z Azgaar — jasne, fasetowane symbole Azgaar nie pasują
   do wzorca atlasowego (wniosek z rund stylu ADR 0019/0021); kandydatura
   Azgaar z E5 zostaje odrzucona dla POI tego stylu.
3. `latarnia` i `wrak` z E5 **nie powstają**: żaden kanoniczny,
   nazwany obiekt na obecnych mapach ich nie potrzebuje (zasada z E5:
   adopcja tylko z realnym użyciem; latarnia Sea Gate to część miasta,
   nie osobny POI).
4. Użycie na Zendikarze: Fort Keff, Grip Haven, Slab Haven, Ghostwatch
   (typ POI `miasto` → `fort`; proweniencja w `map.json`).

## Konsekwencje

- Warownie są odróżnialne od osad na pierwszy rzut oka; wzór etykiet
  traktuje `fort` jak `miasto` (strefa ikony 13/13 w `PROMIEN_POI`).
- Scena demo („Wyspa Próbna") zawiera `fort` — katalog klocków kompletny.
- Kolejny nowy typ POI = nowy ręcznie rysowany klocek w języku mapy
  + wpis w `PROMIEN_POI` + użycie z kanonicznym uzasadnieniem.
