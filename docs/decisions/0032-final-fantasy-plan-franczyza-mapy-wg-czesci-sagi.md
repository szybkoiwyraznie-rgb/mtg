# ADR 0032: Final Fantasy jako plan-franczyza; mapa per część sagi, światy bez łączenia przestrzennego

- **Status:** Zaakceptowana
- **Data:** 2026-09-05
- **Decydenci:** właściciel projektu (decyzje 2026-09-05 w czacie sesji PR-19:
  „jeden plan Final Fantasy z wieloma mapami” zamiast osobnych planów per
  świat gry i zamiast kontynentów; wybór rastra ReverendRyu jako wzorca T3
  mapy Midgaru, z fallbackiem T4); agent Arena (sesja PR-19)
- **Powiązania:** ADR 0003/0011 (pętla materializacji), ADR 0007/0009/0012
  (drabina T2→T3→T4), ADR 0018/0019/0021/0022 (mapforge i styl atlasowy),
  ADR 0030 (karty LORE-first), ADR 0031 (fanowskie rastry jako referencja)

## Kontekst

Karta `275FIN Aerith Rescue Mission` (Universes Beyond: Final Fantasy)
wprowadza do Kodeksu sagę, która nie jest jednym światem: każda numerowana
gra ma własny świat (Gaia/FFVII z Midgarem, Spira/FFX, Ivalice/FFT…),
a między światami sagi **nie ma kanonicznych relacji przestrzennych**.
Właściciel chce inkrementalności („nie tworzyć od razu wszystkiego — mapa
powstaje, gdy pojawi się karta danej części”) i rozważał dwa modele:
wiele map w jednym planie-franczyzie albo jedną mapę, na której światy gier
byłyby kontynentami (analogia Zendikaru).

Research (2026-09-05): gotowy podkład wektorowy (T2) dla Midgaru/Gai
nie istnieje — w sieci są wyłącznie rastry (fanowskie ilustracje, mapy
Fandomu, schematy). Najlepszy płaski wzorzec topologii to schemat
„Midgar Mass Transit System Map” (ReverendRyu): radialne koło 8 sektorów
wokół huba 0 (Shinra Central), pierścienie i szprychy — zgodne z kanonem
układu miasta; wzorzec pseudo-3D (VGCartography) właściciel odrzucił.

## Decyzja

1. **Plan-franczyza:** w Kodeksie istnieje jeden plan `final-fantasy`
   (tytuł „Final Fantasy”, `typIP: final-fantasy`) obejmujący całą sagę.
   Poszczególne światy gier NIE są osobnymi planami — mają **osobne mapy**
   wewnątrz tego planu (pierwsza: `midgar`).
2. **Inkrementalne mapy części:** mapa danej części sagi (miasto/region/
   świat) powstaje dopiero, gdy materializuje się karta jej potrzebująca.
   Karta wskazuje mapę przez `pinezka.mapa: <plan>/<podmapa>`
   (dotychczasowe karty: `pinezka.mapa: <plan>` — bez zmian).
3. **Rozbudowa modelu (klucz `plan/podmapa`):** rejestr map czyta zarówno
   płaskie `maps/<plan>/map.json` (istniejące plany, bez zmian), jak i
   `maps/<plan>/<podmapa>/map.json`. Silnik (content-loader, build,
   map-audit) skanuje dwa poziomy; strony map podmap mają własne HTML-e
   i podkłady w swoim katalogu; ZIP obejmuje całe drzewo.
4. **Drabina tierów per część:** dla każdej mapy tier wybiera się osobno
   (T2 → T3 → T4, jak ADR 0007/0009/0012). Midgar = **T3**: wektoryzacja
   topologii z rastra ReverendRyu (CC BY-NC-ND 3.0) traktowanego jako
   prywatna referencja **poza gitem**, z proweniencją w `map.json`;
   wynikowy wektor jest samodzielną transkrypcją kanonicznej topologii
   (praktyka ADR 0031). Fallback: T4 (rekonstrukcja kanoniczna), gdyby
   referencja okazała się niewystarczająca.
5. **Zakaz łączenia przestrzennego światów:** światy sagi nigdy nie
   trafiają na jedną mapę jako kontynenty/sąsiednie lądy — fabrykowałoby
   to relacje przestrzenne nieistniejące w żadnym źródle (hierarchia
   kanonu: snapshot Scryfall > lore świata > agent).

## Konsekwencje

- Zmiany silnika w PR-19 (krok P2): `tools/content-loader.mjs`,
  `tools/build.mjs`, `tools/map-audit.py` + testy rejestru map.
- Strona planu `final-fantasy` pokazuje mapę podstawową (`mapa: midgar`);
  kolejne podmapy dopisywane są do rejestru bez zmian strony planu.
- Nazwy obiektów na mapach FF tylko kanoniczne; fanowskie wynalazki
  z referencji (np. część nazw stacji MMTS) nie wchodzą do Kodeksu.
- Przyszłe karty FF: ten sam plan; nowa podmapa tylko na żądanie karty.
