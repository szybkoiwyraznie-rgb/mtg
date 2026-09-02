# HANDOFF 2026-09-01 — audyt + przebudowa geografii CAŁEJ mapy Zendikaru (uzupełnienie PR-9)

> Handoff = skrót JEDNEJ sesji. Zasady trwałe żyją w AGENTS.md, ADR-ach
> i ENVIRONMENT.md — w razie rozbieżności wygrywa repozytorium.

## Stan projektu (stan na 2026-09-02, wieczór)

- **PR #9** (`arena/01a05e7c-mtg` → `main`) otwarty, do oceny/w scalenia
  przez właściciela — zawiera tera PR-9 (glify/rzeki, ADR 0020) + tę
  sesję (audyt i przebudowa geografii E1) + poprawki (a)–(g) z
  recenzji prototypu.
- `node tools/run-tests.mjs` = **87/87**; `npm run build` OK (4 strony,
  14 modułów, artefakt ~5.81 MB); `python3 tools/map-audit.py` —
  **0 problemów** (wszystkie mapy).
- **Prototyp do oceny wdrożenia:** serwer statyczny na porcie **4173**
  (host 0.0.0.0, katalog `dist/`) — wystawiony w sandboxie dla
  właściciela. Po re-klonie: `cd /home/user/mtg && npm run build` →
  `python3 -m http.server 4173 --bind 0.0.0.0 --directory dist`
  (dla podglądu). Strona główna to 329 B przekierowanie na
  `mtg-lore-codex.html`; podkład mapy osadzony w artefakcie jako
  base64 data-URI (ADR 0009).
- Wizualna kontrola: render całości `maps/zendikar/podklad.svg` →
  PNG (sharp, `/home/user/tmp` — poza repo, wzorzec: `full.mjs` =
  1 render całości ~56 s + `slice.mjs` = wycinki z PNG; NIE 7×
  osobne rendery SVG — timeout).
- **Następna kolejka:** E-geo-1..9 (archipelag, Tazeem SW 2/7,
  Murasa, Akoum, BG/GD, Ondu, Omath, Hada) — PO poprawkach (a)–(g),
  które są już wdrożone i zweryfikowane.

## Co zrobiono w tej sesji (commity na gałęzi)

1. **Prototyp** — wystawiony (port 4173) przed audytem, do oceny
   wdrożenia przez właściciela.
2. **PLAN** — `docs/plans/PLAN_2026-09-01-audyt-geografii-i-drogi.md`
   (metodologia: podsłuch geometryczny + porównanie z hierarchią
   kanon > v2 > w3/4; zakres = CAŁA mapa).
3. **AUDYT** — `docs/audits/AUDYT_2026-09-01-geografia-zendikaru.md`
   (werdykty P0/P1/P2 per kontynent + kolejka E-geo-1..9).
4. **Silnik mapforge:**
   - `render.mjs` — USUNIĘTY blok kresek `zakotwicz` (pkt a): etykiety
     nie są już łączone liniami z obiektami; `przyDo` zostaje tylko
     kotwicą rozstawu w `rozstawEtykiety`.
   - `bloki.mjs` — `jezioro()` zyskał tryb `d` (nieregularna tafla;
     fale opcjonalnie z podanych cx/cy/rx/ry) — do Halimar.
5. **Geografia E1** (`maps/zendikar/scena.json` + `podklad.svg`):
   - **Tazeem (P0):** Halimar = morze śródlądowe (akwen `d`, środek
     wyspy); Sea Gate (900,660) na wsch. brzegu + kanał-tama
     (`rzeka-kanal-seagate`, ujście w ocean); Coralhelm (660,505) płn.
     brzeg; Oran-Rief = pas lasu (420–590, 450–720); Enclave (505,560);
     Ula Temple (570,640); The Bulwark (pasmo-3 → łuk zachód→południe);
     Emeria (745,466) + hedron nad taflą (opacity 0.75); Sky Rock
     (450,420); Umara (500,455)→(620,562) do Halimar + Magosi; druga
     rzeka = wypływ z płn. brzegu Halimar (640,538)→(570,370);
     tytuł (640,420); step halimar usunięty.
   - **Topologia (P0):** `lad-2` (Akoum+Bala Ged+Guul Draz) →
     `lad-akoum` + `lad-bala-guul`; cieśnina między nimi (od gulfu
     do oceanu wsch.). Guul Draz ↔ Bala Ged POŁĄCZONE (w2/w3),
     odgraniczenie = The Border Mire + granica biomów.
   - **POI:** Goma Fada (1395,440), Affa (1560,505), Malakir
     (1505,1235), Nimana (1345,1248), Lulea (1480,1320), Surrakar
     (1560,825), Zof Marsh (1230,1090), Kabira (195,1330, wyspa
     Agadeem), Prison of Omath (555,1130); nowe: wysepka `wyspa-valakut`
     + wulkan (215,1130), Oko Ugina = pasmo (1590–1626, 538–540),
     Hagra Cistern (jezioro 1240,1240), Teeth of Akoum/Tangled Vales/
     Hanging Swamp (etykiety), Kazuul Pass (etykieta); usunięte:
     „Mt. Valakut" (etykieta + wulkan w Akoum), hedron Oko Ugina,
     duplikat ruiny Surrakar (1240,790), ruina (680,720) w nowym
     akwenie.
   - **Drogi (pkt b):** Hadatown→Sea Gate; Goma Fada→Affa→Tal Terig;
     Cliffhaven→Graypelt→Mosscrack; Singing City→Sunder Bay;
     Malakir→Nimana.
   - **Etykiety (pkt a):** 16 etykiet z `przyDo` (kresek) przysuniętych
     do obiektów; nowe etykiety: Coralhelm, Enclave, Ula Temple,
     The Bulwark, Teeth of Akoum, Tangled Vales, Hagra Swamp/Cistern,
     Hanging Swamp, Kazuul Pass, Valakut, „Morze Zendikaru" (1050,750).
