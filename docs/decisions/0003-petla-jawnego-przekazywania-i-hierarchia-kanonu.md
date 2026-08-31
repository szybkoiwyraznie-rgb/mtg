# ADR 0003: Pętla jawnego przekazywania kart i hierarchia kanonu

- **Status:** Częściowo zastąpiona — hierarchię kanonu zastępuje ADR 0010 (2026-08-31); pętla przekazywania i parość 1:1 pozostają w mocy
- **Data:** 2026-08-31
- **Decydenci:** właściciel projektu (decyzje 2026-08-31); agent Arena (sesja PR-1)

## Kontekst

Właściciel kolekcji zleca materializację kart pojedynczo lub batchami,
dostarczając dla każdej karty: `imgId`, nazwę, wydanie (set), plan/setting,
kolory, prompt wizualizacyjny i narrację. Karty bywają transpozycjami —
lore opisuje setting docelowy (np. Śródziemie, Warhammer Fantasy), podczas
gdy mechanika, nazwa i flavor pochodzą z karty MtG. W poprzednim projekcie
(mtg-game) istniał arkusz z 579 kartami; właściciel decyzją z 2026-08-31
**unieważnił go dla tego projektu** — baza ma powstawać wyłącznie z jawnie
przekazanych wpisów.

## Decyzja

### 1. Pętla jawnego przekazywania

1. **Nigdy nie materializuje się karty, która nie została wysłana do
   materializacji.** Brak importów masowych, brak szkieletów-stubów
   „całej kolekcji", brak domyślnej kolejki.
2. Surowy wpis właściciela ląduje **verbatim** w
   `collection/entries/<slug>.md` (parser tylko normalizuje metadane do
   frontmattera; prompt i narracja pozostają nienaruszone). Wpis jest
   **nienaruszalny** — sesja go nie edytuje, poprawki robi wyłącznie
   właściciel.
3. **Parość strzeżona testem** w obie strony: każdy wpis z
   `collection/entries/` ma dokładnie jedną Kartę Katalogową i odwrotnie —
   każda Karta Katalogowa musi mieć wpis kolekcji (`test/parosc-kolekcji.test.js`).
   To jest mechaniczne wymuszenie zasady z pkt 1.
4. Typy kart FUS/STO z poprzedniego projektu **nie istnieją** tutaj; pole
   MV z wpisów jest przechowywane verbatim, ale ignorowane przez model
   danych (decyzja właściciela 2026-08-31).

### 2. Hierarchia kanonu (od najwyższego)

| Poziom | Źródło | Rola |
|---|---|---|
| 1 | **Narracja i prompt właściciela** (`collection/entries/`) | kanon nadrzędny — nie do podważenia |
| 2 | **Kanon settingu docelowego** po transpozycji (Tolkien, GW, Sapkowski, Wizards…) | świat, w którym opowiadamy lore |
| 3 | **Oracle karty** (snapshot Scryfall: nazwa, koszt, typ, zdolności, flavor) | źródło mechaniki, nazwy i flavoru |
| 4 | **Wiedza agenta + kwerenda internetowa** | wypełniacz luk; zawsze z cytowaniem w sekcji Źródła |

Konflikt poziomów rozstrzyga wyższy poziom. Rozbieżność (np. narracja
właściciela vs kanon settingu) **nie jest ukrywana** — opisana jawnie w
treści strony, bo to transpozycja prywatna i odmienności są jej sensem.

### 3. Transpozycja

Lore strony opisuje **setting podany we wpisie** (po transpozycji), a nie
plan rodzinny karty MtG. Pochodzenie mechaniczne (kolor, koszt, statyki,
keywords) analizuje się zawsze od karty-źródła. Sekcja „Transpozycja"
Karty Katalogowej dokumentuje most między nimi.

## Konsekwencje

**Dodatnie:** baza odzwierciedla dokładnie to, co właściciel przekazał —
bez cichych „uzupełnień" kart, których nikt nie zlecił; testy mechanicznie
pilnują umowy; narracje są odporne na „poprawianie" przez agenta.

**Ujemne:** pełny obraz kolekcji powstaje powoli (realnie 10–20 kart na
sesję). Świadomy koszt właściciela.

**Dla sesji agentskiej:** wpisy kolekcji są read-only; materializacja bez
wpisu jest czerwona w CI; wiedza z internetu bez cytowania źródła nie
wchodzi do treści.
