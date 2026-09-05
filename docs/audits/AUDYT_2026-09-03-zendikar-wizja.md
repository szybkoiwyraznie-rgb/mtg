# Audyt wizualny map z oglądem obrazów — Zendikar + propozycje uzupełnień (2026-09-03, PR-17)

Pierwszy przegląd map **z wizją (vision)**. Dotychczasowe audyty map były
programistyczne (point-in-polygon, AABB/OBB etykiet); tu patrzymy na render
jak na kartę atlasu. Zendikar = T4 (mapforge, `scena.json`, viewBox
2000×1400, 43 POI, 102 etykiety). Ravnica v4 domknięta osobno w tym PR.

## Zendikar — ocena ogólna

Mapa jest **gęsta, spójna stylistycznie i czytelna** (motyw atlasowy, ADR
0019/0021): kontynenty, lodowy Sejiri, wulkany Akoum, dżungle Bala Ged,
bagna Guul Draz, jeziora z wodospadami, trakt kropkowany. Sieć granic nie
dotyczy Zendikaru (brak dzielnic). `map-audit zendikar` zgłasza 2 kolizje
etykiet (model OBB/SAT) — obie potwierdzone wizualnie jako realne.

## Zendikar — znalezione usterki (wizja)

1. **Windblast Gorge × Glass Haven / Glasspool (realna kolizja, Akoum SE).**
   Ukośna etykieta „Windblast Gorge" biegnie wzdłuż wąwozu do jeziora
   Glasspool i **przechodzi przez tekst „Glass Haven"** oraz schodzi na
   „Glasspool". To dwie kolizje z audytu. Naprawa: skrócić/przesunąć
   etykietę wąwozu (albo Glass Haven dać wyżej/na lewo od markeru), tak by
   trzy obiekty (wąwóz, osada, jezioro) nie dzieliły pikseli. Zmiana w
   `scena.json` (pozycja/obrót etykiety) + regeneracja mapforge.
2. **Tytuł „Sejiri" siedzi NA paśmie górskim.** Glify gór przechodzą przez
   litery dużego tytułu kontynentu (najbardziej „S"/„j"). Inne tytuły
   kontynentów (Tazeem nad Halimar, Akoum, Bala Ged, Ondu, Murasa, Guul
   Draz) mają czyste tło; Sejiri jest wyjątkiem. Naprawa: przesunąć dużą
   etykietę Sejiri w lewo, na czysty lód/tundrę (zachodnia część wyspy).
3. **„Sejiri Refuge" — marker hedronu wcięty w tekst.** Czyta się „Sejiri
   ◈Refuge" (kółko hedronu między słowami). Etykieta powinna być w całości
   pod markerem albo nad nim (wzorzec jednoetapowy), nie przepleciona.
4. **Drobne (do akceptacji lub lekkiego ruchu):** w Murasie kilka etykiet
   (Kazaandu, Thunder Gap, Singing City) dotyka glifów gór/drzew —
   czytelne, ale gęste; tytuł „Guul Draz" na wschodzie bywa blisko krawędzi.
   Brak twardych kolozji poza pkt 1.

**Rekomendacja:** pkt 1–3 to małe zmiany w `scena.json` (pozycje/obroty
etykiet, bez ruszania geometrii), po czym regeneracja `podklad.svg`
mapforge i odświeżenie `map.json`. pkt 4 — opcjonalnie.

## Propozycje NOWYCH lokacji wg kanonu (z cytowaniami)

### Zendikar (mapa T4 z kanonu tekstowego — uzupełnianie POI jest jej celem, ADR 0015 k. 4.2)

Mapa jest już bardzo gęsta (43 POI), więc propozycje oszczędne, tylko
kanoniczne, nazwane miejsca z twardym kotwiczeniem geograficznym:

- **The Lighthouse (Latarnia Sea Gate)** — 20-piętrowa biała wieża
  wschodząca 350 stóp ponad wschodnią krawędzią zapory Sea Gate; centrum
  nauki Tazeem. Obok istniejącego Sea Gate/Tikal Harborage na zaporze
  Halimar [mtg.wiki: Tazeem].
