# Co nowego

Dziennik zmian bazy — po jednym wpisie na sesję (Pętla Jakości, krok 5,
ADR 0006). Najnowsze na górze.

## 2026-09-01 — Pełna Pętla Jakości (LORE + mapy + metryka)

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

## 2026-09-01 — FOT/KON w treści karty + poprawki mapy Zendikaru (a–j)

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

## 2026-09-01 — Naprawa GitHub Pages + mapy (badge, warstwa karty) + porządek w Pętli Jakości

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


## 2026-08-31 — Mapa Zendikaru: rysowanie szczegółów, czysty podkład + brak pikselozy

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

## 2026-08-31 — Pętla Jakości operacyjna + K5 (PR-3)

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

## 2026-08-31 — Pierwsza karta! Mapa Śródziemia + kanon v2 (PR-2, w toku)

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

## 2026-08-31 — Fundamenty (PR-1)

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
