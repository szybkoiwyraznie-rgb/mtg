# Historia projektu (dziennik sesji)

> Dokument żywy, ale **NIE jest lekturą startową** (AGENTS.md §0) — sięgaj
> tu grepem/punktowo po kontekst historyczny. Reguły mieszkają w ADR-ach,
> LESSONS i AGENTS.md.

## 2026-09-02 — sesja PR-10 (część 2): recenzja preview właściciela — etykiety (KRYTYCZNE), strefy zajęte, obwódka rzek → ADR 0022

**Zlecenie (czat, recenzja preview):** (a) góry OK ✔; (b) KRYTYCZNE:
etykiety „kompletnie rozjechane" (Kabira nad Agadeem itd.), postulat:
jeden wzór — punkt centralny obiektu, napis zawsze pod nim, konflikt →
zawsze tak samo (pod→nad), odległość względna do zoomu; (c) obwódka
rzek ciemniejszym niebieskim; (d) detekcja i eliminacja nakładania
biomów na góry/jeziora/lód (Sejiri, Ondu) przez zmniejszanie obszaru.

**Przebieg:**
1. **Diagnoza (b):** nakładka `render-map.js` renderuje etykiety
   w stałym rozmiarze ekranowym na pozycjach strojonych w jednostkach
   mapy + rozstaw SVG szukał pozycji w promieniach 16–118 px → dwie
   niezależne przyczyny rozjazdu (hipoteza właściciela trafna).
2. **(b) rozwiązanie systemowe:** `rozstawEtykiety` v3 (jeden wzór,
   drabinka pionowa, sort deterministyczny); `etykieta()` emituje
   `data-ax/ay/r`; nakładka Codexu pozycjonuje od EKRANOWEJ pozycji
   kotwicy (odstęp `r·k` + 3 px, układ przeliczany przy zmianie zoomu,
   tylko dla etykiet widocznych w LOD). Klasyfikacja: obiektowe
   (przyDo lub fs<16) vs obszarowe (duze/kat/fs≥16 bez przyDo).
3. **(d):** `rozrzut(..., wyklucz)` (bboxy+poligony); `pasmoInstancje`
   wydzielone z `pasmo()` (geometria 1:1); render buduje strefy:
   glify pasm, wulkany, jeziora (elipsa/`d`), lód, wcześniejsze biomy.
   Czapa lodowa Sejiri zmniejszona w scenie do zachodu (lita plama —
   rozwiązanie w danych, zgodnie z pkt d właściciela).
4. **(c):** `rzeka()`/`doplyw()` — obrys `PAL.wodaStroke` 1,1/0,8 px.
5. **Regresja znaleziona przy refaktorze:** wulkany w `poi` (typ
   `wulkan`) nie renderowały się od PR-9 (warstwa czytała tylko
   `scena.wulkany`) — Valakut i 3 stożki Akoum wróciły.
6. **Reset workspace w trakcie sesji** (reflog: świeży clone) — commity
   odzyskane wg ENVIRONMENT §2 (fetch + reset --hard FETCH_HEAD,
   checkout plików z commitu backup); bez utraty pracy.
7. **QA:** testy 89/89; map-audit 0; build OK; rastery libvips
   (Sejiri/Ondu/Tazeem/Agadeem/Akoum/Valakut) obejrzane przed pushem.
8. **ADR 0022** + statusy (0021 częściowo zastąpiona); co-nowego,
   handoff, opis PR.

## 2026-09-02 — sesja PR-10: Pętla Jakości v2 (audyt PR-9 → ADR 0021; LORE ludów Zendikaru; E-geo-8/4)

**Kontekst:** „kontynuujemy projekt" bez nowej dostawy → Pętla Jakości v2.
PR #10 (`arena/01a0612e-mtg`), plan `PLAN_2026-09-02-pr10-petla-jakosci.md`.

1. **Integralność:** testy 87/87, build OK (4 strony), map-audit 0 —
   zgodnie z handoffem PR-9.
2. **Audyt PR #9** (`AUDYT_2026-09-02-PR9.md`): kod/dane/testy poprawne;
   ISTOTNE znalezisko — decyzje właściciela (a)–(g) z recenzji prototypu
   (m.in. jedna barwa wody sprzeczna z ADR 0020 pkt 3; błękit wody wbrew
   achromatowi ADR 0019) nie były sformalizowane w ADR (wzorzec dryfu
   jak przy ADR 0012→0013).
