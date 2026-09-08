# Plan PR-26 — Pętla Jakości po PR-25

## Cel

Wykonać rutynowy przebieg Pętli Jakości po scaleniu PR-25: potwierdzić
integralność, sprawdzić kompletność treści i map, wykonać link-mining bez
fabrykowania haseł oraz zostawić audyt i handoff dla następnej sesji.

## Zakres

1. Audyt poprzedniego scalonego PR-25 wobec stanu bieżącego.
2. `npm test`, pełny build i `map-audit`.
3. Ranking stron i pogłębienie wyłącznie tam, gdzie istnieje realna luka.
4. Link-mining z progiem dwóch kart; nowe hasło tylko po spełnieniu progu.
5. Pass mapowy i aktualizacja dziennika, „Co nowego” oraz handoffu.

## Kryteria ukończenia

- testy i build zielone z pełnym klonem historii;
- brak nowych naruszeń ADR 0040/0042/0043;
- `map-audit` bez problemów;
- wynik i decyzje zapisane w audycie;
- każda samodzielna zielona zmiana w osobnym commicie i wypchnięta.

## Ograniczenia

Nie materializować kart bez dostawy właściciela, nie tworzyć haseł poniżej
progu, nie generować grafik i nie zmieniać zamkniętych decyzji mapowych.
