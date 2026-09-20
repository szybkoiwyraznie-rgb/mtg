# Lorwyn–Shadowmoor T4 — źródła i wspólny układ

Decyzja właściciela: ADR 0037. T1 odrzucone; żadna z wyszukanych map
Varghedina ani pozostałych autorów nie jest matrycą tej geometrii.
Numer kolekcji 605, imgId 605SHM pozostają niezmienne (ADR 0036).

## Zakres i konwencja

Klasyczna epoka Oony, dwa zestawy nazw na jednym autorskim układzie
2000×1400. To znana kraina otoczona górami, nie kartograficzny pomiar
całego globu. Wspólna geometria jest konwencją atlasu wybraną przez
właściciela; nie twierdzimy, że Wielka Zorza zmieniała tylko nazwy.
Eclipsed i nowe po nim miejsca czekają na kartę, która ich wymaga.

## Wiążące relacje i granice rekonstrukcji

- Zachodnia kraina i Wielki Las — na zachód/północ od głównej arterii;
  Gilt-Leaf/Wilt-Leaf po stronie wschodniej.
- Mistmeadow na północ od Kinscaer, Wilt-Leaf na wschód od Mistmeadow
  po drugiej stronie Wanderbrine.
- Lys Alana/Cayr Ulios we wschodnim lesie; Glen Elendra w górskiej
  dolinie na południe od tej osady. Brak publicznego traktu do ukrytej glen.
- Murmuring/Weeping Bosk nad rzeką i w lesie, daleko od Kinsbaile;
  Wren's/Raven's Run w zachodnim kompleksie leśnym.
- Tanufel/Kulrath i małe jezioro źródłowe Wanderwine/Wanderbrine.
  Północne położenie szczytu jest wyborem rekonstrukcji, nie znanym azymutem.
- Pozostałe osady mają kanoniczne nazwy/pary, ale ich wzajemne odległości
  i pozycje wewnątrz krain są umowne. Źródło każdej kotwicy w map.json.
- Przebiegi bezimiennych dopływów, zasięgi lasów/łąk i połączenia osad
  kithkin są rekonstrukcją. Nie nadano im fikcyjnych nazw własnych.
- Główna rzeka biegnie poza dolny brzeg kadru; nie dorysowano oceanu.
  Dopływy kończą się na osi rzeki wyznaczonej tym samym wygładzaniem
  co renderer. Źródło głównego cieku leży w małym jeziorze.
- Zalesiony biom przy Glen to jej otoczenie, nie obrys kanonicznych
  stu akrów doliny. Pinezka 605SHM dotyczy ostępów, nie tronu.

## Nazwy

Pary: Burrenton/Barrenton, Ballyrush/Ballynock, Cloverdell/Thistledown,
Goldmeadow/Mistmeadow, Kinsbaile/Kinscaer, Lys Alana/Cayr Ulios,
Mudbutton Warren/Greasewretch Warren, Murmuring Bosk/Weeping Bosk,
Wren's Run/Raven's Run, Gilt-Leaf Wood/Wilt-Leaf Wood,
Mount Tanufel/Mount Kulrath, Wanderwine/Wanderbrine.
Glen Elendra i Velis Vel zachowują nazwę. The Great Forest nie otrzymuje
zmyślonego nocnego aliasu — napis jest tylko na dziennym widoku.
„Źródło Wanderbrine” jest opisem funkcji, nie rzekomo kanonicznym imieniem.

## Wzbogacenie 2026-09-18 (pass mapowy PR-35)

Dodane kanoniczne lokacje klasycznej epoki (mtg.wiki/Lorwyn-Shadowmoor,
sekcje „Locations on Lorwyn/Shadowmoor”); żadna nie otrzymała zmyślonego
aliasu drugiego oblicza:

- **Dundoolin** (dzień) — drugi co do wielkości clachan, mędrcy
  Eightyfold Trail; nocny odpowiednik nieznany kanonowi.
- **Spinerock Knoll** (dzień) — wzgórze-smok; kowale Burrenton biorą
  z niego kamyki, stąd sąsiedztwo clachanu jako relacja.
- **Mosswort Bridge** (dzień) — most z uwięzionym trollem; położenie
  na przecięciu szlaku clachanów z bezimiennym dopływem jest wyborem
  rekonstrukcji (kanon nie podaje miejsca).
- **Windbrisk Heights** (dzień) — urwisko-raptor przy zachodnim paśmie.
- **Porringer Valley** (dzień) — zalesiona dolina jesionowych treefolk;
  zalana „Porringer Basin” to stan Eclipsed, poza zakresem mapy.
- **Ashenmoor** (noc) — czarny dom cinderów; przy północnych górach,
  bo cinders to nocne oblicze flamekinów gór (relacja, nie pomiar).
- **Druim Calad** (noc) — jedyny duży naziemny port Shadowmooru,
  na brzegu Wanderbrine.

