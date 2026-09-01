# PLAN: PR-5 — Pętla Jakości v2 (pogłębienie LORE + pass mapowy T4)

> Sesja bez dostawy nowych kart. Domyślna praca = Pętla Jakości (ADR 0006/0015).
> Gałąź `arena/01a05d50-mtg`, punkt wyjścia = merge PR #7 (PR-4).

## Zadania (w kolejności Pętli, krok 1 nigdy nie pomijany)

### Krok 0 — rozpoznanie (wykonany)
- `npm test` 86/86; `npm run build` OK (4 strony: 2 karty, 2 plany).
- `npm run stats` → completeness 100% (8/8) na wszystkich 4 stronach
  (wszystkie osie wypełnione; wikilinki 1/1 — plany↔karty).
- Deploy PR #7: workflow „Publikacja na GitHub Pages" zielony (run po
  scaleniu do main); strona `https://szybkoiwyraznie-rgb.github.io/mtg/`.

### Krok 1 — integralność
- Testy zielone na starcie; utrzymujemy zielone w każdym commicie.

### Krok 2 — pogłębienie LORE
- **Śródziemie (plan)** nie było pogłębiane w PR-4 (Zendikar dostał
  sekcję „Ludy"). Dodajemy do `content/planes/srodziemie.md` sekcję
  **„Ludy"** — ludy zachodniego Śródziemia (Dunlendowie, Rohirrim,
  obóz Isengardu i jego siły, zagadnienie czystości rodu), analogiczną
  do sekcji „Ludy" Zendikaru, z cytowaniami.
  **Uwaga anty-dublowanie (ADR 0005/0010):** encje w dalszym ciągu
  czekają na próg ≥2 kart (backlog) — nie tworzymy haseł, nie wikilinkujemy
  do nieistniejących haseł; wiedza o nich pozostaje w treści planu.
- Karty (1LTR, 2BFZ) — już głębokie; nie pogłębiamy w tej sesji
  (zgodnie z PETLA_JAKOSCI: 1–3 strony na sesję, priorytet planu).

### Krok 3 — link-mining
- Ponowna weryfikacja: żadna encja nie jest wspominana przez ≥2 karty
  (karty są z różnych planów; plany nie liczą się do progu). Brak nowych
  haseł; backlog pozostaje aktualny.

### Krok 4 — pass mapowy (kompletacja i jakość map — ADR 0015 pkt 4)
- **E4 planu mapforge (PLAN_2026-09-01-mapforge.md):** dopisać do
  `docs/guides/PROCES_MAP.md` (MA1 pkt 5 / MA2) i `SKILL_MAPA_PLANU.md`,
  że **nowe mapy T3/T4 startują od sceny + mapforge**, a SKILL odsyła do
  katalogu klocków (§11 już to czyni — domknąć wzorzec w PROCES_MAP).
- **Śródziemie (T2, podkład adoptowany):** weryfikacja kotwic/pinezki
  względem podkładu i źródeł; ewentualne uzupełnienie `kotwice`
  (np. Orthanc, brody na Isenie, Eregion/Hollin, Gap of Calenardhon)
  wyłącznie z pozycji istniejących etykiet podkładu mapome (kotwice
  programistyczne — bez przesuwania kanonu). Bez zmiany geometrii
  podkładu (adoptowany, T2 — nie rysujemy „przy okazji").
- `tools/map-audit.py <plan>` → 0 problemów (standard).

### Krok 5 — zamknięcie
- `content/co-nowego.md` — wpis sesji.
- `docs/setup/HANDOFF_2026-09-01-pr5.md`.
- Opis PR zaktualizowany kumulatywnie.

## Poza zakresem
- Materializacja kart (brak dostawy), generowanie grafik (ADR 0008),
  przepisywanie wpisów kolekcji (nienaruszalne), tworzenie haseł przed
  progiem ≥2 kart.
