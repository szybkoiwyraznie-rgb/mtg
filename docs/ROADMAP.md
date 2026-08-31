# Roadmapa

Kamienie (K) odpowiadają naturalnym PR-om; kolejność jest umowna —
priorytet w każdej chwili ustawia właściciel (dostawy kart mają zawsze
pierwszeństwo). Stan aktualizuje się na końcu sesji.

## K1 — Fundamenty (PR-1) — **w toku (ta sesja)**

Struktura repo, AGENTS.md, ADR-y 0001–0008, ENVIRONMENT, gidy, silnik
z pustą bazą, testy integralności + fixture'y, CI + Pages, szablony
GitHub, konfiguracja repo (ochrona main). **Kryterium:** `npm test` i
`npm run build` zielone na pustej bazie; Pages publikuje pustą witrynę.

## K2 — Pilot: 1LTR Dunland Crebain end-to-end (PR-2)

Pierwsza materializacja: wpis kolekcji (dostarczony 2026-08-31) → snapshot
Scryfall → pełna Karta Katalogowa (wszystkie sekcje szkieletu, cytowania
z kwerendy) → strona planu Śródziemie → pierwsze 2–3 Karty Haseł (kandydaci:
Crebain, Dunland, Isengard/Biała Ręka) → build + Pages. **Cel: walidacja
całego pipeline'u i obu typów stron na jednej karcie.**

## K3 — Mapa Śródziemia T1 + protokół pinezek (PR-2/PR-3)

Research podkładu (MA1), struktura `maps/srodziemie/`, pierwsza pinezka
(1LTR, region Dunlandu, poziom pewności), render strony mapy z pan/zoom
i deep-linkiem `#/mapa/srodziemie`. Ocena jakości zoomu → decyzja o T2.

## K4 — Silnik map produkcyjnie (PR-3+)

Pan/zoom dotykowy, etykiety w skali, regiony haseł geograficznych,
pinezki z tooltipami i linkami do kart, legenda poziomów pewności.
Rozwój na jednej karcie, dopóki właściciel nie dostarczy kolejnych.

## K5 — Pętla Jakości operacyjna (PR z pierwszym przebiegiem)

`tools/wiki-stats.mjs` (completeness score) + pierwszy pełny przebieg
pętli: pogłębianie, link-mining, pass mapowy, co-nowego. Wprowadzenie
przy pierwszych 3–5 kartach.

## K6+ — Tryb wielokartowy (po decyzji właściciela)

Batche materializacji (10–20 kart/sesję wg dostaw), nowi agenci-wyzwania:
drugi plan i mapa (proces mapowy od nowa), taxonomia tagów w praktyce,
wyszukiwarka fuzzy (backlog).

## Wątki otwarte (czekają na decyzję właściciela)

- Grafiki dla Kart Haseł — czy, jakie, gdzie składowane (ADR 0008 zostawia
  slot; wymaga decyzji + ewentualnego ADR o storage).
- Wektoryzacja T2 mapy Śródziemia — po obejrzeniu T1.
- Pełny offline (cache obrazów Scryfalla w repo) — gdy korzystanie z Pages
  bez sieci będzie realnym scenariuszem.
