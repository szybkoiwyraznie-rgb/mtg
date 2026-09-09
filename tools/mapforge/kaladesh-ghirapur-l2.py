#!/usr/bin/env python3
"""Kaladesh T4 — GHIRAPUR (nakładka L2, detal miasta i okolic).

Scena w ramce LOKALNEJ 1400×740, podgrywana na planie w bbox
[9730,6380,11130,7120] od progu zoomu (map.json: wariant z `bbox`+`prog`,
ADR 0039). C(p) = stare współrzędne miejskie (2000×1400) − (520,380).

REPROJEKT MIASTA (korekta właściciela 2026-09-09 — druga iteracja):
dzielnice KAFLIKUJĄ obszar murów (wspólne krawędzie, zero nachodzeń);
rzeki granicami tam, gdzie to naturalne (Vinday: Freejam|Greenwheel);
mury idą POZA obrysem kaflików (odsadzenie ~20), z przerwami wyłącznie
na bramy i przepusty rzeczne; Przykrycie (las łęgowy) to osobny kaflik
parku, a tkaniny omijają go z konstrukcji; Aleja Olbrzymów WRÓCIŁA
u bram (kanon: „nad Vindayem”) — współistnieje z murami z prześwitem,
nie przez kasowanie.

Szwy z planem: rzeki/trakty/pasmo wchodzą na krawędzie płyty w TYCH
SAMYCH współrzędnych złotych co w scenie planu (stałe szerokości =
szerokość planu w punkcie cięcia) — dorysowanie bez uskoków.
Tło płyty = kolor lądu (bez morza; ramki brak — nakładka stapia się
z planem). Etykiety wtopione (raster L2 jak T1 Dominarii: własne
napisy; wyjątki: „Ghirapur” i „Giants' Walk” daje overlay planu,
tu ich nie dublujemy).

Determinizm: PRNG z hasha id (mapforge). Renderować przez
    node tools/mapforge/cli.mjs maps/kaladesh/ghirapur-scena.json \\
        -o maps/kaladesh/ghirapur.svg
"""
import json
import math
from pathlib import Path

OUT = (Path(__file__).resolve().parent.parent.parent / 'maps' / 'kaladesh'
       / 'ghirapur-scena.json')

SZER, WYS = 1400, 740
OX, OY = 520, 380  # ramka lokalna = stare miasto − (520,380)


def C(p):
    return [p[0] - OX, p[1] - OY]


def CL(lamana):
    return [C(p) for p in lamana]


def dlugosc(lamana):
    return sum(math.hypot(b[0] - a[0], b[1] - a[1])
               for a, b in zip(lamana, lamana[1:]))


def punkt_na(lamana, frac):
    cel = dlugosc(lamana) * frac
    przebyto = 0.0
    for a, b in zip(lamana, lamana[1:]):
        odc = math.hypot(b[0] - a[0], b[1] - a[1])
        if przebyto + odc >= cel:
            t = (cel - przebyto) / odc if odc else 0
            x = a[0] + (b[0] - a[0]) * t
            y = a[1] + (b[1] - a[1]) * t
            kat = math.degrees(math.atan2(b[1] - a[1], b[0] - a[0]))
            return [round(x, 1), round(y, 1)], round(kat, 1)
    (x, y), kat = lamana[-1], 0.0
    return [x, y], kat


def elipsa(cx, cy, rx, ry, n=14):
    return [[round(cx + rx * math.cos(2 * math.pi * i / n), 1),
             round(cy + ry * math.sin(2 * math.pi * i / n), 1)]
            for i in range(n)]


# ── Rzeki (te same osie co plan; stałe szerokości z punktów cięcia) ──
# Punkty szwu (krawędź płyty) = przecięcia WYGŁADZONYCH osi planu
# z bbox (nie zaokrąglone kontrolne — chaikin gnie łamaną o ~0,5 j.).
VINDAY = [[0, 307.7], [270, 340], [530, 365], [680, 395], [770, 420]]
SURAMAL = [[611.6, 0], [700, 270], [740, 360], [770, 420]]
VASAVATI = [[770, 420], [795, 500], [830, 580], [843.9, 740]]
MAPANI = [[119.6, 0], [95, 162], [70, 325]]
DUKHARA = CL([[1205, 776], [1250, 786], [1290, 792], [1310, 830], [1320, 880]])

