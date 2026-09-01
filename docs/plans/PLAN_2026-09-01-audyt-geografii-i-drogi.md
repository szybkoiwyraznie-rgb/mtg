# PLAN 2026-09-01 c.d. — AUDYT GEOGRAFII CAŁEJ MAPY ZENDIKARU + poprawki labeli i dróg

> Uzupełnienie zlecenia właściciela (2026-09-01, czat) do PR-9. Trzy nowe
> punkty:
>
> (a) etykiety POI (miasta/ruiny) odsunięte od obiektów + rysowana linia
>     łącząca — „nie lepiej po prostu bliżej dać tą labelkę?";
> (b) drogi rysowane „kompletnie losowo" — mają być **trakty między
>     największymi miastami/POI** danego kontynentu;
> (c) **CAŁA podstawa geograficzna mapy Zendikaru** (lądy, miasta itd.)
>     wymaga **POWAŻNEGO AUDYTU** — „nie widzę tu żadnej logiki"; przykład
>     właściciela: karta Coralhelm osadzona jest „nad śródlądowym morzem
>     Halimar, w sercu krainy Coralhelm", a na mapie Halimar = step w
>     środku Tazeem, bez wody, bez Coralhelm. Właściciel: „Może nie uda
>     ci się tego zrobić w jednej sesji, ale zapisz to w roadmapie i
>     postaraj się wykonać solidnie, w jednym albo kilku podejściach."
>
> **Doprecyzowanie właściciela (po przerwie):** audyt dotyczy **CAŁEJ
> mapy** — wszystkich kontynentów, kształtów lądów, miast i układu
> względnego — nie tylko Tazeemu.

## Zakres audytu (pkt c)

Systematyczne porównanie podkładu i sceny (`maps/zendikar/podklad.svg`,
`scena.json`, kotwice `map.json`) z hierarchią źródeł (ADR 0010/0013):

1. **Kanon:** Plane Shift: Zendikar (Wizards 2016), Planeswalker's Guide
   (Murasa/Sejiri), MTG Wiki (pozycje osad), teksty kart.
2. **Źródło fanowskie v2** (`zrodlo-fanowska.md` — rozbudowa, NIE kanon)
   i **warianty 3/4** (deska ratunku dla POI nieustalonych).
3. **Spójność wewnętrzna:** mapa ↔ kotwice map.json ↔ treść planu
   (`content/planes/zendikar.md`) ↔ opis osadzenia karty Coralhelm.

Per kontynent (Sejiri, Akoum, Tazeem, Murasa, Ondu, Guul Draz, Bala Ged) +
układ względny (odległości, cieśniny, kierunki): co OK, co przesunąć, co
brakuje, co nadmiarowe — z wyrokiem i uzasadnieniem.

## Kroki

1. ✅ Plan (ten plik) — w istniejącym PR #9.
2. **Audyt** → `docs/audits/AUDYT_2026-09-01-geografia-zendikar.md`
   (tabele per kontynent + układ względny + kolekcja błędów).
3. **Roadmapa** — stały wątek „geografia Zendikaru" (kolejka poprawek
   z audytu; realizacja w jednym lub kilku podejściach).
4. **Poprawki tej sesji:**
   - (a) `etykieta()` — koniec z linią łączącą (`przyDo` bez kresek);
     etykiety POI przysunięte do obiektów w scenie;
   - (b) drogi sceny = **trakty między największymi miastami/POI**
     (Tazeem: Hada→Sea Gate; Akoum: Goma Fada→Affa→Tal Terig; Guul Draz:
     Malakir→Nimana; Murasa: Singing City→Sunder Bay; Ondu: Zulaport→Kabira);
   - (c) najpoważniejsze błędy: **Tazeem — Halimar = woda** (morze
     śródlądowe, nie step) + `Sea Gate` jako tama między morzem a oceanem
     + **Coralhelm** (osada na brzegu Halimar) + `Umara` płynąca do
     Halimar + `Merfolk Enclave` w Oran-Rief; klocek `jezioro` zyskuje
     opcjonalny kształt `d` (woda nieregularna).
5. Regeneracja podkładów + `map-audit` + testy + build + re-view wizualny.
6. Dokumentacja: co-nowego, PROJECT_HISTORY, handoff, opis PR #9;
   pozostale pozycje audytu → ROADMAP (kolejka E-geo).

## Kryterium sukcesu

- Mapa mówi **tym samym językiem co treść**: opis osadzenia karty
  (Halimar = śródlądowe morze, Coralhelm na jego brzegu) odpowiada temu,
  co widzimy na podkładzie.
- Audyt = dokument z tabelami (źródło → werykt → poprawka), gotowy do
  realizacji kolejnych podejść.
- Etykiety blisko obiektów (bez kresek), drogi czytają się jako trasy.