3. **ADR 0021** — formalizacja stylu map T4 (jedna barwa wody; kolory
   funkcjonalne atlasu; kolejność warstw; etykiety przy obiektach; szare
   miasta; pasmo jako bryła); statusy ADR 0019/0020 + tabela rejestru.
4. **Krok 2 (LORE):** plan Zendikar/„Ludy" — wiary merfolków
   (Emeria/Ula/Cosi + prawda o Eldrazi, trójca korów), narody elfów
   (Tajuru/Joraga/Mul Daya), plemiona goblinów (Tuktuk/Lavastep/Grotag);
   źródła: *Plane Shift: Zendikar* (PDF Wizards, zweryfikowany
   fetch_page) i mtglore „Gods and Monsters". Nagłówki „Geography"→
   „Geografia" (oba plany), literówki (krajobraz/even/rodzinnym).
5. **Krok 3 (link-mining):** brak encji z progiem ≥2 kart (2 karty na
   2 planach) — kandydaci odnotowani w handoffie.
6. **Krok 4 (pass mapowy, tylko T4):** E-geo-8 rozstrzygnięte —
   kanoniczna nazwa „Prison of Omnath" (MTG Wiki Ondu/Omnath);
   E-geo-4 częściowo — etykieta Ior Ruin przy Glasspool (kanon: karta
   *Ior Ruin Expedition* ZEN 49). Scena edytowana chirurgicznie
   (pierwsza próba przez json.dumps przeformatowała plik — cofnięta;
   edycja tekstowa), podkład regenerowany (diff 2 linie), audyt 0.
   E-geo-3 (6 etykiet w gęstej Murasie) ŚWIADOMIE odłożone — wymaga
   wizualnego QA renderu (sharp/libvips), nie tylko map-audit.
7. **Zamknięcie:** co-nowego, ROADMAP (E-geo-8 ✓, E-geo-4 cz.),
   handoff `HANDOFF_2026-09-02.md`, opis PR kumulatywnie.

## 2026-09-02 — sesja (dalsze uzupełnienie PR-9): 7 poprawek właściciela (a)–(g) z recenzji prototypu

**Zlecenie (czat, recenzja prototypu 39607c0):** siedem poprawek mapy,
**PIERWSZE, przed kolejką E-geo-1..9**:
(a) glify gór łączone w logiczne pasma, wklejane pojedynczo na mapę,
podobne wielkości szczytów, eliminacja zlewania się (stacking klastrów);
(b) labelka musi SIADAĆ przy badge'u — 24–28 px to „za daleko"
(„właściwie wszystkie": Cliffhaven, Prison of Omath, Ula Temple,
Enclave); (c) ikony miast = szare jak ruiny, nie czarne (zlewały się
z górami); (d) jeziora = dokładnie ten sam kolor co rzeki/morza
(zlewanie się akwenów); (e) przenoszenie POI obejmuje WSZYSTKIE jego
ikony (hedrony Emeri pozostały w starym miejscu); (f) etykieta oceanu
na otwartym morzu + usunięcie wodnej kieszeni, którą pozornie
nazywała; (g) kolejność warstw WIĄŻĄCA: morza → lądy → rzeki → góry
→ lasy/bagna/stepy → miasta/ruiny → labelki na szczycie.

