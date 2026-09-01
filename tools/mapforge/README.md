# mapforge — wspólny silnik mapowy (warsztat T4, ADR 0018)

Deterministyczny generator SVG z danych: **scena → podkład** w palecie
pergaminu (ADR 0008). Zero zależności. To jest „wspólne środowisko
do rysowania map" z punktu 4 Pętli Jakości (ADR 0015): reużywalne
klocki zamiast ręcznych punktów i krzywych.

```bash
node tools/mapforge/cli.mjs --demo              # wyspa pokazowa → maps/_warsztat/podklad.svg
node tools/mapforge/cli.mjs scena.json -o maps/<plan>/podklad.svg
python3 tools/map-audit.py <plan>               # weryfikacja geometrii wygenerowanej mapy
```

## Zasady

1. **Determinizm:** każdy klocek losuje wyłącznie z PRNG inicjowanego
   hashem swojego `id` (mulberry32). Ta sama scena = bajt w bajt ten sam
   SVG (czysty diff w git); edycja jednej rzeki nie przetasowuje lasów.
2. **Dane, nie procedura:** geografia pochodzi ze sceny (kanon planu),
   silnik tylko rysuje. Nic nie jest „generowane losowo" poza teksturami
   (rozsiew drzew, kępki, plamy oceanu).
3. **Audytowalność:** wyjście od razu przechodzi `tools/map-audit.py`
   (etykiety/markery na lądzie, kolizje etykiet; oprawa w grupie
   z transformem — zwolniona jak legenda).
4. **Klocki samodzielne:** każda funkcja z `bloki.mjs` zwraca fragment
   SVG — można dokleić warstwę mapforge do istniejącego, ręcznego
   podkładu (adoptowanie stopniowe, ADR 0018).

## Katalog klocków (`bloki.mjs`)

| Klocek | Dane | Co rysuje |
|---|---|---|
| `las(id, poly, {gestosc, skala})` | wielokąt zasięgu | rozsiew koron (2 tony + pień), blue-noise |
| `bagno(id, poly, {gestosc})` | wielokąt | kępki turzyc + płytka oczka wodne |
| `step(id, poly, {gestosc})` | wielokąt | kępy traw |
| `lod(id, poly, {pekniecia})` | wielokąt | biała nakładka + spękania |
| `pasmo(id, punkty, {szer, snieg, przedgorze})` | linia grzbietu | szczyty z faseta cienia, profil wyższy w centrum, przedgórze |
| `szczyt(x, y, w, h, {snieg})` | punkt | pojedynczy szczyt (ściana + cień + śnieg) |
| `wulkan(x, y, {skala, dym})` | punkt | stożek z kraterem i lazem dymu |
| `rzeka(id, punkty, {s0, s1})` | linia + szerokości | wstęga zwężająca się ku źródłu + punkt źródła |
| `doplyw(id, punkty, {s0, s1})` | linia | cieńsza wstęga (bez źródła) |
| `jezioro({cx, cy, rx, ry})` | elipsa | tafla + podwójny brzeg + fala |
| `droga(id, punkty, {typ})` | linia | `szlak` — kropki (konwencja line-art mapome `0 9`); `droga` — kreski |
| `miasto(x, y, {skala})` | punkt | mur łukiem + bloki zabudowy |
| `ruina(x, y, {skala})` | punkt | przerwane mury + przewrócone kolumny |
| `hedron(x, y, {skala, opacity})` | punkt | kamienny pierścień (dryf = opacity) |
| `etykieta(tekst, x, y, {kat, fs, ital})` | tekst | halo + obrót wokół punktu (`kat` w stopniach) |
| `lukEtykieta(id, punkty, tekst, {fs})` | łuk | etykieta po łuku (textPath) — zatoki, doliny |
| `kompas / ramka / skalaLinia` | — | oprawa mapy |

Scenę składa `render.mjs` (warstwy: ocean → poświata wybrzeży → lądy →
biomy → jeziora → rzeki → pasma → wulkany → drogi → POI → etykiety →
oprawa). Schemat sceny: `cli.mjs → scenaDemo()` jest kompletnym
przykładem.

## Adopcja (ADR 0018)

- **Gotowe:** demo `maps/_warsztat/podklad.svg` (katalog klocków na
  jednym obrazie, audyt: 0 problemów).
- **W toku:** nowe elementy map planów rysujemy mapforge'em (warstwa
  po warstwie, bez wielkiego przepisu).
- **Pełna migracja podkładu planu** = osobne zadanie z roadmapą
  (`docs/plans/PLAN_2026-09-01-mapforge.md`) + ocena właściciela
  względem benchmarku Śródziemia.

Testy: `test/mapforge.test.js` (determinizm, geometria rozsiewu,
zwężanie rzeki, warstwy renderu).
