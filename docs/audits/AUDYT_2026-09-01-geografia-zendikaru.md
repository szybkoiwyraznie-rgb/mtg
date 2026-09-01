# AUDYT — geografia mapy Zendikaru (cała podstawa, nie tylko Tazeem)

> **Data:** 2026-09-01 · **Zlecenie:** właściciel (czat, uzupełnienie PR-9): „ta
> geografia jest moim zdaniem w ogóle z dupy… wymaga POWAŻNEGO AUDYTU…
> postaraj się wykonać solidnie, w jednym albo kilku podejściach".
> Doprecyzowanie: audyt obejmuje **CAŁĄ mapę** — lądy, miasta, układ
> względny, drogi, etykiety — nie tylko Tazeem.
> **Metoda:** podsłuch geometryczny (scena.json + podklad.svg → PNG) + porównanie
> tabelaryczne z hierarchią źródeł: **kanon > mapa fanowska v2 > warianty 3/4**
> (ADR 0010/0013; `zrodlo-fanowska.md`, `zrodlo-fanowska-warianty-3-4.md`,
> `map.json → zrodlo`, `content/planes/zendikar.md`, teksty kart).
> Układ współrzędnych mapy: 2000×1400, x rośnie na wschód, y na południe.

## 0. Wypowiedź ogólna

Podkład jest własną rekonstrukcją (oficjalnej mapy planu nigdy nie było —
`map.json → rekonstrukcja`), więc „błąd" zawsze mierzymy względem kanonu
tekstowego i źródeł właściciela, nie względem „oficjalnej mapy".

Trzy systemowe problemy (nie tylko pojedyncze punkty):

1. **Ludy/regiony rysowane w sprzeczności z opisem treści.** Najgorszy:
   *Tazeem* — treść planu i karta *Coralhelm Guide* mówią o „głębokim,
   sztucznym morzu śródlądowym Halimar" z Sea Gate na murze i Coralhelm
   na brzegu, a na mapie Halimar = **step** w środku wyspy, bez wody,
   bez Coralhelm, Sea Gate = zwykłe miasto na południowo-wschodnim
   wybrzeżu. Mapa i treść mówiły dwoma językami.
2. **Topologia lądów niezgodna z kanonem kontynentów.** „Wschodni
   mega-łódź" `lad-2` łączył trzy kontynenty — **Akoum, Bala Ged i
   Guul Draz** — w jeden ląd (łącznik wschodni między Akoum a Bala Ged;
   Guul Draz zrośnięty z Bala Ged bez jakiejkolwiek odgraniczenia).
   Kanon/w2: Akoum = osobny kontynent; Guul Draz i Bala Ged = „dwa
   połączone subkontynenty" (mogi być połączone ze sobą — NIE z Akoum).
