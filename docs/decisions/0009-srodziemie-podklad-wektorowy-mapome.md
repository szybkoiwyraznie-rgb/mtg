# ADR 0009: Śródziemie — podkład w pełni wektorowy (adopcja mapome SVG)

- **Status:** Zaakceptowana
- **Data:** 2026-08-31
- **Decydenci:** właściciel projektu (propozycja mapy wektorowej zamiast rastrowej, 2026-08-31, czat); agent Arena (sesja PR-1, research i implementacja)

## Kontekst

ADR 0007 ustala dla pilota Śródziemia wariant T1: raster podkładu + wektorowe
warstwy interaktywne. W praktyce researchu (MA1) pojawiły się problemy:

1. **Kandydaci rasterzy to edycje fanowskie** — skany z kolorowymi nalotami
   i adnotacjami, których nie da się wiarygodnie ocenić bez weryfikacji
   wzrokowej (agent w tej sesji nie dysponuje oglądem obrazów — analizował
   je wyłącznie programistycznie, przez maski gęstości atramentu).
2. **Pinezki MA4 wymagają pewnych kotwic** — na rastrze pozycje miejsc
   trzeba by odczytywać „na oko", co jest sprzeczne z protokołem
   (lokalizacja z lore i kotwic, nie z położenia kursora).
3. Właściciel zaproponował (2026-08-31): **iść od razu w mapę wektorową**
   albo wykorzystać kafle mapy online.

## Decyzja

1. **Śródziemie otrzymuje podkład w pełni wektorowy**: szczegółowa mapa
   SVG projektu **mapome** (autor: k1tesurfen, licencja **CC-BY-4.0**,
   źródło: `https://github.com/k1tesurfen/mapome`, plik
   `preview-mapome-slim.svg`, viewBox 3200×2400; ta sama mapa opublikowana
   na Wikimedia Commons jako „Map of Middle-Earth.svg"). Plik trafia do
   repozytorium jako `maps/srodziemie/podklad.svg` z nagłówkiem atrybucji;
   wariant mapy: **T2** (pełna wektoryzacja linii — osiągnięta adopcją
   gotowego źródła, nie trace'owaniem).
2. **Artefakt osadza podkład jako data-URI (base64)** w warstwie `<img>`
   silnika map; pinezki, etykiety i legenda pewności są wektorową
   nakładką HTML/SVG nad podkładem (spójnie z ADR 0001 — jeden plik,
   zero zależności runtime).
3. **Kafle map online: odrzucone.** Artefakt musi działać offline z
   `file://` i na Pages bez zewnętrznych wywołań (ADR 0001/0002); kafle
   to zależność od serwera trzeciego (dostępność, prywatność, licencje).
   Mapy online mogą być co najwyżej linkami w sekcji Źródła.
4. **Trace'owanie rastrów: odrzucone** — bez weryfikacji wzrokowej
   efektu ryzyko błędnych linii jest nieakceptowalne; gotowe źródło
   wektorowe jest lepsze i tańsze.
5. **MA1 dla źródeł wektorowych**: research → weryfikacja licencji
   (CC-BY-4.0: użytek prywatny bezproblemowy; atrybucja w stopce mapy
   i w `map.json`) → rejestr źródła, daty pobrania i licencji w
   `maps/<plan>/map.json`. Podkład zapisujemy w repozytorium jako
   niezmienny snapshot (spójnie z ADR 0004).
6. **Kotwice programistyczne (rozszerzenie MA4)**: mapa ma wersję
   „pełną" (`preview-mapome.svg`) z etykietami jako elementami `<text>`
   w tej samej przestrzeni współrzędnych (×4,1667). Agent wyprowadza
   współrzędne kotwic (Isengard, Edoras, Tharbad, ENEDWAITH, Glanduin,
   Fords of Isen, Helm's Deep, Adorn, Fangorn…) parsowaniem XML — bez
   potrzeby oglądu obrazu. Kotwice zapisujemy w `map.json` (pole
   `kotwice`), pinezki pozostają ustalane z lore względem kotwic.

## Konsekwencje

**Dodatnie:** zoom bez utraty ostrości (poziom T2 osiągnięty na starcie);
pełna powtarzalność ustalania pinezek (kotwice w tekstowym źródle);
brak problemów fanowskich nalotów; atrybucja CC-BY-4.0 czysta; artefakt
pozostaje samowystarczalny.

**Ujemne:** rozmiar artefaktu rośnie o ~2,4 MB (base64 SVG 1,79 MB;
na Pages transfer gzip jest ~4–5× mniejszy, lokalnie plik ładuje się
z dysku); 17 tekstów paska skali w podkładzie renderuje się fontem
domyślnym (kosmetyka, akceptowana); przy przyszłej zmianie podkładu
trzeba przeliczyć pinezki (kotwice w `map.json` to zabezpieczają).
