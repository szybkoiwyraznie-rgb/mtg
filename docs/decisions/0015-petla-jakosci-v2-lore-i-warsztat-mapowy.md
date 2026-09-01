# ADR 0015: Pętla Jakości v2 — pogłębianie = LORE; pass mapowy = kompletacja i jakość map (warsztat T4)

- **Status:** Zaakceptowana
- **Data:** 2026-09-01
- **Decydenci:** właściciel projektu (doprecyzowanie 2026-09-01, czat);
  agent Arena (sesja PR-4)
- **Zastępuje:** sformułowanie kroków 2 i 4 ADR 0006 (pozostałe kroki —
  integralność, link-mining, co-nowego — bez zmian)

## Kontekst

Pierwszy pełny przebieg Pętli Jakości (PR-3/PR-4) pokazał dwie pułapki
interpretacyjne:

1. **Krok 2 (pogłębianie)** zszedł w meta-informacje: biografie artystów,
   warianty wydruków, finishe. Właściciel: „Pkt. 2 to uzupełnianie LORE
   kart, a nie informacji o artystach czy innych meta-informacji. To nie
   jest wiedza, która jest clue tego projektu."
2. **Krok 4 (pass mapowy)** został odczytany jako kontrola obecności
   („czy karta ma pinezkę, czy plan ma mapę"). Właściciel: „Pkt. 4 to nie
   sprawdzanie czy mapa jest i działa, tylko uzupełnianie kompletności
   map" — research nowych POI, weryfikacja dokładności, lepsze metody
   rysowania obiektów (grzbiety górskie, rzeki, biomu), wspólny silnik
   mapowy, dążenie jakością do mapy Śródziemia i dalej.

## Decyzja

### 1. Krok 2 — pogłębianie LORE (nie meta)

Pogłębianie rozbudowuje **wyłącznie treść lore**: świat i jego geografię,
byty i rasy, etymologię, mechanikę jako opowieść, flavor, transpozycję,
osadzenie w osi czasu. **Anti-lista** (nigdy celem pogłębiania):
biografie artystów, warianty wydań/finishe, procesy i mechanika Codexu,
meta-tekst. Dane wydruku żyją w infoboksie ze snapshotu (ADR 0014).

### 2. Krok 4 — pass mapowy = kompletacja i jakość map

Pass mapowy to czynna praca nad **jakością i kompletnością map**, w
kolejności od najtańszej:

1. **Kompletność operacyjna:** pinezki kart (lokalizacja z lore, poziom
   pewności), plan z kartą bez mapy → proces mapowy (MA1–MA3).
2. **Nowe POI:** kwerenda źródeł (kanon settingu > przewodniki/artykuły
   oficjalne > wiki z cytowaniami) o miejsca, ruiny, rzeki, pasma,
   biomu, osady — i wzbogacanie podkładu + `elementy`/`kotwice`
   w `map.json`.
3. **Weryfikacja dokładności:** przegląd istniejących elementów względem
   źródeł (pozycja, nazwa, status kanoniczny); korekty z adnotacją
   źródła; testy kolizji/na-lądzie (point-in-polygon, bbox etykiet).
4. **Warsztat rysowania wektorowego:** reużywalne metody kodowania
   obiektów — pasma i grzbiety górskie, rzeki (z dopływami, ujściami),
   biomu (lasy, bagna, step, lód, pustynia), osady/ruiny/hedrony —
   jeden wspólny styl (paleta pergaminu, halo, legenda) dla wszystkich
   map rysowanych od zera.
5. **Wspólny silnik mapowy (T4):** mapy rekonstruowane od zera
   (aktualne i przyszłe plany) korzystają ze **współdzielonego warsztatu**
   — ustandaryzowanych, reużywalnych elementów i metod rysowania — tak,
   by każda kolejna mapa powstawała szybciej i spójnie, a jakością
   dążyła do mapy Śródziemia (podkład mapome, T2) i docelowo ją
   **wyprzedzała** (kształty, kolory, czytelność, gęstość POI).
6. **Regiony haseł** geograficznych (obwódki) — gdy hasła istnieją
   (próg ≥2 kart).

### 3. Wariant T4 (definicja)

**T4 = rekonstrukcja od zera (wariant T3, ADR 0012/0013) wzniesiona na
wspólnym warsztacie mapowym**: ta sama zasada autorska (podkład z kanonu
tekstowego, proweniencja w `map.json`), podniesiony i współdzielony
standard rysowania (pkt 4 wyżej). Mapa T3 dojrzewa do T4 wraz
z warsztatem; Śródziemie (T2, podkład adoptowany) pozostaje punktem
odniesienia jakości, nie wzorcem do kopiowania.

## Konsekwencje

**Dodatnie:** pętla pracuje na tym, co jest celem projektu (lore + mapy);
mapy planów stają się produktem ciągle dojrzewającym, nie jednym aktem
rekonstrukcji; warsztat T4 obniża koszt każdej kolejnej mapy.

**Ujemne:** pass mapowy bywa pracochłonny (kwerenda + rysowanie) —
planowany jako osobne zadania z roadmapą w `docs/plans/`, nie „przy
okazji"; jakość warsztatu trudno zmierzyć testem — benchmark to porównanie
z mapą Śródziemia i ocena właściciela.

**Dla sesji agentskiej:** operacyjne szczegóły kroków 2 i 4 żyją
w `docs/guides/PETLA_JAKOSCI.md` (zaktualizowany wraz z tym ADR);
SKILL_MAPA_PLANU.md rośnie jako pamięć warsztatu rysowania.
