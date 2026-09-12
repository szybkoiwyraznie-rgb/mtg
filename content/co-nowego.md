## 2026-09-12 15:10 — Nowa karta: Village Rites (Wiedźmin)

- **Materializacja karty:** **[[279m21-village-rites|Village Rites]]**
  (`279M21`, wydanie `M21` / *Core Set 2021*, plan [[wiedzmin|Wiedźmin]]) —
  w chacie sołtysa w Downwarren/Sztygarach starsza szeptucha otwiera
  księgę rodową długu i zapłaty, gospodarz z Czarnoboru trzyma misę wody z
  Krzywuchowych Moczarów, parobek klęczy przy białej kozie z czerwoną
  wstążką, a sąsiedzi w lnianych kapturach patrzą, jak wieś oddaje jedną
  ofiarę za dwa nowe odczyty rachunku (`{B}`, Instant; dodatkowy koszt:
  poświęć stworzenie, dobierz dwie karty).
- **Wpis kolekcji i snapshot:** Fabuła właściciela jest zachowana verbatim
  w `collection/entries/279m21-village-rites.md`; pełny snapshot M21 #126
  żyje w `scryfall/279m21-village-rites.json`. `279M21` pozostaje
  niezależnym `imgId` właściciela i nie jest numerem kolekcjonerskim
  Scryfall/Gatherera.
- **Pinezka i plan:** scena nazywa Downwarren/Sztygary oraz wodę z
  Krzywuchowych Moczarów, ale globalny raster T1 nie rozrysowuje chaty ani
  lokalnego planu wsi. Pinezka ma pewność `region` i dziedziczy kotwicę
  [[velen|Velen/Ziemi Niczyjej]] (`x: 0.4113`, `y: 0.2807`; `px_t1 [2095,
  2024]`).
- **Link-mining i porządki po audycie:** powstało hasło geograficzne
  **[[velen|Velen]]**, bo próg ≥2 kart spełniają Village Rites i Bedhead
  Beastie. Przy okazji domknięto drobne pozycje z audytu PR-32: poprawiono
  liczbę plików drzewa z 853 na 859 w żywych dokumentach, usunięto trailing
  whitespace z historycznych planów i zdjęto nieużyte źródło Razor Fields z
  Pristine Talisman.
- **Strażniki:** dedykowana regresja pilnuje Fabuły, rozdziału `279M21` od
  M21 #126, regionalnej pinezki, kozy jako dokładnie jednej ofiary, parobka
  jako świadka oraz progu hasła Velen. UI oczekuje 38 Kart Katalogowych.
- **Bramki końcowe:** 212/212 testów, build 64 strony (38 kart, 11 haseł,
  15 planów) i 859 plików drzewa archiwum, map-audit 0, wiki-stats 100%,
  czysty `git diff --check`.

## 2026-09-12 14:08 — Korekta pinezki Chittering Rats

- Po uwadze właściciela ponownie sprawdzono master T1 Wiedźmina. Pierwotny
  odczyt `px_t1 [2000, 1700]` trafiał na wybrzeże na północny zachód od
  miejskiej ikony, więc nie przedstawiał Novigradu poprawnie.
- Kotwicę Novigradu i pinezkę 540DST przesunięto na środek ikony Wolnego
  Miasta: `px_t1 [2060, 1780]`, czyli `x: 0.4045`, `y: 0.2469`. Deep-link
  hasła, opis mapowy i regresje korzystają z poprawionej pozycji; zakres
  dokładności nadal kończy się na mieście i nie wskazuje konkretnego
  tunelu kanałów.

## 2026-09-12 13:39 — Nowa karta: Chittering Rats (Wiedźmin)

- **Materializacja karty:** **[[540dst-chittering-rats|Chittering Rats]]**
  (`540DST`, wydanie `DST` / *Darksteel*, plan [[wiedzmin|Wiedźmin]]) —
  w labiryncie kanałów [[novigrad|Novigradu]] stado zmutowanych
  pseudoszczurów odcina drogę samotnemu poszukiwaczowi skarbów. Mężczyzna
  osłania cenne mapy i odkłada dalszą wyprawę do czasu przepędzenia roju
  (`{1}{B}{B}`, 2/2 Creature — Rat; wejście odkłada kartę przeciwnika z
  ręki na wierzch biblioteki).
- **Wpis kolekcji i snapshot:** Fabuła właściciela jest zachowana verbatim
  w `collection/entries/540dst-chittering-rats.md`; pełny snapshot DST
  #39 żyje w `scryfall/540dst-chittering-rats.json`. `540DST` pozostaje
  niezależnym `imgId` właściciela.
- **Pinezka i plan:** dokładna kotwica Novigradu (`x: 0.4045`,
  `y: 0.2469`; `px_t1 [2060, 1780]`) wskazuje miejską ikonę w skali mapy
  Kontynentu. Fabuła nie podaje włazu, ulicy ani konkretnego
  korytarza, więc pinezka nie udaje planu podziemi.
- **Link-mining:** powstało geograficzne hasło **[[novigrad|Novigrad]]**.
  Próg ≥2 kart spełniają Chittering Rats oraz Bedhead Beastie, które
  wymienia Novigrad w relacji mapowej do północnego Velen.
- **Strażniki:** dedykowana regresja pilnuje Fabuły, rozdziału `540DST`
  od DST #39, mechanicznego opóźnienia bez odrzucenia map, pinezki miasta
  oraz dwóch kart linkujących nowe hasło. UI oczekuje 37 Kart
  Katalogowych.

## 2026-09-12 13:06 — Nowa karta: Bedhead Beastie (Wiedźmin)

- **Materializacja karty:** **[[555dsk-bedhead-beastie|Bedhead Beastie]]**
  (`555DSK`, wydanie `DSK` / *Duskmourn: House of Horror*, plan
  [[wiedzmin|Wiedźmin]]) — w opuszczonej wskutek wojny chacie na bagnach
  Velen kolosalny kudłaty bebok zaklinował na rogatym łbie szczątki łóżka
  i siennika, a dwaj redańscy milicjanci wspólnie zwierają szyk w progu
  (`{4}{R}{R}`, 5/6 Creature — Beast, Menace, Mountaincycling `{2}`).
- **Wpis kolekcji i snapshot:** Fabuła właściciela jest zachowana verbatim
  w `collection/entries/555dsk-bedhead-beastie.md`; pełny snapshot DSK
  #125 żyje w `scryfall/555dsk-bedhead-beastie.json`. `555DSK` pozostaje
  niezależnym `imgId` właściciela i nie jest numerem kolekcjonerskim
  Scryfall.
- **Pinezka i plan:** mapa Wiedźmina dostała regionalną kotwicę Velen i
  pinezkę `region` (`x: 0.4113`, `y: 0.2807`; około `px_t1 [2095,
  2024]`). Fabuła nie nazywa wsi, chaty, konkretnego bagna ani
  posterunku. Strona planu opisuje wojenne Velen, folklor beboka i
  ostrożne podobieństwo do biesa bez utożsamiania gatunku.
- **Strażniki:** regresja rozdziela oba systemy numeracji i pilnuje
  właścicielskiej Fabuły, parametrów druku, regionalnej pewności pinezki
  oraz dokładnej zgodności współrzędnych z kotwicą Velen.

## 2026-09-11 23:28 — Nowa karta: Murder of Crows (Innistrad)

- **Materializacja karty:** **[[42isd-murder-of-crows|Murder of Crows]]** (`42ISD`, wydanie `ISD` / *Innistrad*, plan [[innistrad|Innistrad]]) — na starym stensiańskim cmentarzu wielkie kruki przechwytują błękitne smugi wspomnień i ostatnie słowa unoszące się nad pustymi szatami oraz srebrną tarczą zmarłego strażnika (`{3}{U}{U}`, 4/4 Creature — Bird, Flying, śmierć innego stworzenia pozwala dobrać, a następnie odrzucić kartę).
- **Wpis kolekcji i snapshot:** Fabuła właściciela jest zachowana verbatim w `collection/entries/42isd-murder-of-crows.md`; pełny snapshot ISD #70 żyje w `scryfall/42isd-murder-of-crows.json`. `42ISD` pozostaje niezależnym `imgId` właściciela i nie jest numerem kolekcjonerskim Scryfall.
- **Pinezka i plan:** mapa Innistradu dostała pinezkę `region` na kotwicy Stensii. Fabuła nazywa prowincję, ale nie cmentarz ani dolinę; stare grafy przy Farbogach są potwierdzonym kontekstem geistów, nie dokładnym adresem sceny. Strona planu opisuje kruki żywiące się śladami pamięci zmarłych.
- **Strażniki:** test Innistradu rozdziela oba systemy numeracji, pilnuje regionalnego charakteru pinezki oraz kotwic sceny: Stensii, srebrnej tarczy, błękitnych wspomnień i ostatnich słów.
- **Bramki końcowe:** 197/197 testów, build 59 stron (35 kart, 9 haseł, 15 planów) i 859 plików drzewa, map-audit 0 problemów, wiki-stats 100% (7,7/8), czysty `git diff --check` oraz świeży preview karty i mapy Innistradu.

## 2026-09-11 23:12 — Nowa karta: Pilgrim's Eye (Zendikar)

