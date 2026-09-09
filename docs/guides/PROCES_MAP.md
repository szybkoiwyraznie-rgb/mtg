# Gid: Proces mapowy — od researchu do pinezek

Powiązania: [ADR 0007](../decisions/0007-mapa-t1-hybryda.md) (decyzja T1
hybryda i drabina wariantów), `docs/ROADMAP.md` (K3/K4). **Dla wariantu T3
(własny, wektorowy podkład SVG z opisu lore — np. Zendikar) wykonuj wg
[`SKILL_MAPA_PLANU.md`](SKILL_MAPA_PLANU.md):** drabina źródeł, pułapki
nonzero-fill, pixelacja przy zoomie, geometria kontynentów, weryfikacja
`_px.raw`.

Proces uruchamia się, gdy plan/setting ma **pierwszą materializowaną
kartę** (lub zlecenie właściciela). Pilot: Śródziemie, karta 1LTR.

## MA1 — Research podkładu

1. Kwerenda najlepszej istniejącej mapy planu (2–4 zapytania):
   - kryteria: kanoniczność źródła > czytelść w skali ~1600 px >
     rozdzielczość > brak nakładek graficznych (watermarki, ramki
     promocyjne);
   - kandydaci typowo: mapy z atlasów kanonicznych (np. Karen Wynn Fonstad
     dla Śródziemia), mapy oficjalne z publikacji IP, wysokiej jakości
     skany fanowskie tylko przy braku oficjalnych.
2. Pobranie podkładu narzędziem do pozyskiwania obrazów; zapis do
   `maps/<plan>/podklad.(png|jpg)`.
3. Wybór + uzasadnienie zapisane w `maps/<plan>/map.json` (pole
   `zrodlo`: URL, tytuł, autor, data pobrania; notka „użytek prywatny" —
   ADR 0007 §3).
4. Gdy istnieje **gotowa mapa wektorowa** (oficjalna albo adoptowalna),
   wybieramy **T2**: commitujemy/adoptujemy wektor, zachowując jego
   proweniencję w `map.json`.
5. Gdy istnieje **dobry raster**, z którego da się zbudować własny wektor,
   wybieramy **T3**: wektoryzacja z rastra, z jawną proweniencją geometrii
   w `map.json` / nocie źródłowej.
6. Gdy **brakuje użytecznego materiału graficznego**, wybieramy **T4**:
   rekonstrukcję od podstaw z opisów tekstowych, zapisaną
   `rekonstrukcja: true` w `map.json` (proweniencja w danych, bez adnotacji
   na podkładzie — ADR 0013).

   **E4 — nowy plan T4 zaczyna od sceny + mapforge (od 2026-09-01, plan
   `PLAN_2026-09-01-mapforge.md`):** dla każdego nowego planu bez mapy
   nie rysujemy już podkładu ręcznie „od zera". Najpierw budujemy
   `maps/<plan>/scena.json` (deklaratywna scena: lądy, biomy, pasma,
   rzeki, jeziora, POI, etykiety — przekład z map.json/kotwic), potem
   renderujemy podkład silnikiem `tools/mapforge/` (motyw atlas,
   ADR 0019). Katalog klocków i schemat sceny: `tools/mapforge/README.md`;
   warstwy i metody rysowania: `SKILL_MAPA_PLANU.md` §11. Ręczne
   `path'y` dopuszczalne tylko jako świadomy wyjątek (np. doklejenie
   pojedynczego POI do już istniejącego, adoptowanego podkładu).

## MA2 — Struktura danych mapy

`maps/<plan>/map.json`:

```json
{
  "plan": "srodziemie",
  "tytul": "Śródziemie",
  "wariant": "T1",
  "podklad": "podklad.jpg",
  "wymiary": { "szerokosc": 2000, "wysokosc": 1400 },
  "zrodlo": { "url": "…", "tytul": "…", "autor": "…", "pobrano": "YYYY-MM-DD" },
  "rekonstrukcja": false,
  "granice_geograficzne": { "opcjonalnie": "opis układu współrzędnych 0-1" },
  "pinezki": [
    {
      "karta": "1ltr-dunland-crebain",
      "x": 0.31,
      "y": 0.58,
      "pewnosc": "region",
      "uzasadnienie": "Dunland — kraina między Isengardem a Górami Mglistymi (wg mapy kanonicznej); scena na urwisku nad wąwozem."
    }
  ]
}
```

Współrzędne **znormalizowane 0–1** względem podkładu — zmiana rozdzielczości
podkładu nie psuje pinezek.

