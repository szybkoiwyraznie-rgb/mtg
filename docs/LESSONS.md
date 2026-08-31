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
