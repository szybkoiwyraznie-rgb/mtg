# PLAN PR-20: pakiet Alara — 305ARB Illusory Demon + mapa scalonej Alary (T4)

Data: 2026-09-05. Branch: `arena/01a07207-mtg` (pakiet jedzie w otwartym PR #18).

## Cel

Materializacja karty właściciela `305ARB Illusory Demon` (ARB, Alara
Reborn) z mapą planu Alara i planem-franczyzą MTG. Scena: Maelstrom —
wir many w punkcie złączenia pięciu shardów; istota-błąd światła
wyglądająca jak demon.

## Decyzje (ustalone z właścicielem 2026-09-05)

1. **Epoki:** jedna mapa planu = aktualny stan kanoniczny (post-Conflux).
   Sceny z epoki shardów (ALA) pinuje się do regionów tej mapy; osobna
   podmapa pre-Conflux wyłącznie, gdy karta będzie miała scenę
   niereprezentowalną na mapie scalonej. Sformalizowane jako ADR 0033.
   Uzasadnienie kanoniczne: Conflux scalił te same masy lądu (regiony
   zachowały tożsamość), a Maelstrom — scena karty — powstał dopiero
   w Conflux (mtg.wiki/Maelstrom), więc mapa „przed” nie uniosłaby
   tej karty.
2. **Tier mapy: T4** (rekonstrukcja kanoniczna) — w sieci brak wektora
   (T2) i brak oficjalnego rastra kartograficznego (T3); istnieją tylko
   key arty/panoramy shardów. Geometria: pięć regionów w kanonicznym
   cyklu many (sąsiedzi dzielą dwa kolory: Bant–Esper–Grixis–Jund–
   Naya–Bant) jako sektory wokół centralnego Maelstromu (kanon: wir
   w punkcie złączenia pięciu shardów).
3. **Numery:** imgId właściciela `305ARB` (klucz FOT/KON) ≠ collector
   number Scryfall `21` (ARB/21). Oba zapisane w snapshocie
   (`notka_numery`, LESSONS L8) — nigdy nie nadpisywać jednego drugim.

## Zakres

- `collection/entries/305arb-illusory-demon.md` — fabuła dostawy
  verbatim (kotwica transpozycji, ADR 0026).
- `scryfall/305arb-illusory-demon.json` — snapshot (pobrano 2026-09-05).
- `content/cards/305arb-illusory-demon.md` — karta LORE-first,
  9 sekcji (ADR 0030); pinezka dokładna: Maelstrom.
- `content/planes/alara.md` — plan: historia epok, regiony, Maelstrom.
- `maps/alara/{podklad.svg,map.json}` — T4; 16 kotwic (Maelstrom,
  5 regionów, 5 obelisków przy szwach — pozycje reprezentatywne
  z proweniencją, 5 miejsc kanonicznych — pozycje reprezentatywne);
  paleta w granicach whitelisty ADR 0021 (achromat + bordowe etykiety).
- `docs/decisions/0033-…md` — decyzja epok.
- `test/ui-smoke.test.js` — asercje: plan Alary → mapa, tytuł/iframe,
  karta 305ARB (imgId, tytuł, deep-link pinezki).

## Źródła kanoniczne

- https://mtg.wiki/page/Alara — historia, regiony, status „Reunited”.
- https://mtg.wiki/page/Maelstrom — wir powstały w Conflux; istoty
  zrodzone z burzy; Illusory Demon wśród kart Maelstromu.
- https://scryfall.com/card/arb/21/illusory-demon — dane karty,
  flavor „In the Maelstrom, a trick of the light can feast on human
  flesh.”
- Doug Beyer, „Graduation Day” (2009):
  https://web.archive.org/web/20210429201516/https://magic.wizards.com/en/articles/archive/savor-flavor/graduation-day-2009-06-10

## Kryteria odbioru

npm test zielone (w tym nowe asercje), build zielony, map-audit 0
problemów, preview renderuje mapę Alary i kartę 305ARB z pinezką
w Maelstrom; wpis co-nowego; handoff zaktualizowany.
