# Audyt 2026-09-01 — pełna Pętla Jakości v2 (ADR 0006/0015)

> Pierwsza pełna pętla po doprecyzowaniach właściciela (krok 2 = LORE,
> krok 4 = kompletacja i jakość map). Wykonana w sesji PR-7, po oddaniu
> poprawek a–j mapy Zendikaru.

## Krok 0/1 — rozpoznanie i integralność

`npm test` 70/70 + build zielone; repo czyste po commitach mapowych.

## Krok 2 — pogłębienie LORE (najsłabsze strony: oba plany, 63%)

Ranking wg `tools/wiki-stats.mjs`: brak sekcji — brak; źródła <2 — brak;
**wikilinki 0 na wszystkich 4 stronach**; plany dodatkowo „pinezka: brak"
(artefakt metryki — patrz krok 5).

- **srodziemie.md**: Geography + akapit o **Tharbad** (miasto-most na
  Gwathló, fort Arnoru/Gondoru, upadek po powodzi T.E. 2912, brodowa
  przeprawa Boromira T.E. 3018 ze stratą konia, Wielka Droga) — źródło:
  Tolkien Gateway „Tharbad".
- **zendikar.md**: Geography + akapit o **Murasaie** wg *A Planeswalker's
  Guide to Zendikar: Murasa and Sejiri* (wyspa-płaskowyż, mur klifów,
  4 wejścia: Sunder Bay / Cliffs of Kazuul / Thunder Gap / Glint Pass,
  Skyfang od zachodu, Na Plateau na wschód od środka, Singing City
  w jej sercu, kanionowe Kazandu z jaddi) + źródło.

## Krok 3 — link-mining

Encje wspólne dla 2+ stron: Dunland/crebain (plan + karta 1ltr),
Coralhelm/Halimar/Tazeem (plan + karta 2bfz), Eldrazi/Roil (plan +
karta 2bfz). **Wszystkie poniżej progu ≥2 kart** → nie zakłada się haseł
(ADR: próg haseł ≥2 kart). Zamiast tego utkano wikilinki między
istniejącymi stronami:

- plany → „Karty kolekcji" w „Setting w pigułce" ([[1ltr-dunland-crebain]],
  [[2bfz-coralhelm-guide]]);
- karty → plan w sekcji „Na Mapie" ([[srodziemie]], [[zendikar]]).

## Krok 4 — pass mapowy (kompletacja i jakość)

1. **Kompletność operacyjna:** pinezki obu kart na miejscu (frontmatter
   + `pinezki` w map.json); brak planów ≥1 karcie bez mapy.
2. **Nowe POI (z cytowaniami):** Zendikar — Na Plateau, Thunder Gap,
   Glint Pass, Cliffs of Kazuul (Guide: Murasa and Sejiri; przejścia
   z adnotacją „pozycja orientacyjna"), Living Spire (Plane Shift);
   Śródziemie — kotwica Dunland (region karty 1LTR, Tolkien Gateway).
   Kotwice: Zendikar 74, Śródziemie 11.
3. **Weryfikacja dokładności:** wykryto sprzeczność z kanonem — Na Plateau
   i Singing City stały na ZACHODZIE Murasy, a Guide lokuje płaskowyż
   „na wschód od środka" z Singing City „w sercu". Przekład geometrii:
   Skyfang → łańcuch od zachodniego muru; Na Plateau + ruinowany marker
   Singing City → wschód; Blackbloom Lake → właściwe Kazandu (kanon
   własnego komentarza); tytuł „Murasa" → nad wnętrzem; usunięte zbędne
   wzgórza, nienazwana ruina i martwy strumyk. `elementy`/`kotwice`
   zsynchronizowane (Living Spire był rysowany, a niezarejestrowany).
4. **Warsztat T4:** zapisany **`tools/map-audit.py`** (ET + spłaszczone
   Bezziery + point-in-polygon + bbox kolizje + pinezki/kotwice; kod
   wyjścia pod CI) — ta logika wykryła wcześniej błędy a–j i kolizje
   z tej tury. Wynik na obu mapach: **0 problemów** (Śródziemie: mapa
   liniowa T2 → testy na-lądzie pominięte z adnotacją). Wnioski
   dopisane do `SKILL_MAPA_PLANU.md` §10.

## Krok 5 — metryka i domknięcie

- `tools/wiki-stats.mjs`: plany mierzone pragmatycznie także w pinezce
  (plan „ma pinezkę", gdy jego mapa pinezkuje choć jedną kartę) — koniec
  z fałszywym „pinezka: brak" dla planów.
- **Completeness: 4/4 strony po 100% (8/8); średnia 100%** (przed pętlą:
  76%). Wikilinki: 0 → 6.

## Czego pętla NIE zrobiła (zgodnie z ADR)

- Nie materializowała kart bez dostawy; nie tworzyła haseł (próg ≥2 kart);
  nie ruszała `collection/entries/`; nie dodawała pól frontmatter
  (poprawka metryki żyje w narzędziu, nie w schemacie stron).
