# ADR 0014: Karta Katalogowa bez sekcji „Druk w Kolekcji"

- **Status:** Zaakceptowana
- **Data:** 2026-09-01
- **Decydenci:** właściciel projektu (decyzja 2026-09-01, czat: „cała ta sekcja
  Druk w kolekcji jest dodana bez mojej wiedzy. Usuń ją."); agent Arena (sesja PR-4)
- **Zastępuje:** punkt 3 ADR 0011 (lista sekcji Karty Katalogowej z sekcją
  „Druk w Kolekcji"); pozostałe decyzje ADR 0011 (chudy format dostawy,
  narracja/prompt poza pętlą) pozostają w mocy

## Kontekst

ADR 0011 wprowadził do szkieletu Karty Katalogowej sekcję „Druk
w Kolekcji" — opis posiadanego wydruku (artysta, rama, styl) na podstawie
danych snapshotu. Właściciel po obejrzeniu strony karty ocenił, że to
**meta-informacja kolekcjonerska, nie lore**: „To nie jest wiedza, która
jest clue tego projektu. Co mnie obchodzi, co robią artyści." Sekcja
znika; dane techniczne wydruku nie są celem Pętli Jakości (pkt 2 —
pogłębianie LORE, patrz ADR 0015).

## Decyzja

1. **Sekcja „Druk w Kolekcji" znika ze szkieletu Karty Katalogowej.**
   Kanoniczny szkielet ma 9 sekcji (aktualny kontrakt:
   `docs/guides/SZKIELET_KARTY.md`); `SEKCJE_KARTY` w `src/codex/registry.js`
   strzeże spójności — sekcja jest zakazana jak każda poza szkieletem.
2. **Dane wydruku nie znikają ze strony — degradują się do infoboksu**,
   gdzie silnik i tak je pokazuje (wydanie, rzadkość, artysta) wprost
   ze snapshotu (ADR 0004). Bez narracji, bez kwerend o artystach,
   bez opisów wariantów wydań.
3. **Zakres pogłębiania (Pętla Jakości, krok 2):** rozbudowa wyłącznie
   treści lore — świat, byty, etymologia, mechanika jako opowieść,
   flavor, transpozycja, osadzenie na mapie. Meta-informacje (biografie
   artystów, warianty wydruków, finishe, procesy Codexu) NIE są celem
   pętli. Szczegóły w ADR 0015.
4. Istniejące strony kart traciły sekcję w tej samej sesji (migracja
   bez pozostawiania treści „na pastwę" — zasada AGENTS.md §6).

## Konsekwencje

**Dodatnie:** strona karty jest w całości o lore — spójna z celem
projektu („wikipedia" świata kolekcji); mniej szumu i utrzymania;
pogłębianie przestaje uciekać w kolekcjonerstwo.

**Ujemne:** informacja „który wydruk jest w kolekcji" nie ma już
własnej sekcji narracyjnej — świadomy koszt (infoboks + snapshot
wystarczają; ewentualna przyszła potrzeba wymaga decyzji właściciela).

**Dla sesji agentskiej:** nie odtwarza się sekcji ani kwerend
o artystach; kwerendy Pętli Jakości dotyczą wyłącznie lore świata
i mechaniki karty.
