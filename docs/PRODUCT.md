# Karta projektu

## Problem

Lore prywatnej kolekcji MtG żyje w rozproszonych miejscach: nagłówki w
arkuszu kolekcji, narracje w notatkach właściciela, wiedza o planach — w
głowie i internecie. Karty są transpozycjami (setting docelowy bywa innym
IP niż plan rodzinny karty), więc żadne gotowe źródło (Scryfall, Wiki
MtG/Fandom) nie opisuje „tej" wersji świata. Nie ma miejsca, które:

- łączy kartę, jej mechanikę i flavor z lore settingu po transpozycji;
- trzyma narracje właściciela jako kanon;
- pozwala nawigować po świecie (encje wspólne wielu kart, mapy planów).

## Wizja

„Wikipedia" kolekcji: każda jawnie przekazana karta materializuje się jako
**Karta Katalogowa** (szkielet: kontekst świata, postacie, nazwa, mechanika
jako opowieść, flavor, transpozycja, narracja, powiązania, mapa, źródła,
podsumowanie). Encje wspólne dla wielu kart dostają **Karty Haseł**
(geografia, fauna, frakcje, magia, postacie, wydarzenia…), linkowane
wikilinkami w obie strony — wiedza nie dubluje się, a baza nawiguje jak
prawdziwa encyklopedia. Każdy plan ma **mapę** z pinezkami kart.

## Użytkownik i scenariusz

Głównym użytkownikiem jest właściciel kolekcji. Przegląda Codex na trzy
sposoby: lokalnie z dysku (także iPad, `file://` — z torami obrazów FOT/KON),
przez GitHub Pages poza domem (mobile/iPad), oraz w GitHubie (źródłowe
markdowny). Dostarcza wpisy kolekcji; sesje agentskie materializują i
pogłębiają.

## Zakres docelowy

- materializacja kart z pętli jawnego przekazywania (ADR 0003);
- Karty Haseł wydobywane link-miningiem + zlecone;
- mapa planu (T1 hybryda) z pinezkami kart i poziomem pewności (ADR 0007);
- strona główna: plany, ostatnie materializacje, co-nowego, szukaj, tagi;
- Pętla Jakości jako mechanizm pogłębiania bazy między dostawami (ADR 0006).

## Poza zakresem

Dopóki jawnie nie zmienimy decyzji, projekt **nie zakłada**:

- obsługi kart nieprzekazanych jawnie (importy, skan kolekcji);
- generowania grafik (ADR 0008 — decyzja odroczona dla haseł);
- edycji przez przeglądarkę / kont użytkowników — baza jest plikowa;
- publicznego udostępnienia (użytek prywatny; ewentualna publikacja = nowy
  ADR o licencjach treści i podkładów map);
- integracji z regułami gry / silnikiem mtg-game (to projekt siostrzany,
  nie zależność).
