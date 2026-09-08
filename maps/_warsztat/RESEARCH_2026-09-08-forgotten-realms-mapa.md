# Research mapowy: Forgotten Realms (Faerûn) — wybór wariantu

> **Decyzja właściciela (2026-09-08, wieczór):** „Stop! Nie ma sensu
> szukać, ściągać, eksplorować jeśli jest dostępna mapa wektorowa."
> Projekt prywatny, **bez publicznej dystrybucji** ⇒ licencja nieistotna
> przy użytku prywatnym; jeśli istnieją pliki SVG do pobrania — **pobrać
> i zastosować**; **T2 = pierwszy wybór**; atrybucja w stopce tak jak z
> mapami rastrowymi Tarkiru/Innistradu; T1 tylko gdyby wektorów nie było.
>
> **Wynik:** wektory istnieją ⇒ wariant **T2 (przyjęcie)** — podkład
> `maps/forgotten-realms/podklad.svg` z repozytorium **Vectorized Realms**
> (jonovotny), plik `faerun-v016-40dpi.svg`.

## Errata 2026-09-09 (audyt PR-25)

Ten dokument zachowuje historię **odrzuconego** wariantu T2 i jego
lokalnych współrzędnych, ale nie jest już źródłem prawdy dla geografii
Faerûnu. W pierwszym przejściu pomylono kilka nazw i relacji:
**Luruar** opisano jak południowe mokradła, **Sea of Fallen Stars**
potraktowano osobno od **Inner Sea**, a południowy akwen czytano jak
„Morze Wewnętrzne”, choć na mapie 3E chodzi o **Lake of Steam**.
Obowiązujący zapis kanoniczny i kotwice robocze żyją w
`maps/forgotten-realms/map.json` (wariant T1 po decyzji właściciela).

## 0. Kotwica: karta inicjująca 3CLB Nefarious Imp

Dostawa właściciela (2026-09-08): mroczny gabinet wojenny na
**Wybrzeżu Mieczy**; nad dębowym stołem szkarłatny imp; pod nim
dopala się mapa taktyczna, miniaturowe figurki żołnierzy
poprzewracane i stopione; w szponie skradziony kryształ pulsujący
światłem; z kłębów czarnego dymu formuje się widmowy obraz
potężnego artefaktu — wizja, po którą chochlik przybył.

Fakty o karcie (Scryfall API, snapshot `scryfall/3clb-nefarious-imp.json`):
**Nefarious Imp**, *Commander Legends: Battle for Baldur's Gate*
(set **CLB**, 2022-06-10, numer kolekcjonerski **137**),
`{2}{B}` 2/1, Creature — Imp, Flying; „Whenever one or more
permanents you control leave the battlefield, scry 1"; inskrypcja
„It listens to all of their plans and plots creative ways to turn
them to ruin."; ilustracja **Konstantin Porubov**.

Wniosek lokacyjny: **Wybrzeże Mieczy, Faerûn** — scena nie nazywa
miasta ani dworu ⇒ pinezka z pewnością **rejonu** (środek pasa,
0.18/0.38 w układzie złotym).

## 1. Inwentarz: co w ogóle istnieje

### 1.1. Rastrowe (nieosiągalne w sandboxie)

Kanoniczne mapy Faerûn są rastrowe (oficjalne `faerun3e.jpg` z WotC,
mapy Fandoma z 2e/3e/5e, mapy z *Forgotten Realms Campaign Setting*).
Sandbox blokuje wszystkie media-CDN-y (static.wikia.nocookie.net —
TLS error, web.archive.org / upload.wikimedia.org / media.wizards.com /
raw.githubusercontent.com — odpowiedź 000). Jedyne działające
pobieranie dużych binarików to **GitHub API git blobs**
(`gh api …/git/blobs/<sha>` + base64, limit 100 MB). `image_search`
daje tylko miniatury (max ~2880×1640) — nie nadają się na podkład
master. **Ścieżka rastrowa odrzucona** — zgodnie z decyzją:
wektor ma pierwszeństwo.

### 1.2. Wektorowe — Vectorized Realms (github.com/jonovotny/vectorized-realms)

Repozytorium wektorowe ustawów D&D (autor: u/the_domokun; dane
z mapy 3.5e; źródła autorskie 2e/1e/Realmshelp/Whitehead/FR Fandom;
blog o projekcie 2025-06-26). **Brak pliku LICENSE** — brak otwartej
licencji (konsekwencja: §3).

| # | Plik | SHA blob (GitHub API) | Rozmiar | Ocena |
|---|---|---|---|---|
| V1 | `faerun-v016-40dpi.svg` | `bbcb745f…` | **4 290 499 B** | **WYBRANY** — kompletny Faerûn z warstwą wody, stylizowany, viewBox `0 0 3055.4079 2043.6418` |
| V2 | `faerun-data.svg` | `2bf07c88…` | — | warstwy danych, **brak warstwy wody** (render: morza czarne/przezroczyste) ⇒ samodzielny podkład nieosiągalny |
| V3 | `faerun-filtered.svg` | `033d9ae1…` | — | **tylko crop zachodni** (Sword Coast/Moonshaes) — niekompletny |
| V4 | `faerun-v016-07.svg` | `abefd56c…` | 11 MB | nowszy wariant, nie pobierany (V1 wystarczający) |

