# Research mapowy: Warhammer Fantasy — wybór wariantu podkładu

> **STATUS: WYKONANY (2026-09-10, MA1).** Rekomendacja przedstawiona
> właścicielowi do decyzji przed rysowaniem (ADR 0038 pkt 4: dla
> znaczącego planu wariant przedstawia się właścicielowi). Do czasu
> decyzji mapa planu = `pending`; pinezka karty 39MM2 żyje jako opis w
> sekcji „Na Mapie".
>
> **REKOMENDACJA: T1 (raster z etykietami)** — kandydat A (oficjalna
> mapa *Warhammer: The Old World*, GW 2024). Fallback: T3 z rastra A.
> T4 **odrzucone** (jest doskonały materiał graficzny — byłoby to
> złamanie drabiny ADR 0038).

Powiązania: ADR 0038 (drabina T2→T1→T3→T4), ADR 0031 (prywatne rastry
fanowskie/oficjalne jako źródło), ADR 0039 (piramida LOD dla dużych
rastrów), ADR 0043 (na mapie tylko pinezki kart), precedensy: Faerûn
(T1, `RESEARCH_2026-09-08-faerun-mapa-t1.md`), Dominaria (LOD),
Tarkir/Innistrad (raster z etykietami).

## 0. Drabina preferencji (ADR 0038) — jak zastosowana

| Rząd | Wariant | Czy dostępny dla WHF? | Werdykt |
|---|---|---|---|
| 1 | **T2** (gotowy wektor SVG dobrej jakości) | Praktycznie NIE | patrz §3 |
| 2 | **T1** (wyśmienity raster oficjalny/fanowski) | **TAK — obficie** | **WYBÓR** |
| 3 | T3 (dobry raster do zwektoryzowania) | Tak (fallback) | rezerwa |
| 4 | T4 (rekonstrukcja z tekstu) | — | odrzucone (materiał istnieje) |

Zgodnie z drabiną schodzimy od T2. T2 odpada (brak dobrego wolnego
wektora — §3). Na rzędzie T1 jest materiał **bezkonkurencyjny**
(oficjalna, świeża mapa całego świata z etykietami) — zatrzymujemy się
tu, nie schodząc do T3/T4.

## 1. Kryteria (z ADR 0038/0039 + precedensy Faerûn/Tarkir/Innistrad)

- **kanoniczność źródła** > czytelność w skali ~1600 px > rozdzielczość
  > brak nakładek promocyjnych (watermarki, ramki);
- T1 = jeden raster (JPG/webp) renderowany jako `<img>` + wektorowa
  nakładka pinezek; **etykiety i ikony miejsc muszą być NA podkładzie**
  (`etykiety: false` — raster samowystarczalny, ADR 0035);
- pokrycie zgodne z opisem planu (Stary Świat + Badlands + Worlds Edge
  Mountains — sceny zielonoskórych i przyszłe karty Imperium/Bretonnii);
- wymiar klasy Tarkir/Faerûn (krawędź 4000–6000+ px) = optimum
  czytelność/rozmiar; dla bardzo dużych → LOD jak Dominaria (ADR 0039).

## 2. Kandydaci (ogląd wizualny wykonany 2026-09-10)

| # | Źródło | Pokrycie | Etykiety/ikony | Rozdz. | Styl / uwagi |
|---|---|---|---|---|---|
| **A** | **Oficjalna mapa *Warhammer: The Old World*** (Games Workshop / Warhammer Community, 2024) | **Cały Stary Świat**: Bretonnia, Imperium (wszystkie prowincje), Kislev, Norsca, Troll Country, Worlds Edge Mountains, **Badlands**, Border Princes, Tilea, Estalia | **Tak** — nazwy krain + herby frakcji + ikony miast, nadrukowane | wysoka (plakatowa, malowana) | **REKOMENDOWANY.** Świeży, kanoniczny, pełny kolor; profil identyczny jak Faerûn 3E (kandydat A tam). Wersja rozszerzona (z Landem of the Dead/Nehekharą, Dark Lands) pokrywa też południe i wschód. |
| B | Gitzman „Super Huge Detailed Map of the Old World" (SHDMOTWOW), fanowski | Cały Stary Świat + Badlands + Dark Lands, **z osadami orków/goblinów/skavenów** | Tak, gęste | **ekstremalna** (do 29 952×22 528 px, PDF/JPG 350–388 MB) | Najbogatszy w szczegóły (w tym siedliska zielonoskórych — idealne pod pinezki), ale **zbyt ciężki** bez agresywnego LOD; styl mniej „malarski". Doskonała rezerwa/uzupełnienie do lokalizacji POI. |
| C | Stitch fanowski z oficjalnej strony The Old World (Reddit, 6655×9818 px) | Cały świat (oficjalne kafle zszyte) | Tak | 6655×9818 | Oficjalna geometria, wygodny rozmiar; jakość zależna od zszycia — do rozważenia, jeśli A będzie trudny do pobrania. |
| D | Curtis Wright Maps — druk plakatowy oficjalnej mapy TOW | Cały Stary Świat | Tak | druk (foto) | Produkt fizyczny; wersja cyfrowa = A. |
| E | Mapy z Total War: Warhammer | Świat gry (zbliżony) | Tak, ale brand gry | wysoka | Odrzucony: branding/UI gry, geografia gameplayowa ≠ ścisły kanon WHFB. |

