# ADR 0044: Karty dwustronne — jedna twarz = jedna Karta Katalogowa; dane twarzy bierzemy z `card_faces[]`

- **Status:** Zaakceptowana
- **Data:** 2026-09-09
- **Decydenci:** właściciel projektu (korekta 2026-09-09: każda strona karty dwustronnej ma być traktowana niezależnie; polecenie: „dopisz w ADRach zasadę dla kart dwustronnych”), agent Arena (sesja PR-27)
- **Doprecyzowuje:** ADR 0004 (snapshoty Scryfalla), ADR 0030 (zakres pojedynczej Karty Katalogowej), ADR 0026 (Fabuła jako kotwica transpozycji), ADR 0042 (narracja 100% w świecie)
- **Powiązania:** ADR 0010 (hierarchia kanonu), ADR 0036 (tożsamość imgId niezależna od Scryfalla)

## Kontekst

Pierwsza lokalna materializacja karty o układzie `layout: transform`
(*Civilized Scholar // Homicidal Brute*, ISD/47) ujawniła lukę w regułach.
Scryfall przechowuje taką kartę jako jeden obiekt opisujący cały fizyczny
print, z nazwą zbiorczą (`name`) i tablicą `card_faces[]`. Jednocześnie
czytelnik Codexu nie dostaje „fizycznego druku do obejrzenia”, tylko
**Kartę Katalogową konkretnej materializacji**.

Próba potraktowania obu stron jako jednej strony została odrzucona przez
właściciela. W tym projekcie karta dwustronna nie jest jednym wpisem „o
wszystkim naraz”, tylko zbiorem **niezależnych stron** — po jednej na każdą
fizyczną twarz, gdy właściciel zechce ją zmaterializować.

## Decyzja

1. **Każda fizyczna twarz karty dwustronnej jest osobną Kartą Katalogową.**
   Dotyczy to kart Scryfalla reprezentujących dwie strony fizycznego druku
   przez `card_faces[]` (w szczególności `layout: transform`). Jeżeli
   właściciel przekazuje stronę `Civilized Scholar`, to Codex materializuje
   kartę `Civilized Scholar`; druga strona nie staje się automatycznie częścią
   tego samego wpisu.

2. **Jedna materializacja = dokładnie jedna twarz.**
   `nazwa` we frontmatterze, tytuł strony, infoboks, narracja i pinezka
   odnoszą się wyłącznie do twarzy wskazanej przez właściciela. Na stronie
   tej karty **nie wymienia się drugiej strony** — ani w kronice, ani w
   sekcjach „Postacie i Byty”, „Flavor Text”, „Transpozycja”, „Na Mapie”,
   „Mechanika jako Opowieść”, „Podsumowanie Lore”, ani w opisach źródeł.

3. **Niezależność jest ścisła w trzech warstwach:**
   - **lore / kronika** — opisuje tylko wybraną twarz,
   - **Fabuła** — osadza tylko wybraną twarz,
   - **mechanika** — interpretuje tylko reguły wybranej twarzy.
   Strona przeciwna może kiedyś dostać własny wpis, ale dopiero jako
   osobna dostawa i osobna materializacja.

4. **Snapshot Scryfalla może pozostać pełną odpowiedzią całej karty, ale
   konsumpcja danych musi być per twarz.**
   Wolno przechowywać wspólny snapshot fizycznego druku z `card_faces[]`
   albo inną równoważną reprezentację pełnej odpowiedzi API. To detal
   magazynowania. Kontrakt semantyczny brzmi: przy budowie strony i testach
   dane specyficzne dla twarzy są pobierane z tej pozycji `card_faces[]`,
   której `name` zgadza się z materializowaną kartą.

5. **Pola twarzy i pola wspólne rozdziela się świadomie.**
   - **Z `card_faces[]`** bierze się co najmniej: `name`, `mana_cost`,
     `type_line`, `oracle_text`, `colors`, `power`, `toughness`,
     `flavor_text`, `artist`, `image_uris` oraz inne dane opisujące właśnie
     tę stronę druku.
   - **Z poziomu głównego snapshotu** bierze się tylko pola wspólne dla
     całej odpowiedzi, np. `cmc`, `set`, `set_name`, `rarity`, `legalities`,
     `prices`, identyfikatory i URI.
   Zdublowane top-level pola frontowej strony, jeśli akurat występują w
   odpowiedzi Scryfalla, są wygodnym fallbackiem technicznym, ale **nie są
   jedynym kontraktem** i nie wolno od nich uzależniać poprawności projektu.

6. **Zakres ADR-a jest wąski: dotyczy kart dwustronnych.**
   Nie rozstrzyga dziś sposobu obsługi kart split, adventure, aftermath,
   meld i innych wieloczęściowych konstrukcji, które nie są fizycznie
   kartą dwustronną. Jeśli taki przypadek trafi do repo, wymaga osobnej
   decyzji.

## Konsekwencje

**Dodatnie:** treść kart dwustronnych przestaje mieszać dwa różne byty;
Karta Katalogowa pozostaje wierna swojej nazwie; snapshoty Scryfalla mogą
pozostać pełne, a mimo to zasilać pojedynczą twarz bez hacków w treści;
regresje da się łatwo testować na poziomie build/test/UI.

**Ujemne:** fizycznie jeden print może prowadzić do dwóch osobnych stron,
a implementacja musi umieć odróżnić pola wspólne od pól twarzy; błędne
poleganie na top-level mirrorach Scryfalla będzie dawało mylące wyniki.

**Dla sesji agentskiej:** gdy widzisz `card_faces[]` na karcie dwustronnej,
nie piszesz strony „o obu stronach”. Najpierw ustalasz, którą twarz przekazał
właściciel, potem materializujesz wyłącznie ją i sprawdzasz testami, że druga
nie przecieka ani do danych, ani do narracji.
