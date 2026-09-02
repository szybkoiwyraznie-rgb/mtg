# ADR 0022: Etykiety wg jednego wzoru (pod obiektem, konflikt → nad; kotwica zoom-stabilna w nakładce) + zakaz nakładania warstw rzeźby/biomów + obwódka rzek

- **Status:** Zaakceptowana
- **Data:** 2026-09-02
- **Decydenci:** właściciel projektu (recenzja preview PR-10, 2026-09-02,
  czat — uwagi (b) KRYTYCZNE, (c), (d); diagnoza „skalowanie napisów vs
  skalowanie mapy" potwierdzona w kodzie); agent Arena (sesja PR-10)
- **Zastępuje:** punkt 4 ADR 0021 w części mechaniki rozstawu („etykieta
  siada przy badge'u" przez ręczne pozycje x/y + wyszukiwanie wolnych
  pozycji w promieniach/kierunkach) — reguła „przy obiekcie" pozostaje,
  realizuje ją jeden wzór opisany niżej
- **Powiązania:** ADR 0018 (mapforge), ADR 0019/0021 (styl map T4),
  ADR 0007 (silnik map Codexu), LESSONS L5 (markery w nakładce ekranowej)

## Kontekst

Właściciel po obejrzeniu preview zgłosił trzy uwagi:

- **(b) KRYTYCZNE — etykiety rozjechane:** „praktycznie żadna nie pasuje
  do miejsca, które opisuje". Diagnoza (potwierdzona w kodzie): nakładka
  ekranowa Codexu wyjmuje `<text>` z SVG i renderuje w STAŁYM rozmiarze
  ekranowym, w punkcie zakotwiczonym w jednostkach mapy — przy małym
  zoomie napis jest ~2,5× większy względem mapy niż w SVG (nachodzi na
  sąsiednie obiekty), przy dużym odsunięcie w jednostkach mapy rośnie
  w pikselach, a czcionka stoi — etykieta „odjeżdża" od obiektu.
  Dodatkowo rozstaw w SVG szukał pozycji w 7 promieniach × 16 kierunkach
  (16–118 px) — bez jednego wzoru. Właściciel zażądał: „ustalasz punkt
  centralny miejsca i pod nim zawsze zaczynasz napis — zawsze w tej samej
  minimalnej odległości […] konflikty zawsze tak samo: przesuwasz z «pod»
  na «nad»" oraz odległości WZGLĘDNEJ (skalującej się z zoomem jak mapa).
- **(c):** rzeki mają dostać obwódkę w ciemniejszym niebieskim.
- **(d):** biomy/obiekty nie mogą się nakładać (góry/lasy/bagna/lód/
  step/jeziora) — „na Sejiri nie widać gór, bo zakryły je lodowce, na
  Ondu większość gór zakryta przez puszcze"; eliminacja przez
  zmniejszanie obszaru jednej z warstw.

## Decyzja

### 1. Etykiety obiektowe — jeden wzór (mapforge, `rozstawEtykiety` v3)

1. Etykieta obiektowa (drobna, nieobrócona; każda z `przyDo` oraz każda
   fs < 16 bez `duze`) kotwiczy się w **punkcie centralnym obiektu**
   (`przyDo`, a bez niego własny x/y) i zaczyna się **ZAWSZE POD** nim,
   wyśrodkowana, w minimalnym odstępie `r` = promień strefy ikony POI
   (miasto 11 · ruina 9 · hedron 11 · wulkan 27, × skala, + margines;
   goły punkt: 4).
2. **Konflikt** (kolizja bboxów lub napis całkiem w wodzie) → **ZAWSZE
   ta sama reakcja: przerzut NAD**; dalsze konflikty → drabinka pionowa
   (pod niżej / nad wyżej), nigdy w bok. Kolejność deterministyczna
   (ay, ax, tekst) — wynik nie zależy od kolejności sceny.
3. Etykiety **obszarowe** (`duze`, obrócone, fs ≥ 16 bez `przyDo` —
   nazwy krain/akwenów) zostają tam, gdzie ustawia je scena; rejestrują
   bbox, żeby obiektowe je omijały.
4. `etykieta()` emituje kotwicę jako **`data-ax/data-ay/data-r`** —
   kontrakt między silnikiem SVG a nakładką Codexu.

### 2. Nakładka ekranowa Codexu — odległość WIZUALNIE stała

Etykieta z `data-ax` jest pozycjonowana od **ekranowej pozycji kotwicy
obiektu**: pod ikoną w odstępie `r·k` (promień ikony skaluje się z zoomem)
+ stały margines 3 px — czyli wizualnie „zaraz obok" przy każdym
przybliżeniu (postulat właściciela). Układ (pod/nad/piętro) liczony tym
samym wzorem i tą samą drabinką co w SVG, przeliczany przy zmianie zoomu
(pan nie zmienia układu), tylko dla etykiet widocznych w danym LOD.

### 3. Zakaz nakładania warstw rzeźby i biomów (strefy zajęte)

1. Rozsiew biomów (`las`/`bagno`/`step`) **omija strefy zajęte**:
   bbox każdego glifu góry (`pasmoInstancje` — geometria 1:1 z `pasmo()`),
   stożki wulkanów, jeziora (elipsa lub poligon `d`) i poligony lodu.
2. Kolejne biomy sceny omijają poligony wcześniejszych — nakład dwóch
   biomów należy do pierwszego.
3. `lod` jest litą plamą — kolizji z górami nie rozwiązuje silnik, tylko
   **dane sceny** (zmniejszenie obszaru czapy; wzór właściciela pkt d);
   dla Zendikaru czapa Sejiri zmniejszona do zachodniej części
   kontynentu, pasmo odsłonięte.

### 4. Obwódka rzek

Wstęga rzeki/dopływu ma obrys w kolorze linii wody (`PAL.wodaStroke`,
ciemniejszy niebieski; rzeka 1,1 px, dopływ 0,8 px) — spójnie z obrysem
jezior i wybrzeży. Wypełnienie pozostaje kolorem wody bez gradientu
i opacity (ADR 0020/0021).

### 5. Naprawa przy okazji (zapis dla historii)

Wulkany sceny żyją w `poi` (typ `wulkan`); po zmianie kolejności warstw
(PR-9, pkt g) render czytał wyłącznie `scena.wulkany`, przez co 4 wulkany
(w tym Valakut) **znikały z mapy**. Warstwa WULKANY zbiera je teraz
z obu miejsc; regresję ujawnił dopiero ten refaktor.

## Konsekwencje

**Dodatnie:** etykieta zawsze przy swoim obiekcie — w SVG i w witrynie,
przy każdym zoomie; jeden wzór zamiast strojenia ręcznego (przyszłe mapy
dostają go za darmo); rzeźba terenu zawsze widoczna spod biomów; rzeki
czytelniejsze; kontrakt data-atrybutów wiąże silnik z viewerem.

**Ujemne:** ręczne pozycje x/y etykiet obiektowych w scenach przestają
mieć znaczenie (wzór je nadpisuje) — mniej kontroli artystycznej nad
pojedynczym napisem (świadomy koszt: spójność > ręczne wyjątki);
w bardzo ciasnych skupiskach drabinka pionowa może ustawić napis dalej
od obiektu (nigdy w bok); układ nakładki liczony per zoom (koszt O(n²)
przy ~90 etykietach — pomijalny).

**Dla sesji agentskiej:** nowych etykiet obiektowych nie pozycjonuje się
ręcznie — wystarczy `przyDo` (lub własny punkt); nie wracać do wyszukiwania
pozycji w kierunkach; strefy zajęte utrzymywać przy nowych typach obiektów;
kolizje lodu z górami rozwiązywać w danych sceny, nie z-orderem.
