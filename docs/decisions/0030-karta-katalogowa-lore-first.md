# ADR 0030: Karta Katalogowa LORE-first — metryka tylko w infoboksie, mechanika przy końcu

- **Status:** Zaakceptowana
- **Data:** 2026-09-03
- **Decydenci:** właściciel projektu (feedback 2026-09-03: „To ma być LORE Codex”; technikalia tylko w infoboksie i w „Mechanika jako Opowieść”); agent Arena (sesja PR-13)
- **Zastępuje:** częściowo ADR 0016 (blok danych Oracle w treści i wczesne położenie mechaniki)
- **Powiązania:** ADR 0014 (brak sekcji „Druk w Kolekcji”), ADR 0015 (pogłębianie lore), ADR 0017 (FOT/KON jako warstwa obrazu), ADR 0026 (Fabuła jako kotwica osadzenia)

## Kontekst

ADR 0016 wprowadził format „kanonu katalogowego” z blokiem Oracle w pierwszej
sekcji Karty Katalogowej. Praktyka po dostawie *Withstand* pokazała, że taki
układ przesuwa ciężar wpisu w stronę metryki Magic: The Gathering: kosztów,
setów, rzadkości, druku i komentarzy o procesie wydawniczym. Właściciel
skorygował kierunek: projekt jest **Lore Codexem**, nie katalogiem technicznym
MtG. Czytelnik ma najpierw wejść w świat i scenę, a dopiero na końcu dostać
krótkie odczytanie reguł jako opowieści.

## Decyzja

1. **Karta Katalogowa jest LORE-first.** Główna kolumna karty mówi głosem
   niezależnego kronikarza świata: scena, miejsce, byty, nazwa, flavor,
   transpozycja i mapa. Nie zaczyna się blokiem koszt/typ/statystyki/wydanie.
2. **Metryka techniczna żyje w infoboksie.** Koszt many, typ, P/T, wydanie,
   rzadkość, artysta, zdolności i link Scryfall pokazuje automatyczny panel
   boczny ze snapshotu. Treść markdown nie powtarza tego jako otwierającej
   metryki ani nie rozwija procesu wydawniczego.
3. **Mechanika zostaje, ale jako margines interpretacyjny pod koniec.**
   Sekcja „Mechanika jako Opowieść” pozostaje obowiązkowa, jednak stoi
   bezpośrednio przed „Źródłami”. Może precyzyjnie przywołać reguły karty,
   ale tylko po to, by pokazać, co te reguły opowiadają w świecie.
4. **Flavor jest traktowany jako lore.** Sekcja „Flavor Text” zostaje wysoko
   w układzie, bo cytat flavoru jest głosem świata; odczyt fraza po frazie
   ma wyjaśniać sens sceny, nie budować katalogu wariantów wydruków.
5. **Komentarze procesu i wydawnicze tło MtG są zakazane w treści głównej,**
   chyba że są niezbędne do osadzenia lore i podane skrajnie zwięźle.
   Biografie autorów, historia dodatków, warianty wydań, rama, rzadkość,
   numer kolekcjonerski i podobne dane nie są clue wpisu. Jeżeli są potrzebne
   jako źródło danych karty, wystarcza zwięzły wpis w „Źródłach”.
6. **Nowy układ sekcji karty:**
   1. Kronika Lore
   2. Postacie i Byty
   3. Nazwa Karty
   4. Flavor Text
   5. Transpozycja
   6. Na Mapie
   7. Mechanika jako Opowieść
   8. Źródła
   9. Podsumowanie Lore

## Konsekwencje

**Dodatnie:** karta czyta się jak hasło lore, nie jak karta katalogowa sklepu;
pierwsze akapity są zanurzone w świecie; technikalia nie dominują strony;
infoboks odzyskuje rolę miejsca na dane Scryfall; sekcja mechaniki staje się
świadomym finałowym komentarzem, nie osią całego wpisu.

**Ujemne:** treść nie jest już samowystarczalnym powtórzeniem wszystkich pól
Oracle; czytelnik szukający danych turniejowych patrzy w infoboks. To koszt
świadomy, zgodny z celem projektu.

**Dla sesji agentskiej:** każdą nową i aktualizowaną kartę zaczynaj od
kroniki świata. Jeśli pierwsze akapity można streścić jako „koszt, typ,
wydanie, autor, rzadkość”, wpis jest zły. Jeśli mechanika pojawia się przed
mapą i transpozycją, układ jest zły. Jeśli źródła techniczne dominują nad
lore, skróć je i zostaw tylko to, co potrzebne do weryfikacji.
