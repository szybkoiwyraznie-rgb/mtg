# Research mapowy: Eldraine — wybór wariantu podkładu

> **STATUS: ZATWIERDZONY (2026-09-11, MA1).** Po audycie PR-31 właściciel
> zatwierdził wariant **T4**. Zachowujemy autorski atlas relacyjny i jawnie
> oznaczamy globalne kierunki, odległości, rzeki oraz drogi jako umowne;
> źródła potwierdzają byty i relacje lokalne, nie pełną geometrię planu.

Powiązania: ADR 0038 (drabina wariantów T2→T1→T3→T4), ADR 0018 (silnik mapowy mapforge),
ADR 0031 (źródła fanowskie i prywatny użytek), ADR 0033 (jedna mapa aktualnego stanu),
ADR 0043 (pinezki wyłącznie dla kart), precedensy: Alara (T4), Lorwyn (T4),
Zendikar (T4/T3), Faerûn (T1), Innistrad (T1).

---

## 0. Kontekst i karta inicjująca

Dostawa właściciela (2026-09-11):
- Karta: **209ELD Burning-Yard Trainer** (*Throne of Eldraine*, set `ELD`, #209, `{4}{R}`, Creature — Human Knight 3/3).
- Scena: piaszczysta arena otoczona drewnianymi trybunami **pod wieżami zamku w Ardenvale**; instruktor w czerwonej tunice z opuszczonym płonącym mieczem treningowym uspokaja wierzchowca, obok młody rycerz przed płonącym torem przeszkód.
- Rozstrzygnięcie po audycie: Fabuła wiążąco lokuje scenę w **Ardenvale**. Nazwa karty pochodzi od kanonicznego **The Burning Yard** w Embereth, ale te miejsca nie są utożsamiane; pinezka 209ELD wskazuje Castle Ardenvale.

---

## 1. Kanon geograficzny Eldraine (Wizards of the Coast)

Wizards of the Coast wprowadziło Eldraine w dodatkach *Throne of Eldraine* (2019)
oraz *Wilds of Eldraine* (2023), z oficjalnym przewodnikiem *Planeswalker's Guide to Eldraine*
oraz powieścią *The Wildered Quest* (Kate Elliott).

Geografia planu opiera się na dualizmie dwóch przenikających się światów:

1. **Królestwo (The Realm)** — cywilizowany rdzeń planu, powstały po obaleniu dawnych Władców Elfów. Zorganizowany wokół **Pięciu Dworów (Five Courts)**, z których każdy ucieleśnia jeden z kolorów many i fundamentalną cnotę rycerską:
   - **Ardenvale** ({W}, Cnota: **Lojalność**) — słoneczne wyżyny Arden, zamek Ardenvale strzeżony przez biały płomień Kręgu Lojalności (*Circle of Loyalty*); historyczna siedziba Najwyższego Króla Algenusa Kenritha i Królowej Linden.
   - **Vantress** ({U}, Cnota: **Wiedza**) — zamek Vantress wznoszący się na wyspie pośród wód jeziora Lochmere, chroniony przez wodospad; siedziba Magicznego Zwierciadła Indrelon.
   - **Locthwain** ({B}, Cnota: **Wytrwałość**) — mobilny, lewitujący zamek Królowej Ayary przemierza Knieje w poszukiwaniu Kocła Wieczności (*Cauldron of Eternity*), zaginionego wiele pokoleń wcześniej.
   - **Embereth** ({R}, Cnota: **Odwaga**) — skaliste wzgórza, wolne miasto oraz monumentalny kompleks turniejowy **The Burning Yard**, mylnie nazywany Zamkiem Embereth; rycerze hartują miecze w żarze głazu **Irencrag**.
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
| 2 | **T1** (wyśmienity raster) | Brak oficjalnego; kilka realizacji fanowskich | **Niewybrany** — właściciel zatwierdził T4 2026-09-11 |
| 3 | **T3** (wektor z rastra fanowskiego) | Ograniczona (brak stabilnego wzorca) | **Rezerwa** |
| 4 | **T4** (rekonstrukcja wektorowa z tekstu / Mapforge) | Możliwy atlas relacyjny bez roszczenia do kanonicznej topologii | **ZATWIERDZONY PRZEZ WŁAŚCICIELA 2026-09-11** |

### Dlaczego zachowujemy zatwierdzone T4?
1. **Jawna decyzja właściciela** — po audycie PR-31 właściciel zatwierdził
   wariant T4. Brak zachowanego w pierwotnym PR dowodu wizualnego oglądu
   fanowskich kandydatów pozostaje faktem historycznym; nie dopisujemy
   wstecznie oceny ich jakości.
2. **Atlas relacyjny zamiast pozornej kartografii** — Mapforge pozwala
   zestawić pięć Dworów i Knieje, a zarazem opisać globalny układ jako
   umowny. Kanoniczne pozostają relacje lokalne, np. Vantress–Lochmere,
   Ardenvale–Circle of Loyalty i Embereth–Burning Yard–Irencrag.
3. **Czytelność i lekkość** — wektor zachowuje ostrość przy zoomie,
   wspiera etykiety ekranowe LOD i nie wymaga ciężkiego rastra.

---

## 4. Zatwierdzona kompozycja relacyjna T4

Układ w `maps/eldraine/scena.json` i `podklad.svg` (2000×1400 px) jest
**umowną kompozycją atlasu**. Poniższe kierunki nie są twierdzeniami
kanonicznymi; porządkują zatwierdzony wizualnie schemat:

1. **Umowne centrum — Wyżyny Arden (Ardenvale)**:
   - Zamek Ardenvale w sercu słonecznych równin i wyżyn, z traktami łączącymi stolicę z pozostałymi dworami.
2. **Umowny północny zachód — Lochmere i Castle Vantress**:
   - Głęboki akwen Lochmere, wodospady i wyspa zamkowa z wieżą Magicznego Zwierciadła.
3. **Umowny południowy zachód — symbol mobilnego Locthwain**:
   - Lewitująca forteca jest symbolem Czarnego Dworu, nie stałym adresem; zaginionego Kotła nie naniesiono.
4. **Umowny południowy wschód — Irencrag i The Burning Yard (Embereth)**:
   - Skalisty, wulkaniczny płaskowyż z arenami turniejowymi Burning Yard i żarzącym się głazem Irencrag.
5. **Umowny północny wschód — domena Garenbrig**:
   - Gęste bory, kamienne kręgi, menhiry i megalityczny portal The Great Henge u stóp gór.
6. **Zewnętrzny pierścień kompozycyjny — Knieje (The Wilds)**:
   - Lasy Tuinvale, Chatka Wiedźmy, Zamek Chmur olbrzymów, rzeki graniczne i tajemnicze trakty znikające w gęstwinie.

---

## 5. Decyzja właściciela

- **2026-09-11, po audycie PR-31:** właściciel zatwierdził mapę Eldraine
  w wariancie **T4** i polecił naprawić pozostałe znaleziska.
- T4 pozostaje jedynym aktywnym podkładem. Warianty fanowskie są zapisane
  jako historia researchu, ale nie stanowią geometrii tej mapy.
- Korekta po decyzji usuwa fałszywe osobne POI Castle Embereth,
  Tournament Grounds i zaginiony Cauldron of Eternity, oznacza mobilność
  Castle Locthwain, kończy drogę Vantress na brzegu Lochmere i przenosi
  pinezkę 209ELD do Castle Ardenvale zgodnie z Fabułą.
