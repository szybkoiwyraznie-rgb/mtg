# ADR 0038: Drabina preferencji wariantów map — T2 → T1 → T3 → T4

- **Status:** Zaakceptowana
- **Data:** 2026-09-08
- **Decydenci:** właściciel projektu (decyzja 2026-09-08, czat: jawne
  uszeregowanie preferencji wariantów i polecenie zapisania go w ADR);
  agent Arena (sesja PR-23)
- **Zastępuje:** porządkuje i doprecyzowuje „drabinę wariantów" z ADR
  0007 §2, która wymieniała T1→T2→T3 jako ścieżkę *upgrade'u*, nie jako
  ranking preferencji przy wyborze wariantu dla nowego planu
- **Powiązania:** ADR 0007 (T1 hybryda), ADR 0009 (Śródziemie T2),
  ADR 0012 (Zendikar T3), ADR 0018 (mapforge), ADR 0031 (prywatne
  źródła fanowskie jako baza wektoryzacji), ADR 0033 (jedna mapa
  aktualnego stanu), ADR 0035 (raster T1 w repo, układ złoty)

## Kontekst

Sesja PR-23 opisała warsztat mapowy właścicielowi w sposób, który
sugerował, że rekonstrukcja z tekstu (T4) jest domyślną metodą
projektu, a przerysowywanie map fanowskich jest niepożądane.
**To była pomyłka agenta.** Właściciel skorygował: przerysowanie
dobrego rastra to nie obejście, tylko *preferowany* tor, a T4 jest
ostatecznością. Dotychczas ranking żył w praktyce i w kilku ADR-ach
naraz, ale nigdy nie został zapisany wprost w jednym miejscu — stąd
możliwość takiej pomyłki przy każdej nowej sesji.

Zapis jest tym potrzebniejszy, że statystyka repo sugeruje coś
przeciwnego niż preferencja: większość map to T4/T3, bo dotychczasowe
plany albo nie miały dobrych rastrów, albo rastry odrzucono po oglądzie.
Nowa sesja czytająca samo `maps/` mogłaby wziąć ten przypadek za normę.

## Decyzja

1. **Drabina preferencji przy wyborze wariantu dla planu** (od
   najbardziej do najmniej pożądanego):

   | Rząd | Wariant | Kiedy | Co powstaje |
   |---|---|---|---|
   | 1 | **T2** | istnieje gotowa geometria **wektorowa** (SVG/adoptowalny wektor) o akceptowalnej jakości | adoptowany albo ujednolicony wektor |
   | 2 | **T1** | istnieje **wyśmienity raster** (oficjalny lub fanowski) | raster jako podkład + wektorowa warstwa POI, pinezek i etykiet |
   | 3 | **T3** | istnieje **dobry źródłowo raster, łatwy do zwektoryzowania** | własny wektor przerysowany z geometrii rastra |
   | 4 | **T4** | **brak** użytecznego materiału graficznego | rekonstrukcja z opisów tekstowych, dopuszczalnie wspomagana rastrem przy osadzaniu POI |

2. **T4 jest ostatecznością, nie domyślną metodą.** Wybór T4 wymaga
   uzasadnienia w `map.json` (`zrodlo_fanmapa`, `poza_zakresem`) albo
   w nocie `zrodlo-*.md`: jakie źródła graficzne rozważono i dlaczego
   je odrzucono. „Nie szukałem" nie jest uzasadnieniem.

3. **Rastry fanowskie są pełnoprawnym źródłem** (ADR 0031 pozostaje
   w mocy): projekt jest prywatny, a geometria dobrej mapy fanowskiej
   bije rekonstrukcję z tekstu. Agent nie odrzuca źródła dlatego, że
   jest fanowskie — odrzuca je wyłącznie po **oglądzie**, z powodu
   jakości, sprzeczności z kanonem albo nieczytelności.

4. **Wariant wybiera się po researchu, nie przed.** Obowiązkowy krok
   MA1 (`docs/guides/PROCES_MAP.md`): kwerenda materiału graficznego
   → ogląd kandydatów → dopiero wtedy decyzja o rzędzie drabiny.
   Rekomendacja wariantu dla nowego planu jest **przedstawiana
   właścicielowi** przed rysowaniem, gdy plan jest znaczący lub gdy
   kandydaci są niejednoznaczni.

5. **Drabina działa w obie strony** (utrzymanie ADR 0035): plan
   z rekonstrukcją T3/T4 może później dostać raster jako drugi podkład
   pod przełącznikiem, a jego układ staje się złoty. Awans w górę
   drabiny nie jest porażką wcześniejszej pracy.

6. **T4 nie oznacza „bez rastra".** Rekonstrukcja tekstowa może używać
   rastra jako pomocy przy rozmieszczaniu POI, o ile geometria
   pozostaje własna, a rola źródła jest opisana w proweniencji.

## Konsekwencje

**Dodatnie:** jednoznaczny, zapisany porządek decyzyjny; mniejsze
ryzyko, że sesja pójdzie w kosztowną rekonstrukcję, mając pod ręką
dobry raster; jawne uzasadnienie przy każdym T4.

**Ujemne:** research mapowy przed wyborem wariantu wydłuża start prac
nad nowym planem — świadomy koszt.

**Dla sesji agentskiej:** nigdy nie deklaruj, że projekt „nie
przerysowuje map fanowskich". Przerysowanie jest sednem warsztatu;
rekonstrukcja z tekstu to ostatnia deska ratunku.
