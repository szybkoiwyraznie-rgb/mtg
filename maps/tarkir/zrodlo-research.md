# Tarkir — research mapy (T2 → T3 → T4) i propozycja rekonstrukcji

Data: 2026-09-07 (sesja PR-21, pakiet 3 — 509KTK Highland Game).
Procedura: PROCES_MAP.md MA1 (kolejność tierów) + SKILL_MAPA_PLANU §0
(drabina źródeł) i §11 (mapforge). Raport z tego researchu został
przedstawiony właścicielowi w czacie **przed rysowaniem**; decyzje
właściciela są spisane w sekcji „Decyzje właściciela” (uzupełniana
po odpowiedzi — do tego czasu mapa NIE jest rysowana).

## Werdykt tierów

| Tier | Wynik | Uzasadnienie |
| --- | --- | --- |
| T2 (wektor) | **brak** | Żadne źródło nie publikuje wektorowej mapy Tarkiru; w repo nie ma nic do adopcji. |
| T3 (oficjalny raster) | **brak** | WotC nigdy nie opublikował mapy Tarkiru: ani w *Planeswalker's Guide to Khans of Tarkir* (2014, cz. 1–2 — same opisy lokacji), ani w *Planeswalker's Guide to Tarkir: Dragonstorm* (2025, cz. 1–2 — opisy relacyjne, bez grafiki mapy). MTG Wiki: kategoria `Category:Maps_by_location` (13 podkategorii) nie zawiera Tarkiru. Wątek r/magicTCG „Map of Tarkir” (2024): „Since there's no official map from WoTC, I had to cobble it together from the stories”. Mapa fanowska z Tumblra (2025) wprost: „i made a map based on the descriptions given” w przewodniku TDM. |
| T4 (rekonstrukcja) | **rekomendowana** | Kanon tekstowy Tarkiru jest **bogatszy niż Mirrodinu**: przewodnik TDM 2025 podaje strony świata (delta Sultai „na południu kontynentu”, Tiansun „wschodnie”, Temur „północny klimat”, Mardu „centralny step dotykający granic wszystkich klanów”) i pełną listę sąsiedztw klanów; przewodnik KTK 2014 dodaje lokacje epoki khanów. Rekonstrukcja relacyjna w mapforge jest wykonalna z małą liczbą arbitralnych wyborów. |

Rastry fanowskie: (1) mapa Inkarnate (r/magicTCG, 2024, autor
Puzzleheaded-Fault60) — Reddit zwraca 403 z sandboxa; (2) mapa z Tumblra
(imperatorcaesaraugustus, marzec 2025, na podstawie przewodnika TDM) —
HTTP 403. Zgodnie ze stałą decyzją właściciela (Mirrodin, 2026-09-06)
raster fanowski wchodzi do gry dopiero, gdy właściciel go dostarczy,
i tylko jako źródło pomocnicze dla pozycji nieustalonych w kanonie.

**Aktualizacja 2026-09-07:** właściciel dostarczył raster Lore Café / MTG
Wiki Italia („Tarkir Map 2025 (EN)”, 3d4) — najpierw jako podgląd
1568×1208 (matryca geometrii T4), potem pełny plik 4307×3293 commitem
na gałąź. Decyzją właściciela raster jest **podkładem T1** (epoka
Dragonstorm) obok T4 (epoka khanów) — ADR 0035; sekcja „Kalibracja”
niżej.

## Źródła (URL)

- https://magic.wizards.com/en/news/feature/planeswalkers-guide-khans-tarkir-part-1-2014-09-03 — Abzan, Jeskai, Sultai (epoka khanów).
- https://magic.wizards.com/en/news/feature/planeswalkers-guide-khans-tarkir-part-2-2014-09-10 — Mardu, Temur, planeswalkerzy (epoka khanów); Chianul, Karakyk Valley, Staircase of Bones, Dragon's Throat, Qal Sisma, The Scour.
- https://magic.wizards.com/en/news/feature/planeswalkers-guide-to-tarkir-dragonstorm-part-1 — historia, Abzan, Jeskai (TDM 2025) — strony świata i sąsiedztwa.
- https://magic.wizards.com/en/news/feature/planeswalkers-guide-to-tarkir-dragonstorm-part-2 — Sultai, Mardu, Temur (TDM 2025) — strony świata i sąsiedztwa.
- https://mtg.wiki/page/Tarkir — historia, geografia („Tarkir ranges from arid desert plains to humid tropical jungles to frigid snow-covered tundra. According to Sarkhan, Tarkir has no oceans”), lista regionów z kolorami klanów.
- https://mtg.wiki/page/Qal_Sisma — lokacje Qal Sisma (obie epoki), sekcja „Historical” = epoka khanów (Karakyk Valley, Staircase of Bones, Melting Wilds, Tomb of the Spirit Dragon).
- https://mtg.wiki/page/List_of_secondary_characters/Tarkir — Arel: „w starej linii czasowej młoda szamanka Temur, świeżo inicjowana” (flavor Highland Game: „Chianul, at the weaving of Arel”).
- https://mtg.wiki/page/Category:Maps_by_location — brak podkategorii dla Tarkiru (stan 2026-09-07).
- https://www.reddit.com/r/magicTCG/comments/1amh5y5/map_of_tarkir/ — snippet wyszukiwarki: brak oficjalnej mapy (strona 403 z sandboxa).
- https://www.tumblr.com/imperatorcaesaraugustus/776537590514024448/tarkir-map — snippet: mapa fanowska z opisów TDM (strona 403 z sandboxa).
- https://api.scryfall.com/cards/named?exact=Highland+Game&set=ktk — karta (snapshot `scryfall/509ktk-highland-game.json`).

