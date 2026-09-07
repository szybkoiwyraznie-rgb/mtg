# Mirrodin — research mapy (T2 → T3 → T4) i decyzje rekonstrukcji

Data: 2026-09-06 (sesja PR-21, pakiet 2 — 488SOM Carapace Forger).
Procedura: PROCES_MAP.md MA1 (kolejność tierów) + SKILL_MAPA_PLANU §11
(mapforge). Raport z tego researchu został przedstawiony właścicielowi
w czacie przed rysowaniem; decyzje właściciela spisane niżej.

## Werdykt tierów

| Tier | Wynik | Uzasadnienie |
| --- | --- | --- |
| T2 (wektor) | **brak** | Żadne źródło nie publikuje wektorowej mapy Mirrodinu. |
| T3 (oficjalny raster) | **brak** | MTG Wiki (New Phyrexia (plane)) nie ma mapy planu; kategoria `Category:Maps_by_location` (13 podkategorii) nie zawiera Mirrodinu; archiwum map phyrexia.com (Wayback, 15 map) — bez Mirrodinu; *Mirrodin Player's Guide* (2003, archive.org) — opisy lokacji, bez mapy. Jedyna „mapa” WotC to karty Plane (Planechase) — nie kartograficzne. |
| T4 (rekonstrukcja) | **wykonana** | Kanon tekstowy podaje przynależność lokacji do regionów i sąsiedztwa regionów (fastlandy SOM, artykuły Vorthos), ale żadnych współrzędnych — mapa jest rekonstrukcją relacyjną w mapforge. |

Raster fanowski: istnieje mapa „Mirrodin” (inkarnate, John Ruder), ale
strona i CDN inkarnate są niedostępne z sandboxa (błąd strony / HTTP
500). Wątki r/mtgvorthos potwierdzają w snippetach: „brak kanonicznej
mapy; watermark Mirran = glob z pięcioma lacunami”. Reddit zwraca 403.

## Decyzje właściciela (2026-09-06)

1. **T4 od razu z kanonu** w mapforge. Raster fanowski — dopiero gdy
   właściciel go dostarczy, i tylko jako **źródło pomocnicze dla pozycji
   nieustalonych w kanonie** (nigdy zamiennik kanonu). Pole
   `zrodlo_fanmapa` w `map.json` zarezerwowane (null).
2. Pakiet Mirrodin trafia do otwartego PR #21 (rozszerzenie), osobna
   roadmapa `docs/plans/PLAN_2026-09-06-pr21-mirrodin-carapace-forger.md`.
3. Fabuła 488SOM zapisana verbatim we wpisie kolekcji.

## Kanon geograficzny użyty w scenie

Świat: sztuczna, pusta w środku metalowa sfera (Argentum Karna); obwód
zewnętrznej sfery ≈ 1400 km, średnica ≈ 450 km; pięć „słońc” z many
(Bringer/białe, Eye of Doom/niebieskie, Ingle/czarne, Sky Tyrant/czerwone,
Lyese/zielone — ostatnie wyłoniło się dopiero w *Fifth Dawn*), każde nad
„swoim” regionem; lacuny = tunele, którymi słońca wyszły z jądra.
Regiony leżą „dni drogi od siebie” (Moons of Mirrodin).

Relacje przyjęte w scenie (źródło → konsekwencja):

- **Glimmervoid centralny**; „trzeba go przejść, by dotrzeć do Mephidrossu
  z Tangle, Quicksilver Sea albo Oxiddy” (Moons of Mirrodin) → środek
  tarczy; **Razor Fields są częścią Glimmervoid** (wiki Glimmervoid) →
  północny wycinek przylegający do jądra płyt.
