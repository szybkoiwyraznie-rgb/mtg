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
