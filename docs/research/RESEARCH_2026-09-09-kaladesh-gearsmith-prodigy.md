# Kaladesh / Avishkar — rekomendacja mapy dla 610M19 Gearsmith Prodigy

Data: 2026-09-09. **Etap: research i rekomendacja, przed decyzją właściciela.**
Roadmapa tej fazy: `docs/plans/PLAN_2026-09-09-pr27-kaladesh-gearsmith-prodigy-research.md`.
Nie dodano jeszcze karty, planu, wpisu kolekcji ani plików mapy Kaladeshu.

## Rekomendacja w skrócie

**Nie zaczynać Kaladeshu od mapy całego świata.** W obecnym stanie źródeł
najuczciwszy kierunek dla pierwszej karty to **T4 w skali miasta Ghirapur**
(jako pierwszy widok mapowy planu `kaladesh`), a nie T1/T2 ani ręczne T3.

Powód jest prosty:

- **oficjalnej, commit-ready mapy Kaladeshu/Avishkaru nie znalazłem;**
- **publicznego rastra fanowskiego o jakości benchmarku T1 też nie znalazłem;**
- **kanon tekstowy dużo lepiej opisuje Ghirapur niż cały plan;**
- scena `Gearsmith Prodigy` jest z natury **miejska, wynalazcza i ogrodowa**,
  więc miasto daje lepszą zgodność niż spekulacyjny atlas świata.

**Najlepsza ścieżka:**

1. plan w bazie: **Kaladesh** (z notką, że współczesne lore używa nazwy
   **Avishkar**),
2. pierwszy widok mapowy: **Ghirapur**,
3. wariant techniczny: **T4** (scena + mapforge, zgodnie z `PROCES_MAP.md`),
4. pinezka pierwszej karty: na etapie startowym raczej **`region`**, nie
   `dokladna` — zapewne okolice **Greenwheel / ogrodów miejskich / strefy
   arboretum**, ale bez udawania, że kanon daje numer tarasu.

## Werdykt drabiny T1 / T2 / T3 / T4

| Tier | Czy realny teraz? | Werdykt |
| --- | --- | --- |
| **T1** | **Nie** | Brak znalezionego, pięknego i pewnego podkładu do adopcji. Dotyczy to zarówno oficjalnej mapy, jak i publicznego fanowskiego rastra godnego commitu. |
| **T2** | **Nie teraz** | T2 ma sens dopiero po dobrym T1. Skoro nie ma wiarygodnego podkładu bazowego, nie ma czego rozsądnie wektoryzować. |
| **T3** | **Tak, ale słabsze niż T4** | Z samego kanonu da się uczciwie odtworzyć relacje, zwłaszcza dla Ghirapuru, ale ręczne T3 byłoby dziś cofnięciem się wobec przyjętego procesu „scena + mapforge”. |
| **T4** | **Tak — i to rekomenduję** | Ghirapur ma dość nazw, relacji i charakterów dzielnic, by narysować stylizowaną rekonstrukcję miasta bez udawania oficjalnego atlasu. |

## 1. Co kanon daje naprawdę

### 1.1. Cały plan

Oficjalne źródła opisują Kaladesh jako świat z widocznym, materialnym
aetherem, silnie powiązany z cyklem wynalazczości, technologią i estetyką
„living machine”. Przewodnik WotC dużo mówi o naturze świata, ale nie daje
w tej kwerendzie żadnego kartograficznego podkładu planu.

Jednocześnie źródła wtórne zebrane na MTG Wiki pozwalają ułożyć **szkielet
makrogeografii**:

- **Ghirapur** leży przy układzie trzech rzek,
- **Vinday** płynie przez **Peemę** do Ghirapuru,
- **Suramal** spotyka się z Vindayem w Ghirapurze,
- z ich połączenia powstaje **Vasavati**, która biegnie do morza,
- **Vahd** wiąże się z doliną / stopniami przy **Mapani**,
- **Lathnu** leży wysoko przy **Devra Cliffs**, na północnym skraju
  cywilizacji,
- przez wieś i prowincję stoją **Aether Collection Towers** zasilające
  system miasta.

To wystarcza do uczciwego opisu relacji świata, ale **nie do atlasowej,
precyzyjnej geometrii całego planu**.

### 1.2. Ghirapur

Tutaj sytuacja jest dużo lepsza. Oficjalne i wtórne źródła zbieżnie
pokazują, że to właśnie miasto jest głównym, gęsto opisanym teatrem
Kaladeshu.

Dla Ghirapuru mamy wiele nazwanych jednostek i relacji:

- **Bomat** jako port i handel,
- **Eleven Bridges** jako rdzeń miejski na **Dukhara Canal**,
- **Aether Spire** i **Aradara Station** jako wielkie punkty orientacyjne,
- **Embraal** jako strefę przemysłową,
- **Freejam** jako strefę aeronautyczną i pionową,
- **Giants' Walk** nad **Vindayem**,
- **Greenwheel** jako dzielnicę ogrodów, lifecrafterów i „Zoo”,
- **Kujar** jako zieloną, planowaną dzielnicę mieszkaniową,
- **Ovalchase** jako dzielnicę wyścigową,
- **Shaila's Claim** jako zielony skraj miasta,
- **Weldfast** wokół jednego z aetherhubów,
- układ rzek **Vinday / Suramal / Vasavati**.