**Wykluczone / niepożądane:**
- interaktywna mapa GW z theoldworld.com — **zdjęta przez GW w 2025**
  (Reddit), brak stabilnego pliku;
- edycje drukowane / Patreon (Mapynieprakyczne, Mike Schley) — płatne,
  bez wolnej wersji cyfrowej;
- BG3/gry — mapy in-game, brak pliku i inny kanon.

## 3. Dlaczego NIE T2

Brak dobrego, wolnego **wektora** całego Starego Świata o
akceptowalnej jakości. Warhammer Fantasy nigdy nie miał oficjalnego
SVG geografii świata; fanowskie wektoryzacje są cząstkowe (pojedyncze
prowincje Imperium) albo niskiej jakości. Precedens Faerûn jest
pouczający: tam istniał fanowski wektor (Vectorized Realms), ale
właściciel go **skasował** („działa powoli, brzydki, bez ikon") na
rzecz oficjalnego rastra T1. Dla WHF nie ma nawet tego — T2 odpada bez
wątpliwości.

## 4. Dlaczego NIE T4 (uzasadnienie wymagane przez ADR 0038 pkt 2)

T4 to ostateczność „gdy brak użytecznego materiału graficznego". Tu
materiału jest w nadmiarze: oficjalna mapa GW (A), gigantyczny raster
fanowski (B), zszycie oficjalne (C). Rekonstrukcja z tekstu byłaby
jawnym złamaniem drabiny i marnotrawstwem. **T4 odrzucone.**

## 5. Rekomendowany plan realizacji (po decyzji właściciela)

1. Właściciel pobiera raster **A** (oficjalna TOW, wersja bez
   watermarku „Warhammer Community" jeśli dostępna; jeśli nie —
   watermark w rogu jest akceptowalny, jak logo na innych T1) i wrzuca
   do `maps/warhammer-fantasy/master.jpg` (JPG q92, docelowo 4–6 MB).
   *Agent nie pobiera — sandbox blokuje media-CDN-y GW/Reddit.*
2. Jeśli krawędź > ~5000 px → siatka LOD jak Dominaria/Faerûn
   (`tools/kafle.mjs`: L0 ~1920 px + kafle L1 512 px, próg ~2.5).
3. `maps/warhammer-fantasy/map.json`: `wariant: "T1"`, `etykiety:false`,
   `zrodlo` (GW/Warhammer Community, użytek prywatny), warstwa POI
   wektorowa pod przyszłe pinezki (opcjonalnie, ADR 0038 pkt 7: **nic
   nie doklejamy** na rastrze z własnymi etykietami bez konsultacji).
4. Przeliczenie pinezki **39MM2 Brute Force** odczytem siatki 5% —
   rejon **Badlands** (południe mapy, na płd. od Border Princes, przy
   Worlds Edge Mountains); pewność **region** (scena „na polu bitwy",
   bez konkretnego miasta).
5. Kalibracja kotwic głównych krain (Badlands, Worlds Edge Mountains,
   Reikland/Altdorf, Bretonnia) do przyszłych kart.

## 6. Pinezka 39MM2 do czasu mapy

Rejon: **Badlands** — kanoniczna ojcowizna orków (Lexicanum: „their
homeland can be said to be the area known as the Badlands"). Scena
Fabuły to bezimienne, błotniste pole bitwy — brak konkretnego miasta,
więc docelowa pewność = **region** (środek Badlands). Do powstania mapy
opis żyje w sekcji „Na Mapie" karty (PROCES_MAP.md krok 6).
