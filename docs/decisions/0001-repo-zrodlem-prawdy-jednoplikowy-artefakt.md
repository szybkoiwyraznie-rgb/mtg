# ADR 0001: Repozytorium jako jedyne źródło prawdy bazy; statyczna witryna i jednoplikowy artefakt

- **Status:** Częściowo zastąpiona — jednoplikowość artefaktu w części
  podkładów map zastępuje ADR 0027 (mapy jako osobne pliki `dist/maps/**`
  ładowane na żądanie); repozytorium jako źródło prawdy i statyczna
  witryna w mocy
- **Data:** 2026-08-31
- **Decydenci:** właściciel projektu; agent Arena (sesja PR-1)

## Kontekst

MTG Lore Codex to „wikipedia" lore prywatnej kolekcji MtG: Karty Katalogowe
(materializacje dostarczonych kart), Karty Haseł (wspólne elementy świata),
rejestry planów, mapy i strona główna. Właściciel korzysta z bazy w dwóch
trybach: **lokalnie z dysku** (w tym na iPadzie/iPhonie, bez serwera HTTP —
`file://`) oraz **przez GitHub Pages** poza domem i na urządzeniach
mobilnych. Sesje agentskie startują od zera: jedyne, co przetrwa do
następnej sesji, to gałąź `main` na GitHubie i tekst pierwszego promptu.

Projekt siostrzany mtg-game rozwiązał już dokładnie ten problem
(ADR 0011 mtg-game: „Modularne źródła, jednoplikowy artefakt i dwa tryby
uruchomienia") — warto dziedziczyć sprawdzoną technikę zamiast wymyślać
nową.

## Decyzja

1. **Cała baza wiedzy to pliki w repozytorium** — markdown z frontmatterem
   (`content/`), surowe wpisy kolekcji (`collection/`), snapshoty Scryfalla
   (`scryfall/`), dane map (`maps/`). Nie ma bazy danych, CMS-a ani stanu
   poza gitem. Repozytorium jest jedynym źródłem prawdy.
2. **Witryna jest statyczna i budowana**: `node tools/build.mjs` czyta
   repozytorium i produkuje **jeden plik HTML** — `dist/mtg-lore-codex.html`
   (na Pages: `dist/index.html`) — z całą treścią wstrzykniętą jako dane
   JSON i modułami JS sklejonymi w jeden skrypt.
3. **Dwa tryby uruchomienia, jeden artefakt**: lokalnie działa z `file://`
   (moduły ES są sklejane, więc nie ma żądań cross-origin z originu
   `null`); ten sam artefakt publikuje się na GitHub Pages.
4. **Nawigacja po hashu** (`#/karta/<slug>`, `#/haslo/<slug>`,
   `#/plan/<slug>`, `#/mapa/<slug>`, `#/tag/<tag>`, `#/co-nowego`) —
   jedyny mechanizm „linków", który działa identycznie z `file://`
   i przez HTTPS.
5. Navigacja między stronami, wyszukiwanie, backlinki i tagi liczy się
   **w czasie builda** i wstrzykuje jako gotowe dane; przeglądarka nie
   fetchuje niczego poza obrazami (druk Scryfalla) i to wyłącznie online.
6. `dist/` nie trafia do repozytorium (gitignore); CI buduje artefakt
   i publikuje na Pages po każdym scaleniu do `main`.

## Konsekwencje

**Dodatnie:** każda sesja i właściciel mają pełną bazę w gicie (diffy,
historia, grep); artefakt działa offline na urządzeniach bez serwera;
deploy na Pages jest trywialny; brak infrastruktury do utrzymania.

**Ujemne:** rozbudowa treści nieco spuchnie artefakt (tekst jest tani —
setki stron to pojedyncze MB; obrazy NIE są wstrzykiwane, tylko linkowane);
każda zmiana treści wymaga przebudowania artefaktu (robi to CI);
wyszukiwarka jest ograniczona do indeksu zbudowanego w czasie builda.

**Co to znaczy dla sesji:** treść pisze się w plikach markdown, nigdy w
HTML-u; po zmianach uruchamia się `npm run build` i sprawdza artefakt;
żaden stan „tylko lokalnie na stronie" nie istnieje.
