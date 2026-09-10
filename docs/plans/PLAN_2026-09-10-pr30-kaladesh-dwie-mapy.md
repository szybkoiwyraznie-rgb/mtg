# PLAN PR-30 (2026-09-10) — Kaladesh: dwie osobne mapy (plan w skali planu + osobna mapa Ghirapuru)

Gałąź sesji: `arena/01a087fc-mtg`.

## Zlecenie właściciela (czat 2026-09-10)

Wrócić do Kaladeshu — obecny wynik nie realizuje idei. Miały być **dwie
osobne mapy**:

1. **Mapa planu** (jak Dominaria) — w skali planu **podobnej do Zendikaru**:
   Ghirapur to **mała kropka** (punkt na mapie), góry **duże i
   proporcjonalne**, biomy proporcjonalne do planu.
2. **Mapa miasta Ghirapur** — **zupełnie inna mapa** o własnej skali,
   z własnymi (dużymi, proporcjonalnymi) górami i biomami, podgrywana
   **od pewnego poziomu zoomu** na Ghirapurze przez **twardą podmianę**
   deep-zoom (wzorzec Dominarii).

Objaw obecny (potwierdzony rasteryzacją): plan jest na płótnie mastera
miasta **16000×11000** (~63× normy 2000×1400 wszystkich innych planów),
więc glify mapforge (stały rozmiar) kurczą się do „ząbków piły" (góry)
i „ziarenek piasku" (lasy). Płyta L2 miasta jest w skali **1:1 z planem**
(bbox = dokładny rozmiar płyty) — to nie osobna mapa, tylko wycinek
z detalem. Sama płyta miasta wygląda dobrze (mury, dzielnice, kanał).

Decyzja właściciela co do przejścia (ask_user 2026-09-10): **twarda
podmiana na zupełnie osobną mapę** — bez wymogu idealnego łączenia rzek
na krawędzi (może być z przenikaniem/crossfade, ale bez sztywnego szwu).

## Zakres

- **ADR 0047** — model „osobna mapa miasta o własnej skali + twarda
  podmiana deep-zoom"; luzuje ADR 0046 §5 (sztywny szew L2) dla tego
  modelu; doprecyzowuje ADR 0039/0041 (L2 jako osobna mapa, nie wycinek).
- **Plan Kaladeshu → 2000×1400** (skala Zendikaru): przepisany generator
  `kaladesh-plan-t4.py`; Ghirapur = POI `miasto` (kropka) z etykietą;
  duże, proporcjonalne pasma (Devra, Wielka Wspinka), gęste lasy Peemy,
  stepy Vahd; trzy rzeki + zlewisko + Vasavati do morza; trakty.
- **Mapa miasta Ghirapur** we własnej skali (płyta obecna 1400×740 jest
  dobra — zostaje jej geometria; przestaje być nakładką bbox 1:1, staje
  się celem twardej podmiany).
- **Silnik** (`render-map.js`): twarda podmiana L2 = crossfade zamiast
  szwu (L2 kryje plan pod spodem, gdy w pełni widoczna); zwolnienie
  wymogu sztywnego szwu.
- **Testy**: aktualizacja `lod.test.js` (Kaladesh), `ui-smoke`,
  `mapforge` (hydrologia planu w nowej skali), `map-audit` (geometria
  miasta bez zmian), `mapa-warianty` (kalibracja/bbox).
- **Pinezka 610M19** przeliczona do nowej skali planu (Greenwheel w
  bbox miasta → deep-link startuje z progiem podmiany).
- Treść: strona planu i karta — bez zmian merytorycznych poza notką
  „dwie mapy"; `co-nowego`, handoff, PROJECT_HISTORY, ROADMAP.

## Kroki (każdy = zielony commit + push)

1. Roadmapa + PR (ten plik). — TERAZ
2. Audyt scalonego PR-29 → `docs/audits/AUDYT_2026-09-10-PR29.md`.
3. ADR 0047 + rejestr ADR.
4. Generator planu 2000×1400 (Ghirapur kropką); render SVG; ogląd rastru
   (L10) — porównanie z Zendikarem.
5. Mapa miasta jako osobna skala + silnik twardej podmiany; testy.
6. Pinezka + treść + co-nowego + handoff; build; ogląd; push.

## Bramki

- `npm test` zielone, `npm run build` bez ostrzeżenia o płytkim klonie,
  `python3 tools/map-audit.py` = 0, ogląd rastru planu ≈ jakość Zendikaru
  (duże góry, gęste lasy, Ghirapur kropką).
