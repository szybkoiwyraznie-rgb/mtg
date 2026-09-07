# ADR 0035: Warianty podkładu jednej mapy — raster fanowski T1 w repozytorium, przełącznik epok i JEDEN układ współrzędnych (złoty = raster T1)

- **Status:** Zaakceptowana
- **Data:** 2026-09-07
- **Decydenci:** właściciel (decyzje w czacie sesji PR-21, 2026-09-07:
  „Tak, chcę iść w tą stronę” — T1 dla Tarkiru; potem doprecyzowanie:
  przełącznik T1 Dragonstorm ↔ T4 Khans, pinezki wszystkich kart w obu
  widokach, w T1 wszystkie labelki wyłączone — czysty raster z lokalizacją
  koordynatami, koordynaty identyczne między mapami epok ze złotym
  standardem = raster T1; prawa autorskie nieistotne — projekt prywatny);
  plik rastra wgrany przez właściciela commitem `f1b0057`
  („Add files via upload”, `tarkir.jpeg` w katalogu głównym); realizacja:
  agent Arena
- **Zastępuje / zmienia:** ADR 0031 §2 („raster nie musi trafiać do repo”
  — dla Tarkiru właściciel zdecydował inaczej; §2 pozostaje regułą
  domyślną, commit binarium jest decyzją per plan); ADR 0007 (T1 =
  „oficjalny podkład” — dopuszcza się T1 na rasterze fanowskim
  dostarczonym przez właściciela); ADR 0033 uzupełnienie o Tarkir
  (z jednej mapy fizycznej z etykietami epoki khanów robią się DWA
  podkłady epok pod przełącznikiem — topografia nadal wspólna, więc §2
  ADR 0033 nie jest naruszony: to nie osobna mapa, lecz osobny podkład
  tej samej mapy); precedens PR-13 (Ravnica odrzuciła T1 z powodów
  licencyjnych — `maps/ravnica/mapa-analiza.md`) przestaje być
  blokadą: projekt jest prywatny (ADR 0031), a wymiana podkładu przy
  upublicznieniu pozostaje obowiązkiem z ADR 0007 §3
- **Powiązane:** ADR 0007 (model T1 hybryda, pinezki 0–1), 0008 (`img/`
  poza gitem — NIE dotyczy podkładów map, które są danymi projektu),
  0027 (strony map w `dist/maps/`, podkłady jako pliki obok), 0029
  (stopki czasu), 0032 (podmapy — inny mechanizm: osobne mapy, osobne
  współrzędne), LESSONS L10 (raster po każdej zmianie mapy)

## Kontekst

Tarkir (PR-21, pakiet 3, karta 509KTK *Highland Game*) dostał mapę T4
(rekonstrukcja kanoniczna mapforge, epoka khanów) narysowaną na
geometrii rastra fanowskiego „Tarkir Map 2025 (EN)” (Lore Café / MTG
Wiki Italia, grafika 3d4, epoka *Tarkir: Dragonstorm*). Właściciel po
obejrzeniu obu obok siebie stwierdził, że sam raster jest lepszym
podkładem do czytania scen (ręczna kartografia, pełne nazewnictwo
TDM) — a rekonstrukcja T4 zostaje jako mapa epoki khanów. Powstały trzy
pytania modelu danych: (1) czy raster może być w repo, (2) jak jedna
mapa ma mieć dwa podkłady o RÓŻNYCH proporcjach (4307×3293 vs
2000×1400) bez dublowania pinezek, (3) co z etykietami Codexu na
rastrze, który ma własne napisy.

Silnik map (ADR 0007/0009) od początku obsługiwał raster jako podkład
(`<img class="mapa-podklad">`), ale tylko JEDEN podkład na mapę, a
współrzędne pinezek były względne do tego jednego podkładu.

## Decyzja

1. **Raster fanowski może być podkładem T1 w repozytorium** — wyłącznie
   gdy właściciel sam go dostarczy i zdecyduje o commicie (tu: zrobił to
   własnym commitem). Plik żyje w `maps/<plan>/podklad-t1.jpg` (pełna
   rozdzielczość — właściciel chce zoomu do detalu; 11,6 MB jest
   akceptowalne w drzewie `dist/maps/<plan>/`, ADR 0027) plus miniatura
   `podklad-t1-mini.jpg` (~1200 px) dla mini-map kart. Proweniencja
   i licencja („All Rights Reserved”, użytek prywatny) są zapisane w
   `map.json` (`warianty[].zrodlo`) i widoczne w atrybucji strony mapy.
   Przy upublicznieniu Codexu podkład T1 podlega wymianie (ADR 0007 §3);
   T4 (praca własna) zostaje.
