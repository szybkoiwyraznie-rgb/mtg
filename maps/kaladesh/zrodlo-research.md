# Kaladesh — research mapy (T1 → T4) i decyzje rekonstrukcji

Data: 2026-09-09 (sesja PR-28 — 610M19 Gearsmith Prodigy).
Procedura: PROCES_MAP.md MA1 (kolejność tierów) + SKILL_MAPA_PLANU §11
(mapforge). Pełny raport: `docs/research/RESEARCH_2026-09-09-kaladesh-gearsmith-prodigy.md`.

## Werdykt tierów

| Tier | Wynik | Uzasadnienie |
| --- | --- | --- |
| T1 (oficjalna mapa WotC) | **brak** | MTG Wiki (Avishkar) nie ma mapy planu; „The Art of Kaladesh” — opisy bez kartografii; karta Plane (Planechase) niekartograficzna. |
| T2 (wektor) | **brak** | Żadne źródło nie publikuje wektorowej mapy planu. |
| T3 (oficjalny raster) | **brak** | Brak rastra mapy planu; istnieje tylko szkic Ghirapuru z „Boom & Bust” (fragment miasta, nie plan). |
| T4 (rekonstrukcja) | **wykonana** | Kanon tekstowy podaje sieć rzeczną i przynależność lokacji (trzy rzeki, Peema, Vahd, Lathnu, dzielnice), ale żadnych współrzędnych — mapa jest rekonstrukcją relacyjną w mapforge. |

## Decyzje właściciela (2026-09-08/09)

1. **Jedna mapa całego planu** (schematyczny plan + gęsty Ghirapur),
   nie osobna mapa miasta.
2. **Domyślne otwarcie mapy na Ghirapurze** (ADR 0045) —
   `widok_domyslny` w `map.json` (pierwsza mapa z tym polem).
3. Pakiet Kaladesh w PR #28 (mapa + strona planu + 610M19).

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
