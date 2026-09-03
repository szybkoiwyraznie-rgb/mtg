# PLAN — 2026-09-03 — PR-15: Ravnica v3 — finalizacja wektoryzacji (odzysk po zawieszeniu)

## Kontekst

Poprzednia sesja (PR-14, gałąź `arena/01a0668a-mtg`) przygotowała v3 mapy Ravnicy,
ale wektoryzacja była **zablokowana środowiskowo** — rastery źródłowe (a/b/c.png)
nie dotarły do sandboxa. Odzyskano je na gałęzi `szybkoiwyraznie-rgb-patch-3`
(`maps/ravnica/{a,b,c}.png`, 6849×5292). Zawieszony agent (sesja 09-03-after-PR14)
wykonał WIP v3 w sandboxie, ale **zawiesił się midwork i nic nie trafiło na GitHub**;
odzyskany jednoplikowy `.patch` (`01a0668a-*.patch`) na gałęzi
`szybkoiwyraznie-rgb-patch-5` odtwarza jego working tree.

**Cel:** dokończyć mapę Ravnica v3 tak, by **całkowicie zastąpiła v2**, była zgodna
z ADR-ami (0007/0013/0015/0018/0021/0022/0023/0026/0031), przeszła `map-audit`
(0 problemów), `sprawdzWiazania` (0 uwag) oraz zielone `npm test` + `npm run build`.

## Odzysk (wykonane)

1. `.patch` na `szybkoiwyraznie-rgb-patch-5` → zastosowany czysto na bazie `72d6bac`
   (PR-13) w `/home/user/recovery/mirror/`.
2. Rzeczywista delta vs `main` = **3 pliki**: `maps/ravnica/{map.json,podklad.svg,scena.json}`
   (pozostałe 10 plików patcha identyczne z PR-14).
3. Rastery źródłowe wyekstrahowane do `/home/user/recovery/zrodla/{a,b,c}.png`
   (POZA gitem, ADR 0031 pkt 2) — podejrzane wizualnie: a=siatka, b=+biomy,
   c=+POI/labelki.
4. Working tree (arena/01a06700-mtg) ma odtworzone te 3 pliki.

## Diagnoza odzyskanego v3 (WIP)

- **`scene.json` nie renderuje się spójnie z `podklad.svg`:**
  `node tools/mapforge/cli.mjs maps/ravnica/scena.json` → SVG **~36 MB**,
  a odzyskany `podklad.svg` = **38 KB** (to ślad bezpośredniego trace'u, nie render
  sceny — v2 render jest byte-identyczny z commitowanym `podklad.svg`).
- `sprawdzWiazania` na odzyskanej scenie: **29 uwag** (26 POI bez etykiety +
  3 etykiety na cudzym POI) — naruszenie ADR 0023.
- `map-audit` na odzyskanym `podklad.svg`: **72 problemy**; po normalizacji palety
  (lad `#f2f2f2`→`#f7f7f7`, tło `#ffffff`→`#d4e2ee`) ∈ **6** (same kolizje etykiet)
  → geometria z rastra jest w większości poprawna, główna wada to nieprzyporządkowana
  paleta atlasowa i brak etykiet/POI w podkładzie.
- `npm test` 102/102 zielone i `npm run build` zielone **mimo to** — bo Ravnica
  nie jest bramkowana przez `mapforge.test.js` (tylko Zendikar+demo) ani przez `map-audit`
  (nie jest w `ci.yml`). **To maskuje stan, nie oznacza poprawności.**

## Wariant wynikowy: **T2+ (podkład adoptowany, czysty SVG)** — decyzja właściciela

Uzasadnienie: właściciel zdecydował (dalej: „chcę mapę jak najbliższą
oryginałowi, czyli raczej T2 w stylu Śródziemia") — v3 = **T2+ podkład
adoptowany**: czysty, ręcznie wektoryzowany SVG (sylwetka, granice,
arterie, teren, znaczniki, tekst) + `map.json` v3 z przeliczonymi
kotwicami i pinezką. **Ścieżka T4/mapforge-render jest odrzucona.**
Odzyskany `podklad.svg` (38 KB) to w pełni wektorowy podkład ze
wszystkimi POI/labelkami — dokładnie kształt T2+ (jak Śródziemie:
`podklad.svg` + `map.json`, bez `scena.json`). `scena.json` z WIP
została usunięta (scena T4 niespójna z ADR 0023 — 29 uwag — i rzędu
36 MB po renderze).

## Kolejność (inkrementalne commity, każdy = zielone testy+build)

- **S1** Odzysk + plan + PR na starcie. Commit odtworzonych 3 plików (
  stan WIP, udokumentowany) — żeby praca już nie wisiała tylko w sandboxie.
- **S2** Analiza luk: porównanie POI/labelek z `c.png` vs `scena.json`; spis
  brakujących elementów (zadanie z pytania właściciela).
- **S3** Finalizacja T2+ adoptowanego podkładu: normalizacja palety atlasowej
  (ląd lądowy `#f7f7f7` — zgodny z whitelistą `map-audit`; baner/kompas bez
  zmian); poprawa kolizji etykiet (6 kolizji rozdzielonych przesunięciem kotwic);
  `map.json` v3 → `wariant: T2`, `rekonstrukcja: false`, bez `scena`; usunięcie
  T4 `scena.json`.
- **S4** (nie dotyczy — brak regenracji sceny; podkład T2+ wektorowy już gotowy).
- **S5** QA: `map-audit.py ravnica` = 0 problemów; `npm test` + `npm run build`
  zielone; porównanie wizualne z `c.png` (rasteryzacja własna, geometria).
- **S6** Dokumentacja: `mapa-analiza.md` (rozdział v3, różnice vs źródło/c.png),
  `map.json` (proweniencja ADR 0031), `content/co-nowego.md`, ROADMAP,
  `PROJECT_HISTORY.md`, handoff sesji. Opis PR kumulatywny.

## Kryteria gotowości (definition of done)

1. `python3 tools/map-audit.py ravnica` → **0 problemów**.
2. (T2+ nie ma sceny) `sprawdzWiazania` dotyczy tylko scen T3/T4; dla T2+
   analog = `map-audit` (pkt 1) — brak `scena.json` w katalogu.
3. `npm test` (102/102) + `npm run build` zielone.
4. `maps/ravnica/podklad.svg` = w pełni wektorowy podkład T2+ (czysty SVG,
   bez rastra i bez sceny T4).
5. `map.json` v3: `wariant: T2`, `rekonstrukcja: false`, `zrodlo` = źródło
   fanowskie + ADR 0031, `wymiary` zgodne z kanwą, pinezka 137gpt przeliczona,
   kotwice wg nowej geometrii.
6. v3 **zastępuje** v2 (v2 nie może zostać "na_pastw" — AGENTS §6).
7. Dokumentacja sesji kompletna; PR gotowy do Squash and merge przez właściciela.

## Ryzyka (zaktualizowane do T2+)

- Podkład T2+ wektorowy jest gotowy i zwalidowany (`map-audit` = 0, geometria
  potwierdzona nakładką na `c.png`). `podklad.svg` = 38 KB — daleko poniżej
  budżetu ADR 0007 (`maps/ravnica.html` = 346 KB).
- Rasteryzacja SVG do QA była ograniczona (brak rsvg/cairo w sandboxie) —
  użyto własnego rasteryzatora PIL (bez `<text>`); finalne pismo weryfikowane
  w przeglądarce (preview na żywo).
- Wariant T2+ jest niezgodny z pierwotnym planem T4 — udokumentowane w
  `mapa-analiza.md` (rozdział v3) i w PR (decyzja właściciela).