Nazwy jednostronne renderują się wyłącznie w swoim obliczu (test
identyczności nietekstowej geometrii pozostaje w mocy). Oba rastry
obejrzane w sesji PR-35 (L10). Kotwice map.json zaktualizowane świadomie
z generatora, pinezki nietknięte.

## Generator i weryfikacja

`node tools/mapforge/lorwyn-scena-t4.mjs` odtwarza:

- `scena.json` / `podklad.svg` — Shadowmoor (domyślny);
- `scena-lorwyn.json` / `podklad-lorwyn.svg` — Lorwyn.

Źródło miejsc i współrzędnych jest jedno (`MIEJSCA_LORWYNU` w generatorze).
Sceny różnią się tylko tablicą etykiet. Test porównuje także SVG po
usunięciu tekstu: cała nietekstowa geometria ma być identyczna.
Obie kalibracje są z konstrukcji tożsamościowe, a nie oszacowane z rastrów.

**Generator inicjalizuje map.json tylko przy jego braku.** Kolejne
uruchomienia nie nadpisują rejestru pinezek i nie usuwają przyszłych
kart. Gdy zmienia się kotwica w generatorze, map.json wymaga świadomej
aktualizacji — pilnuje tego test spójności. Oba `podklad*.svg` obejmuje
map-audit; przegląd nie kończy się na domyślnym obliczu.

## Źródła tekstowe

- Doug Beyer, Lorwyn Survival Guide (2007) — ludy, góry, Merrow Lanes,
  wielki las, Murmuring Bosk, glen i Velis Vel:
  https://web.archive.org/web/20071102030827/http://www.wizards.com/default.asp?x=mtgcom/daily/db8
  (współczesny URL artykułu zwracał stronę 404; użyto działającego archiwum).
- Zestawienie geografii, wyłącznie klasyczne miejsca:
  https://mtg.wiki/page/Lorwyn-Shadowmoor
- Dolina i jej ochrona: https://mtg.wiki/page/Glen_Elendra
- Osady i odpowiedniki: https://mtg.wiki/page/Clachan/Doun,
  https://mtg.wiki/page/Ballynock,
  https://mtg.wiki/page/Cloverdell/Thistledown,
  https://mtg.wiki/page/Goldmeadow/Mistmeadow,
  https://mtg.wiki/page/Kinsbaile/Kinscaer
- Stolica i safehold (Cayr — pisownia z Eventide):
  https://mtg.wiki/page/Lys_Alana/Caer_Ulios
- Lasy: https://mtg.wiki/page/Gilt-Leaf_Wood/Wilt-Leaf_Wood,
  https://mtg.wiki/page/Wren%27s_Run/Raven%27s_Run,
  https://mtg.wiki/page/Murmuring_Bosk/Weeping_Bosk
- Źródła rzeki: https://mtg.wiki/page/Mount_Tanufel,
  https://mtg.wiki/page/Mount_Tanufel/Mount_Kulrath,
  https://mtg.wiki/page/Wanderwine_River/Wanderbrine_River
- Grota: https://mtg.wiki/page/Velis_Vel

## Addendum 2026-09-20 — pass mapowy PR-35 (trzy Pętle, pętla 4)

Drugi pass wzbogacający: 7 klasycznych miejsc epoki Oony z mtg.wiki
(Lorwyn-Shadowmoor „Geography"; źródła klasyczne — powieść Lorwyn,
Survival Guide, SHM Guide), kotwice 24 → 31:

- **Mornsong** + **Arbor Morning** — las i stolica plemienia elfów
  Mornsong (pozycja względem Gilt-Leaf nieznana — rekonstrukcja na
  południowo-wschodnich polanach; dodany mały biom `las-mornsong`);
- **Fen Grieve** — port rzeczny z posągiem taercenna Grieve (funkcja
  portu wiąże z Wanderwine);
- **Duinshyle** — clachan „daleko od Kinsbaile";
- **The Bubbling Bog** — bagnisko-przekleństwo kithkin (na mokradłach
  przy rzece);
- **Howltooth Hollow** — jaskinia z barghestem (SHM Guide; nazwa tylko
  nocna);
- **Amphitheater of Galanda Feudkiller** — misa dolmenów olbrzymów
  (Survival Guide; w północnym paśmie).

Nazwy jednostronne zgodnie z kontraktem: bez wymyślonych aliasów
(Mornsong/Arbor Morning/Fen Grieve/Duinshyle/Bubbling Bog/Amfiteatr —
tylko dzień; Howltooth Hollow — tylko noc). Nowe jednostronne osady bez
glifów POI (walidator wymaga etykiety przy glifie w OBU obliczach).
Stany Eclipsed/ECL (Bristlebane, Longlake, Glen Priseil, Grave of Nath)
świadomie poza zakresem. Oba rastry obejrzane (L10); po pierwszym
oglądzie zawężono las Mornsong, by nocą nie połykał Druim Calad.
Pinezka 605SHM nietknięta (L18); map-audit 0.
