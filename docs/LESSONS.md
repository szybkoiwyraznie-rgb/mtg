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
(wyłącznie infoboks, ADR 0014). Zbieżność numerów przy wcześniejszych
kartach (137GPT, 2BFZ) była przypadkowa.

**Reguła:** imgId i slug karty bierze się WYŁĄCZNIE z dostawy
właściciela (ADR 0011); Scryfall dostarcza metadanych wydruku, nie
klucza kolekcji. Nie „korygować” numerów dostawy na podstawie Scryfalla
— najwyżej udokumentować oba numery w snapshotcie (`notka_numery`).

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

