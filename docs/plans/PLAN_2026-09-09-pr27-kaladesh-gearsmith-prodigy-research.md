# Plan — 610M19 Gearsmith Prodigy / Kaladesh (research mapy przed materializacją)

- **Data:** 2026-09-09
- **Gałąź:** `arena/01a08327-mtg`
- **PR:** #27
- **Cel:** przed materializacją nowej karty i nowego planu ustalić realne
  możliwości mapy Kaladeshu w drabinie T1/T2/T3/T4 oraz dać właścicielowi
  uczciwą rekomendację z uzasadnieniem.

## Wejście właściciela

`610M19 · Gearsmith Prodigy · M19 · Kaladesh · Fabuła` — scena osadzona
w **Ghirapurze**: młoda konstruktorka testuje mechanicznego lisa na
słonecznym tarasie miejskich ogrodów; automat z mosiężnego filigranu
pracuje na błękitnym rdzeniu eterowym; karta ma opowiadać o kulturze
wynalazczości Kaladeshu.

## Pytania badawcze

1. Czy istnieje **oficjalna / kanoniczna mapa** Kaladeshu nadająca się na T1?
2. Jeśli nie, czy istnieje **gotowy podkład adoptowalny** (wektor / bardzo
   dobry fanowski raster) nadający się na T2 bez łamania zasad projektu?
3. Jeśli T1/T2 odpadają, czy Kaladesh jest światem, który da się uczciwie
   narysować jako T3/T4 z samego kanonu tekstowego, bez zmyślania topologii?
4. Czy skala planu powinna być:
   - całościowa (Kaladesh jako świat),
   - regionalna (subkontynent / rdzeń cywilizacji),
   - miejska (samo Ghirapur),
   - albo wielowariantowa (np. świat + później podmapa miasta)?
5. Czy scena `Gearsmith Prodigy` pozwala na pinezkę `dokladna`, czy tylko
   `region` / `przyblizona`?

## Kroki

1. Kwerenda źródeł kanonicznych Kaladeshu (WotC, Art of MTG, mtg.wiki,
   ewentualne skany/atlasy), z rozdzieleniem:
   - mapa planu,
   - mapa regionu,
   - mapa miasta Ghirapur,
   - tylko ilustracje / panoramy niebędące mapą.
2. Inwentarz kandydatów T1/T2 z oceną:
   - kanoniczność,
   - czytelność nazw,
   - rozdzielczość,
   - brak watermarków / obcych elementów,
   - realna możliwość commitu do repo.
3. Jeśli T1/T2 słabe lub nieistniejące: ocena T3/T4 z perspektywy kanonu:
   czy znamy dość topologii, by narysować mapę uczciwie bez fantazjowania.
4. Rekomendacja wariantu mapy dla pierwszej karty Kaladeshu:
   - preferowany wariant,
   - wariant zapasowy,
   - czego nie robić.
5. Dopiero po akceptacji właściciela: materializacja `collection/entries/`,
   snapshot Scryfall, plan `kaladesh`, karta `610m19-gearsmith-prodigy`.

## Wynik oczekiwany tej fazy

- odpowiedź w czacie z analizą **T1 / T2 / T3 / T4**,
- uczciwa rekomendacja wariantu dla Kaladeshu,
- wskazanie, czy warto zaczynać od planu-świata czy od Ghirapuru,
- raport zapisany w `docs/research/RESEARCH_2026-09-09-kaladesh-gearsmith-prodigy.md`.
