# Lorwyn–Shadowmoor — rekomendacja dla 605SHM Consign to Dream

Data: 2026-09-07. **Etap: research i rekomendacja, przed decyzją właściciela.**
Roadmapa i Fabuła verbatim:
`docs/plans/PLAN_2026-09-07-lorwyn-shadowmoor-consign-to-dream-research.md`.
Nie dodano jeszcze karty, planu, archiwalnego wpisu kolekcji ani mapy.

> **Rozstrzygnięcie właściciela po researchu (2026-09-07): rekomendacja
> T1 odrzucona.** Varghedin i pozostałe znalezione mapy nie spełniają
> wymaganego poziomu jakości. Obowiązuje **ADR 0037: T4, wspólna geometria,
> przełączane nazwy Lorwyn/Shadowmoor, te same pinezki**. Eclipsed czeka
> na kartę, która tego wymaga. Poniżej historyczny research, nie aktualne
> zlecenie adopcji rastrów; nie oczekujemy już na ich przesłanie.
>
> **605 to niezmienny numer kolekcji, imgId = 605SHM (ADR 0036).**
> Metadane katalogu Scryfall nie są propozycją zmiany tej numeracji.

## Rekomendacja w skrócie

**Jeden plan w bazie, dwa przełączane oblicza mapy, jedna karta i jedna
pinezka.** Nazwa widoczna: **Lorwyn–Shadowmoor**; proponowany slug
`lorwyn`, zgodny z dostawą. Lorwyn i Shadowmoor nie stają się dwiema
odrębnymi pozycjami w liczniku planów.

Dla tej karty proponuję **klasyczną epokę Oony** i domyślny widok
**Shadowmoor**. Drugi widok to Lorwyn tej samej epoki. Osobno trzeba
opisać współczesny stan z *Lorwyn Eclipsed*: nie jest on po prostu
kolejnym globalnym przełączeniem całego świata na noc.

**Najlepszym znalezionym kandydatem na podkłady jest para fanowskich map
Varghedina.** Preferowany kierunek po akceptacji: T1 + T1, z własnymi
napisami rastrów i nakładką pinezek. To rekomendacja wyboru kandydata,
**nie deklaracja zakończonego QA oryginałów**: dostępne lokalnie były
jedynie miniatury; pełne pliki i ich kalibracja wymagają sprawdzenia
przed adopcją. Jeśli potrzebują istotnych korekt epoki/topologii,
właściwym wariantem rezerwowym jest T4 z kanonu, nie ciche poprawianie
cudzej mapy i podpisywanie jej jako oryginału.

## 1. Dwie osie, których nie należy mieszać

### Oblicze: Lorwyn ↔ Shadowmoor

