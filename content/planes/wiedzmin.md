---
typ: plan
slug: wiedzmin
tytul: Wiedźmin
typIP: zewnetrzne
mapa: wiedzmin
materializacja: 2026-09-11
tagi: [geografia]
---

**Wiedźmin** (uniwersum wykreowane przez Andrzeja Sapkowskiego w Sadze o
wiedźminie Geralcie z Rivii i spopularyzowane na całym świecie przez
serię gier studia CD Projekt RED) w Kodeksie to plan franczyzy
zewnętrznej. Świat ten dołącza do bazy nie przez oficjalny crossover,
lecz na drodze **transpozycji** (ADR 0026): właściciel osadza mechaniczne
rytuały i zaklęcia Magic: The Gathering w scenach jego kanonu. `19_8ED
Twiddle` przenosi błękitną sztukę manipulacji stanem przedmiotów do
zacisza akademii czarodziejek w **Aretuzie** na wyspie Thanedd, gdzie
precyzyjny ruch astrolabium i gaszenie płomienia świecy decydują o
powodzeniu wielkich zaklęć. `555DSK Bedhead Beastie` prowadzi w przeciwną
stronę Kontynentu: do opuszczonej wskutek wojny chaty na bagnach **Velen**,
gdzie ludowa opowieść o beboku spod łóżka staje się cielesnym zagrożeniem.

## Setting w pigułce

Miejscem wydarzeń jest bezimienny **Kontynent**, którego zachodnie
i północne wybrzeża zajmują **Królestwa Północy** (kraje Nordlingów:
feudalna **Temeria**, potężna rolniczo **Redania**, górski **Kaedwen**,
podzielone **Aedirn**, wyspiarskie **Skellige**, morskie **Cidaris**
oraz bogaty **Kovir i Poviss**). Od południa, zza rzeki Jarugi i pasma
gór Amell, napiera bezwzględne, ekspansywne **Cesarstwo Nilfgaardu**.
To świat ukształtowany przez pradawną **Koniunkcję Sfer** — kataklizm,
który sprowadził do świata ludzi, nieludzi (elfy Aen Seidhe, krasnoludy
z Mahakamu, niziołki, gnomy) oraz krwiożercze potwory. By chronić ludzkie
osady przed bestiami, stworzono cech zmutowanych zabójców potworów —
**wiedźminów**.

## Magia, Kapituła i Akademia w Aretuzie

Magia w świecie Wiedźmina nie jest prostą sztuczką, lecz niebezpieczną
Mocą czerpaną z czterech żywiołów (Pierwotnych Sił Chaosu). Wymaga
żelaznej dyscypliny mentalnej, opanowania somatycznych gestów
i rygorystycznego wykształcenia. Głównym ośrodkiem kształcenia adeptek
magii jest **Aretuza** — elitarna akademia żeńska założona przez Klarę
Larissę de Winter na wyspie **Thanedd**, nieopodal portowego miasta
**Gors Velen** w Temerii. 

Wyspa Thanedd to potężny, skalny ziggurat wyrastający z Morza Wielkiego
(Zatoki Praksedy), połączony ze stałym lądem ufortyfikowaną groblą. Na
jej poziomach wznoszą się pałac **Loxia**, centralny pałac **Garstang**
(miejsce zjazdów Kapituły i Arcymistrzów) oraz zwieńczona iglicą Mewa —
wieża **Tor Lara** skrywająca niestabilny portal. W cichych, mrocznych
komnatach Aretuzy czarodziejki studiują nie tylko wielkie inkantacje
żywiołów, lecz przede wszystkim precyzyjną mechanikę splotów —
przestawianie trybów astrolabiów, kalibrację sfer niebieskich i drobne
ryty manipulacji energią, które zmieniają czas rzucenia zaklęcia
i przesądzają o wyniku wojen królów.

## Velen — wojna, mokradła i potwory

**Velen**, północna prowincja Temerii, w czasie III Wojny Północnej staje
się Ziemią Niczyją między siłami Redanii i Nilfgaardu. Podmokła kraina jest
pełna pobojowisk, porzuconych osad, uchodźców, dezerterów i potworów, które
przejmują miejsca opuszczone przez ludzi. Redańskie posterunki, patrole i
transporty działają zwłaszcza na północnym pograniczu oraz przy przeprawach
przez Pontar, ale wojskowa obecność nie przywraca bezpieczeństwa bagnom poza
głównymi traktami.

