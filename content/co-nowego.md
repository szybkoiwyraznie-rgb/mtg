## 2026-09-03 22:10 — Ravnica: herby gildii i lokacje na PRAWDZIWEJ mapie (T2+/v3) + naprawa podkładu

**Korekta ważna:** poprawny podkład Ravnicy to wektoryzacja fanowska
**v3 (wariant T2+, 6849×5292, ADR 0031)** — nie rekonstrukcja mapforge
T4 (1600×1100). Eksperyment T4 był odrzucony; w trakcie PR-17 omyłkowo
nadpisał podkład v3 (przywrócono w commicie FIX). Poniższe dodatki
trafiają już na właściwy v3.

- **Herby 10 gildii** — wypełnione barwne tarcze siedzib z białym
  glifem (wektoryzacja odzyskała kolorowe celowniki, ale utraciła
  glify): Gruul (Skarrg), Boros (Sunhome), Selesnya (Vitu-Ghazi),
  Izzet (Nivix), Simic (Zonot Seven/Zameck), Azorius (New Prahv),
  Orzhov (Orzhova), Rakdos (Rix Maadi), Golgari (Korozda & Svogthos),
  Dimir (Nightveil & Duskmantle). Millennial Platform neutralny — bez.
- **Lokacje kanoniczne** (świadome uchylenie wcześniejszych decyzji z
  map.json, za zgodą właściciela): Beacon Tower (mały niebieski marker
  w P2), Gnat Alley (kropkowana trasa + szara etykieta w P6),
  Guildmages' Forum / Guildpact Square / Pillar of the Paruns (małe
  czarne etykiety w gildyjnym rdzeniu P1).
- Odtwarzalne, idempotentne warstwy SVG: `tools/mapforge/ravnica-v3-herby.py`
  i `tools/mapforge/ravnica-v3-lokacje.py` (raster źródła pozostaje poza
  gitem — ADR 0031).
- Zaktualizowana dokumentacja: `map.json` (kotwice + zmiany decyzji),
  `mapa-analiza.md` (notka korygująca T4 → T2+/v3).

## 2026-09-03 19:45 — Mapa Ravnicy v4: domknięcie do złotego standardu (pierwsza sesja z wizją)

Mapa Dziesiątego Dystryktu (`maps/ravnica/podklad.svg`, T2+) domknięta
wzrokowo do prywatnej fan-made mapy źródłowej właściciela (warstwy
a/b/c, ADR 0031) — **pierwsza sesja z oglądem obrazów (vision)**, więc
poprawki szły z bezpośrednim porównaniem render↔źródło, nie tylko
programistycznie:

- **Granice dzielnic wróciły:** ciągła sieć przerywanych linii dzieli
  całość na 6 Precinctów (wcześniej tylko fragmenty) — usterka (1).
- **Etykiety POI czarne i pod markerami**, nazwy ulic/placów bez kółek
  (są geograficzne, nie punktami), markerów tylko tam, gdzie w źródle
  kolorowe okręgi — usterki (2)–(4), (6); ~15 fałszywych markerów
  usuniętych, brakujące dodane, kolory gildii poprawione.
- **Millennial Platform:** długa, jasnoszara przerywana linia-kotwica
  od lewitującej skały do lądu (wcześniej urwana) — usterka (5).
- **Centrum:** marker Vizkopy zdjąty z tekstu ORZHOVA; granica P6/P1
  nie tnie już KAMEN FORTRESS; SMELTING QUARTER pod granicą.
- **Narzędzie `map-audit`:** test kolizji etykiet AABB → **OBB/SAT**
  (mniej fałszywych alarmów dla ukośnych etykiet dróg).

`map-audit ravnica` = 0 problemów; testy 102/102; build zielony.

## 2026-09-03 11:29 — Ravnica: pogłębiona, zweryfikowana i gotowa na wektoryzację v3

Sesja jakościowa nad Rawnicą (PR-14). Po audycie scalonego PR-13
(spójny z ADR-ami; znalazło się 5 drobnych pozycji — wszystkie
obsłużone):

- **Plan Ravnica** dostaje rozpisane „Ludy”: pochodzenie megalizny
  (miasta zrosły się w jeden organizm), roster ras ery Paktu
  (Erstwhile w Umerilek, Vedalken, Loxodon, Viashino) i warstwa
  martwych (Rada Obzedat, „Niesmiertelni”, dzielnica Agyrem jako
  późniejsze wyjaśnienie anomalii planu) + dwa nowe cytowania.
- **Link-mining**: encje Rawnicy (Boros, Legion Boros, Dziesiąty
  Dystrykt, Sunhome, Tin Street, Pakt Gildii) lądują w kolejce
  link-miningu — hasła powstaną przy drugiej karcie planu (próg
  liczy się od kart); plan dostaje item „Karty kolekcji” z linkiem
  do *Withstand*. Baza po raz pierwszy 100% kompletności (6/6 stron).
- **Pass mapowy**: trzy pozycje otwarte mapy zweryfikowane kanonem —
  Guildpact Square ze Słupem Parunów (obelisk z dziewięciu pieczęciami,
  przy Chamber of the Guildpact — rozbieżność wiki opisana), Beacon
  Tower (P2, Azorius, epoka bloku niepotwierdzona) i Gnat Alley
  (najdłuższa ulica planu, trasa infiltracji Gruul — kanon bez
  współrzędnych).
- **Mapa v3 — prawie gotowa**: właściciel dostarczył fan-made mapę
  Dziesiątego Dystryktu w trzech warstwach (granice / + teren / + POI
  i labelki) plus link Drive. Rastery nie dotarły jednak do sandboxa
  (załącznik niewidoczny dla narzędzi, sieć zablokowana) — procedura
  wektoryzacji jest opisana krok po kroku i czeka na pliki.
- Drobiazgi: dwie literówki w dzienniku (wariantie, Blistercoils)
  i usunięty bezkanoniczny fragment z „Setting w pigułce”.
## 2026-09-03 09:36 — Karty Katalogowe przechodzą na LORE-first; Ravnica dostaje kierunek wektoryzacji fan-made

Po feedbacku właściciela zmienia się standard kart: główna treść nie zaczyna
się już od kosztu, typu, wydania ani historii publikacji. Nowy ADR 0030
ustawia **Kronikę Lore** jako otwarcie, a dane techniczne zostawia w
infoboksie i w krótkiej sekcji **Mechanika jako Opowieść** pod koniec.
Wszystkie trzy obecne karty — **Dunland Crebain**, **Coralhelm Guide** i
**Withstand** — zostały przepisane w tym duchu: więcej świata i sceny,
mniej metryki MtG. Dodatkowo ADR 0031 zapisuje, że prywatne fan-made mapy
dostarczone przez właściciela mogą być źródłem wektoryzacji; dla Ravniki
powstał kandydat v3 oparty o `TenthDistrict.png` (raster roboczy poza
repo, wynik docelowo jako SVG/scena z proweniencją i QA).

## 2026-09-03 00:43 — Ravnica v2: geometria skalibrowana 1:1 pod oficjalną mapę GGR (transkrypcja właściciela)

Właściciel spisał oficjalną mapę Dziesiątego Dystryktu z *Guildmasters'
Guide to Ravnica* w układ współrzędnych — i Codex przebudował scenę
atlaskową na tych koordynatach (kanoniczna transformacja 64 px/j.,
serce na placu Dziesiątki). Nivix przesunął się na zachód, Zonot Seven
w dół, Millennial Platform nad Skarrg; doszły **Statue of Agrus Kos,
Vizkopa Bank, Whitestone, place Plaza East/West/South, Great Concourse,
Gore House i Medori Park**, a pod południową poświatą stanęły markery
podziemi: **Rix Maadi, Korozda & Svogthos, Nightveil & Duskmantle**.
55 kotwic map.json, pinezka Withstanda przy Tin Street Market;
strona planu dopowiada Undercity. Pozycyjnie: 1:1 z kanonem GGR;
rysunkowo: własne dłuto mapforge (raster WotC nadal licencyjnie
nieosadzalny — baza to tekstowa transkrypcja).

## 2026-09-03 00:12 — Dostawa 137GPT Withstand: Ravnica wchodzi do Atlasu jako pierwszy plan-miasto (mapa T4)

Trzecia karta Kolekcji: **Withstand** (Guildpact, 2006) — biała tarcza
pierwotna z głosem Alovneka, maga gildii Boros — w pełnym szkielecie
dziewięciu sekcji, z pinezką na bruku przy Tin Street w Precykcie
Czwartym, pod samym Sunhome. Razem z nią Codex dostaje **plan Ravnica**
i pierwszą w Atlasie mapę miasta: Dziesiąty Dystrykt narysowany
własną ręką silnika mapforge w wariancie T4 — sześć precyktów ułożonych
według kanonicznych sąsiedztw z *Guildmasters' Guide to Ravnica*, mur
północny z blankami, za którym czają się Skarrg i Czerwone Pustkowia,
szczelina Deadbridge z mostem Benzera, Zonot Siedem z Blistercoils,
Transguild Promenade z rubblebeltem i tłem duchów miasta, które „trwa
dalej poza ramką". Oficjalnych rastrów map celowo nie osadzamy
(licencja WotC); geometria to rekonstrukcja — jeśli oficjalna mapa GGR
zostanie kiedyś przepisana na tekst (pomoc właściciela), v2 skalibruje
kształty 1:1. Szczegóły: `maps/ravnica/mapa-analiza.md`.

## 2026-09-02 23:08 — Pętla Jakości: audyt PR-12, geografia Bala Ged i Sejiri, Umungshore na mapie

