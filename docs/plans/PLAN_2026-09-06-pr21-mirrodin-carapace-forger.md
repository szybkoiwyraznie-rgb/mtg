# PLAN PR-21 (pakiet 2): Mirrodin — 488SOM Carapace Forger + mapa T4 planu Mirrodin

Data: 2026-09-06. Branch: `arena/01a0770f-mtg` (pakiet jedzie w otwartym
PR #21 jako rozszerzenie — decyzja właściciela 2026-09-06, wariant
„extend”; część 1 PR-21 = audyt PR-20 + Pętla Jakości, roadmapa
`PLAN_2026-09-06-pr21-audyt-pr20-i-petla-jakosci.md`).

## Cel

Materializacja karty właściciela `488SOM Carapace Forger` (SOM, Scars of
Mirrodin) z mapą planu Mirrodin i stroną planu. Scena: serce miedzianego
lasu Tangle — viridiański zbrojmistrz zasila swoją miedzianą skorupę
trzema artefaktami, bo znad mokradeł Mephidrossu nadciąga phyrexiańska
zaraza, na którą „łuki i bicze” już nie wystarczają.

## Decyzje (ustalone z właścicielem 2026-09-06)

1. **Tier mapy: T4 od razu z kanonu** (rekonstrukcja kanoniczna
   w mapforge). Research T2→T3→T4 (zaraportowany w czacie przed
   rysowaniem): brak wektora (T2) i brak oficjalnego rastra (T3) — MTG
   Wiki wprost: oficjalna mapa Mirrodinu nigdy nie powstała; kategorie
   map wiki i archiwum phyrexia.com nie zawierają Mirrodinu; jedyna
   fanowska mapa (inkarnate, John Ruder) jest niedostępna z sandboxa.
   Raster fanowski — **wyłącznie gdy właściciel go dostarczy** i wtedy
   tylko jako źródło pomocnicze dla pozycji nieustalonych w kanonie,
   nigdy jako zamiennik kanonu. Pole `zrodlo_fanmapa` w `map.json`
   pozostaje zarezerwowane (puste).
2. **Epoka mapy (ADR 0033 §2):** powierzchnia Mirrodinu z ery
   MRD–SOM, **przed kompleacją** (pięć regionów wokół Glimmervoid,
   pięć słońc/lacun). Po *New Phyrexia* plan ma dziewięć sfer,
   a powierzchnia staje się Mirrex — topologia nieprzedstawialna na tej
   mapie; ewentualna mapa sfer New Phyrexii powstanie jako osobny
   podkład dopiero przy karcie z taką sceną. Bez nowego ADR — to
   zastosowanie §2 ADR 0033 (zapis w `zrodlo.notka`).
3. **Numery:** imgId właściciela `488SOM` (klucz FOT/KON) ≠ collector
   number Scryfall `114` (SOM/114). Oba w snapshocie (`notka_numery`,
   LESSONS L8) — nigdy nie nadpisywać jednego drugim. Uwaga: URL
   `scryfall.com/card/som/141` to inna karta (Chimeric Mass); właściwy
   adres: `scryfall.com/card/som/114/carapace-forger`.
4. **Fabuła:** tekst dostarczony przez właściciela w czacie trafia do
   `collection/entries/488som-carapace-forger.md` **verbatim** (ADR 0026;
   kotwica transpozycji, nieparafrazowana).
5. **Slug planu:** `mirrodin` (strona planu `content/planes/mirrodin.md`,
   mapa `maps/mirrodin/`). Pakiet w PR #21, osobna roadmapa (ten plik).

## Zakres

- `collection/entries/488som-carapace-forger.md` — Fabuła verbatim
  (frontmatter: imgId, nazwa, wydanie, plan, dostarczono 2026-09-06).
- `scryfall/488som-carapace-forger.json` — snapshot (pobrano 2026-09-06,
  źródło: API `cards/named?exact=Carapace+Forger&set=som`).
- `content/cards/488som-carapace-forger.md` — karta LORE-first,
  9 sekcji (ADR 0030); pinezka **region**: Tangle (okolice Tel-Jilad /
  Viridii — scena „w sercu Tangle” bez nazwanego miejsca).
