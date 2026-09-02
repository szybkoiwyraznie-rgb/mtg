# ADR 0023: Twarda zasada wiązania etykieta ↔ obiekt; wycofanie obwódki rzek (ciemniejsza woda); porządki stylu wody

- **Status:** Zaakceptowana
- **Data:** 2026-09-02
- **Decydenci:** właściciel projektu (recenzja 3 preview PR-10, czat:
  uwagi (1) etykiety przy POI „GENIALNIE"; (2) twarda zasada wiązania;
  (3) obwódki rzek słabe — powrót do jednolitego koloru + pociemnić
  wodę; (4a) falka Halimar do usunięcia; (4b) Emeria nieprzypięta);
  agent Arena (implementacja, sesja PR-10)
- **Zastępuje:** punkt 4 ADR 0022 (obwódka rzek — wycofana po obejrzeniu
  w preview); **aktualizuje:** ADR 0021 pkt 2 (wartość wypełnienia wody
  motywu atlasowego: `#e2ecf4` → `#d4e2ee` — przyciemniona dla kontrastu
  z papierem, w zamian za obwódkę)
- **Powiązania:** ADR 0010 (hierarchia kanonu), ADR 0013 (proweniencja
  map.json), ADR 0021/0022 (styl map T4)

## Kontekst

Po naprawie mechaniki etykiet (ADR 0022) właściciel ocenił dopasowanie
etykieta–POI jako wzorcowe, ale wskazał, że mapa wciąż ma etykiety
oderwane od obiektów i obiekty bez etykiet (bezimienne wulkany Akoum,
ruiny na zachód od Oka Ugina, Emeria nieprzypięta do hedronu) —
i zaproponował twardą zasadę. Obwódka rzek (pkt c poprzedniej recenzji)
po obejrzeniu wypadła źle przy ujściach („język z obwódką").

## Decyzja

### 1. Twarda zasada wiązania (obowiązuje wszystkie sceny T4)

1. **Nie ma POI bez etykiety.** Każde POI (miasto/ruina/hedron/wulkan)
   ma etykietę zakotwiczoną w nim (`przyDo`), ALBO należy do **nazwanej
   grupy**: w promieniu 160 j. istnieje POI tego samego typu z etykietą
   (stożki „Teeth of Akoum", pola hedronowe przy nazwanym POI).
   Obiekt, dla którego kanon nie daje nazwy, **usuwamy** — mapa
   rekonstrukcyjna nie utrzymuje bezimiennych dekoracji (ADR 0010:
   nie zmyślamy nazw).
2. **Nie ma etykiety bez twardego punktu odniesienia.** Kotwica
   etykiety obiektowej musi trafiać w POI, w jezioro albo leżeć NA
   LĄDZIE wewnątrz nazywanego obszaru (biom/region/przełęcz — punkt
   reprezentatywny zawiera się w obszarze). Etykiety obiektów wodnych
   (zatoki, jeziora, wodospady, rzeki przy ujściu — wspólna whitelist
   `STREFY_WODNE_DOMYSLNE`, spójna z map-audit) kotwiczą się w wodzie,
   którą nazywają, i mogą nad nią zwisać.
3. **Egzekwowanie:** `sprawdzWiazania(scena)` w mapforge — CLI wypisuje
   naruszenia przy każdym renderze, test integracyjny wymusza **0 uwag**
   dla scen repo (Zendikar + demo). Nowa scena nie przejdzie z POI bez
   etykiety ani z etykietą bez punktu.

### 2. Woda: bez obwódek, ciemniejszy ton

Obwódka wstęgi rzeki (ADR 0022 pkt 4) **wycofana** — rzeki wracają do
jednolitego koloru wody zlewającego się z akwenami (ADR 0020/0021);
w zamian wypełnienie wody motywu atlasowego przyciemnione
(`#d4e2ee`), by kontrastowało z papierem. Falka/grzbiet na tafli
Halimar usunięta (`fale: false`); drobne łuki fal pozostają dozwolone
na małych jeziorach.

### 3. Zastosowanie do Zendikaru (w tej sesji)

- Przypięte do obiektów: Emeria + „ruiny w niebie" (hedron), Valakut
  (wulkan), Teeth of Akoum (centralny stożek — grupa 3 wulkanów),
  The Bulwark (pasmo), Explorers Peak (szczyt), Glasspool (jezioro),
  Ora Ondar/Khalni Heart (punkty w lesie), Benthidrix, Chill Depths,
  Riverroot, Wolfbriar, Mosscrack, Makindi Trenches (punkt na lądzie),
  Surrakar Caves (jaskinie — usunięty błędnie podpięty POI osady).
- Nazwane z kanonu: **Sejiri Refuge**, **Jwar Isle Refuge**,
  **Graypelt** (cykl refuge, karty ZEN), **Helix of Zof** (lista ruin
  post-Eldrazi). Usunięte bezimienne dekoracje: 3 ruiny (Akoum,
  Guul Draz, Murasa) i 2 hedrony (Ondu).
- E-geo-3 (detal Murasy) domknięte: Visimal, Tumbled Palace,
  Glint Pass, Thunder Gap, Roaring Falls, Pillar Plains (przeniesione
  do Thunder Gap — Guide > fanmapa). Umung = rzeka (nie osada!),
  etykieta przy ujściu do Bojuka Bay.
- Korekty rejestru kotwic (map.json, z notkami): Pillar Plains,
  Living Spire (kotwica wskazywała morze), Tumbled Palace
  (rozgęszczenie południowej Murasy).

## Konsekwencje

**Dodatnie:** mapa bez „sierot" (etykiet-duchów i bezimiennych ikon);
zasada egzekwowana automatycznie na każdej przyszłej scenie; rzeki
znów zlewają się z morzem; woda czytelniejsza na tle papieru.

**Ujemne:** w bardzo gęstych strefach (płd. Murasa) spełnienie zasady
wymaga świadomego rozmieszczania danych (przesunięcia pozycji
orientacyjnych, mniejsze stopnie pisma drobnych obiektów) — pozycje
fanowskie-orientacyjne bywają korygowane z notką w rejestrze;
usunięcie dekoracji zubaża wizualnie tam, gdzie kanon nie daje nazw.

**Dla sesji agentskiej:** nowy POI zawsze z etykietą (lub w nazwanej
grupie); nowa etykieta zawsze z twardym punktem; naruszenia widać
w wyjściu CLI i w teście — nie wolno ich ignorować; nazwy wyłącznie
z kanonu z cytowaniem (ADR 0010).
