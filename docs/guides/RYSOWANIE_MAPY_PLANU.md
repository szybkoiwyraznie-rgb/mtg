# Rysowanie mapy planu od podstaw (warsztat T4 / mapforge) — podręcznik

> **Dla kogo:** agent, który ma narysować mapę NOWEGO planu (T4,
> silnik mapforge). Ten dokument zbiera całą wiedzę z wielogodzinnych
> rund poprawek nad mapą Zendikaru (PR-9/PR-10, recenzje właściciela
> 1–7). Zasady są WIĄŻĄCE — każda ma źródło w ADR.
>
> Ery wcześniejsze (T3, ręczne SVG) opisuje `SKILL_MAPA_PLANU.md`;
> proces decyzyjny wariantów map — `PROCES_MAP.md`.

## 0. Mapa decyzji (przeczytaj zanim narysujesz kreskę)

| ADR | Co ustala |
|---|---|
| 0018 | mapforge: rysuj klockami, deterministycznie (rng z hasha id) |
| 0019 | motyw atlasowy: achromat R=G=B poza kolorami funkcyjnymi |
| 0020 | góry WYŁĄCZNIE glifami adoptowanymi (mapome, CC-BY-4.0); rzeki w kolorze akwenu |
| 0021 | JEDNA barwa wody; wiążąca kolejność warstw; szare miasta; pasmo = jedna bryła |
| 0022 | wzór etykiet: kotwica obiektu → ZAWSZE POD, konflikt → ZAWSZE NAD; strefy zajęte biomów |
| 0023 | twarde wiązanie etykieta↔obiekt + walidator `sprawdzWiazania` |
| 0024 | ikony miast/ruin w kołach z tłem; granat wód; trakty; glify pasm na lądzie |
| 0025 | warstwowe kolory pisma; napisy NAD lasem (bez polan); iglica/wodospad; drogi bez dubli |

Kanon treści: ADR 0010 (karta > lore świata > agent z cytowaniem) —
**nazw nie zmyślamy**. Obiekt bez kanonicznej nazwy NIE istnieje na
mapie (usuwamy dekorację, nie dorabiamy nazwy). Proweniencja każdej
pozycji → rejestr kotwic `maps/<plan>/map.json` (ADR 0013).

## 1. Model danych

- `maps/<plan>/scena.json` — jedyne źródło rysunku: `lądy` (d lub
  punkty), `jeziora` (elipsa `cx/cy/rx/ry` lub tafla `d`), `rzeki`
  (+`doplywy`), `pasma` (grzbiet punktami), `biomy` (las/bagno/step/
  lod), `poi` (miasto/ruina/hedron/wulkan/iglica/wodospad), `etykiety`,
  `drogi`, `kompas/skala/ramka`.
- `maps/<plan>/map.json` — rejestr kotwic (nazwa, pozycja 0–1, typ,
  `pozycja_zrodlo`, notka ze źródłem). KAŻDY nazwany obiekt ma tu wpis;
  każda korekta pozycji orientacyjnej = dopisek w notce.
- Render: `node tools/mapforge/cli.mjs maps/<plan>/scena.json -o
  maps/<plan>/podklad.svg` (styl w scenie: `"styl": "atlas"`).

## 2. Żelazne zasady rysunku

1. **Kolejność warstw (ADR 0021, niezmienna):** ocean → wybrzeża →
   lądy → jeziora → rzeki → góry → wulkany → biomy (NAD górami) →
   drogi → POI → etykiety → oprawa.
2. **Woda = jeden kolor** wszędzie (morze/jezioro/rzeka). Bez
   gradientów, bez opacity, bez obwódek rzek (próba z obwódką
   odrzucona — „język z obwódką" w ujściu). Rzeka zlewa się z akwenem
   samą identycznością barwy. Rzeka może zaczynać się W górach, ale
   NIE przecina pasma w poprzek.
3. **Góry tylko glifami adoptowanymi.** `pasmo()` układa jedną ciągłą
   bryłę; glify hero (g-016/g-237/g-270) wyłącznie jawnie przez
   `glifId` i NIGDY jako pomniejszona „ikonka" (pomniejszony klaster
   czyta się jak mikro-góry — odrzucone). Podstawa każdego glifu musi
   stać na lądzie (sprawdzane też na skrzydłach).
