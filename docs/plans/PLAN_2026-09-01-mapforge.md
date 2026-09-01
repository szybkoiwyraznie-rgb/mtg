# PLAN: mapforge — adopcja wspólnego silnika mapowego (ADR 0018)

> Kontynuacja punktu 4 Pętli Jakości (ADR 0015): silnik istnieje
> (`tools/mapforge/`, demo w `maps/_warsztat/`). Ten plan prowadzi od
> demo do „każda mapa planu rysowana warsztatem T4".

## Etapy (każdy = osobny commit/PR, porządek od najtańszego)

### E1 — Kotwice → scena Zendikaru (dane, bez rysowania) ✅ 2026-09-01
- Wykonane: `tools/mapforge/e1-scena-zendikar.py` → `maps/zendikar/scena.json`
  (9 lądów z `d`/okręgów, 6 biomów z otoczek klastrów markerów — siatka
  200 px, 4 pasma z PCA grzbietów, 2 rzeki, 3 jeziora, 44 POI,
  74 etykiety z dziedziczeniem text-anchor).
- Wygenerować `maps/zendikar/scena.json` z istniejących danych:
  wybrzeża (`d` z podkładu), biomy (las Oran-Rief, bagna Bala Ged/
  Guul Draz, step, Sejiri jako lod), pasma (Akoum, Skyfang, Ered
  w Śródziemiu nie — adoptowany podkład), rzeki (Umara, Raimunza),
  jeziora (Glasspool, Jast, Blackbloom, Halimar), drogi/POI/etykiety
  z `kotwice`/`elementy`.
- Scena w repo obok podkładu = reprezentacja danych planu niezależna
  od stylu rysowania.

### E2 — Rendery próbne Zendikaru (obok, zamiast) ✅ 2026-09-01 (ocena właściciela)
- `maps/zendikar/podklad-forge.svg` (styl atlas, ADR 0019) renderowany
  ze sceny; `tools/map-audit.py` → 0 problemów (audytowane OBA podkłady).
- Produkcji nie ruszam do decyzji właściciela (E3 = podmiana).
- Render `podklad-forge.svg` z E1; `map-audit` musi przejść 0;
  porównanie z obecnym podkładem; decyzja właściciela.

### E3 — Migracja podkładu Zendikaru
- Podmiana `podklad.svg` (stary do `podklad-reczny.svg` na czas
  oceny); korekty kolizji po audycie; build + smoke test.

### E4 — Wzorzec dla nowych planów
- PROCES_MAP.md: nowe mapy (T3/T4) startują od sceny + mapforge;
  SKILL_MAPA_PLANU odsyła do katalogu klocków (już §11).

### E5 (opcjonalnie) — Warsztat rozszerzalny
- Klocki czekające na potrzebę: cytadela/fort, latarnia, wrak,
  wodospad na rzece, granice regionów (obwódki haseł, ADR 0015 pkt 6),
  hfyny/pionowe klify Ondu. Dopisywać wg zasad ADR 0018 (determinizm,
  audyt, zero zależności).

## Kryteria gotowości całości

- mapa planu rysowana w całości przez mapforge przechodzi
  `tools/map-audit.py` bez problemów,
- właściciel ocenia jakość ≥ benchmark Śródziemia (ADR 0015 pkt 5),
- regeneracja z sceny daje identyczny wynik (test determinizmu).
