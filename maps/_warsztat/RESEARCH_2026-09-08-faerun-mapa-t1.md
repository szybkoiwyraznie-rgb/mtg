# Research mapowy: Forgotten Realms — podkład T1 (wymiana wektora)

> **Decyzja właściciela (2026-09-08 wieczór):** T2 wektor
> (Vectorized Realms `faerun-v016-40dpi.svg`) **kasujemy** — „działa
> poooooooowoli, nie ma ikon lokalizacji i jest po prostu brzydka”.
> Nowy podkład = **T1 (rastr z etykietami, model Tarkiru/Innistradu)**.
> Właściciel pobiera plik z linków poniżej i wrzuca do repo (sandbox
> blokuje media-CDN-y — pobrań binarnych nie robi agent).

> **STATUS: WYKONANA (2026-09-08, wieczór).** Właściciel wybrał
> kandydata **A (oficjalna 3E, „bezkonkurencyjna”)** i sam wrzucił
> plik do gałęzi (commit `c2c4b77`, webp 3,1 MB w korzeniu repo).
> Zrealizowane: konwersja webp→`master.jpg` (JPG q92, 4,3 MB),
> siatka LOD `tools/kafle.mjs` (L0 1920×1284 + 10×7×512, próg 2.5),
> `map.json` T1+LOD (kotwice 9 + pinezka 3CLB przeliczone odczytem
> siatki 5% + warstwa POI 13 punktów), silnik: `htmlPoi` (kółka pod
> kafelkami), kasacja `podklad.svg`. Właściciel dodał wymaganie
> ponad model Tarkiru: **LOD jak Dominaria** (kafelki L1 w pełnej
> rozdzielczości) + **wektorowe POI pod przyszłe pinezki** —
> zrealizowane w tym samym przejściu.

## 1. Kryteria T1 (z ADR 0038/0041 + precedensy Tarkir/Innistrad)

- **Jeden rastr** (JPG, ~2–10 MB) renderowany jako `<img>` + pinezki
  w nakładce (szybki start, zoom = skalowanie bitmapy, bez LOD-kafli);
- **etykiety i ikony miejsc NA podkładzie** (wariant T1 nie dostaje
  etykiet Codexu — `etykiety: false`, ADR 0035 — to rastr musi być
  samowystarczalny);
- pokrycie zgodne z opisem planu (9 regionów w
  `content/planes/forgotten-realms.md`) LUB świadoma zmiana na
  podmapę (model ADR 0032, `final-fantasy/midgar`);
- wymiary klasy Tarkir (4096×3072) — 4000–5000 px krawędź = optimum
  czytelności/rozmiaru.

## 2. Kandydaci (wymiar zweryfikowany przez API wiki/Fandom)

| # | Plik | Wymiar | Rozmiar | Pokrycie | Styl / źródło |
|---|---|---|---|---|---|
| **A** | **Map - Faerun - 3E.jpg** — oficjalna mapa plakatowa 3E (WotC) | **4763×3185** | **6,2 MB** | **Cały Faerûn** | klasyczny, malowany, pełny kolor; **etykiety regionów + ikony miast/porów** |
| B | Sword-Coast-Map HighRes-Compressed.jpg — oficjalna 5E (WotC) | 8192×5301 | 9,7 MB | Wybrzeże Mieczy (NW Faerûn) | nowoczesna 5E, bardzo szczegółowa; etykiety 5E |
| C | NorthwestFaerun-Map HighRes.jpg — oficjalna 5E (WotC) | 3311×2276 | 9,0 MB | NW Faerûn (Wybrzeże + sąsiedztwo) | nowoczesna 5E |
| D | 1479-faerun low-res.jpg — fan (Johnovick), stan 1479–1492 DR | 4317×3030 | 2,4 MB | Cały Faerûn (granicznie 5E) | fanowska rekonstrukcja; „the best one I've found” (r/Forgotten_Realms); pełna wersja (bez heksów) płatna na Patreonze autora |
| E | Sword-Coast-Map LowRes.jpg — oficjalna 5E (WotC) | 3600×2329 | 1,1 MB | Wybrzeże Mieczy | 5E (za mała na master) |
| F | Map - Faerun - 2E.jpg — oficjalna 2E (TSR/WotC) | 1600×1211 | 0,6 MB | Cały Faerûn | 2E (za mała) |
| G | Mapa materiałowa filmu *D&D: Honor Among Thieves* (2023, Lionsgate/WotC) | ? (TIF) | ? | Wybrzeże Mieczy | ilustracyjna, piękna, z epoki CLB; wersja **bez brandingu** |
| H | Mapy Mike Schleya (oficjalny kartograf WotC) — pełny Faerûn 5E / dodatki 2025 | ? | płatne | Cały Faerûn (5E) | oficjalny kartograf; prints.mikeschley.com |

Wykluczone: 4E (brak dobrego pliku w wolnym obiegu), BG3 (mapa
tylko in-game, brak oficjalnego pliku), polska edycja drukowana
(rebel.pl/rgfk.pl — produkt fizyczny 243 zł, bez wersji cyfrowej),
Commons (jeden drobny plik, niekompletny).

## 3. Linki do pobrania (dla właściciela)

