# Kaladesh — research mapy (T1 → T4) i decyzje rekonstrukcji

Data: 2026-09-09 (sesja PR-28 — 610M19 Gearsmith Prodigy).
Aktualizacje: 2026-09-10 (ADR 0047 — dwie osobne mapy) oraz 2026-09-12
(pętla kart Kaladeshu: hasła Ghirapur/Konsulat + kotwice L2 miasta).
Procedura: PROCES_MAP.md MA1 (kolejność tierów) + SKILL_MAPA_PLANU §11
(mapforge). Pełny raport: `docs/research/RESEARCH_2026-09-09-kaladesh-gearsmith-prodigy.md`.

## Werdykt tierów

| Tier | Wynik | Uzasadnienie |
| --- | --- | --- |
| T1 (oficjalna mapa WotC) | **brak** | MTG Wiki (Avishkar) nie ma mapy planu; „The Art of Kaladesh” — opisy bez kartografii; karta Plane (Planechase) niekartograficzna. |
| T2 (wektor) | **brak** | Żadne źródło nie publikuje wektorowej mapy planu. |
| T3 (oficjalny raster) | **brak** | Brak rastra mapy planu; istnieje tylko szkic Ghirapuru z „Boom & Bust” (fragment miasta, nie plan). |
| T4 (rekonstrukcja) | **wykonana** | Kanon tekstowy podaje sieć rzeczną i przynależność lokacji (trzy rzeki, Peema, Vahd, Lathnu, dzielnice), ale żadnych współrzędnych — mapa jest rekonstrukcją relacyjną w mapforge. |

## Decyzje właściciela i aktualny stan

1. **Stan początkowy PR-28:** jedna mapa całego planu, z gęstym Ghirapurem
   w środku, powstała jako pierwsza rekonstrukcja T4 Kaladeshu.
2. **Korekta PR-30 / ADR 0047:** Kaladesh ma **dwie osobne mapy**:
   plan prowincji w skali planu (`podklad.svg`) oraz mapę miasta
   Ghirapur (`ghirapur.svg`) we własnej skali, ładowaną twardą podmianą
   deep-zoomu. Miasto na planie jest kropką/POI, nie płytą, a rzeki
   miasta nie muszą zszywać się na krawędzi z rzekami planu.
3. **Widok domyślny po PR-30:** cały plan (`x=0.5`, `y=0.5`, `zoom=1`),
   nie automatyczne otwarcie na miasto. Deep-linki kart i haseł nadal
   prowadzą do Ghirapuru/dzielnic.
4. **Pętla 2026-09-12:** po drugiej karcie Kaladeshu dodano hasła
   Ghirapur i Konsulat Kaladeshu oraz promowano wybrane etykiety/POI
   osobnej mapy Ghirapuru do kotwic w `map.json`. Te kotwice są projekcją
   L2 do złotego układu planu: kanon potwierdza nazwy, funkcje i relacje,
   ale nie precyzyjne adresy.

## Kanon geograficzny użyty w scenie

Rzeki (mtg.wiki: Avishkar, Ghirapur): Vinday płynie przez dzicz Peemy
i wpada do Ghirapuru od zachodu; Suramal spływa z północy; zlewisko
w mieście tworzy wielką Vasavati do odległego wybrzeża; Mapani to
największy dopływ Vindaya i jedna z granic Vahd. Ghirapur: stolica
na zlewisku; Kanał Dukhara przez Jedenastu Mostów (First Bridge
najpołudniejszy); Iglica Eteru w centrum; stacja Aradara z kopułą;
Bastion; Akhara; Bomat (port); Embraal (huty); Ovalchase (tor);
Greenwheel (kopuły, „Zoo”); Kujar; Freejam; Aleja Olbrzymów nad
Vindayem; Weldfast z węzłem eterowym; Przykrycie (las łęgowy);
Kuźnia Konsulów spalona przez Chandrę. Prowincja: Peema (las, elfy,
zachód); Vahd (Złote Stopnie, sterowce, północny wschód); Lathnu
pod Devra (północny skraj cywilizacji); Wielka Wspinka za miastem;
wieże eterowe rozproszone, tłoczą eter do Iglicy; Bunarat (spalona wieś).

## Rozstrzygnięcia rekonstrukcji (umowne)

Kształty i odległości; morze na południu bez nazwy (kanon nie podaje);
mosty 2–11 wzdłuż kanału (pozycja Ninth Bridge umowna); Ovalchase
i Shaila's Claim poza murami; 5 wież eterowych i 3 wsie Vahd
symbolicznie (liczba wież umowna — kanon mówi o wieżach „rozproszonych
w prowincji” bez liczby); pozycja Bunarat za murami na SW (kanon: „wieś spalona
przez kapitana Baralę” — bez położenia, wiki: Avishkar); pozycja
Aetherflux Reservoir na płycie L2 nad Kujarem (kanon: „największy
zbiornik rafinowanego eteru, zawieszony nad panoramą” — bez
współrzędnych, wiki: Ghirapur; dorysowany w PR-29, klocek `zbiornik`);
linia brzegu; północ = góra arkusza; skala wyłączona.

## Addendum 2026-09-12 — kotwice L2 po drugiej karcie Kaladeshu

Druga karta planu (`596ORI`) sprawiła, że Ghirapur i Konsulat przekroczyły
próg link-miningu. Przy tej samej pętli `map.json` dostał kotwice dzielnic
i punktów miasta użytecznych dla kart oraz dalszego deep-linkowania:
Greenwheel, Greenwheel Domes, The Zoo, Embraal, Aetherflux Reservoir,
Aether Hub, Eleven Bridges, Dukhara Canal, Aradara Station, Bastion,
Akhara, Bomat, Freejam, Kujar, Weldfast, The Cowl, Foundry of the Consuls,
Bunarat, Shaila's Claim, Ovalchase, First Bridge i Ninth Bridge.

Wszystkie nowe współrzędne są przeliczeniem z etykiet/POI mapy L2 miasta,
a nie twierdzeniem, że kanon podaje ulicę, taras lub adres. Dla kart:
`610M19` pozostaje pinezką regionalną Greenwheel/Greenwheel Domes, a
`596ORI` pinezką regionalną Embraal.

## Addendum 2026-09-20 — pass mapowy PR-35 (Pętla Jakości, krok 4)

Pass wzbogacający `map.json` o kotwice elementów, które mapa (plan)
rysowała od PR-30, ale które nie miały wpisów kotwic: wsie aerowrightów
Vahd (**Maranjapur**, **Panka**, **Cambi**), **Devra Cliffs**,
**The Great Climb** oraz rzeki **Suramal** i **Mapani** (29 → 36 kotwic).
Współrzędne to przeliczenie pozycji etykiet/POI generatora
(`kaladesh-plan-t4.py`, dawna siatka 16000×11000 → 0–1); kanon (mtg.wiki:
Avishkar — „Known locations”) potwierdza nazwy, funkcje i relacje, nie
adresy. Geometria podkładów bez zmian — `podklad.svg` i `ghirapur.svg`
nietknięte; raster planu obejrzany (L10), `map-audit.py` 0 problemów.