To dwa aspekty jednego planu, nie odpowiednik odrębnych światów sagi
Final Fantasy ani alternatywne linie historii Tarkiru. W **epoce Oony**
Wielka Zorza (*Great Aurora*) zmieniała cały plan w odstępach około
trzystu lat: Lorwyn oznaczał niekończący się dzień i lato, Shadowmoor —
niekończącą się noc. Zmianie podlegały istoty, ich pamięć i krajobraz.
Nie wystarczy więc zastosować ciemnego filtra do jasnej mapy.
[5](https://magic.wizards.com/en/news/magic-story/planeswalkers-guide-to-lorwyn-eclipsed)

### Epoka: Oona ≠ Lorwyn Eclipsed

Po upadku Oony oba oblicza zaczęły **istnieć obok siebie**, oddzielone
ruchomymi granicami auror. Przewodnik *Lorwyn Eclipsed* opisuje także
**eclipsed realms** — obszary pogranicza, które nie są po prostu Lorwynem
lub Shadowmoorem. Eirdu i Isilu wpływają na równowagę i przemiany terenu.
To nie uzasadnia tworzenia trzeciego planu w bazie, ale wyklucza
przedstawianie klasycznych dwóch map jako pełnego, aktualnego modelu
współczesnych granic. [5](https://magic.wizards.com/en/news/magic-story/planeswalkers-guide-to-lorwyn-eclipsed)

Uwzględniono również finał opowieści *Lorwyn Eclipsed*, nie tylko
przewodnik sprzed premiery. Finał przywraca równowagę, a Maralen
pozostaje sobą i władczynią Glen Elendra — nie przywraca dawnego
trzystuletniego reżimu Oony.
[5](https://magic.wizards.com/en/news/magic-story/lorwyn-eclipsed-episode-7-the-charm-dissolves-apace)

**Wniosek do implementacji:** dwa przyciski mają oznaczać **oblicza
w określonej epoce**, a nie udawać pełną oś historii planu. Dla 605SHM
nie budować teraz dodatkowej mapy ruchomych granic Eclipsed. Jej potrzeba
wróci dopiero przy scenie karty z tej epoki lub wyraźnym zleceniu.

## 2. Dlaczego Glen Elendra dobrze spina oba widoki

Glen Elendra jest ukrytą doliną królowej fae, osłoniętą iluzjami.
W epoce Oony jej magia chroniła tę lokację przed przemianą Wielkiej
Zorzy. To **pozytywnie poświadczony wyjątek**, nie pretekst do uznania,
że cała reszta geografii nigdy się nie zmieniała. Źródła opisują też
mieszanie dnia i nocy w glen oraz jej piękno przy zmierzchu; „wieczorny
mrok” Fabuły nie wymaga automatycznego uznania słowa Lorwyn za błąd.
[6](https://mtg.wiki/page/Glen_Elendra)

Lokalizacja w lore: górska dolina na południe od **Lys Alana**; źródło
wiki odsyła tu do *Eventide* i *Lorwyn: First Light*. To twarda relacja
do sprawdzenia na mapach fanowskich. Współczesnego pałacu Maralen,
rozbudowanego po upadku Oony, nie należy bezrefleksyjnie przenosić do
sceny z SHM. [6](https://mtg.wiki/page/Glen_Elendra)

Dla pinezki proponuję:

- miejsce: **Glen Elendra**, ostępy doliny, nie arbitralnie tron lub pałac;
- pewność: **`region`** — miejsce nazwane, ale brak konkretnego punktu
  wewnątrz ostępów;
- jedna pinezka karty w obu widokach, z zaznaczoną epoką sceny;
- **bez współrzędnych liczbowych na etapie researchu**. Ich ustalenie
  nastąpi na pełnym, wybranym podkładzie, po sprawdzeniu kalibracji.

Słowo `Lorwyn` z dostawy zachować w archiwum. W katalogu może służyć jako
skrót nazwy całego planu Lorwyn–Shadowmoor; nie zmieniamy po cichu Fabuły
ani nie dublujemy tej samej karty pod drugim planem.

## 3. Weryfikacja druku karty i granica interpretacji

Źródło bezpośrednie:
https://api.scryfall.com/cards/named?exact=Consign%20to%20Dream&set=shm

| Pole | Wynik |
| --- | --- |
| Identyfikator właściciela | **605SHM** — nie jest collector number |
| Druk | **Consign to Dream, Shadowmoor / 32**, common, 2008-05-02 |
| ID Scryfall | `5e866d86-5bfa-473d-be17-d8f4aea70ddb` |
| Oracle ID | `624bdbfb-b611-43b6-a3c5-cc8b11dbfaae` |
| Koszt i typ | `{2}{U}`, Instant |
| Artysta | Richard Kane Ferguson |

Oracle:

> Return target permanent to its owner's hand. If that permanent is red or green, put it on top of its owner's library instead.

Flavor:

> “Dreams are fleeting. Reality even more so.”
> —Oona, queen of the fae

Oona jest więc bezpośrednio obecna we flavorze druku, a sen i nietrwałość
rzeczywistości dobrze odpowiadają Fabule. Domyślny **Shadowmoor z epoki
Oony** jest najprostszym odczytaniem zestawu SHM + postać władczyni.
Nie jest to jednak dowód, że każde użycie słowa „zmierzch” w Glen musi
oznaczać nocne oblicze całego planu.

**Ważne przy późniejszym pisaniu:** „na zawsze” w Fabule traktować jako
poetykę zniknięcia z tej sceny, nie mechaniczny opis unicestwienia.
Czar zwraca permanent do ręki albo na wierzch biblioteki — nie niszczy
i nie wygania go. Leśne otoczenie nie ustala też samo z siebie koloru
niezidentyfikowanego olbrzyma; wariant biblioteki jest warunkowy.
Fabuła pozostaje verbatim, interpretacja reguł nie może jej przerobić
w opis nieistniejącego efektu. Pełny snapshot w `scryfall/` powstanie
przy materializacji (cały JSON, nie ręcznie wybrane pola).

## 4. Znalezione mapy

### A. Varghedin — komplet Lorwyn / Shadowmoor / wersja łączona

**Najlepszy kandydat do dalszego użycia.** Autor sam określa swoje prace
jako własne mapy; strony plików nazywają je fanowskimi. Obecność w galerii
MTG Wiki ani szablon copyright WotC nie czynią ich oficjalną kartografią.

| Plik | Dane ze strony pliku | Rola w rekomendacji |
| --- | --- | --- |
| Lorwyn | JPEG, **2341×2341**, **2,76 MB**, wersja 2025-06-02 | Jasny podkład T1 |
| Shadowmoor | JPEG, **2341×2341**, **2,01 MB**, aktualizacja nazw 2025-06-02 | Nocny podkład T1, proponowany domyślny |
| Lorwyn–Shadowmoor | JPEG, **4682×2341**, **8,23 MB**, 2025-06-02 | Materiał porównawczy; nie dowód topologii Eclipsed |

Strony plików (pochodzenie, historia i deklarowane wymiary):

- https://mtg.wiki/page/File:Lorwyn_Map_by_Varghedin.jpg
- https://mtg.wiki/page/File:Shadowmoor_Map_by_Varghedin.jpg
- https://mtg.wiki/page/File:Lorwyn-Shadowmoor_Map_by_Varghedin.jpg
- O autorze: https://mtg.wiki/page/User:Varghedin

**Oryginały do pobrania przez właściciela:**

- Lorwyn: https://files.mtg.wiki/Lorwyn_Map_by_Varghedin.jpg
- Shadowmoor: https://files.mtg.wiki/Shadowmoor_Map_by_Varghedin.jpg
- Wersja łączona: https://files.mtg.wiki/Lorwyn-Shadowmoor_Map_by_Varghedin.jpg

Zalety: jeden autor, gotowa para w identycznych wymiarach, rozdzielczość
powyżej progu 1600 px, umiarkowana masa obu podkładów (około 4,77 MB).
W miniaturach widać pokrewne ujęcie i rozróżnienie oblicz.

**Granice weryfikacji:** lokalnie obejrzano tylko 250×250 (Lorwyn)
i 120×120 (Shadowmoor). Próba pobrania publicznych oryginałów z sandboxa
zakończyła się błędem TLS `SSL_ERROR_SYSCALL`; wyszukiwarka obrazów
zwracała miniatury, także po zapytaniu o plik łączony. **Nie potwierdzam
jeszcze czytelności wszystkich napisów, kompletności POI, zgodności
epoki ani dopasowania pikselowego.** Nie mylić deklarowanych 2341 px
ze zweryfikowanym lokalnie plikiem.

Wersja łączona ma proporcję dwóch kwadratów; bez oglądu oryginału nie
uznaję jej za mapę dwóch sąsiadujących terytoriów współczesnego świata.
W tabeli EXIF pliku łączonego pozostało ponadto 2341×2341, inne niż
wymiary podawane przy oryginale. Kalibrację liczy się z faktycznego
obrazu, nie z potencjalnie odziedziczonego EXIF.

Nie znaleziono udostępnionego SVG/PDF wektorowego tych map. Gdyby autor
udostępnił taki materiał, należałoby najpierw sprawdzić, czy geometria
jest rzeczywiście wektorowa, a nie tylko rastrem osadzonym w SVG/PDF.

### B. Rhineglade — Lorwyn MTG Planar Map (2025)

Strona autora:
https://www.deviantart.com/rhineglade/art/Lorwyn-MTG-Planar-Map-1165091096

Metadane strony: **4096×3072, 26,74 MB**, publikacja 2025-02-28;
link do podglądu 1280×960, oryginał pobierany po zalogowaniu.
Potwierdzono stronę i metadane, **nie pobrano ani nie obejrzano właściwego
obrazu tej mapy**. Wyszukiwanie obrazu zwróciło błędnie mapę Zendikaru —
odrzucona, nie policzona jako Lorwyn. Nie zweryfikowano odpowiadającej
mapy Shadowmoor.

**Werdykt:** realny alternatywny kandydat do obejrzenia, nie lepsza para
na obecnym etapie. Większa rozdzielczość sama nie rozstrzyga o jakości
kanonu, a brak potwierdzonego drugiego oblicza zwiększa koszt rozwiązania.

### C. vic52 — mapa kampanii z Reddita (2017)

https://www.reddit.com/r/magicTCG/comments/6lwlj9/map_of_lorwyn_for_my_current_campaign_anything/

Obejrzano podgląd **640×480**. Sama strona Reddita zwróciła 403;
opis autora i komentarze były dostępne we wynikach wyszukiwania.
Autor umieszcza ukryte Glen Elendra w północno-wschodniej części mapy,
między Great Forest a Wren's Run. To wymaga konfrontacji z relacją
„na południe od Lys Alana”. Na obejrzanym jasnym podkładzie widnieje też
**Wanderbrine**, a nie dzienna nazwa **Wanderwine**.
[4](https://www.reddit.com/r/magicTCG/comments/6lwlj9/map_of_lorwyn_for_my_current_campaign_anything/)

**Werdykt:** pomocniczy szkic kampanii, nie wybór bazowy dla tej karty.
Wątek wspomina planowaną mapę Shadowmoor, ale nie zweryfikowano jej
ukończenia ani pliku. Nie deklarować posiadania pary na tej podstawie.

### D. Źródła oficjalne i pozorne trafienia

- **Planeswalker's Guide to Lorwyn Eclipsed** — najważniejsze źródło
  opisu aktualnej natury świata i relacji miejsc, ale w tej kwerendzie
  nie pozyskano z niego kartograficznego podkładu świata.
  [5](https://magic.wizards.com/en/news/magic-story/planeswalkers-guide-to-lorwyn-eclipsed)
- **Lorwyn: First Light** (D&D Beyond, 2025) — oficjalna zapowiedź mówi
  o dwóch przygodach i wspólnej mapie. Publiczna recenzja opisuje ją
  jako plan **Aeghith, budynku w Burrenton**, nie atlas planu i nie
  mapę Glen Elendra. Pełnej płatnej publikacji nie przeczytano.
  Zapowiedź: https://www.dndbeyond.com/posts/2069-add-a-delightful-twist-to-forgotten-realms
  Recenzja: [9](https://dungeonsanddragonsfan.com/dnd-lorwyn-shadowmoor-magic-the-gathering/)
- **Planeshifted Guide to Lorwyn** na GM Binder to opracowanie fanowskie
  do D&D, nie oficjalny Plane Shift WotC. Może pomagać w szukaniu źródeł,
  ale nie uzyskano z niego zweryfikowanego wektorowego podkładu.
  [3](https://www.gmbinder.com/share/-NgXH3Gkv8mnzLsOP3A4)
- Trafienie **Map of Lorwyn / lordwolf89 (2009)** opisuje część własnego
  tworzonego świata autora; nie zakładać związku z MTG po samej nazwie.
  [1](https://www.deviantart.com/lordwolf89/art/Map-of-Lorwyn-141650261)
- Trafienia SVG obejmowały symbole dodatku, nie kartografię; token Map
  z ECL też nie jest sam przez się mapą geograficzną planu.

**Werdykt drabiny:** nie znaleziono potwierdzonego T2 ani oficjalnego
rastra całego świata; znaleziono sensowną **fanowską parę T1**. To wynik
konkretnej kwerendy, nie twierdzenie „oficjalna mapa nigdy nie istniała”.

## 5. Proponowany model w Codexie

Bez tworzenia plików wykonawczych na tym etapie:

- `content/planes/lorwyn.md`: jedna strona **Lorwyn–Shadowmoor**,
  z rozdzieleniem oblicz i historii; `mapa: lorwyn`.
- `content/cards/605shm-consign-to-dream.md`: jedna karta, scena
  w Glen Elendra za Oony, powiązana z planem `lorwyn`.
- `maps/lorwyn/map.json`: jedna mapa, `warianty[]` z ID semantycznymi
  **`shadowmoor`** i **`lorwyn`**, a nie ID oznaczającymi tier pliku.
  Przy wyborze Varghedina oba wpisy miałyby `wariant: T1` i `etykiety:false`.
- Domyślny wariant: **Shadowmoor**; jego oryginał jako układ złoty.
  Tytuły przycisków „Shadowmoor” i „Lorwyn”, kontekst „epoka Oony”.
  Neutralne określenie przełącznika jako oblicza/podkładu, nie sugerowanie
  alternatywnych linii czasu.
- Jedna pinezka i jej uzasadnienie; deep-link może użyć istniejącego
  `?epoka=shadowmoor&pin=605shm-consign-to-dream`.
- Oryginalnych napisów T1 nie zakrywać etykietami Codexu. Oddzielne
  miniatury i pełne pliki do zoomu, atrybucja każdego wariantu.

To kierunek zgodny z mechanizmem ADR 0035, ale wybór archiwalnej epoki
pierwszej karty zamiast aktualnych granic Eclipsed trzeba **jawnie
zatwierdzić i zapisać** jako zastosowanie/uzupełnienie ADR 0033/0035.
Research nie nadaje mu statusu zaakceptowanej decyzji.

## 6. Brama przed wdrożeniem

1. Zgoda właściciela na model oraz użycie i commit **konkretnych dwóch
   rastrów fanowskich**. Samo znalezienie ich w sieci nie zastępuje zgody
   z ADR 0031/0035.
2. Pełne JPEG-i, nie screenshoty ani miniatury. Sprawdzić rzeczywiste
   wymiary, czytelność przy około 1600 px i detale przy zoomie.
3. Kontrola kanonu i epoki: Glen na południe od Lys Alana, właściwe
   dzienne/nocne nazwy, brak nieoznaczonych lokacji powstałych dopiero
   po upadku Oony lub po inwazji Phyrexii. Daty plików z 2025 roku same
   nie potwierdzają przedstawionej epoki.
4. Sprawdzić wspólny układ zgodnie z ADR 0035/L13 — na pełnych obrazach,
   na zestawie punktów kontrolnych (wymagany przegląd ≥20 POI), nie
   tylko na równości rozdzielczości. Tożsamościowa kalibracja jest
   **hipotezą do sprawdzenia**, nie gotowymi danymi.
5. Przykładowe relacje do kontroli: Glen Elendra ↔ Glen Elendra,
   Goldmeadow ↔ Mistmeadow, Kinsbaile ↔ Kinscaer,
   Burrenton ↔ Barrenton, Tanufel ↔ Kulrath,
   Wanderwine ↔ Wanderbrine. Każdy punkt sprawdzić w źródle właściwej
   epoki, bez przenoszenia nowych pałaców/wsi pod stare nazwy.
6. Jeśli rastry nie pozwalają na sensowną globalną kalibrację lub
   są merytorycznie nieodpowiednie dla epoki, **nie udawać zgodności**:
   wrócić do decyzji o T4 / innym podkładzie. Nie rozbudowywać teraz
   formatu pinezek o niezależne współrzędne per oblicze.
7. Dopiero potem: archiwum Fabuły verbatim, cały JSON Scryfalla, karta,
   strona planu, mapa/pinezka i testy, ogląd, Co nowego, zielone
   inkrementalne commity. Bez nowego hasła Oony/Glen na zapas.

## Decyzja proponowana właścicielowi

**Wybrać jeden plan Lorwyn–Shadowmoor, klasyczne oblicza epoki Oony,
Shadowmoor jako start dla 605SHM i parę Varghedina jako pierwszy
kandydat T1.** Do kolejnego kroku potrzebne są akceptacja tego kierunku
oraz pełne dwa pliki. T4 pozostawić jako uzasadniony wariant rezerwowy,
nie zaczynać od rysowania trzech map i nie mieszać starej sceny
z dzisiejszymi ruchomymi granicami Eclipsed.
