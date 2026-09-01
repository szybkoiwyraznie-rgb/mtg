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
FILLE_LADU = {'#e8dbb8', '#eef0e6',         # pergamin: ląd / lodowiec (Sejiri)
               '#f7f7f7'}                    # atlas (mapforge): ląd = jasny szary papier
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
        self._rodzice = {}
        for g in self.root.iter():
            for dziecko in g:
                self._rodzice[id(dziecko)] = g
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

    def forge_w_wodzie(self):
        """Treść mapforge (klasy mf-*) poza lądem — drzewa/szczyty/kępki/POI.
        Zwraca {klasa: [pozycje]} (agregacja: bywa tysiące obiektów)."""
        out = {}
        for el in self.root.iter():
            kl = el.get('class') or ''
            if not kl.startswith('mf-') or id(el) in self.transformowane:
                continue
            if el.get('opacity'):
                continue                      # celowy „dryf" (hedrony Emerii)
            # kotwica zadeklarowana przez silnik (data-x/y) > heurystyki
            if el.get('data-x') and el.get('data-y'):
                pos = (float(el.get('data-x')), float(el.get('data-y')))
                if not self.na_ladzie(pos[0], pos[1], tolerancja=10):
                    out.setdefault(kl, []).append(pos)
                continue
            pos = None
            if el.tag == NS + 'circle':
                pos = (float(el.get('cx')), float(el.get('cy')))
            elif el.tag == NS + 'path':
                pos = self._pozycja_z_path(el.get('d') or '')
            elif el.tag == NS + 'g':
                for d in el.iter(NS + 'path'):
                    pos = self._pozycja_z_path(d.get('d') or '')
                    break
            if pos and not self.na_ladzie(pos[0], pos[1], tolerancja=12):
                out.setdefault(kl, []).append(pos)
        return out

    @classmethod
    def _punkty_d(cls, d):
        """Punkty NA ścieżce (pełny interpreter) — próbki do kontroli
        rzek/linii; patrz _pozycja_z_path."""
        pts, cur, start = [], [0.0, 0.0], [0.0, 0.0]
        for c, args_s in re.findall(r'([MLCQASTHVmlcqasthvZz])([^MLCQASTHVmlcqasthvZz]*)', d):
            args = [float(v) for v in re.findall(r'-?[\d.]+', args_s)]
            if c in 'Mm':
                for j in range(0, len(args) - 1, 2):
                    cur = ([cur[0] + args[j], cur[1] + args[j + 1]] if (c == 'm' and pts)
                           else [args[j], args[j + 1]])
                    if j == 0:
                        start = cur[:]
                    pts.append(tuple(cur))
            elif c in 'LlTt':
                for j in range(0, len(args) - 1, 2):
                    cur = ([cur[0] + args[j], cur[1] + args[j + 1]] if c in 'lt'
                           else [args[j], args[j + 1]])
                    pts.append(tuple(cur))
            elif c in 'Hh':
                for v in args:
                    cur = [cur[0] + v, cur[1]] if c == 'h' else [v, cur[1]]
                    pts.append(tuple(cur))
            elif c in 'Vv':
                for v in args:
                    cur = [cur[0], cur[1] + v] if c == 'v' else [cur[0], v]
                    pts.append(tuple(cur))
            elif c in 'Cc':
                for j in range(0, len(args) - 5, 6):
                    cur = ([cur[0] + args[j + 4], cur[1] + args[j + 5]] if c == 'c'
                           else [args[j + 4], args[j + 5]])
                    pts.append(tuple(cur))
            elif c in 'QqSs':
                for j in range(0, len(args) - 3, 4):
                    cur = ([cur[0] + args[j + 2], cur[1] + args[j + 3]] if c in 'qs'
                           else [args[j + 2], args[j + 3]])
                    pts.append(tuple(cur))
            elif c in 'Aa':
                for j in range(0, len(args) - 6, 7):
                    cur = ([cur[0] + args[j + 5], cur[1] + args[j + 6]] if c == 'a'
                           else [args[j + 5], args[j + 6]])
                    pts.append(tuple(cur))
            elif c in 'Zz':
                cur = start[:]
                pts.append(tuple(cur))
        return pts

    @classmethod
    def _pozycja_z_path(cls, d):
        """Centroid punktów NA ścieżce (interpreter komend: M/L/C/Q/S/A/H/V/Z,
        wersje małe = względne). Zbiera wyłącznie punkty leżące na krzywej —
        parametry łuków (promienie/flagi) i punkty kontrolne NIE są
        współrzędnymi (wcześniejsza heurystyka liczba-par dawała absurdy)."""
        pts = []
        cur = [0.0, 0.0]
        start = [0.0, 0.0]
        for c, args_s in re.findall(r'([MLCQASTHVmlcqasthvZz])([^MLCQASTHVmlcqasthvZz]*)', d):
            args = [float(v) for v in re.findall(r'-?[\d.]+', args_s)]
            if c in 'Mm':
                for j in range(0, len(args) - 1, 2):
                    if c == 'm' and pts:
                        cur = [cur[0] + args[j], cur[1] + args[j + 1]]
                    else:
                        cur = [args[j], args[j + 1]]
                    if j == 0:
                        start = cur[:]
                    pts.append(tuple(cur))
            elif c in 'LlTt':
                for j in range(0, len(args) - 1, 2):
                    cur = [cur[0] + args[j], cur[1] + args[j + 1]] if c in 'lt' else [args[j], args[j + 1]]
                    pts.append(tuple(cur))
            elif c in 'Hh':
                for v in args:
                    cur = [cur[0] + v, cur[1]] if c == 'h' else [v, cur[1]]
                    pts.append(tuple(cur))
            elif c in 'Vv':
                for v in args:
                    cur = [cur[0], cur[1] + v] if c == 'v' else [cur[0], v]
                    pts.append(tuple(cur))
            elif c in 'Cc':
                for j in range(0, len(args) - 5, 6):
                    cur = [cur[0] + args[j + 4], cur[1] + args[j + 5]] if c == 'c' else [args[j + 4], args[j + 5]]
                    pts.append(tuple(cur))
            elif c in 'QqSs':
                for j in range(0, len(args) - 3, 4):
                    cur = [cur[0] + args[j + 2], cur[1] + args[j + 3]] if c in 'qs' else [args[j + 2], args[j + 3]]
                    pts.append(tuple(cur))
            elif c in 'Aa':
                for j in range(0, len(args) - 6, 7):
                    cur = [cur[0] + args[j + 5], cur[1] + args[j + 6]] if c == 'a' else [args[j + 5], args[j + 6]]
                    pts.append(tuple(cur))
            elif c in 'Zz':
                cur = start[:]
                pts.append(tuple(cur))
        if len(pts) < 2:
            return None
        return (sum(a for a, _ in pts) / len(pts), sum(b for _, b in pts) / len(pts))

    def linie_w_wodzie(self):
        """Rzeki (wstęgi) i linie bez klasy (grzbiety, spękania) — próbki
        wzdłuż ścieżki muszą leżeć na lądzie (≥75%); poświata wybrzeża
        (ta sama `d` co ląd) i drogi (kreskowane — mogą prowadzić promem)
        są wyłączone. Elementy przycięte do maski lądu (`clip-path` odwołujące
        się do #lady-klip) są z definicji na lądzie — pomijane."""
        d_ladow = {el.get('d') for el in self.root.iter(NS + 'path')
                   if el.get('fill') in FILLE_LADU}
        RZEKI = {'#5b8ba6', '#6f9cc6', '#5a5a5a', '#1f1f1f'}   # pergamin + atlas (mapforge)
        out = []

        for el in self.root.iter(NS + 'path'):
            if id(el) in self.transformowane or el.get('d') in d_ladow:
                continue
            fill = el.get('fill')
            stroke = el.get('stroke')
            dash = el.get('stroke-dasharray')
            rzeka = fill in RZEKI and not stroke
            linia = (stroke and not fill and not dash) or (stroke and fill == 'none' and not dash)
            if not (rzeka or linia):
                continue
            if self._w_klasie(el):
                continue
            if self._przycie_do_ladu(el):
                continue
            pts = self._punkty_d(el.get('d') or '')
            if len(pts) < 8:
                continue
            probki = pts[::max(1, len(pts) // 12)]
            na_ladzie = sum(1 for q in probki if self.na_ladzie(q[0], q[1], tolerancja=6))
            if na_ladzie / len(probki) < 0.75:
                out.append(('rzeka' if rzeka else 'linia',
                            round(sum(q[0] for q in probki) / len(probki)),
                            round(sum(q[1] for q in probki) / len(probki)),
                            f"{na_ladzie}/{len(probki)}"))
        return out

    def _w_klasie(self, el):
        e = self._rodzice.get(id(el))
        while e is not None:
            if e.get('class'):
                return True
            e = self._rodzice.get(id(e))
        return False

    def _przycie_do_ladu(self, el):
        """Czy element (lub jego przodek `<g>`) jest przycięty do maski lądu
        (#lady-klip) — gwarancja silnika, że rzeka/droga nie wyjdzie na morze."""
        e = el
        while e is not None:
            clip = e.get('clip-path') or ''
            if '#lady-klip' in clip:
                return True
            e = self._rodzice.get(id(e))
        return False

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
    """Audytuje wszystkie podkłady planu (podklad*.svg)."""
    problemy, info = [], []
    kat = ROOT / 'maps' / plan
    svgi = sorted(kat.glob('podklad*.svg'))
    if not svgi:
        return [f'brak maps/{plan}/podklad*.svg'], []
    for svg in svgi:
        try:
            mapa = Mapa(svg)
        except ET.ParseError as e:
            problemy.append(f'XML niepoprawny ({svg.name}): {e}')
            continue
        if not mapa.ma_lad:
            info.append(f'{svg.name}: mapa liniowa/T2 (bez poligonów lądu) '
                        '— testy na-lądzie pominięte')
            continue
        p2, i2 = audytuj_podklad(mapa, svg.name, kat / 'map.json',
                                 SPODZEANE_WODY | woda_dozwolona)
        problemy.extend(p2)
        info.extend(i2)
    return problemy, info


def audytuj_podklad(mapa, nazwa, mjson, woda):
    problemy, info = [], []
    ety = mapa.etykiety()
    for txt, x, y, fs in ety:
        if len(txt) < 2:                      # igła kompasu (N, S…)
            continue
        if txt in woda or txt.startswith('(') or txt == 'ruiny w niebie':
            continue
        if not mapa.na_ladzie(x, y):
            problemy.append(f'{nazwa}: ETYKIETA W WODZIE: {txt!r} @({x:.0f},{y:.0f})')
    boxy = [(t, x, y, fs,
             x - len(t) * fs * 0.31, y - fs * 0.82,
             x + len(t) * fs * 0.31, y + fs * 0.24) for t, x, y, fs in ety]
    for i in range(len(boxy)):
        for j in range(i + 1, len(boxy)):
            a, b = boxy[i], boxy[j]
            if a[4] < b[6] and b[4] < a[6] and a[5] < b[7] and b[5] < a[7]:
                problemy.append(f'{nazwa}: KOLIZJA ETYKIET: {a[0]!r} @({a[1]:.0f},'
                                f'{a[2]:.0f}) × {b[0]!r} @({b[1]:.0f},{b[2]:.0f})')
    for href, x, y in mapa.markery():
        if not mapa.na_ladzie(x, y):
            problemy.append(f'{nazwa}: MARKER W WODZIE: {href} @({x:.0f},{y:.0f})')
    for rodzaj, x, y, stat in mapa.linie_w_wodzie():
        problemy.append(f'{nazwa}: {rodzaj.upper()} W WODZIE: środek @({x},{y}), na lądzie {stat}')
    for kl, pozycje in sorted(mapa.forge_w_wodzie().items()):
        przykl = ', '.join(f'({x:.0f},{y:.0f})' for x, y in pozycje[:3])
        problemy.append(f'{nazwa}: FORGE W WODZIE: {kl} ×{len(pozycje)} (np. {przykl})')
    if mjson.exists():
        d = json.loads(mjson.read_text(encoding='utf-8'))
        for pn in d.get('pinezki', []):
            x, y = pn['x'] * mapa.w, pn['y'] * mapa.h
            if not mapa.na_ladzie(x, y, tolerancja=10):
                problemy.append(f"{nazwa}: PINEZKA W WODZIE: {pn['karta']} ({x:.0f},{y:.0f})")
        for c in d.get('kotwice', []):
            x, y = c['x'] * mapa.w, c['y'] * mapa.h
            if not mapa.na_ladzie(x, y):
                info.append(f"{nazwa}: kotwica w wodzie (OK dla obiektów wodnych): "
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
