# ADR 0034: Hydrologia map (żadna rzeka nie kończy się w polu), jeden biom na miejsce, kanion w krajobrazie i ramka full-bleed

- **Status:** Zaakceptowana
- **Data:** 2026-09-07
- **Decydenci:** właściciel (recenzja mapy Tarkiru w podglądzie PR-21,
  cztery uwagi w czacie 2026-09-07); realizacja: agent Arena
- **Powiązane:** ADR 0018 (mapforge — klocki), 0020 (rzeki w kolorze
  akwenu, stożek ujścia), 0022 (strefy zajęte: biomy nie zakrywają
  rzeźby), 0023 (twarda zasada wiązania — walidator `sprawdzWiazania`),
  0031 (rastry fanowskie jako źródło pomocnicze), 0033 (Tarkir —
  uzupełnienie), LESSONS L10 (raster po każdej zmianie)

## Kontekst

Pierwsza wersja mapy T4 Tarkiru (PR-21, pakiet 3) przeszła recenzję
właściciela z czterema uwagami:

1. **„Ramka nachodzi na dolny i górny fragment mapy”** — Tarkir jest
   pierwszym planem *full-bleed* (kontynent na całym arkuszu, bez
   oceanu). Ramka mapforge to dwie linie rysowane NA treści; przy wyspach
   w oceanie nic pod nimi nie leży, przy kontynencie od krawędzi do
   krawędzi linie przecinały glify gór i lasów.
2. **„Ciemnoszara rura… pogięta rurka do picia. Masakra.”** — The Scour
   narysowany klockiem `szczelina` (miejski wąwóz Ravniki: gruby wypełniony
   pas ze „schodami”). W krajobrazie ten język nie działa: wypełnienie
   czyta się jak obiekt, nie jak ubytek terenu; wschodni koniec wchodził
   na glify pasma.
3. **„Lądolód zasłania łańcuch górski — nie rysować dwóch biomów jednego
   na drugim”** — czapa `lod` (lita nakładka) leżała na grzbiecie
   północnym Qal Sisma; silnik chronił biomy rozsiewane przed lodem
   (ADR 0022), ale nie chronił **pasm** przed lodem.
4. **„Rzeki, które płyną znikąd donikąd. NIE MA RZEK KTÓRE SIĘ KOŃCZĄ
   W POLU.”** — Sandsteppe River urywała się w stepie, rzeka Tiansun 58 j.
   przed Dirgur Lake, odpływ Dirgur zaczynał się poza taflą i kończył
   w polu, Marang 200 j. przed morzem. Ta sama wada istniała niezauważona
   na Zendikarze (bezimienna rzeka Bala Ged obok Umung) i w scenie demo.

Wspólny mianownik: **walidator wiązań (ADR 0023) nie znał hydrologii ani
relacji lód↔góry**, a oprawa nie miała trybu dla map bez oceanu.

## Decyzja

### 1. Hydrologia — reguła twarda (obowiązuje wszystkie sceny)

**Nie ma rzek, które kończą się w polu.** Ostatni punkt każdej rzeki
i każdego dopływu leży:

- w morzu (poza maską lądu; tolerancja 8 j. na stożek ujścia i obrys), albo
- w jeziorze (elipsa lub tafla `d`), albo
- na osi innej rzeki (≤ 12 j. od wygładzonej łamanej — zbieg).

Rzeka bez źródła (`opcje.zrodlo:false` — odpływ jeziora, ramię delty)
musi także **zaczynać się** w wodzie lub na innej rzece; inaczej to rzeka
„znikąd”. Pilnuje tego `sprawdzHydrologie()` wołane z `sprawdzWiazania()`
(`render.mjs`): CLI wypisuje uwagę `[wiązania]`, test `mapforge.test.js`
wymaga 0 uwag dla scen repo z rzekami (Tarkir, Zendikar, Alara, demo).

