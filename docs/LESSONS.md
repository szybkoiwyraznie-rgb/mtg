# Lekcje projektowe (trwały rejestr)

Powtarzalne wnioski z pracy nad projektem — to, co kolejna sesja ma wiedzieć,
zanim popełni ten sam błąd.

| Dokument | Zakres | Trwałość |
|---|---|---|
| `docs/setup/HANDOFF_*.md` | stan JEDNEJ sesji | jednorazowy |
| `docs/plans/PLAN_*.md` | roadmapa JEDNEGO zadania | jednorazowy |
| `docs/PROJECT_HISTORY.md` | dziennik sesji | żywy, NIE lektura startowa |
| `docs/decisions/*.md` (ADR) | wiążąca decyzja architektoniczna | trwała, formalna |
| **`docs/LESSONS.md`** | **wniosek / heurystyka diagnostyczna** | **trwała, nieformalna** |

Lekcja idzie tu, gdy jest powtarzalna, ale NIE jest decyzją architektoniczną
(te → ADR). Wymusza zmianę sposobu pracy? Dopisz ją też do `AGENTS.md`.
Lekcji nie kasujemy — nieaktualną oznaczamy odsyłaczem do nowszej.

**Wzorzec wpisu (obowiązkowy):** `## LN (YYYY-MM-DD) — reguła w jednym
zdaniu`, potem **Objaw** → **Przyczyna** → **Reguła**.

---

## L1 (2026-08-31, dziedziczona z mtg-game) — przed pracą sprawdzaj empirycznie, które ograniczenia sandboxa faktycznie obowiązują

**Objaw:** przekonanie „egress zablokowany, więc Scryfall nieosiągalny"
prowadziłoby do projektu z ręcznie wklejanymi danymi; przekonanie „edit_file
psuje polskie znaki" (prawda w sandboxie mtg-game) kazałoby pisać wszystko
przez python3.

**Przyczyna:** sandboxy różnią się między projektami; reguły environmentowe
dziedziczone bez weryfikacji bywają nieaktualne lub nadmiernie ostrożne.

**Reguła:** w pierwszej sesji każdego nowego projektu zmierz fakty (curl,
npm, fetch_page, UTF-8 w narzędziach) i zapisz wynik w
`docs/setup/ENVIRONMENT.md`; przy kolejnych sesjach traktuj tamtejsze
fakty jako obowiązujące, aż ktoś je zaktualizuje z pomiarem.

## L2 (2026-08-31, dziedziczona z mtg-game) — praca istnieje dopiero po git push

**Objaw:** „gotowe" zmiany znikają po resecie workspace w trakcie sesji
(w mtg-game zdarzało się wielokrotnie, także w środku pracy).

**Przyczyna:** sandbox odtwarza workspace ze świeżego klona; lokalne pliki,
niewypchnięte commity i historia czatu przepadają.

**Reguła:** commituj po każdym samodzielnie zielonym kroku i od razu
pushuj; po każdym commicie sprawdź `git log --oneline -1`; przed długimi
operacjami upewnij się, że wszystko jest na zdalnej gałęzi. Procedura
odzyskiwania po resecie: `ENVIRONMENT.md` §2.

## L3 (2026-08-31, dziedziczona z mtg-game) — sklejone moduły dzielą jeden zasięg: cykl i kolizja nazw muszą być wykryte przed buildem

**Objaw:** w mtg-game ciche nadpisanie symbolu po sklejeniu modułów dawało
„działającą" stronę z losowo zepsutym zachowaniem, trudne do debugowania.

**Przyczyna:** `stripModuleSyntax` usuwa import/export — wszystkie moduły
żyją w jednym zasięgu; dwa takie same identyfikatory na poziomie modułu to
nadpisanie, a nie błąd składni.

**Reguła:** każdy build przechodzi przez `tools/module-graph.mjs`
(detekcja cykli + asercja braku kolizji nazw na poziomie modułów);
nowy moduł bez przejścia przez te sprawdzenia nie wchodzi do `src/`.

