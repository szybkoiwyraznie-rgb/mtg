# Backlog (rozpoznanie, NIE kolejka zadań)

> Wpis w backlogu nie upoważnia sesji do pracy. Zadania przychodzą od
> właściciela albo z Pętli Jakości. Tu zapisujemy rozpoznanie, żeby nie
> robić go drugi raz. (Konwencja dziedziczona z mtg-game.)

## Kolejka link-miningu: encje czekające na drugą kartę (Śródziemie)

Hasło powstaje, gdy ≥2 karty odwołują się do encji w treści (zasada
właściciela 2026-08-31; SZKIELET_HASLA.md). Licznik wzmianek — karty
mówiące o encji **w treści** (nie samym tagiem):

| Encja | Klasa (docelowa) | Karty wspominające | Do hasła brakuje |
|---|---|---|---|
| crebain | fauna | 1ltr-dunland-crebain | 1 karta |
| dunland | geografia | 1ltr-dunland-crebain | 1 karta |
| isengard | geografia | 1ltr-dunland-crebain | 1 karta |
| Saruman | postac | 1ltr-dunland-crebain | 1 karta |
| Uruk-hai | spolecznosc | 1ltr-dunland-crebain | 1 karta |
| Biała Ręka | koncepcja | 1ltr-dunland-crebain | 1 karta |
| rohan | geografia | — (plan srodziemie wspomina) | licznik od kart, nie planów |

## Kolejka link-miningu: encje czekające na drugą kartę (Zendikar)

| Encja | Klasa (docelowa) | Karty wspominające | Do hasła brakuje |
|---|---|---|---|
| tazeem | geografia | 2bfz-coralhelm-guide | 1 karta |
| halimar | geografia | 2bfz-coralhelm-guide | 1 karta |
| coralhelm | geografia | 2bfz-coralhelm-guide | 1 karta |
| sea gate | geografia | 2bfz-coralhelm-guide, plan zendikar | licznik od kart, nie planów |
| Jori En | postac | 2bfz-coralhelm-guide | 1 karta |
| merfolk | spolecznosc | 2bfz-coralhelm-guide | 1 karta |
| Roil | koncepcja | 2bfz-coralhelm-guide, plan zendikar | licznik od kart, nie planów |
| Eldrazi | koncepcja | 2bfz-coralhelm-guide, plan zendikar | licznik od kart, nie planów |

## Kolejka link-miningu: encje czekające na drugą kartę (Ravnica)

Sesja PR-14 (2026-09-03) — link-mining po dostawie 137GPT: encje
Rawnicy są już wspólnym mianownikiem karty, planu i mapy, ale licznik
progowy idzie od KART (zasada właściciela 2026-08-31) — hasła ruszą
przy drugiej karcie planu.

| Encja | Klasa (docelowa) | Karty wspominające | Do hasła brakuje |
|---|---|---|---|
| Boros | spolecznosc | 137gpt-withstand | 1 karta |
| Legion Boros | spolecznosc | 137gpt-withstand, plan ravnica | licznik od kart, nie planów |
| Dziesiąty Dystrykt | geografia | 137gpt-withstand, plan ravnica | licznik od kart, nie planów |
| Sunhome | geografia | 137gpt-withstand, plan ravnica | licznik od kart, nie planów |
| Tin Street | geografia | 137gpt-withstand, plan ravnica | licznik od kart, nie planów |
| Pakt Gildii | magia | 137gpt-withstand, plan ravnica | licznik od kart, nie planów |

## Kolejka link-miningu: encje czekające na drugą kartę (Alara)

Sesja PR-21 (2026-09-06) — pogłębienie strony planu Alary (sekcja
„Odłamy i ludy”, mtg.wiki) zasiało encje wspólne dla karty 305ARB
i planu; licznik progowy idzie od KART, więc hasła ruszą przy drugiej
karcie Alary.