**A — REKOMENDACJA (pełny Faerûn, 3E, oficjalna):**
- https://static.wikia.nocookie.net/forgottenrealms/images/1/10/Map_-_Faerun_-_3E.jpg/revision/latest?cb=20120201174035
  (4763×3185, 6,2 MB; strona pliku:
  https://forgottenrealms.fandom.com/wiki/File:Map_-_Faerun_-_3E.jpg)

**B — alternatywa 5E (jeśli liczy się epoka CLB, kosztem pokrycia):**
- oficjalnie z D&D Beyond (HighRes 27 MB / MedRes 11 MB / LowRes 1,1 MB):
  http://media.wizards.com/2015/images/dnd/resources/Sword-Coast-Map_HighRes.jpg
  http://media.wizards.com/2015/images/dnd/resources/Sword-Coast-Map_MedRes.jpg
  (strona źródłowa: https://www.dndbeyond.com/resources/1782-map-of-faerun)
- kopia na FR Fandom (8192×5301, 9,7 MB — ta sama mapa, sprężyściejsza):
  https://static.wikia.nocookie.net/forgottenrealms/images/3/36/Sword-Coast-Map_HighRes-Compressed.jpg/revision/latest?cb=20160307175412

**D — zapas (pełny Faerûn w epoce 5E, fanowska, lekka):**
- https://static.wikia.nocookie.net/forgottenrealms/images/5/59/1479-faerun_low-res.jpg/revision/latest?cb=20220408085159

**G — mapa filmowa (jeśli ktoś chce art z epoki filmu/CLB):**
- TIF bez brandingu: https://files.catbox.moe/y1f7qx.tif
  (z brandingu: https://files.catbox.moe/64j124.tif)
- JPG (enworld): https://www.enworld.org/media/forgotten-realms-honor-among-thieves-cloth-map-jpg.104708/
  (catbox linki bywają nietrwałe — jeśli umarły, enworld)

## 4. Rekomendacja i konsekwencje

**Pierwszy wybór: A (3E, pełny Faerûn).** Rationale:
1. pokrycie = cały plan (geografia strony planu opisuje 9 regionów —
   Morze Upadłych Gwiazd, Jezioro Pary, Morze Bezludne,
   Królestwo Wysokie — mapy „tylko Wybrzeże” (B/C/G) wymagałyby
   przycięcia opisu planu albo modelu podmapy ADR 0032);
2. adresuje obie dolegliwości: **ikony i etykiety miejsc są na
   podkładzie** (klasyka kartografii 3E) i **ładny, malowany styl**;
3. 4763×3185 / 6,2 MB = klasa Tarkir T1 (4096×3072) — sprawdzona
   wydajność silnika (T1 = `<img>`, bez 4,3 MB SVG-a);
4. to ten sam podkład, którego research v1 używał jako wzorca
   granic akwenów/lądów (kanon).

**B** — gdyby właściciel postawił na erę 5E ponad pokrycie: mapa
zamienia się w podmapę `forgotten-realms/wybrzezie-mieczow` (ADR
0032) i opis planu się zawęża; 9,7 MB też OK, ale 8192 px to
przedział, w którym build mini-mapu robi 800 px bez straty.

**Licencja:** projekt prywatny, bez publicznej dystrybucji ⇒
użytkowanie prywatne, atrybucja w stopce (precedens: decyzja
właściciela 2026-09-08 od Vectorized Realms + mapy rastrowe
Tarkiru/Innistradu).

## 5. Procedura po dostawie pliku (agent)

1. Plik → `maps/forgotten-realms/podklad.jpg` (właściciel wrzuca;
   agent konwersji nie robi — sandbox bez rasteryzera systemowego,
   ale JPG przyjmuje 1:1; z TIF (G) agent rasteryzuje resvg/pngjs).
2. Kasacja `podklad.svg`; `map.json` → wariant **T1**: wymiary z
   pliku, `zrodlo` (autor/licencja/pobrano), `etykiety: false`,
   rekonstrukcja false.
3. **Kotwice i pinezka do wyliczenia od nowa** (stare współrzędne
   są dla wektora): render + siatka 5% → odczyt (procedura z
   `RESEARCH_2026-09-08-forgotten-realms-mapa.md` §2/§4); pinezka
   3clb = środek Wybrzeża Mieczy (pewność: region).
4. `content/planes/forgotten-realms.md`: sekcja „Mapa” (T1, źródło,
   brak warstwy etykiet) + ewentualne korekty geografii (np. przy B).
5. Co-nowego + research doc „WYKONANA” + testy (165→? zielone).

## 6. Źródła researchu

- FR Fandom API (imageinfo) — wymiary/URL-e kandydatów A–F:
  https://forgottenrealms.fandom.com/api.php
- D&D Beyond Resources, „Map of Faerûn” (oficjalne 5E, 3 rozdzielczości):
  https://www.dndbeyond.com/resources/1782-map-of-faerun
- r/forgottenrealms — „High res map of Faerun?” (3E/4E/5E, Schley,
  Johnovick): https://www.reddit.com/r/forgottenrealms/comments/97mao9/
- r/Forgotten_Realms — „Anyone know where I can find a very large
  map of Faerun?” (1479-faerun, loremaps):
  https://www.reddit.com/r/Forgotten_Realms/comments/szvxl8/
- r/Forgotten_Realms — „D&D Movie Map” (cloth map, TIF):
  https://www.reddit.com/r/Forgotten_Realms/comments/12y72to/
- POLTERGEIST — mapa Faerûn PL (druk, 243 zł):
  https://polter.pl/Forgotten-Realms-t1475
