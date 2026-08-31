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

## L1 (2026-08-31, dziedziczona z mtg-game) — przed pracą sprawdzaj empirycznie, które ograniczenia sandboksа faktycznie obowiązują

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
