# Workflow pracy w repozytorium — instrukcja dla właściciela

Jak w praktyce klikać w GitHubie, żeby zmiany trafiały do `main`. Pisany
prostym językiem, bez znajomości gita od kuchni. Konwencja dziedziczona z
mtg-game.

## Najkrótsze streszczenie

1. Nikt (również właściciel) nie zapisuje zmian bezpośrednio w `main`.
2. Każda zmiana powstaje na osobnej gałęzi i trafia do `main` przez
   **Pull Request**.
3. Właściciel czyta PR, ewentualnie komentuje, i **sam decyduje** o scaleniu.
4. Scalanie wykonujemy przyciskiem **Squash and merge**.

## Codzienna ścieżka (sesja agentska)

1. Sesja Areny pracuje na swojej gałęzi (`arena/…`) i samodzielnie otwiera
   PR na starcie pracy (reguła ADR sesyjnych z `AGENTS.md` §1).
2. Właściciel dostaje link do PR. W PR widzi: opis co i dlaczego, listę
   commitów (każdy samodzielnie „zielony"), wyniki CI.
3. Jeśli coś budzi wątpliwości — komentarz w PR; sesja odpowiada i dokłada
   commity (PR żyje, dopóki właściciel go nie scali).
4. Scalenie: przycisk **Squash and merge**. Gałąź kasuje się automatycznie
   (delete branch on merge).
5. Po scaleniu CI publikuje nową wersję witryny na GitHub Pages.

## Jak dostarczyć kartę do materializacji

Najprościej: wklej w czacie sesji Areny wpis w formacie z
`docs/guides/SZKIELET_KARTY.md` (sekcja „Format dostawy"). Można też
otworzyć issue „Materializacja karty" (szablon `.github/ISSUE_TEMPLATE/`)
i wkleić dane tam — sesja zabierze temat przy najbliższej pracy.

## Jak coś poprawić samemu

1. Edytuj plik markdown w `content/` bezpośrednio na GitHubie (przycisk
   ołówka) — GitHub sam utworzy gałąź i PR.
2. Albo wklej poprawkę w czacie sesji — agent wprowadzi ją jako commit w
   swoim PR.
3. **Wyjątek:** `collection/entries/` — wpisy są verbatim; poprawka
   treści wpisu zawsze przez właściciela (każdy inny przykład to zgłoszenie,
   nie edit).

## Ochrona `main`

| Zasada | Ustawienie |
|---|---|
| Ochrona gałęzi | ruleset „Protect main" (wymagany PR) |
| Bezpośredni push | zabroniony |
| Force push / usunięcie | zabronione |
| Wymagane approvals | 0 (jeden decydent — świadomie) |
| Rozwiązanie komentarzy | wymagane |
| Metoda scalania | Squash and merge (jedyna włączona) |

## Dobre praktyki przy review PR

- Patrz na testy: nowa treść bez zielonego `npm test` to dług.
- W PR treściowych sprawdź sekcję Źródła — cytowania są obowiązkiem
  (ADR 0003), nie ozdobnikiem.
- Jeśli PR dotyczy map — sprawdź, czy pinezki mają uzasadnienie lore
  (poziom pewności + opis), a nie „wyglądało dobrze".
- Pytaj w komentarzach śmiało — każdy wniosek trwały agent ma obowiązek
  przenieść do ADR/LESSONS.