6. **map.json:** 26 kotwic zsynchronizowanych, 9 nowych (Coralhelm,
   Ula Temple, Merfolk Enclave, The Bulwark, Teeth of Akoum, Tangled
   Vales, Hagra Cistern, Hanging Swamp, Prison of Omath), pinezka
   `2bfz-coralhelm-guide` → (0.33, 0.3607) = Coralhelm, duplikat
   kotwicy Living Spire usunięty (został (0.534, 0.9186) — zgodny ze
   sceną).
7. **map-audit.py:** „Hagra Cistern" do `SPODZEANE_WODY`.
8. **Dokumentacja:** ROADMAP (E-geo-1..9), co-nowego,
   PROJECT_HISTORY, ten handoff.

### Kontynuacja 2026-09-02 — poprawki (a)–(g) z recenzji prototypu

Zlecenie właściciela (recenzja prototypu): (a) pasma gór — glify
łączone w logiczne pasma wklejane pojedynczo, podobne wielkości,
bez zlewania; (b) labelka SIADA przy badge'u (24–28 px = „za
daleko"); (c) ikony miast szare jak ruiny, nie czarne; (d) jeziora
= ten sam kolor co rzeki/morza; (e) przenoszenie POI = WSZYSTKIE
jego ikony; (f) etykieta oceanu na otwartym morzu + usunięcie wodnej
kieszeni; (g) kolejność warstw WIĄŻĄCA: morza → lądy → rzeki → góry
→ lasy/bagna/stepy → miasta/ruiny → labelki na szczycie.

