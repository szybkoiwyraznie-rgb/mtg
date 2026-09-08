# Research mapowy: Dominaria — wybór wariantu (MA1)

> **v2** (2026-09-08, sesja PR-24): pełny research — kwerenda wszystkich
> 91 plików z kategorii Maps of Dominaria, ogląd kluczowych kandydatów,
> zweryfikowane dane karty inicjującej (dostawa właściciela 2026-09-08).
> Rozszerza i zastępuje szkic v1 (commit `7a69a67`, sesja PR-23);
> wniosek główny v1 (T1 świat + podmapa Aerony) **utrzymany**,
> ale z innym faworytem podkładu podmapy i pełnym uzasadnieniem.
>
> Drabina wg [ADR 0038](../../docs/decisions/0038-drabina-preferencji-wariantow-map-t2-t1-t3-t4.md),
> podmapy wg [ADR 0032](../../docs/decisions/0032-final-fantasy-plan-franczyza-mapy-wg-czesci-sagi.md),
> jedna mapa stanu współczesnego wg
> [ADR 0033](../../docs/decisions/0033-mapy-planow-jedna-mapa-aktualnego-stanu-kanonicznego.md).
>
> **Aktualizacja (ta sama sesja):** mechanizm podmapy Aerony rozstrzyga
> [ADR 0039](../../docs/decisions/0039-piramida-lod-map-przyblizenia-kafelki.md) —
> Aerona to **przybliżenie L2** w piramidzie LOD (L0 FHD → L1 kafelki
> M1 → L2 region), nie podmapa-strona. Rekomendacja materiałowa z §5
> (M1 + D1) bez zmian; procedura: §7 ADR 0039 (od razu docelowo).

## 0. Kotwica: karta inicjująca 40USG Expunge

Dostawa właściciela (2026-09-08, czat): scena na **kamiennym dziedzińcu
katedry w Benalii** — rycerz w złotej zbroi o motywach witrażowych,
od stóp spowity czarną mgłą jak rozlany atrament, dolna połowa ciała
traci kolor i trójwymiar; tarcza z symbolem słońca rozpływa się w dym.
Klamra Fabuły: „czarna magia nie krzyczy — po prostu ściera cię
z pamięci".

Fakty o karcie (Scryfall API): **Expunge**, *Urza's Saga* (1998),
common, `{2}{B}` Instant — „Destroy target nonartifact, nonblack
creature. It can't be regenerated. Cycling {2}"; artysta
**Christopher Moeller**; **brak flavor textu** (scena pochodzi w całości
z odczytu artu); numer kolekcjonerski **135**.

⚠️ **Uwaga metodologiczna:** „40" w `40USG` to **indeks kolekcji
właściciela**, nie numer kolekcjonerski (ten to 135) — ta sama konwencja
co 605SHM (Shadowmoor miał 301 kart) czy 393DKA. Nie wyciągać numerów
kart ze snippetów wyszukiwarki: pobieżny odczyt galerii Scryfalla
podsunął wcześniej fałszywe „Rune of Protection: Red".

Wniosek lokacyjny: **Benalia, kontynent Aerona**. Epoki scena nie
znaczy (rozwinięcie w §4).

## 1. Inwentarz: co w ogóle istnieje

Kategoria „Maps of Dominaria" na MTG Wiki: **91 plików**, zero wektorów
(zob. §1.4). Dominaria to odwrotność Innistradu: tam WotC nie wydał
żadnej mapy, tu oficjalna kartografia istnieje i ma udokumentowaną
genealogię (globus Pete'a Ventersa z lat 90. → fotogrametria Nicka
Bartolettiego → oprogramowanie NASA → plate carrée → Mercator
(Ethan Fleischer) → finalna ilustracja **Jareda Blando**, 2018;
kolumna *Dominarian Cartography*, linki w §6).

### 1.1. Mapa świata