4. **Kaniony/rzeźbę też się rysuje:** nazwa formy terenu (np. kaniony)
   bez narysowanej formy = błąd; niski grzbiet `pasmo` z małym `szer`
   wystarcza.
5. **Ikony POI:** miasta i ruiny w KOLE z nieprzezroczystym tłem
   (nie giną w biomach); wulkan/iglica/wodospad rysowane od podstawy
   w punkcie (x, y). Nowe typy obiektów = nowy klocek ręcznie rysowany
   w języku mapy (czarna sylwetka / kolor linii wody), nie „najbliższy
   istniejący glif".
6. **Biomy nie zakrywają:** rozsiew las/bagno/step omija glify gór,
   wulkany, jeziora, lód, WCZEŚNIEJSZE biomy i ikony POI. Lita czapa
   (lód) vs góry — rozwiązuj w DANYCH (zmniejsz obszar czapy).
   **Napisów NIE omijamy** — etykieta leży NAD lasem z halo („polana"
   pod tytułem odrzucona).
7. **Biom to WIELOKĄT, nie kreska.** Zdegenerowany poligon
   (4 punkty prawie w linii) = kilkanaście drzew i „mikro-las".
   Puste połacie kontynentu wypełniaj biomem dopiero PO OBEJRZENIU
   renderu (nie zgaduj zasięgu lądu).
8. **Drogi:** łączą POI dotąd NIEpołączone; zanim dodasz — przeczytaj
   listę `drogi` w scenie (dublowanie korytarza = błąd); nie prowadź
   przez pasma; silnik i tak przycina do lądu.

## 3. Etykiety — jeden wzór (serce warsztatu)