9. **Silnik (a/c/d/g):** `render.mjs` + `bloki.mjs`:
   - (a) `pasmo` = JEDNO logiczne pasmo wklejane na mapę (glify
     wzdłuż wygładzonego grzbietu); minimum 3 glify **hardkodowane**
     w `pasmo()`; szerokość glifu = krok ×1.8 (±~10%) → zbliżone
     wielkości, bazy nachodzą ~50% = ciągła formacja (język
     mapome); bez pogórza i rozrzutu pionowego.
   - (c) `miasto()` — monolityczny szary fill `PAL.skalaCien`
     (atlas: #6b6b6b; przedtem `PAL.tekst` = czarny); `ruina()`
     bez zmian (jaśniejsza).
   - (d) `wodaGleb` usunięty z palet; `rzeka()`/`jezioro()` =
     `PAL.woda` jak morze; parametr `ujscie` usunięty z
     `rzeka()`/`doplyw()`; `ocean()` — bez plam głębi.
   - (g) kolejność warstw: ocean → wybrzeża → ląd → JEZIORA → RZEKI
     → PASMA → WULKANY → BIOMY (NAD górami) → drogi → MIASTA/RUINY
     → ETYKIETY (wcześniej biomy na górach).
   - Testy `test/mapforge.test.js`: uaktualnione testy stylu
     (rzeka/jezioro = kolor morza; paleta bez odrębnego koloru
     jeziora) → 87/87 całość.
10. **Audyt (b):** `tools/map-audit.py` — check etykiet `na_ladzie`
    (model środka) → **9-punktowy model dotyku** (narożniki + środki
    boków + środek bboxa, tolerancja 2 px) — reguła (b) wymaga
    labelek dotykających obiektu (część nad wodą); etykiety
    oceaniczne w białej liście (Morze Zendikaru, Makindi Trenches,
    Sunder Bay, Bojuka Bay, Wybrzeża Halimar, Chill Depths).
11. **Scena (b/e/f):** `scena.json` — 44× x/y etykiet + 29 `przyDo`
    (kotwice rozstawu); **hedrony Emeri (748,508)** przy labelce
    (wcześniej dryfowały w starym miejscu); **kanał Sea Gate →
    (1010,660)**; krawędzie Tazeem i Bala Ged odsunięte — cieśnina
    Tazeem→BG teraz wyraźnie cieśnina (otwarta p/n, ~100–110 px);
    „Morze Zendikaru" (190,720) na otwartym morzu zachodnim;
    **Tal Terig** — nowe miasto (1440,560, skala 0.85) + pinezka
    map.json (0.72,0.4). Transformacja skryptem z assertami
    (pojedyncze wystąpienia) + JSON.parse; backup pre:
    `/home/user/tmp/scena.bak.json` (po re-klonie = utracony).
    Weryfikacja wizualna: full.png + wycinki c1..c7 (Morze west,
    cieśnina, Tazeem, Akoum, Ondu, Agadeem, Guul Draz) — wszystkie
    kadry OK.
12. **Build + podgląd:** dist zregenerowany (base64 podkładu
    zawiera nową krawędź M 1090,790, hedron data-x=748); 4173
    świeże.

## Decyzje i konwencje (trwałe)

- **Hierarchia źródeł geografii:** kanon tekstowy (treść planu, karty)
  > mapa fanowska v2 (`maps/zendikar/zrodlo-fanowska.md`) > warianty
  3/4 (`zrodlo-fanowska-warianty-3-4.md`). W3/4 tylko dla POI
  nieustalonych w kanonie/v2. (ADR 0010/0013.)
- **Etykiety POI SIADAJĄ PRZY obiekcie** — silnik NIE rysuje kresek
  łączących (decyzja właściciela 2026-09-01, pkt a) i **24–28 px
  odległości to „za daleko"** (2026-09-02, pkt b): labelka ma
  krawędzią dotykać obiektu (odstęp ~0–10 px od krawędzi glifu).
  Audyt: 9-punktowy model dotyku lądu (nie środek etykiety).
- **Pasma gór** (2026-09-02, pkt a): jedno pasmo = JEDNO logiczne
  pasmo wklejone na mapę (nie stacking klasterków); minimum 3 glify
  (hardkodowane w `pasmo()`); wierzchołki zbliżonej wielkości
  (szerokość = krok ×1.8 ±~10%), bazy nachodzą ~50% = ciągły grzbiet.
- **Kolorystyka ikon** (2026-09-02, pkt c): miasta = monolitycznie
  szare `PAL.skalaCien` (atlas: #6b6b6b; NIE czarne — zlewały się
  z górami); ruiny jaśniejsze (fill + szary obrys).
- **Woda = jeden kolor** (2026-09-02, pkt d): morza, jeziora, rzeki
  i kanały = `PAL.woda` (odrębny `wodaGleb` usunięty z palet; brak
  opacity na rzekach); `ocean()` bez plam głębi.
- **Kolejność warstw WIĄŻĄCA** (2026-09-02, pkt g): morza → lądy →
  rzeki → góry (pasma) → wulkany → lasy/bagna/stepy → miasta/ruiny →
  labelki na samym szczycie.
- **Przenoszenie POI obejmuje WSZYSTKIE jego ikony** (2026-09-02,
  pkt e) — np. Emeria = labelka + hedrony (wsc. 3); audyt: hedrony
  z opacity 0.75 (dryf) są ignorowane przez check lądu, więc
  ich pozycję weryfikować PNG-em, nie audytem.
- **Etykieta oceanu na otwartym morzu** (2026-09-02, pkt f) —
  biała lista w audycie; etykieta nazwy oceanu NIE może leżeć nad
  wodną kieszenią/zatoką.
- **Drogi = trakty** między największymi miastami/POI kontynentu —
  nie losowe przerywane linie (pkt b).
- **Guul Draz ↔ Bala Ged** mogą być połączone (w2: „dwa połączone
  subkontynenty") — odgraniczanie etykietą/biomem, nie cięciem lądu.
  **Akoum** = osobny kontynent (kanon).
- Kontinenty (px, mapa 2000×1400): Sejiri = lad-1 (460–1240, 55–245);
  Akoum = lad-akoum (1355–1918, 175–650); Bala Ged+Guul Draz =
  lad-bala-guul (1080–1850, 655–1352); Tazeem = lad-3 (340–960,
  350–880); Ondu = lad-4 (225–780, 950–1320); Agadeem = lad-5
  (112–240, 1258–1367); Murasa = lad-6 (858–1108, 1094–1340);
  wyspy Jwar/Beyeen/Valakut = wyspa-7/8/9 + wyspa-valakut
  (90–240, 995–1215).

## Pułapki / do uwzględnienia

- **`/home/user/tmp` znika po re-klonie workspace** — sharp (do PNG z
  SVG) instalować tam na nowo: `cd /home/user/tmp && npm init -y &&
  npm install sharp`.
- **Prawdziwy schemat `scena.json`:** lądy `{id, d}`; biomy
  `{id, typ, punkty[]}` (poligony); pasma `{punkty, opcje.szer}`;
  rzeki `{punkty, opcje{s0,s1}}` (ujście = ostatni punkt, kolor
  akwenu — ADR 0020); jeziora `{cx,cy,rx,ry}` LUB `{d, cx?,cy?,rx?,ry?}`
  (tryb `d` — Halimar); poi `{typ, x, y, opcje.skala}` **bez id**;
  etykiety `{tekst, x, y, opcje{fs,kotwica,ital,duze,przyDo?}}`;
  drogi `{id, punkty, opcje.typ: droga|szlak}`. Kotwice `map.json` =
  **współrzędne normalizowane** (x/2000, y/1400)!
- **Liczby w `scena.json` mają format `1234.0`** (z kropką) — NIE
  re-serializować pliku jako całości (zmieni format i spuchnie diff);
  edycje = celowane string-replace z assertem na 1 wystąpienie.
  UWAGA: transformacja 2026-09-02 napisała część współrzędnych jako
  int bez `.0` — przy kolejnych replace'ach dopasować się do
  faktycznego formatu fragmentu (`grep`), nie zakładać. Wzorzec
  transformacji (assert + JSON.parse + backup) =
  `/home/user/tmp/transform-scena.mjs` (utarty po re-klonie — podejść
  z nowym skryptem, nie ponownie).
- **Etykietnik może dociskać etykiety na ~1 px** — gdy dwie bazowe
  pozycje są blisko (wzorzec: Glasspool/Glass Haven w Akoum),
  rozstaw „naprawia" do minimalnego odstępu boxów; wygląda jak
  nakładka. Po zmianach rozstawu sprawdzić PNG w zagęszczonych
  rejonach i rozdzielić bazy świadomie.
- **Weryfikacja wizualna: render 1× do PNG, potem wycinki** —
  `full.mjs` (sharp, całość 4167×2917, ~56 s) + `slice.mjs`
  (wycinki z PNG <1 s). 7× osobne rendery SVG = timeout (120 s
  każdy). `/home/user/tmp/full.png` = źródło prawdy wizualnej.
- **Base64 data-URI w buildzie nie da się grepować wprost
  fragmentem** (alignment) — weryfikować: wyciągnąć data-URI z
  HTML, zdekodować, grepować dekodowany SVG (node + regex
  `data:image/svg\+xml;base64,`).
- **Topologię zatok/cieśnin weryfikować testem punkt-w-polygon**
  (geom.mjs: `parsujD` + `pit`), a nie „na oko" z listy punktów —
  w tej sesji pierwotny odczyt „zatoki Bojuka" (gdzie leży woda)
  był błędny; ASCII-siatka 25px rozwiązała.
- **Test MA4** (`test/ui-smoke.test.js`) wymaga frazy **„wybrzeży
  Halimar"** w uzasadnieniu pinezki Coralhelm Guide — edytując
  `pinezki` w map.json zachować tę frazę.
- Regeneracja podkładu: `node tools/mapforge/cli.mjs
  maps/zendikar/scena.json -o maps/zendikar/podklad.svg`; potem
  `python3 tools/map-audit.py` + `node tools/run-tests.mjs` + build.
- Etykietnik (`rozstawEtykiety`) może PRZENIEŚĆ etykietę od bazowej
  pozycji — po zmianach sprawdzić PNG (np. „Morze Zendikaru" na wodzie,
  nie na lądzie).
- `content/planes/zendikar.md` i `content/cards/2bfz-coralhelm-guide.md`
  — BEZ ZMIAN (to treść była słuszna; mapa została do niej dopasowana).
- Spelling „Prison of **Omath**" (v2) zostaje do czasu E-geo-8
  (kanon BFZ: Omnath) — decyzja z właścicielem.

## Następną sesją (kolejność)

1. **E-geo-1** — archipelag Jwar/Beyeen/Agadeem między Ondu a Akoum
   (w2 §1) + pinezki/kotwice (największy widoczny błąd układu).
2. **E-geo-2** — Tazeem na płd.-zachód (w2 §5): ocena rotacji układu
   zachodniego — decyzja z właścicielem (zmiana globalna).
3. E-geo-3..9 — detale (Murasa, Akoum, Guul Draz, Ondu, Tazeem) +
   Omath/Omnath + Hada.