**Przebieg:**
1. **Silnik (a/c/d/g)** — `render.mjs` + `bloki.mjs`:
   - (a) `pasmo`: JEDNA połączona linia szczytów (glify wzdłuż
     wygładzonego grzbietu); minimum 3 glify **hardkodowane** w
     `pasmo()` (`Math.max(3, …)`) — krótkie pasma zamiast 1–2 glifów
     dają zwarty kłąb szczytów; szerokość glifu = krok wzdłuż
     grzbietu ×1.8 (±~10%) → wierzchołki zbliżonej wielkości, bazy
     nachodzą ~50% = ciągła formacja (język mapome); bez pogórza i
     bez rozrzutu pionowego.
   - (c) `miasto()` — monolityczny szary fill `PAL.skalaCien`
     (atlas: #6b6b6b; poprzednio `PAL.tekst` = czarny); `ruina()`
     bez zmian (jaśniejszy fill + szary obrys).
   - (d) `wodaGleb` usunięty z palet (pergamin + atlas) —
     `rzeka()`/`jezioro()` (w tym tryb `d` — Halimar) = `PAL.woda`
     jak morze; parametr `ujscie` usunięty z `rzeka()`/`doplyw()`;
     `ocean()` — bez plam głębi (jednolite wypełnienie).
   - (g) kolejność warstw: ocean → wybrzeża → ląd → JEZIORA → RZEKI
     → PASMA → WULKANY → BIOMY (NAD górami) → drogi → MIASTA/RUINY
     → ETYKIETY na samym szczycie (wcześniej biomy po górach).
   - Testy: uaktualnione testy stylu (rzeka/jezioro = kolor morza,
     bez `ujscie`; paleta achromatyczna bez odrębnego koloru
     jeziora) → 87/87.
2. **Audyt** — `tools/map-audit.py`: check etykiet `na_ladzie`
   (model środka) → 9-punktowy model dotyku (narożniki + środki boków
   + środek bboxa, tolerancja 2 px) — reguła (b) wymaga labelek
   dotykających obiektu, więc część labelki może wisieć nad wodą;
   etykiety oceaniczne (Morze Zendikaru, Makindi, Sunder Bay, Bojuka
   Bay, Wybrzeża Halimar, Chill Depths) w białej liście z komentarzem.
3. **Scena (b/e/f)** — `scena.json` (44× x/y etykiet + 29 `przyDo`
   kotwic rozstawu; hedrony Emeri (748,508) przy labelce; kanał
   Sea Gate →(1010,660); krawędzie Tazeem/Bala Ged odsunięte od
   cieśniny; Tal Terig = nowe miasto + pinezka map.json). Transformacja
   wykonana skryptem z assertami (pojedyncze wystąpienia wzorców) +
   weryfikacją JSON; backup pre-transformacji `/home/user/tmp`.
   Weryfikacja wizualna: render całości (full.png) + wycinki
   (slice.mjs) — kadry: całość, Morze west, cieśnina, Tazeem/Emeria,
   Akoum (pasma), Ondu, Agadeem, Guul Draz.
4. **Rezultaty:** testy **87/87**, `npm run build` OK (4 strony,
   14 modułów, ~5.81 MB), `map-audit.py` **0 problemów** (wszystkie
   mapy), podgląd 4173 odświeżony (dist z nowym podkładem).
5. **Następna kolejka (po (a)–(g)):** E-geo-1..9: 1 archipelag między
   Ondu a Akoum; 2/7 Tazeem SW (Oran-Rief/step); 3 Murasa; 4 Akoum;
   5 BG/GD; 6 Ondu; 8 Omath; 9 Hada.

## 2026-09-01 — sesja (uzupełnienie PR-9): audyt + przebudowa geografii CAŁEJ mapy Zendikaru

**Zlecenie właściciela (czat, po raporcie PR-9):** „Wystaw mi prototyp
Codexu w sandboxie do oceny wdrożenia" + trzy korekty mapy: (a) etykiety
POI odsunięte od miejsc z liniami łączącymi → „nie lepiej po prostu bliżej
dać tą labelkę?"; (b) drogi losowe → „powinny być liniami traktów między
największymi miastami/POI na danym kontynencie"; (c) „ta geografia jest
moim zdaniem w ogóle z dupy… wymaga POWAŻNEGO AUDYTU… solidnie, w jednym
albo kilku podejściach" — doprecyzowane: **CAŁA mapa** (lądy, miasta,
układ), nie tylko Tazeem. Pętla Jakości nadal wyłączona w tej sesji.

**Przebieg:**
1. **Prototyp wystawiony** (Vite `vite preview`, port 4173, host 0.0.0.0 —
   podgląd w sandboxie) — do oceny wdrożenia przez właściciela.
2. **PLAN** (`docs/plans/PLAN_2026-09-01-audyt-geografii-i-drogi.md`):
   metodologia (podsłuch geometryczny + porównanie tabelaryczne vs
   hierarchia kanon > v2 > w3/4), zakres, kryteria, plan pracy.
