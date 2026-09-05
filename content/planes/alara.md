---
typ: plan
slug: alara
tytul: Alara
typIP: plan-mtg
mapa: alara
materializacja: 2026-09-05
tagi: [geografia]
---

Alara to rodzimy plan Magic: The Gathering o podwójnej biografii:
niegdyś jeden, zasobny w manę świat obelisków i królestwa Vithia,
potem — po **Sundering** — pięć odłamów-shardów dryfujących osobno,
każdy odcięty od dwóch kolorów many i wykrzywiony w własną kulturę
i ekologię; wreszcie, po **Conflux**, znów jeden plan: scalony,
z **Maelstromem** — burzą many wszystkich pięciu shardów — w punkcie
złączenia. Kodeks rysuje Alarę w stanie scalonym (ADR 0033): regiony
zachowały tożsamość, więc jedna mapa niesie i sceny post-Conflux,
i — przez regiony — sceny z epoki shardów.

## Setting w pigułce

Pięć regionów w cyklu many (sąsiedzi dzielą dwa kolory): **Bant**
(G/W/U — łąki, zamki, anioły i rytualizowane pojedynki rycerzy),
**Esper** (W/U/B — wszystko wykończone etherium, kasta magów,
vedalken i sfinksów), **Grixis** (U/B/R — nekropolia demonów
i nekromantów po upadku Vithii, nekropolis Sedraxis), **Jund**
(B/R/G — wulkaniczny łańcuch pokarmowy ze smokami na szczycie)
i **Naya** (R/G/W — olbrzymi las-piętro, w którym żyje się pod
koronami i pod opieką Animy). W centrum scalonego planu wiruje
**Maelstrom** — śmiertelne serce Alary, złączenie pięciu shardów,
z którego rodzą się „błędy światła” wyglądające jak demony
([[305arb-illusory-demon|Illusory Demon]]).

## Epoki i Conflux

Starożytna Alara była jednym planem; nieznany planeswalker wyssał
jej manę, a **Sundering** rozłamał świat wzdłuż linii many „jak
światło w pryzmacie”. Odłamy dryfowały w Blind Eternities, każdy
okrojony z dwóch kolorów many. **Conflux** — przyspieszony przez
Nicol Bolasa, który orkiestrował wojny shardów i kierował manę
obelisków w burzę — scalił plan z powrotem; w punkcie, gdzie pięć
shardów się zeszło, powstał Maelstrom, a Bolas wszedł w jego środek,
by odzyskać dawną moc (powstrzymał go Ajani Goldmane). Dziś Alara
jest „Reunited” — i nawet podczas Nowej Phyrexiańskiej Inwazji
sam Maelstrom powstał przeciw najeźdźcy.

## Mapa

`maps/alara/` — wariant **T4** (rekonstrukcja kanoniczna): pięć
regionów jako sektory w cyklu many wokół centralnego Maelstromu
(kanoniczna topologia złączenia), obeliski przy szwach regionów
(stabilizowały shardy; pozycje reprezentatywne), miejsca kanoniczne
(Valeron, Jhess, Akrasa, Sedraxis, Antali) jako pozycje
reprezentatywne wewnątrz regionów — brak kanonicznych współrzędnych,
proweniencja w `map.json`.

## Źródła

- MTG Wiki, hasło Alara — historia (Sundering, Conflux, inwazja),
  regiony, status planu: https://mtg.wiki/page/Alara
- MTG Wiki, hasło Maelstrom — burza many powstała w Conflux
  w punkcie złączenia shardów; istoty zrodzone z burzy:
  https://mtg.wiki/page/Maelstrom
- Scryfall, set ARB (Alara Reborn): https://scryfall.com/sets/arb
- ADR 0033 (jedna mapa aktualnego stanu kanonicznego planu) —
  dokument własny repo:
  `docs/decisions/0033-mapy-planow-jedna-mapa-aktualnego-stanu-kanonicznego.md`
