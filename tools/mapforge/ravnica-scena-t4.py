#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Budowniczy sceny mapy Ravnicy (T4, v2 — atlas Dziesiątego Dystryktu).

v2 = kalibracja 1:1 pod **transkrypcję właściciela oficjalnej mapy GGR**
(maps/ravnica/zrodlo-transkrypcja-ggr.md, dostawa 2026-09-03). Pozycje
POI, arterii i centrów precyktów pochodzą z układu transkrypcji
(X ∈ [-10,10], Y ∈ [-10,10]; Y dodatnie = góra kadru; początek w okolicy
Tenth District Plaza). Transformacja kanoniczna na płótno 1600×1100
(atlas, N = góra):

    px = 830 + (X - 0.5) * 64
    py = 610 - (Y + 1) * 64

(64 px/jednostkę; plaza T(0.5, -1.0) → (830, 610) — środek ciężkości
płyty). Granice precyktów transkrypcja podaje relacyjnie (Tin Street =
granica P4|P5; Bulwark = linia P4|P6; Plaza East = styk z P1); graf
sąsiedztw precyktów = kanon wiki (jak v1):

    P4 (N centrum): P1 (S), P3 (E), P5 (W), P6 (SW); bez P2
    P3 (NE): P1 (SW), P2 (S), P4 (W);  P2 (SE): P1 (W), P3 (N)
    P1 (S centrum): P2 (E), P3 (NE), P4 (N), P6 (W); bez P5
    P5 (W): P4 (E), P6 (SE);  P6 (SW): P1 (E), P4 (NE), P5 (NW)

Wyjątki pozycyjne (udokumentowane): Skarrg i Millennial Platform —
w pasie rubblebeltu poza murami (kanon); Plaza East — korytarz
stykowy P1/P3/P4 (przesunięte ~35 px względem t(), by nie leżeć
na linii granicznej); Bulwark — w P4 wg wiki („między Sunhome
a Nivix"; lista transkrypcji traktuje go z P6 jako parę z Kamen
Fortress — na rastrze etykieta leży na samej linii); markery
podziemi (Rix Maadi, Korozda & Svogthos, Nightveil & Duskmantle) —
przy południowej poświacie płyty (konwencja przekrojowa rastra,
bez 1:1 głębokości). Pozycje własne (poza transkrypcją): Horizon
Military Academy, Sawtooth Prison, Tin Street Market, Mizzium
Foundry, Forum of Azor, Benzer's Bridge — relatywne (wiki).

Deterministyczny. Skrypt pisze maps/ravnica/scena.json i WERYFIKUJE
każdy punkt POI (pit w poligonie własnego precyktu / pasa miasta).
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
OUT = ROOT / 'maps' / 'ravnica' / 'scena.json'

SZER, WYS = 1600, 1100


def t(X, Y):
    """Transformacja kanoniczna układu transkrypcji -> piksele płótna."""
    return (round(830 + (X - 0.5) * 64, 1), round(610 - (Y + 1) * 64, 1))


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
    ax, ay = a
    bx, by = b
    dx, dy = bx - ax, by - ay
    L2 = dx * dx + dy * dy
    if L2 == 0:
        return ((px - ax) ** 2 + (py - ay) ** 2) ** 0.5 <= tol
    tt = max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / L2))
    cx, cy = ax + tt * dx, ay + tt * dy
    return ((px - cx) ** 2 + (py - cy) ** 2) ** 0.5 <= tol


# --- wierzchołki pierścienia płyty dzielnicy ---
A0 = (500, 165)      # P5|P4, góra (początek muru)
TOP_MUR = [(700, 155), (900, 150)]
J_WALL = (1030, 160)  # P4|P3 przy bramie Transguild Promenade
A1 = (1090, 170)     # P3 góra-NE
W_A1_A2 = [(1290, 290), (1270, 470)]
A2 = (1245, 545)     # P3|P2 (wschód)
W_A2_A3 = [(1255, 700), (1205, 835)]
A3 = (1090, 905)     # P2|P1 (narożnik płyty, południowy wschód)
W_A3_A4 = [(960, 945)]
A4 = (760, 950)      # P1|P6 (południe)
W_A4_A5 = [(640, 955), (520, 905), (410, 820), (300, 690)]
A5 = (255, 540)      # P6|P5 (zachód — wybrzuszenie P6)
W_A5_A0 = [(250, 455), (290, 415), (380, 335), (430, 240)]

