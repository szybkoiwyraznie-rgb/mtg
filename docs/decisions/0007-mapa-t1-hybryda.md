# ADR 0007: Mapy planów — T1 hybryda z rasterowym podkładem

- **Status:** Zaakceptowana
- **Data:** 2026-08-31
- **Decydenci:** właściciel projektu (wybór T1 na start, 2026-08-31); agent Arena (sesja PR-1)

## Kontekst

Każda materializowana karta ma być umieszczona pinezką na wektorowej,
zoomowalnej mapie swojego planu/settingu. Planów docelowo jest ~30
(wg kolekcji właściciela), a ich jakość źródłowa jest różna: Śródziemie
ma kanoniczne mapy wysokiej jakości, światy customowe — nie mają map
wcale. Pełna wektoryzacja każdej mapy to tygodnie pracy; hybryda daje
funkcjonalność (zoom, pinezki, regiony, linki) natychmiast.

## Decyzja

1. **Wariant bazowy T1 — hybryda**: SVG zawiera rasterowy podkład mapy
   (osadzony jako `<image>` w SVG, base64 lub plik obok) plus **w pełni
   wektorowe warstwy interaktywne**: pinezki kart, regiony/obwódki haseł
   geograficznych, etykiety, ścieżki. Zoom i pan działa na całości;
   etykiety i pinezki pozostają ostre w każdym przybliżeniu.
2. **Drabina wariantów**:
   - **T2 — wektoryzacja kluczowych linii** (wybrzeża, granice, rzeki)
     własnym skryptem śledzącym, dla map, gdzie zoom na detale ma
     znaczenie; upgrade selektywny, plan po planie.
   - **T3 — mapa proceduralna od zera**, gdy plan nie ma żadnej mapy
     (światy custom): budowa z opisów lore, wyraźnie oznaczona jako
     rekonstrukcja własna (nie kanon).
3. **Proces researchu mapy (MA1)**: kwerenda najlepszej istniejącej mapy
   planu → wybór wg kryteriów (kanoniczność, czytelność, rozdzielczość) →
   zapis źródła i daty pobrania w rejestrze `maps/<plan>/map.json`.
   Użytek prywatny (właściciel 2026-08-31) — bez obaw licencyjnych na
   tym etapie; przy ewentualnym upublicznieniu projektu mapa podkładu
   podlega wymianie (osobny ADR).
4. **Protokół pinezek**: każda pinezka to `{card, x, y, pewność}` ze
   współrzędnymi znormalizowanymi 0–1 względem podkładu oraz poziomem
   pewności `dokladna | region | przyblizona` — lokalizację ustala się z
   lore (research), a nie z położenia kursora. Pinezki bez uzasadnienia
   lore nie istnieją.
5. **Struktura**: `maps/<plan>/map.json` (metadane: źródło, tytuł,
   wymiary, granice geograficzne jeśli znane, pinezki) +
   `maps/<plan>/podklad.(svg|png|jpg)` + opcjonalne warstwy wektorowe.
   Test `test/mapy.test.js` pilnuje spójności (pinezki → istniejące karty,
   plan z `mapa: <slug>` ma pliki).
6. **Ścieżka rozwoju na pilocie** (karta 1LTR): T1 dla Śródziemia → ocena
   jakości zoomu → decyzja właściciela o T2 dla tej mapy. Silnik map
   (pan/zoom, etykiety, deep-link `#/mapa/srodziemie?pin=...`) rośnie w
   osobnych PR podprojektu map.

## Konsekwencje

**Dodatnie:** każdy plan ma działającą mapę od pierwszej karty; koszty
rośną tylko tam, gdzie jakość ma znaczenie; decyzja o wektoryzacji jest
odwracalna i oparta na oglądzie efektu, nie na domysłach.

**Ujemne:** raster podkładu w repo (pojedyncze MB na plan — akceptowalne;
podkłady to pliki w `maps/`, świadomie commitowane jako dane projektu);
zoom głęboki na detale podkładu pokazuje piksele do czasu T2.
