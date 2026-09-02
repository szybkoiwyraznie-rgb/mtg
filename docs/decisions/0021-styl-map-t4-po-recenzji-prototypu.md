# ADR 0021: Styl map T4 po recenzji prototypu Zendikaru — jedna barwa wody, kolory funkcjonalne motywu atlasowego, wiążąca kolejność warstw, etykiety przy obiektach

- **Status:** Zaakceptowana
- **Data:** 2026-09-02
- **Decydenci:** właściciel projektu (recenzja prototypu mapy Zendikaru,
  2026-09-01/02, czat — poprawki (a)–(g); decyzja o błękicie wody
  i bordowych etykietach 2026-09-01); agent Arena (implementacja
  w sesji PR-9; formalizacja w ADR w sesji PR-10 po wykryciu dryfu
  audytem `docs/audits/AUDYT_2026-09-02-PR9.md`)
- **Zastępuje:** punkt 3 ADR 0020 w części „ujście w jezioro → kolor
  jeziora (`PAL.wodaGleb`)" — odrębny kolor jeziora nie istnieje;
  **doprecyzowuje:** ADR 0019 (wyjątki kolorystyczne od achromatu
  motywu atlasowego)
- **Powiązania:** ADR 0015 (warsztat T4), ADR 0018 (mapforge),
  ADR 0019 (motyw atlasowy), ADR 0020 (glify mapome, rzeki)

## Kontekst

Właściciel obejrzał prototyp mapy Zendikaru wyrenderowany po adopcji
glifów (ADR 0020) i przekazał siedem wiążących poprawek (a)–(g).
Zostały wdrożone jeszcze w PR #9 (druga fala, 2026-09-02) i opisane
w PROJECT_HISTORY/co-nowego oraz komentarzach kodu — ale nie trafiły
do rejestru ADR, mimo że dwie z nich zmieniają wcześniejsze decyzje
formalne (ADR 0019, ADR 0020 pkt 3). Audyt startowy PR-10 wykrył dryf
(ten sam wzorzec co przy ADR 0012→0013). Niniejszy ADR zestawia
rejestr ze stanem faktycznym repozytorium.

## Decyzja

Reguły stylu obowiązują wszystkie mapy rysowane warsztatem T4
(mapforge); implementacja w `tools/mapforge/` jest stanem odniesienia.

1. **Jedna barwa wody (poprawka d).** Morza, jeziora, rzeki, dopływy
   i kanały mają dokładnie ten sam kolor (`PAL.woda`); odrębny kolor
   jeziora/„głębi" (`wodaGleb`), kolor rzeki (`PAL.rzeka`), gradienty
   ujść i plamy głębi oceanu **nie istnieją**. Akweny zlewają się ze
   sobą bez szwów; rzeka „rozmywa się" w morzu przez identyczność
   barwy, nie przez efekty.
2. **Kolory funkcjonalne motywu atlasowego (doprecyzowanie ADR 0019).**
   Motyw `atlas` pozostaje achromatyczny (R=G=B) z dokładnie dwoma
   wyjątkami zaakceptowanymi przez właściciela: **błękit wody**
   (wypełnienie `#e2ecf4`, linie wody `#6f9bc0`) oraz **bordowe
   etykiety** (`#6b1f2e` i odcienie). Test stylu pilnuje achromatu
   przez whitelistę tych wartości — rozszerzenie whitelisty wymaga
   decyzji właściciela.
3. **Wiążąca kolejność warstw (poprawka g):** morza → wybrzeża → lądy →
   jeziora → rzeki → góry (pasma) → wulkany → lasy/bagna/stepy (NAD
   górami) → drogi → miasta/ruiny → etykiety na samym szczycie →
   oprawa (kompas, skala, ramka).
4. **Etykieta siada przy obiekcie (poprawka b).** Etykieta POI stoi
   tuż przy swoim badge'u (bez kresek łączących — decyzja 2026-09-01);
   wystarczy, że bbox napisu **dotyka** lądu (model 9 punktów bboxa,
   tolerancja 2 px) — część napisu może wisieć nad wodą, jak na mapach
   mapome. Ten sam model stosują render (`rozstawEtykiety`)
   i `tools/map-audit.py`.
5. **Ikony osad szare, nie czarne (poprawka c).** Miasta rysują się
   monolitycznym szarym (`PAL.skalaCien`), żeby nie zlewały się
   z czarnymi glifami gór; ruiny pozostają jaśniejsze z szarym obrysem.
6. **Pasmo górskie = jedna logiczna bryła (poprawka a).** Glify
   adoptowane układają się wzdłuż wygładzonego grzbietu w JEDEN ciągły
   grzbiet: minimum 3 glify, szerokość ≈ krok wzdłuż grzbietu ×1,8
   (±~10%), bazy nachodzą ~50%, bez rozrzutu pionowego i bez osobnego
   pogórza; wielkości sąsiadów zbliżone. Mega-klastery (hero) wyłącznie
   jawnie przez `glifId` (bez zmian względem ADR 0020).
7. **Przenosiny POI obejmują wszystkie jego ikony (poprawka e),**
   a etykiety akwenów stoją na otwartej wodzie, którą faktycznie
   nazywają (poprawka f) — reguły redakcyjne sceny, egzekwowane
   przy każdej edycji `scena.json`.

## Konsekwencje

**Dodatnie:** rejestr ADR znowu opisuje stan repo (koniec dryfu);
reguły stylu są jednym dokumentem dla przyszłych map T4; testy stylu
i map-audit mają formalne umocowanie (whitelista kolorów, model dotyku
etykiet).

**Ujemne:** brak rozróżnienia wizualnego jezior od morza — świadomy
wybór właściciela (czytelność ważniejsza od informacji o typie akwenu);
whitelista kolorów wymaga aktualizacji ADR przy każdej zmianie palety
funkcjonalnej.

**Dla sesji agentskiej:** nie przywracać `wodaGleb`/`PAL.rzeka`/
gradientów/plam głębi; nowe warstwy renderu wpinać zgodnie z kolejnością
pkt 3; edycje `scena.json` respektują pkt 4 i 7; zmiany stylu map T4
zawsze przez ADR, nie tylko komentarz w kodzie.