Rzeka na rastrze fanowskim urwana w polu **nie jest usprawiedliwieniem**:
kanon i ADR 0031 dają geometrię, hydrologię domyka autor sceny (dociągnięcie
do akwenu/zbiegu), a rozbieżność zapisuje się w `map.json`
(`zrodlo_fanmapa.rozbieznosci_z_kanonem`).

### 2. Jeden biom na miejsce — lód nad górami zakazany

Czapa lodowa (`lod`) jest litą nakładką rysowaną nad górami, więc **pasma
omijają poligony lodu** tak samo jak morze: `pasmoInstancje` dostaje
`wyklucz` (poligony lodu ze sceny) i nie stawia glifu, którego podstawa
lub wierzchołek (0.6·h) wpada w lód. Autor sceny prowadzi czapę w niecce
**obok** grzbietu, nie na nim — silnik jest tylko siatką bezpieczeństwa
(pasmo pod lodem po prostu znika, co widać na rastrze). Rozszerza pkt
„strefy zajęte” ADR 0022 o relację rzeźba↔lód.

### 3. Kanion w krajobrazie = klocek `rozpadlina`, nie `szczelina`

Nowy klocek `rozpadlina(id, punkty, {szer, osuwiska})` (kaseta
`rozpadliny`): dwie **niezależnie poszarpane** kreski klifów o zmiennej
rozpiętości, zbiegające się na końcach (wrzeciono), szraf dna i krótkie
kreski osuwisk — **bez wypełnienia**, w języku kreski grzbietów pasm.
Strefa zajęta dla biomów (jak szczelina). `szczelina` pozostaje klockiem
**miejskim** (wąwozy Ravniki — ADR 0018/tkanina); w krajobrazie nie wolno
jej używać. Kanion nie wchodzi na glify pasma — zaczyna się u jego stóp.

### 4. Ramka map full-bleed = passe-partout

`ramka: { margines, passePartout: true }` rysuje pas papieru (kolor lądu
motywu, `fill-rule="evenodd"`) poza oknem mapy, pod liniami ramki — treść
kończy się dokładnie na linii, jak w atlasie. Domyślny tryb (same linie)
zostaje dla map wysp w oceanie. Sceny bez oceanu (ląd = cały arkusz)
**muszą** używać passe-partout.

### 5. Zastosowanie do Tarkiru (ta sesja)

- Sieć rzeczna: górna Marang (roztopy Tiansun, Riverwheel/Icefall) →
  Dirgur Lake → odpływ stepem na S (to Marang; zbiera Sandsteppe River na
  bagnach Screamreach) → przełęcz z Marang River Fortress („where the
  river comes out of the mountains”) → Molderfang Falls → Bloomvine
  (przyjmuje Niraj) → delta Gudul / Morze Południowe; ramię Kheru do morza.
- Czapa Melting Wilds w niecce między grzbietem N a Whisperwood; Eternal
  Ice pod jej krawędzią (nie w lodzie).
- The Scour: `rozpadlina` szer. 22 od stóp grzbietu zachodniego w step.
- Ramka passe-partout 22 j.
- Zendikar: bezimienna rzeka Bala Ged dociągnięta do Umung (zbieg);
  demo: Srebrna do morza, dopływ zachodni w oś Srebrnej.

## Konsekwencje

- Każda przyszła scena z rzekami przechodzi walidator hydrologii — błąd
  „rzeka w polu” nie dojdzie do podglądu właściciela.
- Checklista SKILL_MAPA_PLANU §7 dostaje punkty: hydrologia, lód↔pasma,
  full-bleed → passe-partout, kanion → `rozpadlina`.
- Rastry fanowskie dalej są źródłem geometrii (ADR 0031), ale hydrologię
  domyka autor sceny — urwana rzeka na rastrze to luka do wypełnienia,
  nie wzór do skopiowania.
- `szczelina` w scenie krajobrazowej = błąd recenzyjny (do wychwycenia
  przy audycie PR).