## L4 (2026-08-31) — nie zakładaj trybu offline dla wersji lokalnej

**Objaw:** argumentacja ADR 0009 przy odrzucaniu kafli mapowych brała jako
premise „artefakt działa offline z `file://`".

**Przyczyna:** lokalna wersja artefaktu była mylnie utożsamiana z wersją
bez sieci. Właściciel sprostował (2026-08-31, czat): wersja lokalna to
po prostu plik na desktopie z internetem; jedynym elementem lokalnym są
tory obrazów FOT/KON z katalogu `./img/`.

**Reguła:** wymagania środowiskowe właściciela (sieć, urządzenia, katalogi)
potwierdzać wprost, nie wywodzić z filozofii projektu; zewnętrzne zasoby
są dopuszczalne, o ile artefakt degraduje się z nich z wdziękiem
(druk Scryfalla: obraz online, cichy fallback — ADR 0008).

## L5 (2026-08-31) — markery mapy w warstwie ekranowej, nie w skalowanej

**Objaw:** pinezki z kontraskalowaniem `scale(1/k)` miały pozornie stały
rozmiar, ale przy dużym przybliżeniu rozmywały się w „duże piksele"
(zrzut właściciela).

**Przyczyna:** pinezki żyły wewnątrz warstwy z `transform: scale(k)`
(oraz `will-change: transform`) — przeglądarka rasteryzuje taką warstwę
kompozytową do bitmapy i rozciąga ją wg transformu; kontraskala
utrzymywała geometrię, ale nie jakość rastra.

**Reguła:** znaczniki UI (pinezki, etykiety) pozycjonujemy w NAKŁADCE
poza transformem — pozycja liczona w pikselach ekranu
(`x·W·k + ox`); skalowana warstwa zawiera wyłącznie treść mapy
(podkład, SVG regionów). To standardowy układ markerów mapowych.

## L6 (2026-09-01) — GitHub Pages: `configure-pages` wymaga istniejącego site'a; deploy kładzie się na 404, nie na buildzie

**Objaw:** workflow „Publikacja na GitHub Pages" kończy się failure w ~13 s
(nawet nie dochodząc do uploadu), podczas gdy testy i build są zielone.
Adnotacja runu: `Get Pages site failed. Please verify that the repository
has Pages enabled… Error: Not Found`.

**Przyczyna:** strona Pages **nigdy nie została włączona** dla repo
(`GET /repos/<owner>/<repo>/pages` → 404). `actions/configure-pages@v5`
kłada się na tym kroku, zanim `deploy-pages` zdążyłby cokolwiek
opublikować; każdy kolejny run pada tak samo (3/3 w historii mtg).

**Reguła:** przy pierwszym deploju Pages na repo najpierw upewnij się,
że site istnieje: `gh api repos/<owner>/<repo>/pages` (200 = jest).
Gdy 404 — albo właściciel włącza Settings → Pages → Source: „GitHub
Actions" (jedno kliknięcie), albo workflow dostaje
`configure-pages: with: enablement: true` (akcja sama tworzy site;
wymaga `permissions: pages: write`). W tym projekcie zmiany plików
`.github/workflows/` wykonuje właściciel — token bota Areny nie ma
uprawnienia `workflows` (ENVIRONMENT §3). Po włączeniu site'a publikacja
idzie automatycznie przy każdym pushu do main (`on: push`); pierwszą
publikację po włączeniu odpala re-run ostatniego failed runu lub scalenie
PR.

## L7 (2026-09-05) — non-greedy regex nie usuwa grup SVG z zagnieżdżonymi `<g>` — idempotentność skryptów warstw testuje się na zacommitowanym pliku

