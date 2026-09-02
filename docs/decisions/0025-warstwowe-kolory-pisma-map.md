# ADR 0025: Warstwowe kolory pisma na mapach T4; napisy NAD lasem (bez polan); ikony iglicy i wodospadu; kaniony rysowane

- **Status:** Zaakceptowana
- **Data:** 2026-09-02
- **Decydenci:** właściciel projektu (recenzja 6 preview PR-10);
  agent Arena (sesja PR-10)
- **Zastępuje:** punkt 3 ADR 0024 (rozsiew biomów omijał boxy etykiet —
  wycofane: „wycinało polany" pod tytułami; napis ma leżeć NAD lasem)
- **Doprecyzowuje:** ADR 0024 (kolory funkcyjne pisma), ADR 0023
  (obiekt dla każdej etykiety)

## Decyzje

1. **Kolory pisma warstwowe** (kolory funkcyjne motywu atlasowego):
   - kontynenty/wyspy — **czerń** `#000000` (`PAL.etykietaKontynent`;
     `duze` automatycznie, wyspy przez `opcje.kolor`),
   - obiekty wodne — **granat** `#1c3a5e` (ADR 0024),
   - fragmenty lasów/bagien — **ciemna zieleń** `#1e4d2b`
     (`PAL.etykietaBiom`; automat: kotwica w poligonie las/bagno,
     o ile etykieta nie nazywa POI),
   - pozostałe (osady, ruiny, krainy nieleśne) — bordo (ADR 0021).
2. **Nakładka Codexu przenosi kolor pisma z SVG** (inline `color`
   z `fill`) — bez tego CSS klas nadpisywał kolory i granatu/zieleni
   nie było widać w witrynie (feedback recenzji 6).
3. **Napisy NAD biomem, nie zamiast niego:** wycofano wykluczanie boxów
   etykiet z rozsiewu (ADR 0024 pkt 3) — czytelność zapewnia halo.
4. **Nowe klocki POI:** `iglica` = najsmuklejszy glif adoptowany
   `g-237` (w/h≈0,69; hero jawnie przez glifId — ADR 0020);
   `wodospad` = strugi + rozbryzg w kolorze linii wody.
5. **Kaniony rysujemy:** nazwa kanionów (Makindi Trenches) dostaje
   narysowaną rzeźbę (niskie pasmo wzdłuż linii kanionów) — etykieta
   kotwiczy się przy niej.
6. **Drogi bez dubli:** trakty łączą POI DOTĄD niepołączone; nie
   prowadzi się drugiej drogi w korytarzu istniejącej. W tej sesji:
   usunięte 3 duble, dodane Affa–Fort Keff, Graypelt–Prison of Omnath
   (szlak), Coralhelm–The Bulwark; puste połacie Bala Ged wypełnione
   dżunglą (zachód + północ), las Ora Ondar/Khalni Heart z „kreski"
   na pełny wielokąt.

## Konsekwencje

Cztery kolory pisma = szybka orientacja (ląd/woda/las/tytuł); automat
zieleni wymaga poligonu biomu pod kotwicą (etykieta lasu poza lasem
zostaje bordowa — sygnał błędu danych); listy kolorów wodnych i wysp
utrzymywane w scenie/`ETYKIETY_WODNE_KOLOR`.
