# Plan sesji — 2026-09-05 — audyt PR-18 + kolejka napraw (PR na GitHubie: #19)

> Sesja `arena/01a0737d-mtg`, punkt wyjścia = scalony PR-18 (`4bc1234`).
> Stan na starcie: audyt PR-18 zakończony (wynik:
> `docs/audits/AUDYT_2026-09-05-PR18.md`); **Pętla Jakości wstrzymana —
> czekamy na bezpośrednie zlecenie właściciela** (instrukcja sesji).

## Kontekst

PR-18 scalił do `main` trzy pakiety: audyt PR-17 + Pętla Jakości,
pakiet Final Fantasy (275FIN + podmapa Midgar, ADR 0032) i pakiet Alara
(305ARB + mapa, ADR 0033), oraz rozszerzenie silnika o podmapy
`plan/podmapa`. Integralność zielona (104/104 testów, build, map-audit 0).

## Kolejka napraw z audytu (czeka na decyzję właściciela)

1. **Z1 [wysoki]** Termin „Fabuła dostawy" → „Fabuła" w widocznej treści
   kart 275FIN i 305ARB (ADR 0026 doprecyzowanie 2026-09-05).
2. **Z2 [średni]** Usunięcie odsyłaczy „ADR 0026/0033" z treści obu kart
   (feedback B: treść karty bez mechaniki Codexu).
3. **Z3 [średni]** Rozszerzenie ui-smoke: asercje „Fabuła dostawy"/„ADR"/
   „verbatim" dla wszystkich kart (nie tylko 1LTR/2BFZ).
4. **Z5 [niski, opcjonalnie]** Ujednolicenie stylu stron planów
   (alara/final-fantasy cytują ADR w treści; starsze plany — nie).
5. **Z4 [niski, kosmetyka]** Snapshot 275FIN zapytany `search?q=…`
   zamiast `cards/named?exact=` — bez zmiany danych.

## Kroki

- [x] Lektura obowiązkowa (AGENTS.md §0) — komplet.
- [x] Audyt PR-18 → `docs/audits/AUDYT_2026-09-05-PR18.md`.
- [x] PR sesji otwarty (przed pracą treściową — ADR 0020 pkt 1).
- [ ] **CZASOWO WSTRZYMANE** — bezpośrednie zlecenie właściciela (lub,
      w jego braku, Pętla Jakości od kroku 1: integralność → naprawy Z1–Z3
      → pogłębianie → link-mining → pass mapowy → co-nowego).
