# Środowisko sesji agentskiej — ograniczenia i pułapki (dokument trwały)

> **To NIE jest handoff.** Handoff opisuje jedną sesję; ten plik zbiera
> **stałe właściwości środowiska**, które dotyczą każdej sesji.
> Konwencja dziedziczona z mtg-game (tamten plik zbierał pułapki
> wielokrotnie łapane w praktyce).

Powiązania: `AGENTS.md` (tryb sesji), `docs/LESSONS.md` (lekcje
diagnostyczne, w szczególności L1).

---

## 1. Sieć i narzędzia (zweryfikowane empirycznie 2026-08-31, sesja PR-1)

| Co | Stan | Konsekwencja praktyczna |
|---|---|---|
| `curl https://api.scryfall.com/...` | **zablokowany** (kod 000) | Oracle pobiera się narzędziem `fetch_page` (API działa, zweryfikowane na karcie Dunland Crebain) i zapisuje jako snapshot (ADR 0004) |
| `fetch` w Node (egress HTTPS ogólnie) | zablokowany | build/testy nie mogą pobierać niczego z sieci — muszą działać na plikach w repo |
| `registry.npmjs.org` | **działa** (200) | `npm i` wykonalne, gdyby kiedyś powstał katalog narzędzi z zależnościami dev (dziś: zero deps, ADR 0002) |
| Node / Python | Node v22.22.3, Python 3.11.2 | `engines: node >=22`; skrypty pomocnicze w python3 dostępne |

Reguła L1: przed poleganiem na ograniczeniu/braku ograniczenia — zmierz.
Fakty wyżej obowiązują do odwołania (aktualizacja tylko z pomiarem
i datą).

## 2. Sandbox potrafi zresetować workspace w trakcie sesji

**Objaw:** `HEAD` nagle wskazuje `main`, commity sesji „znikają",
`git push` odrzucony (non-fast-forward), w `git reflog` świeży wpis
„clone: from …".

**To nie jest utrata pracy — o ile commity były wypchnięte.**

```bash
git reflog -10                                  # potwierdź reset
git ls-remote --heads origin                    # praca na zdalnej gałęzi?
git fetch origin arena/<slug-sesji>
git reset --hard FETCH_HEAD                     # odtwórz historię sesji
```

Jeśli po resecie zacommitowałeś na `main`: `git branch backup-<opis>
<sha>` → `git fetch origin <gałąź-sesji>` → `git reset --hard FETCH_HEAD`
→ `git cherry-pick <sha>`.

**Profilaktyka:** pushuj po każdym zielonym commicie; po commicie
sprawdź `git log --oneline -1`; przed długą operacją (duży build, pełne
testy) upewnij się, że praca jest na zdalnej gałęzi.

## 3. Git i GitHub

- **Praca istnieje dopiero po `git push`** (L2). Nowa sesja widzi tylko
  `main` na GitHubie i tekst pierwszego promptu.
- `GH_TOKEN` potrafi wygasnąć w trakcie sesji. Objaw: push prosi o hasło,
  `gh auth status` mówi *token no longer valid*. Commity lokalne są
  bezpieczne — poproś właściciela o reconnect GitHub w Arenie i ponów
  push. **Nigdy nie proś o token w czacie.**
- `gh pr edit` bywa odrzucane błędem GraphQL — obejście:
  `gh api -X PATCH repos/<owner>/<repo>/pulls/<nr> -f title=… -F body=@plik`.
- **Token bota Areny nie ma uprawnienia `workflows`** (zweryfikowane
  2026-09-01): push gałęzi ze zmianą w `.github/workflows/` jest odrzucany
  (`refusing to allow a GitHub App to create or update workflow … without
  'workflows' permission`), a `POST /repos/…/pages` zwraca 403. Konsekwencje:
  zmiany workflowów (CI/Pages) i włączanie usług repozytorium wykonuje
  **właściciel**; agent przygotowuje treść zmiany w docs (plan/lekka
  łataka w backlogu), nie w `.github/`.
- **Bot nie ma też `actions: write`** (zweryfikowane 2026-09-01):
  `gh workflow run` → 403, `gh run rerun` bywa odmawiane. Odpalanie/
  rerun workflowów (gdy nie ma naturalnego triggera pushu do main)
  wykonuje właściciel w UI Actions.
- Komunikaty commitów pisz do pliku **poza repo** (np. `/home/user/msg.txt`),
  żeby nie trafiły do commita.
- Gałąź sesji to `arena/<id>`; nigdy nie pushuj do `main` (ochrona i tak
  odrzuci).

## 4. Polskie znaki i edycja plików (zweryfikowane 2026-08-31)

- `write_file` i `edit_file` **zachowują UTF-8** w tym sandboxie
  (test: „Zażółć gęślą jaźń…" bit w bit). W mtg-game `edit_file` psuł
  polskie znaki — tu nie (pomiar L1).
- `edit_file` **nie działa poza workspace** (błąd zapisu) — pliki
  tymczasowe narzędzi trzymaj w workspace albo użyj `bash`/`python3`.
- Fallback pozostaje: edycja przez `python3` + `pathlib` z
  `encoding='utf-8'` — użyj, gdy po edycji `git diff` pokaże coś
  podejrzanego w polskich znakach.
- Po każdej edycji treści lore przejrzyj `git diff` — to tania
  samokontrola (zasada chirurgicznego patchowania z AGENTS.md §3).

## 5. Czas wykonania (orientacyjnie, pusta/mała baza)

| Operacja | Czas |
|---|---|
| `npm test` | ~1 s (rośnie z liczbą stron) |
| `npm run build` | <1 s |
| pełne testy + build w CI | ~30–60 s z checkoutem |

Benchmarków tu nie ma (to baza wiedzy, nie engine) — jeśli jakiś test
przekroczy ~5 s samodzielnie, trafia do manifestu slow
(`tools/test-manifest.json`, konwencja tierów z mtg-game).

## 6. Checklista startu sesji

1. `git log --oneline -3` i `git status` — gdzie jestem, czy czysto.
2. Lektura obowiązkowa (AGENTS.md §0) — CAŁA, w kolejności.
3. Otwórz PR sesji (nawet jeśli na starcie zawiera tylko roadmapę w
   `docs/plans/`).
4. `npm test` + `npm run build` — porównaj z najnowszym handoffem.
5. Audyt poprzedniego scalonego PR (AGENTS.md §5) przed nową pracą.
6. Nie pytaj „co robimy?" — domyślna praca to Pętla Jakości (ADR 0006);
   zlecenia materializacji przychodzą wyłącznie od właściciela.

## 7. Checklista przed końcem sesji

1. `npm test` i `npm run build` zielone.
2. Wszystko zacommitowane **i wypchnięte** (`git status` czysty).
3. `docs/setup/HANDOFF_<data>.md` opisuje stan; `content/co-nowego.md`
   ma wpis sesji; opis PR zaktualizowany kumulatywnie.
4. Reguły trwałe wylądowały w ADR/LESSONS/AGENTS.md, nie tylko w handoffie.
