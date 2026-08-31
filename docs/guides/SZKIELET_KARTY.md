# Gid: Karta Katalogowa — szkielet, kontrakt sekcji, format dostawy

Powiązania: [ADR 0003](../decisions/0003-petla-jawnego-przekazywania-i-hierarchia-kanonu.md)
(pętla przekazywania), [ADR 0004](../decisions/0004-snapshoty-scryfall-w-repo.md),
[ADR 0005](../decisions/0005-szkielety-stron-i-protokol-wikilinkow.md),
[ADR 0008](../decisions/0008-tory-obrazow-fot-kon.md),
[ADR 0011](../decisions/0011-chudy-format-dostawy.md) (chudy format dostawy).

## Zasada czystości treści (feedback właściciela 2026-08-31)

Strona karty to **wyłącznie treść encyklopedyczna**. W `content/cards/*.md`
nie ma miejsca na mechanikę Codexu ani proces: żadnych odnośników do
ADR-ów, „zasad właściciela", Pętli Jakości, kolejki link-miningu,
PROCES_MAP, ścieżek plików (docs/, maps/, collection/), etykiet
„Status:", „(verbatim)", „Odczyt wyłącznie ze snapshotu". To wiedza
procesowa — żyje w docs/ (ADR, ten plik, backlog), nie na renderowanej
stronie. Sekcja mówi treścią: brak flavoru = akapit o braku flavoru.
Karta jest w całości kanoniczna (ADR 0011): snapshot + lore świata
z cytowaniami — nic więcej.

## Format dostawy karty (właściciel → sesja; ADR 0011 „chudy")

Wpis dostarczany w czacie lub issue, jedna linijka — cztery pola
rozdzielone tabami (przykład realnej dostawy):

```
1LTR	Dunland Crebain	LTR	Śródziemie
2BFZ	Coralhelm Guide	BFZ	Zendikar
```

| Pole | Znaczenie | Przykład |
|---|---|---|
| Numer (imgId) | numer w arkuszu kolekcji | `1LTR` |
| Nazwa Karty | nazwa karty MtG | `Dunland Crebain` |
| Set | wydanie/kod | `LTR` |
| Plan | setting, w którym karta osadza kolekcję | `Śródziemie` |

Wszystko pozostałe — kolory, typ, koszt, statystyki, artysta, rama,
flavor, rzadkość — pochodzi ze **snapshotu Scryfalla posiadanego
printu** (ADR 0004). **Narracja i prompt NIE są dostarczane i NIE wchodzą
do Karty Katalogowej** (ADR 0011). Historia: do 2026-08-31 dostawa
zawierała też „Prompt" i „Narrację" — zapis tych dostaw pozostaje
w `collection/entries/` jako archiwum.

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

