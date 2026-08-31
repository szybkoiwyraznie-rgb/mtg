# Roadmapa

Kamienie (K) odpowiadają naturalnym PR-om; kolejność jest umowna —
priorytet w każdej chwili ustawia właściciel (dostawy kart mają zawsze
pierwszeństwo). Stan aktualizuje się na końcu sesji.

## K1 — Fundamenty (PR-1) — **domknięte** (merged; CRIT: Pages publikuje)

Struktura repo, AGENTS.md, ADR-y 0001–0008, ENVIRONMENT, gidy, silnik
z pustą bazą, testy integralności + fixture'y, CI + Pages, szablony
GitHub, konfiguracja repo (ochrona main).

## K2 — Pilot: 1LTR Dunland Crebain end-to-end — **domknięte** (materializacja 1LTR + mapa Śródziemia; do tego doszedł 2BFZ, mapa Zendikar)

Pierwsza materializacja: wpis kolekcji (dostarczony 2026-08-31) → snapshot
Scryfall → pełna Karta Katalogowa (wszystkie sekcje szkieletu, cytowania
z kwerendy) → strona planu Śródziemie → build + Pages. **Cel: walidacja
całego pipeline'u i obu typów stron na jednej karcie** — osiągnięty.

## K3 — Mapa Śródziemia T1 + protokół pinezek — **domknięte** (wariant T2 przez adopcję mapome)

Research podkładu (MA1), struktura `maps/srodziemie/`, pierwsza pinezka
(1LTR, region Dunlandu, poziom pewności), render strony mapy z pan/zoom
i deep-linkiem `#/mapa/srodziemie`. Ocena jakości zoomu → decyzja o T2.

## K4 — Silnik map produkcyjnie — **w toku (rdzeń gotowy)**

Pan/zoom dotykowy, etykiety w skali, pinezki z tooltipami i linkami do
kart, legenda poziomów pewności, deep-link `#/mapa/…?pin=`, mini-mapa
w infoboksie karty — działają (zweryfikowane na 2 kardach). Zostaje:
**regiony/obwódki haseł geograficznych** (wymagają istnienia haseł —
przed osiągnięciem progu ≥2 kart), dalszy rozwój po dostawach kolejnych kart.

## K5 — Pętla Jakości operacyjna — **domknięte (PR-3, 2026-08-31)**

`tools/wiki-stats.mjs` (completeness score, wzór PETLA_JAKOSCI — max 8)
+ pierwszy pełny przebieg pętli (pogłębianie planów, link-mining — brak
haseł, pass mapowy — bez braków, co-nowego). Progi twarde — gdy zbiorą
się dane referencyjne.

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
