# ADR 0018: Wspólny silnik mapowy `mapforge` — deterministyczny render SVG z danych (warsztat T4)

- **Status:** Zaakceptowana
- **Data:** 2026-09-01
- **Decydenci:** właściciel projektu (zlecenie: „reużywalne klocki — biomy, drogi,
  rzeki, jeziora, nazwy pod kątami; jakość ≥ mapa Śródziemia"); agent Arena
  (sesja PR-7)
- **Powiązania:** ADR 0015 (krok 4 pkt 4–5: warsztat rysowania i wspólny
  silnik T4), ADR 0008 (paleta pergaminu), `SKILL_MAPA_PLANU.md`,
  `tools/map-audit.py`

## Kontekst

Dotychczasowe podkłady (Zendikar T3) są rysowane ręcznie: kontynenty
jako pojedyncze `<path>`, POI jako instancje siedmiu prostych symboli
`<defs>`, rzeki jako pojedyncze krzywe o stałej grubości. To wystarcza
do czytelności, ale (1) każdy obiekt jest jednorazowy — nic się nie
reużywa, (2) jakość jest daleka od punktu odniesienia (adoptowany
podkład Śródziemia, T2), (3) koszt każdej kolejnej mapy nie spada.

Właściciel zlecił rozpoczęcie pracy nad wspólnym, reużywalnym
środowiskiem rysowania map wektorowych.

## Research (co istnieje i czemu nie pasuje 1:1)

- **Azgaar Fantasy Map Generator** (MIT, TS + D3, ~20k ★) — najdojrzalszy
  open-source'owy projekt kartografii fantasy. To jednak **generator
  proceduralny**: tworzy *losowe* światy (heightmapy → biomy → rzeki →
  etykiety). Nasz przypadek jest odwrotny: **geografia jest dana przez
  kanon** (kontynenty, rzeki i miasta Zendikaru mają ustalone położenie
  z lore) — potrzebujemy *renderera danych*, nie generatora świata.
  Architektura Azgaara (rozdział: dane świata / generatory / renderery)
  potwierdza kierunek; implementujemy własny, minimalny odpowiednik
  warstwy „renderer".
- **d3.js / Tangram / Cesium** — silniki wizualizacji danych geograficznych
  (rzeczywistych, projekcje). Za ciężkie i nastawione na WebGL/geoJSON
  świata realnego; nasza skala to jeden SVG na plan.
- **mapome (podkład Śródziemia, T2)** —analiza kodu: elegancki line-art,
  jakość z trzech rzeczy: **dwie fonty display** (Mirza, Playfair Display),
  **linia kropkowana** (`stroke-dasharray 0,9`), **dyscyplina grubości**
  (2/3/5 px) i gęste, regularne „haczury" (grupy mountains_and_forests).
  Wniosek: jakość = spójny system stylu + typografia, nie skomplikowane
  filtry.

**Decyzja researchowa:** nie forkujemy i nie zależymy od niczego —
piszemy własny, **bezależnościowy** moduł ESM (repo nie ma zależności),
czerpiąc *techniki* (zwężające się rzeki, seryjne ikony biomów, etykiety
z halo i pod kątem, kropkowane szlaki, dyscyplina grubości linii).

## Decyzja

**`tools/mapforge/` — deterministyczny silnik „scena → SVG".**

1. **Wejście:** deklaratywna scena JSON (lub obiekt JS): lądy (`d`
   z istniejących podkładów lub punkty do wygładzenia), biomy (las,
   bagno, step, lod), pasma górskie (linia grzbietu), rzeki (linia
   + szerokości początkowa/końcowa, dopływy), jeziora, drogi/szlaki,
   POI (miasto, ruina, wulkan, hedron), etykiety (proste, pod kątem,
   po łuku), kompas, legenda, skala, ramka.
2. **Wyjście:** warstwowy SVG w palecie pergaminu ADR 0008, z komentarzami
   warstw, gotowy pod `tools/map-audit.py` (audytuje etykiety/markery).
3. **Determinizm:** generator pseudo-losowy mulberry32 inicjowany
   **stabilnym hashem id obiektu** — rozsiew lasu czy układ szczytów
   są powtarzalne i **nie przetasowują się** przy edycji sąsiedniego
   obiektu (czysty diff w git).
4. **Klocki = funkcje** (`bloki.mjs`): każda zwraca fragment SVG
   i może być używana niezależnie (także do doklejania warstwy
   do istniejącego, ręcznego podkładu — ścieżka adoptowania
   bez wielkiego przepisu).
5. **Adopcja stopniowa, nie rewolucja:** (a) demo-warsztat pokazuje
   pełny katalog klocków; (b) nowe elementy Zendikaru rysujemy już
   mapforge'em (warstwa po warstwie); (c) pełna regeneracja podkładu
   planu jako osobne zadanie z roadmapą (`docs/plans/`), z oceną
   właściciela względem mapy Śródziemia (benchmark ADR 0015).
6. **Zero zależności** i zero kodu z zewnątrz — tylko nasze GPL-brak,
  MIT-inspiracje zacytowane w tym ADR.

## Konsekwencje

**Dodatnie:** koszt kolejnej mapy spada (klocki + scena zamiast
ręcznego SVG); jakość ustandaryzowana i mierzalna (map-audit na
wygenerowanym pliku); stabilne diff-y; Śródziemie przestaje być
nieosiągalnym wzorcem, bo techniki (typografia, kropki, dyscyplina
linii) są w silniku.

**Ujemne:** silnik to nowy kod do utrzymania (testy jednostkowe
w `test/mapforge.test.mjs`); pełna migracja Zendikaru nie następuje
od razu (ryzyko regresji wizualnej mapy już zaakceptowanej
przez właściciela); efekty „czytelności" oceniamy benchmarkiem
i okiem właściciela, nie testem.

**Dla sesji:** demo silnika żyje w `maps/_warsztat/` (katalog poza
planami; build i statystyki go ignorują, `map-audit` — celowo — audytuje).