# --- potrójne styki wewnętrzne ---
J_A = (945, 555)     # P1∩P3∩P4
J_B = (660, 625)     # P1∩P4∩P6
J_C = (980, 605)     # P1∩P2∩P3
J_D = (510, 510)     # P4∩P5∩P6 (na Tin Street, południowy koniec granicy)

GAP_L = (1010, 156)
GAP_R = (1045, 162)
MUR_L = [A0, *TOP_MUR, GAP_L]
MUR_R = [GAP_R, (1065, 166), A1]

# --- poligony precyktów ---
P4 = [A0, *TOP_MUR, J_WALL, (1005, 300), (965, 430), J_A,
      (830, 610), J_B, (630, 520), J_D, (520, 460), (455, 400),
      (478, 322)]
P3 = [J_WALL, A1, *W_A1_A2, A2, (1180, 600), (1050, 625), J_C,
      (985, 575), J_A, (965, 430), (1005, 300)]
P2 = [A2, *W_A2_A3, A3, (1000, 930), (935, 830), (950, 700), J_C,
      (1050, 625), (1180, 600)]
P1 = [J_B, (830, 610), J_A, (985, 575), J_C, (950, 700), (935, 830),
      (1000, 930), A3, *W_A3_A4, A4, (710, 930), (710, 860),
      (700, 700)]
P6 = [J_D, (630, 520), J_B, (700, 700), (710, 860),
      (710, 930), A4, *W_A4_A5, A5, (330, 640), (400, 645)]
P5 = [A0, (478, 322), (455, 400), (520, 460), J_D,
      (400, 645), (330, 640), A5, *W_A5_A0[::-1]]

DZIELNICA_OBRYSEK = [A0, *TOP_MUR, J_WALL, A1, *W_A1_A2, A2, *W_A2_A3,
                     A3, *W_A3_A4, A4, *W_A4_A5, A5, *W_A5_A0]


def dzieli(pnt, *poligony):
    return all(any(abs(px - pnt[0]) < 0.6 and abs(py - pnt[1]) < 0.6
                   for px, py in poly) for poly in poligony)


for j, wlasciciele in [(J_A, (P1, P3, P4)), (J_B, (P1, P4, P6)),
                       (J_C, (P1, P2, P3)), (J_D, (P4, P5, P6))]:
    for poly in wlasciciele:
        assert dzieli(j, poly), f'styk {j} nie należy do oczekiwanego precyktu'

# pole miejskie poza dokumentem — „miasto ciągnie się dalej" (kanon)
POLE_MIEJSKIE = [(160, 120), (760, 58), (1120, 70), (1330, 160), (1460, 330),
                 (1450, 640), (1360, 860), (1210, 980), (1000, 1040),
                 (640, 1050), (330, 995), (140, 820), (95, 560), (130, 320)]

rubblebelt = [(430, 60), (1120, 70), (1105, 130), (1000, 145), (880, 146),
              (700, 148), (520, 150), (430, 120)]

canopy_las = [(1145, 210), (1265, 240), (1268, 320), (1180, 360), (1110, 300)]
beast_pastwiska = [(965, 270), (1055, 285), (1050, 345), (970, 340)]
medori_step = [(400, 758), (505, 760), (508, 818), (402, 822)]

sprawdzenia = []


def w_obrebie(prec, punkty):
    for p in punkty:
        assert pit(p[0], p[1], prec), f'{p} poza swoim precyktem'
        assert pit(p[0], p[1], DZIELNICA_OBRYSEK), f'{p} poza dzielnicą'
        sprawdzenia.append(p)