2. **Warianty podkładu jednej mapy.** `map.json` może nieść tablicę
   `warianty[]`: `{ id, domyslny, tytul, epoka, wariant (T1–T4),
   podklad, miniatura?, wymiary, etykiety, kalibracja, zrodlo }`. Mapa
   bez `warianty` zachowuje się dokładnie jak dotąd (silnik syntetyzuje
   jeden wariant z pól płaskich). Na stronie mapy pojawia się
   **przełącznik** (przyciski w oknie mapy, `?epoka=<id>` w deep-linku);
   przełączenie NIE resetuje widoku — punkt złoty pod środkiem okna
   i wizualna skala zostają, pinezki nie drgają. Strona planu, karta
   i lista pinezek nie zmieniają się.
3. **JEDEN układ współrzędnych = złoty = wariant domyślny (tu raster
   T1).** Pinezki kart i kotwice POI mają jedne `x, y` (0–1 względem
   rastra Lore Café 4307×3293). Każdy inny wariant niesie
   `kalibracja {sx, sy, ox, oy}` (afiniczna, osiowa): `x' = ox + sx·x`,
   `y' = oy + sy·y`. Dla Tarkiru T4: `sx 0.908609, sy 0.992421,
   ox 0.045695, oy 0` — wyprowadzona z generatora (płótno 2000×1400 z
   odczytów podglądu 1568×1208 przez `R(px,py)`; pełny raster = podgląd
   × 2.7468) i sprawdzona na 26 POI. Nowa pinezka Tarkiru = odczyt
   `X, Y` na pełnym rasterze → `x = X/4307, y = Y/3293`; w T4 trafia
   sama. Generator T4 dostał funkcję `P(X, Y)` (odczyt z pełnego
   rastra) i wszystkie 26 POI zmierzono ponownie na pełnym rasterze,
   żeby obiekt w T4 leżał dokładnie tam, gdzie pinezka w T1.
4. **Wariant bez etykiet Codexu.** `etykiety: false` (T1 Tarkiru)
   wyłącza w tym widoku WSZYSTKO, co Codex rysuje poza pinezkami:
   etykiety podkładu, etykiety i obwódki regionów. Raster ma własne
   napisy; Codex dokłada tylko pinezki kart — w obu widokach te same.
5. **Epoki (rozszerzenie ADR 0033):** gdy plan ma kilka linii czasowych
   na wspólnej topografii, a właściciel dostarczy raster jednej z epok,
   mapa może mieć **po jednym podkładzie na epokę** pod przełącznikiem
   (T1 Dragonstorm ↔ T4 Khans), zamiast osobnych map. Kryterium osobnej
   MAPY (inne współrzędne, osobne pinezki) pozostaje zmiana topologii
   (ADR 0033 §2). Nazwy epoki niesie podkład; karta pinuje raz.

## Konsekwencje

- Silnik (`render-map.js`): `wariantyMapy()`, `wariantDomyslny()`,
  `doUkladuWariantu()`; sceny `[data-scena data-epoka]` (jedna widoczna),
  nakładka liczy pozycje przez kalibrację aktywnej sceny; etykiety
  podkładu niosą `data-epoka` i klasę `poza-epoka`, gdy ich podkład nie
  jest aktywny; przełącznik `[data-epoka-przelacz]`. Build kopiuje
  podkłady i miniatury wariantów do `dist/maps/<plan>/`, wstrzykuje
  `podkladUrl`/`podkladMarkup` per wariant; mini-mapa karty bierze
  miniaturę wariantu domyślnego. `map-audit.py` przelicza pinezki i
  kotwice kalibracją wariantu audytowanego SVG.
- Kotwice regionów/krain Tarkiru (bez POI) zostały przeliczone z T4
  kalibracją (odczyt z podglądu, ±30 px T4) — przy kolejnej karcie w
  danym regionie warto domierzyć je na pełnym rasterze (`px_t1`).
- Rozmiar pakietu: `dist/maps/tarkir/` z 4,2 MB → ~16 MB; artefakt
  główny bez zmian (0,5 MB).
- Reguła precedensu: brak zgody właściciela na commit = raster zostaje
  poza repo (ADR 0031 §2). Nie generujemy rastrów (ADR 0008 nadal
  w mocy — to plik dostarczony, nie wygenerowany).
- Do zrobienia przy następnym rasterze innego planu: ten sam wzorzec
  (`podklad-t1.jpg` + miniatura + `warianty[]`), kalibracja liczona
  z generatora danego planu.
