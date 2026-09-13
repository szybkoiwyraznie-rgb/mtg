---
typ: plan
slug: dominaria
tytul: Dominaria
typIP: plan-mtg
mapa: dominaria
materializacja: 2026-09-08
tagi: [geografia, wojna, phyrexia]
---

Dominaria to pierwszy i najważniejszy plan Magic: The Gathering —
świat, wokół którego obraca się większość historii multiwersum.
Tutaj urodził się Urza i tutaj toczył Wojnę Braci z Mishrą; tutaj
wezbrały fale Phyrexii, tutaj wreszcie Mending zaleczył rany czasu
za cenę mocy planeswalkerów. Dominaria płaci za swoją centralną rolę
ciągłymi katastrofami: każde pokolenie ma własny koniec świata, a mapa
planu to zapis tysiącleci wojen, upadków i odbudów.

## Setting w pigułce

Oś czasu Dominarii wyznaczają trzy wydarzenia. **Wojna Braci**
(ok. 20 AR) — konflikt dwóch braci-artificerów, zakończony wybuchem
w Argoth, Sylex Blast i epoką lodową. **Inwazja Phyrexii** (ok. 4205 AR,
blok *Urza's Saga* → *Apocalypse*) — wielka wojna, w której koalicja
planu pod wodzą Urzy odparła maszynowe piekło Yawgmotha kosztem
milionów istnień. **Mending** (ok. 4500 AR) — seria szczelin czasowych
po inwazji, zaleczona przez planeswalkerów za cenę ich boskiej mocy:
po nim żadna wola nie zginie czasu, a Dominaria wchodzi w erę, w której
mierzy ją kalendarz AR (po Mendingu) i spory planeswalkerów, nie bogowie.
Karta [[40usg-expunge|Expunge]] pochodzi z samego serca inwazji:
Benalia pod rządami koalicji, rycerstwo Serran walczy z czarną magią
wroga. [[110dvd-serra-s-embrace|Serra's Embrace]] dopowiada jaśniejszą
stronę tej samej tradycji: [[serra|Serra]] nie przychodzi po wodza, lecz
po zwykłego piechura, który w złotej godzinie na polu bitwy jeszcze stoi.
Z kolei [[362bro-simian-simulacrum|Simian Simulacrum]] ukazuje relikt
dawniejszej epoki: mechaniczny konstrukt w opuszczonym warsztacie lasu
Argoth, który nocami naprawia towarzysza, nie wiedząc o końcu Wojny Braci.
Epokę Lodowcową reprezentuje z kolei zwiadowczyni [[531m3c-disa-the-restless|Disa the Restless]],
która na zasypanych śniegiem pustkowiach [[terisiare|Terisiare]] tropi żerujące bestie
i ostrzega ludzkie królestwo Kjeldoru.

## Geografia

Dominaria to plan oceaniczny: lądy skupiają się w kilku kontynentach
wokół Wielkiego Oceanu.

**Aerona** (północny zachód) — kolebka fabuły pierwszej karty planu;
tu leżą rycerska **Benalia** ze stolicą Benalia City, wielki las
**Llanowar**, mroźna północna **Icehaven**, wyspa akademii
**Tolaria West** oraz wyspy mórz Voda i Honeyed Sea: **Kieve**,
**Ru-Nora**, **Saronia**, **Orvada** i **Burning Isles**. Południowe
[[sursi|Sursi]] z Katedrą Serran jest tu najważniejszym adresem pamięci
[[serra|Serry]]: błogosławiona ziemia, sanktuarium i źródło samorzutnie
pojawiających się aniołów. Serce kontynentu to lud **Wybranych**
(The Chosen) urodzonych pod **Pięcioma Edyktami** i splecenie korzeni
**Drzewa Świata** — **Tangle**, którego życiodajny sok karmił całą północ.

**Jamuraa** (południe) — tropikalny kontynent Zhalfiru, Suq'Aty,
lasu Yavimaya i Wielkiej Pustyni, nad Morzem Serenity. Na południu
wznosi się **Zhalfir**, kraina smoków, gdzie padła rozstrzygająca
bitwa Inwazji; oaza **Suq'At** jest sercem dżungli **Yavimaya**,
a przed nią rozlewa się **Wielka Pustynia**.

**Otaria** (wschód) — długi, wąski kontynent biegący wzdłuż osi
północ–południe; dom **Kabały** (Cabal), miasta umarłych: **Aphetto**,
**Cabal City** na słonych pustkowiach i Wielka Kolosea, równiny
**Daru**, druidzi **Krosy** i subkontynent **Tamingazin**; na
północy, poza kontynentem, archipelag **Shiv**.

**[[terisiare|Terisiare]]** (północny wschód) — dawny kontynent Wojny Braci,
Argothu i Epoki Lodowcowej. To tu Urza i Mishra spustoszyli stare królestwa,
a wybuch Syleksu na Argoth zapoczątkował katastrofę klimatu; później
zlodowaciały krajobraz stał się domeną Kjeldoru, Balduvii, Adarkar i kronik
Disy Niespokojnej. Współcześnie pozostałości kontynentu tworzą archipelag
Terisian Isles i wyspy New Argive.

**Sarpadia** (południowy wschód) — ruiny **Sarpadyjskich Imperiów**
(Icatia, Vodalia, Zakon Czarnej Ręki, elfy Havenwood), które upadły
w **Ciemnych Czasach** (ok. 170 AR); po upadku lądami włodarzą
**thrullowie** i **thalidzi**, a morzami **homaridi**.

Bieguny planu skrywają się pod czapami lodowymi: **Northland**
na północy i **Frozen Reaches** na południu.

## Mapa

`maps/dominaria/` — wariant **T1**: podkładem jest mapa fanowska
**Varghedina** (8100×5200, pochodna oficjalnej kartografii WotC —
linia Venters → Fleischer → Blando, 2018), dostarczona przez
właściciela (ADR 0031). Mapa działa jako piramida LOD (ADR 0039):
pierwszy render to obraz FHD (L0), a od progu zoomu 2.5 dołączają
**kafelki L1** (16×11 po 512 px z mastera) — deep-zoom bez skokowej
nakładki: master jest na tyle duży, że toponimia czytelnego detalu
jest w samej bazie (nakładki L2 z 2026-09-08 nie ma — decyzja
właściciela, ADR 0041). Pinezki: [[40usg-expunge|Expunge]] — Katedra
Serran na [[sursi|Równinach Sursi]] (pewność region); [[110dvd-serra-s-embrace|Serra's Embrace]]
— regionalny indeks łaski Serry przy [[sursi|Sursi/Katedrze]], bez udawania
konkretnego pola bitwy (pewność region); [[362bro-simian-simulacrum|Simian Simulacrum]]
— wyspa Argoth u wybrzeży [[terisiare|Terisiare]] (pewność region); [[531m3c-disa-the-restless|Disa the Restless]]
— północne [[terisiare|Terisiare]] / Kjeldor (pewność region).

## Źródła

- Plane Shift: Dominaria (James Wyatt, 2018) — opisy kontynentów,
  osi czasu (Wojna Braci, inwazja, Mending):
  https://media.wizards.com/2018/downloads/magic/Plane_Shift_Dominaria.pdf
- Dominarian Cartography (Ethan Fleischer, 2018) — geneologia mapy
  (globus Ventersa → fotogrametria → Mercator → ilustracja Blando):
  https://magic.wizards.com/en/news/feature/dominarian-cartography-2018-04-20
- MTG Wiki, hasła kontynentów — Aerona: https://mtg.wiki/page/Aerona ·
  Jamuraa: https://mtg.wiki/page/Jamuraa · Otaria:
  https://mtg.wiki/page/Otaria · Terisiare:
  https://mtg.wiki/page/Terisiare · Sarpadia:
  https://mtg.wiki/page/Sarpadia
- Wizards of the Coast, Planeswalker's Guide to Dominaria (2022) — New
  Argive jako część archipelagu Terisiare, Sylex Blast, Flood Age oraz
  współczesny opis Kościoła Serry i Sursi:
  https://magic.wizards.com/en/news/feature/planeswalkers-guide-dominaria-2022-08-31
- MTG Wiki, Serra / Church of Serra / Sursi / Cathedral of Serra —
  tradycja Serran na Dominarii, śmierć i błogosławieństwo Serry w Sursi,
  katedra i samorzutne pojawianie się aniołów:
  https://mtg.wiki/page/Serra · https://mtg.wiki/page/Church_of_Serra ·
  https://mtg.wiki/page/Sursi · https://mtg.wiki/page/Cathedral_of_Serra
- MTG Wiki, Fall of the Sarpadian Empires — upadek imperiów
  (Icatia, Vodalia, Czarne Ręce, Havenwood) w Ciemnych Czasach
  (ok. 170 AR), thrullowie/thalidzi, homaridi:
  https://mtg.wiki/page/Fall_of_the_Sarpadian_Empires
- Podkład mapy: Dominaria by Varghedin (fan-made, self-provided;
  geometria za oficjalną mapą WotC, Jared Blando 2018; użytek
  prywatny — ADR 0031):
  https://mtg.wiki/page/File:Dominaria_by_Varghedin.jpg