Pobranie: `gh api repos/jonovotny/vectorized-realms/git/blobs/<sha>
--jq '.content' | tr -d '\n' | base64 -d > podklad.svg` (raw
GitHub CDN zablokowany — §1.1).

## 2. Weryfikacja wizualna V1

Render referencyjny `@resvg/resvg-js` (dev-only, precedens Śródziemia):
- całość ~10 s; crop 5% + siatka ~90 s → `/tmp/fr-crop.png`
  (odczyt: Wybrzeże Mieczy = pas x 0.14–0.19, y 0.05→0.68;
  Moonshaes 0.05–0.09/0.22–0.34; Nelanther 0.06–0.14/0.55–0.68;
  High Forest 0.15–0.25/0.1–0.3; pustynia N 0.25–0.35/0.05–0.25);
- całość + warstwa etykiet 2200w ~53 s → `/tmp/fr-etykiety.png`
  — **wszystkie 9 etykiet dobrze osadzonych** (wizualnie
  zweryfikowane).

Wynik: podkład czytelny, granice akwenów i lądów zgodne z kanonem
(oficjalna `faerun3e.jpg` jako wzorzec), skalowalny (wektor).

## 3. Kwestia licencji

Plik V1 **nie ma otwartej licencji** (repo bez LICENSE). Zgodnie z
decyzją właściciela (2026-09-08): projekt prywatny, bez publicznej
dystrybucji ⇒ użytkowanie prywatne; atrybucja źródła w stopce mapy
(warunek silnika: `mapa.zrodlo` → stopka auto, wzór podkładów
rastrowych Tarkiru/Innistradu). `zrodlo` w `map.json`:
jonovotny/vectorized-realms + informacja o braku otwartej licencji
i decyzji właściciela.

## 4. Układ współrzędnych i pinezka

Układ **złoty** = viewBox podkładu (0–1 × 0–1; px = norm ×
(3055.4079, 2043.6418)). Kotwice (9 regionów, typ `region`,
`pozycja_zrodlo` = odczyt z siatki §2):

| Kotwica | x | y |
|---|---|---|
| Wybrzeże Mieczy | 0.19 | 0.40 |
| Morze Upadłych Gwiazd | 0.52 | 0.42 |
| Wyspy Moonshaes | 0.078 | 0.27 |
| Wyspy Nelanther | 0.10 | 0.62 |
| Amn | 0.155 | 0.87 |
| Luruar | 0.42 | 0.80 |
| Morze Wewnętrzne | 0.735 | 0.655 |
| Królestwo Wysokie | 0.62 | 0.885 |
| Morze Bezludne | 0.86 | 0.92 |

Pinezka **3clb-nefarious-imp**: (0.18, 0.38), pewność **region**
— środek Wybrzeża (Neverwinter–Waterdeep); fabuła nie nazywa
miasta, więc nie wymyśla się lokalu.

## 5. Etykiety

Model Śródziemia/mapome (T2): silnik inline'uje podkład as-is
(`svgTypograficzny=false` dla T2 — `render-map.js`), więc etykiety
muszą być **`<text>` w podkładzie** — skalują się z zoomem.
Kotwice w `map.json` to warstwa danych (testy/proweniencja), nie
render. Warstwa `#kodex-etykiety` (9 etykiet PL, Georgia, halo
`paint-order:stroke`) dołączona do `podklad.svg` przed `</svg>`.
**High Forest** celowo wyłączone z v1 — polska nazwa niepewna.

## 6. Wniosek i decyzja

- **Wariant: T2 (przyjęcie)** — `maps/forgotten-realms/podklad.svg`
  (= V1 + warstwa etykiet) + `maps/forgotten-realms/map.json`.
- T1 odrzucony (wektory istnieją — decyzja właściciela).
- T3/T4 nie wchodzą w grę (istnieje podkład źródłowy).

## 7. Źródła

- Vectorized Realms: https://github.com/jonovotny/vectorized-realms
  (blog: https://vectorized-realms.vercel.app/data/ — 2025-06-26)
- GitHub API git blobs — SHA-e z §1.2 (pobieranie w sandboxie).
- Forgotten Realms Wiki (EN/PL) — kanon geograficzny i nazewnictwo PL:
  https://forgottenrealms.fandom.com/wiki/Forgotten_Realms
- D&D Beyond / WotC — oficjalna mapa Faerûn (3e) jako wzorzec granic:
  https://www.dndbeyond.com
- ADR 0038 (drabina T2→T1→T3→T4), ADR 0027 v3 (inline SVG),
  ADR 0043 (piny = tylko karty).
