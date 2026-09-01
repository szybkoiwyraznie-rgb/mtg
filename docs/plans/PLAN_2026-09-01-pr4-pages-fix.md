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

## Rozwiązanie (wykonane — korekta po decyzji właściciela 2026-09-01)

Właściciel wybrał plan B z listy poniżej: **włącza Pages ręcznie**
(Settings → Pages → Source: GitHub Actions), a wymóg „każdy push do main
aktualizuje Pages" jest **już spełniony** przez istniejący wyzwalacz
`on: push: branches: [main]` w `pages.yml` (ten sam mechanizm co
w pozostałych projektach właściciela). Po włączeniu site'a wystarczy
re-run nieudanego runu (albo scalenie PR #7) — dalsze publikacje idą
automatycznie przy każdym pushu do main.

Z commitów z tego planu zrealizowano:

1. Plan + audyt PR #6 → PR #7 (commit 1).
2. ~~`enablement: true` + podbicie akcji~~ — **zdjęte**: push zmian
   w `.github/workflows/` jest odrzucany dla tokena bota Areny (brak
   uprawnienia `workflows`; ENVIRONMENT §3), a przy ręcznie włączonym
   site'u parametr jest zbędny. Wiedza zapisana w L6; ewentualne podbicie
   akcji (deprekacja Node 20) — do backlogu, jako zmiana właściciela.
3. Weryfikacja: re-run deployu na main po włączeniu site'a przez
   właściciela → run zielony, strona żyje (wynik poniżej).
4. Lekcja L6 (LESSONS), notka w ENVIRONMENT §3, wpis w co-nowego,
   PROJECT_HISTORY, handoff.

### Oryginalne warianty (do wyboru były)

1. `actions/configure-pages@v5` z `enablement: true` — akcja sama utworzy
   site Pages (`build_type: workflow`), gdy nie istnieje. Workflow ma już
   `permissions: pages: write`, więc `GITHUB_TOKEN` jest uprawniony.
2. **Właściciel włącza ręcznie** Settings → Pages → Source:
   **GitHub Actions** (jedno kliknięcie), potem re-run workflowu. ← WYBRANE

## Kroki

| # | Kroki | Commit |
|---|---|---|
| 1 | Ten plan + audyt PR #6 (`docs/audits/AUDYT_2026-09-01-PR6.md`), otwarcie PR | 1 (wypchnięty) |
| 2 | ~~Fix `pages.yml`~~ → zdjęty (brak uprawnienia `workflows`; zbędny przy ręcznym włączeniu) | — |
| 3 | Właściciel włącza Pages (Settings → Source: GitHub Actions); sesja: re-run deployu + weryfikacja | — |
| 4 | Lekcja L6 w `docs/LESSONS.md`, notka ENVIRONMENT §3, wpis w `content/co-nowego.md`, `PROJECT_HISTORY`, handoff, opis PR | 2 |

## Wynik weryfikacji

_(uzupełnione po włączeniu Pages przez właściciela)_

## Granice

- Zero zmian treści lore i silnika — naprawa jest czysto infrastrukturalna.
- Gałąź sesji `arena/01a05bc9-mtg`; scalanie (Squash and merge) — właściciel.