- **Cykl fastlandów SOM** (karty drukowane = najtwardszy kanon
  sąsiedztw): Seachrome Coast (W/U: Razor Fields–Quicksilver Sea),
  Darkslick Shores (U/B: Quicksilver Sea–Mephidross; wiki Darkslick),
  Blackcleave Cliffs (B/R: Mephidross–Oxidda; wiki Blackcleave),
  Copperline Gorge (R/G: Oxidda–Tangle), Razorverge Thicket (G/W:
  Tangle–Razor Fields) → pięć wycinków po 72° w tej kolejności.
- **Tangle i Oxidda blisko siebie „przez wąski pas Glimmervoid”**
  (Moons of Mirrodin) → główny grzbiet Oxiddy przy tangle'owym skraju
  swojego wycinka; wąski pas płyt = Copperline Gorge.
- **Rey-Goor (Black Bayou)** — pogranicze Mephidross–Tangle: lasy
  ciągnące się od Tangle nasiąkają olejem i przechodzą w bagno (wiki
  Rey-Goor) → pas bagien wzdłuż krawędzi tarczy za zewnętrznym końcem
  Oxiddy (na kuli regiony stykają się także poza widoczną półkulą).
- **Quicksilver Sea** graniczy z Mephidross i Glimmervoid; **Lumengrid**
  na spirze przy brzegu, **Medev** na brzegu, **Titan Forge** w kręgu
  nieruchomej rtęci, **Quicksilver Spires** = iglice-mosty przez morze
  (wiki Quicksilver Sea).
- **Mephidross**: Ish Sah / Vault of Whispers — największy komin w sercu
  bagien, Black Lacuna pod nim; wioski Moriok; w czasie inwazji Dross
  połyka części Tangle i Razor Fields (wiki Mephidross).
- **Oxidda Chain**: Kuldotha / Great Furnace (aktywny wulkan, stolica
  goblinów), Red Lacuna („Womb of the Steel Mother”) obok Kuźni,
  Krark-Home (góra klanu Krark, tunele), Oxidagg (Vulshok), Wailing
  Cairns (Azax-Azog) (wiki Oxidda Chain, New Phyrexia (plane)).
- **Razor Fields**: Taj-Nar (Ancient Den) w centrum Pól, Cave of Light /
  White Lacuna pod nim; Bladehold (największa osada Auriok) i Ten Shields
  na Manka Run; Liet Field wzdłuż Manka Run (wiki Razor Fields).
- **Tangle**: Radix w samym środku Tangle (później Araneas Altar; Green
  Lacuna; Panopticon dokładnie pod nim w jądrze), Tel-Jilad (Tree of
  Tales) jako główny hub, Viridia (osada elfów wokół Tel-Jilad; Trial
  Terrace, Prison Tree), Temple Might i Outer Altar (Sylvok), Cambree
  Garden (wiki Tangle, New Phyrexia (plane), Moons of Mirrodin).
- **Ur-Golem Towers**: cztery wieże w Glimmervoid (Player's Guide 2003,
  wiki Glimmervoid) → cztery iglice wokół środka tarczy.

## Rozbieżności i wybory (do przejrzenia przy rastrze fanowskim)

- Wiki (Tangle): „bordered by the Glimmervoid and the Quicksilver Sea”;
  Moons of Mirrodin: „The Quicksilver Sea lies across the mountains from
  the Tangle … implied to border the Tangle as well”. Na jednej półkuli
  z cyklem fastlandów obu naraz spełnić nie sposób — **przyjęto cykl
  fastlandów**; kontakt Tangle↔morze możliwy poza widoczną półkulą.
- Pozycje **wewnątrz** regionów (Titan Forge, Medev, Oxidagg, Wailing
  Cairns, Temple Might, Cambree Garden, Outer Altar, Glistening Dunes)
  są symboliczne — kanon podaje tylko przynależność.
- Konwencja rzutu (tarcza-półkula, papier poza tarczą, brak kompasu
  i skali — sfera bez biegunów; obwód w adnotacji) jest decyzją
  kartograficzną Kodeksu, nie kanonem.

