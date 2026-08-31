# ADR 0012: Zendikar — mapa rekonstrukcji wariantu T3 (podkład własny)

- **Status:** Zaakceptowana
- **Data:** 2026-08-31
- **Decydenci:** właściciel projektu (feedback G, tura 2026-08-31: „robimy mapę wektorową Zendikaru, można się wzorować na mapach fanowskich”); agent Arena (sesja PR-2, rekonstrukcja i implementacja)

## Kontekst

Zendikar ma w bazie pierwszą kartę (2BFZ Coralhelm Guide, osadzoną na Tazeem),
więc wg PROCES_MAP (MA1) plan wymaga mapy. Śródziemie rozwiązano adopcją
podkładu wektorowego mapome (ADR 0009, wariant T2). Dla Zendikaru:

1. **Oficjalna mapa planu nigdy nie powstała** — Wizards nigdy nie opublikowało
   mapy całego Zendikaru; istnieją tylko opisy tekstowe geografii
   (*Planeswalker's Guide to Zendikar*, *Plane Shift: Zendikar*, artbook
   *The Art of Zendikar*) oraz mapy fanowskie (m.in. interpretacja siedmiu
   kontynentów z r/mtgvorthos).
2. **Mapy fanowskie nie są kanonem i mają wątpliwe licencje** — adopcja (T2)
   byłaby podszywaniem się pod kanon i ryzykiem prawnym (zasada „zero
   zapożyczonych grafik”).
3. Agent w sesji nie dysponuje oglądem obrazów, więc i tak nie mógłby
   skopiować układu fanowskiego 1:1 — a kopiowanie nie jest celem.

## Decyzja

Mapa Zendikaru powstaje w **wariancie T3** (PROCES_MAP MA1 pkt 4): podkład
w pełni autorski, kodowany ręcznie SVG, z flagą `rekonstrukcja: true`:

- **Układ kontynentów z kanonu tekstowego** (Plane Shift: Zendikar):
  Sejiri na biegunie, wulkaniczne Akoum na północnym wschodzie (Oko Ugina),
  Bala Ged łączące przesmykami Akoum z bagiennym Guul Draz (Malakir),
  Tazeem na zachód od Guul Draz przez wąski ocean (Halimar, tama Sea Gate,
  Emeria w ruinach nieba), Ondu na południowym zachodzie (Agadeem, Beyeen,
  Wyspy Jwar), Murasa jako kontynent odległy.
- **Wzorowanie się układem map fanowskich** (propozycja właściciela) —
  kompozycja ogólna zbliżona do rozpowszechnionych interpretacji, ale
  żaden element nie jest kopią.
- **Niepewność widoczna na mapie:** położenie Murasy jest w kanonie
  nieustalone — kontynent ma linię brzegową przerywaną i podpis
  „(położenie przybliżone)”; podpis kartograficzny w rogu podkładu
  jednoznacznie mówi, że całość jest rekonstrukcją.
- **Styl własny strony** (pergamin, serafinia paleta Codexu), nie styl
  map oficjalnych ani fanowskich — mapa nie udaje kanonu.
- Źródłem podkładu (`zrodlo` w `maps/zendikar/map.json`) jest kanon
  tekstowy z adnotacją o wzorowaniu się na mapach fanowskich.

## Konsekwencje

- Pinezka 2BFZ (Coralhelm Refuge) ma pewność **region** — karta lokalizuje
  osadę na wybrzeżach Halimar, nie na konkretnym brzegu (protokół MA4,
  uzasadnienie obowiązkowe).
- Kotwice etykiet podkładu (Tazeem, Halimar, Sea Gate, Akoum, Guul Draz,
  Bala Ged, Ondu, Sejiri, Murasa, Oko Ugina, Malakir, Emeria, wyspy Ondu)
  będą bazą dla pinezek kolejnych kart Zendikaru.
- Jeśli Wizards kiedyś opublikuje oficjalną mapę, decyzję należy
  ponowić (wariant T2/T1 zamiast rekonstrukcji).
- Rekonstrukcja jest „żywa”: kolejne karty mogą ją korygować
  (każda zmiana podkładu = świadoma decyzja w Pętli Jakości).
