# Źródło fanowskie — mapa Dziesiątego Dystryktu Ravniki (wektoryzacja v3)

> **Status:** kandydat do v3 mapy Ravniki, po decyzji właściciela z 2026-09-03
> i ADR 0031. Rastery źródłowe NIE trafiają do repozytorium.
> **Stan (2026-09-03, sesja PR-14):** dostarczone w 3 warstwach (a/b/c,
> patrz niżej), ale **rastery nie dotarły do sandboxa** — katalog
> `/home/user/uploads/` nie istnieje mimo załącznika w UI (ten sam objaw
> co w sesji 09-03 lore-first); egress bezpośredni zablokowany,
> `fetch_page` na linku Drive → HTTP 500 (dwie próby URL). Wektoryzacja
> czeka na realne pliki; procedura poniżej jest gotowa do odpalenia.

## Źródło

- **Dostawa:** właściciel, 2026-09-03, trzy warstwy tej samej mapy:
  - `a.png` — podstawowa siatka granic (obrys miasta + granice precyktów,
    czysty line-art);
  - `b.png` — siatka + wypełnienia elementów terenu (szarości: zabudowa,
    wody, place);
  - `c.png` — pełna wersja z **POI i labelkami** (ikony gildii/znaczniki
    + wszystkie nazwy).
- **Fallback (właściciel):** link Google Drive do mapy:
  `https://drive.google.com/file/d/1rLgh2NNppWuB1GNogHHmEzjcPHQGMc-F/view`
  (w sandboxie niedostępny — brak egressu).
- **Charakter źródła wg właściciela:** fan-made mapa wektorowa w formie
  zrzutów; projekt prywatny/niepubliczny — dopuszczone użycie jako
  dokładniejszego źródła geometrii (ADR 0031).
- **Relacja do v2:** v2 opiera się na tekstowej transkrypcji oficjalnej
  mapy GGR i własnym rysunku mapforge. Kandydat v3 ma iść dalej: przejąć
  dokładne obrysy, granice, arterie i pozycje POI z mapy fan-made,
  podobnie jak Śródziemie korzysta z gotowego podkładu wektorowego.

## Co widać na dostarczonych obrazach (weryfikacja UI, 2026-09-03)

Czarno-biała, czysta stylistyka atlasowa; baner tytułowy
„The Tenth District of Ravnica" + róża wiatrów (N u góry — zgodna
z konwencją v2). Warstwy:

- **a (siatka):** zewnętrzny obrys miasta; sześć precyktów
  (FOUR płn.-zach., FIVE zach., SIX płd.-zach., ONE płd.-centrum,
  TWO płd.-wsch., THREE wsch.); granice precyktów przerywaną kreską;
  arterie (Tin Street, Transguild Promenade/Plaza Avenue); Undercity
  jako ciemna warstwa pod południowo-zachodnią krawędzią.
- **b (+ teren):** szare wypełnienia: zabudowa (m.in. kwartał przy
  Sunhome), place (Tenth District Plaza), wody (Zonot Seven przy P5),
  rubblebelt na północy.
- **c (+ POI i labelki):** znaczniki z kolorami gildii i pełny zestaw
  nazw: Skarrg, Millennial Platform, Red Wastes, Transguild Promenade,
  The Canopy, Vitu-Ghazi, Beast Haven, The Great Concourse, Concordance,
  Sunhome, Nivix, Tin Street, The Blistercoils, Hightower, Prism
  University, Ismeri Library, Zonot Seven & Zameck, Smelting Quarter,
  Gore House, Foundry Street, Kamen Fortress, The Bulwark, Tenth District
  Plaza, Orzhova, Vizkopa Bank, Plaza West, Chamber of the Guildpact,
  Plaza South, Whitestone, New Prahv, Statue of Agrus Kos, Augustin
  Station, Griffin Heights, Medori Park, Rix Maadi („under Smelting
  Quarter"), Wayport, Deadbridge Chasm, Benzer's Bridge, Nightveil &
  Duskmantle, Korozda & Svogthos, Undercity.

Uwaga kompozycyjna: układ fan-made RÓŻNI się od geometrii v2 (inna
kompozycja, proporcje i orientacja precyktów) — v3 to nowa geometria
1:1 ze źródłem, nie korekta v2 (analogia: przebudowa koordynatów v1→v2).

## Plan użycia w v3 (gotowa procedura; wymaga realnych plików)

1. **Gdy rastery będą w sandboxie** (`/home/user/uploads/{a,b,c}.png`
   albo równoważna ścieżka) — potwierdzić dostępność narzędziami.
2. **Ekstrakcja warstw** (ADR 0031 pkt 4 — kontrolowany trace, nie ślepe
   potrace):
   - `a` → linie: obrys miasta, granice precyktów, arterie (progi
     ciemności; wektoryzacja linii do ścieżek SVG);
   - `b` → wypełnienia terenowe jako zamknięte poligony (progi szarości);
   - `c` → pozycje POI: detekcja znaczników po kolorze/kształcie →
     centroidy; labelki = źródło nazw i pozycji napisów (w tekście SVG,
     nie jako przetrace'owany obraz).
3. **Wariant wynikowy:** docelowo **T2+ (podkład adoptowany)** — kierunek
   wskazany kontekstem ADR 0031 („używać podobnie jak mapy Śródziemia");
   alternatywa: geometria jako matryca mapforge T4 (wtedy `scena.json`
   zostaje źródłem geometrii, a adoptowany SVG tylko podglądem).
   Decyzja na porównaniu wizualnym z właścicielem.
4. **Synchronizacja danych:** `map.json` v3 (wariant, `zrodlo`:
   fan-made prywatny + ADR 0031 + data), kotwice (55) przeliczone na nową
   geometrię, pinezka 137gpt (uzasadnienie lore bez zmian: P4, bruk przy
   Tin Street — pozycja przeliczona geometrycznie).
5. **QA (ADR 0031):** render porównawczy z `c.png` (sharp, cropy),
   `map-audit.py`, `sprawdzWiazania`, `npm test`, `npm run build`;
   opis różnic w `mapa-analiza.md` (rozdział v3).

## Uwagi

- Rastery źródłowe są prywatnym materiałem roboczym właściciela. Nie
  trafiają do repo bez osobnej decyzji (ADR 0031 pkt 2).
- Kanon nazw i przynależności precyktów nadal weryfikujemy wobec źródeł
  lore (rozdział weryfikacji PR-14 w `mapa-analiza.md`); mapa fan-made
  daje geometrię, nie automatycznie wyższy poziom kanonu.
- Labelki z `c.png` traktujemy jako REJESTR POI źródłowy (nazwy +
  przynależność do precyktów wg obrazu); nazwy sprowadzane do pisowni
  kanonicznej (np. „Blistercoils") — rozbieżności opisujemy w v3.
