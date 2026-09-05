# Ravnica — analiza wariantów mapy (MA1, krok 3 PROCES_MAP)

> **AKTUALIZACJA 2026-09-03 (korekta decyzji):** ostatecznym podkładem
> Ravnicy jest **wariant T2+ — wektoryzacja prywatnej fan-made mapy
> właściciela (v3), płótno 6849×5292**, NIE rekonstrukcja mapforge T4
> (1600×1100). T4 był eksperymentem i został odrzucony (zob. `map.json`
> → `silnik`/`kalibracja: v3`, ADR 0031; scenka T4 „bez sceny
> mapforge/T4”). W PR-17 warstwa T4 omyłkowo nadpisała podkład v3 —
> przywrócono (commit FIX 3272372). Herby gildii i lokacje kanoniczne
> doszyto do właściwego v3 jako odtwarzalne warstwy SVG:
> `tools/mapforge/ravnica-v3-herby.py` (`<g id="herby-gildii">`) i
> `tools/mapforge/ravnica-v3-lokacje.py` (`<g id="lokacje-kanoniczne">`).
> Poniższy tekst opisuje pierwotny proces (T4 jako ówczesny wybór) i
> zostaje jako dziennik; czytać go z uwzględnieniem tej zmiany.

Data: 2026-09-02 · decyzja: ~~wariant T4~~ **→ skorygowano do T2+/v3
(patrz notka powyżej).** Pierwotnie: wariant T4 (rekonstrukcja na
warsztacie mapforge).
Kontekst: karta 137GPT Withstand (per Fabuły: „na ravnickim bruku… w gildii Boros").
Właściciel: mapa Ravnicy = „wieloetapowy proces wymagający solidnego researchu";
najpierw źródła reużywalne (T2/T3), a gdy ich nie ma — prace T4 z możliwą
pomocą właściciela przy **transkrypcji map graficznych na opisy tekstowe**.

## MA1 — Kandydaci podkładu

| Tor | Kandydat | Werdykt |
|---|---|---|
| T1 | Oficjalna mapa Dziesiątego Dystryktu z *Guildmasters' Guide to Ravnica* (WotC, D&D 2018, skan) | **ODRZUCONY (licencja)** — rastrowa grafika książkowa WotC, brak wolnej licencji; osadzenie w Codexie łamałoby ADR 0007 §3 |
| T2 | Fanowskie przeróbki/wektoryzacje GGR (r/RavnicaDMs: idealne nakładki precyktów, mapy Inkarnate, wersje 'merged') | **KANDYDAT v3 po decyzji właściciela 2026-09-03 (ADR 0031)** — prywatne źródło fan-made dostarczone przez właściciela może być wektoryzowane jako dokładniejszy podkład; raster źródłowy poza gitem, wynik z proweniencją i QA |
| T3 | Proceduralny/deklaratywny podkład z opisów lore (jak Zendikar w wersji dawniejszej) | wchłonięty przez T4 (warsztat) |
| **T4** | **Rekonstrukcja scena → mapforge na kanonie tekstowym** (MTG Wiki: Tenth District, Precinct One…Six — pobrane 2026-09-02) | **WYBRANY** |

## Co kanon daje twardo (transkrypcja źródeł z 2026-09-02)

> **Stan: spis miał charakter v1.** Od v2 (2026-09-03) źródłem
> pozycyjnym jest transkrypcja właściciela GGR
> (`zrodlo-transkrypcja-ggr.md`) — poniższy spis pozostaje jako
> fundament **merytoryczny** (co istnieje, jak się nazywa, przynależność
> do precyktu), nie jako źródło współrzędnych.

- **Graf sąsiedztw precyktów** (rzetelny, wprost opisany na stronach
  „Precinct N"): P4 graniczy z P1(S)+P3(E)+P5(W)+P6(SW), bez P2;
  P1 z P2(E)+P3(NE)+P4(N)+P6(W), bez P5; P2 tylko z P1+P3;
  P3 z P1+P2+P4; P5 tylko z P4+P6; P6 z P1+P4+P5. → szkielet mapy jest
  KANONEM, nie wyborem artystycznym.
- **Millennial Platform** wisi *dokładnie* na styku P1/P3/P4 (GGR) —
  jedyny w pełni sproporcjonalnie wyznaczalny punkt planu.
- Relacje kierunkowe: Sunhome strzeże N; Nivix dominuje *południową*
  panoramę P4; Bulwark między nimi; Vitu-Ghazi przy N krańcu P3;
  Concordance/Old City na E P3; Beast Haven na W P3; Zonot Seven na W
  krańcu P5; Blistercoils przy N końcu zonotu; New Prahv przy E krawędzi
  P2; Augustin Station na W końcu Griffin Heights (S P2); Orzhova na W
  skraju Tenth District Plaza; Plaza Avenue z placu do Izby.
- Skarrg „technicznie poza murami miasta" → na północy P4 istnieje MUR.
- Transguild Promenade: od rubblebeltowego krańca P4 do południowych
  bram P1. Tin Street: oś handlu przez P6 i P4 (targi).
- Ravnica jest planem-miastem: poza obręb dzielnicy miasto trwa
  (odbite jako „duchy" zabudowy wokół płyty).

## Czego kanon NIE daje (→ oznaczone „kanon-relacyjna" / „otwarte")

- Rozmiarów, proporcji i dokładnych obrysów precyktów (v1 = graf +
  intuicja rysunkowa; **NIKOMU nie udawaj miary** — skala celowo
  wyłączona na płycie).
- Pozycji wewnątrzprecyktowych większości POI (znany kierunek, nie punkt).
- Hydrologii miejskiej (kanały P6), przebiegu Gnat Alley, Guildpact
  Square, Parhelion (mobilna), Beacon Tower (epoka 2019), warstw
  Undercity → lista `otwarte_na_kolejne_przejscia` w map.json.

## Plan etapów

- **v1 (sesja 2026-09-02)**: scena topologiczna + 6 precyktów + 27 POI +
  mur północny + Rubblebelt/Red Wastes + szczelina Deadbridge +
  Zonot Seven + 3 arterie + pinezka karty. Audyty: `map-audit.py` 0,
  `sprawdzWiazania` 0.
- **v2 (wykonane, 2026-09-03)**: właściciel dostarczył **transkrypcję
  oficjalnej mapy GGR** wraz z układem współrzędnych kadru
  (`zrodlo-transkrypcja-ggr.md`). Scena przebudowana na koordynatach
  transkrypcji (transformacja kanoniczna `px = 830 + (X-0.5)·64,
  py = 610 − (Y+1)·64`, plac → (830, 610); współrzędne źródłowe
  utrwalone w budowniczym). Skutki:
  - przesunięcia vs v1: Nivix 184 px w lewo, Sunhome +114 px w dół,
    Zonot Seven +290 px w dół (v1 miał go za wysoko), Millennial Platform
    z trójstyku na południowo-wschodni kraniec północy (raster > wiki-
    tekst „the junction" — notatka w kotwicy map.json);
  - nowe POI z transkrypcji: **Statue of Agrus Kos, Vizkopa Bank,
    Whitestone, Plaza East/West/South, The Great Concourse, Gore House,
    Medori Park** (+3 markery przekrojowe podziemi: **Rix Maadi,
    Korozda & Svogthos, Nightveil & Duskmantle** — poświata południowa,
    konwencja jak na rastrze GGR);
  - Tin Street = granica P4|P5 z kolkiem wokół Blistercoils i marketu;
    Bulwark zostaje w P4 (wiki), Kamen Fortress w P6 (para poniżej);
  - pinezka karty przeniesiona na bruk przy Tin Street Market
    (norm 0.3688, 0.4273) — nadal: Fabuła → „w gildii Boros albo na
    pograniczu", pewność region;
  - audyty po v2: budowniczy 44 pit-asserty 0, `map-audit.py` 0,
    `sprawdzWiazania` 0, Zendikar re-render bajtowo identyczny;
  - **naprawiony bug silnika**: `etykieta()`/`lukEtykieta()` escapują
    teraz XML (`&`, `<`, `>`) — wcześniej etykieta z „&" psuła podkład
    (map-audit wykrywa: „XML niepoprawny"); brak zmiany dla dotychczasowych
    etykiet (Zendikar/Śródziemie bajtowo identyczne).
- **v3+**: wektoryzacja dostarczonej przez właściciela fan-made mapy
  Dziesiątego Dystryktu (ADR 0031) jako dokładniejszego podkładu T2/T2+
  albo matrycy T4; warstwy epokowe (2006 vs 2019: Parhelion I/II,
  Prahv→New Prahv, Beacon Tower); osobny przekrój/podkład Undercity
  (kanały P6, poziomy); konfrontacja z fanowską nakładką precinct-overlay
  jako drugim punktem odniesienia.

## Uwagi procesowe

- Epoka kolekcji: pierwotny blok Ravnica (Guildpact, 2006). Struktura
  precyktów i większość zabytków (New Prahv!) pochodzi z kanonu GGR
  (2018) — płyta zatem odczytuje geograficzny „rezultat trwały", analogia
  do mieszającej epokę mapy Zendikaru; fakt udokumentowany w `zrodlo.notka`
  i scenie (`opis`).
- Orientacja płótna v2 = **N u góry** (konwencja atlasu; róża wiatrów
  z rastra była pochylona — stosujemy naszą). Transformacja transkrypcji
  jest izometryczna (bez obrotu): współrzędne Y<0 idą w dół płótna,
  X>0 w prawo — zachowuje kształty i układ oryginału linia po linii.
- Współrzędne pinezki: Fabuła kotwiczy scenę w terenie Boros
  → Precinct Four, bruk przy Tin Street Market; `pewnosc: region`;
  v2 przeniosła punkcik z (0.4375, 0.3982) na **(0.3688, 0.4273)**.

## Weryfikacja pozycji otwartych (PR-14, 2026-09-03 — pass mapowy, krok 4.3)

Kwerenda kanonu nad `otwarte_na_kolejne_przejscia` (map.json); geometria
v2 NIE ruszona (własność wektoryzacji v3).

1. **Guildpact Square + Pillar of the Paruns** — kanon TWARDY:
   mtg.wiki „Tenth District" (Locations → Plazas): Guildpact Square =
   plac w miejscu podpisania Paktu; The Pillar of the Paruns =
   obelisk w centrum placu z pieczęciami **dziewięciu** gildii
   (w odróżnieniu od Guildmages' Forum, które niesie wszystkie dziesięć).
   Rozbieżność lokalizacji między wiki: fandom „Ravnica" zakotwicza
   Słupa u Forum of Azor (P2), mtg.wiki „Tenth District" — u Chamber
   of the Guildpact (P1); społeczność graczy podaje, że karty nigdy nie
   ukazały Słupa przy Forum of Azor. → **v3: osadzić przy Chamber
   (P1) z notką o rozbieżności** (P1 i tak ma Chamber + plac — to
   naturalna pozycja „miejsca podpisania").
2. **Beacon Tower** — kanon TWARDY, epoka NIE: mtg.fandom „Ravnica"
   (Tenth District → Azorius territory): Griffin Heights, więzienie
   Udzec, budowana twierdza Exner i **Beacon Tower, housing the
   Interplanar Beacon** (P2). W pierwotnym bloku (era karty, 2006)
   latarnia planarna nie potwierdzona → pozostaje poza mapą do
   znalezienia źródła epokowego (kandydat: warstwa epokowa Parhelion).
3. **Gnat Alley** — kanon TWARDY jako fakty, NIE jako geometria:
   mtg.fandom „Ravnica" (Tenth District): „najdłuższa ciągła ulica
   Ravnicy; tunelowa aleja, jedna z najbardziej zaufanych tras Gruul
   przez eleganckie dzielnice"; flavor Gnat Alley Creeper (DIS #63):
   „najdłuższa ulica Ravnicy … jak pasożyt przemyka między szerszymi,
   bezpieczniejszymi traktami". Współrzędne kanon nie daje → geometria
   dopiero w v3, jeśli wektoryzowane źródło ją pokaże.

Wynik: `otwarte_na_kolejne_przejscia` (map.json) odświeżone w tym
rozdziale — trzy pozycje „do dopytania" zamienione na notatki
zweryfikowane z cytowaniem; lista geometrycznie otwartych nie
skurczyła się (żadna z trzech nie daje współrzędnych do v2).

---

## v3 — finalizacja wektoryzacji T2+ (2026-09-03, PR-15)

**Decyzja właściciela (nadrzędna wobec wcześniejszego planu T4):** v3 = **T2+
podkład adoptowany** — czysty, ręcznie wektoryzowany SVG (sylwetka, granice,
arterie, teren, znaczniki, tekst) + `map.json` v3 z przeliczonymi kotwicami
i pinezką, w stylu mapy Śródziemia (T2). Ścieżka **T4/mapforge-render jest
odrzucona**; `scena.json` z odzyskanego WIP została usunięta (scena T4
niespójna z ADR 0023 — 29 uwag — i rzędu 36 MB po renderze).

### Co dostarczyła wektoryzacja (recovered agent, `/home/user/workbench`)

Geometria 1:1 ze źródła (3 warstwy a/b/c, 6849×5292, ADR 0031): sylwetka
miasta (164 pkt), wyspa Millennial Platform (21 pkt), pas Undercity
(215 pkt), ~24 poligony terenu (pierścienie Zonot, heksagony Great
Concourse, strefa szczeliny, ciemny rdzeń Canopy), 4 osie dróg, 7 łańcuchów
granic precyktów, most Benzer'a (52 pkt), 52 etykiety POI + 6 etykiet
PRECINCT, markery (20 kolorowych + 6 ciemnych), pinezka 137gpt (bruk przy
Tin Street, zachodni skraj P4).

### Poprawki finalizacyjne (ta sesja)

1. **Paleta lądu:** sylwetka miasta i wyspa `#f2f2f2` → `#f7f7f7`
   (whitelista lądu `map-audit` = atlasowy jasny szary papier). To usunęło
   66 z 72 problemów audytu (wcześniej audytor widział tylko baner
   `#f7f7f7` jako „ląd" i wszystkie etykiety miasta raportował „w wodzie").
2. **Kolizje etykiet (6 → 0):**
   - `UNDERCITY` x 1250→1115 (odsuwa się od MEDORI PARK)
   - `SKARRG` y 994→940 (odsuwa się od TRANS-GUILD PROMENADE)
   - `THE BLISTERCOILS` y 1942→1976 (odsuwa się od TIN STREET)
   - `ORZHOVA` x 3400→3350→3260, y 2950→2940 (czyści TENTH DISTRICT
     i VIZKOPA BANK)
   - `BENZER'S BRIDGE` y 3965→3980 (odsuwa się od DEADBRIDGE CHASM)
3. **`map.json`:** `wariant` T4→**T2**, `rekonstrukcja` true→**false**,
   usunięte `scena` i opis sygnowany T4; `silnik` opisuje T2+ (bez T4).
4. **Usunięty `scena.json`** (artefakt T4; backup w sandboxie).

### Werdykty kontroli (ta sesja)

- `python3 tools/map-audit.py ravnica` → **0 problemów** (4 notki
  informacyjne: kotwice w wodzie Rix Maadi / Korozda & Svogthos /
  Nightveil & Duskmantle / Mur północny — celowo obiekty wodne/poza sylwetką)
  i **0 problemów** bez `scena.json`.
- `npm test` = **102/102**; `npm run test:all` = **102/102**.
- `npm run build` → zielone; `maps/ravnica.html` = **346 KB**
  (budżet ADR 0007); bez sceny T4 (ryzyko wcześniej zgłaszane: ~36 MB).
- Geometria potwierdzona wizualnie nakładką własnego rasteryzatora (PIL)
  na `c.png` (6× downscale) — sylwetka, precynkty, arterie, teren, markery
  i etykiety pokrywają się ze źródłem.

### Uwagi końcowe

- Źródło rastra pozostaje poza gitem (ADR 0031); `zrodlo-fanowska-wektoryzacja.md`
  i `map.json` niosą pełną proweniencję.
- Literówka źródła „THE BLISTERCOIS" → etykieta SVG „THE BLISTERCOILS",
  kotwica kanoniczna „Blistercoils" (notka w map.json).
- Etykieta źródła „STEFARI LIBRARY" → SVG wg źródła; kotwica kanoniczna v2
  „Ismeri Library" + notka o wariancie pisowni.

## v4 — QA jakości z oglądem obrazów (2026-09-03, PR-17)

Sesja jako pierwsza dysponuje **wizją (vision)** — poprzednie agenty
pracowały bez oglądu obrazów, tylko programistycznie. Złoty standard to
trzy warstwy źródłowe `a/b/c.png` (6849×5292, dostawa właściciela; raster
poza gitem, ADR 0031). Usterki właściciela (1)–(7) zamknięte z bezpośrednim
porównaniem wzrokowym:

1. **Granice dzielnic (usterka 1):** w warstwie `a` ciągła sieć
   przerywanych linii dzieli całość na 6 Precinctów; w podkładzie były
   tylko fragmenty. Odtworzona pełna, połączona sieć (7 odcinków) z
   oglądu `a.png` z siatką współrzędnych; styl `#4a4a4a`, dasharray
   58/46, spójny ze stylem mapy.
2. **Markery i etykiety wg `c.png` (usterki 2–4, 6):** warstwy markerów
   i etykiet przebudowane względem złotego standardu — etykiety POI
   **czarne** (białe tylko na ciemnym pasie Undercity), zawsze **pod**
   markerem ze szczeliną (duże gildie ~90–110 px), nazwy geograficzne
   (ulice, place, Bulwark, Wayport, Benzer's Bridge…) **bez kółek**,
   przylepione do miejsca; ~15 fałszywych markerów usuniętych, brakujące
   dodane (podwójne Blistercoils, czarny Medori), rekolor Skarrg (Gruul:
   zielony dysk + czerwony pierścień) i Nivix (Izzet: granat + czerwień).
3. **Centrum:** mały marker VIZKOPA BANK opuszczony z tekstu ORZHOVA
   (porządek pionowy dysk → ORZHOVA → Vizkopa → Plaza West, jak w źródle).
4. **Konektor Millennial Platform (usterka 5):** długa jasnoszara
   przerywana linia od spodu lewitującej platformy w dół przez cień do
   węzła granic (zastępuje krótki, urwany odcinek przy drodze).
5. **Granice vs etykiety:** P6/P1 przesunięta na wschód (biegnie na
   wschód od KAMEN FORTRESS, nie przez nią — Kamen zostaje w Precinct
   Six); SMELTING QUARTER opuszczona pod górną granicę; usunięta martwa
   bezstylowa ścieżka drogi.
6. **Narzędzie audytu:** model kolizji etykiet zmieniony z AABB na
   **OBB/SAT** (Separating Axis Theorem) — przestaje fałszywie zgłaszać
   długie ukośne etykiety dróg; Ravnica 0, Śródziemie 0, Zendikar
   4→2 (reszta pre-existing, poza zakresem).

**Werdykty:** `map-audit ravnica` = **0 problemów**; `npm test` 102/102;
build zielony (`maps/ravnica.html` ~348 KB). Pełna kontrola wzrokowa
kadrami 1:1 (north/center/p6/south/west) + nakładki granic/markerów na
warstwy źródłowe. Różnica od źródła: markery to nasza prosta konstrukcja
koncentrycznych kół (bez białych emblematów gildii) — świadomy wybór
stylu, nie zgłoszony przez właściciela.
