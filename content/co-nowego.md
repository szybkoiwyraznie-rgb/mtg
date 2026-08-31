# Co nowego

Dziennik zmian bazy — po jednym wpisie na sesję (Pętla Jakości, krok 5,
ADR 0006). Najnowsze na górze.

## 2026-08-31 — Pierwsza karta! Mapa Śródziemia + kanon v2 (PR-2, w toku)

- **Mapa Zendikaru — rekonstrukcja T3** (`#/mapa/zendikar`, ADR 0012):
  podkład własny (SVG) z układem kontynentów z kanonu tekstowego,
  wzorowany mapami fanowskimi; Murasa z linią przerywaną („położenie
  przybliżone”). Pinezka 2BFZ — region wybrzeży Halimar; mini-mapa
  w infoboksie karty podłączyła się sama.
- **Ikony many** — notacja typu `{1}{U}` w treści i infoboksie Koszt
  renderuje się jako kolorowe ikony many (biała, niebieska, czarna,
  czerwona, zielona + bezbarwna).
- **Lista kart**: sortowanie alfabetyczne (pl), tagi w tabeli
  oraz filtr nazwy i tagów; usunięty meta-tekst procesowy
  (feedback właściciela z przeglądu tury 5).
- **Materializacja 2BFZ Coralhelm Guide** — druga Karta Katalogowa,
  pierwsza dostarczona chudym formatem (imgId · nazwa · set · plan;
  ADR 0011): snapshot BFZ #74 (Viktor Titov), lore przewodniczki
  z Coralhelm nad Halimar na Tazeem, flavor Jori En z tłumaczeniem.
  Plan **Zendikar** zyskał stronę (siedem kontynentów, Sea Gate,
  Roil); mapa planu — własna rekonstrukcja (patrz wyżej).
- **Materializacja 1LTR Dunland Crebain** — pierwsza Karta Katalogowa
  (10 sekcji): snapshot Scryfalla posiadanego wydruku (borderless,
  David Rapoza), mechanika jako opowieść (Flying + Amass Orcs 2),
  pinezka regionu Dunland na mapie. Posiadany wydruk nie ma flavor
  tekstu — sekcja flavoru opisuje scenę Hollin, którą karta przywołuje.
  Strona karty to w całości kanon (snapshot + lore z cytowaniami):
  byty faktycznie obecne na karcie w „Postaciach i Bytach",
  najważniejsze encje pogrubione w opisie (bez osobnej sekcji wątków —
  wikilinki po progu dwóch kart), opis posiadanego wydruku
  w „Druku w Kolekcji".
- **Mapa Śródziemia z silnikiem v1** (`#/mapa/srodziemie`): podkład
  w pełni wektorowy (projekt *mapome*, k1tesurfen, CC-BY-4.0 — ADR 0009),
  pan/zoom, legenda pewności, deep-link `?pin=`. Pinezki i etykiety
  zachowują stały rozmiar podczas zoomowania.
- **Karta Katalogowa z mini-mapą**: infoboks pokazuje miniaturę mapy
  planu z pinezką — klik przenosi na mapę z wycentrowaną pinezką.
- **Ostre pinezki w każdym zoomie**: pinezki i etykiety przeniesione
  do nakładki ekranowej (pozycjonowane w pikselach, poza skalowaną
  warstwą podkładu) — stały rozmiar bez rozmycia przy przybliżeniu.
  Nagłówek mapy bez danych technicznych (wariant podkładu).
- **Artefakt otwiera się od razu**: `index.html` obok pliku bazy
  przekierowuje na niego — wejście na serwer nie pokazuje listingu
  katalogu.
- **ADR 0010 — hierarchia kanonu v2** (korekta właściciela): kanonem jest
  karta MtG + lore świata docelowego; prompt i narracja kolekcji to
  **kotwica osadzenia**, nie prawda objawiona. Zastępuje hierarchię
  ADR 0003.
- **ADR 0011 — chudy format dostawy** (decyzja właściciela): dostawa
  to jedna linijka — imgId, nazwa, set, plan; reszta ze snapshotu
  Scryfalla. Narracja i prompt wychodzą z pętli i ze strony karty
  (pozostają w archiwum wpisów kolekcji); sekcje „Narracja Koleksji"
  i „Wizualizacja" zastępuje „Druk w Kolekcji".
- **Zasada progu haseł** (korekta właściciela): hasło powstaje dopiero,
  gdy ≥2 karty odwołują się do encji w treści. Cztery hasła utworzone
  przedwcześnie (crebain, dunland, isengard, rohan) **wycofano** —
  wiedza żyje w sekcjach karty, encje w kolejce link-miningu
  (docs/backlog.md).
- Testy: 65 (test dymny mapy i karty z realnej bazy; fixture „pusta
  baza"; statusy ADR „Częściowo zastąpiona"; pilnowanie kanonu karty
  i chudego formatu dostawy).

## 2026-08-31 — Fundamenty (PR-1)

- Założenie projektu **MTG Lore Codex**: struktura repozytorium, dokumenty
  konstytutywne (AGENTS.md, PRODUCT, ARCHITECTURE, WORKFLOW, ROADMAP,
  LESSONS, SECURITY), rejestr ADR 0001–0008, ENVIRONMENT z empirycznie
  zweryfikowanymi faktami sandboxa.
- Silnik witryny: parser frontmatter, renderer markdown z wikilinkami,
  rejestr stron z walidacją schematów, hash-router, renderery wszystkich
  typów stron (z pustymi stanami), tory obrazów FOT/KON z cichym
  fallbackiem (ADR 0008).
- 62 testy integralności (schemat treści, wikilinki, parość kolekcji,
  pokrycie Scryfall, mapy, rejestr ADR, budżet lektury, artefakt, UI
  smoke z mini-shimem DOM) + fixture'y end-to-end.
- CI (testy + build + artefakt do pobrania) i publikacja na GitHub Pages.
- Baza celowo pusta: pierwsza materializacja — **1LTR Dunland Crebain**
  (dostarczona przez właściciela 2026-08-31) — wchodzi w PR-2 razem z
  mapą Śródziemia T1.
