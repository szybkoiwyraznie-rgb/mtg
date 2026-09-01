# ADR 0013: Zendikar — mapa bez adnotacji rekonstrukcyjnych na podkładzie

- **Status:** Zaakceptowana
- **Data:** 2026-09-01
- **Decydenci:** właściciel projektu (decyzja z sesji PR-3 c.d., 2026-08-31,
  spisana tam w `content/co-nowego.md`; utrwalona w ADR w sesji PR-4 po
  wykryciu dryfu przez audyt); agent Arena (sesja PR-4)
- **Zastępuje:** punkt „Niepewność widoczna na mapie" ADR 0012 (podpis
  kartograficzny „rekonstrukcja", podtytuł „(położenie przybliżone)"
  i przerywana linia brzegowa Murasy)

## Kontekst

ADR 0012 przyjął, że rekonstrukcja T3 mapy Zendikaru ma **na samym
podkładzie** jawnie komunikować swój status: podpis kartograficzny
„rekonstrukcja", przerywaną linię Murasy i podtytuł „(położenie
przybliżone)". Po obejrzeniu wzbogaconej mapy właściciel zdecydował
(2026-08-31, sesja PR-3 c.d.), że mapa ma pokazywać **treść bez
zastrzeżeń** — adnotacje „uwaga, rekonstrukcja/fanowskie" zniknęły
z podkładu, a położenie Murasy zostało uzupełnione wg dostarczonych
przez właściciela źródeł fanowskich (`zrodlo_fanmapa`,
`zrodlo_fanmapa_warianty` w `maps/zendikar/map.json`). Decyzja nie
została wtedy utrwalona w ADR — stan repo (SVG bez adnotacji) rozjechał
się z obowiązującym ADR 0012 (wykryte audytem 2026-09-01). Niniejszy ADR
zestawia dokumenty ze stanem faktycznym.

## Decyzja

1. **Podkład `maps/zendikar/podklad.svg` nie niesie adnotacji
   rekonstrukcyjnych**: bez podpisu „rekonstrukcja", bez podtytułu
   „(położenie przybliżone)" przy Murasie i bez przerywanej linii
   brzegowej kontynentu. Mapa renderuje treść, a nie zastrzeżenia.
2. **Proweniencja żyje w danych, nie na obrazie**: `maps/zendikar/
   map.json` zachowuje `rekonstrukcja: true`, `zrodlo` (kanon tekstowy),
   `zrodlo_fanmapa` i `zrodlo_fanmapa_warianty` (źródła fanowskie,
   NIE kanon — rozszerzają pozycje elementów, nie przesuwają faktów
   kanonicznych). To map.json pozostaje źródłem prawdy o pochodzeniu.
3. **Treść encyklopedyczna nadal mówi prawdę o rekonstrukcji**: strona
   planu Zendikar (sekcja „Setting w pigułce") informuje, że oficjalna
   mapa nigdy nie powstała, a podkład jest rekonstrukcją z tekstów
   źródłowych — deklaracja należy do tekstu, nie do grafiki.
4. **Protokół pinezek bez zmian**: poziomy pewności `dokladna | region |
   przyblizona` (ADR 0007, MA4) i legenda pewności na stronie mapy
   pozostają w mocy — dotyczą lokalizacji konkretnej karty, nie statusu
   całej mapy.
5. **Zasada ogólna dla przyszłych map T3**: domyślnie bez adnotacji
   rekonstrukcyjnych na podkładzie; proweniencja obowiązkowo
   w `map.json` (flaga `rekonstrukcja`, `zrodlo*`) i w treści strony
   planu. Odstępstwo od tej zasady to świadoma decyzja zapisana
   w ADR.

## Konsekwencje

**Dodatnie:** mapa wygląda i czyta się jak karta atlasu (zgodnie z
oczekiwaniem właściciela); deklaracja niepewności nie zniknęła — przeniosła
się tam, gdzie jest weryfikowalna (dane + tekst, diffowalne w gicie).

**Ujemne:** sam obraz mapy (np. zrzut png wysłany komuś) nie komunikuje,
że to rekonstrukcja — świadomy koszt; odbiorca witryny i tak ma treść
strony planu obok.

**Dla sesji agentskiej:** przy zmianach podkładu Zendikaru nie odtwarza
się adnotacji z ADR 0012; przy audytach mapy proweniencję sprawdza się
w `map.json`, nie na SVG.
