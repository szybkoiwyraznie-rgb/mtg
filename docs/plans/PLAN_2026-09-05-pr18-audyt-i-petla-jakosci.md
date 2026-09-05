# PLAN PR-18 — audyt PR-17 + Pętla Jakości (2026-09-05)

Sesja: gałąź `arena/01a07207-mtg`, punkt wyjścia `bd6ac14` (scalone PR-17).
Domyślna praca bez zlecenia: Pętla Jakości (ADR 0006/0015), poprzedzona
obowiązkowym audytem PR-17 (AGENTS.md §5) — wykonany:
`docs/audits/AUDYT_2026-09-05-PR17.md` (znaleziska Z1–Z7).

## Blok 1 — kolejka napraw z audytu

| # | Znalezisko | Plik(i) |
|---|---|---|
| Z1 | Kompas Ravniki: litery N/E/S/W z `y="undefined"` + zapora w map-audit na `undefined/NaN/null` w atrybutach numerycznych | `maps/ravnica/podklad.svg`, `tools/map-audit.py` |
| Z2 | Doprecyzowanie ADR 0026 (termin „Fabuła", decyzja właściciela 2026-09-05) + rejestr | `docs/decisions/0026-*.md`, `docs/decisions/README.md` |
| Z3 | Korekta numeracji ADR 0028 → 0027 (iframe map) | `content/co-nowego.md`, `tools/build.mjs` |
| ~~Z4~~ | WYCOFANE (fałszywy alarm — modele spójne, patrz audyt) | — |
| Z5 | Kolizja etykiet demo „Wyspa Próbna" (oba motywy) | `maps/_warsztat/` |
| Z6 | Nieaktualna notka „markery bez emblematów" | `maps/ravnica/mapa-analiza.md` |
| Z7 | Literówki docstringów | `tools/mapforge/ravnica-v3-herby.py` |
| Z8 | (dodane w trakcie) pozorna idempotentność skryptu herbów — usuwanie warstwy licznikiem głębokości + lekcja L7 | `tools/mapforge/ravnica-v3-herby.py` |

Każdy samodzielnie zielony krok (`npm test` + `npm run build` +
`map-audit`) = osobny commit, od razu push (reguła 3 sesji).

## Blok 2 — Pętla Jakości (po zamknięciu bloku 1)

1. **Integralność** — wykonana na starcie (102/102, build zielony).
2. **Pogłębianie** — ranking słabości: wszystkie strony 8/8
   (`wiki-stats`), sekcje kompletne, Źródła ≥2, pinezki obecne.
   Kandydatów brak — do odnotowania w podsumowaniu (pogłębianie „na siłę"
   jest sprzeczne z duchem pętli).
3. **Link-mining** — próg właściciela: hasło przy ≥2 kartach wspominających
   encję. Trzy karty w trzech różnych planach → brak encji 2+ kart
   (hasła Ravnicy czekają na 2. kartę — stan z handoffu PR-17). Bez nowych
   haseł; wpis do co-nowego nie wymagany poza podsumowaniem sesji.
4. **Pass mapowy** — po naprawach Z1/Z4/Z5: przegląd kompletności
   operacyjnej (pinezki: 3/3; mapy: 3 plany z kartami mają mapy;
   kotwice ravniki zweryfikowane z warstwą SVG przy audycie). Nowe POI:
   Zendikar gęsty (43 POI), Ravnica T2+ = złoty standard a/b/c.
   Wątki „Akoum/Ondu" i „obwódki haseł" zamknięte decyzją właściciela
   2026-09-05 — usunięte z ROADMAP (nie są zadaniami).
5. **Co nowego** — wpis sesji (format ADR 0029: `## RRRR-MM-DD HH:MM —
   tytuł`, Europe/Warsaw).

## Blok 3 — zamknięcie sesji

- Handoff `docs/setup/HANDOFF_2026-09-05-pr18.md`.
- Opis PR kumulatywnie; `npm test` + `npm run build` + `map-audit`
  zielone; `git status` czysty; wszystko wypchnięte.

## Ryzyka / uwagi

- Brak warsztatu renderu poprzedniej sesji (`/home/user/qawork` nie
  istnieje) i gałęzi `szybkoiwyraznie-rgb-patch-3` — naprawa kompasu
  weryfikowana geometrią (strzałki róży mają 190 px, litery na okręgu
  235 px), nie porównaniem z rastrem.
- Nie commitujemy żadnych rasterów; `img/` i zasoby prywatne poza gitem
  (ADR 0008/0031).
