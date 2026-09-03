# Źródło fanowskie — mapa Dziesiątego Dystryktu Ravniki (wektoryzacja v3)

> **Status:** kandydat do v3 mapy Ravniki, po decyzji właściciela z 2026-09-03
> i ADR 0031. Plik rastrowy źródła nie jest commitowany do repozytorium;
> powinien być dostępny roboczo w sandboxie przy właściwej sesji
> wektoryzacji.

## Źródło

- **Nazwa pliku wg dostawy:** `TenthDistrict.png`.
- **Dostarczył:** właściciel, 2026-09-03, jako załącznik w czacie.
- **Charakter źródła wg właściciela:** screenshot fan-made mapy wektorowej,
  prywatne/niepubliczne użycie w Codexie; właściciel dopuszcza wykorzystanie
  jako dokładniejszego źródła geometrii.
- **Relacja do v2:** v2 opiera się na tekstowej transkrypcji oficjalnej mapy
  GGR i własnym rysunku mapforge. Kandydat v3 ma iść dalej: przejąć dokładne
  obrysy, granice, drogi i pozycje z dostarczonej mapy fan-made, podobnie jak
  Śródziemie korzysta z gotowego podkładu wektorowego.

## Co widać na dostarczonym obrazie

Mapa pokazuje Dziesiąty Dystrykt w czarno-białej, czytelnej stylistyce:
zewnętrzny obrys miasta, sześć precyktów, dashed granice dzielnic, główne
arterie (m.in. Tin Street, Transguild Promenade/Plaza Avenue, Deadbridge
Chasm i Benzer's Bridge), Undercity jako ciemną dolną warstwę oraz pełny
zestaw nazwanych punktów: Skarrg, Millennial Platform, Sunhome, Nivix,
Vitu-Ghazi, New Prahv, Orzhova, Rix Maadi, Svogthos/Korozda, Duskmantle,
Zameck/Zonot Seven, Whitestone, Statue of Agrus Kos, Augustin Station,
Griffin Heights, Gore House, Kamen Fortress, Wayport, Medori Park i inne.

## Plan użycia w v3

1. Zweryfikować, czy `TenthDistrict.png` jest realnie dostępny w sandboxie
   (w tej sesji ścieżka `/home/user/uploads/TenthDistrict.png` nie była
   widoczna dla narzędzi mimo załącznika w UI).
2. Wyodrębnić warstwy z rastra: zewnętrzny kontur, granice precyktów,
   drogi/arterie, obszar Undercity, etykiety/POI.
3. Zbudować wynikowy `maps/ravnica/podklad.svg` jako:
   - wariant T2/T2+ — adoptowany/oczyszczony SVG, jeżeli trace będzie czysty;
   - albo wariant T4 — geometria z trace jako matryca dla sceny mapforge.
4. Zsynchronizować `scena.json`, `map.json`, kotwice i pinezki.
5. Wykonać QA: porównanie wizualne z obrazem źródłowym, `map-audit.py`,
   render przez CLI mapforge, `npm test`, `npm run build`.

## Uwagi

- Raster źródłowy jest prywatnym materiałem roboczym właściciela. Nie trafia
  do repo bez osobnej decyzji.
- Kanon nazw i przynależności precyktów nadal weryfikujemy wobec źródeł lore;
  mapa fan-made daje geometrię, nie automatycznie wyższy poziom kanonu.
