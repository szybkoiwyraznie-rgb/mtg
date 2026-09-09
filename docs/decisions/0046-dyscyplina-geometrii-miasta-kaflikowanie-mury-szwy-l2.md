# ADR 0046: Dyscyplina geometrii miasta — kaflikowanie, mury poza obrysem, sztywne szwy L2

- **Status:** Zaakceptowana
- **Data:** 2026-09-09
- **Decydenci:** właściciel projektu (druga iteracja uwag do mapy Kaladeshu:
  biomy dzielnic na siebie nie włazą, las nie wchodzi na domy, mury nie tną
  dzielnic, zakaz „rozwiązywania” kolizji kasowaniem elementów); agent Arena
  (sesja PR-28, przebudowa LOD)
- **Powiązania:** ADR 0039 (piramida LOD / płyty-bbox), ADR 0015 (audytor map),
  ADR 0035 (warianty i kalibracja), ADR 0027 v3 (wektor inline vs drzewo),
  ADR 0045 (domyślny widok startowy)

## Kontekst

Jednowarstwowa mapa Ghirapuru (14 MB) miała trzy wady strukturalne:
(1) biomy dzielnic zachodziły na siebie, (2) las Cowl wchodził na tkankę
domów, (3) mury przecinały dzielnice w połowie. Właściciel odrzucił
skoroszyt i wybrał ścieżkę Dominarii: lekki plan + detal miasta jako
osobna płyta L2 dokładana od progu zooma — oraz twarde reguły geometrii
miasta (egzekwowane testem, nie okiem).

## Decyzja

1. **Kaflikowanie dzielnic.** Sąsiadujące dzielnice stykają się
   krawędziami (wspólne wierzchołki, zero szczelin), nigdy się nie
   nakładają. Parki i wody wewnątrzmiejskie są osobnymi kaflikami.
2. **Las nie wchodzi na domy.** Poligon leśny i poligon tkaniny
   (domów) są rozłączne; las łęgowy jest kaflikiem jak każdy inny.
3. **Mury poza obrysem.** Mur stoi na zewnątrz dzielnic (z bramami
   i przerwami na rzeki); żaden wierzchołek muru nie leży we wnętrzu
   dzielnicy i żaden odcinek muru jej nie przecina.
4. **Zakaz fix-by-deletion.** Kolizji nie rozwiązuje się kasowaniem
   ani odsuwaniem elementów (Aleja Olbrzymów wróciła pod bramy i
   koegzystuje z murami).
5. **Szew L2 jest sztywny.** Płyta L2 (`scena.nakladka` = id wariantu):
   rzeka cięta krawędzią płyty kończy/zaczyna się DOKŁADNIE na osi
   planu w szwie (±1 j.) z DOKŁADNIE stożkową szerokością planu
   w cięciu (±0,05); we wnętrzu linearyzuje profil między cięciem
   a czubkiem (0,12·s). Aspekt bbox = aspekt płyty (±1e-6).
6. **Test ścisły.** Nakładka = wierzchołek >0,5 j. we wnętrzu drugiego
   poligonu albo WŁAŚCIWE przecięcie krawędzi (ścisłe rozejście obu par
   końców). Wspólne krawędzie i styki wierzchołkowe to nie błąd.

## Konsekwencje

- `tools/map-audit.py` pkt 8–9: geometria miasta w scenach (plan + L2)
  i audyt SVG płyt L2; brama pakietu (`test/map-audit.test.js`).
- `sprawdzHydrologie` zwalnia końce rzek na krawędzi płyty L2
  (`render.mjs`; rzeka w środku płyty to nadal błąd).
- Szew wodny pilnuje test w `test/lod.test.js` (pozycja + szerokość
  z formuły `wstega` po chaikinie, nie z obrazka).
- Wektorowa płyta L2 jest wyjątkiem od ADR 0027 v3: nie jest inlinowana
  (`build.mjs` kopiuje ją do drzewa — leniwy `<img>` musi ją znaleźć).
- Wariant L2 w `map.json` niesie `bbox` + `kalibracja` (odwrotność bbox,
  waliduje test ADR 0035) + `scena` (jawna ścieżka sceny płyty).
