# PLAN PR-13 (cześć B, 2026-09-02) — Materializacja 137GPT Withstand (Ravnica) + mapa Ravnicy

Właściciel dostarczył trzecią kartę (czat, 2026-09-02):

`137GPT · Withstand · GPT · Ravnica · FABUŁA` (wojownik z tarczą
wieżową z płonącym słońcem, aura ognia, Boros/pogranicze).

Format dostawy v3 spełniony (ADR 0026). Zlecenie ma dwa segmenty:
materializacja karty oraz **nowy plan Ravnica z procesem mapowym**
(właściciel sygnalizuje: research źródeł T2/T3, a gdy brak — plan prac
T4 ze źródeł oficjalnych i fanowskich; oferuje pomoc w transkrypcji
map graficznych na opisy tekstowe).

## Kolejność prac

1. **Archiwum dostawy:** `collection/entries/137gpt-withstand.md`
   (verbatim, nienaruszalne).
2. **Snapshot Oracle:** `scryfall/137gpt-withstand.json` przez
   `fetch_page` (ADR 0004) — pobrany 2026-09-02: Withstand, instant
   {2}{W}, GPT nr 21, common, flavor Alovneka (Boros guildmage).
3. **Kwerenda lore karty:** Boros (filozofia obrony, Sunhome), Alovnek,
   era Guildpact (blok Ravnica: City of Guilds, Decamillennium),
   „withstand" jako tytuł/etymologia, Tenth District i pogranicza
   dzielnic — 2–5 zapytań, wszystkie z URL w Źródłach karty.
4. **Karta Katalogowa** `content/cards/137gpt-withstand.md` wg
   SZKIELET_KARTY (9 sekcji, ADR 0016); Narracja (Fabuła) kotwiczy
   „Transpozycję", „Postacie i Byty", „Na Mapie".
5. **Strona planu** `content/planes/ravnica.md` — kanon settingu
   (plan-miasto, Dekadentyzm/eki gildii, era oryginalnego bloku), tagi
   ze słownika.
6. **Mapa Ravnicy (PROCES_MAP MA1–MA4):**
   - MA1 research: oficjalna mapa Dziesiątego Dystryktu (GRN/D&D
     Guildmasters' Guide) — istnieje jako raster; sprawdzić wektorowe
     przeróbki fanowskie (T2) i opisy tekstowe kanonu (T3/T4);
   - decyzja o wariancie + zapis w `maps/ravnica/map.json` (zrodlo,
     pobrano, rekonstrukcja) albo — gdy podkład nie powstaje w tej
     sesji — jawna roadmapa prac w `docs/plans/` i notka w ROADMAP;
   - pinezka 137GPT zgodnie z wariantem (na mapie gdy powstaje;
     w przeciwnym razie `pinezka: przyblizona` + uzasadnienie wg
     SZKIELET_KARTY krok 6).
7. **Tagi karty** — wyłącznie ze słownika `content/taxonomia.json`
   (nowy tag = świadoma zmiana słownika jednym zdaniem).
8. **Zamknięcie:** co-nowego, PROJECT_HISTORY, handoff PR-13 (update),
   kumulatywny opis PR.

## Kryteria ukończenia

- karta przechodzi wszystkie testy (schemat, parość, scryfall,
  wikilinki, sekcje);
- strona planu Ravnica z realną treścią kanoniczną i źródłami;
- decyzja MA1 o wariancie mapy udokumentowana; jeśli mapa powstaje —
  `map-audit.py ravnica` = 0 i QA rastrowe; jeśli nie — plan prac
  i sekcja „Na Mapie" z poziomem `przyblizona` + roadmapa;
- każdy zielony krok = osobny commit + push.

## Oczekiwania procesowe (z zlecenia)

- Nie malować mapy „z głowy": najpierw faktografia kanoniczna
  (które dzielnice/gildie gdzie; Sunhome; bramy; rzeki/kanały),
  potem geometria. W razie potrzeby: prośba do właściciela o
  transkrypcję z mapy graficznej na opis tekstowy (zaoferowana).
