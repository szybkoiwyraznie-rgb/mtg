# Karty Katalogowe

Po jednej stronie markdown na **każdą jawnie dostarczoną kartę** (ADR 0003).
Nazwa pliku = slug = `<imgId>-<slug-nazwy>` (np. `1ltr-dunland-crebain.md`).

- szkielet i kontrakty sekcji: `docs/guides/SZKIELET_KARTY.md`;
- format i wymagania frontmattera: ADR 0005;
- każdy plik MUSI mieć: wpis w `collection/entries/` o tym samym slugu
  oraz snapshot `scryfall/<slug>.json` (pilnują tego testy).

Ten plik (README.md) nie jest stroną bazy — loader go pomija.
