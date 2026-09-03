# PLAN 2026-09-03 (PR-14) — audyt PR-13, Pętla Jakości, przygotowanie Rawnicy v3

> Roadmapa jednej sesji (zgodnie z AGENTS.md §1.1: PR istnieje przed
> nową pracą). Dostawa sesji: **`kontynuujemy projekt`** + załącznik
> właściciela: 3 warstwy fan-made mapy Dziesiątego Dystryktu (a = granice,
> b = + elementy terenu, c = + POI i labelki) + link Drive jako fallback.

## Kontekst

- Punkt wyjścia: scalony **PR #13** (commit `72d6bac`): Pętla Jakości
  (09-02) + dostawa 137GPT Withstand + mapa Rawnicy v1/v2 + ADR 0030
  (LORE-first) + ADR 0031 (prywatne źródła fanowskie do wektoryzacji).
- Integralność startowa: `npm test` = **102/102**, `npm run build` OK
  (artefakt 303.2 kB, ZIP 12733.8 kB) — zgodnie z handoffem.
- Zlecenie mapowe: Ravnica **v3** — wektoryzacja dostarczonej przez
  właściciela fan-made mapy jako dokładniejszego podkładu (ADR 0031).

## BLOKADA (środowiskowa, nie decyzyjna)

Rastery dostarczone w UI **nie dotarły do sandboxa**: katalog
`/home/user/uploads/` nie istnieje (ten sam objaw co w sesji 09-03
lore-first — załącznik UI niewidoczny dla narzędzi). Egress bezpośredni
zablokowany (curl → 000), `fetch_page` na linku Drive → **HTTP 500**
(próbowane 2026-09-03, dwa warianty URL). Wektoryzacja nie może ruszyć
bez realnych plików. Sesja wykonuje wszystko pozostałe i zostawia
pipeline v3 w stanie gotowym do odpalenia.

## Kolejność kroków (każdy = osobny zielony commit + push)

- **S1 — PR + plan** (ten plik).
- **S2 — Audyt PR #13** (AGENTS.md §1.2/§5): wszystkie pliki zmienione
  w squash-PR-ze (3 sesje: pętla 09-02, dostawa 137GPT + mapa v1,
  mapa v2 + LORE-first v3) — treść (hierarchia kanonu, cytowania,
  szkielet ADR 0030, nienaruszalność wpisu) i kod (mapforge: klocki
  miejskie, dedupe krawędzi, escXml; build; testy). Wynik:
  `docs/audits/AUDYT_2026-09-03-PR13.md` + opis PR.
- **S3 — Pętla Jakości, krok 2 (pogłębianie LORE)**: najsłabsza strona
  wg `tools/wiki-stats.mjs` = **plan ravnica** (7.0/8 — brak wikilinków).
  Pogłębienie sekcji „Ludy” (ludy Rawnicy w erze GPT: cytatami),
  dopisanie encji bold → przyszłe hasła.
- **S4 — Pętla Jakości, krok 3 (link-mining)**: encje w 2+ stronach bez
  hasła → **do 2 nowych haseł**: `boros` (gildia — karta 137GPT, plan
  ravnica, pinezka mapy) i `dziesiaty-dystrykt` (karta, plan, mapa).
  Wikilinki z każdej strony wspominającej; wpis w co-nowego.
- **S5 — Pętla Jakości, krok 4 (pass mapowy, pod-punkt 3: weryfikacja
  dokładności)**: przegląd 55 kotwic + POI + pinezki Rawnicy v2
  względem kanonu (MTG Wiki / GGR / Guildpact-era) z cytowaniem;
  korekty z adnotacją źródła; notatka w `maps/ravnica/mapa-analiza.md`.
  Geometrii v2 NIE ruszamy (własność wektoryzacji v3).
- **S6 — Przygotowanie v3**: `maps/ravnica/zrodlo-fanowska-wektoryzacja.md`
  (dostawa: 3 warstwy + link Drive + data + status „rastery oczekują
  w sandboxie”), procedura ADR 0031 spisana krok po kroku (ekstrakcja
  warstw → render porównawczy → proweniencja → QA: map-audit + testy),
  ROADMAP K7 (status v3), `co-nowego.md`, handoff, opis PR kumulatywnie.

## v3 — gdy rastery będą dostępne (ta sesja c.d. albo następna)

1. Rastery: `/home/user/uploads/{a,b,c}.png` (poza gitem, ADR 0031 pkt 2).
2. Ekstrakcja warstw: (a) obrys + granice precyktów (line-art, czysty);
   (b) wypełnienia elementów terenu (szarości); (c) pozycje POI
   (detekcja ikon po kolorze) + labelki jako źródło nazw/pozycji.
3. Wariant docelowy: **T2+ (podkład adoptowany)** — kierunek wskazany
   kontekstem ADR 0031 („używać podobnie jak mapy Śródziemia”);
   alternatywa: geometria jako matryca mapforge T4 — decyzja na
   porównaniu wizualnym z właścicielem.
4. Przeliczenie kotwic (55) i pinezki 137gpt na nową geometrię
   (uzasadnienie lore bez zmian: P4, bruk przy Tin Street); `map.json`
   v3 (wariant, zrodlo: fan-made prywatny, ADR 0031), `mapa-analiza.md`.
5. QA: render porównawczy (sharp), `map-audit.py`, `npm test`,
   `npm run build`; proweniencja w map.json + zrodlo-*.md.

## Granice sesji

- Nie commitujemy rastrów źródłowych (ADR 0031).
- Nie generujemy grafik (ADR 0008).
- Bez rastery: żadnej geometrycznej zmiany mapy Rawnicy.
