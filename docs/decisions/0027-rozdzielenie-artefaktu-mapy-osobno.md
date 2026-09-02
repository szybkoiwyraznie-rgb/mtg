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

## Uzupełnienie v2 (2026-09-02) — DRZEWO HTML zamiast fetch i zamiast jednoplika offline

Iteracje tej decyzji w jednej sesji:

1. *Fetch + degradacja do `<img>` na file://* — odrzucone: właściciel
   używa wersji offline z dysku; zdegradowana mapa to nie jest działanie.
2. *Dwa tory (split + pełny jednoplik inline)* — odrzucone: jednoplik
   przy 30+ planach urośnie do ~200 MB i „przeglądarka tego nie uciągnie".
3. **OSTATECZNIE (pomysł właściciela): drzewo HTML.** Każdy plan dostaje
   samowystarczalną stronę `maps/<plan>.html` (pełny bundle + dane +
   surowy markup SVG podkładu, bez base64), a artefakt główny osadza ją
   w `<iframe>`. Kluczowa własność: **file:// blokuje `fetch`, ale NIE
   blokuje iframe'ów** — wersja offline z dysku działa w pełni
   (wektorowe mapy, nakładka typograficzna, warstwa karty z pinezki),
   a rozmiar rośnie liniowo per PLIK mapy, nie per artefakt.

Mechanika:

- build: `maps/<plan>.html` (tryb `CODEX_MAPA`: main.js renderuje jedną
  mapę zamiast routera; deep-link `?pin=`), obok surowe podkłady
  `maps/<plan>/<plik>` dla mini-map kart (`<img>`);
- artefakt główny: trasa `#/mapa/<plan>` = rama + `<iframe>`; nawigacja
  treściowa z wnętrza mapy wraca do rodzica przez `postMessage`
  (`codexHash`), pinezki otwierają warstwę karty LOKALNIE w iframe;
- **„Pobierz ZIP Codexu"**: `mtg-lore-codex.zip` zawiera całe drzewo
  (index.html + mtg-lore-codex.html + maps/**) — po rozpakowaniu
  otwiera się index.html z dysku;
- `index.html` = kopia artefaktu głównego (wejście serwera/Pages);
  `--out` buduje pojedynczy artefakt + drzewo map obok (pages.yml bez
  zmian); tryb `--inline` USUNIĘTY (nie ma już jednoplika z mapami).

## Konsekwencje## Konsekwencje

**Dodatnie:** offline z dysku = pełna funkcjonalność; artefakt główny
stały (~0,2 MB) niezależnie od liczby planów; mapa ładuje się dopiero
przy wejściu; zero zmian w workflow. **Ujemne:** dystrybucja to katalog
(drzewo), nie pojedynczy plik — ZIP jest formą przenośną; komunikacja
iframe↔rodzic wymaga postMessage (file:// izoluje originy).

**Dla sesji agentskiej:** nowe ciężkie zasoby = osobne strony/pliki
w drzewie (nigdy base64 w artefakcie); strony map testuje się
wykonując `dist/maps/<plan>.html` w shimie (czyścić globale
CODEX_MAPA/CODEX_DATA między artefaktami!); nawigacja z iframe tylko
przez postMessage `codexHash`.
