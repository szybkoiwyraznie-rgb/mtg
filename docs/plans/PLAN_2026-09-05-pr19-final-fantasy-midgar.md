# PLAN PR-19 — Final Fantasy: plan-franczyza + mapa Midgaru + karta 275FIN (2026-09-05)

Sesja: gałąź `arena/01a07207-mtg`, kontynuacja po PR-18 (`45cedb1`).
Wyzwalacz: jawna dostawa właściciela (ADR 0003/0011) — czwarta karta:

> **275FIN Aerith Rescue Mission** (FIN, Final Fantasy). W ogromnym szybie
> schodowym budynku Shinra w Midgarze metalowe schody zawracają na wielu
> piętrach w chłodnym turkusowym świetle technicznym, przeszywanym
> czerwonymi błyskami lamp alarmowych. Na jednym z dolnych podestów stoi
> Cloud Strife z kolczastymi blond włosami i Buster Sword na plecach,
> patrząc w górę; obok niego Tifa Lockhart w białej koszulce i czarnej
> spódnicy, Barret Wallace z karabinem-protezą zamiast ręki. Wyżej, na
> jednym z podestów, widać samotną postać Aerith Gainsborough w różowej
> sukience i czerwonej kamizelce — więziona przez Tsenga z Turks. Cała
> drużyna Avalanche wspina się razem — Cloud na przedzie, ale każdy z nich
> pcha go wyżej po każdym piętrze; w Midgarze sama Shinra zbudowała drogę,
> po której po raz pierwszy AVALANCHE pójdzie w górę, nie w dół.

## Decyzje właściciela (2026-09-05, czat)

1. **Struktura:** jeden plan „Final Fantasy” z mapą per część sagi
   (rozbudowa modelu o klucz `plan/podmapa`); NIE osobne plany per świat
   gry i NIE kontynenty na jednej mapie. → **ADR 0032**.
2. **Mapa Midgaru:** T3 — wektoryzacja z płaskiego schematu
   „Midgar Mass Transit System Map” (ReverendRyu); raster pseudo-3D
   (VGCartography) odrzucony przez właściciela; fallback T4, gdyby
   referencja zawiodła.
3. **Inkrementalność:** mapy kolejnych części sagi powstają dopiero
   z kartami, które ich potrzebują.

## Research mapy (2026-09-05)

- **T2 (gotowy wektor, jak Śródziemie/mapome): BRAK** — przeszukane sieć
  i repozytoria fanowskie; istnieją wyłącznie rastry/rendery.
- **Wzorzec T3 (wybrany):** ReverendRyu, „Final Fantasy VII – Midgar Mass
  Transit System Map”,
  https://www.deviantart.com/reverendryu/art/Final-Fantasy-VII-Midgar-Mass-Transit-System-Map-361170637
  (CC BY-NC-ND 3.0). Ocena vision: płaski schemat metra — radialne koło
  8 sektorów (1–8) wokół huba 0 „Shinra Central”, pierścienie (Perimeter /
  Sector Access / Central Complex / Shinra Shuttle / Cross-City Link)
  i szprychy; topologia zgodna z kanonem układu Midgaru. Raster poza
  gitem; proweniencja w `map.json`; wektor = samodzielna transkrypcja.
- **Odrzucony:** VGCartography, „Midgar Map Layout”,
  https://www.deviantart.com/vgcartography/art/Final-Fantasy-VII-Midgar-Map-Layout-1252359941
  — pseudo-3D, „scale is weird” (przyznanie autora).
- **Kanon pomocniczy (kotwice):** https://finalfantasy.fandom.com/wiki/Midgar
  (sektory, slumsy, Train Graveyard, budynek Shinra).

## Zmiana modelu (krok P2)

- `tools/content-loader.mjs`: rejestr map skanuje `maps/<plan>/map.json`
  ORAZ `maps/<plan>/<podmapa>/map.json`; klucz podmapy = `plan/podmapa`.
- `tools/build.mjs`: strony map podmap = `maps/<plan>/<podmapa>.html`,
  podkłady `maps/<plan>/<podmapa>/<plik>`; ZIP obejmuje drzewo; istniejące
  plany (płaskie) bez zmian zachowania.
- `tools/map-audit.py`: audyt dwóch poziomów katalogów.
- Testy: rozszerzenie `test/mapy.test.js`/fixture o podmapę; dotychczasowe
  102 testy zielone bez zmian.

## Kroki (każdy zielony: `npm test` + `npm run build` + `map-audit` = commit + push)

| # | Zakres | Pliki |
|---|---|---|
| P1 | Dokumentacja: ADR 0032 + rejestr + ten plan + ROADMAP | `docs/` |
| P2 | Silnik: rejestr `plan/podmapa` (loader/build/audit) + testy | `tools/`, `test/` |
| P3 | Mapa Midgaru T3: `maps/final-fantasy/midgar/{map.json,podklad.svg}` — styl atlasowy (ADR 0019/0021/0022), kotwice kanoniczne: budynek Shinra (scena ratunku), Slumsy Sektora 7 (Avalanche, Seventh Heaven), Slumsy Sektora 5 (dom i kościół Aerith), Sektor 6 (Wall Market), Train Graveyard, talerze/mur zewnętrzny; temat „w górę, nie w dół” | `maps/` |
| P4 | Treść: `scryfall/275fin-aerith-rescue-mission.json` (API), wpis `collection/entries/`, plan `content/planes/final-fantasy.md`, karta `content/cards/275fin-aerith-rescue-mission.md` (9 sekcji ADR 0030, pinezka `final-fantasy/midgar`) — komplet parzystości w jednym commicie (ADR 0003) | `scryfall/`, `collection/`, `content/` |
| P5 | Domknięcie sesji: co-nowego, PROJECT_HISTORY, handoff, opis PR | `content/`, `docs/` |

## Ryzyka i zasady

- Fanowskie nazwy stacji MMTS częściowo wynalezione (np. „Venus Gospel
  Oak”, „Squalll Rise”) — na mapę wchodzą **wyłącznie** nazwy kanoniczne.
- Licencja CC BY-NC-ND: raster NIE jest redistribuowany (poza gitem,
  referencja prywatna) — wektor to samodzielna transkrypcja topologii
  (precedens Ravniki, ADR 0031; zastrzeżenia ADR 0012 zachowane).
- Schemat MMTS nie jest geometrią metryczną — wektor dziedziczy topologię
  i styl atlasowy, nie proporcje rastra.
- Zero generowanych grafik (ADR 0008); zero zależności npm (ADR 0002).

## Źródła

- Scryfall (dane wydruku; collector_number 5 — imgId 275FIN to numer
  kolekcji właściciela, patrz L8):
  https://scryfall.com/card/fin/5/aerith-rescue-mission
- ReverendRyu MMTS (referencja T3): jak wyżej.
- Fandom, hasło Midgar: jak wyżej.
