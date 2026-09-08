# Research mapowy: Innistrad — wybór wariantu (MA1)

Data: 2026-09-08 · sesja PR-23 · drabina wg [ADR 0038](../../docs/decisions/0038-drabina-preferencji-wariantow-map-t2-t1-t3-t4.md)

## Wniosek w jednym zdaniu

**Rekomendacja: T3** (własny wektor przerysowany z geometrii dobrego
rastra fanowskiego), z opcją awansu do **T1**, jeśli właściciel
dostarczy raster i zdecyduje o jego commicie (ADR 0035).

## Rząd 1 — T2 (gotowa geometria wektorowa): BRAK

Nie znaleziono żadnego wektora Innistradu nadającego się do adopcji.
Mapy społecznościowe powstają w **Inkarnate** — narzędziu rastrowym
(eksport PNG/JPG). Projekty „wektorowe" w wynikach to w istocie
ilustracje bitmapowe. Rząd 1 odpada.

## Rząd 2 — T1 (wyśmienity raster): warunkowo dostępny

Ustalenie kluczowe: **WotC nigdy nie wydał oficjalnej mapy Innistradu.**
Potwierdzają to zarówno społeczność („There is no official map of
Innistrad unfortunately"), jak i brak mapy w Planeswalker's Guide —
przewodniki mają wyłącznie concept art regionów, bez rzutu
kartograficznego. To wyklucza raster oficjalny jako podkład.

Najlepszy kandydat fanowski (obejrzany):

- **Mapa z r/mtgvorthos „map of Innistrad for my TTRPG game" (2025)**,
  rozwinięcie wcześniejszej mapy *wittmitin*; źródło rastra 4096 px.
  Ogląd potwierdza bardzo wysoką kompletność toponimii: Stensia
  z Needle's Eye Pass, Ziel/Kruin/Getander/Hofsaddel Pass, Ashmouth,
  Farbog, Voldaren Estate, Markov Manor, Lurenbraum Fortress,
  Somberwald, Heron's Grace Monastery; Gavony z Thraben, Nearheath
  (Videns, Wittal, Effalen, Estwald, Hanweir), Moorland, Trostad,
  Westvale, rzeka Kirch; Kessig z Ulvenwald, Hollowhenge, Lambholt,
  Gatstaf, Natterknolls, Bower Passage, Briar Bridges, Devils' Breach,
  The Approaches; Nephalia z Havengul, Drunau, Selhoff, Morkrut Swamp,
  Lake Zhava, Erdwal, Jenrik's Tower, Silver Beach.
- Zgodność z kanonem tekstowym **dobra**: Gavony w centrum, Stensia
  na północy, Kessig na zachodzie, Nephalia na wschodzie/wybrzeżu;
  Nephalia wysunięta tak, by Voldaren Estate widziało jej wybrzeże
  (wymóg z *Planeswalker's Guide*); Thraben na północnym skraju Gavony.

Zastrzeżenie do T1: mapa jest **wyraźnie stylizowana Inkarnate**
(cieniowane góry, kolorowe biomy, gotowe ikony). Zderza się to
z czarno-białym stylem atlasowym Kodeksu (ADR 0019) i z resztą map
planów. Jako podkład T1 dałaby najbogatszą treść, ale zerwałaby
spójność wizualną kolekcji.

## Rząd 3 — T3 (raster łatwy do wektoryzacji): REKOMENDACJA

Ten sam raster nadaje się **znakomicie jako matryca geometrii**
(ADR 0031 §1, §5: „geometria służy jako matryca"). Powody:

- Układ jest czytelny i rozstrzyga wszystkie sporne relacje między
  prowincjami, których sam tekst nie domyka (dyskusje społeczności
  pokazują, że kierunki świata w kanonie są *inferowane*, nie podane).
- Kształty do przerysowania są proste: jedna linia brzegowa, cztery
  obszary prowincji, jedno pasmo górskie z przełęczami, jeden wielki
  las, rzeka i kilka jezior. To geometria w zasięgu `mapforge`.
- Wynik wchodzi w styl atlasowy Kodeksu i będzie spójny z Mirrodinem,
  Zendikarem, Alarą i Lorwynem.
- Innistrad ma **gęstą i dobrze udokumentowaną toponimię** w źródłach
  tekstowych (Planeswalker's Guides, MTG Wiki), więc każdy POI da się
  niezależnie zweryfikować w kanonie zamiast ufać rastrowi.

## Rząd 4 — T4: niepotrzebny

Materiał graficzny istnieje i jest dobry, więc rekonstrukcja z samego
tekstu byłaby marnotrawstwem i dałaby gorszy wynik (ADR 0038 §2).

## Uwaga o epoce (ADR 0033)

Innistrad ma kilka stanów kanonicznych: era *Innistrad/Dark Ascension*
(Avacyn uwięziona, Avabruck jeszcze istnieje), *Avacyn Restored*,
*Shadows over Innistrad* (Emrakul), *Midnight Hunt/Crimson Vow*
(zaburzone święta, Voldaren). Zgodnie z ADR 0033 rysujemy **jedną mapę
aktualnego stanu kanonicznego** — geografia prowincji jest przez te
epoki stabilna, więc jedna mapa obsłuży karty z całego bloku.
Rozstrzygnięcia zmienne w czasie (Avabruck → Hollowhenge) zapisujemy
w notce kotwicy, nie w dwóch mapach.

## Źródła

- A Planeswalker's Guide to Innistrad: Introduction (2011) — cztery prowincje, charakterystyka każdej: https://magic.wizards.com/en/news/feature/planeswalkers-guide-innistrad-introduction-2011-08-24
- Archive Trap: The World of Innistrad (MTG Salvation) — układ prowincji, Thraben na jeziorze Herons, parafie Nearheath, Moorland, trzy przełęcze Stensii, Ashmouth, Devil's Breach: https://www.mtgsalvation.com/articles/49486-archive-trap-the-world-of-innistrad
- r/mtgvorthos, „[UPDATED] Map of Innistrad" (2023) — potwierdzenie braku oficjalnej mapy WotC: https://www.reddit.com/r/mtgvorthos/comments/10xgxxb/updated_map_of_innistrad/
- r/mtgvorthos, „I made a map of Innistrad for my TTRPG game" (2025) — kandydat na matrycę geometrii; pełna toponimia: https://reddit.com/r/mtgvorthos/comments/1iybtgj/i_made_of_map_of_innistrad_for_my_ttrpg_game/
- r/mtgvorthos, „Trying to create a map of Innistrad" (2024) — dyskusja o relacjach: Markov Manor widzi Thraben i Lurenbraum, Ziel i Kruin Pass blisko siebie, góry Stensii widoczne z Nephalii i Gavony: https://www.reddit.com/r/mtgvorthos/comments/1dpc1s7/trying_to_create_a_map_of_innistrad/
- Planeshifted Guide to Innistrad (GM Binder) — gazeter prowincji, Breakneck Ride, Inland valleys, Geier Reach Sanitarium: https://www.gmbinder.com/share/-Mn2ldB6JA07RgYoAT2z
