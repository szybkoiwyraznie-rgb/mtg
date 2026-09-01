# ADR 0019: Mapy planów w motywie atlasowym — czysty czarno-biały line-art

- **Status:** Zaakceptowana
- **Data:** 2026-09-01
- **Decydenci:** właściciel projektu (wybór po porównaniu A/B demo mapforge);
  agent Arena (sesja PR-7)
- **Powiązania:** ADR 0008 (paleta pergaminu — doprecyzowana), ADR 0015
  (warsztat T4, benchmark Śródziemia), ADR 0018 (silnik mapforge)

## Kontekst

Silnik mapforge (ADR 0018) oddzielił paletę od geometrii: ta sama scena
renderuje się w wymienialnych motywach. Właściciel porównał demo A/B
(`maps/_warsztat/podklad*.svg`): **pergamin** (barwny, ADR 0008)
i **atlas** (monochromatyczny). Werdykt: monochromatyczny, ale nie
w sepii — **czysty czarno-biały jak adoptowany podkład Śródziemia**
(T2/mapome: sama kreska, zero wypełnień kolorem).

## Decyzja

1. **Mapy planów rysowane warsztatem T4 (mapforge) renderują się
   domyślnie w motywie `atlas`**: tusz (~`#111`) na białym papierze,
   woda biała z klasycznymi liniami wody przy wybrzeżu, korony drzew
   i szczyty górskie konturem, cieniowanie haćurą, rzeki tuszem,
   szlaki kropkowane. Subtelne szarości dopuszczalne wyłącznie
   w detalach (spękania lodu, dym wulkanu, drugie plany).
2. **Kolor zarezerwowany dla warstw funkcjonalnych UI**: pinezki kart,
   ewentualne obwódki regionów haseł (ADR 0015 pkt 6). Artwork mapy
   pozostaje monochromatyczny — kolor znaczy funkcję, nie ozdobę.
3. **Motyw `pergamin` pozostaje w silniku** jako dostępna alternatywa
   (`--styl=pergamin`); dotychczasowe podkłady (Zendikar T3, rysowany
   ręcznie w pergaminie) nie są automatycznie przerysowywane — migracja
   wg planu adopcji ADR 0018 (E1–E3), z oceną właściciela.
4. Paleta pergaminu z ADR 0008 pozostaje obowiązująca dla elementów
   Codexu poza mapami planów (ta decyzja nie zmienia stylu strony).

## Konsekwencje

**Dodatnie:** spójność z benchmarkiem (Śródziemie); monochrom wzmacnia
czytelność symboliki biomów (kształt, nie barwa); wydruk czarno-biały
bez strat; motyw = dane, więc decyzja jest jednolinijkowa przy renderze.

**Ujemne:** rezygnacja z barwnej różnorodności kontynentów (Zendikar
był kolorowy) — świadomy kompromis za „sterylny" porządek; haćura
i kontury wymagają dyscypliny gęstości (audyt kolizji + ocena wzrokowa).

**Dla sesji:** render próbny Zendikaru (E2 planu adopcji) wykonuje się
w motywie atlasowym.
