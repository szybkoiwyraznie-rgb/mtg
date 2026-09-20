# Alara — research źródłowy mapy (T3)

## 2026-09-20 — pass mapowy Pętli Jakości 6 (PR-35)

Kwerenda mtg.wiki pod nowe kanoniczne POI; podkład T3 (mapforge, scena
alara-t3) wzbogacony o 4 obiekty, kotwice dopisane do `map.json`
(47 → 51). Zasada MA4: pozycja ze źródeł, nie z kursora — pozycje
poniżej to rekonstrukcja T3 na podstawie relacji opisowych.

### Dodane obiekty

1. **The Binding Wall** (ruina, Naya) — złamana, lecz czytelna płyta
   z białego granitu pod Antali, na której spisano Coil (kodeks prawa
   Nacatl); zdefasonowana przy upadku imperium. Pozycja: tuż na
   południowy wschód od Ruin Antali (kanon: „outside of Antali").
   Źródło: <https://mtg.wiki/page/Naya> (Notable locations).
2. **Qasali Valley** (region, Naya) — dolina będąca domem Cloud Nacatl
   i plemienia Wild Nacatl Ajaniego; w niej miasto Qasal. Pozycja:
   etykieta regionu nad glifem Qasal. Źródło:
   <https://mtg.wiki/page/Naya> (Notable locations).
3. **The Seethe** (region, Jund) — rozległa sieć nisko położonych jam
   smolnych, źródło czarnej many, dom viashinów Pitch Thrash. Pozycja:
   niziny na wschód od Hellkite's Pass — rekonstrukcja („low-lying tar
   pits" poza scar-lands). Źródło: <https://mtg.wiki/page/Jund>
   (Notable locations).
4. **The Kingdom of Fog** (akwen, Esper) — tajemnicze morze Esperu;
   Tiln z Cloudheath ratuje statki w nim zagubione. Pozycja: wody na
   zachód/południe od głównej wyspy Esperu (między Maelstromem
   a Vectis) — wybór rekonstrukcji T3; dopisany do `strefyWodne`
   w `scena.json` (whitelista wód audytora). Źródło:
   <https://mtg.wiki/page/Esper> (Notable locations).

### Korekta w trakcie passu

Pierwsza pozycja Binding Wall (560,540) trafiła w zatokę między
płatami lądu Nayi (map-audit: FORGE W WODZIE) — przesunięta na
(540,565) po próbkowaniu `na_ladzie()`.

### Kandydaci odłożeni (rezerwa na kolejne passy)

- **Harborgate** (Jhess, Bant) — iglica Esperu wepchnięta w Bant przez
  strefy inkursji Confluxu; wymaga decyzji, czy mapa pokazuje stan
  po-Confluxowy.
- **Hydra's Tail Chasm** (Qasali Valley, Naya) — wąwóz; brak relacji
  pozycyjnej dokładniejszej niż „w dolinie".
- **Cloudheath / The Crypt of Knowledge / The Cesspools / House of
  Dialectics** (Esper) — brak jakichkolwiek relacji pozycyjnych
  w źródłach; dodanie wymagałoby czystej inwencji.
- **Varakna / The Worldheart Chalice / Palehide territory** (Jund) —
  jak wyżej; Worldheart Chalice to ukryta lokacja fabularna (leże
  Bolasa), niekartografowalna z kanonu.
