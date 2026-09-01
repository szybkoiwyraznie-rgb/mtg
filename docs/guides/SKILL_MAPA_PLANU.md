# Skill: Mapa nowego planu w ~30 minut (zamiast 5 godzin)

> **Co to jest:** wyciągnięte z sesji tworzenia mapy Zendikaru (PR-2/PR-3/PR-4)
> wnioski operacyjne + gotowa checklista, dzięki której kolejny plan ma mapę
> w pół godziny, bez kilkugodzinnych analiz i pułapek.
>
> **Jak użyć:** przy zleceniu „zrób mapę planu X" — przeczytaj ten plik od
> początku, potem wykonuj wg `PROCES_MAP.md` (MA1–MA5), stosując poniższe
> reguły i pułapki jako obowiązkowe punkty kontrolne.
>
> **Zakres:** T3 (własny, wektorowy podkład SVG z opisu lore). Uzupełnia,
> nie zastępuje `PROCES_MAP.md` (T1 hybryda) ani ADR 0007/0012.
>
> **Pamięć warsztatu T4 (ADR 0015):** ten plik jest rejestrem reużywalnych
> metod rysowania (pasma górskie, rzeki, biomu, osady/ruiny) — każdą nową,
> sprawdzoną metodę dopisuje się tutaj, żeby kolejne mapy powstawały
> szybciej i w jednym stylu, dążąc jakością do mapy Śródziemia.

---

## 0. Drabina źródeł (najpierw to ustal)

Zanim cokolwiek narysujesz, ustal **drabinę wiarygodności** dla danego planu
i zapisz ją w `map.json`. Dla Zendikaru (brak oficjalnej mapy) wyglądała tak:

1. **Kanon tekstowy** (oficjalne publikacje: *Plane Shift*, *Plane(s)walker's
   Guide*, MTG Wiki) → twarde pozycje kontynentów i POI.
2. **Mapa fanowska #1 (wariant 2)** → tylko uzupełnia miejsca NIEUSTALONE.
3. **Mapy fanowskie #2 i #3 (warianty 3/4)** → **ostatnia deska ratunku**,
   gdy ani kanon, ani wariant 2 nie pozwalają wyznaczyć POI.

Reguły drabiny:

- **Kanon > fanowska.** Mapa fanowska nigdy nie przesuwa pozycji kanonicznej.
- Warianty 3/4 mają **inny układ współrzędnych i geometrię** niż przyjęty
  podkład — nie skalować 1:1, tylko wyciągnąć **względne położenie POI**
  („X leży na zachód od Y") i nanieść na własny układ.
- Każde POI z fanowskiej dostaje w `map.json` `pozycja_zrodlo`:
  `mapa-fanowska` albo `mapa-fanowska-wariant-3-4`.
- Zapisz pełne opisy źródeł fanowskich jako osobne pliki
  (`maps/<plan>/zrodlo-fanowska*.md`), a w `map.json` trzymaj referencję
  (pole `zrodlo_fanmapa`, `zrodlo_fanmapa_warianty`). **Nie mieszaj ich
  z kanonem.**

---

## 1. Podkład wektorowy SVG (T3) — od czego zacząć

1. Ustal viewBox: **2000 × 1400** (standard projektu). To definiuje
   pikselową siatkę do weryfikacji.
2. Zdefiniuj **symbols** w `<defs>` (góra, wulkan, drzewo, bagno, miasto,
   ruina, hedron) — dzięki `use href="#..."` jedna definicja, wiele instancji.
3. Każdy kontynent = osobny `<path>` z `fill` i `stroke`. **Dobrze dobierz
   geometrię od razu** — patrz „pułapka #3" niżej.
4. Morze = pełny `<rect>` na spodzie (`fill="#ccd8d2"`), potem kontynenty.
5. Etykiety: styl `text { paint-order: stroke; stroke: #f4ecd8; }` — biała
   obwódka pod tekstem, żeby napisy były czytelne nad symbolami.
6. **`fill-rule` SVG domyślnie = `nonzero`** (nie even-odd). To kluczowe —
   patrz pułapka #1.

---

## 2. Osadzanie podkładu w buildzie

Kod w `render-map.js` (`podkladSvgMarkup`) dekoduje base64 data-URI SVG do
**inline`<svg class="mapa-podklad">`**. Dzięki temu podkład jest wektorem
i przerysowuje się ostro w każdym zoomie. Dla T3 **zawsze wstrzykuj inline**,
nie jako `<img>` z bitmapą.

- Reguła budowania: `podklad.svg` → base64 w `dist/`. Sprawdź, że zmiana trafiła
  do builda: zdekoduj data-URI i szukaj znacznika (np. `M 858,1155`).

---

## 3. Weryfikacja pozycji — używaj PRAWDZIWEJ maski pikselowej (nie parsera)

To najważniejsza pułapka całej sesji.

### Pułapka #1 — parser even-odd ≠ render SVG

**Objaw:** POI „wygląda na lądzie" w edytorze, ale w renderze ląduje na morzu
(np. Lake Jast, Slab Haven, Spike Fields, Bojuka Bog u nas).

**Przyczyna:** sprawdzałeś point-in-polygon parserem even-odd, a SVG używa
**nonzero**. Przy samo-przecinających się konturach (a nasza wschodnia linia
brzegowa się przecinała) nawet-odd zwraca inny wynik niż render.

**Reguła:** nigdy nie ufaj parserowi. Renderuj SVG i badaj **rzeczywiste
piksele**. To jedyna prawda dla tego pliku.

### Jak renderować do pikseli (Node, bez Python-Pillow)

`pip install pillow` może się nie udać (PEP 668 externally-managed). Użyj
`@resvg/resvg-js` (zero-dep, czysty Node):

```js
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const r = new Resvg(fs.readFileSync('maps/<plan>/podklad.svg'),
                    { fitTo: { mode: 'width', value: 2000 } });
const img = r.render();                 // tryb width:2000 → 2000×1400
fs.writeFileSync('_px.raw', Buffer.from(img.pixels));  // RGBA 11,200,000 B
```

`img.pixels` to surowe RGBA — od razu można badać kolory, bez PNG-kodera.

### Kolory-sygnatury (dla Zendikaru)

| Element | Kolor RGB |
|---|---|
| Ląd `#e8dbb8` | `(232,219,184)` |
| Lodowiec Sejiri `#eef0e6` | `(238,240,230)` |
| Ocean `#ccd8d2` | `(204,216,210)` |
| Halimar/jeziora `#b9cdd8` | `(185,205,216)` |
| Symbol (góra/miasto/…) | **dowolny inny** |

**Ważne:** symbol rysowany JEST nad lądem, więc nadpisuje piksele lądu
kolorem symbolu. Dlatego test „czy to ląd" musi być: **czy piksel NIE jest
morzem** (`(204,216,210)` lub `(185,205,216)`), a nie „czy to dokładnie
`#e8dbb8`". Inaczej wierzchołek góry „wychodzi na wodę".

### Wzorzec weryfikacji miejsca (funkcja `landfrac`)

```python
SEA_A=(204,216,210); SEA_B=(185,205,216)
def is_land(x,y):
    c=rgb(x,y); return c is not None and c!=SEA_A and c!=SEA_B
def landfrac(cx,cy,r=14):
    n=t=0
    for dx in range(-r,r+1,2):
        for dy in range(-r,r+1,2):
            t+=1
            if is_land(cx+dx,cy+dy): n+=1
    return n/t   # >0.7 = pewny ląd
```

- **Punkt → `landfrac`** (r≈14): >0.7 = ląd.
- **Jezioro** (wewnętrzne): sprawdź, że **centrum = kolor jeziora** i że
  **pierścień wokół (r=16..24) jest 100% lądu** — tj. jezioro jest otoczone
  lądem, nie łączy się z oceanem.
- **Linia brzegowa** (zatoka, cypel): poziomą/poziomą maskę ASCII wokół.

---

## 4. Pułapki geometrii (żadnego „przerysuję później")

### Pułapka #2 — pixelacja przy zoomie OD RAZU, nie po fakcie

**Objaw:** elementy wektorowe (nowo dodane) rysują się ostro, ale stare
(strzałki, płaszczyzny) pikelują w zoomie.

**Przyczyna:** `.mapa-ruch { will-change: transform }` — przeglądarka
kaszuje warstwę jako bitmapę i ją skaluje (soft render). Dodanie
`will-change` „dla wydajności" psuje wektor.

**Reguła:** w `.mapa-ruch` **NIE** dodawaj `will-change`, `backface-visibility`,
`translate3d`/`scale3d` (te wymuszają GPU-rasteryzację). Zostaw czysty
`transform-origin: 0 0`. Inline SVG wtedy przerysowuje się ostro w każdym
zoomie. **To dotyczy całej mapy, nie tylko nowych elementów.**

### Pułapka #3 — samo-przecinające się kontury i „ogony"

**Objaw:** linia brzegowa przecina samą siebie; kontynent ma „ogon" wchodzący
w morze; sąsiadujące lądy nachodzą na siebie (Murasa/Guul Draz, Agadeem/Ondu).

**Przyczyna:** kontur klecony punktami bez sprawdzenia
samo-przecieć i bez odstępu od sąsiadów; `nonzero` przy samo-przecieciu
ukrywa prawdziwą linię brzegową.

**Reguła:** kontynent = **jeden domknięty, prosty wielokąt** (bez
samo-przecieć). Między lądami zostaw **wyraźną cieśninę** (weryfikuj pikselem:
odstęp ≥ kilka px). Jeśli sąsiedzi to osobne wyspy (kanonicznie), to MAJĄ
mieć wodę między sobą. „Ogon" = wada rysowania, usuń.

### Pułapka #4 — etykiety i symbole wchodzące na siebie

**Objaw:** dwa sąsiednie POI nachodzą (u nas: pd. Murasa: Kazandu /
Living Spire / Singing City / Sunder Bay; wsch. Akoum: Kargan Lands /
Ora Ondar / Khalni Heart).

**Reguła:** po każdej zmianie **renderuj i oglądaj crop** danego regionu.
Najpierw rozłóż symbole (góry/miasta), potem etykiety tak, by się nie stykały.
Małe wysepki (Beyeen, Jwar) mają za mało miejsca — nie dokładaj tam POI,
które by się zderzyły; używaj istniejącego symbolu (np. wulkan) jako
reprezentacji regionu.

### Pułapka #5 — „belki" / osierocone segmenty

**Objaw:** pojedynczy ukośny segment na środku pustkowia (u nas: kreska
Makindi Trench), albo gruba tama odcięta od brzegu.

**Przyczyna:** element rysowany osobno, bez kontekstu (kanion z dwóch
oddalonych kresek; tama nie dotykająca linii brzegowej).

**Reguła:** kreski kanionu scałkuj w **jedną ciągłą ścieżkę**; tama/fort
podłącz do linii brzegowej (przedłuż do styku z wodą). Samotny odcinek
bez kontekstu usuń albo połącz.

---

## 5. Koordynaty „zero-cośtam" (wirtualny układ współrzędnych)

Fanowskie opisy często podają POI w układzie punktu (0,0). Dla Zendikaru
warianty miały np. „(0,0) = środek mapy", „oś X −10..+10", „oś Y +10..−10".
To **nie są współrzędne SVG** — to opis względny.

**Jak je interpretować (szybko):**

- Znajdź, gdzie w przyjętym podkładzie mapuje się (0,0) i rozpiętość osi.
- POI o współrzędnej `[X:+7, Y:+9]` = daleki wschód + daleka północ
  (górny prawy róg) — nie licz pikseli, tylko względne położenie.
- Mapuj na własny kontynent po **stronach świata i sąsiedztwie**:
  „na wschód od X", „na płd.-zach. wybrzeżu", „między A i B".

Nie próbuj przeliczać X↔piksele liniowo — układy bywają różnie zorientowane
(u nas warianty różniły się tym, czy Murasa jest NW czy NE).

---

## 6. Pipeline: krok po kroku

1. **Ustal drabinę źródeł** (§0) i zapisz w `map.json`.
2. **Napisz podkład T3** (§1): symbols, kontynenty jako proste wielokąty,
   morze na spodzie, etykiety z halem.
3. **Zrenderuj piksele** (§3, `px.js`) i zbuduj `_px.raw`.
4. **Weryfikacja siatki**: dla każdego POI policz `landfrac`; jeziora —
   pierścień 100% lądu.
5. **Rozłóż symbole, potem etykiety** (§4 #4), renderuj crop i sprawdzaj.
6. **Osadź inline** (§2), zbuilduj, zdekoduj data-URI i potwierdź znacznik.
7. **`npm test` + `npm run build`** zielone; weryfikacja **bez `will-change`**
   w `dist/` (§4 #2).
8. **Zarejestruj POI** w `map.json` (kotwice/elementy) z `pozycja_zrodlo`.
9. **Pinezki kart** — wsp. znormalizowane 0–1 (=piksel/2000, /1400), z
   `uzasadnienie` lore (protokół MA4).
10. **Zachowaj / wypchnij.** Zawsze `git push` — nie zostawiaj pracy tylko
    w workspace (patrz LESSONS.md L2).

---

## 7. Checklista przed „gotowe" (odpowiaj na każde TAK/NIE)

- [ ] Drabina źródeł zapisana (`kanon > fan #1 > fan #2/#3`)?
- [ ] Każdy kontynent = prosty, domknięty wielokąt, bez samo-przecieć?
- [ ] Cieśniny między sąsiednimi lądami ≥ kilka px (weryfikacja pikselem)?
- [ ] Każde POI ma `landfrac > 0.7` (albo jest otoczonym jeziorem)?
- [ ] Jeziora wewnętrzne w 100% otoczone lądem (nie łączą się z oceanem)?
- [ ] Etykiety nie nachodzą (renderowany crop, nie w pamięci)?
- [ ] Brak samotnych segmentów/belek (kaniony scalone, tama przy brzegu)?
- [ ] `dist/` **bez** `will-change`/`translate3d`/`backface` w `.mapa-ruch`?
- [ ] Build wstrzykuje inline SVG (zdekodowany data-URI zawiera nowy znacznik)?
- [ ] `npm test` + `npm run build` zielone?
- [ ] `git push` wykonany; remote = HEAD?

---

## 8. Narzędzia pomocnicze (skopiuj do `tmp-rsvg/` per sesja)

Sandbox nie trzyma `node_modules` między sesjami — zainstaluj na nowo:

```bash
mkdir -p tmp-rsvg && cd tmp-rsvg && npm init -y && npm install @resvg/resvg-js
```

`render.js` (PNG podgląd):
```js
const { Resvg } = require('@resvg/resvg-js'); const fs=require('fs');
const r=new Resvg(fs.readFileSync(process.argv[2]),{fitTo:{mode:'width',value:+process.argv[4]||1600}});
fs.writeFileSync(process.argv[3], r.render().asPng());
```

`px.js` (surowa maska):
```js
const {Resvg}=require('@resvg/resvg-js'); const fs=require('fs');
const r=new Resvg(fs.readFileSync(process.argv[2]),{fitTo:{mode:'width',value:2000}});
const img=r.render(); fs.writeFileSync(process.argv[3], Buffer.from(img.pixels));
```

**Crop regionu do PNG** (resvg nie ma crop-by-viewBox — użyj surowych pikseli
+ zlib: zbuduj IHDR/IDAT/IEND ręcznie). To pozwala oglądać fragment mapy
w powiększeniu.

---

## 9. Czego NIE robić (blokery tej sesji)

- **Nie** `pip install pillow` (PEP 668) — użyj Node `@resvg/resvg-js`.
- **Nie** crop-by-viewBox w resvg (`geom.rs unwrap None`) — operuj na
  `img.pixels`.
- **Nie** używaj `will-change`/GPU-scale na warstwie zoomu.
- **Nie** polegaj na point-in-polygon even-odd — tylko render-piksele.
- **Nie** skaluj fanowskiego układu współrzędnych 1:1 na podkład.
- **Nie** dokładaj POI na mikro-wysepki (Beyeen/Jwar) — będzie kolizja etykiet.
- **Nie** zostawiaj `_px.raw`, `_view.png`, `tmp-rsvg/` w repo — to artefakty
  robocze (gitignore/usuń).

---

## 10. Weryfikacja geomeotryczna bez renderowania (`tools/map-audit.py`)

> Wniosek z audytu mapy Zendikaru 2026-09-01 (zgłoszenia właściciela a–j
> + 7 błędów znalezionych skryptem): render-piksele (§3) są dobre do
> smoke-testu, ale **kolizje etykiet i „nazwa w wodzie" łapie tanio
> geometria**. Od tej pory standard passu mapowego (ADR 0015 pkt 3):

```bash
python3 tools/map-audit.py [plan] [--woda="Nazwa1,Nazwa2"]
```

Sprawdza: etykiety na lądzie (PIT po spłaszczeniu Beziera), kolizje par
etykiet (bbox ≈ 0.62·fs·znaki), markery na lądzie, pinezki kart
z `map.json` na lądzie; kotwice w wodzie raportuje informacyjnie.
Kod wyjścia 1 = problemy (gotowe pod CI). Mapy liniowe (T2, adoptowane)
są pomijane w testach na-lądzie z adnotacją.

### Reguły wynikające (obowiązkowe przy rysowaniu i poprawkach)

1. **Etykieta POI zawsze z markerem** — osierocona etykieta „niczego
   się nie tyczy" (zgłoszenie i: Ikiral, Emeria).
2. **Tytuły kontynentów (fs 40+) mają strefę ~110 px** — etykiety POI
   nie wchodzą w pas tytułu; tytuł lepiej trzymać przy krawędzi
   kontynentu lub nad gęstym wnętrzem.
3. **Obiekty wodne (zatoki, rowy, głębiny, przeprawy) kursywą** — wtedy
   „w wodzie" jest cechą, nie błędem; whitelisty w `map-audit.py`.
4. **PIT tylko po spłaszczeniu krzywych C** — punkty kontrolne Beziera
   dają fałszywe lądy/morza; fill bywa dziedziczony z `<g>` (wysepki!).
5. **Markery z `opacity` = celowe dryfowanie** (hedrony Emerii) —
   weryfikator je pomija; grupy z `transform` (legenda, kompas) też.
6. **Pozycja kanoniczna > ładniejsza pozycja**: Na Plateau wg Guide leży
   na wschód od środka Murasy, a Singing City w jej sercu — przekład
   geometrii pod kanon, nie odwrotnie (proweniencja w `map.json`).
7. **Rejestruj wszystko, co narysowane**: etykieta/marker bez wpisu
   w `kotwice`/`elementy` (i odwrotnie) to dług techniczny mapy
   ( Living Spire był rysowany, niezarejestrowany — domknięte).

---

## 11. mapforge — rysuj klockami, nie krzywymi (ADR 0018)

Od 2026-09-01 projekt ma własny, deterministyczny silnik mapowy:
`tools/mapforge/` (zero zależności; katalog klocków i schemat sceny —
`tools/mapforge/README.md`; demo: `maps/_warsztat/podklad.svg`).

Reguły użycia:

1. **Nowy element mapy planu = klocek ze sceny**, nie ręczny `<path>`
   (las → `las`, grzbiet → `pasmo`, rzeka → `rzeka` z `s0/s1`, szlak →
   `droga` typ `szlak` — kropki jak w line-art mapome, zatoka →
   `lukEtykieta`).
2. **Determinizm przez `id`**: zmiana jednego obiektu nie przetasowuje
   pozostałych; regeneracja daje identyczny SVG.
3. **Po każdym renderze**: `python3 tools/map-audit.py <plan>` — 0
   problemów obowiązkowe (oprawa jest zwolniona przez grupę
   z transformem).
4. **Migracja istniejących podkładów tylko wg
   `docs/plans/PLAN_2026-09-01-mapforge.md`** (E1–E3), nigdy „przy
   okazji" innego zadania.