## Epoka (ADR 0033; decyzja właściciela 2026-09-06)

Jedna mapa powierzchni Mirrodinu obsługuje **całą historię planu od
Argentum po wojnę o New Phyrexię** (*Mirrodin*, *Darksteel*, *Fifth
Dawn*, *Scars of Mirrodin*, *Mirrodin Besieged*, *New Phyrexia*):
Phyrexia zajmuje i psuje regiony (Dross rozlewa się na Tangle i Razor
Fields, pod powierzchnią rośnie Furnace Layer), ale topologia pięciu
regionów wokół Glimmervoid nie zmienia się — sceny z tej ery pinują się
tutaj, a epokę niesie karta (ADR 0033 §1). Pierwotny dopisek „przed
kompleacją” był źle postawioną granicą: właściwa granica to późniejsza
**przebudowa planu w dziewięć koncentrycznych sfer** (*Phyrexia: All
Will Be One*): Tangle przeniesione do Hunter Maze, Quicksilver Sea
spuszczone do Surgical Bay, dawna powierzchnia = jałowy Mirrex.
Ta topologia (przekrój kuli, pierścienie) nie mieści się na mapie
półkuli — osobna mapa powstanie wyłącznie, gdy przyjdzie karta, która
jej wymaga (ADR 0033 §2). Karta z Mirrexu pinowałaby się nawet tutaj.

## Lacuny — dlaczego własny glif

Lacuny (MTG Wiki „Lacunae”) to gigantyczne **tunele do pustego jądra
planu**, którymi z Rdzenia wystrzeliło pięć słońc (Cave of Light /
Bringer, Pool of Knowledge / Eye of Doom, Ish Sah / Ingle, Kuldotha /
Sky Tyrant, Radix / Lyese); magia grawitacyjna pozwala schodzić po ich
ścianach. Watermark Mirran ze *Scars of Mirrodin* to stylizowany rysunek
pięciu lacun. Pierwsza wersja mapy oznaczała je zendikarskim glifem
`hedron` (sześciokąt) — po uwadze właściciela mapforge dostał glif
`lacuna` (kolisty szyb w płycie z ciemnym wnętrzem i nacięciami), bo
hedrony na Mirrodinie nie występują.

## Źródła (URL)

- https://mtg.wiki/page/New_Phyrexia_(plane) — plan, sfery, słońca,
  „Locations on Mirrodin” (pełna lista POI z przynależnością).
- https://mtg.wiki/page/Lacunae — lacuny jako tunele do jądra, pięć par
  lacuna–słońce, watermark Mirran; stan lacun po przebudowie planu.
- https://mtg.wiki/page/Tangle · https://mtg.wiki/page/Mephidross ·
  https://mtg.wiki/page/Glimmervoid · https://mtg.wiki/page/Oxidda_Chain ·
  https://mtg.wiki/page/Quicksilver_Sea · https://mtg.wiki/page/Razor_Fields ·
  https://mtg.wiki/page/Rey-Goor
- https://www.mtgsalvation.com/articles/49606-the-world-of-mirrodin-i-moons-of-mirrodin
  — Vorthos Guide: geografia relacyjna, kultury.
- https://archive.org/details/mirrodin-players-guide-magic-the-gathering-2003
  — Mirrodin Player's Guide (2003): opisy Tel-Jilad, Lumengrid, Kuldotha,
  Taj-Nar, Vault of Whispers, Glimmervoid, Radix; bez mapy.
- https://mtg.wiki/page/Category:Maps_by_location — brak Mirrodinu.
- https://web.archive.org/web/20200704165230/http://phyrexia.com/continuity/maps.shtml
  — archiwum map (15 planów), bez Mirrodinu.
- https://inkarnate.com/m/p8zwPV-mirrodin/ — fanowska mapa (John Ruder),
  niedostępna z sandboxa (błąd strony, CDN 500).
