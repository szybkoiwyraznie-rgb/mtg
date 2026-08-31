# Gid: Karta Katalogowa — szkielet, kontrakt sekcji, format dostawy

Powiązania: [ADR 0003](../decisions/0003-petla-jawnego-przekazywania-i-hierarchia-kanonu.md)
(pętla przekazywania, hierarchia kanonu), [ADR 0004](../decisions/0004-snapshoty-scryfall-w-repo.md),
[ADR 0005](../decisions/0005-szkielety-stron-i-protokol-wikilinkow.md),
[ADR 0008](../decisions/0008-tory-obrazow-fot-kon.md).

## Format dostawy karty (właściciel → sesja)

Wpis dostarczany w czacie lub issue, w formacie tabelarycznym
(pola rozdzielone tabami/średnikami — parser toleruje oba):

| Pole | Znaczenie | Przykład |
|---|---|---|
| Ilustracja | imgId z arkusza kolekcji | `1LTR` |
| Nazwa Karty | nazwa karty MtG | `Dunland Crebain` |
| Set | wydanie/kod | `LTR` |
| Plan / Setting | setting po transpozycji | `Śródziemie` |
| MV | mana value — **ignorowane** (decyzja 2026-08-31), przechowywane verbatim | `4` |
| Colors | kolory | `B` |
| Prompt | prompt wizualizacyjny alternatywnego artu — kotwica osadzenia (ADR 0010) | długi opis… |
| Narracja | fabuła karty — **kotwica osadzenia, nie kanon** (ADR 0010; kanonem jest karta MtG + lore świata) | długi opis… |

Sesja zapisuje wpis jako `collection/entries/<slug>.md`:

```md
---
imgId: 1LTR
nazwa: Dunland Crebain
wydanie: LTR
plan: srodziemie
kolory: [B]
mv: "4"
dostarczono: YYYY-MM-DD
---

## Prompt

<treść prompta VERBATIM — bez żadnych zmian>

## Narracja

<treść narracji VERBATIM — bez żadnych zmian>
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

## Sekcje treści (kolejność obowiązkowa)

| # | Sekcja | Kontrakt (skąd wiedza, co obowiązkowe) |
|---|---|---|
| 1 | **Metryka i Kontekst Świata** | Infobox buduje silnik z danych (frontmatter + snapshot). W treści: umiejscowienie sceny w settingu po transpozycji — gdzie i kiedy w timelnie świata. Obowiązkowe. |
| 2 | **Postacie i Byty** | Kto/co konkretnie występuje na karcie i w narracji; każda istotna encja dostaje wikilink (kandydat do hasła). Obowiązkowe. |
| 3 | **Nazwa Karty** | Etymologia i sens nazwy w świecie (np. „crebain" = sindarińskie „wrony/kruki"). Źródło: karta + setting + kwerenda. Obowiązkowe. |
| 4 | **Mechanika jako Opowieść** | Koszt, kolor, statyki, keywords, zdolności — odczytane WYŁĄCZNIE ze snapshotu Scryfall — przetłumaczone na narrację (czarny = szpiegostwo i strach; Flying = zwiadowcy powietrzni; Amass = rosnąca armia). Obowiązkowe. |
| 5 | **Flavor Text** | Oryginał (EN, verbatim ze snapshotu) + tłumaczenie + interpretacja w kontekście. Jeśli karta nie ma flavoru — sekcja istnieje i mówi to wprost. Obowiązkowe. |
| 6 | **Transpozycja** | Most: jak karta MtG (plan rodzinny/mechanika) przełożona została na setting docelowy. Dla kart „natywnych" krótko; dla transpozycji — sedno. Obowiązkowe. |
| 7 | **Narracja Kolekcji** | Narracja właściciela **verbatim** (kopiowana z wpisu; to powtórzenie jest celowe — strona ma być samowystarczalna). Status: **kotwica osadzenia, nie kanon** (ADR 0010) — przy rozbieżnościach z kartą MtG lub lorem świata wygrywa kanon, a rozbieżność opisujemy jawnie. Obowiązkowe. |
| 8 | **Wizualizacja** | Prompt (verbatim) + opis słowny, co obraz pokazuje/scenuje. **Zero generowania grafik** (ADR 0008). Obowiązkowe. |
| 9 | **Wątki i Powiązania** | Wikilinki do haseł i innych kart; krótkie uzasadnienie powiązania. Obowiązkowe (może być na starcie puste z uzasadnieniem — uzupełnia Pętla Jakości). |
| 10 | **Na Mapie** | Lokalizacja + poziom pewności (`dokladna`/`region`/`przyblizona`) + skąd wiemy (lore). Pinezka w `maps/<plan>/map.json`. Obowiązkowe od momentu istnienia mapy planu. |
| 11 | **Źródła** | Lista cytowań z kwerendy: link + co z niego zaczerpnięto. Wiedza z pamięci treningowej bez URL-a — oznaczona „wiedza ogólna". Obowiązkowe. |
| 12 | **Podsumowanie Lore** | Synteza 1–2 akapity, język encyklopedyczny. Obowiązkowe. |

## Procedura materializacji (kolejność kroków)

1. Wpis właściciela → `collection/entries/<slug>.md` (verbatim).
2. `fetch_page` na Scryfall → `scryfall/<slug>.json` (+ `source`,
   `pobrano`, `slug`).
3. Strona planu istnieje? Nie → utwórz minimalną `content/planes/<plan>.md`
   (tytuł, typ IP, krótki opis) — rozbudowa później.
4. Kwerenda internetowa (2–5 zapytań): lore karty, encje z narracji,
   etymologia, geografia dla pinezki.
5. Pisanie Karty Katalogowej wg szkieletu; wikilinki tam, gdzie encja
   zasługuje na hasło.
6. Pinezka: jeśli mapa planu istnieje → dopisz do `maps/<plan>/map.json`
   z uzasadnieniem; jeśli nie → pinezka w treści + notka w roadmapie
   (proces mapowy, PROCES_MAP.md).
7. `npm test` + `npm run build`; wpis w `content/co-nowego.md`;
   inkrementalny commit + push.
