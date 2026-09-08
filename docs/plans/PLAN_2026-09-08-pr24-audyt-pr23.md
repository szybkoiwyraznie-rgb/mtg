# PLAN_2026-09-08-pr24 — audyt PR-23, potem zadanie właściciela

Sesja `arena/01a080f4-mtg`, PR bieżący (numer po otwarciu).

## Faza 1 — audyt PR-23 (scalony `eca14c0`, squash 24 commitów z `arena/01a07fc3-mtg`)

Zakres squasha `6bf2fba..eca14c0` (81 plików, +21 277/−825):
pętla PR-22 (audyt PR-21, naprawy A1–A6/E1, pogłębienia 275FIN + Mirrodin,
hasło Nowa Phyrexia), pakiet 605SHM + Lorwyn–Shadowmoor T4 (ADR 0037),
Pętla Jakości (Final Fantasy, 1LTR), a PO handoffie jeszcze 6 commitów:
szlaki Lorwyn, **476MBS**, **ADR 0038** + research Innistradu,
**393DKA + plan Innistrad (mapa T1)**, research Dominarii.

Kroki audytu (AGENTS.md §5):
1. Integralność: `npm test` + `npm run build` + `map-audit` + `wiki-stats`
   wobec liczb z handoffu PR-23 (deklarowane: 143/143, 17 stron).
2. Merytoryka treści: hierarchia kanonu, cytowania w Źródłach,
   brak dublowania (wikilinki), kompletność szkieletów — dla każdej
   nowej/zmienionej karty, hasła i planu.
3. Poprawność danych: snapshoty Scryfall, slugi/tagi, pinezki
   z uzasadnieniem lore; parość wpis↔karta.
4. Silnik i testy: `render-map.js`, `build.mjs`, mapforge, nowe testy.
5. Mapy: `map-audit` 0 + **ogląd rastrowy** Lorwyn (oba oblicza)
   i Innistrad T1 (L10) — resvg poza repo.
6. Proces: L9 (opis PR/handoff/ROADMAP vs faktyczny zakres squasha).

Wynik: `docs/audits/AUDYT_2026-09-08-PR23.md` + opis PR.

## Faza 2 — właściwe zadanie

Po audycie sesja wraca do właściciela po zadanie. Gdy przyjdzie —
dopisać tu roadmapę wykonawczą (osobna sekcja), nie otwierać nowego PR.
