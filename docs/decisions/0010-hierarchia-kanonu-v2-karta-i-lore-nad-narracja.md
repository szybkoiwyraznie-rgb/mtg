# ADR 0010: Hierarchia kanonu v2 — karta MtG i lore świata ponad narracją kolekcji

- **Status:** Częściowo zastąpiona — warstwa kotwicy osadzenia (narracja
  i prompt) wychodzi z pętli dostawy (ADR 0011); hierarchia źródeł
  (karta MtG > lore świata > agent) pozostaje w mocy
- **Data:** 2026-08-31
- **Decydenci:** właściciel projektu (korekta procesowa, 2026-08-31, czat); agent Arena (sesja PR-2)
- **Zastępuje:** fragment „hierarchia kanonu" ADR 0003 (pozostałe decyzje
  ADR 0003 — pętla jawnego przekazywania i parość 1:1 — pozostają
  w mocy)

## Kontekst

ADR 0003 ustalił hierarchię: narracja właściciela > kanon settingu >
Oracle Scryfall > agent. Właściciel sprostował (2026-08-31, czat):
prompt i fabuła dostarczane razem z ilustracją **nie są kanonem** —
są jedynie **kotwicą osadzenia** karty w settingu kolekcji. „Najwyższy
wymiar prawdy ma sama karta MtG (jej nazwa, mechanika, flavor text)
ORAZ lore świata, do którego została przyporządkowana. […] Kanonem
jest zewnętrzny kanon."

## Decyzja

1. **Hierarchia kanonu (v2):**
   1. **karta MtG** — nazwa, typ, mechanika (Oracle), flavor text
      (snapshot Scryfall, ADR 0004);
   2. **lore świata docelowego** — dla Śródziemia: legendarium Tolkiena
      (*Hobbit*, *Władca Pierścieni*, *Silmarillion*, *Niedokończone
      opowieści*);
   3. **agent** — synteza i kwerenda, zawsze z cytowaniami, nigdy ponad
      1–2.
2. **Narracja i prompt właściciela („kotwica osadzenia")**: opisują, jak
   karta jest osadzona w settingu w ramach tej kolekcji; zapisywane
   verbatim we wpisie kolekcji i przywoływane na Karcie Katalogowej,
   ale **przy rozbieżnościach z punktami 1–2 przegrywają**. Karta
   Katalogowa jawnie sygnalizuje rozbieżność („kotwica kolekcji vs kanon"),
   zamiast maglować kanon pod narrację.
3. Wpis kolekcji pozostaje **nienaruszalny** (ADR 0003) — zmienia się
   status jego treści, nie jej wierność zapisu.
4. Hasła encji, powiązania geograficzne i interpretacje mechaniki
   odpytują punkty 1–2; kotwica dostarcza kontekstu sceny (np. „na
   dunlandzkim urwisku nad wąwozem armii"), nie faktów świata.

## Konsekwencje

**Dodatnie:** baza nie „przepisuje" Śródziemia pod prywatną fabułę;
spójność z zewnętrznym kanonem jest weryfikowalna cytowaniami; rola
właściciela pozostaje suwerenna (dostawy, zlecenia), bez obciążania go
odpowiedzialnością za fakty lore.

**Ujemne:** sekcje „Narracja Koleksji" i „Wizualizacja" wymagają
odrębnego oznaczenia statusu („kotwica, nie kanon") — konwencja
wprowadzona w SZKIELET_KARTY.md przy tej okazji.

**Powiązane zmiany:** SZKIELET_KARTY.md (pole Narracji dostawy =
„kotwica osadzenia"), SZKIELET_HASLA.md (proga 2 kart dla haseł —
zasada właściciela 2026-08-31).
