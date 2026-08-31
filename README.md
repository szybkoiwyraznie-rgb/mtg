# MTG Lore Codex

> **Agent / nowa sesja:** jedyny plik startowy to [`AGENTS.md`](AGENTS.md).
> Czytasz go w całości, potem wszystkie ADR-y, `docs/LESSONS.md` i
> `docs/setup/ENVIRONMENT.md` — **zanim** napiszesz do właściciela.

Encyklopedia („wikipedia") lore prywatnej kolekcji Magic: The Gathering.
Kolekcja nie jest w 100% „vanilla" — karty bywają transpozycjami na inne
plany i światy (również IP nieobecne w oryginalnym MtG, np. Śródziemie,
Warhammer Fantasy). Codex materializuje każdą jawnie przekazaną kartę jako
**Kartę Katalogową**, buduje **Karty Haseł** (wspólne elementy świata:
geografia, fauna, frakcje, magia…) i umieszcza wszystko na **mapach
planów** z pinezkami.

## Status

Fundamenty (PR-1): struktura repo, ADR-y 0001–0008, silnik witryny z pustą
bazą, testy integralności, CI + GitHub Pages. Pierwsza materializacja
(1LTR Dunland Crebain) i mapa Śródziemia — kolejne PR.

## Szybki start

```bash
npm test          # node --test — integralność bazy i dokumentacji
npm run build     # buduje dist/mtg-lore-codex.html (jednoplikowy artefakt)
npm run serve     # serwuje dist/ na localhost:8000 (wygodne na desktopie)
```

Artefakt otwiera się też bezpośrednio z dysku (`dist/mtg-lore-codex.html`,
`file://`) — w tym na iPadzie. Wersja publikowana na GitHub Pages powstaje
automatycznie po scaleniu do `main` (workflow `pages.yml`).

W trybie lokalnym, obok artefaktu może istnieć katalog `img/` z prywatnymi
ilustracjami właściciela (`<imgId>FOT.png`, `<imgId>KON.png`) — wtedy strony
kart pokazują dodatkowe tory obrazów. Na Pages tory te nie istnieją
(cichy fallback).

## Mapa projektu

| Ścieżka | Co to jest |
|---|---|
| `content/cards/` | Karty Katalogowe (markdown + frontmatter) |
| `content/lore/` | Karty Haseł — encje świata |
| `content/planes/` | rejestr planów/settingów |
| `content/co-nowego.md` | dziennik zmian widoczny na stronie „Co nowego" |
| `content/taxonomia.json` | słownik tagów |
| `collection/entries/` | surowe wpisy właściciela — **verbatim, kanon, read-only** |
| `scryfall/` | snapshoty Oracle (źródło mechaniki/nazwy/flavoru) |
| `maps/` | mapy planów (podkład + pinezki) |
| `src/codex/` | silnik witryny (ESM, zero zależności) |
| `tools/` | build, runner testów |
| `test/` | testy integralności bazy |
| `docs/` | ADR, gidy, roadmapa, lekcje, handoffy |

## Zasady w skrócie

- **Pętla jawnego przekazywania:** materializowana jest wyłącznie karta
  wysłana przez właściciela (ADR 0003).
- **Hierarchia kanonu:** narracja właściciela > kanon settingu > Oracle
  Scryfall > wiedza agenta/internet (z cytowaniami).
- **Zero generowanych grafik** (ADR 0008); tory obrazów: Scryfall / FOT /
  KON / twarz syntetyczna.
- **Domyślna praca sesji** bez zlecenia: Pętla Jakości (ADR 0006).

Dokumenty konstytutywne: [`AGENTS.md`](AGENTS.md) (sesje),
[`docs/PRODUCT.md`](docs/PRODUCT.md) (co budujemy),
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) (jak to działa),
[`docs/WORKFLOW.md`](docs/WORKFLOW.md) (jak scalać zmiany),
[`docs/ROADMAP.md`](docs/ROADMAP.md) (kierunki).
