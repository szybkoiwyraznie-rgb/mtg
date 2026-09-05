# ADR 0033: jedna mapa planu = aktualny stan kanoniczny; sceny z innych epok pinowane do regionów

- **Status:** Zaakceptowana
- **Data:** 2026-09-05
- **Decydenci:** właściciel projektu (decyzja 2026-09-05 w czacie sesji:
  „jedna mapa z geografią post-Conflux wystarczy na cały plan — geografia
  się nie zmieniła, nastąpiło złączenie i powstanie Maelstromu; byty
  z Alary przed połączeniem mogą być lokowane w shardach po połączeniu”);
  agent Arena (sesja PR-20)
- **Kontekst:** pakiet PR-20 (Alara, karta 305ARB). Alara ma dwie
  fundamentalnie różne geografie: pre-Conflux (pięć odłamów-shardów
  dryfujących osobno w Blind Eternities) i post-Conflux (jeden scalony
  plan z Maelstromem w punkcie złączenia). Powstało pytanie o model
  epok: jedna mapa, dwie mapy czasowe, czy mapa „przed”?
- **Powiązania:** ADR 0026 (fabuła dostawy kotwicą), ADR 0031/0032
  (proweniencja map; plany-franczyzy), ADR 0032 nie jest naruszony —
  dotyczy światów bez kanonicznych relacji przestrzennych (sagi),
  nie epok jednego planu.

## Kontekst

Kanon (mtg.wiki, hasła Alara i Maelstrom): Sundering rozłamał Alarę
na pięć odłamów wzdłuż linii many; Conflux scalił te same masy lądu
z powrotem w jeden plan, a w punkcie złączenia pięciu shardów powstał
Maelstrom. Regiony zachowały tożsamość (Bant pozostaje Bantem itd.) —
zmienił się stan planu, nie położenie „kontynentów” względem siebie
w obrębie scalonej całości. Sceny z epoki ALA (Shards of Alara) dzieją
się więc w regionach, które istnieją także na mapie post-Conflux;
jedynym bytem przestrzennym, którego nie ma pre-Conflux, jest sam
Maelstrom.

## Decyzja

1. Plan MTG reprezentuje **jedna mapa w aktualnym (ostatnim
   kanonicznym) stanie planu** — dla Alary: post-Conflux. Sceny kart
   z wcześniejszych epok pinuje się do regionów tej mapy (epokę sceny
   niesie fabuła i sekcje karty, nie osobna geometria).
2. **Osobne mapy epok** powstają wyłącznie, gdy epoki różnią się
   TOPOLOGIĄ niereprezentowalną na jednej mapie (np. zniknięcie
   całego kontynentu) — i tylko na żądanie karty, która takiej sceny
   potrzebuje (inkrementalność, ADR 0015).
3. Plany-franczyzy wielu światów (ADR 0032, Final Fantasy) pozostają
   modelem podmap per świat — to nie epoki, lecz odrębne przestrzenie.

## Konsekwencje

- `content/planes/alara.md` ma `mapa: alara` (jedna mapa, wariant T3 — transkrypcja fanowskiej topologii (ADR 0031);
  geografia post-Conflux z Maelstromem w centrum).
- Karta 305ARB (scena w Maelstrom, era ARB) pinuje dokładnie
  w Maelstrom; przyszłe karty ALA pinują do swoich regionów.
- Nie buduje się map „na zapas” epoki pre-Conflux — pięć odłamów
  wróci jako podmapa wyłącznie, gdy karta będzie miała scenę
  niereprezentowalną na mapie scalonej (np. „przestrzeń między
  shardami w Blind Eternities”).
- Proweniencja epoki w `map.json`: pole `zrodlo.notka` explicite
  niesie stan planu, który mapa przedstawia.
