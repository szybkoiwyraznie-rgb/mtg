# ADR 0043: Na mapie oznaczenia noszą wyłącznie karty

- **Status:** Zaakceptowana
- **Data:** 2026-09-08
- **Decydenci:** właściciel projektu (decyzja 2026-09-08, czat: „Piny
  na mapach mogą mieć tylko KARTY, nic poza kartami nie powinno mieć
  na mapie pinów ani innych tego typu oznaczeń. Geografia też nie
  powinna być na mapie zaznaczana. Jedynym akceptowalnym powiązaniem
  haseł geograficznych z mapą jest odsyłanie ze strony (karty albo
  hasła albo planu) do mapy zbliżonej w określonym miejscu”); agent
  Arena (sesja PR-25)
- **Powiązania:** ADR 0015 §2.6 (regiony haseł — obwódki; **częściowo
  zastąpiona** — patrz §3), ADR 0030 (LORE-first), ADR 0027 (architektura
  map), SZKIELET_HASLA (sekcja „Na mapie”)

## Kontekst

ADR 0015 §2.6 przewidywał „regiony haseł geograficznych (obwódki) —
gdy hasła istnieją (próg ≥2 kart)”. Pierwsze użycie mechanizmu
(Pętla Jakości 2026-09-08: hasło Mephidross) wprowadziło na mapę
Mirrodinu obwódkę regionu + pinezkę w frontmatterze hasła. Właściciel
odrzucił ten kierunek jako problem systemowy: mapa ma jeden język
oznaczań — pinezki kart — i nie jest tablicą haseł. Geografia
(planu) jest treścią samej mapy (kotwice/POI z podkładu, ADR 0015
§2–3), nie warstwą oznaczeń encji z bazy.

## Decyzja

1. **Na mapach oznaczenia (piny, obwódki, znaczniki tego typu) noszą
   WYŁĄCZNIE karty.** Żadna inna strona bazy (hasło, plan) nie ma
   pinezki ani innego oznaczenia renderowanego na mapie.
2. **Geografia nie jest na mapie zaznaczana warstwą haseł.**
   Regiony/obwódki encji nie wchodzą do `map.json` (pole `regiony`
   wycofane ze schematu) i nie są renderowane przez silnik.
   Treścią mapy pozostają kotwice/POI podkładu (ADR 0015 §2–3)
   i pinezki kart — bez zmian.
3. **Częściowo zastąpiony jest ADR 0015 §2.6** (regiony haseł).
4. **Jedyny akceptowalny związek hasła (albo planu) z mapą =
   odsyłanie ze strony do mapy zbliżonej w określonym miejscu:**
   deep-link `#/mapa/<plan>?x=<0–1>&y=<0–1>` (współrzędne
   normalizowane — silnik centruje i przybliża punkt, BEZ
   zostawiania znacznika na mapie). Odsyłanie może iść ze strony
   karty, hasła lub planu (sekcja „Na mapie” / „Mapa”).
5. **Walidacja na sztywno:**
   - frontmatter `pinezka` poza typem `karta` = błąd buildu
     (walidator `src/codex/registry.js`);
   - pole `regiony` w `map.json` = błąd (test `mapy.test.js`;
     loader oznacza problem);
   - regresja: hasło `mephidross` bez pinezki i bez obwódki.

## Konsekwencje

**Dodatnie:** mapa ma jeden, czytelny język (pinezki kart);
hasła nie kolidują z mapą i nie starzeją się razem z nią;
mechanizm `?x=&y=` daje każdemu typowi stron ten sam sposób
„pokaż na mapie” bez zaśmiecania podkładu; reguła pilnowana
maszynowo (walidator + test + regresja).

**Ujemne:** hasło geograficzne nie „widać” na mapie z poziomu samej
mapy — czytelnik trafia na nie przez odsyłanie ze strony (właściciel:
to zamierzony kompromis); deep-link `?x=&y=` nie zostawia
zapamiętanego znacznika (nie da się z powrotem wskazać miejsca
z samej mapy).

**Dla sesji agentskiej:** sekcja „Na mapie” hasła/geografii =
zdanie o lokalizacji + pewności + JEDEN link `#/mapa/<plan>?x=&y=`;
pinezki dodaje się wyłącznie kartom (frontmatter + `pinezki[]`
w map.json, ADR-owe uzasadnienie); pole `regiony` nie wraca do
schematu — nowa obwódka = naruszenie ADR 0043.