| # | Plik | Rozmiar | Status |
|---|---|---|---|
| M1 | `Dominaria by Varghedin.jpg` (MTG Wiki) | **8100×5200**, 9,65 MB | fan-mapa **pochodna oficjalnej mapy Blando**, licencja self-provided (autor sam wgrał), **utrzymywana** (ost. update 2026-02, „Tamingazin"); najgęstsza toponimia; direct URL: `https://files.mtg.wiki/Dominaria_by_Varghedin.jpg` |
| M2 | `Map of Dominaria 2018 Blando.jpg` (MTG Wiki) | 1505×974 | oficjalna, WotC (fair use na wiki); za mała na podkład T1, dobra jako referencja kanonu |
| M3 | Tapeta „The Lands and Domains of Dominaria" (magic.wizards.com, DAR) | 2560×1600 | oficjalna, z ramą, kartuszem i różą wiatrów; obejrzana w v1; alternatywa „100% official" kosztem rozdzielczości i pikseli zjadanych przez dekoracje |
| M4 | `Dominaria2.jpg`, `Dominaria3.jpg`, `Dominaria.jpg` | 800×411 | za małe, odrzucone |
| M5 | Rendery globusa (m.in. Terisiare on Globe 850×801, Invasion Plans) | ~850 px | ciekawostki epokowe, nie podkład |

**Faworyt: M1.** Dwukrotność rozdzielczości wszystkiego innego,
geometria kanoniczna (Blando), żywy autor.

### 1.2. Aerona / Domains (podmapa)

| # | Plik | Rozmiar | Status |
|---|---|---|---|
| D1 | `The Domains by Varghedin.jpg` (MTG Wiki) | **2767×2155**, 1,58 MB | ten sam autor co M1 (spójność stylu), pochodna Blando, self-provided; direct URL: `https://files.mtg.wiki/The_Domains_by_Varghedin.jpg` |
| D2 | `Domains 2018 map.jpg` (MTG Wiki) | 811×1250 | **oficjalna** (z kolumny Fleischera; wg opisu pierwotny obraz mapy z kalendarza), WotC; używana na 38 stronach wiki (Benalia, Aerona, Keld, Llanowar…); za mała na podkład, wzorzec kanonu |
| D3 | `Calendar 1997 map.jpg` | 1600×2809 | oficjalna, art Tom Wänerstrand; poprzedniczka D2; skan |
| D4 | `Aerona TopDeck June 2000.JPG` (TopDeck #7, wariant „Conquer Dominaria") | 2000×2818 | oficjalna, ta sama baza Wänerstranda co D3, 27 stron wiki; **skan ze szwem** (uwaga autora skanu z 2026-02: usuwanie szwu psuje spasowanie granic) |
| D5 | `Aerona.jpg`, `North/South Aerona(.jpg)`, mapy Varghedina N/S Aerony | ≤1069 px | za małe / wycinkowe; referencje |

**Faworyt: D1** (nowość względem v1, które rozważało kadr z M1 albo
D2). Dedykowana mapa Domains w dużej rozdzielczości, od autora mapy
świata — brak problemu spasowania stylów między mapą a podmapą.
D2/D3/D4 jako potrójna kontrola kanoniczna nazw.

### 1.3. Benalia z bliska (zoom tematyczny — referencja, nie podkład)

| # | Plik | Rozmiar | Status |
|---|---|---|---|
| B1 | `Benalia by Varghedin.jpg` | 1045×1637 | zoom Benalii, ten sam autor; strony Benalia i Tarmula; za mały na podkład T1, świetny do osadzenia pinezki 40USG |
| B2 | `Magic Legends Benalia.jpg` | 1900×1069 | grafika ze skasowanej gry *Magic: Legends* (WotC) — **vista, nie kartografia**; klimat, nie geometria |
| B3 | `Avenant and Benalia.jpg` | 524×572 | za mała |

### 1.4. Rząd T2 (gotowy wektor): nie istnieje publicznie

Fleischer konwersję do wektora opisuje wprost (cytat zweryfikowany
w artykule): „My image now had high enough contrast and was clean
enough to convert to a vector format, which would make it easy to scale
and use for various purposes" — ale był to **wewnętrzny krok roboczy**
przed zleceniem ilustracji Blandowi, nigdy nieopublikowany.
W kategorii 91 plików nie ma żadnego SVG ani innego wektora.
**T2 odpada z braku dostępu** (jak w v1); awans wg ADR 0038 §5,
gdyby wektor wypłynął. Ciekawostka: Blando sprzedaje printy mapy
(originalmagicart.store) — istnieje więc wysokorozdzielczy oryginał
oficjalny, ale komercyjnie, nie licencyjnie do użycia.

### 1.5. Rezerwa kontynentalna (przyszłe karty — materiał już czeka)

- **Jamuraa:** Varghedin **8178×5575** (drugi gigant; ten sam autor),
  `Jamuraa 2018.jpg` 1304×850, stare mapy NE/NW.
- **Terisiare:** `MapTerisiare Brothers' War.jpg` 1428×908 (oficjalna,
  epokowa!), `Terisiare 1999 Urza's Saga Calendar.jpg` **3786×1600**,
  Varghedin 1460×922, Fleischer 2018 1250×796, `Terisiare2.jpg`
  1560×1065, detale 1–3, mapa Ice Age (Duelist #5), „potato map" 1994
  (pierwsza mapa MtG w ogóle). Cztery wersje czasowe Fleischera
  istnieją w publikacjach — podmapa epokowa „na żądanie karty" ma
  z czego powstać.
- **Otaria:** Varghedin 888×1798, `Otaria.jpg` 980×1748, mapa z powieści
  *Odyssey* (surowa, „potato" Otarii), `Otaria 2018.jpg`.
- **Drobne regiony Varghedina** (spójna rodzina): Llanowar 1226×1376,
  Sarpadia, Shiv, Zhalfir, Caliman, Corondor, Icehaven, N/S Aerona,
  Burning Isles, Orvada, Thran Empire.
- **Inne oficjalne:** `Corondor.png` 1444×1080, `Cridhe.jpg` 1219×850,
  `Madara.jpg` 910×500, `Tamingazin.jpg` 1418×872, `Tomakul.jpg`
  1553×1216, `Vosok.jpg` 2000×636, mapy Zhalfirin Void.

## 2. Ogląd (ADR 0038 §4: research → ogląd → decyzja)

Obejrzane: oficjalna mapa świata Blando (print 1600 px) oraz oficjalna
mapa Domains (styl Wänerstrand/2018).

- **Świat:** pełny glob w Mercatorze, kartusz „The Lands and Domains of
  Dominaria", róża wiatrów, sygnatura BLANDO. Aerona na zachodzie;
  Benalia to drobny napis na jej zachodnim wybrzeżu — **potwierdzone
  wizualnie: pinezka 40USG na mapie świata byłaby technicznie poprawna
  i praktycznie bezużyteczna** (argument v1 za podmapą utrzymany).
- **Domains:** czytelne regiony — Keld, Whispering Woods, Wrenna,
  Muronia, Benalia, Llanowar, Hurloon, Sursi, Kush, Argive (?),
  Verdura, Voda Sea, Sea of Whales, Spice Isles… Miast na obejrzanej
  miniaturze nie dało się odczytać → **czy Benalia City jest oznaczona
  na D1/D2, trzeba sprawdzić na pełnym pliku przy materializacji**
  (decyduje o kotwicy i o suficie pewności pinezki, §5).
- **Styl:** rodzina Blando→Varghedin jest spójna (Varghedin dorysowuje
  toponimię na kanonicznej geometrii, nie rysuje od nowa); M1+D1 dadzą
  jednolity atlas. Miniatury Varghedina (Llanowar) potwierdzają tę samą
  rękę.

## 3. Licencje i pozyskanie

- **Varghedin (M1, D1, B1, rodzina):** kategoria „Fan maps", licencja
  **self-provided** — autor sam wgrał pliki na wiki, pochodne jawnie
  oznaczone jako „Derived from Blando". Projekt jest prywatny, a rastry
  fanowskie są pełnoprawnym źródłem (ADR 0031, ADR 0038 §3).
  Precedens w repo: podkład T1 Innistradu (fan, r/mtgvorthos) i T3 Alary
  (fanowskie, deviantart/reddit) — dostarczone przez właściciela,
  z atrybucją w `map.json`.
- **Materiały WotC (M2, M3, D2, D3, D4):** na wiki na zasadzie fair use;
  w prywatnym Kodeksie z atrybucją — ryzyko minimalne, a wybór M1/D1
  i tak spycha je do roli referencji.
- **Pozyskanie:** jak przy Innistradzie — **właściciel pobiera
  i dostarcza pliki** (direct URL-e w §1.1–1.2), agent nie hotlinkuje.
- **Ciężar w repo:** M1 to 9,65 MB — **w precedensie** (Tarkir trzyma
  `podklad-t1.jpg` 11,6 MB). Opcja: rekompresja przy dostawie;
  decyzja właściciela.

## 4. Epoka (ADR 0033)

Mapa Blando/Varghedina pokazuje stan **~4205 AR** (współczesny,
po Naprawie). Dla pinezki Expunge to stan poprawny:

- karta nie znaczy epoki (brak flavoru; blok USG miesza Wojną Braci
  na Terisiare z vignettami współczesnymi);
- scena benalijska — złoty rycerz kapashencki, katedra, tarcza
  słoneczna — nie zawiera znaczników epoki; Benalia i geografia Aerony
  są stabilne od Ice Age;
- czarna mgła „ścierająca z pamięci" pasuje do mechaniki
  (niszczenie nie-czarnego stwora), a lokacyjnie nie przesądza niczego.

Obowiązkowa zmienność do odnotowania przy kotwicach świata (v1, nadal
aktualne): **Terisiare** (kontynent → archipelag; cztery wersje
czasowe), **Argoth** (zniszczony w Wojnie Braci), **Zhalfir** (phasing),
**Yavimaya** (dryf ku Aeronie). Materiał na podmapy epokowe istnieje
(§1.5) — powstaną „na żądanie karty", nie na zapas.

## 5. Rekomendacja: co bym wybrał

1. **`maps/dominaria/` — T1, M1 (Varghedin 8100×5200).** Kotwice:
   kontynenty, oceany, morza, większe wyspy (~20–30) — **każda
   z proweniencją jednostkową** (lekcja F5 z audytu PR-23: u Varghedina
   toponimii jest mnóstwo, bierzemy tylko miejsca poświadczone
   w przewodnikach; reszta czeka na karty z regionów).
2. **`maps/dominaria/aerona/` — T1, D1 (Varghedin Domains 2767×2155).**
   Kotwice: Benalia, Llanowar, Keld, Hurloon, Sursi, Ironclaw
   Mountains, Whispering Woods, Verdura, Shanodin, Foriys, Avenant,
   Kush, Wrenna, Muronia, Voda Sea, Sea of Whales, Spice Isles…
   **Tu trafia pinezka 40USG**, na Benalię (docelowo Benalia City,
   jeśli oznaczona na D1). **Sufit pewności: `region`** — katedra
   z dziedzińcem nie jest oznaczona na żadnej mapie; `dokladna`
   odpada z definicji.
3. **Referencje przy materializacji:** B1 (zoom Benalii do osadzenia
   pinezki), D2 (wzorzec kanonu nazw), D3/D4 (stare nazwy, ostrożnie —
   skan ze szwem), *Plane Shift: Dominaria* (opis Domains).
4. **Obie mapy powstają w dostawie karty 40USG** — nie „kiedyś"
   (jak postulowało v1).

Czego świadomie NIE wybrałem: M2 (za mała), M3 (rama i dekoracje
zjadają piksele; rezerwa „100% official"), B2 (vista z gry, nie mapa),
osobnej podmapy Benalii na start (B1 za mały na podkład; sensowna
dopiero przy kartach „ulicznych"), kadru z M1 zamiast D1 (D1 ma lepszą
rozdzielczość efektywną i własną toponimię), T3/T4 (marnotrawstwo przy
takim materiale — ADR 0038 §2).

## 6. Pytania otwarte do materializacji karty 40USG

1. Czy D1 oznacza Benalia City? (pełny plik; decyduje o kotwicy i kotwicy pinezki)
2. Która katedra w Benalii? (przewodniki tekstowe; wpływa na notkę pinezki)
3. Epoka sceny — inwazja Phyrexian (~4205 AR) czy starsza czarna magia? (tylko narracja karty; mapa niewzruszona)
4. M1 w całości (9,65 MB) czy po rekompresji? (decyzja właściciela przy dostawie rastra)
5. Zakres kotwic świata — propozycja ~20–30; gęściej dopiero z kartami (F5).

## 7. Źródła

- Karta: Expunge (USG) — Scryfall API (`/cards/named?exact=expunge&set=usg`):
  common, {2}{B}, Moeller, bez flavoru, nr kol. 135:
  https://scryfall.com/card/usg/135/expunge
- Dominarian Cartography (Ethan Fleischer, 2018) — geneologia mapy,
  globus Ventersa, Terisiare w 4 wersjach, wektor jako materiał
  wewnętrzny: https://magic.wizards.com/en/news/feature/dominarian-cartography-2018-04-20
- Category:Maps of Dominaria (91 plików z wymiarami):
  https://mtg.wiki/page/Category:Maps_of_Dominaria
- File:Dominaria by Varghedin.jpg (M1, 8100×5200):
  https://mtg.wiki/page/File:Dominaria_by_Varghedin.jpg
- File:The Domains by Varghedin.jpg (D1, 2767×2155):
  https://mtg.wiki/page/File:The_Domains_by_Varghedin.jpg
- File:Benalia by Varghedin.jpg (B1, 1045×1637):
  https://mtg.wiki/page/File:Benalia_by_Varghedin.jpg
- File:Domains 2018 map.jpg (D2, oficjalna 811×1250):
  https://mtg.wiki/page/File:Domains_2018_map.jpg
- File:Aerona TopDeck June 2000.JPG (D4, 2000×2818, skan ze szwem):
  https://mtg.wiki/page/File:Aerona_TopDeck_June_2000.JPG
- File:Map of Dominaria 2018 Blando.jpg (M2, 1505×974):
  https://mtg.wiki/page/File:Map_of_Dominaria_2018_Blando.jpg
- Plane Shift: Dominaria (James Wyatt, 2018) — opis Domains:
  https://media.wizards.com/2018/downloads/magic/Plane_Shift_Dominaria.pdf
- The Domains — MTG Wiki: https://mtg.wiki/page/The_Domains
- Terisiare — MTG Wiki (rozpad kontynentu):
  https://mtg.wiki/page/Terisiare
- Blando sprzedaje printy mapy (dowód istnienia wysokorozdzielczego
  oryginału oficjalnego): https://www.originalmagicart.store/collections/dominaria/jared-blando
