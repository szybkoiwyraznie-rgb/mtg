# PLAN — 2026-09-03 — PR-16: Ravnica v3 — QA pas jakości (odzysk patch-6 + domknięcie)

## Kontekst

Po scaleniu PR-15 (mapa Ravnica v3 T2+, wektoryzacja źródła fanowskiego ADR 0031)
kolejna sesja (agent) pracowała nad **QA jakości wizualnej mapy** i zawiesiła się.
Jej pełny diff (od końca PR-14 `fd68aa8` do zawieszenia) został odzyskany przez
właściciela i wgryziony na gałąź `szybkoiwyraznie-rgb-patch-6` jako
`01a06700-9174-7800-bdf8-c05e6a9ba625.patch`. Patch aplikuje się czysto na `fd68aa8`.

### Diagnoza odzyskanego stanu (porównanie z main)

Większość odzyskanego patcha pokrywa się z PR-15 (map.json, mapa-analiza, plan,
usunięcie scena.json — identyczne z main). Faktycznie **nowe** wobec main:

1. `maps/ravnica/podklad.svg` — dalsza iteracja agenta QA:
   - DODANE brakujące etykiety pasa Undercity: RIX MAADI, KOROZDA & SVOGTHOS,
     NIGHTVEIL & DUSKMANTLE, WAYPORT, ZONOT SEVEN & ZAMECK, GORE HOUSE (+sub)
     — to domyka zgłoszenie właściciela „brakuje etykiet w pasie Undercity”.
   - TRANS-GUILD PROMENADE obrót `rotate(145)` → `rotate(-27)` — usunięta
     „Promenada do góry nogami”.
   - Etykiety POI doczepione algorytmicznie do markerów (wzorzec mapforge:
     etykieta POD/PONAD markerem) — domyka zgłoszenie „kolorowe kółka w oderwaniu
     od POI”.
   - Markery POI dopięte do kanonicznych kotwic (map.json).
   - Duplikat UNDERCITY usunięty (1 wystąpienie).
2. `tools/map-audit.py` — usprawnienie narzędzia (poprawka, nie regresja):
   - etykiety liczone z **obrotem SVG** (AABB po rotacji) — przestaje fałszywie
     zgłaszać kolizje obróconych napisów (np. MEDORI PARK × UNDERCITY);
   - ciemny pas podziemi `#575757` uznany za ląd (etykiety Undercity nie są
     „w wodzie”).

### Problemy odzyskanego podkladu (do naprawy w tej sesji)

Automatyczne mierzenie pozycji etykiet dróg dało dryf względem źródła i kolizje
(agent sam je cofał przed zawieszeniem):

- TIN STREET przesunięta z (1877,1917) w okolice GORE HOUSE → kolizje
  GORE/HOUSE × TIN STREET, PRECINCT SIX × TIN STREET.
- PLAZA AVENUE przesunięta z (3802,3272) → kolizje ORZHOVA × PLAZA AVENUE,
  TENTH DISTRICT × PLAZA AVENUE.
- SKARRG × TRANS-GUILD PROMENADE kolizja (na górze, po zmianach pozycji).
- DEADBRIDGE CHASM × BENZER'S BRIDGE.
- Zgubiony napis FOUNDRY STREET (obecny w main).
- `map-audit.py ravnica` (usprawniony) na odzyskanym podkładzie: **7 problemów**
  (wszystkie = kolizje etykiet).

## Wariant wynikowy

Kontynuacja T2+ (podkład adoptowany, czysty wektorowy SVG + map.json + analiza),
bez sceny mapforge/T4. Ravnica pozostaje nie-bramkowana w CI przez
`mapforge.test.js`/`map-audit` — dlatego **twardym celem sesji jest
`python3 tools/map-audit.py ravnica` = 0 problemów** na podkładzie T2+.

## Kolejność (inkrementalne commity, każdy = zielone `npm test` + `npm run build`)

- **S1 ✅** (commit `26797ce`) Odzysk + PR-16 na starcie: rescue `podklad.svg`
  + `map-audit.py` (poprawka rotacji pasa Undercity). PR: #16.
- **S3 ✅** (ten commit) Rekonsyliacja etykiet z main: przywrócenie
  TIN STREET (1877,1917) i PLAZA AVENUE (3802,3272) do pozycji
  rozstrzygnietych w main (usuwa 4 kolizje wprowadzone przez dryf w patch-6:
  GORE/HOUSE/PRECINCT SIX × TIN, ORZHOVA/TENTH DISTRICT × PLAZA) oraz
  przywrocenie zgubionego napisu FOUNDRY STREET. Audyt poprawiony:
  7 -> 3 pozostałe kolizje (SKARRG×promenada i BLISTERCOILS×TIN obecne
  takze w scalonym main; DEADBRIDGE×BENZER wg rozstawu agenta z wizja).
- **S2** Analiza strukturalna podkładu: etykiety vs kotwice, markery vs POI,
  kolizje; render referencyjny do porównania (resvg → PNG).
- **S3** Naprawa dryfu etykiet dróg: przywrócenie pozycji TIN STREET (1877,1917),
  PLAZA AVENUE (3802,3272), FOUNDRY STREET; sanity rotacji.
- **S4** Rozdzielenie pozostałych kolizji (SKARRG × promenada, Deadbridge × Benzer)
  przez korektę pozycji z uzasadnieniem źródła; ręczna weryfikacja AABB.
- **S5** QA: `map-audit.py ravnica` = 0; porównanie strukturalne marker↔POI;
  `npm test` + `npm run build` zielone; render podglądowy (PNG) dla właściciela.
- **S6** Dokumentacja: mapa-analiza (rozdział QA), map.json (notka),
  content/co-nowego, ROADMAP, PROJECT_HISTORY, handoff, opis PR kumulatywny.

## Kryteria gotowości (definition of done)

1. `python3 tools/map-audit.py ravnica` → **0 problemów**.
2. Etykiety pasa Undercity obecne i czytelne (RIX MAADI, KOROZDA & SVOGTHOS,
   NIGHTVEIL & DUSKMANTLE, WAYPORT) — sprawdzane strukturą + renderem.
3. Markery POI w kotwicach kanonicznych (brak „sierot” >120 px od kotwicy,
   poza świadomymi obiektami wodnymi/poza sylwetką).
4. `npm test` (102/102) + `npm run build` zielone.
5. `tools/map-audit.py` zachowuje usprawnienie rotacji i pasa Undercity (bez
   regresji na Zendikarze/Śródziemiu).
6. Dokumentacja sesji kompletna; PR gotowy do Squash and merge przez właściciela.

## Ryzyka

- Sesja bez oglądu obrazów (render PNG → weryfikacja strukturalna + ocena
  właściciela w podglądzie live).
- Podkład T2+ jest ręcznie składany; kolizje etykiet rozwiązuje się pozycjami
  z uzasadnieniem, nie silnikiem rozstawu.
- Rozmiar/struktura podkładu: cel 0 problemów audytu bez zmiany geometrii
  (sylwetka, teren, drogi, granice, baner).
