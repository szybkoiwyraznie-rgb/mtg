# Snapshoty Oracle (Scryfall)

Jeden plik JSON na materializowaną kartę: `<slug>.json` (ten sam slug co
Karta Katalogowa i wpis kolekcji). Plik zawiera **pełną odpowiedź API** plus
metadane pochodzenia: `source` (URL zapytania), `pobrano` (data), `slug`.

Pobieranie: narzędziem `fetch_page` z
`https://api.scryfall.com/cards/named?exact=<nazwa>` (bezpośredni egress z
sandboxa jest zablokowany — ENVIRONMENT.md §1). Snapshot jest
niezmiennikiem czasowym (ADR 0004) — nie odświeża się „przy okazji".

Test `test/pokrycie-scryfall.test.js` wymaga pól: name, mana_cost,
type_line, oracle_text, set, rarity, artist, image_uris.normal.
