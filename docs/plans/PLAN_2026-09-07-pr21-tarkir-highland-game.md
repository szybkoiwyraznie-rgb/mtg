# PLAN PR-21 (pakiet 3): Tarkir — 509KTK Highland Game + mapa T4 planu Tarkir

Data: 2026-09-07. Branch: `arena/01a0770f-mtg` (pakiet jedzie w otwartym
PR #21 jako trzecie rozszerzenie — decyzja właściciela 2026-09-07: PR
nie będzie scalany w trakcie sesji, bo agent straciłby dostęp do
GitHuba; pakiety 1–2: audyt PR-20 + Pętla Jakości, Mirrodin/488SOM).

## Cel

Materializacja karty właściciela `509KTK Highland Game` (KTK, Khans of
Tarkir) z mapą planu Tarkir i stroną planu. Scena: zimowe łowy klanu
Temur w górach Qal Sisma — olbrzymi jeleń, doświadczony traper, poroże
przeznaczone wedle nauk szamana Chianula do rytualnego słuchania szeptów
przodków; mięso i futro dla osłabionych mrozem koczowników.

## Decyzje (ustalone z właścicielem 2026-09-07)

1. **Tier mapy: T4** — wybór właściciela po raporcie T2→T3→T4
   (przedstawionym w czacie przed rysowaniem). Research: brak wektora
   (T2), brak oficjalnego rastra (T3 — oba Planeswalker's Guide, KTK 2014
   i TDM 2025, to same opisy; MTG Wiki bez kategorii map Tarkiru; wątki
   r/magicTCG i Tumblr potwierdzają brak mapy WotC).
2. **Raster fanowski dostarczony przez właściciela:** „Tarkir Map 2025
   (EN)” — Lore Café / MTG Wiki Italia, grafika 3d4 (r/mtgvorthos,
   2025). Użycie zgodnie z ADR 0031: **źródło pomocnicze geometrii**
   (układ terytoriów, względne pozycje POI, przebieg Salt Road/Scour/
   rzek), a kanon tekstowy rozstrzyga dobór obiektów i nazwy. Raster
   NIE trafia do repo; plik załącznika nie dotarł do sandboxa
   (`/home/user/uploads/` nie istnieje — ten sam objaw co w PR-14),
   odczyt z podglądu w UI. Rozbieżności raster↔kanon spisane
   w `map.json` (`zrodlo_fanmapa.rozbieznosci_z_kanonem`).
3. **Epoka mapy (ADR 0033 §1–2, uzupełnienie Tarkir):** jedna mapa
   fizyczna z etykietami osad **epoki khanów** (karta jest z KTK —
   linia czasowa przed Khanfall). Topografia wspólna dla linii khanów,
   smoczych lordów (DTK) i Tarkir: Dragonstorm; osady późniejszych epok
   poza mapą (`poza_epoka`), obiekty czysto fizyczne znane tylko z TDM
   (jeziora, lasy, rzeki) dopuszczone. Właściciel nie zgłosił sprzeciwu
   wobec rekomendacji z raportu (pytanie pomocnicze pominięte, wybór
   T4 potwierdzony wprost) — decyzja zapisana jako uzupełnienie ADR 0033
   do potwierdzenia przy recenzji.
4. **Numery:** imgId właściciela `509KTK` (klucz FOT/KON) ≠ collector
   number Scryfall `135` (KTK/135). Oba w snapshocie (`notka_numery`).
5. **Fabuła:** verbatim w `collection/entries/509ktk-highland-game.md`
   (ADR 0026).
6. **Slug planu:** `tarkir`; nowe tagi taksonomii: `szamanizm`, `lowy`,
   `klany-tarkiru`.

## Zakres

- `collection/entries/509ktk-highland-game.md` — Fabuła verbatim.
- `scryfall/509ktk-highland-game.json` — snapshot (pobrano 2026-09-07
  przez API; `curl` z sandboxa bez sieci — zapis ręczny).
- `maps/tarkir/zrodlo-research.md` — werdykt T2/T3/T4, URL-e, kanon
  geograficzny, propozycja układu, decyzje właściciela.
- `tools/mapforge/tarkir-scena-t4.py` → `maps/tarkir/{scena.json,
  podklad.svg,map.json}` — T4 mapforge (styl atlas, 2000×1400): kontynent
  full-bleed bez oceanu, morze południowe z deltą Gudul, pięć terytoriów
  (tinty + szwy), 13 pasm, 2 wulkany, 7 jezior, 5 rzek, 5 dróg, szczelina
  Scour, 15 biomów (w tym nowa `pustynia`), 26 POI, 64 etykiety;
  52 kotwice, pinezka 509KTK (region).
