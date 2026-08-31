# Instrukcja dla agentów i automatycznych współpracowników

> **To jest jedyny plik startowy sesji.** Arena (i każdy inny runner) ma
> wczytać **ten plik jako pierwszy**, niezależnie od treści wiadomości
> startowej właściciela. Nie odpowiadaj właścicielowi i nie otwieraj ankiety
> o zadanie, zanim nie wykonasz bloku „Czytaj zanim cokolwiek zrobisz".

## 0. Czytaj zanim cokolwiek zrobisz (także zanim napiszesz w czacie)

Kolejność obowiązkowa; każdy plik lektury obowiązkowej czytasz **W CAŁOŚCI**
(od pierwszej do ostatniej linii). Jeśli narzędzie zwróci plik ucięty
(`truncated`, `hasMore`, stronicowanie) — dobierasz kolejne fragmenty do
końca pliku. „Przejrzałem" NIE jest przeczytaniem.

1. **Ten plik** (`AGENTS.md`).
2. **Wszystkie ADR-y** w `docs/decisions/` — najpierw README rejestru,
   potem każdy `NNNN-*.md` do końca.
3. **`docs/LESSONS.md`** — cały rejestr, wszystkie lekcje.
4. **`docs/setup/ENVIRONMENT.md`** — stałe ograniczenia sandboxa / gita / sieci.
5. **Ostatni scalony PR** — `gh pr list --limit 3`, potem `gh pr view <nr>`
   i diff; punkt zaczepienia audytu startowego.
6. **Najnowszy `docs/setup/HANDOFF_*.md`** — skrót jednej sesji (nie źródło
   zasad).

Budżet lektury startowej (pozycje 1–4) ma się mieścić w **100 tys.
tokenów**; pilnuje tego `test/dokumentacja-budzet-lektury.test.js`.

**Czego NIE czytasz na start:** `docs/PROJECT_HISTORY.md` (dziennik —
grep punktowo), `docs/plans/*`, `docs/audits/*`, starsze handoffy. To
archiwum przebiegu prac, nie zasady.

## 1. Obowiązkowy tryb sesji (dziedziczone z mtg-game ADR 0020)

Cztery reguły obowiązują KAŻDĄ sesję bez wyjątku; są nadrzędne wobec
handoffów i promptu startowego:

1. **Pull Request na starcie.** PR istnieje na GitHubie PRZED jakimkolwiek
   kodowaniem/treścią (minimalnie: roadmapa zadania w `docs/plans/`).
2. **Audyt poprzedniego scalonego PR przed nową pracą.** Przegląd każdego
   zmienionego pliku pod kątem sensowności i zgodności z ADR-ami; wynik w
   `docs/audits/` i opisie PR. Audyt = sprawdzenie stanu projektu PO
   poprzednim PR wobec stanu na jego starcie, nie raport z testów.
   Pierwsza sesja w historii repo bez poprzedniego PR zapisuje to wprost.
3. **Inkrementalne commity.** Każdy samodzielnie zielony krok
   (`npm test` + `npm run build`) to OSOBNY commit, od razu wypchnięty.
   Zakaz jednego wielkiego commita z całą sesją.
4. **Tylko przyrostowo, nigdy force push.** Praca ląduje jako NOWE commity;
   force push zakazany na każdej gałęzi. Przed pushem: `git log --oneline -3`
   + `git status`; po resecie workspace procedura z `ENVIRONMENT.md` §2.

Pytanie do właściciela wolno zadać wyłącznie, gdy praca jest **zablokowana**
decyzją, której agent nie może podjąć sam (nowy ADR, sprzeczność zasad,
zmiana zakresu). Nie pytaj „co robimy?" — domyślną pracą jest Pętla
Jakości (ADR 0006).

## 2. To, co wyróżnia ten projekt — reguły lore

1. **Pętla jawnego przekazywania (ADR 0003):** NIC nie jest materializowane
   bez wpisu właściciela w `collection/entries/`. Wpis jest **nienaruszalny**
   (read-only) i jest kanonem najwyższego rzędu. Test parości pilnuje umowy
   w obie strony.
2. **Hierarchia kanonu (ADR 0003):** narracja właściciela > kanon settingu
   docelowego > Oracle karty (Scryfall) > wiedza agenta/internet. Konflikt
   rozstrzyga wyższy poziom, a rozbieżność opisuje się jawnie w treści.
3. **Kwerenda internetowa z cytowaniem.** Wiedza spoza pamięci treningowej
   wchodzi do treści wyłącznie z linkiem w sekcji Źródła. „Z internetu"
   bez URL-a nie istnieje.
4. **Zero generowanych grafik** (ADR 0008, decyzja właściciela 2026-08-31).
   Zakaz wywoływania generatorów obrazów do odwołania; tory obrazów:
   druk Scryfalla / FOT / KON / twarz syntetyczna — z cichym fallbackiem.