# --- pozycje z transkrypcji ---
POZ_Sunhome = t(1.0, 3.0)        # (862, 354)
POZ_Nivix = t(-2.5, 1.5)         # (638, 450)
POZ_Vitu = t(4.8, 5.0)           # (1105, 226)
POZ_Canopy = t(6.8, 4.5)         # (1233, 258)
POZ_Concourse = t(5.8, 3.5)      # (1169, 322)
POZ_Concordance = t(5.3, 2.2)    # (1137, 405)
POZ_Beast = t(3.3, 3.8)          # (1009, 303)
POZ_Whitestone = t(3.8, -0.2)    # (1041, 559)
POZ_Plaza = (830.0, 628.0)       # t(0.5,-1.0) odsunięte 18 j. na S od linii P1|P4
POZ_Orzhova = t(-0.2, -1.5)      # (785, 642)
POZ_Vizkopa = t(0.2, -2.4)       # (811, 700)
POZ_Chamber = t(1.8, -3.3)       # (913, 757)
POZ_PlazaW = t(0.3, -3.3)        # (817, 757)
POZ_PlazaS = t(1.5, -5.8)        # (894, 917)
POZ_Prahv = t(6.0, -1.0)         # (1182, 610)
POZ_StatuaKos = t(4.0, -2.2)     # (1054, 687)
POZ_Augustin = t(3.0, -3.0)      # (990, 738)
POZ_Blister = t(-5.0, 1.8)       # (478, 431)
POZ_Ismeri = t(-8.0, 0.4)        # (286, 520)
POZ_Prism = t(-7.5, 1.2)         # (318, 469)
POZ_Hightower = t(-7.0, 2.0)     # (350, 418)
POZ_Smelting = t(-3.8, -0.2)     # (555, 559)
POZ_Gore = t(-2.8, -1.4)         # (619, 636)
POZ_Bulwark = t(-1.8, -0.9)      # (683, 604) — wiki: między Sunhome a Nivix (P4)
POZ_Kamen = t(-1.8, -2.0)        # (683, 674) — raster: para obronna z Bulwark
POZ_Medori = t(-5.5, -3.8)       # (446, 789)
POZ_Wayport = t(-1.5, -4.0)      # (702, 802)
POZ_Skarrg = t(1.8, 6.8)         # (913, 111)
POZ_Millennial = t(3.7, 7.0)     # (1035, 98)
# pozycje własne, kalibrowane relatywnie (nie występują w transkrypcji)
POZ_PlazaE = (962.0, 540.0)      # korytarz stykowy P1|P3 (wiki: styk z P1)
POZ_Horizon = (940, 412)
POZ_Sawtooth = (575, 355)
POZ_TinMarket = (545, 475)
POZ_Mizzium = (700, 505)
POZ_Forum = (1112, 738)
POZ_Bridge = (692, 868)

w_obrebie(P4, [POZ_Sunhome, POZ_Nivix, POZ_Horizon, POZ_Sawtooth,
               POZ_TinMarket, POZ_Mizzium, POZ_Bulwark])
w_obrebie(P3, [POZ_Vitu, POZ_Canopy, POZ_Concourse, POZ_Concordance,
               POZ_Beast, POZ_Whitestone, POZ_PlazaE])
w_obrebie(P2, [POZ_Prahv, POZ_StatuaKos, POZ_Augustin, POZ_Forum])
w_obrebie(P1, [POZ_Plaza, POZ_Orzhova, POZ_Vizkopa, POZ_Chamber,
               POZ_PlazaW, POZ_PlazaS])
w_obrebie(P5, [POZ_Blister, POZ_Ismeri, POZ_Prism, POZ_Hightower])
w_obrebie(P6, [POZ_Smelting, POZ_Gore, POZ_Kamen, POZ_Medori,
               POZ_Bridge, POZ_Wayport])

# szczelina Deadbridge Chasm — cała w P6, dochodzi do południowego rimu
CHASM = [(668, 825), (678, 872), (664, 918), (656, 945)]
w_obrebie(P6, CHASM)
assert na_odcinku(*POZ_Bridge, CHASM[0], CHASM[1], tol=28), \
    'Benzer’s Bridge nie nad szczeliną'
assert na_odcinku(*POZ_Wayport, CHASM[0], CHASM[1], tol=42), \
    'Wayport zbyt daleko od szczeliny'

