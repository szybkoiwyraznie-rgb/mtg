# Co nowego

Dziennik zmian bazy — po jednym wpisie na sesję (Pętla Jakości, krok 5,
ADR 0006). Najnowsze na górze.

## 2026-08-31 — Mapa Śródziemia i pierwsze hasła (PR-2, w toku)

- **Silnik map v1** (`#/mapa/srodziemie`): podkład w pełni wektorowy,
  pan/zoom (przeciąganie, kółko, przyciski, dotyk ze szczypnięciem),
  legenda poziomów pewności, warstwa kotwic etykiet do weryfikacji,
  deep-link `?pin=` gotowy na pierwszą pinezkę karty (ADR 0009).
- **Podkład mapy**: mapa SVG Śródziemia z projektu *mapome* (k1tesurfen,
  CC-BY-4.0) — decyzja właściciela: mapy wektorowe zamiast rastrowych;
  kotwice etykiet (Isengard, Edoras, Tharbad…) wyprowadzone
  programistycznie z wersji z etykietami tekstowymi (ADR 0009, MA4).
- **Strona planu Śródziemie** + **4 Karty Haseł**: [[crebain]] (fauna),
  [[dunland]], [[isengard]], [[rohan]] — z kwerendą i cytowaniami
  (Tolkien Gateway, The Tolkien Forum, CBR).
- Snapshot Scryfalla dla 1LTR Dunland Crebain pobrany i zwalidowany;
  karta Katalogowa i wpis kolekcji verbatim — czekają na ponowne
  wklejenie tekstów dostawy (prompt + narracja) przez właściciela.
- Testy: 63 (nowy test dymny UI mapy + fixture „pusta baza").

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
