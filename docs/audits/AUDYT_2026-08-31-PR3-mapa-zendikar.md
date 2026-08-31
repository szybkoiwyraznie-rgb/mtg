# Audyt — mapa wektorowa Zendikaru (punkt startowy, przed wzbogaceniem)

- **Sesja:** 2026-08-31 (PR-3 c.d.)
- **Cel audytu:** ustalić stan i niedostatki mapy Zendikaru, by wzbogacić
  ją o elementy **potwierdzone w źródłach** (zlecenie właściciela).

## Co jest w podkładzie (`maps/zendikar/podklad.svg`)

Ręcznie kodowany wektor SVG (2000×1400), wariant **T3** (ADR 0012):

| Element | Stan |
|---|---|
| Ocean + fale + wiry Roil + dryfujące hedrony | jest (dekoracyjne) |
| Sejiri (polarny lód) | kontynent + etykieta |
| Łańcuch wschodni: Akoum–Bala Ged–Guul Draz | kontynent + etykiety |
| Wulkaniczne szczyty Akoum | 2 (symbol trójkątny) |
| Oko Ugina | hedron + etykieta |
| Tazeem | kontynent + etykieta |
| Halimar (morze śródlądowe) | obrys + etykieta |
| Tama Sea Gate | kreska + etykieta |
| Emeria | 2 hedrony + etykieta |
| Ondu | kontynent + etykieta |
| Wyspy Ondu (Jwar, Agadeem, Beyeen) | 4 figury + etykiety |
| Malakir | kropka + etykieta |
| Murasa | kontynent przerywany + etykieta |
| Kompas, ramka, podpis „rekonstrukcja…" | jest |

## Czego brakuje (o co prosi właściciel)

- **Brak gór** poza 2 szczytami Akoum (Akoum ma mieć superwulkan i pasmo;
  Murasa — Skyfang/Shatterskull; Tazeem — Lun Bulwark; Ondu — Teetering).
- **Brak lasów** (Oran-Rief na Tazeem, Turntimber na Ondu, jaddi-trees
  w Murasa, dżungla Bala Ged) — tylko etykieta „Las Oran-Rief".
- **Brak rzek** (Umara na Tazeem, Umung na Bala Ged, Raimunza w Murasa,
  Vazi) i wodospadu Magosi.
- **Brak miast/siedzib** (Sea Gate miasto, Affa/Goma Fada/Tal Terig
  w Akoum, Kabira/Agadeem/Jwar w Ondu, Nimana w Guul Draz, Ikiral
  w Sejiri, Zulaport, Sunder Bay).
- **Brak ruin/Skyclave** (Emeria jest; brak Akoum/Bala Ged/Guul Draz/
  Murasa/Ondu/Sejiri Skyclave oraz Jade Room, Ruins of Ysterid).
- **Brak bagnisk** (Bordermire, Hanging Swamp, Hagra Cistern, Pelakka
  Karst) i zatok (Bojuka Bay, Sunder Bay).
- Mapa wizualnie „płaska" — brak tekstury (wzgórza, klify, step, lód).

## Zgodność z procesem

- **ADR 0012:** rekonstrukcja T3, `rekonstrukcja: true`, podpis
  kartograficzny, Murasa przerywana — wszystko zachowane. Wzbogacenie
  NIE zmienia wariantu (to nie oficjalna mapa; pozycje przybliżone).
- **ADR 0008:** zero generowanych grafik — wektor koduje ręcznie
  (jak istniejący podkład), bez generatora obrazów.
- **`test/mapy.test.js`:** pilnuje map.json (struktura, źródło, wymiary),
  pinezek (0–1, pewność, uzasadnienie), zgodności frontmatter ↔ map.json.
  Wzbogacenie podkładu SVG i dodanie `elementy`/`kotwice` w map.json
  nie narusza tych reguł (pola dodatkowe są ignorowane przez test).

## Wniosek

Mieć można uznaną za „ubogą" mapę — brakuje głównie wektora przyrodniczo-
osadniczego (góry, lasy, rzeki, miasta, bagna, ruiny). Zbudowanie tego
w stylu pergaminu, z elementami potwierdzonymi w MTG Wiki / Guide Zendikar /
Plane Shift, spełnia zlecenie i pozostaje w zgodzie z ADR 0012/0007/0008.
