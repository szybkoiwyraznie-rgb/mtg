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
zamknięty decyzją właściciela 2026-09-05; **ADR 0043, 2026-09-08: na
mapie oznaczenia noszą wyłącznie karty** — hasła łączą się z mapą
odsyłaniem `?x=&y=`); dalszy rozwój po dostawach kolejnych kart.

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

**Pakiet Final Fantasy (scalony w PR-18, 2026-09-05; plan w
`docs/plans/PLAN_2026-09-05-pr19-final-fantasy-midgar.md`):** czwarta karta
(dostawa właściciela: `275FIN Aerith Rescue Mission`) wprowadziła sagę
Final Fantasy. Decyzje właściciela: jeden plan `final-fantasy` z mapą per
część sagi (ADR 0032 — NIE kontynenty na jednej mapie, NIE osobne plany
per świat); mapa Midgaru T3 z płaskiego schematu MMTS (ReverendRyu) jako
prywatnej referencji poza gitem; rozbudowa silnika o klucz rejestru
`plan/podmapa`. Pakiet domknięty wraz z Alarą (305ARB, ADR 0033) w PR-18.

**PR-19 (2026-09-05/06, scalony 2026-09-06 15:30) — audyt PR-18:**
audyt wykazał zgodność z ADR (integralność 104/104, map-audit 0) i wyłonił
kolejkę Z1–Z5 (dryf terminu „Fabuła dostawy" wobec ADR 0026, odsyłacze ADR
w treści kart, luka pokrycia ui-smoke, source snapshotów, plany cytujące
ADR). Wykonane w tym PR: naprawy Z1–Z5 (deb7cc51) + **rewamp mapy Alary v2**
po recenzji właściciela (b1904dd8): Esper jako archipelag na Morzu Esper,
Maelstrom jako równoprawny węzeł (pseudo-biom `wir`), ~28 kanonicznych POI.
Wynik i kolejka: `docs/audits/AUDYT_2026-09-05-PR18.md`;
`docs/audits/AUDYT_2026-09-06-PR19.md`.

**PR-20 (2026-09-06, scalony 2026-09-06 16:11) — audyt PR-19:**
audyt potwierdził naprawy Z1–Z5 i rewamp Alary v2 (ADR 0031/0033, pinezka
305ARB point-in-polygon) i wyłonił kolejkę A1–A4 — same niedomknięcia
sesji PR-19 (strona Alary za mapą v2, brak wpisów co-nowego /
PROJECT_HISTORY, ROADMAP bez statusu scalenia). Wykonane w tym PR: A1–A4
oraz **lekcja L9** (opis PR kumulatywnie po każdym commicie). Pętla
Jakości bez kandydatów do pogłębiania i link-miningu. Wynik:
`docs/audits/AUDYT_2026-09-06-PR19.md`.

**PR-21 (2026-09-06–07, scalony 2026-09-07 20:47, `6bf2fba`) — audyt PR-20:** pierwszy audyt z recenzją
wizualną podkładów (raster poza repo, SKILL_MAPA_PLANU §8): PR-20 bez wad;
usterki typograficzne mapy Alary W1–W3 (tytuły Jund/Grixis/Naya na ikonach
i pasmach — poprawione w danych sceny), B1 (brak wpisu PR-20 tu i w
PROJECT_HISTORY — uzupełnione), B2 (wdrożona kontrola tytuł↔obiekt
w `map-audit`, z fixturą regresyjną i bramą w `npm test`). Wynik: `docs/audits/AUDYT_2026-09-06-PR20.md`.
**Pakiet 2 tego samego PR (zlecenie właściciela):** 488SOM Carapace
Forger + nowy plan **Mirrodin** z mapą **T4** (rekonstrukcja kanoniczna
w mapforge: tarcza-półkula metalowej sfery, pięć regionów wg cyklu
fastlandów SOM, powierzchnia od Argentum po wojnę o New Phyrexię;
`maps/mirrodin/`), strona planu,
karta LORE-first z pinezką `region` w Tangle. Roadmapa:
`docs/plans/PLAN_2026-09-06-pr21-mirrodin-carapace-forger.md`.
**Pakiet 3 tego samego PR (2026-09-07, zlecenie właściciela):** 509KTK
Highland Game + nowy plan **Tarkir** z mapą **T4** (mapforge na geometrii
fanowskiej mapy Lore Café dostarczonej przez właściciela — ADR 0031;
epoka khanów na wspólnej siatce regionów — ADR 0033/0035;
różnice kanonu i tożsamości miejsc skorygowane audytem PR-22;
`maps/tarkir/`), strona planu, karta LORE-first z pinezką `region`
w Qal Sisma; nowe klocki mapforge `pustynia` i `szczyt`. Roadmapa:
`docs/plans/PLAN_2026-09-07-pr21-tarkir-highland-game.md`. Recenzja
mapy przez właściciela → ADR 0034 (hydrologia, lód↔pasma, rozpadlina,
ramka full-bleed). **Decyzja właściciela po recenzji: T1 dla Tarkiru** —
raster Lore Café w repo jako podkład epoki Dragonstorm, T4 jako epoka
khanów, **przełącznik epok** na stronie mapy, **jeden układ współrzędnych
(złoty = raster T1)**, T1 bez etykiet Codexu → ADR 0035; silnik map
obsługuje `warianty[]` dla każdej mapy (K3 T1 wraca do gry: precedens
PR-13 „T1 odrzucony licencyjnie” nie blokuje projektu prywatnego).
PR #21 pozostawał otwarty podczas pracy nad pakietami; po zakończeniu
sesji został scalony przez właściciela.