## Metryka i Kontekst Świata
...
```

Slug karty = `<imgId>-małe-litery>-<slug-nazwy>`; snapshot Scryfalla i wpis
kolekcji mają **ten sam slug** w swoich katalogach (testy pilnują
istnienia, nie trzeba wpisywać ścieżek).

## Wątki w treści, nie w osobnej sekcji (korekta właściciela 2026-08-31)

Karta NIE ma sekcji „Wątki i Powiązania". Najważniejsze encje lore są
**pogrubione w treści** (pierwsze wystąpienie: rasa, kraina, postać,
konflikt). Wikilink `[[Hasło]]` wstawiamy w miejscu pogrubienia
dopiero wtedy, gdy hasło istnieje — czyli gdy encja pojawiła się
już w treści ≥2 kart (progu haseł pilnuje backlog link-miningu).
Pogrubienie to więc „hasło na razie" — znacznik, że encja zasługuje
na własną stronę.

## Sekcje treści (kolejność obowiązkowa)

| # | Sekcja | Kontrakt (skąd wiedza, co obowiązkowe) |
|---|---|---|
| 1 | **Metryka i Kontekst Świata** | Infobox buduje silnik z danych (frontmatter + snapshot). W treści: umiejscowienie sceny w settingu po transpozycji — gdzie i kiedy w osi czasu świata. Obowiązkowe. |
| 2 | **Postacie i Byty** | KANON: byty, które FAKTYCZNIE występują na karcie (co widać w jej scenie/typie), osadzone w lore świata — rasa, rola, siedlisko. Byty żyjące tylko w wyobraźni poza kartą (np. postacie z fanowskich scen) nie mają na stronie karty miejsca w ogóle; jeśli lore gatunku wskazuje kogoś poza kartą (np. nadawcę zwiadu), pojawia się to dopiero w rozwinięciu lore, jasno jako lore świata, nie jako zawartość karty. Obowiązkowe. |
| 3 | **Nazwa Karty** | Etymologia i sens nazwy w świecie (np. „crebain" = sindarińskie „wrony/kruki"). Źródło: karta + setting + kwerenda. Obowiązkowe. |
| 4 | **Mechanika jako Opowieść** | Koszt, kolor, statyki, keywords, zdolności — odczytane WYŁĄCZNIE ze snapshotu Scryfall — przetłumaczone na narrację (czarny = szpiegostwo i strach; Flying = zwiadowcy powietrzni; Amass = rosnąca armia). Obowiązkowe. |
| 5 | **Flavor Text** | Oryginał (EN, przytoczony ze snapshotu) + tłumaczenie + interpretacja w kontekście. Jeśli posiadanego wydruk nie ma flavoru — sekcja istnieje i mówi to wprost (bez cytowania flavoru innych printów tej karty). Obowiązkowe. |
| 6 | **Transpozycja** | Most: jak karta MtG (plan rodzinny/mechanika) przełożona została na setting docelowy. Dla kart „natywnych" krótko; dla transpozycji — sedno. Obowiązkowe. |
| 7 | **Druk w Kolekcji** | Fakt kolekcjonerski: oficjalny wydruk, który właściciel posiada (artysta, wariant ramy, styl artysty) — wyłącznie z danych snapshotu. Druk wyświetla infoboks. **Zero generowania grafik** (ADR 0008); żadnych alternatywnych koncepcji wizualnych (ADR 0011). Obowiązkowe. |
| 8 | **Na Mapie** | Lokalizacja + poziom pewności (`dokladna`/`region`/`przyblizona`) + skąd wiemy (lore). Pinezka w `maps/<plan>/map.json`. Obowiązkowe od momentu istnienia mapy planu. |
| 9 | **Źródła** | Lista cytowań z kwerendy: link + co z niego zaczerpnięto. Wiedza z pamięci treningowej bez URL-a — oznaczona „wiedza ogólna". Obowiązkowe. |
| 10 | **Podsumowanie Lore** | Synteza 1–2 akapity, język encyklopedyczny. Obowiązkowe. |

## Procedura materializacji (kolejność kroków)

1. Wpis właściciela → `collection/entries/<slug>.md` (verbatim).
2. `fetch_page` na Scryfall → `scryfall/<slug>.json` (+ `source`,
   `pobrano`, `slug`).
3. Strona planu istnieje? Nie → utwórz minimalną `content/planes/<plan>.md`
   (tytuł, typ IP, krótki opis) — rozbudowa później.
4. Kwerenda internetowa (2–5 zapytań): lore karty i jej encji,
   etymologia, geografia dla pinezki.
5. Pisanie Karty Katalogowej wg szkieletu; kluczowe encje pogrubione
   w treści; wikilink tylko tam, gdzie hasło już istnieje.
6. Pinezka: jeśli mapa planu istnieje → dopisz do `maps/<plan>/map.json`
   z uzasadnieniem; jeśli nie → pinezka w treści + notka w roadmapie
   (proces mapowy, PROCES_MAP.md).
7. `npm test` + `npm run build`; wpis w `content/co-nowego.md`;
   inkrementalny commit + push.
