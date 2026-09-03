# Gid: Karta Katalogowa — szkielet LORE-first, kontrakt sekcji, format dostawy

Powiązania: [ADR 0003](../decisions/0003-petla-jawnego-przekazywania-i-hierarchia-kanonu.md)
(pętla przekazywania), [ADR 0004](../decisions/0004-snapshoty-scryfall-w-repo.md),
[ADR 0005](../decisions/0005-szkielety-stron-i-protokol-wikilinkow.md),
[ADR 0008](../decisions/0008-tory-obrazow-fot-kon.md),
[ADR 0011](../decisions/0011-chudy-format-dostawy.md) (chudy format dostawy),
[ADR 0030](../decisions/0030-karta-katalogowa-lore-first.md) (LORE-first).

## Zasada czystości treści (feedback właściciela 2026-08-31, doprecyzowanie 2026-09-03)

Strona karty to **treść encyklopedyczna lore**. Nie jest katalogiem
wydawniczym MtG, raportem z procesu Codexu ani analizą rynku. W
`content/cards/*.md` nie ma miejsca na mechanikę projektu: żadnych
odnośników do ADR-ów, „zasad właściciela”, Pętli Jakości, kolejki
link-miningu, PROCES_MAP, ścieżek plików (docs/, maps/, collection/),
etykiet „Status:”, „(verbatim)”, „Odczyt wyłącznie ze snapshotu”.
To wiedza procesowa — żyje w docs/, nie na renderowanej stronie.

Po korekcie właściciela z 2026-09-03 obowiązuje mocniejsze brzmienie:
**Karta Katalogowa jest LORE-first.** Pierwszy kontakt czytelnika z kartą
ma być kroniką świata, sceny i bytów. Techniczne dane Magic: koszt many,
typ, P/T, wydanie, rzadkość, artysta, numer, data, rama i link Scryfall
pokazuje **infoboks**. Główna treść może przywołać reguły tylko w sekcji
**„Mechanika jako Opowieść”**, pod koniec wpisu, bezpośrednio przed
Źródłami, i wyłącznie po to, żeby odczytać je jako opowieść.

Antywzorzec: wpis zaczynający się od listy „Koszt / Typ / Zdolność /
Wydanie” albo od historii dodatku/drukowania. To spycha lore na drugi
plan i jest dziś niezgodne z ADR 0030.

## Format dostawy karty (właściciel → sesja; ADR 0011 + Fabuła z ADR 0026)

Wpis dostarczany w czacie lub issue — cztery pola identyfikacyjne
(taby) **plus Fabuła** (tekst dowolnej długości, zwykle osobny akapit):

```text
1LTR	Dunland Crebain	LTR	Śródziemie
2BFZ	Coralhelm Guide	BFZ	Zendikar
Fabuła: <tekst właściciela kotwiczący kartę w planie — osadzenie,
scena, rola bytów; zgodny z ilustracjami FOT/KON>
```

| Pole | Znaczenie | Przykład |
|---|---|---|
| Numer (imgId) | numer w arkuszu kolekcji | `1LTR` |
| Nazwa Karty | nazwa karty MtG | `Dunland Crebain` |
| Set | wydanie/kod | `LTR` |
| Plan | setting, w którym karta osadza kolekcję | `Śródziemie` |
| **Fabuła** | **wiążąca kotwica transpozycji (ADR 0026)** — na niej opierają się sekcje „Transpozycja”, „Na Mapie”, sceniczne dopowiedzenia w „Kronice Lore” oraz pinezka | akapit prozy |

Wszystko pozostałe — kolory, typ, koszt, statystyki, artysta, flavor,
rzadkość — pochodzi ze **snapshotu Scryfalla posiadanego printu**
(ADR 0004). Snapshot zasila infoboks oraz sekcje, które naprawdę tego
potrzebują: „Flavor Text” i „Mechanika jako Opowieść”. Fabułę opisujemy
jako osadzenie kolekcji/materializacji, nigdy jako nowy kanon świata;
konflikt Fabuły z twardym kanonem świata → pytanie do właściciela.
Historia: do 2026-08-31 dostawa zawierała „Prompt” i „Narrację”
(archiwum w `collection/entries/`); 2026-08-31 — 2026-09-02 obowiązywał
format czteropolowy bez Fabuły (1LTR, 2BFZ) — właściciel może dosłać
Fabułę uzupełniającą do tych kart.

Sesja zapisuje wpis jako `collection/entries/<slug>.md`:

```md
---
imgId: 2BFZ
nazwa: Coralhelm Guide
wydanie: BFZ
plan: zendikar
dostarczono: YYYY-MM-DD
---
```

**Wpis jest nienaruszalny.** Błędy w treści wpisu poprawia wyłącznie
właściciel (nową wersją); sesja może je najwyżej jawnie skomentować
w treści strony.

## Plik Karty Katalogowej

`content/cards/<imgid>-<slug-nazwy>.md` — np. `content/cards/1ltr-dunland-crebain.md`.

```md
---
typ: karta
slug: 1ltr-dunland-crebain
nazwa: Dunland Crebain
imgId: 1LTR
wydanie: LTR
plan: srodziemie
kolory: [B]
tagi: [fauna, szpiedzy]
materializacja: YYYY-MM-DD
pinezka:
  mapa: srodziemie
  pewnosc: region
---

## Kronika Lore
nasycony lore opis sceny, czasu, miejsca i konfliktu...
```

Slug karty = `<imgId>-małe-litery>-<slug-nazwy>`; snapshot Scryfalla i wpis
kolekcji mają **ten sam slug** w swoich katalogach (testy pilnują
istnienia, nie trzeba wpisywać ścieżek).

## Wątki w treści, nie w osobnej sekcji (korekta właściciela 2026-08-31)

