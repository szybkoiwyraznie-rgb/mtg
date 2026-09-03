#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Herby gildii na mapie Ravnicy v3 (wariant T2+, podkład z wektoryzacji
fanowskiej, przestrzeń 6849×5292 — maps/ravnica/map.json, ADR 0031).

Wektoryzacja rastrowego źródła odzyskała kolorowe TARCZE-celowniki
siedzib (halo 12% + pierścień + pełny rdzeń w barwie gildii), ale
utraciła BIAŁY GLIF z wnętrza rdzenia. Ten skrypt przywraca glify:
wstrzykuje do maps/ravnica/podklad.svg grupę <g id="herby-gildii"> z
białym symbolem gildii w środku każdej siedziby.

Skrypt NIE regeneruje podkładu (wektoryzacja źródła jest prywatna,
poza gitem — ADR 0031) — tylko dodaje warstwę glifów do zatwierdzonego
SVG. Idempotentny: przy powtórnym uruchomieniu nadpisuje swoją grupę.

Glify rysowane ręcznie w języku mapy (białe sylwetki), w układzie
±100 jednostek; skala dobierana do promienia pełnego rdzenia tarczy
(skala ≈ 0.70·r/100), by glif siedział w kolorowym dysku z marginesem.
Detale „dziur” (źrenice, oczodoły) rysowane kolorem rdzenia.

Siedziby (kanon GGR / mtg.wiki; centra z odzyskanych markerów):
  Skarrg → Gruul (płomień), Sunhome → Boros (pięść),
  Vitu-Ghazi → Selesnya (drzewo), Nivix → Izzet (błyskawica),
  Zonot Seven/Zameck → Simic (fale), New Prahv → Azorius (waga),
  Orzhova → Orzhov (słońce), Rix Maadi → Rakdos (rogi),
  Korozda & Svogthos → Golgari (czaszka),
  Nightveil & Duskmantle → Dimir (oko).
Millennial Platform (też duża tarcza) to obiekt neutralny — BEZ glifu.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
SVG = ROOT / 'maps' / 'ravnica' / 'podklad.svg'
MAPJSON = ROOT / 'maps' / 'ravnica' / 'map.json'

# (centrum x, centrum y, gildia) — centra pełnych rdzeni z <g id="markery">
SIEDZIBY = [
    (3999, 811,  'gruul'),    # Skarrg (gruulowe zgromadzenie)
    (3742, 1776, 'boros'),    # Sunhome
    (5064, 1274, 'selesnya'), # Vitu-Ghazi
    (2677, 2053, 'izzet'),    # Nivix
    (1231, 2717, 'simic'),    # Zonot Seven / Zameck
    (5474, 2865, 'azorius'),  # New Prahv
    (3392, 2878, 'orzhov'),   # Orzhova
    (2188, 3754, 'rakdos'),   # Rix Maadi (Undercity)
    (3850, 4322, 'golgari'),  # Korozda & Svogthos (Undercity)
    (5054, 3976, 'dimir'),    # Nightveil & Duskmantle (Undercity)
]

