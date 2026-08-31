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
| [0005](0005-szkielety-stron-i-protokol-wikilinkow.md) | Szkielety stron (Karta Katalogowa, Karta Haseł) i protokół wikilinków | Zaakceptowana |
| [0006](0006-petla-jakosci-jako-praca-domyslna.md) | Pętla Jakości jako domyślna praca sesji | Zaakceptowana |
| [0007](0007-mapa-t1-hybryda.md) | Mapy planów — T1 hybryda z rasterowym podkładem | Zaakceptowana |
| [0008](0008-tory-obrazow-fot-kon.md) | Tory obrazów: brak generowanych grafik; FOT/KON lokalnie z cichym fallbackiem | Zaakceptowana |
| [0009](0009-srodziemie-podklad-wektorowy-mapome.md) | Śródziemie: podkład w pełni wektorowy (mapome, CC-BY-4.0) zamiast rastra; T2 przez adopcję | Zaakceptowana |
| [0010](0010-hierarchia-kanonu-v2-karta-i-lore-nad-narracja.md) | Hierarchia kanonu v2: karta MtG + lore świata > narracja kolekcji (kotwica osadzenia, nie kanon); zastępuje hierarchię ADR 0003 | Zaakceptowana |

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
