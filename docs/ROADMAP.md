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
linkiem). Regiony/obwódki haseł geograficznych NIE są zadaniem (wątek
zamknięty decyzją właściciela 2026-09-05); dalszy rozwój po dostawach
kolejnych kart.

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
POI i warsztat. ~~E5 klocki: cytadela/fort, latarnia, wrak, wodospad~~ —
**domknięte w PR-11 (2026-09-02, ADR 0028):** klocek `fort` rysowany
ręcznie w języku mapy (sylwetka w kole), użyty na Fort Keff + stone
havens Akoum (Grip/Slab Haven, Ghostwatch); `wodospad` istniał od PR-10;
latarnia/wrak ODRZUCONE (żaden kanoniczny nazwany obiekt ich nie
potrzebuje; adopcja symboli Azgaar odrzucona — styl fasetowany nie pasuje
do atlasu). E5 domknięte w całości: „obwódki haseł" odrzucone decyzją
właściciela 2026-09-05 (nie są zadaniem).

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
  1. **E-geo-1** — ~~Archipelag Jwar/Beyeen/Agadeem: przesunięcie z płd.-zach.
     rogu **między Ondu a Akoum** (w2 §1) + pinezki/kotwice.~~ **Domknięte
     w PR-11 (2026-09-02) KANONEM, w2 odrzucona:** kanon wiąże wyspy
     z wybrzeżem Ondu („one central landmass with three major islands off
     its coast" — MTG Wiki: Ondu), więc przenosiny na środek mapy łamałyby
     kanon. Zamiast tego archipelag naprawiony od środka: „tiny, sea-swept"
     **Jwar** przeniesiona pod PŁD. wybrzeże lądu Ondu (Guide: Ondu) razem
     z Jwar Isle Refuge + nowe wody **Serpent's Maw** wokół niej;
     **Beyeen** scalona z dawną wysepką-satelitą Valakuta (kanon:
     Mount Valakut = szczyt Crown of Talib W SERCU Beyeen —
     mtg.wiki/Valakut; notka „Valakut w sercu Akoum" z 2026-09-01 była
     błędna, naprawiona); **Agadeem** największa i najdalej na płd. już
     była zgodna z kanonem.
  2. **E-geo-2** — ~~Tazeem na płd.-zachód (w2 §5) vs obecny zachód-centrum:
     ocena rotacji układu zachodniego (decyzja z właścicielem — zmiana
     globalna).~~ **Rozstrzygnięte w PR-11 (2026-09-02) KANONEM — rotacja
     ODRZUCONA bez potrzeby decyzji:** kanon mówi wprost „Ondu is located
     in the southwestern quadrant of Zendikar" (MTG Wiki: Ondu), a nasz
     układ ma Ondu dokładnie tam; rotacja wg w2 (Ondu na zachód-centrum)
     łamałaby kanon. Znana pozostała rozbieżność wobec kanonu: „a small
     sea separates Akoum from Ondu" (MTG Wiki: Akoum) — u nas rogi
     przeciwległe; pełna naprawa = globalna przebudowa całej mapy,
     odnotowana jako wątek otwarty (decyzja właściciela).
  3. **E-geo-3** — ~~Detal Murasy: Glint Pass, Thunder Gap, Roaring Falls,
     Tumbled Palace, Visimal, Pillar Plains (kotwice istnieją, brak
     etykiet).~~ **Wpis był NIEAKTUALNY — etykiety weszły już w PR-10
     (commit 4d8c6f0); zweryfikowane w PR-11 (scena + podkład, wszystkie
     6 nazw na mapie).**
  4. **E-geo-4** — ~~Detal Akoum: Tal Terig płn. od Spike Fields; Anowon
     League;~~ ~~Ior Ruin przy Glasspool (etykieta)~~ — **etykieta Ior Ruin
     dodana w PR-10 (2026-09-02)**; **reszta domknięta w PR-11 KANONEM
     (w2 skorygowana):** Tal Terig („Puzzle Tower") wg Guide: Akoum wznosi
     się nad kotliną Akoum PRZED resztkami Teeth of Akoum — przeniesiony
     tam i przetypowany na ruinę (nie „płn. od Spike Fields" jak w w2);
     „Anowon League" to kanonicznie **League of Anowon** — obóz-szkoła
     magów-eksploratorów WYSOKO w Teeth of Akoum (dostęp gryfem z Affy),
     dodany jako osada z etykietą (nie „terytorium w centralnym Akoum").
  5. **E-geo-5** — ~~Bala Ged/Guul Draz: Pelakka Karst, Helix of Zof, nazwa
     zachodniego gulfu (bez nazwy po przeniesieniu Bojuka Bay).~~
     **Domknięte w PR-11 (2026-09-02):** Pelakka Karst na mapie (kras wokół
     Hagra Cistern — Guide: Guul Draz); Helix of Zof był na mapie od PR-10;
     zachodnia zatoka: kanon jej NIE nazywa → zostaje bez etykiety
     (nie zmyślamy nazw, ADR 0010/0023).
  6. **E-geo-6** — ~~Ondu: Nomads of Silundi Sea (płn. wybrzeże), Tikal
     Harbor (w2 §5).~~ **Domknięte w PR-11:** Silundi Sea jako morze przy
     Ondu (Guide: Ondu; „nomadzi Silundi" to lud, nie POI); **Tikal
     Harborage** kanonicznie leży na TAZEEM (rozlewisko w górze kanału od
     Sea Gate — Art of MTG: Zendikar), nie na Ondu jak w w2 → dodany na
     Tazeem (kanon > fanmapa).
  7. **E-geo-7** — ~~Tazeem: Sunspring (płn. cypel), Calcite Flats (płd.
     cypel) — w2 §5.~~ **Domknięte w PR-11:** kanon — Calcite Flats
     otaczają CAŁE wybrzeże (etykieta na płd. odcinku, spójnie z w2),
     Sunspring w ławicach POD Bulwarkiem (nie płn. cypel; Lore of
     Zendikar: Ancient Sites of Tazeem).
  8. **E-geo-8** — ~~Zweryfikować w kanonie: *Prison of Omath* (spelling w2)
     vs *Prison of Omnath* (BFZ) — ustalić nazwę.~~ **Rozstrzygnięte
     w PR-10 (2026-09-02): kanoniczna nazwa „Prison of Omnath"** (MTG Wiki
     „Ondu"/„Omnath": mesa w Ondu, krąg wiążący, Ritual of Lights, Soul
     Stair); scena/map.json/podkład przemianowane.
  9. **E-geo-9** — ~~Hada w centrum Tazeem (w2) vs obecne płd.-zach.~~
     **Domknięte w PR-11 (2026-09-02) kanonem:** kanoniczna nazwa
     **North Hada**, pozycja: północne wyżyny przy źródle Umary (Art of
     MTG: Zendikar via mtg.wiki/Tazeem) — ani centrum (w2), ani
     płd.-zach.; przemianowane i przeniesione + trakt do Coralhelm.

**PR-13 (2026-09-03) — klocki T4 „miasto", pierwszy plan-miasto:** dostawa
137GPT wymusiła mapę Ravnicy; research (MA1) odrzucił T1 (oficjalne rastry
WotC **nieosadzalne licencyjnie**) i potwierdził brak T2/T3 → **mapa T4
z kanonu tekstowego** (MTG Wiki / GGR 2019: graf sąsiedztw 6 precyktów
Dziesiątki, arterie, POI — spójny bez dojścia do geometrii 1:1). Nowe
klocki: `dzielnice` + `granicaDzielnicy` (z dedupe krawędzi
współdzielonych w rendererze), `mury` (blanki + brama), `szczeliny`
(z mostem), `duchy-tkaniny` (miasto poza ramką), `gruz` (rubblebelt),
POI miejskie, drzewo hero; plus plan `content/planes/ravnica.md` i karta
3. Zendikar po zmianach re-renderuje się bajtowo identycznie.

**PR-13 sesja 3 (2026-09-03) — wykonany krok v2 (transkrypcja GGR):**
właściciel dostarczył transkrypcję tekstową oficjalnej mapy „The Tenth
District" (GGR) w układzie kartezjańskim kadru → scena przebudowana na
koordynatach transkrypcji (transformacja 64 px/j., plac → (830, 610));
55 kotwic map.json (12 nowych: Statue of Agrus Kos, Vizkopa Bank,
Whitestone, Plaza East/West/South, Great Concourse, Gore House, Medori
Park + 3 markery podziemi z warstwą „podziemie"); pinezka karty przy
Tin Street Market; fix silnika (escapowanie XML w etykietach — „&").
**Zostaje (v3):** wektoryzacja dostarczonej przez właściciela fan-made
mapy Dziesiątego Dystryktu jako dokładniejszego podkładu (jeśli plik
źródłowy będzie dostępny w sandboxie; bez commitowania rastra źródłowego),
warstwy epokowe, pełny przekrój Undercity, drugi punkt odniesienia
(opis fanowskiej nakładki) — szczegóły `mapa-analiza.md`.

**PR-14 (2026-09-03) — audyt PR-13 + Pętla Jakości + przygotowanie v3:**
audyt scalonego PR-13 (spójny z ADR-ami; 5 drobnych pozycji →
obsłużone); pogłębienie planu Rawnicy („Ludy” + 2 cytowania);
kolejka link-miningu Rawnicy w backlogu (próg = 2 karty); pass mapowy
— 3 pozycje otwarte zweryfikowane kanonem (Guildpact Square + Pillar
of the Paruns, Beacon Tower, Gnat Alley — bez współrzędnych do v3).
**v3 — BLOKOWANE ŚRODOWISKOWO:** właściciel dostarczył fan-made mapę
w 3 warstwach (a/b/c) + link Drive, ale rastery nie dotarły do sandboxa
(załącznik UI niewidoczny; egress zablokowany; fetch_page na Drive →
500). Procedura wektoryzacji gotowa w
`maps/ravnica/zrodlo-fanowska-wektoryzacja.md` — odpalenie w chwili,
gdy pliki będą dostępne.

**SKALOWANIE MAP (pomiar 2026-09-01 → decyzja domknięta w PR-11 / ADR 0027):**
artefakt jednoplikowy z epoki base64 miał **4,45 MB, z czego 96,7% to
base64 dwóch map** (Śródziemie 1,75 MB + Zendikar 1,54 MB raw;
kod+treść+style ≈ 65 KB). Analiza była trafna: mapforge „klocki" są
reużywalne w kodzie, ale każda mapa ma **unikalną geometrię**, więc
reużywalność oszczędza autorstwo, nie bajty. Skutek: w PR-11 wdrożono
**drzewo HTML map** (ADR 0027 v2) — artefakt główny spadł do ~0,25 MB,
a mapy żyją jako osobne strony `dist/maps/<plan>.html` z surowymi
podkładami `dist/maps/<plan>/<plik>` i ZIP-em całego drzewa.

**PR-19 (2026-09-05, w toku) — Final Fantasy: plan-franczyza + Midgar + karta 275FIN:**
czwarta karta (dostawa właściciela: `275FIN Aerith Rescue Mission`)
wprowadza sagę Final Fantasy. Decyzje właściciela: jeden plan
`final-fantasy` z mapą per część sagi (ADR 0032 — NIE kontynenty na
jednej mapie, NIE osobne plany per świat); mapa Midgaru T3 z płaskiego
schematu MMTS (ReverendRyu) jako prywatnej referencji poza gitem,
fallback T4. Kroki P1–P5 w
`docs/plans/PLAN_2026-09-05-pr19-final-fantasy-midgar.md`; rozbudowa
silnika o klucz rejestru `plan/podmapa`.

## Wątki otwarte (czekają na decyzję właściciela)

> **Zamknięte decyzją właściciela 2026-09-05 — NIE wracać do nich:**
> globalna geometria Zendikaru (układ Akoum–Ondu), „obwódki haseł" (E5)
> oraz rozszerzenia mapy Ravniki poza złoty standard a/b/c. Właściciel:
> „ja tego nie wymyśliłem, nie chcę tych zadań". Wpisy skasowane;
> ta notka istnieje tylko po to, żeby przyszłe sesje ich nie odtwarzały.

- Grafiki dla Kart Haseł — czy, jakie, gdzie składowane (ADR 0008 zostawia
  slot; wymaga decyzji + ewentualnego ADR o storage).
- Wzbogacenie mapy Śródziemia (T2, podkład mapome) o warstwy
  przyrodniczo-osadnicze w duchu warsztatu T4 — gdy właściciel zechce
  (analogia do Zendikaru z PR-3).
- Pełny offline (cache obrazów Scryfalla w repo) — gdy korzystanie z Pages
  bez sieci będzie realnym scenariuszem.
