# Handoff — 2026-09-03 — PR #13, korekta LORE-first i mapa Ravniki v3

## Stan

- Gałąź: `arena/01a063dc-mtg`.
- PR: #13 (`https://github.com/szybkoiwyraznie-rgb/mtg/pull/13`), nadal praca w tym samym PR.
- Powód sesji: feedback właściciela do podglądu — wpis *Withstand* był zbyt
  techniczno-wydawniczy; Codex ma być LORE-first. Druga uwaga: mapa Ravniki
  v2 jest OK, ale właściciel chce rozważyć wektoryzację przesłanej fan-made
  mapy jako dokładniejszego podkładu.

## Zrobione

1. **ADR 0030** — `Karta Katalogowa LORE-first`:
   - metryka techniczna tylko w infoboksie;
   - główna treść zaczyna się sekcją `Kronika Lore`;
   - `Mechanika jako Opowieść` stoi pod koniec, bezpośrednio przed `Źródłami`;
   - ADR 0016 oznaczony jako częściowo zastąpiony.
2. **Szkielet i testy**:
   - `docs/guides/SZKIELET_KARTY.md` przepisany pod LORE-first;
   - `src/codex/registry.js` ma nową listę sekcji;
   - fixture i testy UI/wiki-stats zaktualizowane, żeby pilnować nowego
     układu i braku sekcji `Metryka i Kontekst Świata`.
3. **Migracja kart**:
   - `content/cards/1ltr-dunland-crebain.md` przepisany w tonie kroniki
     zwiadu Sarumana;
   - `content/cards/2bfz-coralhelm-guide.md` przepisany jako opowieść o
     wiedzy terenowej merfolków Tazeem;
   - `content/cards/137gpt-withstand.md` przepisany od podstaw: Boros,
     tarcza, bruk Dziesiątego Dystryktu, bez epatowania historią wydania.
4. **ADR 0031** — prywatne źródła fanowskie mogą być bazą wektoryzacji map:
   - raster źródłowy domyślnie poza gitem;
   - wynik SVG/scena z jawną proweniencją i QA;
   - nie odrzucać zadania wyłącznie z powodu licencji, jeśli właściciel
     dopuszcza prywatne użycie.
5. **Ravnica v3**:
   - `maps/ravnica/zrodlo-fanowska-wektoryzacja.md` zapisuje źródło
     `TenthDistrict.png` jako kandydat do wektoryzacji;
   - `maps/ravnica/mapa-analiza.md`, `maps/ravnica/map.json` i ROADMAP mają
     v3 jako kolejny krok.

## Ważna pułapka

System UI pokazał załącznik `TenthDistrict.png`, ale narzędzia w sandboxie nie
widziały pliku pod `/home/user/uploads/TenthDistrict.png` (sprawdzone w tej
sesji: katalog `/home/user/uploads` nie istniał). Dlatego **nie wykonano jeszcze
mechanicznej wektoryzacji**. Następna sesja/turn musi najpierw zapewnić realny
plik w sandboxie albo poprosić właściciela o ponowne dołączenie tak, by plik był
czytelny dla narzędzi.

## Weryfikacja

- `python3 tools/map-audit.py ravnica` — 0 problemów.
- `npm test` — 102/102 zielone.
- `npm run build` — zielony; artefakt główny 303.2 kB, ZIP 12733.8 kB,
  `maps/ravnica.html` 660.7 kB.

Stan końcowy tej porcji powinien pozostać: zielone testy/build, commit na `arena/01a063dc-mtg`, push do PR #13 oraz kumulatywny opis PR.

## Kolejne kroki

1. Jeśli właściciel chce mapę Ravniki v3: najpierw uzyskać realny
   `TenthDistrict.png` w sandboxie, potem trace/porównanie/QA; nie commitować
   rastra bez osobnej decyzji.
2. Jeżeli właściciel dalej krytykuje styl kart: korygować treść, ale trzymać
   zasadę ADR 0030 — lore w otwarciu, technikalia w infoboksie i mechanice.
3. Standardowe domknięcie każdej sesji: `npm test`, `npm run build`, commit
   przez plik wiadomości poza repo, push na `arena/01a063dc-mtg`, opis PR.
