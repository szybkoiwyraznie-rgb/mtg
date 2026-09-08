# ADR 0040: Oryginalny druk karty nie jest kanoniczny — zero nawiązań i wniosków z printu

- **Status:** Zaakceptowana
- **Data:** 2026-09-08
- **Decydenci:** właściciel projektu (decyzja 2026-09-08, czat: „Oryginalne
  ilustracje z kart NIE SĄ kanoniczną częścią wpisu karty w naszej bazie.
  Kanoniczne są TYLKO ilustracje FOT i KON, do których zresztą nie masz
  dostępu. W związku z tym JAKIEKOLWIEK nawiązywanie do ilustracji na
  oryginalnej karcie, wnioskowanie o czymkolwiek na jej podstawie jest
  NIEZGODNE Z PROCEDURĄ. Wpisz to na sztywno do ADR-ów (chociaż powinno
  już tam być, bo to nie pierwsza taka sytuacja)"); agent Arena (sesja
  PR-25 — spisanie, egzekwowanie, naprawy PR-24)
- **Wzmacnia:** ADR 0016 §2 (brak sekcji „Ilustracja"; zero opisów tego,
  co widać na druku źródłowym) i ADR 0030 (metryka techniczna tylko
  w infoboksie) — reguła wychodzi z kontraktu szkieletu w całość
  pipeline'u (treść, pinezki, Źródła, notki map); tor obrazowy infoboksu
  z ADR 0008 pozostaje w mocy
- **Powiązane:** ADR 0014 (dane wydruku tylko w infoboksie), ADR 0017
  (FOT/KON w treści karty), ADR 0026 (Fabuła jako kotwica osadzenia),
  ADR 0010 (hierarchia kanonu), ADR 0036 (tożsamość kolekcji),
  LESSONS L8/L14, audyt `docs/audits/AUDYT_2026-09-08-PR24.md` (F1/F3/F6)

## Kontekst

To nie pierwsza sytuacja, w której oryginalny druk karty wlewa się do
treści bazy. ADR 0016 §2 (decyzja 2026-09-01) zniósł sekcję „Ilustracja"
i zabronił opisywania tego, co widać na druku źródłowym; ADR 0030
przeniosł metrykę techniczną do infoboksu. Reguły żyły jednak w
kontrakcie szkieletu Karty Katalogowej, nie w procesie — i sesja PR-24
(pakiet 40USG Expunge) złamała je nowym sposobem: scena karty zbudowana
z „odczytu artu" (research v2 wprost: „brak flavor textu (scena pochodzi
w całości z odczytu artu)"), identyfikacja ofiary przez detale druku,
sufit pewności pinezki ustalony z ilustracji („Ilustracja pokazuje
śmierć anioła w powietrzu nad kompleksem… stąd pewność region"), a w
Źródłach — galeria printu (Original Magic Art) jako źródło sceny.
Właściciel zakwalifikował to jako naruszenie procedury i zażądał reguły
na sztywno — z uwagą, że druk „nie jest kanoniczną częścią wpisu", a
kanoniczne ilustracje bazy to wyłącznie FOT i KON (prywatne, agent bez
dostępu).

## Decyzja

1. **Oryginalny druk karty (print Scryfalla) nie jest kanoniczną częścią
   wpisu.** Jest czystym zasobem graficznym infoboksu (tor ADR 0008,
   fallback = twarz syntetyczna) — i niczym więcej.
2. **Zero nawiązań w widocznej treści.** Treść Kart Katalogowych (wszystkie
   sekcje, w tym Źródła), Karty Haseł, strony planów, notki map i
   uzasadnienia pinezek nie zawierają odniesień do oryginalnego druku ani
   jego ilustracji — także „dla kontekstu": zakazane są m.in. „ilustracja
   pokazuje…", „na ilustracji karty…", „print pokazuje…", „obraz <artysta>",
   „podgląd printu", cytowanie galerii printów jako źródła.
3. **Zero wniosków z druku.** Scena, byty i lokalizacja karty nie
   wynikają z „odczytu artu": nie z widocznej sceny, nie z detali
   (kolory, symbole, tło) i nie z przedstawionego miejsca jako źródła
   pewności pinezki. Źródłem sceny jest wyłącznie **Fabuła właściciela**
   (wiążąca kotwica, ADR 0026) i **kanon świata docelowego** (z
   cytowaniami, ADR 0010).
4. **Pinezki: tylko lore.** `uzasadnienie` i `pozycja_zrodlo` pinezki
   wynikają z Fabuły i kanonu (nazwane miejsca na podkładzie; odczyt
   współrzędnych z pliku — L13). Druk nie jest elementem proweniencji.
5. **Artyści i dane wydruku żyją tylko w infoboksie** (dane snapshotu,
   ADR 0004/0014 — automatyczny render). Nazwiska artystów nie wchodzą
   do treści markdown kart, haseł, planów ani wpisów.
6. **FOT/KON to jedyne kanoniczne ilustracje** — i agent nie ma do nich
   dostępu: nie symuluje, nie opisuje i nie „rekonstruuje" ich treści;
   gdy ich brak, baza nie mówi nic o tym, jak ilustracje właściciela
   wyglądają (sondy `./img/`, ADR 0008/0017/0036).
7. **Egzekwowanie (L12):** `test/druk-zrodlowy.test.js` — dla każdej
   Karty Katalogowej: (a) brak „ilustracj*" w treści, z wyjątkiem linii
   nawiązujących do FOT/KON (ilustracje właściciela); (b) brak „wignett*";
   (c) brak nazwiska artysty ze snapshotu. Rozszerzenie na hasła/plany
   i notki map — dyscyplina audytowa (reguła, którą da się wyrazić
   maszynowo, trafia do walidatora z testem na wszystkich stronach).

## Konsekwencje

**Dodatnie:** scena karty ma jedno weryfikowalne źródło (Fabuła + kanon
z cytowaniami); klasa błędu „scena z printu" (w tym sufity pewności
pinezek) zostaje wykluczona systemowo; ilustracje właściciela nie są
zanieczyszczane agentowską interpretacją cudzego druku.

**Ujemne:** karty bez Fabuły i bez bogatego kanonu dostaną scenę chudą
(tylko to, co w danych karty i lore świata) — świadomy koszt (nie
zmyślamy sceny — ADR 0010); strażnik mechaniczny może oznaczyć linię
legalną (wyjątek FOT/KON jest wąski) — fałszywy alarm rozstrzyga się
poprawką treści lub świadomym doprecyzowaniem tego ADR, nie wyłączaniem
testu.

**Dla sesji agentskiej:** przy materializacji najpierw Fabuła z wpisu
(werbatim), potem kanon z cytowaniami; każdy opis sceny sprawdza się
pytaniem „skąd to wiem — z Fabuły/kanonu, czy z printu?" — drugie =
usuwanie; galerii printów i nazwisk artystów nie cytujemy w Źródłach.
