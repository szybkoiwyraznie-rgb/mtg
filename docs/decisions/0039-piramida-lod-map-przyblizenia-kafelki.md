# ADR 0039: Piramida LOD map — podmapy-przybliżenia, kafelki i procedura docelowa

- **Status:** Zaakceptowana
- **Data:** 2026-09-08
- **Decydenci:** właściciel projektu (decyzja w czacie 2026-09-08:
  pełna konwencja LOD, fallback do mapy bazowej, procedura „od razu
  docelowo, bez półśrodków"); agent Arena (sesja PR-24)
- **Zastępuje:** nic; precyzuje ADR 0032 (dwa rodzaje podmap),
  rozszerza ADR 0035 (warianty o zasięg zoomu — do implementacji),
  koryguje założenie robocze agenta o „jednym artefakcie" (por. Kontekst)
- **Powiązania:** ADR 0007 (T1 hybryda), ADR 0008 (FOT/KON poza ZIP-em),
  ADR 0027 (drzewo map, iframe, ZIP), ADR 0031 (fan-raster),
  ADR 0032 (podmapy-światy), ADR 0033 (jedna mapa), ADR 0035 (warianty,
  układ złoty), ADR 0038 (drabina)

## Kontekst

Trzy ustalenia z sesji PR-24 zbiegły się w jedno:

1. **Dominaria nie mieści się w pierwszym renderze.** Master
   `Dominaria_by_Varghedin.jpg` (8100×5200, 9,65 MB) jest za ciężki
   na start, a pinezka 40USG wymaga detalu Benalii niewidocznego na
   mapie świata (research v2: Benalia to drobny napis na zachodnim
   wybrzeżu Aerony).
2. **Słowem „podmapa" nazywano dwa różne zjawiska.** Final Fantasy to
   osobne światy bez relacji przestrzennej (przełącznik stron,
   mechanizm ADR 0032, `pinezka.mapa`). Dominaria to przybliżenia
   wycinka wspólnego globu (ciągły zoom). Jeden mechanizm nie powinien
   udawać obu.
3. **Dystrybucja to drzewo, nie artefakt** (korekta właściciela
   2026-09-08; agent wcześniej rozumował „single-file"). Każda mapa to
   osobna, samowystarczalna strona `maps/<slug>.html` w `<iframe>`
   (ADR 0027 v2); całość ląduje na Pages; ZIP z drzewem służy do
   odpalenia lokalnego z ilustracjami FOT/KON. Kafelki są więc
   kolejnymi plikami w drzewie — nie zmianą architektury.

Silnik map v1 umie pan/zoom na jednym podkładzie i ręczne warianty
z kalibracją. Nie umie: kafelkowania, progów skali ani pokryć
regionalnych.

## Decyzja

1. **Dwa rodzaje podmap.** **Światy**: osobne światy, brak relacji
   przestrzennej, mechanizm ADR 0032 (`pinezka.mapa` → osobny
   `map.json`/strona). **Przybliżenia**: wycinek wspólnego układu,
   ciągły zoom, ten ADR. Nowy plan z podmapami deklaruje, z którym
   rodzajem ma do czynienia; Dominaria to przybliżenia.

2. **Piramida LOD przybliżeń** — trzy szczeble, jeden układ
   współrzędnych `[0,1]` układu złotego (ADR 0035):
   - **L0 (przeglądowa, ~FHD, lekka, w pliku strony mapy):** pierwszy
     render i mini-mapy kart. Szybki start zamiast 10 MB.
   - **L1 (kafelki mastera):** ten sam obraz pocięty (np. 256 px),
     ładowane leniwie wg viewportu od progu skali **S1**. Ta sama
     mapa, ostrzej.
   - **L2 (pokrycia regionalne):** detalowa mapa okolic pinezki
     (np. Aerona), od progu skali **S2**, tylko tam, gdzie istnieje.
     Inna mapa (nowa toponimia) — wejście z przenikaniem, nie
     podmiana świata.

3. **Fallback do bazy.** Poza pokryciem L2 głęboki zoom pokazuje dalej
   L1 — **nigdy pustki**. Pokrycia L2 są addytywne: dokładane pod
   kolejne pinezki i regiony, nie unieważniają niczego.

4. **Progi to przedziały skali ciągłej**, nie dyskretne stopnie
   (silnik ma płynny zoom). Progi S1/S2 zapisane są w `map.json`;
   wartości dobiera implementacja i dokumentuje przy mapie.

5. **Wariant pokrycia L2 wybiera drabina ADR 0038:** T1, jeśli
   geometria zgadza się z bazą — weryfikacja **mierzalną nakładką**
   na granicach wycinka, nie na oko; jeśli nie — **T3 wycinka**
   przerysowany do geometrii bazy; T4 tylko przy braku rastra
   regionu. Detal powstaje wyłącznie pod istniejącymi pinezkami.

6. **LOD rozszerza warianty, nie buduje obok nich.** Wariant
   (ADR 0035) dostaje zasięg zoomu i — dla L2 — bounding-box;
   kalibracja już istnieje. Nowość do napisania: narzędzie do
   kafelkowania, leniwe ładowanie, auto-przełączanie po skali,
   przenikanie L1→L2, deep-link `?pin=` z właściwym LOD od pierwszego
   renderu.

7. **Procedura docelowa** (kolejność; decyzja właściciela: **od razu
   docelowo, bez półśrodków** — karta czeka na gotowy produkt):
   master → L0 → kafelki L1 → weryfikacja geometrii i dobór L2 →
   kotwice z proweniencją jednostkową (lekcja F5) → pinezki → testy
   → build. Wersji tymczasowej nie budujemy.

8. **Dystrybucja:** kafelki i L0 to pliki w `maps/<slug>/`, kopiowane
   przez build jak podkłady; lądują na Pages i w ZIP (wzrost ZIP
   akceptowany). L0 inline w stronie mapy (szybki start, offline);
   L1/L2 leniwie (offline: z dysku; `file://` nie blokuje, jak dziś
   iframe).

## Konsekwencje

**Dodatnie:** szybki pierwszy render mimo ciężkiego mastera; detal
tam, gdzie stoją karty; pokrycia addytywne; reuse wariantów
i kalibracji zamiast drugiego mechanizmu; kafelki nie zmieniają
architektury dystrybucji (drzewo + iframe + ZIP już to niesie);
wzorzec dla kolejnych planów-globów.

**Ujemne:** narzędzie do kafelkowania (cięcie, rozmiary, nazewnictwo)
do napisania; silnik: lazy-load, progi, przenikanie, `?pin=` ze
stanem LOD; większy ZIP; kalibracja każdego pokrycia L2 do zmierzenia
przy materializacji.

**Dla sesji agentskiej:** przybliżeń nie buduj mechanizmem
podmap-światów (osobne strony); nie mów „artefakt single-file" —
mapy to drzewo w iframe (ADR 0027 v2); progi i pokrycia dokumentuj
w `map.json`; jak zawsze: research → ogląd → decyzja (ADR 0038 §4).

## Uzupełnienie 2026-09-08 — ADR 0041 (nowy detal dla L2; korekta §8)

1. Pokrycie L2 musi wnosić detal nieobecny w bazie (nowa toponimia,
   geometria nazwanych obiektów lub detal epoki); **wycinek mapy
   bazowej jest zabroniony** (decyzja właściciela 2026-09-08, audyt
   PR-24 F2 — nakładka „Domeny" Dominarii powtarzała toponimię
   mastera M1).
2. Korekta §8 (litera ADR vs implementacja): raster L0 jest
   **linkowany `<img>`**, nie inline (`file://` blokuje `fetch`, ale
   nie `<img>` — offline działa tak samo); inline dotyczy wyłącznie
   podkładów SVG (markup w stronie mapy, ADR 0027 v2).
3. Mapa Dominarii (pierwsza mapa LOD) ma od tej decyzji dwa szczeble:
   L0 + kafle L1; nakładka L2 „Domeny" i plik `aerona.jpg` usunięte,
   pinezka 40USG odczytana wprost z mastera M1 (L13).
