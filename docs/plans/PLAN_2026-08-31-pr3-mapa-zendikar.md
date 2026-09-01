# Plan zadania — PR-3 (c.d.): Audyt i wzbogacenie mapy wektorowej Zendikaru

- **Sesja:** 2026-08-31
- **Gałąź:** `arena/01a0591f-mtg` → `main` (ta sama sesja/PR #6)
- **Zlecenie właściciela:** „Proponuję teraz zadanie audytu mapy wektorowej
  Zendikaru i dodania nowych elementów — potwierdzonych w dostępnych
  źródłach punktów geograficznych, elementów typu góry, lasy, rzeki,
  miasta i inne. Na razie mapa wygląda biednie. Chciałbym to w tym
  zadaniu zmienić."
- **Charakter:** pass mapowy (Pętla Jakości, krok 4) — pogłębienie bazy
  o treść mapy planu (nie nowa karta, nie nowe hasło).

## Stan startowy

- Mapa `maps/zendikar/podklad.svg` = ręcznie kodowany SVG T3 (ADR 0012):
  7 kontynentów, Halimar, tama Sea Gate, Emeria, Oko Ugina, Malakir,
  wyspy Ondu, Murasa (przerywana). **Bogata? Nie** — same kontynenty
  z etykietami; brak gór, lasów, rzek, miast (poza Malakirem i Sea Gate),
  brak ruin/Skyclave. Pasuje do słowa właściciela „biednie".
- `test/mapy.test.js` pilnuje: map.json (struktura MA2), pinezki (istniejące
  karty, 0–1, pewność, uzasadnienie przy przybliżonej), regiony (istniejące
  hasła — dziś puste), zgodność frontmatter ↔ map.json. To się nie zmieni.
- Silnik (`render-map.js`) renderuje podkład jako statyczny `<img>` (SVG
  base64) + interaktywne pinezki/regiony z map.json. **Wzbogacenie
  wizualne idzie do podkładu SVG; pinezki zostają w map.json.**

## Decyzje (w ramach ADR 0012)

1. **Rekonstrukcja pozostaje T3**, `rekonstrukcja: true`, podpis
   „rekonstrukcja wg kanonu tekstowego" i przerywana Murasa — bez zmian.
2. Nowe elementy dodaję **jako wektor w podkładzie SVG** (góry, lasy,
   rzeki, miasta, ruiny/Skyclave, wodospady, bagna) w stylu pergaminu
   palety Codexu — nie generowane grafiki (ADR 0008), tylko ręcznie
   kodowany wektor (jak istniejący podkład).
3. **Położenia punktów są przybliżone/niekanoniczne** (nie ma oficjalnej
   mapy — ADR 0012): lokalizacje wynikają z opisów tekstowych
   (kontynent + sąsiedztwo), więc etykiety noszą umiar, a `kotwice`
   dokumentują źródło. To jest zadeklarowane w notce.
4. **Źródła potwierdzające elementy** zapisuję w `map.json` (nowe pole
   `elementy`: nazwa, typ, kontynent, URL → MTG Wiki / Planeswalker's
   Guide / Plane Shift). Pinezka 2BFZ (region Halimar) bez zmian.

## Elementy (potwierdzone w źródłach)

- **Tazeem** (merfolk): Oran-Rief (las), rzeka Umara + Wąwóz Umara +
  wodospad Magosi, Merfolk Enclave (wyspa na Umara), Sea Gate + miasto
  i **Lighthouse**, Sky Rock (hedron), Coralhelm (zywa skała nad Halimar),
  Pasmo Lun Bulwark, Hadatown.
- **Akoum** (wulkaniczny): pasmo górskie + superwulkan, Oko Ugina (mam),
  Windblast Gorge, Affa, Goma Fada, Tal Terig, Akoum Skyclave.
- **Bala Ged** (dżungla/bagna): rzeka Umung, Bojuka Bay, Bordermire,
  Tangled Vale, Umungshore, Surrakar Caves.
- **Guul Draz** (bagna): Malakir (mam), Hagra Cistern, Pelakka Karst,
  Hanging Swamp, Free City of Nimana.
- **Murasa** (płaskowyż): Góry Skyfang/Shatterskull, Na Plateau,
  Sunder Bay, Kazandu, rzeka Raimunza, jaddi-trees, Murasa Skyclave.
- **Ondu** (pionowy): Makindi Trenches, Turntimber (las), Teetering Peaks,
  Agadeem + Hedron Fields, Kabira, Beyeen/Mount Valakut, Jwar, Serpent's Maw.
- **Sejiri** (arktyczny): Midnight Pass, Ikiral, wietrzne góry, zmrożony
  step i klify.

## Kroki (inkrementalne commity, każdy zielony)

1. **Audyt** → `docs/audits/AUDYT_2026-08-31-PR3-mapa-zendikar.md` (stan
   startowy mapy, co jest, czego brak, zgodność z ADR 0012/0007).
2. **Podkład SVG** — przebudowa `maps/zendikar/podklad.svg`: defs symboli
   (góry, wulkan, drzewo, bagno, miasto, ruina, hedron) + 7 grup
   kontynentalnych z elementami + legenda symboli + rozbudowane etykiety.
   `npm run build` + `npm test` zielone; otwór mapy niepusty.
3. **map.json** — pole `elementy` (potwierdzone źródła), rozszerzone
   `kotwice` (nowe punkty z notką źródła), aktualizacja `zrodlo.notka`.
   Testy map zielone (map.json nadal zgodny z MA2).
4. **Dokumentacja** — `content/co-nowego.md`, `docs/PROJECT_HISTORY.md`,
   `docs/setup/HANDOFF_...`. Commit + push.
5. **Opis PR #6** — kumulatywnie.

## Kryteria gotowości

1. Podkład SVG wzbogacony o elementy potwierdzone w źródłach; legenda.
2. `npm test` + `npm run build` zielone; `npm run stats` działa.
3. `map.json` z `elementy` + `kotwice`; rekonstrukcja T3 nienaruszona.
4. Dokumentacja (co-nowego, historia, handoff) zaktualizowana; push.

## Dodatkowa decyzja właściciela (2026-08-31, tura napraw)

- **(b) Mapa fanowska jako źródło:** właściciel włącza najlepszą mapę
  fanowską jako źródło dla pozycji elementów **nieustalonych w kanonie**
  (ADR 0012: Murasa i okolice). W `map.json` dodane pole
  `zrodlo_fanmapa` + flaga `pozycja_zrodlo` na `kotwice` pozycji
  nieustalonych. **Wdrożone:** właściciel dostarczył opis i obrazki
  (zapisane jako `maps/zendikar/zrodlo-fanowska.md`, 2026-08-31).
  **Zasada właściciela:** kanon (Plane Shift / MTG Wiki) pozostaje
  podstawą; mapa fanowska **tylko rozszerza** pozycje niepodane
  oficjalnie (względne położenia osad/regionów w obrębie kontynentów,
  detale topograficzne) i **nie zmienia** pozycji twardo kanonicznych.
  Do `kotwice` dopisano 27 punktów z opisu (Murasa, Guul Draz, Bala Ged,
  Akoum, Sejiri), wszystkie `pozycja_zrodlo: "mapa-fanowska"` i
  adnotowane jako rekonstrukcja (nie kanon); istniejące Murasa / Skyfang
  / Sunder Bay przepięte z `nieustalone-w-kanonie` na `mapa-fanowska`.
  Pozycje zweryfikowane testem point-in-polygon (wszystkie na lądzie,
  kanon niezmieniony).
- **(c) Krok 4b w Pętli Jakości:** doskonalenie map wektorowych
  tworzonych z danych tekstowych zostało dopisane jako osobny krok
  w `docs/guides/PETLA_JAKOSCI.md` (procedura: audyt → pozycje ze
  źródeł → wzbogacenie wektora → poprawa kolizji → weryfikacja +
  dokumentacja) i wzmiankowane w `AGENTS.md` §2 oraz README.