| Encja | Klasa (docelowa) | Karty wspominające | Do hasła brakuje |
|---|---|---|---|
| Maelstrom | geografia | 305arb-illusory-demon, plan alara | 1 karta |
| Nicol Bolas | postac | 305arb-illusory-demon, plan alara | 1 karta |
| Ajani Goldmane | postac | 305arb-illusory-demon, plan alara | 1 karta |
| Conflux / Sundering | historia | 305arb-illusory-demon, plan alara | 1 karta |
| Grixis (Sedraxis, Vithia) | geografia | plan alara | 2 karty |
| Etherium / Ethersworn | magia | plan alara | 2 karty |
| Nacatl (Coil, Claws of Marisi) | spolecznosc | plan alara | 2 karty |

## Link-mining PR-22 — encja wspólna dla różnych planów

**Nowa Phyrexia — wykonane 2026-09-07**, `content/lore/nowa-phyrexia.md`,
klasa `spolecznosc`, plan macierzysty Mirrodin. Próg spełniały treści
**dwóch kart przed dopisaniem wikilinków**: Carapace Forger (wróg Mirran)
i Illusory Demon (najeźdźcy, przeciw którym wystąpił Maelstrom).
Hasło opisuje jedną cywilizację, nie łączy dwóch wojen w jedno wydarzenie.
Linki ze wszystkich pięciu stron wspominających tę encję: obie karty
oraz plany Mirrodin, Alara i Tarkir. Liczba planów nie jest progiem kart.

Drugi artykuł nie powstaje tylko po to, by wyczerpać limit dwóch haseł:
wojna, fauna czy szpiedzy jako wspólne tagi nie określają jednej konkretnej
frakcji/istoty. Dalsze rozpoznane encje nadal wymagają drugiej karty:

| Encja | Klasa | Karta wspominająca | Do progu brakuje |
| --- | --- | --- | --- |
| Cloud Strife | postac | 275fin-aerith-rescue-mission | 1 karta |
| Cetra | spolecznosc | 275fin-aerith-rescue-mission | 1 karta |
| Shinra | spolecznosc | 275fin-aerith-rescue-mission | 1 karta |
| Tel-Jilad | geografia | 488som-carapace-forger | 1 karta |
| Chianul | postac | 509ktk-highland-game | 1 karta |
| Arel | postac | 509ktk-highland-game | 1 karta |

## Link-mining PR-25 (Pętla Jakości, 2026-09-08)

**Mephidross — wykonane 2026-09-08**, `content/lore/mephidross.md`,
klasa `geografia`, plan Mirrodin. Próg (2 karty) spełniały
476mbs-banishment-decree + 488som-carapace-forger (+ plan mirrodin);
wikilinki dopisane we wszystkich trzech miejscach; sekcja „Na mapie”
odsyła do mapy Mirrodinu zbliżonej w określonym miejscu (deep-link
`?x=&y=`).

**Oxidda Chain — wykonane 2026-09-09**, `content/lore/oxidda-chain.md`,
klasa `geografia`, plan Mirrodin. Próg (2 karty) spełniły
488som-carapace-forger + 556nph-ruthless-invasion (+ plan mirrodin,
+ hasło mephidross przez opis granicy); wikilinki dopisane na planie,
w karcie 488SOM i w haśle Mephidross. Uwaga: „Tangle” na liście encji
≥2 stron NIE tworzy hasła — to dwie różne encje o tej samej nazwie
(miedziany las Mirrodinu i Drzewo Świata Aerony w Dominarii).
(Wcześniejsza obwódka regionu `regiony` w map.json wycofana — ADR 0043.)

Encje „o jedną kartę” od progu (skan boldów 2026-09-08):

