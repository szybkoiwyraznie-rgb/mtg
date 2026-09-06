#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Budowniczy sceny mapy Mirrodinu (T4 — rekonstrukcja kanoniczna, atlas).

Mirrodin (Argentum) to sztuczna, pusta w środku METALOWA SFERA (obwód
~1400 km). Oficjalna mapa planu nigdy nie powstała (MTG Wiki); w sieci
brak wektora (T2) i rastra (T3) — mapa jest rekonstrukcją z kanonu
TEKSTOWEGO (research T2→T3→T4 z 2026-09-06, maps/mirrodin/zrodlo-research.md).

Konwencja rzutu: JEDNA TARCZA = widoczna półkula powierzchni (okrąg
o promieniu R wokół środka C). Poza tarczą jest „papier arkusza” (ocean
= kolor tła, jak atlas Ravniki) — Mirrodin nie ma oceanu; jedynym
akwenem jest Quicksilver Sea (jezioro rtęci wewnątrz tarczy).

Epoka: powierzchnia z ery MRD–SOM, PRZED kompleacją (ADR 0033 §2) —
po *New Phyrexia* plan ma dziewięć sfer, a powierzchnia staje się
Mirrexem (topologia nieprzedstawialna na tej mapie).

Topologia (kanon relacyjny — bez współrzędnych źródłowych):
  * Glimmervoid CENTRALNY (heksagonalne płyty; cztery Ur-Golem Towers);
    Razor Fields są jego częścią — północny wycinek aż po krawędź tarczy.
  * Pięć regionów = pięć równych wycinków po 72° w kolejności cyklu
    fastlandów SOM (sąsiedzi = pary sprzymierzonych kolorów):
      Razor Fields (W, N)  —Seachrome Coast—  Quicksilver Sea (U, ENE)
      —Darkslick Shores—  Mephidross (B, SSE)  —Blackcleave Cliffs—
      Oxidda Chain (R, SSW)  —Copperline Gorge—  Tangle (G, WSW)
      —Razorverge Thicket—  Razor Fields.
  * Tangle i Oxidda „blisko siebie, przez wąski pas Glimmervoid”
    (Copperline Gorge) → główny grzbiet Oxiddy leży przy tangle'owym
    skraju swojego wycinka, promieniście od krawędzi ku Glimmervoid.
  * Rey-Goor (Black Bayou) = pogranicze Mephidross–Tangle: las nasiąka
    olejem i przechodzi w bagno → pas bagien wzdłuż samej krawędzi tarczy
    „za” zewnętrznym końcem Oxiddy (kontakt Dross↔Tangle za horyzontem
    gór; na kuli regiony stykają się także poza widoczną półkulą).
  * Quicksilver Sea graniczy z Razor Fields (Seachrome), Glimmervoid
    i Mephidrossem (Darkslick). Uwaga: przewodnik fanowski podaje też
    „morze leży za górami od Tangle” — nierozstrzygalne z cyklem
    fastlandów na jednej półkuli; przyjęto cykl (karty-fastlandy = kanon
    drukowany), rozbieżność opisana w zrodlo-research.md.
  * Lacuny (zejścia do jądra, po jednej na region) = glif `hedron`
    (pierścień w płycie): Cave of Light (biała), Pool of Knowledge
    (niebieska), Black Lacuna, Red Lacuna (Womb of the Steel Mother),
    Radix (zielona).

Kąty w stopniach w układzie SVG (0° = wschód, 90° = południe/dół,
180° = zachód, 270° = północ/góra); punkt = C + r·(cos a, sin a).
Deterministyczny: pisze maps/mirrodin/scena.json. Renderować przez
    node tools/mapforge/cli.mjs maps/mirrodin/scena.json -o maps/mirrodin/podklad.svg
