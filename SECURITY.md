# Zasady bezpieczeństwa repozytorium

## Sekrety

- Do repozytorium nie trafiają żadne sekrety: tokeny, klucze API, hasła,
  dane logowania. Sesje agentskie używają uwierzytelnienia dostarczonego
  przez środowisko (GH_TOKEN) i nigdy go nie zapisują.
- W razie przypadkowego commita sekretu: nie „naprawiać" kolejnym
  commitem — natychmiast zgłosić właścicielowi (sekret pozostaje w
  historii gita mimo usunięcia pliku).

## Ciężkie zasoby

- **`img/` jest gitignorowane na stałe** — to lokalna kolekcja ilustracji
  właściciela (~10 GB, konwencja z mtg-game). Nigdy nie commitujemy jej
  ani fragmentów.
- Obrazy kart są linkowane URL-em ze Scryfalla (ADR 0004), nie pobierane.
- Podkłady map (`maps/<plan>/podklad.*`) są jedyną klasą binariów
  dopuszczoną w repo — pojedyncze MB na plan, świadomie, jako dane
  projektu (ADR 0007).
- Nowa klasa binariów (np. przyszłe grafiki haseł) wymaga ADR z budżetem
  rozmiaru strzeżonym testem.

## Zależności

Projekt ma zero zależności npm (ADR 0002) — nie ma łańcucha dostaw do
pilnowania. Wprowadzenie zależności wymaga ADR i przeglądu właściciela.

## Użytek prywatny

Repozytorium zawiera treści fanowskie i transpozycje IP (użytek prywatny
właściciela, decyzja 2026-08-31). Ewentualne upublicznienie wymaga
przeglądu treści i podkładów map pod kątem licencji — to świadoma decyzja
właściciela, nie krok domyślny.

## Dostęp

- Gałąź `main` chroniona rulesetem: zmiany wyłącznie przez PR, zakaz
  force push i usuwania gałęzi, scalanie tylko `Squash and merge`
  (`docs/WORKFLOW.md`).
- Bypass list pozostaje pusta — zasady obowiązują wszystkich.
