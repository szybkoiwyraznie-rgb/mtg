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

- **Wybrzeże Mieczy** — pas nadmorskich królestw i miast-handli
  wzdłuż zachodniego brzegu; serce settingu, miejsce akcji CLB;
- **Morze Upadłych Gwiazd** — akwen w środku Faerûn, łączący
  Wybrzeże z Wysokimi Królestwami na południowym wschodzie;
- **Wyspy Moonshaes** — archipelag piratów i korsarzy na północnym
  zachodzie, u ujścia rzeki Moon;
- **Wyspy Nelanther** — łańcuch wysp u ujścia rzeki Nelanther,
  południowe wejście do Morza Upadłych Gwiazd;
- **Amn** — kraj miast-handli na południowym zachodzie, po
  zniszczeniach wojen odrodzony;
- **Luruar** — bagna i mokradła na południe od Amn, ziemia umarłych
  i starych przekleństw;
- **Morze Wewnętrzne** — duży akwen na południowym wschodzie,
  połączony cieśniną z Morzem Upadłych Gwiazd;
- **Królestwo Wysokie** (High Kingdom) — państwo na południowym
  wschodzie, nad Morzem Wewnętrznym;
- **Morze Bezludne** — pusta południowo-wschodnia woda, na której
  kończy się zasięg mapy.

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

Pod spodem rastrowych warstw leży **wektorowa warstwa POI**
(złote kółka, bez etykiet — nazwy niesie sam podkład): trzynaście
najważniejszych punktów odniesienia (miasta Wybrzeża Mieczy,
Silverymoon, Myth Drannor, Mulmaster, Helondeth, Mulhorand i huby
archipelagów) jako kotwice pod przyszłe pinezki kart (ADR 0043:
piny na mapach = tylko karty). Po doładowaniu kafli L1 kółka
pokrywa druk mastera.

Pinezki na mapie (ADR 0043: tylko karty):

- **[[3clb-nefarious-imp|Nefarious Imp]]** (3clb); środek Wybrzeża
  Mieczy (pewność: rejon) — scena nie wymienia miasta, więc pinezka
  stoi na rejonie, nie na lokalu.

## Źródła

- Forgotten Realms Wiki (EN), *Forgotten Realms* — setting D&D,
  Faerûn, Abeir-Toril, Wybrzeże Mieczy jako serce settingu 5e,
  epoki (Czas Kłopotów, Spellplague, Drugie Osłabienie):
  https://forgottenrealms.fandom.com/wiki/Forgotten_Realms
- Forgotten Realms Wiki (PL), *Zapomniane Krainy* — polska nazwa
  settingu, Faerûn, Abeir-Toril:
  https://forgottenrealms.fandom.com/pl/wiki/Zapomniane_Krainy
- Mapa - Faerun - 3E (WotC/TSR, 2001) — podkład mapy planu (T1);
  użytkowanie prywatne, atrybucja w stopce mapy:
  https://forgottenrealms.fandom.com/wiki/File:Map_-_Faerun_-_3E.jpg
- Scryfall, set CLB (*Commander Legends: Battle for Baldur's Gate*,
  2022-06-10) — karty crossoveru do kodexu:
  https://scryfall.com/sets/clb