**PR-22 (2026-09-07, gotowy do recenzji, niescalony) — audyt PR-21 i Pętla Jakości:**
pełny przegląd 61 plików, naprawy A1–A6/E1: kanon Tarkiru, pięć pełnych
snapshotów, przełączanie map, mobile i usunięcie duplikatu SVG.
Pętla: **2 pogłębienia** (Aerith Rescue Mission, Mirrodin), **1 hasło**
(Nowa Phyrexia, dwa konteksty kart z różnych planów), pass mapowy w ramach
napraw i ponowne QA. **132 testy; 15 stron = 7 kart, 1 hasło, 7 planów**.
Raport: `docs/audits/AUDYT_2026-09-07-PR21.md`; podsumowanie i ograniczenia:
`docs/setup/HANDOFF_2026-09-07-pr22.md`. Surowe stats 98% wynikają z braku
nieobowiązkowej pinezki hasła społecznego, nie z brakujących sekcji lore.

**Rozszerzenie PR-22 — 605SHM Consign to Dream / Lorwyn:**
research i rekomendacja przed materializacją zakończone. Jeden plan,
dwa klasyczne oblicza epoki Oony, domyślny Shadowmoor; para Varghedina
jako kandydat T1/T1, zależnie od pełnego QA i zgody właściciela.
Raport: `docs/research/RESEARCH_2026-09-07-lorwyn-shadowmoor.md`.
Właściciel wybrał **T4** (ADR 0037) — rastry fanowskie nie weszły.