| Encja | Klasa (docelowa) | Karta wspominająca | Do progu brakuje |
| --- | --- | --- | --- |
| Elesh Norn | postac | 476mbs-banishment-decree (+ plan mirrodin, hasło nowa-phyrexia) | 1 karta |
| Razor Fields, Ortodoksja Maszyn, Glimmervoid, Taj-Nar, Accorders, Argent Etchings, Cave of Light, Ten Shields | geografia/doktryna | 476mbs-banishment-decree (+ plan mirrodin) | 1 karta |
| Copperline Gorge, Radix, Rey-Goor | geografia | 488som-carapace-forger (+ plan mirrodin, hasło oxidda-chain) | 1 karta |
| Vulshok | spolecznosc | 556nph-ruthless-invasion (+ plan mirrodin, hasło oxidda-chain) | 1 karta |
| Pythor | postac | 556nph-ruthless-invasion | 1 karta |
| Oona, Glen Elendra | postac/geografia | 605shm-consign-to-dream (+ plan lorwyn) | 1 karta |
| Ashmouth, Kirch, Skirsdag, Mikaeusa, Katedra Avacyn, Devils' Breach | geografia | 393dka-forge-devil (+ plan innistrad, hasło thraben) | 1 karta |
| Havengul, Nephalia, Homicidal Brute, Markovowie, wilkołaki Kessigu | geografia/postac/spolecznosc | 309isd-civilized-scholar (+ plan innistrad, hasło thraben) | 1 karta |
| Temur, Mardu, Qal Sisma, Karakyk Valley, Summer Landing, Eternal Ice, Dragon's Throat, The Scour, ainok | geografia/klany | 509ktk-highland-game (+ plan tarkir) | 1 karta |
| Sunhome, Precinct Four | geografia | 137gpt-withstand (+ plan ravnica) | 1 karta |
| Benalia, Wybrani, Pięć Edyktów, Tangle (Dominaria), Argoth, Sylex, Kabała, Aphetto, Daru, Tamingazin, Zhalfir, Suq'At, Sarpadyjskie Imperia, Ciemne Czasy, thrullowie, thalidzi, homaridi | geografia/spolecznosc | 40usg-expunge / plan dominaria | 1 karta |
| Eldrazi, Roil, Halimar, Coralhelm, Jori En, merfolk | różne | 2bfz-coralhelm-guide (+ plan zendikar) | 1 karta |

## Link-mining Forgotten Realms (start: PR-25, aktualizacja 2026-09-09)

**Wybrzeże Mieczy — wykonane 2026-09-09**,
`content/lore/wybrzeze-mieczy.md`, klasa `geografia`, plan
`forgotten-realms`. Próg spełniały `3clb-nefarious-imp` + plan
`forgotten-realms`; wikilinki dopisane na obu stronach i hasło dostało
odsyłacz do mapy Faerûnu (`?x=0.13&y=0.27`).

Pozostałe encje „o jedną kartę” od progu:

| Encja | Klasa (docelowa) | Karta wspominająca | Do progu brakuje |
| --- | --- | --- | --- |
| Avernus, Baator | geografia | 3clb-nefarious-imp | 1 karta |
| imp (chochlik) | fauna | 3clb-nefarious-imp | 1 karta |
| Wojna Hobgoblinów, Tiamat | wydarzenie/koncepcja | 3clb-nefarious-imp (+ plan forgotten-realms) | 1 karta |
| Faerûn, Abeir-Toril, Morze Upadłych Gwiazd, Moonshaes, Nelanther, Amn, Luruar, Jezioro Pary, Królestwo Wysokie, Morze Bezludne | geografia | — (plan forgotten-realms) | licznik od kart, nie planów |
| Mystra, Selûne, Lathander, Ilmater, Tempus, Tkanina Magii, Czas Kłopotów | postac/koncepcja | — (plan forgotten-realms) | licznik od kart, nie planów |

## Mapa Zendikaru — WYKONANA (ADR 0012)

Zrobione 2026-08-31 (feedback G właściciela): **rekonstrukcja własna
wariantu T3** w `maps/zendikar/` (podkład SVG + map.json z flagą
`rekonstrukcja: true`). Oficjalna mapa planu nigdy nie powstała;
układ kontynentów z kanonu tekstowego (Plane Shift: Zendikar),
wzorowany układem map fanowskich. Murasa ma linię przerywaną
(„położenie przybliżone” — w kanonie nieustalone). Kotwice etykiet
(Tazeem, Halimar, Sea Gate, Emeria, Akoum, Oko Ugina, Bala Ged,
Guul Draz, Malakir, Ondu, Agadeem, Beyeen, Wyspy Jwar, Sejiri,
Murasa) czekają na pinezki kolejnych kart Zendikaru. Jeśli Wizards
kiedyś opublikuje oficjalną mapę — ponowić decyzję (T2/T1).

Przy materializacji encji w drugiej karcie: utworzyć hasło wg
SZKIELET_HASLA.md i **dopisać wikilinki ze wszystkich stron, które ją
wspominają** (Pętla Jakości, krok 3). Wycofane 2026-08-31 hasła
przedwcześnie utworzone (crebain/dunland/isengard/rohan) — treść do
odzyskania z git history (commit e8fa07a) po odblokowaniu progów.