**Objaw:** skrypt `ravnica-v3-herby.py` deklarował idempotentność, a po
uruchomieniu na zacommitowanym podkładzie dokleił drugą kopię 9 glifów
herbowych i zostawił wiszące `</g>` (plik przestałby być poprawnym XML,
gdyby wynik zacommitować).

**Przyczyna:** usuwanie warstwy przez
`re.sub(r'\n<g id="…">.*?</g>\n', …, flags=re.S)` — non-greedy `.*?`
kończy się na PIERWSZYM `</g>`, czyli na zamknięciu zagnieżdżonej
podgrupy (`herb-gruul`), nie całej warstwy.

**Reguła:** grupy z zagnieżdżonymi `<g>` usuwa się licznikiem głębokości
(skanner `<g[\s>]` / `</g>`) albo parserem XML, nigdy single-`.*?`
regexem. Idempotentność skryptów doszywających warstwy sprawdza się
EMPIRYCZNIE: uruchomić na zacommitowanym pliku → `git diff` ma być
pusty → dopiero wtedy commit (audyt PR-18, Z8).

## L8 (2026-09-05) — imgId to numer kolekcji właściciela (tory FOT/KON), NIE collector number Scryfall

**Objaw:** przy materializacji karty FF agent „skonfrontował” numer
dostawy `275FIN` z API Scryfall (gdzie 275 = Clive’s Hideaway) i uznał
dostawę za błędną, nadpisując imgId na `5FIN` wg collector_number
Scryfall — czym odciąłby tory FOT/KON właściciela (sonda
`./img/<imgId>FOT.png`, ADR 0008).

**Przyczyna:** dwa niezależne systemy numeracji: `imgId` = klucz
prywatnych ilustracji właściciela na jego dysku (element Karty
Katalogowej), `collector_number` = dane wydruku w snapshotcie
(wyłącznie metadane wydruku, ADR 0014). Nie wolno zakładać zgodności
obu numeracji, nawet jeśli przy którymś wydruku numery się pokrywają.

**Reguła:** imgId i slug karty bierze się WYŁĄCZNIE z dostawy
właściciela (ADR 0011); Scryfall dostarcza metadanych wydruku, nie
klucza kolekcji. Nie „korygować” numerów dostawy na podstawie Scryfalla
— najwyżej udokumentować oba numery w snapshotcie (`notka_numery`).

**Doprecyzowanie właściciela 2026-09-07 (605SHM, ADR 0036):**
605 jest i pozostaje numerem kolekcji, `605SHM` pozostaje imgId,
`605shm-consign-to-dream` pozostaje slugiem. Sonda FOT/KON szuka
`./img/605FOT.png` / `./img/605KON.png` (potem pełnego imgId).
**Nigdy nie zmieniać numerów podawanych przez właściciela.** Zewnętrzny
collector_number jest wyłącznie metadaną Scryfalla.

W researchu PR-22 agent ponownie użył zwrotu brzmiącego jak „poprawienie”
605, choć nie przemianował plików. To też błąd: nie przeciwstawiać obu
numerów formułą „nie ten, tylko tamten”. Nazywać jawnie dwa pola i nigdy
nie kwestionować numeru kolekcji przy weryfikacji druku. Regresja
`test/img-id-kolekcji.test.js` pilnuje nagłówka i ścieżek FOT/KON także
po zmianie zewnętrznego numeru. Reguła formalna: ADR 0036.

## L9 (2026-09-06) — opis PR aktualizuje się kumulatywnie po każdym commicie merytorycznym, nie „na końcu”

**Objaw:** PR-19 (audyt PR-18) zaciągnął na gałąź trzy commity — audyt,
naprawy Z1–Z5 i rewamp mapy Alary v2 — a jego opis na GitHubie do
momentu scalenia wymieniał tylko pierwszy z nich („kolejka czeka na
zlecenie”). Kolejna sesja (audyt PR-20) musiała rekonstruować zakres
PR-19 z `git log` i diffów, a zmiany nie trafiły do co-nowego/historii
przed scaleniem.

