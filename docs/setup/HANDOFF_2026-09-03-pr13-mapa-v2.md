# HANDOFF 2026-09-03 (PR-13, sesja 3) — mapa Ravnicy v2: kalibracja pod transkrypcję GGR

> Handoff = skrót JEDNEJ sesji. Zasady trwałe żyją w AGENTS.md, ADR-ach
> i ENVIRONMENT.md — w razie rozbieżności wygrywa repozytorium.
> Poprzedni stan: `HANDOFF_2026-09-03-pr13.md` (dostawa 137GPT + mapa v1).

## Stan projektu

- **PR #13** (`arena/01a063dc-mtg` → `main`) wciąż otwarty; zawiera teraz
  trzy warstwy: Pętla Jakości (09-02), dostawa 137GPT (09-03 00:12)
  i **map v2 (ta sesja)**:
  <https://github.com/szybkoiwyraznie-rgb/mtg/pull/13>
- Wejście: właściciel przesłał raster oficjalnej mapy GGR
  (`TenthDistrict.png` — © WotC, **nie trafia do repo**) i jego
  **tekstową transkrypcję w układzie ±10**. Transkrypcja utrwalona
  w `maps/ravnica/zrodlo-transkrypcja-ggr.md` (dokument źródłowy
  kalibracji — precedens `zrodlo-fanowska.md` Zendikaru).
- Końcowa integralność:
  - `npm test` = **102/102**,
  - `npm run build` = OK (artefakt **306.6 kB**, ZIP **12.75 MB**),
  - `python3 tools/map-audit.py ravnica|zendikar|srodziemie` = **0**,
  - walidator wiązań = **0 uwag**,
  - re-render Zendikaru po zmianach silnika = **bajtowo identyczny**,
  - QA rastrowe (sharp 96/150) = pełna mapa + cropy centrum/P2 OK.

## Co zrobiono

1. **Diagnoza dopasowania:** LSQ-affine v1→transkrypcja na 22 kotwicach
   = RMS 634 px → v1 nie była „przesunięta", tylko narysowana inną
   geometrią → decyzja: v2 = przebudowa koordynatów sceny (zachowany
   wygląd/warstwy terenu i identyfikatory).
2. **Budowniczy przepisany na koordynaty transkrypcji** (t(X,Y) =
   (830+(X−0.5)·64, 610−(Y+1)·64)): 33 POI z transkrypcji, 6 POI
   relacyjnych spoza niej (Horizon/Sawtooth/Tin Market/Mizzium/Forum/
   Bridge — wiki), graf precyktów z v1 utrzymany (J_A/J_B/J_C/J_D).
3. **Nowe POI v2:** Statue of Agrus Kos (P2), Vizkopa Bank (P1),
   Whitestone (P3), Plaza East/West/South, The Great Concourse (P3),
   Gore House, Medori Park (P6); **markery podziemi** (Rix Maadi,
   Korozda & Svogthos, Nightveil & Duskmantle) na poświacie południowej
   — typ `ruina`, warstwa anchor `podziemie` w map.json.
4. **Fix silnika:** escapowanie XML w etykietach (bloki.mjs: `escXml`)
   — uprzednio `&` w nazwie psuło podkład SVG.
5. **map.json v2:** 55 kotwic, `kalibracja{}`, pinezka karty
   (0.3688, 0.4273, bruk przy Tin Street Market), lista otwartych
   skrócona. Analiza mapy: rozdział v2 + uwagi. Plan Ravnica: nowe POI
   i akapit Undercity w Geografii.
6. **Zamknięcie:** commit `51935ae` (atomowy); co-nowego 00:43;
   PROJECT_HISTORY; ROADMAP K7; ten handoff; opis PR o sesji 3.

## Ważne pliki tej sesji

- `maps/ravnica/zrodlo-transkrypcja-ggr.md` (NOWY — źródło kalibracji)
- `tools/mapforge/ravnica-scena-t4.py` (v2: koordynaty transkrypcji)
- `maps/ravnica/scena.json`, `maps/ravnica/podklad.svg` (regenerowane)
- `maps/ravnica/map.json` (v2: 55 kotwic, kalibracja, pinezka)
- `maps/ravnica/mapa-analiza.md` (rozdział v2), `content/planes/ravnica.md`
- `tools/mapforge/bloki.mjs` (escXml fix)
- dzienniki: co-nowego, PROJECT_HISTORY, ROADMAP

## Pułapki / obserwacje

- **Ray-casting pit() wyklucza punkty NA granicy** — plaza stub
  przesunięto 18 j. od linii P1|P4 (patrz Millennial v1: 4 px tolerancji
  to za mało na styku wierzchołków; daj ~±15–20 j. lub punkt wewnętrzny).
- **Etykieta `przyDo` MUSI mieć dokładny punkt w `scena.poi`**
  (assert w budowniczym) — nowe etykiety z `przyDo` dodawać razem z POI.
- **LSQ na mieszance epok jest zdradliwe:** różne przemieszczenia
  mają różne źródła (błąd v1 vs mylny odczyt ikony z tekstu),
  więc najpierw rozpoznaj strukturę różnic (tu: globalna), potem
  dopasowuj. RMS ~630 px = inna geometria globalna → przebudowa.
- **`&` w etykiecie psuło SVG** — od tej sesji silnik escapuje;
  dotyczy też przyszłych tekstów łukowych (`lukEtykieta`).
- map.json: przy masowej aktualizacji kotwic uważaj na **nazwy
  niepasujące 1:1** do sceny (aliasy „Concordance (Old City)" itd.) —
  aktualizacja skryptem + ręczna mapka wyjątków (3 pozycje).

## Otwarte / następny krok

- PR #13 czeka na review/scalenie (Squash wg reguł — decyzja właściciela).
- Kolejna sesja: audyt PR #13 przed nową pracą (dotyczy po scaleniu).
- Mapa v3 (Propozycje; nie zaczynać bez decyzji): warstwy epokowe
  (2006 vs 2019), pełny przekrój Undercity; drugi punkt odniesienia
  (opis fanowskiej nakładki precinct-overlay, jeśli właściciel dostarczy
  jak przy GGR). Ewentualna korekta: `Warstwa „podziemie"` — render
  markerów jako osobna kategoria wizualna (dziś: zwykłe ruiny + peleryna
  italic, legenda tekstowa).
