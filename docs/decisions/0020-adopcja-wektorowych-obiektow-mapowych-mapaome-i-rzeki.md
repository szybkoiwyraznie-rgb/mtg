# ADR 0020: Adopcja wektorowych obiektów mapowych — glify mapome (góry) + techniki Azgaar; rzeki w kolorze morza

- **Status:** Zaakceptowana
- **Data:** 2026-09-01
- **Decydenci:** właściciel projektu (zlecenie 2026-09-01, czat: punkt (c) —
  „poszukanie na githubie istniejących projektów z wektorowymi obiektami do
  map … wykorzystać jego część (same obiekty) albo całość”; punkt (b) —
  „rzeka miała ten sam kolor co morze i brak opacity”; punkt (a) — góry mają
  wyglądać jak na mapie Śródziemia); agent Arena (sesja, research i
  implementacja)
- **Powiązania:** ADR 0018 (silnik mapforge, zero zależności — adopcja nie
  łamie reguły: przenosimy DANE (ścieżki SVG), nie kod zależny), ADR 0009
  (mapome CC-BY-4.0 w repo), ADR 0015 (benchmark jakości = mapa Śródziemia),
  ADR 0019 (motyw atlasowy), ADR 0012/0013 (proweniencja w map.json)

## Kontekst

Klocki gór mapforge (`szczyt`/`pasmo` w `tools/mapforge/bloki.mjs`) były
rysowane syntetycznie (trójkąty z pionową kreskowatą). Właściciel po obejrzeniu
mapy Zendikaru odrzucił efekt wprost („nie jest to co widzę na mapie
Śródziemia … różnica jest dyskwalifikująca”) i zlecił zmianę kierunku:
przestać odkrywać koło, a **poszukać na GitHubie istniejących projektów z
wektorowymi obiektami do map** i wykorzystać ich obiekty.

Research (2026-09-01, tabela w `docs/plans/PLAN_2026-09-01-glify-mapaowe-i-rzeki.md`):

1. **mapome** (k1tesurfen, **CC-BY-4.0**) — źródło podkładu Śródziemia, już w
   repo (ADR 0009, z atrybucją). Jego góry to ręcznie rysowane sylwetki
   klastrów 1–3 szczytów, gęsto nakładające się wzdłuż grzbietu — **dokładnie
   ten styl, którego wymaga właściciel** (zobaczony benchmark = zrzut tej
   mapy). Biblioteka glifów: ~290 sylwetek w grupie `mountains_and_forests`.
2. **Azgaar/Fantasy-Map-Generator** (**MIT**, licencja weryfikowana z pliku
   LICENSE — jawnie zezwala na prace pochodne) — 171 symboli SVG w
   `src/index.html` (góry, góry śniegowe, wulkany, wzgórza, biomu, osady).
   Styl gór: jasne sylwetki z fasetą — techniczny, **nie pasuje** do wzorca
   mapome, ale architektura (symbol `<defs>` + `<use>`, deterministyczny
   rozsiew, **sortowanie ikon po dolnej krawędzi**, żeby bliższe rysowały się
   na wierzchu) jest do wdrożenia.
3. Pozostałe kandydaty (arda — brak licencji; tide-pool-map, HandDrawnMap,
   dream-cartographer — aplikacje, nie biblioteki obiektów) — odrzucone.

Równolegle właściciel skorygował rzeki: bieżąca implementacja (gradient
wprowadzony w PR-5 jako „rozpływanie” ujścia) to nie to — **rzeka ma mieć ten
sam kolor co morze i brak opacity**, dzięki czemu zlewa się z morzem na
ujściu.

## Decyzja

1. **Glify gór mapforge pochodzą z mapome (adopcja danych, nie kodu).**
   Z grupy `mountains_and_forests` podkładu w repo (`maps/srodziemie/
   podklad.svg`, niezmienny snapshot CC-BY-4.0) wyekstrahowano zbiór
   ~30 sylwetek (klastery 1–3 szczytów, różne skale), znormalizowanych do
   ramki lokalnej; zbiór żyje w `tools/mapforge/glify-mapaome.mjs` z
   nagłówkiem licencji i źródła. Ekstrakcja jest jednorazowa i
   reprodukowalna z pliku w repo (scena → glify), więc proweniencja w pełni
   weryfikowalna w gicie.
2. **Klocki `szczyt`/`pasmo` rysują wyłącznie glifami adoptowanymi** (bez
   syntetycznych trójkątów). Rozsiew wzdłuż grzbietu (techniki z researchu):
   gęste nachodzenie, rozmiar ważony sinusem długości grzbietu, odbicie
   lustrzane, mały jitter; kolejność rysowania wg **dolnej krawędzi**
   (technika Azgaar) — bliższe szczyty na wierzchu. Determinizm jak dotąd
   (rng z hasha id, ADR 0018 pkt 3). Klasa `mf-szczyt` i kotwice `data-x/y`
   bez zmian (map-audit, testy).
3. **Rzeka w kolorze akwenu, bez gradientu i bez opacity** (decyzja
   właściciela 2026-09-01): ujście w morze → kolor morza (`PAL.woda`),
   ujście w jezioro → kolor jeziora (`PAL.wodaGleb`), rzeka kończąca się na
   lądzie → kolor morza. Gradient znika z silnika (zastąpiony decyzją, nie
   „poprawiony”).
4. **Azgaar = zapisany kandydat na kolejne klocki** (warsztat T4, kolejka
   E5: cytadela/fort, latarnia, wrak, wodospad, obwódki haseł). Adopcja
   konkretnego symbolu następuje z atrybucją (MIT: copyright + MIT w nagłówku
   pliku docelowego) i aktualizacją map.json — nie wcześniej.
5. **Proweniencja** (ADR 0013): `maps/zendikar/map.json` dostaje pola o
   źródle glifów (mapome, CC-BY-4.0, grupa, data ekstrakcji); atrybucja w
   stopce mapy pozostaje bez zmian (mapome i tak jest źródłem benchmarku —
   atrybucja Śródziemia pokrywa autora); strona planu Zendikar nie wymaga
   zmian (deklaratywne: rekonstrukcja T4, nie dotyczy źródeła glifów).
6. **Zero zależności (ADR 0002) zachowane**: w repo wchodzą pliki danych
   (ścieżki SVG) i nasz kod; żaden pakiet npm, żaden silnik zewnętrzny.

## Konsekwencje

**Dodatnie:** góry Zendikaru (i przyszłych map T4) mają JĘZYK RYSUNKU
wzorcowego (mapome) — spójność z benchmarkiem ADR 0015 zbudowana przez
konstrukcję, nie przez iteracje „na oko”; koszt kolejnych map spada
(glify = dane); rzeki zlewają się z morzem zgodnie z zamyślem właściciela.

**Ujemne:** glify mapome to dane ad-hoc (30 sylwetek, nie parametryzowany
model góry) — pełna regeneracja mapy zmienia położenie glifów (deterministyczne
danej sceny, ale nieparametryczne pod kątem kształtu); licencja CC-BY-4.0
wymaga atrybucji przy ewentualnym upublicznieniu projektu (już uregulowana
ADR 0009).

**Dla sesji agentskiej:** nowych glifów nie rysuje się ręcznie w scenie —
rozszerza się bibliotekę `glify-mapaome.mjs` (ekstrakcja z podkładu) lub
adoptuje symbol z zapisanego kandydata (pkt 4) z atrybucją; styl gór
ZENDIKARU i przyszłych map T4 = glify mapome, nie syntetyka.
