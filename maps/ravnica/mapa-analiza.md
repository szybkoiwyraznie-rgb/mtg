# Ravnica — analiza wariantów mapy (MA1, krok 3 PROCES_MAP)

Data: 2026-09-02 · decyzja: **wariant T4** (rekonstrukcja na warsztacie mapforge).
Kontekst: karta 137GPT Withstand (per Fabuły: „na ravnickim bruku… w gildii Boros").
Właściciel: mapa Ravnicy = „wieloetapowy proces wymagający solidnego researchu";
najpierw źródła reużywalne (T2/T3), a gdy ich nie ma — prace T4 z możliwą
pomocą właściciela przy **transkrypcji map graficznych na opisy tekstowe**.

## MA1 — Kandydaci podkładu

| Tor | Kandydat | Werdykt |
|---|---|---|
| T1 | Oficjalna mapa Dziesiątego Dystryktu z *Guildmasters' Guide to Ravnica* (WotC, D&D 2018, skan) | **ODRZUCONY (licencja)** — rastrowa grafika książkowa WotC, brak wolnej licencji; osadzenie w Codexie łamałoby ADR 0007 §3 |
| T2 | Fanowskie przeróbki/wektoryzacje GGR (r/RavnicaDMs: idealne nakładki precyktów, mapy Inkarnate, wersje 'merged') | **ODRZUCONY (licencja+proweniencja)** — brak jawnych licencji; część to przeróbki chronionej mapy WotC (wtórnie nielegalne); użyteczne jako *referencja* przy kalibracji v2 |
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
- **v3+**: warstwy epokowe (2006 vs 2019: Parhelion I/II, Prahv→New Prahv,
  Beacon Tower), osobny przekrój/podkład Undercity (kanały P6, poziomy),
  confrontacja z fanowską nakładką precinct-overlay (Reddit) jako drugi
  punkt odniesienia — również wyłącznie jako opis tekstowy.

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
