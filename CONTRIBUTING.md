# Zasady współpracy

Projekt jest prywatny i prowadzony przez sesje agentów Arena na zlecenie
właściciela. Formalne zasady: [`AGENTS.md`](AGENTS.md) (sesje agentskie),
[`docs/WORKFLOW.md`](docs/WORKFLOW.md) (proces scalania),
[`SECURITY.md`](SECURITY.md) (bezpieczeństwo repozytorium).

## Jak powstają zmiany

1. **Sesja agentska** dostaje zlecenie (materializacja karty, hasło, mapa,
   praca silnikowa) albo wykonuje Pętlę Jakości (ADR 0006).
2. Każda sesja pracuje na własnej gałęzi, otwiera PR na starcie i commituje
   inkrementalnie (każdy commit = zielone `npm test` + `npm run build`).
3. Właściciel przegląda PR i scala metodą **Squash and merge**.

## Jak zgłaszać

- **Karta do materializacji:** szablon issue „Materializacja karty"
  (`.github/ISSUE_TEMPLATE/materialization.yml`) lub bezpośrednio w czacie
  sesji — format dostawy opisuje `docs/guides/SZKIELET_KARTY.md`.
- **Propozycja hasła lore:** szablon „Hasło lore".
- **Praca mapowa:** szablon „Mapa planu".
- **Błędy:** dowolny szablon; dla błędów treści cytuj stronę (slug) i
  sekcję.

## Konwencje treści (skrót)

- Treść w markdown z frontmatterem; struktura sekcji wg gidów z
  `docs/guides/`; slugi małe litery ASCII z myślnikami.
- `collection/entries/` — nienaruszalne (verbatim, kanon właściciela).
- Wikilinki `[[slug]]` / `[[slug|etykieta]]` — muszą się rozwiązywać
  (czerwony test inaczej).
- Tagi wyłącznie ze słownika `content/taxonomia.json`.
- Wiedza z internetu wymaga cytowania w sekcji Źródła.
- Zero generowanych grafik (ADR 0008) i zero zależności npm (ADR 0002).

## Testy przed PR

```bash
npm test        # szybki rdzeń
npm run build   # artefakt musi się budować
```

CI biega pełny pakiet (`test:all`) i build — PR bez zielonego CI nie
wchodzi do review.