**PR-23 (2026-09-08) — przejęcie przerwanej sesji i domknięcie pakietu.**
Sesja PR-22 urwała się przed pushem; commity + dostarczony `.patch`
zostały przejęte na gałąź `arena/01a07fc3-mtg` (PR #23). W bazie są już
karta **605SHM**, plan **Lorwyn–Shadowmoor** i mapa **T4 z przełącznikiem
dwóch oblicz** (wspólna geometria, dwa słowniki nazw). **143 testy;
17 stron = 8 kart, 1 hasło, 8 planów**; map-audit 0; obie mapy obejrzane
rastrowo. Handoff: `docs/setup/HANDOFF_2026-09-08-pr23.md`.
**Po handoffie 6 commitów** (nowe dostawy właściciela): 476MBS Banishment
Decree (Mirrodin, biała Phyrexia), ADR 0038 (drabina T2→T1→T3→T4) +
research Innistradu, raster T1 od właściciela, 393DKA Forge Devil + plan
**Innistrad z mapą T1** (64 kotwice), research Dominarii (T1 + podmapa
Aerony). Scalony 2026-09-08 12:17 UTC (squash `eca14c0`). **Finalnie:
143 testy; 20 stron = 10 kart, 1 hasło, 9 planów**; PR #22 zamknięty
jako wchłonięty. Handoff/opis PR nie nadążyły za końcówką (L9 — patrz
audyt `docs/audits/AUDYT_2026-09-08-PR23.md`, znalezisko F2).

**PR-25 (2026-09-08) — audyt scalonego PR-24 + naprawy treści + decyzja o mapie Dominarii:**
audyt scalonego PR-24 (Dominaria T1 + podmapa Aerony D1; 81 plików)
wykazał wady proceduralne: wnioskowanie z oryginalnej ilustracji karty
(F1 — zabronione, **ADR 0040**), podmapa jako wycinek bazy bez nowego
detalu (F2 — **ADR 0041**), pinezka z ilustracji zamiast z podkładu (F4).
Naprawione w tym PR: karta Expunge przepisana z Fabuły + kanonu,
strażnik `test/druk-zrodlowy.test.js` (zero nawiązań do ilustracji/
wignet/artystów w katalogu kart), strona planu „Mapa” + „Źródła”,
errata researchu. Po decyzji właściciela: **L2 „Domeny” i
`aerona.jpg` usunięte** (mapa = całość FHD + kafelki od zoomu);
pinezka 40USG zmierzona na M1 master (px 1569,1979 → 0.1937,0.3806;
pewność: region); kotwice bez D1. **Build:** pełny build czyści `dist/`
(usunięte pliki znikają z drzewa i ZIP-a). **Kontynuacja (recenzja
właściciela odpowiedzi o ZIP):** wektorowe bazy dublowane w ZIP-ie
(~28,8 MB; mini-mapy T4 dociągały pełny 8,3 MB SVG) → **ADR 0027 v3**:
mini-mapa = `mini.jpg` generowany w buildzie (800 px, q80;
`@resvg/resvg-js` dev-only, silnik zero-dependency, CI `npm ci`;
fallback ImageMagick → pełna baza), drzewo bez wektorowych baz,
pole `miniatura` wycofane. **ZIP 90,5 → 62,1 MB (−31%)**.
**159 testów; 22 strony = 11 kart, 1 hasło, 10 planów**; map-audit 0.
Raporty: `docs/audits/AUDYT_2026-09-08-PR24.md`,
`docs/plans/PLAN_2026-09-08-pr25-dominaria-l2-i-druk-zrodlowy.md`.

**PR-28 (2026-09-09) — Kaladesh: odrzucenie jednowarstwówki, LOD ścieżką
Dominarii + prawdziwa przebudowa Ghirapuru.** Właściciel odrzucił mapę
16000×11000 (wolna, biomy za małe, kolizje w mieście): plan jest teraz
lekki (1,1 MB, Ghirapur tylko plamą z nazwą), a detal miasta to osobna
płyta L2 (1400×740, ~200 kB) dokładana od progu 6. Miasto
reprojektowane: kaflikowanie dzielnic (zero nachodzeń), mury poza
obrysem z bramami i przerwami na rzeki, las łęgowy osobnym kaflikiem,
Aleja Olbrzymów z powrotem u bram (zakaz fix-by-deletion) — **ADR 0046**.
Silnik: `wstega`/`rzeka`/`doplyw` z `taper:false` (płaskie cięcie płytą),
`sprawdzHydrologie` zwalnia rzeki na krawędzi płyty; audytor pkt 8–9
(geometria miasta + SVG płyt L2); szew wodny (pozycja ±1 j., szerokość
±0,05 ze stożka planu) pilnuje test w `test/lod.test.js`. Build kopiuje
wektorową płytę L2 do drzewa (wyjątek ADR 0027 v3 — leniwy `<img>`).
Stary generator `kaladesh-scena-t4.py` usunięty. **176 testów**;
map-audit 0; szew i Cowl zweryfikowane rastrowo (resvg).

**PR-29 (2026-09-09) — audyt PR-28 i Pętla Jakości.** Audyt: PR-28
powyżej standardu; 5×P3 (N1–N5) — wszystkie naprawione w tej sesji:
deep-linki w „Na Mapie” (3 karty), epoka mapy bez szczegółu
niepotwierdzonego, Bunarat + wieże (5) na listach umownych,
konwencja nazewnictwa bezimiennych POI (SKILL pkt 8), KOREKTA
liczników w HANDOFF PR-28 (176/176, 31 stron). Pętla Jakości:
pogłębienie strony Kaladeshu (Aetherflux Reservoir + detal dzielnic
+ sekcja „Kultura i codzienne życie”); link-mining bez nowych haseł
(próg L17 — kolejka Kaladeshu o 1 kartę); pass mapowy: Aetherflux
Reservoir na płycie L2 Ghirapuru, nowy klocek mapforge `zbiornik`.
**176/176 testów**; 31 stron (15/4/12); map-audit 0; ZIP 87,8 MB.
Raport: `docs/audits/AUDYT_2026-09-09-PR28.md`.

**PR-30 (2026-09-10) — Kaladesh jako dwie osobne mapy.** Korekta
właściciela: plan przeskalowany do skali planu **2000×1400** (jak
Zendikar — duże, proporcjonalne góry/lasy; Ghirapur jako POI-kropka),
a Ghirapur to **osobna mapa** o własnej skali (~7× planu) z **twardą
podmianą** deep-zoom (crossfade, bez wymogu sztywnego szwu).
**ADR 0047** (luzuje ADR 0046 §5). map.json (wymiary/bbox/kalibracja/
widok), pinezka 610M19 → Greenwheel, testy `lod`/`ui-smoke`
zaktualizowane (test szwu wodnego → test „osobna mapa o własnej
skali"), treść (co-nowego + strona planu). **176/176 testów**;
31 stron (15/4/12); map-audit 0. Audyt PR-29:
`docs/audits/AUDYT_2026-09-10-PR29.md`.

**PR-31 (2026-09-10/11) — dwie Pętle Jakości + 15 materializacji.**
Audyt PR-30; pogłębienie lore; hasła `conflux`, `grixis`, `esper` i
`stensia`; reguła L18. Następnie 15 pełnych kompletów
wpis–snapshot–karta–mapa: 362BRO, 171ISD, 181AVR, 544AVR, 596ORI,
612BLB, 118MID, 537CMR, 539CLB, 83MM2, 19_8ED, 209ELD, 312M13, 531M3C
i 347NPH. Nowe plany: **Eldraine T4** oraz **Wiedźmin T1/LOD**.
Stan przy scaleniu: **180/180 testów**, 57 stron (33/9/15), drzewo 859
plików, map-audit 0, wiki-stats 100%. Po audycie PR-31 sesja PR-32
zachowała zatwierdzone T4 Eldraine i naprawiła F1–F13, w tym wycofała
niepotwierdzone Carmot Mines/Ruins of Vithia. Szczegóły:
`docs/setup/HANDOFF_2026-09-10-pr31.md` oraz
`docs/audits/AUDYT_2026-09-11-PR31.md`.

**PR-32 (2026-09-11/12) — audyt PR-31, naprawy F1–F13 oraz 132GNT,
42ISD, 555DSK i 540DST.** Audyt pełnych 251 plików; decyzja właściciela
zachowująca Eldraine T4; naprawy DFC, 347NPH, 209ELD, semantyki i
kompozycji Eldraine, POI Alary, cytowań, dokumentacji, czasów ADR 0029,
storage Wiedźmina i redakcji. Dodano repo-szerokie strażniki ADR 0040/0044
oraz regresje map i zamknięcia. Po pierwotnym zamknięciu doszły cztery pełne
materializacje:

- **132GNT Pilgrim's Eye** — GNT #55, korowy zwiadowca i przybliżona
  pinezka przy Sea Gate;
- **42ISD Murder of Crows** — ISD #70, stensiański cmentarz, błękitne
  wspomnienia i regionalna pinezka na kotwicy Stensii;
- **555DSK Bedhead Beastie** — DSK #125, opuszczona chata z kudłatym
  bebokiem oraz dwoma redańskimi milicjantami; regionalna pinezka Velen
  bez wymyślania dokładnej osady i bez automatycznego utożsamienia
  stworzenia z biesem;
- **540DST Chittering Rats** — DST #39, stado pseudoszczurów w kanałach
  Novigradu, samotny poszukiwacz chroniący mapy i mechaniczne opóźnienie
  planu bez utraty zasobu; dokładna kotwica miasta bez zmyślonego tunelu.
  Link-mining utworzył hasło `novigrad` po spełnieniu progu dwóch kart.

W każdej dostawie `imgId` właściciela jest jawnie oddzielone od collector
number, a Fabuła została zachowana verbatim przed researchem. Finalne
bramki: **207/207**, build 62 strony (37/10/15) / 859 plików drzewa archiwum,
map-audit 0, wiki-stats 100%. Szczegóły:
`docs/setup/HANDOFF_2026-09-11-pr32.md`.

**PR-33 (2026-09-12) — audyt PR-32 + 279M21 Village Rites + 110DVD
Serra's Embrace.** Audyt PR-32 zamknięty bez nowych P0/P1; raport wskazał
trzy drobne follow-upy i zostały one obsłużone przed dostawami: liczniki
drzewa w żywych dokumentach 853→859, trailing whitespace w planach
historycznych oraz nieużyte źródło Razor Fields w 347NPH. Materializacja
**279M21 Village Rites** — M21 #126, wiejski obrzęd w Downwarren/Sztygarach,
szeptucha z Velen, księga rodowa długu i zapłaty, woda z Krzywuchowych
Moczarów, gospodarz z Czarnoboru, klęczący parobek, biała koza z czerwoną
wstążką i zakapturzeni sąsiedzi. Pinezka `region` dziedziczy kotwicę Velen
(`0.4113/0.2807`), bo T1 nie rozrysowuje chaty ani wsi. Link-mining
utworzył hasło `velen` po spełnieniu progu przez 555DSK i 279M21.
Druga dostawa w tym PR: **110DVD Serra's Embrace** — DVD #21, zwykły
ludzki piechur na polu bitwy Dominarii objęty eteryczną łaską Serry,
skrzydła światła i anielskie dłonie na rękojeści miecza. Pinezka ma pewność
`region` i używa Sursi / Katedry Serran (`0.1937/0.3806`) jako kotwicy
tradycji, nie dokładnego pola bitwy. Link-mining utworzył hasło `serra`
po spełnieniu progu przez Expunge i Serra's Embrace. **217/217 testów**;
build 66 stron (39/12/15) / 859 plików drzewa archiwum; map-audit 0;
wiki-stats 100%. Handoff: `docs/setup/HANDOFF_2026-09-12-pr33.md`.

**PR-33 cd. (2026-09-12) — 516RNA Tenth District Veteran + hasła Ravniki.**
Materializacja **516RNA Tenth District Veteran** — właścicielski `imgId`
516RNA zachowany oddzielnie od druku **RNA #26**. Karta czyta scenę jako
rodzimą dla Ravniki: dojrzała weteranka Legionu Boros w sercu Dziesiątego
Dystryktu stoi na zrujnowanej barykadzie, broni wejścia do placu targowego
i dźwiga młodszego rekruta do szyku. Pinezka ma pewność `region` i używa
kotwicy Tin Street Market (`0.3406/0.4318`) bez udawania dokładnej barykady.
Link-mining po drugiej karcie Ravniki utworzył hasła `boros-legion`,
`dziesiaty-dystrykt` i `tin-street-market`; Withstand dostał wikilinki
zasilające próg, a hasła odsyłają do mapy tylko deep-linkami `?x=&y=`.
**222/222 testów**; build 70 stron (40/15/15) / 859 plików drzewa archiwum;
map-audit 0; wiki-stats 100%. Handoff:
`docs/setup/HANDOFF_2026-09-12-pr33.md`.

**PR-33 cd. (2026-09-12) — Pętla Jakości: Gavony i Kessig.** Po zielonym
kroku 0 pętla przeszła do link-miningu Innistradu. Powstały hasła
`gavony` i `kessig` po progu dwóch kart; dopięto wikilinki w kartach
118MID, 181AVR, 171ISD, 544AVR, 309ISD i 393DKA, na planie Innistradu oraz
w powiązanych hasłach. Innistrad jest T1, więc pass mapowy nie zmienił
rastra; hasła prowadzą tylko deep-linkami do kotwic regionów Gavony
(`0.59/0.449`) i Kessig (`0.41/0.727`). Dodano regresję
`test/innistrad-link-mining.test.js`, w tym strażnik działającego URL-a
Gavony `2011-09-28`. **226/226 testów**; build 72 strony (40/17/15) /
859 plików drzewa archiwum; map-audit 0; wiki-stats 100%. Handoff:
`docs/setup/HANDOFF_2026-09-12-pr33.md`.

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
