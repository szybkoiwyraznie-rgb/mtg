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
w infoboksie karty — działają (zweryfikowane na 2 kardach). Od sesji
PR-4: badge pinezki ukryty do najechania (hover/focus) oraz **warstwa
karty** — kliknięcie pinezki otwiera Kartę Katalogową na zmaksymalizowanej
warstwie nad mapą, zamykanej ✕/tłem/Esc z powrotem do mapy w tym samym
stanie zoomu (progressive enhancement: bez JS pinezka jest zwykłym
linkiem). Zostaje: **regiony/obwódki haseł geograficznych** (wymagają
istnienia haseł — przed osiągnięciem progu ≥2 kart), dalszy rozwój po
dostawach kolejnych kart.

## K5 — Pętla Jakości operacyjna — **domknięte (PR-3, 2026-08-31)**

`tools/wiki-stats.mjs` (completeness score, wzór PETLA_JAKOSCI — max 8)
+ pierwszy pełny przebieg pętli (pogłębianie planów, link-mining — brak
haseł, pass mapowy — bez braków, co-nowego). Progi twarde — gdy zbiorą
się dane referencyjne.

## K6+ — Tryb wielokartowy (po decyzji właściciela)

Batche materializacji (10–20 kart/sesję wg dostaw), nowi agenci-wyzwania:
drugi plan i mapa (proces mapowy od nowa), taxonomia tagów w praktyce,
wyszukiwarka fuzzy (backlog).

## K7 — Warsztat mapowy T4: wspólny silnik rysowania map — **w toku (kierunek; glify przebudowane)**

Kierunek z doprecyzowania Pętli Jakości (ADR 0015, właściciel 2026-09-01):
reużywalne metody rysowania obiektów (pasma/grzbiety górskie, rzeki
z dopływami, biomu: las/bagno/step/lód/pustynia, osady/ruiny/hedrony),
wspólna paleta pergaminu + halo + legenda, pamięć warsztatu
w `SKILL_MAPA_PLANU.md`. Mapy tworzone od zera (T3→T4, aktualne
i przyszłe plany) dążą jakością do mapy Śródziemia (T2 mapome)
i docelowo ją wyprzedzają; benchmark = porównanie z mapą Śródziemia
+ ocena właściciela. Realizowane passami mapowymi Pętli Jakości
(krok 4) i jako osobne zadania z `docs/plans/`.

**PR-5 (2026-09-01) — glify „hand-drawn":** las = kępa-chmurka (łuki,
cień, haczura), gęsta i nakładająca się; góra = „żagiel" (wklęsło-wypukła,
cień, haczura, `lean`); `pasmo()` ciasno z jitterem. Zendikar T4
przerenderowany; `map-audit.py` 0. Zostaje: **ubogacanie map wyłącznie
T3/T4** (map T2/adoptowanych nie ruszamy), dalsza kompletność POI
i warsztat (E5 klocki: cytadela/fort, latarnia, wrak, wodospad,
obwódki haseł).

**SKALOWANIE MAP (2026-09-01, pomiar buildu):** artefakt jednoplikowy
(ADR 0001/0009) ma **4,45 MB, z czego 96,7% to base64 dwóch map**
(Śródziemie 1,75 MB + Zendikar 1,54 MB raw; kod+treść+style ≈ 65 KB).
Przy 30+ planach (30+ map, każda ~1,5–3 MB raw → ~2,1–4,1 MB base64)
jednoplik urosłby do ~45–90 MB. Analiza: **mapforge „klocki" są reużywalne
w kodzie, ale każda mapa ma UNIKALNĄ geometrię** (pozycje drzew, kontury,
cień), której nie da się zdeduplikować między mapami — reużywalność
oszczędza autorstwo/definicje stylu, NIE rozmiar. **Rozwiązanie skalowania
= mapy jako OSOBNE pliki SVG ładowane na żądanie** (artefakt spadłby do
~0,16 MB / gzip ~52 kB; mapy wczytywane tylko przy otwarciu planu).
Wymaga rewizji ADR 0001/0009 (jednoplikowy artefakt / base64) — decyzja
właściciela (see Wątki otwarte).

## Wątki otwarte (czekają na decyzję właściciela)

- Grafiki dla Kart Haseł — czy, jakie, gdzie składowane (ADR 0008 zostawia
  slot; wymaga decyzji + ewentualnego ADR o storage).
- Wzbogacenie mapy Śródziemia (T2, podkład mapome) o warstwy
  przyrodniczo-osadnicze w duchu warsztatu T4 — gdy właściciel zechce
  (analogia do Zendikaru z PR-3).
- Pełny offline (cache obrazów Scryfalla w repo) — gdy korzystanie z Pages
  bez sieci będzie realnym scenariuszem.
- **Pakowanie map (skalowanie do 30+ map):** przenieść mapy z base64
  (96,7% artefaktu) do OSOBNYCH plików SVG ładowanych na żądanie przy
  otwarciu planu (artefakt ~0,16 MB). Wymaga rewizji ADR 0001
  (jednoplikowy) i ADR 0009 (mapy w base64) + rozdzielenia renderowania
  mapy (render-map.js) na ładowanie asynchroniczne. Reużywalność klocków
  mapforge NIE rozwiązuje rozmiaru (unikalna geometria per mapa), więc to
  jedyna droga. Pomiar i analiza: 2026-09-01.
