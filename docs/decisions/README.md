# Rejestr decyzji architektonicznych (ADR)

ADR zapisują decyzje, których nie powinno się odtwarzać z historii czatu.
Każdy dokument opisuje kontekst, wybór i jego konsekwencje. Konwencja
dziedziczona z projektu mtg-game.

## Statusy

- **Proponowana** — kierunek do dyskusji; nie jest jeszcze zobowiązaniem.
- **Zaakceptowana** — obowiązuje w projekcie.
- **Odrzucona** — rozważona, ale nieprzyjęta.
- **Zastąpiona** — historyczna; nowszy ADR wskazuje aktualną decyzję.
- **Wycofana** — nie ma już zastosowania.

## Decyzje

| ADR | Tytuł | Status |
|---|---|---|
| [0001](0001-repo-zrodlem-prawdy-jednoplikowy-artefakt.md) | Repozytorium jako jedyne źródło prawdy bazy; statyczna witryna i jednoplikowy artefakt | Zaakceptowana |
| [0002](0002-czysty-javascript-esm-zero-zaleznosci.md) | Czysty JavaScript (ESM), zero zależności, node:test | Zaakceptowana |
| [0003](0003-petla-jawnego-przekazywania-i-hierarchia-kanonu.md) | Pętla jawnego przekazywania kart i hierarchia kanonu | Częściowo zastąpiona (hierarchia — patrz ADR 0010) |
| [0004](0004-snapshoty-scryfall-w-repo.md) | Snapshoty Oracle ze Scryfalla utrzymywane w repozytorium | Zaakceptowana |
| [0005](0005-szkielety-stron-i-protokol-wikilinkow.md) | Szkielety stron (Karta Katalogowa, Karta Haseł) i protokół wikilinków | Częściowo zastąpiona (szkielet karty — patrz ADR 0011) |
| [0006](0006-petla-jakosci-jako-praca-domyslna.md) | Pętla Jakości jako domyślna praca sesji | Częściowo zastąpiona (kroki 2 i 4 — patrz ADR 0015) |
| [0007](0007-mapa-t1-hybryda.md) | Mapy planów — T1 hybryda z rasterowym podkładem | Zaakceptowana |
| [0008](0008-tory-obrazow-fot-kon.md) | Tory obrazów: brak generowanych grafik; FOT/KON lokalnie z cichym fallbackiem | Częściowo zastąpiona (przyciski torów — patrz ADR 0017) |
| [0009](0009-srodziemie-podklad-wektorowy-mapome.md) | Śródziemie: podkład w pełni wektorowy (mapome, CC-BY-4.0) zamiast rastra; T2 przez adopcję | Zaakceptowana |
| [0010](0010-hierarchia-kanonu-v2-karta-i-lore-nad-narracja.md) | Hierarchia kanonu v2: karta MtG + lore świata > narracja kolekcji (kotwica osadzenia, nie kanon); zastępuje hierarchię ADR 0003 | Częściowo zastąpiona (kotwica osadzenia — patrz ADR 0011) |
| [0011](0011-chudy-format-dostawy.md) | Chudy format dostawy: imgId · nazwa · set · plan; narracja i prompt poza pętlą i poza Kartą Katalogową (sekcja „Druk w Kolekcji") | Częściowo zastąpiona (sekcja „Druk w Kolekcji" — patrz ADR 0014) |
| [0012](0012-zendikar-rekonstrukcja-mapy-t3.md) | Zendikar — mapa rekonstrukcji wariantu T3: podkład własny z kanonu tekstowego (brak oficjalnej mapy), Murasa oznaczona jako przybliżona | Częściowo zastąpiona (adnotacje na podkładzie — patrz ADR 0013) |
| [0013](0013-zendikar-mapa-bez-adnotacji-rekonstrukcyjnych.md) | Zendikar — mapa bez adnotacji rekonstrukcyjnych na podkładzie; proweniencja w map.json i treści strony planu | Zaakceptowana |
| [0014](0014-karta-bez-sekcji-druk-w-kolekcji.md) | Karta Katalogowa bez sekcji „Druk w Kolekcji" — dane wydruku tylko w infoboksie; pogłębianie = lore, nie meta | Zaakceptowana |
| [0015](0015-petla-jakosci-v2-lore-i-warsztat-mapowy.md) | Pętla Jakości v2 — krok 2: pogłębianie LORE; krok 4: kompletacja i jakość map (POI, weryfikacja, wspólny warsztat rysowania T4) | Zaakceptowana |
| [0016](0016-format-wpisu-karty-kanon-katalogowy.md) | Format Wpisu Karty — kanon katalogowy: blok danych Oracle w treści, warstwy mechaniki, odczyt flavoru; bez sekcji „Ilustracja" i „Druk w Kolekcji" | Zaakceptowana |
| [0017](0017-fot-kon-w-tresci-karty.md) | FOT/KON rysują się w treści karty (FOT nad sekcjami, KON pod pierwszą) — koniec przycisków torów; zastępuje mechanikę torów ADR 0008 | Zaakceptowana |
| [0018](0018-wspolny-silnik-mapowy-mapforge.md) | Wspólny silnik mapowy `mapforge` — deterministyczny render SVG z danych (biomy, rzeki, pasma, etykiety pod kątem); warsztat T4 | Zaakceptowana |
| [0019](0019-mapy-planow-czysty-czarno-bialy.md) | Mapy planów w motywie atlasowym — czysty czarno-biały line-art (tusz/papier); kolor tylko dla warstw funkcjonalnych UI | Zaakceptowana (wyjątki kolorystyczne — patrz ADR 0021) |
| [0020](0020-adopcja-wektorowych-obiektow-mapowych-mapaome-i-rzeki.md) | Adopcja wektorowych obiektów mapowych: glify gór z mapome (CC-BY-4.0) jako język rysunku T4; techniki rozsiewu z Azgaar (MIT); rzeki w kolorze morza, bez gradientu i opacity | Częściowo zastąpiona (kolor jeziora — patrz ADR 0021) |
| [0021](0021-styl-map-t4-po-recenzji-prototypu.md) | Styl map T4 po recenzji prototypu Zendikaru: jedna barwa wody dla wszystkich akwenów; kolory funkcjonalne motywu atlasowego (błękit wody, bordowe etykiety); wiążąca kolejność warstw; etykiety siadające przy obiektach; szare ikony osad; pasmo jako jedna bryła | Częściowo zastąpiona (mechanika rozstawu etykiet — patrz ADR 0022) |
| [0022](0022-etykiety-jeden-wzor-i-strefy-zajete.md) | Etykiety wg jednego wzoru: kotwica w centrum obiektu, zawsze POD, konflikt → NAD (drabinka pionowa); nakładka Codexu pozycjonuje od kotwicy zoom-stabilnie; strefy zajęte — biomy nie zakrywają gór/wulkanów/jezior/lodu; obwódka rzek w kolorze linii wody | Częściowo zastąpiona (obwódka rzek wycofana — patrz ADR 0023) |
| [0023](0023-twarde-wiazanie-etykieta-obiekt.md) | Twarda zasada wiązania etykieta ↔ obiekt: nie ma POI bez etykiety (lub nazwana grupa), nie ma etykiety bez twardego punktu (POI/jezioro/punkt w obszarze); walidator `sprawdzWiazania` + test 0 uwag; wycofanie obwódki rzek, ciemniejsza woda atlasu (#d4e2ee), Halimar bez falki | Zaakceptowana |
| [0024](0024-czytelnosc-map-t4.md) | Czytelność map T4: ikony miast/ruin w kołach z nieprzezroczystym tłem; granatowe etykiety wód (#1c3a5e); rozsiew biomów omija boxy etykiet; glify pasm w całości na lądzie; POI `iglica`; trakty między miastami kontynentu; reguły przejść i cieków | Częściowo zastąpiona (boxy etykiet w rozsiewie — patrz ADR 0025) |
| [0025](0025-warstwowe-kolory-pisma-map.md) | Warstwowe kolory pisma: kontynenty/wyspy czerń, wody granat, fragmenty lasów/bagien zieleń (automat po kotwicy w biomie); nakładka przenosi kolory z SVG; napisy NAD lasem (bez polan); klocki `iglica` (g-237) i `wodospad`; kaniony rysowane; drogi bez dubli | Zaakceptowana |
| [0026](0026-fabula-kotwica-transpozycji.md) | Fabuła wraca do dostawy materializacji (imgId · nazwa · set · plan · Fabuła) jako WIĄŻĄCA kotwica transpozycji — sekcje osadzenia karty budowane z Fabuły (spójność z ilustracjami FOT/KON); higiena: osadzenie ≠ kanon MtG, oznaczanie w Źródłach | Zaakceptowana |
| [0027](0027-rozdzielenie-artefaktu-mapy-osobno.md) | Rozdzielenie artefaktu (v2 — drzewo HTML): artefakt główny ~0,2 MB + samowystarczalne strony map `maps/<plan>.html` w `<iframe>` (file:// nie blokuje iframe — offline z dysku działa w pełni); nawigacja z iframe przez postMessage; ZIP = całe drzewo | Zaakceptowana |
| [0028](0028-klocek-fort.md) | Klocek `fort` — warownie jako osobny typ POI (domknięcie E5): ręcznie rysowana sylwetka w kole (nie Azgaar); użycie: Fort Keff + stone havens Akoum; latarnia/wrak z E5 odrzucone (brak kanonicznego użycia) | Zaakceptowana |

Spójnością rejestru (numeracja, statusy, tabela) pilnuje
`test/rejestr-adr.test.js`.

## Szablon

```md
# ADR NNNN: Tytuł

- **Status:** Proponowana
- **Data:** YYYY-MM-DD
- **Decydenci:** ...

## Kontekst

## Decyzja

## Konsekwencje
```

Zasady:

- Nowy ADR powstaje, gdy zmiana ustala granice komponentów, wybiera trwałą
  technologię lub sposób persistence/deploymentu, zmienia model danych albo
  wprowadza trwały kompromis wpływający na wiele funkcji.
- Nie edytuje się historii zaakceptowanego ADR tak, aby zmienić znaczenie
  decyzji — tworzy się nowy ADR, który go zastępuje, a stary oznacza
  statusem „Zastąpiona".
- Decyzja właściciela z czatu trafia do ADR-a w tej samej sesji, w której
  zapadła (w przeciwnym razie przepada wraz z historią rozmowy).
