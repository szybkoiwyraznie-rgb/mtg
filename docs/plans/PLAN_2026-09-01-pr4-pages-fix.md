# PLAN 2026-09-01 (PR-4): Naprawa publikacji GitHub Pages

> Zgłoszenie właściciela: „artefakt na pages nie działa — failed to deploy".

## Objaw

Wszystkie trzy uruchomienia workflow `Publikacja na GitHub Pages` (od powstania
`pages.yml`) kończą się failure. Ostatni run (33480462084, po scaleniu PR #6)
pada na kroku `actions/configure-pages@v5` w 13 s — checkout, testy i build
są zielone, `upload-pages-artifact` oraz `deploy-pages` pominięte.

## Diagnoza (przyczyna źródłowa)

Adnotacja check-runu (99768702176):

> `HttpError: Get Pages site failed. Please verify that the repository has
> Pages enabled and configured to build using GitHub Actions, or consider
> exploring the 'enablement' parameter for this action. Error: Not Found`

- `GET /repos/szybkoiwyraznie-rgb/mtg/pages` → **404** — strona Pages nigdy
  nie została włączona dla repozytorium (żaden deploy nigdy nie wystartował).
- Workflow jest poprawny; problem to brak site'a, nie błąd builda.
- Repo jest **publiczne** → Pages dostępny na planie Free, nie ma przeszkód
  planowych.
- API włączenia site'a z tokenem bota Areny → 403 (wymaga admina), więc
  naprawa musi być repo-side albo jednym kliknięciem właściciela.

## Rozwiązanie (wybrane)

1. `actions/configure-pages@v5` z parametrem **`enablement: true`** — akcja
   sama utworzy site Pages (`build_type: workflow`), gdy nie istnieje.
   Workflow ma już `permissions: pages: write`, więc `GITHUB_TOKEN` jest
   uprawniony. To samo w sobie sugeruje komunikat błędu akcji.
2. Podbicie `actions/checkout@v4` → `@v5` i `actions/setup-node@v4` → `@v5`
   w `pages.yml` — usuwa ostrzeżenie o deprekacji Node 20 na runnerach
   (adnotacja runu). Analogiczne podbicie w `ci.yml` — kosmetyka, do backlogu.
3. **Test empiryczny przed scaleniem:** `gh workflow run pages.yml --ref
   arena/01a05bc9-mtg` (workflow ma `workflow_dispatch`) — deploy z gałęzi
   sesji musi przejść na zielono; wtedy site będzie istniał i publikował.
4. Plan B (gdyby `enablement` nie wystarczył): właściciel włącza ręcznie
   Settings → Pages → Source: **GitHub Actions** (jedno kliknięcie),
   potem re-run workflowu.

## Kroki

| # | Kroki | Commit |
|---|---|---|
| 1 | Ten plan + audyt PR #6 (`docs/audits/AUDYT_2026-09-01-PR6.md`), otwarcie PR | 1 |
| 2 | Fix `pages.yml` (`enablement: true` + podbicie akcji) | 2 |
| 3 | `workflow_dispatch` na gałęzi sesji → weryfikacja zielonego deployu | — |
| 4 | Lekcja L6 w `docs/LESSONS.md` (configure-pages wymaga site'a / enablement), wpis w `content/co-nowego.md`, `PROJECT_HISTORY`, handoff, opis PR | 3 |

## Granice

- Zero zmian treści lore i silnika — naprawa jest czysto infrastrukturalna.
- Gałąź sesji `arena/01a05bc9-mtg`; scalanie (Squash and merge) — właściciel.