Regiony mapy Śródziemia (`maps/srodziemie/map.json`) wracają razem
z hasłami geograficznymi (MA4/MA5); wyliczone bboxy do odzyskania
z commit e8fa07a.

## Wyszukiwarka fuzzy

Domyślna wyszukiwarka to substring po tytułach/tagach/planach. Gdy baza
przerośnie ~50 stron: indeks n-gramowy albo odległość Levenshteina w
czystym JS (zero deps, ADR 0002). Koszt mały, priorytet niski dopóki
właściciel nie zaznaczy frustacji.

## Cache obrazów Scryfalla w repo (pełny offline)

ADR 0004 świadomie linkuje obrazy URL-em. Pełny offline (Pages bez sieci /
samolot) wymagałby pobierania `normal` do `assets/` — decyzja odroczona do
momentu, gdy offline stanie się realnym scenariuszem. Wymaga ADR
(budżet rozmiaru + narzędzie pobierania przez `fetch_page`).

## Grafiki dla Kart Haseł

Slot istnieje (ADR 0008 §5). Otwarte pytania właściciela: czy generować,
jaki styl, czy trzymać w repo (i pod jakim budżetem). Wznowić po
pierwszych 5+ hasłach, gdy zobaczymy, jak strony wyglądają bez grafik.

## Wektoryzacja T2 mapy Śródziemia

Decyzja po obejrzeniu T1 (K3/K4). Technika: własny skrypt śledzący
krawędzie po kwantyzacji kolorów; alternatywnie hybryda selektywna
(wektorowe tylko wybrzeża + rzeki + granice regionów lore).

## Podbicie akcji w workflowach (właściciel; wymaga uprawnienia `workflows`)

Runnery GitHub wymuszają Node 24 na akcjach targetujących Node 20 —
`ci.yml` i `pages.yml` używają `checkout@v4`/`setup-node@v4` (ostrzeżenie
deprekacji, nie błąd). Podbić na `@v5` przy okazji pierwszej zmiany
właściciela w `.github/`. Wariant hardeningu z sesji PR-4 (odrzucony
push): `configure-pages@v5` z `with: enablement: true` — tworzy site
Pages, gdyby kiedykolwiek został odrzucony/usunięty (L6).

## RSS/JSON „Co nowego"

`content/co-nowego.md` + strona HTML wystarczą na start. Ewentualny kanał
maszynowy — gdy pojawi się drugi konsument.

## Eksport bazy (backup poza git)

Repozytorium jest backupem treści; ewentualny eksport JSON/HTML poza
GitHub — niski priorytet, wymaga decyzji właściciela.

## Mapa globalna „wszystkie plany"

Pinezki kart na wielu mapach planów; pomysł na widok przeglądowy
(plan → liczba kart). Czysto UI, po K4.

## Normalizacja nazw wydruków (setów)

Snapshoty Scryfalla niosą `set`/`set_name`; przy dziesiątkach kart może
przydać się rejestr `content/sets.json` z polskimi opisami. Zbierać
potrzebę przy pierwszym panelu filtrów po wydaniach.

## Metryka haseł bez pinezki (rozpoznanie PR-22) — DOMKNIĘTE (PR-25)

Pierwsze hasło klasy `spolecznosc` (Nowa Phyrexia) miało wszystkie
wymagane sekcje, źródła i wikilinki, lecz stats dawał 6/8 za brak
pinezki, choć szkielet nie wymaga lokalizacji tej klasy. Rozwiązanie
(2026-09-08, `tools/wiki-stats.mjs`): komponent pinezki = N/A i nie
liczy się do maksimum strony (maks 6); uwaga w gidzie Pętli Jakości.
**ADR 0043 (2026-09-08) poszerza regułę systemowo:** na mapie
oznaczenia noszą wyłącznie karty, więc pinezka = N/A dla haseł
**każdej** klasy (nie tylko niegeograficznych); hasło łączy się z
mapą wyłącznie odsyłaniem (`?x=&y=`), pole `regiony` wycofane.
