# ADR 0002: Czysty JavaScript (ESM), zero zależności, node:test

- **Status:** Zaakceptowana
- **Data:** 2026-08-31
- **Decydenci:** właściciel projektu; agent Arena (sesja PR-1)

## Kontekst

Projekt działa w sandboxie sesji agentskich z ograniczonym egresem
(zweryfikowane 2026-08-31: `curl` do api.scryfall.com → kod 000, rejestr
npm → 200) oraz na GitHub Actions. mtg-game przyjął i utrzymał przez 250+
mili kamieni zasadę „zero zależności npm" — brak ryzyka zepsutych
aktualizacji, brak łańcucha dostaw, build w ułamku sekundy, testy bez
instalacji. Ten sam argument obowiązuje tu, z dodatkowym gruntem: baza
będzie żyła latami i przechodzić z sesji na sesję.

## Decyzja

1. **Cały kod projektu to czysty JavaScript w modułach ESM**
   (`src/codex/*.js`, `tools/*.mjs`) — bez transpilacji, bez frameworków,
   bez zależności npm produkcyjnych i deweloperskich. `package.json` nie
   ma sekcji `dependencies` ani `devDependencies`.
2. **Testy: wbudowany runner `node --test`** (`test/*.test.js`), spięty
   runnerem tierów `tools/run-tests.mjs` (fast/slow/all — konwencja
   ADR 0019 mtg-game). Wyjątek dla plików >~5 s do manifestu slow.
3. **Build**: własne sklejanie modułów (`tools/module-graph.mjs` +
   `tools/build.mjs`) — graf importów rozwiązany „najgłębsze pierwsze",
   twardy błąd przy cyklu i kolizji nazw na poziomie modułów (po sklejeniu
   wszystkie moduły dzielą jeden zasięg — ciche nadpisanie symbolu byłoby
   katastrofą debugowalną).
4. Parsery własne i świadomie ograniczone: **frontmatter to ścisły
   podzbiór YAML** (skalary, listy, obiekt jednopoziomowy), **markdown to
   obsługiwany przez renderer podzbiór** — nieznana składnia to błąd
   walidacji, nie ciche przełknięcie.
5. Node >= 22 (`engines`), formatowanie bez prettiera (styl projektu).

## Konsekwencje

**Dodatnie:** instalacja = zero kroków (`npm test` działa od razu); CI
trwa sekundy; żadnych aktualizacji zależności przez lata; kod czyta się
jak dokument.

**Ujemne:** własne parsery wymagają dyscypliny (rozszerzenie składni =
praca w parserze + testy); brak dobrodziejstw ekosystemu (np. pełnego
YAML). Świadomy koszt — wymagany podzbiór jest mały i testowany.

**Granica:** jeżeli kiedyś projekt będzie potrzebował ciężkiej zależności
(np. pełny fuzz do wyszukiwarki), wymaga to nowego ADR zastępującego ten
punkt — nie dopisuje się zależności „przy okazji".