**Przyczyna:** opis PR traktowany jak element „domknięcia sesji”, a nie
bieżący stan gałęzi; commity merytoryczne wchodziły bez aktualizacji
opisu, więc dokument rozjechał się z rzeczywistością — dokładnie ten sam
wzorzec dryfu co treść↔ADR (Z1 w PR-18/PR-19), tylko w warstwie procesu.

**Reguła:** opis PR to żywy dokument gałęzi (AGENTS.md §7 pkt 4): po
każdym wypchniętym commicie zmieniającym zakres (nowa treść, naprawy,
mapy, testy) aktualizować go kumulatywnie `gh pr edit` (przy błędzie
GraphQL: `gh api -X PATCH … -F body=@plik`, ENVIRONMENT §3) — zanim
przyjdzie kolejna sesja i będzie musiała zgadywać, co PR faktycznie
scalił.

## L10 (2026-09-06) — geometria nie zastępuje oka: każdą mapę T3/T4 trzeba raz obejrzeć jako raster

**Objaw:** mapa Alary v2 przeszła `map-audit` z wynikiem 0, `sprawdzWiazania`
0 i recenzję danych sceny w audycie PR-19 — a przy pierwszym oglądzie
rastru (PR-21) trzy z sześciu tytułów regionów leżały na forcie, paśmie
i szlaku. Handoff PR-20 sam odnotował, że rewampu „nikt nie oglądał”.

**Przyczyna:** weryfikator liczył kolizje wyłącznie tekst×tekst
i „na lądzie”; relacja tytuł↔ikona/rzeźba nie była modelowana, a scena
była poprawna semantycznie (etykiety zarejestrowane, wiązania POI OK).
Audyt kodu i danych nie widzi kompozycji — to inna klasa błędu niż
integralność.

**Reguła:** po każdej zmianie tytułów, POI lub pasm w scenie
(i przy audycie PR, który taką zmianę scalił) rasteryzuj podkład poza
repo (ENVIRONMENT §1a, SKILL_MAPA_PLANU §8) i obejrzyj całość + cropy
regionów; wnioski zapisuj w audycie/handoffie, bo raster znika z sesją.
Każdą usterkę, którą złapało oko, przełóż na regułę geometryczną
w `map-audit` **tylko jeśli** na pozostałych mapach daje 0 fałszywych
alarmów (tak powstała `TYTUŁ NA OBIEKCIE` z marginesem 6) — reszta
zostaje w checkliście oka.

## L11 (2026-09-06) — po odświeżeniu sandboxa commituj natychmiast, a podgląd buduj tylko z pełnego klonu

**Objaw:** w sesji PR-21 środowisko odświeżyło się w trakcie pracy
(płytki klon, `/tmp` pusty, token GitHub nieważny). Przez ~2 godziny
powstały mapa, karta i strona planu bez ani jednego commita (czekanie
„aż wróci token”), a podgląd dla właściciela został zbudowany z płytkiego
klonu — stopki pokazywały fałszywe daty utworzenia (Coralhelm Guide
„utworzono dziś”) i bez wiersza aktualizacji, a najnowszy wpis „Co
nowego” nie był w nim widoczny, bo build był starszy niż wpis.
Właściciel zgłosił obie rzeczy jako regresje; kod był poprawny.

**Przyczyna:** dwa błędy nawyku, nie kodu. (1) Utożsamienie „nie mogę
pushować” z „nie warto commitować” — lokalne commity są tanie i
odtwarzalne, a ich brak czyni pracę niewidoczną i nieodporną na kolejny
reset. (2) Budowanie i wystawianie podglądu bez sprawdzenia stanu
repozytorium; ostrzeżenie builda o płytkim klonie zniknęło, bo wyjście
filtrowano do jednego wiersza.

