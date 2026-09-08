# ADR 0033: jedna mapa planu = aktualny stan kanoniczny; sceny z innych epok pinowane do regionów

- **Status:** Zaakceptowana
- **Data:** 2026-09-05
- **Decydenci:** właściciel projektu (decyzja 2026-09-05 w czacie sesji:
  „jedna mapa z geografią post-Conflux wystarczy na cały plan — geografia
  się nie zmieniła, nastąpiło złączenie i powstanie Maelstromu; byty
  z Alary przed połączeniem mogą być lokowane w shardach po połączeniu”);
  agent Arena (sesja PR-20)
- **Kontekst:** pakiet PR-20 (Alara, karta 305ARB). Alara ma dwie
  fundamentalnie różne geografie: pre-Conflux (pięć odłamów-shardów
  dryfujących osobno w Blind Eternities) i post-Conflux (jeden scalony
  plan z Maelstromem w punkcie złączenia). Powstało pytanie o model
  epok: jedna mapa, dwie mapy czasowe, czy mapa „przed”?
- **Powiązania:** ADR 0026 (fabuła dostawy kotwicą), ADR 0031/0032
  (proweniencja map; plany-franczyzy), ADR 0032 nie jest naruszony —
  dotyczy światów bez kanonicznych relacji przestrzennych (sagi),
  nie epok jednego planu.

## Kontekst

Kanon (mtg.wiki, hasła Alara i Maelstrom): Sundering rozłamał Alarę
na pięć odłamów wzdłuż linii many; Conflux scalił te same masy lądu
z powrotem w jeden plan, a w punkcie złączenia pięciu shardów powstał
Maelstrom. Regiony zachowały tożsamość (Bant pozostaje Bantem itd.) —
zmienił się stan planu, nie położenie „kontynentów” względem siebie
w obrębie scalonej całości. Sceny z epoki ALA (Shards of Alara) dzieją
się więc w regionach, które istnieją także na mapie post-Conflux;
jedynym bytem przestrzennym, którego nie ma pre-Conflux, jest sam
Maelstrom.

## Decyzja

1. Plan MTG reprezentuje **jedna mapa w aktualnym (ostatnim
   kanonicznym) stanie planu** — dla Alary: post-Conflux. Sceny kart
   z wcześniejszych epok pinuje się do regionów tej mapy (epokę sceny
   niesie fabuła i sekcje karty, nie osobna geometria).
2. **Osobne mapy epok** powstają wyłącznie, gdy epoki różnią się
   TOPOLOGIĄ niereprezentowalną na jednej mapie (np. zniknięcie
   całego kontynentu) — i tylko na żądanie karty, która takiej sceny
   potrzebuje (inkrementalność, ADR 0015).
3. Plany-franczyzy wielu światów (ADR 0032, Final Fantasy) pozostają
   modelem podmap per świat — to nie epoki, lecz odrębne przestrzenie.

## Konsekwencje

- `content/planes/alara.md` ma `mapa: alara` (jedna mapa, wariant T3 — transkrypcja fanowskiej topologii (ADR 0031);
  geografia post-Conflux z Maelstromem w centrum).
- Karta 305ARB (scena w Maelstrom, era ARB) pinuje dokładnie
  w Maelstrom; przyszłe karty ALA pinują do swoich regionów.
- Nie buduje się map „na zapas” epoki pre-Conflux — pięć odłamów
  wróci jako podmapa wyłącznie, gdy karta będzie miała scenę
  niereprezentowalną na mapie scalonej (np. „przestrzeń między
  shardami w Blind Eternities”).
- Proweniencja epoki w `map.json`: pole `zrodlo.notka` explicite
  niesie stan planu, który mapa przedstawia.

## Uzupełnienie 2026-09-06 — Mirrodin / New Phyrexia (decyzja właściciela)

Kontekst: pakiet 2 PR-21 (karta 488SOM, mapa `maps/mirrodin/` T4).
Mirrodin ma trzy stany: Argentum → Mirrodin (MRD/DST/5DN) → wojna
o New Phyrexię (SOM/MBS/NPH) → przebudowa planu w dziewięć sfer (ONE).
Pierwsza wersja mapy stawiała granicę „przed kompleacją”.

Właściciel (czat 2026-09-06): „Na razie jedna mapa, a jak przyjdzie
karta wymagająca kompletnie przebudowanej geografii, to zrobimy nową
mapę.” Zastosowanie §1–2 do Mirrodinu:

1. **Jedna mapa powierzchni** obsługuje wszystkie sceny od Argentum po
   koniec wojny o New Phyrexię włącznie — wojna psuje regiony, ale nie
   zmienia ich topologii (kryterium §2 nie jest spełnione).
2. Granicą jest dopiero **przebudowa planu w dziewięć koncentrycznych
   sfer** (Tangle → Hunter Maze, morze → Surgical Bay, powierzchnia →
   Mirrex): topologia nieprzedstawialna na mapie półkuli. Osobna mapa
   sfer powstanie wyłącznie na żądanie karty z taką sceną (§2, ADR 0015);
   karta osadzona na Mirrexie pinuje się nadal na mapie powierzchni.
3. Wzorzec ogólny: „przed/po” nie liczy się od wydarzenia fabularnego
   (kompleacja, Conflux), lecz od **zmiany topologii** — dopisek epoki
   w `zrodlo.notka` ma nazywać erę mapy w tych kategoriach.

## Uzupełnienie 2026-09-07 — Tarkir (dwie linie czasowe; decyzja właściciela: T4)

