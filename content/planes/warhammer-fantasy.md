---
typ: plan
slug: warhammer-fantasy
tytul: Warhammer Fantasy
typIP: zewnetrzne
mapa: warhammer-fantasy
materializacja: 2026-09-10
tagi: [geografia]
---

**Warhammer Fantasy** (Warhammer Fantasy Battles, dziś wznowione jako
**Warhammer: The Old World**) w Kodeksie to plan franczyzy zewnętrznej —
świat, który nie należy do Magic: The Gathering, lecz do **Games
Workshop** (od 1983). Do Kodeksu nie wchodzi przez oficjalny crossover
MtG (takiego nie ma), lecz przez **transpozycję**: właściciel osadza
karty Magic w tym settingu jako scenach jego kanonu. Pierwsza z nich —
`39MM2 Brute Force` — przenosi czerwony trik bojowy MtG w błoto pola
bitwy Starego Świata, gdzie surowa moc goblinoidów zastępuje strategię.

## Setting w pigułce

Światem jest planeta zwana w późnym kanonie **Mallus**, a sercem
settingu **Stary Świat** (*the Old World*) — kontynent w północno-
zachodniej części globu, kartograficznie i klimatycznie przypominający
średniowieczną Europę. To świat pod nieustanną presją: z północy
napiera **Chaos** (Pustkowia Chaosu, mroczni bogowie), ze wschodu przez
**Worlds Edge Mountains** przelewają się hordy zielonoskórych, a pod
ziemią knują skaveny i nieumarli. Główne mocarstwa ludzi to feudalne
**Imperium** (kraj Sigmara, luźna federacja prowincji jak Reikland,
Middenland, Stirland) i rycerska **Bretonnia** na zachodzie; obok nich
trwają odwieczne **Krasnoludy** w górskich Karakach, wysokie i mroczne
**Elfy** oraz jaszczuroludzie Lustrii. Magię niesie **Wiatr Chaosu**
przesączający się z Północy — ta sama moc, która daje czarnoksięstwo,
napędza też prymitywną wiarę zielonoskórych.

## Zielonoskórzy i Waaagh!

Bohaterami pierwszej sceny są **Zielonoskórzy** (*Greenskins*) —
zbiorcza nazwa **Orków i Goblinów** oraz pokrewnych goblinoidów. Nie
pochodzą z jednej krainy: żyją w dzikich zakątkach całego świata, lecz
ich sercem są **Badlands** (Ziemie Jałowe) na południe od Starego Świata
i wschodnie stoki **Worlds Edge Mountains**, przejęte od krasnoludów w
czasie Wojen Goblinów. Orkowie żyją wyłącznie dla walki i czczą dwóch
brutalnych bogów-braci, **Gorka i Morka** (przemoc sprytna i przemoc
brutalna). Ich religią i militarną machiną jest **Waaagh!** — narastająca
fala plemiennej migracji i wojny, w której psychiczna energia tysięcy
orków materializuje się jako **czerwona magia Waaagh!**, karmiona przez
szamanów i czyniąca wojowników dosłownie większymi i silniejszymi. To
kanon: dla zielonoskórego wiara w to, że *większy i głośniejszy zawsze
wygrywa*, jest samospełniającą się prawdą świata.

## Zwierzoludzie i Dzieci Chaosu

W głębi mrocznych, nieprzebytych puszcz Starego Świata — przede
wszystkim w **Wielkim Lesie** (*The Great Forest*) w sercu Imperium
oraz w lesie **Drakwald** — żyją **Zwierzoludzie** (*Beastmen*),
zwani Dziećmi Chaosu. Zrodzeni ze spaczenia dawnych er, nie znają
ludzkiego prawa ani miłosierdzia. Ich centrami kultu są wznoszone
w ostępach **Głazy Stada** (*Herdstones*), wokół których szamani
odprawiają krwawe rytuały. Najpotężniejszą formacją uderzeniową
stad są **Minotaury** (*Bullgors*): potężne bestie z toporami,
które po zwęszeniu krwi wpadają w morderczy szał. Karta
[[83mm2-gorehorn-minotaurs|Gorehorn Minotaurs]] ukazuje ich
niszczycielską szarżę przez bory Imperium.

## Mapa

`maps/warhammer-fantasy/` — wariant **T1 (rastr z etykietami)**:
podkładem jest oficjalna mapa *Warhammer: The Old World* (Games
Workshop, 2024), obejmująca cały Stary Świat od Pustkowi Chaosu na
północy po Krainę Umarłych na południu, z nazwami krain, herbami frakcji
i ikonami miast nadrukowanymi na podkładzie. Dostarczył ją właściciel
(ADR 0031), atrybucja źródła w stopce mapy (użytek prywatny).

Model ładowania jak w Dominarii (ADR 0039): master jest duży (8682×12737),
więc mapa działa jako piramida LOD — pierwszy render to pomniejszona
całość (`l0.jpg`, 1920 px), a od progu przybliżenia 2.5 dołączają
**kafelki L1** w pełnej rozdzielczości (17×25 po 512 px). Raster
pozostaje czystym podkładem: Codex nie dokłada na nim własnych napisów
(`etykiety: false`) — widać tylko pinezki kart.

Pinezki na mapie (ADR 0043: tylko karty):

- **[[39mm2-brute-force|Brute Force]]** (39MM2); środek **Badlands**
  (Ziemie Jałowe na południe od Starego Świata, ojcowizna
  zielonoskórych), pewność region — scena to bezimienne pole bitwy, nie
  konkretne miasto.
- **[[83mm2-gorehorn-minotaurs|Gorehorn Minotaurs]]** (83MM2); **The
  Great Forest** (Wielki Las w sercu Imperium), pewność region —
  szarża minotaurów Dzieci Chaosu przez ostępy puszczy.

## Źródła

- Warhammer Fantasy Wiki, *Greenskins* — Orkowie i Gobliny jako
  goblinoidy Mallus, brak jednej ojczyzny, Badlands jako serce, Waaagh!
  jako migracja-wojna, Wojny Goblinów i utrata Worlds Edge Mountains:
  https://warhammerfantasy.fandom.com/wiki/Greenskins
- Warhammer Fantasy Wiki, *Beastmen* oraz *Minotaur* — Dzieci Chaosu,
  Głazy Stada, anatomia i kultura minotaurów (Bullgors):
  https://warhammerfantasy.fandom.com/wiki/Beastmen
- Warhammer Fantasy Wiki, *Gork and Mork* — dwaj bogowie-bracia
  zielonoskórych (przemoc sprytna i brutalna):
  https://warhammerfantasy.fandom.com/wiki/Gork_and_Mork
- Lexicanum (WHFB), *Orc* — Badlands jako ojcowizna orków, życie dla
  walki, natura Waaagh!:
  https://whfb.lexicanum.com/wiki/Orc
- Bell of Lost Souls, *The Old World: Orc & Goblin Tribes* — kultura
  Waaagh!, Gork i Mork, plemienna struktura zielonoskórych:
  https://www.belloflostsouls.net/2024/10/warhammer-the-old-world-how-to-play-orc-goblin-tribes.html
- Warhammer Community / Games Workshop, mapa *Warhammer: The Old World*
  (2024) — kanoniczna geografia Starego Świata, kandydat na podkład T1:
  https://www.warhammer-community.com/
