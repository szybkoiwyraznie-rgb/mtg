# ADR 0016: Format Wpisu Karty — kanon katalogowy (adopcja standardów katalogu właściciela)

- **Status:** Częściowo zastąpiona — układ LORE-first, metrykę tylko w infoboksie i mechanikę przy końcu wprowadza ADR 0030
- **Data:** 2026-09-01
- **Decydenci:** właściciel projektu (przekazanie szablonu katalogu
  i decyzje: „warto ściągnąć conieco" + zakaz sekcji ilustracyjnej,
  2026-09-01, czat); agent Arena (sesja PR-4)
- **Powiązane:** ADR 0011 (chudy format dostawy), ADR 0014 (bez sekcji
  „Druk w Kolekcji"); **zastępuje** dotychczasowe kontrakty sekcji
  w `docs/guides/SZKIELET_KARTY.md` (nowy kontrakt poniżej)

## Kontekst

Właściciel kataloguje karty w jednolitym formacie tekstowym (wpisy
budowane jednorazowo przez LLM). Przekazał dwa przykłady — 1LTR Dunland
Crebain i 2BFZ Coralhelm Guide — i ocenił je jako **pełniejsze** od stron
Codexu: prosba dotyczy sposobu podania danych i ich charakterystyki
(nie treści), tak aby materializacja Karty w Bazie była co najmniej tak
dobra jak wpis katalogowy. Jednocześnie zapadła decyzja graniczna:
**sekcji opisującej ilustrację źródłową nie robi się w ogóle** —
w przypadku kart transponowanych wizualizacje alternatywne (FOT/KON)
są często zupełnie inne i osadzone w innych planach, więc opis druku
źródłowego bywa wręcz szkodliwy; obraz Scryfalla uczestniczy we Wpisie
wyłącznie jako infoboks.

## Decyzja

### 1. Co przyjmujemy z katalogu właściciela (kontrakty sekcji)

1. **„Metryka i Kontekst Świata" otwiera blok danych Oracle w treści**
   (etykiety/tabela, tuż pod kontekstem świata): koszt many (ikony +
   rozwinięcie słowne), typ (oryginał EN + polskie tłumaczenie),
   statystyki, zdolności (treść Oracle + tłumaczenie na polski),
   wydanie (set, numer kolekcjonerski, rzadkość). **Wpis jest
   samowystarczalny** — dane karty czyta się z treści strony; infoboks
   pozostaje toru nawigacyjnego (obraz, linki), nie jedynym nośnikiem
   danych.
2. **Akapit kontekstu setu i osi czasu** (gdzie w historii planu żyje
   scena karty; czym jest dodatek, z którego pochodzi wydruk).
3. **„Nazwa Karty"**: obok etymologii — **pełne polskie odczytanie
   nazwy** (np. „Crebainy z Dunlandu", „Przewodniczka z Koralowego
   Hełmu").
4. **„Mechanika jako Opowieść" w trzech warstwach**: (a) **odczyt
   zasadniczy** — co każda zdolność robi mechanicznie, po polsku,
   precyzyjnie; (b) **interpretacja fabularna** — czym to jest
   w świecie; (c) **całość jako opowieść** — jak koszt, statystyki,
   typy i zdolności składają się w jedną historię. Podtypy czytane
   jako warstwy (np. Merfolk · Scout · Ally — każdą osobno).
5. **„Flavor Text"**: cytat + tłumaczenie + **odczyt fraza po frazie**
   (co każdy fragment mówi), kontekst postaci cytującej i związek
   cytatu z mechaniką. Brak flavoru — mówiony wprost, z wyjaśnieniem,
   czemu historia karty nie potrzebuje dopisku.
6. **„Podsumowanie Lore"**: 2–4 tezy tematyczne (punkt + zdanie
   uzasadnienia) + akapit domykający syntezę.

### 2. Czego NIE przyjmujemy (granice)

1. **Sekcja „Ilustracja" nie istnieje** (decyzja właściciela
   2026-09-01): zero opisów tego, co widać na druku źródłowym.
   Obraz ze Scryfalla żyje wyłącznie w infoboksie (tor główny; ADR
   0008) — jego udział w treści Wpisu kończy się na nim.
2. **Sekcja „Druk w Kolekcji" nie istnieje** (ADR 0014): ramka,
   warianty wydruków, finishe i biografie artystów poza zakresem.
3. Numeracja sekcji pozostaje markdownowa (`##`), nie liczbowa jak
   w katalogu właściciela; treść dalej w konwencji encyklopedycznej
   (nie II osoba).

### 3. Stosowanie

Nowe materializacje powstają od razu w tym formacie; strony istniejące
dostosowuje się przy najbliższej okazji (aktualizacja wsteczna 1LTR
i 2BFZ wykonana w tej samej sesji). Kontrakt sekcji żyje
w `docs/guides/SZKIELET_KARTY.md`; testy dymne pilnują obecności bloku
danych Oracle i braku sekcji „Ilustracja"/„Druk w Kolekcji".

## Konsekwencje

**Dodatnie:** wpis samowystarczalny (dane karty bez rozwijania
infoboksu), porównywalny objętością informacyjną z katalogiem
właściciela; jednolity standard dla przyszłych materializacji;
systemowe wykluczenie szkodliwych dla transpozycji opisów ilustracji.

**Ujemne:** sekcja pierwsza rośnie o blok danych — świadomy koszt;
tłumaczenia Oracle są naszą pracą (kanon mechaniczny = snapshot EN;
tłumaczenie opisujemy jako tłumaczenie, nie kanon).

**Dla sesji agentskiej:** przy materializacji najpierw blok danych
i kontekst setu, potem warstwy mechaniki i odczyt flavoru; nigdy nie
opisywać ilustracji; punkty podsumowania formułować jako tezy
do rozważenia przez przyszłe hasła.
