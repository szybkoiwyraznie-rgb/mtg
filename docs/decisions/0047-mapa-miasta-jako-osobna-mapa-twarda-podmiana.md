# ADR 0047: Mapa miasta jako osobna mapa o własnej skali — twarda podmiana deep-zoom (nie wycinek planu)

- **Status:** Zaakceptowana
- **Data:** 2026-09-10
- **Decydenci:** właściciel projektu (czat 2026-09-10: „dwie osobne mapy —
  jedna pełnoplanowa jak Dominaria, a od pewnego zbliżenia Ghirapur mapa
  szczegółowa miasta… to nie miała być ta sama mapa co mapa miasta. Na
  mapie planu Ghirapur to miał być punkt na mapie, mała kropka, góry
  duże, proporcjonalne, skala mapy planu podobna do Zendikaru. Dopiero
  zoom od pewnego poziomu na Ghirapurze miał przełączać na zupełnie inną
  mapę samego miasta"; wybór modelu przejścia: **twarda podmiana na
  zupełnie osobną mapę**, bez wymogu idealnego łączenia rzek na
  krawędzi); agent Arena (sesja PR-30)
- **Zmienia / luzuje:** ADR 0046 §5 („szew L2 jest sztywny") — dla modelu
  osobnej mapy miasta wymóg sztywnego szwu **nie obowiązuje** (miasto to
  inna mapa, nie wycinek planu; przejście = twarda podmiana z
  przenikaniem)
- **Doprecyzowuje:** ADR 0039 (piramida LOD — szczebel L2 „inna mapa,
  nowa toponimia" realizowany jako osobna mapa o własnej skali), ADR 0041
  (pokrycie L2 wnosi detal, nie wycinek — tu wnosi też **własną skalę**),
  ADR 0045 (widok domyślny), ADR 0033/0032 (jedna vs osobne mapy)
- **Powiązane:** ADR 0007/0038 (drabina wariantów), ADR 0018/0019
  (mapforge, styl atlas), ADR 0027 (drzewo map + iframe)

## Kontekst

Kaladesh (PR-28/29) dostał model „jeden plan + płyta miasta jako nakładka
bbox". Realizacja miała dwie wady strukturalne, które właściciel odrzucił
w recenzji 2026-09-10:

1. **Plan był narysowany w skali mastera miasta.** Płótno planu miało
   **16000×11000** jednostek — ~63× powierzchni normalnej mapy planu
   (wszystkie inne plany Kodeksu: 2000×1400). Glify mapforge mają stały
   rozmiar w jednostkach sceny, więc na takim płótnie kurczyły się do
   „ząbków piły" (góry) i „ziarenek piasku" (lasy) — zamiast dużych,
   proporcjonalnych sylwetek jak na Zendikarze (benchmark ADR 0015).

2. **Miasto było wycinkiem planu w skali 1:1, nie osobną mapą.** Płyta
   L2 Ghirapuru miała bbox równy swojemu rozmiarowi (1400×740 jednostek
   złotych = dokładnie wymiary płyty), a szew wodny był sztywno zszyty
   z planem (ADR 0046 §5). Efekt: „jedna mapa, na której od pewnego
   zoomu doklejają się szczegóły" — a nie dwie mapy. Właściciel chciał,
   by miasto było **zupełnie inną mapą o własnej skali** (własne, duże,
   proporcjonalne góry i biomy w skali miasta).

Model „wycinek + sztywny szew" (ADR 0046 §5) wymuszał, by miasto żyło
w układzie współrzędnych planu — co blokuje własną skalę miasta.

## Decyzja

1. **Plan i mapa miasta to DWIE OSOBNE MAPY o własnych skalach.**
   - **Mapa planu** rysuje się w skali planu (płótno ~2000×1400, jak
     Zendikar i pozostałe plany T3/T4). Miasto na planie to **POI-kropka**
     (`typ: miasto`) z etykietą — nie region, nie płyta. Góry i biomy
     planu są duże i proporcjonalne (benchmark: Zendikar, ADR 0015).
   - **Mapa miasta** rysuje się we **własnym** płótnie i skali (miasto
     wypełnia arkusz; jego mury, dzielnice, kanał, las łęgowy, pasmo
     i biomy są duże i proporcjonalne do TEJ mapy).

2. **Przejście = twarda podmiana deep-zoom (crossfade), nie wycinek.**
   Mapa miasta wchodzi dopiero, gdy **widoczny kadr mieści się w
   bboksie miasta** — czyli gdy miasto **wypełnia całą ramkę**
   (`prostZawiera(bbox, widoczny)`), a nie już przy samym dotknięciu
   brzegu bboksu (doprecyzowanie po recenzji właściciela 2026-09-10:
   „mapa deep pokazuje się za wcześnie”). Znacznik danych: nakładka
   z `podmiana: true` w `map.json`; próg `prog` jest dolną bramką, a
   warunek „mieści się w kadrze” — właściwym wyzwalaczem. W chwili
   podmiany silnik **chowa podkład-plan** (`.mapa-podklad.podmieniony`,
   opacity→0, ten sam 0,35 s co fade-in miasta), więc dwie osobne mapy
   nigdy nie są widoczne naraz. Deep-link `?pin=`/`?x=&y=` w bboksie
   ustawia od razu zoom „fit bbox” (miasto wypełnia ramkę). Przejście
   jest płynne (przenikanie opacity), ale **nie ma wymogu ciągłości
   geometrii na krawędzi** — miasto to inna mapa, więc rzeki/drogi
   planu nie muszą trafiać w rzeki/drogi miasta w punkcie cięcia (a że
   plan i tak znika pod miastem, styk jest niewidoczny).

3. **Sztywny szew (ADR 0046 §5) nie obowiązuje dla mapy miasta.**
   Walidator hydrologii (`sprawdzHydrologie`) traktuje mapę miasta jak
   **samodzielną scenę** (rzeki uchodzą do wody/jeziora/innej rzeki
   WEWNĄTRZ mapy miasta albo do jej własnego akwenu/krawędzi jako
   „poza kadrem"), a nie jak płytę ciętą szwem planu. Test szwu wodnego
   (`lod.test.js` — „pozycja + szerokość L2 = plan w cięciu") zostaje
   **wycofany** dla Kaladeshu; pozostałe reguły geometrii miasta
   (ADR 0046 §1–4, §6: kaflikowanie, mury poza obrysem, las poza domami,
   zakaz fix-by-deletion, test nakładki) **pozostają w mocy**.

4. **Model danych — dwa dopuszczalne warianty (implementacja wybiera):**
   - **(A) Osobna mapa `plan/podmapa`** (mechanizm ADR 0032): miasto to
     `maps/kaladesh/ghirapur/map.json` z własnymi wymiarami; przejście
     realizuje deep-zoom, który od progu ładuje i pokrywa planem tę mapę.
   - **(B) Wariant-nakładka bez wymogu szwu** (rozszerzenie ADR 0039):
     miasto zostaje wariantem `bbox`+`prog` w `map.json` planu, ale bbox
     wyznacza tylko **kadr podmiany** (gdzie się pojawia), a płyta ma
     własną, niezależną skalę wewnętrzną; kalibracja pozostaje odwrotna
     do bboxa (waliduje test ADR 0035), lecz geometria miasta nie jest
     przeliczana na układ planu.
   Wybór wariantu dokumentuje `map.json` i handoff. Niezmiennik wspólny:
   **plan jest lekki i w skali planu; miasto ma własną skalę.**

5. **Kropka na planie ma pierwszeństwo jako kotwica.** Pinezka karty
   z Ghirapuru wskazuje kropkę miasta na planie; deep-link `?pin=` do
   karty z miasta uruchamia twardą podmianę i centruje na mapie miasta
   (ADR 0039 §6). `widok_domyslny` (ADR 0045) może startować blisko
   kropki, ale oddalenie zawsze odsłania pełny plan.

## Konsekwencje

**Dodatnie:** plan wygląda jak plan (duże, proporcjonalne góry i lasy,
Ghirapur kropką — zgodnie z benchmarkiem Zendikaru); miasto jest
naprawdę osobną mapą o własnej, czytelnej skali; koniec kompromisu
„jedna mapa z doklejanym detalem"; wzorzec dla kolejnych planów, których
serce (miasto/region) jest znacznie gęstsze od reszty świata
(np. Ravnica, Kamigawa).

**Ujemne:** dwie mapy = dwie sceny do utrzymania; przejście nie jest
geometrycznie ciągłe na krawędzi (świadomy wybór właściciela — to inna
mapa); trzeba zadbać, by kadr podmiany nie „mrugał" (histereza progu
crossfade).

**Dla sesji agentskiej:** plan planu rysuj w skali ~2000×1400 (miasto
kropką); mapę miasta rysuj w jej własnej skali; nie odtwarzaj sztywnego
szwu wodnego dla mapy miasta (ADR 0046 §5 nie dotyczy tego modelu);
pozostałe reguły geometrii miasta (ADR 0046 §1–4, §6) obowiązują;
przy nowym planie „świat + gęste miasto" pytaj, czy stosować ten model.