3. **AUDYT** (`docs/audits/AUDYT_2026-09-01-geografia-zendikaru.md`):
   werdykty per kontynent (T1–T11, L1–L6, A1–A8, B1–B8, O1–O5, M1–M3,
   drogi §8, etykiety §9) + kolejka E-geo-1..9 (§11). Kluczowe: Tazeem
   w sprzeczności z treścią (P0), jeden ląd łączył 3 kontynenty (P0),
   POI dekoracyjne (P0/P1), Murasa/Sejiri OK.
4. **Implementacja P0/P1** (scena.json + podklad.svg + map.json):
   - Tazeem: Halimar = morze śródlądowe (nowy tryb `jezioro.d`), Sea Gate
     na murze + kanał-tama, Coralhelm, Oran-Rief pas, Enclave, Ula Temple,
     The Bulwark, Emeria nad taflą, rzeki; tytuł przeniesiony.
   - Topologia: `lad-2` → `lad-akoum` + `lad-bala-guul` z cieśniną
     (topologię zweryfikowano testem punkt-w-polygon na ASCII siatce —
     pierwotny odczyt „zatoki" był błędny; łącznik = półwysep
     x~1600-1720, y~610-760); Bojuka = najdalszy wschód.
   - POI: przeniesienia wg w2 + nowe (Valakut na wysepce, Oko Ugina =
     pasmo, Teeth, Tangled Vales, Hanging Swamp, Hagra Cistern, Kazuul
     Pass); duplikat ruiny Surrakar usunięty.
   - Drogi: 5 trakty między miastami; etykiety: silnik bez kresek
     (`zakotwicz` usunięty z render.mjs), 16 etykiet przysuniętych.
   - map.json: kotwice zsynchronizowane (26), 9 nowych, pinezka karty
     Coralhelm Guide przeniesiona, duplikat Living Spire usunięty.
