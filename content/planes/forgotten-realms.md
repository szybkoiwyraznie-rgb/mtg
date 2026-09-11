---
typ: plan
slug: forgotten-realms
tytul: Zapomniane Krainy
typIP: zewnetrzne
mapa: forgotten-realms
materializacja: 2026-09-08
tagi: [geografia]
---

**Zapomniane Krainy** (*ang. Forgotten Realms*) w Kodeksie to plan
franczyzy zewnętrznej — tak jak Final Fantasy: świat, który nie należy
do Magic: The Gathering, lecz do **Dungeons & Dragons** (TSR, od 1990
WotC). Do Kodeksu wchodzi przez crossover: set **CLB** (*Commander
Legends: Battle for Baldur's Gate*, 2022) sprowadza do kolekcji karty
wydane w tym świecie. Kodex przyjmuje setting w stanie **piątej
edycji** (1479–1492 DR) — erze, w której rozgrywa się oficjalna
współczesność settingu i w której dzieje się akcja CLB (Baldur's Gate
po Wojnie Hobgoblinów i Najazdzie Tiamat).

## Setting w pigułce

Światem jest **Abeir-Toril** — planeta podobna do Ziemi — a sercem
settingu **kontynent Faerûn**, jego zachodnia część. Faerûn żyje
w cieniu bóstw, które nie są odległe: mieszkają na Sferze Astralnej
i rządzą przez kapłanów, awatary i **Tkaninę Magii** — sieć czarów,
którą po **Czasie Kłopotów** (1358 DR) odtworzyła **Mystra** i od
której zależy cała magia kontynentu. Główni panowie settingu to
m.in. **Selûne** (księżyc i nawigatorzy), **Mystra** (maga),
**Lathander** (poranek i przeznaczenie), **Ilmater** (cierpienie
i pomoc) oraz **Tempus** (wojna). To świat ludzi: wielkie mocarstwa
epok dawnych (Netheril, Maztica) leżą w gruzach, a współczesna scena
skupia się na miastach-handlach **Wybrzeża Mieczy** — od lodów
Północy po pustkowie Amn na południu.

## Geografia

Mapa settingu pokrywa Faerûn w granicach oficjalnej mapy 3E
(różnice granic względem epoki 5e są kosmetyczne):

- **Wybrzeże Mieczy** — pas nadmorskich królestw
  i miast-handli wzdłuż zachodniego brzegu Faerûnu; serce
  współczesnego settingu i miejsce akcji CLB;
- **Morze Upadłych Gwiazd** — największy śródlądowy akwen Faerûnu,
  znany także jako **Inner Sea**; spina Cormyr, Sembię, Impiltur,
  Chessentę i południowe szlaki handlowe środka kontynentu;
- **Wyspy Moonshaes** — archipelag na zachód od Wybrzeża Mieczy,
  zimny i morski, od dawna związany z handlem i korsarstwem;
- **Wyspy Nelanther** — archipelag piratów na zachód od Amnu i
  Tethyru, przy podejściu ku południowym wodom zachodniego Faerûnu;
- **Amn** — bogate państwo kupieckie zachodniego Faerûnu, między
  Wybrzeżem Mieczy a Tethyrem, zwrócone ku Morzu Mieczy i szlakom
  kolonialnym;
- **Luruar** — konfederacja **Silver Marches** w północno-zachodnim
  Faerûnie, ze środkiem w Silverymoon, między High Forest,
  Evermoors i Spine of the World;
- **Wysoki Las** (*High Forest*) — olbrzymi, prastary masyw leśny
  w sercu północno-zachodniego Faerûnu; matecznik druidów, smokowców
  i wyznawców Dębowego Ojca ([[539clb-silvanus-s-invoker|Silvanus's Invoker]]);
- **Jezioro Pary** (*Lake of Steam*) — południowy akwen Faerûnu,
  oddzielający ziemie wokół Morza Upadłych Gwiazd od Shining South;
- **Królestwo Wysokie** (High Kingdom) — południowo-zachodni rejon
  podkładu skupiony wokół Calimportu i północnego brzegu
  **The Shining Sea**;
- **Morze Bezludne** — otwarta woda na zachód i południowy zachód
  od lądu Faerûnu; na tej mapie zamyka horyzont za Moonshaes i
  Wyspami Nelanther.

## Mapa

`maps/forgotten-realms/` — wariant **T1 (rastr)**: oficjalna mapa
Faerûn **3E** (Wizards of the Coast / TSR, 2001) — cała zachodnia
połowa kontynentu, z etykietami i ikonami miast nadrukowanymi na
podkładzie (decyzja właściciela 2026-09-08: „bezkonkurencyjna” w
porównaniu z kandydatami; badanie:
`maps/_warsztat/RESEARCH_2026-09-08-faerun-mapa-t1.md`).
Model ładowania jak w Dominarii (ADR 0039): **L0** — pomniejszona
całość (`l0.jpg`, 1920 px, pierwszy render), **L1** — kafelki
mastera w pełnej rozdzielczości (10×7 po 512 px) doładowywane od
progu przybliżenia 2.5. Master 4763×3185 (4,3 MB) żyje w repo,
poza dist; podkład dostarczył właściciel, atrybucja źródła w
stopce mapy (użytek prywatny, ADR 0031).

Raster 3E pozostaje tutaj **czystym podkładem**: nie dokładamy na nim
żadnych dodatkowych kropek, etykiet ani POI ponad to, co już niesie
oryginalny druk. Jeśli kiedyś pojawi się potrzeba osobnego zbliżenia
na ważne miejsce, będzie to osobny wariant lub podmapa konsultowana z
właścicielem, nie doraźna nakładka na tej stronie.

Pinezki na mapie (ADR 0043: tylko karty):

- **[[3clb-nefarious-imp|Nefarious Imp]]** (3clb); środek Wybrzeża
  Mieczy (pewność: rejon) — scena nie wymienia miasta, więc pinezka
  stoi na rejonie, nie na lokalu.
- **[[539clb-silvanus-s-invoker|Silvanus's Invoker]]** (539clb);
  ostępy Wysokiego Lasu (pewność: rejon) — smokowiec-druid wzywający
  żywiołaka ziemi i drewna w imię Silvanusa.

## Źródła

- Forgotten Realms Wiki (EN), *Forgotten Realms* — setting D&D,
  Faerûn, Abeir-Toril, Wybrzeże Mieczy jako serce settingu 5e,
  epoki (Czas Kłopotów, Spellplague, Drugie Osłabienie):
  https://forgottenrealms.fandom.com/wiki/Forgotten_Realms
- Forgotten Realms Wiki (PL), *Zapomniane Krainy* — polska nazwa
  settingu, Faerûn, Abeir-Toril:
  https://forgottenrealms.fandom.com/pl/wiki/Zapomniane_Krainy
- Forgotten Realms Wiki, *Sword Coast* — zachodni pas Faerûnu,
  Sea of Swords, główne miasta Wybrzeża:
  https://forgottenrealms.fandom.com/wiki/Sword_Coast
- Forgotten Realms Wiki, *Luruar* — Silver Marches, Silverymoon,
  położenie między High Forest, Evermoors i Spine of the World:
  https://forgottenrealms.fandom.com/wiki/Luruar
- Forgotten Realms Wiki, *Sea of Fallen Stars* — największy
  śródlądowy akwen Faerûnu, alias **Inner Sea**:
  https://forgottenrealms.fandom.com/wiki/Sea_of_Fallen_Stars
- Forgotten Realms Wiki, *Amn* — kupieckie państwo zachodniego
  Faerûnu, granice względem Tethyru i Sea of Swords:
  https://forgottenrealms.fandom.com/wiki/Amn
- Forgotten Realms Wiki, *Faerûn* — Lake of Steam jako granica
  między ziemiami środkowymi a południem kontynentu:
  https://forgottenrealms.fandom.com/wiki/Faer%C3%BBn
- Mapa - Faerun - 3E (WotC/TSR, 2001) — podkład mapy planu (T1);
  użytkowanie prywatne, atrybucja w stopce mapy:
  https://forgottenrealms.fandom.com/wiki/File:Map_-_Faerun_-_3E.jpg
- Scryfall, set CLB (*Commander Legends: Battle for Baldur's Gate*,
  2022-06-10) — karty crossoveru do kodexu:
  https://scryfall.com/sets/clb
