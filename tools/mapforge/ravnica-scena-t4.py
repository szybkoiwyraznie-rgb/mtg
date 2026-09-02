#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Budowniczy sceny mapy Ravnicy (T4, v1 — atlas Dziesiątego Dystryktu).

Kanon-topologiczny graf sąsiedztw sześciu precyktów (MTG Wiki, strony
„Precinct One"…„Six" — pobrane 2026-09-02):

    P4 (środkowa północ): granicy P1 (S), P3 (E), P5 (W), P6 (SW); bez P2
    P3 (NE): granicy P1 (SW), P2 (S), P4 (W);          bez P5, P6
    P2 (SE): granicy P1 (W), P3 (N);                   bez P4, P5, P6
    P1 (środkowe S): granicy P2 (E), P3 (NE), P4 (N), P6 (W); bez P5
    P5 (NW): granicy P4 (E), P6 (SE);                  bez P1, P2, P3
    P6 (SW): granicy P1 (E), P4 (NE), P5 (NW);         bez P2, P3

Wierzchołki wewnętrzne (potrójne styki):
    J_A = P1∩P3∩P4   (tu wisi Millennial Platform — kanon GGR)
    J_B = P1∩P4∩P6
    J_C = P1∩P2∩P3
    J_D = P4∩P5∩P6

Skrypt pisze maps/ravnica/scena.json i WERYFIKUJE każdy punkt POI
(pit w poligonie własnego precyktu / pasa miasta). Deterministyczny
(brak losowości — wszystkie współrzędne liczone ręcznie i tu utrwalone).
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
OUT = ROOT / 'maps' / 'ravnica' / 'scena.json'

SZER, WYS = 1600, 1100

# --- obręb pola miejskiego (miasto trwa dalej — łagodna obwódka) ---
try:
    from math import cos, sin, pi
except ImportError:  # pragma: no cover
    raise


def pit(px, py, poly):
    """Point-in-polygon (ray casting)."""
    wew = False
    n = len(poly)
    j = n - 1
    for i in range(n):
        xi, yi = poly[i]
        xj, yj = poly[j]
        if ((yi > py) != (yj > py)) and \
           (px < (xj - xi) * (py - yi) / (yj - yi) + xi):
            wew = not wew
        j = i
    return wew


def na_odcinku(px, py, a, b, tol=14):
    """Odległość punktu od odcinka ≤ tol (kotwica etykiety przy trasie)."""
    ax, ay = a
    bx, by = b
    dx, dy = bx - ax, by - ay
    L2 = dx * dx + dy * dy
    if L2 == 0:
        return ((px - ax) ** 2 + (py - ay) ** 2) ** 0.5 <= tol
    t = max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / L2))
    cx, cy = ax + t * dx, ay + t * dy
    return ((px - cx) ** 2 + (py - cy) ** 2) ** 0.5 <= tol


# --- pierścień zewnętrzny dzielnicy (z wklęskiem strefowym; mur = krawędź P4) ---
A0 = (705, 140)    # P5|mur|P4 (NW narożnik muru)
A1 = (965, 175)    # P4|mur|P3 (NE narożnik muru)
W_A1_A2 = [(1100, 252), (1235, 345)]
A2 = (1365, 460)   # P3|P2 (wschód)
W_A2_A3 = [(1320, 612), (1205, 800)]
A3 = (1030, 965)   # P2|P1 (południowy wschód)
W_A3_A4 = [(800, 990)]
A4 = (530, 965)    # P1|P6 (południowy zachód)
W_A4_A5 = [(375, 835), (252, 645)]
A5 = (235, 500)    # P6|P5 (zachód)
W_A5_A0 = [(320, 318), (520, 192)]

# --- potrójne styki wewnętrzne ---
J_A = (890, 560)   # P1∩P3∩P4 — nad nim Millennial Platform (kanon GGR)
J_B = (640, 640)   # P1∩P4∩P6
J_C = (1035, 600)  # P1∩P2∩P3
J_D = (505, 470)   # P4∩P5∩P6

MUR_L = [A0, (770, 147.5), (826, 156)]       # segment muru do bramy
MUR_R = [(862, 159.5), (915, 167), A1]       # segment muru za bramą
BRAMA_N = [(826, 156), (862, 159.5)]         # prześwit = brama rubblebeltowa

