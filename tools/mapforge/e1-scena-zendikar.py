#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
E1 (plan adopcji ADR 0018): buduje maps/zendikar/scena.json z istniejącego,
ręcznego podkładu maps/zendikar/podklad.svg.

Ekstrakcja:
- lądy: <path> z fill lądu (#e8dbb8/#eef0e6) + wysepki <circle> (własny
  fill lub dziedziczony z <g fill>) → jako `d` (koło → dwa łuki),
- rzeki: <path stroke="#5b8ba6"> → spłaszczona i przerzedzona łamana,
- jeziora: <ellipse> o rx ≥ 10,
- POI: <use> #miasto/#ruina/#wulkan/#hedron (hedrony z opacity → dryf),
- pasma: klastry #gora (siatka 380 px, ≥4) → linia grzbietu z PCA,
- biomy: klastry #drzewo/#bagno (≥3) → otoczka wypukła; Sejiri → lod,
- etykiety: <text x/y> (≥2 znaki) z dziedziczeniem text-anchor.

Scena jest DANYMI (nie stylem) — render: cli.mjs scena.json --styl=atlas.
Pozycje i proweniencja pozostają własnością map.json/podkładu (ADR 0012).
"""
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path

NS = '{http://www.w3.org/2000/svg}'
ROOT = Path(__file__).resolve().parents[2]
SVG = ROOT / 'maps' / 'zendikar' / 'podklad.svg'
SCENA = ROOT / 'maps' / 'zendikar' / 'scena.json'
W, H = 2000.0, 1400.0
FILL_LADU = {'#e8dbb8', '#eef0e6'}


def sciezka(d):
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
                    pts.append(((1-u)**3*x0 + 3*(1-u)**2*u*x1 + 3*(1-u)*u**2*x2 + u**3*x3,
                                (1-u)**3*y0 + 3*(1-u)**2*u*y1 + 3*(1-u)*u**2*y2 + u**3*y3))
                cur = (v[i + 4], v[i + 5])
    return pts


def otoczka(pts):
    pts = sorted(set((round(x, 1), round(y, 1)) for x, y in pts))
    if len(pts) < 3:
        return [list(p) for p in pts]

    def iloczyn(o, a, b):
        return (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0])
    dol = []
    for p in pts:
        while len(dol) >= 2 and iloczyn(dol[-2], dol[-1], p) <= 0:
            dol.pop()
        dol.append(p)
    gora = []
    for p in reversed(pts):
        while len(gora) >= 2 and iloczyn(gora[-2], gora[-1], p) <= 0:
            gora.pop()
        gora.append(p)
    return [list(p) for p in dol[:-1] + gora[:-1]]


def grzbiet_z_klastra(pts, n=5):
    n = min(n, len(pts))
    if n < 2:
        return [list(pts[0])]
    """Linia grzbietu: rzutuje punkty na główną oś (PCA 2×2) i bierze n kwantyli."""
    mx = sum(p[0] for p in pts) / len(pts)
    my = sum(p[1] for p in pts) / len(pts)
    sxx = sum((p[0]-mx)**2 for p in pts) / len(pts)
    syy = sum((p[1]-my)**2 for p in pts) / len(pts)
    sxy = sum((p[0]-mx)*(p[1]-my) for p in pts) / len(pts)
    theta = 0.5 * np_atan2(2*sxy, sxx - syy)
    dx, dy = __import__('math').cos(theta), __import__('math').sin(theta)
    rzuty = sorted((((p[0]-mx)*dx + (p[1]-my)*dy), p) for p in pts)
    return [[round(rzuty[int(i*(len(rzuty)-1)/(n-1))][1][0], 1),
             round(rzuty[int(i*(len(rzuty)-1)/(n-1))][1][1], 1)] for i in range(n)]


def np_atan2(y, x):
    return __import__('math').atan2(y, x)


def przerzedz(pts, n=10):
    if len(pts) <= n:
        return [[round(x, 1), round(y, 1)] for x, y in pts]
    return [[round(pts[int(i*(len(pts)-1)/(n-1))][0], 1),
             round(pts[int(i*(len(pts)-1)/(n-1))][1], 1)] for i in range(n)]


def grupa_fill(el, rodzice):
    if el.get('fill'):
        return el.get('fill')
    for g in reversed(rodzice):
        if g.get('fill'):
            return g.get('fill')
    return None


def main():
    svg = ET.parse(SVG).getroot()

    # rodzice dla dziedziczenia fill/transform
    rodzice = {}
    transformowane = set()

    def spacer(el, stos):
        rodzice[id(el)] = stos
        # transform wyklucza POTOMKÓW (np. teksty legendy w <g transform>),
        # ale nie element sam w sobie — <use transform="translate(...)"> to
        # pozycja markera, nie przeniesienie.
        if el.get('transform'):
            transformowane.update(id(e) for e in el.iter() if e is not el)
        for d in el:
            spacer(d, stos + [el])

    spacer(svg, [])

    lady, rzeki, jeziora, poi, gory, drzewa, bagna, etykiety = [], [], [], [], [], [], [], []

    for el in svg.iter(NS + 'path'):
        if id(el) in transformowane:
            continue
        fill = grupa_fill(el, rodzice[id(el)])
        stroke = el.get('stroke', '')
        if fill in FILL_LADU and len(sciezka(el.get('d'))) > 16:
            lady.append({'id': f'lad-{len(lady)+1}', 'd': re.sub(r'\s+', ' ', el.get('d')).strip()})
        elif stroke == '#5b8ba6' and fill in (None, 'none'):
            pts = sciezka(el.get('d'))
            if len(pts) > 12:
                rzeki.append({'id': f'rzeka-{len(rzeki)+1}', 'punkty': przerzedz(pts, 10),
                              'opcje': {'s0': 3, 's1': 8}})

    for el in svg.iter(NS + 'ellipse'):
        if id(el) in transformowane:
            continue
        if (grupa_fill(el, rodzice[id(el)]) or '') in ('#b9cdd8',) and float(el.get('rx', 0)) >= 10:
            jeziora.append({'cx': float(el.get('cx')), 'cy': float(el.get('cy')),
                            'rx': float(el.get('rx')), 'ry': float(el.get('ry'))})

    for el in svg.iter(NS + 'circle'):
        if id(el) in transformowane:
            continue
        if (grupa_fill(el, rodzice[id(el)]) or '') in FILL_LADU:
            cx, cy, r = (float(el.get(k)) for k in ('cx', 'cy', 'r'))
            # okrąg na 4 krzywych Beziera (k = 4/3·(√2−1)) — łuki 'a' są
            # pojedynczymi punktami dla parserów bez parametryzacji łuku
            k = 0.5523 * r
            d = (f'M {cx-r:.1f},{cy:.1f} '
                 f'C {cx-r:.1f},{cy-k:.1f} {cx-k:.1f},{cy-r:.1f} {cx:.1f},{cy-r:.1f} '
                 f'C {cx+k:.1f},{cy-r:.1f} {cx+r:.1f},{cy-k:.1f} {cx+r:.1f},{cy:.1f} '
                 f'C {cx+r:.1f},{cy+k:.1f} {cx+k:.1f},{cy+r:.1f} {cx:.1f},{cy+r:.1f} '
                 f'C {cx-k:.1f},{cy+r:.1f} {cx-r:.1f},{cy+k:.1f} {cx-r:.1f},{cy:.1f} Z')
            lady.append({'id': f'wyspa-{len(lady)+1}', 'd': d})

    for el in svg.iter(NS + 'use'):
        if id(el) in transformowane:
            continue
        m = re.match(r'translate\(([\d.]+),([\d.]+)\)(?:\s+scale\(([\d.]+)\))?', el.get('transform', ''))
        if not m:
            continue
        href = (el.get('href') or '').lstrip('#')
        x, y = float(m.group(1)), float(m.group(2))
        skala = float(m.group(3)) if m.group(3) else None
        op = el.get('opacity')
        if href in ('miasto', 'ruina', 'wulkan'):
            poi.append({'typ': href, 'x': x, 'y': y, **({'opcje': {'skala': skala}} if skala else {})})
        elif href == 'hedron':
            opcje = {}
            if skala:
                opcje['skala'] = skala
            if op:
                opcje['opacity'] = float(op)
            poi.append({'typ': 'hedron', 'x': x, 'y': y, **({'opcje': opcje} if opcje else {})})
        elif href == 'gora':
            gory.append((x, y))
        elif href == 'drzewo':
            drzewa.append((x, y))
        elif href == 'bagno':
            bagna.append((x, y))

    # etykiety: dziedziczenie text-anchor jak w render-map.js
    stos_kotwic = ['start']
    for zdarzenie, el_kotw in _texty(svg):
        if zdarzenie == 'g':
            stos_kotwic.append(el_kotw)
        elif zdarzenie == '/g':
            if len(stos_kotwic) > 1:
                stos_kotwic.pop()
        else:
            el, atryb = el_kotw
            if id(el) in transformowane or el.get('x') is None or el.get('transform'):
                continue
            txt = ''.join(el.itertext()).strip()
            if len(txt) < 2:
                continue
            kotwica = (re.search(r'text-anchor="(start|middle|end)"', atryb) or [None, None])[1] \
                or ('middle' if 'tytul-kontynentu' in atryb else stos_kotwic[-1])
            kontynent = 'tytul-kontynentu' in atryb
            opcje = {'fs': float(el.get('font-size') or 15), 'kotwica': kotwica}
            if 'italic' in atryb:
                opcje['ital'] = True
            if kontynent:
                opcje['duze'] = True
            etykiety.append({'tekst': txt, 'x': float(el.get('x')), 'y': float(el.get('y')), 'opcje': opcje})

    def klastry(pkt, bok=200, minimum=3):
        siatka = {}
        for x, y in pkt:
            siatka.setdefault((int(x // bok), int(y // bok)), []).append((x, y))
        # scal sąsiednie komórki (flood fill 8-spójnych)
        widziane, out = set(), []
        for k in siatka:
            if k in widziane:
                continue
            stos, grupa = [k], []
            while stos:
                a = stos.pop()
                if a in widziane:
                    continue
                widziane.add(a)
                grupa += siatka.get(a, [])
                stos += [(a[0]+i, a[1]+j) for i in (-1, 0, 1) for j in (-1, 0, 1)
                         if (a[0]+i, a[1]+j) in siatka and (a[0]+i, a[1]+j) not in widziane]
            if len(grupa) >= minimum:
                out.append(grupa)
        return sorted(out, key=lambda g: (min(p[0] for p in g), min(p[1] for p in g)))

    biomy = []
    for i, kl in enumerate(klastry(drzewa, minimum=3), 1):
        biomy.append({'id': f'las-{i}', 'typ': 'las', 'punkty': otoczka(kl),
                      'opcje': {'gestosc': 0.8}})
    for i, kl in enumerate(klastry(bagna, minimum=2), 1):
        biomy.append({'id': f'bagno-{i}', 'typ': 'bagno', 'punkty': otoczka(kl)})
    # lod: Sejiri (fill #eef0e6)
    for el in svg.iter(NS + 'path'):
        if el.get('fill') == '#eef0e6' and not (id(el) in transformowane):
            poly = sciezka(el.get('d'))
            if len(poly) > 16:
                biomy.append({'id': 'lod-sejiri', 'typ': 'lod',
                              'punkty': przerzedz(poly, 24), 'opcje': {'pekniecia': 3}})

    pasma = []
    for i, kl in enumerate(klastry(gory, minimum=3), 1):
        pasma.append({'id': f'pasmo-{i}', 'punkty': grzbiet_z_klastra(kl, 5), 'opcje': {'szer': 40}})

    scena = {
        'nazwa': 'zendikar-e1', 'szerokosc': int(W), 'wysokosc': int(H), 'styl': 'atlas',
        'opis': 'Scena E1 wygenerowana z maps/zendikar/podklad.svg (ADR 0018); '
                'proweniencja pozycji: map.json + podkład ręczny.',
        'lądy': lady,
        'biomy': biomy,
        'pasma': pasma,
        'rzeki': rzeki,
        'jeziora': jeziora,
        'poi': poi,
        'etykiety': etykiety,
        'kompas': False,
        'skala': False,
        'ramka': True,
    }
    SCENA.write_text(json.dumps(scena, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f"scena: lądy={len(lady)} biomy={len(biomy)} pasma={len(pasma)} rzeki={len(rzeki)} "
          f"jeziora={len(jeziora)} poi={len(poi)} etykiety={len(etykiety)}")


def _texty(svg):
    """Przechodzi dokument w porządku dokumentu; dla grup zwraca ('g', kotwica|None)/('/g', None),
    dla <text> ('text', (el, atrybuty-string))."""
    out = []

    def spacer(el):
        for d in el:
            tag = d.tag.rsplit('}', 1)[-1]
            if tag == 'g':
                out.append(('g', d.get('text-anchor')))
                spacer(d)
                out.append(('/g', None))
            elif tag == 'text':
                atryb = ' '.join(f'{k}="{v}"' for k, v in d.attrib.items())
                out.append(('text', (d, atryb)))
            else:
                spacer(d)

    spacer(svg)
    return out


if __name__ == '__main__':
    main()
