# Mapy planów

Katalog na plan: `maps/<plan>/` z plikami:

- `map.json` — metadane (wariant T1/T2/T3, źródło podkładu, wymiary,
  pinezki kart z współrzędnymi znormalizowanymi 0–1 i poziomem pewności,
  regiony haseł geograficznych);
- `podklad.(png|jpg)` — rasterowy podkład (jedyna klasa binariów w repo,
  ADR 0007/SECURITY.md);
- opcjonalne warstwy wektorowe.

Proces powstawania mapy: `docs/guides/PROCES_MAP.md` (MA1–MA5).
Silnik map na stronie (pan/zoom): ROADMAP K3/K4.
