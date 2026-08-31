# Gid: Karta Haseł — szkielet i klasyfikacja encji

Powiązania: [ADR 0005](../decisions/0005-szkielety-stron-i-protokol-wikilinkow.md)
(szkielety i wikilinki), [ADR 0003](../decisions/0003-petla-jawnego-przekazywania-i-hierarchia-kanonu.md)
(hierarchia kanonu).

## Po co są hasła

Karta Katalogowa opisuje **kartę**; Karta Haseł opisuje **element świata**,
wspólny dla wielu kart (albo istotny sam w sobie). Wspólna wiedza ląduje
w hasle, a karty odsyłają wikilinkami — bez dublowania. Backlinki („W
kolekcji") liczy się automatycznie.

Hasło powstaje kiedy (zasada właściciela, 2026-08-31):

1. **co najmniej 2 karty** odwołują się w swojej treści do encji
   (link-mining, Pętla Jakości, ADR 0006) — hasło nie powstaje „na
   zapas" przy pierwszej wzmiance;
2. właściciel zleci hasło wprost (zlecenie jest suwerenne wobec progu
   kart, ale domyślnie również czeka na drugą kartę).

Encja wspomniana w jednej karcie zostaje **zwykłym tekstem** (martwy
wikilink psuje build — ADR 0005) i trafia do kolejki link-miningu
(`docs/backlog.md`); wiedza o niej żyje w sekcjach Karty Katalogowej.

## Plik hasła

`content/lore/<slug>.md`:

```md
---
typ: haslo
slug: crebain
tytul: Crebain
klasa: fauna
plan: srodziemie
tagi: [fauna, szpiedzy]
materializacja: YYYY-MM-DD
---

## Definicja

<lead w duchu Wikipedii: 2–3 zdania, definicja + kontekst>

## Opis

<wiedza o encji W SETTINGU PO TRANSPOZYCJI, z cytowaniami>

## Na mapie

<tylko dla klasy geografia/lokacja: region/obwódka na mapie planu>

## Źródła

<cytowania z kwerendy>
```

## Klasy encji (frontmatter `klasa` — zamknięty słownik)

| Klasa | Obejmuje | Przykład |
|---|---|---|
| `geografia` | regiony, góry, rzeki, miasta, twierdze | Dunland, Isengard |
| `fauna` | zwierzęta i bestie | Crebain, wargi |
| `flora` | rośliny i lasy | Fangorn |
| `spolecznosc` | frakcje, ludy, organizacje, armie | Uruk-hai Białej Ręki |
| `postac` | jednostki imienne | Saruman |
| `wydarzenie` | wydarzenia i bitwy | Wojna o Pierścień |
| `magia` | systemy magiczne, artefakty magiczne | Palantíry |
| `artefakt` | przedmioty | Palantír (przedmiot) |
| `koncepcja` | abstrakty, tematy, motywy | szpiegostwo, kolektywna zgroza |

Klasa decyduje o zachowaniu renderera (np. `geografia`/`postac` mogą mieć
obrys na mapie). Nowa klasa = zmiana tego gidu + ADR 0005 (świadomie).

## Kontrakt sekcji

| Sekcja | Kontrakt |
|---|---|
| **Definicja** | 2–3 zdania: co to jest + kontekst w settingu. Obowiązkowe. |
| **Opis** | Rozbudowana wiedza: pochodzenie, rola w świecie, relacje do innych encji (wikilinki!), warianty w kanonie. Zawsze **w settingu po transpozycji** — pochodzenie MtG (np. odpowiednik karty w innym planie) opisuje sekcja osobno, wyraźnie oddzielona. Cytowania obowiązkowe przy każdej kwerendzie. Obowiązkowe. |
| **Pochodzenie MtG** (opcjonalna) | Skoro encja bywa transpozycją: jaki element MtG/karty jest źródłem. Dla encji czysto settingowych — brak sekcji. |
| **W kolekcji** | Liczone automatycznie (backlinki) — NIE wpisuje się ręcznie. |
| **Powiązane hasła** | Wikilinki z jednym zdaniem uzasadnienia. |
| **Na mapie** | Tylko `geografia`/`postac` z ustaloną lokalizacją: region/obwódka + pewność. |
| **Źródła** | Jak w Karcie Katalogowej: link + co zaczerpnięto; „wiedza ogólna" bez URL-a oznaczona. Obowiązkowe. |

## Dobre praktyki

- Hasło pisze się językiem encyklopedycznym; kanonem jest karta MtG
  (snapshot) + lore świata docelowego (ADR 0010/0011) — narracja kolekcji
  nie jest już dostarczana i nie może być źródłem hasła.
- Hasło nie streszcza kart — opisuje świat. Karty linkują do hasła,
  hasło linkuje do encji, nie do streszczeń kart.
- Jedno hasło = jedna encja (nie „Crebain i wargi").
- Tytuł hasła w liczbie pojedynczej, jeśli encja jest typem („Crebain"),
  i właściwej formie, jeśli jest jednostką („Saruman").
