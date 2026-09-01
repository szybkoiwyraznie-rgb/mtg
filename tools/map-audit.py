#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Weryfikator map wektorowych (Pętla Jakości krok 4, ADR 0015; warsztat T4).

Sprawdza podsłuchem geometrii (bez oglądania obrazu):
  1. poprawność XML podkładu,
  2. etykiety <text> poza lądem (poza whitelistą obiektów wodnych),
  3. kolizje par etykiet (bbox ~ 0.62·font-size·znaki),
  4. markery <use> (góra/wulkan/drzewo/bagno/miasto/ruina) poza lądem
     (pomija hedrony dryfujące — opacity; pomija grupy z transformem,
     np. legendę i kompas),
  5. pinezki kart z maps/<plan>/map.json na lądzie,
  6. kotwice map.json w wodzie (raport informacyjny).

Ląd = <path> z fill lądu (#e8dbb8, #eef0e6) o ≥16 punktach + wysepki
z <circle>/<path> w <g fill="#e8dbb8">. Krzywe Beziera są spłaszczane
(8 podziałów na segment) — point-in-polygon na punktach kontrolnych daje
fałszywe wyniki. Mapy liniowe bez poligonów lądu (np. adoptowany podkład
T2 Śródziemia) → testy na-lądzie są pomijane z adnotacją.

Użycie:
  tools/map-audit.py                      # wszystkie maps/*/podklad.svg
  tools/map-audit.py zendikar             # jeden plan
  tools/map-audit.py zendikar --woda "Halimar,Bojuka Bay"
Kod wyjścia: 0 = bez problemów, 1 = są problemy (do CI).
"""
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NS = '{http://www.w3.org/2000/svg}'
FILLE_LADU = {'#e8dbb8', '#eef0e6'}          # ląd / lodowiec (Sejiri)
MARKERY = {'gora', 'wulkan', 'drzewo', 'bagno', 'miasto', 'ruina'}
SPODZEANE_WODY = {                           # konwencja projektu
    'Bojuka Bay', 'Sunder Bay', 'Chill Depths', 'Makindi Trenches',
    'Halimar', 'Beyeen', 'Agadeem', 'Wyspy Jwar', 'Emeria', 'Zulaport',
}


def sciezka(d):
    """Spłaszcza 'd' (M/L/C/Z, też małe litery) do polilinii."""
    pts, cur = [], None
    for c, args in re.findall(r'([MLCZmlcz])\s*((?:-?[\d.]+[,\s]*)+)', d):
        v = [float(x) for x in re.findall(r'-?[\d.]+', args)]
        if c in 'MLml':
            cur = (v[0], v[1]); pts.append(cur)
        elif c in 'Ccz':
            for i in range(0, len(v) - 5, 6):
                x0, y0 = cur
                x1, y1, x2, y2, x3, y3 = v[i:i + 6]
                for s in range(1, 9):
                    u = s / 8
                    pts.append((
                        (1 - u) ** 3 * x0 + 3 * (1 - u) ** 2 * u * x1
                        + 3 * (1 - u) * u ** 2 * x2 + u ** 3 * x3,
                        (1 - u) ** 3 * y0 + 3 * (1 - u) ** 2 * u * y1
                        + 3 * (1 - u) * u ** 2 * y2 + u ** 3 * y3))
                cur = (x3, y3)
    return pts


def pit(pt, pg):
    """Point-in-polygon (ray casting)."""
    x, y = pt
    w = False
    for i in range(len(pg)):
        x1, y1 = pg[i]
        x2, y2 = pg[(i + 1) % len(pg)]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            w = not w
    return w


class Mapa:
    def __init__(self, svg_path):
        self.root = ET.parse(svg_path).getroot()
        vb = self.root.get('viewBox', '0 0 2000 1400').split()
        self.w, self.h = float(vb[2]), float(vb[3])
        self.lady, self.okregi = [], []
        for el in self.root.iter(NS + 'path'):
            if el.get('fill') in FILLE_LADU:
                pg = sciezka(el.get('d'))
                if len(pg) > 16:
                    self.lady.append(pg)
        for g in self.root.iter(NS + 'g'):        # wysepki z fill w grupie
            if g.get('fill') in FILLE_LADU:
                for el in g:
                    if el.tag == NS + 'path':
                        pg = sciezka(el.get('d'))
                        if len(pg) > 6:
                            self.lady.append(pg)
                    elif el.tag == NS + 'circle':
                        self.okregi.append((float(el.get('cx')),
                                            float(el.get('cy')),
                                            float(el.get('r'))))
        self.transformowane = set()
        for g in self.root.iter(NS + 'g'):
            if g.get('transform'):
                self.transformowane.update(id(e) for e in g.iter())
        self.ma_lad = bool(self.lady or self.okregi)

    def na_ladzie(self, x, y, tolerancja=6):
        if any(pit((x, y), pg) for pg in self.lady):
            return True
        return any((x - a) ** 2 + (y - b) ** 2 <= (r + tolerancja) ** 2
                   for a, b, r in self.okregi)

    def etykiety(self):
        out = []
        for el in self.root.iter(NS + 'text'):
            if id(el) in self.transformowane:
                continue
            if el.get('x') is None:                   # etykieta po łuku (textPath)
                continue
            txt = ''.join(el.itertext()).strip()
            if txt:
                out.append((txt, float(el.get('x')), float(el.get('y')),
                            float(el.get('font-size') or 15)))
        return out

    def markery(self):
        out = []
        for el in self.root.iter(NS + 'use'):
            if id(el) in self.transformowane or el.get('opacity'):
                continue
            m = re.match(r'translate\(([\d.]+),([\d.]+)\)',
                         el.get('transform', ''))
            href = (el.get('href') or '').lstrip('#')
            if m and href in MARKERY:
                out.append((href, float(m.group(1)), float(m.group(2))))
        return out


def audytuj(plan, woda_dozwolona):
    problemy, info = [], []
    svg = ROOT / 'maps' / plan / 'podklad.svg'
    mjson = ROOT / 'maps' / plan / 'map.json'
    try:
        mapa = Mapa(svg)
    except ET.ParseError as e:
        return [f'XML niepoprawny: {e}'], []
    if not mapa.ma_lad:
        info.append('podkład bez poligonów lądu (mapa liniowa/T2) — '
                    'testy na-lądzie pominięte')
        return problemy, info

    woda = SPODZEANE_WODY | woda_dozwolona
    ety = mapa.etykiety()
    for txt, x, y, fs in ety:
        if len(txt) < 2:                      # igła kompasu (N, S…)
            continue
        if txt in woda or txt.startswith('(') or txt == 'ruiny w niebie':
            continue
        if not mapa.na_ladzie(x, y):
            problemy.append(f'ETYKIETA W WODZIE: {txt!r} @({x:.0f},{y:.0f})')
    boxy = [(t, x, y, fs,
             x - len(t) * fs * 0.31, y - fs * 0.82,
             x + len(t) * fs * 0.31, y + fs * 0.24) for t, x, y, fs in ety]
    for i in range(len(boxy)):
        for j in range(i + 1, len(boxy)):
            a, b = boxy[i], boxy[j]
            if a[4] < b[6] and b[4] < a[6] and a[5] < b[7] and b[5] < a[7]:
                problemy.append(f'KOLIZJA ETYKIET: {a[0]!r} @({a[1]:.0f},'
                                f'{a[2]:.0f}) × {b[0]!r} @({b[1]:.0f},{b[2]:.0f})')
    for href, x, y in mapa.markery():
        if not mapa.na_ladzie(x, y):
            problemy.append(f'MARKER W WODZIE: {href} @({x:.0f},{y:.0f})')
    if mjson.exists():
        d = json.loads(mjson.read_text(encoding='utf-8'))
        for pn in d.get('pinezki', []):
            x, y = pn['x'] * mapa.w, pn['y'] * mapa.h
            if not mapa.na_ladzie(x, y, tolerancja=10):
                problemy.append(f"PINEZKA W WODZIE: {pn['karta']} ({x:.0f},{y:.0f})")
        for c in d.get('kotwice', []):
            x, y = c['x'] * mapa.w, c['y'] * mapa.h
            if not mapa.na_ladzie(x, y):
                info.append(f"kotwica w wodzie (OK dla obiektów wodnych): "
                            f"{c['nazwa']} ({x:.0f},{y:.0f})")
    return problemy, info


def main(argv):
    args = [a for a in argv if not a.startswith('--')]
    woda = set()
    for a in argv:
        if a.startswith('--woda='):
            woda = {s.strip() for s in a.split('=', 1)[1].split(',') if s.strip()}
    plany = args or sorted(p.parent.name for p in
                           (ROOT / 'maps').glob('*/podklad.svg'))
    problemy_calka = 0
    for plan in plany:
        print(f'=== {plan} ===')
        problemy, info = audytuj(plan, woda)
        for i in info:
            print(f'  [info] {i}')
        if problemy:
            for pr in problemy:
                print(f'  !! {pr}')
            problemy_calka += len(problemy)
        else:
            print('  OK — bez problemów')
    print(f'\nRAZEM PROBLEMÓW: {problemy_calka}')
    return 1 if problemy_calka else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