"""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'maps' / 'mirrodin' / 'scena.json'

CX, CY, R = 1000.0, 710.0, 590.0      # tarcza (półkula)

# Wycinki regionów (kąty SVG): pięć po 72°, Razor Fields wyśrodkowane na N.
RAZOR = (234, 306)        # centrum 270 (N)
SEA = (306, 378)          # centrum 342 = −18 (ENE)
DROSS = (18, 90)          # centrum 54 (SSE)
OXIDDA = (90, 162)        # centrum 126 (SSW)
TANGLE = (162, 234)       # centrum 198 (WSW)


def P(a, r, dx=0.0, dy=0.0):
    """Punkt biegunowy względem środka tarczy (kąt w stopniach SVG)."""
    t = math.radians(a)
    return [round(CX + r * math.cos(t) + dx, 1), round(CY + r * math.sin(t) + dy, 1)]


def szum(a, r, amp):
    """Deterministyczny „jitter” (bez random): funkcja kąta i promienia."""
    v = math.sin(a * 0.2249 + r * 0.0137) * 43758.5453
    return (v - math.floor(v) - 0.5) * 2 * amp


def sektor(a0, a1, r0, r1, krok=6.0, j0=6.0, j1=12.0):
    """Wielokąt wycinka pierścienia [a0,a1]×[r0,r1] z lekką nieregularnością
    brzegów (organiczne granice biomów zamiast cyrkla)."""
    pts = []
    n = max(2, int(round((a1 - a0) / krok)))
    for i in range(n + 1):
        a = a0 + (a1 - a0) * i / n
        pts.append(P(a, r1 + szum(a, r1, j1)))
    for i in range(n, -1, -1):
        a = a0 + (a1 - a0) * i / n
        pts.append(P(a, r0 + szum(a, r0, j0)))
    return pts


def okrag(r, n=96):
    return [P(360.0 * i / n, r) for i in range(n)]


def gladka_d(pts):
    """Zamknięta krzywa Catmull-Rom → cubic Bézier (ten sam wzór co
    geom.gladka w mapforge, t = 1) — ścieżka `d` jeziora rtęci."""
    n = len(pts)
    pk = lambda i: pts[(i + n) % n]
    f = lambda p: f'{p[0]:.1f},{p[1]:.1f}'
    d = f'M {f(pk(0))}'
    for i in range(n):
        p0, p1, p2, p3 = pk(i - 1), pk(i), pk(i + 1), pk(i + 2)
        c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
        c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
        d += f' C {f(c1)} {f(c2)} {f(p2)}'
    return d + ' Z'


# ---------------------------------------------------------------- akwen
# Quicksilver Sea: wycinek pierścienia w swoim wycinku (−50°…14°,
# r 272…548) — brzeg wewnętrzny styka się z Glimmervoid, zewnętrzny
# zostawia wąską listwę „horyzontu” przy krawędzi półkuli.
def jezioro_rteci():
    pts = [P(-50, 410)]
    for a in (-44, -36, -28, -20, -12, -4, 4, 10):
        pts.append(P(a, 546 + szum(a, 546, 8)))
    pts.append(P(14, 410))
    for a in (10, 2, -6, -14, -22, -30, -38, -46):
        pts.append(P(a, 272 + szum(a, 272, 7)))
    return pts


JEZIORO = jezioro_rteci()

# ---------------------------------------------------------------- POI
# (typ, punkt, id, opcje) — pozycje relacyjne wg kanonu (opisy w map.json).
POI = [
    # Glimmervoid — cztery wieże ur-golemów wokół środka tarczy
    ('iglica', [950, 665], 'ur-golem-1', {'skala': 0.9}),
    ('iglica', [1050, 665], 'ur-golem-2', {'skala': 0.9}),
    ('iglica', [950, 755], 'ur-golem-3', {'skala': 0.9}),
    ('iglica', [1050, 755], 'ur-golem-4', {'skala': 0.9}),
    # Razor Fields (N): Taj-Nar w środku Pól, Cave of Light obok (biała lacuna)
    ('fort', P(270, 330), 'taj-nar', {'skala': 1.1}),
    ('hedron', P(262, 300), 'cave-of-light', {}),
    ('miasto', P(250, 470), 'bladehold', {}),
    ('miasto', P(290, 470), 'ten-shields', {'skala': 0.8}),
    # Quicksilver Sea (ENE): Lumengrid przy brzegu, Medev na brzegu Darkslick
    ('miasto', P(-20, 250), 'lumengrid', {'skala': 1.2}),
    ('hedron', P(-36, 236), 'pool-of-knowledge', {}),
    ('miasto', P(18, 380), 'medev', {'skala': 0.8}),
    ('iglica', P(-30, 380), 'spire-1', {'skala': 0.9}),
    ('iglica', P(-12, 440), 'spire-2', {'skala': 0.9}),
    ('iglica', P(4, 480), 'spire-3', {'skala': 0.9}),
    ('fort', P(-40, 470), 'titan-forge', {'skala': 0.9}),
    # Mephidross (SSE): Ish Sah — wielki komin w sercu bagien
    ('iglica', P(54, 430), 'ish-sah', {'skala': 1.4}),
    ('hedron', P(58, 470), 'black-lacuna', {}),
    ('miasto', P(34, 390), 'moriok', {'skala': 0.7}),
    # Oxidda Chain (SSW): Kuldotha u zewnętrznego końca głównego grzbietu
    ('wulkan', P(140, 548), 'kuldotha', {'skala': 1.15}),
    ('hedron', P(131, 552), 'red-lacuna', {}),
    ('miasto', P(134, 400), 'oxidagg', {'skala': 0.75}),
    ('ruina', P(104, 470), 'wailing-cairns', {'skala': 0.9}),
    # Tangle (WSW): Radix w samym środku lasu, Tel-Jilad i Viridia obok
    ('hedron', P(198, 400), 'radix', {}),
    ('drzewo', P(211, 470), 'tel-jilad', {'skala': 2}),
    ('miasto', P(199, 486), 'viridia', {'skala': 0.9}),
    ('kolumny', P(224, 420), 'temple-might', {'skala': 0.9}),
    ('drzewo', P(182, 480), 'cambree-garden', {'skala': 1.4}),
    ('ognisko', P(172, 400), 'outer-altar', {'skala': 0.9}),
]

POZ = {p[2]: (p[1][0], p[1][1]) for p in POI}


def przy(id_, tekst, fs=15, ital=False):
    x, y = POZ[id_]
    op = {'fs': fs, 'kotwica': 'middle', 'przyDo': [x, y]}
    if ital:
        op['ital'] = True
    return {'tekst': tekst, 'x': x, 'y': y, 'opcje': op}


def obszar(tekst, pt, fs=16, kat=None, ital=True, duze=False, kolor=None):
    op = {'fs': fs, 'kotwica': 'middle'}
    if ital:
        op['ital'] = True
    if kat:
        op['kat'] = kat
    if duze:
        op['duze'] = True
    if kolor:
        op['kolor'] = kolor
    return {'tekst': tekst, 'x': pt[0], 'y': pt[1], 'opcje': op}


def nota(tekst, x, y, fs=14):
    """Adnotacja w nawiasie (dozwolona poza lądem — poza tarczą). Etykieta
    obiektowa bez kotwicy ląduje „pod” własnym punktem (+r.dol+0.9·fs) —
    kompensujemy, żeby wylądowała dokładnie w (x, y)."""
    return {'tekst': tekst, 'x': x, 'y': round(y - 4 - fs * 0.9, 1),
            'opcje': {'fs': fs, 'kotwica': 'middle', 'ital': True}}


def wzdluz(a):
    """Kąt tekstu czytanego wzdłuż promienia pod kątem `a` (SVG rotate,
    tekst zawsze „do góry nogami” niedopuszczony: wynik w (−90°, 90°])."""
    k = a % 360
    if 90 < k <= 270:
        k -= 180
    if k > 180:
        k -= 360
    return round(k, 1)


ETYKIETY = [
    # --- tytuły regionów (czerń, klasa tytul-kontynentu — ADR 0025)
    obszar('Glimmervoid', [1000, 598], fs=44, ital=False, duze=True),
    obszar('Razor Fields', P(270, 545), fs=40, ital=False, duze=True),
    obszar('Quicksilver Sea', P(-18, 430), fs=34, ital=False, duze=True, kolor='#1c3a5e'),
    obszar('Mephidross', P(72, 520), fs=40, ital=False, duze=True),
    obszar('Oxidda Chain', P(124, 280), fs=34, ital=False, duze=True),
    obszar('Tangle', P(212, 300), fs=44, ital=False, duze=True),
    # --- obiekty (kotwica = POI; wzór „pod, konflikt ⇒ nad” — ADR 0022)
    przy('ur-golem-4', 'Ur-Golem Towers', 14),
    przy('taj-nar', 'Taj-Nar', 16),
    przy('cave-of-light', 'Cave of Light', 14),
    przy('cave-of-light', '(White Lacuna)', 12, ital=True),
    przy('bladehold', 'Bladehold', 15),
    przy('ten-shields', 'Ten Shields', 13),
    przy('lumengrid', 'Lumengrid', 16),
    przy('pool-of-knowledge', 'Pool of Knowledge', 14),
    przy('pool-of-knowledge', '(Blue Lacuna)', 12, ital=True),
    przy('medev', 'Medev', 13),
    przy('spire-2', 'Quicksilver Spires', 14),
    przy('titan-forge', 'Titan Forge', 14),
    przy('ish-sah', 'Ish Sah', 16),
    przy('ish-sah', '(Vault of Whispers)', 12, ital=True),
    przy('black-lacuna', 'Black Lacuna', 14),
    przy('moriok', '(wioski Moriok)', 12, ital=True),
    przy('kuldotha', 'Kuldotha', 16),
    przy('kuldotha', '(Great Furnace)', 12, ital=True),
    przy('red-lacuna', 'Red Lacuna', 14),
    przy('oxidagg', 'Oxidagg', 13),
    przy('wailing-cairns', 'Wailing Cairns', 13),
    przy('radix', 'Radix', 14),
    przy('radix', '(Green Lacuna)', 12, ital=True),
    przy('tel-jilad', 'Tel-Jilad', 16),
    przy('tel-jilad', '(Tree of Tales)', 12, ital=True),
    przy('viridia', 'Viridia', 14),
    przy('temple-might', 'Temple Might', 14),
    przy('cambree-garden', 'Cambree Garden', 14),
    przy('outer-altar', 'Outer Altar', 13),
    # --- krainy i szlaki (typografia obszarowa: fs ≥ 16 lub kat)
    obszar('Liet Field', P(270, 440), fs=16),
    obszar('Manka Run', P(262, 500), fs=13, kat=-30),
    obszar('Glistening Dunes', P(40, 280), fs=16),
    obszar('Krark-Home', P(122, 420), fs=13, kat=wzdluz(122)),
    obszar('Rey-Goor', P(150, 562), fs=14, kat=wzdluz(150 + 90)),
    obszar('(Black Bayou)', P(150, 578), fs=11, kat=wzdluz(150 + 90)),
    # --- pogranicza (pięć fastlandów SOM) wzdłuż szwów wycinków
    obszar('Seachrome Coast', P(306, 490), fs=13, kat=wzdluz(306), kolor='#6b1f2e'),
    obszar('Darkslick Shores', P(18, 500), fs=13, kat=wzdluz(18), kolor='#6b1f2e'),
    obszar('Blackcleave Cliffs', P(90, 470), fs=13, kat=wzdluz(90), kolor='#6b1f2e'),
    obszar('Copperline Gorge', P(156, 430), fs=13, kat=wzdluz(156), kolor='#6b1f2e'),
    obszar('Razorverge Thicket', P(234, 500), fs=13, kat=wzdluz(234), kolor='#6b1f2e'),
    # --- adnotacje poza tarczą: pięć słońc nad swoimi regionami + rzut
    nota('(Bringer — białe słońce)', 1000, 82),
    nota('(Eye of Doom — niebieskie słońce)', 1745, 500),
    nota('(Ingle — czarne słońce)', 1420, 1252),
    nota('(Sky Tyrant — czerwone słońce)', 560, 1252),
    nota('(Lyese — zielone słońce)', 250, 500),
    nota('(rzut widocznej półkuli metalowej sfery Mirrodinu, obwód ≈ 1400 km — '
         'powierzchnia przed kompleacją)', 640, 1342, fs=13),
]

SCENA = {
    'nazwa': 'mirrodin-t4',
    'szerokosc': 2000,
    'wysokosc': 1400,
    'styl': 'atlas',
    'opis': (
        'Mirrodin T4 (rekonstrukcja kanoniczna, epoka MRD–SOM przed kompleacją, '
        'ADR 0033 §2): jedna tarcza = widoczna półkula metalowej sfery, poza nią '
        'papier arkusza (plan bez oceanu). Glimmervoid centralny; pięć regionów '
        'w pięciu wycinkach po 72° w kolejności cyklu fastlandów SOM: Razor Fields '
        '(N) → Quicksilver Sea (ENE, jedyny akwen — jezioro rtęci) → Mephidross '
        '(SSE) → Oxidda Chain (SSW) → Tangle (WSW). Copperline Gorge = wąski pas '
        'Glimmervoid między lasem a głównym grzbietem Oxiddy; Rey-Goor (Black '
        'Bayou) = pas bagien przy krawędzi tarczy łączący Dross z Tangle za '
        'zewnętrznym końcem gór. Lacuny = hedron. Kompas i skala wyłączone: sfera '
        'bez biegunów; skala w adnotacji (obwód 1400 km).'
    ),
    'ocean': {'kolor': '#e9e9e9'},
    'lądy': [{'id': 'tarcza-mirrodinu', 'punkty': okrag(R)}],
    'jeziora': [{'d': gladka_d(JEZIORO)}],
    'biomy': [
        # Tangle — miedziany las (G)
        {'id': 'tangle', 'typ': 'las', 'punkty': sektor(TANGLE[0] + 3, TANGLE[1] - 4, 245, 578),
         'opcje': {'gestosc': 0.5}},
        # Mephidross — bagno nekrogenowe (B); wkracza na Oxiddę (Blackcleave)
        {'id': 'mephidross', 'typ': 'bagno', 'punkty': sektor(DROSS[0] + 4, DROSS[1] + 6, 330, 578),
         'opcje': {'gestosc': 0.6}},
        # Rey-Goor (Black Bayou) — pas bagien przy krawędzi za końcem Oxiddy → Tangle
        {'id': 'rey-goor', 'typ': 'bagno', 'punkty': sektor(96, 176, 556, 586, krok=4, j0=3, j1=2),
         'opcje': {'gestosc': 0.9}},
        # Razor Fields — pola razorgrass (W), północny wycinek Glimmervoid
        {'id': 'razor-fields', 'typ': 'step', 'punkty': sektor(RAZOR[0] + 3, RAZOR[1] - 3, 250, 576),
         'opcje': {'gestosc': 0.85}},
        # Glimmervoid — gładkie heksagonalne płyty; z rzadka kępy razorgrass
        {'id': 'glimmervoid', 'typ': 'step', 'punkty': okrag(240, 48),
         'opcje': {'gestosc': 0.2}},
    ],
    'pasma': [
        # Oxidda Chain — główny grzbiet promienisty przy skraju tangle'owym
        # wycinka (Copperline Gorge między nim a lasem)
        {'id': 'oxidda', 'punkty': [P(146, 520), P(147, 470), P(148, 420), P(146, 370)],
         'opcje': {'szer': 46}},
        # Krark-Home — góra klanu Krark (tunele), drugi grzbiet równoległy
        {'id': 'krark-home', 'punkty': [P(124, 530), P(126, 480), P(128, 430)],
         'opcje': {'szer': 34}},
        # Grzbiet ku Blackcleave — urwiska nad wkraczającym Drossem
        {'id': 'blackcleave', 'punkty': [P(108, 450), P(112, 405), P(115, 360)],
         'opcje': {'szer': 30}},
    ],
    'rzeki': [],
    'drogi': [
        # Manka Run — obwód patrolowy Aurioków (Bladehold, Liet Field, Ten Shields)
        {'id': 'manka-run', 'punkty': [P(250, 470), P(258, 530), P(270, 548), P(282, 530), P(290, 470),
                                       P(284, 400), P(270, 372), P(256, 400), P(250, 470)],
         'opcje': {'typ': 'szlak'}},
        # Trakt przez Glimmervoid: Viridia → środek (między wieżami) → Ish Sah
        {'id': 'trakt-tangle-dross', 'punkty': [P(199, 486), P(196, 330), [880, 720], [1000, 710],
                                                [1120, 760], P(54, 300), P(54, 430)],
         'opcje': {'typ': 'droga'}},
        # Trakt Taj-Nar ↔ Lumengrid (Seachrome Coast)
        {'id': 'trakt-taj-nar-lumengrid', 'punkty': [P(270, 330), P(300, 270), P(330, 240), P(-20, 250)],
         'opcje': {'typ': 'droga'}},
        # Szlak Viridia → Copperline Gorge → Kuldotha
        {'id': 'szlak-copperline', 'punkty': [P(199, 486), P(178, 470), P(160, 470), P(150, 505),
                                              P(144, 540), P(140, 548)],
         'opcje': {'typ': 'szlak'}},
        # Quicksilver Spires — sieć mostów-iglic przez morze rtęci
        {'id': 'quicksilver-spires', 'punkty': [P(-20, 250), P(-30, 380), P(-12, 440), P(4, 480), P(18, 380)],
         'opcje': {'typ': 'szlak'}},
    ],
    'poi': [{'typ': t, 'x': pt[0], 'y': pt[1], 'id': i, **({'opcje': o} if o else {})}
            for t, pt, i, o in POI],
    'etykiety': ETYKIETY,
    'strefyWodne': ['Quicksilver Sea'],
    'etykietyWodne': ['Quicksilver Sea'],
    'kompas': False,
    'skala': False,
    'ramka': True,
}


def main():
    # kontrola: każdy POI wewnątrz tarczy; akwen wewnątrz tarczy
    for p in SCENA['poi']:
        r = math.hypot(p['x'] - CX, p['y'] - CY)
        assert r < R - 8, f"POI {p['id']} poza tarczą (r={r:.0f})"
    for x, y in JEZIORO:
        assert math.hypot(x - CX, y - CY) < R - 20, 'jezioro dotyka krawędzi tarczy'
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(SCENA, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'zapisano {OUT.relative_to(ROOT)}: {len(SCENA["poi"])} POI, {len(ETYKIETY)} etykiet')


if __name__ == '__main__':
    main()
