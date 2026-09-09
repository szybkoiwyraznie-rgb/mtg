# ADR 0045: Mapa może mieć domyślny widok startowy (`widok_domyslny`)

- **Status:** Zaakceptowana
- **Data:** 2026-09-09
- **Decydenci:** właściciel projektu (decyzja z czatu: Kaladesh ma startować na Ghirapurze, a oddalenie ma odsłaniać cały plan); agent Arena (sesja PR-27)
- **Powiązania:** ADR 0038 (definicje i preferencja T2 → T1 → T3 → T4), ADR 0039 (LOD / bbox), ADR 0043 (na mapie oznaczenia noszą wyłącznie karty)

## Kontekst

Dotąd mapa bez `?pin=`, `?x=&y=` albo `?epoka=<bbox>` startowała zawsze z
widokiem „cała scena dopasowana do okna". To było bezpieczne, ale zbyt
sztywne dla planów, których **centrum znaczeniowe** jest znacznie gęstsze
od reszty świata.

Kaladesh / Avishkar jest właśnie takim przypadkiem: świat jako całość da
się odtworzyć tylko schematycznie, natomiast **Ghirapur** jest gęstym,
kanonicznie opisanym sercem planu. Właściciel wybrał model jednej mapy T4
całego planu, która **domyślnie otwiera się na Ghirapurze**, a dopiero po
oddaleniu odsłania pełny schemat świata.

To nie jest wariant epoki ani dodatkowa pinezka. To **sposób otwarcia tej
samej mapy**.

## Decyzja

1. `map.json` może opcjonalnie zawierać pole:

   ```json
   "widok_domyslny": {
     "x": 0.52,
     "y": 0.61,
     "zoom": 3.2
   }
   ```

   gdzie:
   - `x`, `y` — współrzędne znormalizowane **w układzie złotym** mapy,
   - `zoom` — docelowa **wizualna skala układu złotego** przy otwarciu.

2. `widok_domyslny` działa **tylko wtedy**, gdy użytkownik nie podał
   silniejszej intencji przez deep-link:
   - `?pin=<slug>` ma pierwszeństwo,
   - `?x=<0–1>&y=<0–1>` ma pierwszeństwo,
   - `?epoka=<id-bbox>` ma pierwszeństwo.

3. `widok_domyslny` **nie tworzy znacznika na mapie**. To tylko kadr
   początkowy; ADR 0043 pozostaje bez zmian — na mapie oznaczenia noszą
   wyłącznie karty.

4. Warianty podkładu (ADR 0035) zachowują spójność: `widok_domyslny`
   zapisuje się w układzie złotym, a silnik przelicza go przez kalibrację
   aktywnej sceny. Dzięki temu ten sam startowy kadr działa niezależnie
   od wariantu podkładu.

5. Jeśli mapa nie ma `widok_domyslny`, zachowanie pozostaje bez zmian:
   start = dopasowanie całej sceny do okna.

## Konsekwencje

**Dodatnie:** plan może startować od najważniejszego kanonicznie obszaru
(np. miasta), nie tracąc pełnej mapy świata; użytkownik od razu widzi
obszar, który najpewniej odpowiada pierwszym kartom planu.

**Ujemne:** źle dobrany `widok_domyslny` może ukrywać istnienie reszty
mapy, więc trzeba go dobierać świadomie i opisywać w `map.json`/researchu.

**Dla sesji agentskiej:** gdy właściciel wybiera model „jedna mapa świata,
ale start od miasta/regionu", nie buduj osobnej pseudo-podmapy tylko po to,
żeby osiągnąć taki efekt. Najpierw rozważ `widok_domyslny` na tej samej mapie.