Karta NIE ma sekcji „Wątki i Powiązania”. Najważniejsze encje lore są
**pogrubione w treści** (pierwsze wystąpienie: rasa, kraina, postać,
konflikt). Wikilink `[[Hasło]]` wstawiamy w miejscu pogrubienia
dopiero wtedy, gdy hasło istnieje — czyli gdy encja pojawiła się
już w treści ≥2 kart (progu haseł pilnuje backlog link-miningu).
Pogrubienie to więc „hasło na razie” — znacznik, że encja zasługuje
na własną stronę.

## Sekcje treści (kolejność obowiązkowa)

| # | Sekcja | Kontrakt (skąd wiedza, co obowiązkowe) |
|---|---|---|
| 1 | **Kronika Lore** | Otwiera wpis głosem niezależnego kronikarza: scena, świat, epoka in-lore, konflikt i sens karty. Bez listy koszt/typ/wydanie i bez historii publikacji dodatku. Obowiązkowe. |
| 2 | **Postacie i Byty** | KANON: byty, które faktycznie występują na karcie (co wynika z nazwy/typu/flavoru/sceny), osadzone w lore świata — rasa, rola, siedlisko. Byty z Fabuły mogą się pojawić tylko jasno jako element materializacji kolekcji, nie jako nowy kanon. Obowiązkowe. |
| 3 | **Nazwa Karty** | Etymologia i sens nazwy w świecie (np. „crebain” = sindarińskie „wrony/kruki”) oraz **pełne polskie odczytanie nazwy** („Crebainy z Dunlandu”). Źródło: karta + setting + kwerenda. Obowiązkowe. |
| 4 | **Flavor Text** | Oryginał (EN, przytoczony ze snapshotu) + tłumaczenie + **odczyt fraza po frazie** (co każdy fragment mówi), kontekst postaci cytującej i związek cytatu z lore. Jeśli posiadanego wydruku nie ma flavoru — sekcja istnieje i mówi to wprost, jako ciszę/wybór opowieści, bez cytowania flavoru innych printów tej karty. Obowiązkowe. |
| 5 | **Transpozycja** | Most: jak karta MtG i Fabuła dostawy działają w settingu docelowym. Dla kart rodzimych krótko: co zawężamy i jak scena kolekcji mieści się w kanonie; dla transpozycji — sedno przełożenia. Obowiązkowe. |
| 6 | **Na Mapie** | Lokalizacja + poziom pewności (`dokladna`/`region`/`przyblizona`) + skąd wiemy (lore/Fabuła). Pinezka w `maps/<plan>/map.json`. Obowiązkowe od momentu istnienia mapy planu. |
| 7 | **Mechanika jako Opowieść** | Jedyny blok techniczny głównej treści. Dane ze snapshotu Scryfall można przywołać precyzyjnie, ale zwięźle: co karta robi w regułach → co to znaczy w świecie → jak koszt/statystyki/typy/zdolności składają się w opowieść. Stoi pod koniec, bezpośrednio przed Źródłami. Obowiązkowe. |
| 8 | **Źródła** | Lista cytowań z kwerendy: link + co z niego zaczerpnięto. Scryfall wystarcza jako źródło danych karty; nie rozwijamy tu meta-opowieści wydawniczej. Wiedza z pamięci treningowej bez URL-a — oznaczona „wiedza ogólna”. Obowiązkowe. |
| 9 | **Podsumowanie Lore** | 2–4 tezy tematyczne (punkt + zdanie uzasadnienia) + akapit domykający syntezę; język encyklopedyczny, in-lore. Obowiązkowe. |

Sekcji „Druk w Kolekcji” **nie ma** (ADR 0014, decyzja właściciela
2026-09-01): dane wydruku (wydanie, rzadkość, artysta) pokazuje wyłącznie
infoboks, wprost ze snapshotu — bez sekcji narracyjnej, bez kwerend
o artystach i wariantach wydań. Pogłębianie strony karty to lore
(ADR 0015), nie meta-informacje kolekcjonerskie.

Sekcji „Ilustracja” **nie ma i nie powstaje** (decyzja właściciela
2026-09-01, ADR 0016): obraz ze Scryfalla uczestniczy we wpisie
wyłącznie jako infoboks (tor główny, ADR 0008) — jego udział w treści
kończy się na nim. Opisywanie druku źródłowego jest szkodliwe dla kart
transponowanych: wizualizacje alternatywne (FOT/KON) bywają zupełnie
inne i osadzone w innych planach.

## Procedura materializacji (kolejność kroków)

1. Wpis właściciela → `collection/entries/<slug>.md` (verbatim).
2. `fetch_page` na Scryfall → `scryfall/<slug>.json` (+ `source`,
   `pobrano`, `slug`).
3. Strona planu istnieje? Nie → utwórz minimalną `content/planes/<plan>.md`
   (tytuł, typ IP, krótki opis) — rozbudowa później.
4. Kwerenda internetowa (2–5 zapytań): lore karty i jej encji,
   etymologia, geografia dla pinezki. Unikaj kwerend o artystach,
   wariantach wydruków i historii publikacji, jeśli nie są niezbędne
   do zrozumienia lore.
5. Pisanie Karty Katalogowej wg szkieletu LORE-first; kluczowe encje
   pogrubione w treści; wikilink tylko tam, gdzie hasło już istnieje.
6. Pinezka: jeśli mapa planu istnieje → dopisz do `maps/<plan>/map.json`
   z uzasadnieniem; jeśli nie → pinezka w treści + notka w roadmapie
   (proces mapowy, PROCES_MAP.md).
7. `npm test` + `npm run build`; wpis w `content/co-nowego.md`;
   inkrementalny commit + push.
