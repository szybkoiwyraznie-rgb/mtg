# Źródło: transkrypcja oficjalnej mapy Dziesiątego Dystryktu (GGR)

> **Transkrypcja właściciela (dostawa 2026-09-03).** Oficjalny raster
> „The Tenth District of Ravnica" z *Guildmasters' Guide to Ravnica*
> (© WotC) jest **nieosadzalny licencyjnie** w repo (patrz
> `mapa-analiza.md`, werdykt MA1/T1) — poniżej zapisujemy wyłącznie
> **tekstową transkrypcję** przekazaną przez właściciela. Rola tego
> pliku jest analogiczna do `maps/zendikar/zrodlo-fanowska.md`:
> pozwala kalibrować geometrię mapy T4 do kanonu bez trzymania
> objętej licencją grafiki.

Rola w procesie: **krok v2 planu prac** (`otwarte_na_kolejne_przejscia`
w `map.json` v1). Transkrypcja dostarcza układu współrzędnych, w którym
wszystkie POI i arterie mają współrzędne — to pozwala policzyć
transformację do pikseli sceny i zweryfikować relatywne położenia
1:1, a nie tylko graf sąsiedztw (który dała nam wiki — patrz v1).

## Układ współrzędnych transkrypcji

- **Obrót róży wiatrów:** na rastrze oficjalnym północ (N) wskazuje
  kierunek prawego górnego rogu (ok. godziny 1:30–2:00 na tarczy
  zegara). Transkrypcja posługuje się układem **kartezjańskim
  zorientowanym względem kadru grafiki** (nie względem północy
  geograficznej).
- Punkt (0.0, 0.0): **Tenth District Plaza** (geometryczne centrum
  dystryktu) — w samej transkrypcji plac wypada na (0.5, -1.0);
  traktujemy to jako przesunięcie definicji początku względem etykiety
  placu, nie jako błąd (transformacja afiniczna absoruuje translację).
- Oś X (lewo→prawo): -10.0 do +10.0; oś Y (dół→góra): -10.0 do +10.0.
- Kadr jest w przybliżeniu kwadratowy (1024×941 px), więc jednostki
  osi są prawie izotropowe.

## Transkrypcja (verbatim, dostawa właściciela)

### Arterie i szkielet komunikacyjny

1. **Transguild Promenade / Plaza Avenue** — główny trakt po przekątnej
   z północnego wschodu [X: +4.0, Y: +8.5] (okolice Skarrg) południowo
   do [X: +3.0, Y: -5.0]. W górnej części jako Transguild Promenade
   (linia przerywana), mija Sunhome, wpada w centralny plac jako
   **Plaza Avenue**, następnie przez Chamber of the Guildpact aż do
   granicy Podmiasta.
2. **Tin Street** — długa ulica przez północny zachód [od
   X: -5.0, Y: +3.5 do X: -7.0, Y: -1.0]; **naturalna granica między
   Okręgiem Czwartym a Piątym**.
3. **Deadbridge Chasm & Benzer's Bridge** [X: -2.0, Y: -5.5] — wielka
   rozpadlina w południowej części lądu; most prowadzi do dzielnicy
   Wayport [X: -1.5, Y: -4.0].

### Precinct One (serce władzy i finansów) — centrum (0.5, -2.5)

| Obiekt | (X, Y) |
| --- | --- |
| Tenth District Plaza | (0.5, -1.0) |
| Orzhova | (-0.2, -1.5) |
| Vizkopa Bank | (0.2, -2.4) |
| Chamber of the Guildpact | (1.8, -3.3) |
| Plaza West | (0.3, -3.3) |
| Plaza South | (1.5, -5.8) |

### Precinct Two (prawo i wojsko) — centrum (4.0, -3.0)

| Obiekt | (X, Y) |
| --- | --- |
| New Prahv | (6.0, -1.0) |
| Statue of Agrus Kos | (4.0, -2.2) |
| Augustin Station | (3.0, -3.0) |
| Griffin Heights | (6.0, -3.8) |

### Precinct Three (natura i zgoda) — centrum (4.5, 2.0)

| Obiekt | (X, Y) |
| --- | --- |
| Vitu-Ghazi | (4.8, 5.0) |
| The Canopy | (6.8, 4.5) |
| The Great Concourse | (5.8, 3.5) |
| Concordance | (5.3, 2.2) |
| Whitestone | (3.8, -0.2) |
| Plaza East | (2.0, 0.2) |
| Beast Haven | (3.3, 3.8) |