3. **POI rozrzucone „dekoracyjnie", bez logiki pozycyjnej z w2.**
   Przykłady: Bojuka Bay na zachodzie (kanon/w2: Bojuka = najdalszy
   Wschód Bala Ged), Malakir na zachodzie Guul Draz (kanon: wschodnia
   stolica wampirów), Nimana na wschód od Lake Jast (w2: na zachód od
   jeziora), Mt. Valakut jako wulkan w Akoum (kanon/w2: Valakut = wulkan
   na wyspie **Beyeen**), Kabira na Ondu (w2: osada Agadeem), Oko Ugina
   jako dryfujący hedron (w2: „szczyt Eye of Ugin").

Dodatkowo (punkty a/b zlecenia): etykiety POI odbite od obiektów z liniami
łączącymi, drogi losowe — bez związku z miastami.

**Wyrok:** mapa wymagała (i dostała w tej sesji) naprawy strukturalnej
(P0/P1): Tazeem przebudowany w całości, cieśnina Akoum/Bala Ged–Guul Draz,
~20 POI przeniesionych/dorzuconych, drogi jako trakty, etykiety przy
obiektach bez kresek. Pozostałe pozycje (P2) → kolejka **E-geo** w ROADMAP.

## 1. Tazeem — przebudowa (P0)

Stan „przed": wyspa owalna; las Oran-Rief (płn.-zach.); **step**
`step-tazeem-halimar` w centrum z etykietą „Halimar"; rzeka Umara
płynąca z NW w SE na wybrzeże; miasto Sea Gate (790,742) na płd.-wsch.
wybrzeżu; miasto Hadatown (470,700) płd.-zach.; hedron Sky Rock (900,680);
Emeria wisząca nad NE; pasmo (płd.-zach.); **Coralhelm nieobecny**,
Enclave nieobecny, Ula Temple nieobecny, Bulwark nie nazwany.

| # | Element | Źródło (hierarchia) | Stan „przed" | Werdykt | Poprawka (sesja 2026-09-01) |
|---|---------|---------------------|--------------|---------|-----------------------------|
| T1 | **Halimar = woda** (morze śródlądowe) | kanon: treść planu („głębokie, sztuczne morze śródlądowe"), karta Coralhelm Guide, w2 („wielkie morze śródlądowe/zatoka otwierająca się na wschód") | step + etykieta na lądzie | **P0 błąd** (przykład właściciela) | Halimar jako akwen o nieregularnym kształcie `d` (nowa opcja klocka `jezioro`), środek–wschód wyspy; step `step-tazeem-halimar` usunięty; etykieta „Halimar" na tafli |
| T2 | **Sea Gate na murze nad Halimar** (tama strzegąca wejścia od oceanu) | kanon: treść planu („na szczycie wysokiego muru nad Halimar… największe miasto Tazeem"), w2 („wejścia od oceanu strzeże Sea Gate") | miasto na płd.-wsch. wybrzeżu (790,742) | **P0 błąd** | Sea Gate (900,660) = miasto na wschodnim brzegu Halimar, nad cieńskim kanałem wyprowadzającym morze w ocean (kanał `rzeka` pod miastem = tama) |
| T3 | **Coralhelm = osada na brzegu Halimar** (płn. kraniec) | kanon: karta Coralhelm Guide („nad śródlądowym morzem Halimar"), w2 („Płn. kraniec: Coralhelm") | **nieobecny na mapie** (w map.json tylko „zywa-skała" w `elementy` — niespójne) | **P0 błąd** | osada Coralhelm (660,505) na północnym brzegu Halimar + etykieta + kotwica map.json + pinezka karty przeniesiona na Coralhelm |
| T4 | **Umara płynie do Halimar** (wąwóz, granica lasu; wodospady Magosi) | kanon: treść planu („rzeka Umara przecina kontynent głębokim wąwozem"), w2 („granice wyznacza rzeka Umara River z wodospadami Magosi") | rzeka NW→SE na wybrcze, wodospad na NE wybrzeżu | **P0 błąd** | Umara: źródło w NW (500,455) → spadek do półn.-zach. brzegu Halimar (620,562, ujście = kolor akwenu); etykieta „Magosi Wodospad" na rzece przy krawędzi lasu (575,556) |
| T5 | **Oran-Rief = las (centrum, zachód od Halimar); Enclave w lesie** | w2 („Centrum: las Oran → na południu las Rief… W lesie Enclave") | las płn.-zach.; Enclave nieobecny | P1 | las przesunięty na pas zachodni od Halimar (420–590, 450–720); osada **Enclave** (505,560) w lesie |
| T6 | Ula Temple na brzegu Halimar | w2 („Na brzegu Ula Temple") | nieobecny | P2 | ruina (570,640) na zachodnim brzegu + etykieta |
| T7 | **The Bulwark** = pasmo zachód i południe | w2 („Zachód i południe: pasmo The Bulwark") | pasmo płd.-zach. bez nazwy | P2 | pasmo-3 wydłużone w łuk zachód→południe + etykieta „The Bulwark" |
| T8 | Emeria — ruiny w niebie **nad Halimar** | kanon: treść planu („nad nim otwarte niebo… Emeria") | wisiała nad NE (880,322) | P1 | przesunięta nad taflą Halimar (745,466) + hedron nad morzem (opacity — dryf) |
| T9 | Sky Rock (kamień w niebie) | w2/kanon: element Tazeem | (900,680) — zderzał się z nowym Sea Gate | P1 | hedron przeniesiony na NW (450,420) |
| T10 | Hada w centrum kontynentu | w2 („środek: Hada") | Hadatown (470,700) płd.-zach. | P2 (akceptowalne) | pozostawiono (środek lądowy zajęty przez las/morze); odnotowano |
| T11 | druga rzeka z Halimar na północne wybrzeże | — | źródło wewnątrz nowego Halimar | P1 | przełożona: wypływ z płn. brzegu Halimar (640,538)→(570,370) |

## 2. Topologia lądów — cieśnina Akoum / Bala Ged–Guul Draz (P0)

| # | Element | Źródło | Stan „przed" | Werdykt | Poprawka |
|---|---------|--------|--------------|---------|----------|
| L1 | Akoum jako osobny kontynent | kanon (7 kontynentów — treść planu), w2 („wschodni kontynent"), w3 (osobny) | `lad-2` = jeden ląd: Akoum+Bala Ged+Guul Draz, łącznik wschodni (1600–1760, 618–855) | **P0 błąd** | `lad-2` rozcięty na `lad-akoum` (północ; zatoka-gulf = jego południowa zatoka) i `lad-bala-guul` (południe); **cieśnina** między nimi od wschodniej odnogi gulfu (Bojuka) do otwartego oceanu na wschodzie |
| L2 | Guul Draz ↔ Bala Ged — połączone, ale odgraniczone | w2 („Dwa połączone subkontynenty"), w3 („połączony kontynent na wschodzie") | zrośnięte bez odgraniczenia (tylko etykieta „The Border Mire") | P1 (akceptowalne częściowo) | ląd pozostaje połączony (wg w2/w3), odgraniczenie = etykieta „The Border Mire" + granica bagien/dżungli (biom bagno vs las) — tak jak było; nie ciąłem (kanon pozwala na połączenie) |
| L3 | Murasa — wyspa-płaskowyż, „położenie przybliżone" | treść planu (jawnie: „położenie Murasy przybliżone"), w2 (środek, między Ondu a Tazeem, wąska cieśnina) | wyspa w dolnym środku (858–1108, 1094–1340) — **zgodne z w2** | OK | bez zmian |
| L4 | Archipelag Jwar/Beyeen/Agadeem | w2 (§1: „Między Ondu a Akoum, na północny wschód od (0,0)") | róg płd.-zach. mapy (x 90–240, y 995–1367) | **P2 błąd** (duża operacja) | E-geo: przesunięcie wysp między Ondu a Akoum + pinezki + kotwice |
| L5 | Tazeem — południowo-zachód (centrum −5,−6) | w2 (§5) | zachód-centrum (340–960, 350–880), NA PÓŁNOC od Ondu | P2 (układ globalny) | E-geo: ocena rotacji układu zachodniego (Tazeem SW, archipelag NE) — zmiany globalne na kolejną sesję |
| L6 | Beyeen — brak lądu (tylko etykieta w wodzie) | kanon: treść planu („Zulaport na wybrzeżu Beyeen"), w2 (§1: wyspa środkowa archipelagu) | etykieta (105,1238) w wodzie, wyspy Jwar pełnią rolę | P1 | etykieta „Beyeen" zakotwiczona przy wyspie (135,1240); nowa wysepka **Valakut** (215,1130) z wulkanem (patrz A2) |

## 3. Akoum (P0/P1)

| # | Element | Źródło | Stan „przed" | Werdykt | Poprawka |
|---|---------|--------|--------------|---------|----------|
| A1 | **Valakut = wulkan na wyspie Beyeen** (nie w Akoum) | kanon/w2 (§1: „Beyeen… Na zachodzie wulkan Valakut") | etykieta „Mt. Valakut" + wulkan w płn. Akoum (1462–1470, 384–400) | **P0 błąd** (przypisanie do zła kontynentu) | etykieta z Akoum usunięta; wulkan Valakut na nowej wysepce Beyeen (215,1130) + kotwica map.json |
| A2 | **Oko Ugina = szczyt** (Eye of Ugin) | w2 („szczyt Eye of Ugin obok pasma Teeth of Akoum") | dryfujący hedron (1608,538) + kreska do etykiety | **P1 błąd** (rodzaj obiektu) | hedron → małe pasmo (klaster szczytów) w tym samym miejscu; etykieta przy, bez kreski |
| A3 | **Teeth of Akoum** (pasma z wulkanami, centralne/npłn.) | w2 | wulkany bez nazwy pasma | P1 braku | etykieta „Teeth of Akoum" przy klastrze wulkanów (1700,505) + kotwica |
| A4 | **Goma Fada na zachodnim półwyspie** | w2 („Zachodni półwysep: Goma Fada na najdarszym cyplu") | miasto NE (1830,300) | P1 błąd | miasto (1395,440) na zachodnim wybrzeżu + etykieta |
| A5 | **Affa w centrum** | w2 („osada Affa (centrum)") | miasto NW (1420,340) | P1 błąd | miasto (1520,520) w centrum kotliny + etykieta |
| A6 | Spike Fields (Grip/Slab Haven, Ghostwatch) — zachodnie pasma | w2 | klastre (1485–1544, 490–586) = zachód-centrum | OK (marginalnie) | bez zmian |
| A7 | Tal Terig — płn. od Spike Fields | w2 | (1440,560) = płd.-zach. od Spike Fields | P2 | bez zmian (odnotowano) |
| A8 | Kargan Lands (płn.-wsch.), Ora Ondar + Khalni Heart (wschód), Glasspool + Ior Ruin (płd.-wsch.), Explorers Peak, Fort Keff, Glass Haven, Windblast Gorge | w2/w3/4 | zgodne w zakresie ± | OK | bez zmian |

## 4. Bala Ged i Guul Draz (P0/P1/P2)

| # | Element | Źródło | Stan „przed" | Werdykt | Poprawka |
|---|---------|--------|--------------|---------|----------|
| B1 | **Bojuka = najdalszy Wschód** (Bojuka Bog; zatoka Bojuka Bay przy nim) | w2 („Najdalsze wschodnie wybrzeże: Bojuka Bog"), w3 (Bojuka Bay +3.5) | etykieta „Bojuka Bay" w wodzie na **zachodzie** (1100,958); „Bojuka Bog" wschód ✓ | **P0/P1 błąd** (strona świata) | „Bojuka Bay" przeniesiona na wschodnie wybrzeże (1755,905) przy Bojuka Bog; zachodni gulf zostaje bez nazwy |
| B2 | **Malakir = wschodnia stolica wampirów** | w2 („wschodnia, wampirza stolica (przed granicą): Malakir") | miasto **zachód** (1215,1255) | **P1 błąd** | miasto (1505,1235) wschód + etykieta |
| B3 | **Nimana = zachód od Lake Jast** | w2 („na zachód od jeziora Free City of Nimana") | miasto wschód (1500,1230) | **P1 błąd** (zamiana z Malakir) | miasto (1345,1248) zachód od jeziora + etykieta |
| B4 | Lulea — płd.-wsch. | w2 | (1400,1337) południe | P2 | przesunięta na płd.-wsch. (1480,1320) |
| B5 | **Tangled Vales** (południe Bala Ged) | w2 („południe: Tangled Vales") | **brak** na mapie | P1 braku | etykieta (1520,1015) |
| B6 | Hanging Swamp (centrum Guul Draz) + Hagra Swamp pod nim + Hagra Cistern na zachód | w2 | etykieta „Hagra Swamp" w centrum (zła nazwa), brak Hanging Swamp, brak Hagra Cistern | P1/P2 | nazwa centrum → „Hanging Swamp" (1330,1258); „Hagra Swamp" pod nim (1330,1292); nowe **Hagra Cistern** = małe jezioro + etykieta (1240,1240/1268) |
| B7 | Zof Marsh (płn.-zach.) | w2 | (1158,1220) zachód | P2 | przesunięte na NW (1230,1090) |
| B8 | Guum Wilds (płn.), Umung przez środek, Riverroot (centrum), Surrakar Caves (w Guum Wilds), The Border Mire (pogranicze) | w2/w3 | Surrakar na skraju zachodnim (1246,786); reszta OK | P2 | Surrakar przeniesiony w dżunglę (1560,825); reszta bez zmian |

## 5. Ondu (P1/P2)

| # | Element | Źródło | Stan „przed" | Werdykt | Poprawka |
|---|---------|--------|--------------|---------|----------|
| O1 | **Kabira = osada Agadeem** (archipelag) | w2 (§1: „Agadeem… zachód: osada Kabira") | miasto na płd. Ondu (430,1240) | **P1 błąd** | osada przeniesiona na wyspę Agadeem (195,1330) + etykieta |
| O2 | Makindi Trenches = centrum i zachód; **Prison of Omath** w centrum kotliny | w2 (§3) | etykieta „Makindi Trenches" na płn. skraju (430,1060); Prison (560,1160) centrum-południe | P1/P2 | etykieta MT w centrum (560,1180); Prison (555,1130) + etykieta przy (spelling wg źródła w2 — patrz E-geo-8) |
| O3 | Cliffhaven (płn.-zach./płd.-zach. obrzeża), Graypelt (płn.-wsch.), Mosscrack (płd.-zach.), Turntimber (południe), Wolfbriar | w2/w3 | zgodne w zakresie ± | OK | bez zmian (etykiety przy obiektach) |
| O4 | Hedron Fields (centrum Agadeem wg w2) | w2 | hedrony na zachodzie Ondu (300,1230/340,1215) | P2 (dewiacja udokumentowana) | pozostawiono (wyspa Agadeem za mała na osadę + kryptę + hedrony); odnotowano |
| O5 | Nomads of Silundi Sea (płn. wybrzeże), Tikal Harbor | w2 | brak | P2 | E-geo (opcje detalu) |

## 6. Murasa (OK — z drobnymi uwagami)

Zgodność z treścią planu (kanon repo: wyspa-płaskowyż, mur klifów,
Sunder Bay, cztery drogi do wnętrza, Skyfang dzielący zachód, Na Plateau
z Singing City w sercu, Kazandu) — **mapa zgadza się z treścią**.
Konflikt z w2 („Singing City na zachodnim wybrzeżu") rozstrzygnięty
hierarchią: treść planu (oparta na Planeswalker's Guide) > w2 → Singing
City zostaje przy Na Plateau.

| # | Element | Werdykt | Poprawka |
|---|---------|---------|----------|
| M1 | Singing City przy Na Plateau, Skyfang (zachód), Kazandu (południe), Vazi River (południe), Blackbloom Lake (zachód-centrum), Living Spire (południe), Sunder Bay (zach. wybrzeże) | OK | bez zmian |
| M2 | **Kazuul Pass** (jedna z czterech dróg do wnętrza) — kotwica w map.json (920,1260) bez etykiety | P2 braku | etykieta „Kazuul Pass" (905,1268) |
| M3 | Glint Pass, Thunder Gap, Roaring Falls, Tumbled Palace, Visimal, Pillar Plains (kotwice map.json bez etykiet) | P2 | E-geo (detal, mapa gęsta) |

## 7. Sejiri (OK)

Ikiral (daleki zachód ✓), Midnight Pass (przesmyk na południe od Ikiral ✓),
Benthidrix (ostry szczyt w centralno-wschodniej części wybrzeża ✓),
Chill Depths (zatoka płn.-wsch. wg w3 ✓), lod (biom) + pasmo górskie ✓.
**Bez zmian.**

## 8. Drogi — z losowych w trakty (pkt b zlecenia)

Wcześniejsze 5 dróg nie prowadziło między żadnymi miastami (punkty
wygenerowane „wzdłuż" kontynentów). Nowe = **trakty między największymi
miastami/POI** kontynentu (przycinane do lądu, nigdy przez ocean):

| Trakt | Przebieg (POI → POI) | Uzasadnienie |
|-------|----------------------|--------------|
| Tazeem | **Hadatown → Sea Gate** | główna oś handlu Tazeem (Sea Gate = centrum handlu planu — treść planu) |
| Akoum | **Goma Fada → Affa → Tal Terig** | trakt zachodni przez kotlinę (w2: Affa centrum, Tal Terig szczyt centralny) |
| Ondu | **Cliffhaven → Graypelt → Mosscrack** | trakt zachodni przez Turntimber |
| Murasa | **Singing City → Sunder Bay** | w2: „droga z Sunder Bay prosto do Singing City" |
| Guul Draz | **Malakir → Nimana** | droga wampirzej stolicy do wolnego miasta (w2: „drogi z Nimany…") |

## 9. Etykiety — blisko obiektów, bez kresek (pkt a zlecenia)

Mechanizm `przyDo` (kreska + napis obok) został **usunięty z silnika**
(`render.mjs`: nie rysuje już `zakotwicz`); 16 etykiet z liniami
(Prison of Omath, Cliffhaven, Graypelt, Crypt of Agadeem, Fort Keff,
Glass Haven, Oko Ugina, Affa, Goma Fada, Tal Terig, Malakir, Nimana,
Sea Gate, Sky Rock, Hadatown, Kabira) **przysuniętych do obiektów** w
scenie (napis tuż przy/szybciej od obiektu, bez odnogi). Rozstaw bez
kolizji (`rozstawEtykiety`) zostaje — ale kandydady startują od
właściwej pozycji etykiety, więc przy dobrym rozplanowaniu kreska
nigdy nie była potrzebna.

## 10. Spójność map.json ↔ scena ↔ treść

- Kotwice map.json zsynchronizowane z nowymi pozycjami (Valakut, Halimar,
  Sea Gate, Affa, Goma Fada, Bojuka Bay, Malakir, Nimana, Lulea, Kabira,
  Makindi Trenches, Zof Marsh, Prison of Omath) + nowe (Coralhelm, Ula
  Temple, Merfolk Enclave, The Bulwark, Teeth of Akoum, Tangled Vales,
  Hagra Cistern).
- **Pinezka karty *Coralhelm Guide*** przeniesiona na Coralhelm
  (660,505) — wcześniej (800,658) wylądowałaby w nowym morzu Halimar.
- Duplikat kotwicy „Living Spire" (2 wpisy) — usunięto (hygiene).
- Treść planu (`content/planes/zendikar.md`) i karta — **bez zmian** (to
  one były słuszne; mapa została do nich dopasowana).

## 11. Kolejka E-geo (ROADMAP — następne podejścia)

- **E-geo-1 (P2)** — Archipelag Jwar/Beyeen/Agadeem: przesunięcie z
  płd.-zach. rogu między Ondu a Akoum (w2 §1); za tym pinezki/kotwice.
- **E-geo-2 (P2)** — Tazeem na południowy-zachód (w2 §5) vs obecny
  zachód-centrum: ewentualna rotacja układu zachodniego (Tazeem+Ondu+
  archipelag) — ocena + decyzja z właścicielem (zmiana globalna).
- **E-geo-3 (P2)** — Detal Murasy: Glint Pass, Thunder Gap, Roaring
  Falls, Tumbled Palace, Visimal, Pillar Plains.
- **E-geo-4 (P2)** — Detal Akoum: Tal Terig płn. od Spike Fields; Anowon
  League; Ior Ruin przy Glasspool (kotwica ✓, etykieta brakuje).
- **E-geo-5 (P2)** — Bala Ged/Guul Draz: Pelakka Karst, Helix of Zof,
  nazwa zachodniego gulfu.
- **E-geo-6 (P2)** — Ondu: Nomads of Silundi Sea (płn. wybrzeże),
  Tikal Harbor (w2 §5 — port przy lesie Rief, Tazeem!).
- **E-geo-7 (P2)** — Tazeem: Sunspring (płn. cypel), Calcite Flats
  (płd. cypel) — w2 §5.
- **E-geo-8 (P2)** — Zweryfikować w kanonie: *Prison of Omath* (spelling
  w2) vs *Prison of Omnath* (BFZ) — jednoznacznie ustalić nazwę.
- **E-geo-9 (P2)** — Hada w centrum Tazeem (w2) vs obecne SW.

## 12. Co sprawdzono i uznano za OK

- 7 kontynentów + archipelag — obecne (Beyeen = wysepki, patrz L6).
- Kierunki: Sejiri (płn.) ✓, Akoum (wsch.) ✓, Ondu (zach.) ✓, Tazeem
  (zach./SW) ~, Murasa (środek) ✓, Bala Ged+Guul Draz (płd.-wsch.) ✓.
- Wąska cieśnina Tazeem–Murasa (w2: „najbliżej siebie") ✓ — odległość
  ~220 u (najmniejsza spośród par lądów).
- Ocean: Sea Gate → Ondu ≈ 15–20% szerokości (w2 uwagi) ✓ — ~28% (blisko,
  akceptowalne bez skali).
- Rzeka Umung przez Bala Ged ✓, Vazi na Murasie ✓, rzeki Akoum → Glasspool ✓.
- Jeziora: Glasspool (Akoum) ✓, Lake Jast (płd. Guul Draz) ✓, Blackbloom
  (Murasa) ✓ — plus nowe: Halimar (Tazeem), Hagra Cistern (Guul Draz).
- Wulkany Akoum (4 stożki) + Teeth of Akoum ✓, wulkan Valakut (Beyeen) —
  po naprawie.
- Góry: pasma mapome (ADR 0020) na Sejiri, Akoum, Murasie, Tazeem
  (Bulwark), Ondu ✓.
