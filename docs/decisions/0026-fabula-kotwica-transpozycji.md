# ADR 0026: Fabuła wraca do dostawy — wiążąca kotwica transpozycji karty

- **Status:** Zaakceptowana
- **Data:** 2026-09-02
- **Decydenci:** właściciel projektu (decyzja 2026-09-02, czat — rewizja
  wcześniejszej decyzji projektowej); agent Arena (sesja PR-10)
- **Zastępuje:** częściowo ADR 0011 (format dostawy rozszerza się
  o pole Fabuła; wyłączenie „narracji" z pętli zostaje uchylone w NOWEJ,
  zdefiniowanej niżej roli); przywraca w zmienionej formie warstwę
  „kotwicy osadzenia" z ADR 0010
- **Powiązania:** ADR 0004 (snapshot Scryfalla), ADR 0010 (hierarchia
  kanonu), ADR 0016 (format Karty Katalogowej)

## Kontekst

ADR 0011 wyprowadził narrację i prompt z pętli dostawy, bo niekanoniczna
scena „przeciekała" do treści kart jak kanon. Praktyka ilustracji
zmieniła jednak rachunek: **ilustracje FOT i KON powstają na bazie JUŻ
transponowanego planu**. Jeśli agent samodzielnie wymyśla materializację
karty w planie (gdzie i jak karta „siedzi" w świecie), jego opis może
rozjechać się z ilustracją, która powstała według innej wizji. Kotwica
transpozycji musi więc być JEDNA i pochodzić od właściciela.

## Decyzja

1. **Format dostawy materializacji (v3):**
   `imgId · nazwa karty · set · plan · FABUŁA`.
   Fabuła to tekst właściciela kotwiczący kartę w starym lub nowym
   planie: osadzenie, scena, rola bytów — zgodne z ilustracją FOT/KON.
2. **Rola Fabuły — wiążąca kotwica transpozycji:** treść wpisu Karty
   (zwłaszcza sekcje „Transpozycja", „Na Mapie", „Postacie i Byty")
   OPIERA SIĘ na Fabule. Agent nie wymyśla własnego osadzenia, gdy
   dostawa je podaje; pinezka na mapie i uzasadnienia lokalizacji
   wynikają z Fabuły.
3. **Hierarchia kanonu (doprecyzowanie ADR 0010):**
   - mechanika/typy/flavor/druk: karta MtG (snapshot) — bez zmian;
   - lore świata docelowego: źródła cytowane — bez zmian;
   - **osadzenie karty w planie kolekcji: FABUŁA właściciela** (wiążąca;
     ponad syntezą agenta, obok lore świata — w konflikcie z twardym
     kanonem świata agent zgłasza konflikt właścicielowi zamiast
     samodzielnie rozstrzygać).
4. **Higiena treści (lekcja z ADR 0011 zostaje):** byty i sceny z Fabuły
   opisujemy jako OSADZENIE KOLEKCJI (transpozycję), nigdy jako kanon
   uniwersum MtG; w sekcji Źródła oznaczamy je jako „Fabuła dostawy
   (właściciel, data)". Test dymny „brak sekcji narracji/promptu na
   karcie" pozostaje — Fabuła zasila sekcje, nie tworzy własnej.
5. **Archiwum:** Fabuła trafia verbatim do wpisu kolekcji
   (`collection/entries/` — nienaruszalne), jak każda dostawa.
6. Dostawy sprzed tej decyzji (1LTR, 2BFZ) nie wymagają rewizji;
   właściciel może dosłać Fabułę uzupełniającą — wtedy karta przechodzi
   aktualizację sekcji osadzenia.

## Konsekwencje

**Dodatnie:** opis karty w Bazie i ilustracje FOT/KON mówią jednym
głosem; koniec ryzyka podwójnej (rozjechanej) transpozycji; jaśniejsze
uzasadnienia pinezek. **Ujemne:** dostawa przestaje być jednolinijkowa;
wraca obowiązek dyscypliny redakcyjnej (osadzenie ≠ kanon MtG) —
pilnowany zapisem w Źródłach i istniejącym testem dymnym.

**Dla sesji agentskiej:** przy materializacji czytaj Fabułę PRZED
pisaniem sekcji; „Transpozycja"/„Na Mapie" budujesz z niej wprost;
cytuj ją w Źródłach; konflikt Fabuły z twardym kanonem świata →
pytanie do właściciela (blokada decyzyjna), nie własna decyzja.
