# Research mapowy: Dominaria — wybór wariantu (MA1)

Data: 2026-09-08 · sesja PR-23 · drabina wg [ADR 0038](../../docs/decisions/0038-drabina-preferencji-wariantow-map-t2-t1-t3-t4.md)

## Wniosek w jednym zdaniu

**Rekomendacja: T1 na mapie ŚWIATA** (raster Varghedina 8100×5200,
pochodna oficjalnej mapy Jareda Blando), a docelowo **podmapa
`dominaria/aerona`** dla scen rozgrywających się w Benalii — bo karta
40USG dzieje się na dziedzińcu katedry, a na mapie świata Benalia to
napis wielkości paznokcia.

Dominaria jest odwrotnością Innistradu: tam nie było **żadnej**
oficjalnej mapy, tu jest ich kilkadziesiąt.

## Rząd 1 — T2 (gotowa geometria wektorowa): teoretycznie istnieje

To najbardziej frustrujące ustalenie researchu. Ethan Fleischer opisuje
wprost, że w trakcie prac nad mapą 2018 **skonwertował obraz do formatu
wektorowego**: „My image now had high enough contrast and was clean
enough to convert to a vector format, which would make it easy to scale
and use for various purposes." Ten wektor jest jednak wewnętrznym
materiałem roboczym WotC — nigdy nie został opublikowany. Publicznie
dostępne są wyłącznie rastry.

Wniosek: T2 **odpada z braku dostępu**, nie z braku istnienia. Gdyby
kiedyś wypłynął plik wektorowy Fleischera, plan kwalifikowałby się do
awansu (ADR 0038 §5).

## Rząd 2 — T1 (wyśmienity raster): DOSTĘPNY, i to w kilku wariantach

W przeciwieństwie do Innistradu, WotC **wydał** oficjalną mapę
Dominarii. Historia jej powstania jest udokumentowana w kolumnie
*Dominarian Cartography* (2018): Pete Venters w latach 90. ręcznie
pomalował fizyczny globus (zdarta winylowa powłoka, biały lakier
samochodowy, kontynenty tuszem, granice płyt tektonicznych na żółto),
Nick Bartoletti sfotografował go z dziesiątek kątów, a Fleischer
rozwinął zdjęcia oprogramowaniem NASA w odwzorowanie plate carrée,
potem przeliczył na Mercatora. Finalną ilustrację wykonał **Jared
Blando**.

Kandydaci rastrowi, uszeregowani:

| # | Plik | Rozmiar | Charakter |
|---|---|---|---|
| 1 | `Dominaria_by_Varghedin.jpg` (MTG Wiki) | **8100×5200** | fan-mapa **pochodna oficjalnej mapy Blando**, aktualizowana (ost. 2026-02, „Update to Tamingazin"); najwięcej toponimii |
| 2 | Tapeta DAR (magic.wizards.com) | 2560×1600 | oficjalna, pełna mapa świata z ramką i różą wiatrów; obejrzana |
| 3 | `Map_of_Dominaria_2018_Blando.jpg` | 1505×974 | oficjalny skan, za mały na podkład |
| 4 | `Domains_2018_map.jpg` | 811×1250 | **mapa samej Aerony i Domains** — za mała, ale kanoniczna |
| 5 | `Jamuraa_by_Varghedin.jpg` | 8178×5575 | ten sam autor, kontynent Jamuraa |
| 6 | `Calendar_1997_map.jpg` | 1600×2809 | historyczna mapa Domains z kalendarza |

**Rekomendowany: #1.** Rozdzielczość 8100×5200 przewyższa wszystko inne
dwukrotnie, mapa jest pochodną kanonicznej geometrii Blando, a autor
utrzymuje ją na bieżąco. Formalnie to fan-mapa (kategoria „Fan maps"
na MTG Wiki, licencja „self-provided" — wgrana przez samego autora),
ale jej geometria **jest** oficjalna.

Zastrzeżenie: gdyby właściciel wolał materiał w 100% oficjalny kosztem
rozdzielczości, kandydatem jest #2 (2560×1600) — dokładnie ta mapa,
którą oglądałem: „The Lands and Domains of Dominaria", ilustracja Jared
Blando, z kompasem i kartuszami.

## Rząd 3 i 4: bezprzedmiotowe

Materiał rastrowy jest oficjalny i doskonały. Rekonstrukcja byłaby
marnotrawstwem (ADR 0038 §2).

## Problem skali — i dlaczego proponuję podmapę

Tu jest sedno sprawy. Dominaria to **cały glob**: Northland, Aerona,
Spice Isles, Burning Isles, Corondor, Jamuraa (supekontynent), Shiv,
Otaria, Terisiare, Sarpadia, Caliman, Madara, Frozen Reaches. Rabiah
Scale = 1, czyli plan „najbardziej normalny" i najlepiej opisany
w całym multiwersum. Na mapie świata **Benalia to jeden mały napis na
zachodnim wybrzeżu Aerony**.

Karta 40USG rozgrywa się „na kamiennym dziedzińcu katedry w Benalii".
Pinezka na mapie świata byłaby technicznie poprawna i praktycznie
bezużyteczna — jak zaznaczanie kościoła Mariackiego na mapie Eurazji.

ADR 0032 dał już Kodeksowi mechanizm na dokładnie ten przypadek:
**podmapy** `maps/<plan>/<podmapa>/map.json`, adresowane przez
`pinezka.mapa: dominaria/aerona`. Zbudowano go dla Final Fantasy, ale
pasuje tu idealnie — z tą różnicą, że tam światy nie miały relacji
przestrzennych, a tu Aerona jest po prostu **przybliżeniem** wycinka
globu.

Proponowany układ dwustopniowy:

1. `maps/dominaria/` — **T1, mapa świata** (raster Varghedina).
   Kotwice: kontynenty, oceany, morza. Pinezki kart, których scena
   dotyczy całego planu albo regionu bez własnej podmapy.
2. `maps/dominaria/aerona/` — **T1, podmapa kontynentu**. Kandydat
   podkładu: kadr z rastra 8100×5200 (Aerona zajmuje w nim lewy górny
   kwadrant, więc wycinek ma nadal kilka tysięcy pikseli) albo
   `Domains_2018_map.jpg`. Kotwice: Benalia City, Llanowar, Keld,
   Hurloon, Ironclaw Mountains, Sursi, Whispering Woods, Verdura,
   Shanodin, Foriys, Avenant, Spice Isles, Voda Sea. **Tu trafia
   pinezka 40USG.**

Podmapa Aerony powstaje w tej samej dostawie co karta — nie „kiedyś".

## Problem epoki (ADR 0033) — poważniejszy niż na Innistradzie

Dominaria ma **jawnie zmienną geografię**, i to nie w detalach:

- **Terisiare** było jednym kontynentem, a po Ice Age i Powodzi
  rozpadło się na pięć wysp. Fleischer opisuje, że mapa Terisiare
  istniała w **czterech wersjach czasowych** (Antiquities/Brothers'
  War, Ice Age, Alliances, współczesna).
- **Argoth** został zniszczony w Wojnie Braci.
- **Zhalfir** zniknęło z planu przez phasing (widać to na mapach
  inwazyjnych: „Zhalfir is already missing").
- **Yavimaya** przemieściła się ku Aeronie podczas inwazji.

Mapa Blando/Varghedina pokazuje stan **4205 AR** — czasy współczesne,
po Naprawie. Karta 40USG pochodzi z *Urza's Saga* (1998), której akcja
dzieje się grubo wcześniej, ale **scena z dostawy właściciela dotyczy
Benalii**, a Benalia i Aerona są przez te epoki stabilne. Rekomendacja:
jedna mapa stanu współczesnego (ADR 0033), z notkami przy kotwicach,
których dotyczą zmiany (Terisiare, Argoth, Zhalfir). Gdyby przyszła
karta ze sceną na Terisiare w czasie Wojny Braci, dostanie osobną
podmapę epoki — materiał źródłowy istnieje.

## Źródła

- Dominarian Cartography (Ethan Fleischer, 2018) — historia powstania mapy: globus Ventersa, fotogrametria, plate carrée → Mercator, konwersja do wektora, ilustracja Blando: https://magic.wizards.com/en/news/feature/dominarian-cartography-2018-04-20
- Dominaria (plane) — MTG Wiki: lista kontynentów i mórz, galeria map, Rabiah Scale 1: https://mtg.wiki/page/Dominaria_(plane)
- Category:Maps of Dominaria — MTG Wiki: 91 plików map z wymiarami (inwentarz kandydatów): https://mtg.wiki/page/Category:Maps_of_Dominaria
- File:Dominaria by Varghedin.jpg — 8100×5200, fan-mapa pochodna od mapy Blando, self-provided: https://mtg.wiki/page/File:Dominaria_by_Varghedin.jpg
- File:Domains 2018 map.jpg — 811×1250, mapa Aerony i Domains z kolumny Dominarian Cartography: https://mtg.wiki/page/File:Domains_2018_map.jpg
- Plane Shift: Dominaria (James Wyatt, 2018) — opis Domains: podział Aerony, Benalia, Llanowar, Ironclaw, Hurloon, Keld/Icehaven, Spice Isles, Vodalia: https://media.wizards.com/2018/downloads/magic/Plane_Shift_Dominaria.pdf
- The Domains — MTG Wiki: skład regionu, morza, mapy: https://mtg.fandom.com/wiki/The_Domains
- Terisiare — MTG Wiki: rozpad kontynentu, geografia współczesna vs. dawna: https://mtg.wiki/page/Terisiare