W scenie [[555dsk-bedhead-beastie|**Bedhead Beastie**]] kolosalna, futrzasta
i rogata bestia urządza leże w ruinie chaty. Szczątki łóżka oraz siennika
zaklinowały się na jej łbie, jakby stworzenie próbowało wykonać ludową
instrukcję, według której potwory chowają się pod posłaniem. Wiejska nazwa
„bebok” określa funkcję straszydła, nie pewny gatunek. Rozmiar, rogi i
mokradłowe siedlisko pozwalają porównać je z biesem, lecz brak rozpoznania
wiedźmińskiego i charakterystycznego trzeciego oka nie pozwala tych stworzeń
utożsamić.

## Mapa

`maps/wiedzmin/` — wariant **T1 (rastr z etykietami)**: podkładem jest
reprezentacyjna **Mapa Orteliusa** (stworzona przez Ortelius Team pod
kierunkiem Dawida „Torpedy” Giełdona i społeczność fanowską forum CD
Projekt RED), obejmująca cały Kontynent od mroźnego Naroku i Smoczych
Gór na północy po Nilfgaard i Vicovaro na południu. Podkład dostarczył
właściciel w wysokiej rozdzielczości (5093×7209 px po usunięciu
zewnętrznej ramki ozdobnej).

Zgodnie z procedurą LOD (ADR 0039): mapa ładuje się jako lekki obraz
przeglądowy (`l0.jpg`, 1920×2718), a przy zbliżeniu (od progu zoomu 2.5)
dynamicznie dociąga siatkę **150 kafelków L1** w pełnej rozdzielczości
(10×15 po 512 px). Raster posiada komplet oryginalnych toponimów,
dlatego silnik Codexu nie nakłada na niego sztucznych etykiet
(`etykiety: false`), renderując wyłącznie interaktywne pinezki.

Pinezki na mapie (ADR 0043: tylko karty):

- **[[19-8ed-twiddle|Twiddle]]** (19_8ED); wyspa **Thanedd** (Aretuza /
  Tor Lara w Zatoce Praksedy przy Gors Velen w Temerii), pewność
  `dokladna` — komnata akademii czarodziejek w Aretuzie.
- **[[555dsk-bedhead-beastie|Bedhead Beastie]]** (555DSK); **Velen /
  Ziemia Niczyja**, pewność `region` — opowieść wskazuje bagna Velen, ale
  nie nazywa wsi, chaty, mokradła ani redańskiego posterunku. Znacznik
  korzysta z regionalnej kotwicy między Wrońcami a Gors Velen.

## Źródła

- Andrzej Sapkowski, *Czas pogardy* (SuperNOWA, 1995) — kanoniczny opis
  wyspy Thanedd, architektury pałaców Aretuzy, Garstang i Loxii oraz
  przebiegu zjazdu czarodziejów.
- Andrzej Sapkowski, *Krew elfów* (SuperNOWA, 1994) — natura magii jako
  Mocy i Chaosu, struktura Kapituły i Bractwa Czarodziejów.
- Witcher Wiki, *Aretuza* — historia akademii, rektorat Tissai de Vries
  i Margarity Laux-Antille, struktura gmachu:
  https://witcher.fandom.com/wiki/Aretuza
- Witcher Wiki, *Thanedd Island* — topografia wyspy, Tor Lara, grobla do
  Gors Velen:
  https://witcher.fandom.com/wiki/Thanedd_Island
- Wiedźmin Wiki, *Velen (ziemia niczyja)* — podmokła północna prowincja
  Temerii, zniszczenia III Wojny Północnej oraz położenie między Redanią i
  Nilfgaardem:
  https://wiedzmin.fandom.com/wiki/Velen_(ziemia_niczyja)
- Witcher Wiki, *Fiend* — bies jako ogromny, rogaty relikt bagien i moczarów;
  trzecie oko jako granica ostrożnego porównania:
  https://witcher.fandom.com/wiki/Fiend
- Pismo Folkowe, *Bobo, macek, bizia bizia* — bobo/bobok/bebok jako ludowe
  straszydło używane do straszenia dzieci:
  https://pismofolkowe.pl/artykul/bobo-macek-bizia-bizia-4574
- Ortelius Team, *Mapa Orteliusa* — opracowanie kartograficzne Kontynentu:
  https://caalek.github.io/mapa-orteliusa/