## Kanon geograficzny (twarde relacje)

Świat: jeden kontynent bez oceanu (Sarkhan); klimat od pustyń przez
stepy i tropikalną dżunglę po subarktyczne góry; w epoce khanów krajobraz
zaścielają smocze kości. Pięć terytoriów klanów:

| Region | Klan (KTK) / ród (DTK) | Charakter | Strona świata | Sąsiedzi |
| --- | --- | --- | --- | --- |
| **Qal Sisma** | Temur Frontier / Atarka | wysoki, pofałdowany płaskowyż granitowo-wapienny, jaskinie, lodowce; subarktyczny | **północ** (Temur = „northern climate”; Jeskai polują na burze „closer to … the northern territories”) | Mardu, Jeskai |
| **Tiansun** | Jeskai Way / Ojutai | wulkaniczne szczyty, niziny z wielkimi jeziorami, rzeki z roztopów | **wschód** („eastern Tiansun mountain range”) | Mardu, Temur (wg sekcji Sultai także Sultai) |
| **Sandsteppe** | Mardu Horde / Kolaghan | wietrzne płaskowyże, trawiaste stepy, bagniste zarośla, rozpadliny | **centrum** („central steppe … touching the borders of all the other clans”) | wszyscy |
| **Shifting Wastes** | Abzan Houses / Dromoka | pustynie, ruchome piaski odsłaniające krasy, oazy, nieliczne góry | **zachód/południowy zachód** (wynika z sąsiedztw: tylko Mardu i Sultai) | Mardu, Sultai |
| **Gudul delta** | Sultai Brood / Silumgar | olbrzymia delta rzeczna, dżungla, bagna, wyspy | **południe** („located in the south of the continent”) | Mardu, Abzan, Jeskai |

Relacje przyjęte do sceny (źródło → konsekwencja):

- **Mardu w środku, dotyka wszystkich** (TDM cz. 2) → step Sandsteppe
  jako centralny wielokąt; **Temur nie graniczy z Abzanem**, **Abzan nie
  graniczy z Jeskai**, **Temur nie graniczy z Sultai** → klin Mardu musi
  wychodzić do krawędzi NW (między Qal Sisma a Shifting Wastes).
- **Salt Road** „extends throughout Tarkir” — główny szlak handlowy Abzan
  (KTK cz. 1: wszystkie szlaki przez Shifting Wastes przechodzą przez
  Arashin), przecina Jeskai (faktoria **Purugir** w kanionie pod
  nawisem), **Dirgur** leży „near the crossroads of the Salt Road”
  → droga W→E: Arashin → Sandsteppe Gateway → step Mardu → Dirgur/Purugir.
- **Sandsteppe Gateway** (KTK) / **Sandsteppe Gate** (TDM): most-forteca
  między dwiema górami, nad rzeką wypływającą z ziem Abzan, „gdzie
  pustynia przechodzi w step” → granica Abzan–Mardu.
- **Screamreach** (KTK: bagna łączące niziny przy Wingthrone z łąkami
  naprzeciw Sandsteppe Gate; TDM: „near the intersection between Abzan,
  Mardu, and Sultai”) → SW części stepu; **Goldengrave** (trawiasta
  równina bitew) między Screamreach a Sandsteppe; **Wingthrone**
  (klify, gdzie zginął smok piorunów) „not far” od Goldengrave.
- **The Scour**: rozpadlina biegnąca przez Qal Sisma w Temur i „like
  a scar into Mardu lands” → od gór N w step centralny.