- **Audyt scalonego PR #12** zapisany w
  `docs/audits/AUDYT_2026-09-02-PR12.md`; jedno znalezisko (P3 —
  przeterminowany status „PR #12 jest otwarty" w najnowszym handoffie)
  naprawione od razu.
- **LORE Zendikaru (strona planu):** sekcja „Geografia" domyka dwie
  ostatnie białe plamy kontynentów — nowe akapity o **Bala Ged**
  (dżungla Guum Wilds, topiel Bojuka Bay i słynna trasa Bojuka Route,
  stopnie rzeki Umung, Tangled Vales, imperium Makindi, zagłada rojem
  Ulamoga i Khalni Heart) oraz **Sejiri** (polarny płaskowyż w klifach,
  Midnight Pass, osada Ikiral w pękniętym hedronie, Chill Depths,
  mityczne Benthidrix i los ostatniego Skyclave).
- **4 nowe źródła** w Źródłach planu Zendikar (MTG Wiki „Bala Ged"
  i „Sejiri", Planeswalker's Guide: Bala Ged and Elves, Archive Trap I).
- **Link-mining:** bez nowych haseł — próg ≥2 kart wspominających encję
  nadal nieosiągnięty (2 karty na dwóch rozłącznych planach; liczniki
  w `docs/backlog.md` bez zmian).
- **Pass mapowy (Zendikar, T4):** nowy obiekt **Umungshore** —
  kanoniczna wioska nad Bojuka Bay przy trasie Umung (MTG Wiki „Bala
  Ged"); scena + podkład + rejestr map.json (`kotwice`/`elementy`),
  walidator wiązań 0 uwag, `tools/map-audit.py` 0 problemów, QA
  rastrowe cropu regionu.
- **Warsztat mapowy:** `SKILL_MAPA_PLANU.md` dostał zweryfikowany tor
  QA rastrowego przez `sharp` (prebuilt npm; odpowiedź na brak
  libcairo/rsvg w sandboxie).
- Weryfikacja: `npm test` **102/102**, `npm run build` OK,
  `tools/map-audit.py` zendikar/srodziemie — **0 problemów**.

## 2026-09-02 22:22 — Audyt PR-11: domknięcie dryfu dokumentacji i rejestru map

- **Audyt scalonego PR #11** zapisany w `docs/audits/AUDYT_2026-09-02-PR11.md`.
- **Zendikar / `maps/zendikar/map.json`** dosynchronizowany z aktualną
  mapą i ADR 0013: notka źródłowa nie mówi już o przerywanej Murasie;
  w rejestrze elementów poprawione typy/proweniencja **Hagra Cistern**,
  **Beyeen**, **Serpent's Maw** i **Valakut** (usunięte błędne,
  historyczne przypisanie Valakuta do Akoum).
- **Żywe dokumenty** zsynchronizowane z architekturą ADR 0027 v2:
  `docs/ARCHITECTURE.md`, `docs/guides/PROCES_MAP.md`, `maps/README.md`,
  `docs/ROADMAP.md` oraz najnowszy handoff PR-11.
- **Rejestr ADR** dostał dodatkową straż: test sprawdza teraz, czy status
  w `docs/decisions/README.md` zgadza się ze statusem w samym pliku ADR.
  Przy okazji ujawnił i naprawił realny dryf: ADR **0008** miał w pliku
  status „Zaakceptowana", choć po ADR 0017 jest tylko **częściowo
  zastąpiona**.
- Weryfikacja: `npm test` **102/102**, `npm run build` OK,
  `tools/map-audit.py` — 0 problemów.

## 2026-09-02 22:08 — Recenzja aplikacji: ZIP na Pages naprawiony, dziennik z godzinami + archiwum, stopki czasu stron (ADR 0029)

- **„Pobierz archiwum (ZIP)" na Pages działa** (po merge): pages.yml buduje
  przez `--out`, a ten tryb CLI pomijał ZIP — teraz CLI zawsze buduje pełny
  pakiet; test kontraktu odtwarza dokładnie wywołanie z workflow.
- **Dziennik „Co nowego" wg ADR 0029:** każdy wpis ma datę i **godzinę
  publikacji** (nagłówek `## RRRR-MM-DD HH:MM — tytuł`; historia
  backfillowana z gita), strona główna pokazuje zwięzłą listę 5 najnowszych,
  `#/co-nowego` — 5 pełnych wpisów + **archiwum podzielone miesiącami**
  (`#/co-nowego/<RRRR-MM>`).
- **Stopki czasu:** karty, hasła i strony map kończą się datą+godziną
  utworzenia i ostatniej aktualizacji (z historii gita; na Pages wymaga
  `fetch-depth: 0` w checkout — zmiana po stronie właściciela).
- Mapa: etykieta **Pelakka Karst** dosunięta do łuku krasu.

## 2026-09-02 20:46 — Pętla Jakości (PR-11): geografia Zendikaru domknięta kanonem (cała kolejka E-geo + klocek fortu)

- **Druga część sesji — kolejka E-geo-1/2/3/4 i E5 wyczerpana:**
  - **E-geo-4 (Akoum):** **Tal Terig** („Puzzle Tower") przeniesiony
    nad kotlinę Akoum przed resztki Teeth of Akoum i przetypowany na
    ruinę (kanon Guide: Akoum > w2); nowa osada **League of Anowon** —
    obóz-szkoła magów-eksploratorów wampira Anowona wysoko w Teeth of
    Akoum; trakt z Affy poprowadzony do nowej pozycji wieży.
  - **E-geo-1 (archipelag Ondu) — kanonem, w2 odrzucona:** maleńka
    **Jwar** z Jwar Isle Refuge przeniesiona pod PŁD. wybrzeże Ondu
    (Guide: Ondu), wokół niej nowe wody **Serpent's Maw**; **Beyeen**
    scalona z wysepką-satelitą w jedną podłużną wyspę — kanon stawia
    **Mount Valakut** (szczyt Crown of Talib) w JEJ sercu, notka
    „Valakut w sercu Akoum" z 2026-09-01 była błędna i została
    naprawiona; Agadeem była zgodna z kanonem.
  - **E-geo-2 (rotacja układu) — rozstrzygnięta kanonem, bez rotacji:**
    „Ondu is located in the southwestern quadrant of Zendikar"
    (MTG Wiki: Ondu) — nasz układ jest kanoniczny, w2 nie; rozbieżność
    „małego morza" Akoum–Ondu odnotowana jako wątek otwarty.
  - **E-geo-3 (detal Murasy):** wpis kolejki był nieaktualny — etykiety
    weszły już w PR-10; zweryfikowane.
  - **E5 (ADR 0028):** nowy klocek **fort** (mury z donżonem i bramą,
    sylwetka w kole) — użyty na **Fort Keff** i „stone havens" Akoum
    (**Grip Haven**, **Slab Haven**, **Ghostwatch**; przy okazji
    rozgęszczone — zbite ikony zamalowywały się halo etykiet);
    latarnia/wrak odrzucone (brak kanonicznego użycia), scena demo
    z fortem.
  - **LORE Zendikaru:** akapity o archipelagu Ondu (Jwar/Serpent's Maw,
    Beyeen/Crown of Talib/Valakut, Agadeem) i Akoum (Tal Terig, League
    of Anowon, stone havens) + 4 nowe źródła.
  - **Recenzja właściciela (preview):** Windblast Gorge dostał ściany
    kanionu (dwa pasma wzdłuż rzeki do Glasspool — kanon: „Drake
    Ravine", przejście w góry wyżłobione przez Zhulodoka); nowy szlak
    z traktu Goma Fada–Affa do stone havens (Grip → Slab → Ghostwatch);
    League of Anowon celowo bez drogi — wg kanonu do obozu dociera się
    tylko gryfem z Affy.
- **Pass mapowy (kolejka E-geo-5/6/7/9 domknięta):**
  - **Pelakka Karst** — wapienny kras otaczający Hagra Cistern
    (Guide: Guul Draz) nazwany na mapie;
  - **Silundi Sea** — morze, w które wcina się Ondu (Guide: Ondu),
    etykieta na wodach między Ondu a Agadeem;
  - **Tikal Harborage** — osada merfolków Thady Adel w górze kanału
    od Sea Gate; kanon lokuje ją na TAZEEM, nie na Ondu jak fanmapa
    (kanon > w2);
  - **Sunspring** i **Calcite Flats** — oaza sprzed epoki Eldrazi
    w kalcytowych ławicach pod Bulwarkiem + pas ławic na południowym
    wybrzeżu Tazeem;
  - **Hadatown → North Hada** — kanoniczna nazwa i pozycja (północne
    wyżyny przy źródle Umary) zamiast pozycji fanowskiej; nowy trakt
    North Hada–Coralhelm;
  - zachodnia zatoka Bala Ged/Guul Draz zostaje **bez nazwy** — kanon
    jej nie nazywa, a nazw nie zmyślamy.
- **LORE strony planu Zendikar:** akapity o nowych miejscach Tazeem
  (Tikal Harborage, Calcite Flats, Sunspring, North Hada), krasie
  Pelakka i morzu Silundi — z cytowaniami (4 nowe źródła).
- **Audyt PR-10** (`docs/audits/AUDYT_2026-09-02-PR10.md`): determinizm
  renderu potwierdzony bit w bit, treść i kod zgodne z ADR 0021–0027;
  3 drobne znaleziska naprawione (kotwica rejestru Tangled Vales
  wskazywała morze; zdublowany nagłówek w ADR 0027; zdanie gidu
  o oznaczaniu Fabuły w Źródłach ujednolicone z praktyką).
- Link-mining: nadal poniżej progu ≥2 kart dla wspólnych encji
  (2 karty w bazie, plany rozłączne) — bez nowych haseł.

## 2026-09-02 18:42 — szlify UI: „Narracja" na kartach, mapy bez paska, czysty dziennik

- Na kartach słowo **„Narracja"** zastępuje „Fabułę dostawy"
  (terminologia widoczna dla czytelnika; format dostawy bez zmian).
- Mapy: pasek „− + ⟲" usunięty — zoom kółkiem/pinch, **Esc = reset
  widoku**.
- Dziennik „Co nowego" bez komentarza technicznego na górze (renderer
  markdown pokazywał go jako tekst na stronie głównej i karcie
  Co nowego).

## 2026-09-02 18:42 — dopieszczenie iframe (feedback): czyste okno mapy, sekcje w bazie, warstwa nad całością

- **Iframe dobrany proporcjami do mapy** (aspect-ratio z wymiarów
  podkładu), strona w środku = czyste okno mapy bez scrollbarów
  (pasek zoomu pływa nad mapą).
- **Legenda, lista pinezek, atrybucja i warstwa karty** renderują się
  w artefakcie bazowym (nie w iframe); **warstwa karty otwiera się nad
  CAŁYM Codexem** (pinezka → postMessage `codexKarta` → dialog
  w rodzicu). Testy 91/91.

## 2026-09-02 18:42 — architektura ostateczna: DRZEWO HTML map (pomysł właściciela, ADR 0027 v2)

Jednoplik offline nie skaluje się (30+ planów ≈ 200 MB). Rozwiązanie
właściciela: **każdy plan = osobna, samowystarczalna strona
`maps/<plan>.html`**, osadzana w artefakcie przez `<iframe>` —
file:// nie blokuje iframe'ów, więc **wersja offline z dysku działa
w pełni** (wektorowe mapy, nakładka, warstwa karty), a rozmiar rośnie
liniowo per plik. Artefakt główny: stałe ~222 kB. „Pobierz ZIP
Codexu" = całe drzewo (index.html + maps/**). Nawigacja z mapy do
kart/haseł wraca do rodzica przez postMessage. Tryb `--inline`
usunięty. Testy 91/91 (strony map wykonywane w shimie wprost).

## 2026-09-02 18:42 — pakiet dwutorowy: pełny jednoplik OFFLINE wraca (uzupełnienie ADR 0027)

Po pytaniu właściciela o wersję offline z dysku: `npm run build` daje
teraz DWA artefakty — `index.html` + `maps/**` (split: serwer/Pages,
220 kB) oraz `mtg-lore-codex.html` (pełny jednoplik inline, ~7 MB) —
**wersja offline otwierana z pliku w Chrome działa w 100%, bez żadnej
degradacji**. ZIP zawiera jednoplik. Test pakietu w artefakt.test.

## 2026-09-02 18:42 — REWOLUCJA artefaktu: mapy jako osobne pliki (ADR 0027) + porządek na „Co nowego"

- **Rozdzielenie artefaktu** (decyzja właściciela — wątek otwarty
  z ROADMAP rozstrzygnięty): HTML niesie kod+treść (**219 kB zamiast
  ~7 MB**), podkłady map leżą w `dist/maps/<plan>/` i są dociągane
  dopiero przy wejściu na mapę (fetch → wektorowy SVG z pełną
  nakładką; na file:// degradacja do <img>). ZIP pakuje całość
  (samowystarczalny); Pages publikuje cały dist/ bez zmian
  w workflow. Tryb awaryjny `--inline` zostaje (testy, mały eksport).
  Statusy ADR 0001/0009 zaktualizowane; +1 test kontraktu splitu.
- **„Co nowego" bez dubli:** nagłówek i lead strony daje renderer —
  usunięte powtórzone H1/opis z pliku treści (dublowały się na
  stronie głównej i na karcie Co nowego).

## 2026-09-02 18:42 — Fabuły dla 1LTR i 2BFZ: karty zaktualizowane o osadzenie

Właściciel dostarczył Fabuły do obu istniejących kart (format v3,
ADR 0026). Zarchiwizowane verbatim w `collection/entries/`;
zaktualizowane sekcje osadzenia:

- **Dunland Crebain:** urwisko na skraju Dunlandu, dwaj Uruk-hai
  Białej Ręki w oczekiwaniu na znak, armia Sarumana formująca się
  w wąwozie, pikujący crebain jako sygnał — Postacie i Byty
  (osadzenie kolekcji), Transpozycja, Na Mapie (scena przy
  płd.-wsch. skraju krainy), Źródła.
- **Coralhelm Guide:** zalany kanion wśród lewitujących skał,
  eskorta balotha tajnym przejściem pod nosem patroli Eldrazi, hełm
  z koralu i muszli (klan kartografów wybrzeża) — Postacie i Byty,
  Mechanika (baloth jako twarz zdolności „nie może zostać
  zablokowane"), Transpozycja, Na Mapie, Źródła (+MTG Wiki „Baloth").
- Test dymny przestrojony u źródła: byty z Fabuły legalne jako
  oznaczone OSADZENIE z cytowaną Fabułą; prompt nadal poza pętlą.

## 2026-09-02 18:42 — decyzja właściciela: Fabuła wraca do dostawy (ADR 0026)

Format dostawy materializacji rozszerzony do: **imgId · nazwa · set ·
plan · Fabuła**. Fabuła to wiążąca kotwica transpozycji — ilustracje
FOT/KON powstają na bazie już transponowanego planu, więc osadzenie
karty w Bazie musi pochodzić z tej samej wizji (sekcje „Transpozycja",
„Na Mapie", „Postacie i Byty" budowane z Fabuły; oznaczenie w Źródłach;
osadzenie ≠ kanon MtG). ADR 0011 częściowo zastąpiony; szkielet karty
zaktualizowany. Dotychczasowe karty (1LTR, 2BFZ) bez rewizji —
właściciel może dosłać Fabułę uzupełniającą.

## 2026-09-02 18:42 — recenzja 7 preview: iglica rysowana ręcznie, asymetryczne strefy ikon, PODRĘCZNIK map T4

- **Living Spire:** iglica rysowana ręcznie (smukła turnia w języku
  glifów) — pomniejszone glify hero to klastry i czytały się jak
  „mikro-góry"; **Teeth of Akoum:** etykieta siada tuż pod stożkami
  dzięki ASYMETRYCZNYM strefom ikon (wulkan/iglica: mały prześwit pod
  podstawą, duży nad sylwetką; kontrakt `data-r`/`data-rg` w nakładce).
- **Nowy podręcznik:** `docs/guides/RYSOWANIE_MAPY_PLANU.md` — pełna
  wiedza z rund recenzji PR-9/PR-10 dla agenta rysującego mapę nowego
  planu od podstaw (zasady ADR 0018–0025, pipeline, bramki jakości,
  QA rastrowe, debug rozstawu, kontrakt nakładki, antywzorce,
  checklista).

## 2026-09-02 18:42 — recenzja 6 preview: warstwowe kolory pisma, bez polan, iglica i wodospad, kaniony Makindi (ADR 0025)

- **Kolory pisma warstwowe:** kontynenty/wyspy CZERŃ, wody GRANAT,
  fragmenty lasów/bagien ZIELEŃ (automat po kotwicy w biomie), reszta
  bordo. **Nakładka witryny przenosi teraz kolory z SVG** — to dlatego
  granatu wcześniej nie było widać (CSS klas nadpisywał fill).
- **Bez polan:** wykluczanie boxów etykiet z rozsiewu wycofane — napisy
  leżą NAD lasem (halo daje czytelność).
- **Living Spire** = najsmuklejszy glif adoptowany g-237 (zamiast
  klastra gór); **Roaring Falls** z klockiem wodospadu (strugi
  + rozbryzg); **Makindi Trenches** z narysowanymi kanionami
  (niskie pasmo) i etykietą przy nich.
- **Drogi bez dubli:** 3 usunięte (korytarze istniejących), nowe:
  Affa–Fort Keff, Graypelt–Prison of Omnath (szlak), Coralhelm–The
  Bulwark; **Bala Ged**: dżungla na zachodzie i północy (pustki
  wypełnione po oględzinach renderu), las Ora Ondar/Khalni Heart
  z kreski na pełny wielokąt.
- Testy 90/90 · map-audit 0 · wiązania 0 · QA rastrowe.

## 2026-09-02 18:42 — recenzja 5 preview: czytelność map (ADR 0024) — koła POI, granatowe wody, trakty, pass geograficzny wszystkich kontynentów

Właściciel przeszedł mapę kontynent po kontynencie. Systemowo (ADR 0024):

- **ikony miast/ruin w kołach z nieprzezroczystym tłem** (nie giną
  w bagnie/lesie); **granatowe etykiety wód** (`#1c3a5e`); **rozsiew
  biomów omija boxy napisów** (tytuły nie toną w puszczy); **glify pasm
  w całości na lądzie** (Skyfang nie włazi na morze); nowy POI
  **`iglica`** (Living Spire — jawny glif hero g-016); **+6 traktów**
  (Akoum ×2, Guul Draz ×2, Murasa, Sejiri); nakładka: kotwiczone
  etykiety omijają też tytuły krain (przeszkody obszarowe).

Geografia (per kontynent): rzeka Vazi wypływa z południowego stoku
pasma (nie przecina gór); Thunder Gap i Kazuul Pass zakotwiczone przy
murze; wulkany Akoum zwarte w masyw **Teeth of Akoum**; Oko Ugina przy
paśmie; **Ior Ruin na brzegu Glasspool** (nie w tafli), Glass Haven
odsunięte; Windblast Gorge wzdłuż wąwozu (obrót); **Umung wzdłuż rzeki
na lądzie**; dwie nowe połacie dżungli Bala Ged; Makindi Trenches poza
lasem; Beyeen pod swoją wyspą; Chill Depths przy brzegu.
Testy 90/90 · map-audit 0 · wiązania 0 · QA rastrowe.

## 2026-09-02 18:42 — recenzja 4 preview: fix nakładki (układ kolizyjny nie startował), falka Halimar wraca, porządki kontynentów

Uwagi właściciela: (a) falka Halimar może zostać (spójność jezior);
(b) „Emeria" nachodziła na „ruiny w niebie"; (c) porządki na pozostałych
kontynentach (labelki bez POI, chaos).

- **(b) Root cause znaleziony — bug nakładki:** cache układu etykiet
  startował z `NaN`, a `Math.abs(k − NaN) > próg` jest zawsze false —
  układ kolizyjny nakładki NIGDY się nie uruchamiał; pary o wspólnej
  kotwicy (Emeria + podtytuł na tym samym hedronie) kładły się jedna
  na drugiej. Po naprawie tytuł idzie POD hedron, podtytuł NAD —
  na każdym zoomie.
- **(a)** falka Halimar przywrócona (spójnie z resztą jezior).
- **(c) Porządki kontynentów** + nowy detektor w walidatorze:
  „etykieta siedzi na cudzym POI" (próg 20 j.). Wyłapał i naprawiono:
  Hanging Swamp na ikonie Nimany → w głąb bagna; Kazuul Pass na ikonie
  Visimal → na zachodni mur; dodatkowo Hagra Swamp w biom bagna,
  Lulea odsunięta znad ściśniętego wybrzeża (etykieta odklejała się
  o ~90 px), Living Spire na wolne wnętrze wschodniej Murasy.
- **Ikony POI nie toną w drzewach:** miasta/ruiny/hedrony dołączone do
  stref zajętych rozsiewu biomów (Prison of Omnath znów widoczny
  w puszczy Ondu).
- Testy 90/90; map-audit 0; walidator wiązań 0; QA rastrowe wszystkich
  kontynentów (Sejiri, Akoum, Bala Ged, Guul Draz, Ondu, Murasa, wyspy).

## 2026-09-02 18:42 — recenzja 3 preview: twarda zasada etykieta↔obiekt, pass wiązań Zendikaru, woda bez obwódek (ADR 0023)

Uwagi właściciela: (1) etykiety przy POI wreszcie idealne ✔; (2) twarda
zasada — nie ma etykiet bez obiektu i POI bez etykiet; (3) obwódki rzek
słabe (język w morzu) — wrócić do jednolitego koloru, przyciemnić wodę;
(4a) falka Halimar do usunięcia; (4b) Emeria nieprzypięta do hedronu.

- **Twarda zasada wiązania (ADR 0023):** każde POI ma etykietę
  (lub należy do nazwanej grupy, jak 3 stożki Teeth of Akoum); każda
  etykieta ma twardy punkt: POI, jezioro albo punkt wewnątrz nazywanego
  obszaru. Egzekwuje ją walidator `sprawdzWiazania` (uwagi przy każdym
  renderze CLI) i test wymuszający **0 naruszeń** w scenach repo.
- **Pass wiązań Zendikaru:** przypięte m.in. Emeria + „ruiny w niebie"
  (hedron), Valakut, Teeth of Akoum, The Bulwark, Explorers Peak,
  Glasspool, Ora Ondar, Khalni Heart, Chill Depths, Riverroot,
  Wolfbriar, Mosscrack, Makindi Trenches (na ląd), Surrakar Caves
  (usunięty błędnie podpięty POI osady). **Nazwane z kanonu:** Sejiri
  Refuge, Jwar Isle Refuge, Graypelt (karty ZEN — cykl refuge), Helix
  of Zof (lista ruin post-Eldrazi). **Usunięte** bezimienne dekoracje
  (3 ruiny, 2 hedrony) — bez kanonicznej nazwy nie ma obiektu.
- **E-geo-3 domknięte (detal Murasy):** Visimal, Tumbled Palace,
  Glint Pass, Thunder Gap, Roaring Falls, Pillar Plains (przeniesione
  do Thunder Gap — Guide > fanmapa); Umung okazał się RZEKĄ Bala Ged
  (nie osadą) — etykieta przy ujściu do Bojuka Bay.
- **Woda:** obwódki rzek wycofane (rzeka znów rozpuszcza się w morzu),
  wypełnienie wody atlasu przyciemnione (#d4e2ee), falka Halimar
  usunięta.
- Testy 90/90; map-audit 0; walidator wiązań 0; QA rastrowe Murasy
  i Bala Ged.

## 2026-09-02 18:42 — recenzja preview PR-10: etykiety wg jednego wzoru (KRYTYCZNE), strefy zajęte biomów, obwódka rzek (ADR 0022)

Uwagi właściciela z preview: (a) góry wreszcie dobre ✔; (b) KRYTYCZNE —
etykiety rozjechane względem obiektów; (c) obwódka rzek; (d) biomy
zakrywają góry (Sejiri pod lodem, Ondu pod puszczą).

- **(b) Etykiety — jeden wzór (ADR 0022):** diagnoza potwierdzona w kodzie —
  nakładka ekranowa Codexu rysuje napisy w stałym rozmiarze, a pozycje
  strojone były w jednostkach mapy (przy zoomie odległość rosła,
  przy oddaleniu napis zakrywał sąsiadów — stąd „Kabira na Agadeem");
  rozstaw w SVG szukał pozycji w 16 kierunkach do 118 px od obiektu.
  Teraz: **kotwica = punkt centralny obiektu → napis zawsze POD,
  konflikt → zawsze NAD** (drabinka pionowa, deterministycznie);
  silnik emituje kotwicę w `data-ax/ay/r`, a nakładka witryny liczy
  z niej pozycję **zależną od zoomu** (odstęp = promień ikony × zoom
  + 3 px — wizualnie „zaraz obok" przy każdym przybliżeniu).
- **(d) Strefy zajęte:** rozsiew lasów/bagien/stepów omija bbox każdego
  glifu góry, stożki wulkanów, jeziora i lód; kolejne biomy omijają
  wcześniejsze. Czapa lodowa Sejiri zmniejszona do zachodu kontynentu —
  pasmo odsłonięte; góry Ondu wolne od puszczy.
- **(c) Obwódka rzek:** wstęgi rzek i dopływów mają obrys w kolorze
  linii wody (ciemniejszy niebieski), jak jeziora i wybrzeża.
- **Naprawa regresji przy okazji:** 4 wulkany sceny (w tym **Valakut**)
  nie renderowały się od zmiany kolejności warstw w PR-9 (render czytał
  `scena.wulkany`, scena trzyma je w `poi`) — wróciły na mapę.
- ADR 0022 (nowy), ADR 0021 → częściowo zastąpiona; testy 89/89
  (+2: wzór rozstawu, strefy zajęte); `map-audit.py` 0 problemów;
  weryfikacja wzrokowa rastrów (Sejiri/Ondu/Tazeem/Agadeem/Valakut).

## 2026-09-02 18:42 — Pętla Jakości (PR-10): ADR 0021 (formalizacja stylu map T4), lore ludów Zendikaru, Prison of Omnath + Ior Ruin na mapie

Sesja bez nowej dostawy → Pętla Jakości v2 (audyt + LORE + pass mapowy):

- **Audyt PR #9** (`docs/audits/AUDYT_2026-09-02-PR9.md`): kod i dane
  poprawne; znalezisko — decyzje właściciela (a)–(g) z recenzji
  prototypu żyły tylko w komentarzach kodu i dzienniku, nie w ADR.
- **ADR 0021** — formalizacja stylu map T4: jedna barwa wody dla
  wszystkich akwenów (zastępuje kolor jeziora z ADR 0020 pkt 3),
  kolory funkcjonalne motywu atlasowego (błękit wody, bordowe
  etykiety — doprecyzowanie ADR 0019), wiążąca kolejność warstw,
  etykiety siadające przy obiektach, szare ikony miast, pasmo jako
  jedna bryła. Statusy ADR 0019/0020 zaktualizowane.
- **Pogłębienie LORE planu Zendikar** (sekcja „Ludy", +2 źródła:
  oficjalny *Plane Shift: Zendikar* i „Gods and Monsters"):
  - **trzy wiary merfolków** (Emeria/nieba, Ula/głębin, Cosi/trickster;
    wybór w dorosłości; pochodzenie bóstw od wspomnienia tytanów
    Eldrazi, trójca korów Kamsa/Mangeni/Talib);
  - **trzy narody elfów** (Tajuru — największy, Murasa, otwartość;
    Joraga — Bala Ged, izolacjonizm; Mul Daya — duchy przodków,
    tatuaże-pnącza, Kazandu);
  - **trzy plemiona goblinów** (Tuktuk — przewodnicy po ruinach;
    Lavastep — Akoum, wiedza geotermalna; Grotag — oswajanie bestii).
  - Nagłówki „Geography" → „Geografia" (oba plany); literówki
    (krajobraz, „even na mapie", „rodzinnym").
- **Pass mapowy (Zendikar T4):**
  - **E-geo-8 rozstrzygnięte:** kanoniczna nazwa **„Prison of Omnath"**
    (MTG Wiki „Ondu"/„Omnath" — mesa w Ondu, krąg wiążący, Ritual of
    Lights, Soul Stair); przemianowanie w scenie, map.json i na
    podkładzie (spelling „Omath" pochodził ze źródła fanowskiego w2).
  - **E-geo-4 (część):** etykieta **Ior Ruin** przy jeziorze Glasspool
    (kotwica istniała; kanon: karta *Ior Ruin Expedition*, ZEN 49).
  - `map-audit.py` — 0 problemów; podkład regenerowany deterministycznie
    (diff SVG: 2 linie).
- **Link-mining:** przy 2 kartach na 2 planach żadna encja nie osiąga
  progu ≥2 kart — bez nowych haseł; kandydaci czekają na dostawy
  (Dunland, Halimar/Coralhelm, merfolkowie).

## 2026-09-02 10:14 — mapa Zendikaru: 7 poprawek z recenzji prototypu (pasma gór, etykiety przy obiektach, szare miasta, jednolita woda, hedrony, morze, kolejność warstw)

Zlecenie właściciela (recenzja prototypu z 2026-09-01) — siedem poprawek
**przed** kolejką E-geo: (a) glify gór łączone w logiczne pasma,
wklejane pojedynczo, podobne wielkości, eliminacja zlewania;
(b) labelka musi SIADAĆ przy badge'u; (c) ikony miast szare jak ruiny,
nie czarne; (d) jeziora dokładnie tym kolorem co rzeki/morza;
(e) przenoszenie POI obejmuje WSZYSTKIE jego ikony; (f) etykieta oceanu
na otwartym morzu + usunięcie wodnej kieszeni; (g) kolejność warstw
WIĄŻĄCA: morza → lądy → rzeki → góry → lasy/bagna/stepy →
miasta/ruiny → labelki na szczycie.

- **Silnik mapforge (a/c/d/g):**
  - (a) `pasmo` rysowane jako JEDNO logiczne pasmo wklejane na mapę
    (wcześniej: osobne, rozrzucone klasterki); minimum 3 glify na
    pasmo (wcześniej krótkie pasma rysowały 1–2 glify); szerokość
    glifu = krok wzdłuż grzbietu ×1.8 (±~10%) → wierzchołki
    zbliżonej wielkości, bazy nachodzą ~50% = ciągły grzbiet
    (język mapome).
  - (c) ikony miast = monolitycznie szare (atlas: #6b6b6b —
    poprzednio czarne, zlewały się z górami); ruiny bez zmian
    (jaśniejsze, z szarym obrysem).
  - (d) JEDEN kolor wody w palecie (pergamin + atlas): rzeki,
    kanały i jeziora (w tym Halimar i Glasspool) = dokładnie kolor
    morza (usunięty odrębny „kolor jeziora"); jeziora z bursztynową
    krawędzią jak akweny; ocean bez niebieskich plam głębi
    (wcześniej podpowiadały „akweny" w środku morza).
  - (g) kolejność warstw odwrócona zgodnie z zleceniem: morza → lądy →
    jeziora → rzeki → góry (pasma) → wulkany → lasy/bagna/stepy →
    miasta/ruiny → labelki na samym szczycie (wcześniej biomy na
    górach).
- **Etykiety (b) — cała mapa:** wszystkie etykiety POI siadają przy
  badge'u (reguła ~<30 px od środka obiektu; strona dobierana tak, by
  labelka krawędzią dotykała obiektu). Wpływa na: Cliffhaven,
  Prison of Omath, Ula Temple, Enclave, Sky Rock, The Bulwark, Morosi,
  Umara, Hadatown, Coralhelm, Emeria, Sea Gate, Goma Fada, Affa,
  Slab/Grip/Ghost Haven, Tal Terig (nowe miasto w kanonie — dodane
  + pinezka), Fort Keff, Ora Ondar, Khalni Heart, Windblast Gorge,
  Glass Haven, Zof Marsh, Umung, The Border Mire, Tangled Vales,
  Surrakar Caves, Bojuka Bog, Guum Wilds, Nimana, Malakir, Lulea,
  Hagra Cistern, Lake Jast, Hanging/Hagra Swamp, Skyfang, Kazuul Pass,
  Blackbloom Lake, Singing City, Living Spire, Kazandu, Wolfbriar,
  Turntimber, Mosscrack, Graypelt, Crypt of Agadeem, Kabira,
  Midnight Pass, Ikifal, Benthidrix, Chill Depths, Wybrzeża Halimar,
  Makindi Trenches, Sunder Bay, Bojuka Bay, Wyspy Jwar, Valakut,
  Beyeen, Agadeem.
- **Geografia (e/f):**
  - (e) hedrony Emeri przeniesione razem z POI (wcześniej dryfowały
    w starym miejscu — w Halimarze i na Halimaru); teraz przy
    „Emeria (ruiny w niebie)".
  - (f) „Morze Zendikaru" — labelka przeniesiona na otwarte morze
    zachodnie (wcześniej dryfowała nad wodną kieszenią Tazeem);
    kieszeń połączona z otwartym morzem (krawędzie Tazeem i Bala Ged
    odsunięte — cieśnina Tazeem→Bala Ged jest teraz wyraźnie cieśniną,
    otwartą na północ i południe); kanał Sea Gate wyprowadza
    morze dalej w ocean (1010,660).
- **Audyt (`map-audit.py`):** reguła „etykieta na lądzie" rozluźniona
  z modelu środka do 9-punktowego modelu dotyku (środki: narożniki +
  środki boków + środek etykiety; tolerancja 2 px) — uzasadnienie:
  właścicielska zasada (b) wymaga labelek SIADAJĄCYCH przy obiekcie,
  czyli częściowo nad wodą (wybrzeże Halimar, porty); etykiety
  oceaniczne w białej liście.
- **Testy:** `test/mapforge.test.js` — uaktualnione testy stylu
  (rzeka = jezioro = morze = jeden kolor; paleta achromatyczna bez
  odrębnego koloru jeziora), cała suita **87/87**; `npm run build`
  OK; `map-audit.py` — **0 problemów** (wszystkie mapy).
- **Następna kolejka:** E-geo-1..9 (kolejność z audytu): archipelag
  między Ondu a Akoum, Tazeem SW (2/7), Murasa, Akoum, BG/GD, Ondu,
  Omath, Hada.

## 2026-09-02 10:14 — geografia mapy Zendikaru: audyt całości + przebudowa Tazeem, cieśnina Akoum/Bala Ged–Guul Draz, drogi-trakty, etykiety bez kresek

Zlecenie właściciela (uzupełnienie PR-9): (a) „labelki niektórych POI są
odsunięte od samych miejsc i rysowana jest linia łącząca — nie lepiej bliżej
dać tą labelkę?"; (b) „drogi rozrzucone losowo, nie prowadzą nigdzie
sensownie — powinny być traktami między największymi miastami/POI";
(c) „geografia jest z dupy — wymaga POWAŻNEGO AUDYTU… solidnie, w jednym
albo kilku podejściach" — doprecyzowane: **audyt CAŁEJ mapy**, nie tylko
Tazeem. Prototyp do oceny wdrożenia wystawiony w sandboxie (port 4173).

- **Audyt całości** (`docs/audits/AUDYT_2026-09-01-geografia-zendikaru.md`):
  podsłuch geometryczny (scena.json + SVG→PNG) vs hierarchia kanon > mapa
  fanowska v2 > warianty 3/4. Trzy problemy systemowe: (1) ludy rysowane
  w sprzeczności z treścią — najgorzej Tazeem (Halimar = step bez wody,
  brak Coralhelm, Sea Gate na płd.-wsch. wybrzeżu zamiast na murze);
  (2) topologia — jeden ląd łączył trzy kontynenty (Akoum+Bala Ged+Guul
  Draz); (3) POI „dekoracyjne" (Bojuka na zachodzie, Malakir na zachodzie,
  Valakut w Akoum zamiast na Beyeen…).
- **Tazeem przebudowany (P0)** — mapa zgodna z treścią planu i kartą
  *Coralhelm Guide*: **Halimar = morze śródlądowe** (nowy tryb `jezioro.d`
  w mapforge — nieregularna tafla), **Sea Gate (900,660) na murze** nad
  kanałem-tamą wyprowadzającym morze w ocean, **Coralhelm (660,505) na
  północnym brzegu** (+ pinezka karty przeniesiona), rzeka Umara do Halimar
  (Magosi Wodospad), druga rzeka = wypływ z płn. brzegu, Oran-Rief = pas
  lasu zachód od morza, Enclave w lesie, Ula Temple na brzegu, The Bulwark
  (pasmo zachód→południe), Emeria + hedron nad taflą (opacity = dryf),
  Sky Rock NW.
- **Cieśnina Akoum / Bala Ged–Guul Draz (P0):** `lad-2` rozdzielony na
  `lad-akoum` + `lad-bala-guul` — cieśnina od gulfu do otwartego oceanu.
  Guul Draz ↔ Bala Ged zostają połączone (w2/w3), odgraniczone The Border
  Mire. Bojuka = najdalszy wschód: „Bojuka Bay" przeniesiona na wsch.
  wybrzeże przy Bojuka Bog.
- **POI (P1):** Goma Fada → zachodni cypl, Affa → centrum kotliny, Malakir
  → wschodnia stolica / Nimana → zachód od Lake Jast (były zamienione
  stronami), Lulea → płd.-wsch., Surrakar → dżungla, Zof Marsh → NW,
  Kabira → wyspa Agadeem, Prison of Omath → centrum kotliny Ondu, Makindi
  Trenches → centrum; nowe: **wysepka Valakut z wulkanem** (Beyeen —
  „Mt. Valakut" usunięta z Akoum), Oko Ugina = pasmo (nie dryfujący
  hedron), Teeth of Akoum (etykieta przy klastrze wulkanów), Tangled
  Vales, Hanging Swamp + Hagra Swamp + Hagra Cistern (nowe jezioro),
  Ula Temple, Enclave, Coralhelm, Kazuul Pass.
- **Drogi = trakty (pkt b):** 5 losowych przerywanych linii → trasy
  między największymi miastami: Hadatown→Sea Gate (Tazeem),
  Goma Fada→Affa→Tal Terig (Akoum), Cliffhaven→Graypelt→Mosscrack (Ondu),
  Singing City→Sunder Bay (Murasa), Malakir→Nimana (Guul Draz).
- **Etykiety przy obiektach, bez kresek (pkt a):** silnik `render.mjs` nie
  rysuje już linii łączących (`zakotwicz`); 16 etykiet z liniami
  przysuniętych do obiektów w scenie.
- **Spójność:** `map.json` — 26 kotwic zsynchronizowanych z nowymi
  pozycjami, 9 nowych (Coralhelm, Ula Temple, Merfolk Enclave, The
  Bulwark, Teeth of Akoum, Tangled Vales, Hagra Cistern, Hanging Swamp,
  Prison of Omath), pinezka *Coralhelm Guide* → Coralhelm, duplikat
  kotwicy Living Spire usunięty; `map-audit.py` — „Hagra Cistern" do
  SPODZEANE_WODY.
- **Reszta (P2) → ROADMAP, kolejka E-geo-1..9** (m.in. archipelag
  Jwar/Beyeen/Agadeem między Ondu a Akoum wg w2, Tazeem na płd.-zachód,
  detale Murasy/Akoum/Guul Draz/Ondu, Omath vs Omnath).
- Weryfikacja: testy 87/87; `map-audit.py` 0; build OK; kontrola wizualna
  PNG (3 korekty pozycji etykiet po przeglądzie).

## 2026-09-02 10:14 — PR-9: mapforge — adopcja glifów gór z mapome + rzeki w kolorze morza (ADR 0020)

- **Góry wyglądają jak na mapie Śródziemia** (decyzja właściciela:
  obecne glify odrzucone — „masakryczne", benchmark = mapome). Zgodnie
  z zaleceniem właściciela („nie ma sensu odkrywać koła na nowo")
  wykonane research GitHubu i **adopcja wektorowych obiektów**
  (ADR 0020, research w `docs/plans/PLAN_2026-09-01-glify-mapaowe-i-rzeki.md`):
  - **Glify gór adoptowane z mapome** (CC-BY-4.0 — github.com/k1tesurfen/
    mapome; to JEST mapa-benchmark w repo): 30 ręcznie rysowanych sylwetek
    klastrów 1–3 szczytów + 3 mega-klastery, wycięte z podkładu
    Śródziemia w repo → `tools/mapforge/glify-mapaome.mjs` (dane, nie
    kod — zero zależności, ADR 0002).
  - `szczyt()`/`pasmo()` rysują wyłącznie glifami adoptowanymi: rozsiew
    wzdłuż grzbietu (rozmiar ważony sinusem, odbicia, jitter), kolejność
    wg dolnej krawędzi — bliższe szczyty na wierzchu (technika z
    researchu). Mega-klastery do jawnego użycia w scenie (`glifId`).
- **Rzeki = kolor morza, bez gradientu i opacity** (decyzja właściciela
  2026-09-01: rzeka „rozmywała się" w morzu, a nie twardo w niego
  wpadała): ujście w morze → kolor morza, ujście w jezioro → kolor
  jeziora, na lądzie → kolor morza. Gradient znany z PR-5 usunięty.
- **Proweniencja (ADR 0013):** atrybucja CC-BY-4.0 w nagłówku każdego
  generowanego SVG + `maps/zendikar/map.json` (pole `zrodlo_glify`) +
  ADR 0020 + README mapforge + SKILL_MAPA_PLANU.
- **Zendikar (T4) i demo-warsztat wyrenderowane na nowo**;
  `map-audit.py` → 0; testy 87/87; build OK (4 strony, 14 modułów).
- **Azgaar/Fantasy-Map-Generator (MIT)** — zapisany kandydat na kolejne
  klocki (E5: cytadela/fort, latarnia, wrak, wodospad, obwódki haseł);
  góry Azgaar nie pasowały do benchmarku (jasne/techniczne), techniki
  rozsiewu wdrożone.

## 2026-09-01 21:38 — PR-5: mapforge — glify „hand-drawn" (las kępa, góra żagiel) + warsztat

- **Przebudowa glifów mapforge** (zgłoszenie właściciela: obiekty
  generowane przez mapforge wyglądają „strasznie generycznie i dziecinnie";
  cel = efekt graficzny jak mapa Śródziemia/mapome):
  - **Las** — korona to zamknięta ścieżka z wypukłych łuków („chmurka"),
    nie `<circle>`: nieregularny obrys (jitter promienia), ciemna masa
    cienia u podstawy, asymetryczny boczny pęd i krótka haczura
    cieniowania. Lasy są **gęste i nakładają się** (`minOdst < średnica
    korony`), więc składają się w falistą, teksturowaną masę — jak Mirkwood.
  - **Góra** — pojedynczy szczyt to asymetryczny „żagiel": lewa krawędź
    wypukła na zewnątrz, prawa wklęsła, cień w ciemniejszej facecie po
    prawej + haczura. `lean` przechyla wierzchołek; `pasmo()` układa
    szczyty ciaśniej z jitterem → naturalna, chwiejna linia grzbietu.
  - Obie formy pozostają **deterministyczne** (rng z hasha id) i
    audytowalne (`data-x/y`, kontur zamknięty, map-audit 0).
- **Zendikar (T4) wyrenderowany na nowo** z przebudowanymi glifami
  (motyw atlas, ADR 0019): Oran-Rief / Ondu / Murasa to gęste kępy,
  Akoum / Skyfang / Sejiri to żagle z cieniem. `map-audit.py` → 0.
- **Demo-warsztat** `maps/_warsztat/podklad*.svg` zaktualizowane
  (katalog klocków na jednym obrazie).
- **Zakres ubogacania map (decyzja właściciela 2026-09-01):** nowe POI
  i wzbogacanie podkładu dotyczą wyłącznie map **T3/T4** (podkłady
  własne — dziś Zendikar); map **T2 (adoptowany podkład Śródziemia/
  mapome) nie ruszamy**. Dopisane do `docs/guides/PETLA_JAKOSCI.md` (krok 4).
- **Audyt = recenzja kodu, nie raport zielone** — doprecyzowane
  w `docs/guides/PETLA_JAKOSCI.md` (krok 1); `AUDYT_2026-09-01-PR7.md`
  zawiera głęboką weryfikację silnika mapforge (glify geometryczne,
  lasy nie-nakładające się, brak jitteru pasma, ciche fallbacki).
- Testy: `npm test` 86/86; `npm run build` OK (4 strony, 14 modułów;
  artefakt ~4,6 MB — koszt świadomy z ADR 0009).

## 2026-09-01 21:38 — PR-5: Pętla Jakości v2 — pogłębienie LORE Śródziemia + domknięcie E4

- **Pogłębienie LORE (krok 2):** plan **Śródziemie** (dotąd niepogłębiany
  w PR-4) dostał nową sekcję **„Ludy"** — na wzór analogicznej sekcji
  w Zendikarze. Opisuje trzy grupy zachodniego Śródziemia: **Dunlendów**
  (Gwathuirim, potomków górali Białych Gór, wypchniętych z Calenardhonu),
  **Rohirrimów** (Eorlingas, od Éothéod/Northmanów, obdarowanych Rohanem
  po Polu Celebrantu) oraz **ludzi i siły Isengardu** (Uruk-hai, Biała
  Ręka, krzyżowanie orków i ludzi). Z cytowaniami (Tolkien Gateway,
  Encyclopedia of Arda).
- **Anty-dublowanie (ADR 0005/0010):** encje (dunland/isengard/Saruman/
  Uruk-hai/Biała Ręka/rohan) **nadal czekają na próg drugiej karty** —
  nie utworzono haseł, nie dodano wikilinków do nieistniejących stron;
  wiedza o nich żyje w treści planu i w `docs/backlog.md`.
- **Pass mapowy (krok 4):** domknięty **E4** planu mapforge — wzorzec
  „nowy plan = scena + render mapforge" spisany w `docs/guides/PROCES_MAP.md`
  (MA1 pkt 5) i `docs/guides/SKILL_MAPA_PLANU.md` §11 (mapforge jako
  domyślny sposób tworzenia map T3/T4); `PLAN_2026-09-01-mapforge.md`
  oznacza E4 jako wykonany. Weryfikacja: `tools/map-audit.py` na obu
  mapach — 0 problemów.
- **Krok 3 (link-mining):** potwierdzony brak nowych haseł — karty są
  z różnych planów, licznik wzmianek od kart (nie planów). Backlog aktualny.
- Testy: `npm test` 86/86; `npm run build` OK (4 strony, 14 modułów).

## 2026-09-01 15:30 — E1+E2 mapforge na Zendikarze + naprawa kotwiczenia etykiet

- **Naprawa etykiet nakładki** (feedback z podglądu): transform inline
  nadpisywał CSS-owe centrowanie — etykiety wisiły lewym-górnym rogiem
  na punkcie (Beyeen, Malakir, Lulea…). Teraz: dziedziczenie
  `text-anchor` z grup SVG + kotwiczenie na baseline w jednym
  transformie; asercja „Beyeen = middle" w testach (84/84).
- **E1:** `maps/zendikar/scena.json` — scena danych wygenerowana
  z ręcznego podkładu (generator: `tools/mapforge/e1-scena-zendikar.py`;
  biomy z otoczek klastrów, grzbiety z PCA, okręgi → łuki).
- **E2:** `maps/zendikar/podklad-forge.svg` — próbny render całego
  Zendikaru silnikiem mapforge w motywie atlas (ADR 0019); podkład
  produkcyjny niezmienny do oceny właściciela.
- **Sprostowanie (po rzucie oka właściciela):** pierwszy render E2
  miał biomy na oceanie — otoczki wypukłe biomów są szersze niż
  kontynenty, a audyt nie oglądał treści mapforge. Naprawa podwójna:
  silnik dostał **maski lądu** (rozsiew drzew/kępek i szczyty pasm
  lądują tylko na lądzie; `parsujD` do parsera ścieżek), a audyt
  nauczył się czytać treść `mf-*` (kotwice `data-x/y` deklarowane
  przez klocki + interpreter komend ścieżek). Wysepki generowane
  jako okręgi na krzywych Beziera. Testy masek i parsera: 86/86.
- **Sprostowanie 2 (kolejny rzut oka):** „linie jak drogi po oceanie"
  to były przygaszone linie grzbietu pasm — klaster gór zlewał Ondu
  z Murasą (grzbiet przez cieśninę), a na Sejiri linia biegła przez
  czapę. Naprawa: pasma liczone **per ląd**, linia grzbietu
  **domyślnie wyłączona**, spękania lodu tylko wewnątrz czapy;
  audyt próbuje punktów rzek i linii wzdłuż ścieżki (≥75% na lądzie).

## 2026-09-01 15:30 — LIVE: mapa Zendikaru rysowana mapforge (T4)

- **Wdrożone (E3):** produkcyjny podkład `maps/zendikar/podklad.svg`
  jest teraz renderem silnika mapforge (motyw atlas, ADR 0018/0019)
  ze sceny danych `scena.json` — 9 lądów, 6 biomów, 5 pasm (per ląd),
  rzeki-wstęgi, 44 POI, 74 etykiety w nakładce ekranowej z LOD.
  Podkład ery ręcznej zarchiwizowany jako `podklad-reczny.svg`;
  `map.json` awansował do **wariantu T4** (ADR 0015: mapa T3 dojrzewa
  do T4 wraz z warsztatem). Edycje mapy od dziś: scena → render (E1
  chroni przed regeneracją z renderu). Audyt: 0 problemów; 86/86.

## 2026-09-01 15:30 — Etykiety mapy o stałym rozmiarze ekranowym (LOD)

- Na stronie mapy planu (podkłady własne T3/T4 — Zendikar; adoptowanych
  T2 nie ruszamy) napisy podkładu zostały przeniesione do nakładki
  ekranowej, jak pinezki: **większa czcionka (13,5–24 px zamiast
  ~6 px efektywnych), halo dla czytelności i stały rozmiar przy
  zoomowaniu** — przybliżanie powiększa mapę, nie napisy. Drobne
  etykiety mają **LOD**: pojawiają się dopiero od przybliżenia, w którym
  stałyby się czytelne (próg liczony z oryginalnego rozmiaru).
- Oryginalne `<text>` w SVG dostają `visibility:hidden` (bez JS
  nakładka pozycjonuje się procentowo — graceful degradation);
  etykiety po łuku (textPath) zostają w podkładzie.
  Testy UI: 83/83.

## 2026-09-01 15:30 — mapforge: wspólny silnik mapowy (warsztat T4)

- **Nowe narzędzie `tools/mapforge/`** (ADR 0018): deterministyczny
  generator podkładów SVG z danych — reużywalne klocki: lasy (rozsiew
  koron), bagna, step, lodowce, pasma górskie (szczyty z cieniem
  i przedgórzem), wulkany, rzeki zwężające się do źródła (wstęgi),
  dopływy, jeziora, szlaki kropkowane i drogi, miasta/ruiny/hedrony,
  etykiety pod dowolnym kątem i po łuku (zatoki), kompas, skala,
  ramka, poświata wybrzeży. Zero zależności; identyczna regeneracja
  (deterministyczne „losowości" z hasha id).
- **Demo-katalog klocków:** `maps/_warsztat/podklad.svg` (Wyspa
  Próbna) — przechodzi audyt mapowy bez zastrzeżeń.
- **Motywy: `pergamin` i `atlas`** — po A/B właściciel wybrał monochro-
  matyczny atlas (ADR 0019), a po renderze czysto czarno-białego
  doprecyzował: **walor tonalny w szarościach** (czarny–szary–biały,
  bez sepii/brązu). Test pilnuje achromatyczności wszystkich
  wypełnień (R=G=B); atlas = domyślny motyw map planów (T4).
- Research (ADR 0018): Azgaar FMG (MIT) to generator losowy — my
  renderujemy kanon; techniki line-artu mapome (kropka 0,9; dyscyplina
  grubości) wcielone w klockach.
- 11 nowych testów silnika (81/81 w pakiecie); plan adopcji:
  `docs/plans/PLAN_2026-09-01-mapforge.md`.

## 2026-09-01 15:30 — Pełna Pętla Jakości (LORE + mapy + metryka)

- **Pogłębienie LORE obu planów:** Śródziemie zyskało akapit o Tharbad
  (miasto-most na Gwathló; przeprawa Boromira w 3018 r. — Tolkien
  Gateway), Zendikar o Murasie wg oficjalnego Planeswalker's Guide
  (wyspa-płaskowyż, cztery wejścia, Na Plateau z Singing City, Kazandu).
- **Sieć wikilinków:** plany odsyłają do swoich kart („Karty kolekcji"),
  karty do planów („Na Mapie") — pierwsze połączenia grafu bazy.
- **Pass mapowy:** kanoniczny przekład wnętrza Murasy (Skyfang od zachodu,
  Na Plateau + Singing City na wschodzie wg Guide, Blackbloom w Kazandu),
  nowe kotwice z cytowaniami (Zendikar: 74, Śródziemie: 11 + Dunland),
  Living Spire domknięty w rejestrze.
- **Nowe narzędzie warsztatu T4:** `tools/map-audit.py` — geometryczna
  weryfikacja map (etykiety/markery/pinezki na lądzie, kolizje etykiet);
  obie mapy przechodzą 0 problemów. Wnioski w `SKILL_MAPA_PLANU.md` §10.
- **Metryka:** plany liczone pragmatycznie także w pinezce; completeness
  **100% (8/8) na wszystkich czterech stronach** (było 76%).

## 2026-09-01 15:30 — FOT/KON w treści karty + poprawki mapy Zendikaru (a–j)

- **Ilustracje FOT/KON rysują się same w treści karty** (wersja
  lokalna): panorama FOT otwiera główną kolumnę, bestiariusz KON
  wchodzi pod pierwszą sekcją. Przyciski torów znikają; druk
  Scryfalla pozostaje w infoboksie. Na Pages (bez katalogu `img/`)
  strona wygląda jak dotychczas — cichy fallback.
- **Mapa Zendikaru — 10 poprawek po zrzutach właściciela + 7 znalezionych
  audytem:** Valakut wrócił na Akoum (kanon: superwulkan kontynentu,
  MTG Wiki — stał błędnie przy Beyeen), wyspa Agadeem przestała
  nachodzić na Ondu, Crypt of Agadeem leży na swojej wyspie, Makindi
  Trenches w morzu (koniec kolizji z Cliffhaven), Singing City
  na Murasie (koniec „ogonka" wybrzeża), rozsunięte Zof Marsh/Guul
  Draz, Fort Keff/Ora Ondar/Kargan Lands, Glasspool opisany jako
  jezioro (kanon) z etykietą obok, Ikiral i Emeria mają markery
  (ruiny/hedrony), legenda powiększona. Pełny audyt:
  `docs/audits/AUDYT_2026-09-01-mapa-zendikar-feedback.md`; pozycje
  i proweniencja zsynchronizowane w `map.json` (70 kotwic).

## 2026-09-01 15:30 — Naprawa GitHub Pages + mapy (badge, warstwa karty) + porządek w Pętli Jakości

- **Strona na Pages zaczęła działać.** Przyczyna trzech nieudanych
  publikacji (od powstania `pages.yml`): strona Pages nie była w ogóle
  włączona dla repozytorium, więc workflow padał na kroku konfiguracji —
  jeszcze zanim cokolwiek zdążył opublikować. Włączona przez właściciela
  (Settings → Pages → Source: „GitHub Actions"); od teraz **każdy push
  do `main` publikuje aktualną wersję bazy automatycznie**.
- **Mapy — badge pinezek ukryte do najechania.** Etykieta pinezki
  karty (nazwa karty przy znaczniku) nie zaśmieca już mapy — pokazuje
  się po najechaniu kursorem (albo fokusem klawiaturowym); tooltip
  pinezki działa jak dotychczas.
- **Mapy — kliknięcie pinezki otwiera kartę na warstwie nad mapą.**
  Wpis katalogowy otwiera się na zmaksymalizowanej warstwie; przycisk
  ✕ w prawym górnym rogu (oraz klik w tło i Esc) zamyka warstwę
  i wraca do mapy **w tym samym stanie przybliżenia** — mapa nie jest
  odmontowywana. Klik z modyfikatorem (Ctrl/Cmd) otwiera kartę
  w nowej karcie przeglądarki, a pinezka pozostaje zwykłym linkiem.
- **Karty Katalogowe bez sekcji „Druk w Kolekcji"** (decyzja
  właściciela): strona karty to wyłącznie lore — dane wydruku (wydanie,
  rzadkość, artysta) pokazuje tylko infoboks, wprost ze snapshotu
  Scryfalla.
- **Nowy format Wpisu Karty (ADR 0016)** — po audycie szablonu
  katalogowego właściciela: każda Karta Katalogowa otwiera się teraz
  **blokiem danych Oracle w treści** (koszt z rozwinięciem, typ
  z tłumaczeniem, statystyki, zdolności, wydanie z numerem), mechanika
  czytana jest w trzech warstwach (odczyt zasadniczy → interpretacja
  fabularna → całość jako opowieść, podtypy jako warstwy), flavor
  odczytywany fraza po frazie z kontekstem postaci cytującej, nazwa
  z pełnym polskim odczytaniem („Crebainy z Dunlandu",
  „Przewodniczka z Koralowego Hełmu"), podsumowanie tezami. Obie
  istniejące karty przebudowane do nowego formatu. Sekcja opisu
  ilustracji **zakazana** (transpozycje FOT/KON bywają zupełnie inne);
  obraz Scryfalla żyje wyłącznie w infoboksie.
- **Pogłębienie lore:** strona planu Zendikar z nową sekcją **Ludy**
  (rasy planu, rody wampirów Guul Draz, korowie-pielgrzymi, Zulaport)
  wg *Planeswalker's Guide to Zendikar*; w źródłach karty 2BFZ zniknął
  wpis „wiedza ogólna bez URL-a" — każdy fakt ma cytat.


## 2026-09-01 09:05 — Mapa Zendikaru: rysowanie szczegółów, czysty podkład + brak pikselozy

- **Elementy fanowskie faktycznie narysowane na podkładzie SVG** (nie
  tylko odnotowane w `map.json`): ~31 nowych symboli/etykiet — Akoum
  (Spike Fields, Grip Haven, Slab Haven, Ghostwatch, Kargan Lands, Ora
  Ondar, Khalni Heart, Glasspool + Ior Ruin), Bala Ged (Guum Wilds,
  Bojuka Bog), Guul Draz (Zof Marsh, Hagra Swamp, Lake Jast, Lulea),
  Murasa (Kazandu, Pillar Plains, Vazi River, Singing City, Visimal,
  Kazul Pass, Roaring Falls, Living Spire, Tumbled Palace), Sejiri
  (Benthidrix), Ondu (Prison of Omath, Cliffhaven, Graypelt, Mosscrack,
  Crypt of Agadeem, Zulaport). Wszystkie umieszczone testem
  point-in-polygon (na lądzie, bez kolizji z istniejącymi markerami).
- **Usunięte zastrzeżenia:** zniknął podpis „Rekonstrukcja układu
  kontynentów...", podtytuł Murasy „(położenie przybliżone)" i przerywana
  linia Murasy (pozycja uzupełniona wg źródła). Mapa pokazuje treść
  bez adnotacji „uwaga! fanowskie!" — zgodnie z decyzją właściciela.
- **Naprawiona pikseloza przy przybliżeniu** (sedno zgłoszenia):
  podkład SVG osadzany teraz **inline** w scenie mapy zamiast jako
  `<img>` z data-URI. `<img>` rasteryzował SVG w rozmiarze layoutu,
  a transform zoomu skalał rozciągniętą bitmapę → pikseloza. Inline
  `<svg>` pozostaje wektorem i przerysowuje się w każdym przybliżeniu
  (bez zwiększania rozmiaru pliku). Podkłady rastrowe (PNG/JPG, np.
  Śródziemie) dalej jako `<img>`.

- **Naprawy kolizji na mapie** (na podstawie zrzutu właściciela):
  - **Tal Terig** przeniesione z wody na ląd (Akoum) — pozycja potwierdzona
    skryptowym testem point-in-polygon;
  - **legenda symboli** przeniesiona na otwarty ocean (nie zasłania już
    wysp Ondu ani „Mt. Valakut" przy Beyeen);
  - okolice **Sea Gate / Sky Rock / pin** rozsunięte (skala i pozycje);
  - **halo pod tekstem** etykiet (`paint-order: stroke`) — napisy czytelne
    nad elementami przyrody;
  - naprawiony uszkodzony kontur Tazeem (brakujący punkt `C`).
  Zostaje rekonstrukcja T3 (ADR 0012): `rekonstrukcja: true`, Murasa
  przerywana, podpis „rekonstrukcja".
- **Decyzja właściciela (b): mapa fanowska jako źródło — wdrożone.** Do
  `map.json` dodane pole `zrodlo_fanmapa` wskazujące na dostarczony przez
  właściciela opis **`maps/zendikar/zrodlo-fanowska.md`** (pełna topografia
  + wirtualny układ współrzędnych). **Zasada właściciela (2026-08-31):**
  kanon (Plane Shift / MTG Wiki) pozostaje podstawą; mapa fanowska **tylko
  rozszerza** wiedzę o pozycje, których oficjalnie nie podano (względne
  położenia osad/regionów w obrębie kontynentów, detale topograficzne),
  i **nie zmienia** pozycji twardo kanonicznych. Do `kotwice` dopisano
  **27 nowych punktów** z opisu fanowskiego (Murasa: Kazandu, Pillar
  Plains, Vazi River, Singing City, Visimal, Kazul Pass, Roaring Falls,
  Living Spire, Tumbled Palace; Guul Draz: Zof Marsh, Hagra Swamp,
  Lake Jast, Lulea; Bala Ged: Guum Wilds, Bojuka Bog; Akoum: Ora Ondar,
  Khalni Heart, Glasspool + Ior Ruin, Spike Fields, Grip Haven, Slab
  Haven, Ghostwatch, Kargan Lands; Sejiri: Benthidrix). Wszystkie
  oznaczone `pozycja_zrodlo: "mapa-fanowska"` i adnotowane jako
  rekonstrukcja (nie kanon); istniejące Murasa/Skyfang/Sunder Bay
  przepięte z `nieustalone-w-kanonie` na `mapa-fanowska`. Pozycje
  zweryfikowane testem point-in-polygon (wszystkie na lądzie, kanon
  niezmieniony).
- **Decyzja właściciela (c): doskonalenie map wektorowych w Pętli
  Jakości.** Dopisany osobny **krok 4b** w
  `docs/guides/PETLA_JAKOSCI.md` (audyt → pozycje ze źródeł →
  wzbogacenie wektora → poprawa kolizji → weryfikacja + dokumentacja)
  i wzmianka w `AGENTS.md` §2 oraz README.
- **Audyt mapy** (`docs/audits/AUDYT_2026-08-31-PR3-mapa-zendikar.md`):
  mapa T3 była „uboga" — same kontynenty z etykietami, brak gór, lasów,
  rzek, miast, bagnisk i ruin.
- **Podkład SVG wzbogacony** o elementy **potwierdzone w źródłach**
  (MTG Wiki / Guide Zendikar / Plane Shift — pole `elementy` w map.json):
  - **Tazeem**: las Oran-Rief, rzeka Umara + wąwóz + wodospad Magosi,
    Merfolk Enclave, Sea Gate + miasto + Lighthouse, Sky Rock, Coralhelm
    (zywa skała nad Halimar), Pasmo Lun Bulwark, Hadatown, ruiny Ysterid.
  - **Akoum**: pasmo wulkaniczne + superwulkan, Oko Ugina, Windblast Gorge,
    Affa, Goma Fada, Tal Terig.
  - **Bala Ged**: dżungla Tangled Vale, rzeka Umung, Bojuka Bay,
    Bordermire, Umungshore, Surrakar Caves.
  - **Guul Draz**: Malakir, Free City of Nimana, Hagra Cistern,
    Hanging Swamp, Pelakka Karst.
  - **Murasa** (przerywana): Góry Skyfang/Shatterskull, Na Plateau,
    rzeka Raimunza, Sunder Bay, jaddi-trees, Murasa Skyclave.
  - **Ondu**: Makindi Trenches, Turntimber, Teetering Peaks, Agadeem +
    Hedron Fields, Kabira, Beyeen/Mount Valakut, Jwar, Serpent's Maw.
  - **Sejiri**: Midnight Pass, Ikiral, wietrzne góry, zmrożony step.
  Dodana **legenda symboli** (góry/wulkan, las, bagno, osada, ruina)
  i podpis źródłowy.
- **`map.json`**: pole `elementy` (każdy element z URL-em źródła),
  rozszerzone `kotwice` (nowe punkty z notką źródła) i zaktualizowana
  notka. **Rekonstrukcja T3 nienaruszona** (`rekonstrukcja: true`,
  Murasa przerywana, podpis kartograficzny); pozycje punktów są
  przybliżone (nie ma oficjalnej mapy — ADR 0012).
- Testy: 70/70; `npm run build` = OK (podkład osadzony, PIN 2BFZ
  na Tazeem/Halimar bez zmian).

## 2026-09-01 09:05 — Pętla Jakości operacyjna + K5 (PR-3)

- **K5 — `tools/wiki-stats.mjs`**: completeness score stron wg wzoru
  z `docs/guides/PETLA_JAKOSCI.md` (sekcje 3 + źródła 2 + wikilinki 1 +
  pinezka 2, max 8). Skrypty `npm run stats` i `npm run stats:json`;
  raport sortuje od najsłabszej strony — obiektywny punkt startu
  pogłębiania. Bez twardych progów (dane referencyjne zbiorą się
  z kolejnymi sesjami).
- **Pogłębianie (krok 2)**: strony planów (najsłabsza warstwa — 38%
  przed zmianą) rozbudowane o geografię i sekcję Źródła:
  - **Śródziemie** — Geografia (Dunland i Dunlendowie, Isengard/Orthanc
    i Przełęcz Calenardhon, Enedwaith, rzeki Isen i Gwathló) + Źródła;
  - **Zendikar** — Geografia (siedem kontynentów, Tazeem: Oran-Rief,
    Halimar, rzeka Umara, Emeria, Sea Gate, Coralhelm Refuge, domy
    ekspedycyjne) + Źródła.
  Skorygowana kompletność: plany 38% → 63%.
- **Link-mining (krok 3)**: przegląd potwierdził — **brak nowych haseł**.
  Żadna encja nie jest jeszcze wspominana przez ≥2 karty (karty z różnych
  planów: Śródziemie i Zendikar); kolejka w `docs/backlog.md` pozostaje
  aktualna.
- **Pass mapowy (krok 4)**: obie karty mają pinezki (region), oba plany
  mają mapy — bez braków.
- **Integralność**: `npm test` = 70/70 (nowy `test/wiki-stats.test.js`),
  `npm run build` = OK. Karty pozostały nietknięte.

## 2026-08-31 20:38 — Pierwsza karta! Mapa Śródziemia + kanon v2 (PR-2, w toku)

- **Mapa Zendikaru — rekonstrukcja T3** (`#/mapa/zendikar`, ADR 0012):
  podkład własny (SVG) z układem kontynentów z kanonu tekstowego,
  wzorowany mapami fanowskimi; Murasa z linią przerywaną („położenie
  przybliżone”). Pinezka 2BFZ — region wybrzeży Halimar; mini-mapa
  w infoboksie karty podłączyła się sama.
- **Ikony many** — notacja typu `{1}{U}` w treści i infoboksie Koszt
  renderuje się jako kolorowe ikony many (biała, niebieska, czarna,
  czerwona, zielona + bezbarwna).
- **Lista kart**: sortowanie alfabetyczne (pl), tagi w tabeli
  oraz filtr nazwy i tagów; usunięty meta-tekst procesowy
  (feedback właściciela z przeglądu tury 5).
- **Materializacja 2BFZ Coralhelm Guide** — druga Karta Katalogowa,
  pierwsza dostarczona chudym formatem (imgId · nazwa · set · plan;
  ADR 0011): snapshot BFZ #74 (Viktor Titov), lore przewodniczki
  z Coralhelm nad Halimar na Tazeem, flavor Jori En z tłumaczeniem.
  Plan **Zendikar** zyskał stronę (siedem kontynentów, Sea Gate,
  Roil); mapa planu — własna rekonstrukcja (patrz wyżej).
- **Materializacja 1LTR Dunland Crebain** — pierwsza Karta Katalogowa
  (10 sekcji): snapshot Scryfalla posiadanego wydruku (borderless,
  David Rapoza), mechanika jako opowieść (Flying + Amass Orcs 2),
  pinezka regionu Dunland na mapie. Posiadany wydruk nie ma flavor
  tekstu — sekcja flavoru opisuje scenę Hollin, którą karta przywołuje.
  Strona karty to w całości kanon (snapshot + lore z cytowaniami):
  byty faktycznie obecne na karcie w „Postaciach i Bytach",
  najważniejsze encje pogrubione w opisie (bez osobnej sekcji wątków —
  wikilinki po progu dwóch kart), opis posiadanego wydruku
  w „Druku w Kolekcji".
- **Mapa Śródziemia z silnikiem v1** (`#/mapa/srodziemie`): podkład
  w pełni wektorowy (projekt *mapome*, k1tesurfen, CC-BY-4.0 — ADR 0009),
  pan/zoom, legenda pewności, deep-link `?pin=`. Pinezki i etykiety
  zachowują stały rozmiar podczas zoomowania.
- **Karta Katalogowa z mini-mapą**: infoboks pokazuje miniaturę mapy
  planu z pinezką — klik przenosi na mapę z wycentrowaną pinezką.
- **Ostre pinezki w każdym zoomie**: pinezki i etykiety przeniesione
  do nakładki ekranowej (pozycjonowane w pikselach, poza skalowaną
  warstwą podkładu) — stały rozmiar bez rozmycia przy przybliżeniu.
  Nagłówek mapy bez danych technicznych (wariant podkładu).
- **Artefakt otwiera się od razu**: `index.html` obok pliku bazy
  przekierowuje na niego — wejście na serwer nie pokazuje listingu
  katalogu.
- **ADR 0010 — hierarchia kanonu v2** (korekta właściciela): kanonem jest
  karta MtG + lore świata docelowego; prompt i narracja kolekcji to
  **kotwica osadzenia**, nie prawda objawiona. Zastępuje hierarchię
  ADR 0003.
- **ADR 0011 — chudy format dostawy** (decyzja właściciela): dostawa
  to jedna linijka — imgId, nazwa, set, plan; reszta ze snapshotu
  Scryfalla. Narracja i prompt wychodzą z pętli i ze strony karty
  (pozostają w archiwum wpisów kolekcji); sekcje „Narracja Koleksji"
  i „Wizualizacja" zastępuje „Druk w Kolekcji".
- **Zasada progu haseł** (korekta właściciela): hasło powstaje dopiero,
  gdy ≥2 karty odwołują się do encji w treści. Cztery hasła utworzone
  przedwcześnie (crebain, dunland, isengard, rohan) **wycofano** —
  wiedza żyje w sekcjach karty, encje w kolejce link-miningu
  (docs/backlog.md).
- Testy: 65 (test dymny mapy i karty z realnej bazy; fixture „pusta
  baza"; statusy ADR „Częściowo zastąpiona"; pilnowanie kanonu karty
  i chudego formatu dostawy).

## 2026-08-31 20:38 — Fundamenty (PR-1)

- Założenie projektu **MTG Lore Codex**: struktura repozytorium, dokumenty
  konstytutywne (AGENTS.md, PRODUCT, ARCHITECTURE, WORKFLOW, ROADMAP,
  LESSONS, SECURITY), rejestr ADR 0001–0008, ENVIRONMENT z empirycznie
  zweryfikowanymi faktami sandboxa.
- Silnik witryny: parser frontmatter, renderer markdown z wikilinkami,
  rejestr stron z walidacją schematów, hash-router, renderery wszystkich
  typów stron (z pustymi stanami), tory obrazów FOT/KON z cichym
  fallbackiem (ADR 0008).
- 62 testy integralności (schemat treści, wikilinki, parość kolekcji,
  pokrycie Scryfall, mapy, rejestr ADR, budżet lektury, artefakt, UI
  smoke z mini-shimem DOM) + fixture'y end-to-end.
- CI (testy + build + artefakt do pobrania) i publikacja na GitHub Pages.
- Baza celowo pusta: pierwsza materializacja — **1LTR Dunland Crebain**
  (dostarczona przez właściciela 2026-08-31) — wchodzi w PR-2 razem z
  mapą Śródziemia T1.
