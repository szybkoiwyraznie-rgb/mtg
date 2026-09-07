# ADR 0036: Numer kolekcji właściciela jest niezmiennym kluczem FOT/KON

- **Status:** Zaakceptowana
- **Data:** 2026-09-07
- **Decydenci:** właściciel — „Ta karta ma w kolekcji numer 605 i nigdy nie zmieniaj numerów które ci podaję.”
- **Powiązania:** ADR 0011 (imgId z dostawy), 0004 (snapshot), 0008/0017 (FOT/KON), LESSONS L8

## Kontekst

Po researchu 605SHM agent użył sformułowania sugerującego zastąpienie
numeru kolekcji numerem wydruku ze Scryfalla. To powtórzenie pułapki L8.
Nawet bez zmiany plików takie komunikowanie dwóch identyfikatorów
sugeruje błędną „korektę” suwerennej numeracji właściciela.

## Decyzja

1. **Numer kolekcji i imgId są niezmienne.** Bierze się je dokładnie
   z dostawy właściciela. Agent nigdy nie renumeruje karty, jej slugu,
   pinezki ani ścieżek FOT/KON według zewnętrznego katalogu.
2. **605 pozostaje 605; imgId pozostaje `605SHM`.** Karta ma slug
   `605shm-consign-to-dream`; ilustracje sondowane są najpierw jako
   `./img/605FOT.png` i `./img/605KON.png`, następnie zgodnie z istniejącą
   konwencją jako `605SHMFOT.png` / `605SHMKON.png`.
3. `collector_number`, `id`, `oracle_id` i adresy Scryfalla opisują
   **zewnętrzny wydruk**. Zachowuje się je w pełnym snapshotcie,
   ale nigdy nie są źródłem imgId ani numeru ilustracji. Kartę w API
   wyszukuje się po nazwie/wydaniu lub znanym identyfikatorze API,
   nie interpretuje numeru kolekcji jako numeru wydruku.
4. Komunikacja też zachowuje rozdział: **„numer kolekcji 605”**,
   a osobno „metadane wydruku Scryfall”. Nie przedstawiać jednego
   jako poprawnej wersji drugiego, nie używać porównań sugerujących
   błąd numeru podanego przez właściciela.
5. Przy podejrzeniu innej karty/wydania bada się dopasowanie źródła,
   nie zmienia numeracji kolekcji. Niejednoznaczność zgłasza się
   właścicielowi bez tworzenia własnego identyfikatora zastępczego.

## Konsekwencje

Regresja renderera sprawdza, że zmiana zewnętrznego collector_number
nie zmienia imgId ani kandydatów FOT/KON. Przy materializacji 605SHM
test realnej bazy ma dodatkowo potwierdzać identyfikator archiwum,
karty, snapshotu i pinezki. Prywatne ilustracje nie są generowane ani
pobierane do repo; zabezpieczamy wyłącznie ich niezmienne klucze.