### Precinct Four (przemysł i bastiony) — centrum (-2.0, 4.0)

| Obiekt | (X, Y) |
| --- | --- |
| Skarrg | (1.8, 6.8) |
| Millennial Platform | (3.7, 7.0) |
| Sunhome | (1.0, 3.0) |
| Red Wastes | (-2.0, 5.5) |
| Nivix | (-2.5, 1.5) |

### Precinct Five (nauka i badania) — centrum (-6.5, 1.0)

| Obiekt | (X, Y) |
| --- | --- |
| Zonot Seven & Zameck | (-6.5, -0.2) |
| Hightower | (-7.0, 2.0) |
| Prism University | (-7.5, 1.2) |
| Ismeri Library | (-8.0, 0.4) |
| The Blistercoils | (-5.0, 1.8) |

### Precinct Six (dzielnica robotnicza i hutnicza) — centrum (-4.0, -2.5)

| Obiekt | (X, Y) |
| --- | --- |
| Smelting Quarter | (-3.8, -0.2) |
| Foundry Street | (-4.0, -1.0) |
| Gore House | (-2.8, -1.4) |
| The Bulwark | (-1.8, -0.9) |
| Kamen Fortress | (-1.8, -2.0) |
| Medori Park | (-5.5, -3.8) |
| Wayport | (-1.5, -4.0) |

### Undercity (Podmiasto) — dolny margines, Y od -4.5 do -8.5

| Obiekt | (X, Y) | Uwaga |
| --- | --- | --- |
| Rix Maadi | (-3.5, -4.8) | «Under Smelting Quarter» — podziemia pod P6 |
| Korozda & Svogthos | (1.5, -7.0) | pod Precinct One; połączenie linią przerywaną z Chamber of the Guildpact |
| Nightveil & Duskmantle | (4.8, -6.3) | pod Precinct Two |

### Zestawienie siedzib gildii (wg transkrypcji)

1. Azorius (New Prahv) — daleki wschód, P2
2. Boros (Sunhome) — północne centrum, P4
3. Dimir (Duskmantle) — południowo-wschodnie Podmiasto, pod P2
4. Golgari (Svogthos/Korozda) — głębokie południowe podziemia, pod P1
5. Gruul (Skarrg) — daleka północ, P4
6. Izzet (Nivix) — północny środek, P4
7. Orzhov (Orzhova) — ścisłe centrum, P1
8. Rakdos (Rix Maadi) — południowo-zachodnie podziemia, pod P6
9. Selesnya (Vitu-Ghazi) — północny wschód, P3
10. Simic (Zameck / Zonot Seven) — daleki zachód, P5

## Notatki kalibracyjne (agregat sesji)

- Transkrypcja **nie podaje współrzędnych wierzchołków granic**
  precyktów — kalibruje więc pozycje POI, drogi i centra etykiet;
  poligony precyktów na mapie v2 dopasowujemy zgodnie z tymi
  ograniczeniami i grafem sąsiedztw z wiki (v1).
- Obiekty z v1, **nieobecne w transkrypcji** (kanon wiki/GGR-inny):
  Sawtooth Prison, Horizon Military Academy, Mizzium Foundry,
  Tin Street Market, Forum of Azor — **zostają** (źródło: MTG Wiki),
  pozycjonowane relatywnie do przesuniętych kotwic.
- **Millennial Platform**: wiki plasuje ją „na styku P1/P3/P4",
  a raster GGR rysuje dokładniej na północny wschód od Skarrg
  (~(3.7, 7.0)) — **mapa v2 przyjmuje pozycję z rastra** (kanon
  graficzny nowszy/publiczny, a odczyt pozycyjny z rastra jest
  precyzyjniejszy niż opis „junction" w tekście). Odnotowane w
  `mapa-analiza.md`.
- **Undercity**: na rastrze rysowane jako przekrój-poświata pod
  południową krawędzią płyty. Na naszej mapie v2: trzy siedziby
  podziemne jako osobna warstwa-anchor (`warstwa: "podziemie"`)
  z markerami przy południowej krawędzi — pełny przekrój podziemi
  zostaje poza zakresem (ekwipunek v3).