- **Qadat, the Fire Rim**: niedostępne wulkaniczne pasmo „między ziemiami
  Jeskai i Temur”, „na północnej granicy Jeskai”; ojczyzna efreetów
  → styk N/E.
- **Lookout Roost**: wieża 400 stóp z czerwonawego kamienia na spękanej
  równinie „między zaludnionymi ziemiami Abzan a górami znaczącymi
  granicę z Sultai” → góry graniczne Abzan–Sultai (SW).
- **Arashin + Mer-Ek Fortress** na skalistym wzgórzu w sercu ziem Abzan;
  **First Tree / Amber Throne** w Arashin.
- Jeskai: **Sage-Eye Stronghold** (zbocze góry nad zatoką otoczoną
  górami, dostęp tylko od wody), **Dirgur** (wyspa na wielkim jeziorze,
  pływająca wioska), **Cori Mountain** (zalana kaldera, szkielet smoka),
  **Riverwheel** (klif z wodospadem), **Highspire** (szczyty, modliszki),
  **Initiate's Stair** (biały pinakl, 1578 stopni), szlaki **Trail of
  Dead Emperors** (białe menhiry w górach) i **Dead Reckoning** (bagna),
  **Pearl Lake** (TDM; jezioro fizyczne — dopuszczalne w każdej epoce).
- Sultai: **Kheru Temple** (dżungla, siedziba Sidisi), **Qarsi Palace**
  (na kanałach), **Ukud Necropolis** (przy bagnach Gurmag), **Marang
  Fortress** nad **rzeką Marang** (z roztopów — źródła w górach),
  **Gurmag Swamps** (pas bagien okalający górną część terytorium),
  **Sagu Forest/Jungle** (obrzeża, dom nag), **Gudul** (wyspy delty),
  **Bloomvine Jungle** (TDM; największa dżungla, Marang ją przecina).
- Temur (epoka khanów): **Karakyk Valley** (cyrk lodowcowy, zimowe
  leże całego klanu; wg legendy krater po upadku smoka), **Staircase of
  Bones** (zaokrąglone wzgórze „w centralnym położeniu między
  łowiskami rodzin”), **Dragon's Throat** (wyjąca dolina, harfy
  z żeber smoków, tylko szeptacze), **Melting Wilds** (topniejące
  lodowce), **Ayagor / Dragon's Bowl**, **Eternal Ice** (święty szczyt),
  **Glintglaze Lake** (alpejskie jezioro, zimą obóz na lodzie),
  **Rainveil Forest** (las niższych partii, tydzień drogi z gór),
  **Valley/Tomb of the Spirit Dragon** (miejsce śmierci/hibernacji
  Ugina; w epoce khanów — lodowa rozpadlina, grób).

## Pinezka 509KTK Highland Game

Fabuła: łowy zimowe w Qal Sisma, klan Temur, poroże dla szeptaczy wg
nauk Chianula (flavor: „Chianul, at the weaving of Arel” — inicjacja
młodej szamanki). Kanon KTK: zimą (dwa najmroźniejsze miesiące) rodziny
zbierają się w **Karakyk Valley**; łowiska rodzin skupiają się wokół
**Staircase of Bones** („central location between the various family
hunting grounds”). Propozycja: pinezka w łowiskach Temur między Karakyk
Valley a Staircase of Bones, `pewnosc: region` (region = Qal Sisma).

## Propozycja układu T4 (do decyzji właściciela)

Płótno 2000×1400 (jak Mirrodin), N u góry, styl `atlas`. Ląd **full-bleed**
(kontynent wychodzi poza ramkę — kanon: brak oceanu), jedyny duży akwen
to **śródlądowe morze/zalew na południu**, w które uchodzi delta Gudul
(Sultai „dredge the seas”; Sage-Eye nad zatoką). Pięć terytoriów jako
`dzielnice` (subtelny tint, jak Ravnica) z `granicaRegionu`; biomy:
`lod`+`pasmo` (Qal Sisma), `pasmo`+`wulkan`+`jezioro` (Tiansun),
`step` (Sandsteppe), **nowy klocek `pustynia`** (wydmy — Shifting
Wastes; mapforge nie ma jeszcze biomu pustynnego), `las`+`bagno`
(Gudul). The Scour = klocek `szczelina` (istnieje). ~30 POI, ~50
etykiet — skala pakietu Mirrodin.

