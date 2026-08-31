# ADR 0004: Snapshoty Oracle ze Scryfalla utrzymywane w repozytorium

- **Status:** Zaakceptowana
- **Data:** 2026-08-31
- **Decydenci:** agent Arena (sesja PR-1), na podstawie konwencji mtg-game (ADR 0010)

## Kontekst

Karta Katalogowa analizuje mechanikę, nazwę i flavor karty-źródła. Autorytatywnym
źródłem tych danych jest Scryfall (Oracle). Sandbox sesji **nie ma bezpośredniego
egressu HTTPS** (zweryfikowane 2026-08-31: `curl https://api.scryfall.com/...` →
kod 000; `fetch` w Node → błąd) — ale narzędzie `fetch_page` pobiera API
bez problemu (przetestowane na karcie Dunland Crebain w sesji PR-1).
Witryna poza buildem (Pages, `file://` offline) też nie może polegać na
żądaniach do API w locie.

## Decyzja

1. Każda materializowana karta ma **snapshot Oracle** w repozytorium:
   `scryfall/<slug>.json`, gdzie `<slug>` = slug Karty Katalogowej
   (np. `scryfall/1ltr-dunland-crebain.json`).
2. Snapshot pobiera się narzędziem `fetch_page` z
   `https://api.scryfall.com/cards/named?exact=<nazwa>` (lub po
   `set`+`collector_number`, jeśli nazwa nie jednoznaczna) i zapisuje
   **cały surowy JSON** + metadane pochodzenia:
   - `source` — URL zapytania,
   - `pobrano` — data pobrania (YYYY-MM-DD),
   - `slug` — slug karty.
3. Snapshot jest **niezmiennikiem czasowym**: nie odświeża się go „przy
   okazji". Zmiana Oracle (reprint, errata, nowa edycja) to świadoma
   decyzja z nowym plikiem lub nadpisaniem z adnotacją w opisie commita.
4. Snapshot to **źródło prawdy mechaniki** dla strony (ADR 0003, poziom 3):
   koszt, typy, Oracle text, P/T, keywords, artysta, flavor, `image_uris`
   (druk pokazywany na stronie — ADR 0008).
5. Test `test/pokrycie-scryfall.test.js` wymaga: każdy plik w
   `content/cards/` ma odpowiadający `scryfall/<slug>.json` z polami:
   `name`, `mana_cost`, `type_line`, `oracle_text`, `set`, `rarity`,
   `artist`, `image_uris.normal`; oraz że `name` snapshotu zgadza się z
   nazwą w frontmatterze Karty Katalogowej.
6. Obrazy Scryfalla są **linkowane URL-em**, nie pobierane do repo
   (rozsądne przy dziesiątkach kart; decyzja odwracalna, gdy pojawi się
   potrzeba pełnego offline — wtedy nowy ADR o cache'u obrazów).

## Konsekwencje

**Dodatnie:** mechanika karty zawsze weryfikowalna w repo (diff,
historia); build i testy działają offline; brak zależności od dostępności
API w trakcie pracy.

**Ujemne:** snapshot może się zestarzeć względem bieżącego Oracle —
akceptowane (kanon to karta z wydania, nie „dzisiejszy" Oracle).

**Dla sesji agentskiej:** krokiem materializacji jest pobranie snapshotu
przez `fetch_page` i zapisanie go w repo **przed** pisaniem treści strony;
 cytowania „wg Scryfall" odsyłają do pliku snapshotu.