**Reguła:** po wykryciu odświeżenia środowiska najpierw
`git rev-parse --is-shallow-repository` → `git fetch --unshallow`
(ENVIRONMENT §2a), dopiero potem build i podgląd. Commit lokalny po
każdym kroku merytorycznym niezależnie od dostępności GitHuba; push
gdy tylko token wróci (`rebase --onto` na stan zdalny, bez force).
Przed wystawieniem podglądu właścicielowi: świeży build **po** ostatniej
zmianie treści i kontrola jednej starej strony (data utworzenia sprzed
dni). Nie filtruj stderr builda.

## L12 (2026-09-07) — walidator pilnuje tylko tego, co zna: reguły z recenzji wchodzą do `sprawdzWiazania`, nie do pamięci agenta

**Objaw:** mapa Tarkiru przeszła `map-audit` (0) i wiązania (0), a
właściciel w pierwszej minucie recenzji wskazał cztery wady: rzeki
kończące się w polu, lód na grzbiecie, kanion narysowany klockiem
miejskim, ramka na treści full-bleed. Trzy z czterech istniały już
wcześniej na Zendikarze i w scenie demo — niezauważone przez trzy PR-y.

**Przyczyna:** walidatory znały etykiety, POI i ląd/wodę, ale nie znały
**relacji między obiektami sceny** (rzeka↔akwen, pasmo↔lód). Reguły
„oczywiste” dla kartografa (rzeka gdzieś uchodzi) nie były nigdzie
zapisane maszynowo, więc obowiązywały tylko tam, gdzie agent akurat o nich
pamiętał. Raster L10 pomaga zobaczyć, ale oko agenta też omija to, czego
nie szuka.

**Lekcja:** każda uwaga recenzyjna, którą da się wyrazić geometrycznie,
trafia w tej samej sesji do walidatora (`sprawdzWiazania` / `map-audit`)
z testem na WSZYSTKICH scenach repo — wtedy naprawa Tarkiru od razu
wyłapuje Zendikar i demo. Uwaga, której nie da się zautomatyzować, idzie
do checklisty SKILL_MAPA_PLANU §7 jako pytanie TAK/NIE. ADR 0034.

## L13 (2026-09-07) — geometria „z podglądu” ma inny błąd niż geometria „z pliku”: zanim dwa podkłady dostaną wspólne współrzędne, zmierz kalibrację na obiektach, nie na proporcjach

**Co się stało.** Mapa T4 Tarkiru była rysowana z odczytów rastra
oglądanego w UI czatu (1568×1208), bo plik nie dotarł do sandboxa.
Gdy właściciel wgrał pełny raster (4307×3293) i zapadła decyzja o JEDNYM
układzie współrzędnych dla obu podkładów, pierwszy odruch — przeliczyć
wszystko stosunkiem szerokości — dawał kalibrację „na oko” z błędem do
~90 px na pełnym rasterze: proporcje obu obrazów różniły się o 0,8 %
(podgląd był przycięty o kilka pikseli, nie przeskalowany), a odczyty
z podglądu miały własny rozrzut ±40 px.

**Reguła.** Kalibrację między podkładami wyprowadza się z generatora
(znane odwzorowanie) i **weryfikuje na ≥ 20 obiektach zmierzonych na
docelowym pliku** (pierścienie osad, glify twierdz — środek, nie napis).
Obiekty, które mają być „w tym samym miejscu” w obu widokach, dostają
w generatorze pozycję z pomiaru pełnego (`P(X,Y)`), a nie przeliczoną
z podglądu. Wynik pomiarów trafia do `zrodlo-research.md` (tabela px),
kalibracja do `map.json`. Test smoke pilnuje początkowego markupu;
jednorazowy pomiar 453.86 px z PR-21 nie był testem regresyjnym.
Od naprawy A3 w PR-22 `test/mapa-warianty.test.js` montuje kontroler
w mini-DOM o znanych wymiarach i wykonuje wheel/click/pan: minimum,
maksimum, powrót do pierwszego wariantu, deep-link i widoczność etykiet.
Limity zoomu liczy się w układzie złotym, nie w różnych jednostkach
podkładów. CSS/hit-testing nadal wymagają przeglądarki (A4).
Podgląd z UI jest dobry do rysowania relacji, nie do współrzędnych,
które mają przetrwać zmianę podkładu.