Epoka: karta jest z KTK (linia khanów). Fizyczna geografia jest wspólna
dla obu linii czasowych (zmieniają się władcy i nazwy osad, nie
topografia) → **jedna mapa fizyczna Tarkiru**, etykiety osad w nazwach
epoki khanów (Karakyk Valley, Wingthrone, Sage-Eye, Kheru Temple…);
obiekty czysto fizyczne poświadczone tylko w TDM (Glintglaze Lake,
Rainveil Forest, Pearl Lake, Bloomvine Jungle, Marang River) dopuszczone;
osady istniejące tylko w linii smoczych lordów / po Stormnexus (Qatros
Karst City, Mistrise Village, Storm Crane Monastery, Summer Landing)
— poza mapą, wymienione w `map.json` jako `poza_epoka`. Analogia:
ADR 0033 (Mirrodin — jedna mapa powierzchni; granica epoki = zmiana
topologii).

## Decyzje właściciela

1. **2026-09-07 (rano):** T4 — rekonstrukcja mapforge; raster fanowski
   Lore Café dostarczony w czacie jako źródło pomocnicze geometrii
   (ADR 0031); mapa w nazwach epoki khanów (ADR 0033 uzup.).
2. **2026-09-07 (po recenzji T4):** „Tak, chcę iść w tą stronę” — raster
   Lore Café **wchodzi do repo jako podkład T1** (właściciel wgrał
   `tarkir.jpeg` commitem `f1b0057`; teraz `maps/tarkir/podklad-t1.jpg`,
   4307×3293), **przełącznik T1 (Dragonstorm) ↔ T4 (Khans)** na stronie
   mapy, **pinezki wszystkich kart w obu widokach**, **w T1 wszystkie
   etykiety Codexu wyłączone** (czysty raster), **koordynaty identyczne
   między epokami — złoty standard = raster T1**. Prawa autorskie
   nieistotne (projekt prywatny). → ADR 0035.

## Kalibracja T1 ↔ T4 (ADR 0035)

- Generator T4 rysował z odczytów **podglądu** rastra 1568×1208 przez
  `R(px, py) = (91.4 + 1.1589·px, 1.1589·py)` na płótnie 2000×1400.
  Pełny raster 4307×3293 = podgląd × 2.7468 (proporcje 1.3079 vs 1.2980
  — podgląd był o ~9 px niższy, nie przeskalowany nieproporcjonalnie).
- Kalibracja układu złotego (T1, 0–1) → płótno T4 (0–1):
  `x4 = 0.045695 + 0.908609·x1`, `y4 = 0.992421·y1`.
- Weryfikacja: 26 POI zmierzonych na pełnym rasterze (pierścienie osad,
  glify twierdz, środek szczytu/wodospadu) — RMS 13 px w pionie, 26 px
  w poziomie (jednostki T4) względem pierwotnych odczytów z podglądu;
  po domierzeniu POI generator używa `P(X, Y)` z pomiaru pełnego, więc
  obiekt w T4 leży w tym samym punkcie złotym co pinezka w T1.
- Pomiar (px na pełnym rasterze): Karakyk Valley (1793,338), Eternal Ice
  (1215,470 — środek czapy), Staircase of Bones (2071,878), Crucible /
  Tomb of the Spirit Dragon (360,545), Summer Landing/Ayagor (1364,816),
  Qadat (2960,520), Dragon's Eye/Sage-Eye (3845,1060), Riverwheel
  (3472,963), Dirgur Lake Monastery (3401,1327), Purugir (3337,1420),
  Cori Mountain (3743,849), Highspire (4036,462), Initiate Stairs
  (3080,785), Wingthrone ≈ Dalkovan City S (2033,1527 — pozycja z T4,
  osada epoki khanów nie występuje na rasterze TDM), Sandsteppe Gateway
  (860,1590), Arashin (697,1957), Mer-Ek/First Tree (885,2035), Khava
  (442,2187), Lookout Roost (1985,2745), Aerie of the Unfettered
  (1800,3060), Kheru (2680,2893), Qarsi Palace (2635,2865), Ukud
  Necropolis (3750,2180), Marang River Fortress (2780,2442), Molderfang
  Falls (3172,2610); jeziora: Dragon's Throat (2160,530), Glintglaze
  (790,445), Pearl Lake (3660,380), Dirgur Lake (3430,1330), Brine Lake
  (190,1905).
- Pinezka 509KTK w układzie złotym: (0.4496, 0.1846) = px (1936, 608) —
  przedgórze między Karakyk Valley a Staircase of Bones, na W od
  Dragon's Throat (sprawdzone na wycinku rastra).
- Kotwice regionów/krain bez POI (Sandsteppe, Goldengrave, Screamreach,
  Gurmag, Bloomvine, Sagu, Stormplains, Dusyut, Scour, rzeki, Salt Road,
  morze) przeliczone z T4 kalibracją — dokładność odczytu z podglądu
  (±30 px T4); domierzyć przy następnej karcie w danym regionie.
