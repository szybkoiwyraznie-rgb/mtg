# Mapy planów

Katalog na plan: `maps/<plan>/`.

## Pliki

- `map.json` — metadane mapy: wariant T1/T2/T3/T4, źródło podkładu,
  wymiary, pinezki kart (współrzędne znormalizowane 0–1 + poziom
  pewności + uzasadnienie), kotwice/proweniencja elementów, regiony
  haseł geograficznych;
- `podklad.svg|png|jpg` — właściwy podkład mapy commitowany do repo;
- `scena.json` — scena źródłowa mapforge dla map T3/T4 (gdy podkład
  jest renderowany przez wspólny silnik);
- `podklad-reczny.svg` — opcjonalne archiwum starszej epoki ręcznej,
  gdy plan przeszedł migrację do mapforge;
- `zrodlo-fanowska*.md` / inne noty źródłowe — opis źródeł pomocniczych
  dla pozycji nieustalonych w kanonie.

## Build i dystrybucja

`tools/build.mjs` kopiuje podkłady do `dist/maps/<plan>/` oraz buduje
samowystarczalne strony `dist/maps/<plan>.html`, które artefakt główny
osadza w `<iframe>` (ADR 0027). ZIP pakuje całe drzewo `maps/**`.

## Proces

- proces badawczy i struktura `map.json`: `docs/guides/PROCES_MAP.md`
  (MA1–MA5),
- warsztat T4 i rysowanie scen mapforge: `docs/guides/RYSOWANIE_MAPY_PLANU.md`,
- audyt geometrii / etykiet / pinezek: `python3 tools/map-audit.py`.
