# ADR 0027: Rozdzielenie artefaktu — kod+treść w jednym pliku, podkłady map jako osobne zasoby ładowane na żądanie

- **Status:** Zaakceptowana
- **Data:** 2026-09-02
- **Decydenci:** właściciel projektu (decyzja 2026-09-02, czat: „pora
  dokonać tej rewolucji" — rozstrzygnięcie wątku otwartego z ROADMAP);
  agent Arena (analiza skalowania 2026-09-01, implementacja PR-10)
- **Zastępuje:** częściowo ADR 0001/0009 (jednoplikowość artefaktu
  w części podkładów map: base64 przestaje być trybem domyślnym)

## Kontekst

Pomiar buildu (ROADMAP, 2026-09-01): artefakt 4,5–7 MB, z czego >95%
to base64 dwóch podkładów map; przy 30+ planach jednoplik urósłby do
~45–90 MB. Geometria każdej mapy jest unikalna — reużywalność klocków
oszczędza autorstwo, nie bajty. Właściciel zdecydował: rozdzielamy.

## Decyzja

1. **Build (domyślnie):** artefakt HTML niesie kod + treść + rejestr
   map z `podkladUrl` (względny); podkłady kopiowane do
   `<dist>/maps/<plan>/<plik>`. Wynik: artefakt ~0,2 MB zamiast ~7 MB;
   mapa dociągana TYLKO przy wejściu na nią.
2. **Ładowanie na żądanie (witryna):** mapa T3+/SVG — `fetch(url)` →
   cache na sesję → inline `<svg>` (wektor, nakładka typograficzna jak
   dotąd); T2/rastry — `<img src=url>` bez fetch. **Degradacja:** gdy
   fetch niedostępny/nieudany (file://, offline) mapa spada do
   `<img src=url>` (działa też z dysku), bez nakładki typografii.
   Mini-mapy kart: `<img src=url>` (działa wszędzie).
3. **Dystrybucja:** GH Pages publikuje cały `dist/` (workflow już
   wysyła katalog); ZIP „do pobrania" pakuje artefakt + `maps/**`
   (samowystarczalny po rozpakowaniu). Artefakt CI (sam HTML) przestaje
   pokazywać mapy — akceptowalne (podgląd treści).
4. **Tryb awaryjny `--inline`:** `node tools/build.mjs --inline`
   buduje po staremu (base64) — używany przez shimowe testy UI
   (środowisko bez fetch) i dostępny, gdyby właściciel chciał
   jednoplikowy eksport małej bazy.
5. Kontrakt danych: `mapa.podkladData` (inline) LUB `mapa.podkladUrl`
   (split) — renderery obsługują oba; test artefaktu wymaga jednego
   z nich.

## Uzupełnienie (2026-09-02, po pytaniu właściciela o wersję offline)

Właściciel używa wersji offline otwieranej z dysku w Chrome — degradacja
map do `<img>` na file:// była nieakceptowalna. Rozwiązanie: **dwa tory
w pakiecie dystrybucyjnym** (`zbudujPakiet`, domyślne `npm run build`):

1. `dist/index.html` + `dist/maps/**` — wersja SPLIT (ta z pkt 1–2
   decyzji): dla serwera lokalnego i GH Pages; artefakt ~0,2 MB.
2. `dist/mtg-lore-codex.html` — **pełny jednoplik inline**: oficjalna
   wersja OFFLINE, otwierana z dysku bez żadnej degradacji (mapy
   wektorowe z pełną nakładką, wszystko w środku). Rośnie z liczbą
   planów — świadomy koszt snapshotu offline.
3. `dist/mtg-lore-codex.zip` — archiwum jednoplika (do pobrania).

`pages.yml` buduje przez `--out dist/index.html` → na Pages ląduje tor
split (bez zmian w workflow). Degradacja `<img>` na file:// pozostaje
wyłącznie jako siatka bezpieczeństwa toru split — nie jest już ścieżką
użytkową offline.

## Konsekwencje

**Dodatnie:** skalowanie do dziesiątek planów bez puchnięcia artefaktu;
szybszy start witryny (mapa ładowana leniwie); zero zmian w workflow.
**Ujemne:** artefakt HTML sam z siebie (bez katalogu `maps/`) nie pokaże
podkładów — dystrybucja lokalna przez ZIP; otwarcie z `file://` pokazuje
mapy w trybie `<img>` (bez zoom-typografii nakładki, bo fetch z file://
jest blokowany przez przeglądarki).

**Dla sesji agentskiej:** nie wracać do base64 jako domyślnego; nowe
zasoby ciężkie (przyszłe podkłady, ewent. grafiki) idą tą samą ścieżką
(osobny plik + URL + degradacja); testy interakcji mapy w shimie budują
z `inline: true`.
