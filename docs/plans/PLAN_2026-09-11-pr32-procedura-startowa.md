# Roadmapa PR-32: obowiązkowa procedura startowa po PR-31

- **Data:** 2026-09-11
- **Cel:** domknąć procedurę startową nowej sesji zgodnie z `AGENTS.md`: odtworzyć pełne środowisko, zweryfikować integralność i przeprowadzić audyt całego zakresu ostatniego scalonego PR-31.
- **Punkt odniesienia:** PR #31, merge `5a49ca3380043dc331aed56d2fac304deffac780` względem `f57c94ef6e4b7e1eb8d4cf247c1cbbff1adc3e7d`.

## Kolejka

1. [x] Przeczytać pełną lekturę obowiązkową z `AGENTS.md` §0, w tym wszystkie ADR-y, `LESSONS.md`, `ENVIRONMENT.md`, PR #31 z diffem oraz najnowszy handoff.
2. [x] Potwierdzić pełną historię gita, właściwą gałąź i czysty stan roboczy.
3. [x] Otworzyć PR sesji z niniejszą roadmapą przed pracą audytową.
4. [x] Odtworzyć zależności deweloperskie przez `npm ci`; uruchomić `npm test`, `npm run build`, `python3 tools/map-audit.py` i `node tools/wiki-stats.mjs`.
5. [x] Zbadać każdy plik zmieniony w PR-31: treści kart i haseł, wpisy dostaw, snapshoty, plany, mapy i binaria, kod/testy oraz dokumentację — względem obowiązujących ADR-ów i stanu sprzed PR.
6. [x] Obejrzeć wizualnie nowe lub zmienione mapy T3/T4 oraz reprezentatywne fragmenty nowych map rastrowych; zapisać wnioski, nie artefakty robocze.
7. [x] Zapisać ustalenia w `docs/audits/AUDYT_2026-09-11-PR31.md`, zaktualizować opis PR kumulatywnie i przekazać właścicielowi wynik procedury startowej.

## Brama

- audyt obejmuje pełny diff PR-31, również późne commity nieuwzględnione w jego pierwotnym handoffie;
- raport rozdziela błędy produktu, dług dokumentacyjny i świadomie dopuszczone ciężkie zasoby map;
- testy i build są zielone, a build nie ostrzega o płytkim klonie ani brakującym rasteryzatorze.