**Warianty podkładu (ADR 0035).** Mapa może mieć kilka podkładów (np.
raster epoki Dragonstorm + rekonstrukcja epoki khanów) w tablicy
`warianty[]`; współrzędne pinezek i kotwic są wtedy w układzie
**złotym** (wariant `domyslny: true`, kalibracja tożsamościowa), a każdy
inny wariant niesie `kalibracja {sx, sy, ox, oy}` (`x' = ox + sx·x`).
Raster ma `etykiety: false` — Codex pokazuje na nim wyłącznie pinezki.
Przełącznik i `?epoka=<id>` obsługuje silnik. Szczegóły i pomiar
kalibracji: `SKILL_MAPA_PLANU.md` §12.

## MA3 — Pipeline techniczny buildu

1. Źródłowy podkład żyje w `maps/<plan>/podklad.svg|png|jpg`, a dla map
   T3/T4 może być dodatkowo opisany sceną `maps/<plan>/scena.json`.
2. Build kopiuje surowy podkład do `dist/maps/<plan>/<plik>` oraz buduje
   osobną, samowystarczalną stronę `dist/maps/<plan>.html` (ADR 0027 v2).
3. Artefakt główny (`dist/mtg-lore-codex.html` / `dist/index.html`) nie
   niesie ciężkich podkładów inline; zamiast tego osadza stronę mapy przez
   `<iframe>`. Dzięki temu wersja `file://` działa w pełni po rozpakowaniu
   ZIP-a, a rozmiar artefaktu głównego nie rośnie z liczbą planów.
4. Strona mapy renderuje podkład wektorowo inline, gdy źródłem jest SVG,
   oraz jako `<img>` dla PNG/JPG; pan/zoom pozostaje własnym vanilla JS
   (pointer events, dotyk, deep-link `#/mapa/<plan>?pin=<slug>` dla kart
   oraz `?x=<0–1>&y=<0–1>` dla odsyłania stron do miejsca, ADR 0043).
5. Mini-mapy kart korzystają z tego samego surowego podkładu przez
   względny `podkladUrl`.

## MA4 — Protokół pinezek

1. **Skąd współrzędne:** z lore (research regionu/miejsca), nie „na oko".
2. **Poziom pewności:**
   - `dokladna` — miejsce jednoznaczne w kanonie (np. Isengard);
   - `region` — kraina, nie punkt (np. Dunland — pinezka środka regionu);
   - `przyblizona` — rekonstrukcja/niepewność; wymaga `uzasadnienie`.
3. Pole `uzasadnienie` obowiązkowe — test wymaga niepustego przy
   `przyblizona`; silnik pokazuje pewność na mapie (kształt/kolor pinezki).
4. **Na mapie oznaczenia noszą wyłącznie karty (ADR 0043):** nie ma
   pinezek ani obwódek haseł/planów; pole `regiony` wycofane ze schematu.
   Miejsce, które ma oznaczyć hasło (nie karta), nie wchodzi na mapę —
   strona hasła łączy się z mapą odsyłaniem (`?x=&y=`, patrz MA5).

## MA5 — Integracja z resztą bazy

- Strona planu: miniatura mapy + liczba pinezek; klik → `#/mapa/<plan>`.
- Karta Katalogowa: sekcja „Na Mapie" linkuje do deep-linka pinezki.
- Hasła (każdej klasy): sekcja „Na mapie" = zdanie o położeniu +
  JEDNO odsyłanie do mapy zbliżonej w określonym miejscu
  (`#/mapa/<plan>?x=<0–1>&y=<0–1>`); hasło NIE ma pinezki ani obwódki
  na mapie (ADR 0043 — na mapie oznaczenia noszą wyłącznie karty).
- Legenda poziomów pewności na stronie mapy.

## Ocena T1 → decyzja o T2

Po pierwszym pełnym przejrzeniu mapy z pinezkami (zoom na region, etykiety,
mobile) sesja opisuje w PR: co wygląda źle w głębokim zoomie, ile linii
wymagałoby wektoryzacji; właściciel decyduje o T2 dla tej mapy
(ADR 0007 §2). Nie wektoryzuje się „na zapas".

Od ADR 0035 drabina działa też **w drugą stronę**: gdy plan ma już
rekonstrukcję T3/T4, a właściciel dostarczy raster i zdecyduje o commicie,
raster nie wypiera rekonstrukcji — staje się drugim podkładem tej samej
mapy (wariant T1 pod przełącznikiem), a jego układ staje się złotym.
