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
4. Gdy mapy nie ma (świat custom): wariant T3 — mapa proceduralna z opisów
   lore, zapisana `rekonstrukcja: true` w map.json (proweniencja w danych,
   bez adnotacji na podkładzie — ADR 0013); styl własny (nie podszywanie
   pod kanon).
5. T4 — rekonstrukcja wzniesiona na **wspólnym warsztacie mapowym**
   (ADR 0015): te same zasady co T3 plus reużywalne metody rysowania
   (pasma górskie, rzeki, biomu), wspólna paleta i pamięć warsztatu
   w `SKILL_MAPA_PLANU.md`; jakościowo dąży do mapy Śródziemia (T2)
   i wyżej. Mapa T3 dojrzewa do T4 wraz z warsztatem.

   **E4 — nowy plan zaczyna od sceny + mapforge (od 2026-09-01, plan
   `PLAN_2026-09-01-mapforge.md`):** dla każdego nowego planu bez mapy
   (T3/T4) nie rysujemy już podkładu ręcznie „od zera". Najpierw budujemy
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
  ],
  "regiony": [
    { "haslo": "dunland", "ksztalt": "SVG path lub bbox", "pewnosc": "przyblizona" }
  ]
}
```

Współrzędne **znormalizowane 0–1** względem podkładu — zmiana rozdzielczości
podkładu nie psuje pinezek.

## MA3 — Pipeline techniczny T1

1. SVG kontener (viewBox = wymiary podkładu) + `<image>` z podkładem
   (plik obok, osadzony w `dist/` podczas builda — patrz niżej).
2. Warstwy wektorowe: pinezki (symbol + label), regiony (path/bbox),
   etykiety. Ostre w każdym zoomie.
3. Build wstrzykuje mapę do artefaktu: podkład jako base64 (rozmiar rośnie
   o rozmiar pliku — świadomy koszt, pojedyncze MB na plan) LUB link do
   pliku obok artefaktu w trybie lokalnym. Decyzja implementacyjna w PR
   mapy; priorytet: artefakt ma działać z `file://` i na Pages.
4. Pan/zoom: własny vanilla JS (pointer events, obsługa dotyku,
   przybliżenie do pinezki deep-linkiem `#/mapa/<plan>?pin=<slug>`).

## MA4 — Protokół pinezek

1. **Skąd współrzędne:** z lore (research regionu/miejsca), nie „na oko".
2. **Poziom pewności:**
   - `dokladna` — miejsce jednoznaczne w kanonie (np. Isengard);
   - `region` — kraina, nie punkt (np. Dunland — pinezka środka regionu);
   - `przyblizona` — rekonstrukcja/niepewność; wymaga `uzasadnienie`.
3. Pole `uzasadnienie` obowiązkowe — test wymaga niepustego przy
   `przyblizona`; silnik pokazuje pewność na mapie (kształt/kolor pinezki).
4. Pinezka bez karty (region hasła geograficznego) idzie do `regiony`,
   nie `pinezki`.

## MA5 — Integracja z resztą bazy

- Strona planu: miniatura mapy + liczba pinezek; klik → `#/mapa/<plan>`.
- Karta Katalogowa: sekcja „Na Mapie" linkuje do deep-linka pinezki.
- Hasła `geografia`/`postac`: obwódka/region na mapie, jeśli ustalony.
- Legenda poziomów pewności na stronie mapy.

## Ocena T1 → decyzja o T2

Po pierwszym pełnym przejrzeniu mapy z pinezkami (zoom na region, etykiety,
mobile) sesja opisuje w PR: co wygląda źle w głębokim zoomie, ile linii
wymagałoby wektoryzacji; właściciel decyduje o T2 dla tej mapy
(ADR 0007 §2). Nie wektoryzuje się „na zapas".