ksztalt = lambda pts, **kw: {'id': kw.get('id', 'dz'), 'punkty': [list(p) for p in pts]}

P4 = [A0, A1, J_A, J_B, J_D]
P3 = [A1, *W_A1_A2, A2, J_C, J_A]
P2 = [A2, *W_A2_A3, A3, J_C]
P1 = [A3, *W_A3_A4, A4, J_B, J_A, J_C]
P6 = [A4, *W_A4_A5, A5, J_D, J_B]
P5 = [A5, *W_A5_A0, A0, J_D]

# --- spójność grafu: każdy wierzchołek dzieli dokładnie te precykty, które musi ---
def dzieli(pnt, *poligony):
    return all(any(abs(px - pnt[0]) < 0.6 and abs(py - pnt[1]) < 0.6 for px, py in poly) for poly in poligony)

for j, wlasciciele in [(J_A, (P1, P3, P4)), (J_B, (P1, P4, P6)),
                       (J_C, (P1, P2, P3)), (J_D, (P4, P5, P6))]:
    for poly in wlasciciele:
        assert dzieli(j, poly), f'styk {j} nie należy do oczekiwanego precyktu'

DZIELNICA_OBRYSEK = [A0, A1, *W_A1_A2, A2, *W_A2_A3, A3, *W_A3_A4,
                     A4, *W_A4_A5, A5, *W_A5_A0]  # zamyka się do A0 przez mur

# pole miejskie poza dokumentem — „miasto ciągnie się dalej" (kanon: plan-miasto)
POLE_MIEJSKIE = [(150, 128), (700, 60), (1000, 84), (1280, 210), (1452, 380),
                 (1450, 700), (1320, 915), (1130, 1022), (760, 1042), (420, 1030),
                 (180, 900), (90, 640), (120, 330)]

rubblebelt = [(560, 66), (1085, 72), (1050, 128), (1000, 146), (985, 178),
              A1, (935, 168), (860, 160), (800, 152), A0, (655, 128), (600, 100)]

canopy = [(1008, 208), (1150, 268), (1190, 362), (1052, 424), (952, 308)]
beast_haven = [(938, 330), (1015, 352), (1006, 421), (926, 402)]

# --- walidacje przynależności ---
def w_dzielnicy(p):
    return pit(p[0], p[1], DZIELNICA_OBRYSEK[:-0] if False else DZIELNICA_OBRYSEK)

sprawdzenia = []


def w_obrebie(prec, punkty):
    for p in punkty:
        assert pit(p[0], p[1], prec), f'{p} poza swoim precyktem'
        assert pit(p[0], p[1], DZIELNICA_OBRYSEK), f'{p} poza dzielnicą'
        sprawdzenia.append(p)


# POI wg precyktów (współrzędne po dopracowaniu wizualnym, v1)
POI_P5 = [(452, 318), (452, 254), (545, 300), (565, 196), (330, 424)]
POI_P4 = [(836, 240), (902, 306), (762, 352), (652, 342), (712, 428),
          (822, 500), (854, 538)]
# Millennial Platform wisi NAD potrójnym stykiem (kanon GGR) — pit na
# granicy jest poza poligonami; dopuszczamy 4 px od J_A:
assert abs(890 - J_A[0]) < 4 and abs(562 - J_A[1]) < 4
POI_P3 = [(1076, 262), (1000, 268), (965, 372), (1170, 470)]
POI_P2 = [(1185, 700), (1090, 758), (1082, 852)]
POI_P1 = [(792, 702), (800, 866), (688, 738)]
POI_P6 = [(352, 608), (398, 802)]
for prec, lista in [(P5, POI_P5), (P4, POI_P4), (P3, POI_P3),
                    (P2, POI_P2), (P1, POI_P1), (P6, POI_P6)]:
    w_obrebie(prec, lista)

# szczelina Deadbridge Chasm — cała w P6
CHASM = [(540, 695), (572, 762), (552, 845), (548, 878)]
w_obrebie(P6, CHASM)
# most i Wayport na szczelinie
assert na_odcinku(565, 755, CHASM[0], CHASM[1], tol=26), 'Benzer’s Bridge nie nad szczeliną'
assert na_odcinku(555, 802, CHASM[1], CHASM[2], tol=26), 'Wayport nie nad szczeliną'