5. **Weryfikacja:** testy 87/87 (1 test wymagał zachowania frazy
   „wybrzeży Halimar" w uzasadnieniu pinezki — MA4), map-audit 0
   (+„Hagra Cistern" do SPODZEANE_WODY), build OK, kontrola wizualna
   PNG (sharp, /home/user/tmp — poza repo) z korektami: Morze Zendikaru
   na wodę (etykietnik zabłądził na ląd), Umung przy rzece, Ula Temple
   od brzegu.

**Zostawione na kolejną sesję:** E-geo-1..9 (ROADMAP) — archipelag
między Ondu a Akoum, Tazeem SW (decyzja z właścicielem), detale,
Omath/Omnath.

## 2026-09-01 — sesja PR-9: adopcja glifów mapowych (mapome) + rzeki w kolorze morza (ADR 0020)

**Zlecenie właściciela (zadanie, nie Pętla Jakości — jawnie wyłączona):**
(a) góry na Zendikarze „masakryczne" — mają odpowiadać stylowi mapy
Śródziemia (benchmark mapome); (b) rzeka — ten sam kolor co morze i brak
opacity („rozmywała się w nim" — zamiast gradientu z PR-5); (c) research
GitHub: istniejące projekty z wektorowymi obiektami do map — „nie ma
sensu odkrywać koła na nowo". Właściciel przejął rolę developera po
zawieszonym agencie.

**Research (przed kodowaniem, w PLAN_2026-09-01-glify-mapaowe-i-rzeki.md):**
mapome (CC-BY-4.0, już w repo) = benchmark właściciela i źródło glifów;
Azgaar/Fantasy-Map-Generator (MIT, 171 symbolów SVG) = kandydat na
przyszłe klocki + techniki rozsiewu (symbol+use, sort po dolnej krawędzi);
pozostali kandydaci (arda i in.) odrzuceni (brak licencji/bibliotek).

**Wykonanie:**
- **ADR 0020** — adopcja DANYCH (ścieżki SVG), nie kodu (zero zależności,
  ADR 0002): biblioteka 30 glifów mapome w `tools/mapforge/glify-mapaome.mjs`
  (ekstrakcja z `mountains_and_forests` podkładu Śródziemia w repo; 3
  mega-klastery hero do jawnego użycia w scenie).
- `szczyt()`/`pasmo()` — wyłącznie glify adoptowane: rozsiew wzdłuż
  grzbietu (sinus + flip + jitter + sort po dolnej krawędzi); klastery
  nachodzą nieznacznie, każdy szczyt czytelny (benchmark).
- `rzeka()` — kolor akwenu (morze `PAL.woda` / jezioro `PAL.wodaGleb`),
  brak gradientu i opacity; kolor rzeki usunięty z palet.
- Atrybucja CC-BY-4.0: nagłówek generowanego SVG, `maps/zendikar/map.json`
  (`zrodlo_glify`), ADR 0020, README mapforge, SKILL.
- Regeneracja: `maps/zendikar/podklad.svg` + warsztat (atlas/pergamin).

**Weryfikacja:** 87/87 testów; build 4 strony/14 modułów; map-audit 0;
wizualny re-view PNG (rasterizacja libvips w sandboxie, poza repo) —
góry zgodne z benchmarkiem mapome, rzeki zlewają się z morzem.

**Pozostaje:** ocena właściciela; kolejka E5 (cytadela/fort, latarnia,
wrak, wodospad, obwódki haseł) — kandydat: symbole Azgaar (MIT) z
atrybucją.

## 2026-09-01 — sesja PR-5 c.d.: mapforge glify „hand-drawn" + zakres map + definicja audytu

**Kontekst:** właściciel po obejrzeniu demo mapforge: obiekty generowane
przez silnik wyglądają „strasznie generycznie i dziecinnie"; chce efektu
graficznego jak mapa Śródziemia (mapome). Dodatkowo: (1) ubogacanie map
o POI dotyczy wyłącznie map T3/T4 (dziś Zendikar) — map T2 (adoptowany
podkład) nie ruszamy; (2) audyt PR ma być dokładnym sprawdzeniem kodu,
nie raportem „zielone".

**Wykonanie:**
- **Dokumentacja Pętli Jakości:** zakres ubogacania map (krok 4 pkt 2 —
  tylko T3/T4) oraz definicja audytu (krok 1 — recenzja kodu/treści,
  nie raport zielone) dopisane do `docs/guides/PETLA_JAKOSCI.md`.
- **Audyt kodu mapforge** (`AUDYT_2026-09-01-PR7.md`): glify
  geometryczne (koło/trójkąt), lasy nie-nakładające się, brak jitteru
  pasma, ciche fallbacki (`?? las`), rozmiar artefaktu — kolejka napraw.
- **Przebudowa glifów:** las = kępa-chmurka (łuki, cień, boczny pęd,
  haczura), gęsta i nakładająca się; góra = żagiel (lewa wypukła, prawa
  wklęsła, cień, haczura) z `lean`; `pasmo()` ciaśniej z jitterem.
  Determinizm zachowany (rng z hasha id); `data-x/y` i kontur zamknięty
  → `map-audit.py` 0. Zendikar T4 i demo-warsztat wyrenderowane na nowo.
- Testy 86/86; build OK; artefakt ~4,6 MB (koszt ADR 0009).

## 2026-09-01 — sesja PR-5 (Pętla Jakości v2: pogłębienie LORE + E4)

**Kontekst:** „kontynuujemy projekt" bez dostawy nowych kart → domyślna
praca = Pętla Jakości (ADR 0006/0015). Punkt wyjścia = scalony PR #7 (PR-4).

**Wykonanie:**
- Audyt PR #7 (integralność 86/86, completeness 100%, deploy Pages
  zielony, map-audit 0; znalezienia: E4, niepogłębiane Śródziemie).
- Krok 2 (LORE): sekcja „Ludy" w `content/planes/srodziemie.md`
  (Dunlendowie/Gwathuirim, Rohirrim/Eorlingas, ludzie i siły Isengardu)
  z cytowaniami (Tolkien Gateway, Encyclopedia of Arda). Bez haseł
  (próg ≥2 kart), bez martwych wikilinków.
- Krok 3 (link-mining): brak nowych haseł (karty z różnych planów).
- Krok 4 (mapa): domknięcie **E4** — wzorzec „nowy plan = scena +
  render mapforge" w PROCES_MAP (MA1 pkt 5) i SKILL §11; E4 w planie
  mapforge oznaczony. Weryfikacja obu map audytem (0 problemów).
- Krok 5: co-nowego, handoff, kumulatywny opis PR.

## 2026-09-01 — sesja PR-4 c.d. 2: ADR 0016 (format Wpisu Karty) + podgląd sandboxowy

**Zlecenia właściciela:** (A) uruchomienie Pages bez merge'a / podgląd;
(B) audyt formatu Wpisu Karty wobec szablonu katalogowego właściciela
(dwa przykłady: 1LTR, 2BFZ); doprecyzowanie: żadnej sekcji opisu
ilustracji źródłowej (transpozycje FOT/KON inne) — obraz Scryfalla
tylko w infoboksie; pytanie o kodowanie FOT/KON.

**Wykonanie:**
- **A:** bot nie może odpalić workflowu (brak `actions: write`);
  właścicielowi wystarczy „Re-run all jobs" na failed runie w UI Actions
  (workflow na main poprawny, site już włączony). Podgląd sandboxowy:
  serwer `dist/` na porcie 8000 (live preview). Merge PR #7 i tak
  odpali publikację automatycznie.
- **FOT/KON:** potwierdzone zakodowane (ADR 0008): tory
  Druk/FOT/KON + sonda `./img/<imgId>FOT|KON.png` z cichym fallbackiem;
  działają też w warstwie karty z pinezki (B2).
- **ADR 0016:** przyjęto z katalogu właściciela — blok danych Oracle
  w treści (wpis samowystarczalny), kontekst setu/osi czasu, polskie
  odczytanie nazwy, mechanika w 3 warstwach z podtypami jako warstwami,
  flavor fraza po frazie + kontekst cytującego, podsumowanie tezami;
  odrzucono — sekcja „Ilustracja" (zakaz), „Druk w Kolekcji" (ADR 0014),
  numeracja liczbowa. Retrofit 1LTR + 2BFZ + fixture; asercje dymne
  pilnują bloku danych, warstw mechaniki i zakazu sekcji ilustracyjnej.
- Incydent: drugi reset workspace w sesji (ENVIRONMENT §2) — odtworzono
  `reset --soft FETCH_HEAD` (drzewo przetrwało, historia na zdalnej).

## 2026-09-01 — sesja PR-4 c.d.: doprecyzowanie Pętli Jakości (ADR 0014/0015) + usunięcie „Druku w Kolekcji"

**Zlecenie właściciela:** pogłębianie to **lore**, nie meta-informacje
(„co mnie obchodzi, co robią artyści" — sekcja „Druk w Kolekcji"
usunięta na jego polecenie); pass mapowy to **kompletacja i jakość map**
(nowe POI, weryfikacja dokładności, lepsze metody rysowania wektorowego,
wspólny silnik mapowy T4 dążący do jakości mapy Śródziemia i wyżej).
„Dopisz to wszystko do dokumentacji Pętli."

**Wykonanie:**
- **ADR 0014** — sekcja „Druk w Kolekcji" znika ze szkieletu (9 sekcji);
  dane wydruku tylko w infoboksie ze snapshotu; usunięta z obu kart,
  fixture'ów, `SEKCJE_KARTY` (registry), SZKIELET_KARTY; asercje
  ui-smoke odwrócone; ADR 0011 → „Częściowo zastąpiona". Pogłębione
  wcześniej biografie artystów usunięte wraz z cytatami (Cook & Becker,
  mtg.wtf, scentofagamer, viktortitov.com).
- **ADR 0015** — Pętla Jakości v2: krok 2 = LORE (anti-lista
  meta-informacji), krok 4 = pass mapowy scalony z dawnym 4b
  (kompletność operacyjna → nowe POI → weryfikacja dokładności →
  warsztat rysowania → wspólny silnik T4 → regiony haseł); definicja
  wariantu T4. ADR 0006 → „Częściowo zastąpiona". PETLA_JAKOSCI.md
  przepisana (kroki 2 i 4), AGENTS.md §2 pkt 6 zaktualizowany,
  PROCES_MAP (drabina + T4), SKILL_MAPA_PLANU (pamięć warsztatu T4),
  ROADMAP (nowy kamień K7 — warsztat mapowy T4; odświeżony wątek
  mapy Śródziemia).
- Nota porządkowa: commit 87d0fce objął oprócz ADR 0014 również ADR 0015
  i statusy rejestrów (komunikat commitu nie wyczerpuje zawartości).

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
