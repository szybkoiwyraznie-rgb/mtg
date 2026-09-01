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

## Motywy (`--styl=pergamin|atlas`)

Paleta to dane, nie kod: `motyw('atlas')` wymienia cały zestaw kolorów
przed renderem.

- **pergamin** (ADR 0008) — barwne klocki na pergaminie;
- **atlas** (**domyślny dla map planów, ADR 0019 + doprecyzowanie**) —
  monochromatyczny line-art z walorem tonalnym: odcienie **wyłącznie
  na osi czarny–szary–biały** (R=G=B; sepia/brąz wykluczone testem).
  Ląd jaśniejszy od wody, korony dwutonowe, fasety cieniowane, klasy-
  czne **linie wody** przy wybrzeżu, rzeki tuszem szarym. Kolor zostaje
  warstwom funkcjonalnym UI (np. czerwone pinezki kart), nie artworkowi.
  (Tryb `tusz` — czysta kreska bez wypełnień — pozostaje w silniku
  do użycia we własnych paletach.)

  ```bash
  node tools/mapforge/cli.mjs --demo --styl=atlas maps/_warsztat/podklad-atlas.svg
  ```

## Katalog klocków (`bloki.mjs`)

| Klocek | Dane | Co rysuje |
|---|---|---|
| `las(id, poly, {gestosc, skala})` | wielokąt zasięgu | **kępy liści** (nieregularne „chmurki" z haczurą), nakładające się w gęstą masę — jak mapome |
| `bagno(id, poly, {gestosc})` | wielokąt | kępki turzyc + płytka oczka wodne |
| `step(id, poly, {gestosc})` | wielokąt | kępy traw |
| `lod(id, poly, {pekniecia})` | wielokąt | biała nakładka + spękania |
| `pasmo(id, punkty, {szer, snieg, przedgorze})` | linia grzbietu | **gęste klastery glifów adoptowanych z mapome** (ADR 0020) — n ≈ dl/(szer·0.8), rozmiar ważony sinusem długości grzbietu (wyżej w środku), flip lustrzany, jitter; kolejność rysowania wg dolnej krawędzi (bliżej = na wierzchu — technika Azgaar) + niskie pogórze pod granią. Klastery nakładają się nieznacznie: każdy szczyt pozostaje czytelny (benchmark mapome, ADR 0015) |
| `szczyt(x, y, w, h, {snieg, flip, glifId})` | punkt | **jeden glif z `glify-mapaome.mjs`** (ADR 0020) — ręcznie rysowana sylwetka klastra 1–3 szczytów mapome, jednolita skala po `h`, środek podstawy w (x, y); `flip=-1` odbicie; `glifId` wybiera sylwetkę (mega-klastery `g-016/g-237/g-270` do masywów zdefiniowanych w scenie); bez `glifId` — deterministyczny wybór z pozostałych 27 |
| `wulkan(x, y, {skala, dym})` | punkt | stożek z kraterem i lazem dymu |
| `rzeka(id, punkty, {s0, s1, ujscie})` | linia + szerokości | wstęga **stożkowa** (zwęża się do punktu na obu końcach — nie urywa się płasko; punkt źródła) w **kolorze akwenu** (ADR 0020, decyzja właściciela 2026-09-01): `ujscie:{typ:'morze'}` → kolor morza, `ujscie:{typ:'jezioro'}` → kolor jeziora, brak ujścia → kolor morza. **Bez gradientu i bez opacity** — wpływając do morza rzeka ma z nim identyczny kolor i zlewa się z nim, nie tnie |
| `doplyw(id, punkty, {s0, s1})` | linia | cieńsza wstęga (bez źródła) |
| `jezioro({cx, cy, rx, ry})` | elipsa | tafla + podwójny brzeg + fala |
| `droga(id, punkty, {typ})` | linia | `szlak` — kropki (konwencja line-art mapome `0 9`); `droga` — kreski |
| `miasto(x, y, {skala})` | punkt | zwarta gromadka domków z dwuspadowym dachem (osada) |
| `ruina(x, y, {skala})` | punkt | 3 złamane kolumny + przewrócona belka i gruz |
| `hedron(x, y, {skala, opacity})` | punkt | kamienny pierścień (dryf = opacity) |
| `etykieta(tekst, x, y, {kat, fs, ital})` | tekst | halo + obrót wokół punktu (`kat` w stopniach); `przyDo:[x,y]` kotwiczy napis obok obiektu + kreska |
| `lukEtykieta(id, punkty, tekst, {fs})` | łuk | etykieta po łuku (textPath) — zatoki, doliny |
| `kompas / ramka / skalaLinia` | — | oprawa mapy |

### Język rysowania glifów (styl „hand-drawn" jak mapome)

Glify przyrody nawiązują do line-artu mapome (benchmark, ADR 0015):

- **Las:** korona to zamknięta ścieżka z wypukłych łuków wokół elipsy
  („chmurka"), nie `<circle>` — nieregularny obrys (jitter promienia),
  ciemna masa cienia u podstawy, asymetryczny boczny pęd i krótka haczura
  cieniowania. Lasy są **gęste i nakładają się** (`minOdst < średnica
  korony`), więc składają się w falistą, teksturowaną masę.
- **Góra:** pojedynczy szczyt to **glif adoptowany z mapome** (ADR 0020)
  — ręcznie rysowana, zamknięta sylwetka klastra 1–3 szczytów
  (biblioteka `glify-mapaome.mjs`, 30 sylwetek + 3 mega-klastery).
  `pasmo()` składa glify w gęsty, ząbasty łańcuch o rozmiarze ważonym
  sinusem i lekkim nachodzeniu — czytelna grań, nie „płotek" i nie
  zbrylona masa (właściciel odrzucił zarówno syntetyczne trójkąty, jak
  i zbyt gęste klastery — 2026-09-01).

Obie formy pozostają deterministyczne (rng z hasha id) i audytowalne
(`data-x/y` na klocku, kontur zamknięty).

Scenę składa `render.mjs` (warstwy: ocean → poświata wybrzeży → lądy →
biomy → jeziora → rzeki → pasma → wulkany → drogi → POI → etykiety →
oprawa). Schemat sceny: `cli.mjs → scenaDemo()` jest kompletnym
przykładem.

## Adopcja (ADR 0018, ADR 0020)

- **Gotowe:** demo `maps/_warsztat/podklad.svg` (katalog klocków na
  jednym obrazie, audyt: 0 problemów).
- **W toku:** nowe elementy map planów rysujemy mapforge'em (warstwa
  po warstwie, bez wielkiego przepisu).
- **Pełna migracja podkładu planu** = osobne zadanie z roadmapą
  (`docs/plans/PLAN_2026-09-01-mapforge.md`) + ocena właściciela
  względem benchmarku Śródziemia.

### Adopcja wektorowych obiektów (ADR 0020, 2026-09-01)

Zasada właściciela: nie odkrywać koła — obiekty mapowe przybieramy z
istniejących projektów (research w `docs/plans/PLAN_2026-09-01-glify-mapaowe-i-rzeki.md`):

- **Góry = glify mapome** (CC-BY-4.0, github.com/k1tesurfen/mapome) —
  to JEST benchmark stylu (ADR 0015). Adopcja = przeniesienie DANYCH
  (ścieżki SVG) do `glify-mapaome.mjs` z nagłówkiem licencji; zero
  zależności (ADR 0002). Ekstrakcja reprodukowalna z podkładu w repo
  (`maps/srodziemie/podklad.svg`, grupa `mountains_and_forests`).
  Atrybucja CC-BY-4.0: nagłówek każdego generowanego SVG +
  `maps/<plan>/map.json` (`zrodlo_glify`) + ADR 0009/0020.
- **Azgaar/Fantasy-Map-Generator** (MIT) — zapisany kandydat na
  kolejne klocki (warsztat T4, kolejka E5: cytadela/fort, latarnia,
  wrak, wodospad, obwódki haseł); jego góry nie pasują do benchmarku,
  ale techniki rozsiewu są wdrożone (sort po dolnej krawędzi).
  Adopcja symbolu = z atrybucją (copyright + MIT) i aktualizacją map.json.

Testy: `test/mapforge.test.js` (determinizm, geometria rozsiewu,
glify adoptowane, kolor rzeki, warstwy renderu).