To jest materiał nie na mapę uliczną, ale na **porządną mapę dzielnicowo-
rzeczną**.

## 2. T1 — dlaczego nie widzę dobrego podkładu bazowego

### 2.1. Oficjalna / kanoniczna mapa

Nie znalazłem w tej kwerendzie **jawnej, oficjalnej mapy kartograficznej**
Kaladeshu ani Ghirapuru w jakości gotowej do adopcji jako T1.

Znalazłem za to:

- oficjalne przewodniki i worldbuilding,
- panoramy / ilustracje świata,
- wzmianki o modelach miasta,
- oficjalne grafiki kartowe związane z Ghirapurem.

To nie to samo co mapa. **`Ghirapur Orrery` nie jest podkładem mapowym**;
to perspektywiczny model artystyczny, nie czytelny plan z geometrią do
kalibracji pinezek. Podobnie plane card / ilustracje promocyjne mogą być
świetnym klimatem, ale nie dają uczciwej kartografii.

### 2.2. Publiczny raster fanowski

Sygnały z sieci są raczej negatywne: społeczność sama zauważa, że Kaladesh
ma dużo lore i mało geograficznej siatki. Natrafiłem na dyskusje, w których
fani pytają o zasoby do zrobienia mapy, a odpowiedzi brzmią w praktyce:
„jest artbook i opisy, ale nie ma porządnej mapy; trzeba rekonstruować samemu”.

To jest ważne nie jako kanon, tylko jako **negatywny test rynku źródeł**:
gdyby świetny, stabilny i powszechnie uznany podkład istniał, zwykle wybija
się on dużo łatwiej w kwerendzie. Tutaj takiego kandydata nie widać.

W praktyce znalazłem głównie:

- agregaty galerii / planechase artów,
- rozmowy o potrzebie własnej rekonstrukcji,
- pojedyncze prywatne szkice kampanijne.

To za mało na T1.

## 3. T2 — dlaczego odpada razem z T1

W tym projekcie **T2 nie jest osobnym „rodzajem znalezionej mapy”**, tylko
**upgrade'em dobrego T1**: najpierw trzeba mieć raster, który warto przyjąć,
a dopiero potem wektoryzować ważne linie.

Tu tego punktu startowego po prostu brak. Nie ma sensu:

- brać słabego fanowskiego szkicu tylko po to, żeby „mieć T1”,
- czyścić go do T2 i udawać, że problem jakości zniknął,
- wektoryzować geometrię, która sama w sobie nie ma mocnego oparcia.

**Wniosek:** T2 dla Kaladeshu dziś nie jest decyzją „jeszcze nie”, tylko
raczej „nie zaczynaj od tego wcale”.

## 4. T3 / T4 — co da się odtworzyć odpowiedzialnie

### 4.1. Cały plan: tylko bardzo szkieletowo

Z kanonu można uczciwie narysować kilka twardych relacji:

- Ghirapur przy węźle rzecznym,
- Peema na biegu Vindayu,
- Vahd przy Mapani,
- Lathnu wysoko przy Devra Cliffs,
- Vasavati do morza,
- sieć zbioru aetheru rozsianą po planie.

Ale nadal brakuje rzeczy krytycznych dla mocnej mapy świata:

- zasięgów lądów i wybrzeży,
- proporcji odległości,
- wyraźnych granic regionów,
- pewnego układu administracyjnych „jedenastu” w przestrzeni,
- zestawu wielu kontrolnych punktów kalibracyjnych.

Da się więc zrobić **minimalny schemat świata**, ale dla pierwszej karty
byłaby to bardziej plansza orientacyjna niż naprawdę dobra mapa.

### 4.2. Ghirapur: tak, na poziomie dzielnic i wód

Dla miasta kanon daje już sensowny materiał do rekonstrukcji:

- rdzeń kanałowy i mostowy,
- relacje rzek,
- funkcje dzielnic,
- kilka mocnych landmarków,
- opisy skrajów miasta i zielonych enklaw.

To wystarcza do T3/T4, o ile uczciwie postawimy granicę:

- **tak** dla dzielnic, rzek, kanałów, portu, węzłów i landmarków,
- **nie** dla fikcyjnej mapy ulic po przecinku,
- **nie** dla udawania, że znamy dokładny plan tarasów, ogrodów i podwórek.

### 4.3. Dlaczego wolę T4 od T3

`PROCES_MAP.md` odsyła nowe plany bez mapy do trybu **scena + mapforge**.
Przy Kaladeshu to ma sens, bo problemem nie jest brak pomysłu na kształt
estetyczny, tylko potrzeba **zdyscyplinowanej, jawnie rekonstrukcyjnej**
mapy. T4 lepiej pasuje niż ręczne T3, bo:

- łatwiej trzyma wspólny styl atlasowy projektu,
- pozwala jawnie budować scenę z relacji kanonicznych,
- nie wymaga udawania, że kopiujemy istniejący raster,
- zostawia otwartą drogę na późniejsze dołączenie T1, jeśli właściciel
  kiedyś dostarczy dobry podkład fanowski/oficjalny.

## 5. Jaka skala ma sens dla pierwszej karty

### 5.1. Cały plan — **nie teraz**

To byłoby zbyt ambitne względem jakości źródeł i zbyt słabe względem samej
sceny karty. Dałoby dużą pustą planszę z kilkoma nazwami, a `Gearsmith
Prodigy` i tak żyje w miejskim mikroświecie wynalazców.

### 5.2. Region / korytarz Ghirapur–Peema–Vahd — **też nie polecam na start**

To wygląda kusząco, ale byłoby sztuczne. Nie ma dziś jednego oczywistego,
kanonicznie nazwanego „regionu startowego”, który naturalnie skupia tę kartę.
Taki wariant byłby kompromisem gorszym od obu skrajów: ani pełny świat,
ani naprawdę użyteczne miasto.

### 5.3. Ghirapur — **tak**

To skala najlepiej dopasowana do:

- gęstości źródeł,
- charakteru planu w setach Kaladesh / Aether Revolt,
- sceny `Gearsmith Prodigy`,
- uczciwości wobec odbiorcy.

Dodatkowo to skala, na której łatwo później dopinać kolejne karty o
wynalazcach, wyścigach, rynkach, aetherhubach i dzielnicach bez każdorazowej
walki z pustką planu globalnego.

### 5.4. Podejście etapowe — **tak, ale z właściwą kolejnością**

Jeśli Kaladesh urośnie w bazie, najlepszy model widzę taki:

1. **Etap 1:** Ghirapur jako pierwszy widok mapowy planu.
2. **Etap 2:** dopiero gdy przyjdą karty naprawdę terenowe / prowincjonalne,
   rozważyć szkic świata lub szerszą mapę planu.
3. **Etap 3:** jeśli właściciel kiedyś dostarczy dobry raster, dołączyć go
   jako wariant T1 zgodnie z ADR 0035, zamiast przepisywać historii decyzji.

To jest dobre „multi-variant”, ale **nie równoległe budowanie dwóch słabych
map od razu**.

## 6. Co to znaczy dla pinezki Gearsmith Prodigy

Na samym researchu nie widzę podstaw do pinezki `dokladna`.

Mamy mocne przesłanki na:

- **Ghirapur**,
- klimat dzielnicy zielonej / ogrodowej,
- kulturę młodych konstruktorek i lifecrafterów,
- możliwe skojarzenie z **Greenwheel** albo z miejskimi ogrodami / arboretum.

Ale opis sceny nadal nie daje publicznie weryfikowalnego punktu w rodzaju
„ten konkretny plac”, „ta konkretna stacja”, „ten konkretny most”.
Dlatego startowo rekomenduję **`region`**. Jeśli przy materializacji
pojawi się twardsza podstawa tekstowa, będzie można to zawęzić.

## 7. Czego nie robić

1. **Nie udawać, że istnieje oficjalna mapa całego Kaladeshu, jeśli jej nie mamy.**
2. **Nie brać przypadkowego fanowskiego szkicu z Reddita / galerii jako T1 tylko dlatego, że jest jedyny.**
3. **Nie robić T2 ze słabego T1.** To tylko utrwali złą geometrię.
4. **Nie zaczynać od mapy świata z trzema rzekami i czterema nazwami, jeśli pierwsza karta jest wybitnie miejska.**
5. **Nie robić fałszywie precyzyjnej mapy ulic i tarasów Ghirapuru.** Kanon tego nie wspiera.
6. **Nie traktować `Ghirapur Orrery` ani planechase artów jako mapy kartograficznej.**

## Decyzja proponowana właścicielowi

**Wybrać Ghirapur jako pierwszy widok mapowy Kaladeshu i zrobić go od razu
jako T4.** Nie robić teraz T1/T2, nie zaczynać od mapy całego świata,
nie sztucznie wciskać wariantu regionalnego. To byłaby najbardziej uczciwa,
najbardziej użyteczna i najlepiej obroniona kanonicznie ścieżka dla
`610M19 Gearsmith Prodigy`.

## Źródła

### Źródła główne

- https://magic.wizards.com/en/news/magic-story/planeswalkers-guide-kaladesh-2016-11-02
- https://magic.wizards.com/en/news/magic-story/making-kaladesh-2016-11-09
- https://magic.wizards.com/en/news/feature/planeswalkers-guide-to-aetherdrift-part-2
- https://mtg.wiki/page/Avishkar
- https://mtg.wiki/page/Ghirapur

### Źródła pomocnicze / negatywne testy kwerendy

- https://www.mtg-multiverse.com/kaladesh/
- https://www.reddit.com/r/magicTCG/comments/8qtkil/im_going_to_make_a_kaladesh_map_can_you_help_with/
- https://www.mtgsalvation.com/forums/magic-fundamentals/magic-storyline/767634-help-with-ghirapur-map
- https://api.scryfall.com/cards/named?exact=Gearsmith%20Prodigy
