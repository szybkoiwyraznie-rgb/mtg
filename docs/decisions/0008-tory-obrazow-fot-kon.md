# ADR 0008: Tory obrazów — brak generowanych grafik; FOT/KON lokalnie z cichym fallbackiem

- **Status:** Częściowo zastąpiona — mechanikę przycisków torów zastępuje
  ADR 0017; zakaz generowanych grafik, `img/` poza gitem i cichy fallback
  pozostają w mocy
- **Data:** 2026-08-31
- **Decydenci:** właściciel projektu (decyzja 2026-08-31)

## Kontekst

Pierwotna koncepcja zakładała generowaną wizualizację dla każdej strony.
Właściciel decyzją z 2026-08-31 **wycofał generowanie grafik na start**:
lokalna wersja artefaktu ma korzystać z istniejących plików właściciela
(`./img/<imgId>FOT.png` — panorama; `./img/<imgId>KON.png` —
bestiariusz), dokładnie jak Wirtualny Stół w mtg-game. Grafiki do Kart
Haseł — temat odroczony do osobnej decyzji. Kolekcja FOT/KON właściciela
waży ~10 GB i nigdy nie wchodzi do gita (SECURITY.md mtg-game — ta sama
zasada tutaj).

## Decyzja

1. **Projekt nie generuje żadnych obrazów** w bieżącym zakresie. Żaden
   krok pipeline'u materializacji nie wywołuje generatora grafik; sekcja
   „Wizualizacja" Karty Katalogowej pokazuje prompt (verbatim) i opis
   sceny — słowami.
2. **Tory obrazów Karty Katalogowej** (kolejność i fallback):
   1. **Druk Scryfalla** (`image_uris` ze snapshotu, ADR 0004) — tor
      domyślny; wymaga internetu (działa na Pages i lokalnie online).
   2. **FOT** — `./img/<imgId>FOT.png`, panorama 21:9; dostępna wyłącznie
      w trybie lokalnym (`file://` z katalogiem `img/` obok artefaktu).
   3. **KON** — `./img/<imgId>KON.png`, bestiariusz 16:9; j.w.
   4. **Twarz syntetyczna** (fallback) — nazwa + kolory karty; nigdy nie
      ma pustego kafla (zasada dziedziczona z mtg-game: obraz jest
      domyślny, twarz syntetyczna jest fallbackiem).
3. **Cichy fallback**: pliki FOT/KON sprawdzane są przez próbę załadowania
   (`onerror`); nieudane ładowanie ukrywa przycisk toru — bez komunikatów
   błędów, bez pustych ramek. Na Pages (brak `img/`) przycisków FOT/KON
   po prostu nie widać.
4. **`img/` jest w całości gitignorowane** — to prywatny zasób
   właściciela, nie dane projektu.
5. **Slot na przyszłość**: renderery i szkielet strony przewidują czwarty
   tor „wizualizacja lore" (dla przyszłych generowanych obrazów haseł/kart)
   — wyłączony, włączenie wymaga decyzji właściciela i ewentualnego ADR o
   storage (wtedy: `assets/` + budżet rozmiaru strzeżony testem).

## Konsekwencje

**Dodatnie:** zero kosztów i ryzyk generowania; spójność z dotychczasowym
ekosystemem właściciela (te same pliki co w mtg-game); repo lekkie.

**Ujemne:** na Pages strony kart pokazują tylko druk Scryfalla (bez
FOT/KON) — świadomy koszt; sekcje „Wizualizacja" haseł pozostają
tekstowe do odwołania.

**Dla sesji agentskiej:** generowanie obrazów jest **zabronione** do
odwołania decyzją właściciela; zmiana tego stanu wymaga nowego ADR.