## L14 (2026-09-08) — numer w konwencji repo to indeks kolekcji właściciela, nie numer kolekcjonerski; tożsamości karty nie ustala się ze snippetu wyszukiwarki

**Objaw:** agent odczytał „40USG" jako kartę nr 40 z Urza's Saga i na
podstawie poszatkowanego snippetu galerii Scryfalla ogłosił właścicielowi,
że kartą jest „Rune of Protection: Red". Karta to Expunge (nr kol. 135).

**Przyczyna:** w konwencji `NNNSET` (605SHM, 393DKA, 40USG) liczba to
pozycja w kolekcji właściciela — dowodzi tego sama baza (Shadowmoor miał
301 kart, więc 605 nie może być numerem kolekcjonerskim). Snippety
wyszukiwarki mieszają nazwy z numerami galerii i nie są źródłem
tożsamości.

**Reguła:** tożsamości karty (nazwa, set, numer kolekcjonerski, artysta,
flavor) nie zgaduj — bierz z dostawy właściciela albo z API Scryfalla
(`/cards/named?exact=…&set=…`, działa przez fetch). W razie rozjazdu
dostawa właściciela jest rozstrzygająca.

## L15 (2026-09-08) — build nadpisuje, ale nie śledzi usunięć: katalog wyjściowy czyścić przy każdym pełnym buildzie

**Objaw:** po `git rm maps/dominaria/aerona.jpg` plik wciąż był w
`dist/maps/dominaria/` i w pobieranym ZIP-ie — build nadpisywał istniejące
plikowe pliki, ale nigdy nie usuwał tych, których nie napisał w tym
przebiegu. Właściciel pobrałby ZIP z marnym 1,6 MB, o którym repo mówi
„usunięte”.

**Przyczyna:** `zbudujPakiet` pisał drzewo na wierzchu starego `dist/`
bez czyszczenia; `dist/` jest gitignorowany, więc nic nie sygnalizowało
driftu.

**Reguła:** pełny build (`zbudujPakiet`) najpierw `rmSync(katalog,
{recursive, force})` — drzewo `dist/` ma być funkcją repo, nie
akumulacją przebiegów. Test regresyjny w `test/artefakt.test.js`
(stale plik w katalogu musi zniknąć). Jeśli kiedyś zbuduje się do
katalogu z czymś cennym poza artefaktami — najpierw przenieś to, potem
buduj.

## L16 (2026-09-09) — dostawę karty zapisuj verbatim natychmiast, zanim cokolwiek innego

**Objaw:** przy materializacji 610M19 w repo nie było pełnego tekstu
Fabuły — sesja researchu (PR-27) streściła dostawę w planie, a wpis
kolekcji miał powstać „później”. Trzeba było prosić właściciela
o ponowne wklejenie tekstu, który już raz przekazał w całości.

**Przyczyna:** procedura materializacji (SZKIELET_KARTY, krok 1) istnieje,
ale research przed materializacją kusi, by „najpierw zbadać, potem
zapisać”. Streszczenie dostawy w planie wygląda jak praca, a jest utratą
danych: wpis jest nienaruszalny i verbatim, skrót nigdy go nie zastąpi.

**Reguła:** w sesji, w której przychodzi dostawa, PIERWSZĄ operacją na
plikach jest `collection/entries/<slug>.md` z pełnym verbatim (frontmatter
+ Fabuła) — przed researchem, roadmapą i snapshotem. Plany i researche
mogą dostawę przywoływać, ale nigdy nie są jej jedynym nośnikiem.

## L17 (2026-09-09) — scalenie PR nie jest akceptacją odchylenia; progi jakości egzekwuje test, nie domysł

