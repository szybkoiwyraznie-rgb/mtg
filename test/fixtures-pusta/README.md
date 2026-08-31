# Fixture: pusta baza (zero kart, haseł, planów, map)

Cel: regresja stanów pustych UI (strona główna „Baza jest pusta", listy 0,
404, brak trafień) na artefakcie budowanym z pustymi katalogami treści —
realna baza repozytorium od PR-2 nie jest już pusta (ui-smoke.test.js).

Loadery (tools/content-loader.mjs) tolerują brak katalogów `content/`,
`collection/`, `scryfall/`, `maps/` — dlatego fixture to jeden README
i zero plików treści.