- `content/planes/mirrodin.md` — plan: świat-tarcza Karna, pięć
  regionów i pięć słońc, ludy, Phyrexia w Mephidrossie, epoki
  (przed/po kompleacji) — z cytowaniami.
- `maps/mirrodin/{scena.json,podklad.svg,map.json,zrodlo-research.md}`
  — T4 mapforge (styl atlas, 2000×1400): tarcza-hemisfera bez oceanu
  (tło arkusza jak Ravnica), Glimmervoid centralnie z Razor Fields,
  Mephidross (bagno), Tangle (las) i Oxidda (pasmo + wulkany) obok
  siebie, Quicksilver Sea jako jedyny akwen; lacuna w każdym regionie;
  kanoniczne POI z MTG Wiki; `zrodlo-research.md` = werdykt T2/T3/T4
  z URL-ami.
- `test/ui-smoke.test.js` — licznik kart 5→6; asercje: plan Mirrodin →
  mapa, tytuł/iframe, karta 488SOM (imgId, tytuł, deep-link pinezki).
- Domknięcie: co-nowego, handoff PR-21 (dopisek pakietu 2),
  PROJECT_HISTORY, opis PR #21 (sekcja „Pakiet 2: Mirrodin / 488SOM”).

## Źródła kanoniczne

- https://mtg.wiki/page/New_Phyrexia_(plane) — plan (dawniej Mirrodin):
  sztuczny świat Karna, pięć słońc, regiony i ich lokacje (Locations),
  brak oficjalnej mapy; kompleacja → dziewięć sfer.
- https://mtg.wiki/page/Tangle — miedziany las; graniczy z Glimmervoid
  i Quicksilver Sea; Tel-Jilad, Viridia, Radix; Viridian elves, Sylvok.
- https://mtg.wiki/page/Mephidross — bagno-nekropolia; Ish Sah/Vault of
  Whispers; Geth, Moriok, nim; graniczy z Oxiddą; Rey-Goor.
- https://mtg.wiki/page/Rey-Goor — Black Bayou: las przechodzący
  w bagno na styku Tangle→Mephidross.
- https://mtg.wiki/page/Glimmervoid — centralna równina; Razor Fields
  jako jej część; wieże ur-golemów.
- https://mtg.wiki/page/Oxidda_Chain — rdzawe góry; Kuldotha/Great
  Furnace; Krark-Home; Vulshok; graniczy z Glimmervoid.
- https://mtg.wiki/page/Quicksilver_Sea — morze rtęci; Lumengrid;
  Medev; Titan Forge; Darkslick.
- https://mtg.wiki/page/Razor_Fields — Taj-Nar, Bladehold, Ten Shields.
- https://www.mtgsalvation.com/articles/49606-the-world-of-mirrodin-i-moons-of-mirrodin
  — geografia relacyjna regionów (Glimmervoid centralny; Tangle blisko
  Oxiddy; Quicksilver między Mephidrossem a Glimmervoid).
- https://archive.org/details/mirrodin-players-guide-magic-the-gathering-2003
  — Mirrodin Player's Guide (2003): opisy Tel-Jilad, Lumengrid,
  Kuldotha, Taj-Nar, Vault of Whispers, Glimmervoid; bez mapy.
- https://scryfall.com/card/som/114/carapace-forger — dane karty;
  flavor „Bows and whips cannot save us from these new horrors of the
  Mephidross.”

## Kryteria odbioru

npm test zielone (w tym nowe asercje), build zielony, map-audit 0
problemów, `sprawdzWiazania` sceny = 0 uwag, podkład zrasteryzowany
i obejrzany (L10), preview renderuje mapę Mirrodinu i kartę 488SOM
z pinezką w Tangle; wpis co-nowego; handoff i opis PR zaktualizowane.

## Kroki

- [ ] Roadmapa (ten plik) + opis PR #21 rozszerzony o pakiet 2.
- [ ] Wpis kolekcji (verbatim) + snapshot Scryfall → `npm test`.
- [ ] Mapa: `scena.json` → `cli.mjs` (0 uwag wiązań) → `map.json`
      + `zrodlo-research.md` → rasteryzacja i ogląd → `map-audit` 0.
- [ ] Strona planu + karta LORE-first + asercje smoke → `npm test`,
      `npm run build`.
- [ ] Domknięcie: co-nowego, handoff, PROJECT_HISTORY, opis PR, push.
