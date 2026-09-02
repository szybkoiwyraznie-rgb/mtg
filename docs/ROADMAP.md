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

## K7 — Warsztat mapowy T4: wspólny silnik rysowania map — **w toku (kierunek; ADR 0020: glify adoptowane)**

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
przerenderowany; `map-audit.py` 0.

**PR-9 (2026-09-01) — ADR 0020: adopcja wektorowych obiektów** (zlecenie
właściciela: „nie odkrywać koła"): research GitHub (mapome CC-BY-4.0,
Azgaar MIT i in.) → góry rysują **glify adoptowane z mapome**
(`tools/mapforge/glify-mapaome.mjs`, 30 sylwetek + 3 mega-klastery,
ekstrakcja z podkładu Śródziemia w repo — to JEST benchmark ADR 0015);
`pasmo()` = rozsiew glifów (sinus grzbietu, flip, jitter, sort po dolnej
krawędzi — technika Azgaar); **rzeki w kolorze akwenu, bez gradientu
i opacity** (decyzja właściciela). Atrybucja CC-BY-4.0 w nagłówku SVG,
`map.json` (`zrodlo_glify`), ADR 0020, README, SKILL. Zendikar T4
przerenderowany, audyt 0, testy 87/87. Zostaje: **ubogacanie map
wyłącznie T3/T4** (map T2/adoptowanych nie ruszamy), dalsza kompletność
POI i warsztat (E5 klocki: cytadela/fort, latarnia, wrak, wodospad,
obwódki haseł — kandydat na obiekty: symbole Azgaar, MIT, z atrybucją).

**E-geo (2026-09-01) — audyt i przebudowa geografii CAŁEJ mapy Zendikaru**
(zlecenie właściciela, pkt a/b/c uzupełniające PR-9; audyt:
`docs/audits/AUDYT_2026-09-01-geografia-zendikaru.md`):
- **Wykonane w tej sesji (P0/P1):**
  - Tazeem — mapa dopasowana do treści planu i karty Coralhelm Guide:
    Halimar = **morze śródlądowe** (akwen `jezioro.d`), Sea Gate na murze
    nad kanałem-tamą, Coralhelm na płn. brzegu, Oran-Rief = pas lasu,
    Enclave, Ula Temple, The Bulwark, Emeria nad taflą, rzeki do/wy Halimar.
  - **Cieśnina** Akoum / Bala Ged–Guul Draz (lad-2 rozdzielony na
    `lad-akoum` + `lad-bala-guul`); Bojuka = najdalszy wschód (Bojuka Bay
    przeniesiona na wsch. wybrzeże).
  - POI wg w2: Goma Fada (zach. cypl), Affa (centrum), Malakir/Nimana
    (zamiana stron), Lulea, Surrakar, Zof Marsh, Kabira (wyspa Agadeem),
    Prison of Omath (centrum Ondu), Makindi Trenches; nowe: wysepka
    Valakut z wulkanem (Mt. Valakut usunięta z Akoum), Oko Ugina = pasmo,
    Teeth of Akoum, Tangled Vales, Hanging Swamp + Hagra Cistern.
  - **Drogi = trakty** między największymi miastami/POI (5 dróg zastąpione;
    pkt b). **Etykiety przy obiektach, bez kresek** (silnik nie rysuje już
    `zakotwicz`; 16 etykiet z liniami przysuniętych; pkt a).
  - map.json: 26 kotwic zsynchronizowanych + 9 nowych + pinezka
    Coralhelm Guide przeniesiona + duplikat Living Spire usunięty.
- **Kolejka E-geo (P2 — następne podejścia, audyt §11):**
  1. **E-geo-1** — Archipelag Jwar/Beyeen/Agadeem: przesunięcie z płd.-zach.
     rogu **między Ondu a Akoum** (w2 §1) + pinezki/kotwice.
  2. **E-geo-2** — Tazeem na płd.-zachód (w2 §5) vs obecny zachód-centrum:
     ocena rotacji układu zachodniego (decyzja z właścicielem — zmiana
     globalna).
  3. **E-geo-3** — Detal Murasy: Glint Pass, Thunder Gap, Roaring Falls,
     Tumbled Palace, Visimal, Pillar Plains (kotwice istnieją, brak etykiet).
  4. **E-geo-4** — Detal Akoum: Tal Terig płn. od Spike Fields; Anowon
     League; ~~Ior Ruin przy Glasspool (etykieta)~~ — **etykieta Ior Ruin
     dodana w PR-10 (2026-09-02)**; reszta otwarta.
  5. **E-geo-5** — Bala Ged/Guul Draz: Pelakka Karst, Helix of Zof, nazwa
     zachodniego gulfu (bez nazwy po przeniesieniu Bojuka Bay).
  6. **E-geo-6** — Ondu: Nomads of Silundi Sea (płn. wybrzeże), Tikal
     Harbor (w2 §5).
  7. **E-geo-7** — Tazeem: Sunspring (płn. cypel), Calcite Flats (płd.
     cypel) — w2 §5.
  8. **E-geo-8** — ~~Zweryfikować w kanonie: *Prison of Omath* (spelling w2)
     vs *Prison of Omnath* (BFZ) — ustalić nazwę.~~ **Rozstrzygnięte
     w PR-10 (2026-09-02): kanoniczna nazwa „Prison of Omnath"** (MTG Wiki
     „Ondu"/„Omnath": mesa w Ondu, krąg wiążący, Ritual of Lights, Soul
     Stair); scena/map.json/podkład przemianowane.
  9. **E-geo-9** — Hada w centrum Tazeem (w2) vs obecne płd.-zach.

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
  mapy (render-map.js) na ładowanie asynchroniczne (mapy jako `<img src>`,
  nie `fetch` — żeby działały po otwarciu lokalnie z `file://`).
  Reużywalność klocków mapforge NIE rozwiązuje rozmiaru (unikalna
  geometria per mapa), więc to jedyna droga. Pomiar i analiza: 2026-09-01.
- **Pobieranie offline (ZIP) — gotowe (2026-09-01):** build wypuszcza
  `dist/mtg-lore-codex.zip` (`tools/zip.mjs`, STORE bez zależności);
  aplikacja ma link **„Pobierz archiwum (ZIP)"**. ZIP pakuje artefakt +
  `index.html` (a po wydzieleniu map także cały `maps/**`), więc po
  rozpakowaniu otwiera się lokalnie — zastępuje „zapisz jako" dla
  jednopliku i zostaje funkcją także przy osobnych mapach.
