# Historia projektu (dziennik sesji)

> Dokument żywy, ale **NIE jest lekturą startową** (AGENTS.md §0) — sięgaj
> tu grepem/punktowo po kontekst historyczny. Reguły mieszkają w ADR-ach,
> LESSONS i AGENTS.md.

## 2026-08-31 — sesja PR-1: Fundamenty (gałąź arena/01a05755-mtg, PR #3)

**Zlecenie właściciela:** zarządzenie nowym repozytorium, podstawowe pliki,
katalogi i zasady — projekt „wikipedia lore kolekcji" na wzorcu kultury
projektu mtg-game (dostarczonego jako mtg-game.zip).

**Kluczowe decyzje właściciela (poprzedzające PR, wpisane do ADR-ów):**

- nazwa: MTG Lore Codex; pętla jawnego przekazywania kart (żadnych
  importów/stubów; CSV z 579 kartami unieważniony); zero generowanych
  grafik (tory FOT/KON lokalnie + druk Scryfalla); mapy T1 hybryda z
  workflow budowanym na karcie 1LTR; MV ignorowane; użytek prywatny;
  język polski.
- Wpis 1LTR Dunland Crebain = pierwsza oficjalna dostawa (materializacja
  w PR-2).

**Wykonanie (commity C1–C10):** plan zadania → rejestr ADR 0001–0008 →
dokumenty rdzenne → ENVIRONMENT + 4 gidy → silnik (frontmatter/markdown/
wikilinki/registry/router/renderery) + build jednoplikowy → 62 testy
integralności z fixture'ami → test dymny UI (mini-shim DOM) → CI/Pages/
szablony → porządki (usunięcie mtg-game.zip) + konfiguracja repo (ochrona
main, squash-only) → handoff.

**Zweryfikowane empirycznie (ENVIRONMENT.md):** egress HTTPS zablokowany
poza npm; `fetch_page` działa z API Scryfall (pobrano Oracle Dunland
Crebain); `write_file`/`edit_file` zachowują polskie znaki (inaczej niż
w sandboxie mtg-game); `edit_file` nie działa poza workspace.

**Pozostaje otwarte:** PR-2 (materializacja 1LTR + mapa Śródziemia T1),
silnik map pan/zoom (K3/K4), `tools/wiki-stats.mjs` dla Pętli Jakości (K5).

## 2026-08-31 — sesja PR-2 (w toku): mapa Śródziemia + hasła (ta sama gałąź/PR #3)

**Zlecenie właściciela:** kontynuacja PR-2 (materializacja 1LTR) w ramach
PR #3; propozycja map wektorowych zamiast rastrowych (przyjęta — ADR 0009);
sprostowanie: wersja lokalna ma internet, offline jest tylko tory FOT/KON
(LESSONS L4).

**Wykonanie (dotychczas):** CI na PR #3 zielone (ci.yml właściciela);
plan materializacji (C11); ADR 0009 + podkład SVG mapome CC-BY-4.0
(C12); research lore z cytowaniami; snapshot Scryfall 1LTR; strona planu
Śródziemie + 4 hasła (crebain, dunland, isengard, rohan); map.json
z kotwicami z etykiet podkładu (wyprowadzone parserem XML) i regionami;
silnik map v1 (pan/zoom/kotwice/legenda/?pin=) + osadzanie podkładu
base64 w buildzie; test 63/63.

**Otwarte:** wpis kolekcji verbatim (prompt + narracja właściciela
przepadły w kondensacji historii czatu — właściciel został poproszony
o ponowne wklejenie) → Karta Katalogowa 12 sekcji → pinezka
1ltr-dunland-crebain w map.json.