Kontekst: pakiet 3 PR-21 (karta 509KTK Highland Game z *Khans of
Tarkir*, mapa `maps/tarkir/` T4). Tarkir ma trzy stany kanoniczne na tej
wspólnej siatce regionów: **oryginalne „teraz” khanów** (KTK),
**zmienione „teraz” smoczych lordów** (DTK — po tym, jak Sarkhan ocalił
Ugina) i **Tarkir: Dragonstorm** (po Rytuale Stormnexus). FRF przedstawia
odległą przeszłość ze smokami, nie bezsmoczne „teraz” KTK. Zmieniają się
władcy, część nazw (Sage-Eye → Dragon's Eye), a także niektóre lokacje
i krajobrazy. Karakyk Valley nie jest wcześniejszą nazwą Ayagor/Summer
Landing; wspólna siatka jest konwencją rekonstrukcji (errata poniżej).

Właściciel (czat 2026-09-07) wybrał T4 po raporcie T2→T3→T4 i dostarczył
raster fanowski Lore Café jako źródło pomocnicze geometrii (ADR 0031).
Zastosowanie §1–2 do Tarkiru (rekomendacja agenta z raportu, bez
sprzeciwu właściciela — do potwierdzenia przy recenzji):

1. **Jedna mapa fizyczna Tarkiru** obsługuje sceny wszystkich trzech
   epok (kryterium §2 — zmiana topologii — nie jest spełnione).
   Odstępstwo od §1 („aktualny stan kanoniczny”): etykiety osad są
   w nazwach **epoki khanów**, bo z niej pochodzi karta, która plan
   otworzyła, a osady późniejszych epok to głównie przemianowania
   tych samych miejsc. Osady istniejące tylko w epokach późniejszych
   są wyliczone w `map.json` (`poza_epoka`) — kolejne karty DTK/TDM
   pinują na tej samej mapie, a nazwę epoki niesie karta.
2. Obiekty **czysto fizyczne** poświadczone tylko w późniejszym kanonie
   (Glintglaze Lake, Rainveil Forest, Pearl Lake, Marang River…) są
   dopuszczone jako relacyjne uzupełnienie mapy epoki khanów, o ile
   źródło nie wiąże ich powstania, odsłonięcia lub danej nazwy z inną
   linią czasową. Nie przenosi się automatycznie każdego obiektu TDM.
3. Wzorzec ogólny (rozszerzenie pkt 3 uzupełnienia o Mirrodin): gdy
   plan ma kilka linii czasowych na jednej topografii, mapa dostaje
   etykiety epoki **pierwszej karty planu w Kodeksie**, a różnice nazw
   między epokami dokumentuje `map.json`; osobna warstwa/mapa epoki
   powstaje wyłącznie na żądanie karty, której scena wymaga innych
   nazw w stopniu uniemożliwiającym czytelną pinezkę.

### Aktualizacja 2026-09-07 (późniejsza, ta sama sesja) — Tarkir dostaje DWA podkłady epok (ADR 0035)

Właściciel po obejrzeniu mapy T4 obok rastra Lore Café zdecydował: raster
wchodzi do repo jako podkład **T1 (epoka Tarkir: Dragonstorm)**, a
rekonstrukcja T4 zostaje jako podkład **epoki khanów**; na stronie mapy
działa przełącznik T1 ↔ T4. To nadal JEDNA mapa (pkt 1 powyżej stoi):
wspólna topografia, wspólne pinezki w jednym układzie współrzędnych
(złoty = raster T1), a różnice nazw między epokami niesie podkład, nie
osobna mapa. Pkt 3 (wzorzec ogólny) zostaje rozszerzony: gdy właściciel
dostarczy raster innej epoki, może on być drugim podkładem tej samej
mapy — bez potrzeby spełnienia kryterium §2 (zmiana topologii), które
dotyczy osobnych MAP z osobnymi współrzędnymi. Szczegóły: ADR 0035.

### Errata faktograficzna 2026-09-07 — audyt PR #21 (bez nowej decyzji o modelu map)

W uzasadnieniu pomylono sekcję wiki „Historical” z epoką KTK. Przewodnik
DTK cz. 2 wyklucza istnienie cyrku Karakyk z KTK w linii Atarki, a Ayagor
i Melting Wilds wiąże z jej panowaniem. TDM cz. 2 wymienia Karakyk Glacial
Settlement osobno od Summer Landing (dawnego Ayagor). First Tree z KTK
należy do Arashin, nie do zmierzonej na T1 oazy Anafenza's Kin-Tree.

Korekta tych faktów i doboru obiektów w T4 **nie zmienia decyzji
właściciela z ADR 0035**: jedna mapa, dwa podkłady, T1 domyślny i wspólne
współrzędne pinezek. Nie otwiera zgody na nowe mapy ani migrację
pinezki karty. Złoty punkt regionalny nie dowodzi tożsamości konkretnej
osady w różnych epokach; taką tożsamość trzeba sprawdzić w lore.

Źródła:
- https://magic.wizards.com/en/news/magic-story/planeswalkers-guide-dragons-tarkir-part-2-2015-03-18
- https://magic.wizards.com/en/news/feature/planeswalkers-guide-to-tarkir-dragonstorm-part-2
- https://magic.wizards.com/en/news/feature/planeswalkers-guide-khans-tarkir-part-1-2014-09-03
- https://magic.wizards.com/en/news/feature/planeswalkers-guide-to-tarkir-dragonstorm-part-1
