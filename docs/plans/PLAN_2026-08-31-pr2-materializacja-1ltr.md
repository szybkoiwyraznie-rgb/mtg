# PLAN 2026-08-31 — Materializacja 1LTR Dunland Crebain (w ramach PR #3)

> Kontynuacja sesji na tym samym PR (decyzja właściciela: praca trwa na
> `arena/01a05755-mtg` do końca sesji). Konwencja roadmapy zadania bez zmian.

## Cel

Pierwsza pełna materializacja („mysz laboratoryjna"): wpis kolekcji 1LTR →
snapshot Scryfall → Karta Katalogowa (12 sekcji) → strona planu Śródziemie →
4 Karty Haseł → mapa Śródziemia T1 z jedną pinezką + silnik map v1.
Waliduje CAŁY pipeline i oba typy stron na realnej karcie.

**Kryteria ukończenia:** `npm test` zielone (w tym parość kolekcji, pokrycie
Scryfall, walidacja szkieletów, mapy); artefakt zawiera kartę, hasła i mapę;
trasy `#/karta/…`, `#/haslo/…`, `#/mapa/srodziemie` renderują się w smoke
teście UI; CI zielone po pushu.

## Ustalenia

- Dostawa właściciela (2026-08-31, czat): imgId `1LTR`, nazwa *Dunland
  Crebain*, set `LTR`, plan `Śródziemie`, kolory `B`, MV `4` (ignorowane),
  prompt + narracja (verbatim, patrz wpis kolekcji).
- Zero generowanych grafik (ADR 0008); wizualizacja = druk Scryfalla (online)
  + tory FOT/KON (lokalnie, cichy fallback).
- Kanon: narracja właściciela > Tolkien > Oracle Scryfall > wiedza agenta
  (ADR 0003). Kwerenda z cytowaniami obowiązkowa.

## Etapy

| # | Etap | Kryterium | Commit |
|---|------|-----------|--------|
| 1 | Ten plan | push przed treścią | C11 |
| 2 | Kwerenda lore: crebain (etymologia, scena w Hollin), Dunland/Dunlendowie, Isengard/Saruman, cytaty źródłowe | zebrane URL-e do sekcji Źródła | — |
| 3 | Wpis kolekcji verbatim + snapshot Scryfall + taxonomia + strona planu Śródziemie | testy parości/pokrycia zielone | C12 |
| 4 | Karta Katalogowa (12 sekcji, wikilinki do haseł, pinezka) | walidacja szkieletu + build | C13 |
| 5 | Hasła: crebain (fauna), dunland (geografia), isengard (geografia), rohan (geografia, krótkie — z link-miningu) | walidacja haseł + backlinki w buildzie | C14 |
| 6 | Mapa **wektorowa** (ADR 0009): `maps/srodziemie/` = podkład.svg (mapome, CC-BY-4.0, T2 przez adopcję) + map.json (źródło, kotwice, pinezka regionowa Dunlandu) | test map zielony | C15 |
| 7 | Silnik map v1: underlay + pinezki HTML/SVG, pan/zoom (pointer+wheel+dotyk), legenda pewności, deep-link `?pin=` | smoke test UI na trasie `#/mapa/…` | C16 |
| 8 | Co-nowego + historia + handoff (aktualizacja) | push, CI zielone | C17 |

## Ryzyka

- ~~**Rozmiar podkładu mapy**~~ → rozstrzygnięte przez ADR 0009: podkład
  wektorowy (mapome SVG, CC-BY-4.0), base64 ~2,4 MB w artefakcie —
  akceptowane; gzIPPowany transfer na Pages ~4–5× mniejszy.
- **Raster z fanowskimi nalotami** → porzucone po analizie programistycznej
  (maski gęstości atramentu nie dawały wiarygodnej weryfikacji); decyzja
  właściciela: mapa wektorowa od razu (ADR 0009).
- **Współrzędne pinezki**: kotwice wyprowadzone programistycznie z wersji
  SVG z etykietami tekstowymi (Isengard ≈ (1330, 1275), Edoras, Tharbad,
  ENEDWAITH, Glanduin, Fords of Isen); pinezka Dunlandu = centroid regionu
  względem kotwic, poziom pewności `region` + uzasadnienie (MA4).
- **Kaskada haseł** (Rohan/Saruman/Uruk-hai): pilot tworzy 4 hasła;
  Saruman i Uruk-hai zostają plain-tekstem z wpisem do kolejki link-miningu
  (Pętla Jakości) — dokumentuję w handoffie.
- **Werbatim**: prompt/narracja kopiowane z dostawy 1:1 (porównanie przez
  test odcinkowy — parość kolekcji sprawdza pola, sekcje mają być nietknięte).

## Podsumowanie wykonania

_(dopisane na końcu zadania)_
