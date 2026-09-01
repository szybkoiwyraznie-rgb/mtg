# Audyt 2026-09-01 — mapa Zendikaru (zgłoszenia właściciela a–j, zrzuty)

> Pas mapowy Pętli Jakości v2 (ADR 0015, krok 4: weryfikacja dokładności
> + poprawa kolizji). Zgłoszenia po obejrzeniu mapy przez właściciela.

## Metoda

Skryptowa weryfikacja `podklad.svg` (bez oglądu obrazu): spłaszczanie
krzywych Beziera → point-in-polygon względem lądów (w tym wysepki
z fill dziedziczonym z grupy), bbox-kolizje etykiet (szerokość ≈
0.62·font-size·znaki), markery `use` vs ląd. Whitelisty: zatoki/rowy
(Bojuka Bay, Sunder Bay, Chill Depths, Makindi Trenches — kursywa,
obiekty wodne), nazwy wysp przy wyspach, Emeria (ruiny w niebie).

## Zgłoszenia → diagnoza → poprawka

| # | Zgłoszenie | Diagnoza | Poprawka |
|---|---|---|---|
| a | Mt. Valakut „stoi w wodzie" przy Beyeen | marker wulkanu na beyeeńskiej wysepce + etykieta wystająca w ocean; **kanon: Valakut to superwulkan KONTYNENTU AKOUM** (MTG Wiki: Akoum) | wulkan usunięty z Beyeen; etykieta przy superwulkanie Akoum (1462,384); element `Valakut (superwulkan)` w map.json z źródłem |
| b | Agadeem nachodzi na Ondu | blob wyspy (181–305 × 1154–1304) przecinał ląd Ondu | nowy blob w czystej wodzie SW od Ondu (112–240 × 1258–1366) + etykieta |
| c | Crypt of Agadeem „na Ondu" | etykieta (320,1266) i marker faktycznie wewnątrz poligonu Ondu | marker (170,1290) + etykieta na wyspie Agadeem; kotwica dodana |
| d | „Makindi Tenches" na innym napisie | etykieta (645,1078) kolizowała z Cliffhaven (620,1076) | przeniesiona w morze NE od Cliffhaven (700,1018) — to rowy przybrzeżne |
| e | Singing City w morzu + „ogonek" wybrzeża Murasy | marker (866,1282) na haku SW wybrzeża; etykieta w wodzie; krzywa SW z create-hookiem; **kanon: Singing City na Murasie** (Plane Shift) | duplikat markera usunięty; etykieta pod istniejącym markerem (906,1252) w głębi Murasy; krzywa SW wygładzona |
| f | Guul Draz nachodzi na Zof Ma… | Zof Marsh (1175,1155) pod tytułem kontynentu (fs 42) | bagna + etykieta przeniesione (1158,1220) |
| g | Glasspool „w jakimś jeziorze" | to HASzcze jezioro — kanon: magiczne jezioro na Akoum (MTG Wiki: Akoum); etykieta pod elipsą mylnie czytana | etykieta nad jeziorem (1800,556), poza elipsą i poza kolizją z Glass Haven |
| h | Fort Keff nachodzi na Ora Ondar | kolizja + Kargan Lands × tytuł Akoum | Ora Ondar (1795,388), Kargan Lands (1568,344) |
| i | Ikiral i Emeria „nie wiadomo do czego" | etykiety bez markerów | Ikiral: marker ruin obok etykiety (na czapie Sejiri); Emeria: pełne hedrony (#hedron) zamiast ledwo widocznych konturów + podpis „ruiny w niebie" |
| j | legenda za krótka (ostatni wiersz ucięty) | rect 150×118 przy wierszach do y=117 | rect 162×132 |

## Dodatkowe znaleziona (ten sam audyt)

- Akoum Skyclave (ruina @1560,620) — w wodzie pod wybrzeżem → (1544,586).
- Riverroot × Umung; Bojuka Bog × Riverroot; Prison of Omath ×
  Turntimber; Midnight Pass × podpis Sejiri; Windblast Gorge × podpis
  Akoum → rozsunięte.
- Zulaport stał „w powietrzu" przy wyspach Jwar; **kanon: wybrzeże
  Beyeen** (Plane Shift: Zendikar — Ondu) → marker na Beyeen (105,1200).
- Zbędny marker miasta na małej Jwar (bez etykiety, bez kanonu) — usunięty.
- Lulea i Kabira na linii brzegowej → przesunięte w głąb lądu.

## Weryfikacja końcowa

- etykiety: 0 na wodzie bez uzasadnienia (whitelisty: zatoki/rowy
  kursywą, nazwy wysp, Emeria);
- kolizje etykiet: 0;
- markery przyrodniczo-osadnicze w wodzie: 0 (hedrony dryfujące
  celowe);
- `npm test` 70/70 + build OK; `map.json`: 70 kotwic (3 dodane:
  Crypt of Agadeem, Valakut, Zulaport), elementy rozdzielone
  (Beyeen ≠ Valakut) ze źródłami.

## Wnioski (do warsztatu T4 / SKILL_MAPA_PLANU)

1. Etykieta POI zawsze WRAZ z markerem (label orphan = zgłoszenie „i").
2. Tytuły kontynentów (fs 40+) mają strefę buforową ~110 px — etykiety
   POI nie wchodzą w pas tytułu.
3. Obiekty wodne (zatoki, rowy, głębiny) kursywą — wtedy „w wodzie"
   jest czytelne jako cecha, nie błąd.
4. Weryfikacja PIT na krzywych (spłaszczanie Beziera), nie na
   punktach kontrolnych — kontrolne dają fałszywe wyniki przy C-ścieżkach.
5. Fill dziedziczony z `<g>` — audytor musi czytać fill efektywny.
