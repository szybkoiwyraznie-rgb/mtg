# Roadmapa PR-31: Pętla Jakości po PR-30

- **Data:** 2026-09-10
- **Cel:** Pełna realizacja Pętli Jakości (kroki 0–5) po scaleniu PR-30.
- **Kontekst:** PR-30 wprowadził model dwóch osobnych map dla Kaladeshu (ADR 0047), zmaterializował 3 karty (536ARB, 39MM2, 257LTR), dodał mapę T1 dla Warhammer Fantasy oraz hasło Auriokowie.

---

## Kolejka prac

### Krok 0–1: Rozpoznanie i audyt PR-30
- [ ] Pełna weryfikacja zmian PR-30 (ADR 0047, mapy, materializacje, hasło Auriokowie, testy).
- [ ] Zapisanie audytu w `docs/audits/AUDYT_2026-09-10-PR30.md`.
- [ ] Odnotowanie ewentualnych usterek/uwag w opisie PR.

### Krok 2: Pogłębianie LORE (najsłabsze strony)
- [ ] Analiza wyników `tools/wiki-stats.mjs` (najsłabsze strony z completeness score 88% / 7.0/8):
  - `39mm2-brute-force` (Tarkir, klan Mardu / horda Kolaghan, taktyka szarży, wikilinki).
  - `536arb-ethersworn-shieldmage` (Alara / Esper, Przysiężeni Eteru, eterium, doktryna doskonałości).
- [ ] Kwerenda źródeł, rozbudowa lore w sekcjach, dodanie cytowań i wikilinków.

### Krok 3: Link-mining (wspólne encje i nowe hasła)
- [ ] Przegląd encji występujących w kartach (próg ≥ 2 kart):
  - Śródziemie (Dunland Crebain + Lash of the Balrog: Moria, Wojna o Pierścień, Cień / Sauron).
  - Tarkir (Highland Game + Brute Force: klany, smocze burze, historia epok).
  - Alara (Illusory Demon + Ethersworn Shieldmage: Odłamki / Conflux / sangryt / eterium).
  - Mirrodin / Innistrad / inne.
- [ ] Utworzenie zakwalifikowanych haseł wg `SZKIELET_HASLA` + powiązanie wikilinkami z istniejącymi kartami.

### Krok 4: Pass mapowy
- [ ] Weryfikacja integralności i dokładności map (`tools/map-audit.py`, `sprawdzWiazania`, `sprawdzHydrologie`).
- [ ] Sprawdzenie poprawności pinezek nowych kart na mapach (536ARB na Alarze, 39MM2 na Tarkirze, 257LTR w Śródziemiu).
- [ ] Ogląd wizualny jeśli wymagany.

### Krok 5: Zamknięcie sesji
- [ ] Wpis w `content/co-nowego.md` (zgodnie z ADR 0029, z godziną publikacji).
- [ ] Aktualizacja `docs/PROJECT_HISTORY.md` i `docs/ROADMAP.md`.
- [ ] Przygotowanie `docs/setup/HANDOFF_2026-09-10-pr31.md`.
- [ ] Zapewnienie czystego stanu repo, zielonych testów i aktualizacji opisu PR.