- **Merfolk Enclave (Enklawa Trytonów)** — przypominająca ul struktura na
  wielkiej wyspie pośrodku rzeki Umara; największa osada trytonów na
  Zendikarze. Kotwica: bieg rzeki Umara z Halimar na północ (Tazeem)
  [mtg.wiki: Tazeem; MTG Salvation „World of Zendikar IV"].
- **Umara River Gorge / Wren Grotto / Halimar Sea Caves** — opcjonalnie,
  mniejsze; kanion rzeki Umara już sugerowany, brak nazwania [mtg.wiki: Tazeem].
- **Akoum:** Goma Fada, Teeth of Akoum, Oko Ugina, Fort Keff, Tal Terig są
  na mapie — brak większych kanonicznych osad do dodania (Akoum jest
  gęsto pokryty).
- **Ondu:** rozważyć **Graypelt** (cykl „refuge", las/zalesione wzgórza
  okolicy Turntimber) — nazwa z cyklu kart ZEN, kotwica w zieleni Ondu.

### Ravnica (T2+ adoptowany ze złotego źródła — uwaga zakresowa)

Mapa Ravnicy v4 jest **adoptowanym podkładem z fan-mapki właściciela
(a/b/c.png)** — złoty standard definiuje, co jest na mapie (reguła 7,
ADR 0031: geometria ze źródła). Poniższe miejsca są kanoniczne, ale **nie
występują na źródłowej mapce**; dodanie ich = świadome rozszerzenie poza
złoty wzór (decyzja właściciela). Wymienione wg wartości i kotwicy:

- **Guildpact Square + Pillar of the Paruns + Guildmages' Forum** (P1) —
  miejsce podpisania Paktu Gildii; obelisk z 9 pieczęciami (bez Dimir);
  płyta Forum z 10 symbolami. Blisko Tenth District Plaza / wzdłuż Plaza
  Avenue, przy Chamber of the Guildpact. **Najbardziej kanoniczny brak**
  (weryfikowany już w PR-14) [mtg.wiki: Tenth District].
- **Gnat Alley** (P3/P4) — najdłuższa nieprzerwana ulica Ravniki, trasa
  infiltracji Gruul przez bogate dzielnice. Fakt kanoniczny twardy, **bez
  współrzędnych** — geometrycznie tylko przy ewentualnej rozbudowie
  [mtg.wiki: Tenth District].
- **Beacon Tower** (P2, Azorius) — wieża z Interplanar Beacon; w okolicy
  New Prahv/Whitestone. Epoka oryginalnego bloku niepewna (notka PR-14) —
  ewentualnie z oznaczeniem [mtg.fandom: Ravnica].
- **The Rubblebelt / Red Wastes (Stomping Ground)** (P4, Gruul) — pas
  ruin na pograniczu dzielnic; „Red Wastes" już na mapie, Rubblebelt to
  nazwa całej strefy. Można dodać jako etykietę obszaru (bez markera).
- **Mana-sites gildii** (Sacred Foundry Boros, Steam Vents Izzet, Temple
  Garden Selesnya, Overgrown Tomb Golgari, Blood Crypt Rakdos…) — głównie
  wnętrza gildii / miejsca „shock land"; mniej mapowe, raczej pomijamy.

**Rekomendacja Ravnica:** trzymać się złotego źródła; ew. dodać wyłącznie
Guildpact Square/Pillar of the Paruns jako najwyraźniejszy kanoniczny
punkt centralny, z odnotowaniem, że to rozszerzenie poza a/b/c.

## Symbole gildii na markerach Ravnicy (decyzja właściciela: „jeśli potrafisz")

Złote źródło ma w dyskach dużych gildii **białe herby** (płomień Gruul,
pięść Boros, drzewo Selesnya, smok Izzet, fala/słońce Simic, oko Dimir…).
Nasze markery to proste koncentryczne koła. Technicznie da się dorobić
10 białych glifów SVG w kole (ręcznie rysowane ścieżki, w stylu mapy), ale
to osobna, pracochłonna warstwa (herby muszą być rozpoznawalne). Proponuję
prototyp 2–3 herbów (np. Selesnya drzewo, Gruul płomień, Boros pięść) do
akceptacji stylu, potem reszta.

## Źródła

- Tazeem (lokalizacje: Lighthouse, Sea Gate, Merfolk Enclave, Umara,
  Emeria, Halimar, North Hada) — https://mtg.wiki/page/Tazeem
- World of Zendikar IV (Sea Gate, Coralhelm, Tikal Harborage, Emeria,
  Oran-Rief, układ kontynentów) — https://www.mtgsalvation.com/articles/49510-the-world-of-zendikar-part-iv-return-to-zendikar
- Tenth District (Guildpact Square, Pillar of the Paruns, Guildmages'
  Forum, Gnat Alley, Millennial Platform, Chamber, Beacon) —
  https://mtg.wiki/page/Tenth_District
- Ravnica geography (Beacon Tower, Forum of Azor, gildyjne terytoria,
  shock-lands) — https://mtg.fandom.com/wiki/Ravnica
- Nawigacja Dystryktu (battle-mapy: Plazas, Rubblebelt, Foundry Street,
  Kamen, Deadbridge, Tin Street Market) —
  https://www.patreon.com/raakdos/posts/navigating-tenth-139447720