**Objaw:** PR-27 utworzył hasło `wybrzeze-mieczy` przy 1 karcie + planie
(zamiast wymaganych 2 kart), a audyt w PR-28 rekomendował je zachować,
bo „PR scalony przez właściciela”. Właściciel: kasować natychmiast —
scalenie nie było akceptacją.

**Przyczyna:** dwie wady naraz. (1) Sesja PR-27 świadomie zeszła poniżej
progu zapisanego w SZKIELET_HASLA i nie zapytała właściciela ani nie
zmieniła reguły. (2) Audyt przyjął, że brak sprzeciwu = zgoda —
a audyt nie ma prawa zakładać akceptacji odchyleń od reguł twardych.

**Reguła:** (a) progi liczbowe (hasła ≥2 karty, kolejne w przyszłości)
są egzekwowane testem regresyjnym (`test/prog-hasel.test.js`) —
strona poniżej progu nie przechodzi suitki; (b) świadome zejście poniżej
twardej reguły wymaga jawnej decyzji właściciela PRZED scaleniem albo
zmiany samej reguły — nigdy domniemania po fakcie.

## L18 (2026-09-10) — pass mapowy to wzbogacenie i weryfikacja wyglądu map T3/T4, nie sprawdzanie pinezek ani modyfikacja T1/T2

**Objaw:** w kroku 4 Pętli Jakości powtarzano mechaniczną kontrolę
„18/18 kart ma pinezkę, map-audit 0”, traktując to jako wystarczający pass mapowy.

**Przyczyna:** mylenie bieżącej kontroli integralności (która dzieje się
automatycznie przy materializacji karty oraz podczas audytu w kroku 1)
z właściwym celem passu mapowego.

**Reguła (decyzja właściciela 2026-09-10):**
1. **Pinezki kart** są z zasady poprawnie dodawane przy materializacji
   i weryfikowane przez automatyczne audyty (`map-audit.py` i testy) —
   nie ma sensu sprawdzać ich co chwilę w kroku 4.
2. **Pass mapowy to wyłącznie praca nad mapami T3 i T4 (podkłady własne/wektorowe):**
   wzbogacanie i weryfikacja ich wyglądu, kwerenda i dodawanie nowych
   kanonicznych POI, ulepszanie biomów, rzek, pasm górskich, naprawa
   kolizji etykiet i rozwój warsztatu rysowania.
3. **Map T1 i T2 nie wzbogacamy:** są to mapy rastrowe (T1) lub
   gotowe/zaadoptowane wektory (T2, np. Śródziemie z mapome). Nie doklejamy
   do nich nowych warstw ani obiektów ponad stan źródłowy (chyba że za
   osobną, wyraźną zgodą właściciela).


## L19 (2026-09-11) — dokumentacja zamknięcia powstaje po ostatnim commicie produktu

**Objaw:** handoff PR-31 ogłaszał finał przy 41 stronach i kończył zakres
na Simian Simulacrum, choć późniejsze commity tego samego otwartego PR
dodały 14 materializacji, Eldraine, Wiedźmina i doprowadziły build do 57
stron. Historia, roadmapa i changelog również zachowały stan pośredni.

**Przyczyna:** dokumenty zamknięcia zostały potraktowane jako jednorazowy
etap sesji, mimo że po ich utworzeniu praca produktowa trwała dalej.
Zielone bramki nie wykrywają, że opis zakresu jest starszy od zmian.

**Reguła:** przed scaleniem zanotuj ostatni commit zmieniający treść, mapę,
kod lub testy. Dopiero po nim aktualizuj historię, roadmapę, changelog i
handoff, a następnie uruchamiaj pełne bramki. Każdy późniejszy commit
produktu unieważnia zamknięcie i wymaga ponownej aktualizacji dokumentów
oraz świeżych wyników. Opis PR pozostaje dokumentem kumulatywnym zgodnie
z L9.