- **Materializacja karty:** **[[132gnt-pilgrim-s-eye|Pilgrim's Eye]]** (`132GNT`, wydanie `GNT` / *Game Night*, plan [[zendikar|Zendikar]]) — korowy, latawcowy thopter z błękitną soczewką przemierza zróżnicowany teren planu, nanosząc siatkę bezpiecznych przejść dla ekspedycji czekającej przy lampie dalekiego obozu (`{3}`, 1/1 Artifact Creature — Thopter, Flying, wejście wyszukujące dowolny basic land do ręki).
- **Wpis kolekcji i snapshot:** Fabuła właściciela jest zachowana verbatim w `collection/entries/132gnt-pilgrim-s-eye.md`; pełny snapshot GNT #55 żyje w `scryfall/132gnt-pilgrim-s-eye.json`. `132GNT` pozostaje niezależnym `imgId` właściciela i nie jest numerem kolekcjonerskim Scryfall.
- **Pinezka i plan:** mapa Zendikaru dostała pinezkę `przyblizona` przy Sea Gate, rozumianą jako punkt operacyjny kanonicznej bazy ekspedycji, nie dokładny adres sceny. Fabuła nie nazywa kontynentu ani obozu i łączy wiele biomów, dlatego nie nadano jej pozornej dokładności. Strona planu opisuje teraz korowe Pilgrim's Eyes jako latawcowych zwiadowców terenu.
- **Strażniki:** test Zendikaru rozdziela oba systemy numeracji oraz pilnuje przybliżonego charakteru pinezki i jej jawnego uzasadnienia.
- **Bramki końcowe:** 194/194 testy, build 58 stron (34 karty, 9 haseł, 15 planów) / 859 plików, map-audit 0, wiki-stats 100%, czysty `git diff --check`; świeży preview karty i mapy odpowiada HTTP 200.

## 2026-09-11 22:44 — Naprawy audytu PR-31: F1–F13 domknięte

- **DFC i druk źródłowy:** pojedyncze Karty Katalogowe nie ujawniają innych fizycznych twarzy; dodano repo-szerokie strażniki ADR 0044 i ADR 0040. Pristine Talisman nie dziedziczy metadanych ani nieźródłowej lokalizacji z konkretnego wydruku.
- **Eldraine T4:** zachowano wariant zatwierdzony przez właściciela. Burning-Yard Trainer wrócił do Castle Ardenvale zgodnie z Fabułą; mapa jawnie pozostaje autorskim atlasem relacyjnym, poprawia mobilny Locthwain, zaginiony Kocioł, kompleks Burning Yard, trasę ku Vantress i kolizje etykiet.
- **Alara i źródła:** wycofano niepotwierdzone punktowe lokalizacje Carmot Mines i Ruins of Vithia; uporządkowano cytowania Confluxu oraz rozdzielono lekturę traktatów od niepotwierdzonej podróży Civilized Scholar do Stensii.
- **Dokumentacja i storage:** odtworzono finalny zakres 15 materializacji PR-31, skorygowano rzeczywiste godziny publikacji, domknięto plany, dodano regułę L19 i usunięto nieużywany rootowy raster Wiedźmina bez zmiany runtime LOD.
- **Bramki końcowe:** 192/192 testy, build 57 stron / 859 plików, map-audit 0, wiki-stats 100%, czysty `git diff --check`. Poprawione mapy Eldraine i Alary obejrzano przez vision w 1600×1120.

## 2026-09-11 19:05 — Nowa karta: Pristine Talisman (Mirrodin)

- **Materializacja karty:**
  - **[[347nph-pristine-talisman|Pristine Talisman]]** (`347NPH`, wydanie `NPH` / *New Phyrexia*, plan [[mirrodin|Mirrodin]]) — sterylna biała kuźnia-świątynia o nieznanym położeniu, rozświetlona mlecznym światłem oculusu; unosi się w niej czysty, symetryczny talizman z perłowego metalu i obsydianowego rdzenia, otoczony liniami energii i symbolem harmonii czterech barw; w zakażonym świecie najeźdźcy artefakt leczy dotykających go wojowników i zasila opór nieskażoną energią (`{3}`, `{T}: Dodaj {C}. Otrzymujesz 1 punkt życia`, inskrypcja Elspeth Tirel).
- **Wpis kolekcji i snapshot Scryfall:**
  - `collection/entries/347nph-pristine-talisman.md` (Fabuła właściciela zapisana verbatim, L16).
  - `scryfall/347nph-pristine-talisman.json` (pełny snapshot Scryfall NPH #151 z metadanymi pochodzenia).
- **Pinezka i mapa Mirrodinu:**
  - Dodana przybliżona pinezka planu (`maps/mirrodin/map.json`, `x: 0.500, y: 0.500`); Fabuła nie wskazuje regionu.
  - Strona planu [[mirrodin|Mirrodin]] zaktualizowana o wzmiankę o czystym rzemiośle i nieznanym położeniu kuźni.

## 2026-09-11 18:09 — Nowa karta: Disa the Restless (Dominaria, Epoka Lodowcowa / Terisiare)

- **Materializacja karty:**
  - **[[531m3c-disa-the-restless|Disa the Restless]]** (`531M3C`, wydanie `M3C` / *Modern Horizons 3 Commander*, plan [[dominaria|Dominaria]]) — zasypane śniegiem pustkowia dawnego kontynentu Terisiare u stóp błękitnych lodowców i zrujnowanych filarów starożytnego imperium; nieustraszona zwiadowczyni i kronikarka bada w zmarzlinie masywne, szponiaste ślady Lhurgoyfa, ostrzegając rubieże królestwa Kjeldoru przed drapieżnikami epoki chłodu (`{2}{B}{R}{G}`, 5/6 Legendary Creature — Human Scout, wskrzeszanie stałych kart Lhurgoyfów trafiających na cmentarz oraz tworzenie tokenów Tarmogoyfa przy zranieniu gracza).
- **Wpis kolekcji i snapshot Scryfall:**
  - `collection/entries/531m3c-disa-the-restless.md` (Fabuła właściciela zapisana verbatim, L16).
  - `scryfall/531m3c-disa-the-restless.json` (pełny snapshot Scryfall M3C #1 z metadanymi pochodzenia).
- **Pinezka i mapa Dominarii:**
  - Dodana kotwica Kjeldor oraz pinezka w północnym Terisiare (`maps/dominaria/map.json`, pewność `region`, `x: 0.885, y: 0.265`).
  - Strona planu [[dominaria|Dominaria]] zaktualizowana o wzmiankę o Epoce Lodowcowej i nowej karcie.

## 2026-09-11 17:56 — Nowa karta: Goblin Battle Jester (Warhammer Fantasy, Góry Krańca Świata)

- **Materializacja karty:**
  - **[[312m13-goblin-battle-jester|Goblin Battle Jester]]** (`312M13`, wydanie `M13` / *Magic 2013*, plan [[warhammer-fantasy|Warhammer Fantasy]]) — czerwono-brązowa skalista półka nad wąwozem w Górach Krańca Świata (*Worlds Edge Mountains*); wojenny trefniś z plemienia Krzywego Księżyca (*Crooked Moon*) w asymetrycznym stroju z kości i peruce odwraca uwagę wrogów groteskowym, prowokacyjnym tańcem na krawędzi urwiska, uniemożliwiając im uformowanie muru tarcz i otwierając drogę do zabójczego uderzenia większych goblinów i orków od tyłu (`{3}{R}`, 2/2 Goblin, wyzwalana zdolność: przy rzuceniu czerwonego zaklęcia docelowy stwór nie może blokować w tej turze).
- **Wpis kolekcji i snapshot Scryfall:**
  - `collection/entries/312m13-goblin-battle-jester.md` (Fabuła właściciela zapisana verbatim, L16).
  - `scryfall/312m13-goblin-battle-jester.json` (pełny snapshot Scryfall M13 #135 z metadanymi pochodzenia).
- **Pinezka i mapa Warhammer Fantasy:**
  - Dodana kotwica Karak Osiem Szczytów oraz pinezka w paśmie Worlds Edge Mountains (`maps/warhammer-fantasy/map.json`, pewność `region`, `x: 0.720, y: 0.580`).
  - Strona planu [[warhammer-fantasy|Warhammer Fantasy]] zaktualizowana o opis Nocnych Goblinów, plemienia Krzywego Księżyca i odsyłacz do nowej karty.

## 2026-09-11 17:50 — Pakiet kart: Thraben Valiant, Gorehorn Minotaurs i Twiddle + nowy plan Wiedźmina

- **[[544avr-thraben-valiant|Thraben Valiant]]** (`544AVR`, *Avacyn Restored*) — weteranka z Thraben schodzi do wulkanicznego Devils' Breach w Kessigu, uzbrojona w srebrny miecz i bicz do chwytania diabłów. Wpis kolekcji i snapshot Scryfall AVR #39 uzupełniają pinezkę dokładną (`x: 0.392`, `y: 0.945`) na mapie [[innistrad|Innistradu]].
- **[[83mm2-gorehorn-minotaurs|Gorehorn Minotaurs]]** (`83MM2`, *Modern Masters 2015*) — trójka minotaurów Zwierzoludzi szarżuje przez puszczę z woli Głazu Stada. Wpis kolekcji i snapshot Scryfall MM2 #116 uzupełniają pinezkę regionalną w The Great Forest (`x: 0.4054`, `y: 0.3878`) na mapie [[warhammer-fantasy|Starego Świata]].
- **Nowy plan [[wiedzmin|Wiedźmin]] i [[19-8ed-twiddle|Twiddle]]** (`19_8ED`, *Eighth Edition*) — czarodziejka z Aretuzy na wyspie Thanedd precyzyjnie obraca astrolabium szafirowymi nićmi energii. Plan otrzymał dostarczoną przez właściciela Mapę Orteliusa T1 z LOD: `master.jpg` 5093×7209, `l0.jpg`, `mini.jpg` i 150 kafli. Wpis kolekcji, snapshot Scryfall 8ED #111 i pinezka dokładna Thanedd (`x: 0.4153`, `y: 0.3045`) domykają materializację.

## 2026-09-11 17:50 — Nowy plan: Eldraine (mapa T4) + nowa karta: Burning-Yard Trainer (Ardenvale)

- **Nowy plan:** [[eldraine|Eldraine]] — baśniowy i rycerski plan inspirowany legendami arturiańskimi i baśniami braci Grimm. Podział na cywilizowane Królestwo (*The Realm*) zorganizowane wokół Pięciu Dworów (Ardenvale, Vantress, Locthwain, Embereth, Garenbrig) oraz bezkresne Knieje (*The Wilds*) pełne magii Fae, czarownic, gigantów i pradawnych reliktów elfów.
- **Wektorowa mapa Eldraine (T4):**
  - Zatwierdzony przez właściciela autorski atlas relacyjny w silniku Mapforge (`maps/eldraine/scena.json`, `podklad.svg`, `map.json`), zgodny z drabiną ADR 0038.
  - Globalne kierunki, odległości, rzeki i drogi są umowną kompozycją T4. Źródła potwierdzają byty i relacje lokalne: Castle Vantress na Lochmere, Circle of Loyalty w Castle Ardenvale, Burning Yard jako jeden kompleks Embereth, Irencrag przy Embereth i Great Henge w Castle Garenbrig.
  - Mobilny Castle Locthwain jest symbolem bez stałego adresu; zaginionego Cauldron of Eternity nie naniesiono. Hydrologia i etykiety przechodzą audyt techniczny.
- **Materializacja karty:**
  - **[[209eld-burning-yard-trainer|Burning-Yard Trainer]]** (`209ELD`, wydanie `ELD` / *Throne of Eldraine*, plan [[eldraine|Eldraine]]) — piaszczysta arena pod wieżami Castle Ardenvale; doświadczony instruktor z płonącym drewnianym mieczem uspokaja konia i prowadzi młodego adepta przez tor płonących przeszkód (`{4}{R}`, 3/3 Human Knight, Trample, Haste, wejście dające innemu Rycerzowi +2/+2, Trample i Haste). Nazwa karty pochodzi z odrębnego kompleksu Burning Yard w Embereth, lecz Fabuła wiążąco lokuje scenę w Ardenvale.
- **Wpis kolekcji i snapshot Scryfall:**
  - `collection/entries/209eld-burning-yard-trainer.md` (Fabuła właściciela zapisana verbatim, L16).
  - `scryfall/209eld-burning-yard-trainer.json` (pełny snapshot Scryfall ELD #117 z metadanymi pochodzenia).
- **Pinezka i mapa Eldraine:**
  - Pinezka karty osadzona przy Castle Ardenvale (`maps/eldraine/map.json`, pewność `dokladna`, `x: 0.500, y: 0.4643`).
  - Strona planu [[eldraine|Eldraine]] rozdziela scenę 209ELD od kanonicznego Burning Yard w Embereth.

## 2026-09-11 17:50 — Nowa karta: Silvanus's Invoker (Zapomniane Krainy, Wysoki Las)

- **Materializacja karty:**
  - **[[539clb-silvanus-s-invoker|Silvanus's Invoker]]** (`539CLB`, wydanie `CLB` / *Commander Legends: Battle for Baldur's Gate*, plan [[forgotten-realms|Zapomniane Krainy]]) — smokowiec-druid w prastarych ostępach Wysokiego Lasu (*High Forest*) wsuwa szpony w glebę, wzywając w imię Silvanusa (Dębowego Ojca) potężnego żywiołaka ziemi i drewna do bezwzględnej obrony kniei przed intruzami (`{2}{G}`, 3/2 Dragon Druid, zdolność Conjure Elemental `{8}` budząca ląd jako żywiołaka 8/8 z tratowaniem i pośpiechem).
- **Wpis kolekcji i snapshot Scryfall:**
  - `collection/entries/539clb-silvanus-s-invoker.md` (Fabuła właściciela zapisana verbatim, L16).
  - `scryfall/539clb-silvanus-s-invoker.json` (pełny snapshot Scryfall CLB #254 z metadanymi pochodzenia).
- **Pinezka i mapa Zapomnianych Krain:**
  - Dodana kotwica i pinezka dla regionu Wysoki Las (`maps/forgotten-realms/map.json`, pewność `region`, `x: 0.215, y: 0.175`).
  - Strona planu [[forgotten-realms|Zapomniane Krainy]] uzupełniona o opis Wysokiego Lasu i odsyłacz do nowej karty.

## 2026-09-11 17:50 — Nowa karta: Kor Cartographer (Zendikar, Ondu / Makindi)

- **Materializacja karty:**
  - **[[537cmr-kor-cartographer|Kor Cartographer]]** (`537CMR`, wydanie `CMR` / *Commander Legends*, plan [[zendikar|Zendikar]]) — zwiadowczyni korów na linach zwisająca z krawędzi lewitującego płaskowyżu nad kanionami Makindi na Ondu; precyzyjne nanoszenie ruchomych skał na pergamin wbrew wiatrowi i odnajdywanie stabilnych równin dla karawany (`{3}{W}`, 2/2 Kor Scout, wejście przeszukujące i wystawiające Równinę).
- **Wpis kolekcji i snapshot Scryfall:**
  - `collection/entries/537cmr-kor-cartographer.md` (Fabuła właściciela zapisana verbatim, L16).
  - `scryfall/537cmr-kor-cartographer.json` (pełny snapshot Scryfall CMR #30 z metadanymi pochodzenia).
- **Pinezka i mapa Zendikaru:**
  - Dodana pinezka na kotwicy Makindi Trenches (`maps/zendikar/map.json`, pewność `dokladna`, `x: 0.28, y: 0.8429`).
  - Strona planu [[zendikar|Zendikar]] uzupełniona o odsyłacz do nowej karty w sekcji Ondu i podsumowaniu.

## 2026-09-11 17:50 — Nowa karta: Dire-Strain Brawler (Innistrad, Gavony)

- **Materializacja karty:**
  - **[[118mid-dire-strain-brawler|Dire-Strain Brawler]]** (`118MID`, wydanie `MID` / *Innistrad: Midnight Hunt*, plan [[innistrad|Innistrad]]) — nocna wiejska farma w Gavony pod pełnią księżyca; czwarta para porzuconych butów przy stodole zdradza, że na podwórzu pojawił się monstrualny wilkołak rodu Dire-strain o ciele 6/6 z czujnością (*Vigilance*, *Nightbound*), spokojnie dominującym podwórze pośród zmowy milczenia zastraszonych gospodarzy.
- **Wpis kolekcji i snapshot Scryfall:**
  - `collection/entries/118mid-dire-strain-brawler.md` (Fabuła właściciela zapisana verbatim, L16).
  - `scryfall/118mid-dire-strain-brawler.json` (pełny snapshot Scryfall MID #203 dla karty transformującej z widokiem twarzy nocnej).
- **Pinezka i mapa Innistradu:**
  - Dodana pinezka na rolniczym obszarze prowincji Gavony (`maps/innistrad/map.json`, pewność `region`, `x: 0.59, y: 0.449`).
  - Strona planu [[innistrad|Innistrad]] zaktualizowana o odsyłacz do nowej karty.

## 2026-09-11 17:50 — Nowa karta: Crumb and Get It (Śródziemie, Eriador)

- **Materializacja karty:**
  - **[[612blb-crumb-and-get-it|Crumb and Get It]]** (`612BLB`, wydanie `BLB` / *Bloomburrow*, transpozycja do planu [[srodziemie|Śródziemie]]) — hobbit podróżujący nocą przez wzgórza Eriadoru powstrzymuje wygłodniałego drapieżnika bochenkiem chleba podróżnego; dar gościnności i prowiantu rodzący świetlistą aurę niewrażliwości na ciosy (`{W}`, Instant, mechanika Gift a Food: +2/+2 i niezniszczalność).
- **Wpis kolekcji i snapshot Scryfall:**
  - `collection/entries/612blb-crumb-and-get-it.md` (Fabuła właściciela zapisana verbatim, L16).
  - `scryfall/612blb-crumb-and-get-it.json` (pełny snapshot Scryfall BLB #8 z powiązanym tokenem Food i metadanymi).
- **Pinezka i mapa Śródziemia:**
  - Dodana pinezka na wzgórzach Eriadoru (`maps/srodziemie/map.json`, pewność `region`, `x: 0.28, y: 0.30`).
  - Strona planu [[srodziemie|Śródziemie]] wzbogacona o akapit o Eriadorze oraz listę kart.

## 2026-09-11 17:50 — Nowa karta: Ghirapur Gearcrafter (Kaladesh, Ghirapur)

- **Materializacja karty:**
  - **[[596ori-ghirapur-gearcrafter|Ghirapur Gearcrafter]]** (`596ORI`, wydanie `ORI` / *Magic Origins*, plan [[kaladesh|Kaladesh]]) — mistrz rzemiosła w nasłonecznionym warsztacie dzielnicy Embraal w Ghirapurze, tworzący filigranowego thoptera napędzanego czystym eterem (`{2}{R}`, 2/1 Human Artificer tworzący przy wejściu żeton 1/1 Thopter z lataniem, etos perfekcji wymagany przez Konsulat).
- **Wpis kolekcji i snapshot Scryfall:**
  - `collection/entries/596ori-ghirapur-gearcrafter.md` (Fabuła właściciela zapisana verbatim, L16).
  - `scryfall/596ori-ghirapur-gearcrafter.json` (pełny snapshot Scryfall ORI #149 z metadanymi pochodzenia).
- **Pinezka i mapa Kaladeshu:**
  - Dodana pinezka w dzielnicy Embraal w Ghirapurze (`maps/kaladesh/map.json`, pewność `region`, `x: 0.6723, y: 0.6294`).
  - Strona planu [[kaladesh|Kaladesh]] zaktualizowana o nową kartę.

## 2026-09-11 17:50 — Nowa karta: Spectral Prison (Innistrad, Gavony)

- **Materializacja karty:**
  - **[[181avr-spectral-prison|Spectral Prison]]** (`181AVR`, wydanie `AVR` / *Avacyn Restored*, plan [[innistrad|Innistrad]]) — uśpiony wędrowiec w podróżnym płaszczu na posadzce gotyckiej kaplicy w Gavony, otoczony eteryczną kopułą ze światła i śpiących geistów; zaklęcie Aury Kościoła Avacyn (`{1}{U}`, paraliż/uśpienie woli, pęknięcie klatki przy zewnętrznej interwencji magicznej).
- **Wpis kolekcji i snapshot Scryfall:**
  - `collection/entries/181avr-spectral-prison.md` (Fabuła właściciela zapisana verbatim, L16).
  - `scryfall/181avr-spectral-prison.json` (pełny snapshot Scryfall AVR #75 z metadanymi pochodzenia).
- **Pinezka i mapa Innistradu:**
  - Dodana pinezka na prowincji Gavony (`maps/innistrad/map.json`, pewność `region`, `x: 0.59, y: 0.449`).
  - Strona planu [[innistrad|Innistrad]] zaktualizowana o nową kartę.

## 2026-09-11 17:50 — Nowa karta: Grizzled Outcasts (Innistrad, Kessig)

- **Materializacja karty:**
  - **[[171isd-grizzled-outcasts|Grizzled Outcasts]]** (`171ISD`, wydanie `ISD` / *Innistrad*, plan [[innistrad|Innistrad]]) — czterech wędrownych myśliwych na obrzeżach kessigijskiej osady, obserwowanych przez zaryglowane okno; znoszone skóry, kusza i sękaty kij maskujące drapieżne cechy Hordy Krallen (*Krallenhorde*). Niezależna Karta Katalogowa przedniej strony DFC (4/4 Human Werewolf za `{4}{G}`, mechanika ciszy nocy i zrzucania ludzkiego obuwia).
- **Wpis kolekcji i snapshot Scryfall:**
  - `collection/entries/171isd-grizzled-outcasts.md` (Fabuła właściciela zapisana verbatim, L16).
  - `scryfall/171isd-grizzled-outcasts.json` (pełny snapshot Scryfall ISD #185 z metadanymi pochodzenia).
- **Pinezka i mapa Innistradu:**
  - Dodana pinezka na prowincji Kessig (`maps/innistrad/map.json`, pewność `region`, `x: 0.41, y: 0.727`).
  - Strona planu [[innistrad|Innistrad]] powiązana z nową kartą.

## 2026-09-11 10:51 — Nowa karta: Simian Simulacrum (Wojna Braci, Dominaria)

- **Materializacja karty:**
  - **[[362bro-simian-simulacrum|Simian Simulacrum]]** (`362BRO`, wydanie `BRO` / *The Brothers' War*, plan [[dominaria|Dominaria]]) — mechaniczny małpi konstrukt odkopany w zapomnianym warsztacie lasu Argoth; jednostka inżynieryjna montująca moduły wzmacniające (dwa znaczniki +1/+1) na opancerzonym automacie-strażniku i reaktywowana zieloną maną Argoth (Unearth `{2}{G}{G}`).
- **Wpis kolekcji i snapshot Scryfall:**
  - `collection/entries/362bro-simian-simulacrum.md` (Fabuła właściciela zapisana verbatim, L16).
  - `scryfall/362bro-simian-simulacrum.json` (pełny snapshot Scryfall BRO #205 z metadanymi pochodzenia).
- **Pinezka i mapa Dominarii:**
  - Dodana kotwica i pinezka na wyspie Argoth u południowo-wschodnich wybrzeży Terisiare (`maps/dominaria/map.json`, pewność `region`).
  - Strona planu [[dominaria|Dominaria]] zaktualizowana o nową kartę w osi czasu i sekcji mapy.

## 2026-09-11 00:17 — Druga Pętla Jakości: hasła Esper i Stensia + weryfikacja mapy Alary

- **Link-mining i nowe hasła (krok 3):**
  - **[[esper|Esper]]** (`content/lore/esper.md`, klasa `geografia`, plan [[alara|Alara]]) — archipelag wysp ze stopu eterium, szklanych mórz (Dwindling Sea, Inkwell) i geometrycznych miast (Palandius, Vectis, Sanctum Arcanum). Sekta Ethersworn, doktryna Szlachetnego Dzieła (*Noble Work*) sfinksa Cruciusa, kryzys surowca carmotu i zderzenie w Confluxie z Grixis. Próg spełniony przez karty [[536arb-ethersworn-shieldmage|Ethersworn Shieldmage]] i [[305arb-illusory-demon|Illusory Demon]].
  - **[[stensia|Stensia]]** (`content/lore/stensia.md`, klasa `geografia`, plan [[innistrad|Innistrad]]) — mroczna, górzysta prowincja pasma Geier Reach, ojczyzna wampirzych linii krwi (Markov, Falkenrath, Voldaren) i wulkanicznej czeluści Ashmouth — bramy demonów i diabłów. Próg spełniony przez karty [[309isd-civilized-scholar|Civilized Scholar]] i [[393dka-forge-devil|Forge Devil]].
- **Pogłębienie LORE i wikilinków (krok 2):**
  - Strony kart [[309isd-civilized-scholar|Civilized Scholar]], [[393dka-forge-devil|Forge Devil]], [[536arb-ethersworn-shieldmage|Ethersworn Shieldmage]] i [[305arb-illusory-demon|Illusory Demon]] zyskały pogłębione tło i wikilinki do haseł [[stensia|Stensia]] i [[esper|Esper]]. Civilized Scholar poznaje Stensię z traktatów czytanych w Havengulu; nie odbywa niepotwierdzonej podróży do prowincji.
  - Strony planów [[innistrad|Innistrad]] i [[alara|Alara]] zaktualizowane o wikilinki do haseł.
  - **100% kompletności (`tools/wiki-stats.mjs`) na wszystkich 40 stronach bazy** (18 kart, 9 haseł, 13 planów).
- **Pass mapowy T4 (krok 4):**
  - Research potwierdza carmot jako surowiec i Vithię jako dawne królestwo, lecz nie dostarcza współrzędnych pojedynczych **Carmot Mines** ani **Ruins of Vithia**. Nie są one nanoszone jako POI.
  - Wektorową mapę Alary przywrócono do 28 źródłowych POI, zregenerowano deterministycznie i zweryfikowano integralnościowo: `python3 tools/map-audit.py` = 0 problemów.

## 2026-09-10 23:45 — Pętla Jakości: hasła Conflux i Grixis + 100% kompletności w wiki-stats

- **Audyt scalonego PR-30** (`docs/audits/AUDYT_2026-09-10-PR30.md`): werdykt — pełna zgodność z ADR-ami i wytycznymi właściciela (dwie osobne mapy Kaladeshu, ADR 0047, 3 materializacje, mapa Warhammer Fantasy T1, hasło Auriokowie).
- **Link-mining i nowe hasła (krok 3):**
  - **[[conflux|Conflux]]** (`content/lore/conflux.md`, klasa `wydarzenie`, plan [[alara|Alara]]) — Scalenie pięciu shardów Alary, narodziny Maelstromu, spisek Nicola Bolasa, wojny graniczne i triumf Ajaniego Goldmane'a. Próg ≥ 2 kart spełniony przez [[305arb-illusory-demon|Illusory Demon]] i [[536arb-ethersworn-shieldmage|Ethersworn Shieldmage]].
  - **[[grixis|Grixis]]** (`content/lore/grixis.md`, klasa `geografia`, plan [[alara|Alara]]) — martwy shard śmierci, zgnilizny i vis, rządzony przez demony i nekromantów (Sedris, Malfegor), którego armie nieumarłych najechały Esper i Bant po Confluxie. Próg ≥ 2 kart spełniony przez obie karty Alary.
- **Pogłębienie LORE i uzupełnienie wikilinków (krok 2):**
  - [[536arb-ethersworn-shieldmage|Ethersworn Shieldmage]] oraz [[39mm2-brute-force|Brute Force]] zyskały wikilinki i pogłębione tło świata.
  - [[257ltr-lash-of-the-balrog|Lash of the Balrog]] — poprawka leksyki reguł (czar zwykły / sorcery) i dodanie wikilinków.
  - Strona planu [[alara|Alara]] zaktualizowana o wikilinki do Confluxu i Grixis.
  - **Metryka kompletności (`tools/wiki-stats.mjs`): 100% na wszystkich 38 stronach bazy** (18 kart, 7 haseł, 13 planów).
- **Pass mapowy (krok 4 i reguła procesowa L18):**
  - Wpisano do bazy wiedzy regułę **L18** (oraz aktualizacja `PETLA_JAKOSCI.md` i `AGENTS.md`): pass mapowy to wzbogacenie i weryfikacja wyglądu map wektorowych T3/T4 (POI, biomy, warsztat), a nie sprawdzanie pinezek (które audytują się automatycznie); map T1 i T2 nie wzbogacamy.
  - Weryfikacja integralności mapowej `python3 tools/map-audit.py` = 0 problemów na wszystkich scenach mapowych.

## 2026-09-10 16:00 — Nowy plan: Warhammer Fantasy + karta Brute Force

Do Kodeksu wchodzi **nowy plan franczyzy zewnętrznej** —
[[warhammer-fantasy|Warhammer Fantasy]] (Games Workshop / *Warhammer:
The Old World*) — wraz z pierwszą kartą:

- **[[39mm2-brute-force|Brute Force]]** (MM2, transpozycja do
  Warhammer Fantasy) — ciemnozielony **ork** na błotnistym polu bitwy
  pęcznieje od czerwonej magii **Waaagh!**, którą karmi go garbaty
  szaman: portret doktryny zielonoskórych, że „większy i głośniejszy
  zawsze wygrywa". Karta Katalogowa LORE-first (Zielonoskórzy, Gork i
  Mork, Badlands), snapshot Scryfalla MM2/108, wpis kolekcji verbatim.
- **Strona planu** `warhammer-fantasy` (Stary Świat, Mallus,
  zielonoskórzy, Waaagh!, Imperium/Bretonnia).
- **Research mapowy (MA1) + rekomendacja wariantu:** przeprowadzono
  ogląd kandydatów graficznych i zarekomendowano **T1 (raster oficjalnej
  mapy *The Old World*, GW 2024)** — wg drabiny ADR 0038 (T2 odpada:
  brak dobrego wektora; T4 odrzucone: jest doskonały materiał). Badanie:
  `maps/_warsztat/RESEARCH_2026-09-10-warhammer-fantasy-mapa.md`. Mapa
  planu = `pending` do decyzji właściciela i dostarczenia rastra;
  pinezka karty (rejon Badlands) żyje na razie w sekcji „Na Mapie".

## 2026-09-10 15:15 — Materializacja: Lash of the Balrog (Śródziemie)

Nowa dostawa właściciela zmaterializowana:

- **[[257ltr-lash-of-the-balrog|Lash of the Balrog]]** (LTR, plan
  [[srodziemie|Śródziemie]]) — spadający **Balrog** (Zguba Durina)
  wyrzuca w górę płonący bicz, którego rzemienie owijają kolana
  **Gandalfa Szarego** i ściągają go w przepaść Morii na Moście
  Khazad-dûm. Karta Katalogowa LORE-first (Balrogowie jako skażeni
  Majarowie Morgotha, Pierwsza Era, „Fly, you fools!"), snapshot
  Scryfalla LTR/92, wpis kolekcji verbatim (Fabuła).
- **Pinezka** na mapie Śródziemia (pewność: dokładna) w sercu Gór
  Mglistych — Moria, między Bramą Morii a Doliną Strumienia.

## 2026-09-10 14:30 — Materializacja: Ethersworn Shieldmage (Alara)

Nowa dostawa właściciela zmaterializowana:

- **[[536arb-ethersworn-shieldmage|Ethersworn Shieldmage]]** (ARB, plan
  [[alara|Alara]]) — wedalkeńska mag bitewna sekty Ethersworn zatrzymuje
  na granicy Esper–Grixis deszcz kościanych włóczni nieumarłych barierą
  ze stwardniałej many, osłaniając artefaktową bestię. Karta Katalogowa
  LORE-first (etherium, Noble Work, Conflux), snapshot Scryfalla ARB/4,
  wpis kolekcji verbatim.
- **Pinezka** na mapie Alary (pewność: region) w rejonie Tidehollow /
  The Glass Dunes — esperski brzeg zwrócony ku Grixis.
- Korekta wydania w dostawie: pierwotnie oznaczone CON (Conflux), po
  korekcie właściciela ARB (Alara Reborn) — zgodne ze Scryfallem (karta
  nigdy nie wyszła w Conflux; pierwodruk to ARB 2009).

## 2026-09-10 14:00 — Pętla Jakości (repo-szeroko): hasło Auriokowie

Link-mining Kroku 3 przeprowadzony na **całym repo**, nie tylko na
Kaladeshu — skan encji w planach z ≥2 kartami (Mirrodin ×3, Innistrad ×2):

- Nowe hasło **[[auriok|Auriokowie]]** (`content/lore/auriok.md`,
  klasa `spolecznosc`, plan Mirrodin) — biali ludzie Razor Fields,
  złoto w ciele, Accorderzy i *Accord of Equity*, technika *mirroring*
  z Bladehold, największa odporność na kompleację. Próg 2 kart spełniły
  Banishment Decree i Ruthless Invasion.
- Wikilinki dopisane we wszystkich stronach, które o nich mówiły:
  obie karty, strona planu Mirrodin i hasło Oxidda Chain.
- Weryfikacja repo-szeroka: 15/15 kart ma pinezkę (poza planami bez
  mapy), wszystkie 12 map przechodzą audyt (0 problemów), metryka
  kompletności nasycona.

## 2026-09-10 13:30 — Pętla Jakości: pass mapowy Kaladeshu (wsie Vahd)

Kwerenda kanonu (mtg.wiki: Avishkar; „The World of Kaladesh, Part I”)
zwróciła **nazwy trzech wsi aerowrightów** w Vahd — dawnych wsi
rolniczych Złotych Stopni, w czasie Rozkwitu Eteru przebudowanych na
hangary i pasy startowe przemysłu sterowcowego:

- Na planie doszły **Maranjapur, Panka i Cambi** jako kanonicznie
  nazwane POI z etykietami (wcześniej zdjęte jako bezimienne „wieś” —
  teraz nazwa znana, więc rysujemy).
- Strona planu wzbogacona o zdanie o tych wsiach + cytowania w Źródłach.
- Nowy test regresyjny pilnuje, że wsie są nazwane i że nie wraca
  generyczna „wieś”.

## 2026-09-10 12:40 — Kaladesh: dostrojenie planu (pasmo, ikona, pinezka)

Drobne poprawki po recenzji właściciela:

- **Aleja Olbrzymów** przesunięta na południe, tuż nad rzekę **Vinday** —
  proporcja odległości pasmo↔rzeka zgadza się teraz z mapą deep Ghirapuru.
- **Ikona Ghirapuru** na planie powiększona (skala 2,1), tak by jej obwód
  obejmował większość dzielnic widocznych na deep-mapie (Greenwheel,
  Freejam, Kujar, Jedenaście Mostów, Bomat, Embraal).
- **Pinezka** karty 610M19 przeniesiona ze środka ikony do dzielnicy
  **Greenwheel** (przeliczonej z deep-mapy) — kolejne karty Ghirapuru
  będą rozrzucane po dzielnicach, a nie stosowane w jednym punkcie;
  wciąż mieści się w obrębie (powiększonej) ikony.

## 2026-09-10 02:10 — Kaladesh: poprawki mapy po recenzji właściciela

Sześć uwag do map Kaladeshu (plan + osobna mapa Ghirapuru):

1. **Spójność gór:** pasmo widoczne na mapie miasta na NW (Aleja
   Olbrzymów) dostało swój odpowiednik na planie — wzgórza u wrót
   Ghirapuru nad Vindayem.
2. **Pinezka karty** (Gearsmith Prodigy) wycentrowana dokładnie na
   ikonie miasta (dawniej wisiała obok).
3. **Twarda podmiana** mapy miasta wchodzi teraz dopiero, gdy miasto
   **wypełnia całą ramkę** (a nie „za wcześnie”), i przy podmianie
   **plan znika pod spodem** — koniec efektu „nietrafiania” rzek na styku.
4. **Nazwy wód** na planie (Vinday, Suramal, Vasavati, Mapani) są
   granatowe i **poziome** (bez łuków/obrotów).
5. **Bezimienne POI usunięte:** żadnych „wsi”/„osad rybackich” bez
   kanonicznej nazwy — jak nie znamy nazwy, nie rysujemy punktu.
6. **„Devra Cliffs”** przeniesione z pustego stepu **na pasmo urwisk**,
   gdzie faktycznie są klify.

## 2026-09-10 01:20 — Pętla Jakości: pogłębienie Lathnu + pass mapowy (5 wież)

- **Pogłębienie lore [[kaladesh|Kaladeshu]]** (krok 2): północna rubież
  planu, dotąd zbyta dwoma zdaniami, dostała pełny akapit — **Lathnu**
  („Miasto na Szczycie Świata") na **Urwiskach Devra**: pionowe klify
  i lodowaty wiatr, gospodarka górnicza (wytop rud dla Ghirapuru),
  mało vedalken/elfów z powodu chłodu, pionowa kolejka szynowa i dok
  sterowców na krawędzi urwiska, **Wielka Wspinka** jako mur gór
  „oddzielający Kaladesh od niebios". Dwa nowe źródła (Art of Magic:
  Kaladesh / Concept Art Library + The World of Kaladesh).
- **Weryfikacja dokładności mapy** (Pętla Jakości, krok 4.3): przy
  przeskalowaniu planu do skali planu (PR-30) liczba **wież eterowych**
  spadła z pięciu do trzech, choć kanon i `map.json` mówią o **pięciu**
  (audyt PR-29 ustalił „5, nie 3”, lista umownych). Odtworzono
  wieże 4 i 5 wraz z etykietami — plan znów zgodny z kanonem i własnymi
  rozstrzygnięciami umownymi. Ogląd rastru (resvg): brak kolizji,
  wszystkie na lądzie; map-audit 0; `podklad.svg` 1,82 MB (< limit).
- Link-mining bez nowych haseł — żadna encja nie osiąga progu ≥2 kart
  (kolejki Kaladeshu i Forgotten Realms wciąż o 1 kartę; „eter” pada
  w 1 karcie Kaladeshu, drugie trafienie to „Eternal” z Tarkiru).

## 2026-09-10 00:40 — Kaladesh jako dwie osobne mapy (PR-30)

- **Mapa [[kaladesh|Kaladeshu]] przebudowana na dwie osobne mapy**
  (decyzja właściciela, `docs/decisions/0047-…`): **plan** rysuje się
  teraz w skali planu (jak Zendikar) — duże, proporcjonalne góry
  (Devra, Wielka Wspinka) i wyraźne lasy Peemy zamiast dawnych „ząbków
  piły” i „ziarenek piasku”; **Ghirapur to na planie mała kropka
  z nazwą**.
- **Ghirapur to osobna mapa miasta o własnej skali** (~7× planu),
  podgrywana **twardą podmianą** deep-zoom (z przenikaniem) od
  pewnego poziomu zbliżenia — wzorzec Dominarii, ale jako naprawdę
  inna mapa. Zniesiony wymóg idealnego łączenia rzek na krawędzi
  (ADR 0046 §5 → **ADR 0047**): to inne mapy. Rysunek samego miasta
  bez zmian (mury, Kanał Dukhara, Jedenaście Mostów, Greenwheel,
  Iglica Eteru, Aetherflux Reservoir).
- Deep-link pinezki **Gearsmith Prodigy** trafia w serce Greenwheel
  i startuje z progiem podmiany na mapę miasta.

## 2026-09-09 19:52 — Audyt PR-28 i Pętla Jakości (PR-29)

- **Audyt PR-28** (`docs/audits/AUDYT_2026-09-09-PR28.md`): werdykt —
  powyżej standardu domowego; 5×P3 (N1–N5) z naprawami w tej sesji:
  deep-linki w „Na Mapie” (610M19 + 309ISD + 393DKA), epoka mapy bez
  szczegółu niepotwierdzonego źródłowo, pozycja Bunarat i liczba
  wież (5) na listach umownych, konwencja nazewnictwa bezimiennych
  POI (SKILL pkt 8), KOREKTA liczników w HANDOFF PR-28 (176/176).
- **[[kaladesh|Kaladesh]] pogłębiony** o wiedzę świata:
  **Aetherflux Reservoir** (największy zbiornik rafinowanego eteru),
  detal dzielnic (First Bridge, Akhara, The Dhund, Gremlin Hovels,
  Prakhata Club, śluzy-śniegi **Aleja Olbrzymów** z migracjami
  olbrzymów 2× w roku, Surash w **Przykryciu**, **Shaila's Claim**),
  jalpari i niebiańskie wieloryby + nowa sekcja
  **„Kultura i codzienne życie”** (sari, kuchnia, krykiet,
  estetyka artefaktów).
- **Mapa: Aetherflux Reservoir na płycie L2 Ghirapuru** — nowy
  klocek mapforge `zbiornik` (zawieszona kula eteru z linkami
  nośnymi); pozycja nad Kujarem = wybór rekonstrukcji (kanon nie
  podaje współrzędnych). map-audit 0; recenzja wizualna cropu.
- Link-mining: bez nowych haseł — cała kolejka Kaladeshu (Ghirapur,
  Konsulat, Greenwheel, eter, Targ Wynalazców) o jedną kartę od
  progu (L17).

## 2026-09-09 16:13 — Korekta: hasło Wybrzeże Mieczy skasowane (poniżej progu 2 kart)

- Hasło **Wybrzeże Mieczy** powstało w PR-27 przy jednej karcie
  (3CLB) zamiast wymaganych dwóch — decyzją właściciela zostało
  **skasowane**, a wzmianki w karcie i na planie wróciły do zwykłych
  pogrubień. Encja czeka w kolejce link-miningu na drugą kartę.
- Próg haseł (≥2 karty) jest odtąd egzekwowany testem regresyjnym —
  strona poniżej progu nie przejdzie suitki.

## 2026-09-09 16:05 — Gearsmith Prodigy: piętnasta karta i nowy plan Kaladesh z mapą T4

- **[[610m19-gearsmith-prodigy|Gearsmith Prodigy]]** dołącza do Kodeksu
  jako piętnasta karta kolekcji i pierwsza karta
  [[kaladesh|Kaladeshu]]. Młoda konstruktorka z Ghirapuru testuje na
  tarasie Greenwheel mechanicznego lisa z mosiężnego filigranu —
  a sprawny automat dodaje jej śmiałości w rywalizacji z mistrzami
  Konsulatu. Zdolność karty (+1/+0 przy artefakcie) czyta się tu
  wprost: maszyna nie walczy za nią, lecz walczy w niej.
- **Nowy plan [[kaladesh|Kaladesh]]** (doba Konsulatu, KLD/AER):
  eter w atmosferze, kult wynalazców, Targ Wynalazców i bunt eterowy;
  przemianowanie w Avishkar odnotowane jako granica epoki.
- **Mapa Kaladeshu (T4)** — jedna mapa całego planu: sieć rzeczna
  Vinday–Suramal–Vasavati, Peema, Vahd, Lathnu i gęsty Ghirapur na
  zlewisku (Kanał Dukhara, Jedenastu Mostów, Iglica Eteru, dzielnice).
  Pierwsza mapa otwierająca się domyślnie na ognisku (Ghirapur).
  Pinezka karty o pewności `region` stoi w Greenwheel.
- Nowy tag **konstrukty** (automatony i żywe wynalazki).

## 2026-09-09 12:10 — Civilized Scholar: czternasta karta, pierwsza niezależna twarz DFC i hasło Thraben

- **[[309isd-civilized-scholar|Civilized Scholar]]** dołącza do Kodeksu
  jako czternasta karta kolekcji i druga karta [[innistrad|Innistradu]].
  Strona dotyczy wyłącznie havengulskiego uczonego z Nephalii, który bada
  gniew w epoce zniknięcia Avacyn i próbuje leczyć lęk wiedzą,
  samodyscypliną oraz językiem traktatów.
- **Nowe hasło [[thraben|Thraben]].** Miasto przekroczyło próg praktyczny
  dzięki karcie [[393dka-forge-devil|Forge Devil]], nowemu
  [[309isd-civilized-scholar|Civilized Scholar]] i stronie planu
  [[innistrad|Innistrad]]. Wikilinki dopisano także na planie Innistradu.
- **Mapa Innistradu** dostała nową pinezkę karty
  `309isd-civilized-scholar` o pewności `dokladna` na **Havengulu** —
  miejscu nazwanym wprost w przekazie sceny. Karta 393DKA zachowała
  swoją pinezkę przy [[thraben|Thraben]], więc plan ma teraz dwa jawnie
  rozdzielone punkty kartowe.
- **Pierwsza lokalna obsługa niezależnej twarzy karty `layout: transform`.**
  `scryfall/309isd-civilized-scholar.json` zachowuje pełną odpowiedź
  `cards/isd/47` z `card_faces`, ale sama materializacja wykorzystuje tylko
  stronę **Civilized Scholar**: frontmatter karty przyjmuje `kolory: [U]`,
  a build/testy rozumieją już dopasowanie nazwy strony do właściwej twarzy
  snapshotu bez mieszania obu stron w jednej karcie. Reguła została też
  zapisana formalnie jako **ADR 0044**: dla karty dwustronnej jedna twarz
  = jedna Karta Katalogowa.
- Weryfikacja po zmianach: `npm test` **166/166**, `npm run build` OK,
  `python3 tools/map-audit.py` = **0 problemów**, `node tools/wiki-stats.mjs --json`
  = **30 stron (14 kart, 5 haseł, 11 planów), średnio 100% kompletności**.

## 2026-09-09 11:58 — Ruthless Invasion: trzynasta karta, nowy punkt Mirrodinu i hasło Oxidda Chain

- **[[556nph-ruthless-invasion|Ruthless Invasion]]** dołącza do Kodeksu jako
  trzynasta karta kolekcji i trzecia karta Mirrodinu z ery wojny przeciw
  [[nowa-phyrexia|Nowej Phyrexii]]. Scena stoi po stronie odwrotu, nie zwycięstwa:
  Vulshokowie na pustkowiach Oxiddy cofają się przed kolosem z płynnego
  metalu, a głos **Pythora** zamienia odwrót w nową doktrynę przetrwania.
- **Nowe hasło [[oxidda-chain|Oxidda Chain]].** Region przekroczył próg
  praktyczny dzięki karcie [[488som-carapace-forger|Carapace Forger]],
  nowemu [[556nph-ruthless-invasion|Ruthless Invasion]] i istniejącej stronie
  planu [[mirrodin|Mirrodin]]. Wikilinki dopisano także w
  [[mephidross|Mephidrossie]].
- **Mapa Mirrodinu** dostała nową pinezkę karty `556nph-ruthless-invasion`
  o pewności `region` na pograniczu Oxiddy i Kuldothy — dokładnie tam,
  gdzie opis sceny pozwala mówić o przełamaniu linii Vulshoków bez
  udawania, że znamy pojedynczy mur czy wąwóz.
- **Porządki i strażnicy:** `test/ui-smoke.test.js` uwzględnia już 13 kart
  i obecność najnowszej materializacji na stronie głównej, a karta 556NPH
  została oczyszczona z meta-języka w narracji, by przejść bramkę
  **Głosu Kronikarza (ADR 0042)**.
- Weryfikacja po zmianach: `npm test` **165/165**, `npm run build` OK,
  `python3 tools/map-audit.py` = **0 problemów**, `node tools/wiki-stats.mjs --json`
  = **28 stron (13 kart, 4 hasła, 11 planów), średnio 100% kompletności**.

## 2026-09-09 01:10 — Forgotten Realms: czysty raster bez brązowych kropek, legenda tylko dla pinezek kart

- **Mapa Forgotten Realms wraca do czystego T1.** Z `maps/forgotten-realms/map.json`
  zniknęła eksperymentalna warstwa dodatkowych kropek/POI; strona mapy
  renderuje już wyłącznie raster 3E + kafelki LOD + pinezki kart.
- **Legenda map** nie pokazuje już martwego wpisu
  `obwódka regionu — kraina hasła geograficznego` — zgodnie z ADR 0043
  na mapie oznaczenia niosą wyłącznie karty.
- **Doprecyzowanie procesu:** `content/planes/forgotten-realms.md`,
  `docs/guides/PETLA_JAKOSCI.md` i ADR 0038 jasno mówią teraz, że T1 z
  dobrym rastrem startuje od zasady **„nic nie doklejamy ponad druk”**;
  dodatkowe POI/labelki albo deep-map ważnego miejsca wymagają osobnej
  konsultacji z właścicielem.
- Regresja sprawdzona: `npm test` **166/166**, `npm run build` OK,
  `python3 tools/map-audit.py` = **0 problemów**.

## 2026-09-09 00:48 — Audyt PR-25 domknięty: poprawiona geografia Forgotten Realms, pogłębiony Mephidross, nowe hasło Wybrzeże Mieczy

- **Audyt poprzedniego scalonego PR #25** zapisany w
  `docs/audits/AUDYT_2026-09-09-PR25.md`, a jego dwa znalezienia
  zostały od razu obsłużone na gałęzi sesji.
- **Forgotten Realms wyprostowane po audycie:** `content/planes/forgotten-realms.md`
  i `maps/forgotten-realms/map.json` nie mylą już **Luruaru** z południem
  przy Amnie, jasno traktują **Sea of Fallen Stars = Inner Sea**, a
  południowy akwen podkładu opisują jako **Jezioro Pary (Lake of Steam)**;
  opis `Trackless Sea` wrócił na zachód/południowy zachód. Warsztatowe
  notki badań i backlog przestały dziedziczyć błędne nazwy.
- **Karta [[3clb-nefarious-imp|Nefarious Imp]]** straciła niekonkretne
  źródło `https://worldaneil.github.io`; zostaje bezpośredni, weryfikowalny
  wpis o impach z FR Wiki.
- **Pogłębienie LORE (krok 2):** [[mephidross|Mephidross]] dostał nowe
  akapity o nimach, Moriokach, ruchomych granicach Drossu (Darkslick,
  Blackcleave, Rey-Goor), Ish Sah i skali phyrexiańskiej infekcji.
- **Link-mining (krok 3):** nowe hasło **Wybrzeże Mieczy**
  (geografia, Forgotten Realms) z odsyłaczem do mapy Faerûnu; wikilinki
  dopisane w karcie 3CLB i na stronie planu. [KOREKTA 2026-09-09:
  hasło powstało poniżej progu 2 kart i zostało skasowane decyzją
  właściciela — wpis wyżej.]
- Weryfikacja po zmianach: `npm test` **166/166**, `npm run build` OK,
  `python3 tools/map-audit.py` = **0 problemów**, `node tools/wiki-stats.mjs --json`
  = **26 stron, średnio 100% kompletności**.

## 2026-09-08 22:35 — Mapa FR: Calimport odnaleziony na podkładzie — kotwica Królestwa Wysokiego na dobrej pozycji

- **Korekta po recenzji właściciela:** twierdzenie „na mapie nie ma
  Calimporta” było błędem odczytu (szukano wschód od Morza
  Wewnętrznego, a nie na południu). Calimport leży na **północnym
  brzegu The Shining Sea, na południe od Calim Desert (Calimshan)** —
  etykieta miasta jawna na rastrze 3E.
- Kotwica **Królestwo Wysokie** przeniesiona na Calimport
  (0.285, 0.736) z jawnym odwołaniem do etykiety na podkładzie;
  **Calimport dołączony do warstwy POI** (14 punktów). Strona planu
  (Geografia: The Shining Sea, „Złota Przystań”) i test ui-smoke
  (≥14 kółek) zsynchronizowane.

## 2026-09-08 22:05 — Mapa FR: wektor T2 do kosza, podkład = oficjalna Faerûn 3E (T1+LOD jak Dominaria) + warstwa POI

- **Decyzja właściciela (po obejrzeniu mapy live): T2 wektor
  Vectorized Realms odrzucony** („wolny, brak ikon lokalizacji,
  brzydki”) — kasacja `podklad.svg` (4,3 MB) i wymiana na **T1:
  oficjalną mapę Faerûn 3E** (WotC/TSR, 2001, 4763×3185; plik
  dostarczył właściciel, commit „Add files via upload”).
- **Model ładowania = dokładnie Dominaria (ADR 0039):** L0
  (`l0.jpg`, 1920 px, 826 kB) ładowane pierwsze w całości +
  kafelki L1 w pełnej rozdzielczości (10×7 po 512 px, próg 2.5)
  doładowywane od przybliżenia; master 4,3 MB w repo, poza dist.
  Siatka cięta `tools/kafle.mjs` (konwersja webp→JPG q92).
- **Nowa warstwa POI (decyzja właściciela: „pod spodem wektorowo
  najważniejsze POI pod przyszłe pinezki”):** 13 złotych kółek
  (miasta Wybrzeża Mieczy, Silverymoon, Mithral Hall, Myth
  Drannor, Mulmaster, Helondeth, Mulhorand, huby Moonshaes i
  Nelanther) renderowanych w scenie **pod warstwą kafelków** —
  widoczne na rastrze L0, po doładowaniu L1 pokrywa je druk
  mastera. Dane w `map.json` (pole `poi`), bez etykiet (nazwy
  niesie raster), bez interakcji (ADR 0043: piny = tylko karty).
- **Kotwice i pinezka przeliczone na nowy raster** (odczyt siatki
  5% na L0 + wycinki detaliczne): 9 regionów w nowych
  współrzędnych; pinezka 3CLB na środku pasa Wybrzeża Mieczy
  (0.124, 0.176 — Neverwinter–Waterdeep), pewność rejon bez
  zmian. „Królestwo Wysokie” bez jawnej etykiety na podkładzie —
  kotwica z jawną proweniencją (Cities of the Inner Sea 3e).
- **Strażnicy:** ui-smoke FR odwrócony na T1 (img l0.jpg, brak
  inline SVG i kodex-etykiet, warstwa `data-kafle` + `mapa-poi`
  z ≥13 punktami); `mapy.test.js`: schemat warstwy POI (nazwa,
  x/y ∈ [0,1], bez duplikatów).
- Strona planu (sekcja Mapa) i karta 3CLB („Na Mapie”, Źródła)
  zsynchronizowane z nowym podkładem.

## 2026-09-08 20:59 — Naprawa map: lewy górny róg w środku okna (wszystkie mapy) + FR bez grafiki

- **Regresja (recenzja właściciela): „środek iframe'a to lewy górny
  róg mapy, większość chowa się poza ekranem — dotyczy WSZYSTKICH
  map".** Przyczyna: deep-link miejsca `?x=&y=` (ADR 0043) liczył
  `Number(query.x)` a pusty string brakującego parametru daje
  `Number('') = 0` ⇒ każda mapa bez query dostawała `data-x="0"
  data-y="0"` i centrowała się w rogu (0,0) z zoomem deep-linka
  (2.5×). Poprawka: pusty string = brak parametru (→ NaN, bez
  atrybutu). Wyraźne `?x=&y=`, `?pin=` i widok domyślny działają
  (zweryfikowane geometrią w jsdom: identity bez query, centering
  na pinezce/miejscu z query).
- **Regresja FR: „ikona niezaładowanej grafiki + podpis Podkład
  mapy".** Przyczyna: eksport Inkscape ma `<svg>` z nową linią po
  tagu, a gate inline `markup.includes('<svg ')` (spacja!) odrzucał
  taki plik ⇒ podkład renderował się jako `<img>` do bazy wektorowej,
  której nie ma w drzewie dist (ADR 0027 v3). Poprawka: gate toleruje
  ślad po tagu (`/<svg[\s>]/`, `doMarkupPodkladu`) + normalizacja
  tagu otwierającego `podklad.svg`.
- **Strażnik:** test regresji `mapy.test.js` (brakujące/puste
  `?x=&y=` NIE dają atrybutu miejsca; wyraźne dają) + rozbudowa
  ui-smoke (FR: inline SVG, nie `<img>`; warstwa etykiet obecna).
- Weryfikacja: 165/165 testów, build 25 stron (12 kart, 2 hasła,
  11 planów), stats 100%; geometria map zmierzona (identity domyślna,
  centering pinezki/miejsca wg wzoru).

## 2026-09-08 20:25 — Nowa karta Nefarious Imp (3CLB) + nowy plan: Zapomniane Krainy (mapa T2)

- **Nowa karta + nowy plan (dostawa właściciela):** 3CLB
  *Nefarious Imp* (CLB #137, `{2}{B}` 2/1, Imp — Flying; „Whenever
  one or more permanents you control leave the battlefield, scry 1”)
  — pierwsza karta planu franczyzy zewnętrznej **Zapomniane Krainy**
  (*Forgotten Realms*, D&D; typIP zewnetrzne, wzór Final Fantasy).
  Głos Kronikarza (ADR 0042) — scena: mroczny gabinet wojenny na
  Wybrzeżu Mieczy, szkarłatny imp, stopione figurki, skradziony
  kryształ i widmowy obraz artefaktu. Tagi ze słownika:
  demony/szpiedzy/wojna.
- **Nowy plan:** `content/planes/forgotten-realms.md` — setting w
  pigułce (Abeir-Toril, Faerûn, Wybrzeże Mieczy, Tkanina Magii, Czas
  Kłopotów, bóstwa), geografia (9 regionów mapy), sekcja Mapa,
  źródła (FR Fandom EN/PL, D&D Beyond, Vectorized Realms, Scryfall).
- **Mapa T2 (przyjęcie):** `maps/forgotten-realms/` — jedyny
  kompletny wektor Faerûn znaleziony w kwerendzie: **Vectorized
  Realms** (jonovotny), `faerun-v016-40dpi.svg` (4,29 MB, viewBox
  3055.4×2043.6). Brak otwartej licencji ⇒ użytkowanie prywatne
  (projekt prywatny, bez publicznej dystrybucji — decyzja
  właściciela 2026-09-08); źródło w stopce mapy (wzór podkładów
  Tarkiru/Innistradu). Podkład bez etykiet ⇒ warstwa
  `#kodex-etykiety` (9 polskich etykiet regionów) wewnątrz podkładu
  (model mapome/Śródziemia; T2 inline'uje SVG as-is).
- **Pinezka (ADR 0043):** 3clb w środku Wybrzeża Mieczy
  (0.18/0.38, pewność: region) — scena nie nazywa miasta, więc
  pinezka stoi na rejonie, nie na lokalu.
- **Research doc:** `maps/_warsztat/RESEARCH_2026-09-08-forgotten-realms-mapa.md`
  (inwentarz wektorów + SHA-e blobów, weryfikacja wizualna resvg,
  kwestia licencji, układ współrzędnych, etykiety).
- **Backlog:** sekcja link-miningu FR — Wybrzeże Mieczy, Avernus,
  imp, Wojna Hobgoblinów „o jedną kartę” od progu.
- **Testy:** ui-smoke — 12 kart (`Karty Katalogowe (12)`), 5.
  materializacja na home = 605SHM (Consign to Dream).
- Weryfikacja: 164/164 testów, build 25 stron (12 kart, 2 hasła,
  11 planów), stats 100%.

## 2026-09-08 20:15 — ADR 0043: na mapie oznaczenia noszą wyłącznie karty

- **Reguła systemowa (właściciel):** piny/obwódki na mapie mogą mieć
  **tylko KARTY**. Geografia nie jest na mapie zaznaczana; jedyny związek
  strony (karty/hasła/planu) z mapą = **odsyłanie do mapy zbliżonej w
  określonym miejscu** (deep-link `?x=<0–1>&y=<0–1>`).
- **Czyszczenie bazy:** hasło `mephidross` traci pinezkę z frontmattera
  i obwódkę regionu; „Na mapie” = zdanie o położeniu + odsyłanie
  `#/mapa/mirrodin?x=0.6381&y=0.7787`. Pole `regiony` usunięte ze
  wszystkich `map.json` (schemat wycofany).
- **Silnik:** renderowanie obwódek/etykiet regionów haseł usunięte
  (render-map.js + martwa CSS); **nowy deep-link `?x=&y=`** — centruje i
  przybliża punkt bez zostawiania znacznika (działa z LOD, jak `?pin=`).
- **Walidacja na sztywno:** frontmatter `pinezka` poza `karta` = błąd
  (registry.js); `regiony` w `map.json` = problem (content-loader) +
  guard test `mapy.test.js` (ADR 0043).
- **Metryka (ADR 0043):** pinezka = N/A dla haseł **każdej klasy**
  (maks 6 zamiast 8) — nie tylko niegeograficznych.
- **Dokumentacja:** ADR 0043 (+ ADR 0015 §2.6 częściowo zastąpione);
  SZKIELET_HASLA, PETLA_JAKOSCI, PROCES_MAP, PLAN mapforge E5.
- Weryfikacja: 162/162 testów, build 23 strony, map-audit 0, stats 100%.

## 2026-09-08 18:50 — Pętla Jakości: pełny obieg (metyka, pogłębienie, hasło Mephidross)

- **Metryka:** pinezka w stats nie ma sensu dla haseł bez lokalizacji
  (szkielet: „Na mapie” tylko `geografia`/`postac`) — komponent N/A
  dla pozostałych klas (maks 6 zamiast 8); Nowa Phyrexia 75% → 100%.
  Baza: **100% (średnia 7.9/8), 23 strony**.
- **Pogłębienie (2 strony):** plan `dominaria` (374 → ~560 słów:
  kontynenty z ludami i punktami — Wybrani i Pięć Edyktów, Tangle,
  Zhalfir i bitwa Inwazji, Kabała i Coliseum, Sylex; **korekta:**
  Sarpadia to ruiny Sarpadyjskich Imperiów (Icatia, Vodalia, Czarne
  Ręce, Havenwood, upadek ok. 170 AR) — nie „imperium thorne'ów”);
  karta `305arb-illusory-demon` (paleta wiru = mieszanka many
  pięciu shardów + boldy Child of Alara/Maelstrom Wanderer).
- **Link-mining: hasło [[mephidross|Mephidross]]** (geografia,
  Mirrodin) — próg 2 kart (476mbs + 488som) + plan; wikilinki w 3
  miejscach; na mapie Mirrodinu **obwódka regionu** (regiony w
  map.json, pewność region, bbox z kotwic kanonicznych). Kolejka
  „o jedną kartę” od progu: ~35 encji w backlogu.
- **Pass mapowy:** pinezki 11/11 kart (frontmatter + map.json),
  map-audit 0, nowa obwódka regionu hasła (mechanizm `regiony`
  po raz pierwszy użyty).
- Weryfikacja: 161/161 testów, build 23 strony (11 kart, 2 hasła,
  10 planów), map-audit 0, stats 100%.

## 2026-09-08 18:45 — Naprawa CI: build mini-map bez ImageMagick (czysty JS)

- **Czerwony CI od 17:24 (regresja z deduplikacji ZIP-a) naprawiona.**
  Przyczyna: build mini-map używał `convert` (ImageMagick), którego nie
  ma na runnerach GitHub (ubuntu-latest 24.04) — build cicho spadał na
  pełną bazę, a bramka testowa (resvg dostępny) odrzucała drzewo.
- **Nowy łańcuch (ADR 0027 v3, korekta):** wyłącznie devDependency npm,
  zero binarików systemowych — resvg (SVG→PNG) + `pngjs`/`jpeg-js`
  (czysty JS: dekodowanie, skalowanie bilinearnie do 800 px, JPEG q80).
- Weryfikacja: build + 161/161 testów w środowisku **bez** `convert`
  (symulacja runnera) i z nim; mini 57–216 kB (bramka ≤ 400 kB);
  ZIP ~62,3 MB (200 plików).

## 2026-09-08 18:10 — Głos Kronikarza: narracja kart 100% w świecie (ADR 0042)

- **Decyzja właściciela (po recenzji Expunge):** „aż do części
  Mechanika jako opowieść całość treści jest 100% osadzona w Lore” —
  wpis karty czytany ma być jak fragment kroniki świata. Język procesu
  (karta, Fabuła, Kodeks, kolekcja, kanon, Scryfall, oracle, print,
  flavor, snapshot, dostawa, reguła karty, epoka karty, „most”)
  zabroniony w narracji do sekcji „Mechanika jako Opowieść”; żyje tylko
  w frontmatter/infoboksie/Mechanice/Źródłach.
- **ADR 0042** + wycofany ADR 0030 §5 („skrajnie zwięźle”) + słowniczek
  zastępczy: scena/ryt/zapis, inskrypcja, kronikarz dopowiada,
  mechanika rytu, fakt świata.
- **Skan katalogu: meta-język w narracji miały wszystkie 11 kart**
  (w tym przepisany Expunge) — ~70 poprawek zdaniowych; fakty
  (miejsc, bytów, epok, pinezek) bez zmian.
- **Strażnik:** `test/glos-kronikarza.test.js` — 26 terminów meta na
  ciało sekcji narracyjnych każdej karty ze snapshotem + regresja
  40USG; **161/161 testów**.

## 2026-09-08 17:30 — ZIP lżejszy o 28 MB: mini-mapy z miniatur, koniec dublowania map

- **Pytanie o ZIP rozstrzygnięte i naprawione.** Strony map inlinowały
  całe wektorowe podkłady (musi tak być — `file://` blokuje `fetch`),
  a te same pliki leżały w katalogach `maps/<plan>/` — dublet wart
  ~28,8 MB (32% ZIP-a). Do tego mini-mapa planów T4 dociągała CAŁY
  8,3 MB SVG jako thumbnail.
- **Nowy stan (ADR 0027 v3):** mini-mapa = **mini.jpg generowany w
  buildzie** (screenshot bazy, 800 px, ~50–160 kB — pinezka rysowana
  na niej w dokładnych współrzędnych, jak dotąd). Katalogi `maps/`
  zawierają tylko to, co strona mapy dociąga `<img>` (rastry, kafle) —
  zero SVG-ów, zero dubletów.
- **Efekt: ZIP 90,5 → 62,1 MB (−31%)**; mini-mapa Lorwynu waży teraz
  92 kB zamiast 8,3 MB.

## 2026-09-08 16:55 — Dominaria: mapa wraca do reguł, pinezka zmierzona na podkładzie

- **Deep-zoom „Aerony” znika z mapy** — decyzją właściciela nic nowego
  nie wnosił (wycinek tej samej dużej mapy). Mapa Codexu to teraz dwa
  elementy: jedna całościowa mapa FHD + kafelkowa od pewnego zoomu
  (ADR 0041). Raster 1,6 MB zniknął z repo i z pobieranego ZIP-a.
- **Pinezka [[40usg-expunge|Expunge]] zmierzona na podkładzie M1**
  (nie z ilustracji karty — to procedura, ADR 0040): ikona Cathedral
  of Serra na masterze, pixel (1569, 1979) → (0.1937, 0.3806).
  Pewność: region — Fabuła nie wskazuje podwórka.
- **Karta Expunge przepisana w całości** — scena oparta na Fabule
  właściciela i kanonie (złotoskrzydły wojownik Serran nad katedrą,
  ~3780 AR), nie na odczycie ilustracji. Nowy test pilnuje całego
  katalogu kart: zero nawiązań do oryginalnych ilustracji, zero
  wignet, zero nazw artystów w treści (ADR 0040).
- Strona planu [[dominaria|Dominarii]] zyskała sekcje „Mapa” i
  „Źródła”, a pełny build czyści `dist/` — plik usunięty z repo
  znika z drzewa i ZIP-a (stare 1,6 MB przetrwałyby w archiwum do
  tej sesji).

## 2026-09-08 14:45 — Audyt PR-23: jezioro bez nazwy nocą, proweniencja kotwic Innistradu

- **Lorwyn:** nazwa „Source of Lanes” znika z nocnego oblicza mapy —
  efemeryczna kraina Shadowmoor nie pamięta dziennych nazw wód
  (poprawka F3; test pilnuje odtąd rozdziału zestawów nazw).
- **Innistrad:** sprostowanie do wpisu z 12:20 — nie wszystkie 64
  kotwice da się zweryfikować w przewodnikach tekstowych. Każda ma
  odtąd jawną proweniencję jednostkową: 24 miejsca poświadcza kanon
  z cytowaniem źródła, 40 znanych wyłącznie z rastra czeka na
  weryfikację przy karcie z regionu (poprawka F5; test-brama w pakiecie).
- Licznik testów rośnie do **144**, strona Innistradu mówi już tylko
  to, co da się udowodnić.

## 2026-09-08 14:31 — Audyt PR-23: Fabuła dopisana do Forge Devil

- Audyt scalonego PR-23 (81 plików) nie wykazał wad bazy: testy, build,
  map-audit i kompletność zielone, mapy Lorwynu, Mirrodinu, Innistradu
  i Tarkiru obejrzane rastrowo.
- Jedyna naprawa treści: [[393dka-forge-devil|Forge Devil]] nie cytował
  Fabuły właściciela (mimo Fabuły w dostawie) — dopisano osadzenie
  w Transpozycji i wpis w Źródłach. Test pilnuje odtąd cytowania
  Fabuły na każdej karcie.
- Doprecyzowano opis pinezki [[476mbs-banishment-decree|Banishment Decree]]
  (południowy wschód od Cave of Light) i domknięto dokumentację PR-23
  o 6 commitów spoza handoffu (m.in. obie nowe karty i ADR 0038).

## 2026-09-08 12:20 — Iskry w archiwum: Innistrad wchodzi do Kodeksu

- **Nowy plan:** [[innistrad|Innistrad]] — gotycki horror, cztery
  prowincje wokół **Thraben**, jeden srebrny księżyc i Kościół, którego
  archanioł zniknął. Strona planu opisuje geografię, **Helvault**,
  pęknięcie Kościoła Avacyn i osobliwe rozróżnienie: demony knują,
  a diabły są ich popędami przybranymi w ciało.
- **Nowa karta:** [[393dka-forge-devil|Forge Devil]] (DKA) — dziesiąta
  karta kolekcji. W najniższych poziomach Katedry w Thraben diabeł
  rozbija żeliwnym prętem filar nośny, a wokół płoną bezcenne archiwa
  Kościoła. Rykoszetujący gruz rani i katarów, i tych, którzy potwora
  przywołali.
- Sedno sceny: to nie atak, tylko **osłabianie**. Diabeł nie wygra
  z katarem, więc podcina to, na czym stoi ich świat — konstrukcję
  i pamięć. Mechanika mówi dokładnie to samo: jedno obrażenie w cel,
  drugie zawsze we własną stronę.
- **Mapa Innistradu** to pierwszy w Kodeksie podkład **T1** poza
  Tarkirem: raster 4096×3072 dostarczony przez właściciela, z 64
  kotwicami zweryfikowanymi w kanonie tekstowym. Oficjalnej mapy planu
  Wizards nigdy nie wydał, więc kanoniczny podkład nie istnieje.
- Pinezka stoi na **Thraben** z pewnością **dokładną** — miejsce podaje
  wprost tekst karty. Na mapie widać, jak daleko stąd do **Ashmouth**
  i **Devils' Breach**, dwóch bram do świata diabłów: ten stwór nie
  przyszedł pieszo, ktoś go wpuścił.
- Drabinę wyboru wariantów map (**T2 → T1 → T3 → T4**) utrwalono
  w nowym ADR 0038 wraz z zasadą, że rekonstrukcja z samego tekstu jest
  ostatecznością wymagającą uzasadnienia.

## 2026-09-08 11:40 — Niegodny konsekracji: biała Phyrexia na Mirrodinie

- **Nowa karta:** [[476mbs-banishment-decree|Banishment Decree]] (MBS,
  Mirrodin) — dziewiąta karta kolekcji i druga na tym planie. Cenobita
  **Ortodoksji Maszyn** orzeka nad wojownikiem **Aurioków**, że ten jest
  „niegodny konsekracji", i falą sterylnego światła wypycha go
  z katedry z powrotem na **Razor Fields**.
- Sedno sceny: biała [[nowa-phyrexia|Phyrexia]] nie zabija heretyka —
  **ocenia go i odsyła**. Compleation nazywa łaską, więc odmowa
  przerobienia w maszynę jest karą. Wyrok wydaje urzędnik niskiej rangi
  („Axsh, pomniejszy cenobita"), rutynowo: to procedura, nie wydarzenie.
- Gorzka logika z kanonu: Auriokowie byli ludem **najbardziej opornym
  na compleation**, więc dla tej frakcji są surowcem wybrakowanym.
  Mechanika mówi to samo — zaklęcie nie niszczy celu, tylko odkłada go
  na wierzch talii.
- **Plan [[mirrodin|Mirrodin]]** dostał opis Ortodoksji Maszyn jako
  białej frakcji najeźdźcy oraz rozbudowane hasło o Auriokach
  (Accorders, *Accord of Equity*, technika *mirroring* z Bladehold).
- Pinezka na mapie Mirrodinu przy **Cave of Light**, białej lakunie
  u podnóża Taj-Nar: świątynia najeźdźcy przy przejętym sanktuarium
  obrońcy. Kanoniczna **Fair Basilica** świadomie **nie** została z tą
  katedrą utożsamiona — to sfera późniejszej epoki, po upadku planu.

## 2026-09-08 10:05 — Pętla Jakości: co naprawdę łączy światy Final Fantasy

- **[[final-fantasy|Final Fantasy]]:** plan był najuboższą stroną bazy —
  dostał sekcję o tym, co spina sagę, skoro nie spina jej geografia.
  **Kryształy** jako źródło powołania i cel podboju; **Lifestream** —
  rzeka duchowej energii, w której krąży pamięć zmarłych; **materia**
  jako skrystalizowana wiedza; **wydobycie** jako sedno konfliktu
  (planeta jest żywa, a jej krew da się spalić na prąd); **Jenova**
  i zagłada **Cetry** dwa tysiące lat przed sceną karty; **Ziemia
  Obiecana**, która nigdy nie była miejscem — tylko stanem, i której
  błędne odczytanie ściągnęło nieszczęście na [[275fin-aerith-rescue-mission|Aerith]].
- **[[1ltr-dunland-crebain|Dunland Crebain]]:** dopisana historia sieci
  zwiadu. Saruman zbudował swój wywiad cudzymi rękami — ptasich szpiegów
  pomagał mu zbierać **Radagast**, przekonany, że służy Białej Radzie.
  **Éomer** ostrzegał, że „ptaki złej wróżby są w powietrzu”, a **Théoden**
  życzył czarodziejowi szubienicy „na uciechę jego własnym krukom”.
- Bez nowych haseł: żadna encja nie przekroczyła progu dwóch kart.
  Wszystkie **8 kart** ma pinezki na mapach swoich planów.

## 2026-09-08 09:10 — Consign to Dream i pierwsza mapa dwóch oblicz: Lorwyn–Shadowmoor

- **[[605shm-consign-to-dream|Consign to Dream]]:** nowa Karta Katalogowa.
  Glen Elendra broni się glamerem, nie cierniami; olbrzym nie zostaje
  pokonany siłą, tylko pozbawiony trwałości. Sen jako łup wróżek Oony.
- **[[lorwyn|Lorwyn–Shadowmoor]] — nowy plan** z mapą **T4** i
  **przełącznikiem dwóch oblicz**: ta sama geografia, dwa zestawy nazw
  (Goldmeadow ↔ Mistmeadow, Kinsbaile ↔ Kinscaer, Lys Alana ↔ Cayr
  Ulios, Wanderwine ↔ Wanderbrine). Domyślny widok to Shadowmoor, bo
  z tego oblicza pochodzi karta.
- Wspólny rysunek jest **konwencją atlasu**, nie twierdzeniem, że Wielka
  Zorza niczego nie zmieniła — zastrzeżenie zapisane w proweniencji mapy.
  Nazwy bez potwierdzonej pary nie dostały wymyślonego odpowiednika.
- Pinezka Consign to Dream: **Glen Elendra**, pewność `region`.
  Teraz **8 kart, 8 planów, 1 hasło**.

## 2026-09-07 22:40 — Pętla Jakości: pamięć Mirrodinu, ratunek Aerith i pierwsze wspólne hasło

- **[[275fin-aerith-rescue-mission|Aerith Rescue Mission]]:** relacje
  ratowników, dług wobec Aerith, Cetra i cel badań Hojo. Przeszłość
  Clouda jako SOLDIER jest jego deklaracją, nie bezkrytycznie przyjętym
  życiorysem; ujęcie schodów odróżnione od całego przebiegu misji.
  Nie dodano fikcyjnego flavoru.
- **[[mirrodin|Mirrodin]]:** pamięć Tel-Jilad i Rebuking, cena Zniknięcia,
  regencja Kemby i rozłam leonin. Społeczny kontekst epoki Blizn
  łączy plan z Carapace Forger.
- **[[nowa-phyrexia|Nowa Phyrexia]] — pierwsza Karta Hasła:** jedna
  cywilizacja łączy już dwie karty, Carapace Forger i Illusory Demon.
  Artykuł odróżnia podbój Mirrodinu od późniejszej inwazji Multiwersum,
  opisuje spór praetorów i klęskę imperium. Odsyłacze z obu kart oraz
  Mirrodinu, Alary i Tarkiru; „W kolekcji” liczy się automatycznie.
- Nadal **7 kart i 7 planów**, teraz **1 hasło**. Nie powstały nowe
  mapy ani pinezki; istniejące dostawy i źródłowy raster T1 bez zmian.

## 2026-09-07 22:17 — PR-22: audyt i naprawy map oraz danych kart

Audyt poprzedniego PR objął 61 plików. Wykonane poprawki:

- **[[tarkir|Tarkir]]:** KTK, FRF i linia smoczych lordów są rozdzielone;
  Karakyk nie jest Ayagor, a First Tree należy do Arashin. T4 nie
  przenosi już późniejszych lokacji jako kanonu epoki khanów.
- **Przełącznik T1/T4** zachowuje skalę również na obu granicach zoomu.
  Pinezka [[509ktk-highland-game|Highland Game]] jest klikalna na małym
  ekranie; szczegółowe podpisy map pojawiają się dopiero po przybliżeniu.
- **Lżejszy HTML mapy Tarkiru:** usunięta nieużywana druga kopia SVG —
  około 47% mniej niż po wcześniejszych naprawach tej sesji.
- **Pięć snapshotów Scryfalla** odzyskało pełne odpowiedzi API. Reguły
  kart nie zostały zmienione; nowa brama wykrywa obcięte struktury.
- **130 testów**, kontrola map i przeglądarki; bez nowych kart,
  zmian dostaw, źródłowego rastra T1 ani współrzędnych pinezki 509KTK.

To punkt kontrolny po odnowieniu połączenia GitHub i wypchnięciu
napraw. Pogłębianie lore i link-mining w Pętli Jakości pozostają
**do wykonania**; PR #22 nie został scalony.

## 2026-09-07 18:45 — PR-21: Tarkir dostaje dwie mapy epok — raster Dragonstorm (T1) i rekonstrukcja Khans (T4) pod jednym przełącznikiem

Właściciel obejrzał rekonstrukcję T4 obok ręcznie rysowanej mapy fanowskiej
Lore Café i zdecydował: **raster wchodzi do Codexu jako podkład T1**, a
T4 zostaje jako mapa epoki khanów. Na stronie mapy Tarkiru jest teraz
przełącznik **T1 · Dragonstorm ↔ T4 · Khans** (ADR 0035):

- **T1 · Dragonstorm** (domyślny) — pełna rozdzielczość rastra
  (4307×3293), nazwy epoki po Stormnexus: Dragon's Eye, Summer Landing,
  Dalkovan Cities, Qatros Karst, Mistrise, Kishla… Codex **nie dokłada tu
  żadnych własnych etykiet** — raster ma swoje, a widoczne są wyłącznie
  pinezki kart.
- **T4 · Khans** — rekonstrukcja mapforge z etykietami epoki khanów
  (Sage-Eye Stronghold, Ayagor, Tomb of the Spirit Dragon, Wingthrone);
  pozycje 26 obiektów **domierzone na pełnym rasterze**, więc twierdza
  w T4 stoi dokładnie tam, gdzie jej pierścień na rastrze.
- **Jeden zestaw współrzędnych.** Złoty standard = raster T1; T4 dostaje
  te same pinezki przez kalibrację (proporcje obu podkładów są różne —
  1.31 vs 1.43 — a mimo to pinezka 509KTK *Highland Game* po przełączeniu
  nie drgnie o piksel). Kolejne karty Tarkiru — z KTK, DTK czy TDM —
  pinują raz, a epokę wybiera się przyciskiem.
- Przełącznik zachowuje widok: punkt pod środkiem okna i przybliżenie
  zostają, zmienia się tylko podkład. Deep-link `?epoka=t4` otwiera od
  razu mapę khanów.

Przy okazji: atrybucja strony mapy wymienia teraz **każdy podkład
osobno** (Lore Café / MTG Wiki Italia, grafika 3d4, All Rights Reserved —
użytek prywatny; rekonstrukcja — praca własna), a karta 509KTK w sekcji
„Na Mapie” tłumaczy, czemu jej pinezka leży w tym samym miejscu na obu
mapach epok.

## 2026-09-07 14:05 — PR-21: mapa Tarkiru po recenzji właściciela (cztery uwagi → cztery reguły silnika)

Właściciel obejrzał pierwszą wersję mapy Tarkiru („jak na pierwszą wersję
nieźle”) i wskazał cztery wady. Każda została naprawiona **w generatorze
i w silniku mapforge**, nie ręcznie w SVG, i zapisana jako reguła
(ADR 0034), żeby nie wróciła na kolejnej mapie:

- **Ramka nachodziła na treść** — Tarkir to pierwsza mapa *full-bleed*
  (kontynent na całym arkuszu). Nowy tryb ramki **passe-partout**: pas
  papieru poza oknem zasłania treść pod linią, jak w atlasie.
- **The Scour wyglądał jak „pogięta rura”** — bo był narysowany miejskim
  klockiem `szczelina` (wąwozy Ravniki). Nowy klocek **`rozpadlina`**:
  dwie poszarpane kreski klifów zbiegające się na końcach, szraf dna,
  osuwiska — kanion w języku kreski grzbietów, bez wypełnienia; nie
  wchodzi już na góry.
- **Lądolód zasłaniał pasmo Qal Sisma** — czapa Melting Wilds przeniesiona
  w niecke między grzbietami, a silnik od teraz **nie stawia glifów gór
  pod lodem** (pasma omijają poligony `lod` jak morze).
- **Rzeki znikąd donikąd** — decyzja właściciela: *„NIE MA RZEK, KTÓRE
  KOŃCZĄ SIĘ W POLU”*. Tarkir ma teraz pełną sieć: górna Marang z roztopów
  Tiansun → Dirgur Lake → odpływ stepem (zbiera Sandsteppe River na
  bagnach Screamreach) → przełęcz z Marang River Fortress → Molderfang
  Falls → Bloomvine (przyjmuje Niraj) → delta Gudul i Morze Południowe.
  Nowy walidator **`sprawdzHydrologie`** (w `sprawdzWiazania`) pilnuje,
  by każda rzeka i dopływ uchodziły do morza, jeziora albo innej rzeki,
  a odpływy zaczynały się w tafli. Ten sam walidator od razu wyłapał
  tę wadę na **Zendikarze** (bezimienna rzeka Bala Ged — teraz wpada do
  Umung) i w scenie demo (Srebrna — teraz do morza).

Weryfikacja: rastery całości i czterech wycinków (północ, Scour,
Dirgur–Screamreach, delta), `map-audit` 0 dla wszystkich map, wiązania 0,
`npm test` 113/113 (+4 testy nowych reguł). Dokumenty: ADR 0034, LESSONS
L12 („walidator pilnuje tylko tego, co zna”), SKILL_MAPA_PLANU pułapka #6
+ checklista, README mapforge (zasady 5–6, klocek `rozpadlina`, ramka
passe-partout). Nadal otwarte: potwierdzenie epoki etykiet (nazwy khanów).

## 2026-09-07 02:50 — PR-21 (pakiet 3): 509KTK Highland Game + nowy plan Tarkir z mapą T4

Dostawa właściciela: **509KTK · Highland Game · KTK · Tarkir** wraz
z Fabułą — pierwsza karta siódmego planu i pierwsza mapa narysowana
na geometrii mapy fanowskiej wskazanej przez właściciela:

- **Research mapy T2→T3→T4:** Tarkir nie ma oficjalnej mapy — oba
  Planeswalker's Guide (*Khans of Tarkir* 2014, *Tarkir: Dragonstorm*
  2025) to same opisy, MTG Wiki nie ma kategorii map planu. Raport
  przed rysowaniem; właściciel wybrał **T4** i dostarczył fanowską mapę
  **Lore Café / MTG Wiki Italia (3d4, 2025)** — użytą jako źródło
  pomocnicze geometrii, nie kanonu. Werdykt w `maps/tarkir/zrodlo-research.md`.
- **Mapa Tarkiru (mapforge, styl atlas), epoka khanów:** kontynent bez
  oceanu z południowym morzem śródlądowym i deltą Gudul; pięć terytoriów
  jako tinty z kreskowanymi szwami — Sandsteppe (Mardu) w środku, Qal
  Sisma (Temur) na północy, Tiansun (Jeskai) na wschodzie, Shifting
  Wastes (Abzan) na zachodzie, Gudul (Sultai) na południu; Salt Road,
  The Scour, Marang i Niraj, jeziora Dirgur i Glintglaze; 26 POI
  w nazwach epoki khanów (Karakyk Valley, Wingthrone, Sage-Eye, Arashin,
  Kheru Temple…), 52 kotwice z proweniencją. Jedna relacja poprawiona
  wobec rastra: Temur nie graniczy z Abzanem (kanon TDM). Osady
  późniejszych epok wymienione w `map.json` jako `poza_epoka`.
- **Nowe klocki mapforge:** biom **`pustynia`** (sierpowate wydmy —
  Shifting Wastes) i POI **`szczyt`** (pojedynczy święty szczyt — Eternal
  Ice); opcja dzielnic bez arterii (terytoria klanów). Testy silnika.
  `map-audit` 0 problemów; podkład obejrzany jako raster (całość
  + wycinki N, NE, SE, W).
- **Strona planu `tarkir`:** setting (smoki z burz, Ugin, pięć aspektów
  smoka), geografia pięciu terytoriów, ludy, trzy epoki na jednej
  topografii, opis mapy, źródła.
- **Karta 509KTK Highland Game (LORE-first):** zimowe łowy Temur w Qal
  Sisma, Chianul Who Whispers Twice, inicjacja Arel („weaving”), poroże
  jako narzędzie szeptu, Hunt Caller; pinezka o pewności „region”
  w łowiskach między Karakyk Valley a Staircase of Bones. Nowe tagi:
  szamanizm, łowy, klany Tarkiru.
- Testy 109 (plan/mapa/karta Tarkiru, licznik 7 kart, home).

## 2026-09-06 23:20 — PR-21 (pakiet 2): 488SOM Carapace Forger + nowy plan Mirrodin z mapą T4

Dostawa właściciela: **488SOM · Carapace Forger · SOM · Mirrodin** wraz
z Fabułą — pierwsza karta szóstego planu i pierwsza mapa narysowana
w całości z kanonu tekstowego:

- **Research mapy T2→T3→T4:** oficjalna mapa Mirrodinu nigdy nie
  powstała (MTG Wiki), w sieci brak wektora i rastra kartograficznego;
  raport przed rysowaniem, decyzja właściciela: T4 od razu z kanonu,
  ewentualny raster fanowski później — tylko jako źródło pomocnicze.
  Werdykt i cytaty w `maps/mirrodin/zrodlo-research.md`.
- **Mapa Mirrodinu (mapforge, styl atlas):** jedna tarcza = widoczna
  półkula metalowej sfery, poza nią papier arkusza (plan bez oceanu;
  jedynym akwenem morze rtęci). Glimmervoid w środku z czterema wieżami
  ur-golemów; pięć regionów w wycinkach po 72° w kolejności cyklu
  fastlandów *Scars of Mirrodin* (Razor Fields → Quicksilver Sea →
  Mephidross → Oxidda Chain → Tangle); Copperline Gorge jako wąski pas
  płyt między lasem a górami, Rey-Goor jako bagno na styku Drossu
  i Tangle; lacuny jako pierścienie w płycie; pięć słońc jako adnotacje
  nad swoimi regionami. 28 POI, 38 kotwic z proweniencją relacyjną,
  kompas i skala wyłączone (sfera bez biegunów). Jedna mapa dla całej
  ery powierzchni planu — od Argentum po wojnę o New Phyrexię (osobna
  mapa dziewięciu sfer dopiero przy karcie, która jej wymaga). Podkład
  obejrzany jako raster (całość + wycinki), `map-audit` 0 problemów.
- **Po recenzji właściciela:** lacuny dostały własny znak w mapforge
  (`lacuna` — kolisty szyb do jądra planu; wcześniej pożyczony hedron
  z Zendikaru), rozsunięte etykiety Rey-Goor / (Black Bayou), dopisek
  epoki na arkuszu poprawiony.
- **Strona planu `mirrodin`:** setting, geografia pięciu regionów, ludy,
  epoki przed i po kompleacji, opis mapy.
- **Karta 488SOM (LORE-first):** Kronika łuczników Tangle, którzy
  odkładają łuki i kują sobie skorupy; odczyt flavoru fraza po frazie
  („Bows and whips cannot save us…”), Metalcraft jako trzy artefakty
  zasilające pancerz; pinezka **region** w sercu Tangle między Viridią
  a Tel-Jilad. Nowe tagi: `elfy`, `phyrexia`, `rzemioslo`.
- **Kontrola:** `npm test` 107/107 (asercje planu, mapy i karty
  Mirrodinu; lista kart 6), build 12 stron, generator sceny
  `tools/mapforge/mirrodin-scena-t4.py` deterministyczny.

## 2026-09-06 17:30 — PR-21: audyt PR-20 z pierwszą recenzją wizualną map + pogłębienie Alary

Sesja domyślna (audyt poprzedniego scalonego PR + Pętla Jakości), po raz
pierwszy z oglądem obrazów przez agenta:

- **Audyt PR-20** (`docs/audits/AUDYT_2026-09-06-PR20.md`): naprawy A1–A4
  poprawne (strona Alary 1:1 ze sceną v2), L9 zastosowana; **recenzja
  wizualna** podkładów Alary, Zendikaru, Midgaru i Ravniki (raster poza
  repo) — Alara v2 dobra co do topologii, ale trzy tytuły regionów leżały
  na obiektach.
- **Mapa Alary v3 (typografia):** tytuły **Jund**, **Grixis** i **Naya**
  przesunięte na wolny ląd — dotąd „Jund” zakrywał fort Hellkite's Pass
  i grzbiet, „Grixis” szlak i pasmo Kości, „Naya” wschodnie pasmo i rzekę.
  Pozycje ze skanu geometrii i potwierdzone na wycinkach 4k.
- **Weryfikator map** (`tools/map-audit.py`): nowa reguła **TYTUŁ NA
  OBIEKCIE** (tytuł regionu nie może zakrywać ikony ani szczytu; las pod
  napisem jest OK) — na starej Alarze łapie dokładnie te trzy usterki,
  na pozostałych mapach 0 fałszywych alarmów; **map-audit wchodzi do
  `npm test`** (`test/map-audit.test.js`).
- **Pogłębienie LORE (krok 2):** plan **Alara** dostał sekcję **„Odłamy
  i ludy”** — po akapicie na każdy shard: kasty i sigile Bantu, etherium
  i Ethersworn Esper, vis i nekromancja Grixis, łańcuch pokarmowy Jundu,
  gargantuany, elfy Cylian i nacatl Nai (mtg.wiki, URL w Źródłach).
  Kolejka link-miningu Alary w backlogu czeka na drugą kartę planu.
- **Dokumentacja:** wpis sesji PR-20 w PROJECT_HISTORY i ROADMAP;
  ENVIRONMENT §1a (rasteryzacja i ogląd map); lekcja L10 (geometria nie
  zastępuje oka — każdą mapę T3/T4 raz obejrzeć jako raster).

## 2026-09-06 15:50 — PR-20: audyt PR-19 + strona planu Alary do stanu mapy v2

Sesja domyślna (audyt poprzedniego scalonego PR + kolejka napraw):

- **Audyt PR-19** (`docs/audits/AUDYT_2026-09-06-PR19.md`): naprawy Z1–Z5
  z audytu PR-18 wykonane poprawnie i systemowo (pętla ui-smoke pilnuje
  wszystkich kart); rewamp mapy Alary v2 zgodny z ADR 0031/0033 i kanonem
  nazw; pinezka 305ARB zweryfikowana geometrycznie w środku wiru
  Maelstromu. Integralność: 104/104, build, map-audit 0.
- **Strona planu Alary** (`content/planes/alara.md`) przestawiona na stan
  mapy v2: Esper jako **archipelag wysp na Morzu Esper** (kanoniczne
  akweny Dwindling Sea, Sea of Stars, Inkwell), Maelstrom jako
  **równoprawny region-węzeł**, pełna lista ~28 kanonicznych POI
  (wcześniej strona opisywała mapę v1: „morza wewnętrzne", Maelstrom-plamę).
- **Dokumentacja procesu domknięta**: wpis dziennika o scalonym PR-19
  (co-nowego 15:30), wpis w PROJECT_HISTORY o sesji PR-19, aktualizacja
  ROADMAP (PR-18/PR-19 scalone), lekcja L9 (opis PR aktualizowany
  kumulatywnie po każdym commicie).

## 2026-09-06 15:30 — PR-19: naprawy Z1–Z5 z audytu PR-18 + rewamp mapy Alary v2

Sesja audytowa PR-19 domknęła zaległości z audytu PR-18 i poprawiła mapę
Alary po recenzji właściciela:

- **Termin „Fabuła"** (doprecyzowanie ADR 0026): w kartach 275FIN
  i 305ARB „Fabuła dostawy (ADR …)" zastąpione przez „Fabuła właściciela";
  w sekcjach Źródła obu kart dodane wpisy kotwicy Fabuły. Usunięte
  odsyłacze do mechaniki Codexu z treści kart (275FIN, 305ARB) i stron
  planów alara/final-fantasy (feedback B).
- **Test ui-smoke systemowo pilnuje treści kart**: pętla po wszystkich
  kartach `content/cards/` z asercjami zakazu „Fabuła dostawy"/„ADR"/
  „verbatim" — luka pokrycia (dotąd tylko 1LTR/2BFZ) zamknięta.
- **Snapshoty Scryfall**: source 275FIN/305ARB ujednolicone do
  `cards/named?exact=` (ADR 0004).
- **Mapa Alary v2** (rewamp po recenzji właściciela): Esper jako
  **archipelag wysp na Morzu Esper** (akweny Dwindling Sea, Sea of
  Stars, Inkwell — kanoniczna geografia shardu), Maelstrom jako
  **równoprawny region-węzeł** z nowym pseudo-biomem `wir` w mapforge,
  fraktalne linie brzegowe, ~28 kanonicznych POI; pinezka 305ARB
  zweryfikowana w środku wiru.

## 2026-09-05 22:15 — mapa Alary od nowa: T3 z referencji fanowskich

Właściciel odrzucił radialną mapę Alary („to nie jest Midgar — to pięć
światów-kontynentów, które się połączyły”) i dostarczył prywatne
fanowskie mapy jako wzorzec (ADR 0031). Redo w silniku mapforge:
scena `maps/alara/scena.json` — pięć zrośniętych kontynentów
(Bant u góry, Naya zachód, Jund i Grixis południe, Esper z morzami
wewnętrznymi wschód) wokół Maelstromu-plamy w punkcie złączenia;
biomy (las Naya, stepy, wulkany Jund), szwy regionów nowym klockiem
`granicaRegionu`, Maelstrom jako tint na lądzie (pinezka 305ARB zostaje
na lądzie). Nazwy wyłącznie kanoniczne (MTG Wiki): +Topa, Valeron,
Akrasa, Jhess, Eos, Sun-Dappled Court, Sacellum, Sanctum Arcanum,
Sedraxis, ruiny Antali; wariant T3, 19 kotwic. Silnik mapforge dostał
systemową opcję `zrośnięte` (wewnętrzne wybrzeża kryte wypełnieniami).
Testy i audit zielone.

## 2026-09-05 21:30 — pakiet Alara: 305ARB Illusory Demon + mapa T4

Nowa karta właściciela: **305ARB Illusory Demon** (Alara Reborn) —
scena w Maelstromie, wirze many zrodzonym w Conflux. Kanon rozstrzygnął
pytanie o epoki: Maelstrom nie istniał przed Conflux, a regiony
zachowały tożsamość po scaleniu, więc Kodeks rysuje **jedną mapę
scalonej Alary (post-Conflux)** — ADR 0033: sceny z epoki shardów
pinuje się do regionów. Mapa T4 (rekonstrukcja kanoniczna, w sieci
brak wektora i rastra kartograficznego): pięć regionów w cyklu many
wokół centralnego Maelstromu, obeliski przy szwach, miejsca kanoniczne
(Valeron, Jhess, Akrasa, Sedraxis, Antali) — 16 kotwic. Karta LORE-first
(9 sekcji): flavor „a trick of the light can feast on human flesh”
i mechanika „when you cast a spell, sacrifice this creature” grają
tę samą tezę — iluzja trwa, dopóki nikt nie zaświeci. Testy i audit
zielone.

## 2026-09-05 20:51 — plany wielomapowe systemowo + bogatszy Midgar

Feedback właściciela po obejrzeniu preview: strona planu Final Fantasy
miała tylko „Otwórz mapę planu”, a okruszek z podmapy prowadził do
nieistniejącego `#/plan/final-fantasy/midgar`. Teraz: strona planu
z podmapami pokazuje przycisk per podmapa („Otwórz mapę: Midgar
(Final Fantasy VII)”), okruszki z podmapy wracają do planu, a trasa
`#/plan/<plan>/<podmapa>` jest aliasem mapy (stare linki nie dają 404).
Mapa Midgaru wzbogacona o kanoniczne POI i biomy: naprzemienne kliny
sektorów, pierścień ośmiu reaktorów mako przy krawędzi talerza,
Seventh Heaven, kościół Aerith (zielony marker — kwiaty), dom Aerith,
Loveless Avenue; łącznie 18 kotwic. Testy 104/104, map-audit 0.

## 2026-09-05 20:09 — korekta: imgId 275FIN wraca z dostawy (to numer kolekcji, nie collector Scryfall)

Feedback właściciela: `275FIN` to numer z jego kolekcji — klucz do
prywatnych ilustracji `<id>FOT.png`/`<id>KON.png` (tory FOT/KON,
ADR 0008), a odwołania do tych plików są elementem Karty Katalogowej.
Sesja błędnie „skorygowała” imgId do collector number Scryfall (5FIN);
wycofane: slug i wpisy znów `275fin-aerith-rescue-mission` /
`imgId: 275FIN`, pinezka i wikilinki zaktualizowane, w snapshotcie
`notka_numery` o dwóch niezależnych systemach numeracji. Lekcja L8:
imgId wyłącznie z dostawy właściciela, Scryfall nie koryguje numerów
kolekcji.

## 2026-09-05 19:50 — Final Fantasy w Kodeksie: plan-franczyza (ADR 0032), mapa Midgaru (T3), karta 5FIN

Dostawa właściciela: **Aerith Rescue Mission** (scena ratunku Aerith
w budynku Shinra). Decyzje właściciela: jeden plan `final-fantasy`
z mapą per część sagi — NIE kontynenty światów na jednej mapie i NIE
osobne plany per gra (ADR 0032); mapa Midgaru jako T3 z płaskiego
schematu MMTS (ReverendRyu) jako prywatnej referencji poza gitem.
Silnik dostał klucz rejestru `plan/podmapa` (strony map, router,
pinezki, ZIP, audit); Midgar narysowany w stylu atlasowym (8 sektorów,
hub z budynkiem Shinra, pierścienie MMTS, mur, pustkowie) z kotwicami
kanonicznymi; karta z 9 sekcjami i pinezką `dokladna` na budynku
Shinra. `imgId 275FIN` = numer kolekcji właściciela (tory FOT/KON),
collector number Scryfall = 5 — dwa systemy (doprecyzowane wpisem
20:09 po feedbackzie). Werdykty: 104/104 testów,
build zielony, map-audit 0, wiki-stats 100% (8/8).

## 2026-09-05 18:25 — porządki w kolejce: trzy „otwarte wątki" zamknięte i skasowane

Decyzja właściciela: wątki „globalna geometria Zendikaru (Akoum–Ondu)",
„obwódki haseł" (E5) i „rozszerzenia mapy Ravniki poza złoty standard
a/b/c" nie są zadaniami — zostały skasowane z ROADMAP-y, planu sesji,
handoffu i notek `map.json` Ravniki. W ROADMAP-ie zostaje tylko krótka
notka „nie odtwarzać", żeby przyszłe sesje nie wracały do tematu.

## 2026-09-05 17:05 — sesja jakości: naprawa kompasu Ravniki, „Fabuła" w ADR, warsztat bez kolizji

Sesja Pętli Jakości po audycie PR-17 — zmiany w bazie i narzędziach:

- **Kompas mapy Ravniki naprawiony:** litery N/E/S/W róży kierunków miały
  ukrytą wadę jeszcze z czasu wektoryzacji v3 (uszkodzony atrybut
  pozycji — przeglądarka rysowała obie litery N i S w środku róży, jedna
  na drugiej). Teraz litery stoją prawidłowo wokół róży (N nad iglicą,
  S pod nią, E/W po bokach).
- **Nowa zapora audytu map:** pliki map z „śmieciowymi" wartościami
  atrybutów (`undefined`/`NaN`/`null`) będą odtąd wykrywane automatycznie
  — to ta klasa błędu co kompas.
- **Termin „Fabuła" bez dopisku „dostawy"** (decyzja właściciela
  z 2026-09-05, widoczna już wtedy na kartach) zapisany formalnie
  w ADR 0026 — rejestr decyzji dogoniony ze stanem bazy.
- **Warsztat map bez kolizji:** na demie „Wyspa Próbna" etykieta „Rzeka
  Srebrna" zachodziła na „Step Środkowy" (odsłonił to dokładniejszy model
  kolizji z poprzedniej sesji) — napis rzeki przesunięty w dół biegu.
  Demo dostało też brakujący fort (Fort Graniczny) — był w scenie od
  września, ale przerysowania warsztatu go nie pokazywały. Wszystkie mapy
  łącznie z warsztatem audytują się teraz na zero problemów.
- **Skrypty warstw Ravniki (herby gildii, lokacje) naprawione:** przy
  ponownym uruchomieniu skrypt herbów potrafił zdublować warstwę zamiast
  ją wymienić; teraz oba skrypty są bajtowo powtarzalne.
- Drobna korekta numeracji ADR w dwóch opisach (drzewo HTML map to
  ADR 0027).

## 2026-09-05 09:30 — codex: pakiet offline (ZIP), ilustracje FOT/KON z dysku, termin „Fabuła"

- **Fabuła, bez dopiska „dostawy"** (decyzja właściciela 2026-09-05):
  w widocznej treści kart usunięto „Fabuła dostawy" — brzmiało jak
  „palety w sklepie na zapleczu". Zostało samo „Fabuła" (np. „Fabuła
  właściciela dopowiada…"). Dotyczy 3 kart (137GPT, 1LTR, 2BFZ);
  zaktualizowano test UI-smoke. Mechaniczny format dostawy i archiwum
  pozostają bez zmian.
- **ZIP bez duplikatu HTML:** po przejściu na mapy w `<iframe>`
  (ADR 0027) artefakt otwiera się zawsze jako `index.html` — w
  archiwum pobieranym ze stopki nie pakujemy już drugiej, identycznej
  kopii `mtg-lore-codex.html` (były dwa pliki tej samej wielkości).
  Plik `mtg-lore-codex.html` na Pages zostaje (stabilny adres linku).
- **Ilustracje FOT/KON z lokalnego `img/` (ADR 0008/0017):** wypakowany
  z ZIP kodeks czyta panoramy/bestiariusze z katalogu `img/` obok
  `index.html` (np. `c:\mtg\index.html` + `c:\mtg\img\1FOT.png`).
  Sonda obrazów próbowała tylko `./img/<pełny imgId>FOT.png`
  (np. `1LTRFOT.png`), a pliki właściciela nazywają się numerem
  materializacji (`1FOT.png`, `2KON.png`) — sloty cicho znikały.
  Teraz sonda idzie po liście kandydatów: najpierw krótki wariant
  (sam leading numer), potem pełny imgId. Pliki FOT/KON NIE trafiają do
  ZIP ani do gita (prywatny zasób); na Pages sonda dalej cicho pada.

## 2026-09-03 22:10 — Ravnica: herby gildii i lokacje na PRAWDZIWEJ mapie (T2+/v3) + naprawa podkładu

**Korekta ważna:** poprawny podkład Ravnicy to wektoryzacja fanowska
**v3 (wariant T2+, 6849×5292, ADR 0031)** — nie rekonstrukcja mapforge
T4 (1600×1100). Eksperyment T4 był odrzucony; w trakcie PR-17 omyłkowo
nadpisał podkład v3 (przywrócono w commicie FIX). Poniższe dodatki
trafiają już na właściwy v3.

- **Herby 10 gildii** — wypełnione barwne tarcze siedzib z białym
  glifem (wektoryzacja odzyskała kolorowe celowniki, ale utraciła
  glify): Gruul (Skarrg), Boros (Sunhome), Selesnya (Vitu-Ghazi),
  Izzet (Nivix), Simic (Zonot Seven/Zameck), Azorius (New Prahv),
  Orzhov (Orzhova), Rakdos (Rix Maadi), Golgari (Korozda & Svogthos),
  Dimir (Nightveil & Duskmantle). Millennial Platform neutralny — bez.
- **Lokacje kanoniczne** (świadome uchylenie wcześniejszych decyzji z
  map.json, za zgodą właściciela): Beacon Tower (mały niebieski marker
  w P2), Gnat Alley (kropkowana trasa + szara etykieta w P6),
  Guildmages' Forum / Guildpact Square / Pillar of the Paruns (małe
  czarne etykiety w gildyjnym rdzeniu P1).
- Odtwarzalne, idempotentne warstwy SVG: `tools/mapforge/ravnica-v3-herby.py`
  i `tools/mapforge/ravnica-v3-lokacje.py` (raster źródła pozostaje poza
  gitem — ADR 0031).
- Zaktualizowana dokumentacja: `map.json` (kotwice + zmiany decyzji),
  `mapa-analiza.md` (notka korygująca T4 → T2+/v3).

## 2026-09-03 19:45 — Mapa Ravnicy v4: domknięcie do złotego standardu (pierwsza sesja z wizją)

Mapa Dziesiątego Dystryktu (`maps/ravnica/podklad.svg`, T2+) domknięta
wzrokowo do prywatnej fan-made mapy źródłowej właściciela (warstwy
a/b/c, ADR 0031) — **pierwsza sesja z oglądem obrazów (vision)**, więc
poprawki szły z bezpośrednim porównaniem render↔źródło, nie tylko
programistycznie:

- **Granice dzielnic wróciły:** ciągła sieć przerywanych linii dzieli
  całość na 6 Precinctów (wcześniej tylko fragmenty) — usterka (1).
- **Etykiety POI czarne i pod markerami**, nazwy ulic/placów bez kółek
  (są geograficzne, nie punktami), markerów tylko tam, gdzie w źródle
  kolorowe okręgi — usterki (2)–(4), (6); ~15 fałszywych markerów
  usuniętych, brakujące dodane, kolory gildii poprawione.
- **Millennial Platform:** długa, jasnoszara przerywana linia-kotwica
  od lewitującej skały do lądu (wcześniej urwana) — usterka (5).
- **Centrum:** marker Vizkopy zdjąty z tekstu ORZHOVA; granica P6/P1
  nie tnie już KAMEN FORTRESS; SMELTING QUARTER pod granicą.
- **Narzędzie `map-audit`:** test kolizji etykiet AABB → **OBB/SAT**
  (mniej fałszywych alarmów dla ukośnych etykiet dróg).

`map-audit ravnica` = 0 problemów; testy 102/102; build zielony.

## 2026-09-03 11:29 — Ravnica: pogłębiona, zweryfikowana i gotowa na wektoryzację v3

Sesja jakościowa nad Rawnicą (PR-14). Po audycie scalonego PR-13
(spójny z ADR-ami; znalazło się 5 drobnych pozycji — wszystkie
obsłużone):

- **Plan Ravnica** dostaje rozpisane „Ludy”: pochodzenie megalizny
  (miasta zrosły się w jeden organizm), roster ras ery Paktu
  (Erstwhile w Umerilek, Vedalken, Loxodon, Viashino) i warstwa
  martwych (Rada Obzedat, „Niesmiertelni”, dzielnica Agyrem jako
  późniejsze wyjaśnienie anomalii planu) + dwa nowe cytowania.
- **Link-mining**: encje Rawnicy (Boros, Legion Boros, Dziesiąty
  Dystrykt, Sunhome, Tin Street, Pakt Gildii) lądują w kolejce
  link-miningu — hasła powstaną przy drugiej karcie planu (próg
  liczy się od kart); plan dostaje item „Karty kolekcji” z linkiem
  do *Withstand*. Baza po raz pierwszy 100% kompletności (6/6 stron).
- **Pass mapowy**: trzy pozycje otwarte mapy zweryfikowane kanonem —
  Guildpact Square ze Słupem Parunów (obelisk z dziewięciu pieczęciami,
  przy Chamber of the Guildpact — rozbieżność wiki opisana), Beacon
  Tower (P2, Azorius, epoka bloku niepotwierdzona) i Gnat Alley
  (najdłuższa ulica planu, trasa infiltracji Gruul — kanon bez
  współrzędnych).
- **Mapa v3 — prawie gotowa**: właściciel dostarczył fan-made mapę
  Dziesiątego Dystryktu w trzech warstwach (granice / + teren / + POI
  i labelki) plus link Drive. Rastery nie dotarły jednak do sandboxa
  (załącznik niewidoczny dla narzędzi, sieć zablokowana) — procedura
  wektoryzacji jest opisana krok po kroku i czeka na pliki.
- Drobiazgi: dwie literówki w dzienniku (wariantie, Blistercoils)
  i usunięty bezkanoniczny fragment z „Setting w pigułce”.

## 2026-09-03 09:36 — Karty Katalogowe przechodzą na LORE-first; Ravnica dostaje kierunek wektoryzacji fan-made

Po feedbacku właściciela zmienia się standard kart: główna treść nie zaczyna
się już od kosztu, typu, wydania ani historii publikacji. Nowy ADR 0030
ustawia **Kronikę Lore** jako otwarcie, a dane techniczne zostawia w
infoboksie i w krótkiej sekcji **Mechanika jako Opowieść** pod koniec.
Wszystkie trzy obecne karty — **Dunland Crebain**, **Coralhelm Guide** i
**Withstand** — zostały przepisane w tym duchu: więcej świata i sceny,
mniej metryki MtG. Dodatkowo ADR 0031 zapisuje, że prywatne fan-made mapy
dostarczone przez właściciela mogą być źródłem wektoryzacji; dla Ravniki
powstał kandydat v3 oparty o `TenthDistrict.png` (raster roboczy poza
repo, wynik docelowo jako SVG/scena z proweniencją i QA).

## 2026-09-03 00:43 — Ravnica v2: geometria skalibrowana 1:1 pod oficjalną mapę GGR (transkrypcja właściciela)

Właściciel spisał oficjalną mapę Dziesiątego Dystryktu z *Guildmasters'
Guide to Ravnica* w układ współrzędnych — i Codex przebudował scenę
atlaskową na tych koordynatach (kanoniczna transformacja 64 px/j.,
serce na placu Dziesiątki). Nivix przesunął się na zachód, Zonot Seven
w dół, Millennial Platform nad Skarrg; doszły **Statue of Agrus Kos,
Vizkopa Bank, Whitestone, place Plaza East/West/South, Great Concourse,
Gore House i Medori Park**, a pod południową poświatą stanęły markery
podziemi: **Rix Maadi, Korozda & Svogthos, Nightveil & Duskmantle**.
55 kotwic map.json, pinezka Withstanda przy Tin Street Market;
strona planu dopowiada Undercity. Pozycyjnie: 1:1 z kanonem GGR;
rysunkowo: własne dłuto mapforge (raster WotC nadal licencyjnie
nieosadzalny — baza to tekstowa transkrypcja).

## 2026-09-03 00:12 — Dostawa 137GPT Withstand: Ravnica wchodzi do Atlasu jako pierwszy plan-miasto (mapa T4)

Trzecia karta Kolekcji: **Withstand** (Guildpact, 2006) — biała tarcza
pierwotna z głosem Alovneka, maga gildii Boros — w pełnym szkielecie
dziewięciu sekcji, z pinezką na bruku przy Tin Street w Precykcie
Czwartym, pod samym Sunhome. Razem z nią Codex dostaje **plan Ravnica**
i pierwszą w Atlasie mapę miasta: Dziesiąty Dystrykt narysowany
własną ręką silnika mapforge w wariancie T4 — sześć precyktów ułożonych
według kanonicznych sąsiedztw z *Guildmasters' Guide to Ravnica*, mur
północny z blankami, za którym czają się Skarrg i Czerwone Pustkowia,
szczelina Deadbridge z mostem Benzera, Zonot Siedem z Blistercoils,
Transguild Promenade z rubblebeltem i tłem duchów miasta, które „trwa
dalej poza ramką". Oficjalnych rastrów map celowo nie osadzamy
(licencja WotC); geometria to rekonstrukcja — jeśli oficjalna mapa GGR
zostanie kiedyś przepisana na tekst (pomoc właściciela), v2 skalibruje
kształty 1:1. Szczegóły: `maps/ravnica/mapa-analiza.md`.

## 2026-09-02 23:08 — Pętla Jakości: audyt PR-12, geografia Bala Ged i Sejiri, Umungshore na mapie

- **Audyt scalonego PR #12** zapisany w
  `docs/audits/AUDYT_2026-09-02-PR12.md`; jedno znalezisko (P3 —
  przeterminowany status „PR #12 jest otwarty" w najnowszym handoffie)
  naprawione od razu.
- **LORE Zendikaru (strona planu):** sekcja „Geografia" domyka dwie
  ostatnie białe plamy kontynentów — nowe akapity o **Bala Ged**
  (dżungla Guum Wilds, topiel Bojuka Bay i słynna trasa Bojuka Route,
  stopnie rzeki Umung, Tangled Vales, imperium Makindi, zagłada rojem
  Ulamoga i Khalni Heart) oraz **Sejiri** (polarny płaskowyż w klifach,
  Midnight Pass, osada Ikiral w pękniętym hedronie, Chill Depths,
  mityczne Benthidrix i los ostatniego Skyclave).
- **4 nowe źródła** w Źródłach planu Zendikar (MTG Wiki „Bala Ged"
  i „Sejiri", Planeswalker's Guide: Bala Ged and Elves, Archive Trap I).
- **Link-mining:** bez nowych haseł — próg ≥2 kart wspominających encję
  nadal nieosiągnięty (2 karty na dwóch rozłącznych planach; liczniki
  w `docs/backlog.md` bez zmian).
- **Pass mapowy (Zendikar, T4):** nowy obiekt **Umungshore** —
  kanoniczna wioska nad Bojuka Bay przy trasie Umung (MTG Wiki „Bala
  Ged"); scena + podkład + rejestr map.json (`kotwice`/`elementy`),
  walidator wiązań 0 uwag, `tools/map-audit.py` 0 problemów, QA
  rastrowe cropu regionu.
- **Warsztat mapowy:** `SKILL_MAPA_PLANU.md` dostał zweryfikowany tor
  QA rastrowego przez `sharp` (prebuilt npm; odpowiedź na brak
  libcairo/rsvg w sandboxie).
- Weryfikacja: `npm test` **102/102**, `npm run build` OK,
  `tools/map-audit.py` zendikar/srodziemie — **0 problemów**.

## 2026-09-02 22:22 — Audyt PR-11: domknięcie dryfu dokumentacji i rejestru map

- **Audyt scalonego PR #11** zapisany w `docs/audits/AUDYT_2026-09-02-PR11.md`.
- **Zendikar / `maps/zendikar/map.json`** dosynchronizowany z aktualną
  mapą i ADR 0013: notka źródłowa nie mówi już o przerywanej Murasie;
  w rejestrze elementów poprawione typy/proweniencja **Hagra Cistern**,
  **Beyeen**, **Serpent's Maw** i **Valakut** (usunięte błędne,
  historyczne przypisanie Valakuta do Akoum).
- **Żywe dokumenty** zsynchronizowane z architekturą ADR 0027 v2:
  `docs/ARCHITECTURE.md`, `docs/guides/PROCES_MAP.md`, `maps/README.md`,
  `docs/ROADMAP.md` oraz najnowszy handoff PR-11.
- **Rejestr ADR** dostał dodatkową straż: test sprawdza teraz, czy status
  w `docs/decisions/README.md` zgadza się ze statusem w samym pliku ADR.
  Przy okazji ujawnił i naprawił realny dryf: ADR **0008** miał w pliku
  status „Zaakceptowana", choć po ADR 0017 jest tylko **częściowo
  zastąpiona**.
- Weryfikacja: `npm test` **102/102**, `npm run build` OK,
  `tools/map-audit.py` — 0 problemów.

## 2026-09-02 22:08 — Recenzja aplikacji: ZIP na Pages naprawiony, dziennik z godzinami + archiwum, stopki czasu stron (ADR 0029)

- **„Pobierz archiwum (ZIP)" na Pages działa** (po merge): pages.yml buduje
  przez `--out`, a ten tryb CLI pomijał ZIP — teraz CLI zawsze buduje pełny
  pakiet; test kontraktu odtwarza dokładnie wywołanie z workflow.
- **Dziennik „Co nowego" wg ADR 0029:** każdy wpis ma datę i **godzinę
  publikacji** (nagłówek `## RRRR-MM-DD HH:MM — tytuł`; historia
  backfillowana z gita), strona główna pokazuje zwięzłą listę 5 najnowszych,
  `#/co-nowego` — 5 pełnych wpisów + **archiwum podzielone miesiącami**
  (`#/co-nowego/<RRRR-MM>`).
- **Stopki czasu:** karty, hasła i strony map kończą się datą+godziną
  utworzenia i ostatniej aktualizacji (z historii gita; na Pages wymaga
  `fetch-depth: 0` w checkout — zmiana po stronie właściciela).
- Mapa: etykieta **Pelakka Karst** dosunięta do łuku krasu.

## 2026-09-02 20:46 — Pętla Jakości (PR-11): geografia Zendikaru domknięta kanonem (cała kolejka E-geo + klocek fortu)

- **Druga część sesji — kolejka E-geo-1/2/3/4 i E5 wyczerpana:**
  - **E-geo-4 (Akoum):** **Tal Terig** („Puzzle Tower") przeniesiony
    nad kotlinę Akoum przed resztki Teeth of Akoum i przetypowany na
    ruinę (kanon Guide: Akoum > w2); nowa osada **League of Anowon** —
    obóz-szkoła magów-eksploratorów wampira Anowona wysoko w Teeth of
    Akoum; trakt z Affy poprowadzony do nowej pozycji wieży.
  - **E-geo-1 (archipelag Ondu) — kanonem, w2 odrzucona:** maleńka
    **Jwar** z Jwar Isle Refuge przeniesiona pod PŁD. wybrzeże Ondu
    (Guide: Ondu), wokół niej nowe wody **Serpent's Maw**; **Beyeen**
    scalona z wysepką-satelitą w jedną podłużną wyspę — kanon stawia
    **Mount Valakut** (szczyt Crown of Talib) w JEJ sercu, notka
    „Valakut w sercu Akoum" z 2026-09-01 była błędna i została
    naprawiona; Agadeem była zgodna z kanonem.
  - **E-geo-2 (rotacja układu) — rozstrzygnięta kanonem, bez rotacji:**
    „Ondu is located in the southwestern quadrant of Zendikar"
    (MTG Wiki: Ondu) — nasz układ jest kanoniczny, w2 nie; rozbieżność
    „małego morza" Akoum–Ondu odnotowana jako wątek otwarty.
  - **E-geo-3 (detal Murasy):** wpis kolejki był nieaktualny — etykiety
    weszły już w PR-10; zweryfikowane.
  - **E5 (ADR 0028):** nowy klocek **fort** (mury z donżonem i bramą,
    sylwetka w kole) — użyty na **Fort Keff** i „stone havens" Akoum
    (**Grip Haven**, **Slab Haven**, **Ghostwatch**; przy okazji
    rozgęszczone — zbite ikony zamalowywały się halo etykiet);
    latarnia/wrak odrzucone (brak kanonicznego użycia), scena demo
    z fortem.
  - **LORE Zendikaru:** akapity o archipelagu Ondu (Jwar/Serpent's Maw,
    Beyeen/Crown of Talib/Valakut, Agadeem) i Akoum (Tal Terig, League
    of Anowon, stone havens) + 4 nowe źródła.
  - **Recenzja właściciela (preview):** Windblast Gorge dostał ściany
    kanionu (dwa pasma wzdłuż rzeki do Glasspool — kanon: „Drake
    Ravine", przejście w góry wyżłobione przez Zhulodoka); nowy szlak
    z traktu Goma Fada–Affa do stone havens (Grip → Slab → Ghostwatch);
    League of Anowon celowo bez drogi — wg kanonu do obozu dociera się
    tylko gryfem z Affy.
- **Pass mapowy (kolejka E-geo-5/6/7/9 domknięta):**
  - **Pelakka Karst** — wapienny kras otaczający Hagra Cistern
    (Guide: Guul Draz) nazwany na mapie;
  - **Silundi Sea** — morze, w które wcina się Ondu (Guide: Ondu),
    etykieta na wodach między Ondu a Agadeem;
  - **Tikal Harborage** — osada merfolków Thady Adel w górze kanału
    od Sea Gate; kanon lokuje ją na TAZEEM, nie na Ondu jak fanmapa
    (kanon > w2);
  - **Sunspring** i **Calcite Flats** — oaza sprzed epoki Eldrazi
    w kalcytowych ławicach pod Bulwarkiem + pas ławic na południowym
    wybrzeżu Tazeem;
  - **Hadatown → North Hada** — kanoniczna nazwa i pozycja (północne
    wyżyny przy źródle Umary) zamiast pozycji fanowskiej; nowy trakt
    North Hada–Coralhelm;
  - zachodnia zatoka Bala Ged/Guul Draz zostaje **bez nazwy** — kanon
    jej nie nazywa, a nazw nie zmyślamy.
- **LORE strony planu Zendikar:** akapity o nowych miejscach Tazeem
  (Tikal Harborage, Calcite Flats, Sunspring, North Hada), krasie
  Pelakka i morzu Silundi — z cytowaniami (4 nowe źródła).
- **Audyt PR-10** (`docs/audits/AUDYT_2026-09-02-PR10.md`): determinizm
  renderu potwierdzony bit w bit, treść i kod zgodne z ADR 0021–0027;
  3 drobne znaleziska naprawione (kotwica rejestru Tangled Vales
  wskazywała morze; zdublowany nagłówek w ADR 0027; zdanie gidu
  o oznaczaniu Fabuły w Źródłach ujednolicone z praktyką).
- Link-mining: nadal poniżej progu ≥2 kart dla wspólnych encji
  (2 karty w bazie, plany rozłączne) — bez nowych haseł.

## 2026-09-02 18:42 — szlify UI: „Narracja" na kartach, mapy bez paska, czysty dziennik

- Na kartach słowo **„Narracja"** zastępuje „Fabułę dostawy"
  (terminologia widoczna dla czytelnika; format dostawy bez zmian).
- Mapy: pasek „− + ⟲" usunięty — zoom kółkiem/pinch, **Esc = reset
  widoku**.
- Dziennik „Co nowego" bez komentarza technicznego na górze (renderer
  markdown pokazywał go jako tekst na stronie głównej i karcie
  Co nowego).

## 2026-09-02 18:42 — dopieszczenie iframe (feedback): czyste okno mapy, sekcje w bazie, warstwa nad całością

- **Iframe dobrany proporcjami do mapy** (aspect-ratio z wymiarów
  podkładu), strona w środku = czyste okno mapy bez scrollbarów
  (pasek zoomu pływa nad mapą).
- **Legenda, lista pinezek, atrybucja i warstwa karty** renderują się
  w artefakcie bazowym (nie w iframe); **warstwa karty otwiera się nad
  CAŁYM Codexem** (pinezka → postMessage `codexKarta` → dialog
  w rodzicu). Testy 91/91.

## 2026-09-02 18:42 — architektura ostateczna: DRZEWO HTML map (pomysł właściciela, ADR 0027 v2)

Jednoplik offline nie skaluje się (30+ planów ≈ 200 MB). Rozwiązanie
właściciela: **każdy plan = osobna, samowystarczalna strona
`maps/<plan>.html`**, osadzana w artefakcie przez `<iframe>` —
file:// nie blokuje iframe'ów, więc **wersja offline z dysku działa
w pełni** (wektorowe mapy, nakładka, warstwa karty), a rozmiar rośnie
liniowo per plik. Artefakt główny: stałe ~222 kB. „Pobierz ZIP
Codexu" = całe drzewo (index.html + maps/**). Nawigacja z mapy do
kart/haseł wraca do rodzica przez postMessage. Tryb `--inline`
usunięty. Testy 91/91 (strony map wykonywane w shimie wprost).

## 2026-09-02 18:42 — pakiet dwutorowy: pełny jednoplik OFFLINE wraca (uzupełnienie ADR 0027)

Po pytaniu właściciela o wersję offline z dysku: `npm run build` daje
teraz DWA artefakty — `index.html` + `maps/**` (split: serwer/Pages,
220 kB) oraz `mtg-lore-codex.html` (pełny jednoplik inline, ~7 MB) —
**wersja offline otwierana z pliku w Chrome działa w 100%, bez żadnej
degradacji**. ZIP zawiera jednoplik. Test pakietu w artefakt.test.

## 2026-09-02 18:42 — REWOLUCJA artefaktu: mapy jako osobne pliki (ADR 0027) + porządek na „Co nowego"

- **Rozdzielenie artefaktu** (decyzja właściciela — wątek otwarty
  z ROADMAP rozstrzygnięty): HTML niesie kod+treść (**219 kB zamiast
  ~7 MB**), podkłady map leżą w `dist/maps/<plan>/` i są dociągane
  dopiero przy wejściu na mapę (fetch → wektorowy SVG z pełną
  nakładką; na file:// degradacja do <img>). ZIP pakuje całość
  (samowystarczalny); Pages publikuje cały dist/ bez zmian
  w workflow. Tryb awaryjny `--inline` zostaje (testy, mały eksport).
  Statusy ADR 0001/0009 zaktualizowane; +1 test kontraktu splitu.
- **„Co nowego" bez dubli:** nagłówek i lead strony daje renderer —
  usunięte powtórzone H1/opis z pliku treści (dublowały się na
  stronie głównej i na karcie Co nowego).

## 2026-09-02 18:42 — Fabuły dla 1LTR i 2BFZ: karty zaktualizowane o osadzenie

Właściciel dostarczył Fabuły do obu istniejących kart (format v3,
ADR 0026). Zarchiwizowane verbatim w `collection/entries/`;
zaktualizowane sekcje osadzenia:

- **Dunland Crebain:** urwisko na skraju Dunlandu, dwaj Uruk-hai
  Białej Ręki w oczekiwaniu na znak, armia Sarumana formująca się
  w wąwozie, pikujący crebain jako sygnał — Postacie i Byty
  (osadzenie kolekcji), Transpozycja, Na Mapie (scena przy
  płd.-wsch. skraju krainy), Źródła.
- **Coralhelm Guide:** zalany kanion wśród lewitujących skał,
  eskorta balotha tajnym przejściem pod nosem patroli Eldrazi, hełm
  z koralu i muszli (klan kartografów wybrzeża) — Postacie i Byty,
  Mechanika (baloth jako twarz zdolności „nie może zostać
  zablokowane"), Transpozycja, Na Mapie, Źródła (+MTG Wiki „Baloth").
- Test dymny przestrojony u źródła: byty z Fabuły legalne jako
  oznaczone OSADZENIE z cytowaną Fabułą; prompt nadal poza pętlą.

## 2026-09-02 18:42 — decyzja właściciela: Fabuła wraca do dostawy (ADR 0026)

Format dostawy materializacji rozszerzony do: **imgId · nazwa · set ·
plan · Fabuła**. Fabuła to wiążąca kotwica transpozycji — ilustracje
FOT/KON powstają na bazie już transponowanego planu, więc osadzenie
karty w Bazie musi pochodzić z tej samej wizji (sekcje „Transpozycja",
„Na Mapie", „Postacie i Byty" budowane z Fabuły; oznaczenie w Źródłach;
osadzenie ≠ kanon MtG). ADR 0011 częściowo zastąpiony; szkielet karty
zaktualizowany. Dotychczasowe karty (1LTR, 2BFZ) bez rewizji —
właściciel może dosłać Fabułę uzupełniającą.

## 2026-09-02 18:42 — recenzja 7 preview: iglica rysowana ręcznie, asymetryczne strefy ikon, PODRĘCZNIK map T4

- **Living Spire:** iglica rysowana ręcznie (smukła turnia w języku
  glifów) — pomniejszone glify hero to klastry i czytały się jak
  „mikro-góry"; **Teeth of Akoum:** etykieta siada tuż pod stożkami
  dzięki ASYMETRYCZNYM strefom ikon (wulkan/iglica: mały prześwit pod
  podstawą, duży nad sylwetką; kontrakt `data-r`/`data-rg` w nakładce).
- **Nowy podręcznik:** `docs/guides/RYSOWANIE_MAPY_PLANU.md` — pełna
  wiedza z rund recenzji PR-9/PR-10 dla agenta rysującego mapę nowego
  planu od podstaw (zasady ADR 0018–0025, pipeline, bramki jakości,
  QA rastrowe, debug rozstawu, kontrakt nakładki, antywzorce,
  checklista).

## 2026-09-02 18:42 — recenzja 6 preview: warstwowe kolory pisma, bez polan, iglica i wodospad, kaniony Makindi (ADR 0025)

- **Kolory pisma warstwowe:** kontynenty/wyspy CZERŃ, wody GRANAT,
  fragmenty lasów/bagien ZIELEŃ (automat po kotwicy w biomie), reszta
  bordo. **Nakładka witryny przenosi teraz kolory z SVG** — to dlatego
  granatu wcześniej nie było widać (CSS klas nadpisywał fill).
- **Bez polan:** wykluczanie boxów etykiet z rozsiewu wycofane — napisy
  leżą NAD lasem (halo daje czytelność).
- **Living Spire** = najsmuklejszy glif adoptowany g-237 (zamiast
  klastra gór); **Roaring Falls** z klockiem wodospadu (strugi
  + rozbryzg); **Makindi Trenches** z narysowanymi kanionami
  (niskie pasmo) i etykietą przy nich.
- **Drogi bez dubli:** 3 usunięte (korytarze istniejących), nowe:
  Affa–Fort Keff, Graypelt–Prison of Omnath (szlak), Coralhelm–The
  Bulwark; **Bala Ged**: dżungla na zachodzie i północy (pustki
  wypełnione po oględzinach renderu), las Ora Ondar/Khalni Heart
  z kreski na pełny wielokąt.
- Testy 90/90 · map-audit 0 · wiązania 0 · QA rastrowe.

## 2026-09-02 18:42 — recenzja 5 preview: czytelność map (ADR 0024) — koła POI, granatowe wody, trakty, pass geograficzny wszystkich kontynentów

Właściciel przeszedł mapę kontynent po kontynencie. Systemowo (ADR 0024):

- **ikony miast/ruin w kołach z nieprzezroczystym tłem** (nie giną
  w bagnie/lesie); **granatowe etykiety wód** (`#1c3a5e`); **rozsiew
  biomów omija boxy napisów** (tytuły nie toną w puszczy); **glify pasm
  w całości na lądzie** (Skyfang nie włazi na morze); nowy POI
  **`iglica`** (Living Spire — jawny glif hero g-016); **+6 traktów**
  (Akoum ×2, Guul Draz ×2, Murasa, Sejiri); nakładka: kotwiczone
  etykiety omijają też tytuły krain (przeszkody obszarowe).

Geografia (per kontynent): rzeka Vazi wypływa z południowego stoku
pasma (nie przecina gór); Thunder Gap i Kazuul Pass zakotwiczone przy
murze; wulkany Akoum zwarte w masyw **Teeth of Akoum**; Oko Ugina przy
paśmie; **Ior Ruin na brzegu Glasspool** (nie w tafli), Glass Haven
odsunięte; Windblast Gorge wzdłuż wąwozu (obrót); **Umung wzdłuż rzeki
na lądzie**; dwie nowe połacie dżungli Bala Ged; Makindi Trenches poza
lasem; Beyeen pod swoją wyspą; Chill Depths przy brzegu.
Testy 90/90 · map-audit 0 · wiązania 0 · QA rastrowe.

## 2026-09-02 18:42 — recenzja 4 preview: fix nakładki (układ kolizyjny nie startował), falka Halimar wraca, porządki kontynentów

Uwagi właściciela: (a) falka Halimar może zostać (spójność jezior);
(b) „Emeria" nachodziła na „ruiny w niebie"; (c) porządki na pozostałych
kontynentach (labelki bez POI, chaos).

- **(b) Root cause znaleziony — bug nakładki:** cache układu etykiet
  startował z `NaN`, a `Math.abs(k − NaN) > próg` jest zawsze false —
  układ kolizyjny nakładki NIGDY się nie uruchamiał; pary o wspólnej
  kotwicy (Emeria + podtytuł na tym samym hedronie) kładły się jedna
  na drugiej. Po naprawie tytuł idzie POD hedron, podtytuł NAD —
  na każdym zoomie.
- **(a)** falka Halimar przywrócona (spójnie z resztą jezior).
- **(c) Porządki kontynentów** + nowy detektor w walidatorze:
  „etykieta siedzi na cudzym POI" (próg 20 j.). Wyłapał i naprawiono:
  Hanging Swamp na ikonie Nimany → w głąb bagna; Kazuul Pass na ikonie
  Visimal → na zachodni mur; dodatkowo Hagra Swamp w biom bagna,
  Lulea odsunięta znad ściśniętego wybrzeża (etykieta odklejała się
  o ~90 px), Living Spire na wolne wnętrze wschodniej Murasy.
- **Ikony POI nie toną w drzewach:** miasta/ruiny/hedrony dołączone do
  stref zajętych rozsiewu biomów (Prison of Omnath znów widoczny
  w puszczy Ondu).
- Testy 90/90; map-audit 0; walidator wiązań 0; QA rastrowe wszystkich
  kontynentów (Sejiri, Akoum, Bala Ged, Guul Draz, Ondu, Murasa, wyspy).

## 2026-09-02 18:42 — recenzja 3 preview: twarda zasada etykieta↔obiekt, pass wiązań Zendikaru, woda bez obwódek (ADR 0023)

Uwagi właściciela: (1) etykiety przy POI wreszcie idealne ✔; (2) twarda
zasada — nie ma etykiet bez obiektu i POI bez etykiet; (3) obwódki rzek
słabe (język w morzu) — wrócić do jednolitego koloru, przyciemnić wodę;
(4a) falka Halimar do usunięcia; (4b) Emeria nieprzypięta do hedronu.

- **Twarda zasada wiązania (ADR 0023):** każde POI ma etykietę
  (lub należy do nazwanej grupy, jak 3 stożki Teeth of Akoum); każda
  etykieta ma twardy punkt: POI, jezioro albo punkt wewnątrz nazywanego
  obszaru. Egzekwuje ją walidator `sprawdzWiazania` (uwagi przy każdym
  renderze CLI) i test wymuszający **0 naruszeń** w scenach repo.
- **Pass wiązań Zendikaru:** przypięte m.in. Emeria + „ruiny w niebie"
  (hedron), Valakut, Teeth of Akoum, The Bulwark, Explorers Peak,
  Glasspool, Ora Ondar, Khalni Heart, Chill Depths, Riverroot,
  Wolfbriar, Mosscrack, Makindi Trenches (na ląd), Surrakar Caves
  (usunięty błędnie podpięty POI osady). **Nazwane z kanonu:** Sejiri
  Refuge, Jwar Isle Refuge, Graypelt (karty ZEN — cykl refuge), Helix
  of Zof (lista ruin post-Eldrazi). **Usunięte** bezimienne dekoracje
  (3 ruiny, 2 hedrony) — bez kanonicznej nazwy nie ma obiektu.
- **E-geo-3 domknięte (detal Murasy):** Visimal, Tumbled Palace,
  Glint Pass, Thunder Gap, Roaring Falls, Pillar Plains (przeniesione
  do Thunder Gap — Guide > fanmapa); Umung okazał się RZEKĄ Bala Ged
  (nie osadą) — etykieta przy ujściu do Bojuka Bay.
- **Woda:** obwódki rzek wycofane (rzeka znów rozpuszcza się w morzu),
  wypełnienie wody atlasu przyciemnione (#d4e2ee), falka Halimar
  usunięta.
- Testy 90/90; map-audit 0; walidator wiązań 0; QA rastrowe Murasy
  i Bala Ged.

## 2026-09-02 18:42 — recenzja preview PR-10: etykiety wg jednego wzoru (KRYTYCZNE), strefy zajęte biomów, obwódka rzek (ADR 0022)

Uwagi właściciela z preview: (a) góry wreszcie dobre ✔; (b) KRYTYCZNE —
etykiety rozjechane względem obiektów; (c) obwódka rzek; (d) biomy
zakrywają góry (Sejiri pod lodem, Ondu pod puszczą).

- **(b) Etykiety — jeden wzór (ADR 0022):** diagnoza potwierdzona w kodzie —
  nakładka ekranowa Codexu rysuje napisy w stałym rozmiarze, a pozycje
  strojone były w jednostkach mapy (przy zoomie odległość rosła,
  przy oddaleniu napis zakrywał sąsiadów — stąd „Kabira na Agadeem");
  rozstaw w SVG szukał pozycji w 16 kierunkach do 118 px od obiektu.
  Teraz: **kotwica = punkt centralny obiektu → napis zawsze POD,
  konflikt → zawsze NAD** (drabinka pionowa, deterministycznie);
  silnik emituje kotwicę w `data-ax/ay/r`, a nakładka witryny liczy
  z niej pozycję **zależną od zoomu** (odstęp = promień ikony × zoom
  + 3 px — wizualnie „zaraz obok" przy każdym przybliżeniu).
- **(d) Strefy zajęte:** rozsiew lasów/bagien/stepów omija bbox każdego
  glifu góry, stożki wulkanów, jeziora i lód; kolejne biomy omijają
  wcześniejsze. Czapa lodowa Sejiri zmniejszona do zachodu kontynentu —
  pasmo odsłonięte; góry Ondu wolne od puszczy.
- **(c) Obwódka rzek:** wstęgi rzek i dopływów mają obrys w kolorze
  linii wody (ciemniejszy niebieski), jak jeziora i wybrzeża.
- **Naprawa regresji przy okazji:** 4 wulkany sceny (w tym **Valakut**)
  nie renderowały się od zmiany kolejności warstw w PR-9 (render czytał
  `scena.wulkany`, scena trzyma je w `poi`) — wróciły na mapę.
- ADR 0022 (nowy), ADR 0021 → częściowo zastąpiona; testy 89/89
  (+2: wzór rozstawu, strefy zajęte); `map-audit.py` 0 problemów;
  weryfikacja wzrokowa rastrów (Sejiri/Ondu/Tazeem/Agadeem/Valakut).

## 2026-09-02 18:42 — Pętla Jakości (PR-10): ADR 0021 (formalizacja stylu map T4), lore ludów Zendikaru, Prison of Omnath + Ior Ruin na mapie

Sesja bez nowej dostawy → Pętla Jakości v2 (audyt + LORE + pass mapowy):

- **Audyt PR #9** (`docs/audits/AUDYT_2026-09-02-PR9.md`): kod i dane
  poprawne; znalezisko — decyzje właściciela (a)–(g) z recenzji
  prototypu żyły tylko w komentarzach kodu i dzienniku, nie w ADR.
- **ADR 0021** — formalizacja stylu map T4: jedna barwa wody dla
  wszystkich akwenów (zastępuje kolor jeziora z ADR 0020 pkt 3),
  kolory funkcjonalne motywu atlasowego (błękit wody, bordowe
  etykiety — doprecyzowanie ADR 0019), wiążąca kolejność warstw,
  etykiety siadające przy obiektach, szare ikony miast, pasmo jako
  jedna bryła. Statusy ADR 0019/0020 zaktualizowane.
- **Pogłębienie LORE planu Zendikar** (sekcja „Ludy", +2 źródła:
  oficjalny *Plane Shift: Zendikar* i „Gods and Monsters"):
  - **trzy wiary merfolków** (Emeria/nieba, Ula/głębin, Cosi/trickster;
    wybór w dorosłości; pochodzenie bóstw od wspomnienia tytanów
    Eldrazi, trójca korów Kamsa/Mangeni/Talib);
  - **trzy narody elfów** (Tajuru — największy, Murasa, otwartość;
    Joraga — Bala Ged, izolacjonizm; Mul Daya — duchy przodków,
    tatuaże-pnącza, Kazandu);
  - **trzy plemiona goblinów** (Tuktuk — przewodnicy po ruinach;
    Lavastep — Akoum, wiedza geotermalna; Grotag — oswajanie bestii).
  - Nagłówki „Geography" → „Geografia" (oba plany); literówki
    (krajobraz, „even na mapie", „rodzinnym").
- **Pass mapowy (Zendikar T4):**
  - **E-geo-8 rozstrzygnięte:** kanoniczna nazwa **„Prison of Omnath"**
    (MTG Wiki „Ondu"/„Omnath" — mesa w Ondu, krąg wiążący, Ritual of
    Lights, Soul Stair); przemianowanie w scenie, map.json i na
    podkładzie (spelling „Omath" pochodził ze źródła fanowskiego w2).
  - **E-geo-4 (część):** etykieta **Ior Ruin** przy jeziorze Glasspool
    (kotwica istniała; kanon: karta *Ior Ruin Expedition*, ZEN 49).
  - `map-audit.py` — 0 problemów; podkład regenerowany deterministycznie
    (diff SVG: 2 linie).
- **Link-mining:** przy 2 kartach na 2 planach żadna encja nie osiąga
  progu ≥2 kart — bez nowych haseł; kandydaci czekają na dostawy
  (Dunland, Halimar/Coralhelm, merfolkowie).

## 2026-09-02 10:14 — mapa Zendikaru: 7 poprawek z recenzji prototypu (pasma gór, etykiety przy obiektach, szare miasta, jednolita woda, hedrony, morze, kolejność warstw)

Zlecenie właściciela (recenzja prototypu z 2026-09-01) — siedem poprawek
**przed** kolejką E-geo: (a) glify gór łączone w logiczne pasma,
wklejane pojedynczo, podobne wielkości, eliminacja zlewania;
(b) labelka musi SIADAĆ przy badge'u; (c) ikony miast szare jak ruiny,
nie czarne; (d) jeziora dokładnie tym kolorem co rzeki/morza;
(e) przenoszenie POI obejmuje WSZYSTKIE jego ikony; (f) etykieta oceanu
na otwartym morzu + usunięcie wodnej kieszeni; (g) kolejność warstw
WIĄŻĄCA: morza → lądy → rzeki → góry → lasy/bagna/stepy →
miasta/ruiny → labelki na szczycie.

- **Silnik mapforge (a/c/d/g):**
  - (a) `pasmo` rysowane jako JEDNO logiczne pasmo wklejane na mapę
    (wcześniej: osobne, rozrzucone klasterki); minimum 3 glify na
    pasmo (wcześniej krótkie pasma rysowały 1–2 glify); szerokość
    glifu = krok wzdłuż grzbietu ×1.8 (±~10%) → wierzchołki
    zbliżonej wielkości, bazy nachodzą ~50% = ciągły grzbiet
    (język mapome).
  - (c) ikony miast = monolitycznie szare (atlas: #6b6b6b —
    poprzednio czarne, zlewały się z górami); ruiny bez zmian
    (jaśniejsze, z szarym obrysem).
  - (d) JEDEN kolor wody w palecie (pergamin + atlas): rzeki,
    kanały i jeziora (w tym Halimar i Glasspool) = dokładnie kolor
    morza (usunięty odrębny „kolor jeziora"); jeziora z bursztynową
    krawędzią jak akweny; ocean bez niebieskich plam głębi
    (wcześniej podpowiadały „akweny" w środku morza).
  - (g) kolejność warstw odwrócona zgodnie z zleceniem: morza → lądy →
    jeziora → rzeki → góry (pasma) → wulkany → lasy/bagna/stepy →
    miasta/ruiny → labelki na samym szczycie (wcześniej biomy na
    górach).
- **Etykiety (b) — cała mapa:** wszystkie etykiety POI siadają przy
  badge'u (reguła ~<30 px od środka obiektu; strona dobierana tak, by
  labelka krawędzią dotykała obiektu). Wpływa na: Cliffhaven,
  Prison of Omath, Ula Temple, Enclave, Sky Rock, The Bulwark, Morosi,
  Umara, Hadatown, Coralhelm, Emeria, Sea Gate, Goma Fada, Affa,
  Slab/Grip/Ghost Haven, Tal Terig (nowe miasto w kanonie — dodane
  + pinezka), Fort Keff, Ora Ondar, Khalni Heart, Windblast Gorge,
  Glass Haven, Zof Marsh, Umung, The Border Mire, Tangled Vales,
  Surrakar Caves, Bojuka Bog, Guum Wilds, Nimana, Malakir, Lulea,
  Hagra Cistern, Lake Jast, Hanging/Hagra Swamp, Skyfang, Kazuul Pass,
  Blackbloom Lake, Singing City, Living Spire, Kazandu, Wolfbriar,
  Turntimber, Mosscrack, Graypelt, Crypt of Agadeem, Kabira,
  Midnight Pass, Ikifal, Benthidrix, Chill Depths, Wybrzeża Halimar,
  Makindi Trenches, Sunder Bay, Bojuka Bay, Wyspy Jwar, Valakut,
  Beyeen, Agadeem.
- **Geografia (e/f):**
  - (e) hedrony Emeri przeniesione razem z POI (wcześniej dryfowały
    w starym miejscu — w Halimarze i na Halimaru); teraz przy
    „Emeria (ruiny w niebie)".
  - (f) „Morze Zendikaru" — labelka przeniesiona na otwarte morze
    zachodnie (wcześniej dryfowała nad wodną kieszenią Tazeem);
    kieszeń połączona z otwartym morzem (krawędzie Tazeem i Bala Ged
    odsunięte — cieśnina Tazeem→Bala Ged jest teraz wyraźnie cieśniną,
    otwartą na północ i południe); kanał Sea Gate wyprowadza
    morze dalej w ocean (1010,660).
- **Audyt (`map-audit.py`):** reguła „etykieta na lądzie" rozluźniona
  z modelu środka do 9-punktowego modelu dotyku (środki: narożniki +
  środki boków + środek etykiety; tolerancja 2 px) — uzasadnienie:
  właścicielska zasada (b) wymaga labelek SIADAJĄCYCH przy obiekcie,
  czyli częściowo nad wodą (wybrzeże Halimar, porty); etykiety
  oceaniczne w białej liście.
- **Testy:** `test/mapforge.test.js` — uaktualnione testy stylu
  (rzeka = jezioro = morze = jeden kolor; paleta achromatyczna bez
  odrębnego koloru jeziora), cała suita **87/87**; `npm run build`
  OK; `map-audit.py` — **0 problemów** (wszystkie mapy).
- **Następna kolejka:** E-geo-1..9 (kolejność z audytu): archipelag
  między Ondu a Akoum, Tazeem SW (2/7), Murasa, Akoum, BG/GD, Ondu,
  Omath, Hada.

## 2026-09-02 10:14 — geografia mapy Zendikaru: audyt całości + przebudowa Tazeem, cieśnina Akoum/Bala Ged–Guul Draz, drogi-trakty, etykiety bez kresek

Zlecenie właściciela (uzupełnienie PR-9): (a) „labelki niektórych POI są
odsunięte od samych miejsc i rysowana jest linia łącząca — nie lepiej bliżej
dać tą labelkę?"; (b) „drogi rozrzucone losowo, nie prowadzą nigdzie
sensownie — powinny być traktami między największymi miastami/POI";
(c) „geografia jest z dupy — wymaga POWAŻNEGO AUDYTU… solidnie, w jednym
albo kilku podejściach" — doprecyzowane: **audyt CAŁEJ mapy**, nie tylko
Tazeem. Prototyp do oceny wdrożenia wystawiony w sandboxie (port 4173).

- **Audyt całości** (`docs/audits/AUDYT_2026-09-01-geografia-zendikaru.md`):
  podsłuch geometryczny (scena.json + SVG→PNG) vs hierarchia kanon > mapa
  fanowska v2 > warianty 3/4. Trzy problemy systemowe: (1) ludy rysowane
  w sprzeczności z treścią — najgorzej Tazeem (Halimar = step bez wody,
  brak Coralhelm, Sea Gate na płd.-wsch. wybrzeżu zamiast na murze);
  (2) topologia — jeden ląd łączył trzy kontynenty (Akoum+Bala Ged+Guul
  Draz); (3) POI „dekoracyjne" (Bojuka na zachodzie, Malakir na zachodzie,
  Valakut w Akoum zamiast na Beyeen…).
- **Tazeem przebudowany (P0)** — mapa zgodna z treścią planu i kartą
  *Coralhelm Guide*: **Halimar = morze śródlądowe** (nowy tryb `jezioro.d`
  w mapforge — nieregularna tafla), **Sea Gate (900,660) na murze** nad
  kanałem-tamą wyprowadzającym morze w ocean, **Coralhelm (660,505) na
  północnym brzegu** (+ pinezka karty przeniesiona), rzeka Umara do Halimar
  (Magosi Wodospad), druga rzeka = wypływ z płn. brzegu, Oran-Rief = pas
  lasu zachód od morza, Enclave w lesie, Ula Temple na brzegu, The Bulwark
  (pasmo zachód→południe), Emeria + hedron nad taflą (opacity = dryf),
  Sky Rock NW.
- **Cieśnina Akoum / Bala Ged–Guul Draz (P0):** `lad-2` rozdzielony na
  `lad-akoum` + `lad-bala-guul` — cieśnina od gulfu do otwartego oceanu.
  Guul Draz ↔ Bala Ged zostają połączone (w2/w3), odgraniczone The Border
  Mire. Bojuka = najdalszy wschód: „Bojuka Bay" przeniesiona na wsch.
  wybrzeże przy Bojuka Bog.
- **POI (P1):** Goma Fada → zachodni cypl, Affa → centrum kotliny, Malakir
  → wschodnia stolica / Nimana → zachód od Lake Jast (były zamienione
  stronami), Lulea → płd.-wsch., Surrakar → dżungla, Zof Marsh → NW,
  Kabira → wyspa Agadeem, Prison of Omath → centrum kotliny Ondu, Makindi
  Trenches → centrum; nowe: **wysepka Valakut z wulkanem** (Beyeen —
  „Mt. Valakut" usunięta z Akoum), Oko Ugina = pasmo (nie dryfujący
  hedron), Teeth of Akoum (etykieta przy klastrze wulkanów), Tangled
  Vales, Hanging Swamp + Hagra Swamp + Hagra Cistern (nowe jezioro),
  Ula Temple, Enclave, Coralhelm, Kazuul Pass.
- **Drogi = trakty (pkt b):** 5 losowych przerywanych linii → trasy
  między największymi miastami: Hadatown→Sea Gate (Tazeem),
  Goma Fada→Affa→Tal Terig (Akoum), Cliffhaven→Graypelt→Mosscrack (Ondu),
  Singing City→Sunder Bay (Murasa), Malakir→Nimana (Guul Draz).
- **Etykiety przy obiektach, bez kresek (pkt a):** silnik `render.mjs` nie
  rysuje już linii łączących (`zakotwicz`); 16 etykiet z liniami
  przysuniętych do obiektów w scenie.
- **Spójność:** `map.json` — 26 kotwic zsynchronizowanych z nowymi
  pozycjami, 9 nowych (Coralhelm, Ula Temple, Merfolk Enclave, The
  Bulwark, Teeth of Akoum, Tangled Vales, Hagra Cistern, Hanging Swamp,
  Prison of Omath), pinezka *Coralhelm Guide* → Coralhelm, duplikat
  kotwicy Living Spire usunięty; `map-audit.py` — „Hagra Cistern" do
  SPODZEANE_WODY.
- **Reszta (P2) → ROADMAP, kolejka E-geo-1..9** (m.in. archipelag
  Jwar/Beyeen/Agadeem między Ondu a Akoum wg w2, Tazeem na płd.-zachód,
  detale Murasy/Akoum/Guul Draz/Ondu, Omath vs Omnath).
- Weryfikacja: testy 87/87; `map-audit.py` 0; build OK; kontrola wizualna
  PNG (3 korekty pozycji etykiet po przeglądzie).

## 2026-09-02 10:14 — PR-9: mapforge — adopcja glifów gór z mapome + rzeki w kolorze morza (ADR 0020)

- **Góry wyglądają jak na mapie Śródziemia** (decyzja właściciela:
  obecne glify odrzucone — „masakryczne", benchmark = mapome). Zgodnie
  z zaleceniem właściciela („nie ma sensu odkrywać koła na nowo")
  wykonane research GitHubu i **adopcja wektorowych obiektów**
  (ADR 0020, research w `docs/plans/PLAN_2026-09-01-glify-mapaowe-i-rzeki.md`):
  - **Glify gór adoptowane z mapome** (CC-BY-4.0 — github.com/k1tesurfen/
    mapome; to JEST mapa-benchmark w repo): 30 ręcznie rysowanych sylwetek
    klastrów 1–3 szczytów + 3 mega-klastery, wycięte z podkładu
    Śródziemia w repo → `tools/mapforge/glify-mapaome.mjs` (dane, nie
    kod — zero zależności, ADR 0002).
  - `szczyt()`/`pasmo()` rysują wyłącznie glifami adoptowanymi: rozsiew
    wzdłuż grzbietu (rozmiar ważony sinusem, odbicia, jitter), kolejność
    wg dolnej krawędzi — bliższe szczyty na wierzchu (technika z
    researchu). Mega-klastery do jawnego użycia w scenie (`glifId`).
- **Rzeki = kolor morza, bez gradientu i opacity** (decyzja właściciela
  2026-09-01: rzeka „rozmywała się" w morzu, a nie twardo w niego
  wpadała): ujście w morze → kolor morza, ujście w jezioro → kolor
  jeziora, na lądzie → kolor morza. Gradient znany z PR-5 usunięty.
- **Proweniencja (ADR 0013):** atrybucja CC-BY-4.0 w nagłówku każdego
  generowanego SVG + `maps/zendikar/map.json` (pole `zrodlo_glify`) +
  ADR 0020 + README mapforge + SKILL_MAPA_PLANU.
- **Zendikar (T4) i demo-warsztat wyrenderowane na nowo**;
  `map-audit.py` → 0; testy 87/87; build OK (4 strony, 14 modułów).
- **Azgaar/Fantasy-Map-Generator (MIT)** — zapisany kandydat na kolejne
  klocki (E5: cytadela/fort, latarnia, wrak, wodospad, obwódki haseł);
  góry Azgaar nie pasowały do benchmarku (jasne/techniczne), techniki
  rozsiewu wdrożone.

## 2026-09-01 21:38 — PR-5: mapforge — glify „hand-drawn" (las kępa, góra żagiel) + warsztat

- **Przebudowa glifów mapforge** (zgłoszenie właściciela: obiekty
  generowane przez mapforge wyglądają „strasznie generycznie i dziecinnie";
  cel = efekt graficzny jak mapa Śródziemia/mapome):
  - **Las** — korona to zamknięta ścieżka z wypukłych łuków („chmurka"),
    nie `<circle>`: nieregularny obrys (jitter promienia), ciemna masa
    cienia u podstawy, asymetryczny boczny pęd i krótka haczura
    cieniowania. Lasy są **gęste i nakładają się** (`minOdst < średnica
    korony`), więc składają się w falistą, teksturowaną masę — jak Mirkwood.
  - **Góra** — pojedynczy szczyt to asymetryczny „żagiel": lewa krawędź
    wypukła na zewnątrz, prawa wklęsła, cień w ciemniejszej facecie po
    prawej + haczura. `lean` przechyla wierzchołek; `pasmo()` układa
    szczyty ciaśniej z jitterem → naturalna, chwiejna linia grzbietu.
  - Obie formy pozostają **deterministyczne** (rng z hasha id) i
    audytowalne (`data-x/y`, kontur zamknięty, map-audit 0).
- **Zendikar (T4) wyrenderowany na nowo** z przebudowanymi glifami
  (motyw atlas, ADR 0019): Oran-Rief / Ondu / Murasa to gęste kępy,
  Akoum / Skyfang / Sejiri to żagle z cieniem. `map-audit.py` → 0.
- **Demo-warsztat** `maps/_warsztat/podklad*.svg` zaktualizowane
  (katalog klocków na jednym obrazie).
- **Zakres ubogacania map (decyzja właściciela 2026-09-01):** nowe POI
  i wzbogacanie podkładu dotyczą wyłącznie map **T3/T4** (podkłady
  własne — dziś Zendikar); map **T2 (adoptowany podkład Śródziemia/
  mapome) nie ruszamy**. Dopisane do `docs/guides/PETLA_JAKOSCI.md` (krok 4).
- **Audyt = recenzja kodu, nie raport zielone** — doprecyzowane
  w `docs/guides/PETLA_JAKOSCI.md` (krok 1); `AUDYT_2026-09-01-PR7.md`
  zawiera głęboką weryfikację silnika mapforge (glify geometryczne,
  lasy nie-nakładające się, brak jitteru pasma, ciche fallbacki).
- Testy: `npm test` 86/86; `npm run build` OK (4 strony, 14 modułów;
  artefakt ~4,6 MB — koszt świadomy z ADR 0009).

## 2026-09-01 21:38 — PR-5: Pętla Jakości v2 — pogłębienie LORE Śródziemia + domknięcie E4

- **Pogłębienie LORE (krok 2):** plan **Śródziemie** (dotąd niepogłębiany
  w PR-4) dostał nową sekcję **„Ludy"** — na wzór analogicznej sekcji
  w Zendikarze. Opisuje trzy grupy zachodniego Śródziemia: **Dunlendów**
  (Gwathuirim, potomków górali Białych Gór, wypchniętych z Calenardhonu),
  **Rohirrimów** (Eorlingas, od Éothéod/Northmanów, obdarowanych Rohanem
  po Polu Celebrantu) oraz **ludzi i siły Isengardu** (Uruk-hai, Biała
  Ręka, krzyżowanie orków i ludzi). Z cytowaniami (Tolkien Gateway,
  Encyclopedia of Arda).
- **Anty-dublowanie (ADR 0005/0010):** encje (dunland/isengard/Saruman/
  Uruk-hai/Biała Ręka/rohan) **nadal czekają na próg drugiej karty** —
  nie utworzono haseł, nie dodano wikilinków do nieistniejących stron;
  wiedza o nich żyje w treści planu i w `docs/backlog.md`.
- **Pass mapowy (krok 4):** domknięty **E4** planu mapforge — wzorzec
  „nowy plan = scena + render mapforge" spisany w `docs/guides/PROCES_MAP.md`
  (MA1 pkt 5) i `docs/guides/SKILL_MAPA_PLANU.md` §11 (mapforge jako
  domyślny sposób tworzenia map T3/T4); `PLAN_2026-09-01-mapforge.md`
  oznacza E4 jako wykonany. Weryfikacja: `tools/map-audit.py` na obu
  mapach — 0 problemów.
- **Krok 3 (link-mining):** potwierdzony brak nowych haseł — karty są
  z różnych planów, licznik wzmianek od kart (nie planów). Backlog aktualny.
- Testy: `npm test` 86/86; `npm run build` OK (4 strony, 14 modułów).

## 2026-09-01 15:30 — E1+E2 mapforge na Zendikarze + naprawa kotwiczenia etykiet

- **Naprawa etykiet nakładki** (feedback z podglądu): transform inline
  nadpisywał CSS-owe centrowanie — etykiety wisiły lewym-górnym rogiem
  na punkcie (Beyeen, Malakir, Lulea…). Teraz: dziedziczenie
  `text-anchor` z grup SVG + kotwiczenie na baseline w jednym
  transformie; asercja „Beyeen = middle" w testach (84/84).
- **E1:** `maps/zendikar/scena.json` — scena danych wygenerowana
  z ręcznego podkładu (generator: `tools/mapforge/e1-scena-zendikar.py`;
  biomy z otoczek klastrów, grzbiety z PCA, okręgi → łuki).
- **E2:** `maps/zendikar/podklad-forge.svg` — próbny render całego
  Zendikaru silnikiem mapforge w motywie atlas (ADR 0019); podkład
  produkcyjny niezmienny do oceny właściciela.
- **Sprostowanie (po rzucie oka właściciela):** pierwszy render E2
  miał biomy na oceanie — otoczki wypukłe biomów są szersze niż
  kontynenty, a audyt nie oglądał treści mapforge. Naprawa podwójna:
  silnik dostał **maski lądu** (rozsiew drzew/kępek i szczyty pasm
  lądują tylko na lądzie; `parsujD` do parsera ścieżek), a audyt
  nauczył się czytać treść `mf-*` (kotwice `data-x/y` deklarowane
  przez klocki + interpreter komend ścieżek). Wysepki generowane
  jako okręgi na krzywych Beziera. Testy masek i parsera: 86/86.
- **Sprostowanie 2 (kolejny rzut oka):** „linie jak drogi po oceanie"
  to były przygaszone linie grzbietu pasm — klaster gór zlewał Ondu
  z Murasą (grzbiet przez cieśninę), a na Sejiri linia biegła przez
  czapę. Naprawa: pasma liczone **per ląd**, linia grzbietu
  **domyślnie wyłączona**, spękania lodu tylko wewnątrz czapy;
  audyt próbuje punktów rzek i linii wzdłuż ścieżki (≥75% na lądzie).

## 2026-09-01 15:30 — LIVE: mapa Zendikaru rysowana mapforge (T4)

- **Wdrożone (E3):** produkcyjny podkład `maps/zendikar/podklad.svg`
  jest teraz renderem silnika mapforge (motyw atlas, ADR 0018/0019)
  ze sceny danych `scena.json` — 9 lądów, 6 biomów, 5 pasm (per ląd),
  rzeki-wstęgi, 44 POI, 74 etykiety w nakładce ekranowej z LOD.
  Podkład ery ręcznej zarchiwizowany jako `podklad-reczny.svg`;
  `map.json` awansował do **wariantu T4** (ADR 0015: mapa T3 dojrzewa
  do T4 wraz z warsztatem). Edycje mapy od dziś: scena → render (E1
  chroni przed regeneracją z renderu). Audyt: 0 problemów; 86/86.

## 2026-09-01 15:30 — Etykiety mapy o stałym rozmiarze ekranowym (LOD)

- Na stronie mapy planu (podkłady własne T3/T4 — Zendikar; adoptowanych
  T2 nie ruszamy) napisy podkładu zostały przeniesione do nakładki
  ekranowej, jak pinezki: **większa czcionka (13,5–24 px zamiast
  ~6 px efektywnych), halo dla czytelności i stały rozmiar przy
  zoomowaniu** — przybliżanie powiększa mapę, nie napisy. Drobne
  etykiety mają **LOD**: pojawiają się dopiero od przybliżenia, w którym
  stałyby się czytelne (próg liczony z oryginalnego rozmiaru).
- Oryginalne `<text>` w SVG dostają `visibility:hidden` (bez JS
  nakładka pozycjonuje się procentowo — graceful degradation);
  etykiety po łuku (textPath) zostają w podkładzie.
  Testy UI: 83/83.

## 2026-09-01 15:30 — mapforge: wspólny silnik mapowy (warsztat T4)

- **Nowe narzędzie `tools/mapforge/`** (ADR 0018): deterministyczny
  generator podkładów SVG z danych — reużywalne klocki: lasy (rozsiew
  koron), bagna, step, lodowce, pasma górskie (szczyty z cieniem
  i przedgórzem), wulkany, rzeki zwężające się do źródła (wstęgi),
  dopływy, jeziora, szlaki kropkowane i drogi, miasta/ruiny/hedrony,
  etykiety pod dowolnym kątem i po łuku (zatoki), kompas, skala,
  ramka, poświata wybrzeży. Zero zależności; identyczna regeneracja
  (deterministyczne „losowości" z hasha id).
- **Demo-katalog klocków:** `maps/_warsztat/podklad.svg` (Wyspa
  Próbna) — przechodzi audyt mapowy bez zastrzeżeń.
- **Motywy: `pergamin` i `atlas`** — po A/B właściciel wybrał monochro-
  matyczny atlas (ADR 0019), a po renderze czysto czarno-białego
  doprecyzował: **walor tonalny w szarościach** (czarny–szary–biały,
  bez sepii/brązu). Test pilnuje achromatyczności wszystkich
  wypełnień (R=G=B); atlas = domyślny motyw map planów (T4).
- Research (ADR 0018): Azgaar FMG (MIT) to generator losowy — my
  renderujemy kanon; techniki line-artu mapome (kropka 0,9; dyscyplina
  grubości) wcielone w klockach.
- 11 nowych testów silnika (81/81 w pakiecie); plan adopcji:
  `docs/plans/PLAN_2026-09-01-mapforge.md`.

## 2026-09-01 15:30 — Pełna Pętla Jakości (LORE + mapy + metryka)

- **Pogłębienie LORE obu planów:** Śródziemie zyskało akapit o Tharbad
  (miasto-most na Gwathló; przeprawa Boromira w 3018 r. — Tolkien
  Gateway), Zendikar o Murasie wg oficjalnego Planeswalker's Guide
  (wyspa-płaskowyż, cztery wejścia, Na Plateau z Singing City, Kazandu).
- **Sieć wikilinków:** plany odsyłają do swoich kart („Karty kolekcji"),
  karty do planów („Na Mapie") — pierwsze połączenia grafu bazy.
- **Pass mapowy:** kanoniczny przekład wnętrza Murasy (Skyfang od zachodu,
  Na Plateau + Singing City na wschodzie wg Guide, Blackbloom w Kazandu),
  nowe kotwice z cytowaniami (Zendikar: 74, Śródziemie: 11 + Dunland),
  Living Spire domknięty w rejestrze.
- **Nowe narzędzie warsztatu T4:** `tools/map-audit.py` — geometryczna
  weryfikacja map (etykiety/markery/pinezki na lądzie, kolizje etykiet);
  obie mapy przechodzą 0 problemów. Wnioski w `SKILL_MAPA_PLANU.md` §10.
- **Metryka:** plany liczone pragmatycznie także w pinezce; completeness
  **100% (8/8) na wszystkich czterech stronach** (było 76%).

## 2026-09-01 15:30 — FOT/KON w treści karty + poprawki mapy Zendikaru (a–j)

- **Ilustracje FOT/KON rysują się same w treści karty** (wersja
  lokalna): panorama FOT otwiera główną kolumnę, bestiariusz KON
  wchodzi pod pierwszą sekcją. Przyciski torów znikają; druk
  Scryfalla pozostaje w infoboksie. Na Pages (bez katalogu `img/`)
  strona wygląda jak dotychczas — cichy fallback.
- **Mapa Zendikaru — 10 poprawek po zrzutach właściciela + 7 znalezionych
  audytem:** Valakut wrócił na Akoum (kanon: superwulkan kontynentu,
  MTG Wiki — stał błędnie przy Beyeen), wyspa Agadeem przestała
  nachodzić na Ondu, Crypt of Agadeem leży na swojej wyspie, Makindi
  Trenches w morzu (koniec kolizji z Cliffhaven), Singing City
  na Murasie (koniec „ogonka" wybrzeża), rozsunięte Zof Marsh/Guul
  Draz, Fort Keff/Ora Ondar/Kargan Lands, Glasspool opisany jako
  jezioro (kanon) z etykietą obok, Ikiral i Emeria mają markery
  (ruiny/hedrony), legenda powiększona. Pełny audyt:
  `docs/audits/AUDYT_2026-09-01-mapa-zendikar-feedback.md`; pozycje
  i proweniencja zsynchronizowane w `map.json` (70 kotwic).

## 2026-09-01 15:30 — Naprawa GitHub Pages + mapy (badge, warstwa karty) + porządek w Pętli Jakości

- **Strona na Pages zaczęła działać.** Przyczyna trzech nieudanych
  publikacji (od powstania `pages.yml`): strona Pages nie była w ogóle
  włączona dla repozytorium, więc workflow padał na kroku konfiguracji —
  jeszcze zanim cokolwiek zdążył opublikować. Włączona przez właściciela
  (Settings → Pages → Source: „GitHub Actions"); od teraz **każdy push
  do `main` publikuje aktualną wersję bazy automatycznie**.
- **Mapy — badge pinezek ukryte do najechania.** Etykieta pinezki
  karty (nazwa karty przy znaczniku) nie zaśmieca już mapy — pokazuje
  się po najechaniu kursorem (albo fokusem klawiaturowym); tooltip
  pinezki działa jak dotychczas.
- **Mapy — kliknięcie pinezki otwiera kartę na warstwie nad mapą.**
  Wpis katalogowy otwiera się na zmaksymalizowanej warstwie; przycisk
  ✕ w prawym górnym rogu (oraz klik w tło i Esc) zamyka warstwę
  i wraca do mapy **w tym samym stanie przybliżenia** — mapa nie jest
  odmontowywana. Klik z modyfikatorem (Ctrl/Cmd) otwiera kartę
  w nowej karcie przeglądarki, a pinezka pozostaje zwykłym linkiem.
- **Karty Katalogowe bez sekcji „Druk w Kolekcji"** (decyzja
  właściciela): strona karty to wyłącznie lore — dane wydruku (wydanie,
  rzadkość, artysta) pokazuje tylko infoboks, wprost ze snapshotu
  Scryfalla.
- **Nowy format Wpisu Karty (ADR 0016)** — po audycie szablonu
  katalogowego właściciela: każda Karta Katalogowa otwiera się teraz
  **blokiem danych Oracle w treści** (koszt z rozwinięciem, typ
  z tłumaczeniem, statystyki, zdolności, wydanie z numerem), mechanika
  czytana jest w trzech warstwach (odczyt zasadniczy → interpretacja
  fabularna → całość jako opowieść, podtypy jako warstwy), flavor
  odczytywany fraza po frazie z kontekstem postaci cytującej, nazwa
  z pełnym polskim odczytaniem („Crebainy z Dunlandu",
  „Przewodniczka z Koralowego Hełmu"), podsumowanie tezami. Obie
  istniejące karty przebudowane do nowego formatu. Sekcja opisu
  ilustracji **zakazana** (transpozycje FOT/KON bywają zupełnie inne);
  obraz Scryfalla żyje wyłącznie w infoboksie.
- **Pogłębienie lore:** strona planu Zendikar z nową sekcją **Ludy**
  (rasy planu, rody wampirów Guul Draz, korowie-pielgrzymi, Zulaport)
  wg *Planeswalker's Guide to Zendikar*; w źródłach karty 2BFZ zniknął
  wpis „wiedza ogólna bez URL-a" — każdy fakt ma cytat.


## 2026-09-01 09:05 — Mapa Zendikaru: rysowanie szczegółów, czysty podkład + brak pikselozy

- **Elementy fanowskie faktycznie narysowane na podkładzie SVG** (nie
  tylko odnotowane w `map.json`): ~31 nowych symboli/etykiet — Akoum
  (Spike Fields, Grip Haven, Slab Haven, Ghostwatch, Kargan Lands, Ora
  Ondar, Khalni Heart, Glasspool + Ior Ruin), Bala Ged (Guum Wilds,
  Bojuka Bog), Guul Draz (Zof Marsh, Hagra Swamp, Lake Jast, Lulea),
  Murasa (Kazandu, Pillar Plains, Vazi River, Singing City, Visimal,
  Kazul Pass, Roaring Falls, Living Spire, Tumbled Palace), Sejiri
  (Benthidrix), Ondu (Prison of Omath, Cliffhaven, Graypelt, Mosscrack,
  Crypt of Agadeem, Zulaport). Wszystkie umieszczone testem
  point-in-polygon (na lądzie, bez kolizji z istniejącymi markerami).
- **Usunięte zastrzeżenia:** zniknął podpis „Rekonstrukcja układu
  kontynentów...", podtytuł Murasy „(położenie przybliżone)" i przerywana
  linia Murasy (pozycja uzupełniona wg źródła). Mapa pokazuje treść
  bez adnotacji „uwaga! fanowskie!" — zgodnie z decyzją właściciela.
- **Naprawiona pikseloza przy przybliżeniu** (sedno zgłoszenia):
  podkład SVG osadzany teraz **inline** w scenie mapy zamiast jako
  `<img>` z data-URI. `<img>` rasteryzował SVG w rozmiarze layoutu,
  a transform zoomu skalał rozciągniętą bitmapę → pikseloza. Inline
  `<svg>` pozostaje wektorem i przerysowuje się w każdym przybliżeniu
  (bez zwiększania rozmiaru pliku). Podkłady rastrowe (PNG/JPG, np.
  Śródziemie) dalej jako `<img>`.

- **Naprawy kolizji na mapie** (na podstawie zrzutu właściciela):
  - **Tal Terig** przeniesione z wody na ląd (Akoum) — pozycja potwierdzona
    skryptowym testem point-in-polygon;
  - **legenda symboli** przeniesiona na otwarty ocean (nie zasłania już
    wysp Ondu ani „Mt. Valakut" przy Beyeen);
  - okolice **Sea Gate / Sky Rock / pin** rozsunięte (skala i pozycje);
  - **halo pod tekstem** etykiet (`paint-order: stroke`) — napisy czytelne
    nad elementami przyrody;
  - naprawiony uszkodzony kontur Tazeem (brakujący punkt `C`).
  Zostaje rekonstrukcja T3 (ADR 0012): `rekonstrukcja: true`, Murasa
  przerywana, podpis „rekonstrukcja".
- **Decyzja właściciela (b): mapa fanowska jako źródło — wdrożone.** Do
  `map.json` dodane pole `zrodlo_fanmapa` wskazujące na dostarczony przez
  właściciela opis **`maps/zendikar/zrodlo-fanowska.md`** (pełna topografia
  + wirtualny układ współrzędnych). **Zasada właściciela (2026-08-31):**
  kanon (Plane Shift / MTG Wiki) pozostaje podstawą; mapa fanowska **tylko
  rozszerza** wiedzę o pozycje, których oficjalnie nie podano (względne
  położenia osad/regionów w obrębie kontynentów, detale topograficzne),
  i **nie zmienia** pozycji twardo kanonicznych. Do `kotwice` dopisano
  **27 nowych punktów** z opisu fanowskiego (Murasa: Kazandu, Pillar
  Plains, Vazi River, Singing City, Visimal, Kazul Pass, Roaring Falls,
  Living Spire, Tumbled Palace; Guul Draz: Zof Marsh, Hagra Swamp,
  Lake Jast, Lulea; Bala Ged: Guum Wilds, Bojuka Bog; Akoum: Ora Ondar,
  Khalni Heart, Glasspool + Ior Ruin, Spike Fields, Grip Haven, Slab
  Haven, Ghostwatch, Kargan Lands; Sejiri: Benthidrix). Wszystkie
  oznaczone `pozycja_zrodlo: "mapa-fanowska"` i adnotowane jako
  rekonstrukcja (nie kanon); istniejące Murasa/Skyfang/Sunder Bay
  przepięte z `nieustalone-w-kanonie` na `mapa-fanowska`. Pozycje
  zweryfikowane testem point-in-polygon (wszystkie na lądzie, kanon
  niezmieniony).
- **Decyzja właściciela (c): doskonalenie map wektorowych w Pętli
  Jakości.** Dopisany osobny **krok 4b** w
  `docs/guides/PETLA_JAKOSCI.md` (audyt → pozycje ze źródeł →
  wzbogacenie wektora → poprawa kolizji → weryfikacja + dokumentacja)
  i wzmianka w `AGENTS.md` §2 oraz README.
- **Audyt mapy** (`docs/audits/AUDYT_2026-08-31-PR3-mapa-zendikar.md`):
  mapa T3 była „uboga" — same kontynenty z etykietami, brak gór, lasów,
  rzek, miast, bagnisk i ruin.
- **Podkład SVG wzbogacony** o elementy **potwierdzone w źródłach**
  (MTG Wiki / Guide Zendikar / Plane Shift — pole `elementy` w map.json):
  - **Tazeem**: las Oran-Rief, rzeka Umara + wąwóz + wodospad Magosi,
    Merfolk Enclave, Sea Gate + miasto + Lighthouse, Sky Rock, Coralhelm
    (zywa skała nad Halimar), Pasmo Lun Bulwark, Hadatown, ruiny Ysterid.
  - **Akoum**: pasmo wulkaniczne + superwulkan, Oko Ugina, Windblast Gorge,
    Affa, Goma Fada, Tal Terig.
  - **Bala Ged**: dżungla Tangled Vale, rzeka Umung, Bojuka Bay,
    Bordermire, Umungshore, Surrakar Caves.
  - **Guul Draz**: Malakir, Free City of Nimana, Hagra Cistern,
    Hanging Swamp, Pelakka Karst.
  - **Murasa** (przerywana): Góry Skyfang/Shatterskull, Na Plateau,
    rzeka Raimunza, Sunder Bay, jaddi-trees, Murasa Skyclave.
  - **Ondu**: Makindi Trenches, Turntimber, Teetering Peaks, Agadeem +
    Hedron Fields, Kabira, Beyeen/Mount Valakut, Jwar, Serpent's Maw.
  - **Sejiri**: Midnight Pass, Ikiral, wietrzne góry, zmrożony step.
  Dodana **legenda symboli** (góry/wulkan, las, bagno, osada, ruina)
  i podpis źródłowy.
- **`map.json`**: pole `elementy` (każdy element z URL-em źródła),
  rozszerzone `kotwice` (nowe punkty z notką źródła) i zaktualizowana
  notka. **Rekonstrukcja T3 nienaruszona** (`rekonstrukcja: true`,
  Murasa przerywana, podpis kartograficzny); pozycje punktów są
  przybliżone (nie ma oficjalnej mapy — ADR 0012).
- Testy: 70/70; `npm run build` = OK (podkład osadzony, PIN 2BFZ
  na Tazeem/Halimar bez zmian).

## 2026-09-01 09:05 — Pętla Jakości operacyjna + K5 (PR-3)

- **K5 — `tools/wiki-stats.mjs`**: completeness score stron wg wzoru
  z `docs/guides/PETLA_JAKOSCI.md` (sekcje 3 + źródła 2 + wikilinki 1 +
  pinezka 2, max 8). Skrypty `npm run stats` i `npm run stats:json`;
  raport sortuje od najsłabszej strony — obiektywny punkt startu
  pogłębiania. Bez twardych progów (dane referencyjne zbiorą się
  z kolejnymi sesjami).
- **Pogłębianie (krok 2)**: strony planów (najsłabsza warstwa — 38%
  przed zmianą) rozbudowane o geografię i sekcję Źródła:
  - **Śródziemie** — Geografia (Dunland i Dunlendowie, Isengard/Orthanc
    i Przełęcz Calenardhon, Enedwaith, rzeki Isen i Gwathló) + Źródła;
  - **Zendikar** — Geografia (siedem kontynentów, Tazeem: Oran-Rief,
    Halimar, rzeka Umara, Emeria, Sea Gate, Coralhelm Refuge, domy
    ekspedycyjne) + Źródła.
  Skorygowana kompletność: plany 38% → 63%.
- **Link-mining (krok 3)**: przegląd potwierdził — **brak nowych haseł**.
  Żadna encja nie jest jeszcze wspominana przez ≥2 karty (karty z różnych
  planów: Śródziemie i Zendikar); kolejka w `docs/backlog.md` pozostaje
  aktualna.
- **Pass mapowy (krok 4)**: obie karty mają pinezki (region), oba plany
  mają mapy — bez braków.
- **Integralność**: `npm test` = 70/70 (nowy `test/wiki-stats.test.js`),
  `npm run build` = OK. Karty pozostały nietknięte.

## 2026-08-31 20:38 — Pierwsza karta! Mapa Śródziemia + kanon v2 (PR-2, w toku)

- **Mapa Zendikaru — rekonstrukcja T3** (`#/mapa/zendikar`, ADR 0012):
  podkład własny (SVG) z układem kontynentów z kanonu tekstowego,
  wzorowany mapami fanowskimi; Murasa z linią przerywaną („położenie
  przybliżone”). Pinezka 2BFZ — region wybrzeży Halimar; mini-mapa
  w infoboksie karty podłączyła się sama.
- **Ikony many** — notacja typu `{1}{U}` w treści i infoboksie Koszt
  renderuje się jako kolorowe ikony many (biała, niebieska, czarna,
  czerwona, zielona + bezbarwna).
- **Lista kart**: sortowanie alfabetyczne (pl), tagi w tabeli
  oraz filtr nazwy i tagów; usunięty meta-tekst procesowy
  (feedback właściciela z przeglądu tury 5).
- **Materializacja 2BFZ Coralhelm Guide** — druga Karta Katalogowa,
  pierwsza dostarczona chudym formatem (imgId · nazwa · set · plan;
  ADR 0011): snapshot BFZ #74 (Viktor Titov), lore przewodniczki
  z Coralhelm nad Halimar na Tazeem, flavor Jori En z tłumaczeniem.
  Plan **Zendikar** zyskał stronę (siedem kontynentów, Sea Gate,
  Roil); mapa planu — własna rekonstrukcja (patrz wyżej).
- **Materializacja 1LTR Dunland Crebain** — pierwsza Karta Katalogowa
  (10 sekcji): snapshot Scryfalla posiadanego wydruku (borderless,
  David Rapoza), mechanika jako opowieść (Flying + Amass Orcs 2),
  pinezka regionu Dunland na mapie. Posiadany wydruk nie ma flavor
  tekstu — sekcja flavoru opisuje scenę Hollin, którą karta przywołuje.
  Strona karty to w całości kanon (snapshot + lore z cytowaniami):
  byty faktycznie obecne na karcie w „Postaciach i Bytach",
  najważniejsze encje pogrubione w opisie (bez osobnej sekcji wątków —
  wikilinki po progu dwóch kart), opis posiadanego wydruku
  w „Druku w Kolekcji".
- **Mapa Śródziemia z silnikiem v1** (`#/mapa/srodziemie`): podkład
  w pełni wektorowy (projekt *mapome*, k1tesurfen, CC-BY-4.0 — ADR 0009),
  pan/zoom, legenda pewności, deep-link `?pin=`. Pinezki i etykiety
  zachowują stały rozmiar podczas zoomowania.
- **Karta Katalogowa z mini-mapą**: infoboks pokazuje miniaturę mapy
  planu z pinezką — klik przenosi na mapę z wycentrowaną pinezką.
- **Ostre pinezki w każdym zoomie**: pinezki i etykiety przeniesione
  do nakładki ekranowej (pozycjonowane w pikselach, poza skalowaną
  warstwą podkładu) — stały rozmiar bez rozmycia przy przybliżeniu.
  Nagłówek mapy bez danych technicznych (wariant podkładu).
- **Artefakt otwiera się od razu**: `index.html` obok pliku bazy
  przekierowuje na niego — wejście na serwer nie pokazuje listingu
  katalogu.
- **ADR 0010 — hierarchia kanonu v2** (korekta właściciela): kanonem jest
  karta MtG + lore świata docelowego; prompt i narracja kolekcji to
  **kotwica osadzenia**, nie prawda objawiona. Zastępuje hierarchię
  ADR 0003.
- **ADR 0011 — chudy format dostawy** (decyzja właściciela): dostawa
  to jedna linijka — imgId, nazwa, set, plan; reszta ze snapshotu
  Scryfalla. Narracja i prompt wychodzą z pętli i ze strony karty
  (pozostają w archiwum wpisów kolekcji); sekcje „Narracja Koleksji"
  i „Wizualizacja" zastępuje „Druk w Kolekcji".
- **Zasada progu haseł** (korekta właściciela): hasło powstaje dopiero,
  gdy ≥2 karty odwołują się do encji w treści. Cztery hasła utworzone
  przedwcześnie (crebain, dunland, isengard, rohan) **wycofano** —
  wiedza żyje w sekcjach karty, encje w kolejce link-miningu
  (docs/backlog.md).
- Testy: 65 (test dymny mapy i karty z realnej bazy; fixture „pusta
  baza"; statusy ADR „Częściowo zastąpiona"; pilnowanie kanonu karty
  i chudego formatu dostawy).

## 2026-08-31 20:38 — Fundamenty (PR-1)

- Założenie projektu **MTG Lore Codex**: struktura repozytorium, dokumenty
  konstytutywne (AGENTS.md, PRODUCT, ARCHITECTURE, WORKFLOW, ROADMAP,
  LESSONS, SECURITY), rejestr ADR 0001–0008, ENVIRONMENT z empirycznie
  zweryfikowanymi faktami sandboxa.
- Silnik witryny: parser frontmatter, renderer markdown z wikilinkami,
  rejestr stron z walidacją schematów, hash-router, renderery wszystkich
  typów stron (z pustymi stanami), tory obrazów FOT/KON z cichym
  fallbackiem (ADR 0008).
- 62 testy integralności (schemat treści, wikilinki, parość kolekcji,
  pokrycie Scryfall, mapy, rejestr ADR, budżet lektury, artefakt, UI
  smoke z mini-shimem DOM) + fixture'y end-to-end.
- CI (testy + build + artefakt do pobrania) i publikacja na GitHub Pages.
- Baza celowo pusta: pierwsza materializacja — **1LTR Dunland Crebain**
  (dostarczona przez właściciela 2026-08-31) — wchodzi w PR-2 razem z
  mapą Śródziemia T1.
