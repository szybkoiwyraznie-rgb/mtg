# ADR 0041: Pokrycie L2 tylko z nowym detalem; mapa Dominarii = L0 + L1 (bez nakładki „Domeny”)

- **Status:** Zaakceptowana
- **Data:** 2026-09-08
- **Decydenci:** właściciel projektu (decyzja 2026-09-08, czat: „Mapa
  Aerony ładowana jako bardziej szczegółowa na zoomie o odpowiedniej
  głębokości (deep-zoom-reload) nic nowego nie wnosi. To jest ta sama
  mapa tylko wycięta z tej dużej. Możesz spokojnie usunąć tą deep-mapę
  Aerony i zostawić dużą mapę (w kafelkach)… Cała mapa niech składa się
  z dwóch elementów → jednej dużej całościowej mapy FHD + mapa
  kafelkowa od pewnego poziomu zoomu”); agent Arena (sesja PR-25 —
  spisanie i realizacja)
- **Doprecyzowuje:** ADR 0039 (piramida LOD — cel szczebla L2 i §8 w
  części „L0 inline”), ADR 0035 (warianty), ADR 0007 (T1)
- **Powiązane:** ADR 0038 (drabina wariantów), LESSONS L10 (ogląd) i
  L13 (kalibracja na obiektach), audyt `docs/audits/AUDYT_2026-09-08-
  PR24.md` (F2/F4/F5/F7)

## Kontekst

Pierwsza wersja mapy Dominarii (PR-24) miała trzy szczeble: L0 (FHD
przeglądowa, `l0.jpg`), L1 (kafle 16×11×512 z mastera 8100×5200, próg
S1 2.5) i L2 („Domeny” — pokrycie `aerona.jpg` 2767×2155, próg S2 6,
kalibracja M1↔D1 z fitu RMSE). Recenzja właściciela: deep-zoom „nic
nowego nie wnosi — to jest ta sama mapa tylko wycięta z tej dużej”.
Ogląd rastrowy (L10, sesja PR-25) potwierdził: master M1 niesie gęstą
toponimię czytelną na zoomie kafelków (Cathedral of Serra, Sursi, Kish,
Foriys, Nelanther, The Arena…), a D1 jest pochodną tej samej rodziny
(rastry Varghedina, geometria Blando) — pokrycie powtarza toponimię
bazy w innej typografii, nie daje nowych nazw ani geometrii. ADR 0039
§2 już zakładało L2 = „Inna mapa (nowa toponimia) — wejście
z przenikaniem”; implementacja na Dominarii odstąpiła od własnego celu
(wycinek, nie inna mapa).

## Decyzja

1. **Pokrycie L2 wnosi detal albo nie istnieje.** Warunek przyjęcia:
   nowa toponimia, wyższa rozdzielczość geometrii nazwanych obiektów
   albo inny detal epoki — tzn. rzeczy **nieobecne w bazie**. **Wycinek
   mapy bazowej (ta sama toponimia, ta sama ręka) jest zabroniony** —
   dodaje bajty i szew (ghosting), nie informację. Kryterium weryfikuje
   się wizją (L10) PRZED dodaniem pokrycia: jeśli nazwane obiekty i
   toponimia widoczne na bazie na zoomie kafelków pokrywają okolice
   pinezek — pokrycia nie buduje.
2. **Mapa Dominarii ma dokładnie dwa szczeble:** L0 (FHD, `l0.jpg` —
   pierwszy render i tor `<img>` mapy) + L1 (kafle `kafle/` 16×11×512,
   od progu S1 2.5). Nakładka „Domeny” (D1) znika, `aerona.jpg` usuwane
   z repo i dist. **Mechanizm L2 w silniku (`render-map.js`, ADR 0039)
   pozostaje** — dla przyszłych map, które mają realny detal.
3. **Pinezka 40USG stoi wprost na bazie:** współrzędne odczytane z
   mastera M1 (układ złoty, L13) — ikona Cathedral of Serra na Sursi,
   nie z pokrycia przez kalibrację.
4. **Korekta ADR 0039 §8 („L0 inline w stronie mapy”):** implementacja
   nie inlinuje rastra L0 — L0 jest **linkowany `<img>`** (tor rastrowy
   ADR 0027 v2: `file://` blokuje `fetch`, ale nie blokuje `<img>`;
   offline z dysku działa tak samo). Litera ADR 0039 w tym punkcie jest
   tym samym niezgodna z implementacją i ulega korekcie: „L0 w stronie
   mapy — raster jako `<img>` (szybki start, offline); inline
   wyłącznie, gdy podkładem jest SVG (markup)”.

## Konsekwencje

**Dodatnie:** mapa lżejsza (−1,65 MB repo, −1,65 MB dist/ZIP), brak
szwu i ghostingu L1↔L2 na Domenach, jedna toponimia (M1) jako źródło
prawdy, pinezka z bezpośrednią proweniencją (master). Sufit zoomu
kmax 22 pokrywa potrzebę — master ma 8100 px szerokości, więc kafel
512 px daje ostrość „do detalu” w całym oknie Domen.

**Ujemne:** przy maksymalnym przybliżeniu rejonu Aerony ostrość
ogranicza rozdzielczość mastera (8100 px) — świadomy wybór właściciela
(kryterium: „kafelkowa mapa od pewnego poziomu zoomu” wystarczy). Gdy
wypłynie NAPRAWDĘ inna, gęstsza mapa Domen (inna ręka, nowa
toponimia, inna epoka) — L2 wraca per pkt 1, z mierzalną kalibracją
(L13) i testem.

**Dla sesji agentskiej:** przed dodaniem pokrycia L2 — porównanie
wizualne kafel bazy vs pokrycia w tym samym zoomie; brak nazwanego
obiektu lub toponimii nieobecnej w bazie = pokrycie odrzucone (audyt
łapie to L10/L12); mapy jedno- i dwuszczelbowe są pełnoprawne —
piramida rośnie tylko z realnym detalem.