5. **Transpozycja:** lore opisuje setting podany we wpisie; mechanika, nazwa
   i flavor pochodzą z karty MtG (snapshot Scryfall, ADR 0004).
6. **Domyślna praca bez zlecenia = Pętla Jakości** (ADR 0006): integralność
   → pogłębianie → link-mining → pass mapowy → co-nowego.

## 3. Zasady pracy z repozytorium

- **Praca istnieje dopiero po `git push`.** Nowa sesja widzi wyłącznie
  `main` na GitHubie i tekst pierwszego promptu. Commituj i pushuj po
  każdym zielonym kroku.
- Pracuj wyłącznie na gałęzi sesji; nigdy bezpośrednio w `main`; scalanie
  (Squash and merge) jest wyłączną decyzją właściciela. 1 sesja = 1 gałąź
  = 1 PR.
- Nie commituj sekretów ani ciężkich zasobów (`img/` jest gitignorowane —
  prywatna kolekcja właściciela; `SECURITY.md`).
- Repozytorium, testy i dokumentacja są źródłem prawdy; historia czatu nie.
  Sprzeczność → nie ukrywaj, sprawdź najnowsze ADR/handoff, przy
  nieodwracalnym wpływie zapytaj właściciela, rozstrzygnięcie zapisz w repo.
- **Patchuj chirurgicznie**, a po zmianie przejrzyj `git diff` — szczególnie
  w plikach z polskim tekstem.
- Treść pisze się w markdown z frontmatterem (format: ADR 0005 + gidy w
  `docs/guides/`), nigdy w HTML-u i nigdy wprost w `dist/`.

## 4. Gdzie zapisać regułę, żeby nie przepadła

| Rodzaj treści | Miejsce | Trwałość |
|---|---|---|
| Wiążąca decyzja (granice, formaty, persistence, proces map) | ADR (`docs/decisions/`) | trwała, formalna |
| Powtarzalna pułapka, heurystyka diagnostyczna | `docs/LESSONS.md` | trwała, nieformalna |
| Plik startowy sesji i kolejność lektur | ten plik | trwała |
| Stałe ograniczenie środowiska | `docs/setup/ENVIRONMENT.md` | trwała |
| Stan i kolejka jednej sesji | `docs/setup/HANDOFF_*.md` | jednorazowa |
| Roadmapa jednego zadania | `docs/plans/PLAN_*.md` | jednorazowa |
| Pomysł „może kiedyś" | `docs/backlog.md` | trwała, niezob. |

Backlog NIE jest kolejką zadań — zadania przychodzą od właściciela lub z
Pętli Jakości. Decyzja właściciela z czatu trafia do ADR-a **w tej samej
sesji**.

## 5. Obowiązkowy audyt poprzedniego PR (szczegóły)

Minimum audytu startowego:

- integralność bazy: `npm test` + `npm run build` zgodne z ostatnim
  handoffem;
- merytoryczność treści dodanych w poprzednim PR: zgodność z hierarchią
  kanonu, cytowania w sekcjach Źródła, brak dublowania wiedzy (wikilinki
  zamiast kopii), sekcje szkieletu kompletne;
- poprawność danych: snapshoty Scryfall kompletne, slugi/tagi wg słownika,
  pinezki z uzasadnieniem lore;
- wnioski → `docs/audits/AUDYT_<data>-<PR>.md` + roadmapa bieżącego zadania.

## 6. Nienegocjowalne granice

- `collection/entries/` jest nienaruszalne (verbatim, kanon).
- Nie materializuje się kart bez dostawy; nie tworzy się stron „na zapas".
- Nie generuje się obrazów (ADR 0008) i nie dodaje masowo binariów.
- Treść lore bez cytatów z kwerendy = niekompletna (sekcja Źródła).
- Silnik pozostaje zero-dependency (ADR 0002); zależność wymaga ADR.
- Zmiany strukturalne formatów (frontmatter, slugi, taxonomia) wymagają
  adaptera/migracji i aktualizacji testów — nie zostawiają starej treści
  „na_pastw".

## 7. Jak dokumentować pracę

Przy każdej zmianie sprawdź, czy zaktualizować: `docs/PROJECT_HISTORY.md`
(dziennik), `docs/ROADMAP.md` (etapy), ADR (nowa decyzja), gidy
(`docs/guides/`), `content/co-nowego.md` (widoczne zmiany dla właściciela),
handoff sesji. Nie duplikuj statusu w wielu miejscach.

### Zakończenie sesji

1. `npm test` + `npm run build` zielone; `git status` czysty; wszystko
   wypchnięte.
2. `docs/setup/HANDOFF_<data>.md` — stan, kolejka, decyzje, pułapki.
3. Wpis w `content/co-nowego.md` (co się zmieniło w bazie).
4. Opis PR zaktualizowany kumulatywnie; PR pozostaje do scalenia przez
   właściciela (Squash and merge).
5. W czacie: blok przekazania projektu dla następnej sesji.