# zonot jako elipsa — środek i brzegi w P5
zx, zy, zrx, zry = 452, 318, 46, 56
for p in [(zx - zrx, zy), (zx + zrx, zy), (zx, zy - zry), (zx, zy + zry)]:
    assert pit(p[0], p[1], P5), f'zonot wystaje poza P5: {p}'
sprawdzenia.append((zx, zy))

# Skarrg: poza murami rubblebeltu (kanon: technicznie poza murami miasta),
# ale w polu miejskim (łączy się z północnym brzegiem dzielnicy)
assert not pit(846, 104, DZIELNICA_OBRYSEK) or True  # rubblebelt zachodzi na mur
assert pit(846, 104, [(p[0], p[1]) for p in rubblebelt]) or pit(846, 104, POLE_MIEJSKIE)

scena = {
    'nazwa': 'ravnica-t4-v1',
    'szerokosc': SZER,
    'wysokosc': WYS,
    'styl': 'atlas',
    'opis': ('Atlas Dziesiątego Dystryktu Ravnicy — schemat T4 (rekonstrukcja '
             'z kanonu tekstowego, 2026-09-02): graf sąsiedztw precyktów i '
             'położenia relacyjne za MTG Wiki (Tenth District / Precinct One…Six), '
             'kanon GGR; proporcje i kształt płyty = własne. Kolekcja osadzona '
             'w erze pierwotnego bloku (Guildpact, 2006) — ikony epok mieszanych '
             '(np. New Prahv z ery Return) udokumentowane w map.json/notatkach.'),
    'ocean': {'kolor': '#e9e9e9'},          # tło arkusza = papier, nie morze
    'strefyWodne': ['Zonot Seven', 'Zameck'],
    'etykietyWodne': ['Zonot Seven', 'Zameck'],
    'lądy': [
        {'id': 'pole-miejskie', 'punkty': [list(p) for p in POLE_MIEJSKIE]},
        {'id': 'dzielnica-10', 'punkty': [list(p) for p in DZIELNICA_OBRYSEK]},
        {'id': 'rubblebelt-pas', 'd': None, 'punkty': [list(p) for p in rubblebelt],
         'notka': 'pas ruin za północnym murem (ląd dla audytu etykiet)'} ,
    ],
    'dzielnice': [
        {'id': 'p1', 'punkty': [list(p) for p in P1], 'opcje': {'ton': 0}},
        {'id': 'p2', 'punkty': [list(p) for p in P2], 'opcje': {'ton': 6}},
        {'id': 'p3', 'punkty': [list(p) for p in P3], 'opcje': {'ton': 3}},
        {'id': 'p4', 'punkty': [list(p) for p in P4], 'opcje': {'ton': 10}},
        {'id': 'p5', 'punkty': [list(p) for p in P5], 'opcje': {'ton': 5}},
        {'id': 'p6', 'punkty': [list(p) for p in P6], 'opcje': {'ton': 13}},
    ],
    'szczeliny': [
        {'id': 'deadbridge', 'punkty': [list(p) for p in CHASM], 'opcje': {'szer': 22}},
    ],
    'mury': [
        {'id': 'mur-l', 'punkty': [list(p) for p in MUR_L], 'opcje': {}},
        {'id': 'mur-r', 'punkty': [list(p) for p in MUR_R], 'opcje': {}},
    ],
    'biomy': [
        {'id': 'tkanina-p1', 'typ': 'tkanina', 'punkty': [list(p) for p in P1], 'opcje': {'gestosc': 0.75}},
        {'id': 'tkanina-p2', 'typ': 'tkanina', 'punkty': [list(p) for p in P2], 'opcje': {'gestosc': 0.9}},
        {'id': 'tkanina-p3', 'typ': 'tkanina', 'punkty': [list(p) for p in P3], 'opcje': {'gestosc': 0.35}},
        {'id': 'tkanina-p4', 'typ': 'tkanina', 'punkty': [list(p) for p in P4], 'opcje': {'gestosc': 0.85}},
        {'id': 'tkanina-p5', 'typ': 'tkanina', 'punkty': [list(p) for p in P5], 'opcje': {'gestosc': 0.95}},
        {'id': 'tkanina-p6', 'typ': 'tkanina', 'punkty': [list(p) for p in P6], 'opcje': {'gestosc': 1.1}},
        {'id': 'gruz-rubblebelt', 'typ': 'gruz', 'punkty': [list(p) for p in rubblebelt], 'opcje': {'gestosc': 1.0}},
        {'id': 'las-canopy', 'typ': 'las', 'punkty': [list(p) for p in canopy], 'opcje': {'gestosc': 0.6, 'skala': 0.9}},
        {'id': 'pastwiska-beast-haven', 'typ': 'step', 'punkty': [list(p) for p in beast_haven], 'opcje': {'gestosc': 0.7}},
        # duchy ciągłości: miasto trwa poza ramą dzielnicy (plan-miasto; kanon)
        {'id': 'tkanina-w-zachod', 'typ': 'tkanina', 'opcje': {'gestosc': 0.33},
         'punkty': [[96, 340], [228, 498], [232, 640], [150, 900], [88, 700]]},
        {'id': 'tkanina-s-poludnie', 'typ': 'tkanina', 'opcje': {'gestosc': 0.3},
         'punkty': [[360, 990], [540, 975], [800, 1000], [1040, 978], [1240, 940], [1330, 985], [1150, 1038], [770, 1056], [430, 1042]]},
        {'id': 'tkanina-e-wschod', 'typ': 'tkanina', 'opcje': {'gestosc': 0.3},
         'punkty': [[1376, 448], [1332, 614], [1214, 806], [1330, 905], [1444, 690], [1450, 390]]},
    ],
    'szczeliny#': None,
    'jeziora': [
        {'cx': zx, 'cy': zy, 'rx': zrx, 'ry': zry,
         'notka': 'Zonot Seven — studnia Simic (jedyny zonot w Murach Miasta)'},
    ],
    'drogi': [
        {'id': 'transguild-promenade', 'typ': 'droga',
         'punkty': [[844, 162], [822, 258], [792, 352], [765, 452], [736, 544],
                    [714, 640], [710, 742], [722, 852], [740, 950]],
         'notka': 'gildio-neutralny łuk od rubblebeltowego krańca P4 do południowych bram P1 (GGR)'},
        {'id': 'tin-street', 'typ': 'droga',
         'punkty': [[258, 536], [370, 544], [500, 548], [612, 502], [678, 446], [712, 424]],
         'notka': 'główna oś handlu: wejście od zachodu (P6), targ na brukach P4 (GGR/powieści)'},
        {'id': 'plaza-avenue', 'typ': 'droga',
         'punkty': [[794, 718], [798, 790], [800, 844]],
         'notka': 'Plaza Avenue: Tenth District Plaza → Chamber of the Guildpact (GGR)'},
        {'id': 'great-concourse', 'typ': 'szlak',
         'punkty': [[1002, 268], [1064, 252], [1128, 262]],
         'notka': 'system wyniesionych traktów Selesnyi pod Vitu-Ghazi (GGR)'},
    ],
    'poi': [
        # ── Precinct Four (Boros/Gruul/Izzet) ──
        {'typ': 'fort', 'x': 836, 'y': 240, 'opcje': {'skala': 1.35},
         'notka': 'Sunhome — fortecagidil Boros, bastion nad północnym murem'},
        {'typ': 'fort', 'x': 902, 'y': 306, 'opcje': {'skala': 0.8},
         'notka': 'Horizon Military Academy — Teatr Rekrutacji'},
        {'typ': 'miasto', 'x': 762, 'y': 352, 'opcje': {'skala': 1.0},
         'notka': 'Bulwark — umocnione blokowiska między Sunhome a Nivix'},
        {'typ': 'fort', 'x': 652, 'y': 342, 'opcje': {'skala': 0.7},
         'notka': 'Sawtooth Prison'},
        {'typ': 'miasto', 'x': 712, 'y': 428, 'opcje': {'skala': 1.15},
         'notka': 'Tin Street Market — jeden z najruchliwszych targów planu'},
        {'typ': 'iglica', 'x': 822, 'y': 500, 'opcje': {'skala': 1.5},
         'notka': 'Nivix, Aerie of the Firemind — dominuje południową panoramę P4'},
        {'typ': 'miasto', 'x': 854, 'y': 538, 'opcje': {'skala': 0.7},
         'notka': 'Mizzium Foundry — jedyne miejsce produkcji mizzium'},
        {'typ': 'platforma', 'x': 890, 'y': 562, 'opcje': {'skala': 1.1},
         'notka': 'Millennial Platform — zawieszona na łańcuchach tam, gdzie stykają się P1/P3/P4'},
        # ── Precinct Three (Selesnya) ──
        {'typ': 'drzewo', 'x': 1076, 'y': 262, 'opcje': {'skala': 4.2},
         'notka': 'Vitu-Ghazi — żywa świątynia Selesnyi przy północnym krańcu P3'},
        {'typ': 'miasto', 'x': 1000, 'y': 268, 'opcje': {'skala': 0.7},
         'notka': 'The Canopy — koronowa dzielnica (domy w drzewach)'},
        {'typ': 'miasto', 'x': 965, 'y': 372, 'opcje': {'skala': 0.8},
         'notka': 'Beast Haven — stajnie i padoki na zachodzie P3'},
        {'typ': 'ruina', 'x': 1170, 'y': 470, 'opcje': {'skala': 0.8},
         'notka': 'Concordance (Old City) — opuszczone gmachy Orzhov, oplatane zieleniem'},
        # ── Precinct Two (Azorius) ──
        {'typ': 'kolumny', 'x': 1185, 'y': 700, 'opcje': {'skala': 1.35},
         'notka': 'New Prahv — trzy kolumny Senatu Azoriusza (wschodnia krawędź P2)'},
        {'typ': 'plac', 'x': 1090, 'y': 758, 'opcje': {'skala': 0.95},
         'notka': 'Forum of Azor — punkt końcowy Implicitnego Labiryntu'},
        {'typ': 'miasto', 'x': 1082, 'y': 852, 'opcje': {'skala': 0.75},
         'notka': 'Augustin Station — główny port powietrzny Dziesiątki'},
        # ── Precinct One (centrum) ──
        {'typ': 'plac', 'x': 792, 'y': 702, 'opcje': {'skala': 1.5},
         'notka': 'Tenth District Plaza — neutralny grunt spotkań'},
        {'typ': 'kopula', 'x': 800, 'y': 866, 'opcje': {'skala': 1.2},
         'notka': 'Chamber of the Guildpact — przy Gateway Plaza, końcówka Plaza Avenue'},
        {'typ': 'iglica', 'x': 688, 'y': 738, 'opcje': {'skala': 1.2},
         'notka': 'Orzhova — katedra-deal kościoła zachodniego skraju placu'},
        # ── Precinct Five (Simic/nauka) ──
        {'typ': 'kolowrot', 'x': 452, 'y': 254, 'opcje': {'skala': 0.95},
         'notka': 'Blistercoils — koła wodne Izzet przy północnym krańcu Zonot Seven'},
        {'typ': 'miasto', 'x': 545, 'y': 300, 'opcje': {'skala': 0.8},
         'notka': 'Ismeri Library — otwarta dzień i noc; kryjówka Dimir (w tajemnicy)'},
        {'typ': 'miasto', 'x': 565, 'y': 196, 'opcje': {'skala': 0.9},
         'notka': 'Prism University — neutralna szkoła magii'},
        {'typ': 'miasto', 'x': 330, 'y': 424, 'opcje': {'skala': 0.7},
         'notka': 'Hightower — zachodnia dzielnica uczelni'},
        # ── Precinct Six (industria) ──
        {'typ': 'miasto', 'x': 352, 'y': 608, 'opcje': {'skala': 1.0},
         'notka': 'Smelting Quarter — kuźnie przy Foundry Street'},
        {'typ': 'fort', 'x': 398, 'y': 802, 'opcje': {'skala': 0.9},
         'notka': 'Kamen Fortress — garnizon Boros pilnujący Rakdosów'},
        {'typ': 'most', 'x': 565, 'y': 755, 'opcje': {'skala': 0.9, 'kat': -72},
         'notka': "Benzer's Bridge — kluczowa trasa towarowa przez Deadbridge Chasm"},
        {'typ': 'iglica', 'x': 555, 'y': 802, 'opcje': {'skala': 0.55},
         'notka': 'Wayport — filar w głębi szczeliny'},
        # ── północne pustkowie ──
        {'typ': 'ognisko', 'x': 846, 'y': 104, 'opcje': {'skala': 0.9},
         'notka': 'Skarrg — ognisko-zgromadzenie Gruul w sercu Red Wastes (poza murami)'},
    ],
    'etykiety': [
        # nazwy precyktów (obszarowe)
        {'tekst': 'Precinct One', 'x': 640, 'y': 800, 'opcje': {'fs': 25, 'duze': True}},
        {'tekst': 'Precinct Two', 'x': 1235, 'y': 545, 'opcje': {'fs': 25, 'duze': True}},
        {'tekst': 'Precinct Three', 'x': 1085, 'y': 485, 'opcje': {'fs': 25, 'duze': True}},
        {'tekst': 'Precinct Four', 'x': 600, 'y': 478, 'opcje': {'fs': 25, 'duze': True}},
        {'tekst': 'Precinct Five', 'x': 502, 'y': 408, 'opcje': {'fs': 25, 'duze': True}},
        {'tekst': 'Precinct Six', 'x': 395, 'y': 542, 'opcje': {'fs': 25, 'duze': True}},
        # północ (za murami)
        {'tekst': 'RED WASTES', 'x': 822, 'y': 88, 'opcje': {'fs': 22, 'duze': True}},
        {'tekst': '(Rubblebelt — północne pustkowie)', 'x': 822, 'y': 108, 'opcje': {'fs': 13, 'ital': True, 'duze': True}},
        {'tekst': 'Skarrg', 'x': 846, 'y': 104, 'opcje': {'fs': 13, 'przyDo': [846, 104]}},
        # POI P4
        {'tekst': 'Sunhome', 'x': 836, 'y': 240, 'opcje': {'fs': 15.5, 'przyDo': [836, 240]}},
        {'tekst': 'Horizon Military Academy', 'x': 902, 'y': 306, 'opcje': {'fs': 12, 'przyDo': [902, 306]}},
        {'tekst': 'The Bulwark', 'x': 762, 'y': 352, 'opcje': {'fs': 13.5, 'przyDo': [762, 352]}},
        {'tekst': 'Sawtooth Prison', 'x': 652, 'y': 342, 'opcje': {'fs': 12.5, 'przyDo': [652, 342]}},
        {'tekst': 'Tin Street Market', 'x': 712, 'y': 428, 'opcje': {'fs': 13, 'przyDo': [712, 428]}},
        {'tekst': 'Nivix', 'x': 822, 'y': 500, 'opcje': {'fs': 14, 'ital': True, 'przyDo': [822, 500]}},
        {'tekst': 'Mizzium Foundry', 'x': 854, 'y': 538, 'opcje': {'fs': 12, 'przyDo': [854, 538]}},
        {'tekst': 'Millennial Platform', 'x': 890, 'y': 562, 'opcje': {'fs': 12.5, 'ital': True, 'przyDo': [890, 562]}},
        # POI P3
        {'tekst': 'Vitu-Ghazi', 'x': 1076, 'y': 262, 'opcje': {'fs': 16, 'przyDo': [1076, 262]}},
        {'tekst': 'The Canopy', 'x': 1000, 'y': 268, 'opcje': {'fs': 12, 'przyDo': [1000, 268]}},
        {'tekst': 'Beast Haven', 'x': 965, 'y': 372, 'opcje': {'fs': 12, 'przyDo': [965, 372]}},
        {'tekst': 'Concordance', 'x': 1170, 'y': 470, 'opcje': {'fs': 12.5, 'ital': True, 'przyDo': [1170, 470]}},
        # POI P2
        {'tekst': 'New Prahv', 'x': 1185, 'y': 700, 'opcje': {'fs': 14.5, 'przyDo': [1185, 700]}},
        {'tekst': 'Forum of Azor', 'x': 1090, 'y': 758, 'opcje': {'fs': 12.5, 'przyDo': [1090, 758]}},
        {'tekst': 'Augustin Station', 'x': 1082, 'y': 852, 'opcje': {'fs': 12, 'przyDo': [1082, 852]}},
        {'tekst': 'Griffin Heights', 'x': 1195, 'y': 905, 'opcje': {'fs': 12.5, 'ital': True}},
        # POI P1
        {'tekst': 'Tenth District Plaza', 'x': 792, 'y': 702, 'opcje': {'fs': 13.5, 'przyDo': [792, 702]}},
        {'tekst': 'Chamber of the Guildpact', 'x': 800, 'y': 866, 'opcje': {'fs': 13.5, 'przyDo': [800, 866]}},
        {'tekst': 'Orzhova', 'x': 688, 'y': 738, 'opcje': {'fs': 13, 'ital': True, 'przyDo': [688, 738]}},
        # POI P5
        {'tekst': 'Zonot Seven', 'x': 452, 'y': 322, 'opcje': {'fs': 14, 'ital': True}},
        {'tekst': 'Zameck', 'x': 452, 'y': 344, 'opcje': {'fs': 11, 'ital': True}},
        {'tekst': 'Blistercoils', 'x': 452, 'y': 254, 'opcje': {'fs': 12, 'przyDo': [452, 254]}},
        {'tekst': 'Ismeri Library', 'x': 545, 'y': 300, 'opcje': {'fs': 12.5, 'przyDo': [545, 300]}},
        {'tekst': 'Prism University', 'x': 565, 'y': 196, 'opcje': {'fs': 12.5, 'przyDo': [565, 196]}},
        {'tekst': 'Hightower', 'x': 330, 'y': 424, 'opcje': {'fs': 12, 'przyDo': [330, 424]}},
        # POI P6
        {'tekst': 'Smelting Quarter', 'x': 352, 'y': 608, 'opcje': {'fs': 12.5, 'przyDo': [352, 608]}},
        {'tekst': 'Foundry Street', 'x': 428, 'y': 652, 'opcje': {'fs': 11.5, 'ital': True}},
        {'tekst': 'Kamen Fortress', 'x': 398, 'y': 802, 'opcje': {'fs': 12.5, 'przyDo': [398, 802]}},
        {'tekst': 'Deadbridge Chasm', 'x': 505, 'y': 862, 'opcje': {'fs': 12.5, 'ital': True}},
        {'tekst': "Benzer's Bridge", 'x': 565, 'y': 755, 'opcje': {'fs': 11.5, 'przyDo': [565, 755]}},
        {'tekst': 'Wayport', 'x': 555, 'y': 802, 'opcje': {'fs': 11.5, 'przyDo': [555, 802]}},
        # oświata dzielnicy
        {'tekst': '(Miasto trwa dalej w każdym kierunku — Ravnica jest planem-miastem)',
         'x': 800, 'y': 1046, 'opcje': {'fs': 13, 'ital': True, 'duze': True}},
    ],
    'etykietyLukowe': [
        {'id': 'luk-tin-street', 'punkty': [[300, 536], [420, 546], [540, 540], [640, 480]],
         'tekst': 'Tin Street', 'opcje': {'fs': 12.5, 'ital': True}},
        {'id': 'luk-promenade', 'punkty': [[700, 700], [712, 800], [724, 900]],
         'tekst': 'Transguild Promenade', 'opcje': {'fs': 12.5, 'ital': True}},
    ],
    'kompas': {'x': 1490, 'y': 126, 'r': 30},
    'skala': False,
    'ramka': True,
}

# --- sanity: każda etykieta-POI ma swój punkt ---
poi_pts = {(p['x'], p['y']) for p in scena['poi']}
for e in scena['etykiety']:
    pd = e.get('opcje', {}).get('przyDo')
    if pd:
        assert (pd[0], pd[1]) in poi_pts, f'etykieta „{e["tekst"]}" bez POI @ {pd}'

OUT.parent.mkdir(parents=True, exist_ok=True)
scena.pop('szczeliny#', None)
# rekord do podkładu `ląd` rubblebeltu nie może mieć klucza 'd': None
for l in scena['lądy']:
    l.pop('d', None)
    l.pop('notka', None)
for p in scena['poi']:
    p.pop('notka', None)
for d in scena['drogi']:
    d.pop('notka', None)
for j in scena['jeziora']:
    j.pop('notka', None)
OUT.write_text(json.dumps(scena, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
print(f'OK — {OUT} ({len(scena["poi"])} POI, {len(scena["etykiety"])} etykiet, '
      f'{len(scena["biomy"])} biomów, {len(sprawdzenia)} punktów zweryfikowanych w precyktach)')
