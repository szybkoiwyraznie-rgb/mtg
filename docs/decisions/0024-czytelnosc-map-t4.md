# ADR 0024: Czytelność map T4 — ikony POI w kołach, granatowe etykiety wód, biomy omijają napisy, więcej traktów

- **Status:** Częściowo zastąpiona — pkt 3 (rozsiew biomów omija boxy
  etykiet) wycofany przez ADR 0025 (wycinanie polan pod tytułami;
  napis leży NAD lasem z halo); pozostałe decyzje w mocy
- **Data:** 2026-09-02
- **Decydenci:** właściciel projektu (recenzja 5 preview PR-10, czat:
  uwagi per kontynent + trzy uwagi generalne); agent Arena (sesja PR-10)
- **Doprecyzowuje:** ADR 0021/0022/0023 (styl i wiązania map T4);
  rozszerza zestaw kolorów funkcyjnych ADR 0021 pkt 2
- **Powiązania:** ADR 0018 (mapforge), ADR 0020 (glify)

## Kontekst

Po wdrożeniu twardej zasady wiązania właściciel przeszedł mapę
kontynent po kontynencie i zgłosił: ikony osad giną w rozsiewie bagien
i lasów; etykiety wód nieodróżnialne od lądowych; za mało traktów
między miastami; plus lista poprawek geograficznych (pasmo w morzu,
rzeka przez środek gór, przejścia „na pustce", wulkany-sieroty itd.).

## Decyzja

1. **Ikony miast i ruin wpisane w KOŁO z nieprzezroczystym tłem**
   (kolor lądu, obrys szary) — ikona czytelna na każdym biomie.
2. **Etykiety obiektów WODNYCH** (morza, zatoki, jeziora, rzeki,
   wodospady) rysowane **ciemnym granatem** (`PAL.etykietaWoda`:
   atlas `#1c3a5e`) — nowy kolor funkcyjny obok bordowych etykiet;
   lista `ETYKIETY_WODNE_KOLOR` (scena może nadpisać).
3. **Rozsiew biomów omija boxy etykiet** — pozycje etykiet liczone
   przed biomami (rysowane nadal na końcu): tytuły krain nie toną
   w puszczy.
4. **Podstawa każdego glifu pasma stoi na lądzie** (sprawdzane też na
   skrzydłach glifu) — pasma nie „włażą na morze".
5. **Nowy typ POI `iglica`** (samotna skalna/żywa iglica — Living
   Spire): jawny glif hero `g-016` (zgodnie z ADR 0020: hero tylko
   przez `glifId`).
6. **Trakty:** miasta tego samego kontynentu łączą się drogami tam,
   gdzie to geograficznie sensowne (nie przez pasma); w tej sesji +6
   traktów (Akoum ×2, Guul Draz ×2, Murasa, Sejiri).
7. **Reguły redakcyjne przejść i cieków:** etykieta przełęczy/wąwozu
   kotwiczy się PRZY murze/paśmie, które przecina (nie „na pustce");
   rzeka może zaczynać się W górach, ale nie przecina pasma w poprzek;
   nazwy rzek mogą iść wzdłuż biegu (obrót `kat`); ruiny przybrzeżne
   (Ior Ruin przy Glasspool) stoją NA BRZEGU, nie w tafli.

## Zastosowanie do Zendikaru (ta sesja)

Skyfang przycięty do lądu; rzeka Vazi wypływa z południowego stoku
pasma; Thunder Gap/Kazuul Pass zakotwiczone przy murze; Living Spire
z ikoną iglicy; wulkany Akoum zwarte w masyw „Teeth of Akoum" z etykietą
pod centralnym stożkiem; Oko Ugina przysunięte do pasma; Ior Ruin na
zachodnim brzegu Glasspool (Glass Haven odsunięte); Windblast Gorge
wzdłuż wąwozu (obrót); Umung wzdłuż rzeki na lądzie; dwie nowe połacie
dżungli Bala Ged (wschód/zachód); Makindi Trenches poza lasem; Beyeen
pod swoją wyspą; Chill Depths przy brzegu; +6 traktów.

## Konsekwencje

**Dodatnie:** ikony widoczne na każdym tle; wody odróżnialne na oko;
napisy czyste od rozsiewu; mniej „sierot" geograficznych. **Ujemne:**
koło tła zasłania odrobinę biomu pod ikoną; lista etykiet wodnych
wymaga utrzymania przy nowych scenach. **Dla agenta:** nowe wody
dopisywać do `ETYKIETY_WODNE_KOLOR` + whitelist stref wodnych;
trakty prowadzić po lądzie omijając pasma; przy tworzeniu przejść
kotwiczyć je przy górach.
