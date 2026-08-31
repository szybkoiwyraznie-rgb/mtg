# PLAN 2026-08-31 — PR-1: Fundamenty MTG Lore Codex

> Roadmapa jednego zadania (konwencja z projektu mtg-game, ADR 0020 §„Start
> zadania"). Zostaje wypchnięta jako osobny commit **przed** rozpoczęciem
> implementacji. Podczas pracy etapy są odhaczane kolejnymi commitami,
> a na końcu dopisywane jest podsumowanie wykonania.

## Cel

Założenie projektu **MTG Lore Codex** — wiki lore prywatnej kolekcji MtG
(transpozycje planów/IP, narracje właściciela jako kanon) — bez żadnej treści
lore. PR-1 dostarcza wyłącznie: strukturę repozytorium, dokumenty
konstytutywne (AGENTS/ADR/ENVIRONMENT/guidy), silnik witryny z pustą bazą,
testy integralności i CI z publikacją na GitHub Pages.

**Kryterium ukończenia:** `npm test` i `npm run build` zielone na pustej
bazie; artefakt `dist/mtg-lore-codex.html` otwiera się z `file://` i pokazuje
stronę główną z pustymi stanami; CI i Pages zielone na GitHubie; PR otwarty
z opisem, scalenie należy do właściciela.

## Zakres (w tym świadomie NIE obejmuje)

- **W scope:** dokumenty, ADR-y 0001–0008, silnik (frontmatter/markdown/
  wikilinki/rejestr/router/renderery z pustymi stanami), testy integralności
  z fixture'ami, CI + Pages, szablony GitHub (issue/PR), porządki w repo
  (usunięcie mtg-game.zip), konfiguracja repo (ochrona main, opis, tematy).
- **Poza scope (kolejne PR):** pierwsza materializacja 1LTR Dunland Crebain
  (PR-2), mapa Śródziemia T1 (PR-2/PR-3), renderery map i pan/zoom (PR-3),
  treść lore i hasła, grafiki czegokolwiek (decyzja właściciela: na razie
  zero generowanych obrazów).

## Ustalenia właściciela (2026-08-31, obowiązujące)

1. Nazwa: **MTG Lore Codex** (repo `mtg` zostaje).
2. **Pętla jawnego przekazywania**: materializacji podlega wyłącznie karta
   wysłana przez właściciela. Żadnych importów masowych, stubów, CSV.
3. **Zero generowanych grafik**; tory obrazów jak w mtg-game (druk Scryfalla
   online + FOT/KON z lokalnego `./img/`, cichy fallback).
4. Mapy: T1 hybryda; workflow budowany na karcie 1LTR (Śródziemie).
5. MV ignorowane; typy FUS/STO nie istnieją w tym projekcie.
6. Artefakt dwutorowy: lokalnie `file://` (FOT/KON działają), na Pages
   (FOT/KON nieobecne). Użytek prywatny.
7. Język polski; cytaty oryginalne EN z tłumaczeniem.
8. Wpis 1LTR z wiadomości właściciela (2026-08-31) = pierwsza oficjalna
   dostawa do materializacji — dopiero w PR-2.

## Etapy

| # | Etap | Kryterium ukończenia | Commit |
|---|------|----------------------|--------|
| 1 | Plan zadania (ten plik), push, otwarcie PR | gałąź na GitHubie, PR #1 istnieje | C1 |
| 2 | Rejestr ADR (README + 0001–0008) | 8 ADR-ów spójnych z ustaleniami | C2 |
| 3 | Dokumenty rdzenne: AGENTS.md, README, PRODUCT, ARCHITECTURE, WORKFLOW, ROADMAP, LESSONS, backlog, CONTRIBUTING, SECURITY | kompletny zestaw, spójne odsyłacze | C3 |
| 4 | ENVIRONMENT.md + 4 gidy (SZKIELET_KARTY, SZKIELET_HASLA, PETLA_JAKOSCI, PROCES_MAP) | gidy definiują formaty i procesy | C4 |
| 5 | package.json, .gitignore, tools (module-graph, build, run-tests, manifest), szkielet src (index.html + main.js) | `npm run build` produkuje artefakt | C5 |
| 6 | Silnik rdzeń: frontmatter, markdown, wikilinki, rejestr, pipeline danych builda + testy integralności + fixture'y | `npm test` zielony (pusta baza + fixture'y) | C6 |
| 7 | UI: router, renderery (strona główna, karta, hasło, plan, listy, tagi, co-nowego, szukaj), style | artefakt z pustymi stanami, routing działa | C7 |
| 8 | .github (CI, Pages, szablony issue, PR), README katalogów treści (content/, collection/, scryfall/, maps/), PROJECT_HISTORY, seed co-nowego | CI zielone po pushu | C8 |
| 9 | Usunięcie mtg-game.zip; konfiguracja repo (ochrona main rulesetem, squash-only, delete-branch-on-merge, opis, tematy) | repo skonfigurowane wg ADR dziedziczącego ochronę main | C9 |
| 10 | Handoff sesji (docs/setup/HANDOFF_2026-08-31.md), podsumowanie w PLAN, aktualizacja opisu PR | handoff w repo, PR opisany kumulatywnie | C10 |

## Ryzyka i pułapki

- **Polskie znaki w narzędziach** — zweryfikowane empirycznie w tej sesji
  (2026-08-31): `write_file`/`edit_file` zachowują UTF-8; `edit_file` nie
  działa poza workspace. Fallback: edycja przez `python3` (konwencja
  z mtg-game). Reguła zapisana w ENVIRONMENT.md.
- **Egress zablokowany** (curl → Scryfall = 000): dane kart pobierane
  narzędziem `fetch_page`, snapshoty trzymane w repo (ADR 0004).
- **Sklejanie modułów ESM w jeden plik** (dziedziczone z mtg-game ADR 0011):
  jeden zasięg po sklejeniu — cykle importów i kolizje nazw wykrywane przed
  buildem przez tools/module-graph.mjs.
- **Build Pages a build lokalny**: Pages wymaga `dist/index.html`, lokalnie
  artefakt nazywa się `dist/mtg-lore-codex.html` (stabilna nazwa dla
  właściciela). CI buduje oba cele z tego samego źródła.
- **Puste katalogi w gicie**: katalogi treści dostają README.md (nie
  .gitkeep) — README opisuje, co ma prawo wylądować w środku.
- **Zakaz generowania grafik** (decyzja właściciela): silnik obrazów
  (tory Scryfall/FOT/KON) jest częścią PR-1, ale żadna grafika nie powstaje.

## Podsumowanie wykonania

_(dopisane na końcu zadania)_
