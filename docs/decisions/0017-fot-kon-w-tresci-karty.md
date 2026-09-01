# ADR 0017: FOT/KON rysowane w treści karty (wersja lokalna), bez przycisków torów

- **Status:** Zaakceptowana
- **Data:** 2026-09-01
- **Decydenci:** właściciel projektu (decyzja 2026-09-01, czat); agent
  Arena (sesja PR-4)
- **Zastępuje:** mechanikę przełączanych torów z ADR 0008 (przyciski
  Druk/FOT/KON pod obrazem infoboksu); pozostałe decyzje ADR 0008
  (zakaz generowanych grafik, `img/` poza gitem, cichy fallback)
  pozostają w mocy

## Kontekst

ADR 0008 przewidywał tory obrazów przełączane przyciskami pod obrazem
w infoboksie. Właściciel po obejrzeniu strony: „Nie wiem, co rozumiesz
przez «przycisk torów». Ja bym chciał, żeby w wersji lokalnej, gdy
występują te ilustracje, po prostu rysowały się na karcie: FOT na samej
górze głównej kolumny, a KON pod pierwszą sekcją." Ilustracje FOT
(panorama 21:9) i KON (bestiariusz 16:9) to wizualizacje alternatywne
właściciela — w transpozycjach często jedyne słuszne przedstawienie
sceny, więc zasługują na miejsce w treści, nie na przełącznik.

## Decyzja

1. **Wersja lokalna (pliki istnieją):** FOT rysuje się jako **pierwszy
   element głównej kolumny** Karty Katalogowej (nad treścią sekcji),
   KON — **pod pierwszą sekcją** treści. Obie grafiki pełną szerokością
   kolumny, bez nagłówków i opisów (to treść, nie meta).
2. **Infoboks bez zmian roli źródłowej:** pokazuje druk Scryfalla
   (tor główny, z twarzą syntetyczną jako fallbackiem). Przyciski torów
   znikają — nie są potrzebne, bo FOT/KON nie podmieniają obrazu
   w infoboksie.
3. **Cichy fallback jak dotychczas (ADR 0008):** sloty FOT/KON są
   ukryte i sondowane próbą załadowania `./img/<imgId>FOT|KON.png`;
   nieudane ładowanie usuwa slot bez śladu (Pages, wersja bez katalogu
   `img/` — strona identyczna jak dotychczas).
4. Kolejność renderowania ustalana w buildzie/renderze (slot wpleciony
   w treść), nie przez przestawianie DOM-u po załadowaniu.

## Konsekwencje

**Dodatnie:** wersja lokalna pokazuje pełną wizualizację właściciela
od razu, bez interakcji; strona na Pages niezależna od lokalnych plików;
mniej UI.

**Ujemne:** przy bardzo długich panoramach treść zaczyna się niżej —
świadomy koszt (panorama jest otwieraczem karty).

**Dla sesji agentskiej:** sloty FOT/KON są częścią szkieletu renderu
karty (ADR 0016 nie opisuje ich w kontraktach sekcji — to warstwa
obrazu, nie treść markdown).