# zonot jako elipsa — środek i brzegi w P5
zx, zy, zrx, zry = round(t(-6.5, -0.2)[0]), round(t(-6.5, -0.2)[1]), 46, 56
for p in [(zx - zrx, zy), (zx + zrx, zy), (zx, zy - zry), (zx, zy + zry)]:
    assert pit(p[0], p[1], P5), f'zonot wystaje poza P5: {p}'
sprawdzenia.append((zx, zy))

# Zameck — ratusz Simic na Zonot Seven (kanon GGR: Zameck = siedziba
# Konklawe na Zonot Seven); odznaka gildii w wodzie studni (obiekt
# wodny), w POŁUDNIOWO-ZACHODNIEJ części studni: wschód zajmuje wlot
# Tin Street (392,600), środek — napis „Zonot Seven".
POZ_Zameck = (356, 588)
assert pit(POZ_Zameck[0], POZ_Zameck[1], P5), 'Zameck poza P5'
sprawdzenia.append(POZ_Zameck)

# Skarrg i Millennial Platform — w pasie rubblebeltu poza murami (kanon)
for p in (POZ_Skarrg, POZ_Millennial):
    assert pit(p[0], p[1], rubblebelt) or pit(p[0], p[1], POLE_MIEJSKIE)
    sprawdzenia.append(p)

# podziemie — markery w poświacie południowej (konwencja przekrojowa rastra)
POZ_Rix = (530, 928)
POZ_Svogthos = (905, 985)
POZ_Duskmantle = (1120, 918)
for p in (POZ_Rix, POZ_Svogthos, POZ_Duskmantle):
    assert pit(p[0], p[1], POLE_MIEJSKIE) and \
        not pit(p[0], p[1], DZIELNICA_OBRYSEK), f'podziemie {p} nie na poświacie'
    sprawdzenia.append(p)


def poi(typ, poz, skala, **op):
    o = {'skala': skala}
    o.update(op)
    return {'typ': typ, 'x': poz[0], 'y': poz[1], 'opcje': o}


def et(tekst, poz, fs, przy_poz=None, **op):
    e = {'tekst': tekst, 'x': poz[0], 'y': poz[1], 'opcje': {'fs': fs}}
    if przy_poz is not None:
        e['opcje']['przyDo'] = [przy_poz[0], przy_poz[1]]
    e['opcje'].update(op)
    return e


