# PLAN 2026-09-01 — mapforge: adopcja glifów mapowych z projektów istniejących + rzeki w kolorze morza

> Zlecenie właściciela (2026-09-01, czat): (a) góry na Zendikarze mają wyglądać
> jak na mapie Śródziemia (wzór = podkład mapome); (b) rzeka ma ten sam kolor
> co morze i brak opacity (rozmywa się w morzu, nie tnie); (c) poszukać na
> GitHubie istniejących projektów z wektorowymi obiektami mapowymi i wykorzystać
> ich obiekty zamiast rysować od zera.

## Research (wykonany w tej sesji, przed kodowaniem)

Zbadane źródła (GitHub, licencja, styl, przydatność):

| Projekt | Licencja | Obiekty | Werdykt |
|---|---|---|---|
| **k1tesurfen/mapome** (już w repo — podkład Śródziemia, ADR 0009) | CC-BY-4.0 | ręcznie rysowane glify: góry (klaster 1–3 szczytów w jednej sylwetce), lasy, rzeki, miasta | **A. GŁÓWNE ŹRÓDŁO GLIFÓW GÓR** — to JEST wzorzec właściciela (screenshoty porównawcze pochodzą z tej mapy); adopcja = spójność z benchmarkiem ADR 0015 |
| **Azgaar/Fantasy-Map-Generator** | MIT | 171 symboli SVG (góry, śniegowe góry, wulkany, wzgórza, biomu, osady) jako `<defs>`+`<use>`; deterministyczny rozsiew (Poisson, sort po dolnej krawędzi) | B. kandydat na przyszłe obiekty (warsztat T4, E5): góry Azgaar są jasne/techniczne — NIE pasują do wzorca mapome, ale techniki (symbol + use, sort dolnej krawędzi) do wdrożenia |
| danprince/arda | brak licencji | mapy Tokien | odrzucone (brak licencji) |
| pozostałe (tide-pool-map, HandDrawnMap, dream-cartographer…) | brak/brak powiązania | małe aplikacje, nie biblioteki obiektów | odrzucone |

**Decyzja**: góry rysujemy glifami mapome (ekstrakcja ~30 sylwetek z grupy
`mountains_and_forests` podkładu w repo, normalizacja do ramki lokalnej);
Azgaar zostaje zapisanym kandydatem na kolejne klocki (z atrybucją przy adopcji).

## Kroki

1. ✅ Roadmapa + PR (ten plik).
2. ADR 0020 — adopcja wektorowych obiektów mapowych (źródła, licencje, atrybucja,
   zakres, techniki rozsiewu).
3. Ekstrakcja glifów → `tools/mapforge/glify-mapaome.mjs` (dane + nagłówek licencji;
   skrypt ekstrakcji jednorazowy, w sandboxu).
4. Przepis `szczyt()`/`pasmo()` w `bloki.mjs` na glify adoptowane (deterministyczny
   rozsiew wzdłuż grzbietu: rozmiar wg waży sin(), odbicia, jitter, sort po dolnej
   krawędzi — technika Azgaara; zachowana klasa `mf-szczyt` i kotwice data-x/y dla
   map-auditu).
5. Rzeka: kolor = kolor akwenu (morze `PAL.woda`, jezioro `PAL.wodaGleb`), brak
   gradientu i opacity (właściciel 2026-09-01); aktualizacja `render.mjs` i testów.
6. Regeneracja `maps/zendikar/podklad.svg` + demo `maps/_warsztat/`; `map-audit` 0;
   `npm test` + `npm run build` zielone; atrybucja w `maps/zendikar/map.json`.
7. Dokumentacja: mapforge README (rozdział adopcji), SKILL_MAPA_PLANU,
   PROJECT_HISTORY, ROADMAP, co-nowego, handoff, opis PR.

## Kryterium sukcesu

Właściciel widzi na Zendikarze góry nieodróżnialne stylistycznie od mapy
Śródziemia (ten sam język rysunku), rzeki płynące w kolorze morza i zlewające
się z nim przy ujściu.
