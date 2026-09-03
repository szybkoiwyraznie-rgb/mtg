# PLAN — 2026-09-03 — PR-17: Ravnica v4 — doprowadzenie podkładu T2 do złotego standardu (sesja z wizją)

## Kontekst

Po PR-16 (Ravnica v3 QA, sesja bez oglądu obrazów) właściciel dostarczył złoty
standard: 3 warstwy źródłowe w `szybkoiwyraznie-rgb-patch-3` (`maps/ravnica/a.png`,
`b.png`, `c.png`, 6849×5292 — identyczny viewBox jak obecny `podklad.svg`):
- **a** = kształty dzielnic + ciągłe przerywane granice + ramka + baner + kompas + pas UNDERCITY;
- **b** = szare struktury/biomy (gildie, place, trakty);
- **c** = POI (kolorowe markery) + labelki + drogi.

Bieżąca sesja **dysponuje oglądem obrazów** (render PNG przez `sharp` w
`/home/user/qawork/`, poza repo — zero-deps nienaruszone, ADR 0002). Rastery
źródłowe trzymane poza gitem (ADR 0031 pkt 2); w repo tylko wynikowy
wektor + proweniencja.

## Usterki właściciela (domknięcie)

1. **Granice dzielnic zniknęły** — w źródle ciągła sieć przerywanych linii
   dzieli całość na 6 Precinctów; w obecnym SVG tylko 6 fragmentów. Odtworzyć
   pełną sieć granic wg `a.png`.
2. **Labelki za wysoko / na markerach** — etykieta ma być POD okręgiem POI,
   nie wchodząc na niego (szczególnie duże gildie). Wzór: kotwica w centrum
   markera, etykieta pod spodem z małym odstępem; konflikt → nad.
3. **Labelki POI mają kolor gildii — błąd.** Labelki czarne (na lądzie);
   białe wyłącznie na ciemnym pasie UNDERCITY (Rix Maadi, Korozda, Nightveil).
4. **Pomylone POI z geografią.** Marker (kolorowe kółko) mają TYLKO obiekty,
   które w `c.png` mają okrągły kolorowy marker. Ulice/place/budowle bez
   markera (Tin Street, Plaza Avenue, Foundry Street, Smelting Quarter,
   Hightower, Prism University, Bulwark, Tenth District Plaza, Chamber of the
   Guildpact, Augustin Station, Plaza East/South, Wayport, Benzer's Bridge,
   Beast Haven, The Canopy, Millennial Platform) — bez kółka, sam napis
   przylepiony do miejsca.
5. **Millennial Platform** to lewitująca skała nad Plaza East: przerywana
   linia-kotwica ma łączyć wyspę/platformę z lądem w rejonie Plaza East
   (obecnie biegnie źle).
6. **Kolizje** (Deadbridge/Benzer i in.) — żadne napisy/drogi/POI nie mogą
   kolidować; Benzer's Bridge to droga (bez markera).
7. Wzorzec = `c.png`/`a.png`.

## Uwaga źródłowa (rozbieżność z opisem właściciela)

W `c.png` **DEADBRIDGE CHASM ma mały zielony marker Golgari** (~2824,3863),
a BENZER'S BRIDGE to szara droga z napisem, bez markera. Reguła (4) „marker
tylko gdy okrągły kolorowy w źródle" jest rozstrzygająca — Deadbridge zostaje
POI (marker), Benzer to geograf (bez markera). Odnotowane w `mapa-analiza.md`.

## Inwentaryzacja markerów wg `c.png` (zweryfikowana wizualnie + segmentacją pikseli)

Duże gildie (dysk ~r95): Skarrg (Gruul, zielony dysk/czerwony emblemat),
Vitu-Ghazi (Selesnya, teal/biel), Sunhome (Boros, bordo/biel), Nivix (Izzet,
granat/czerwień), Zonot Seven & Zameck (Simic, granat/teal), Orzhova (Orzhov,
czarny/biel), New Prahv (Azorius, błękit/biel), Rix Maadi (Rakdos, czerwień/
czerń), Korozda & Svogthos (Golgari, czerń/zieleń), Nightveil & Duskmantle
(Dimir, czerń/błękit).
Małe POI (dysk ~r36): Red Wastes, Great Concourse, Concordance, Blistercoils
×2 (teal+czerwony, zachodzące), Ismeri Library, Gore House, Kamen Fortress,
Vizkopa Bank, Plaza West, Whitestone, Statue of Agrus Kos, Griffin Heights,
Medori Park ×2 (czerwony+czarny), Deadbridge Chasm.

## Kolejność (inkrementalne commity; każdy = `npm test` + `npm run build` zielone + render QA)

- **S1** plan + audyt PR-16 + PR #17.
- **S2** Markery: rekolor (Skarrg, Nivix, Nightveil…), usunięcie markerów
  geograficznych (~15), przesunięcie Ismeri/Vizkopa/Griffin, dodanie
  podwójnych Blistercoils/Medori; biały halo; style duży/mały wg źródła.
- **S3** Etykiety: wszystkie czarne (undercity białe), pozycjonowanie POD
   markerem z odstępem; geografowie bez markera — napis przy miejscu.
- **S4** Granice dzielnic: pełna sieć przerywanych linii wg `a.png`.
- **S5** Konektor Millennial Platform (5) + drogi (urwane odcinki, usterka #5 z PR-16).
- **S6** Kolizje: przegląd całości renderem, `map-audit.py ravnica` = 0 problemów.
- **S7** Dokumentacja: mapa-analiza, map.json (proweniencja + rejestr POI),
  co-nowego, ROADMAP, PROJECT_HISTORY, handoff, opis PR.

## Kryteria gotowości

1. Render `podklad.svg` vs `c.png`/`a.png` — struktura granic, markerów i
   etykiet zgodna ze wzorem (ocena wizualna właściciela w preview).
2. Labelki czarne, pod markerami, bez najazdu na kółka; bez kolizji.
3. Markery tylko tam, gdzie w źródle są kolorowe kółka; kolory gildii zgodne.
4. Granice ciągłe, dzielą całość na 6 Precinctów.
5. `python3 tools/map-audit.py ravnica` → 0 problemów; `npm test` (102) +
   `npm run build` zielone.
6. Rastery źródłowe poza gitem; proweniencja w `map.json`/`mapa-analiza.md`.