1. **Twarde wiązanie (ADR 0023):** nie ma POI bez etykiety (wyjątek:
   nazwana GRUPA — POI tego samego typu ≤160 j. od opisanego, np.
   3 stożki „Teeth of Akoum"); nie ma etykiety bez twardego punktu
   (POI / jezioro / punkt WEWNĄTRZ nazywanego obszaru na lądzie);
   etykieta nie siada na cudzym POI (≤20 j.).
2. **Pozycjonowanie robi WZÓR, nie ręka (ADR 0022):** w scenie dajesz
   tylko `przyDo: [x, y]` (kotwica obiektu; bez przyDo = własny punkt).
   Silnik: napis ZAWSZE POD kotwicą (wyśrodkowany), konflikt → ZAWSZE
   NAD, dalej drabinka pionowa. Ręczne x/y etykiet obiektowych są
   nadpisywane. Etykiety obszarowe (fs≥16 bez przyDo, `duze`, obrócone
   `kat`) zostają, gdzie je postawisz.
3. **Strefy ikon są asymetryczne:** wulkan/iglica mają podstawę w
   punkcie — etykieta siada TUŻ POD bryłą, a duży prześwit jest tylko
   NAD (sylwetka). Nowy typ POI → uzupełnij `PROMIEN_POI` w render.mjs.
4. **Kolory pisma (ADR 0024/0025):** kontynenty/wyspy CZERŃ (`duze`
   automatycznie; wyspy przez `opcje.kolor`), wody GRANAT (lista
   `ETYKIETY_WODNE_KOLOR` — dopisz nowe!), fragmenty lasów/bagien
   ZIELEŃ (automat: kotwica w poligonie biomu, o ile nie nazywa POI),
   reszta bordo. Zielony automat = darmowy detektor: etykieta lasu,
   która została bordowa, ma kotwicę POZA lasem.
5. **Etykiety wodne** (zatoki, jeziora, wodospady, rzeki przy ujściu)
   mogą zwisać nad wodą — dopisz nazwę do `STREFY_WODNE_DOMYSLNE`
   (render.mjs) ORAZ `SPODZEANE_WODY` (tools/map-audit.py). Nazwy rzek
   wolno obracać wzdłuż biegu (`kat`).
6. **Podtytuły** `(...)` są wodno-neutralne i wolno im dzielić kotwicę
   z tytułem (para tytuł POD / podtytuł NAD obiektem).

## 4. Pipeline nowej mapy (kolejność pracy)

1. **Research:** kanoniczna geografia (Guide/wiki/karty) → notatka
   źródeł; pozycje wg hierarchii: kanon > fanmapy (warianty wg
   priorytetu ustalonego przez właściciela) > własna rekonstrukcja.
2. **Lądy** (kontury) → render → OBEJRZYJ raster.
3. **Jeziora i rzeki** (rzeka od gór/źródła do morza, nie przez pasmo).
4. **Pasma** (grzbiety punktami; sprawdź, że nie wchodzą w morze).
5. **Biomy** (wielokąty pokrywające realne połacie; lód nie na górach).
6. **POI + etykiety RAZEM** (każdy POI od razu z etykietą `przyDo`;
   nazwy tylko z kanonu; `map.json` od razu z proweniencją).
7. **Drogi** (niepołączone POI, bez dubli).
8. **Oprawa** (kompas, skala, ramka).
9. **Bramki jakości (wszystkie muszą dać ZERO/zielone):**
   - `node tools/mapforge/cli.mjs ... ` — stderr `[wiązania]` pusty,
   - `python3 tools/map-audit.py` — 0 problemów,
   - `npm test` (m.in. determinizm, achromat, rejestr wiązań).
10. **QA rastrowe** (sekcja 5) — obejrzyj KAŻDY kontynent zanim
    pokażesz właścicielowi. 11. `npm run build` + wpis co-nowego.

## 5. QA rastrowe (sharp/libvips — poza repo!)

```bash
mkdir -p /home/user/tmp/render && cd /home/user/tmp/render && npm i sharp
node -e "const sharp=require('sharp');
sharp('/home/user/mtg/maps/<plan>/podklad.svg',{density:300})
  .resize(4000).png().toFile('full.png')  // resize = jawna skala!
  .then(()=>sharp('full.png').extract({left:X*2,top:Y*2,width:W*2,height:H*2}).toFile('wycinek.png'));"
```
- **`density` NIE jest skalą** (liczy od 72 dpi; 300 ≈ ×4,17) —
  zawsze `resize(szerokość)` i przeliczaj wycinki od niej
  (mapa 2000 szeroka → resize 4000 → współczynnik 2).
- Wycinki per kontynent + rejony zagęszczone; scratch w
  `/home/user/tmp` (katalog scratch trzymaj POZA repo).

## 6. Debug rozstawu etykiet (gdy audyt zgłasza kolizje)

- **Nie zgaduj — replay.** Bbox etykiety jest SZERSZY niż myślisz:
  połowa szerokości = `len(tekst)·fs·0,31` (np. „Blackbloom Lake"
  fs14 ⇒ ±65 j.). Kolejność układania: obszarowe (rejestrują boxy) →
  obiektowe sortowane po (ay, ax, tekst).
- Skrypt-replay: odtwórz `polozone` w kolejności i wypisz dla
  problematycznej etykiety wszystkie 12 szczebli (cy, konflikt-z-kim,
  dotyk lądu) — wzorzec w PROJECT_HISTORY 2026-09-02 (część 5).
- Zator = ZA DUŻO nazw na jednej półce. Rozładowuj DANYMI: przesuń pozycję
  orientacyjną (z notką w rejestrze kotwic), zmniejsz fs drobnych wód
  do 12–13, pozwól wodnej etykiecie zwisać nad wodą (whitelist).
  Wolne pozycje szukaj grid-searchem z symulacją rozstawu (warunek:
  „etykieta siada w POD0/NAD0, poza jeziorem, ≥26 j. od cudzych POI").

## 7. Nakładka Codexu (witryna) — kontrakt

- Silnik emituje na `<text>`: `data-ax/ay` (kotwica), `data-r`
  (prześwit POD), `data-rg` (prześwit NAD), fill = kolor pisma.
  Nakładka (`src/codex/render-map.js`) liczy pozycję od EKRANOWEJ
  pozycji kotwicy (odstęp `r·k` + 3 px — wizualnie stały przy każdym
  zoomie) i przenosi kolor INLINE (CSS klas NIE może go nadpisywać).
- Układ kolizyjny nakładki liczy się przy zmianie zoomu, tylko dla
  etykiet widocznych w LOD, i omija także tytuły obszarowe
  (przeszkody). **Nigdy nie inicjalizuj cache NaN-em** — porównanie
  z NaN jest zawsze false i wyłącza mechanizm po cichu (bug, który
  kładł „Emerię" na podtytule).
- Każda NOWA cecha stylu SVG (kolor, rozmiar, obrót) musi być JAWNIE
  przepompowana do nakładki, inaczej witryna pokaże co innego niż SVG.

## 8. Edycja scen — bezpiecznie

- `scena.json`/`map.json` edytuj TEKSTOWO (python, `assert count==1`,
  zapis dopiero po wszystkich assertach). `json.dumps` przeformatowuje
  cały plik i zaśmieca diff.
- Wartości bywają `1650` albo `1650.0` — wzorce toleruj oba warianty.
- KAŻDĄ nową pozycję sprawdź `naLadzie(x, y)` (pit na maskach lądów)
  ZANIM ją wpiszesz — „na oko brzeg" bywa morzem (audyt złapie:
  `FORGE W WODZIE`), a skrajne wiersze lądu bywają węższe, niż
  wyglądają (skanuj wiersze `#/.` jak w części 6 PROJECT_HISTORY).
- Po każdej zmianie: regeneracja + trzy bramki + (przy zmianach
  wizualnych) raster.

## 9. Antywzorce (wszystkie ODRZUCONE przez właściciela — nie wracać)

1. Wyszukiwanie pozycji etykiet w promieniach/kierunkach (16 kier.
   do 118 j.) — zastąpione wzorem POD→NAD.
2. Odsunięcia etykiet strojone ręcznie w jednostkach mapy — rozjazd
   przy zoomie w witrynie.
3. Obwódka rzek; osobny kolor jezior; gradient/opacity ujść.
4. „Polany": wycinanie biomu pod napisami.
5. Pomniejszony glif hero jako ikona pojedynczego obiektu.
6. POI-dekoracje bez kanonicznej nazwy; etykiety „wiszące na pustce";
   dwie etykiety do jednej ikony (poza parą tytuł+podtytuł).
7. Dublowanie dróg w korytarzu istniejącej; droga przez pasmo.
8. Rzeka przecinająca pasmo w poprzek; wodne nazwy czarne/bordowe.
9. Kreskowy „poligon" biomu; ikony toną w rozsiewie (strefy zajęte!).
10. Ładowanie pozycji bez `naLadzie`; edycja scen przez `json.dumps`.

## 10. Checklista końcowa (odpowiedz TAK na każde)

- [ ] wiązania: `[wiązania]` w stderr CLI puste? test rejestru 0 uwag?
- [ ] map-audit: 0 problemów (kolizje, woda, kotwice)?
- [ ] `npm test` + `npm run build` zielone?
- [ ] każdy POI ma etykietę (lub grupę), każda etykieta twardy punkt?
- [ ] kolory pisma: kontynenty czarne, wody granatowe, biomy zielone?
- [ ] pasma na lądzie? rzeki nie tną gór? biomy nie zakrywają rzeźby?
- [ ] drogi bez dubli? nowe POI w `map.json` z proweniencją i źródłem?
- [ ] rastery każdego kontynentu OBEJRZANE (nie tylko audyt)?
- [ ] wpis w `content/co-nowego.md` + decyzje właściciela w ADR?