# Glify w układzie ±100. {białe} = biel; {dziura} = kolor rdzenia.
GLIFY = {
 'selesnya': (
   '<path d="M0,-95 L34,-40 L16,-40 L40,0 L22,0 L30,45 L-30,45 L-22,0 '
   'L-40,0 L-16,-40 L-34,-40 Z" fill="{b}"/>'
   '<rect x="-10" y="38" width="20" height="40" fill="{b}"/>'),
 'boros': (
   '<rect x="-42" y="-30" width="84" height="62" rx="12" fill="{b}"/>'
   '<rect x="-32" y="-72" width="18" height="44" rx="6" fill="{b}"/>'
   '<rect x="-9" y="-80" width="18" height="52" rx="6" fill="{b}"/>'
   '<rect x="14" y="-72" width="18" height="44" rx="6" fill="{b}"/>'
   '<rect x="-50" y="38" width="100" height="12" rx="4" fill="{b}"/>'
   '<path d="M-72,10 L-52,22 M72,10 L52,22 M-66,-40 L-48,-28 M66,-40 L48,-28" '
   'stroke="{b}" stroke-width="10" fill="none" stroke-linecap="round"/>'),
 'gruul': (
   '<path d="M0,-95 C50,-45 70,-25 55,15 C45,50 20,78 0,88 C-20,78 -45,50 '
   '-55,15 C-70,-25 -50,-45 0,-95 Z" fill="{b}"/>'
   '<path d="M0,-50 C22,-22 28,-8 18,18 C10,40 -8,52 0,62 C-20,45 -24,18 '
   '-16,-8 C-8,-30 4,-40 0,-50 Z" fill="{d}"/>'),
 'izzet': (
   '<path d="M28,-92 L-52,8 L-8,8 L-28,92 L52,-14 L10,-14 Z" fill="{b}"/>'),
 'orzhov': (
   '<circle cx="0" cy="0" r="36" fill="{b}"/>'
   '<path d="M0,-60 L0,-88 M0,60 L0,88 M-60,0 L-88,0 M60,0 L88,0 '
   'M-42,-42 L-62,-62 M42,-42 L62,-62 M-42,42 L-62,62 M42,42 L62,62" '
   'stroke="{b}" stroke-width="12" stroke-linecap="round" fill="none"/>'),
 'azorius': (
   '<path d="M0,72 L0,-55 M-55,-55 L55,-55 M-34,72 L34,72 '
   'M-55,-55 L-55,-30 M55,-55 L55,-30" '
   'stroke="{b}" stroke-width="12" stroke-linecap="round" fill="none"/>'
   '<path d="M-55,-30 L-80,6 Q-55,26 -30,6 Z" fill="{b}"/>'
   '<path d="M55,-30 L30,6 Q55,26 80,6 Z" fill="{b}"/>'
   '<circle cx="0" cy="-63" r="9" fill="{b}"/>'),
 'dimir': (
   '<path d="M-82,0 Q0,-66 82,0 Q0,66 -82,0 Z" fill="{b}"/>'
   '<circle cx="0" cy="0" r="26" fill="{d}"/>'),
 'golgari': (
   '<path d="M-72,72 L72,-8 M-72,-8 L72,72" '
   'stroke="{b}" stroke-width="16" stroke-linecap="round" fill="none"/>'
   '<path d="M0,-80 C44,-80 62,-50 62,-20 L62,12 L44,12 L44,42 L-44,42 '
   'L-44,12 L-62,12 L-62,-20 C-62,-50 -44,-80 0,-80 Z" fill="{b}"/>'
   '<circle cx="-22" cy="-16" r="13" fill="{d}"/>'
   '<circle cx="22" cy="-16" r="13" fill="{d}"/>'
   '<path d="M-14,16 L14,16" stroke="{d}" stroke-width="10" '
   'stroke-linecap="round" fill="none"/>'),
 'rakdos': (
   '<path d="M-80,-40 C-92,-82 -60,-96 -32,-66 C-22,-56 -10,-54 0,-54 '
   'C10,-54 22,-56 32,-66 C60,-96 92,-82 80,-40 C72,-14 50,-4 50,22 '
   'L50,52 L-50,52 L-50,22 C-50,-4 -72,-14 -80,-40 Z" fill="{b}"/>'
   '<circle cx="-24" cy="-20" r="14" fill="{d}"/>'
   '<circle cx="24" cy="-20" r="14" fill="{d}"/>'
   '<path d="M-28,32 L28,32" stroke="{d}" stroke-width="11" '
   'stroke-linecap="round" fill="none"/>'),
 'simic': (
   '<path d="M-78,-34 Q-39,-62 0,-34 Q39,-6 78,-34 '
   'M-78,8 Q-39,-20 0,8 Q39,36 78,8 '
   'M-78,50 Q-39,22 0,50 Q39,78 78,50" '
   'stroke="{b}" stroke-width="14" stroke-linecap="round" fill="none"/>'),
}


def tarcze(svg):
    """Pierścienie celowników z <g id="markery">: (x, y, r_ring, kol, sw)."""
    seg = re.search(r'<g id="markery">(.*?)</g>', svg, re.S).group(1)
    out = []
    for cx, cy, r, col, sw in re.findall(
            r'<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)" fill="none" '
            r'stroke="(rgb\([^)]*\))" stroke-width="([\d.]+)"', seg):
        out.append((float(cx), float(cy), float(r), col, float(sw)))
    return out


def najblizsza_tarcza(tarcze_, x, y):
    t = min(tarcze_, key=lambda t: (t[0] - x) ** 2 + (t[1] - y) ** 2)
    assert (t[0] - x) ** 2 + (t[1] - y) ** 2 < 30 ** 2, \
        f'brak tarczy przy ({x},{y}) — najbliższa ({t[0]:.0f},{t[1]:.0f})'
    return t


def main():
    svg = SVG.read_text(encoding='utf-8')
    # idempotentność: odetnij całą poprzednią warstwę glifów (od naszego
    # znacznika do końca pliku) — zostaje sama podstawa (bez `</svg>`).
    svg = svg.split('<g id="herby-gildii">')[0].strip()
    if svg.endswith('</svg>'):
        svg = svg[:-len('</svg>')].rstrip()
    assert svg.endswith('</g>'), 'nieoczekiwany koniec podstawy SVG'
    tarcze_ = tarcze(svg)

    czesci = ['<g id="herby-gildii">']
    for x, y, gildia in SIEDZIBY:
        cx, cy, r_ring, col, sw = najblizsza_tarcza(tarcze_, x, y)
        inner = r_ring - sw / 2          # wewnętrzna krawędź pierścienia
        # pełny dysk w barwie gildii wypełnia wnętrze pierścienia (kryje
        # też mały rdzeń i jasną przerwę); na nim biały glif.
        czesci.append(f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{inner:.1f}" '
                      f'fill="{col}"/>')
        s = round(inner / 115, 3)        # glif ~0.8·inner w układzie ±92
        glif = GLIFY[gildia].format(b='#ffffff', d=col)
        czesci.append(
            f'<g transform="translate({cx:.0f} {cy:.0f}) scale({s})">{glif}</g>')
    czesci.append('</g>')

    SVG.write_text(svg + '\n' + '\n'.join(czesci) + '\n</svg>\n',
                   encoding='utf-8')
    print(f'OK — {len(SIEDZIBY)} herbów gildii wstrzykniętych do {SVG.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
