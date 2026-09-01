# Historia projektu (dziennik sesji)

> Dokument żywy, ale **NIE jest lekturą startową** (AGENTS.md §0) — sięgaj
> tu grepem/punktowo po kontekst historyczny. Reguły mieszkają w ADR-ach,
> LESSONS i AGENTS.md.

## 2026-09-01 — sesja PR-4: naprawa publikacji GitHub Pages (gałąź arena/01a05bc9-mtg, PR #7)

**Zlecenie właściciela:** „artefakt na pages nie działa — failed to deploy".

**Diagnoza:** wszystkie 3 historyczne runy „Publikacja na GitHub Pages"
failure; ostatni pada na `actions/configure-pages@v5` — `Get Pages site
failed … Not Found`. Strona Pages nigdy nie została włączona
(`GET /repos/…/pages` → 404); workflow poprawny, build/testy zielone.
K1 („CRIT: Pages publikuje") nie było nigdy spełnione — audyt PR #6
wykazał i zapisał to (`docs/audits/AUDYT_2026-09-01-PR6.md`).

**Rozstrzygnięcie:** właściciel włączył Pages ręcznie (Settings → Pages →
Source: GitHub Actions); auto-publikacja przy pushu do main działa
od ręki (istniejący `on: push`). Wariant repo-side (`configure-pages:
enablement: true`) przygotowany i zdjęty: push zmian
w `.github/workflows/` jest odrzucany dla bota Areny (brak uprawnienia
`workflows`) — fakt stały zapisany w ENVIRONMENT §3, wniosek w L6.
W trakcie sesji sandbox zresetował workspace (ENVIRONMENT §2) — odzyskano
z gałęzi zdalnej (commit planu był wypchnięty od razu, L2 zadziałała).

**Stan na koniec:** re-run deployu na main → zielony, strona Pages żyje
(szczegóły w PLAN_2026-09-01-pr4-pages-fix.md, „Wynik weryfikacji").

**Dalsze zadania sesji (zlecenie właściciela, merge na końcu sesji):**

- **A (Pages):** potwierdzono, że po włączeniu site'a nowy artefakt
  powstanie dopiero przy pierwszym pushu do main (scalenie PR #7) —
  bot nie może odpalić workflow (`actions: write` brak; ENVIRONMENT §3).
- **B1:** badge pinezki ukryty do najechania (CSS hover/focus-visible,
  tooltip `title` pozostaje) — commit „mapy B1".
- **B2:** warstwa karty z pinezki — `render-map.js` montuje dialog
  (role=dialog, aria-modal) z rendererem Karty Katalogowej przekazanym
  z `main.js` (brak cyklu importów); zamykanie ✕/tło/Esc, powrót fokusu
  na mapę, mapa nieodmontowywana (zoom/pan zachowane); tory obrazów
  montowane w warstwie; progressive enhancement (link #/karta/… bez JS).
- **C (Pętla Jakości):** integralność 70/70; pogłębienie 3 stron
  („Druk w Kolekcji" 1LTR/2BFZ z kwerendą o artystach i wydaniach;
  plan Zendikar — nowa sekcja „Ludy" wg *Planeswalker's Guide*);
  naprawa „wiedzy bez URL-a" w źródłach 2BFZ (reguła cytowań);
  link-mining: nadal brak encji w ≥2 kartach (kolejka w backlogu);
  pass mapowy: bez braków; stats: karty 88%, plany 63% (wikilinki
  czekają na progu haseł).

## 2026-08-31 — sesja PR-3 c.d.: audyt + wzbogacenie mapy wektorowej Zendikaru (gałąź arena/01a0591f-mtg, PR #6)

**Zlecenie właściciela:** „...zadanie audytu mapy wektorowej Zendikaru
i dodania nowych elementów... Na razie mapa wygląda biednie."

**Wykonanie:** audyt stanu mapy (AUDYT_...-mapa-zendikar.md) → plan →
wzbogacenie `maps/zendikar/podklad.svg` o elementy przyrodnicze i
osadnicze (góry/wulkany, lasy, rzeki, miasta, bagna, ruiny/Skyclave)
**potwierdzone w źródłach** (MTG Wiki / Guide Zendikar / Plane Shift) +
legenda symboli + podpis źródłowy → `map.json` z polem `elementy`
(każdy z URL-em) i rozszerzonymi `kotwice`. Rekonstrukcja T3 nienaruszona
(ADR 0012: `rekonstrukcja: true`, Murasa przerywana, pozycje przybliżone).
Testy 70/70, build OK (2 483 kB).

**Decyzje:** brak nowego ADR — wzbogacenie mapy mieści się w granicach
ADR 0007/0012 (pass mapowy, Pętla Jakości krok 4). Pozycje punktów są
przybliżone (nie ma oficjalnej mapy), co jest jawnie zadeklarowane.

## 2026-08-31 — sesja PR-3: Pętla Jakości + K5 (gałąź arena/01a0591f-mtg, PR #6)

**Zlecenie właściciela:** „Kontynuujemy projekt." — bez nowej dostawy kart,
więc pracą domyślną była Pętla Jakości (ADR 0006).

**Wykonanie:** audyt stanu po poprzednim scaleniu (AUDYT_...-PR3.md) →
plan → K5 `tools/wiki-stats.mjs` (completeness score, wzór PETLA_JAKOSCI,
max 8) + skrypty npm + test → pogłębianie stron planów (geografia + Źródła;
38%→63%) → link-mining (brak haseł — potwierdzone) → pass mapowy (bez
braków) → co-nowego, handoff, historia, roadmapa. Testy 65 → 70.

**Decyzje:** brak nowych ADR-ów — zmiany nie przekraczają granic
ustalonych decyzji (narzędzie pomiarowe + treść planów). Kamień K5
domknięty.

## 2026-08-31 — sesja PR-2 (w toku): mapa Śródziemia + hasła (ta sama gałąź/PR #3)

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

**Korekty właściciela (ta sama tura):** (1) hierarchia kanonu — prompt
i narracja kolekcji NIE są kanonem, tylko kotwicą osadzenia; kanonem jest
karta MtG + lore świata → ADR 0010 (zastępuje hierarchię ADR 0003);
(2) hasła powstają dopiero po progu 2 kart odwołujących się do encji →
4 hasła utworzone przedwcześnie wycofano, encje w kolejce link-miningu
(docs/backlog.md).

**Domknięcie PR-2 (ta sama tura):** właściciel ponownie przekazał dane
1LTR (prompt + narracja) → wpis kolekcji verbatim + Karta Katalogowa
(12 sekcji) + pinezka regionu Dunland (0,406/0.492) w map.json →
testy 64/64, artefakt 2,4 MB.