- mapforge: biom `pustynia` (wydmy), POI `szczyt` (Eternal Ice), opcja
  `bezGranicy` dzielnic; README + testy.
- `content/planes/tarkir.md`, `content/cards/509ktk-highland-game.md`
  (LORE-first, 9 sekcji), `content/taxonomia.json`.
- `test/ui-smoke.test.js` — licznik 6→7, plan/mapa/karta Tarkiru, home.
- Domknięcie: co-nowego (02:50), handoff (dopisek pakietu 3),
  PROJECT_HISTORY, ROADMAP, ADR 0033 (uzupełnienie), opis PR #21.

## Źródła kanoniczne

- https://magic.wizards.com/en/news/feature/planeswalkers-guide-khans-tarkir-part-1-2014-09-03
- https://magic.wizards.com/en/news/feature/planeswalkers-guide-khans-tarkir-part-2-2014-09-10
- https://magic.wizards.com/en/news/feature/planeswalkers-guide-to-tarkir-dragonstorm-part-1
- https://magic.wizards.com/en/news/feature/planeswalkers-guide-to-tarkir-dragonstorm-part-2
- https://mtg.wiki/page/Tarkir · https://mtg.wiki/page/Qal_Sisma ·
  https://mtg.wiki/page/Tiansun · https://mtg.wiki/page/Sandsteppe ·
  https://mtg.wiki/page/Shifting_Wastes · https://mtg.wiki/page/Gudul_delta ·
  https://mtg.wiki/page/List_of_secondary_characters/Tarkir (Arel)
- https://scryfall.com/card/ktk/135/highland-game
- https://www.reddit.com/r/mtgvorthos/comments/1jqv1su/tarkir_dragonstorm_handcrafted_map/
  (raster fanowski Lore Café — źródło pomocnicze geometrii)

## Kryteria odbioru

npm test zielone (109), build zielony (14 stron), map-audit 0 problemów,
`sprawdzWiazania` sceny = 0 uwag, podkład zrasteryzowany i obejrzany
(całość + wycinki; L10), preview renderuje mapę Tarkiru i kartę 509KTK
z pinezką w Qal Sisma, plan Tarkiru ze stopką czasu; wpis co-nowego;
handoff i opis PR zaktualizowane.

## Kroki

- [x] Wpis kolekcji (verbatim) + snapshot Scryfall (`ba59e38`).
- [x] Research T2→T3→T4 + raport w czacie → decyzja właściciela: T4
      + raster Lore Café (`a316f1e`).
- [x] mapforge: biom `pustynia`, POI `szczyt`, dzielnice bez granicy
      + testy (`e7b633d`).
- [x] Mapa: generator → scena → podkład (0 uwag wiązań) → map.json
      (52 kotwice, pinezka) → rasteryzacja i ogląd (N, NE, SE, W) →
      map-audit 0 (`442ee98`).
- [x] Strona planu + karta LORE-first + taksonomia + asercje smoke →
      `npm test` 109/109, build 14 stron (`b1431ed`).
- [x] Co-nowego 02:50 (`395f0f4`).
- [x] Domknięcie dokumentów: roadmapa (ten plik), ADR 0033 uzupełnienie,
      handoff, PROJECT_HISTORY, ROADMAP.
- [x] Push po odzyskaniu tokena (środowisko wróciło jako płytki klon
      z patchsetem — łańcuch commitów odtworzony wg ENVIRONMENT §2a,
      push po każdym) + opis PR #21 (sekcja pakietu 3).
- [x] Recenzja właściciela mapy Tarkiru — 4 uwagi (ramka na treści,
      Scour jako „rura”, lód na paśmie, rzeki w polu) → poprawki
      w generatorze + 4 reguły silnika (ramka passe-partout, klocek
      `rozpadlina`, pasma omijają lód, walidator hydrologii), rastery,
      map-audit 0, testy 113/113; ADR 0034, L12, SKILL §4/#6 i §7
      (`aa76360`, `cd186ad`, co-nowego 14:05).
- [ ] Potwierdzenie epoki etykiet (nazwy khanów — ADR 0033 uzupełnienie)
      przy kolejnej recenzji.
