# Research mapowy: Eldraine — wybór wariantu podkładu

> **STATUS: WYKONANY (2026-09-11, MA1).** Kwerenda materiałów kartograficznych
> i analiza geografii planu Eldraine, inicjowanego dostawą karty
> `209ELD Burning-Yard Trainer`. Rekomendacja przedstawiona właścicielowi
> do decyzji zgodnie z drabiną preferencji **ADR 0038**.

Powiązania: ADR 0038 (drabina wariantów T2→T1→T3→T4), ADR 0018 (silnik mapowy mapforge),
ADR 0031 (źródła fanowskie i prywatny użytek), ADR 0033 (jedna mapa aktualnego stanu),
ADR 0043 (pinezki wyłącznie dla kart), precedensy: Alara (T4), Lorwyn (T4),
Zendikar (T4/T3), Faerûn (T1), Innistrad (T1).

---

## 0. Kontekst i karta inicjująca

Dostawa właściciela (2026-09-11):
- Karta: **209ELD Burning-Yard Trainer** (*Throne of Eldraine*, set `ELD`, #209, `{4}{R}`, Creature — Human Knight 3/3).
- Scena: Piaszczysta arena otoczona drewnianymi trybunami pod wieżami baśniowego zamku w Ardenvale; instruktor w czerwonej tunice z opuszczonym płonącym mieczem treningowym uspokaja wierzchowca, obok młody rycerz przed płonącym torem przeszkód; motyw ognia jako ostatecznego egzaminu rycerskiego w akademiach Eldraine.
- Lokacja fabularna: **The Burning Yard** (arena treningowo-turniejowa Dworów / zamek Embereth) z transpozycją do rycerskich szkół turniejowych **Ardenvale** w Królestwie Eldraine.

---

## 1. Kanon geograficzny Eldraine (Wizards of the Coast)

Wizards of the Coast wprowadziło Eldraine w dodatkach *Throne of Eldraine* (2019)
oraz *Wilds of Eldraine* (2023), z oficjalnym przewodnikiem *Planeswalker's Guide to Eldraine*
oraz powieścią *The Wildered Quest* (Kate Elliott).

Geografia planu opiera się na dualizmie dwóch przenikających się światów:

1. **Królestwo (The Realm)** — cywilizowany rdzeń planu, powstały po obaleniu dawnych Władców Elfów. Zorganizowany wokół **Pięciu Dworów (Five Courts)**, z których każdy ucieleśnia jeden z kolorów many i fundamentalną cnotę rycerską:
   - **Ardenvale** ({W}, Cnota: **Lojalność**) — słoneczne wyżyny Arden, zamek Ardenvale strzeżony przez biały płomień Kręgu Lojalności (*Circle of Loyalty*); historyczna siedziba Najwyższego Króla Algenusa Kenritha i Królowej Linden.
   - **Vantress** ({U}, Cnota: **Wiedza**) — zamek Vantress wznoszący się na wyspie pośród wód jeziora Lochmere, chroniony przez wodospad; siedziba Magicznego Zwierciadła Indrelon.
   - **Locthwain** ({B}, Cnota: **Wytrwałość**) — mroczne, mgliste mokradła i bagniska, pośród których unosi się lewitujący zamek Locthwain; siedziba Królowej Ayary i Kocła Wieczności (*Cauldron of Eternity*).
   - **Embereth** ({R}, Cnota: **Odwaga**) — skaliste wzgórza wulkaniczne, wolne miasto oraz monumentalny kompleks turniejowy **The Burning Yard** (Zamek Embereth), gdzie rycerze hartują miecze w żarze mistycznego głazu **Irencrag** (skąd pochodzi legendarny miecz *Embercleave*).
   - **Garenbrig** ({G}, Cnota: **Siła**) — prastara, porośnięta lasami dolina pełna menhirów i megalitycznych kręgów; zamek Garenbrig zintegrowany z portalem Wielkiego Kręgu (*The Great Henge*), rządzony przez króla olbrzymów Yorvo.

2. **Knieje / Dzicz (The Wilds)** — bezkresny, baśniowy i płynny ocean pierwotnej magii, otaczający domeny Dworów. W Kniejach tradycyjne pojęcia odległości i czasu ulegają zatarciu; to domena Fae (wróżek), czarownic (w tym chat z piernika i klątw), olbrzymów, syren oraz zaginionych ruin elfiej dominacji (*Heart Land*, *Tuinvale*).

---

## 2. Inwentarz dostępnych materiałów kartograficznych

| Typ źródła | Dostępność dla Eldraine | Linki i szczegóły |
|---|---|---|
| **Oficjalna mapa WotC (T1)** | **BRAK** | Wizards of the Coast **nigdy nie wydało oficjalnej mapy geograficznej Eldraine** (ani w 2019 r. przy *Throne of Eldraine*, ani w 2023 r. przy *Wilds of Eldraine*). W lore celowo wyjaśniono, że Knieje (*The Wilds*) są zmiennokształtne i nie poddają się tradycyjnej kartografii. |
| **Gotowy wektor SVG (T2)** | **BRAK** | Brak publicznych, kompletnych plików SVG z wektorową geometrią planu. |
| **Mapy fanowskie (T1 / T3)** | **4 główne realizacje rastrowe** | Wyszczególnione w tabeli poniżej. |

### Fanowskie rastery Eldraine dostępne w sieci:

1. **Inkarnate (Sporeimmortal65 / Trigybo, 2020)**
   - Wersja z etykietami: [Inkarnate — Eldraine](https://inkarnate.com/m/Bme9V8-eldraine/)
   - Wersja czysta (podkład bez napisów): [Inkarnate — Eldraine without label](https://inkarnate.com/m/W2n33o-eldraine-without-label/) ([alternatywny link](https://inkarnate.com/m/W2n33o))
   - Wątek dyskusyjny: [Reddit r/inkarnate](https://www.reddit.com/r/inkarnate/comments/jovpu6/so_here_i_created_a_basic_world_map_it_needs_alot/)
   - *Charakterystyka:* Klasyczna mapa w stylu Inkarnate (proporcje 4:3) z wyodrębnionymi 5 Dworami i otaczającymi lasami. Dostępna wersja czysta, co pozwalałoby na ewentualną adaptację T1 bez zdublowanych etykiet.

2. **Reddit r/dndmaps & r/mtgvorthos (BatmanS117 / Rhineglade, 2023)**
   - Wątek główny: [Reddit r/dndmaps — Eldraine Storybook Realm](https://www.reddit.com/r/dndmaps/comments/15rr7ww/eldraine_storybook_realm_map_based_on_the_mtg_set/)
   - Wątek Vorthos: [Reddit r/mtgvorthos — Map of Eldraine for MTG/RPG Conversion](https://www.reddit.com/r/mtgvorthos/comments/15rshk0/map_of_eldraine_for_use_in_a_mtgrpg_conversion/)
   - *Charakterystyka:* Stylizowana mapa krainy baśniowej Eldraine, oparta na toponimii z kart i przewodnika. Knieje (*The Wilds*) zostały celowo odsunięte na obrzeża.

3. **Reddit r/mtgvorthos (PippoChiri, 2024)**
   - Wątek: [Reddit r/mtgvorthos — Map of Eldraine, the Storybook Plane](https://www.reddit.com/r/mtgvorthos/comments/1fb6g8u/map_of_eldraine_the_storybook_plane/)
   - *Charakterystyka:* Ręcznie rysowana mapa stylizowana na baśniową oprawę (storybook frame) z ramkami, przygotowana pod kampanię RPG.

4. **GM Binder — Planeshifted Guide to Eldraine (grzart / Rhineglade)**
   - Przewodnik / Podręcznik: [GM Binder — Planeshifted Guide to Eldraine](https://www.gmbinder.com/share/-MwzLUfVgy1oDRFZ2pdw)
   - *Charakterystyka:* Fanowska adaptacja D&D 5e zawierająca podrozdział *The Realm and the Wilds* oraz szkice domen i Heart Land.

5. **Wczesny szkic koncepcyjny r/mtgvorthos (2019)**
   - Wątek: [Reddit r/mtgvorthos — A rough layout of Eldraine](https://www.reddit.com/r/mtgvorthos/comments/dw4pzt/a_rough_layout_of_eldraine_seeking_feedback/)
   - *Charakterystyka:* Prosty, wczesny szkic po premierze *The Wildered Quest*.

---

## 3. Zastosowanie Drabiny Preferencji (ADR 0038)

| Rząd | Wariant | Dostępność dla Eldraine | Werdykt |
|---|---|---|---|
| 1 | **T2** (gotowy wektor SVG) | Brak | **Odrzucone** (brak źródła) |
| 2 | **T1** (wyśmienity raster) | Brak oficjalnego; rastery fanowskie niekanoniczne | **Opcjonalny fallback** (jeśli właściciel wskaże konkretny plik) |
| 3 | **T3** (wektor z rastra fanowskiego) | Ograniczona (brak stabilnego wzorca) | **Rezerwa** |
| 4 | **T4** (rekonstrukcja wektorowa z tekstu / Mapforge) | **Pełna (analogicznie do Alary, Zendikaru i Lorwynu)** | **GŁÓWNA REKOMENDACJA** |

### Dlaczego T4 (Mapforge) jest najlepszym wyborem dla Eldraine?
1. **Brak oficjalnego podkładu graficznego** — zgodnie z ADR 0038 pkt 2, gdy WotC nie wydało mapy, a brak bezdyskusyjnego wzorca fanowskiego (jak np. w przypadku Innistradu), rekonstrukcja wektorowa w Mapforge stanowi naturalny i sprawdzony standard projektu (precedens Alary, Lorwynu i Zendikaru).
2. **Harmonia Pięciu Dworów** — struktura Eldraine jest z natury geometryczno-archetypowa (pięć królestw reprezentujących kolory many wokół centralnego Królestwa, przeplatanych traktami i otoczonych Kniejami). Mapforge potrafi oddać tę strukturę z pełną dyscypliną (rzeki spływające z Lochmere, wulkaniczne żebra Irencrag wokół Burning Yard, menhiry Garenbrigu, wyżyny Ardenvale).
3. **Czystość i lekkość** — brak szumów rastrowych, pełna ostrość przy dowolnym zoomie, dynamiczne etykiety ekranowe (LOD), obsługa ciemnego/jasnego motywu oraz zerowy narzut transferu (plik SVG rzędu ~100–200 kB).

---

## 4. Propozycja geometrii i układu przestrzennego (T4)

Układ wektorowy w `maps/eldraine/scena.json` i `podklad.svg` (wymiary bazowe 2000×1400 px):

1. **Centrum — Wysokie Królestwo i Wyżyny Arden (Ardenvale)**:
   - Zamek Ardenvale w sercu słonecznych równin i wyżyn, z traktami łączącymi stolicę z pozostałymi dworami.
2. **Północny zachód — Jezioro Lochmere i Zamek Vantress**:
   - Głęboki akwen Lochmere, wodospady i wyspa zamkowa z wieżą Magicznego Zwierciadła.
3. **Południowy zachód — Mroczne Mokradła Locthwain**:
   - Mgliste bagniska, ciemne lasy i lewitująca forteca Locthwain nad Czarnym Jeziorem.
4. **Południowy wschód — Wzgórza Irencrag i The Burning Yard (Embereth)**:
   - Skalisty, wulkaniczny płaskowyż z arenami turniejowymi Burning Yard i żarzącym się głazem Irencrag.
5. **Północny wschód — Pradawna Dolina Garenbrig**:
   - Gęste bory, kamienne kręgi, menhiry i megalityczny portal The Great Henge u stóp gór.
6. **Zewnętrzny pierścień i pasma graniczne — Knieje (The Wilds)**:
   - Lasy Tuinvale, Chatka Wiedźmy, Zamek Chmur olbrzymów, rzeki graniczne i tajemnicze trakty znikające w gęstwinie.

---

## 5. Rekomendacja i opcje dla właściciela

Przedstawiam do wyboru dwie ścieżki realizacji:

- **OPCJA A (Rekomendowana): Wektorowy podkład T4 wygenerowany w Mapforge**
  - Pełna implementacja w silniku Mapforge (`scena.json` → `podklad.svg` + `map.json`).
  - Elegancka, czytelna mapa z kompletem kotwic dla 5 Dworów i kluczowych lokacji Dziczy.
  - Natychmiastowa gotowość do osadzenia pinezki karty `209ELD Burning-Yard Trainer` na arenie The Burning Yard / Ardenvale.
- **OPCJA B: Podkład rastrowy T1 ze wskazanego przez właściciela pliku**
  - Jeśli właściciel posiada lub preferuje konkretny fanowski plik rastrowy (np. z Inkarnate / Reddit), przyjmujemy go do `maps/eldraine/l0.jpg` w złotym układzie T1 (analogicznie do Innistradu i Faerûnu).

---

*Czekam na decyzję właściciela co do wyboru wariantu (Opcja A vs Opcja B), aby przystąpić do materializacji planu i karty.*
