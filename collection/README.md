# Kolekcja — wpisy właściciela (KANON, read-only)

`entries/` zawiera surowe wpisy dostarczone przez właściciela — **verbatim,
nienaruszalne, kanon najwyższego rzędu** (ADR 0003). Sesje ich nie edytują;
poprawki treści wpisu robi wyłącznie właściciel.

Format pliku `entries/<slug>.md` (slug ten sam co Karta Katalogowa):
frontmatter (imgId, nazwa, wydanie, plan, kolory, mv, dostarczono) +
sekcje `## Prompt` i `## Narracja` (treść verbatim). Szczegóły:
`docs/guides/SZKIELET_KARTY.md` → „Format dostawy".

Ten plik (README.md) nie jest wpisem — loader go pomija.