scena = {
    'nazwa': 'ravnica-t4-v2',
    'szerokosc': SZER,
    'wysokosc': WYS,
    'styl': 'atlas',
    'opis': ('Atlas Dziesiątego Dystryktu Ravnicy — schemat T4, v2 '
             '(kalibracja 1:1 pod transkrypcję właściciela oficjalnej mapy '
             'GGR, 2026-09-03 — maps/ravnica/zrodlo-transkrypcja-ggr.md): '
             'pozycje POI i arterii z układu transkrypcji (64 px/j., plac '
             '→ (830,610)); granice precyktów relacyjne (Tin Street, Bulwark, '
             'graf sąsiedztw z MTG Wiki). Podziemia jako markery przekrojowe '
             'przy południowej poświacie. Epoki mieszane udokumentowane '
             'w map.json/notatkach.'),
    'ocean': {'kolor': '#e9e9e9'},
    'strefyWodne': ['Zonot Seven', 'Zameck'],
    'etykietyWodne': ['Zonot Seven', 'Zameck'],
    'lądy': [
        {'id': 'pole-miejskie', 'punkty': [list(p) for p in POLE_MIEJSKIE]},
        {'id': 'dzielnica-10', 'punkty': [list(p) for p in DZIELNICA_OBRYSEK]},
        {'id': 'rubblebelt-pas', 'punkty': [list(p) for p in rubblebelt]},
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
        {'id': 'deadbridge', 'punkty': [list(p) for p in CHASM],
         'opcje': {'szer': 22}},
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
        {'id': 'las-canopy', 'typ': 'las', 'punkty': [list(p) for p in canopy_las], 'opcje': {'gestosc': 0.6, 'skala': 0.9}},
        {'id': 'pastwiska-beast-haven', 'typ': 'step', 'punkty': [list(p) for p in beast_pastwiska], 'opcje': {'gestosc': 0.7}},
        {'id': 'park-medori', 'typ': 'step', 'punkty': [list(p) for p in medori_step], 'opcje': {'gestosc': 0.5}},
        # duchy ciągłości — miasto trwa poza ramą dzielnicy (plan-miasto)
        {'id': 'tkanina-w-zachod', 'typ': 'tkanina', 'opcje': {'gestosc': 0.33},
         'punkty': [[96, 340], [228, 450], [240, 560], [150, 870], [88, 700]]},
        {'id': 'tkanina-s-poludnie', 'typ': 'tkanina', 'opcje': {'gestosc': 0.3},
         'punkty': [[300, 965], [560, 970], [800, 990], [1000, 990],
                    [1210, 960], [1330, 985], [1150, 1038], [770, 1052],
                    [430, 1038]]},
        {'id': 'tkanina-e-wschod', 'typ': 'tkanina', 'opcje': {'gestosc': 0.3},
         'punkty': [[1310, 290], [1345, 470], [1300, 650], [1240, 880],
                    [1340, 905], [1444, 690], [1450, 390]]},
    ],
    'jeziora': [
        {'cx': zx, 'cy': zy, 'rx': zrx, 'ry': zry,
         'notka': 'Zonot Seven — studnia Simic (jedyny zonot w Mieście)'},
    ],
    'drogi': [
        {'id': 'transguild-promenade', 'typ': 'droga',
         'punkty': [[1022, 168], [1005, 240], [985, 330], [966, 420],
                    [952, 500], [945, 555], [920, 585], [870, 600], [840, 612]],
         'notka': 'gildio-neutralny łuk: brama północna → Tenth District Plaza'},
        {'id': 'plaza-avenue', 'typ': 'droga',
         'punkty': [[838, 632], [866, 682], [898, 735], [913, 760],
                    [940, 810], [972, 860], [990, 895]],
         'notka': 'plac → Chamber of the Guildpact → południowe bramy'},
        {'id': 'tin-street', 'typ': 'droga',
         'punkty': [[478, 322], [496, 392], [512, 462], [500, 514],
                    [440, 560], [392, 600]],
         'notka': 'oś handlu i naturalna granica P4|P5'},
        {'id': 'great-concourse', 'typ': 'szlak',
         'punkty': [[1108, 250], [1148, 286], [1169, 322]],
         'notka': 'wyniesione trakty: Vitu-Ghazi → The Great Concourse'},
    ],
    'poi': [
        # ── Precinct Four (Boros/Izzet) ──
        # Herby gildii (PR-17 B): barwne odznaki z białym glifem na
        # siedzibach dziesięciu gildii (kanon GGR/wikipedia).
        poi('fort', POZ_Sunhome, 1.35, gildia='boros'),
        poi('fort', POZ_Horizon, 0.8),
        poi('miasto', POZ_Bulwark, 1.0),
        poi('fort', POZ_Sawtooth, 0.7),
        poi('miasto', POZ_TinMarket, 1.15),
        poi('iglica', POZ_Nivix, 1.5, gildia='izzet'),
        poi('miasto', POZ_Mizzium, 0.7),
        # ── Precinct Three (Selesnya) ──
        poi('drzewo', POZ_Vitu, 4.2, gildia='selesnya'),
        poi('miasto', POZ_Canopy, 0.7),
        poi('miasto', POZ_Beast, 0.8),
        poi('plac', POZ_Concourse, 0.9),
        poi('ruina', POZ_Concordance, 0.8),
        poi('miasto', POZ_Whitestone, 0.6),
        poi('plac', POZ_PlazaE, 0.8),
        # ── Precinct Two (Azorius) ──
        poi('kolumny', POZ_Prahv, 1.35, gildia='azorius'),
        poi('kolumny', POZ_StatuaKos, 0.55),
        poi('miasto', POZ_Augustin, 0.75),
        poi('plac', POZ_Forum, 0.9),
        # ── Precinct One (centrum) ──
        poi('plac', POZ_Plaza, 1.5),
        poi('iglica', POZ_Orzhova, 1.2, gildia='orzhov'),
        poi('miasto', POZ_Vizkopa, 0.7),
        poi('kopula', POZ_Chamber, 1.2),
        poi('plac', POZ_PlazaW, 0.8),
        poi('plac', POZ_PlazaS, 0.85),
        # ── Precinct Five (Simic/nauka) ──
        poi('kolowrot', POZ_Blister, 0.95, gildia='izzet'),
        poi('herb', POZ_Zameck, 1.0, gildia='simic'),
        poi('miasto', POZ_Ismeri, 0.8),
        poi('miasto', POZ_Prism, 0.9),
        poi('miasto', POZ_Hightower, 0.7),
        # ── Precinct Six (industria) ──
        poi('miasto', POZ_Smelting, 1.0),
        poi('miasto', POZ_Gore, 0.7),
        poi('fort', POZ_Kamen, 0.9),
        poi('miasto', POZ_Medori, 0.7),
        poi('most', POZ_Bridge, 0.9, kat=-75),
        poi('iglica', POZ_Wayport, 0.55),
        # ── północne pustkowie (poza murami) ──
        poi('ognisko', POZ_Skarrg, 0.9, gildia='gruul'),
        poi('platforma', POZ_Millennial, 1.1),
        # ── podziemia (przekrój przy południowej poświacie) ──
        poi('ruina', POZ_Rix, 0.9, gildia='rakdos'),
        poi('ruina', POZ_Svogthos, 0.9, gildia='golgari'),
        poi('ruina', POZ_Duskmantle, 0.9, gildia='dimir'),
    ],
    'etykiety': [
        # nazwy precyktów (obszarowe)
        et('Precinct One', (830, 700), 25, duze=True),
        et('Precinct Two', (1080, 800), 25, duze=True),
        et('Precinct Three', (1086, 418), 25, duze=True),
        et('Precinct Four', (670, 290), 25, duze=True),
        et('Precinct Five', (382, 478), 25, duze=True),
        et('Precinct Six', (542, 706), 25, duze=True),
        # północ (za murami)
        et('RED WASTES', (770, 92), 22, duze=True),
        et('(Rubblebelt — północne pustkowie)', (770, 112), 13, ital=True, duze=True),
        et('Skarrg', POZ_Skarrg, 13, przy_poz=POZ_Skarrg),
        et('Millennial Platform', POZ_Millennial, 12.5, przy_poz=POZ_Millennial),
        # P4
        et('Sunhome', POZ_Sunhome, 15.5, przy_poz=POZ_Sunhome),
        et('Horizon Military Academy', POZ_Horizon, 12, przy_poz=POZ_Horizon),
        et('The Bulwark', POZ_Bulwark, 13.5, przy_poz=POZ_Bulwark),
        et('Sawtooth Prison', POZ_Sawtooth, 12.5, przy_poz=POZ_Sawtooth),
        et('Tin Street Market', POZ_TinMarket, 13, przy_poz=POZ_TinMarket),
        et('Nivix', POZ_Nivix, 14, przy_poz=POZ_Nivix, ital=True),
        et('Mizzium Foundry', POZ_Mizzium, 12, przy_poz=POZ_Mizzium),
        # P3
        et('Vitu-Ghazi', POZ_Vitu, 16, przy_poz=POZ_Vitu),
        et('The Canopy', POZ_Canopy, 12, przy_poz=POZ_Canopy),
        et('Beast Haven', POZ_Beast, 12, przy_poz=POZ_Beast),
        et('The Great Concourse', POZ_Concourse, 12.5, przy_poz=POZ_Concourse),
        et('Concordance', POZ_Concordance, 12.5, przy_poz=POZ_Concordance, ital=True),
        et('Whitestone', POZ_Whitestone, 11.5, przy_poz=POZ_Whitestone),
        et('Plaza East', POZ_PlazaE, 11.5, przy_poz=POZ_PlazaE, ital=True),
        # P2
        et('New Prahv', POZ_Prahv, 14.5, przy_poz=POZ_Prahv),
        et('Statue of Agrus Kos', POZ_StatuaKos, 11.5, przy_poz=POZ_StatuaKos, ital=True),
        et('Augustin Station', POZ_Augustin, 12, przy_poz=POZ_Augustin),
        et('Forum of Azor', POZ_Forum, 12.5, przy_poz=POZ_Forum),
        et('Griffin Heights', (1208, 815), 12.5, ital=True),
        # P1
        et('Tenth District Plaza', POZ_Plaza, 13.5, przy_poz=POZ_Plaza),
        et('Orzhova', POZ_Orzhova, 13, przy_poz=POZ_Orzhova, ital=True),
        et('Vizkopa Bank', POZ_Vizkopa, 11.5, przy_poz=POZ_Vizkopa),
        et('Chamber of the Guildpact', POZ_Chamber, 13.5, przy_poz=POZ_Chamber),
        et('Plaza West', POZ_PlazaW, 11.5, przy_poz=POZ_PlazaW, ital=True),
        et('Plaza South', POZ_PlazaS, 11.5, przy_poz=POZ_PlazaS, ital=True),
        # P5
        et('Zonot Seven', (382, 545), 14, ital=True),
        et('Zameck', POZ_Zameck, 11, przy_poz=POZ_Zameck, ital=True),
        et('Blistercoils', POZ_Blister, 12, przy_poz=POZ_Blister),
        et('Ismeri Library', POZ_Ismeri, 12.5, przy_poz=POZ_Ismeri),
        et('Prism University', POZ_Prism, 12.5, przy_poz=POZ_Prism),
        et('Hightower', POZ_Hightower, 12, przy_poz=POZ_Hightower),
        # P6
        et('Smelting Quarter', POZ_Smelting, 12.5, przy_poz=POZ_Smelting),
        et('Foundry Street', (535, 618), 11.5, ital=True),
        et('Gore House', POZ_Gore, 11.5, przy_poz=POZ_Gore, ital=True),
        et('Kamen Fortress', POZ_Kamen, 12.5, przy_poz=POZ_Kamen),
        et('Medori Park', POZ_Medori, 11.5, przy_poz=POZ_Medori, ital=True),
        et('Deadbridge Chasm', (598, 930), 12.5, ital=True),
        et("Benzer's Bridge", POZ_Bridge, 11.5, przy_poz=POZ_Bridge),
        et('Wayport', POZ_Wayport, 11.5, przy_poz=POZ_Wayport),
        # podziemia
        et('Rix Maadi', POZ_Rix, 11.5, przy_poz=POZ_Rix, ital=True),
        et('Korozda & Svogthos', POZ_Svogthos, 11.5, przy_poz=POZ_Svogthos, ital=True),
        et('Nightveil & Duskmantle', POZ_Duskmantle, 11.5, przy_poz=POZ_Duskmantle, ital=True),
        # oświata dzielnicy
        et('(Miasto trwa dalej w każdym kierunku — Ravnica jest planem-miastem)',
           (800, 1046), 13, ital=True, duze=True),
        et('(podziemia — warstwa przekrojowa, pozycje z mapy GGR)',
           (760, 1022), 11, ital=True, duze=True),
    ],
    'etykietyLukowe': [
        {'id': 'luk-tin-street',
         'punkty': [[475, 340], [493, 400], [508, 468], [498, 516],
                    [436, 562], [393, 601]],
         'tekst': 'Tin Street', 'opcje': {'fs': 12.5, 'ital': True}},
        {'id': 'luk-promenade',
         'punkty': [[1015, 210], [995, 300], [975, 390], [958, 470],
                    [948, 530]],
         'tekst': 'Transguild Promenade', 'opcje': {'fs': 12.5, 'ital': True}},
        {'id': 'luk-plaza-avenue',
         'punkty': [[855, 665], [885, 720], [918, 775]],
         'tekst': 'Plaza Avenue', 'opcje': {'fs': 11.5, 'ital': True}},
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
      f'{len(scena["biomy"])} biomów, {len(sprawdzenia)} punktów zweryfikowanych)')
