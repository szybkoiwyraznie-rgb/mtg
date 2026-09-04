#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Lokacje kanoniczne na mapie Ravnicy v3 (T2+, 6849×5292 — map.json, ADR 0031).

Wstrzykuje do maps/ravnica/podklad.svg warstwę <g id="lokacje-kanoniczne">
z etykietami (i tam, gdzie w wolnym polu, małym markerem) dla miejsc,
które właściciel zdecydował się dodać mimo braku w źródłowej rastrze
(świadome uchylenie decyzji z map.json z 2026-09-03, za zgodą właściciela
„zmień wcześniejsze decyzje”):

  • Beacon Tower — Interplanar Beacon (Azorius), P2; wczesniej „poza
    mapą do źródła epokowego” — teraz mały niebieski marker + etykieta
    w wolnym polu na wschód od New Prahv.
  • Gnat Alley — najdłuższa ulica planu (trasa Gruul); szara etykieta
    łuku (jak Tin Street / Plaza Avenue), bieg przybliżony (brak geometrii
    w źródle).
  • Guildmages' Forum, Pillar of the Paruns, Guildpact Square — gildyjny
    rdzeń przy Tenth District Plaza / Chamber (kanon mtg.wiki Tenth
    District); czarne etykiety cywilne w gęstej centrali (bez dodatkowych
    kropek-markerów — tam już jest gęsty ciąg małych tarcz civic).

Styl etykiet zgodny z v3: Georgia/serif dziedziczony, uppercase,
letter-spacing; civic czarne rgb(43,43,43), ulica szara #3a3a3a,
beacon niebieski rgb(45,188,255). Idempotentny (nadpisuje swoją grupę).

Kolejność warstw (waży): herby (ravnica-v3-herby.py) są warstwą
WEWNĘTRZNĄ, lokacje ZEWNĘTRZNĄ — zacommitowany podkład zawiera już
herby, więc na co dzień wystarczy uruchomić ten skrypt. Gdy zmienia się
herby, trzeba uruchomić je PIERWSZE (na czystym podkładzie), a potem
ten skrypt — inaczej regeneracja herbów ucina warstwę lokacji.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
SVG = ROOT / 'maps' / 'ravnica' / 'podklad.svg'

GRUPA = 'lokacje-kanoniczne'

# (linie tekstu, x, y_baseline_pierwszej_linii, kolor, rozmiar, obrót,
#  marker: None albo (x, y, kolor) — mały celownik,
#  linia: None albo [(x,y),...] — cienka szara trasa ulicy)
LOKACJE = [
    # Beacon Tower (P2, Azorius) — wolne pole na wschód od New Prahv;
    # marker w głąb lądu (nie na granicy), etykieta pod nim
    dict(lines=['BEACON', 'TOWER'], x=5820, y=3280, color='rgb(45,188,255)',
         fs=44, rot=0, marker=(5820, 3045, 'rgb(45,188,255)'), ls=2,
         line=None),
    # Gnat Alley — szara etykieta ulicy w wolnym polu P6 (między Foundry
    # Street a Rix Maadi); bieg przybliżony = cienka szara linia
    dict(lines=['GNAT ALLEY'], x=2350, y=3470, color='#3a3a3a',
         fs=46, rot=0, marker=None, ls=3,
         line=[(1980, 3470), (2180, 3455), (2400, 3470), (2620, 3485)]),
    # Gildyjny rdzeń (P1) — czarne etykiety cywilne, mały font
    dict(lines=["GUILDMAGES' FORUM"], x=4290, y=2690, color='rgb(43,43,43)',
         fs=32, rot=0, marker=None, ls=1, line=None),
    dict(lines=['GUILDPACT SQUARE'], x=3320, y=3370, color='rgb(43,43,43)',
         fs=30, rot=0, marker=None, ls=1, line=None),
    dict(lines=['PILLAR OF THE PARUNS'], x=4360, y=3680, color='rgb(43,43,43)',
         fs=27, rot=0, marker=None, ls=1, line=None),
]


def marker_cel(x, y, col):
    """Mały celownik w stylu v3: halo 12% + pierścień + rdzeń."""
    return (f'<circle cx="{x}" cy="{y}" r="36.5" fill="{col}" opacity="0.12"/>'
            f'<circle cx="{x}" cy="{y}" r="26.3" fill="none" stroke="{col}" '
            f'stroke-width="9.5"/>'
            f'<circle cx="{x}" cy="{y}" r="11" fill="{col}"/>')


def main():
    svg = SVG.read_text(encoding='utf-8')
    svg = svg.split(f'<g id="{GRUPA}">')[0].strip()
    if svg.endswith('</svg>'):
        svg = svg[:-len('</svg>')].rstrip()
    # herby też są doszyte na końcu — odtwarzamy je po warstwie lokacji,
    # więc musimy zostawić po niej </svg>; herby uruchamiane są osobno
    # (nad </svg>). Lokacje wstawiamy PRZED ewentualną warstwą herbów —
    # ale skoro uruchamiamy ten skrypt na czystym v3, herby doda się potem.
    czesci = [f'<g id="{GRUPA}">']
    for loc in LOKACJE:
        x, y = loc['x'], loc['y']
        fs = loc['fs']
        if loc.get('line'):
            pts = ' '.join(f'{px},{py}' for px, py in loc['line'])
            czesci.append(
                f'<polyline points="{pts}" fill="none" stroke="#3a3a3a" '
                f'stroke-width="6" stroke-linecap="round" '
                f'stroke-dasharray="2 18" opacity="0.55"/>')
        if loc['marker']:
            mx, my, mcol = loc['marker']
            czesci.append(marker_cel(mx, my, mcol))
        tr = f' transform="rotate({loc["rot"]} {x} {y})"' if loc['rot'] else ''
        for i, line in enumerate(loc['lines']):
            ly = y + i * (fs + 8)
            czesci.append(
                f'<text x="{x}" y="{ly}" font-size="{fs}" '
                f'text-anchor="middle" fill="{loc["color"]}" '
                f'letter-spacing="{loc["ls"]}"{tr}>{line}</text>')
    czesci.append('</g>')

    SVG.write_text(svg + '\n' + '\n'.join(czesci) + '\n</svg>\n',
                   encoding='utf-8')
    print(f'OK — {len(LOKACJE)} lokacji wstrzykniętych do {SVG.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
