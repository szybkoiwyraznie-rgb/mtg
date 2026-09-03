# ADR 0031: Prywatne źródła fanowskie mogą być bazą wektoryzacji map planów

- **Status:** Zaakceptowana
- **Data:** 2026-09-03
- **Decydenci:** właściciel projektu (feedback 2026-09-03: projekt prywatny/niepubliczny; fan-made mapa Ravniki może być źródłem dokładniejszej wektoryzacji); agent Arena (sesja PR-13)
- **Zastępuje:** doprecyzowuje ADR 0009 pkt 4 poza przypadkiem Śródziemia; rozszerza praktykę źródeł fanowskich z mapy Zendikaru
- **Powiązania:** ADR 0008 (`img/` i ciężkie prywatne obrazy poza gitem), ADR 0018 (mapforge), ADR 0019 (styl atlasowy), ADR 0027 (mapy jako osobne strony HTML)

## Kontekst

Dotychczas przy mapach obowiązywała ostrożność: rastry oficjalne i fanowskie
nie były osadzane, a Ravnica v1/v2 została narysowana własnym warsztatem
mapforge z tekstowego kanonu i transkrypcji właściciela. Po obejrzeniu mapy
Ravniki właściciel wskazał, że posiada dużo ładniejszą i dokładniejszą
fan-made mapę wektorową w formie zrzutu oraz że projekt jest prywatny i
niepubliczny. Oczekiwany kierunek: używać takiego źródła podobnie jak mapy
Śródziemia — jako dokładnego podkładu wektorowego — zamiast trzymać się
uboższej rekonstrukcji, gdy lepsza geometria jest dostępna.

## Decyzja

1. **Źródło fanowskie dostarczone przez właściciela może być bazą
   wektoryzacji mapy planu** w prywatnym Codexie, jeżeli właściciel jasno
   wskazuje je jako dopuszczalne źródło. Dotyczy to przede wszystkim
   geometrii: obrysów, granic, dróg, położenia etykiet i kompozycji mapy.
2. **Raster źródłowy nie musi trafiać do repozytorium.** Preferowany tor:
   plik źródłowy w `/home/user/uploads/` lub innym prywatnym katalogu
   roboczym → ekstrakcja/trace → wynikowy `maps/<plan>/podklad.svg` oraz
   `scena.json`/`map.json` w repo. Jeżeli źródło ma być trwale przechowane,
   decyzję o commitowaniu binarium podejmuje właściciel osobno.
3. **Wynik musi być jawnie opisany w proweniencji mapy.** `map.json`,
   `mapa-analiza.md` albo osobny plik `zrodlo-*.md` zapisują: kto dostarczył
   źródło, datę, charakter źródła (fan-made/prywatne), zakres użycia i
   ewentualną relację do kanonu. Kanon świata nadal rozstrzyga sprzeczności
   merytoryczne, chyba że właściciel wybierze świadomą mapę kolekcji jako
   wariant niekanoniczny.
4. **Trace rastra jest dozwolony, ale kontrolowany.** Nie robimy ślepego,
   nieaudytowanego „potrace i commit”. Minimalny proces: próba ekstrakcji
   warstw (kontury, granice, drogi, etykiety), render porównawczy,
   kontrola wizualna w podglądzie, `map-audit.py`, testy i opis różnic.
5. **Styl końcowy może być adoptowany albo przerysowany.** Jeżeli źródło jest
   czyste i czytelne, mapa może wejść jako podkład T2/T2+ (adoptowany SVG).
   Jeżeli wymaga ujednolicenia z Codexem, geometria służy jako matryca dla
   mapforge T4.

## Konsekwencje

**Dodatnie:** Codex może korzystać z najlepszych prywatnych źródeł właściciela;
mapy planów nie muszą być uboższą rekonstrukcją, gdy istnieje dokładny
fanowski wektor; Ravnica może dostać podkład bliższy przesłanej mapie
Dziesiątego Dystryktu.

**Ujemne:** taki podkład jest silniej zależny od konkretnego prywatnego
źródła i wymaga uczciwej proweniencji. Automatyczne wektoryzacje mogą mieć
śmieciowe ścieżki, więc potrzebują ręcznego czyszczenia i kontroli jakości.

**Dla sesji agentskiej:** jeżeli właściciel dostarcza mapę obrazem i prosi
o wektoryzację, nie odrzucaj zadania wyłącznie z powodu licencji. Sprawdź,
czy plik naprawdę jest dostępny w sandboxie; nie commituj rastra źródłowego
bez osobnej potrzeby; wynik dokumentuj jako źródło prywatne/fan-made i
porównuj wizualnie w podglądzie.