MOSTY = []
for i in range(11):
    (x, y), kat = punkt_na(DUKHARA, 0.06 + 0.88 * i / 10)
    MOSTY.append({'x': x, 'y': y, 'kat': round(kat + 90, 1)})

scena = {
    'nazwa': 'kaladesh-ghirapur-l2',
    'nakladka': 'ghirapur',
    'szerokosc': SZER,
    'wysokosc': WYS,
    'styl': 'atlas',
    'opis': ('Kaladesh T4 — GHIRAPUR (L2, ADR 0039): miasto i okolice '
             '(Aleja Olbrzymów, Ovalchase, przedmieścia) w ramce lokalnej; '
             'bbox planu [9730,6380,11130,7120]. Kaflikowanie dzielnic, '
             'mury poza obrysem, las łęgowy Przykrycia.'),
    # Płyta lądowa (zlewa się z planem; morza w tej ramce nie ma).
    'ocean': {'kolor': '#f7f7f7'},
    'lądy': [{'id': 'ghirapur-plyta',
              'punkty': [[-500, -500], [1900, -500], [1900, 1240], [-500, 1240]]}],
    'rzeki': [
        # Bez stożka (cięcie płytą, nie źródło/ujście). Szerokości DOKŁADNIE
        # jak na planie: w cięciu = stożkowa szerokość planu w punkcie szwu
        # (wstega po chaikinie; pilnuje test szwu w test/lod.test.js),
        # w zlewisku = czubek planu 0,12·s (rzeki planu kończą/zaczynają
        # się w zlewni — L2 linearyzuje ich profil między cięciem a czubkiem).
        {'id': 'vinday', 'punkty': VINDAY,
         'opcje': {'s0': 6.05, 's1': 0.96, 'taper': False, 'zrodlo': False}},
        {'id': 'suramal', 'punkty': SURAMAL,
         'opcje': {'s0': 4.54, 's1': 0.72, 'taper': False, 'zrodlo': False}},
        {'id': 'vasavati', 'punkty': VASAVATI,
         'opcje': {'s0': 0.84, 's1': 8.04, 'taper': False, 'zrodlo': False}},
        {'id': 'mapani', 'punkty': MAPANI,
         'opcje': {'s0': 1.93, 's1': 0.48, 'taper': False, 'zrodlo': False}},
        {'id': 'dukhara', 'punkty': DUKHARA,
         'opcje': {'s0': 2.5, 's1': 4, 'zrodlo': False}},
    ],
    'pasma': [
        # U bram, znad Vindaya: prześwit od murów (≥25), rzeki (≥80)
        # i traktu — współistnienie, nie kasowanie.
        {'id': 'aleja-olbrzymow',
         'punkty': CL([[650, 560], [820, 600], [1000, 660]]),
         'opcje': {'szer': 44}},
    ],
    'biomy': [
        # Las łęgowy = kaflik parku (tkaniny omijają go z konstrukcji).
        {'id': 'przykrycie', 'typ': 'las',
         'punkty': CL([[1150, 786], [1210, 786], [1210, 794], [1245, 794],
                       [1245, 838], [1150, 838]]),
         'opcje': {'gestosc': 0.5, 'skala': 0.65}},
        {'id': 'shaila-pastwisko', 'typ': 'step',
         'punkty': CL([[950, 950], [1100, 950], [1120, 1010], [980, 1030]]),
         'opcje': {'gestosc': 0.8}},
        # Tkaniny wewnątrz kaflików, z dala od rzek/kanału/parku.
        {'id': 'tkanina-kujar', 'typ': 'tkanina',
         'punkty': CL([[1266, 610], [1362, 610], [1362, 710], [1266, 710]]),
         'opcje': {'gestosc': 0.9}},
        {'id': 'tkanina-freejam', 'typ': 'tkanina',
         'punkty': CL([[1092, 648], [1200, 648], [1200, 736], [1092, 736]]),
         'opcje': {'gestosc': 0.9}},
        {'id': 'tkanina-greenwheel', 'typ': 'tkanina',
         'punkty': CL([[1092, 772], [1142, 772], [1142, 942], [1098, 912]]),
         'opcje': {'gestosc': 0.7}},
        {'id': 'tkanina-eleven-pln', 'typ': 'tkanina',
         'punkty': CL([[1266, 726], [1362, 726], [1362, 772], [1266, 772]]),
         'opcje': {'gestosc': 1.0}},
        {'id': 'tkanina-eleven-wsch-1', 'typ': 'tkanina',
         'punkty': CL([[1300, 772], [1360, 772], [1360, 795], [1300, 795]]),
         'opcje': {'gestosc': 1.0}},
        {'id': 'tkanina-eleven-wsch-2', 'typ': 'tkanina',
         'punkty': CL([[1324, 800], [1360, 800], [1360, 860], [1324, 860]]),
         'opcje': {'gestosc': 1.0}},
        {'id': 'tkanina-bomat', 'typ': 'tkanina',
         'punkty': CL([[1222, 888], [1306, 888], [1306, 1002], [1222, 1002]]),
         'opcje': {'gestosc': 1.0}},
        {'id': 'tkanina-embraal', 'typ': 'tkanina',
         'punkty': CL([[1382, 730], [1458, 770], [1488, 850], [1448, 938],
                       [1408, 982], [1388, 956], [1358, 884], [1382, 806]]),
         'opcje': {'gestosc': 1.1}},
        {'id': 'tkanina-przedmiescie-wsch', 'typ': 'tkanina',
         'punkty': CL([[1560, 700], [1700, 700], [1700, 900], [1560, 900]]),
         'opcje': {'gestosc': 0.3}},
        {'id': 'tkanina-przedmiescie-zach', 'typ': 'tkanina',
         'punkty': CL([[800, 780], [1030, 795], [1030, 830], [800, 815]]),
         'opcje': {'gestosc': 0.3}},
        {'id': 'tkanina-przedmiescie-pln', 'typ': 'tkanina',
         'punkty': CL([[1000, 450], [1140, 450], [1120, 570], [1020, 570]]),
         'opcje': {'gestosc': 0.3}},
    ],
    'dzielnice': [
        {'id': 'kujar',
         'punkty': CL([[1195, 600], [1370, 600], [1370, 718], [1208, 718],
                       [1208, 640], [1195, 640]]),
         'opcje': {'ton': 2}},
        {'id': 'freejam',
         'punkty': CL([[1085, 640], [1208, 640], [1208, 718], [1245, 718],
                       [1245, 770], [1085, 744]]),
         'opcje': {'ton': 6}},
        {'id': 'greenwheel',
         'punkty': CL([[1085, 758], [1150, 758], [1150, 838], [1208, 838],
                       [1208, 880], [1150, 880], [1150, 950], [1110, 950],
                       [1085, 900]]),
         'opcje': {'ton': 3}},
        {'id': 'przykrycie-park',
         'punkty': CL([[1150, 786], [1210, 786], [1210, 794], [1245, 794],
                       [1245, 838], [1150, 838]]),
         'opcje': {'ton': 5}},
        {'id': 'jedenascie-mostow',
         'punkty': CL([[1245, 718], [1370, 718], [1375, 800], [1345, 880],
                       [1208, 880], [1208, 838], [1245, 838], [1245, 790]]),
         'opcje': {'ton': 8}},
        {'id': 'bomat',
         'punkty': CL([[1150, 880], [1345, 880], [1380, 960], [1360, 1010],
                       [1150, 1010]]),
         'opcje': {'ton': 4}},
        {'id': 'embraal',
         'punkty': CL([[1370, 718], [1465, 762], [1495, 850], [1455, 945],
                       [1410, 995], [1380, 960], [1345, 880], [1375, 800]]),
         'opcje': {'ton': 12}},
    ],
    # Pierścień murów poza kaflikami (~20); przerwy: 3 bramy + 3 rzeki.
    'mury': [
        {'id': 'mur-pn-1a', 'punkty': CL([[1065, 620], [1112, 620]])},
        {'id': 'mur-pn-1b', 'punkty': CL([[1132, 620], [1185, 620]])},
        # Narożnik NW Kujaru: pion w dół x=1185, potem przerwa na Suramal
        # (rzeka wchodzi północną krawędzią kaflika na x≈1200–1208).
        {'id': 'mur-pn-naroznik', 'punkty': CL([[1185, 620], [1185, 580]])},
        {'id': 'mur-pn-2', 'punkty': CL([[1208, 580], [1390, 580]])},
        {'id': 'mur-pn-wsch', 'punkty': CL([[1390, 580], [1505, 740]])},
        {'id': 'mur-wsch-1', 'punkty': CL([[1505, 740], [1515, 790]])},
        {'id': 'mur-wsch-2', 'punkty': CL([[1515, 812], [1488, 958]])},
        {'id': 'mur-pld-wsch',
         'punkty': CL([[1488, 958], [1452, 1014], [1368, 1028]])},
        {'id': 'mur-pld-2', 'punkty': CL([[1345, 1028], [1262, 1030]])},
        {'id': 'mur-pld-3', 'punkty': CL([[1238, 1030], [1130, 1028]])},
        {'id': 'mur-pld-zach',
         'punkty': CL([[1130, 1028], [1092, 968], [1065, 906]])},
        {'id': 'mur-zach-1', 'punkty': CL([[1065, 906], [1065, 760]])},
        {'id': 'mur-zach-2', 'punkty': CL([[1065, 738], [1065, 620]])},
    ],
    'drogi': [
        {'id': 'trakt-lathnu', 'typ': 'droga',
         'punkty': [[602, 240], [542, 0]]},
        {'id': 'trakt-poludniowy', 'typ': 'droga',
         'punkty': [[730, 650], [742, 740]]},
        {'id': 'trakt-vahd', 'typ': 'droga',
         'punkty': [[995, 420], [1400, 246]]},
        {'id': 'sciezka-holownicza', 'typ': 'szlak',
         'punkty': CL([[1060, 805], [950, 795], [800, 775]])},
        {'id': 'tor-ovalchase', 'typ': 'droga',
         'punkty': CL(elipsa(1680, 830, 100, 60)
                       + [elipsa(1680, 830, 100, 60)[0]])},
    ],
    'poi': [
        {'typ': 'iglica', 'id': 'iglica-eteru', 'x': 780, 'y': 362,
         'opcje': {'skala': 1.8}},
        # Aetherflux Reservoir (wiki: Ghirapur — największy zbiornik
        # rafinowanego eteru, „zawieszony nad panoramą”). Kanon nie podaje
        # współrzędnych — pozycja = wybór rekonstrukcji (nad Kujarem,
        # na NW od Iglicy Eteru, przy sercu dystrybucji eteru).
        {'typ': 'zbiornik', 'id': 'aetherflux-reservoir', 'x': 700, 'y': 255,
         'opcje': {'skala': 1.6}},
        {'typ': 'kopula', 'id': 'stacja-aradara', 'x': 835, 'y': 455,
         'opcje': {'skala': 1.3}},
        {'typ': 'fort', 'id': 'bastion', 'x': 720, 'y': 465,
         'opcje': {'skala': 0.8}},
        {'typ': 'plac', 'id': 'akhara', 'x': 810, 'y': 395,
         'opcje': {'skala': 1.1}},
        {'typ': 'kopula', 'id': 'wezel-eterowy', 'x': 840, 'y': 310,
         'opcje': {'skala': 1.0}},
        {'typ': 'ruina', 'id': 'kuznia-konsulow', 'x': 900, 'y': 520,
         'opcje': {'skala': 0.9}},
        {'typ': 'plac', 'id': 'bomat-targ', 'x': 770, 'y': 570,
         'opcje': {'skala': 1.0}},
        # Kopuły i Zoo przesunięte na zachód (kaflik Greenwheel).
        {'typ': 'kopula', 'id': 'greenwheel-kopula-1', 'x': 600, 'y': 478,
         'opcje': {'skala': 0.9}},
        {'typ': 'kopula', 'id': 'greenwheel-kopula-2', 'x': 610, 'y': 512,
         'opcje': {'skala': 0.7}},
        {'typ': 'drzewo', 'id': 'greenwheel-drzewo', 'x': 625, 'y': 515,
         'opcje': {'skala': 1.5}},
        {'typ': 'platforma', 'id': 'freejam-pomost', 'x': 620, 'y': 300,
         'opcje': {'skala': 1.0}},
        {'typ': 'ruina', 'id': 'bunarat', 'x': 530, 'y': 630,
         'opcje': {'skala': 0.8}},
    ] + [
        {'typ': 'most', 'x': m['x'], 'y': m['y'], 'id': f'most-{i + 1}',
         'opcje': {'skala': 0.7, 'kat': m['kat']}}
        for i, m in enumerate(MOSTY)
    ],
    'etykiety': [
        {'tekst': 'Eleven Bridges', 'x': 825, 'y': 375,
         'opcje': {'fs': 12}},
        {'tekst': 'Aetherflux Reservoir', 'x': 700, 'y': 255,
         'opcje': {'fs': 10, 'przyDo': [700, 255]}},
        {'tekst': 'Bomat', 'x': 770, 'y': 570,
         'opcje': {'fs': 12, 'przyDo': [770, 570]}},
        {'tekst': 'Embraal', 'x': 925, 'y': 480, 'opcje': {'fs': 12}},
        {'tekst': 'Kujar', 'x': 790, 'y': 270, 'opcje': {'fs': 12}},
        {'tekst': 'Freejam', 'x': 620, 'y': 300,
         'opcje': {'fs': 11, 'przyDo': [620, 300]}},
        {'tekst': 'Greenwheel', 'x': 595, 'y': 440, 'opcje': {'fs': 11}},
        {'tekst': 'Weldfast', 'x': 880, 'y': 285, 'opcje': {'fs': 11}},
        {'tekst': 'Aether Spire', 'x': 780, 'y': 362,
         'opcje': {'fs': 12, 'przyDo': [780, 362]}},
        {'tekst': 'Aradara Station', 'x': 835, 'y': 455,
         'opcje': {'fs': 10, 'przyDo': [835, 455]}},
        {'tekst': 'Bastion', 'x': 720, 'y': 465,
         'opcje': {'fs': 10, 'przyDo': [720, 465]}},
        {'tekst': 'Akhara', 'x': 810, 'y': 395,
         'opcje': {'fs': 10, 'przyDo': [810, 395]}},
        {'tekst': 'Aether Hub', 'x': 840, 'y': 310,
         'opcje': {'fs': 10, 'przyDo': [840, 310]}},
        {'tekst': 'Foundry of the Consuls', 'x': 900, 'y': 520,
         'opcje': {'fs': 10, 'przyDo': [900, 520]}},
        {'tekst': 'First Bridge', 'x': MOSTY[10]['x'], 'y': MOSTY[10]['y'],
         'opcje': {'fs': 10, 'przyDo': [MOSTY[10]['x'], MOSTY[10]['y']]}},
        {'tekst': 'Ninth Bridge', 'x': MOSTY[2]['x'], 'y': MOSTY[2]['y'],
         'opcje': {'fs': 10, 'przyDo': [MOSTY[2]['x'], MOSTY[2]['y']]}},
        {'tekst': 'The Cowl', 'x': 665, 'y': 434, 'opcje': {'fs': 11}},
        {'tekst': 'Dukhara Canal', 'x': 800, 'y': 435,
         'opcje': {'fs': 10, 'ital': True}},
        {'tekst': 'Greenwheel Domes', 'x': 600, 'y': 478,
         'opcje': {'fs': 10, 'przyDo': [600, 478]}},
        {'tekst': 'The Zoo', 'x': 625, 'y': 515,
         'opcje': {'fs': 10, 'przyDo': [625, 515]}},
        {'tekst': 'Bunarat', 'x': 530, 'y': 630,
         'opcje': {'fs': 11, 'przyDo': [530, 630]}},
        {'tekst': "Shaila's Claim", 'x': 515, 'y': 610,
         'opcje': {'fs': 11}},
        {'tekst': 'Ovalchase', 'x': 1160, 'y': 452, 'opcje': {'fs': 13}},
    ],
    'etykietyLukowe': [],
    'skala': False,
    # Bez ramki: nakładka stapia się z planem (szew tylko treścią).
    'ramka': False,
}

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(scena, ensure_ascii=False, indent=1), encoding='utf-8')
print(f'OK — {OUT} ({len(scena["poi"])} POI, {len(scena["etykiety"])} etykiet, '
      f'{len(MOSTY)} mostów na kanale)')
