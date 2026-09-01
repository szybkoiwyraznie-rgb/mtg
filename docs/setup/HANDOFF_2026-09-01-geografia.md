# HANDOFF 2026-09-01 — audyt + przebudowa geografii CAŁEJ mapy Zendikaru (uzupełnienie PR-9)

> Handoff = skrót JEDNEJ sesji. Zasady trwałe żyją w AGENTS.md, ADR-ach
> i ENVIRONMENT.md — w razie rozbieżności wygrywa repozytorium.

## Stan projektu

- **PR #9** (`arena/01a05e7c-mtg` → `main`) otwarty, do oceny/w scalenia
  przez właściciela — zawiera tera PR-9 (glify/rzeki, ADR 0020) + tę
  sesję (audyt i przebudowa geografii E1).
- `node tools/run-tests.mjs` = **87/87**; `npm run build` OK (4 strony,
  14 modułów, artefakt ~5.88 MB); `python3 tools/map-audit.py` —
  **0 problemów** (wszystkie mapy).
- **Prototyp do oceny wdrożenia:** Vite `vite preview` na porcie **4173**
  (host 0.0.0.0) — wystawiony w sandboxie dla właściciela (decyzja
  sesji: „wystaw mi prototyp Codexu w sandboxie do oceny wdrożenia").
  Po re-klonie: `cd /home/user/mtg && npm run build` →
  `npx vite preview --host 0.0.0.0 --port 4173` (dla podglądu).
- Wizualna kontrola: PNG z `maps/zendikar/podklad.svg` (sharp,
  `/home/user/tmp` — poza repo) — etykiety, cieśnina i Tazeem
  sprawdzone w kadrach.

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

## Decyzje i konwencje (trwałe)

- **Hierarchia źródeł geografii:** kanon tekstowy (treść planu, karty)
  > mapa fanowska v2 (`maps/zendikar/zrodlo-fanowska.md`) > warianty
  3/4 (`zrodlo-fanowska-warianty-3-4.md`). W3/4 tylko dla POI
  nieustalonych w kanonie/v2. (ADR 0010/0013.)
- **Etykiety POI SIADAJĄ PRZY obiekcie** — silnik NIE rysuje kresek
  łączących (decyzja właściciela 2026-09-01, pkt a). `przyDo` to tylko
  kotwica rozstawu (bez kresek); pozycja bazowa etykiety ma być tuż
  przy obiekcie.
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
